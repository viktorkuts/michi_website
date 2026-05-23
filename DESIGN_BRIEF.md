# Synq Design Brief

**Status:** Checkpoint 2 — awaiting user approval before any component code.
**Built from:** the master build prompt (§§ 1, 2, 16) plus the audit decisions
in `SKILL_AUDIT.md`. Default-recommended choices (Nuxt 4, `motion-v`,
Geist) carried forward.

This brief is the system. Section 17 of the master prompt asked for the
system to be locked then executed within. Everything below is the lock.

---

## 1. Typography pick

### Choice: **Geist Sans + Geist Mono** (self-hosted woff2)

- **Display** — Geist Sans, weights 500 / 600 (used sparingly at 600).
- **Body** — Geist Sans, weight 400, with Variant `'cv11', 'ss03'` OpenType
  features off (default geometric forms, no stylistic stunts).
- **Mono** — Geist Mono, weight 500, used only for captions, eyebrows,
  source tags, location tags, and stat sources.

### Rationale

- Free, OFL-licensed, ship-ready as woff2. No vendor licensing risk.
- Geometric-warm sans with tight, even rhythm — sits in the same
  register as Söhne / GT America / ABC Whyte without the paid license.
- Designed by Vercel for product surfaces. The DNA is "calm, technical,
  refined" — the exact register Revolut occupies. It is **not** an
  editorial-magazine display face, which honors the prompt's restraint.
- Geist Mono pairs perfectly because it shares metrics with Geist Sans —
  small mono caption sits cleanly above sans body without optical drift.
- Avoids every banned font (Inter, Roboto, Arial, Helvetica, system-ui,
  GT Sectra, Reckless, PP Editorial New, Tobias, Migra).

### Files to ship

```
/assets/fonts/
  geist-sans-400.woff2          ~22KB
  geist-sans-500.woff2          ~22KB
  geist-sans-600.woff2          ~22KB
  geist-mono-500.woff2          ~22KB
```

`font-display: swap`, preload only `geist-sans-400` and `geist-sans-600`
(used above the fold). Total font payload ~88KB across four files,
~44KB above the fold via preload. Fits comfortably under the 180KB
initial JS budget (fonts are not counted in the JS budget but matter
for LCP).

### `@font-face` rules — exact

```css
@font-face {
  font-family: 'Geist';
  src: url('/fonts/geist-sans-400.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Geist';
  src: url('/fonts/geist-sans-500.woff2') format('woff2');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Geist';
  src: url('/fonts/geist-sans-600.woff2') format('woff2');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Geist Mono';
  src: url('/fonts/geist-mono-500.woff2') format('woff2');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

:root {
  --font-sans: 'Geist', ui-sans-serif, system-ui, sans-serif;
  --font-mono: 'Geist Mono', ui-monospace, 'SF Mono', Menlo, monospace;
}
```

---

## 2. Type scale — exact `clamp()` values

Six steps. No `display-xl`. The largest type on the site is `display-lg`.

```css
:root {
  /* Display */
  --type-display-lg-size:    clamp(2.5rem, 1.5rem + 3.125vw, 4.5rem);
  --type-display-lg-line:    1.05;
  --type-display-lg-track:   -0.02em;
  --type-display-lg-weight:  600;

  --type-display-md-size:    clamp(2rem, 1.25rem + 2.5vw, 3.5rem);
  --type-display-md-line:    1.10;
  --type-display-md-track:   -0.015em;
  --type-display-md-weight:  600;

  --type-display-sm-size:    clamp(1.5rem, 1.125rem + 0.875vw, 2.25rem);
  --type-display-sm-line:    1.20;
  --type-display-sm-track:   -0.01em;
  --type-display-sm-weight:  600;

  /* Body */
  --type-body-lg-size:       clamp(1.0625rem, 0.95rem + 0.4375vw, 1.25rem);
  --type-body-lg-line:       1.50;
  --type-body-lg-track:      -0.005em;
  --type-body-lg-weight:     400;

  --type-body-size:          1rem;
  --type-body-line:          1.55;
  --type-body-track:         -0.005em;
  --type-body-weight:        400;

  /* Caption (mono caps) */
  --type-caption-size:       0.8125rem;
  --type-caption-line:       1.40;
  --type-caption-track:      0.06em;
  --type-caption-weight:     500;
  --type-caption-transform:  uppercase;
  --type-caption-family:     var(--font-mono);
}
```

