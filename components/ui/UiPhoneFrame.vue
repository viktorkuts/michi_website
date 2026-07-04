<script setup lang="ts">
interface PhoneScreen {
  eyebrow?: string
  headline?: string
  image?: string
}

interface Props {
  width?: number | string
  ariaLabel?: string
  /**
   * Optional multi-screen mode. When provided, the phone renders all screens
   * stacked and crossfades to the one matching `activeIndex`.
   */
  screens?: PhoneScreen[]
  activeIndex?: number
}
const props = withDefaults(defineProps<Props>(), {
  width: 320,
  ariaLabel: 'Phone mockup',
  activeIndex: 0,
})
const edgeColors = ref<Record<number, { top: string; bottom: string }>>({})

async function sampleEdgeColors(src: string, index: number) {
  const img = new Image()
  img.src = src
  await new Promise(resolve => { img.onload = resolve })
  const canvas = document.createElement('canvas')
  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0)
  const topData = ctx.getImageData(0, 0, img.naturalWidth, 1).data
  const bottomData = ctx.getImageData(0, img.naturalHeight - 1, img.naturalWidth, 1).data
  function dominantColor(data: Uint8ClampedArray): string {
    if (!data || data.length === 0) return '#14121A'
  const buckets: Record<string, number> = {}
  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3] ?? 0
    if (alpha < 128) continue
    const r = Math.round(data[i] ?? 0 / 24) * 24
    const g = Math.round(data[i + 1]??0 / 24) * 24
    const b = Math.round(data[i + 2]??0 / 24) * 24
    const key = `${r},${g},${b}`
    buckets[key] = (buckets[key] ?? 0) + 1
  }
  const entries = Object.entries(buckets).sort((a, b) => b[1] - a[1])
  if (!entries.length || !entries[0]) return '#14121A'
  if (!entries.length) return 'black'
  return `rgb(${entries[0][0]})`
}
  edgeColors.value[index] = { top: dominantColor(topData), bottom: dominantColor(bottomData) }
}


onMounted(() => {
  props.screens?.forEach((s, i) => { if (s.image) sampleEdgeColors(s.image, i) })
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
        <!-- Multi-screen mode: render stacked layers with opacity crossfade -->
        <template v-if="screens && screens.length">
          <div
            v-for="(s, i) in screens"
            :key="i"
            class="ui-phone__layer"
            :class="{ 'is-active': i === activeIndex }"
            :aria-hidden="i !== activeIndex"
          >
            <div
              class="ui-phone__image-wrapper"
              :style="{
                background: `linear-gradient(to bottom, ${edgeColors[i]?.top ?? 'black'} 0%, ${edgeColors[i]?.bottom ?? 'black'} 100%)`
              }"
            >
              <img
                v-if="s.image"
                :src="s.image"
                class="ui-phone__image"
                alt=""
              />
            </div>

            <span class="type-caption ui-phone__layer-eyebrow">
              {{ s.eyebrow }}
            </span>

            <span class="ui-phone__layer-title">
              {{ s.headline }}
            </span>
          </div>
        </template>

        <!-- Single-slot mode (back-compat) -->
        <slot v-else>
          <div class="ui-phone__placeholder">
            <span class="ui-phone__layer-title">Michi</span>
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
/*
.ui-phone__screen {
  position: absolute;
  top: 14px;
  left: 14px;
  right: 14px;
  bottom: 14px;
  border-radius: 40px;
  overflow: hidden;
  background: var(--bg-secondary);
  z-index: 1;
}*/
.ui-phone__screen {
  position: absolute;
  inset: calc(var(--phone-width) * 14 / 320);
  border-radius: calc(var(--phone-width) * 38 / 320);
  overflow: hidden;
  background: var(--bg-secondary);
  z-index: 1;
}
.ui-phone__image-wrapper {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
}

.ui-phone__image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.ui-phone__layer {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: var(--space-3);
  padding: 30px;
  background: var(--bg-secondary);
  opacity: 0;
  transition: opacity 300ms var(--ease-out-expo);
  pointer-events: none;
}
/*
.ui-phone__layer::before {
  content: '';
  position: absolute;
  inset: -20px;
  background: linear-gradient(
    to top,
    color-mix(in srgb, var(--bg-primary) 70%, transparent) 0%,
    color-mix(in srgb, var(--bg-primary) 20%, transparent) 60%,
    transparent 100%
  );
  z-index: 0;
  border-radius: inherit;
}

.ui-phone__layer::after {
  content: '';
  position: absolute;
  inset: 0;
  background: color-mix(in srgb, var(--bg-primary) 25%, transparent);
  z-index: 1;
}*/

.ui-phone__layer-eyebrow,
.ui-phone__layer-title {
  position: relative;
  z-index: 1;
}

.ui-phone__layer.is-active {
  opacity: 1;
  pointer-events: auto;
}

.ui-phone__layer-eyebrow {
  letter-spacing: 0.08em;
  color: var(--ink-muted);
}
.ui-phone__layer-title {
  font-family: var(--font-sans);
  font-size: clamp(1.0625rem, 0.95rem + 0.4375vw, 1.25rem);
  line-height: 1.35;
  font-weight: 600;
  color: var(--ink-primary);
  max-width: 18ch;
  text-wrap: balance;
}

.ui-phone__placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
}

@media (prefers-reduced-motion: reduce) {
  .ui-phone__layer {
    transition: none;
  }
}
</style>
