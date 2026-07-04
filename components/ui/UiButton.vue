<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost'
  href?: string
  to?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  type: 'button',
  disabled: false,
})

const isExternal = computed(() =>
  !!props.href && /^(https?:|mailto:|tel:)/.test(props.href),
)
</script>

<template>
  <NuxtLink
    v-if="to"
    :to="to"
    class="ui-button"
    :class="[`ui-button--${variant}`, { 'is-disabled': disabled }]"
  >
    <span class="ui-button__label"><slot /></span>
    <span v-if="$slots.trail" class="ui-button__trail" aria-hidden="true">
      <slot name="trail" />
    </span>
  </NuxtLink>

  <a
    v-else-if="href"
    :href="href"
    :rel="isExternal ? 'noopener noreferrer' : undefined"
    :target="isExternal ? '_blank' : undefined"
    class="ui-button"
    :class="[`ui-button--${variant}`, { 'is-disabled': disabled }]"
  >
    <span class="ui-button__label"><slot /></span>
    <span v-if="$slots.trail" class="ui-button__trail" aria-hidden="true">
      <slot name="trail" />
    </span>
  </a>

  <button
    v-else
    :type="type"
    :disabled="disabled"
    class="ui-button"
    :class="[`ui-button--${variant}`, { 'is-disabled': disabled }]"
  >
    <span class="ui-button__label"><slot /></span>
    <span v-if="$slots.trail" class="ui-button__trail" aria-hidden="true">
      <slot name="trail" />
    </span>
  </button>
</template>

<style scoped>
.ui-button {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-pill);
  font-family: var(--font-sans);
  font-size: var(--type-body-size);
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.005em;
  text-decoration: none;
  cursor: pointer;
  transition:
    transform 160ms var(--ease-out-expo),
    background-color 200ms ease,
    color 200ms ease,
    border-color 200ms ease;
  user-select: none;
  white-space: nowrap;
  border: 1px solid transparent;
}

.ui-button:active {
  transform: scale(0.97);
}

.ui-button.is-disabled {
  opacity: 0.5;
  pointer-events: none;
}

/* Primary — brand fill, ink text (mirrors the app's Join button) */
.ui-button--primary {
  background: var(--brand);
  color: var(--ink-primary);
}
.ui-button--primary:hover {
  background: var(--brand-hover);
}

/* Secondary — ivory fill, ink text, hairline */
.ui-button--secondary {
  background: var(--bg-secondary);
  color: var(--ink-primary);
  border-color: var(--rule);
}
.ui-button--secondary:hover {
  border-color: var(--ink-primary);
}

/* Ghost — transparent, ink text */
.ui-button--ghost {
  background: transparent;
  color: var(--ink-primary);
}
.ui-button--ghost:hover {
  background: var(--brand-soft);
}

.ui-button__trail {
  display: inline-flex;
  align-items: center;
}

/* Touch-only: respect 44px touch target */
@media (max-width: 1023px) {
  .ui-button {
    min-height: 44px;
  }
}
</style>
