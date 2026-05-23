# Synq — Content Ledger

Every placeholder string on the site lives here so the user can review
in one place before launch. `{{TOKEN}}` blocks are the things to
replace; everything else is final-quality v1 copy.

---

## Hero (§4)

```
Headline:    More life outside.

Subhead:     Find what's happening near you. Meet people through the things
             you actually do.

Primary CTA:    Download for iOS         href="#" (placeholder)
Secondary CTA:  Get it on Android        href="#" (placeholder)
```

---

## Intro / description (§5A)

```
Synq is built for what happens after you put your phone down.

Find plans near you. Show up. Meet the people who showed up too.
```

---

## Stats (§5B) — `content/stats.json`

Each stat has a `verify: true` flag rendered as a `[VERIFY]` mono tag
inline. The user removes the flag once the source is confirmed.

| value | label | source |
|-------|-------|--------|
| 4h 37m | Average daily smartphone use, US adults | DATA.AI, 2024 |
| 1 in 2 | Young adults who report feeling lonely | CIGNA LONELINESS INDEX, 2023 |
| 38% | Gen Z adults with no close friends | AMERICAN PERSPECTIVES SURVEY, 2024 |

---

## Features section intro (§6)

```
Eyebrow:   WHAT SYNQ DOES
Headline:  Five things, no feed.
```

## Features blocks (§6) — five total

```
01 — DISCOVER
Find plans nearby.
Browse what's happening tonight, this weekend, or right now. Filter by
what you're actually in the mood for.

02 — JOIN
Show up to something real.
One tap to RSVP. The plan goes in your calendar, the chat opens, you go.

03 — HOST
Make a plan in seconds.
Pick a place, set a time, say what it is. Anyone nearby who's interested
can join.

04 — MEET
Talk to the people who'll be there.
Group chats are scoped to the plan. They quiet down after. No permanent
group threads you forget to leave.

05 — KEEP IT SMALL
Friend lists are capped on purpose.
Synq limits how many people you can friend, so the app stays about the
people you actually see.
```

---

## Gallery (§7)

```
Eyebrow:   THE GALLERY

Headline:  Plans, not posts.

Body:      What people are actually doing on Synq this week.
           Tap any moment to see more.
```

Gallery image tags — `content/gallery-tags.json`:

```
PICKUP BASKETBALL, BROOKLYN
CLIMBING SESSION, BERLIN
ROOFTOP DINNER, LISBON
SUNDAY RUN CLUB, AUSTIN
VINYL NIGHT, TOKYO
POTTERY STUDIO, MONTREAL
SURF CHECK, BIARRITZ
CHESS IN THE PARK, NYC
NEW MOVIE NIGHT, LA
GALLERY OPENING, COPENHAGEN
PIZZA POP-UP, MILAN
PICKUP SOCCER, LONDON
```

12 entries to match the 12 image slots. User replaces tags with real
event names once their gallery imagery lands.

---

## About (§8)

```
Eyebrow:   ABOUT SYNQ

Headline:  {{ABOUT_HEADLINE_PLACEHOLDER}}
           default: "Built for what's outside."

Story:     {{ABOUT_STORY_PLACEHOLDER}}
           default ~120 words:

We started Synq because the apps we used most were the ones we liked
least. Endless feeds, performative posts, friend counts that meant
nothing. We wanted the opposite — an app that pushed us off the phone
and into the room. Synq is small on purpose. It does one thing: it
helps you find a plan, show up, and meet the people who showed up
too. That's it. The rest of your life is the point.

Quote (floating, between satellites):
           {{ABOUT_QUOTE_PLACEHOLDER}}
           default: "We're building the app we wanted to use ourselves."
```

About-section image tags — `content/about-tags.json`:

```
BROOKLYN, 2024     (anchor)
FOUNDERS' MEETUP, 2025
BERLIN, 2024
LISBON LAUNCH, 2025
TEAM DINNER, NYC, 2024
```

---

## FAQ (§9) — `content/faq/*.md`

Four tabs. Each Markdown file is one tab. 4–6 Q&A per tab. Below is the
complete v1 copy. Edit in the .md files; the homepage reads them at
build time.

### Tab 1 — Getting started

