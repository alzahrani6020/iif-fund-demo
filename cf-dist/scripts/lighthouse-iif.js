#!/usr/bin/env node
/**
 * Run Lighthouse once against a URL (desktop or mobile preset).
 *
 *   npm run lh -- https://127.0.0.1:5500/iif-fund-demo/
 *   IIF_LH_URL=https://example.com/ npm run lh
 *   IIF_LH_OUT=./reports/custom.html npm run lh -- http://localhost:3333/
 *   npm run lh -- --mobile http://localhost:3333/
 *   IIF_LH_URL=https://example.com/ npm run lh -- --mobile
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const isMobile = process.argv.includes('--mobile');
const url =
  process.env.IIF_LH_URL ||
  process.argv.slice(2).find((a) => a && a !== '--mobile');
if (!url || !String(url).trim()) {
  console.error(
    'Set IIF_LH_URL or pass URL:\n' +
      '  npm run lh -- https://your-host/path/\n' +
      '  npm run lh -- --mobile https://your-host/path/\n' +
      '  Bash: IIF_LH_URL=https://... npm run lh\n' +
      '  PowerShell: $env:IIF_LH_URL="https://..."; npm run lh'
  );
  process.exit(1);
}

const defaultOut = path.join(
  __dirname,
  '..',
  'reports',
  isMobile ? 'lh-mobile.html' : 'lh-latest.html'
);
const out = process.env.IIF_LH_OUT || defaultOut;
try {
  fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
} catch (e) {
  /* ignore */
}
const args = [
  '--yes',
  'lighthouse@11',
  String(url).trim(),
  '--only-categories=performance,accessibility,best-practices,seo',
  '--chrome-flags=--headless=new',
  '--output=html',
  `--output-path=${out}`,
];
if (!isMobile) {
  args.push('--preset=desktop');
}

const r = spawnSync('npx', args, {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

process.exit(r.status === null ? 1 : r.status);
