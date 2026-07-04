<script setup lang="ts">
import { ref } from 'vue'

interface Feature {
  number: string
  eyebrow: string
  headline: string
  body: string
}

const features: Feature[] = [
  {
    number: '01',
    eyebrow: 'DISCOVER',
    headline: 'See what\'s on tonight, near you.',
    body: 'Plans nearby, posted by people who\'ll actually be there. Open one and you see the place, the time, the host, and who else is going. Tap join.',
  },
  {
    number: '02',
    eyebrow: 'HOST',
    headline: 'Got something going? Put it up in a minute.',
    body: 'A place, a time, one line about what it is. That\'s the whole form. People nearby can ask to join, and you decide who\'s in.',
  },
  {
    number: '03',
    eyebrow: 'COORDINATE',
    headline: 'Sort the details in the plan\'s own chat.',
    body: 'Who\'s bringing the ball, when to head over. Every event gets its own chat, and it sticks around after: the chat becomes the club, and the next hangout links straight to it.',
  },
  {
    number: '04',
    eyebrow: 'SHOW UP',
    headline: 'Show up and meet them for real.',
    body: 'You knew the plan, they knew the plan, and now you\'re all outside doing the thing. The app stays in your pocket.',
  },
]

const phoneScreens = features.map((_, i) => ({
  image: `/features/screen-${i + 1}.webp`,
}))

// Pinned scroller runs at every width and on touch; vertical scroll is
// the only gesture. Reduced-motion is the single bail-out (CSS then
// stacks all steps).
const sectionRef = ref<HTMLElement | null>(null)
const pinRef = ref<HTMLElement | null>(null)

const { activeIndex } = useFeaturesScroll(sectionRef, pinRef, {
  steps: features.length,
  scrub: 0.5,
})

// Phone width derives from viewport height so the pin always fits:
// desktop gives the phone the full column; mobile leaves room for the
// copy block below it inside the same 100dvh.
const phoneWidthDesktop = 'min(320px, calc(78dvh * 320 / 660))'
const phoneWidthMobile = 'min(190px, calc(40dvh * 320 / 660), 52vw)'
</script>

<template>
  <!-- Wrapper carries the nav anchor so the IntersectionObserver keeps
       "How it works" active across the entire pinned scroll. -->
  <div id="how-it-works" class="how-it-works">
    <header class="how-it-works__intro container-shell">
      <UiSectionEyebrow dot>HOW IT WORKS</UiSectionEyebrow>
      <h2 class="type-display-md how-it-works__h">
        Four steps.
        <span class="type-italic how-it-works__h-em">No feed.</span>
      </h2>
      <p class="type-body-lg how-it-works__lead">
        Everything in the app exists to get you from opening it to
        being somewhere. Here's the whole loop.
      </p>
      <div class="how-it-works__cue" aria-hidden="true">
        <span class="how-it-works__cue-rule"></span>
        <span class="type-caption how-it-works__cue-label">SCROLL TO BEGIN</span>
      </div>
    </header>

    <!-- Skip link — visible only on focus, exits straight to the Gallery -->
    <a class="features-skip skip-link" href="#gallery">Skip how-it-works section</a>

    <section
      ref="sectionRef"
      class="features-pin-host"
      aria-label="How it works"
    >
      <div ref="pinRef" class="features-pin">
        <div class="features-pin__inner container-shell">
          <!-- Vertical dots (desktop only) -->
          <UiFeatureProgress
            :total="features.length"
            :active="activeIndex"
            orientation="vertical"
            aria-label="Step progress"
            class="features-pin__dots features-pin__dots--vertical"
          />

          <div class="features-pin__phone">
            <UiPhoneFrame
              :screens="phoneScreens"
              :active-index="activeIndex"
              :width="phoneWidthDesktop"
              aria-label="Michi app preview"
              class="features-pin__phone-frame features-pin__phone-frame--desktop"
            />
            <UiPhoneFrame
              :screens="phoneScreens"
              :active-index="activeIndex"
              :width="phoneWidthMobile"
              aria-label="Michi app preview"
              class="features-pin__phone-frame features-pin__phone-frame--mobile"
            />
          </div>

          <!-- Copy column — stacked blocks, direct crossfade on the
               active index. No timers: fast scrubbing can never strand
               the column empty. -->
          <div class="features-pin__copy" aria-live="polite">
            <article
              v-for="(f, i) in features"
              :key="i"
              class="feature-block"
              :class="{ 'is-active': i === activeIndex }"
              :inert="i !== activeIndex || undefined"
              :aria-hidden="i !== activeIndex ? 'true' : undefined"
            >
              <UiSectionEyebrow>{{ f.number }} · {{ f.eyebrow }}</UiSectionEyebrow>
              <h3 class="type-display-sm feature-block__h">{{ f.headline }}</h3>
              <p class="type-body feature-block__b">{{ f.body }}</p>
            </article>
          </div>

          <!-- Horizontal dots (mobile only, below the copy) -->
          <UiFeatureProgress
            :total="features.length"
            :active="activeIndex"
            orientation="horizontal"
            aria-label="Step progress"
            class="features-pin__dots features-pin__dots--horizontal"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.how-it-works {
  background: var(--bg-primary);
  position: relative;
  z-index: 1;
}

