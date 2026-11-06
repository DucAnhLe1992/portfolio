import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test, type Page } from '@playwright/test';

function builtRoutes(dir = 'dist'): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return builtRoutes(full);
    if (entry.name !== 'index.html') return [];
    const match = readFileSync(full, 'utf8').match(/<div id="root" data-path="([^"]+)"/);
    return match ? [match[1]] : [];
  });
}

const routes = builtRoutes().sort();

function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  return errors;
}

async function settle(page: Page) {
  await expect(page.locator('html')).toHaveAttribute('data-hydrated', 'true');
  await page.evaluate(() => document.fonts.ready);
}

async function jumpTo(page: Page, top: number) {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), top);
  return page.evaluate(() => window.scrollY);
}

test('every prerendered page is covered', () => {
  expect(routes).toEqual(
    expect.arrayContaining([
      '/',
      '/projects',
      '/projects/car-rental',
      '/projects/code-notebook',
      '/projects/friendster',
      '/projects/ticket-booking',
      '/writing',
      '/writing/checkout-redirect-is-not-confirmation',
      '/writing/preventing-overlapping-reservations',
      '/about',
      '/privacy',
    ]),
  );
});

test.describe('narrow viewport', () => {
  test.use({ viewport: { width: 320, height: 640 } });

  for (const route of routes) {
    test(`${route} fits 320px without horizontal overflow`, async ({ page }) => {
      const errors = collectErrors(page);
      await page.goto(route);
      await settle(page);
      await expect(page.locator('main h1')).toBeVisible();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(0);
      expect(errors).toEqual([]);
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
    const errors = collectErrors(page);
    await page.goto(alias);
    await settle(page);
    const clean = alias.replace(/\/index\.html$/, '').replace(/\.html$/, '');
    await expect(page).toHaveURL(new RegExp(clean.replace(/\//g, '\\/') + '$'));
    await expect(page.locator('main h1')).toHaveText(alias.includes('car-rental') ? 'Car Rental' : /^I am /);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index, follow');
    expect(errors).toEqual([]);
  });
}

test('client navigation updates metadata and moves focus to the heading', async ({ page }) => {
  await page.goto('/projects');
  await settle(page);
  await page.locator('main a[href="/projects/car-rental"]').first().click();
  await expect(page).toHaveURL(/\/projects\/car-rental$/);
  await expect(page).toHaveTitle(/Car Rental/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /Stripe/);
  await expect(page.locator('main h1')).toBeFocused();
});

test('back and forward restore scroll position, even right after scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('/projects/car-rental');
  await settle(page);
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
  await settle(page);
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
  await settle(page);
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
  await settle(page);
  const button = page.getByRole('button', { name: /^Copy email address / });
  await button.scrollIntoViewIfNeeded();
  await button.click();
  await expect(page.getByRole('status').filter({ hasText: 'Email copied to clipboard' })).toBeVisible();
});

test('unknown pages show the not-found page and are marked noindex', async ({ page }) => {
  await page.goto('/this-page-does-not-exist');
  await settle(page);
  await expect(page.locator('main h1')).toHaveText('This page does not exist.');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
});

test('card titles sit one level below their section heading', async ({ page }) => {
  const cases = [
    { path: '/', link: 'a[href^="/projects/"]', level: 'h3' },
    { path: '/', link: 'a[href^="/writing/"]', level: 'h3' },
    { path: '/projects', link: 'a[href^="/projects/"]', level: 'h2' },
    { path: '/writing', link: 'a[href^="/writing/"]', level: 'h2' },
  ];
  for (const { path, link, level } of cases) {
    await page.goto(path);
    await settle(page);
    const other = level === 'h2' ? 'h3' : 'h2';
    expect(await page.locator(`main ${level} > ${link}`).count(), `${path} ${link} in ${level}`).toBeGreaterThan(0);
    await expect(page.locator(`main ${other} > ${link}`)).toHaveCount(0);

    const levels = await page.locator('main :is(h1, h2, h3, h4, h5, h6)').evaluateAll((els) => els.map((el) => Number(el.tagName[1])));
    expect(levels[0], `${path} starts with h1`).toBe(1);
    levels.forEach((n, i) => {
      if (i > 0) expect(n, `${path} heading ${i} skips a level`).toBeLessThanOrEqual(levels[i - 1] + 1);
    });
  }
});

test('project screenshots load at their declared size', async ({ page }) => {
  for (const route of routes.filter((r) => r.startsWith('/projects/'))) {
    await page.goto(route);
    const images = page.locator('#screens img');
    for (let i = 0; i < (await images.count()); i++) {
      const img = images.nth(i);
      await img.scrollIntoViewIfNeeded();
      await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
      const size = await img.evaluate((el: HTMLImageElement) => ({
        natural: [el.naturalWidth, el.naturalHeight],
        declared: [Number(el.getAttribute('width')), Number(el.getAttribute('height'))],
      }));
      expect(size.natural, `${route} image ${i}`).toEqual(size.declared);
    }
  }
});
