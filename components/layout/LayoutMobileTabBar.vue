<script setup lang="ts">
import { computed } from 'vue'
import { Compass, Sparkles, Info, HelpCircle, Mail } from 'lucide-vue-next'

interface Tab {
  label: string
  anchor: string
  icon: any
}
const tabs: Tab[] = [
  { label: 'Home',         anchor: 'hero',         icon: Compass },
  { label: 'How it works', anchor: 'how-it-works', icon: Sparkles },
  { label: 'About',        anchor: 'about',        icon: Info },
  { label: 'FAQ',          anchor: 'faq',          icon: HelpCircle },
  { label: 'Contact',      anchor: 'footer',       icon: Mail },
]

const route = useRoute()
const isHome = computed(() => route.path === '/')

const sectionIds = tabs.map(t => t.anchor)
const observed = useActiveSection(sectionIds, { rootMargin: '-30% 0px -50% 0px' })
const active = computed(() => isHome.value ? observed.value : '')

function targetFor(anchor: string) {
  return isHome.value ? `#${anchor}` : `/#${anchor}`
}

function onTabClick(e: MouseEvent, anchor: string) {
  // Same-page hash → smooth-scroll. Cross-page → let NuxtLink navigate.
  if (!isHome.value) return
  e.preventDefault()
  const el = document.getElementById(anchor)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - 16
  window.scrollTo({ top, behavior: 'smooth' })
  history.replaceState(null, '', `#${anchor}`)
}
</script>

<template>
  <nav class="mobile-tabs" aria-label="Primary mobile">
    <template v-for="tab in tabs" :key="tab.anchor">
      <a
        v-if="isHome"
        :href="`#${tab.anchor}`"
        class="mobile-tabs__item"
        :class="{ 'is-active': active === tab.anchor }"
        :aria-current="active === tab.anchor ? 'page' : undefined"
        @click="(e) => onTabClick(e, tab.anchor)"
      >
        <component :is="tab.icon" :size="20" :stroke-width="1.5" aria-hidden="true" />
        <span class="mobile-tabs__label">{{ tab.label }}</span>
      </a>
      <NuxtLink
        v-else
        :to="`/#${tab.anchor}`"
        class="mobile-tabs__item"
        :class="{ 'is-active': active === tab.anchor }"
        :aria-current="active === tab.anchor ? 'page' : undefined"
      >
        <component :is="tab.icon" :size="20" :stroke-width="1.5" aria-hidden="true" />
        <span class="mobile-tabs__label">{{ tab.label }}</span>
      </NuxtLink>
    </template>
  </nav>
</template>

<style scoped>
.mobile-tabs {
  display: flex;
  position: fixed;
  bottom: var(--space-3);
  left: var(--space-3);
  right: var(--space-3);
  z-index: var(--z-nav);
  background: rgb(247 244 238 / 0.85);
  backdrop-filter: saturate(140%) blur(18px);
  -webkit-backdrop-filter: saturate(140%) blur(18px);
  border: 1px solid var(--rule);
  border-radius: var(--radius-pill);
  padding: var(--space-1);
  justify-content: space-between;
}

@media (min-width: 768px) {
  .mobile-tabs {
    display: none;
  }
}

.mobile-tabs__item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: var(--space-2) var(--space-1);
  color: var(--ink-muted);
  text-decoration: none;
  font-family: var(--font-sans);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.01em;
  border-radius: var(--radius-pill);
  min-height: 44px;
  transition: color 200ms ease, background 200ms ease;
}

.mobile-tabs__item.is-active {
  color: var(--ink-primary);
  background: var(--bg-secondary);
}

.mobile-tabs__label {
  line-height: 1;
}
</style>
