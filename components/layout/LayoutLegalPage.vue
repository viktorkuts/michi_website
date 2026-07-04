<script setup lang="ts">
interface Toc {
  id: string
  text: string
  depth: number
}

interface Props {
  title: string
  updated?: string
  toc?: Toc[]
}
defineProps<Props>()

const activeId = ref('')

onMounted(() => {
  const headings = Array.from(document.querySelectorAll('.legal-body h2[id], .legal-body h3[id]'))
  if (!headings.length) return
  const obs = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        activeId.value = entry.target.id
      }
    }
  }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 })
  for (const h of headings) obs.observe(h)
  onBeforeUnmount(() => obs.disconnect())
})

const showBackToTop = ref(false)
function onScroll() {
  showBackToTop.value = window.scrollY > window.innerHeight * 0.5
}
onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

function scrollTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <UiSectionShell bg="primary">
    <article class="legal-page">
      <header class="legal-page__head">
        <UiSectionEyebrow>LEGAL</UiSectionEyebrow>
        <h1 class="type-display-md legal-page__title">{{ title }}</h1>
        <p v-if="updated" class="legal-page__meta type-caption">
          Last updated · {{ updated }}
        </p>
      </header>

      <div class="legal-page__layout">
        <aside v-if="toc?.length" class="legal-page__toc" aria-label="On this page">
          <UiSectionEyebrow>ON THIS PAGE</UiSectionEyebrow>
          <ul>
            <li
              v-for="item in toc"
              :key="item.id"
              :class="['legal-page__toc-item', `depth-${item.depth}`, { 'is-active': activeId === item.id }]"
            >
              <a :href="`#${item.id}`">{{ item.text }}</a>
            </li>
          </ul>
        </aside>

        <div class="legal-body">
          <slot />
        </div>
      </div>

      <Transition name="back-top">
        <button
          v-if="showBackToTop"
          type="button"
          class="legal-page__top"
          aria-label="Back to top"
          @click="scrollTop"
        >
          ↑
        </button>
      </Transition>
    </article>
  </UiSectionShell>
</template>

<style scoped>
.legal-page {
  position: relative;
  padding-top: var(--space-8);
}

/* ----------------------------------------------------------------
 *  Page head — eyebrow → title → meta. The meta line sits *below*
 *  the title (not above) so the eyebrow + title own the visual top
 *  and the date reads as a secondary footer-of-the-header.
 * ---------------------------------------------------------------- */
.legal-page__head {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  max-width: 45rem;
  margin-bottom: var(--space-16);
  padding-bottom: var(--space-8);
  border-bottom: 1px solid var(--rule);
}
.legal-page__title {
  margin: 0;
  text-wrap: balance;
}
.legal-page__meta {
  margin: 0;
  color: var(--ink-muted);
}

.legal-page__layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-12);
}
@media (min-width: 1024px) {
  .legal-page__layout {
    grid-template-columns: 220px 1fr;
    gap: var(--space-16);
  }
}

.legal-page__toc {
  position: sticky;
  top: calc(var(--space-16) + 56px);
  align-self: start;
  display: none;
  flex-direction: column;
  gap: var(--space-4);
}
@media (min-width: 1024px) {
  .legal-page__toc {
    display: flex;
  }
}
.legal-page__toc ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.legal-page__toc-item a {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-sans);
  font-size: 0.875rem;
  color: var(--ink-muted);
  text-decoration: none;
  transition: color 200ms ease;
}
.legal-page__toc-item.depth-3 a {
  padding-left: var(--space-3);
}
.legal-page__toc-item a::before {
  content: '';
  width: 4px;
  height: 4px;
  border-radius: 999px;
  background: transparent;
  transition: background 200ms ease;
}
.legal-page__toc-item.is-active a {
  color: var(--ink-primary);
}
.legal-page__toc-item.is-active a::before {
  background: var(--brand-ink);
}

.legal-body {
  max-width: 42rem; /* ~66 ch at body-lg — the legal-reading sweet spot */
}

/* ----------------------------------------------------------------
 *  Heading hierarchy
 *  --------------
 *  h1 in body is suppressed: the page header already prints the
 *  document title, and a second h1 inside the body would create a
 *  duplicate-h1 a11y violation. Markdown files no longer carry a
 *  top-level `# Title`, but we keep the rule here as a safety net.
 *
 *  h2 / h3 size step is now ~33% (1.5rem → 1.125rem) instead of
 *  the previous 17%, so subsections read distinctly from sections
 *  without competing with body copy. Both headings carry
 *  scroll-margin-top so TOC anchor links land below the fixed nav
 *  instead of disappearing under it.
 * ---------------------------------------------------------------- */
