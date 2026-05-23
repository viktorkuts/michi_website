import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    legal: defineCollection({
      type: 'page',
      source: 'legal/**.md',
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        updated: z.string().optional(),
      }),
    }),
    faq: defineCollection({
      type: 'page',
      source: 'faq/**.md',
      schema: z.object({
        tab: z.string(),
        order: z.number(),
      }),
    }),
  },
})
