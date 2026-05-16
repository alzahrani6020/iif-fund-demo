/**
 * E2E: لغة إضافية + تنقل من قائمة SEO.
 */
'use strict';

var { test, expect } = require('@playwright/test');

test.describe('i18n', function () {
  test('French query + governance anchor', async function ({ page }) {
    await page.goto('/index.html?lang=fr#governance-snapshot', {
      waitUntil: 'domcontentloaded',
    });
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
    await expect(page.locator('#governance-snapshot')).toBeVisible({ timeout: 30 * 1000 });
  });
});

test.describe('SEO key navigation', function () {
  test('About link from key sections nav', async function ({ page }) {
    await page.goto('/index.html', { waitUntil: 'domcontentloaded' });
    await page.locator('#iif-seo-keynav a[href="#about"]').first().click();
    await expect(page).toHaveURL(/#about/);
    await expect(page.locator('#about')).toBeVisible({ timeout: 15 * 1000 });
  });
});
