# Synq Design System

Exported from `DESIGN_BRIEF.md` after Checkpoint 2 approval. The brief is
the source of truth; this file mirrors it for component developers who
just need the values without the rationale. **If brief and system
disagree, the brief wins** — open an issue and update both.

## Color tokens

| token | hex | use |
|-------|-----|-----|
| `--bg-primary` | `#F7F4EE` | Page base, sections 1–3, 5, 6 |
| `--bg-secondary` | `#FAF8F3` | Elevated cards, phone screen default |
| `--bg-tinted` | `#ECE6D8` | Gallery section background only |
| `--bg-footer` | `#14121A` | Footer + lightbox backdrop |
| `--ink-primary` | `#14121A` | Body, display, headlines |
| `--ink-secondary` | `#4F4B65` | Secondary text, body-lg paragraphs |
| `--ink-muted` | `#6E6982` | Captions, source labels, image tags |
| `--brand` | `#6765EC` | Single chromatic accent — see "brand rule" |
| `--brand-hover` | `#5754E0` | CTA hover state |
| `--brand-soft` | `#EFEEFB` | Selection bg, low-opacity tints |
| `--brand-ring` | `#6765EC` @ 25% | Focus rings |
| `--rule` | `#E8E2D5` | Hairline borders, dividers |

## Type scale

| utility class | size (clamp) | line | track | weight | family |
|---------------|--------------|------|-------|--------|--------|
| `.type-display-lg` | 40 → 72px | 1.05 | -0.02em | 600 | sans |
| `.type-display-md` | 32 → 56px | 1.10 | -0.015em | 600 | sans |
| `.type-display-sm` | 24 → 36px | 1.20 | -0.01em | 600 | sans |
| `.type-body-lg` | 17 → 20px | 1.50 | -0.005em | 400 | sans |
| `.type-body` | 16px | 1.55 | -0.005em | 400 | sans |
| `.type-caption` | 13px | 1.40 | 0.06em | 500 | mono, uppercase |

Largest type on the site = `display-lg`. There is no `display-xl`.

## Spacing scale

`--space-1` → 4px, doubling: `1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48`.
Section vertical padding: `--space-32` mobile / `--space-48` desktop.

## Motion

| token | value |
|-------|-------|
| `--ease-out-expo` | `cubic-bezier(0.22, 1, 0.36, 1)` |
| `--ease-out-quart` | `cubic-bezier(0.25, 1, 0.5, 1)` |
| `--ease-in-out-3` | `cubic-bezier(0.65, 0, 0.35, 1)` |
| `--dur-micro` | 200ms (button press = 160ms) |
| `--dur-standard` | 400ms |
| `--dur-section` | 600ms (up to 800ms for hero) |
| `--stagger` | 60ms |

All scroll-driven motion has `prefers-reduced-motion` static fallbacks.

## Brand-color budget

≤5% of any non-hero viewport. Visible in:
- CTA fills (hero, contact submit)
- Active nav dot (4px circle)
- Focus rings on interactive elements
- Link hover underlines (1px, animates 0 → 100%)
- Gallery item leading dots (6px circle, 12 visible items)
- About-section signature mark (one)
- Loader progress bar (load state only)

**Never** used for text on ivory, background fills, image overlays,
gradients, or icons.

## Component primitives

See `/components/ui/`:

- `UiButton` — primary / secondary / ghost variants, pill shape
- `UiNavLink` — body type with brand-dot active indicator
- `UiPhoneFrame` — SVG iPhone 15 silhouette with screen slot
- `UiStatCard` — number + label + source + optional `[VERIFY]` flag
- `UiSectionEyebrow` — mono caps with optional brand dot
- `UiHairline` — 1px `--rule` divider
- `UiTag` — mono caps for image captions, supports leading brand dot
- `UiMarquee` — horizontal scroll with hover/focus pause
- `UiFaqItem` — accordion item with motion-v height animation
- `UiLightbox` — overlay with FLIP origin from clicked thumbnail

## File-by-file token discipline

Every component file MUST use tokens. Anti-patterns that fail review:

- `color: #14121A` — use `var(--ink-primary)`
- `padding: 16px` — use `var(--space-4)`
- `font-size: 24px` — use a `.type-*` class or `var(--type-display-sm-size)`
- `transition: all 300ms` — use the exact property + `var(--ease-out-expo)`
- `transition: ease-in` — banned; use a custom curve
- `box-shadow` on cards — banned; use hairlines (`var(--rule)`) or
  tinted backgrounds (`var(--bg-secondary)`) instead
