/// <reference types="@cloudflare/workers-types" />
// SPEC share-deeplinks:T4 (2026-05-28). Cloudflare Pages Function that
// renders the share-event landing page with per-link OG meta. Runs on
// the Workers runtime on every `/e/<id>` hit (CF's `_routes.json`
// gates static assets out of the runtime so only THIS path invokes
// the function — see public/_routes.json).
//
// Flow:
//   1. Validate the path param looks like a UUIDv4. Junk → 404.
//   2. Fetch the masked snapshot from hull (`HULL_BASE_URL` env var).
//      Cache at edge for 60s via `cf.cacheTtl` so Slack-workspace
//      crawler bursts don't amplify BE load.
//   3. 410 Gone → 302 to `/?gone=event` (polite "this is gone" copy).
//      404 / network fail → 302 to `/?notfound=event`.
//   4. Render the HTML template with OG meta + smart banner + deeplink
//      script. Return text/html with `max-age=60, swr=600`.
//
// CSP per SPEC V11: no third-party scripts, inline style only,
// imagedelivery.net allowed for the cover image source.

import {
  type EventShareData,
  renderEventShareHtml,
  UUID_V4,
} from "../_shared/template";

interface Env {
  HULL_BASE_URL: string; // e.g. https://api.synq.app
}

export const onRequest: PagesFunction<Env> = async ({ params, env }) => {
  const id = (params.id as string) ?? "";
  if (!UUID_V4.test(id)) {
    return new Response(null, { status: 404 });
  }

  const base = env.HULL_BASE_URL?.replace(/\/+$/, "") ?? "";
  if (!base) {
    return new Response(null, { status: 502 });
  }

  let snapshot: EventShareData;
  try {
    const res = await fetch(`${base}/api/v1/share/event/${id}`, {
      // Edge cache for 60s — share-link unfurl crawlers (Slack et al.)
      // hammer the URL once per workspace member. SPEC V4.
      cf: { cacheTtl: 60, cacheEverything: true },
    });
    if (res.status === 410) {
      return Response.redirect("https://michi.quest/?gone=event", 302);
    }
    if (res.status === 404) {
      return Response.redirect("https://michi.quest/?notfound=event", 302);
    }
    if (!res.ok) {
      return Response.redirect("https://michi.quest/?error=share", 302);
    }
    snapshot = (await res.json()) as EventShareData;
  } catch {
    return Response.redirect("https://michi.quest/?error=share", 302);
  }

  const html = renderEventShareHtml(snapshot);
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=60, stale-while-revalidate=600",
      // SPEC V11: inline style + JS for the deeplink dance, no
      // third-party scripts; cover image rides through CF's CDN.
      "Content-Security-Policy":
        "default-src 'self'; img-src https: data:; style-src 'unsafe-inline'; script-src 'none'; frame-ancestors 'none'",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
  });
};
