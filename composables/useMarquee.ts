/**
 * Marquee pause helper. The horizontal drift itself is pure CSS keyframes
 * for performance; this composable wires up `:hover` and `:focus-within`
 * to set `animation-play-state` via a reactive `paused` Ref.
 *
 * Reduced-motion is enforced separately by the global `@media
 * (prefers-reduced-motion: reduce)` rule, but we also expose a `paused`
 * Ref so the component can apply class bindings.
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'

export function useMarquee(target: () => HTMLElement | null) {
  const paused = ref(false)

  if (import.meta.server) return { paused }

  let el: HTMLElement | null = null
  const onEnter = () => { paused.value = true }
  const onLeave = () => { paused.value = false }

  onMounted(() => {
    el = target()
    if (!el) return
    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mouseleave', onLeave)
    el.addEventListener('focusin', onEnter)
    el.addEventListener('focusout', onLeave)
  })
  onBeforeUnmount(() => {
    el?.removeEventListener('mouseenter', onEnter)
    el?.removeEventListener('mouseleave', onLeave)
    el?.removeEventListener('focusin', onEnter)
    el?.removeEventListener('focusout', onLeave)
  })

  return { paused }
}