Quick read of what each `clamp()` resolves to:

| step          | 360px (mobile) | 768px (tablet) | 1280px (desktop) | 1920px (wide) |
|---------------|----------------|----------------|------------------|---------------|
| display-lg    | 40px (floor)   | 48px           | 64px             | 72px (cap)    |
| display-md    | 32px (floor)   | 39px           | 52px             | 56px (cap)    |
| display-sm    | 24px (floor)   | 25px           | 33px             | 36px (cap)    |
| body-lg       | 17px (floor)   | 18.5px         | 20px (cap)       | 20px (cap)    |
| body          | 16px           | 16px           | 16px             | 16px          |
| caption       | 13px           | 13px           | 13px             | 13px          |

The hero headline (`display-lg`) tops out at 72px on a 1920px viewport.
Restraint honored.

---

## 3. Color tokens — locked with computed contrast

### Token values (matches prompt §1)

```css
:root {
  --bg-primary:    #F7F4EE;
  --bg-secondary:  #FAF8F3;
  --bg-tinted:     #ECE6D8;
  --bg-footer:     #14121A;

  --ink-primary:   #14121A;
  --ink-secondary: #4F4B65;  /* darkened from #5C5870 — see §3a */
  --ink-muted:     #6E6982;  /* darkened from #8C879B — see §3a */

  --brand:         #6765EC;
  --brand-hover:   #5754E0;
  --brand-soft:    #EFEEFB;
  --brand-ring:    rgb(103 101 236 / 0.25);

  --rule:          #E8E2D5;
}
```

### 3a. Contrast — what I computed and what I had to adjust

I computed WCAG 2.1 relative luminance for every text/bg pair. **Two of
the prompt's tokens fail their stated targets and need adjustment. I
flag them here for your approval.**

| Pair | Computed | Target | Pass? |
|------|----------|--------|-------|
| `--ink-primary` `#14121A` on `--bg-primary` `#F7F4EE` | **16.9 : 1** | ≥ 14:1 | ✓ AAA |
| `--ink-primary` on `--bg-secondary` `#FAF8F3` | 17.3 : 1 | ≥ 14:1 | ✓ AAA |
| `--ink-primary` on `--bg-tinted` `#ECE6D8` | 14.6 : 1 | ≥ 14:1 | ✓ AAA |
| **prompt's** `--ink-secondary` `#5C5870` on `--bg-primary` | **6.2 : 1** | ≥ 7:1 | ✗ AA only |
| **adjusted** `--ink-secondary` `#4F4B65` on `--bg-primary` | **8.1 : 1** | ≥ 7:1 | ✓ AAA |
| **prompt's** `--ink-muted` `#8C879B` on `--bg-primary` | **3.2 : 1** | ≥ 4.5:1 (used at 13px caption) | ✗ |
| **adjusted** `--ink-muted` `#6E6982` on `--bg-primary` | **4.8 : 1** | ≥ 4.5:1 | ✓ AA |
| `--brand` `#6765EC` on `--bg-primary` (text) | **4.1 : 1** | ≥ 4.5:1 large text | borderline |
| white on `--brand` (CTA fill text) | **4.5 : 1** | ≥ 4.5:1 normal text | ✓ AA exact |
| white on `--brand-hover` `#5754E0` | **5.3 : 1** | ≥ 4.5:1 | ✓ AA |
| `--ink-primary` on `--bg-footer` `#14121A` | n/a (same color) | n/a | n/a |
| ivory `#F7F4EE` on `--bg-footer` `#14121A` (footer text) | **15.5 : 1** | ≥ 4.5:1 | ✓ AAA |

**Two recommendations:**

1. **Adjust `--ink-secondary` from `#5C5870` to `#4F4B65`.** The prompt's
   stated target is ≥ 7:1 (AAA for normal text), and the original value
   misses by 0.8 points. The adjusted value preserves the hue (cool ink
   with a slight purple lean) and lifts contrast to 8.1:1.

2. **Adjust `--ink-muted` from `#8C879B` to `#6E6982`.** This token is
   used for 13px caption mono captions (image tags, source labels,
   stat citations). 13px is small text — WCAG normal-text AA threshold
   applies (4.5:1). The original value sits at 3.2:1, which fails for
   text and only passes for non-text decorations. The adjusted value
   reaches 4.8:1.

