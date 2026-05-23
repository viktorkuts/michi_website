/**
 * IntersectionObserver-based active-section tracker.
 *
 * Pass the section IDs in document order and a Ref<HTMLElement[]> of the
 * matching elements. The composable returns the currently most-visible
 * section ID.
 *
 * Use in nav for the brand-color dot indicator (FLIP via motion-v).
 * Updates `history.replaceState` so the URL hash matches the active section
 * without triggering a page jump.
 */
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

export function useActiveSection(sectionIds: string[], options: {
  rootMargin?: string
  threshold?: number
  syncHash?: boolean
} = {}) {
  const active = ref<string>(sectionIds[0] ?? '')
  if (import.meta.server) return active

  let observer: IntersectionObserver | null = null
  const visibility = new Map<string, number>()

  onMounted(() => {
    observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        visibility.set(entry.target.id, entry.intersectionRatio)
      }
      // Pick the section with the highest visibility ratio
      let best = active.value
      let bestRatio = -1
      for (const id of sectionIds) {
        const r = visibility.get(id) ?? 0
        if (r > bestRatio) {
          bestRatio = r
          best = id
        }
      }
      active.value = best
    }, {
      rootMargin: options.rootMargin ?? '-20% 0px -50% 0px',
      threshold: options.threshold !== undefined ? options.threshold : [0, 0.25, 0.5, 0.75, 1],
    })

    for (const id of sectionIds) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    observer = null
  })

  if (options.syncHash !== false) {
    watch(active, (id) => {
      if (!id) return
      const desired = `#${id}`
      if (window.location.hash !== desired) {
        window.history.replaceState(null, '', desired)
      }
    })
  }

  return active
}
