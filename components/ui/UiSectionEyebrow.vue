<script setup lang="ts">
interface Props {
  dot?: boolean
}
defineProps<Props>()
</script>

<template>
  <span class="ui-eyebrow type-caption">
    <span v-if="dot" class="ui-eyebrow__dot" aria-hidden="true" />
    <slot />
  </span>
</template>

<style scoped>
.ui-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--ink-muted);
}
.ui-eyebrow__dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--brand-ink);
  flex: 0 0 auto;
}
</style>
