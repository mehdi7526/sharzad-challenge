import { expect, test } from '@playwright/test';
import { browserApiUrl } from './browser-api';

test('page loads without browser errors and renders the service links', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/home');
  await expect(page.getByRole('heading', { name: 'خدمات شهرزاد' })).toBeVisible();
  await expect(page.locator('#services-grid').locator('a, button')).toHaveCount(22);
  await expect(page.locator('#home-content')).toHaveCount(1);
  await expect(page.locator('a[aria-label="اسکن"]')).toHaveAttribute(
    'href',
    'https://web.shahrzadcity.ir/qr-payment',
  );
  await expect(
    page.locator('#services-grid').getByRole('link', { name: 'میوه و تره‌بار' }),
  ).toHaveAttribute('href', 'https://web.shahrzadcity.ir/marketplace/2/grocery');
  expect(errors).toEqual([]);
});

test('static services navigate in the same tab', async ({ page }) => {
  await page.route('https://web.shahrzadcity.ir/marketplace/2/grocery', (route) =>
    route.fulfill({ status: 200, contentType: 'text/html', body: '<h1>destination</h1>' }),
  );
  await page.goto('/home');
  await page.locator('#services-grid').getByRole('link', { name: 'میوه و تره‌بار' }).click();
  await expect(page).toHaveURL('https://web.shahrzadcity.ir/marketplace/2/grocery');
});

test('scroll updates the mobile header and desktop footer', async ({ page, isMobile }) => {
  await page.goto('/home');
  await expect(page.locator('#services-grid').locator('a, button')).toHaveCount(22);
  await expect(page.locator('#home-content')).toHaveCount(1);
  const content = page.locator('#home-content');
  if (isMobile) {
    const logo = page.getByRole('button', { name: 'صفحه اصلی', includeHidden: true });
    const scan = page.getByRole('link', { name: 'اسکن کد', includeHidden: true });
    await content.evaluate((element) => (element.scrollTop = 120));
    await expect(logo).toHaveAttribute('aria-hidden', 'true');
    await expect(logo).toHaveCSS('opacity', '0');
    await expect(content).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, -74)');
    await expect(scan).toHaveAttribute('tabindex', '-1');
    await content.evaluate((element) => (element.scrollTop = 0));
    await expect(logo).toHaveAttribute('aria-hidden', 'false');
    await expect(logo).toHaveCSS('opacity', '1');
    await expect(content).toHaveCSS('transform', 'none');
    await expect(scan).toHaveAttribute('tabindex', '0');
  } else {
    const footer = page.locator('footer[aria-hidden]');
    await expect(footer).toHaveAttribute('aria-hidden', 'true');
    await content.evaluate((element) => (element.scrollTop = element.scrollHeight));
    await expect(footer).toHaveAttribute('aria-hidden', 'false');
    await expect(footer).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
    await content.evaluate((element) => (element.scrollTop = 0));
    await expect(footer).toHaveAttribute('aria-hidden', 'true');
  }
});

test('desktop services menu shares the grid destination', async ({ page, isMobile }) => {
  test.skip(isMobile);
  await page.route('https://web.shahrzadcity.ir/marketplace/2/grocery', (route) =>
    route.fulfill({ status: 200, contentType: 'text/html', body: '<h1>destination</h1>' }),
  );
  await page.goto('/home');
  await page.getByRole('button', { name: /خدمات شهرزاد/ }).click();
  await page.getByRole('menuitem', { name: /میوه و تره‌بار/ }).click();
  await expect(page).toHaveURL('https://web.shahrzadcity.ir/marketplace/2/grocery');
});

