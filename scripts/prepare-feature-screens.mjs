/**
 * Normalize the How-It-Works phone screenshots so every image fills the
 * UiPhoneFrame screen area exactly (ratio 292:632 ≈ 1:2.164), instead of
 * letterboxing at runtime.
 *
 * Inputs:  assets/feature-screens/screen-N.png  (raw exports, mixed ratios)
 * Outputs: public/features/screen-N.webp        (640×1385, uniform)
 *
 * Strategy per image:
 *  - UI screenshots (taller-than-wide but shorter than the frame): scale
 *    to width, anchor to the top, extend the bottom with the screenshot's
 *    own bottom-edge color so the fill reads as screen surface.
 *  - Photos (screen-4): plain cover crop, centered.
 *
 * Run: node scripts/prepare-feature-screens.mjs   (re-run after replacing
 * any raw screenshot; commit the .webp outputs.)
 */
import sharp from 'sharp'
import { mkdir, access } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SRC = path.join(root, 'assets/feature-screens')
const OUT = path.join(root, 'public/features')

// 2x the largest rendered screen area (292px wide inside a 320px frame).
const W = 640
const H = 1385 // W × 632/292

// mode 'ui'    — screenshot shorter than the frame: fit width, anchor top,
//                extend the bottom with the screenshot's own edge color.
// mode 'cover' — full-frame screenshots and photos: center cover crop.
const screens = [
  { name: 'screen-1', mode: 'ui' },
  { name: 'screen-2', mode: 'ui' },
  { name: 'screen-3', mode: 'cover' },
  { name: 'screen-4', mode: 'cover' },
]

async function findSource(name) {
  for (const ext of ['png', 'jpg', 'jpeg', 'webp']) {
    const p = path.join(SRC, `${name}.${ext}`)
    try {
      await access(p)
      return p
    } catch { /* try next */ }
  }
  throw new Error(`no source found for ${name} in ${SRC}`)
}

async function bottomEdgeColor(img, meta) {
  // Sample the center of the bottom surface, above the rounded-corner
  // rows (mockup exports have dark/transparent corners that poison a
  // full-width edge sample). NOTE: sharp's stats() ignores extract(),
  // so materialize the strip and average the raw pixels ourselves.
  const region = {
    left: Math.round(meta.width * 0.3),
    top: meta.height - 10,
    width: Math.round(meta.width * 0.4),
    height: 8,
  }
  const { data, info } = await img
    .clone()
    .extract(region)
    .raw()
    .toBuffer({ resolveWithObject: true })
  const sum = [0, 0, 0]
  const px = info.width * info.height
  for (let i = 0; i < px; i++) {
    sum[0] += data[i * info.channels]
    sum[1] += data[i * info.channels + 1]
    sum[2] += data[i * info.channels + 2]
  }
  return {
    r: Math.round(sum[0] / px),
    g: Math.round(sum[1] / px),
    b: Math.round(sum[2] / px),
    alpha: 1,
  }
}

await mkdir(OUT, { recursive: true })

for (const { name, mode } of screens) {
  const src = await findSource(name)
  const out = path.join(OUT, `${name}.webp`)
  const img = sharp(src)
  const meta = await img.metadata()

  let pipeline
  if (mode === 'cover') {
    pipeline = img.resize(W, H, { fit: 'cover', position: 'centre' })
  } else {
    const background = await bottomEdgeColor(img, meta)
    pipeline = img.resize(W, H, { fit: 'contain', position: 'top', background })
  }

  await pipeline.webp({ quality: 84 }).toFile(out)
  console.log(`${path.basename(src)} → ${path.relative(root, out)} (${W}×${H}, ${mode})`)
}
