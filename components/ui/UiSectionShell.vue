<script setup lang="ts">
interface Props {
  id?: string
  bg?: 'primary' | 'secondary' | 'tinted' | 'clay' | 'footer'
  contained?: boolean
  /** Adds a subtle grain overlay — defaults on for clay surfaces */
  grain?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  bg: 'primary',
  contained: true,
  grain: undefined as unknown as boolean,
})

const showGrain = computed(() => props.grain ?? props.bg === 'clay')
</script>

<template>
  <section :id="id" class="section-shell" :class="`bg-${bg}`">
    <div :class="contained ? 'container-shell' : ''">
      <slot />
    </div>
    <span v-if="showGrain" class="section-shell__grain" aria-hidden="true" />
  </section>
</template>

<style scoped>
.section-shell {
  position: relative;
  isolation: isolate;
}
.bg-primary {
  background: var(--bg-primary);
}
.bg-secondary {
  background: var(--bg-secondary);
}
.bg-tinted {
  background: var(--bg-tinted);
}
.bg-clay {
  background: var(--bg-clay);
  color: var(--ink-on-clay);
}
.bg-footer {
  background: var(--bg-footer);
  color: var(--bg-primary);
}

/* Fixed-position grain overlay — pointer-events: none, low opacity.
 * Sits inside the section so it doesn't repaint the whole page. */
.section-shell__grain {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  opacity: 0.5;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.18 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
  background-size: 240px 240px;
}
.bg-clay > :where(.container-shell, *:not(.section-shell__grain)) {
  position: relative;
  z-index: 1;
}
</style>