test('compact header styles respect resizing and reduced motion', async ({ page, isMobile }) => {
  test.skip(isMobile);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/home');
  await expect(page.locator('#services-grid').locator('a, button')).toHaveCount(22);
  const content = page.locator('#home-content');
  const logo = page.getByRole('button', { name: 'صفحه اصلی', includeHidden: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await content.evaluate((element) => (element.scrollTop = 120));
  await expect(logo).toHaveCSS('opacity', '0');
  await expect(logo).toHaveAttribute('tabindex', '-1');
  await expect(content).toHaveCSS('transition-duration', '1e-05s');
  await page.setViewportSize({ width: 1280, height: 720 });
  await expect(logo).toHaveCSS('opacity', '1');
  await expect(logo).toHaveAttribute('tabindex', '0');
  await expect(content).toHaveCSS('transform', 'none');
});

test('slow banner image keeps its skeleton and reserves the final layout', async ({ page }) => {
  let releaseImage!: () => void;
  const imageGate = new Promise<void>((resolve) => {
    releaseImage = resolve;
  });
  await page.route('**/_next/image?**', async (route) => {
    if (new URL(route.request().url()).searchParams.get('url') !== '/assets/traffic-banner.jpg') {
      await route.continue();
      return;
    }
    await imageGate;
    await route.continue();
  });
  await page.goto('/home', { waitUntil: 'domcontentloaded' });
  const banner = page.getByRole('region', { name: 'پیشنهادهای ویژه', exact: true });
  const image = banner.locator('img');
  const skeleton = banner.locator('.ant-skeleton-input');
  await expect(skeleton).toBeVisible();
  await expect(image).toHaveCSS('opacity', '0');
  const frameBefore = await banner.locator('a').boundingBox();
  const skeletonBounds = await skeleton.boundingBox();
  const servicesBefore = await page.locator('#services').boundingBox();
  expect(frameBefore).not.toBeNull();
  expect(skeletonBounds?.height).toBeCloseTo(frameBefore!.height, 0);
  expect(skeletonBounds?.width).toBeCloseTo(frameBefore!.width, 0);
  releaseImage();
  await expect(image).toHaveCSS('opacity', '1');
  await expect(skeleton).toHaveCount(0);
  expect(await banner.locator('a').boundingBox()).toEqual(frameBefore);
  expect(await page.locator('#services').boundingBox()).toEqual(servicesBefore);
});

test('failed banner image shows a fallback in the reserved frame', async ({ page }) => {
  await page.route('**/_next/image?**', async (route) => {
    if (new URL(route.request().url()).searchParams.get('url') === '/assets/traffic-banner.jpg') {
      await route.abort();
      return;
    }
    await route.continue();
  });
  await page.goto('/home');
  const banner = page.getByRole('region', { name: 'پیشنهادهای ویژه', exact: true });
  await expect(banner.getByText('تصویر پیشنهاد بارگذاری نشد')).toBeVisible();
  await expect(banner.locator('.ant-skeleton-input')).toHaveCount(0);
  await expect(banner.locator('a')).toHaveCSS('aspect-ratio', '2.48 / 1');
});

test('account panels share one dialog and return focus when closed', async ({ page }) => {
  const viewerResponse = page.waitForResponse(browserApiUrl('/viewer'));
  await page.goto('/home');
  await viewerResponse;
  const account = page.getByRole('button', { name: 'حساب کاربری', exact: true });
  await account.click();
  await expect(page.getByRole('dialog', { name: 'حساب کاربری' })).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveCount(1);
  await expect
    .poll(() =>
      page.getByRole('dialog').evaluate((dialog) => dialog.contains(document.activeElement)),
    )
    .toBe(true);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(account).toBeFocused();
  await page
    .getByRole('button', { name: /مشاهده/ })
    .first()
    .click();
  await expect(page.getByRole('dialog', { name: 'کیف پول شهرزاد' })).toBeVisible();
  await page.getByRole('button', { name: 'ورود به حساب', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'حساب کاربری' })).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveCount(1);
  await expect
    .poll(() =>
      page.getByRole('dialog').evaluate((dialog) => dialog.contains(document.activeElement)),
    )
    .toBe(true);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('button', { name: /مشاهده/ }).first()).toBeFocused();
  await account.click();
  await page.getByRole('button', { name: 'ادامه', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
});
