import { expect, test } from '@playwright/test';
import type { ViewerData } from '../src/features/home/types';

test('home is server-rendered and viewer is fetched by the browser', async ({ page, request }) => {
  const serverResponse = await request.get('/home');
  expect(await serverResponse.text()).toContain('میوه و تره‌بار');
  const homepageRequests: string[] = [];
  page.on('request', (request) => {
    if (request.url().endsWith('/api/home')) homepageRequests.push(request.url());
  });
  const viewerResponse = page.waitForResponse('**/api/viewer');
  await page.goto('/home');
  const response = await viewerResponse;
  expect(response.status()).toBe(200);
  expect(await response.json()).toMatchObject({
    meta: { success: true },
    data: { signedIn: false, wallet: { balance: null } },
  });
  await expect(page.locator('#services-grid').locator('a, button')).toHaveCount(22);
  expect(homepageRequests).toEqual([]);
});

test('viewer retry displays fresh account data without replacing the homepage', async ({
  page,
}) => {
  let attempts = 0;
  const viewer: ViewerData = {
    signedIn: true,
    wallet: { label: 'کیف پول', balance: 15000 },
    notifications: { unreadCount: 2 },
  };
  await page.route('**/api/viewer', (route) => {
    attempts += 1;
    return route.fulfill(
      attempts === 1
        ? {
            status: 502,
            json: {
              meta: { success: false, error_code: 'SERVICE_UNAVAILABLE', error_fields: [] },
              message: 'خطای دریافت حساب نمایشی',
              error_status: 502,
            },
          }
        : { status: 200, json: { meta: { success: true }, data: viewer } },
    );
  });
  await page.goto('/home');
  await expect(page.locator('#services-grid').locator('a, button')).toHaveCount(22);
  await expect(page.locator('#home-content')).toHaveCount(1);
  await page
    .getByRole('button', { name: /مشاهده/ })
    .filter({ hasText: /مشاهده/ })
    .first()
    .click();
  await expect(page.getByRole('alert').filter({ hasText: 'خطای دریافت حساب' })).toBeVisible();
  await page.getByRole('button', { name: 'تلاش دوباره' }).click();
  await expect(page.getByText('موجودی: ۱۵٬۰۰۰ تومان')).toBeVisible();
  await expect(page.locator('#services-grid').locator('a, button')).toHaveCount(22);
});

test('invalid viewer response is rejected before it reaches account UI', async ({ page }) => {
  await page.route('**/api/viewer', (route) =>
    route.fulfill({
      status: 200,
      json: {
        meta: { success: true },
        data: {
          signedIn: true,
          wallet: { label: 'کیف پول', balance: 'invalid' },
          notifications: { unreadCount: 0 },
        },
      },
    }),
  );
  await page.goto('/home');
  await expect(page.locator('#services-grid').locator('a, button')).toHaveCount(22);
  await expect(page.locator('#home-content')).toHaveCount(1);
  await page.getByRole('button', { name: 'حساب کاربری', exact: true }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'پاسخ سرویس معتبر نیست' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'ادامه', exact: true })).toBeDisabled();
});
