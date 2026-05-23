<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue'

interface Feature {
  number: string
  eyebrow: string
  headline: string
  body: string
}
/*
const features: Feature[] = [
  {
    number: '01',
    eyebrow: 'OPEN',
    headline: 'See who\'s doing what, within walking distance.',
    body: 'No feed. No algorithm. A list. A time. A place. The app fills up after 5pm and empties out around midnight.',
  },
  {
    number: '02',
    eyebrow: 'POST',
    headline: 'Drop a plan in under ten seconds.',
    body: 'Pick the spot. Set the hour. Three words for what it is. Anyone close by who wants in, taps in.',
  },
  {
    number: '03',
    eyebrow: 'GO',
    headline: 'The chat lives as long as the plan does.',
    body: 'Threads are scoped to the night. They go quiet when it\'s over. Nothing to mute, nothing to leave.',
  },
  {
    number: '04',
    eyebrow: 'SHOW UP',
    headline: 'Real names. Real faces. Verified numbers.',
    body: 'A few photos. A few things you\'re into. A phone number we actually checked. Profiles, not personas.',
  },
]*/
const features: Feature[] = [
  {
    number: '01',
    eyebrow: 'OPEN',
    headline: 'See what\'s on tonight, within walking distance.',
    body: 'Not a feed — a window. What\'s happening near you in the next few hours, posted by people who actually showed up.',
  },
  {
    number: '02',
    eyebrow: 'POST',
    headline: 'Got something going? Invite the neighborhood.',
    body: 'Name the spot. Pick the time. Say what it is. Anyone close by who feels like joining will see it.',
  },
  {
    number: '03',
    eyebrow: 'GO',
    headline: 'A chat that knows when the night is over.',
    body: 'Every plan gets its own thread. It lives for the evening and disappears when it\'s done. Nothing to manage after.',
  },
  {
    number: '04',
    eyebrow: 'SHOW UP',
    headline: 'You know who you\'re meeting before you go.',
    body: 'Verified phone number. Real name. A few photos. The people on Synq are accountable — and you are too.',
  },
]

const phoneScreens = features.map((f, i) => ({
  eyebrow: `${f.number} — ${f.eyebrow}`,
  headline: f.headline,
  image: `/features/screen-${i + 1}.png`,
}))

const sectionRef = ref<HTMLElement | null>(null)
const pinRef = ref<HTMLElement | null>(null)

const { activeIndex } = useFeaturesScroll(sectionRef, pinRef, {
  steps: features.length,
  scrub: 0.5,
})

// Track viewport orientation for the dots + phone sizing
const isNarrow = ref(false)
function syncNarrow() {
  if (import.meta.server) return
  isNarrow.value = window.matchMedia('(max-width: 1023px)').matches
}
onMounted(() => {
  syncNarrow()
  window.addEventListener('resize', syncNarrow, { passive: true })
})
onBeforeUnmount(() => {
  if (import.meta.client) window.removeEventListener('resize', syncNarrow)
})

// Phone width derived from viewport height (aspect-ratio is 320/660 ≈ 0.485).
// Caps at 320px on desktop / 240px on mobile so it never overshoots.
// On short laptops the phone scales down to fit; on tall monitors it stays
// at the cap. Ratio: phone-height = 0.78 dvh, so width = 0.78dvh × 0.485.
const phoneWidth = computed(() => {
  return isNarrow.value
    ? 'min(240px, calc(58dvh * 320 / 660))'
    : 'min(320px, calc(78dvh * 320 / 660))'
})

// ----------------------------------------------------------------
//  80ms-gap state machine for the copy column
//
//   On activeIndex change:
//     1. Mark previous index as 'outgoing' immediately (350ms exit).
//     2. After 350ms + 80ms = 430ms, mark new index as 'active' (400ms enter).
//
//   No two blocks ever carry 'active' simultaneously.
// ----------------------------------------------------------------
type Phase = 'idle' | 'active' | 'outgoing'
const phase = ref<Phase[]>(features.map((_, i) => (i === 0 ? 'active' : 'idle')))
let gapTimer: number | null = null

watch(activeIndex, (next, prev) => {
  if (next === prev) return
  if (gapTimer) {
    window.clearTimeout(gapTimer)
    gapTimer = null
  }
  // Phase 1: outgoing exits (350ms via CSS)
  const out = features.map<Phase>((_, i) => (i === prev ? 'outgoing' : 'idle'))
  phase.value = out
  // Phase 2: 350ms exit + 80ms gap = 430ms, then incoming becomes active
  gapTimer = window.setTimeout(() => {
    phase.value = features.map<Phase>((_, i) => (i === next ? 'active' : 'idle'))
    gapTimer = null
  }, 430)
})

onBeforeUnmount(() => {
  if (gapTimer) window.clearTimeout(gapTimer)
})

