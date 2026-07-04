<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  href: string
  active?: boolean
  external?: boolean
}
const props = defineProps<Props>()

// Same-page hash: smooth-scroll only.
// Anything else (route paths, "/#anchor"): NuxtLink so cross-page nav stays SPA.
const isHashOnly = computed(() => props.href.startsWith('#'))

function onHashClick(e: MouseEvent) {
  e.preventDefault()
  const id = props.href.slice(1)
  const el = document.getElementById(id)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - 16
  window.scrollTo({ top, behavior: 'smooth' })
  history.replaceState(null, '', props.href)
}
</script>

<template>
  <!-- Same-page hash → <a> with smooth-scroll handler -->
  <a
    v-if="isHashOnly"
    :href="href"
    :rel="external ? 'noopener noreferrer' : undefined"
    :target="external ? '_blank' : undefined"
    :aria-current="active ? 'page' : undefined"
    class="ui-nav-link"
    :class="{ 'is-active': active }"
    @click="onHashClick"
  >
    <span class="ui-nav-link__label"><slot /></span>
    <span class="ui-nav-link__dot" aria-hidden="true" />
    <span class="ui-nav-link__underline" aria-hidden="true" />
  </a>

  <!-- Cross-page (e.g. "/#about" from /terms) → NuxtLink for SPA navigation -->
  <NuxtLink
    v-else
    :to="href"
    :aria-current="active ? 'page' : undefined"
    class="ui-nav-link"
    :class="{ 'is-active': active }"
  >
    <span class="ui-nav-link__label"><slot /></span>
    <span class="ui-nav-link__dot" aria-hidden="true" />
    <span class="ui-nav-link__underline" aria-hidden="true" />
  </NuxtLink>
</template>

<style scoped>
.ui-nav-link {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: var(--space-2) var(--space-3);
  font-family: var(--font-sans);
  font-size: var(--type-body-size);
  font-weight: 500;
  line-height: 1.2;
  /* Inherits nav tint when nested under .layout-nav; falls back to ink */
  color: var(--nav-tint, var(--ink-primary));
  text-decoration: none;
  letter-spacing: -0.005em;
  transition: color 320ms var(--ease-out-expo);
}

.ui-nav-link__label {
  position: relative;
}

.ui-nav-link__underline {
  position: absolute;
  left: var(--space-3);
  right: var(--space-3);
  bottom: 14px;
  height: 1px;
  background: var(--brand-ink);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 220ms var(--ease-out-expo);
}

@media (hover: hover) and (pointer: fine) {
  .ui-nav-link:hover .ui-nav-link__underline {
    transform: scaleX(1);
  }
}

.ui-nav-link__dot {
  width: 4px;
  height: 4px;
  border-radius: 999px;
  background: var(--brand-ink);
  opacity: 0;
  transform: scale(0.6);
  transition:
    opacity 220ms var(--ease-out-expo),
    transform 220ms var(--ease-out-expo);
}

.ui-nav-link.is-active .ui-nav-link__dot {
  opacity: 1;
  transform: scale(1);
}
</style>
