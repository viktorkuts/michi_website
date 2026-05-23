# Skill Audit

Per §0 of the master build prompt. Each of the 8 required skills was read in
full from `.claude/skills/<name>/SKILL.md`. Below is the takeaway for each,
how it informs the Synq build, and any conflicts with the prompt that need
flagging before the design brief.

---

## frontend-design

- **Read at:** yes, full file (`.claude/skills/frontend-design/SKILL.md`)
- **Key takeaway:** Commit to a clear conceptual direction and execute it
  with precision — refined minimalism and bold maximalism both work, but
  intentionality is the differentiator. Avoid AI defaults (Inter, Roboto,
  Arial, system-ui; purple-on-white gradients; cookie-cutter component
  patterns). Pair a distinctive display font with a refined body font.
  Match implementation complexity to the aesthetic vision.
- **Applied where:** §1 Aesthetic Direction (typography, color, motion
  bans), §15 documentation discipline, every section's component-level
  taste decisions. Synq sits in the "refined minimalism" lane this skill
  endorses — restraint and precision over volume.
- **Conflicts:** None substantive. The skill encourages "bold aesthetic
  direction"; the prompt's chosen direction is restraint, which the skill
  explicitly validates ("refined minimalism… need restraint, precision,
  and careful attention to spacing, typography, and subtle details").

---

## web-design-guidelines

- **Read at:** yes, full file
- **Key takeaway:** This skill is procedural — it pulls Vercel's Web
  Interface Guidelines from
  `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`
  and reviews specified files in terse `file:line` format. It is a
  review/audit tool, not a design generator.
- **Applied where:** §16 step 17 (CONSISTENCY_CHECKLIST review) and §16
  step 19 (accessibility audit). I will WebFetch the live guidelines
  before the post-build review, not now — the rules can drift, and the
  skill explicitly says "fetch fresh guidelines before each review."
- **Conflicts:** None.

---

## ui-ux-pro-max

- **Read at:** yes, full file
- **Key takeaway:** Priority-ordered review checklist (1 Accessibility →
  10 Charts). Hard standards: contrast 4.5:1 normal text / 7:1 AAA, touch
  targets ≥44pt, 8px+ spacing between targets, no horizontal scroll,
  base 16px body, line-height 1.5–1.75, ease-out for entry / ease-in for
  exit, exit ~60–70% of enter duration, animate transform/opacity only,
  duration 150–300ms for micro-interactions ≤400ms for complex, respect
  `prefers-reduced-motion` and Dynamic Type.
- **Applied where:** §1 motion durations match the skill's 150–300ms
  micro / ≤400ms standard window; §14 accessibility requirements; §6
  feature blocks; §9 FAQ accordion timing; §11 footer; §13 loader and
  404. Use this skill's Pre-Delivery Checklist as the spine of
  CONSISTENCY_CHECKLIST.md.
- **Conflicts:** Most of the skill's "Common Rules for Professional UI"
  table is scoped to App UI (iOS/Android/React Native/Flutter). The Synq
  site is web — those touch-target and safe-area rules still apply in
  spirit (44px mobile targets, no content under iOS notch when added to
  homescreen) but I will not import the React Native–specific guidance
  (e.g., `accessibilityLabel`, `Pressable`, native vector icon libraries).

---

## nuxt

- **Read at:** yes, full file (top-level skill; sub-references in
  `references/*.md` will be loaded only as needed during build, per the
  skill's own "DO NOT load all files at once" rule)
- **Key takeaway:** This skill targets **Nuxt 4+ (v4.3+)**. Patterns:
  `<NuxtPage />`, `getRouterParam(event, 'name')`, `useRequestURL()`,
  typed router with route names, parent routes with `<slot>` instead of
  separate layouts, h3 v1 helpers, nitropack v2.
- **Applied where:** §2 tech stack, §3 routing (`/`, `/privacy`, `/terms`,
  `/account-deletion`, `/contact`, `/404`), §10 nav state, §12 legal
  pages, §13 special states.
- **Conflicts:** **The prompt says "Nuxt 3"; the skill is Nuxt 4+.** I
  flag this for the design brief. Recommendation: use the latest stable
  Nuxt 4 release — Nuxt 4 keeps the Nuxt 3 surface area for the patterns
  this site needs (file-based routing, `<script setup>`, auto-imports,
  composables) and the skill is current. If the user prefers strict
  Nuxt 3, I'll pin to the latest 3.x and load `references/*.md` files
  selectively.

---

## nuxt-content

- **Read at:** yes, full file
- **Key takeaway:** Nuxt Content v3 with typed collections defined in
  `content.config.ts` via `defineCollection` + Zod schemas. Use
  `queryCollection('blog').path(useRoute().path).first()` wrapped in
  `useAsyncData`. Render parsed markdown body via `<ContentRenderer>`.
  Two collection types: `page` (routes + body) vs `data` (structured
  data only). MDC syntax allows Vue components inside markdown.
- **Applied where:** §12 legal pages (`/content/legal/privacy.md`,
  `terms.md`, `account-deletion.md` → page collection), §9 FAQ tabs
  (`/content/faq/*.md` — likely page or data collection per tab), §15
  setup. Stats and gallery/about tags are JSON, not markdown — those
  stay as plain `/content/*.json` per the prompt.
- **Conflicts:** None. The prompt explicitly chose @nuxt/content for
  legal/utility pages and FAQ source.

---

## motion

- **Read at:** yes, full file
- **Key takeaway:** This skill is for **`motion-v`** (the Vue port of
  Motion / formerly Framer Motion). Provides `<motion.div>` component
  with `:initial`, `:animate`, `:exit`, `:transition` props; gesture
  props (`:whileHover`, `:whilePress`); scroll props (`:whileInView`,
  `:viewport`); composables (`useMotionValue`, `useScroll`, `useSpring`,
  `useTransform`, `useInView`, `animate()`).
- **Applied where:** §1 motion section in spirit (springs and
  ease-out-expo), §6 sticky-phone scroll choreography (alongside GSAP
  ScrollTrigger), §9 FAQ accordion + tab indicator, individual section
  entrance animations.
- **Conflicts:** **The prompt picks `@vueuse/motion`, this skill covers
  `motion-v`.** They are different libraries:
  - `@vueuse/motion` — small, simpler API (`v-motion` directive,
    presets), no layout animations, ~5KB gz.
  - `motion-v` — full Motion API ported from framer-motion, layout
    animations, ~25KB gz.

  The prompt explicitly says "@vueuse/motion (this is the Vue equivalent
  of framer-motion)" — that statement is not quite right. **`motion-v`
  is the actual Vue framer-motion port.** I will surface this in the
  design brief and recommend the user pick:
  - **Option A (closer to prompt's intent):** `motion-v` — gives true
    layout animations needed for the FAQ tab indicator slide; matches
    the React 21st.dev source pattern more directly.
  - **Option B (closer to prompt's letter):** `@vueuse/motion` — smaller
    bundle, fits the 180KB JS budget more comfortably, but the FAQ tab
    indicator must be implemented manually (FLIP via `getBoundingClientRect`
    or pure CSS transitions).

  I'll recommend Option A in the brief; the skill that ships in this
  project is for `motion-v`, so we already have the docs path covered.

---

## emil-design-eng

- **Read at:** yes, full file (the "Initial Response" rule applies only
  when invoked via the Skill tool without a question; here I'm reading
  for audit purposes, so I'm summarizing per §0's audit format)
- **Key takeaway:** Animation decision framework — frequency gates
  whether to animate at all (keyboard-initiated actions: never; rare
  events: can delight). Use custom cubic-beziers, not the weak built-in
  CSS easings. Never animate from `scale(0)` — start from `scale(0.95)`
  with opacity. Buttons get `transform: scale(0.97)` on `:active`.
  Popovers scale from trigger origin (modals stay centered). UI
  durations under 300ms. Use CSS transitions over keyframes for
  interruptible UI. Animate only `transform` and `opacity`. Stagger
  delays 30–80ms.
- **Applied where:** §1 motion tokens (the prompt's `--ease-out-expo`,
  `--ease-out-quart`, `--ease-in-out-3` already match the skill's
  custom-curve principle); §10 nav active-indicator (FLIP for popover-
  origin behavior); §6 phone screen swap (200ms ease-out-expo
  crossfade); §9 FAQ accordion (300ms ease-out-expo); buttons' active
  scale; hero scrub interruptibility; gallery marquee pause-on-hover.
- **Conflicts:** None — the prompt's motion section is essentially this
  skill's worldview already. The one note: the skill says "UI animations
  should stay under 300ms." The prompt has `section: 600-800ms` for
  section transitions. That's fine — the skill's 300ms rule is for
  micro-interactions, not section choreography (it explicitly allows
  longer for marketing/explanatory motion). I will not exceed 300ms on
  micro-interactions (button press, tab swap, accordion, hover) and
  reserve 600–800ms for section-scale entrances only.

---

## high-end-visual-design

- **Read at:** yes, full file
- **Key takeaway:** Anti-pattern enforcement (banned fonts: Inter, Roboto,
  Arial, Open Sans, Helvetica; banned thick-stroked icons; banned harsh
  shadows; banned linear/ease-in-out transitions; banned arbitrary
  z-indexes). "Variance Engine" with vibe + layout archetypes. "Double-
  Bezel" (Doppelrand) nested-card architecture. Button-in-button trailing
  icon pattern. Macro-whitespace (`py-24` to `py-40` sections). Custom
  cubic-bezier transitions only. Performance guardrails: animate
  transform/opacity only, `backdrop-blur` only on fixed/sticky elements.
- **Applied where:** §1 banned fonts list (overlap perfect), motion
  guardrails, performance constraints. §2 perf budget. §10 nav (`mt-6`
  detached pill is consistent with "Fluid Island Nav"). §15 pre-delivery
  checklist seeds CONSISTENCY_CHECKLIST.md.
- **Conflicts:** **Significant — this skill pushes a more maximalist
  agency aesthetic than the Synq brief allows.** The skill's archetypes
  (Ethereal Glass / OLED black with glowing orbs; Editorial Luxury with
  variable serifs at massive sizes; Z-Axis Cascade with `-2deg`/`3deg`
  rotation; massive typography) directly conflict with the prompt's
  Revolut-clean restraint, light-mode ivory direction, type scale
  capped at `clamp(40px, 5vw, 72px)`, no 120px display, no glassmorphism
  overload, no editorial-magazine display fonts.

  **Resolution:** I honor the Synq prompt over this skill where they
  conflict. I keep the overlap: banned generic fonts, custom cubic-bezier
  curves, performance guardrails, GPU-safe animation, scroll-entry
  reveals (translate-y + opacity, no blur on scrolling content), no
  arbitrary z-indexes. I drop: Double-Bezel nested cards (too haptic for
  Revolut-clean), Z-Axis Cascade rotations, OLED black backgrounds,
  variable-serif display, eyebrow-tag chip pills (the prompt uses mono
  caps eyebrows, which is restrained).

---

## Unavailable

None of the 8 required skills were missing. All 8 are present at
`C:\Users\btv\OneDrive\Documents\website\.claude\skills\<name>\SKILL.md`.

---

## Forbidden skills — confirmed not consulted

Per §0 forbidden list: I did not read `tresjs`, `industrial-brutalist-ui`,
`brandkit`, `gpt-taste`, `image-to-code`, `imagegen-frontend-web`,
`design-taste-frontend`, `stitch-design-taste`, `redesign-existing-projects`,
`full-output-enforcement`, `impeccable`, `minimalist-ui`, or any 3D /
particle / generative-art skill. They exist on disk but were not opened.

---

## Issues that need user resolution before the design brief

Three items from the audit require a decision:

1. **Nuxt 3 vs Nuxt 4.** Prompt says Nuxt 3; the loaded skill is Nuxt 4+.
   Recommendation: latest Nuxt 4 stable. Confirm or override.

2. **`@vueuse/motion` vs `motion-v`.** Prompt says `@vueuse/motion`; the
   loaded skill is `motion-v`. The two are different libraries. The FAQ
   tab-indicator slide animation (§9) is materially easier with `motion-v`
   layout animations. Recommendation: `motion-v`. Confirm or override.

3. **Font selection.** Prompt lists Söhne (preferred), GT America, ABC
   Whyte, Aeonik, Inter Display (with caveats). Söhne and GT America are
   commercial paid licenses ($$$). ABC Whyte and Aeonik also paid. None
   ship as free webfonts. Open-source candidates that hit the same
   Revolut-clean register: **Geist** (free, Vercel), **General Sans**
   (Fontshare free), **Satoshi** (Fontshare free), **Inter Display +
   custom OpenType tuning** (free, with discipline). Recommendation:
   **Geist Sans** + **Geist Mono** — free, self-hostable woff2,
   geometric-warm sans, very close to the Söhne register. Confirm,
   override with another open-source choice, or supply a paid license.

These three answers will shape the brief; I'll wait on them before
writing it.

---

End of audit. Stopping per §18 checkpoint 1. Awaiting user
acknowledgement.
