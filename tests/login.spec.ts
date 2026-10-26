import { test, expect } from '@playwright/test';

test('standard user can log in', async ({ page }) => {
  await page.goto('/');

  await page.getByPlaceholder('Username').fill(process.env.STANDARD_USER!);
  await page.getByPlaceholder('Password').fill(process.env.PASSWORD!);
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/inventory\.html/);
  await expect(page.locator('[data-test="title"]')).toHaveText('Products');
});
