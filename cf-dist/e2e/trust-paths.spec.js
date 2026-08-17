/**
 * E2E: مسارات الثقة (#trust-entry) — معالم التنقل والروابط.
 */
'use strict';

var { test, expect } = require('@playwright/test');

test.describe('Trust entry navigation', function () {
  test('nav.iif-trust-paths landmark', async function ({ page }) {
    await page.goto('/index.html#trust-entry');
    var nav = page.locator('nav.iif-trust-paths');
    await expect(nav).toBeVisible();
    await expect(nav).toHaveAttribute('aria-labelledby', 'iif-trust-paths-label');
  });

  test('path card links resolve', async function ({ page }) {
    await page.goto('/index.html#trust-entry');
    await page.locator('.iif-path-card[href="#financing-request"]').click();
    await expect(page).toHaveURL(/#financing-request/);
    await expect(page.locator('#financing-request')).toBeVisible();
  });
});
