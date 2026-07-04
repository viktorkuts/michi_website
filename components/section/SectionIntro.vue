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

      <!-- Supporting evidence — deliberately one compact band. The
           numbers back the headline; they are not the headline. -->
      <ol class="section-intro__grid" aria-label="Three social-life signals from public data">
        <li
          v-for="(stat, i) in (stats ?? [])"
          :key="stat.label"
          class="stat-cell"
          :style="`--i:${i}`"
        >
          <div class="stat-cell__value type-display-lg tabular-nums">
            {{ stat.value }}
          </div>
          <p class="stat-cell__label type-body">{{ stat.label }}</p>
          <component
            :is="stat.url ? 'a' : 'span'"
            v-bind="stat.url ? { href: stat.url, target: '_blank', rel: 'noopener' } : {}"
            class="stat-cell__source type-caption"
          >
            <span>{{ stat.source }}</span>
            <span v-if="stat.year" class="stat-cell__source-year">· {{ stat.year }}</span>
            <span v-if="stat.url" class="stat-cell__source-arrow" aria-hidden="true">↗</span>
          </component>
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

.section-intro__grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-8);
}

@media (min-width: 768px) {
  .section-intro__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--space-12);
  }
}

.stat-cell {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  opacity: 0;
  transform: translateY(20px);
  transition:
    opacity var(--dur-section) var(--ease-out-quart) calc(160ms + var(--i, 0) * var(--stagger)),
    transform var(--dur-section) var(--ease-out-quart) calc(160ms + var(--i, 0) * var(--stagger));
}
.section-intro.is-visible .stat-cell {
  opacity: 1;
  transform: translateY(0);
}

/* Mobile: hairline between cells keeps the list scannable */
@media (max-width: 767px) {
  .stat-cell + .stat-cell {
    border-top: 1px solid var(--rule);
    padding-top: var(--space-8);
  }
}

.stat-cell__value {
  margin: 0;
  font-feature-settings: 'tnum' 1;
}

.stat-cell__label {
  margin: 0;
  color: var(--ink-secondary);
  text-wrap: pretty;
  max-width: 28rem;
}

.stat-cell__source {
  display: inline-flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: var(--space-1);
  color: var(--ink-muted);
  text-decoration: none;
  transition: color var(--dur-micro) var(--ease-out-quart);
}
a.stat-cell__source:hover,
a.stat-cell__source:focus-visible {
  color: var(--ink-primary);
}
.stat-cell__source-year {
  color: var(--ink-muted);
}
.stat-cell__source-arrow {
  margin-inline-start: var(--space-1);
  display: inline-block;
  color: var(--brand-ink);
  transition: transform 200ms var(--ease-out-expo);
}
a.stat-cell__source:hover .stat-cell__source-arrow,
a.stat-cell__source:focus-visible .stat-cell__source-arrow {
  transform: translate(2px, -2px);
}

@media (prefers-reduced-motion: reduce) {
  .section-intro__h-line,
  .stat-cell {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
}
</style>
