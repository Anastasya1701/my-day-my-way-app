import { expect, test } from '@playwright/test';

/** Runs only in the touch project (see playwright.config.ts). */

test('a tip opened by tap can be dismissed by tapping outside it', async ({ page }) => {
  await page.goto('/');
  const info = page.locator('.cats .cat:nth-child(1) .cat-info');
  const tip = info.locator('.cat-tip');
  await expect(tip).toBeHidden();

  // Tapping the glyph opens the tip and must not toggle the card.
  await info.tap();
  await expect(tip).toBeVisible();
  await expect(page.locator('.cats .cat:nth-child(1) .cat-head')).toHaveAttribute('aria-pressed', 'false');

  // Tapping anywhere else closes it again — on touch there is no hover to lose.
  await page.locator('.section-label').first().tap();
  await expect(tip).toBeHidden();

  // And tapping the glyph twice closes it too.
  await info.tap();
  await expect(tip).toBeVisible();
  await info.tap();
  await expect(tip).toBeHidden();
});

test('editable fields are 16px so iOS never zooms in on focus', async ({ page }) => {
  await page.goto('/');
  expect(await page.evaluate(() => matchMedia('(pointer:coarse)').matches)).toBe(true);

  const fields = ['.cat-note', '.cur-sel', '#spent', '.daynote'];
  for (const sel of fields) {
    const size = await page
      .locator(sel)
      .first()
      .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    expect(size, sel).toBeGreaterThanOrEqual(16);
  }
});