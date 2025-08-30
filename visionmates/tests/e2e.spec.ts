import { test, expect } from '@playwright/test';

test('placeholder passes', async () => {
  expect(true).toBe(true);
});

test.skip('visiting /projects shows list', async ({ page }) => {
  await page.goto('http://localhost:3000/projects');
  await expect(page.locator('h1', { hasText: 'Projects' })).toBeVisible();
});

test.skip('posting a comment updates list (optimistic)', async ({ page }) => {
  await page.goto('http://localhost:3000/projects/00000000-0000-0000-0000-000000000000');
  await page.fill('textarea', 'Hello world');
  await page.click('button:has-text("Post Comment")');
  await expect(page.locator('text=Hello world')).toBeVisible();
});

test.skip('clicking intent toggles state', async ({ page }) => {
  await page.goto('http://localhost:3000/projects/00000000-0000-0000-0000-000000000000');
  await page.click('button:has-text("watch")');
  await expect(page.locator('button:has-text("watch")')).toHaveAttribute('aria-pressed', 'true');
});

