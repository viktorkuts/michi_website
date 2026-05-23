<script setup lang="ts">
interface Props {
  value: string
  label: string
  source: string
  verify?: boolean
}
defineProps<Props>()
</script>

<template>
  <div class="ui-stat">
    <div class="ui-stat__value type-display-md tabular-nums">{{ value }}</div>
    <div class="ui-stat__label type-body">{{ label }}</div>
    <div class="ui-stat__source">
      <span class="type-caption">{{ source }}</span>
      <span v-if="verify" class="ui-stat__verify type-caption">[VERIFY]</span>
    </div>
  </div>
</template>

<style scoped>
.ui-stat {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding-block: var(--space-8);
}
.ui-stat__value {
  font-feature-settings: 'tnum' 1;
}
.ui-stat__label {
  max-width: 32ch;
  color: var(--ink-secondary);
}
.ui-stat__source {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  align-items: center;
  margin-top: var(--space-2);
}
.ui-stat__verify {
  color: var(--brand);
  letter-spacing: 0.08em;
}
</style>
