exports.handler = async function handler() {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(
      {
        ok: true,
        now: new Date().toISOString(),
        items: [],
        note: "Diagnostics aggregation is only available in local dev-server. This endpoint is a safe stub for static hosting.",
      },
      null,
      2
    ),
  };
};

