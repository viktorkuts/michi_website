<script setup lang="ts">
import { ref } from 'vue'

interface Stat {
  value: string
  label: string
  source: string
  year?: string
  url?: string
}

// Live-read content/stats.json via server API so JSON edits hot-reload
// without needing a dev-server restart.
const { data: stats } = await useFetch<Stat[]>('/api/data/stats', {
  key: 'intro-stats',
})

const reduced = useReducedMotion()
const visibleRef = ref(false)

onMounted(() => {
  if (reduced.value) {
    visibleRef.value = true
    return
  }
  const obs = new IntersectionObserver((entries) => {
    if (entries[0]?.isIntersecting) {
      visibleRef.value = true
      obs.disconnect()
    }
  }, { threshold: 0.2 })
  const el = document.getElementById('intro')
  if (el) obs.observe(el)
})
</script>

<template>
  <UiSectionShell id="intro" bg="primary">
    <div class="section-intro" :class="{ 'is-visible': visibleRef }">
      <header class="section-intro__head">
        <UiSectionEyebrow dot>WHY THIS, WHY NOW</UiSectionEyebrow>
        <h2 class="type-display-md section-intro__h">
          <span class="section-intro__h-line section-intro__h-line--1">
            The phone took the room.
          </span>
          <span class="section-intro__h-line section-intro__h-line--2 type-italic">
            We're building the way back.
          </span>
        </h2>
      </header>

      <UiHairline class="section-intro__rule" />

      <div class="section-intro__thesis">
        <span class="type-caption section-intro__thesis-tag">THREE NUMBERS</span>
        <p class="type-display-sm section-intro__thesis-line">
          What most days look like in 2026.
        </p>
      </div>

      <ol class="section-intro__list" aria-label="Three social-life signals from public data">
        <li
          v-for="(stat, i) in (stats ?? [])"
          :key="stat.label"
          class="stat-row"
          :style="`--i:${i}`"
        >
          <span class="type-caption stat-row__index">
            {{ String(i + 1).padStart(2, '0') }} / 03
          </span>
          <div class="stat-row__value type-stat tabular-nums">
            {{ stat.value }}
          </div>
          <div class="stat-row__body">
            <p class="stat-row__label type-body-lg">{{ stat.label }}</p>
            <component
              :is="stat.url ? 'a' : 'span'"
              v-bind="stat.url ? { href: stat.url, target: '_blank', rel: 'noopener' } : {}"
              class="stat-row__source type-caption"
            >
              <span>{{ stat.source }}</span>
              <span v-if="stat.year" class="stat-row__source-year">· {{ stat.year }}</span>
              <span v-if="stat.url" class="stat-row__source-arrow" aria-hidden="true">↗</span>
            </component>
          </div>
        </li>
      </ol>
    </div>
  </UiSectionShell>
</template>

<style scoped>
.section-intro {
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
}

.section-intro__head {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  max-width: 56rem;
}

.section-intro__h {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  font-weight: 600;
  letter-spacing: -0.015em;
}

.section-intro__h-line {
  display: block;
  opacity: 0;
  transform: translateY(16px);
  transition:
    opacity var(--dur-section) var(--ease-out-quart),
    transform var(--dur-section) var(--ease-out-quart);
}
.section-intro__h-line--1 { color: var(--ink-primary); }
.section-intro__h-line--2 {
  color: var(--ink-secondary);
  transition-delay: 80ms;
}

.section-intro.is-visible .section-intro__h-line {
  opacity: 1;
  transform: translateY(0);
}

.section-intro__rule {
  margin: 0;
}

.section-intro__thesis {
  display: grid;
  gap: var(--space-3);
  grid-template-columns: 1fr;
  align-items: start;
}
.section-intro__thesis-tag {
  color: var(--ink-muted);
}
.section-intro__thesis-line {
  margin: 0;
  max-width: 38rem;
  color: var(--ink-primary);
  font-weight: 500;
  letter-spacing: -0.01em;
}

@media (min-width: 768px) {
  .section-intro__thesis {
    grid-template-columns: minmax(8rem, 1fr) minmax(0, 3fr);
    gap: var(--space-12);
  }
  .section-intro__thesis-tag {
    padding-top: var(--space-2);
  }
}

.section-intro__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid var(--rule);
}

.stat-row {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-areas:
    'index'
    'value'
    'body';
  row-gap: var(--space-4);
  padding-block: var(--space-12) var(--space-8);
  border-top: 1px solid var(--rule);
  opacity: 0;
  transform: translateY(20px);
  transition:
    opacity var(--dur-section) var(--ease-out-quart) calc(160ms + var(--i, 0) * var(--stagger)),
    transform var(--dur-section) var(--ease-out-quart) calc(160ms + var(--i, 0) * var(--stagger));
}
.section-intro.is-visible .stat-row {
  opacity: 1;
  transform: translateY(0);
}

.stat-row__index {
  grid-area: index;
  color: var(--ink-muted);
  letter-spacing: 0.14em;
  align-self: start;
}

.stat-row__value {
  grid-area: value;
  margin: 0;
  color: var(--ink-primary);
  /* Allow the digits to bleed slightly into the negative gutter so they
     feel sized to the page, not the column. */
  margin-left: -0.04em;
}

.stat-row__body {
  grid-area: body;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  max-width: 42rem;
}
.stat-row__label {
  margin: 0;
  color: var(--ink-secondary);
  text-wrap: pretty;
}
.stat-row__source {
  display: inline-flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: var(--space-1);
  color: var(--ink-muted);
  text-decoration: none;
  transition: color var(--dur-micro) var(--ease-out-quart);
}
a.stat-row__source:hover,
a.stat-row__source:focus-visible {
  color: var(--ink-primary);
}
a.stat-row__source:hover .stat-row__source-arrow,
a.stat-row__source:focus-visible .stat-row__source-arrow {
  color: var(--brand);
  transform: translate(2px, -2px);
}
.stat-row__source-year {
  color: var(--ink-muted);
}
.stat-row__source-arrow {
  margin-inline-start: var(--space-1);
  display: inline-block;
  color: var(--brand);
  transition:
    transform 200ms var(--ease-out-expo),
    color 200ms ease;
}

@media (min-width: 768px) {
  .stat-row {
    /* Two-column: monumental value left-anchored, citation block on the right
       baseline-aligned to the value's lower bound. */
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
    grid-template-areas:
      'index index'
      'value body';
    column-gap: var(--space-12);
    row-gap: var(--space-6);
    padding-block: var(--space-16) var(--space-12);
    align-items: end;
  }
  .stat-row__body {
    padding-bottom: var(--space-4);
  }
}

@media (prefers-reduced-motion: reduce) {
  .section-intro__h-line,
  .stat-row {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
}
</style>
