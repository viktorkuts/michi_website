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
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
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
