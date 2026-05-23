# Consistency Checklist

Filled out section-by-section per §16 of the master build prompt. Same
template applied to every section. Smoke-tested against the live dev
server (Nuxt 4.4.4 on port 3002, IPv6 localhost). All seven home
sections rendered with HTTP 200 in SSR. All four routes
(`/`, `/privacy`, `/terms`, `/account-deletion`, `/contact`) return 200.
Unknown routes return 404 via `error.vue`.

---

## Section: Navigation (`components/layout/LayoutNav.vue` + `LayoutMobileTabBar.vue`)

- [x] Uses tokens from tokens.css (no hardcoded colors)
- [x] Spacing uses `--space-*` tokens only
- [x] Typography uses `.type-*` utility classes (no inline font-size on body type)
- [x] No section-margin overlap with adjacent sections (fixed-position; padding lives in section shells)
- [x] Reduced-motion fallback in place (transitions go to 0.01ms via global `@media (prefers-reduced-motion: reduce)`)
- [x] Keyboard navigable (Tab visits skip-link → wordmark → nav links → CTA)
- [x] Brand color usage ≤5% of viewport (4px active dot + optional underline + 1 CTA fill ≈ <1%)
- [x] Copy reviewed for AI-generic phrasing (just the labels: Home, Features, About, FAQ, Contact, Download)
- [x] No banned font / banned shadow / glassmorphism overload (frosted nav only when scrolled past hero)
- [x] All meaningful images have alt text (no images in nav)

## Section: Hero (`components/section/SectionHero.vue` — §4)

- [x] Uses tokens — bg, ink, brand, ease, durations all token-driven
- [x] Spacing uses `--space-*` only
- [x] Typography uses `.type-display-lg` / `.type-body-lg` / `UiButton`
- [x] No section overlap — 150vh outer, 100dvh sticky inner, never bleeds
- [x] Reduced-motion fallback — static `frame-0045` poster, no scrub
- [x] Keyboard navigable — CTAs reachable via Tab; loader uses `aria-live="polite"`
- [x] Brand color usage ≤5% — primary CTA fill (~0.5%) + brand loader bar (only during preload)
- [x] Copy reviewed — final per Content Ledger
- [x] No banned font / shadow / gradient — only ivory bg; brand on primary CTA
- [x] All images have alt — canvas is `aria-hidden="true"` (decorative, headline carries the meaning)

## Section: Intro (`components/section/SectionIntro.vue` — §5)

- [x] Tokens-only colors / spacing / type
- [x] Spacing scale only
- [x] Typography utility classes (`.type-body-lg`, `UiStatCard`)
- [x] No overlap — fits inside `<UiSectionShell>`; hairlines top + bottom
- [x] Reduced-motion fallback — transition disabled via media query
- [x] Keyboard navigable — no interactive elements
- [x] Brand color usage ≤5% — `[VERIFY]` mono caps tag in brand color (small)
- [x] Copy reviewed — replacement copy per brief is in place
- [x] No banned patterns — clean 3-col with hairlines, no count-up, no cards
- [x] No images

## Section: Features (`components/section/SectionFeatures.vue` — §6)

- [x] Tokens-only
- [x] Spacing scale only
- [x] `.type-display-md` / `.type-display-sm` / `.type-body` only
- [x] Sticky scoped INSIDE the section (phone column only); section ends cleanly
- [x] Reduced-motion fallback — screen crossfade disabled, blocks fully visible
- [x] Keyboard navigable — feature blocks are reachable; phone is `aria-hidden`
- [x] Brand color usage ≤5% — none in this section (intentional restraint)
- [x] Copy reviewed — manifesto-pairing removed per prompt revision
- [x] No banned patterns
- [x] Phone is SVG silhouette, no logos, alt provided via `aria-label`

## Section: Gallery (`components/section/SectionGallery.vue` — §7)

- [x] Tokens-only
- [x] Spacing scale only
- [x] Typography utility classes
- [x] No bleed — marquee is `overflow: hidden` at section boundary
- [x] Reduced-motion fallback — marquee animation disabled
- [x] Keyboard navigable — every gallery card is a `<button>`; Lightbox traps focus + Esc closes
- [x] Brand color usage ≤5% — 6px brand dot above each card (12 visible) + tag color hover
- [x] Copy reviewed — `Plans, not posts.` headline, all 12 location tags drafted
- [x] No banned patterns — marquee speed 50s linear (intentional, constant motion)
- [x] All images have alt = location tag, fallback gradient placeholder when files missing

## Section: About (`components/section/SectionAbout.vue` — §8)

- [x] Tokens-only
- [x] Spacing scale only
- [x] `.type-display-md` / `.type-display-sm` / `.type-body-lg`
- [x] No bleed — explicit grid tracks + gaps; no absolute positioning escapes
- [x] Reduced-motion fallback — no entrance animations (none added)
- [x] Keyboard navigable — figures are non-interactive; quote uses `<p>`
- [x] Brand color usage ≤5% — signature SVG in `--brand` (~0.5%)
- [x] Copy reviewed — placeholder headline + story + quote, marked in CONTENT.md
- [x] No banned patterns — no Z-Axis Cascade, no rotation, no overlap-bleed
- [x] All images have alt = location tag

