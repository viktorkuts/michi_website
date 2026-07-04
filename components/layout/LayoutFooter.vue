<script setup lang="ts">
import { computed } from 'vue'
import { Instagram, Linkedin } from 'lucide-vue-next'

const year = new Date().getFullYear()

const route = useRoute()
const router = useRouter()
const isHome = computed(() => route.path === '/')

interface ProductLink {
  label: string
  anchor: string
  isDownload?: boolean
}

const productLinks: ProductLink[] = [
  { label: 'How it works', anchor: 'how-it-works' },
  { label: 'About',        anchor: 'about' },
  { label: 'FAQ',          anchor: 'faq' },
  { label: 'Download',     anchor: 'hero', isDownload: true },
]

function productHref(item: ProductLink) {
  // Always serve a deep-link href so Ctrl/Cmd+Click and crawlers work.
  // The onClick handler intercepts the default click for SPA + scroll behavior.
  return isHome.value ? `#${item.anchor}` : `/#${item.anchor}`
}

async function onProductClick(e: MouseEvent, item: ProductLink) {
  // Pass through new-tab / new-window modifier clicks
  if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return
  e.preventDefault()

  if (item.isDownload) {
    if (isHome.value) {
      scrollToHeroEnd()
    } else {
      requestHeroEndScroll()
      await router.push('/')
    }
    return
  }

  if (isHome.value) {
    const el = document.getElementById(item.anchor)
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - 16
    window.scrollTo({ top, behavior: 'smooth' })
    history.replaceState(null, '', `#${item.anchor}`)
  } else {
    await router.push(`/#${item.anchor}`)
  }
}

const legalLinks = [
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms of Use', to: '/terms' },
  { label: 'Politique de confidentialité', to: '/privacy-fr' },
  { label: 'Conditions d\'utilisation', to: '/terms-fr' },
  { label: 'Account Deletion', to: '/account-deletion' },
]
const helpLinks = [
  { label: 'Contact', to: '/contact' },
  { label: 'Press', href: 'mailto:contact@michi.quest' },
]
</script>

<template>
  <footer id="footer" class="layout-footer">
    <div class="container-shell layout-footer__grid">
      <div class="layout-footer__brand">
        <span class="layout-footer__wordmark type-display-md">Michi</span>
        <span class="layout-footer__tagline type-body">More life outside.</span>
        <a class="layout-footer__support type-body" href="mailto:contact@michi.quest">
          contact@michi.quest
        </a>
      </div>

      <div class="layout-footer__cols">
        <div>
          <UiSectionEyebrow>Product</UiSectionEyebrow>
          <ul>
            <li v-for="l in productLinks" :key="l.label">
              <a
                :href="productHref(l)"
                @click="(e) => onProductClick(e, l)"
              >{{ l.label }}</a>
            </li>
          </ul>
        </div>
        <div>
          <UiSectionEyebrow>Legal</UiSectionEyebrow>
          <ul>
            <li v-for="l in legalLinks" :key="l.label">
              <NuxtLink :to="l.to">{{ l.label }}</NuxtLink>
            </li>
          </ul>
        </div>
        <div>
          <UiSectionEyebrow>Help</UiSectionEyebrow>
          <ul>
            <li v-for="l in helpLinks" :key="l.label">
              <NuxtLink v-if="l.to" :to="l.to">{{ l.label }}</NuxtLink>
              <a v-else :href="l.href">{{ l.label }}</a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <UiHairline class="layout-footer__rule" />

    <div class="container-shell layout-footer__base">
      <span class="type-caption">© {{ year }} MICHI. ALL RIGHTS RESERVED.</span>
      <div class="layout-footer__social" aria-label="Social">
        <a
          href="https://www.instagram.com/michi.quest/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Michi on Instagram"
        >
          <Instagram :size="18" :stroke-width="1.5" />
        </a>
        <a
          href="https://www.linkedin.com/company/111004970/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Michi on LinkedIn"
        >
          <Linkedin :size="18" :stroke-width="1.5" />
        </a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.layout-footer {
  background: var(--bg-footer);
  color: var(--bg-primary);
  padding-top: var(--space-32);
  padding-bottom: var(--space-12);
  margin-top: 0;
}

.layout-footer__grid {
  display: grid;
  gap: var(--space-12);
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .layout-footer__grid {
    grid-template-columns: 1.2fr 2fr;
    gap: var(--space-16);
  }
}

.layout-footer__brand {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.layout-footer__wordmark {
  font-weight: 500;
  color: var(--bg-primary);
  letter-spacing: -0.02em;
}
.layout-footer__tagline {
  color: rgb(247 244 238 / 0.7);
}
.layout-footer__support {
  color: rgb(247 244 238 / 0.85);
  text-decoration: none;
  border-bottom: 1px solid rgb(247 244 238 / 0.2);
  align-self: flex-start;
  padding-bottom: 1px;
  transition: border-color 200ms ease, color 200ms ease;
}
.layout-footer__support:hover {
  color: var(--bg-primary);
  border-bottom-color: var(--brand);
}

.layout-footer__cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-8);
}
@media (min-width: 640px) {
  .layout-footer__cols {
    grid-template-columns: repeat(3, 1fr);
  }
}

.layout-footer__cols ul {
  list-style: none;
  padding: 0;
  margin: var(--space-4) 0 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.layout-footer__cols a {
  color: rgb(247 244 238 / 0.85);
  text-decoration: none;
  font-family: var(--font-sans);
  font-size: 0.9375rem;
  transition: color 200ms ease;
}
.layout-footer__cols a:hover {
  color: var(--bg-primary);
}

.layout-footer__rule {
  border-top-color: rgb(247 244 238 / 0.08);
  margin: var(--space-12) auto 0;
  max-width: var(--container-max);
  margin-inline: var(--container-pad-x);
}

@media (min-width: 1280px) {
  .layout-footer__rule {
    margin-inline: auto;
  }
}

.layout-footer__base {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: var(--space-8);
  flex-wrap: wrap;
  gap: var(--space-4);
}
.layout-footer__base .type-caption {
  color: rgb(247 244 238 / 0.5);
}

.layout-footer__social {
  display: inline-flex;
  align-items: center;
  gap: var(--space-4);
}
.layout-footer__social a {
  color: rgb(247 244 238 / 0.7);
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-pill);
  transition: color 200ms ease;
}
.layout-footer__social a:hover {
  color: var(--brand);
}
</style>
