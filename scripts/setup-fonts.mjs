// Copies Geist Sans + Geist Mono woff2 files from the `geist` npm package
// into /public/fonts/ so they can be served at /fonts/geist-*.woff2.
//
// Run via `npm run fonts` or automatically on `postinstall`.
// If the geist package isn't installed yet (e.g. fresh clone before
// `npm install`), this script logs a warning and exits 0 — never blocks.

import { existsSync, mkdirSync, copyFileSync, readdirSync } from 'node:fs'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const SRC_BASE = join(ROOT, 'node_modules', 'geist')
const DEST = join(ROOT, 'public', 'fonts')

const REQUESTED = [
  // The `geist` package ships variable woff2 files at:
  //   geist/dist/fonts/geist-sans/Geist-*.woff2
  //   geist/dist/fonts/geist-mono/GeistMono-*.woff2
  // We pick four static-weight files and rename to predictable names.
  { src: ['dist', 'fonts', 'geist-sans', 'Geist-Regular.woff2'], dest: 'geist-sans-400.woff2' },
  { src: ['dist', 'fonts', 'geist-sans', 'Geist-Medium.woff2'], dest: 'geist-sans-500.woff2' },
  { src: ['dist', 'fonts', 'geist-sans', 'Geist-SemiBold.woff2'], dest: 'geist-sans-600.woff2' },
  { src: ['dist', 'fonts', 'geist-mono', 'GeistMono-Medium.woff2'], dest: 'geist-mono-500.woff2' },
]

if (!existsSync(SRC_BASE)) {
  console.warn('[setup-fonts] geist package not found at', SRC_BASE)
  console.warn('[setup-fonts] skipping — run after `npm install`')
  process.exit(0)
}

if (!existsSync(DEST)) mkdirSync(DEST, { recursive: true })

let copied = 0
let missing = []
for (const { src, dest } of REQUESTED) {
  const from = join(SRC_BASE, ...src)
  const to = join(DEST, dest)
  if (existsSync(from)) {
    copyFileSync(from, to)
    copied++
  } else {
    missing.push({ from, to })
  }
}

if (missing.length) {
  // Sometimes the geist package ships under different filenames depending on
  // version. Walk the geist/dist/fonts tree and try a fuzzy match.
  const fontsRoot = join(SRC_BASE, 'dist', 'fonts')
  if (existsSync(fontsRoot)) {
    const files = []
    const walk = (dir) => {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const p = join(dir, entry.name)
        if (entry.isDirectory()) walk(p)
        else if (entry.name.endsWith('.woff2')) files.push(p)
      }
    }
    walk(fontsRoot)
    for (const m of missing) {
      const wantName = m.to.split(/[\\/]/).pop()
      // crude fuzzy: match weight token
      const weight = wantName.includes('400') ? 'Regular'
        : wantName.includes('500') ? 'Medium'
        : wantName.includes('600') ? 'SemiBold'
        : ''
      const isMono = wantName.includes('mono')
      const candidate = files.find(f => {
        const base = f.split(/[\\/]/).pop()
        if (isMono && !/Mono/i.test(base)) return false
        if (!isMono && /Mono/i.test(base)) return false
        return base.includes(weight)
      })
      if (candidate) {
        copyFileSync(candidate, m.to)
        copied++
      } else {
        console.warn('[setup-fonts] could not locate', wantName)
      }
    }
  }
}

console.log(`[setup-fonts] copied ${copied} font file${copied === 1 ? '' : 's'} to public/fonts/`)
