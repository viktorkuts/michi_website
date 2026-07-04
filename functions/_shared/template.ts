// SPEC share-deeplinks:T7 (2026-05-28). Shared HTML template for the
// per-link landing pages served by `functions/e/[id].ts` and
// `functions/u/[id].ts`. Self-contained — no external scripts, inline
// styles only, < 8 KB gzipped per V11. Matches michi.quest brand
// tokens (persimmon + ivory + Geist) so the landing reads as part of
// the site, not a one-off page.
//
// Strategy: Universal-Links-first, NO JavaScript redirect.
//   • When the app IS installed, iOS Universal Links / Android App Links
//     intercept the https://michi.quest/e|u/<id> tap at the OS layer and
//     open the app directly — this landing page never paints.
//   • When the app is NOT installed (or the OS missed the UL handoff),
//     the page paints and offers a manual "Open in app" button + store
//     links. The iOS Smart App Banner (when IOS_APP_ID is set) covers the
//     installed-but-UL-missed edge.
//   • The CTA points at the canonical https self-URL (NOT a `synq://`
//     custom scheme). Tapping it re-triggers the OS Universal/App Link
//     handoff when installed, and is a harmless same-page reload when
//     not — this avoids the browser→app→browser bounce that a raw
//     `synq://` href produced (custom scheme errors / store-bounces when
//     the app is absent, and double-handles when present).
//   • CSP is `script-src 'none'` (see functions/e/[id].ts), so there is
//     deliberately NO inline JS auto-redirect. Do not add one without a
//     CSP nonce/hash AND a re-fire guard + store-fallback timeout.
//
// OG meta is mandatory for link-unfurl crawlers (Slack / iMessage /
// WhatsApp / Twitter / Discord). Twitter wants `summary_large_image`
// when a cover is present; falls back to `summary` for masked rows
// w/ no image.

const APP_STORE_URL = "https://apps.apple.com/app/synq";
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.synq.app";
const SITE_URL = "https://michi.quest";

// iOS App Store numeric id for the Smart App Banner (the digits in the
// store URL, e.g. id1234567890 → "1234567890"). The banner is the
// OS-native way to surface "OPEN" when the app is installed; emitted only
// when set so we never ship an invalid placeholder app-id.
// TODO(release): set once the App Store listing exists.
const IOS_APP_ID: string | null = null;

// HTML-escape minimal — only the chars that change parser state inside
// element text content + double-quoted attribute values. Server is the
// only string source here (BE-issued), but defense-in-depth costs ~0.
const esc = (s: string): string =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export interface EventShareData {
  id: string;
  title: string;
  description: string;
  coverImage: string | null;
  hostName: string;
  date: string | null;
  location: string | null;
  isPrivate: boolean;
  attendeeCount: number;
}

export interface ProfileShareData {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  city: string | null;
  isPrivate: boolean;
}

export type InviteStatus = "active" | "expired" | "exhausted" | "revoked";

export interface InviteShareData {
  token: string;
  ownerName: string;
  ownerImage: string | null;
  status: InviteStatus;
}

interface RenderInput {
  ogTitle: string;
  ogDescription: string;
  ogImage: string | null;
  pageUrl: string;
  deeplink: string;
  iosSmartBanner: string; // synq://... arg for apple-itunes-app
  bodyHtml: string;
}

const baseStyles = `
:root {
  --bg-primary: #F7F4EE;
  --bg-secondary: #FAF8F3;
  --ink-primary: #14121A;
  --ink-secondary: #4F4B65;
  --ink-muted: #6E6982;
  --brand: #00F0FF;
  --brand-hover: #A23615;
  --brand-soft: #FBE7DF;
  --rule: #E8E2D5;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body {
  height: 100%;
  background: var(--bg-primary);
  color: var(--ink-primary);
  font-family: 'Geist', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
body {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
}
main.card {
  width: 100%;
  max-width: 480px;
  background: var(--bg-secondary);
  border: 1px solid var(--rule);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(20, 18, 26, 0.04);
}
.cover {
  width: 100%;
  aspect-ratio: 16 / 10;
  background: var(--brand-soft);
  background-size: cover;
  background-position: center;
}
.avatar {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: var(--brand-soft);
  background-size: cover;
  background-position: center;
  margin: 32px auto 0;
}
.body { padding: 24px; text-align: center; }
.kicker {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--brand);
  margin-bottom: 10px;
}
h1 {
  font-size: 24px;
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1.2;
  margin-bottom: 8px;
}
.meta {
  font-size: 14px;
  color: var(--ink-secondary);
  margin-bottom: 4px;
}
.meta-row {
  display: flex;
  gap: 12px;
  justify-content: center;
  font-size: 13px;
  color: var(--ink-muted);
  margin-top: 12px;
}
.description {
  font-size: 15px;
  color: var(--ink-secondary);
  margin-top: 16px;
  line-height: 1.5;
}
.cta {
  display: inline-block;
  margin-top: 24px;
  padding: 14px 28px;
  background: var(--brand);
  color: var(--bg-primary);
  font-weight: 600;
  font-size: 15px;
  letter-spacing: -0.005em;
  text-decoration: none;
  border-radius: 999px;
  transition: background 120ms ease;
}
.cta:hover, .cta:focus-visible { background: var(--brand-hover); }
.foot {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px dashed var(--rule);
  font-size: 12px;
  color: var(--ink-muted);
}
.foot a { color: var(--brand); text-decoration: none; font-weight: 500; }
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #14121A;
    --bg-secondary: #1F1B26;
    --ink-primary: #F7F1E6;
    --ink-secondary: rgba(247, 241, 230, 0.72);
    --ink-muted: rgba(247, 241, 230, 0.55);
    --rule: rgba(247, 241, 230, 0.12);
  }
}
`;

