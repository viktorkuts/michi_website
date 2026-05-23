<script setup lang="ts">
import { onMounted } from 'vue'

useHead({
  title: 'Synq — More life outside.',
  meta: [
    { name: 'description', content: 'Find what\'s happening near you. Meet people through the things you actually do.' },
  ],
})

// If the nav Download was clicked from another route, that handler set
// a sessionStorage flag and routed here. Pick it up after first paint
// and scroll to the hero's revealed-CTAs state.
onMounted(() => {
  consumeHeroEndScrollIfPending()
})

// Hash-target jump from cross-page nav (e.g. "/#about" from /terms):
// Nuxt's default scrollBehavior handles initial load, but we run an
// extra rAF pass after preload so the lazy section heights are settled.
const route = useRoute()
onMounted(() => {
  if (!route.hash) return
  const id = route.hash.slice(1)
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const el = document.getElementById(id)
      if (!el) return
      const top = el.getBoundingClientRect().top + window.scrollY - 16
      window.scrollTo({ top, behavior: 'smooth' })
    })
  })
})
</script>

<template>
  <div class="page-home">
    <SectionHero />
    <SectionIntro />
    <SectionFeatures />
    <SectionGallery />
    <SectionAbout />
    <SectionFaq />
  </div>
</template>

<style scoped>
.page-home {
  background: var(--bg-primary);
}
</style>
