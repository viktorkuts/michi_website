<script setup lang="ts">
import { computed } from 'vue'

interface NavItem {
  label: string
  anchor: string  // section id on the home page
}
const items: NavItem[] = [
  { label: 'Home', anchor: 'hero' },
  { label: 'How it works', anchor: 'how-it-works' },
  { label: 'About', anchor: 'about' },
  { label: 'FAQ', anchor: 'faq' },
  { label: 'Contact', anchor: 'footer' },
]

const route = useRoute()
const router = useRouter()
const isHome = computed(() => route.path === '/')

// On home: hash links → smooth-scroll handler in UiNavLink.
// Off home: NuxtLink-style "/#anchor" so the link routes to / and lands
// at the right section in one navigation. UiNavLink renders NuxtLink
// for non-pure-hash hrefs.
const navItems = computed(() =>
  items.map(i => ({
    label: i.label,
    anchor: i.anchor,
    href: isHome.value ? `#${i.anchor}` : `/#${i.anchor}`,
  })),
)

// Active section indicator only fires on the home page; on other pages
// no link should appear active.
const sectionIds = items.map(i => i.anchor)
const observed = useActiveSection(sectionIds, { rootMargin: '-30% 0px -50% 0px' })
const active = computed(() => isHome.value ? observed.value : '')

const { surface, attention } = useNavState({ heroSelector: '#hero' })
const heroBg = useHeroBackground()

const surfaceClass = computed(() => `is-${surface.value}`)
const attentionClass = computed(() => attention.value === 'idle' ? 'is-idle' : '')

// Frosted state always wins (frosted bg is ivory → keep ink text).
// Otherwise, follow the hero's measured luminance.
const tint = computed(() => {
  if (surface.value === 'frosted') return 'ink'
  return heroBg.onDark.value ? 'ivory' : 'ink'
})
const tintClass = computed(() => `is-tint-${tint.value}`)

// Download CTA — scrolls to the hero's final state (CTAs revealed).
// On home: intercept and scroll. Off home: route to / with a flag, then
// the home page picks it up via consumeHeroEndScrollIfPending() on mount.
async function onDownloadClick(e: MouseEvent) {
  e.preventDefault()
  if (isHome.value) {
    scrollToHeroEnd()
  } else {
    requestHeroEndScroll()
    await router.push('/')
  }
}
</script>

<template>
  <header class="layout-nav" :class="[surfaceClass, attentionClass, tintClass]">
    <a href="#main" class="skip-link">Skip to content</a>

    <div class="layout-nav__inner container-shell">
      <NuxtLink to="/" class="layout-nav__brand" aria-label="Michi home">
        <span class="layout-nav__wordmark">Michi</span>
      </NuxtLink>

      <nav class="layout-nav__links" aria-label="Primary">
        <UiNavLink
          v-for="item in navItems"
          :key="item.anchor"
          :href="item.href"
          :active="active === item.anchor"
        >
          {{ item.label }}
        </UiNavLink>
      </nav>

      <div class="layout-nav__cta">
        <UiButton variant="primary" href="/" @click="onDownloadClick">Download</UiButton>
      </div>
    </div>
  </header>
</template>

<style scoped>
.layout-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-nav);
  /* CSS variable consumed by .layout-nav__brand and child UiNavLinks */
  --nav-tint: var(--ink-primary);
  --nav-tint-soft: var(--ink-secondary);
  transition:
    background-color 300ms var(--ease-out-expo),
    backdrop-filter 300ms ease,
    border-color 300ms ease,
    opacity 400ms ease,
    color 320ms var(--ease-out-expo);
  border-bottom: 1px solid transparent;
}

.layout-nav.is-tint-ivory {
  --nav-tint: var(--bg-primary);
  --nav-tint-soft: rgb(247 244 238 / 0.75);
}

.layout-nav.is-transparent {
  background: transparent;
  backdrop-filter: none;
}

.layout-nav.is-frosted {
  background: rgb(247 244 238 / 0.7);
  backdrop-filter: saturate(140%) blur(14px);
  -webkit-backdrop-filter: saturate(140%) blur(14px);
  border-bottom-color: var(--rule);
}

.layout-nav.is-idle {
  opacity: 0.4;
}

.layout-nav__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-6);
  padding-block: var(--space-3);
}

.layout-nav__brand {
  display: inline-flex;
  align-items: center;
  font-family: var(--font-sans);
  font-weight: 600;
  font-size: 1.125rem;
  letter-spacing: -0.02em;
  color: var(--nav-tint, var(--ink-primary));
  text-decoration: none;
  transition: color 320ms var(--ease-out-expo);
}
.layout-nav__wordmark {
  display: inline-block;
}

.layout-nav__links {
  display: none;
  align-items: center;
  gap: var(--space-1);
}

@media (min-width: 768px) {
  .layout-nav__links {
    display: inline-flex;
  }
}

.layout-nav__cta {
  display: none;
}
@media (min-width: 768px) {
  .layout-nav__cta {
    display: inline-flex;
  }
}
</style>