// Universal-Links-first: NO JS auto-redirect (see header). The "Open in
// app" CTA targets the canonical https self-URL so a tap re-triggers the
// OS Universal/App Link handoff when the app is installed and is a benign
// reload otherwise — never a `synq://` custom-scheme href (that flashed an
// error / bounced to the store and caused the redirect loop). The Smart
// App Banner covers the rare installed-but-UL-missed case.

const render = (i: RenderInput): string => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(i.ogTitle)} — Michi</title>
<meta name="description" content="${esc(i.ogDescription)}">
<meta property="og:type" content="website">
<meta property="og:url" content="${esc(i.pageUrl)}">
<meta property="og:title" content="${esc(i.ogTitle)}">
<meta property="og:description" content="${esc(i.ogDescription)}">
${i.ogImage ? `<meta property="og:image" content="${esc(i.ogImage)}">` : ""}
<meta name="twitter:card" content="${i.ogImage ? "summary_large_image" : "summary"}">
<meta name="twitter:title" content="${esc(i.ogTitle)}">
<meta name="twitter:description" content="${esc(i.ogDescription)}">
${i.ogImage ? `<meta name="twitter:image" content="${esc(i.ogImage)}">` : ""}
${IOS_APP_ID ? `<meta name="apple-itunes-app" content="app-id=${IOS_APP_ID}, app-argument=${esc(i.iosSmartBanner)}">` : ""}
<meta name="theme-color" content="#F7F4EE">
<link rel="icon" href="/favicon.ico" type="image/x-icon">
<link rel="preload" as="font" type="font/woff2" href="/fonts/geist-sans-400.woff2" crossorigin="anonymous">
<link rel="preload" as="font" type="font/woff2" href="/fonts/geist-sans-600.woff2" crossorigin="anonymous">
<style>${baseStyles}</style>
</head>
<body>
<main class="card">
${i.bodyHtml}
</main>
</body>
</html>`;

const formatDate = (iso: string | null): string | null => {
  if (!iso) return null;
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return null;
  }
};

export const renderEventShareHtml = (data: EventShareData): string => {
  const pageUrl = `${SITE_URL}/e/${data.id}`;
  const deeplink = `synq://event/${data.id}`;
  const formattedDate = formatDate(data.date);

  const bodyParts: string[] = [];
  if (data.coverImage && !data.isPrivate) {
    bodyParts.push(
      `<div class="cover" style="background-image:url('${esc(data.coverImage)}')"></div>`,
    );
  }
  bodyParts.push(`<div class="body">`);
  bodyParts.push(`<div class="kicker">Event on Michi</div>`);
  bodyParts.push(`<h1>${esc(data.title)}</h1>`);
  if (data.hostName) {
    bodyParts.push(`<div class="meta">Hosted by ${esc(data.hostName)}</div>`);
  }
  const metaItems: string[] = [];
  if (formattedDate) metaItems.push(esc(formattedDate));
  if (data.location) metaItems.push(esc(data.location));
  if (!data.isPrivate && data.attendeeCount > 0) {
    metaItems.push(`${data.attendeeCount} going`);
  }
  if (metaItems.length) {
    bodyParts.push(
      `<div class="meta-row">${metaItems.map((m) => `<span>${m}</span>`).join("")}</div>`,
    );
  }
  if (data.description) {
    bodyParts.push(`<p class="description">${esc(data.description)}</p>`);
  }
  // CTA targets the https self-URL (Universal/App Link handoff when
  // installed; benign reload when not), NOT `synq://` — see strategy note.
  bodyParts.push(`<a class="cta" href="${esc(pageUrl)}">Open in app</a>`);
  bodyParts.push(
    `<div class="foot">Don't have Michi? <a href="${esc(APP_STORE_URL)}">App Store</a> · <a href="${esc(PLAY_STORE_URL)}">Play Store</a></div>`,
  );
  bodyParts.push(`</div>`);

  return render({
    ogTitle: data.title,
    ogDescription: data.description || "Find what's happening near you.",
    ogImage: data.coverImage,
    pageUrl,
    deeplink,
    iosSmartBanner: deeplink,
    bodyHtml: bodyParts.join(""),
  });
};

