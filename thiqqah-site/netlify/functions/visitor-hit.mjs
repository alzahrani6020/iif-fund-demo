/**
 * زيادة عدّاد جلسة واحدة لكل متصفح (يُستدعى من الواجهة بعد وضع علامة sessionStorage).
 * لا يعيد العدّ؛ فقط يزيد. التخزين: Netlify Blobs.
 */
import { getStore } from "@netlify/blobs";

const STORE = "thiqqah-visitor-v1";
const KEY = "count";

export default async (request, context) => {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }

  try {
    const store = getStore(STORE, { context });
    const raw = await store.get(KEY);
    let n = 0;
    if (raw != null) {
      const parsed = parseInt(String(raw), 10);
      if (Number.isFinite(parsed) && parsed >= 0) n = parsed;
    }
    await store.set(KEY, String(n + 1));
  } catch (err) {
    console.error("visitor-hit", err);
    return new Response(JSON.stringify({ ok: false, error: "storage" }), {
      status: 500,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
};
