/**
 * Hero frame sequence preloader + canvas scrubber.
 *
 *   const { progress, ready, attach } = useFrameSequence({
 *     count: 90,
 *     desktopBase: '/hero/desktop/frame-',
 *     mobileBase:  '/hero/mobile/frame-',
 *     ext: 'webp',           // fallback chain → 'webp' then 'svg'
 *   })
 *
 * Preloads all frames before flipping `ready=true`. Component should
 * gate scroll-scrub on `ready`.
 *
 * Scrubbing uses requestAnimationFrame; scroll progress is lerp'd
 * (smoothing 0.1) so frame draws never jitter on fast scroll.
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'

interface Options {
  count: number
  desktopBase: string
  mobileBase: string
  ext?: string             // primary extension (default 'webp')
  fallbackExt?: string     // fallback if primary 404s (default 'svg')
  smoothing?: number       // lerp factor (default 0.12)
}

export function useFrameSequence(opts: Options) {
  const count = opts.count
  const ext = opts.ext ?? 'webp'
  const fallbackExt = opts.fallbackExt ?? 'svg'
  const smoothing = opts.smoothing ?? 0.12

  const ready = ref(false)
  const progress = ref(0)              // 0..1 raw scroll progress
  const lerped = ref(0)                // 0..1 smoothed
  const preload = ref(0)               // 0..1 preload progress
  // Per-frame horizontal subject center (0..1 of image width). The lit
  // person moves through the room across the 169 frames, so each frame
  // gets its own value. Computed once after preload via a luminance
  // centroid (the subject is brightly lit against a dark room). Empty
  // until analysis finishes → draw() falls back to plain centered cover.
  const focusX = ref<number[]>([])
  // Average relative luminance (0..1) of the region the text overlay sits
  // over. Sampled after each frame draw; used to flip ink↔ivory on text
  // and nav so contrast holds across cinematic frames.
  const luminance = ref(1)

  let frames: HTMLImageElement[] = []
  let canvas: HTMLCanvasElement | null = null
  let ctx: CanvasRenderingContext2D | null = null
  let rafId: number | null = null
  let resizeObs: ResizeObserver | null = null
  let lastSampledIdx = -1
  let dpr = 1                              // device pixel ratio (set in attach)

  function pad(i: number) { return String(i).padStart(4, '0') }

  function frameUrl(base: string, i: number, useFallback = false) {
    return `${base}${pad(i)}.${useFallback ? fallbackExt : ext}`
  }

  function loadOne(src: string, fallback?: string): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
      const img = new Image()
      img.decoding = 'async'
      img.onload = () => resolve(img)
      img.onerror = () => {
        if (fallback) {
          const f = new Image()
          f.onload = () => resolve(f)
          f.onerror = () => resolve(img)
          f.src = fallback
        } else {
          resolve(img)
        }
      }
      img.src = src
    })
  }

  async function preloadFrames() {
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches
    const base = isDesktop ? opts.desktopBase : opts.mobileBase
    let loaded = 0
    frames = new Array(count)
    const promises: Promise<void>[] = []
    for (let i = 1; i <= count; i++) {
      promises.push(
        loadOne(frameUrl(base, i), frameUrl(base, i, true)).then((img) => {
          frames[i - 1] = img
          loaded++
          preload.value = loaded / count
        }),
      )
    }
    await Promise.all(promises)
    ready.value = true
    // Subject tracking is non-blocking — kick it off after frames are
    // ready so the canvas starts scrubbing immediately (centered cover
    // until per-frame offsets land).
    analyzeSubjects()
  }

  /**
   * Compute the horizontal subject center (0..1) for every frame and store
   * it in focusX. Each frame is drawn into a small offscreen canvas and a
   * luminance-weighted centroid is taken over the columns: the subject is
   * brightly lit against a dark room, so the lit mass pulls the centroid
   * onto the person. Runs once, downscaled (~160px wide) so all 169 frames
   * process in a few ms total.
   */
  function analyzeSubjects() {
    const aw = 160
    const a = document.createElement('canvas')
    const actx = a.getContext('2d', { alpha: false })
    if (!actx) return
    const out = new Array(count).fill(0.5)
    for (let i = 0; i < count; i++) {
      const img = frames[i]
      if (!img || !img.naturalWidth) { out[i] = 0.5; continue }
      const ah = Math.max(1, Math.round((aw * img.naturalHeight) / img.naturalWidth))
      a.width = aw
      a.height = ah
      actx.drawImage(img, 0, 0, aw, ah)
      let data: Uint8ClampedArray
      try {
        data = actx.getImageData(0, 0, aw, ah).data
      } catch {
        out[i] = 0.5
        continue
      }
      // Pass 1 — column luminance sums + global mean.
      const col = new Float64Array(aw)
      let mean = 0
      for (let p = 0, x = 0; p < data.length; p += 4) {
        const lum = (data[p] * 0.2126 + data[p + 1] * 0.7152 + data[p + 2] * 0.0722) / 255
        col[x] += lum
        mean += lum
        x = x + 1 === aw ? 0 : x + 1
      }
      mean /= (aw * ah)
      // Pass 2 — centroid over columns, weighting only above-mean (lit)
      // energy so the dark background contributes ~nothing.
      const thresh = mean * ah
      let num = 0
      let den = 0
      for (let x = 0; x < aw; x++) {
        const w = col[x] - thresh
        if (w > 0) { num += w * x; den += w }
      }
      out[i] = den > 0 ? num / (den * (aw - 1)) : 0.5
    }
    focusX.value = out
  }

  function draw() {
    if (!canvas || !ctx) return
    const idx = Math.min(count - 1, Math.max(0, Math.round(lerped.value * (count - 1))))
    const img = frames[idx]
    if (!img || !img.complete) return
    const w = canvas.width
    const h = canvas.height
    ctx.clearRect(0, 0, w, h)

    // object-fit: cover behaviour
    const ir = img.naturalWidth / img.naturalHeight
    const cr = w / h
    let dw = w, dh = h, dx = 0, dy = 0
    if (ir > cr) {
      dh = h; dw = h * ir; dx = (w - dw) / 2
      // Mobile (portrait canvas): the landscape frame is cropped on the
      // sides, so plain centering can push the off-center subject out of
      // frame. Frames 1..34 hold frame 1's framing; from frame 35 the crop
      // glides (smoothstep) to a fixed final framing. Clamped to crop
      // bounds so no empty edges appear.
      if (cr < 1 && focusX.value.length) {
        // Base framing = frame 1's tracked subject centered.
        const fx0 = focusX.value[0] ?? 0.5
        const dxStart = w / 2 - fx0 * dw
        // Final framing = centered crop nudged left so the closing frame
        // reads correct (centered alone sat 200px too far right).
        const FINAL_SHIFT_LEFT_PX = -200
        const dxFinal = (w - dw) / 2 - FINAL_SHIFT_LEFT_PX * dpr
        // Ramp factor — 0 for frames 1..35, smoothstep to 1 at the last.
        const s = 34            // 0-indexed frame 35
        const last = count - 1
        let e = 0
        if (idx > s && last > s) {
          const t = (idx - s) / (last - s)
          e = t * t * (3 - 2 * t) // smoothstep
        }
        dx = dxStart + (dxFinal - dxStart) * e
        const min = w - dw // dw >= w, so min <= 0
        if (dx > 0) dx = 0
        else if (dx < min) dx = min
      }
    } else {
      dw = w; dh = w / ir; dy = (h - dh) / 2
    }
    ctx.drawImage(img, dx, dy, dw, dh)

    // Sample luminance only when the active frame index changes — keeps
    // getImageData out of the hot path during scrub idle.
    if (idx !== lastSampledIdx) {
      lastSampledIdx = idx
      luminance.value = sampleLuminance(w, h)
    }
  }

  /**
   * Average relative luminance of the bottom-center band of the canvas
   * (where the hero copy sits). Stride-sampled for speed. Returns 0..1.
   * Falls back to the previous value if getImageData throws.
   */
  function sampleLuminance(w: number, h: number): number {
    if (!ctx) return luminance.value
    try {
      // Bottom 55% of the canvas, full width — covers the area the
      // headline / subhead / CTAs span across both desktop and mobile.
      const sx = 0
      const sy = Math.floor(h * 0.45)
      const sw = w
      const sh = h - sy
      if (sw <= 0 || sh <= 0) return luminance.value
      const data = ctx.getImageData(sx, sy, sw, sh).data
      let sumY = 0
      let n = 0
      // Stride: every 16 pixels = every 64 bytes (RGBA)
      for (let i = 0; i < data.length; i += 64) {
        const r = data[i] / 255
        const g = data[i + 1] / 255
        const b = data[i + 2] / 255
        const R = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4)
        const G = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4)
        const B = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4)
        sumY += 0.2126 * R + 0.7152 * G + 0.0722 * B
        n++
      }
      return n ? sumY / n : luminance.value
    } catch {
      // SecurityError on tainted canvas, OOM, etc. Fail open to ink-on-ivory.
      return 1
    }
  }

  function tick() {
    lerped.value += (progress.value - lerped.value) * smoothing
    if (Math.abs(progress.value - lerped.value) < 0.0005) lerped.value = progress.value
    draw()
    rafId = requestAnimationFrame(tick)
  }

  function attach(el: HTMLCanvasElement) {
    canvas = el
    ctx = el.getContext('2d', { alpha: false })
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => {
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      canvas.width = Math.floor(rect.width * dpr)
      canvas.height = Math.floor(rect.height * dpr)
      draw()
    }
    resize()
    resizeObs = new ResizeObserver(resize)
    resizeObs.observe(el)
  }

  function setProgress(p: number) {
    progress.value = Math.min(1, Math.max(0, p))
  }

  onMounted(() => {
    preloadFrames()
    rafId = requestAnimationFrame(tick)
  })

  onBeforeUnmount(() => {
    if (rafId !== null) cancelAnimationFrame(rafId)
    resizeObs?.disconnect()
  })

  return { ready, progress, lerped, preload, luminance, attach, setProgress }
}
