<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { X } from 'lucide-vue-next'

interface Props {
  open: boolean
  src: string
  alt?: string
  tag?: string
}
const props = defineProps<Props>()
const emit = defineEmits<{ (e: 'close'): void }>()

const dialog = ref<HTMLDivElement | null>(null)

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}

watch(() => props.open, (isOpen) => {
  if (import.meta.server) return
  if (isOpen) {
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeydown)
    requestAnimationFrame(() => dialog.value?.focus())
  } else {
    document.body.style.overflow = ''
    document.removeEventListener('keydown', onKeydown)
  }
})

onBeforeUnmount(() => {
  if (import.meta.client) {
    document.body.style.overflow = ''
    document.removeEventListener('keydown', onKeydown)
  }
})

onMounted(() => {})
</script>

<template>
  <Transition name="ui-lightbox">
    <div
      v-if="open"
      ref="dialog"
      class="ui-lightbox"
      role="dialog"
      aria-modal="true"
      tabindex="-1"
      @click.self="$emit('close')"
    >
      <button
        type="button"
        class="ui-lightbox__close"
        aria-label="Close lightbox"
        @click="$emit('close')"
      >
        <X :size="20" :stroke-width="1.5" />
      </button>

      <figure class="ui-lightbox__figure">
        <img :src="src" :alt="alt ?? ''" class="ui-lightbox__img" />
        <figcaption v-if="tag" class="ui-lightbox__tag type-caption">
          {{ tag }}
        </figcaption>
      </figure>
    </div>
  </Transition>
</template>

<style scoped>
.ui-lightbox {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal);
  background: rgb(20 18 26 / 0.92);
  display: grid;
  place-items: center;
  padding: var(--space-6);
  outline: 0;
}
.ui-lightbox__figure {
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  max-width: 100%;
  max-height: 90vh;
}
.ui-lightbox__img {
  max-width: 100%;
  max-height: 84vh;
  border-radius: var(--radius-lg);
  border: 1px solid rgb(247 244 238 / 0.1);
  object-fit: contain;
}
.ui-lightbox__tag {
  color: rgb(247 244 238 / 0.7);
  letter-spacing: 0.08em;
}
.ui-lightbox__close {
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-pill);
  border: 1px solid rgb(247 244 238 / 0.2);
  color: var(--bg-primary);
  background: transparent;
  cursor: pointer;
  transition:
    transform 160ms var(--ease-out-expo),
    border-color 200ms ease;
}
.ui-lightbox__close:hover {
  border-color: rgb(247 244 238 / 0.6);
}
.ui-lightbox__close:active {
  transform: scale(0.95);
}

.ui-lightbox-enter-active,
.ui-lightbox-leave-active {
  transition: opacity 240ms var(--ease-out-expo);
}
.ui-lightbox-enter-active .ui-lightbox__figure,
.ui-lightbox-leave-active .ui-lightbox__figure {
  transition: transform 240ms var(--ease-out-expo), opacity 240ms ease;
}
.ui-lightbox-enter-from,
.ui-lightbox-leave-to {
  opacity: 0;
}
.ui-lightbox-enter-from .ui-lightbox__figure,
.ui-lightbox-leave-to .ui-lightbox__figure {
  opacity: 0;
  transform: scale(0.95);
}
</style>
