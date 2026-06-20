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

      <!-- B) Asymmetric image grid -->
      <div class="section-about__grid">
        <!-- Anchor (large, slightly right of center) -->
        <figure v-if="anchor" class="about-img about-img--anchor">
          <UiTag class="about-img__tag">{{ anchor.tag }}</UiTag>
          <span class="about-img__media">
            <NuxtImg
              :src="`/about/${anchor.file}`"
              :alt="anchor.tag"
              width="1200"
              height="800"
              loading="lazy"
              fit="cover"
            />
          </span>
        </figure>

        <!-- Satellites -->
        <figure
          v-for="(sat, i) in satellites"
          :key="sat.file"
          class="about-img"
          :class="`about-img--sat-${i + 1}`"
        >
          <UiTag class="about-img__tag">{{ sat.tag }}</UiTag>
          <span class="about-img__media">
            <NuxtImg
              :src="`/about/${sat.file}`"
              :alt="sat.tag"
              width="600"
              height="600"
              loading="lazy"
              fit="cover"
            />
          </span>
        </figure>

        <!-- Floating quote — signed by the founder -->
        <div class="about-quote">
          <p class="type-display-sm type-italic about-quote__text">
            &ldquo;I'm building the app I wanted to open myself —
            then close, and walk out the door.&rdquo;
          </p>
          <svg
            class="about-quote__sig"
            viewBox="0 0 120 32"
            aria-hidden="true"
          >
            <path
              d="M4,22 C18,4 30,30 44,12 C58,-2 72,28 86,10 C100,-4 110,18 116,14"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            />
            <circle cx="116" cy="14" r="2" fill="currentColor" />
          </svg>
          <p class="type-caption about-quote__byline">
            TARAS BARANOVSKYY · FOUNDER &amp; CEO
          </p>
        </div>

        <!-- Pagination indicator (decorative) -->
        <span class="about-pagination type-caption">01 / —</span>
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
 *  Asymmetric grid
 *  Built with explicit row tracks + grid placement so nothing bleeds.
 * ---------------------------------------------------------------- */
.section-about__grid {
  display: grid;
  position: relative;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: auto;
  gap: var(--space-6);
  min-height: 600px;
}

@media (min-width: 1024px) {
  .section-about__grid {
    /* Two image rows + a content-sized row for the founder quote.
       The quote previously shared row 3 with a fourth satellite image;
       with three teammates the row shrinks to just the byline so we
       don't leave a 220px hole on the right. */
    grid-template-rows: 220px 220px auto;
    gap: var(--space-12);
    min-height: 600px;
  }
}

.about-img {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.about-img__tag {
  padding-left: 2px;
}

.about-img__media {
  display: block;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, #ECE6D8, #D6CFBE);
  transition: transform 600ms var(--ease-out-quart);
}
.about-img__media :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (hover: hover) and (pointer: fine) {
  .about-img:hover .about-img__media {
    transform: scale(1.015);
  }
}

/* Mobile placement (default): each image is full width, stacked */
.about-img {
  grid-column: 1 / -1;
  height: 280px;
}

/* Desktop placement — asymmetric */
@media (min-width: 1024px) {
  .about-img--anchor {
    grid-column: 4 / 11;
    grid-row: 1 / 3;
    height: auto;
  }
  .about-img--sat-1 {
    grid-column: 1 / 4;
    grid-row: 1 / 2;
    height: auto;
  }
  .about-img--sat-2 {
    grid-column: 1 / 4;
    grid-row: 2 / 3;
    height: auto;
  }
  .about-img--sat-3 {
    grid-column: 11 / 13;
    grid-row: 2 / 3;
    height: auto;
  }
}

/* Floating quote */
.about-quote {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  align-self: end;
}
@media (max-width: 1023px) {
  .about-quote {
    grid-column: 1 / -1;
    margin-top: var(--space-6);
  }
}
@media (min-width: 1024px) {
  .about-quote {
    grid-column: 1 / 5;
    grid-row: 3 / 4;
    align-self: start;
    padding-top: var(--space-8);
  }
}

.about-quote__text {
  margin: 0;
  font-weight: 500;
  text-wrap: balance;
  max-width: 26ch;
  color: var(--ink-primary);
}
.about-quote__text :first-letter {
  /* Drops the opening quote mark to a slightly cooler ink so the
     sentence reads first, the punctuation second. */
  color: var(--ink-muted);
}
.about-quote__sig {
  width: 80px;
  height: auto;
  color: var(--brand);
  margin-left: 2px;
}
.about-quote__byline {
  margin: 0;
  margin-top: var(--space-1);
  color: var(--ink-muted);
  letter-spacing: 0.08em;
}

/* Pagination */
.about-pagination {
  position: absolute;
  bottom: -1.5rem;
  right: 0;
  color: var(--ink-muted);
}
@media (min-width: 1024px) {
  .about-pagination {
    bottom: var(--space-3);
    right: var(--space-3);
  }
}
</style>
