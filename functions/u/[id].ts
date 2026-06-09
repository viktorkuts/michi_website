/// <reference types="@cloudflare/workers-types" />
// SPEC share-deeplinks:T5 (2026-05-28). Parallel of `functions/e/[id].ts`
// for the share-profile landing page. Soft-deleted users return 410
// from hull → polite "/?gone=profile" redirect rather than a hard 404.

import {
  type ProfileShareData,
  renderProfileShareHtml,
  UUID_V4,
} from "../_shared/template";

interface Env {
  HULL_BASE_URL: string;
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

  let snapshot: ProfileShareData;
  try {
    const res = await fetch(`${base}/api/v1/share/profile/${id}`, {
      cf: { cacheTtl: 60, cacheEverything: true },
    });
    if (res.status === 410) {
      return Response.redirect("https://michi.quest/?gone=profile", 302);
    }
    if (res.status === 404) {
      return Response.redirect("https://michi.quest/?notfound=profile", 302);
    }
    if (!res.ok) {
      return Response.redirect("https://michi.quest/?error=share", 302);
    }
    snapshot = (await res.json()) as ProfileShareData;
  } catch {
    return Response.redirect("https://michi.quest/?error=share", 302);
  }

  const html = renderProfileShareHtml(snapshot);
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=60, stale-while-revalidate=600",
      "Content-Security-Policy":
        "default-src 'self'; img-src https: data:; style-src 'unsafe-inline'; script-src 'none'; frame-ancestors 'none'",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
  });
};
