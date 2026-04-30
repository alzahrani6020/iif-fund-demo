/**
 * قراءة العدّ فقط لمن يعرف VISITOR_STATS_SECRET (يُضبط في لوحة Netlify).
 * استخدم: https://thiqqah.live/.netlify/functions/visitor-stats?key=السر
 * لا تضف هذا الرابط في الموقع العام.
 */
import { getStore } from "@netlify/blobs";

const STORE = "thiqqah-visitor-v1";
const KEY = "count";

export default async (request, context) => {
  if (request.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  const secret = process.env.VISITOR_STATS_SECRET || "";
  const url = new URL(request.url);
  const key = url.searchParams.get("key") || "";

  if (!secret || key !== secret) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }

  let count = 0;
  try {
    const store = getStore(STORE, { context });
    const raw = await store.get(KEY);
    if (raw != null) {
      const parsed = parseInt(String(raw), 10);
      if (Number.isFinite(parsed) && parsed >= 0) count = parsed;
    }
  } catch (err) {
    console.error("visitor-stats", err);
    return new Response(JSON.stringify({ error: "read_failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }

  const body = {
    count,
    hint: "POSTs to visitor-hit increment this; one hit per browser session by default.",
  };

  return new Response(JSON.stringify(body, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
};
