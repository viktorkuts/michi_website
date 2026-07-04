<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const sectionRef = ref<HTMLElement | null>(null)
const reduced = useReducedMotion()
const heroBg = useHeroBackground()

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

// Copy enters once on load (staggered via CSS), NOT on scroll — the
// first viewport must never be empty. Scroll only scrubs the canvas
// frame sequence. Entrance waits for the frames to be ready so the
// text doesn't animate over the loading overlay.
const entered = ref(false)

function clamp01(n: number) {
  return n < 0 ? 0 : n > 1 ? 1 : n
}

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
let stopReadyWatch: (() => void) | null = null

onMounted(() => {
  if (!canvasRef.value) return
  attach(canvasRef.value)

  if (sectionRef.value) {
    inViewObs = new IntersectionObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      heroBg.set(heroBg.state.value.luminance, entry.intersectionRatio > 0.4)
    }, { threshold: [0, 0.4, 0.7, 1] })
    inViewObs.observe(sectionRef.value)
  }

  if (reduced.value) {
    setProgress(0.5)
    entered.value = true
    return
  }

  stopReadyWatch = watch(ready, (r) => {
    if (!r) return
    requestAnimationFrame(() => { entered.value = true })
    stopReadyWatch?.()
  }, { immediate: true })

  let queued = false
  scrollHandler = () => {
    if (queued) return
    queued = true
    rafId = requestAnimationFrame(() => {
      queued = false
      setProgress(computeProgress())
    })
  }
  window.addEventListener('scroll', scrollHandler, { passive: true })
  scrollHandler()
})

onBeforeUnmount(() => {
  if (scrollHandler) window.removeEventListener('scroll', scrollHandler)
  if (rafId !== null) cancelAnimationFrame(rafId)
  inViewObs?.disconnect()
  stopReadyWatch?.()
})
</script>

<template>
  <section
    id="hero"
    ref="sectionRef"
    data-hero-section
    class="section-hero"
    :class="{ 'is-on-dark': onDark, 'is-entered': entered }"
    aria-label="Hero"
  >
    <!-- Pinned canvas viewport — 100dvh tall, sticky inside the tall section -->
    <div class="section-hero__pin">
      <canvas ref="canvasRef" class="section-hero__canvas" aria-hidden="true" />

      <!-- Loading overlay until frames are decoded -->
      <Transition name="hero-load">
        <div v-if="!ready && !reduced" class="section-hero__loading" aria-live="polite">
          <span class="type-caption">MICHI</span>
          <div class="section-hero__bar" :style="{ '--p': `${Math.round(preload * 100)}%` }">
            <div class="section-hero__bar-fill" />
          </div>
          <span class="type-caption">{{ Math.round(preload * 100) }}%</span>
        </div>
      </Transition>

      <!-- Text overlay — headline + subhead bottom-left, CTAs bottom-right -->
      <div class="section-hero__overlay container-shell">
        <div class="section-hero__copy">
          <h1 class="section-hero__headline type-display-xl">
            More life
            <span class="section-hero__headline-em">outside.</span>
          </h1>
          <p class="section-hero__sub type-body-lg">
            Find what's happening near you. Meet people through the
            things you actually do.
          </p>
        </div>

        <div id="hero-cta" class="section-hero__ctas">
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
  /* Section height controls the canvas scrub distance: with a 100dvh
     sticky pin, scroll distance = height − 100vh = 80vh of frames. */
  height: 180vh;
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
  grid-template-rows: 1fr auto auto;
  grid-template-areas:
    '.'
    'copy'
    'ctas';
  gap: var(--space-8);
  padding-block: var(--space-16) var(--space-24);
  align-items: end;
}

@media (min-width: 768px) {
  .section-hero__overlay {
    grid-template-columns: 1.5fr 1fr;
    grid-template-rows: 1fr auto;
    grid-template-areas:
      '.     .'
      'copy  ctas';
    padding-block: var(--space-16) var(--space-16);
  }
}

.section-hero__copy {
  grid-area: copy;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  align-self: end;
  justify-self: start;
  text-align: left;
}

.section-hero__headline {
  margin: 0;
  max-width: 12ch;
  color: var(--ink-primary);
  text-wrap: balance;
  transition: color 320ms var(--ease-out-expo);
}

.section-hero__headline-em {
  display: inline;
  font-style: italic;
  font-weight: 500;
  color: var(--brand-ink);
  letter-spacing: -0.04em;
  transition: color 320ms var(--ease-out-expo);
}

.section-hero__sub {
  margin: 0;
  color: var(--ink-secondary);
  max-width: 30rem;
  transition: color 320ms var(--ease-out-expo);
}

.section-hero__ctas {
  grid-area: ctas;
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  align-self: end;
  justify-self: start;
}

@media (min-width: 768px) {
  .section-hero__ctas {
    justify-self: end;
  }
}

/* Entrance — one staggered rise on load. Scroll never gates the copy. */
.section-hero__headline,
.section-hero__sub,
.section-hero__ctas {
  opacity: 0;
  transform: translateY(20px);
}
.section-hero.is-entered .section-hero__headline,
.section-hero.is-entered .section-hero__sub,
.section-hero.is-entered .section-hero__ctas {
  opacity: 1;
  transform: translateY(0);
  transition:
    opacity var(--dur-section) var(--ease-out-quart),
    transform var(--dur-section) var(--ease-out-quart),
    color 320ms var(--ease-out-expo);
}
.section-hero.is-entered .section-hero__sub {
  transition-delay: 120ms, 120ms, 0ms;
}
.section-hero.is-entered .section-hero__ctas {
  transition-delay: 240ms, 240ms, 0ms;
}

/* ----------------------------------------------------------------
 *  Dark-background state — flips text to ivory; the brand cyan reads
 *  well on dark, so accents move from teal to cyan.
 * ---------------------------------------------------------------- */
.section-hero.is-on-dark .section-hero__headline {
  color: var(--bg-primary);
}
.section-hero.is-on-dark .section-hero__headline-em {
  color: var(--brand);
}
.section-hero.is-on-dark .section-hero__sub {
  color: rgb(247 244 238 / 0.78);
}
.section-hero.is-on-dark :deep(.ui-button--ghost) {
  color: var(--bg-primary);
}
.section-hero.is-on-dark :deep(.ui-button--ghost:hover) {
  background: rgb(247 244 238 / 0.08);
}

@media (prefers-reduced-motion: reduce) {
  .section-hero__headline,
  .section-hero__sub,
  .section-hero__ctas {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
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
  background: var(--brand-ink);
  transition: width 200ms var(--ease-out-expo);
}
.hero-load-leave-active {
  transition: opacity 400ms ease;
}
.hero-load-leave-to {
  opacity: 0;
}
</style>
