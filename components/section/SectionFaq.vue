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

      <header class="section-faq__header">
        <UiSectionEyebrow dot>FAQ</UiSectionEyebrow>
        <h2 class="type-display-md section-faq__title">Before you ask.</h2>
      </header>

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
          {{ tab }}
        </button>
      </div>

      <div class="section-faq__list">
        <AnimatePresence mode="wait">
          <motion.div
            :key="activeTab"
            :initial="{ opacity: 0, y: 12 }"
            :animate="{ opacity: 1, y: 0 }"
            :exit="{ opacity: 0, y: -8 }"
            :transition="{ duration: 0.25, ease: 'easeOut' }"
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
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  max-width: 48rem;
}

.section-faq__header {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.section-faq__title {
  margin: 0;
  text-wrap: balance;
}

/* Tabs — system pills: hairline default, ink fill when active */
.section-faq__tabs {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.section-faq__tab {
  padding: var(--space-2) var(--space-4);
  border: 1px solid var(--rule);
  border-radius: var(--radius-pill);
  font-family: var(--font-sans);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--ink-secondary);
  background: transparent;
  cursor: pointer;
  transition:
    color var(--dur-micro) var(--ease-out-quart),
    background-color var(--dur-micro) var(--ease-out-quart),
    border-color var(--dur-micro) var(--ease-out-quart);
  min-height: 40px;
}
.section-faq__tab:hover {
  color: var(--ink-primary);
  border-color: var(--ink-muted);
}
.section-faq__tab.is-active {
  color: var(--bg-primary);
  background: var(--ink-primary);
  border-color: var(--ink-primary);
}

.section-faq__list {
  width: 100%;
}

.section-faq__items {
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid var(--rule);
}
</style>