function phaseClass(i: number) {
  const p = phase.value[i]
  return {
    'is-active': p === 'active',
    'is-outgoing': p === 'outgoing',
  }
}
</script>

<template>
  <!-- Wrapper carries the nav anchor so the IntersectionObserver keeps
       "How it works" active across the entire pinned scroll, not just
       while the small intro header is visible. -->
  <div id="how-it-works" class="how-it-works">
    <!-- Intro band — deliberately tight padding (no UiSectionShell) so the
         title flows directly into the pin instead of floating in its own
         dead-air bubble. Top breathing room separates it from §5; the
         hairline + cue line lead the eye down into the pin. -->
    <header class="how-it-works__intro container-shell">
      <UiSectionEyebrow dot>HOW IT WORKS</UiSectionEyebrow>
      <h2 class="type-display-md how-it-works__h">
        Four things.
        <span class="type-italic" style="color: var(--brand);">No feed.</span>
      </h2>
      <p class="type-body-lg how-it-works__lead">
        From opening the app to walking out the door. Four taps, ten
        seconds each. Then you put the phone away.
      </p>
      <div class="how-it-works__cue" aria-hidden="true">
        <span class="how-it-works__cue-rule"></span>
        <span class="type-caption how-it-works__cue-label">SCROLL TO BEGIN</span>
      </div>
    </header>

    <!-- Skip link — visible only on focus, exits straight to the gallery -->
    <a class="features-skip skip-link" href="#gallery">Skip how-it-works section</a>

    <!-- Pin path — shown on (hover: hover) and (pointer: fine) without reduced-motion -->
    <section
      ref="sectionRef"
      class="features-pin-host"
      aria-label="How it works"
    >
      <div ref="pinRef" class="features-pin">
        <div class="features-pin__inner container-shell">

          <!-- Vertical 5-dot progress (desktop) -->
          <UiFeatureProgress
            v-if="!isNarrow"
            :total="features.length"
            :active="activeIndex"
            orientation="vertical"
            aria-label="Step progress"
            class="features-pin__dots features-pin__dots--vertical"
          />

          <!-- Phone column -->
          <div class="features-pin__phone">
            <UiPhoneFrame
              :screens="phoneScreens"
              :active-index="activeIndex"
              :width="phoneWidth"
              aria-label="Synq app preview"
            />
          </div>

          <!-- Horizontal dots (mobile, below phone) -->
          <UiFeatureProgress
            v-if="isNarrow"
            :total="features.length"
            :active="activeIndex"
            orientation="horizontal"
            class="features-pin__dots features-pin__dots--horizontal"
          />

          <!-- Copy column — 5 stacked blocks, only the active one visible -->
          <div class="features-pin__copy" aria-live="polite">
            <article
              v-for="(f, i) in features"
              :key="i"
              class="feature-block"
              :class="phaseClass(i)"
              :inert="phase[i] !== 'active' || undefined"
              :aria-hidden="phase[i] !== 'active' ? 'true' : undefined"
            >
              <UiSectionEyebrow>{{ f.number }} — {{ f.eyebrow }}</UiSectionEyebrow>
              <h3 class="type-display-sm feature-block__h">{{ f.headline }}</h3>
              <p class="type-body feature-block__b">{{ f.body }}</p>
            </article>
          </div>

        </div>
      </div>
    </section>
  </div>

</template>

<style scoped>
/* ----------------------------------------------------------------
 *  Intro band — replaces UiSectionShell so the title isn't trapped
 *  in 192px of dead air. Top breathing room separates it from §5;
 *  tight bottom padding hands off cleanly to the pin.
 * ---------------------------------------------------------------- */
.how-it-works {
  background: var(--bg-primary);
}

.how-it-works__intro {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding-top: var(--space-24);
  padding-bottom: var(--space-12);
  max-width: 42rem;
  /* container-shell utility (from base.css) handles inline padding +
     centering, but its max-width is too wide here — narrow the intro
     and keep the section-shell's horizontal alignment. */
}

@media (min-width: 1024px) {
  .how-it-works__intro {
    padding-top: var(--space-32);
    padding-bottom: var(--space-16);
    gap: var(--space-4);
  }
}

.how-it-works__h {
  margin: 0;
  text-wrap: balance;
}

.how-it-works__lead {
  margin: 0;
  margin-top: var(--space-2);
  color: var(--ink-secondary);
  max-width: 38rem;
}

.how-it-works__cue {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  margin-top: var(--space-6);
  color: var(--ink-muted);
}
.how-it-works__cue-rule {
  width: 32px;
  height: 1px;
  background: var(--ink-muted);
  display: inline-block;
}
.how-it-works__cue-label {
  letter-spacing: 0.08em;
  color: var(--ink-muted);
}

