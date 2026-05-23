// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/content',
    '@nuxt/image',
    '@vueuse/nuxt',
    'motion-v/nuxt',
  ],

  css: [
    '~/assets/css/tokens.css',
    '~/assets/css/typography.css',
    '~/assets/css/base.css',
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Synq — More life outside.',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'description', content: 'Find what\'s happening near you. Meet people through the things you actually do.' },
        { name: 'theme-color', content: '#F7F4EE' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preload', as: 'font', type: 'font/woff2', href: '/fonts/geist-sans-400.woff2', crossorigin: 'anonymous' },
        { rel: 'preload', as: 'font', type: 'font/woff2', href: '/fonts/geist-sans-600.woff2', crossorigin: 'anonymous' },
      ],
    },
  },

  content: {
    build: {
      markdown: {
        toc: { depth: 3, searchDepth: 3 },
      },
    },
  },

  image: {
    formats: ['avif', 'webp'],
    quality: 82,
  },

  experimental: {
    payloadExtraction: true,
  },

  nitro: {
    compressPublicAssets: true,
  },
})
