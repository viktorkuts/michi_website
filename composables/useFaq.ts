/**
 * FAQ tabs + accordion state.
 *
 * Tab change: tracked via active tab index, animation is layout-driven by
 * motion-v on the tab indicator (in the component).
 *
 * Accordion: only one item open at a time per tab. Tab switch closes all
 * items so the next tab opens with a clean state.
 */
import { ref, watch } from 'vue'

export function useFaq(tabCount: number) {
  const activeTab = ref(0)
  const openIndex = ref<number | null>(null)

  function selectTab(i: number) {
    if (i < 0 || i >= tabCount) return
    activeTab.value = i
  }

  function toggleItem(i: number) {
    openIndex.value = openIndex.value === i ? null : i
  }

  watch(activeTab, () => {
    openIndex.value = null
  })

  return { activeTab, openIndex, selectTab, toggleItem }
}
