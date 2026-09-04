import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

/** Text edits are saved on a debounce; wait for the write before reloading. */
async function waitForAutosave(page: Page, needle: string) {
  await page.waitForFunction((n) => (localStorage.getItem('tracker_v1') ?? '').includes(n), needle);
}

/** Card order matches AREAS: 1 mental, 2 personal, 3 work, … 6 sport, 7 food. */
const card = (n: number) => `.cats .cat:nth-child(${n})`;
const LANG_BTN = '.actions .theme-btn:nth-child(1)';
const THEME_BTN = '.actions .theme-btn:nth-child(2)';

test('marks areas, switches language, and keeps the day across a reload', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.brand')).toHaveText('My Day, My Way');
  await expect(page.locator('.ring .pct')).toHaveText('0%');

  // Mark two of the seven areas and write a note in one of them.
  await page.click(`${card(3)} .cat-ico`);
  await page.click(`${card(6)} .cat-ico`);
  await expect(page.locator('.ring .pct')).toHaveText('29%');
  await expect(page.locator('.summ-text h1')).toHaveText('Good start');
  await expect(page.locator(`${card(3)} .cat-head`)).toHaveAttribute('aria-pressed', 'true');
  await page.fill(`${card(3)} .cat-note`, 'shipped the migration');

  // Money updates live.
  await page.fill('#spent', '40');
  await page.fill('#saved', '15');
  await expect(page.locator('.chip.balance .v')).toHaveText('− AED 25');

  // Switching language re-renders every string, and keeps the day's data.
  await page.click(LANG_BTN);
  await expect(page.locator('.brand')).toHaveText('Дневник вклада');
  await expect(page.locator(`${card(3)} .cat-name`)).toHaveText('Работа');
  await expect(page.locator('.summ-text h1')).toHaveText('Хорошее начало');
  await expect(page.locator('.ring .pct')).toHaveText('29%');
  await expect(page.locator(`${card(3)} .cat-note`)).toHaveValue('shipped the migration');

  // Everything survives a reload, language included.
  await waitForAutosave(page, 'shipped the migration');
  await page.reload();
  await expect(page.locator('.brand')).toHaveText('Дневник вклада');
  await expect(page.locator('.ring .pct')).toHaveText('29%');
  await expect(page.locator(`${card(3)} .cat-note`)).toHaveValue('shipped the migration');
  await expect(page.locator(`${card(6)} .cat-head`)).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#spent')).toHaveValue('40');
  await expect(page.locator('.chip.balance .v')).toHaveText('− AED 25');
});

test('plans the day in the timesheet and remembers the section and theme', async ({ page }) => {
  await page.goto('/');

  // The timesheet starts collapsed, showing the empty donut preview.
  await expect(page.locator('#tsBody')).toBeHidden();
  await expect(page.locator('.tsp-empty-txt')).toContainText('Plan your day by the hour');

  await page.click('.ts-preview:not(.fb-preview)');
  await expect(page.locator('#tsBody')).toBeVisible();

  await page.fill('#tsStart', '09:00');
  await page.fill('#tsEnd', '12:30');
  await page.selectOption('#tsCat', 'work');
  await page.fill('#tsText', 'deep work');
  await page.click('.ts-add');

  await expect(page.locator('.ts-block')).toHaveCount(1);
  await expect(page.locator('.ts-block .th')).toHaveText('09:00–12:30');
  await expect(page.locator('.collapse-head .ch-meta')).toHaveText('1 block · 3.5 h');
  await expect(page.locator('.ts-total')).toHaveText('Planned in total: 3.5 h');

  // A block that ends before it starts is refused.
  await page.fill('#tsEnd', '08:00');
  await page.click('.ts-add');
  await expect(page.locator('.ts-err')).toHaveText('End must be after start.');
  await expect(page.locator('.ts-block')).toHaveCount(1);

  await page.click(THEME_BTN);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

  await waitForAutosave(page, 'deep work');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('#tsBody')).toBeVisible();
  await expect(page.locator('.ts-block')).toHaveCount(1);
});

// UI_SPEC §7: "Nothing scrolls horizontally at 360px width."
test.describe('narrow screens', () => {
  test.use({ viewport: { width: 360, height: 780 } });

  for (const lang of ['en', 'ru'] as const) {
    test(`never scrolls sideways at 360px (${lang})`, async ({ page }) => {
      await page.addInitScript((l) => {
        localStorage.setItem('tracker_lang', l);
        localStorage.setItem('tracker_ts_open', '1');
        localStorage.setItem('tracker_fb_open', '1');
      }, lang);
      await page.goto('/');

      const fits = () =>
        page.evaluate(() => {
          const de = document.documentElement;
          return { scrollW: de.scrollWidth, clientW: de.clientWidth };
        });

      expect(await fits()).toEqual({ scrollW: 360, clientW: 360 });

      // The area tip is the widest floating element — it must stay on screen too.
      await page.click(`${card(2)} .cat-info`);
      await expect(page.locator(`${card(2)} .cat-tip`)).toBeVisible();
      const box = await page.locator(`${card(2)} .cat-tip`).boundingBox();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(360);
      expect(await fits()).toEqual({ scrollW: 360, clientW: 360 });
    });
  }
});
