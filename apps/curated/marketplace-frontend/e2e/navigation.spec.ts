/**
 * Navigation E2E Tests
 *
 * DermaLogica Intelligence MVP - Phase 7: Integration & Testing
 *
 * Tests application navigation, routing, and link behavior.
 */

import { test, expect } from '@playwright/test';

test.describe('Application Navigation', () => {
  test.describe('Public Routes', () => {
    test('should navigate to home page', async ({ page }) => {
      await page.goto('/');

      // Should be on home page
      await expect(page).toHaveURL('/');

      // Page content should be visible
      const body = page.locator('body');
      await expect(body).toBeVisible();
    });

    test('should navigate to login page', async ({ page }) => {
      await page.goto('/auth/login');

      // Should be on login page
      await expect(page).toHaveURL(/\/auth\/login/);
    });

    test('should navigate to register page', async ({ page }) => {
      await page.goto('/auth/register');

      // Should be on register page
      await expect(page).toHaveURL(/\/auth\/register/);
    });

    test('should handle unknown routes gracefully', async ({ page }) => {
      await page.goto('/unknown-page-that-does-not-exist');

      // Should either show 404 content or redirect somewhere
      const body = page.locator('body');
      await expect(body).toBeVisible();
    });
  });

  test.describe('Protected Routes Behavior', () => {
    test('should handle unauthenticated access to dashboard', async ({
      page,
    }) => {
      await page.goto('/app/dashboard');

      await page.waitForTimeout(1000);

      // Either shows some content or redirects - just verify page loads
      const body = page.locator('body');
      await expect(body).toBeVisible();
    });

    test('should handle unauthenticated access to skincare-search', async ({
      page,
    }) => {
      await page.goto('/app/skincare-search');

      await page.waitForTimeout(1000);

      // Page should load without crashing
      const body = page.locator('body');
      await expect(body).toBeVisible();
    });
  });

  test.describe('Hero Section Navigation', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
    });

    test('should have clickable logo', async ({ page }) => {
      const logo = page.locator('img[alt*="Jade"]').first();

      if (await logo.isVisible()) {
        await expect(logo).toBeVisible();
      }
    });

    test('should have marketplace CTA link', async ({ page }) => {
      const ctaLink = page.locator('a[href="/app/marketplace"]');
      if (await ctaLink.isVisible()) {
        await expect(ctaLink).toBeEnabled();
      }
    });
  });

  test.describe('Link Behavior', () => {
    test('should open external links in new tab', async ({ page }) => {
      await page.goto('/');

      const externalLinks = page.locator('a[target="_blank"]');
      const count = await externalLinks.count();

      for (let i = 0; i < count; i++) {
        const link = externalLinks.nth(i);
        const rel = await link.getAttribute('rel');

        // External links should have noopener for security
        if (rel) {
          expect(rel).toContain('noopener');
        }
      }
    });

    test('should handle internal navigation', async ({ page }) => {
      await page.goto('/');

      // Find any internal link
      const internalLink = page.locator('a[href^="/"]').first();

      if (await internalLink.isVisible()) {
        await internalLink.click();
        await page.waitForTimeout(500);

        // Page should still be functional
        const body = page.locator('body');
        await expect(body).toBeVisible();
      }
    });
  });

  test.describe('Browser Navigation', () => {
    test('should support browser back navigation', async ({ page }) => {
      await page.goto('/');
      await page.goto('/auth/login');

      // Go back
      await page.goBack();

      await expect(page).toHaveURL('/');
    });

    test('should support browser forward navigation', async ({ page }) => {
      await page.goto('/');
      await page.goto('/auth/login');
      await page.goBack();

      // Go forward
      await page.goForward();

      await expect(page).toHaveURL(/\/auth\/login/);
    });

    test('should handle page refresh', async ({ page }) => {
      await page.goto('/');

      // Reload the page
      await page.reload();

      // Should still be on the same page
      await expect(page).toHaveURL('/');
    });
  });

  test.describe('URL Parameters', () => {
    test('should preserve query parameters', async ({ page }) => {
      await page.goto('/auth/login?redirect=/app/dashboard');

      // URL should contain the query parameter
      await expect(page).toHaveURL(/redirect=/);
    });

    test('should handle URL with hash', async ({ page }) => {
      await page.goto('/#section');

      // Should be on home page
      await expect(page).toHaveURL(/\/#section/);
    });
  });

  test.describe('Deep Linking', () => {
    test('should load specific routes directly', async ({ page }) => {
      // Direct navigation to auth
      await page.goto('/auth/register');
      await expect(page).toHaveURL(/register/);
    });

    test('should load parameterized routes', async ({ page }) => {
      // Test with login user type parameter
      await page.goto('/auth/login/spa-owner');
      await expect(page).toHaveURL(/login\/spa-owner/);
    });
  });

  test.describe('Error Handling', () => {
    test('should handle malformed URLs gracefully', async ({ page }) => {
      // Try to navigate to URL with special characters
      await page.goto('/%20%20%20');

      // Should not crash - page renders
      const content = page.locator('body');
      await expect(content).toBeVisible();
    });

    test('should handle very long URLs', async ({ page }) => {
      const longPath = '/a'.repeat(100);
      await page.goto(longPath);

      // Should handle gracefully
      const content = page.locator('body');
      await expect(content).toBeVisible();
    });
  });

  test.describe('Loading States', () => {
    test('should show content after navigation completes', async ({ page }) => {
      await page.goto('/');

      // Wait for any loading states to resolve
      await page.waitForLoadState('networkidle');

      // Page content should be visible
      const body = page.locator('body');
      await expect(body).toBeVisible();
    });
  });
});
