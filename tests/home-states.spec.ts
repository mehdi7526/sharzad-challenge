import { expect, test } from '@playwright/test';

const scenario = process.env.MOCK_HOME_SCENARIO;

test('empty response shows an accessible empty state', async ({ page }) => {
  test.skip(scenario !== 'empty');
  await page.goto('/home');
  await expect(page.getByRole('status').filter({ hasText: 'در حال حاضر خدمتی' })).toBeVisible();
  await expect(page.locator('#services-grid').locator('a, button')).toHaveCount(0);
});

test('API error shows retry and keeps the error state visible', async ({ page }) => {
  const compatibilityWarnings: string[] = [];
  page.on('console', (message) => {
    if (message.text().includes('[antd: compatible]')) compatibilityWarnings.push(message.text());
  });
  test.skip(scenario !== 'error');
  await page.goto('/home');
  await expect(page.getByRole('alert').filter({ hasText: 'اطلاعات موقتاً' })).toBeVisible();
  const retryResponse = page.waitForResponse('**/api/home');
  await page.getByRole('button', { name: 'تلاش دوباره' }).click();
  expect((await retryResponse).status()).toBe(503);
  await expect(page.locator('#services').getByRole('alert')).toContainText('اطلاعات موقتاً');
  await expect(page.locator('.ant-message-notice-content')).toContainText('اطلاعات موقتاً');
  expect(compatibilityWarnings).toEqual([]);
});
