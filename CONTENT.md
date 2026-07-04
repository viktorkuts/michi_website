# Michi — Content Ledger

Single place to review every user-facing string before launch.
`{{TOKEN}}`-style items are still placeholders; everything else is
final-quality copy. Live sources of truth:

- Hero / How-it-works / About: hardcoded in the section components.
- Stats: `content/stats.json` (rendered via `/api/data/stats`).
- Gallery tags: `content/gallery-tags.json`.
- About tags: `content/about-tags.json`.
- FAQ: `content/faq/*.md` (one file per tab).
- Legal: `content/legal/*.md` (en + fr).

---

## Hero (§4)

```
Headline:    More life outside.
Subhead:     Find what's happening near you. Meet people through the
             things you actually do.

Primary CTA:    Download for iOS         href="#" (PLACEHOLDER — App Store URL)
Secondary CTA:  Get it on Android        href="#" (PLACEHOLDER — Play Store URL)
```

---

## Intro / stats (§5)

```
Eyebrow:   WHY THIS, WHY NOW
Headline:  The phone took the room. / We're building the way back.
```

Three numbers from `content/stats.json`, each with a public source +
link (BLS time-use, CDC inactivity, Surgeon General loneliness).
Rendered as one compact band; the numbers support the headline, they
don't dominate the page.

---

## How it works (§6) — four steps, in SectionFeatures.vue

```
Eyebrow:   HOW IT WORKS
Headline:  Four steps. No feed.
Lead:      Everything in the app exists to get you from opening it to
           being somewhere. Here's the whole loop.

01 — DISCOVER   See what's on tonight, near you.
02 — HOST       Got something going? Put it up in a minute.
03 — COORDINATE Sort the details in the plan's own chat.
04 — SHOW UP    Show up and meet them for real.
```

Screens: /features/screen-1..4.webp — regenerate from the raw exports
in assets/feature-screens/ with `npm run screens`.

---

## Gallery (§7)

```
Eyebrow:   THIS WEEK ON MICHI
Headline:  Plans, not posts.
```

Tags in `content/gallery-tags.json` — Montreal-area events, mono caps.

---

## About / founder (§8) — SectionAbout.vue

```
Eyebrow:   FROM THE FOUNDER
Headline:  Built for what's outside.
Story:     First-person founder note (Montreal origin, why no feed,
           "if Michi is working, you're not on it").
```

Team from `content/about-tags.json`: anchor (CEO) beside the note,
three teammates in a row below.

---

## FAQ (§9) — `content/faq/*.md`

Four tabs: Getting started / Safety / Account / Events. Facts verified
against the founder's product docs (Google/Apple sign-in, host approval
on discovery joins, 365 friend cap with ~1-year auto-decay, friends
added only through shared events / chats / proximity sync, group chats
persist as clubs with events linked to them, city-by-city rollout).

Removed: phone-number question (no phone field), data export, data
selling, friend-post notifications, no-show flagging, RSVP cancellation
window, recurring events (superseded by the club model).

---

## Footer (§11)

```
Tagline:        More life outside.
Support email:  contact@michi.quest (footer, contact page, account
                deletion; legal docs have no email references).
Product:        How it works · About · FAQ · Download
Legal:          Privacy (en/fr) · Terms (en/fr) · Account Deletion
Help:           Contact · Press
Social:         LinkedIn → linkedin.com/company/111004970. Instagram/
                TikTok return when the handles exist.
Copyright:      © {year} MICHI. ALL RIGHTS RESERVED.
```

---

## 404 / error

```
404:   This plan got cancelled. Let's get you back outside.
Other: Something broke on our end. Try again in a moment.
CTA:   Back home → /
```

---

## Verify-before-launch checklist

- [ ] App Store + Play Store URLs (hero + nav Download).
- [ ] Instagram / TikTok handles → add to footer social row.
- [ ] Legal: effective dates + [legal entity name] blanks in
      terms.md/terms-fr.md; remove the "draft, not legal advice"
      blockquotes after counsel review.
- [ ] FAQ facts to reconfirm in-app before launch: report response
      time (24h), account-deletion email window (7 days).
- [ ] Gallery: confirm "TREETOP ROPES COURSE, RAWDON" venue and the
      "PALAZO" club spelling.
- [ ] Real hero frame sequence stays in /public/hero/desktop/.
