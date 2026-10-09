import { expect, test } from '@playwright/test';
import { browserApiUrl, browserApiHeaders } from './browser-api';

const scenario = process.env.BACKEND_HOME_SCENARIO;

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
  const retryResponse = page.waitForResponse(browserApiUrl('/home'));
  await page.getByRole('button', { name: 'تلاش دوباره' }).click();
  expect((await retryResponse).status()).toBe(503);
  await expect(page.locator('#services').getByRole('alert')).toContainText('اطلاعات موقتاً');
  await expect(page.locator('.ant-message-notice-content')).toContainText('اطلاعات موقتاً');
  expect(compatibilityWarnings).toEqual([]);
});

test('retry refreshes services, menu, and an external banner together', async ({
  page,
  isMobile,
}) => {
  test.skip(scenario !== 'error');
  const image = 'https://images.example.com/banner.svg';
  await page.route(image, (route) =>
    route.fulfill({
      contentType: 'image/svg+xml',
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="240"><rect width="600" height="240" fill="blue"/></svg>',
    }),
  );
  await page.route(browserApiUrl('/home'), (route) =>
    route.fulfill({
      headers: browserApiHeaders,
      json: {
        meta: { success: true },
        data: {
          services: [
            {
              id: 'new-service',
              title: 'خدمت تازه',
              image: '/assets/traffic-banner.jpg',
              href: '#',
            },
          ],
          banner: { image, alt: 'بنر تازه', serviceId: 'new-service' },
        },
      },
    }),
  );
  await page.goto('/home');
  await page.getByRole('button', { name: 'تلاش دوباره' }).click();
  await expect(
    page.locator('#services-grid').getByRole('button', { name: 'خدمت تازه' }),
  ).toBeVisible();
  const banner = page.getByRole('img', { name: 'بنر تازه' });
  await expect(banner).toHaveAttribute('src', image);
  await expect(banner).toHaveCSS('opacity', '1');
  await expect(page.locator('#services').getByRole('alert')).toHaveCount(0);
  if (!isMobile) {
    await page.getByRole('button', { name: /خدمات شهرزاد/ }).click();
    await expect(page.getByRole('menuitem', { name: 'خدمت تازه' })).toBeVisible();
    await page.keyboard.press('Escape');
    await page
      .locator('#home-content')
      .evaluate((content) => (content.scrollTop = content.scrollHeight));
    await expect(page.locator('footer[aria-hidden]')).toHaveAttribute('aria-hidden', 'false');
  }
});
