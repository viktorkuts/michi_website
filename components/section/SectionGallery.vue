<script setup lang="ts">
import { ref } from 'vue'

interface GalleryItem {
  file: string
  tag: string
  
  size?: 'tall' | 'wide' | 'square'
}
const { data: items } = await useFetch<GalleryItem[]>('/api/data/gallery-tags', {
  key: 'gallery-tags',
})

const lightboxOpen = ref(false)
const lightboxSrc = ref('')
const lightboxTag = ref('')

function openLightbox(item: GalleryItem) {
  lightboxSrc.value = `/gallery/${item.file}`
  lightboxTag.value = item.tag
  lightboxOpen.value = true
}
</script>

<template>
  <UiSectionShell id="gallery" bg="clay">
    <div class="section-gallery">
      <header class="section-gallery__head">
        <UiSectionEyebrow dot>THIS WEEK ON MICHI</UiSectionEyebrow>
        <h2 class="section-gallery__headline type-display-md">
          Plans,
          <span class="type-italic" style="color: var(--brand);">not posts.</span>
        </h2>
      </header>
    </div>

    <UiMarquee class="section-gallery__marquee">
      <button
        v-for="item in (items ?? [])"
        :key="item.file"
        class="gallery-card"
        :class="`gallery-card--${item.size ?? 'tall'}`"
        type="button"
        :aria-label="`Open ${item.tag}`"
        @click="openLightbox(item)"
      >
        <span class="gallery-card__media">
          <NuxtImg
            :src="`/gallery/${item.file}`"
            :alt="`${item.tag}`"
            width="480"
            height="640"
            loading="lazy"
            sizes="480px"
            placeholder
            fit="cover"
          />
        </span>
        <span class="gallery-card__meta">
          <span class="gallery-card__tag">{{ item.tag }}</span>
        </span>
      </button>
    </UiMarquee>

    <UiLightbox
      :open="lightboxOpen"
      :src="lightboxSrc"
      :tag="lightboxTag"
      :alt="lightboxTag"
      @close="lightboxOpen = false"
    />
  </UiSectionShell>
</template>

<style scoped>
.section-gallery {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-6);
  margin-bottom: var(--space-12);
  color: var(--ink-on-clay);
}

@media (min-width: 1024px) {
  .section-gallery {
    grid-template-columns: 1fr;
    gap: var(--space-6);
  }
}

.section-gallery__head {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  max-width: 38rem;
}

.section-gallery__headline {
  margin: 0;
  text-wrap: balance;
  color: var(--ink-on-clay);
}

.section-gallery__lede {
  margin: 0;
  color: var(--ink-muted-on-clay);
  max-width: 32rem;
}

.section-gallery__marquee {
  margin-top: var(--space-8);
}

/* Gallery card — receipt-like metadata block under each photo.
 * Three sizes break the AI-grid uniformity. */
.gallery-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  background: transparent;
  border: 0;
  padding: 0;
  text-align: left;
  cursor: pointer;
  flex: 0 0 auto;
  color: var(--ink-on-clay);
  transition: opacity 200ms ease;
}
.gallery-card:hover .gallery-card__media {
  border-color: var(--brand);
}
.gallery-card:hover .gallery-card__going {
  background: var(--brand);
  color: var(--ink-primary);
  border-color: var(--brand);
}
.gallery-card:active {
  transform: scale(0.99);
}

.gallery-card__media {
  position: relative;
  display: block;
  overflow: hidden;
  border-radius: var(--radius-lg);
  border: 1px solid var(--rule-on-clay);
  background: color-mix(in srgb, var(--bg-clay) 80%, var(--ink-on-clay));
  transition: border-color 240ms var(--ease-out-expo);
}
.gallery-card__media :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Tall — original 340×453 ratio. The default. */
.gallery-card--tall { width: 340px; }
.gallery-card--tall .gallery-card__media { height: 453px; }

/* Wide — landscape, breaks the column rhythm. */
.gallery-card--wide { width: 480px; }
.gallery-card--wide .gallery-card__media { height: 320px; }

/* Square — closes the variation triangle. */
.gallery-card--square { width: 320px; }
.gallery-card--square .gallery-card__media { height: 320px; }

/* "X GOING" attendance chip — bottom-left of the photo, persimmon dot */
.gallery-card__going {
  position: absolute;
  left: var(--space-3);
  bottom: var(--space-3);
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-1) var(--space-3);
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.10em;
  font-weight: 500;
  color: var(--ink-on-clay);
  background: rgb(27 20 16 / 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgb(247 241 230 / 0.18);
  border-radius: 999px;
  transition:
    background 240ms ease,
    color 240ms ease,
    border-color 240ms ease;
}
.gallery-card__going-dot {
  width: 5px;
  height: 5px;
  border-radius: 999px;
  background: var(--brand);
  flex: 0 0 auto;
}

/* Meta block under photo — tag in mono, location/time in mono lighter */
.gallery-card__meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-inline: 2px;
}
.gallery-card__tag {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.10em;
  color: var(--ink-on-clay);
}
.gallery-card__row {
  display: inline-flex;
  align-items: baseline;
  gap: var(--space-2);
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.08em;
  color: var(--ink-muted-on-clay);
}
.gallery-card__sep {
  color: rgb(247 241 230 / 0.30);
}
</style>