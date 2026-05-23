import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

// Live-read /content/<slug>.json from disk on every request. Avoids the
// Vite static-import cache, so editing content/*.json hot-updates the
// page on next refresh without needing a dev-server restart.
const ALLOWED = new Set(['gallery-tags', 'about-tags', 'stats'])

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug') as string | undefined
  if (!slug || !ALLOWED.has(slug)) {
    throw createError({ statusCode: 404, statusMessage: 'Unknown data slug' })
  }
  const filePath = resolve(process.cwd(), 'content', `${slug}.json`)
  try {
    const raw = await readFile(filePath, 'utf-8')
    return JSON.parse(raw)
  } catch (err) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to read content/${slug}.json`,
      cause: err,
    })
  }
})
