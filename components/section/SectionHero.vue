<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const sectionRef = ref<HTMLElement | null>(null)
const reduced = useReducedMotion()
const heroBg = useHeroBackground()

// Live local time stamp — renders as "TUE · MAY 7 · 6:42 PM · BROOKLYN".
// Re-evaluates once a minute so the chip ticks on long sessions.
// Renders as a stable string on the server (date only, no minute) so
// hydration matches; the client picks up minute precision on mount.
function formatStamp(d: Date) {
  const day = ['SUN','MON','TUE','WED','THU','FRI','SAT'][d.getDay()]
  const mon = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'][d.getMonth()]
  let h = d.getHours()
  const ampm = h >= 12 ? 'PM' : 'AM'
  h = h % 12 || 12
  const m = String(d.getMinutes()).padStart(2, '0')
  return `${day} · ${mon} ${d.getDate()} · ${h}:${m} ${ampm}`
}
const stampStatic = formatStamp(new Date())
const stamp = ref(stampStatic)
let stampTimer: number | null = null

// Desktop frames live at /hero/desktop/frame_NNNN.webp (169 frames).
// Mobile frames not yet supplied, so reuse the desktop pattern; the
// canvas drawImage uses object-fit: cover, so portrait viewports crop
// cleanly. Replace mobileBase once real mobile WebP assets land.
const { ready, preload, luminance, attach, setProgress } = useFrameSequence({
  count: 169,
  desktopBase: '/hero/desktop/frame_',
  mobileBase: '/hero/desktop/frame_',
  ext: 'webp',
  fallbackExt: 'svg',
})

// Sync canvas luminance into shared state so the nav can react.
watch(luminance, (l) => {
  heroBg.set(l, heroBg.state.value.overHero)
}, { immediate: true })

const onDark = computed(() => heroBg.onDark.value)

// Local 0..1 scroll progress mirrors what useFrameSequence consumes.
// Used to drive the staggered text reveal — separate refs for headline,
// subhead, and CTAs so they animate on different scroll windows.
const progress = ref(0)

