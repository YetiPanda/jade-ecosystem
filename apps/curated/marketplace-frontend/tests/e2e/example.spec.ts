import { test, expect } from '@playwright/test';

test('homepage loads successfully', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/JADE Spa Marketplace/);
  await expect(page.getByRole('heading', { name: 'JADE Spa Marketplace' })).toBeVisible();
});