/* The shared .skip-link hides via translateY(-200%), which only works
   for viewport-fixed elements. This one is absolutely positioned inside
   the section, so clip it until keyboard focus instead. */
.features-skip {
  clip-path: inset(50%);
  white-space: nowrap;
}
.features-skip:focus-visible {
  clip-path: none;
  transform: translateY(0);
}

/* ----------------------------------------------------------------
 *  Intro band — tight bottom padding hands off into the pin.
 * ---------------------------------------------------------------- */
.how-it-works__intro {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding-top: var(--space-12);
  padding-bottom: var(--space-6);
  max-width: 42rem;
  margin-inline: 0 auto;
}

@media (min-width: 1024px) {
  .how-it-works__intro {
    padding-top: var(--space-16);
    padding-bottom: var(--space-8);
    gap: var(--space-4);
  }
}

.how-it-works__h {
  margin: 0;
  text-wrap: balance;
}
.how-it-works__h-em {
  color: var(--brand-ink);
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
 *  Pin — one 100dvh viewport at every width. Desktop: phone left,
 *  copy right. Mobile: phone top, copy below, dots under the copy.
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
  width: 100%;
  height: 100%;
  /* Mobile: phone / copy / dots stacked. The copy row is fixed-height
     so the phone never jumps when text length changes. Bottom padding
     clears the floating tab bar. */
  grid-template-rows: minmax(0, 1fr) auto auto;
  justify-items: center;
  align-items: center;
  row-gap: var(--space-4);
  padding-block: var(--space-6) var(--space-24);
}

@media (min-width: 1024px) {
  .features-pin__inner {
    grid-template-columns: minmax(280px, 38%) 1fr;
    grid-template-rows: 1fr;
    align-items: center;
    justify-items: stretch;
    column-gap: var(--space-12);
    row-gap: 0;
    padding-block: var(--space-8);
  }
}

/* Phone column */
.features-pin__phone {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 0;
}
.features-pin__phone-frame--desktop {
  display: none;
}
.features-pin__phone-frame--mobile {
  display: block;
}
@media (min-width: 1024px) {
  .features-pin__phone-frame--desktop {
    display: block;
  }
  .features-pin__phone-frame--mobile {
    display: none;
  }
}

/* Dots */
.features-pin__dots--vertical {
  display: none;
}
@media (min-width: 1024px) {
  .features-pin__dots--vertical {
    display: flex;
    position: absolute;
    left: var(--space-6);
    top: 50%;
    transform: translateY(-50%);
  }
}
.features-pin__dots--horizontal {
  display: flex;
}
@media (min-width: 1024px) {
  .features-pin__dots--horizontal {
    display: none;
  }
}

/* Copy — stacked blocks crossfade in place */
.features-pin__copy {
  position: relative;
  width: 100%;
  max-width: 26rem;
  height: 12rem;
}
@media (min-width: 1024px) {
  .features-pin__copy {
    max-width: none;
    height: 100%;
    min-height: 320px;
  }
}

.feature-block {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: var(--space-3);
  opacity: 0;
  transform: translateY(12px);
  transition:
    opacity 250ms var(--ease-out-quart),
    transform 250ms var(--ease-out-quart);
  pointer-events: none;
}
@media (min-width: 1024px) {
  .feature-block {
    justify-content: center;
  }
}
.feature-block.is-active {
  opacity: 1;
  transform: translateY(0);
  transition:
    opacity 400ms var(--ease-out-expo) 80ms,
    transform 400ms var(--ease-out-expo) 80ms;
  pointer-events: auto;
}

.feature-block__h {
  margin: 0;
  text-wrap: balance;
  max-width: 22ch;
}
.feature-block__b {
  margin: 0;
  max-width: 36rem;
  color: var(--ink-secondary);
}
@media (max-width: 1023px) {
  .feature-block__b {
    font-size: 0.9375rem;
  }
}

/* ----------------------------------------------------------------
 *  Reduced motion (any width): the pin never engages, so flow
 *  naturally and show every step at once.
 * ---------------------------------------------------------------- */
@media (prefers-reduced-motion: reduce) {
  .features-pin {
    height: auto;
  }
  .features-pin__inner {
    grid-template-columns: 1fr;
    grid-template-rows: none;
    justify-items: start;
    row-gap: var(--space-8);
    padding-block: var(--space-8) var(--space-16);
  }
  .features-pin__phone {
    width: 100%;
    justify-content: center;
  }
  .features-pin__copy {
    height: auto;
    max-width: none;
    min-height: 0;
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
</style>