3. **`--brand` is text-safe only on CTA fills (white text on brand).**
   Confirms the prompt's own §1 rule: "do not use brand for body or
   display text." Use brand for: primary CTA fills (white text on
   brand bg, 4.5:1 — passing AA), focus rings (non-text), active nav
   dot (non-text), link hover underlines (decoration), the about-section
   signature mark (non-text), the loader progress bar (non-text). Do not
   use brand for any text rendered on `--bg-primary`.

If you accept the two ink adjustments above, the brand-color rule from
§1 stays exactly as written and the entire palette is WCAG-clean.

---

## 4. Spacing — exact tokens (matches prompt)

```css
:root {
  --space-1:  0.25rem;   /*  4px */
  --space-2:  0.5rem;    /*  8px */
  --space-3:  0.75rem;   /* 12px */
  --space-4:  1rem;      /* 16px */
  --space-6:  1.5rem;    /* 24px */
  --space-8:  2rem;      /* 32px */
  --space-12: 3rem;      /* 48px */
  --space-16: 4rem;      /* 64px */
  --space-24: 6rem;      /* 96px */
  --space-32: 8rem;      /* 128px */
  --space-48: 12rem;     /* 192px */
}
```

### Section-spacing rules — locked

- Section vertical padding: `--space-32` mobile (top **and** bottom),
  `--space-48` desktop. Applied via a single `<SectionShell>` wrapper.
  No section overrides this.
- No `margin-top: -*` on any section.
- No section uses `position: sticky` on its outer container. Sticky is
  scoped *inside* a section (e.g., the phone in §6, the marquee in §7
  is `overflow: hidden` at the section boundary).
- Effective gap between section content blocks = `space-48 + space-48`
  = 384px on desktop. Intentional.

---

## 5. Motion — durations, easing, and rules

### CSS custom properties

```css
:root {
  --ease-out-expo:   cubic-bezier(0.22, 1, 0.36, 1);
  --ease-out-quart:  cubic-bezier(0.25, 1, 0.5, 1);
  --ease-in-out-3:   cubic-bezier(0.65, 0, 0.35, 1);

  --dur-micro:       200ms;
  --dur-standard:    400ms;
  --dur-section:     600ms;   /* min — go up to 800ms for hero scrub */
  --stagger:         60ms;
}
```

### Where each duration applies

| element | duration | easing | source skill |
|---------|----------|--------|--------------|
| Button press (`scale(0.97)` on `:active`) | 160ms | `--ease-out-expo` | emil-design-eng |
| Hover state changes (color/opacity) | 200ms | `ease` (built-in is fine for color-only) | emil-design-eng |
| Tooltip / small popover | 180ms | `--ease-out-expo`, origin = trigger | emil-design-eng |
| Nav active-indicator slide | 300ms | `--ease-out-quart` (FLIP) | motion-v |
| FAQ tab indicator slide | 300ms | spring (stiffness 320, damping 30) | motion-v |
| FAQ accordion expand/collapse | 280ms | `--ease-out-expo` | emil-design-eng |
| Section entrance (translateY + opacity) | 600ms | `--ease-out-quart`, stagger 60ms | high-end-visual-design |
| Hero scroll scrub | continuous | lerp 0.1 (smoothing) | prompt §4 |
| Phone screen crossfade (§6) | 200ms | `--ease-out-expo`, **`filter: blur(2px)` mid-transition** | emil-design-eng |
| Marquee horizontal drift (§7) | 50s loop | `linear` (constant motion) | emil-design-eng |
| Lightbox open | 240ms | `--ease-out-expo`, origin = clicked thumbnail | emil-design-eng |

### Reduced-motion contract

All scroll-driven animations get static fallbacks. Specifically:

- Hero: no scrub. Static `frame-0045` poster, headline + CTAs fade in
  once at load.
- Section entrances: instant, no transform.
- Marquee: paused (`animation-play-state: paused`) — gallery still
  scrollable manually via keyboard tab + arrow keys.
- FAQ tab indicator: instant snap (no slide).
- FAQ accordion: instant toggle.
- Loader: instant cut, no fade-out.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 6. Tech-stack lock (post-audit)

