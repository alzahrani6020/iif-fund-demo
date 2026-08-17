#!/usr/bin/env node
/**
 * Verify https://iiffund.com/ is reachable, uses HTTPS, and serves the fund interface.
 */
const url = 'https://iiffund.com/';

try {
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) {
    console.error(`❌ ${url} returned ${res.status}`);
    process.exit(1);
  }
  const body = await res.text();
  if (!body.includes('International Investment Fund') && !body.includes('صندوق الاستثمار الدولي')) {
    console.error('❌ Page does not appear to be the fund interface.');
    process.exit(1);
  }
  console.log(`✅ ${url} is up and serving the fund interface (${res.status}).`);
} catch (e) {
  console.error('❌ Failed to reach', url, e.message);
  process.exit(1);
}
