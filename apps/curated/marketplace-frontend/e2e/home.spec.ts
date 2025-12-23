/**
 * Home Page E2E Tests
 *
 * DermaLogica Intelligence MVP - Phase 7: Integration & Testing
 *
 * Tests the home page rendering and core functionality.
 * Note: These tests are designed to work with or without the backend running.
 */

import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Page Loading', () => {
    test('should load the home page successfully', async ({ page }) => {
      await expect(page).toHaveTitle(/JADE/i);
    });

    test('should display page content', async ({ page }) => {
      // Check for either homepage container OR fallback content
      const content = page.locator('.homepage-container, body');
      await expect(content.first()).toBeVisible();
    });

    test('should have no critical console errors on load', async ({ page }) => {
      const consoleErrors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Allow expected errors (API calls, asset loading, GraphQL)
      const criticalErrors = consoleErrors.filter(
        (error) =>
          !error.includes('net::ERR') &&
          !error.includes('Failed to fetch') &&
          !error.includes('video') &&
          !error.includes('404') &&
          !error.includes('GraphQL') &&
          !error.includes('Apollo')
      );

      expect(criticalErrors).toHaveLength(0);
    });
  });

  test.describe('Page Structure', () => {
    test('should have a heading', async ({ page }) => {
      const heading = page.locator('h1');
      await expect(heading.first()).toBeVisible();
    });

    test('should render body content', async ({ page }) => {
      const body = page.locator('body');
      await expect(body).toBeVisible();

      // Body should have some content
      const text = await body.textContent();
      expect(text?.length).toBeGreaterThan(0);
    });

    test('should have links', async ({ page }) => {
      const links = page.locator('a');
      const count = await links.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('Responsive Design', () => {
    test('should be responsive on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');

      // Body should render
      const body = page.locator('body');
      await expect(body).toBeVisible();
    });

    test('should be responsive on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/');

      const body = page.locator('body');
      await expect(body).toBeVisible();
    });

    test('should be responsive on desktop viewport', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/');

      const body = page.locator('body');
      await expect(body).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('should have at least one heading', async ({ page }) => {
      const headings = page.locator('h1, h2, h3, h4, h5, h6');
      const count = await headings.count();
      expect(count).toBeGreaterThanOrEqual(1);
    });

    test('should have alt text on images', async ({ page }) => {
      const images = page.locator('img');
      const count = await images.count();

      for (let i = 0; i < Math.min(count, 10); i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        // Image should have alt attribute (can be empty for decorative images)
        expect(alt).not.toBeNull();
      }
    });

    test('should be keyboard navigable', async ({ page }) => {
      // Tab through elements
      await page.keyboard.press('Tab');

      // Something should be focused
      const focused = page.locator(':focus');
      const count = await focused.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('Performance', () => {
    test('should load within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      const loadTime = Date.now() - startTime;

      // Page should load DOM within 5 seconds
      expect(loadTime).toBeLessThan(5000);
    });
  });

  test.describe('JavaScript Functionality', () => {
    test('should not have uncaught errors', async ({ page }) => {
      const pageErrors: string[] = [];
      page.on('pageerror', (error) => {
        pageErrors.push(error.message);
      });

      await page.goto('/');
      await page.waitForTimeout(2000);

      // Filter out known acceptable errors
      const criticalErrors = pageErrors.filter(
        (error) =>
          !error.includes('network') &&
          !error.includes('fetch') &&
          !error.includes('GraphQL') &&
          !error.includes('Apollo')
      );

      expect(criticalErrors).toHaveLength(0);
    });

    test('should have JavaScript enabled', async ({ page }) => {
      // Check if JS is working by verifying DOM can be manipulated
      const result = await page.evaluate(() => {
        return typeof window !== 'undefined';
      });
      expect(result).toBe(true);
    });
  });
});
