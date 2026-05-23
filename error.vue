<script setup lang="ts">
interface NuxtError {
  url?: string
  statusCode: number
  statusMessage?: string
  message?: string
  description?: string
}
const props = defineProps<{ error: NuxtError }>()

useHead({
  title: `${props.error.statusCode} — Synq`,
})

function clearError() {
  navigateTo('/')
}

const headline = computed(() => String(props.error.statusCode || 404))
const isNotFound = computed(() => props.error.statusCode === 404)
</script>

<template>
  <div class="error-page">
    <div class="container-shell error-page__inner">
      <span class="type-caption">PAGE</span>
      <h1 class="type-display-md error-page__code">{{ headline }}</h1>
      <p class="type-body-lg error-page__msg">
        <template v-if="isNotFound">
          This plan got cancelled. Let's get you back outside.
        </template>
        <template v-else>
          Something broke on our end. Try again in a moment.
        </template>
      </p>

      <!-- Decorative dotted hairline — on-brand restraint -->
      <div class="error-page__dots" aria-hidden="true">
        <span v-for="i in 24" :key="i" />
      </div>

      <UiButton variant="primary" @click="clearError">Back home</UiButton>
    </div>
  </div>
</template>

<style scoped>
.error-page {
  min-height: 100dvh;
  background: var(--bg-primary);
  display: grid;
  place-items: center;
  padding: var(--space-12) var(--space-6);
}
.error-page__inner {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-6);
  max-width: 32rem;
}
.error-page__code {
  margin: 0;
  font-feature-settings: 'tnum' 1;
}
.error-page__msg {
  margin: 0;
  color: var(--ink-secondary);
  text-wrap: balance;
}
.error-page__dots {
  display: flex;
  gap: 6px;
}
.error-page__dots span {
  width: 4px;
  height: 4px;
  border-radius: 999px;
  background: var(--rule);
}
.error-page__dots span:first-child {
  background: var(--brand);
}
</style>
