<script setup lang="ts">
/**
 * Live ticker — the page's heartbeat. Bottom-right floating chip.
 * Numbers nudge every 6–10 seconds to telegraph that the product is
 * live without fabricating analytics.
 *
 * Hidden when:
 *  - reduced-motion is on (the ticking would be the noisiest motion)
 *  - viewport is narrow (mobile tab bar already crowds bottom)
 *  - element is hovered/focused (full-readable, no movement)
 */
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const reduced = useReducedMotion()
const mounted = ref(false)
const visible = ref(false)
const isHover = ref(false)

const plans = ref(47)
const within = ref(6)
const tickFlash = ref(false)
let tickTimer: number | null = null
let revealTimer: number | null = null

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function tick() {
  if (isHover.value) return
  // Drift plans by -2..+3, within by -1..+1, gently bounded.
  plans.value = Math.max(28, Math.min(82, plans.value + rand(-2, 3)))
  within.value = Math.max(2, Math.min(14, within.value + rand(-1, 1)))
  tickFlash.value = true
  window.setTimeout(() => (tickFlash.value = false), 320)
}

function scheduleNext() {
  if (tickTimer !== null) clearTimeout(tickTimer)
  tickTimer = window.setTimeout(() => {
    tick()
    scheduleNext()
  }, rand(6000, 10000))
}

const isCompact = ref(false)
function syncCompact() {
  if (import.meta.server) return
  isCompact.value = window.matchMedia('(max-width: 767px)').matches
}

onMounted(() => {
  mounted.value = true
  syncCompact()
  window.addEventListener('resize', syncCompact, { passive: true })
  if (reduced.value || isCompact.value) return
  // Reveal after a beat so it doesn't fight the hero load animation.
  revealTimer = window.setTimeout(() => {
    visible.value = true
  }, 1400)
  scheduleNext()
})

onBeforeUnmount(() => {
  if (tickTimer !== null) clearTimeout(tickTimer)
  if (revealTimer !== null) clearTimeout(revealTimer)
  if (import.meta.client) window.removeEventListener('resize', syncCompact)
})

const showTicker = computed(() => mounted.value && !reduced.value && !isCompact.value)
</script>

<template>
  <Transition name="ticker">
    <aside
      v-if="showTicker"
      v-show="visible"
      class="live-ticker"
      :class="{ 'is-hover': isHover, 'is-flash': tickFlash }"
      role="status"
      aria-live="polite"
      aria-label="Synq live activity"
      @mouseenter="isHover = true"
      @mouseleave="isHover = false"
      @focusin="isHover = true"
      @focusout="isHover = false"
    >
      <span class="live-ticker__dot" aria-hidden="true" />
      <span class="live-ticker__main tabular-nums">
        <span class="live-ticker__num">{{ plans }}</span>
        <span class="live-ticker__sub">PLANS LIVE</span>
      </span>
      <span class="live-ticker__sep" aria-hidden="true" />
      <span class="live-ticker__main tabular-nums">
        <span class="live-ticker__num">{{ within }}</span>
        <span class="live-ticker__sub">WITHIN 1 MI</span>
      </span>
    </aside>
  </Transition>
</template>

<style scoped>
.live-ticker {
  position: fixed;
  z-index: var(--z-toast);
  right: var(--space-6);
  bottom: var(--space-6);
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-4);
  border-radius: 999px;
  background: rgb(20 18 26 / 0.86);
  backdrop-filter: saturate(140%) blur(14px);
  -webkit-backdrop-filter: saturate(140%) blur(14px);
  color: var(--bg-primary);
  border: 1px solid rgb(247 244 238 / 0.10);
  box-shadow:
    0 1px 0 rgb(247 244 238 / 0.06) inset,
    0 24px 60px -24px rgb(0 0 0 / 0.4);
  font-family: var(--font-mono);
  /* Pointer-events on so hover pause works; the chip is small and
     bottom-anchored, won't trap unintended scroll. */
  cursor: default;
  transition:
    transform 320ms var(--ease-out-expo),
    background 320ms ease,
    opacity 320ms ease;
}
.live-ticker.is-hover {
  background: rgb(20 18 26 / 0.96);
  transform: translateY(-2px);
}

.live-ticker__dot {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: var(--brand);
  box-shadow: 0 0 0 0 rgb(192 65 28 / 0.6);
  animation: tickerPulse 2.4s var(--ease-in-out-3) infinite;
}
@keyframes tickerPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgb(192 65 28 / 0.55); }
  60%      { box-shadow: 0 0 0 8px rgb(192 65 28 / 0); }
}

.live-ticker__main {
  display: inline-flex;
  align-items: baseline;
  gap: var(--space-2);
}
.live-ticker__num {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.005em;
  color: var(--bg-primary);
  transition:
    color 200ms ease,
    transform 240ms var(--ease-out-expo);
}
.live-ticker.is-flash .live-ticker__num {
  color: var(--brand);
}
.live-ticker__sub {
  font-size: 10.5px;
  font-weight: 500;
  letter-spacing: 0.10em;
  color: rgb(247 244 238 / 0.55);
}

.live-ticker__sep {
  width: 1px;
  height: 14px;
  background: rgb(247 244 238 / 0.16);
  align-self: center;
}

/* Reveal */
.ticker-enter-active,
.ticker-leave-active {
  transition:
    opacity 360ms var(--ease-out-expo),
    transform 360ms var(--ease-out-expo);
}
.ticker-enter-from,
.ticker-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
