/**
 * Playwright — اختبارات E2E (مراسي، إتاحة أساسية).
 * التشغيل: npm run test:e2e
 * خادم ثابت يُشغَّل تلقائياً على المنفذ 4173 ما لم يُضبط PLAYWRIGHT_BASE_URL أو PLAYWRIGHT_SKIP_WEBSERVER=1
 */
'use strict';

var path = require('path');

var port = process.env.PLAYWRIGHT_SERVER_PORT || '4173';
var host = process.env.PLAYWRIGHT_SERVER_HOST || '127.0.0.1';
var baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://' + host + ':' + port;

/** @type {import('@playwright/test').PlaywrightTestConfig} */
module.exports = {
  testDir: path.join(__dirname, 'e2e'),
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [['list']],
  timeout: 120 * 1000,
  expect: { timeout: 15 * 1000 },
  use: {
    baseURL: baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    locale: 'en-US',
    viewport: { width: 1280, height: 720 },
  },
  projects: [{ name: 'chromium', use: { channel: undefined } }],
  webServer: process.env.PLAYWRIGHT_SKIP_WEBSERVER
    ? undefined
    : {
        command:
          'npx --yes http-server@14.1.1 . -p ' + port + ' -c-1 -s',
        cwd: __dirname,
        url: baseURL + '/',
        reuseExistingServer: !process.env.CI,
        timeout: 180 * 1000,
      },
};
