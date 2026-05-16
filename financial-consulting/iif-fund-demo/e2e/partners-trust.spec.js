/**
 * E2E: قسم الشركاء — شارة التخطيط، بطاقة المراسلة، رابط اتصل بنا.
 */
'use strict';

var { test, expect } = require('@playwright/test');

test.describe('Partners & trust section', function () {
  test('badge, chat card, and contact CTA', async function ({ page }) {
    await page.goto('/index.html#partners-trust', { waitUntil: 'domcontentloaded' });
    await page.locator('#partners-trust').waitFor({ state: 'visible', timeout: 30 * 1000 });
    await expect(page.locator('#partners-trust .iif-badge--planning')).toBeVisible();
    await expect(page.locator('#partners-trust .iif-partners-chat-card')).toBeVisible();
    var contactInCard = page.locator('#partners-trust .iif-partners-chat-card a[href="#contact"]');
    await expect(contactInCard).toBeVisible();
    await expect(contactInCard).toHaveAttribute('href', '#contact');
    var termsHint = page.locator('#partners-trust .iif-partners-terms-hint a[href="#terms"]');
    await expect(termsHint).toBeVisible();
  });

  test('Arabic: RTL and contact link in card', async function ({ page }) {
    await page.goto('/index.html?lang=ar#partners-trust', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.locator('#partners-trust')).toBeVisible();
    await expect(page.locator('#partners-trust .iif-partners-chat-card a[href="#contact"]')).toBeVisible();
  });
});
