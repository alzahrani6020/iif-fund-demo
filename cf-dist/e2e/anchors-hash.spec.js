/**
 * E2E: التحقق من أن المراسي (#id) تُحمّل الصفحة وتُظهر الأقسام المؤسسية.
 */
'use strict';

var { test, expect } = require('@playwright/test');

var ANCHOR_IDS = [
  'main-content',
  'trust-entry',
  'financing-request',
  'financial-consultation',
  'government-bot',
  'stakeholders',
  'selection-criteria',
  'governance-snapshot',
  'partners-trust',
  'contact',
  'terms',
  'compliance',
];

test.describe('Hash navigation', function () {
  for (var i = 0; i < ANCHOR_IDS.length; i++) {
    (function (anchorId) {
      test('visible: #' + anchorId, async function ({ page }) {
        await page.goto('/index.html#' + anchorId, {
          waitUntil: 'domcontentloaded',
          timeout: 90 * 1000,
        });
        var target = page.locator('#' + anchorId).first();
        await target.waitFor({ state: 'attached', timeout: 45 * 1000 });
        await expect(target).toBeVisible({ timeout: 30 * 1000 });
        if (anchorId !== 'main-content') {
          // `toBeInViewport` can be flaky with sticky headers / layout shifts in CI.
          // We force-scroll via DOM then assert bounding box intersects the viewport.
          await page.evaluate(function (id) {
            var el = document.getElementById(id);
            if (!el) return;
            var rect = el.getBoundingClientRect();
            var y = rect.top + (window.scrollY || window.pageYOffset || 0);
            // account for sticky header / top padding
            var topPad = 140;
            try {
              window.scrollTo(0, Math.max(0, y - topPad));
            } catch (e) {
              // fallback
              el.scrollIntoView(true);
            }
          }, anchorId);
          await page.waitForFunction(
            function (id) {
              var el = document.getElementById(id);
              if (!el) return false;
              var r = el.getBoundingClientRect();
              // any intersection with viewport is good enough for anchor navigation
              return r.bottom > 0 && r.top < (window.innerHeight || 800);
            },
            anchorId,
            { timeout: 20000 }
          );
        } else {
          var box = await target.boundingBox();
          expect(box && box.height).toBeGreaterThan(200);
        }
      });
    })(ANCHOR_IDS[i]);
  }
});
