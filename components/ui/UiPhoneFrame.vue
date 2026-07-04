<script setup lang="ts">
interface PhoneScreen {
  image?: string
}

interface Props {
  width?: number | string
  ariaLabel?: string
  /**
   * Optional multi-screen mode. When provided, the phone renders all screens
   * stacked and crossfades to the one matching `activeIndex`. Screen images
   * are pre-normalized to the frame's exact screen ratio by
   * scripts/prepare-feature-screens.mjs, so `object-fit: cover` never crops.
   */
  screens?: PhoneScreen[]
  activeIndex?: number
}
withDefaults(defineProps<Props>(), {
  width: 320,
  ariaLabel: 'Phone mockup',
  activeIndex: 0,
})
</script>

<template>
  <figure
    class="ui-phone"
    :style="{ '--phone-width': typeof width === 'number' ? `${width}px` : width }"
    :aria-label="ariaLabel"
    role="img"
  >
    <div class="ui-phone__frame">
      <!-- iPhone 15 silhouette: rounded rect + dynamic island, 1.5px stroke -->
      <svg
        class="ui-phone__svg"
        viewBox="0 0 320 660"
        fill="none"
        aria-hidden="true"
      >
        <rect x="2" y="2" width="316" height="656" rx="50" ry="50"
          stroke="currentColor" stroke-width="1.5" />
        <rect x="14" y="14" width="292" height="632" rx="40" ry="40"
          stroke="currentColor" stroke-width="1" opacity="0.4" />
        <rect x="118" y="28" width="84" height="22" rx="11" fill="currentColor" />
        <line x1="2" y1="180" x2="2" y2="220" stroke="currentColor" stroke-width="1.5" />
        <line x1="2" y1="240" x2="2" y2="290" stroke="currentColor" stroke-width="1.5" />
        <line x1="318" y1="190" x2="318" y2="240" stroke="currentColor" stroke-width="1.5" />
      </svg>

      <div class="ui-phone__screen">
        <!-- Multi-screen mode: stacked layers with opacity crossfade -->
        <template v-if="screens && screens.length">
          <div
            v-for="(s, i) in screens"
            :key="i"
            class="ui-phone__layer"
            :class="{ 'is-active': i === activeIndex }"
            :aria-hidden="i !== activeIndex"
          >
            <img
              v-if="s.image"
              :src="s.image"
              class="ui-phone__image"
              alt=""
              loading="lazy"
              decoding="async"
            />
          </div>
        </template>

        <!-- Single-slot mode (back-compat) -->
        <slot v-else>
          <div class="ui-phone__placeholder">
            <span class="ui-phone__placeholder-title">Michi</span>
          </div>
        </slot>
      </div>
    </div>
  </figure>
</template>

<style scoped>
.ui-phone {
  margin: 0;
  width: var(--phone-width);
  display: block;
}
.ui-phone__frame {
  position: relative;
  width: 100%;
  aspect-ratio: 320 / 660;
  color: var(--ink-primary);
}
.ui-phone__svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
}
.ui-phone__screen {
  position: absolute;
  inset: calc(var(--phone-width) * 14 / 320);
  border-radius: calc(var(--phone-width) * 38 / 320);
  overflow: hidden;
  background: var(--bg-secondary);
  z-index: 1;
}

.ui-phone__layer {
  position: absolute;
  inset: 0;
  background: var(--bg-secondary);
  opacity: 0;
  transition: opacity 300ms var(--ease-out-expo);
  pointer-events: none;
}
.ui-phone__layer.is-active {
  opacity: 1;
}

.ui-phone__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ui-phone__placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
}
.ui-phone__placeholder-title {
  font-family: var(--font-sans);
  font-weight: 600;
  color: var(--ink-primary);
}

@media (prefers-reduced-motion: reduce) {
  .ui-phone__layer {
    transition: none;
  }
}
</style>
