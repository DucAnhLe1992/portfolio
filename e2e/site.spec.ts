import { expect, test, type Page } from '@playwright/test';

const routes = ['/', '/projects', '/projects/car-rental', '/projects/code-notebook', '/projects/ticket-booking', '/writing', '/about', '/privacy'];

async function jumpTo(page: Page, top: number) {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), top);
  return page.evaluate(() => window.scrollY);
}

test.describe('narrow viewport', () => {
  test.use({ viewport: { width: 320, height: 640 } });

  for (const route of routes) {
    test(`${route} fits 320px without horizontal overflow`, async ({ page }) => {
      await page.goto(route);
      await expect(page.locator('main h1')).toBeVisible();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  for (const path of ['/projects/car-rental', '/projects/car-rental/', '/about']) {
    test(`${path} serves its own prerendered HTML`, async ({ page }) => {
      await page.goto(path);
      const expected = path.includes('car-rental') ? 'Car Rental' : /./;
      await expect(page.locator('main h1')).toHaveText(expected);
      await expect(page.locator('#root')).toHaveAttribute('data-path', path.replace(/\/$/, ''));
    });
  }
});

for (const alias of ['/about.html', '/projects/car-rental.html', '/projects/car-rental/index.html']) {
  test(`${alias} keeps its content after hydration and shows the clean URL`, async ({ page }) => {
    await page.goto(alias);
    const clean = alias.replace(/\/index\.html$/, '').replace(/\.html$/, '');
    await expect(page).toHaveURL(new RegExp(`${clean.replace(/\//g, '\\/')}$`));
    await expect(page.locator('main h1')).not.toHaveText(/not found/i);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index, follow');
  });
}

test('client navigation updates metadata and moves focus to the heading', async ({ page }) => {
  await page.goto('/projects');
  await page.locator('main a[href="/projects/car-rental"]').first().click();
  await expect(page).toHaveURL(/\/projects\/car-rental$/);
  await expect(page).toHaveTitle(/Car Rental/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /Stripe/);
  await expect(page.locator('main h1')).toBeFocused();
});

test('back and forward restore scroll position, even right after scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('/projects/car-rental');
  const before = await jumpTo(page, 1500);
  expect(before).toBeGreaterThan(1000);

  // Navigate before the debounced history save can run.
  await page.evaluate(() => document.querySelector<HTMLAnchorElement>('header a[href="/projects"]')?.click());
  await expect(page).toHaveURL(/\/projects$/);
  const after = await jumpTo(page, 400);

  await page.goBack();
  await expect(page).toHaveURL(/\/projects\/car-rental$/);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(before);

  await page.goForward();
  await expect(page).toHaveURL(/\/projects$/);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(after);
});

test('table of contents links jump to their section', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('/projects/car-rental');
  await page.getByRole('navigation', { name: 'On this page' }).getByRole('link').last().click();
  await expect(page).toHaveURL(/#limitations$/);
  await expect(page.locator('#limitations')).toBeInViewport();
});

test('case study opens with a four-part outcome summary', async ({ page }) => {
  await page.goto('/projects/car-rental');
  const outcome = page.locator('#outcome');
  await expect(outcome).toBeVisible();
  await expect(outcome.locator('dt')).toHaveCount(4);
});

test('booking explainer tabs follow arrow, Home and End keys', async ({ page }) => {
  await page.goto('/projects/car-rental');
  const tabs = page.getByRole('tablist', { name: 'Scenarios' }).getByRole('tab');
  const count = await tabs.count();
  expect(count).toBeGreaterThan(1);

  await tabs.first().click();
  await page.keyboard.press('ArrowRight');
  await expect(tabs.nth(1)).toBeFocused();
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');

  await page.keyboard.press('End');
  await expect(tabs.nth(count - 1)).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('ArrowRight');
  await expect(tabs.first()).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('ArrowLeft');
  await expect(tabs.nth(count - 1)).toBeFocused();
  await page.keyboard.press('Home');
  await expect(tabs.first()).toBeFocused();
});

test('copy email button has a clear name and announces success', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/');
  const button = page.getByRole('button', { name: /^Copy email address / });
  await button.scrollIntoViewIfNeeded();
  await button.click();
  await expect(page.getByRole('status').filter({ hasText: 'Email copied to clipboard' })).toBeVisible();
});

test('unknown pages show the not-found page and are marked noindex', async ({ page }) => {
  await page.goto('/this-page-does-not-exist');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
});
