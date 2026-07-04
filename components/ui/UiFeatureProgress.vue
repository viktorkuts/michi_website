<script setup lang="ts">
interface Props {
  total: number
  active: number
  orientation?: 'vertical' | 'horizontal'
  ariaLabel?: string
}
withDefaults(defineProps<Props>(), {
  orientation: 'vertical',
  ariaLabel: 'Feature progress',
})
</script>

<template>
  <ul
    class="ui-feature-progress"
    :class="`ui-feature-progress--${orientation}`"
    role="list"
    :aria-label="`${ariaLabel}: ${active + 1} of ${total}`"
  >
    <li
      v-for="i in total"
      :key="i"
      class="ui-feature-progress__dot"
      :class="{ 'is-active': active === i - 1 }"
      :aria-current="active === i - 1 ? 'step' : undefined"
    />
  </ul>
</template>

<style scoped>
.ui-feature-progress {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
}
.ui-feature-progress--vertical {
  flex-direction: column;
  gap: var(--space-3);
}
.ui-feature-progress--horizontal {
  flex-direction: row;
  gap: var(--space-3);
  justify-content: center;
}

.ui-feature-progress__dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--ink-muted);
  opacity: 0.3;
  transition:
    background-color 200ms ease,
    opacity 200ms ease,
    transform 220ms var(--ease-out-expo);
}
.ui-feature-progress__dot.is-active {
  background: var(--brand-ink);
  opacity: 1;
  transform: scale(1.2);
}

@media (prefers-reduced-motion: reduce) {
  .ui-feature-progress__dot {
    transition: none;
  }
}
</style>
