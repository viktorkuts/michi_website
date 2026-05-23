/**
 * Pinned, scrub-driven scroll experience for §6 Features.
 *
 *   const { activeIndex, enabled } = useFeaturesScroll(sectionRef, pinRef, {
 *     steps: 5,
 *     scrub: 0.5,
 *   })
 *
 * Bails out (enabled.value stays false) on:
 *   - prefers-reduced-motion: reduce
 *   - touch devices: (hover: none) and (pointer: coarse)
 *
 * In bail-out mode, callers fall back to the stack layout. activeIndex stays
 * at 0 — the stack layout shows all features simultaneously, so it is unused.
 *
 * Pin distance = steps × 100vh, computed dynamically so resizes work.
 */
import { ref, onMounted, onBeforeUnmount, type Ref } from 'vue'

interface Options {
  steps: number
  scrub?: number
}

export function useFeaturesScroll(
  sectionRef: Ref<HTMLElement | null>,
  pinRef: Ref<HTMLElement | null>,
  options: Options,
) {
  const steps = options.steps
  const scrubAmount = options.scrub ?? 0.5

  const activeIndex = ref(0)
  const enabled = ref(false)

  let trigger: { kill: () => void } | null = null
  let raf: number | null = null

  async function setup() {
    if (import.meta.server) return
    if (!sectionRef.value || !pinRef.value) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const touch = window.matchMedia('(hover: none) and (pointer: coarse)').matches
    // Narrow viewports use the stacked vertical layout (CSS), so the pin
    // must not engage — a 100dvh pin there clips the taller stacked content.
    const narrow = window.matchMedia('(max-width: 1023px)').matches
    if (reduced || touch || narrow) return

    const [{ gsap }, { ScrollTrigger }] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ])
    gsap.registerPlugin(ScrollTrigger)

    if (!sectionRef.value || !pinRef.value) return

    trigger = ScrollTrigger.create({
      trigger: sectionRef.value,
      start: 'top top',
      end: () => '+=' + window.innerHeight * steps,
      pin: pinRef.value,
      pinSpacing: true,
      scrub: scrubAmount,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate(self) {
        const idx = Math.min(steps - 1, Math.max(0, Math.floor(self.progress * steps)))
        if (activeIndex.value !== idx) activeIndex.value = idx
      },
    })

    enabled.value = true
  }

  onMounted(() => {
    raf = requestAnimationFrame(() => { setup() })
  })

  onBeforeUnmount(() => {
    if (raf !== null) cancelAnimationFrame(raf)
    if (trigger) {
      trigger.kill()
      trigger = null
    }
  })

  return { activeIndex, enabled }
}
