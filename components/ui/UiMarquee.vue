<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  duration?: number      // seconds for one full loop
  gap?: string           // CSS gap between items
}
const props = withDefaults(defineProps<Props>(), {
  duration: 50,
  gap: 'var(--space-4)',
})

const root = ref<HTMLElement | null>(null)
const { paused } = useMarquee(() => root.value)

const trackStyle = computed(() => ({
  '--marquee-duration': `${props.duration}s`,
  '--marquee-gap': props.gap,
  animationPlayState: paused.value ? 'paused' : 'running',
}))
</script>

<template>
  <div ref="root" class="ui-marquee" tabindex="-1">
    <div class="ui-marquee__track" :style="trackStyle">
      <!-- duplicate the slot once for seamless loop -->
      <div class="ui-marquee__group" aria-hidden="false">
        <slot />
      </div>
      <div class="ui-marquee__group" aria-hidden="true">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.ui-marquee {
  position: relative;
  width: 100%;
  overflow: hidden;
  -webkit-mask-image: linear-gradient(
    90deg,
    transparent 0,
    black 80px,
    black calc(100% - 80px),
    transparent 100%
  );
  mask-image: linear-gradient(
    90deg,
    transparent 0,
    black 80px,
    black calc(100% - 80px),
    transparent 100%
  );
}

.ui-marquee__track {
  display: flex;
  gap: var(--marquee-gap, var(--space-4));
  width: max-content;
  animation: ui-marquee-drift var(--marquee-duration, 50s) linear infinite;
  will-change: transform;
}

.ui-marquee__group {
  display: flex;
  gap: var(--marquee-gap, var(--space-4));
  flex: 0 0 auto;
}

@keyframes ui-marquee-drift {
  from { transform: translate3d(0, 0, 0); }
  to   { transform: translate3d(-50%, 0, 0); }
}

@media (prefers-reduced-motion: reduce) {
  .ui-marquee__track {
    animation: none;
  }
}
</style>