function clamp01(n: number) {
  return n < 0 ? 0 : n > 1 ? 1 : n
}
function ramp(p: number, start: number, end: number) {
  return clamp01((p - start) / (end - start))
}
function easeOutExpo(t: number) {
  return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

const headlineReveal = computed(() =>
  reduced.value ? 1 : easeOutExpo(ramp(progress.value, 0.20, 0.45)),
)
const subReveal = computed(() =>
  reduced.value ? 1 : easeOutExpo(ramp(progress.value, 0.50, 0.72)),
)
const ctaReveal = computed(() =>
  reduced.value ? 1 : easeOutExpo(ramp(progress.value, 0.74, 0.94)),
)

let scrollHandler: (() => void) | null = null
let rafId: number | null = null

function computeProgress() {
  if (!sectionRef.value) return 0
  const rect = sectionRef.value.getBoundingClientRect()
  const total = sectionRef.value.offsetHeight - window.innerHeight
  if (total <= 0) return 0
  const scrolled = -rect.top
  return clamp01(scrolled / total)
}

let inViewObs: IntersectionObserver | null = null

onMounted(() => {
  if (!canvasRef.value) return
  attach(canvasRef.value)

  if (sectionRef.value) {
    inViewObs = new IntersectionObserver(([entry]) => {
      heroBg.set(heroBg.state.value.luminance, entry.intersectionRatio > 0.4)
    }, { threshold: [0, 0.4, 0.7, 1] })
    inViewObs.observe(sectionRef.value)
  }

  // Tick the stamp once a minute so it stays current during long sessions.
  stamp.value = formatStamp(new Date())
  stampTimer = window.setInterval(() => {
    stamp.value = formatStamp(new Date())
  }, 60_000)

  if (reduced.value) {
    setProgress(0.5)
    progress.value = 1
    return
  }

  let queued = false
  scrollHandler = () => {
    if (queued) return
    queued = true
    rafId = requestAnimationFrame(() => {
      queued = false
      const p = computeProgress()
      progress.value = p
      setProgress(p)
    })
  }
  window.addEventListener('scroll', scrollHandler, { passive: true })
  scrollHandler()
})

onBeforeUnmount(() => {
  if (scrollHandler) window.removeEventListener('scroll', scrollHandler)
  if (rafId !== null) cancelAnimationFrame(rafId)
  if (stampTimer !== null) clearInterval(stampTimer)
  inViewObs?.disconnect()
})
</script>

<template>
  <section
    id="hero"
    ref="sectionRef"
    data-hero-section
    class="section-hero"
    :class="{ 'is-on-dark': onDark }"
    aria-label="Hero"
  >
    <!-- Pinned canvas viewport — 100dvh tall, sticky inside the 150vh section -->
    <div class="section-hero__pin">
      <canvas ref="canvasRef" class="section-hero__canvas" aria-hidden="true" />

      <!-- Loading overlay until frames are decoded -->
      <Transition name="hero-load">
        <div v-if="!ready && !reduced" class="section-hero__loading" aria-live="polite">
          <span class="type-caption">SYNQ</span>
          <div class="section-hero__bar" :style="{ '--p': `${Math.round(preload * 100)}%` }">
            <div class="section-hero__bar-fill" />
          </div>
          <span class="type-caption">{{ Math.round(preload * 100) }}%</span>
        </div>
      </Transition>

      <!-- Text overlay — corner-anchored composition.
           Top-left: live timestamp slug.
           Bottom-left: headline + sub.
           Bottom-right: CTAs.
           Each block reveals on its own scroll window. -->
      <div class="section-hero__overlay container-shell">
        <div
          class="section-hero__stamp type-caption"
          :style="{ '--reveal': headlineReveal }"
        >
          <span class="section-hero__stamp-dot" aria-hidden="true" />
          <span class="section-hero__stamp-text">{{ stamp }} · BROOKLYN</span>
        </div>

        <div class="section-hero__copy">
          <h1
            class="section-hero__headline type-display-xl"
            :style="{ '--reveal': headlineReveal }"
          >
            More life
            <span class="section-hero__headline-em">outside.</span>
          </h1>
        
        </div>

        <div
          id="hero-cta"
          class="section-hero__ctas"
          :style="{ '--reveal': ctaReveal }"
        >
          <UiButton variant="primary" href="#">
            Download for iOS
            <template #trail><span aria-hidden="true">↗</span></template>
          </UiButton>
          <UiButton variant="ghost" href="#">Get it on Android</UiButton>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.section-hero {
  position: relative;
  /* Section height controls scroll-to-progress mapping. With a 100dvh
     sticky pin, scroll distance = (height − 100vh). Bumping 150 → 220
     doubles the scroll distance (50vh → 120vh) so the canvas frame
     sequence and text reveals advance more gradually. */
  height: 220vh;
  background: var(--bg-primary);
}

.section-hero__pin {
  position: sticky;
  top: 0;
  height: 100dvh;
  overflow: hidden;
  display: grid;
  place-items: stretch;
}

.section-hero__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
}

.section-hero__overlay {
  position: relative;
  z-index: 2;
  height: 100%;
  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 1fr;
  gap: var(--space-6);
  padding-block: calc(var(--space-16) + var(--space-6)) var(--space-12);
}

@media (min-width: 768px) {
  .section-hero__overlay {
    grid-template-columns: 1.5fr 1fr;
    grid-template-rows: auto 1fr auto;
    grid-template-areas:
      'stamp stamp'
      '.     .'
      'copy  ctas';
    align-items: end;
    padding-block: calc(var(--space-16) + var(--space-6)) var(--space-16);
  }
}

/* Stamp — top-left ribbon. Mono caption with brand dot.
   Sits in its own grid row so it never collides with the headline. */
.section-hero__stamp {
  grid-area: stamp;
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  align-self: start;
  justify-self: start;
  color: var(--ink-muted);
  letter-spacing: 0.10em;
  opacity: var(--reveal, 0);
  transform: translate3d(0, calc((1 - var(--reveal, 0)) * 8px), 0);
  transition: color 320ms var(--ease-out-expo);
}
.section-hero__stamp-dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--brand);
  flex: 0 0 auto;
  /* Subtle pulse — telegraphs "live", not decoration. */
  animation: heroStampPulse 2.4s var(--ease-in-out-3) infinite;
}
@keyframes heroStampPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%      { opacity: 0.55; transform: scale(0.7); }
}

