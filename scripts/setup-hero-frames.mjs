/* Generates a 90-frame placeholder hero sequence for layout development.
 * Each frame is a tiny SVG converted to PNG-style WebP via base64 + sharp,
 * but to keep this dependency-free the script writes raw SVGs as
 * /public/hero/desktop/frame-NNNN.svg + matching .webp duplicates.
 * The hero canvas component should treat .svg fallbacks as acceptable
 * during dev and prefer .webp once real frames are placed.
 *
 * Replace with real WebP frames before launch.
 */

import { mkdirSync, writeFileSync, existsSync } from 'node:fs'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

const TARGETS = [
  { dir: join(ROOT, 'public', 'hero', 'desktop'), w: 1280, h: 720 },
  { dir: join(ROOT, 'public', 'hero', 'mobile'), w: 720, h: 900 },
]

const COUNT = 90

function lerp(a, b, t) { return a + (b - a) * t }
function fmt(n) { return String(n).padStart(4, '0') }

function svgFor(w, h, t) {
  // t in [0, 1]. Compose a calm gradient that shifts from indoor-cool to outdoor-warm,
  // with a small circle representing the character moving across the frame.
  const r1Cool = [231, 230, 240]
  const r2Cool = [200, 196, 215]
  const r1Warm = [247, 244, 238]
  const r2Warm = [236, 230, 216]

  const c1 = [
    Math.round(lerp(r1Cool[0], r1Warm[0], t)),
    Math.round(lerp(r1Cool[1], r1Warm[1], t)),
    Math.round(lerp(r1Cool[2], r1Warm[2], t)),
  ]
  const c2 = [
    Math.round(lerp(r2Cool[0], r2Warm[0], t)),
    Math.round(lerp(r2Cool[1], r2Warm[1], t)),
    Math.round(lerp(r2Cool[2], r2Warm[2], t)),
  ]

  const cx = w * (0.18 + t * 0.7)
  const cy = h * (0.62 - t * 0.05)
  const cr = Math.min(w, h) * 0.08

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgb(${c1.join(',')})" />
      <stop offset="100%" stop-color="rgb(${c2.join(',')})" />
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="${w}" height="${h}" fill="url(#g)"/>
  <circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${cr.toFixed(1)}" fill="#14121A"/>
</svg>`
}

let written = 0
for (const { dir, w, h } of TARGETS) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  for (let i = 1; i <= COUNT; i++) {
    const t = (i - 1) / (COUNT - 1)
    const svg = svgFor(w, h, t)
    const filePath = join(dir, `frame-${fmt(i)}.svg`)
    writeFileSync(filePath, svg, 'utf8')
    written++
  }
  // Poster (frame 45)
  const posterT = 44 / (COUNT - 1)
  const isDesktop = dir.endsWith('desktop')
  const posterName = isDesktop ? 'poster-desktop.svg' : 'poster-mobile.svg'
  writeFileSync(join(dir, '..', posterName), svgFor(w, h, posterT), 'utf8')
}

console.log(`[setup-hero-frames] wrote ${written} placeholder SVG frames + 2 posters`)
console.log('[setup-hero-frames] replace with real .webp frames before launch')
