<script setup lang="ts">
interface AboutItem {
  file: string
  tag: string
  role: 'anchor' | 'satellite'
}

const { data: items } = await useFetch<AboutItem[]>('/api/data/about-tags', {
  key: 'about-tags',
})

const members = computed(() => {
  if (!items.value) return []
  const anchor = items.value.find(i => i.role === 'anchor')
  const satellites = items.value.filter(i => i.role === 'satellite')
  // Put anchor second (CEO in position 2 like the screenshot)
  return [satellites[0], anchor, satellites[1], satellites[2]].filter(Boolean) as AboutItem[]
})
</script>

<template>
  <UiSectionShell id="about" bg="primary">
    <div class="section-about">

      <!-- A) Founder note -->
      <header class="section-about__head">
        <UiSectionEyebrow dot>FROM THE FOUNDER</UiSectionEyebrow>
        <h2 class="type-display-md section-about__headline">
          Built for what's
          <span class="type-italic" style="color: var(--brand);">outside.</span>
        </h2>
        <p class="type-body-lg section-about__story">
          The apps I opened most were the ones I liked least. Feeds,
          friend counts, performance reviews of my own life. I wanted
          the opposite — an app you close after thirty seconds because
          you're already on your way somewhere. Michi does one thing:
          it helps you find a plan, show up, and meet the people who
          showed up too. The rest of the night is the point.
        </p>
      </header>

      <!-- B) Diagonal strip -->
      <div class="section-about__strip">
        <figure
          v-for="(member, i) in members"
          :key="member.file"
          class="strip-card"
          :class="{ 'strip-card--anchor': member.role === 'anchor' }"
        >
          <span class="strip-card__media">
            <NuxtImg
              :src="`/about/${member.file}`"
              :alt="member.tag"
              width="400"
              height="560"
              loading="lazy"
              fit="cover"
            />
          </span>
          <figcaption class="strip-card__caption">
            <span class="type-caption strip-card__role">
              {{ member.tag.split('·').at(0)?.trim() }}
            </span>
            <span class="strip-card__name">
              {{ member.tag.split('·').at(1)?.trim() }}
            </span>
          </figcaption>
        </figure>
      </div>

    </div>
  </UiSectionShell>
</template>

<style scoped>
.section-about {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
}

.section-about__head {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  max-width: 36rem;
  margin-left: auto;
}
@media (min-width: 1024px) {
  .section-about__head {
    margin-right: 8%;
  }
}

.section-about__headline {
  margin: 0;
  text-wrap: balance;
}
.section-about__story {
  margin: 0;
  color: var(--ink-secondary);
}

/* ----------------------------------------------------------------
 *  Diagonal strip
 * ---------------------------------------------------------------- */
.section-about__strip {
  display: flex;
  align-items: flex-end;
  gap: 0;
  overflow: hidden;
  border-radius: var(--radius-lg);
}

.section-about__strip {
  display: flex;
  align-items: flex-end;
  gap: var(--space-3);
  overflow: visible;
  border-radius: 0;
}

.strip-card {
  margin: 0;
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  clip-path: polygon(15% 0%, 100% 0%, 85% 100%, 0% 100%);
  transition: none;
}


.strip-card__media {
  display: block;
  width: 100%;
  aspect-ratio: 3 / 4;
  overflow: hidden;
}
.strip-card__media :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
  transition: transform 500ms var(--ease-out-quart);
}


/* Caption sits below the image, outside the clip */
.strip-card__caption {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding-top: var(--space-3);
  padding-inline: var(--space-2);
}

.strip-card__role {
  color: var(--ink-muted);
  letter-spacing: 0.1em;
  font-size: 0.75rem;
}

.strip-card__name {
  font-family: var(--font-sans);
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--ink-primary);
  line-height: 1.2;
}

/* Mobile — stack vertically, no diagonal */
@media (max-width: 767px) {
  .section-about__strip {
    flex-direction: row;
    flex-wrap: wrap;
    border-radius: 0;
  }
  .strip-card {
    flex: 0 0 calc(50% - var(--space-3) / 2);
    clip-path: polygon(15% 0%, 100% 0%, 85% 100%, 0% 100%);
    margin-inline: 0;
  }
  .strip-card__media {
    aspect-ratio: 3 / 4;
  }
}

@media (prefers-reduced-motion: reduce) {
  .strip-card,
  .strip-card__media :deep(img) {
    transition: none;
  }
}
</style>