@media (min-width: 1024px) {
  .how-it-works__cue {
    margin-top: var(--space-8);
  }
  .how-it-works__cue-rule {
    width: 48px;
  }
}

/* ----------------------------------------------------------------
 *  Pin host
 *  Outer container that ScrollTrigger pins. When the pin runs, the
 *  child .features-pin is held in place. pinSpacing: true reserves
 *  500vh of phantom flow so §7 below gets correct natural spacing.
 *  CSS toggles between pin and stack via media queries — JS only
 *  conditionally engages GSAP. SSR markup matches client.
 * ---------------------------------------------------------------- */
.features-pin-host {
  position: relative;
  background: var(--bg-primary);
}

.features-pin {
  position: relative;
  height: 100dvh;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.features-pin__inner {
  position: relative;
  display: grid;
  grid-template-columns: minmax(280px, 38%) 1fr;
  align-items: center;
  gap: var(--space-12);
  width: 100%;
  height: 100%;
  padding-block: var(--space-8);
}

/* ----------------------------------------------------------------
 *  Narrow viewports — the scroll-pin never engages (see
 *  useFeaturesScroll), so the section flows vertically: phone on top,
 *  then all four steps stacked. Without this the 100dvh pin clips the
 *  taller stacked content (phone reads cut off at the top) and only the
 *  first step's copy is ever revealed.
 * ---------------------------------------------------------------- */
@media (max-width: 1023px) {
  .features-pin {
    height: auto;
    display: block;
    overflow: visible;
  }
  .features-pin__inner {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
    align-content: start;
    height: auto;
    padding-block: var(--space-12);
    gap: var(--space-8);
  }
  .feature-block {
    position: relative;
    inset: auto;
    opacity: 1;
    transform: none;
    transition: none;
    pointer-events: auto;
    padding-block: var(--space-6);
  }
  .feature-block + .feature-block {
    border-top: 1px solid var(--rule);
  }
  .features-pin__dots--vertical,
  .features-pin__dots--horizontal {
    display: none;
  }
}

/* Phone column */
.features-pin__phone {
  display: flex;
  align-items: center;
  justify-content: center;
}
@media (max-width: 1023px) {
  .features-pin__phone {
    justify-content: center;
  }
}

/* Vertical dots — sit between left edge and phone */
.features-pin__dots--vertical {
  position: absolute;
  left: var(--space-6);
  top: 50%;
  transform: translateY(-50%);
}

/* Horizontal dots — directly below the phone on mobile */
.features-pin__dots--horizontal {
  grid-row: 2;
  justify-self: center;
}

/* Copy column — 5 absolutely-stacked blocks */
.features-pin__copy {
  position: relative;
  height: 100%;
  min-height: 320px;
}
@media (max-width: 1023px) {
  .features-pin__copy {
    height: auto;
    min-height: 0;
  }
}

.feature-block {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--space-3);
  opacity: 0;
  transform: translateY(16px);
  /* idle state — no transition so blocks reset instantly between phases */
  pointer-events: none;
}
.feature-block.is-active {
  opacity: 1;
  transform: translateY(0);
  transition:
    opacity 400ms var(--ease-out-expo),
    transform 400ms var(--ease-out-expo);
  pointer-events: auto;
}
.feature-block.is-outgoing {
  opacity: 0;
  transform: translateY(-16px);
  transition:
    opacity 350ms var(--ease-out-expo),
    transform 350ms var(--ease-out-expo);
  pointer-events: none;
}

.feature-block__h {
  margin: 0;
  text-wrap: balance;
}
.feature-block__b {
  margin: 0;
  max-width: 36rem;
  color: var(--ink-secondary);
}

/* ----------------------------------------------------------------
 *  Reduced-motion fallback — pin doesn't engage, so let the layout
 *  flow naturally and reveal all five blocks at once.
 * ---------------------------------------------------------------- */
@media (prefers-reduced-motion: reduce) {
  .features-pin {
    height: auto;
  }
  .features-pin__inner {
    grid-template-columns: 1fr;
    gap: var(--space-8);
    padding-block: var(--space-16);
  }
  .features-pin__copy {
    height: auto;
    min-height: 0;
  }
  .feature-block {
    position: relative;
    inset: auto;
    opacity: 1;
    transform: none;
    transition: none;
    pointer-events: auto;
    padding-block: var(--space-8);
  }
  .feature-block + .feature-block {
    border-top: 1px solid var(--rule);
  }
  .features-pin__dots--vertical,
  .features-pin__dots--horizontal {
    display: none;
  }
}

/* ----------------------------------------------------------------
 *  Skip link — inherits .skip-link styles from base.css
 *  (off-screen until focused, then anchors to top-left of viewport)
 * ---------------------------------------------------------------- */
</style>
