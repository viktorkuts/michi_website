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

  nitro: {
    // Force the static preset. Without this, Nuxt 4 auto-detects the
    // CF Pages build env (`CF_PAGES=1`) and silently swaps in
    // `cloudflare-module`, which writes `.output/server/wrangler.json`
    // with a reserved `ASSETS` binding that Pages rejects. We deploy
    // pure static + Pages Functions (in `functions/` at project root),
    // so the runtime worker output is unwanted dead weight.
    preset: 'static',
    compressPublicAssets: true,
    // Static deploy target — Cloudflare Pages serves `.output/public/`
    // as pure HTML+JS+CSS. Nitro runs ONLY at build time: it walks the
    // crawler from `/`, prerenders every linked page, hits the local
    // `server/api/data/[slug]` endpoints once each, and inlines the
    // JSON into the page payload. No server ships to CF.
    prerender: {
      crawlLinks: true,
      // Explicit routes belt-and-suspenders for orphan pages the
      // crawler might miss (no incoming link from /). Update when
      // adding a new top-level page.
      routes: [
        '/',
        '/contact',
        '/privacy',
        '/terms',
        '/account-deletion',
      ],
      // Keep deploys green when a single content page errors mid-edit.
      // Surfaces as build warnings instead of a hard failure.
      failOnError: false,
    },
  },
})
