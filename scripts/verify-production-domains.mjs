#!/usr/bin/env node
/**
 * Verify production domains are reachable and serve expected content.
 */
const DOMAINS = [
  { url: 'https://iiffund.com/', check: ['International Investment Fund', 'صندوق الاستثمار الدولي'] },
];

let ok = 0;
let fail = 0;

for (const { url, check } of DOMAINS) {
  try {
    const res = await fetch(url, { redirect: 'follow' });
    if (!res.ok) {
      console.error(`❌ ${url} returned ${res.status}`);
      fail++;
      continue;
    }
    const body = await res.text();
    const found = check.some((s) => body.includes(s));
    if (!found) {
      console.error(`❌ ${url} content does not match expected markers.`);
      fail++;
      continue;
    }
    console.log(`✅ ${url} is healthy (${res.status}).`);
    ok++;
  } catch (e) {
    console.error(`❌ ${url} error:`, e.message);
    fail++;
  }
}

if (fail > 0) {
  process.exit(1);
}
console.log(`\nAll ${ok} production domain(s) verified.`);
