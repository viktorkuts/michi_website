# Michi — Design System (source of truth)

Tokens live in `assets/css/tokens.css`. Components consume tokens only;
hardcoded values fail review. This file supersedes the old
DESIGN_BRIEF.md/DESIGN_SYSTEM.md pair.

## Color

Warm ivory neutrals tinted toward the ink hue; one accent family drawn
from the app's own UI (cyan fill + ink text, as on the app's Join button).

| token | value | use |
|---|---|---|
| `--bg-primary` | `#F7F4EE` | page base |
| `--bg-secondary` | `#FAF8F3` | elevated surfaces, phone screen |
| `--bg-tinted` | `#ECE6D8` | warm tint |
| `--bg-clay` | `#1B1410` | gallery surface |
| `--bg-footer` | `#14121A` | footer, lightbox |
| `--ink-primary` | `#14121A` | headlines, body |
| `--ink-secondary` | `#4F4B65` | secondary text |
| `--ink-muted` | `#6E6982` | captions, tags |
| `--brand` | `#5AD8E6` | fills only: CTA, chips, dots. Always ink text on top |
| `--brand-hover` | `#3CCBDC` | fill hover |
| `--brand-ink` | `#0E7386` | accent TEXT on ivory (italic words, arrows, links) |
| `--brand-soft` | `#DFF4F7` | selection, soft tints |
| `--brand-ring` | teal @ 30% | focus rings |
| `--rule` | `#E8E2D5` | hairlines |

Rules: brand fill never carries ivory/white text (contrast fails) — ink
text on cyan, like the app. Accent text on ivory uses `--brand-ink`,
never `--brand`. On clay/footer dark surfaces, `--brand` may color text.
Budget: accent ≤10% of any non-hero viewport.

## Type

Geist Sans 400/500/600 + Geist Mono 500. No 700 anywhere (not loaded).
Scale: display-xl (hero only, clamp 3.5→8rem) / display-lg / display-md /
display-sm / body-lg / body / caption (mono caps). Hierarchy via size +
weight; the single register break is `.type-italic` (synthesized italic,
weight 500).

## Space

4px base: 1 2 3 4 6 8 12 16 24 32 48 (as `--space-*`). No other spacing
values. Section rhythm via `.section-shell` (+ `#gallery`/`#faq` tighter
overrides in base.css). No per-component pixel nudges.

## Depth

No box-shadows on cards. Elevation = hairline (`--rule`) + surface tint.
Z-scale: base 1, nav 40, overlay 60, modal 80, toast 90.

## Motion

ease-out-expo/quart, in-out-3. micro 200ms, standard 400ms, section
600ms, stagger 60ms. Never animate layout properties. Reduced-motion:
every scroll effect has a static fallback.

## Bans

Gradient text, side-stripe borders, glassmorphism-by-default, icon-card
grids, decorative glows, box-shadow cards, `transition: all`, em dashes
in copy.
