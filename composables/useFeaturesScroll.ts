/**
 * Pinned, scrub-driven scroll experience for §6 Features. Runs at every
 * viewport width, touch included; vertical scroll drives the step change.
 *
 *   const { activeIndex, enabled } = useFeaturesScroll(sectionRef, pinRef, {
 *     steps: 5,
 *     scrub: 0.5,
 *   })
 *
 * Bails out (enabled.value stays false) only on prefers-reduced-motion:
 * the CSS fallback then shows all steps stacked and activeIndex is unused.
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
    if (reduced) return

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
