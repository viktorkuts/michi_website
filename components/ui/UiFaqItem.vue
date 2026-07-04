<script setup lang="ts">
import { ref } from 'vue'
import { motion } from 'motion-v'
import { Plus } from 'lucide-vue-next'

defineProps<{ question: string }>()

const isOpen = ref(false)
</script>

<template>
  <motion.div
    :animate="isOpen ? 'open' : 'closed'"
    class="faq-item"
    :class="{ 'is-open': isOpen }"
  >
    <button
      type="button"
      class="faq-item__head"
      :aria-expanded="isOpen"
      @click="isOpen = !isOpen"
    >
      <span class="faq-item__q">{{ question }}</span>
      <motion.span
        :variants="{ open: { rotate: '45deg' }, closed: { rotate: '0deg' } }"
        :transition="{ duration: 0.2 }"
        class="faq-item__icon"
        aria-hidden="true"
      >
        <Plus :size="18" />
      </motion.span>
    </button>

    <motion.div
      :initial="false"
      :animate="{
        height: isOpen ? 'auto' : '0px',
      }"
      :transition="{ duration: 0.3, ease: 'easeOut' }"
      class="faq-item__body-wrap"
    >
      <p class="faq-item__body"><slot /></p>
    </motion.div>
  </motion.div>
</template>

<style scoped>
/* Hairline list row — no card chrome */
.faq-item {
  border-top: 1px solid var(--rule);
}

.faq-item__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  width: 100%;
  padding-block: var(--space-4);
  text-align: left;
  background: transparent;
  border: 0;
  cursor: pointer;
}

.faq-item__q {
  font-family: var(--font-sans);
  font-size: 1.0625rem;
  font-weight: 500;
  line-height: 1.4;
  color: var(--ink-primary);
}

.faq-item__icon {
  display: inline-flex;
  flex-shrink: 0;
  color: var(--ink-muted);
  transition: color 200ms ease;
}
.faq-item.is-open .faq-item__icon {
  color: var(--ink-primary);
}

.faq-item__body-wrap {
  overflow: hidden;
}

.faq-item__body {
  font-family: var(--font-sans);
  font-size: 0.9375rem;
  line-height: 1.65;
  color: var(--ink-secondary);
  margin: 0;
  max-width: 65ch;
  padding-bottom: var(--space-4);
}

@media (prefers-reduced-motion: reduce) {
  .faq-item__icon { transition: none; }
}
</style>
