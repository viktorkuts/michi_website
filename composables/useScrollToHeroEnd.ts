/**
 * Smoothly scroll the page to the position where the hero's text reveals
 * are fully complete (~scroll progress 0.97). The hero is 150vh tall;
 * targetting 97% of (sectionHeight - viewportHeight) lands the user at
 * the final frame with the App Store / Play Store CTAs fully visible.
 *
 * Usable from anywhere on the home route. From other routes, store a
 * flag in sessionStorage and call this on the home page once mounted.
 */
import { nextTick } from 'vue'

const FLAG = 'synq:scroll-to-hero-end'
const TARGET_PROGRESS = 0.97

export function scrollToHeroEnd() {
  if (import.meta.server) return false
  const hero = document.getElementById('hero')
  if (!hero) return false
  const total = hero.offsetHeight - window.innerHeight
  if (total <= 0) return false
  const target = hero.offsetTop + Math.max(0, total * TARGET_PROGRESS)
  window.scrollTo({ top: target, behavior: 'smooth' })
  return true
}

export function requestHeroEndScroll() {
  if (import.meta.server) return
  try { sessionStorage.setItem(FLAG, '1') } catch { /* private mode etc. */ }
}

export function consumeHeroEndScrollIfPending() {
  if (import.meta.server) return
  try {
    if (sessionStorage.getItem(FLAG) === '1') {
      sessionStorage.removeItem(FLAG)
      // Wait for the page paint + frame preload to settle before scrolling
      nextTick(() => {
        requestAnimationFrame(() => scrollToHeroEnd())
      })
    }
  } catch { /* ignore */ }
}