```
Q: How do I sign up?
A: Download Synq from the App Store or Play Store. Create an account
   with your phone number. You're in.

Q: What does Synq cost?
A: Synq is free. We don't have ads and we don't sell data.

Q: Where does Synq work?
A: We're live in {{CITIES_PLACEHOLDER — VERIFY}}. New cities open every
   month.

Q: Do I need to be 18?
A: You need to be at least 18 to use Synq.

Q: What if my friends aren't on Synq?
A: That's fine. Synq is built for meeting people you don't know yet —
   not for hanging out with people you already see.
```

### Tab 2 — Safety

```
Q: How does Synq keep things safe?
A: Every account is verified by phone number. Hosts can require photo
   ID for any plan. We screen plan content for prohibited activity
   before it goes live.

Q: How do I report someone?
A: Open their profile, tap the menu icon, choose Report. Reports go to
   a real person within {{REPORT_RESPONSE_TIME — VERIFY: 24h}}.

Q: What happens if I block someone?
A: They can't see your profile, message you, or join any plan you're
   in. They aren't told they were blocked.

Q: Can I see who else is going before I show up?
A: Yes. Every plan shows the host, the headcount, and other RSVP'd
   members before you join.

Q: What if someone no-shows?
A: Hosts can mark no-shows. Repeated no-shows lower account standing
   and limit access to popular plans.

Q: Is my location shared?
A: Only the city you're in. Never your exact location. Plans show a
   neighborhood until you RSVP, then the address.
```

### Tab 3 — Account

```
Q: How do I delete my account?
A: Settings → Account → Delete account. Your data is removed within 30
   days. You can also email contact@synqtogether.com.

Q: How do I change my phone number?
A: Settings → Account → Change number. You'll verify the new number by
   text.

Q: Why is the friend list capped?
A: Because Synq is about the people you actually see, not the people
   you've ever met. The cap is currently {{FRIEND_CAP — VERIFY: 50}}.

Q: Can I export my data?
A: Yes. Settings → Privacy → Request data export. We send a download
   link by email within 7 days.

Q: Will Synq notify me when my friends post?
A: There are no posts. Synq notifies you about plans, not activity
   feeds.
```

### Tab 4 — Plans

```
Q: How do I create a plan?
A: Tap the plus icon. Pick a place. Set a time. Write a one-line
   description. Done.

Q: How do I join a plan?
A: Open the plan, tap RSVP. The plan goes in your calendar, the group
   chat opens, you go.

Q: Can I cancel an RSVP?
A: Up to 2 hours before the plan starts. After that, you're marked as
   no-show if you don't make it.

Q: What happens to the group chat after?
A: It quiets down 24 hours after the plan ends. You can still open it,
   but no new notifications.

Q: Can I host a recurring plan?
A: Yes. When you create a plan, choose "weekly" or "every other week."
```

---

## Footer (§11)

```
Tagline:        More life outside.
Support email:  contact@synqtogether.com  (verify or replace)

Product:        Features · About · FAQ · Download
Legal:          Privacy Policy · Terms of Use · Account Deletion
Help:           Contact · Press

Social:         Instagram · LinkedIn · TikTok    (handles tbd)

Copyright:      © 2026 Synq. All rights reserved.
```

---

## 404

```
Headline:  404
Body:      This plan got cancelled. Let's get you back outside.
CTA:       Back home → /
```

---

## Loader (initial paint)

```
Wordmark:  Synq
Status:    {{progress}}%
```

---

## Verify-before-launch checklist

- [ ] Stats sources verified or replaced; remove `verify: true` from
      `content/stats.json` once each is confirmed.
- [ ] Cities list filled in (FAQ Tab 1).
- [ ] Friend cap number filled in (FAQ Tab 3).
- [ ] Report response time filled in (FAQ Tab 2).
- [ ] About headline + story + quote replaced (or kept as defaults).
- [ ] Real gallery images and tags placed.
- [ ] Real about-section images and tags placed.
- [ ] Real hero frame sequence placed in `/public/hero/`.
- [ ] App Store + Play Store URLs filled in (replace `#` in CTA hrefs).
- [ ] Social handle URLs filled in.
- [ ] Support email confirmed or replaced.