.legal-body :deep(h1) {
  display: none;
}
.legal-body :deep(h2) {
  font-family: var(--font-sans);
  font-size: 1.5rem;
  line-height: 1.3;
  letter-spacing: -0.015em;
  font-weight: 600;
  color: var(--ink-primary);
  margin: var(--space-16) 0 var(--space-4);
  padding-top: var(--space-8);
  border-top: 1px solid var(--rule);
  scroll-margin-top: 96px;
  text-wrap: balance;
}
.legal-body :deep(h2:first-child) {
  margin-top: 0;
  padding-top: 0;
  border-top: 0;
}
.legal-body :deep(h3) {
  font-family: var(--font-sans);
  font-size: 1.125rem;
  line-height: 1.4;
  letter-spacing: -0.005em;
  font-weight: 600;
  color: var(--ink-primary);
  margin: var(--space-8) 0 var(--space-3);
  scroll-margin-top: 96px;
}

.legal-body :deep(p) {
  font-family: var(--font-sans);
  font-size: var(--type-body-lg-size);
  line-height: var(--type-body-lg-line);
  letter-spacing: var(--type-body-lg-track);
  font-weight: var(--type-body-lg-weight);
  color: var(--ink-secondary);
  margin: 0 0 var(--space-4);
}

/* Lead paragraph treatment — applied to the document's first paragraph
 * AND the first paragraph after each h2. Bumped slightly and shifted to
 * primary ink so the eye anchors there before scanning the bullets. */
.legal-body :deep(p:first-of-type),
.legal-body :deep(h2 + p) {
  color: var(--ink-primary);
  font-size: clamp(1.0625rem, 0.95rem + 0.4375vw, 1.1875rem);
}

.legal-body :deep(ul),
.legal-body :deep(ol) {
  font-family: var(--font-sans);
  font-size: var(--type-body-lg-size);
  line-height: var(--type-body-lg-line);
  letter-spacing: var(--type-body-lg-track);
  font-weight: var(--type-body-lg-weight);
  color: var(--ink-secondary);
  padding-left: var(--space-6);
  margin: 0 0 var(--space-6);
}
.legal-body :deep(li) {
  margin-bottom: var(--space-3);
  padding-left: var(--space-1);
}
.legal-body :deep(li::marker) {
  color: var(--ink-muted);
}

/* Strong/bold: list-item label pattern (`**Account info.** body...`)
 * uses bold to introduce a definition. Promote to ink-primary so the
 * label reads as the visual anchor of each row. */
.legal-body :deep(strong),
.legal-body :deep(b) {
  font-weight: 600;
  color: var(--ink-primary);
}

/* Real italic, not the prior mono-uppercase hack. */
.legal-body :deep(em),
.legal-body :deep(i) {
  font-style: italic;
  color: inherit;
}

.legal-body :deep(a) {
  color: var(--ink-primary);
  text-decoration: underline;
  text-decoration-color: var(--rule);
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
  transition: text-decoration-color 200ms ease, color 200ms ease;
}
.legal-body :deep(a:hover) {
  text-decoration-color: var(--brand-ink);
  color: var(--brand-ink);
}

.legal-body :deep(hr) {
  border: 0;
  border-top: 1px solid var(--rule);
  margin: var(--space-12) 0;
}

.legal-body :deep(code) {
  font-family: var(--font-mono);
  font-size: 0.9em;
  background: var(--bg-secondary);
  border: 1px solid var(--rule);
  border-radius: var(--radius-sm);
  padding: 0.1em 0.35em;
}

.legal-page__top {
  position: fixed;
  bottom: var(--space-6);
  right: var(--space-6);
  width: 44px;
  height: 44px;
  border-radius: var(--radius-pill);
  background: var(--bg-secondary);
  border: 1px solid var(--rule);
  color: var(--ink-primary);
  font-size: 1.125rem;
  cursor: pointer;
  z-index: var(--z-overlay);
  transition: transform 160ms var(--ease-out-expo), border-color 200ms ease;
}
.legal-page__top:hover {
  border-color: var(--ink-primary);
}
.legal-page__top:active {
  transform: scale(0.97);
}

.back-top-enter-active,
.back-top-leave-active {
  transition: opacity 240ms ease, transform 240ms var(--ease-out-expo);
}
.back-top-enter-from,
.back-top-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
