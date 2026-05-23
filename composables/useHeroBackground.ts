/**
 * Shared reactive state for the hero's perceived background brightness.
 *
 *   luminance:  0..1 average relative luminance of the canvas region
 *               directly behind the text overlay. 1 = full-ivory, 0 = full-ink.
 *   overHero:   true while the hero section is the dominant section in
 *               the viewport. The nav uses this to decide whether to invert
 *               its tint or stay in default ink mode.
 *   onDark:     derived — luminance < threshold AND overHero. Single bool
 *               components can class-bind against.
 *
 * The hero section writes to this state. The nav (and anything else
 * floating over the hero) reads from it.
 */
import { computed } from 'vue'

const DARK_THRESHOLD = 0.45

interface HeroBgState {
  luminance: number
  overHero: boolean
}

export function useHeroBackground() {
  const state = useState<HeroBgState>('hero-bg', () => ({
    luminance: 1,
    overHero: false,
  }))

  const onDark = computed(() =>
    state.value.overHero && state.value.luminance < DARK_THRESHOLD,
  )

  function set(luminance: number, overHero: boolean) {
    if (state.value.luminance !== luminance) state.value.luminance = luminance
    if (state.value.overHero !== overHero) state.value.overHero = overHero
  }

  return { state, onDark, set }
}
