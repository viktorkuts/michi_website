// SPEC share-deeplinks:T7 (2026-05-28). Shared HTML template for the
// per-link landing pages served by `functions/e/[id].ts` and
// `functions/u/[id].ts`. Self-contained — no external scripts, inline
// styles only, < 8 KB gzipped per V11. Matches michi.quest brand
// tokens (persimmon + ivory + Geist) so the landing reads as part of
// the site, not a one-off page.
//
// JS deeplink dance:
//   1. UA mobile-heuristic → set `window.location.href = synq://...`
//      on DOMContentLoaded. If the OS routes the URL to the installed
//      app via Universal Link / App Link, the browser never paints
//      this page (page replaces).
//   2. 1.5s later, if document.hidden === false (app didn't open),
//      redirect to the platform store. Catches the "app not installed"
//      case without flashing the install banner unnecessarily.
//   3. Desktop / unsupported UA → no JS redirect; render landing
//      stand-alone with QR code or store badges (T13 follow-up).
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
  --brand: #C0411C;
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

// Universal-Links-first: NO JS auto-redirect. When the app is installed,
// iOS/Android intercept the https link at the OS level and this page never
// paints. When it DOES paint, the app is (almost always) not installed —
// show the card with a manual "Open in app" button + store links instead
// of auto-firing `synq://` (which flashed an error / bounced to the store
// even when the app was installed). The Smart App Banner covers the rare
// installed-but-UL-missed case.

const render = (i: RenderInput): string => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(i.ogTitle)} — Synq</title>
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
  bodyParts.push(`<div class="kicker">Event on Synq</div>`);
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
  bodyParts.push(`<a class="cta" href="${esc(deeplink)}">Open in app</a>`);
  bodyParts.push(
    `<div class="foot">Don't have Synq? <a href="${esc(APP_STORE_URL)}">App Store</a> · <a href="${esc(PLAY_STORE_URL)}">Play Store</a></div>`,
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
  bodyParts.push(`<div class="kicker">Profile on Synq</div>`);
  bodyParts.push(`<h1>${esc(data.displayName)}</h1>`);
  if (data.city) {
    bodyParts.push(`<div class="meta">${esc(data.city)}</div>`);
  }
  bodyParts.push(`<a class="cta" href="${esc(deeplink)}">Open in app</a>`);
  bodyParts.push(
    `<div class="foot">Don't have Synq? <a href="${esc(APP_STORE_URL)}">App Store</a> · <a href="${esc(PLAY_STORE_URL)}">Play Store</a></div>`,
  );
  bodyParts.push(`</div>`);

  const description = data.isPrivate
    ? "Open Synq to view this profile."
    : data.city
      ? `${data.displayName} on Synq · ${data.city}`
      : `${data.displayName} on Synq`;

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

export const UUID_V4 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
