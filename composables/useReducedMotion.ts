/**
 * Reactive wrapper around `prefers-reduced-motion: reduce`.
 * Returns a Ref<boolean> — true when the user has requested reduced motion.
 * Safe to call in SSR (defaults to false on the server).
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'

export function useReducedMotion() {
  const reduced = ref(false)
  if (import.meta.server) return reduced

  let mql: MediaQueryList | null = null
  const update = () => { reduced.value = !!mql?.matches }

  onMounted(() => {
    mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    update()
    mql.addEventListener('change', update)
  })
  onBeforeUnmount(() => {
    mql?.removeEventListener('change', update)
  })

  return reduced
}