export const renderProfileShareHtml = (data: ProfileShareData): string => {
  const pageUrl = `${SITE_URL}/u/${data.id}`;
  const deeplink = `synq://user/${data.id}`;

  const bodyParts: string[] = [];
  if (data.avatarUrl && !data.isPrivate) {
    bodyParts.push(
      `<div class="avatar" style="background-image:url('${esc(data.avatarUrl)}')"></div>`,
    );
  } else {
    bodyParts.push(`<div class="avatar"></div>`);
  }
  bodyParts.push(`<div class="body">`);
  bodyParts.push(`<div class="kicker">Profile on Michi</div>`);
  bodyParts.push(`<h1>${esc(data.displayName)}</h1>`);
  if (data.city) {
    bodyParts.push(`<div class="meta">${esc(data.city)}</div>`);
  }
  // CTA targets the https self-URL (Universal/App Link handoff when
  // installed; benign reload when not), NOT `synq://` — see strategy note.
  bodyParts.push(`<a class="cta" href="${esc(pageUrl)}">Open in app</a>`);
  bodyParts.push(
    `<div class="foot">Don't have Michi? <a href="${esc(APP_STORE_URL)}">App Store</a> · <a href="${esc(PLAY_STORE_URL)}">Play Store</a></div>`,
  );
  bodyParts.push(`</div>`);

  const description = data.isPrivate
    ? "Open Michi to view this profile."
    : data.city
      ? `${data.displayName} on Michi · ${data.city}`
      : `${data.displayName} on Michi`;

  return render({
    ogTitle: data.displayName,
    ogDescription: description,
    ogImage: data.avatarUrl,
    pageUrl,
    deeplink,
    iosSmartBanner: deeplink,
    bodyHtml: bodyParts.join(""),
  });
};

// Friend-invite landing. The token deep-links to the redeem flow when the
// app is installed (AASA /i/*); otherwise this OG card paints with an "Add
// in app" CTA. Non-active tokens render a tombstone (no CTA) so a shared
// expired/revoked link reads as dead instead of erroring.
export const renderInviteShareHtml = (data: InviteShareData): string => {
  const pageUrl = `${SITE_URL}/i/${data.token}`;
  const deeplink = `synq://invite/${data.token}`;
  const status = data.status;
  const active = status === "active";

  const tombstoneCopy: Record<Exclude<InviteStatus, "active">, string> = {
    expired: "This invite link has expired.",
    exhausted: "This invite link has already been used.",
    revoked: "This invite link was turned off by its owner.",
  };

  const bodyParts: string[] = [];
  if (active && data.ownerImage) {
    bodyParts.push(
      `<div class="avatar" style="background-image:url('${esc(data.ownerImage)}')"></div>`,
    );
  } else {
    bodyParts.push(`<div class="avatar"></div>`);
  }
  bodyParts.push(`<div class="body">`);
  bodyParts.push(`<div class="kicker">Friend invite on Michi</div>`);
  if (status === "active") {
    bodyParts.push(`<h1>${esc(data.ownerName)}</h1>`);
    bodyParts.push(`<div class="meta">wants to connect on Michi</div>`);
    // CTA targets the https self-URL (Universal/App Link handoff when
    // installed; benign reload when not), NOT `synq://` — see strategy note.
    bodyParts.push(`<a class="cta" href="${esc(pageUrl)}">Add in app</a>`);
  } else {
    bodyParts.push(`<h1>Invite unavailable</h1>`);
    bodyParts.push(
      `<div class="meta">${esc(tombstoneCopy[status])}</div>`,
    );
  }
  bodyParts.push(
    `<div class="foot">Don't have Michi? <a href="${esc(APP_STORE_URL)}">App Store</a> · <a href="${esc(PLAY_STORE_URL)}">Play Store</a></div>`,
  );
  bodyParts.push(`</div>`);

  return render({
    ogTitle: active ? `${data.ownerName} on Michi` : "Michi invite",
    ogDescription: active
      ? `${data.ownerName} invited you to connect on Michi.`
      : "This Michi invite link is no longer active.",
    ogImage: active ? data.ownerImage : null,
    pageUrl,
    deeplink,
    iosSmartBanner: deeplink,
    bodyHtml: bodyParts.join(""),
  });
};

// Invite-token validator. Tokens are `randomBytes(16).toString("base64url")`
// (~22 chars of [A-Za-z0-9_-]) — distinct from SHARE_ID, which excludes the
// underscore. Cheap junk-filter only; hull is the real authority.
export const INVITE_TOKEN = /^[A-Za-z0-9_-]{16,64}$/;

// Share-id validator. Cheap junk-filter ONLY — hull is the real
// authority (404s unknown ids). Must accept BOTH id shapes the app mints:
//   • Event.id  → cuid  (e.g. `clz1a2b3c0000xyz9defghij`) — Prisma
//     `@default(cuid())`; no hyphens, starts with a letter, base36-ish.
//   • User.id   → UUID v4 (better-auth) — hyphenated hex.
// The previous strict UUID_V4 regex 404'd EVERY event share because a
// cuid never matches it. Keep this permissive: 8–64 chars, alphanumeric
// plus hyphen. Anything outside that is unambiguous junk.
export const SHARE_ID = /^[A-Za-z0-9-]{8,64}$/;

// Retained for any external importer / test; SHARE_ID is the gate used
// by the Pages functions now.
export const UUID_V4 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