.section-hero__copy {
  grid-area: copy;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  max-width: 18ch;
  align-self: end;
}

@media (min-width: 1024px) {
  .section-hero__copy {
    max-width: 16ch;
  }
}

.section-hero__headline-em {
  display: inline;
  font-style: italic;
  font-weight: 500;
  color: var(--brand);
  letter-spacing: -0.04em;
}

/* Scroll-driven reveals — each block reads its own --reveal value (0..1)
 * driven from the section's scroll progress. No transitions on opacity /
 * transform (the value itself moves with scroll, so transitions would
 * fight the scrub). Color IS transitioned because the dark-bg flip
 * happens at frame-index granularity, not per scroll tick.
 */
.section-hero__headline {
  margin: 0;
  color: var(--ink-primary);
  text-wrap: balance;
  text-wrap: pretty;
  opacity: var(--reveal, 0);
  transform: translate3d(0, calc((1 - var(--reveal, 0)) * 24px), 0);
  will-change: opacity, transform;
  transition: color 320ms var(--ease-out-expo);
}

.section-hero__sub {
  margin: 0;
  color: var(--ink-secondary);
  max-width: 28rem;
  opacity: var(--reveal, 0);
  transform: translate3d(0, calc((1 - var(--reveal, 0)) * 18px), 0);
  will-change: opacity, transform;
  transition: color 320ms var(--ease-out-expo);
}

.section-hero__ctas {
  grid-area: ctas;
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  align-self: end;
  justify-self: start;
  opacity: var(--reveal, 0);
  transform: translate3d(0, calc((1 - var(--reveal, 0)) * 14px), 0);
  will-change: opacity, transform;
}

@media (min-width: 768px) {
  .section-hero__ctas {
    justify-self: end;
  }
}

/* ----------------------------------------------------------------
 *  Dark-background state — flips text to ivory, keeps brand CTA fill
 *  (white-on-brand contrast 4.5:1 holds) and lifts the secondary
 *  ghost button to a translucent ivory chip so it stays distinguishable.
 * ---------------------------------------------------------------- */
.section-hero.is-on-dark .section-hero__headline {
  color: var(--bg-primary);
}
.section-hero.is-on-dark .section-hero__headline-em {
  /* Persimmon stays brand on dark — it's deliberately warm, not neon. */
  color: var(--brand);
}
.section-hero.is-on-dark .section-hero__sub {
  color: rgb(247 244 238 / 0.78);
}
.section-hero.is-on-dark .section-hero__stamp {
  color: rgb(247 244 238 / 0.65);
}
.section-hero.is-on-dark :deep(.ui-button--ghost) {
  color: var(--bg-primary);
}
.section-hero.is-on-dark :deep(.ui-button--ghost:hover) {
  background: rgb(247 244 238 / 0.08);
}
.section-hero.is-on-dark :deep(.ui-button--secondary) {
  background: rgb(247 244 238 / 0.10);
  color: var(--bg-primary);
  border-color: rgb(247 244 238 / 0.35);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
.section-hero.is-on-dark :deep(.ui-button--secondary:hover) {
  border-color: var(--bg-primary);
}

@media (prefers-reduced-motion: reduce) {
  .section-hero__headline,
  .section-hero__sub,
  .section-hero__ctas,
  .section-hero__stamp {
    opacity: 1 !important;
    transform: none !important;
  }
  .section-hero__headline,
  .section-hero__sub {
    transition: none !important;
  }
  .section-hero__stamp-dot {
    animation: none !important;
  }
}

/* Loader */
.section-hero__loading {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  background: var(--bg-primary);
  z-index: 3;
}
.section-hero__bar {
  width: 200px;
  height: 2px;
  background: var(--rule);
  border-radius: 2px;
  overflow: hidden;
  position: relative;
}
.section-hero__bar-fill {
  position: absolute;
  inset: 0;
  width: var(--p, 0%);
  background: var(--brand);
  transition: width 200ms var(--ease-out-expo);
}
.hero-load-leave-active {
  transition: opacity 400ms ease;
}
.hero-load-leave-to {
  opacity: 0;
}
</style>