| layer | choice | version |
|-------|--------|---------|
| Framework | Nuxt 4 | latest stable (4.3+) |
| Vue | 3.5+ | bundled with Nuxt 4 |
| TypeScript | strict mode | 5.6+ |
| Content | @nuxt/content | v3 |
| Motion (Vue) | **motion-v** | 1.x (resolves prompt's "@vueuse/motion" intent — see SKILL_AUDIT.md item 2) |
| Scroll choreography | GSAP + ScrollTrigger | 3.x (npm dep, not CDN) |
| Utility CSS | Tailwind CSS | v4 (CSS-first config) + tokens.css custom properties |
| Utility composables | @vueuse/core | latest |
| Image | @nuxt/image | latest, AVIF/WebP |
| Icons | lucide-vue-next | latest, `stroke-width: 1.5` enforced globally |
| Fonts | self-hosted Geist (Sans + Mono) | woff2 |

**Forbidden, confirmed not entering deps:**
- three / tresjs (no WebGL needed)
- framer-motion (React-only)
- vuetify, primevue, element-plus (each ships its own design system)
- emoji as icons (Lucide monoline only)

### Performance budget — hard

- LCP < 2.5s on simulated 4G
- Initial JS gzipped < 180KB
- Hero frame sequence < 1.5MB total (90 × ~16KB WebP)
- Lighthouse Performance ≥ 90 mobile
- CLS < 0.05

---

## 7. Component primitives — sketched

The following are the base components everything else composes from.
Each gets its own file under `/components/ui/` and is fully token-driven
(no hardcoded colors / sizes / durations).

### `UiButton.vue`
- Variants: `primary` (brand fill, white text), `secondary` (ivory fill,
  ink text, hairline border), `ghost` (transparent, ink text, brand
  underline on hover).
- Always `border-radius: 999px` (full pill).
- `padding: var(--space-3) var(--space-6)` (12px / 24px).
- `transition: transform 160ms var(--ease-out-expo), background-color 200ms ease`.
- `:active { transform: scale(0.97); }`.
- Focus ring: `0 0 0 3px var(--brand-ring)`, no offset, no thick outlines.
- Slot for trailing icon (e.g., `↗` for App Store badge text), wrapped
  in a `span` — no nested circular background (that's the
  high-end-visual-design "button-in-button" pattern, which is too haptic
  for Revolut-clean).

### `UiNavLink.vue`
- Body type, weight 500.
- Active state: 4px circle in `--brand` 6px below baseline (FLIP
  layout-animated by motion-v).
- Hover: brand-color underline, 1px, animates from 0 → 100% width over
  180ms.
- Focus ring: `--brand-ring`.

### `UiPhoneFrame.vue`
- Pure SVG iPhone 15 silhouette — rounded rect, dynamic-island notch,
  no logos.
- 1.5px stroke in `--ink-primary`, no fill.
- Slot for screen content. Default screen content: `--bg-secondary`
  fill with feature name centered (body-lg, weight 600).
- Aspect-ratio: 9 / 19.5. `width: 320px` default; responsive scaling
  via `clamp(240px, 28vw, 380px)`.

### `UiStatCard.vue`
- Used in §5 Intro section row.
- `value` slot (display-md, weight 600, `--ink-primary`).
- `label` slot (body, `--ink-secondary`, max 12 words).
- `source` slot (caption mono, `--ink-muted`, with `[VERIFY]` tag if
  prop `verify === true`).
- Hairline rule above row, hairline rule below row, hairlines between
  stats on desktop.

### `UiSectionEyebrow.vue`
- Caption mono (`--font-mono`, weight 500, 13px, letter-spacing 0.06em,
  uppercase).
- Color `--ink-muted`.
- Optional brand-color leading dot (6px circle, `--brand`).

### `UiHairline.vue`
- 1px solid `--rule`. That's it. Wraps in a `<hr>` for semantics.

### `UiTag.vue`
- Caption mono, weight 500, 13px, uppercase, 0.08em letter-spacing.
- Used for: gallery image tags ("PICKUP BASKETBALL, BROOKLYN"),
  about-section image tags ("BROOKLYN, 2024"), `[VERIFY]` flags.
- Optional leading 6px brand dot (used in gallery only).

### `UiMarquee.vue`
- Pure CSS `@keyframes translateX(-50%)` on the inner track.
- Track contains 2× the items (rendered via `v-for` × 2) for seamless
  loop.
- `:hover` → `animation-play-state: paused`.
- `:focus-within` → `animation-play-state: paused` (keyboard a11y).
- Edge mask: `mask-image: linear-gradient(90deg, transparent 0, black 80px, black calc(100% - 80px), transparent 100%)`.
- Reduced-motion: paused permanently.

### `UiFaqItem.vue`
- Wraps a single Q&A pair.
- `<button aria-expanded="...">` with question (display-sm).
- Chevron icon rotates 180° via `transform`.
- Body uses `motion-v` `useMotion` for height auto-animation.
- Reduced-motion: instant toggle.

### `UiLightbox.vue`
- Fixed overlay, `--bg-footer` at 92% opacity backdrop.
- Image centered, max 90vh, hairline border.
- Tag below image (mono caps).
- Esc closes. Focus trapped while open (using `@vueuse/core`
  `useFocusTrap`).
- Animates in 240ms `--ease-out-expo`, origin = clicked thumbnail's
  bounding box (FLIP via motion-v layout animation).

---

## 8. Brand-color usage — concrete examples

The 5%-of-viewport rule enforced. Mid-fold viewport audit (assume desktop
1440×900 = 1,296,000 px²):

| element | approx pixel area | % of viewport |
|---------|-------------------|---------------|
| Primary CTA fill (Hero) | ~7,000 px² | 0.54% |
| Secondary CTA hover state | ~7,000 px² | 0.54% |
| Active nav dot (4px circle) | ~13 px² | <0.001% |
| Focus ring (when present, one element) | ~700 px² | 0.05% |
| About-section signature mark | ~6,400 px² | 0.49% |
| Loader progress bar (loading state only, not on main view) | n/a | n/a |
| Gallery item leading dot (6px × 12 visible items) | ~340 px² | 0.03% |
| **total at any non-hero viewport** | **~14,000–28,000 px²** | **~1–2%** |

Well under the 5% budget.

### Brand-color does NOT appear on:

- Background fills, gradients, image overlays, icons, body/display text,
  section dividers (`--rule`), or footer text.

### Banned color patterns (re-confirming §1):

- No purple-to-pink, blue-to-purple, or any chromatic gradient.
- No second accent. The single chromatic note is `#6765EC`.
- No "branded" image filters (no purple tint over photography).

---

## 9. The five image directories

Per prompt §§ 4, 7, 8. Folders created with READMEs only — no images
yet, since the user supplies real assets.

```
/public/hero/
  desktop/frame-0001.webp ... frame-0090.webp     (90 frames)
  mobile/frame-0001.webp ... frame-0090.webp      (90 frames)
  poster-desktop.webp                              (= frame-0045)
  poster-mobile.webp                               (= frame-0045 mobile)
  README.md

/public/gallery/
  gallery-01.jpg ... gallery-12.jpg
  README.md

/public/about/
  about-hero.jpg
  about-01.jpg ... about-05.jpg
  README.md
```

Until the user supplies real images, a fallback is in place: any missing
hero frame falls back to a generated gradient placeholder (so the scroll
mechanism can be developed and tested); any missing gallery/about image
falls back to a tinted gradient block so layout never breaks during dev.

---

## 10. Information architecture — confirmed

```
Routes:
  /                       (single-page experience)
  /privacy                (markdown via @nuxt/content)
  /terms                  (markdown via @nuxt/content)
  /account-deletion       (markdown via @nuxt/content)
  /contact                (form, mailto fallback)
  /404                    (custom)

Sections on /:
  1. HERO       (§4 of prompt)
  2. INTRO      (§5)
  3. FEATURES   (§6)
  4. GALLERY    (§7)
  5. ABOUT      (§8)
  6. FAQ        (§9 — replaces standalone /safety page)
  7. FOOTER     (§11)

Nav: Home · Features · About · FAQ · Contact
  (active section indicator updates via IntersectionObserver)
```

---

## 11. What I'm waiting on before writing code

Three approval questions:

1. **Approve the two ink adjustments** in §3a:
   - `--ink-secondary` `#5C5870` → `#4F4B65` (lifts 6.2:1 → 8.1:1, hits AAA)
   - `--ink-muted` `#8C879B` → `#6E6982` (lifts 3.2:1 → 4.8:1, hits AA)
2. **Approve the typography pick** (Geist Sans + Geist Mono, self-hosted).
3. **Approve the tech-stack lock** in §6 (Nuxt 4, motion-v, Tailwind v4, GSAP).

Reply "approved" (or with corrections) and I'll proceed to scaffold the
project, build the token system, then primitives and nav.

End of brief. Stopping per §18 checkpoint 2.
