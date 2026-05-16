/**
 * E2E: فحص إتاحة محدود (axe) على أقسام مختارة — ليس تدقيقاً كاملاً للصفحة الضخمة.
 */
'use strict';

var { test, expect } = require('@playwright/test');
var AxeBuilder = require('@axe-core/playwright').AxeBuilder;

test.describe('Accessibility (axe)', function () {
  test('trust-entry: no critical axe violations (scoped)', async function ({ page }) {
    await page.goto('/index.html#trust-entry', { waitUntil: 'domcontentloaded' });
    await page.locator('#trust-entry').waitFor({ state: 'visible', timeout: 30 * 1000 });

    var results = await new AxeBuilder({ page })
      .include('#trust-entry')
      .disableRules(['color-contrast'])
      .analyze();

    var critical = results.violations.filter(function (v) {
      return v.impact === 'critical';
    });
    expect(
      critical,
      critical.length ? JSON.stringify(critical, null, 2) : ''
    ).toHaveLength(0);
  });

  test('contact: no critical axe violations (scoped)', async function ({ page }) {
    await page.goto('/index.html#contact', { waitUntil: 'domcontentloaded' });
    await page.locator('#contact').waitFor({ state: 'visible', timeout: 30 * 1000 });

    var results = await new AxeBuilder({ page })
      .include('#contact')
      .disableRules(['color-contrast'])
      .analyze();

    var critical = results.violations.filter(function (v) {
      return v.impact === 'critical';
    });
    expect(
      critical,
      critical.length ? JSON.stringify(critical, null, 2) : ''
    ).toHaveLength(0);
  });

  test('partners-trust: no critical axe violations (scoped)', async function ({ page }) {
    await page.goto('/index.html#partners-trust', { waitUntil: 'domcontentloaded' });
    await page.locator('#partners-trust').waitFor({ state: 'visible', timeout: 30 * 1000 });

    var results = await new AxeBuilder({ page })
      .include('#partners-trust')
      .disableRules(['color-contrast'])
      .analyze();

    var critical = results.violations.filter(function (v) {
      return v.impact === 'critical';
    });
    expect(
      critical,
      critical.length ? JSON.stringify(critical, null, 2) : ''
    ).toHaveLength(0);
  });
});
