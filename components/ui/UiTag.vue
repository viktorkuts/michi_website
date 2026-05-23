<script setup lang="ts">
interface Props {
  dot?: boolean
}
defineProps<Props>()
</script>

<template>
  <span class="ui-tag">
    <span v-if="dot" class="ui-tag__dot" aria-hidden="true" />
    <slot />
  </span>
</template>

<style scoped>
.ui-tag {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--type-caption-size);
  line-height: var(--type-caption-line);
  letter-spacing: 0.08em;
  font-weight: var(--type-caption-weight);
  text-transform: uppercase;
  color: var(--ink-muted);
}
.ui-tag__dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--brand);
  flex: 0 0 auto;
}
</style>
