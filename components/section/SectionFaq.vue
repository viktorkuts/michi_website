<script setup lang="ts">
import { ref, computed } from 'vue'
import { motion, AnimatePresence } from 'motion-v'

interface FaqDoc {
  tab: string
  order: number
  body: any
}

const { data: docs } = await useAsyncData('faq-docs', async () => {
  return await queryCollection('faq').order('order', 'ASC').all()
})

const tabs = computed(() => (docs.value ?? []).map((d: any) => d.tab as string))
const activeTab = ref(0)

function getQa(doc: FaqDoc): Array<{ q: string; a: string }> {
  if (!doc?.body) return []
  const nodes = doc.body.value as Array<[string, Record<string, any>, string]>
  if (!Array.isArray(nodes)) return []

  const items: Array<{ q: string; a: string }> = []
  let current: { q: string; a: string } | null = null

  for (const [tag, , text] of nodes) {
    if (tag === 'h2') {
      if (current) items.push(current)
      current = { q: text, a: '' }
    } else if (current && tag === 'p') {
      current.a = text
    }
  }
  if (current) items.push(current)
  return items
}

const activeQa = computed(() => {
  const doc = docs.value?.[activeTab.value] as FaqDoc | undefined
  return doc ? getQa(doc) : []
})
</script>

<template>
  <UiSectionShell id="faq" bg="primary">
    <div class="section-faq">

      <!-- Header -->
      <header class="section-faq__header">
        <span class="section-faq__eyebrow">Before you ask</span>
        <h2 class="section-faq__title">Frequently asked questions</h2>
        <!-- decorative glow, same as the original -->
        <span class="section-faq__glow" aria-hidden="true" />
      </header>

      <!-- Pill tabs -->
      <div class="section-faq__tabs" role="tablist" aria-label="FAQ categories">
        <button
          v-for="(tab, i) in tabs"
          :key="tab"
          role="tab"
          :aria-selected="activeTab === i"
          class="section-faq__tab"
          :class="{ 'is-active': activeTab === i }"
          @click="activeTab = i"
        >
          <span class="section-faq__tab-label">{{ tab }}</span>
          <AnimatePresence>
            <motion.span
              v-if="activeTab === i"
              :initial="{ y: '100%' }"
              :animate="{ y: '0%' }"
              :exit="{ y: '100%' }"
              :transition="{ duration: 0.5, ease: 'backIn' }"
              class="section-faq__tab-fill"
              aria-hidden="true"
            />
          </AnimatePresence>
        </button>
      </div>

      <!-- FAQ list -->
      <div class="section-faq__list">
        <AnimatePresence mode="wait">
          <motion.div
            :key="activeTab"
            :initial="{ opacity: 0, y: 20 }"
            :animate="{ opacity: 1, y: 0 }"
            :exit="{ opacity: 0, y: 20 }"
            :transition="{ duration: 0.5, ease: 'backIn' }"
            class="section-faq__items"
          >
            <UiFaqItem
              v-for="(qa, i) in activeQa"
              :key="`${activeTab}-${i}`"
              :question="qa.q"
            >
              {{ qa.a }}
            </UiFaqItem>
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  </UiSectionShell>
</template>

<style scoped>
.section-faq {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-10);
}

/* Header */
.section-faq__header {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  text-align: center;
}

.section-faq__eyebrow {
  font-family: var(--font-sans);
  font-size: 0.875rem;
  font-weight: 500;
  background: linear-gradient(
    to right,
    var(--brand),
    color-mix(in srgb, var(--brand) 55%, transparent)
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  margin-bottom: var(--space-2);
}

.section-faq__title {
  font-family: var(--font-sans);
  font-size: clamp(2rem, 1.4rem + 2.5vw, 3rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--ink-primary);
  margin: 0;
}

.section-faq__glow {
  position: absolute;
  top: -350px;
  left: 50%;
  translate: -50% 0;
  /* Never exceed the container width — a fixed 600px overflows narrow
     viewports and would force horizontal page scroll. */
  width: min(600px, 100%);
  height: 500px;
  border-radius: 9999px;
  background: radial-gradient(
    ellipse at center,
    color-mix(in srgb, var(--brand) 10%, transparent),
    transparent 70%
  );
  pointer-events: none;
  z-index: 0;
}

/* Tabs */
.section-faq__tabs {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-3);
}

.section-faq__tab {
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  padding: 0.375rem 0.75rem;
  border: 1px solid var(--rule);
  border-radius: 0.375rem;
  font-family: var(--font-sans);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--ink-muted);
  background: transparent;
  cursor: pointer;
  transition: color 300ms ease, border-color 300ms ease;
}
.section-faq__tab:hover {
  color: var(--ink-primary);
}
.section-faq__tab.is-active {
  color: var(--bg-primary);
  border-color: var(--brand);
}

.section-faq__tab-label {
  position: relative;
  z-index: 1;
}

.section-faq__tab-fill {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: linear-gradient(
    to right,
    var(--brand),
    color-mix(in srgb, var(--brand) 80%, transparent)
  );
}

/* List */
.section-faq__list {
  width: 100%;
  max-width: 48rem;
  margin-top: var(--space-6);
}

.section-faq__items {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
</style>