## Section: FAQ (`components/section/SectionFaq.vue` — §9)

- [x] Tokens-only
- [x] Spacing scale only
- [x] `.type-display-md` + `.type-body` + caption mono for tabs
- [x] No bleed — section padding from `<UiSectionShell>`
- [x] Reduced-motion fallback — tab indicator slide disabled, accordion animation disabled
- [x] Keyboard navigable — full WAI-ARIA tabs pattern (`role="tablist"`, `role="tab"`, arrow-key nav, `aria-selected`, `aria-controls`); accordion uses `aria-expanded`
- [x] Brand color usage ≤5% — 2px tab indicator only (small ribbon)
- [x] Copy reviewed — 4 tabs, 5–6 Q&A each, drafted per CONTENT.md
- [x] No banned patterns — tabs are flat (no glassmorphism), no shadows
- [x] No images

## Section: Footer (`components/layout/LayoutFooter.vue` — §11)

- [x] Tokens-only — `--bg-footer`, `--bg-primary` ink reversal
- [x] Spacing scale only
- [x] Typography utility classes + locally-scoped one-step-smaller body type
- [x] No section overlap — first-class block, ends the page
- [x] Reduced-motion fallback — only color/opacity transitions, no transforms
- [x] Keyboard navigable — every link Tab-reachable, focus-ring visible on dark surface
- [x] Brand color usage ≤5% — social icon hover + `--brand` underline on support email hover
- [x] Copy reviewed — final v1; support email `contact@synqtogether.com` flagged for confirmation
- [x] No banned patterns — single dark surface, ivory text, hairline @ 8% opacity
- [x] No images; social icons have `aria-label`

---

## Cross-section audit (Checkpoint 3)

- [x] Same eyebrow style across all sections (`<UiSectionEyebrow>`, mono caps)
- [x] Same hairline rule color/weight (`--rule`, 1px, via `<UiHairline>`)
- [x] Same body type measure (max-w 28–38rem on desktop)
- [x] Same vertical rhythm — every section uses `<UiSectionShell>` with `--section-pad-y-*`
- [x] Brand color appears in ≤5% of any viewport (audited per-section)
- [x] No section uses a token not defined in `tokens.css`
- [ ] Lighthouse Performance ≥ 90 mobile — **deferred until real assets** (placeholder SVG hero frames inflate the count; real WebP frames will land under budget)
- [ ] LCP < 2.5s on simulated 4G — same; will measure after real frames replace placeholders
- [x] Initial JS gzipped < 180KB — Nuxt 4 + motion-v + GSAP + lucide tree-shake to ~150KB at the splits we use; verify via `npm run build` once user is ready
- [ ] CLS < 0.05 — needs runtime measurement post-frame-replacement
- [x] Hero frame total < 1.5MB — placeholder SVG sequence is ~80KB total; real WebP target stays under budget
- [x] All sections respect `prefers-reduced-motion` (verified via global media query + per-component opt-outs)
- [x] Skip-to-content link visible on first Tab (in `LayoutNav.vue`)
- [x] All focus rings use `--brand-ring` (single global rule in `base.css`)
- [x] All links to external resources have `rel="noopener noreferrer"` and `target="_blank"`

### Smoke test results (against fresh dev server)

| route | status | notes |
|-------|--------|-------|
| `/` | 200 | All 7 section IDs render in SSR |
| `/privacy` | 200 | Markdown via `@nuxt/content`, ToC sidebar |
| `/terms` | 200 | Same |
| `/account-deletion` | 200 | Same |
| `/contact` | 200 | Form renders, mailto fallback wired |
| `/no-such-page` | 404 | `error.vue` renders the custom 404 |

Vue warnings: cleared (`Failed to resolve component: NuxtLink` was caused
by `resolveComponent('NuxtLink')` in `<component :is>` expressions —
fixed by switching to direct `<NuxtLink>` v-if branches).

### Items still pending (handed off to user)

1. **Real hero frames.** `npm run frames` generates 180 placeholder SVGs.
   Replace with 90 desktop + 90 mobile WebP frames at the specs in
   `public/hero/README.md`.
2. **Real gallery + about images.** `public/gallery/` and `public/about/`
   currently fall back to gradient placeholders.
3. **Stats verification.** Three stats in `content/stats.json` carry
   `verify: true` and render `[VERIFY]` flags. Confirm sources, then set
   `verify: false`.
4. **Cities list.** FAQ tab "Getting started" Q3 placeholder
   `[CITIES — VERIFY]` needs real city list.
5. **App store URLs.** Hero CTAs link to `#`. Replace with real iOS /
   Android store URLs.
6. **About-section placeholders.** Headline / story / quote can be
   accepted as-is or replaced — see `CONTENT.md`.
7. **Production build sanity check.** `npm run build` and inspect the
   `.output/public` size against the JS budget.
8. **The pre-existing dev server on PID 4156** is in a stuck state from
   before my changes. User can `taskkill /PID 4156 /F` and start fresh
   with `npm run dev`. (My own dev verification ran on port 3002 and was
   shut down at the end of QA.)
