/**
 * Nav visibility state machine — drives transparent / frosted / idle states.
 *
 *   OVER_HERO          y < hero height, fully transparent bg, ink text
 *   SCROLLED           y >= hero height, frosted glass bg
 *   IDLE_MID_SCROLL    no input for 2.5s, opacity 0.4 (never fully hidden)
 *   ACTIVE_INPUT       any scroll/move within last 2.5s, opacity 1
 *
 * State is two axes — `surface` (transparent | frosted) × `attention`
 * (active | idle). Components consume both refs.
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'

export function useNavState(opts: { heroSelector?: string } = {}) {
  const surface = ref<'transparent' | 'frosted'>('transparent')
  const attention = ref<'active' | 'idle'>('active')

  if (import.meta.server) return { surface, attention }

  const heroSelector = opts.heroSelector || '[data-hero-section]'
  let idleTimer: number | null = null
  const IDLE_MS = 2500

  const markActive = () => {
    attention.value = 'active'
    if (idleTimer) window.clearTimeout(idleTimer)
    idleTimer = window.setTimeout(() => { attention.value = 'idle' }, IDLE_MS)
  }

  const onScroll = () => {
    markActive()
    const hero = document.querySelector(heroSelector) as HTMLElement | null
    const heroBottom = hero ? hero.offsetTop + hero.offsetHeight : 0
    surface.value = window.scrollY >= heroBottom - 64 ? 'frosted' : 'transparent'
  }

  const onMove = () => { markActive() }

  onMounted(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('keydown', onMove, { passive: true })
    onScroll()
  })
  onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('keydown', onMove)
    if (idleTimer) window.clearTimeout(idleTimer)
  })

  return { surface, attention }
}
