<script setup lang="ts">
interface AboutItem {
  file: string
  tag: string
  role: 'anchor' | 'satellite'
}

const { data: items } = await useFetch<AboutItem[]>('/api/data/about-tags', {
  key: 'about-tags',
})

const anchor = computed(() => items.value?.find(i => i.role === 'anchor'))
const satellites = computed(() => items.value?.filter(i => i.role === 'satellite') ?? [])

function rolePart(tag: string) {
  return tag.split('·').at(0)?.trim() ?? ''
}
function namePart(tag: string) {
  return tag.split('·').at(1)?.trim() ?? ''
}
</script>

<template>
  <UiSectionShell id="about" bg="primary">
    <div class="section-about">

      <!-- Founder note beside the founder — no orphaned columns -->
      <div class="section-about__lede">
        <header class="section-about__head">
          <UiSectionEyebrow dot>FROM THE FOUNDER</UiSectionEyebrow>
          <h2 class="type-display-md section-about__headline">
            Built for what's
            <span class="type-italic section-about__headline-em">outside.</span>
          </h2>
          <p class="type-body-lg section-about__story">
            I started Michi in Montreal, after one too many weekends
            where everyone I knew was "around" and nobody was actually
            anywhere. Every app on my phone was built to keep me looking
            at it, so we made one that gets you out the door instead.
            You open Michi, find a basketball run nearby or tennis on
            Thursday, and close it. The less time you spend in the app,
            the better it's doing its job.
          </p>
        </header>

        <figure v-if="anchor" class="about-card about-card--anchor">
          <span class="about-card__media">
            <NuxtImg
              :src="`/about/${anchor.file}`"
              :alt="`${namePart(anchor.tag)}, ${rolePart(anchor.tag)}`"
              width="500"
              height="640"
              loading="lazy"
              fit="cover"
            />
          </span>
          <figcaption class="about-card__caption">
            <span class="type-caption about-card__role">{{ rolePart(anchor.tag) }}</span>
            <span class="about-card__name">{{ namePart(anchor.tag) }}</span>
          </figcaption>
        </figure>
      </div>

      <!-- The rest of the team — straight row, no gimmicks -->
      <div class="section-about__team">
        <figure
          v-for="sat in satellites"
          :key="sat.file"
          class="about-card"
        >
          <span class="about-card__media">
            <NuxtImg
              :src="`/about/${sat.file}`"
              :alt="`${namePart(sat.tag)}, ${rolePart(sat.tag)}`"
              width="400"
              height="500"
              loading="lazy"
              fit="cover"
            />
          </span>
          <figcaption class="about-card__caption">
            <span class="type-caption about-card__role">{{ rolePart(sat.tag) }}</span>
            <span class="about-card__name">{{ namePart(sat.tag) }}</span>
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

/* Founder note + anchor portrait share one two-column band */
.section-about__lede {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-12);
  align-items: center;
}

@media (min-width: 900px) {
  .section-about__lede {
    grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
    gap: var(--space-16);
  }
}

.section-about__head {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  max-width: 36rem;
}

.section-about__headline {
  margin: 0;
  text-wrap: balance;
}
.section-about__headline-em {
  color: var(--brand-ink);
}
.section-about__story {
  margin: 0;
  color: var(--ink-secondary);
}

/* ----------------------------------------------------------------
 *  Cards — straight photos, hairline-free, captions below.
 * ---------------------------------------------------------------- */
.about-card {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  min-width: 0;
}

.about-card__media {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  border-radius: var(--radius-lg);
  background: var(--bg-tinted);
}
.about-card__media :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
  transition: transform 500ms var(--ease-out-quart);
}

@media (hover: hover) and (pointer: fine) {
  .about-card:hover .about-card__media :deep(img) {
    transform: scale(1.03);
  }
}

.about-card--anchor .about-card__media {
  aspect-ratio: 4 / 5;
}
@media (min-width: 900px) {
  .about-card--anchor {
    justify-self: end;
    width: min(100%, 26rem);
  }
}

.about-card__caption {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}
.about-card__role {
  color: var(--ink-muted);
  letter-spacing: 0.1em;
}
.about-card__name {
  font-family: var(--font-sans);
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--ink-primary);
  line-height: 1.2;
}

/* Teammates: one row on desktop, two-up on small screens */
.section-about__team {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-6);
}
@media (min-width: 768px) {
  .section-about__team {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--space-8);
  }
}

@media (prefers-reduced-motion: reduce) {
  .about-card__media :deep(img) {
    transition: none;
  }
}
</style>
