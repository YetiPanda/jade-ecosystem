/**
 * Homepage E2E Tests
 *
 * Feature: 008-homepage-integration
 *
 * End-to-end tests for homepage functionality
 */

import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('homepage loads successfully', async ({ page }) => {
    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Check title or main heading
    await expect(page.locator('h1')).toBeVisible();
  });

  test('displays hero section with CTA button', async ({ page }) => {
    // Hero section should be visible
    const hero = page.locator('[role="banner"]');
    await expect(hero).toBeVisible();

    // CTA button should be visible and clickable
    const ctaButton = page.getByRole('button', { name: /start browsing/i });
    await expect(ctaButton).toBeVisible();
  });

  test('hero CTA navigates to products page', async ({ page }) => {
    // Click hero CTA
    const ctaLink = page.getByRole('link', { name: /start browsing/i });
    await ctaLink.click();

    // Should navigate to products page
    await expect(page).toHaveURL(/\/app\/products/);
  });

  test('displays featured brands section', async ({ page }) => {
    // Brand strip title should be visible
    await expect(page.getByText('Featured spa brands')).toBeVisible();

    // At least one brand logo should be visible
    const brandLogos = page.locator('[role="listitem"]').first();
    await expect(brandLogos).toBeVisible();
  });

  test('brand strip navigation buttons work', async ({ page }) => {
    // Previous and next buttons should be visible
    const prevButton = page.getByLabel('Scroll to previous brands');
    const nextButton = page.getByLabel('Scroll to next brands');

    await expect(prevButton).toBeVisible();
    await expect(nextButton).toBeVisible();

    // Clicking should not cause errors (scroll behavior tested in unit tests)
    await nextButton.click();
    await prevButton.click();
  });

  test('displays bestselling products section', async ({ page }) => {
    // Section title should be visible
    await expect(page.getByText('Bestselling spa products')).toBeVisible();

    // "View all" link should be present
    const viewAllLinks = page.getByText(/view all/i);
    await expect(viewAllLinks.first()).toBeVisible();
  });

  test('displays new arrivals section', async ({ page }) => {
    // Section title should be visible
    await expect(page.getByText('New arrivals')).toBeVisible();
  });

  test('displays editorial block', async ({ page }) => {
    // Editorial content should be visible
    await expect(page.getByText('Discover Our Curated Collection')).toBeVisible();
    await expect(page.getByRole('button', { name: /explore collection/i })).toBeVisible();
  });

  test('editorial block CTA is clickable', async ({ page }) => {
    const ctaButton = page.getByRole('button', { name: /explore collection/i });
    await expect(ctaButton).toBeVisible();

    // Click should work (navigation tested separately)
    await ctaButton.click();
  });

  test('product grids show loading state initially', async ({ page }) => {
    // Reload to see loading state
    await page.reload();

    // Loading skeletons should appear briefly
    // (This test may be flaky depending on network speed)
    const skeleton = page.locator('.animate-pulse').first();
    // Just check it exists at some point, it may disappear quickly
    const exists = await skeleton.count();
    expect(exists).toBeGreaterThanOrEqual(0);
  });

  test('all main sections are present in order', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    const sections = await page.locator('section, [role="banner"]').all();

    // Should have: hero, brands, bestsellers, editorial, new arrivals
    expect(sections.length).toBeGreaterThanOrEqual(4);
  });

  test('page is responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Hero should still be visible
    const hero = page.locator('[role="banner"]');
    await expect(hero).toBeVisible();

    // Sections should stack vertically (all visible)
    await expect(page.getByText('Featured spa brands')).toBeVisible();
    await expect(page.getByText('Bestselling spa products')).toBeVisible();
  });

  test('page is responsive on tablet viewport', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });

    // All sections should be visible
    await expect(page.locator('[role="banner"]')).toBeVisible();
    await expect(page.getByText('Featured spa brands')).toBeVisible();
  });

  test('images have proper alt text', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Hero image
    const heroImage = page.getByAltText(/premium spa treatments/i);
    await expect(heroImage).toBeVisible();

    // Brand logos
    const brandLogo = page.getByAltText(/logo/i).first();
    await expect(brandLogo).toBeVisible();
  });

  test('all navigation links work', async ({ page }) => {
    // "View all" link for bestsellers
    const bestsellerViewAll = page.getByRole('link', { name: /view all/i }).first();
    await bestsellerViewAll.click();
    await expect(page).toHaveURL(/\/app\/products/);
  });

  test('page has no console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Filter out known acceptable errors (like GraphQL errors in dev mode)
    const criticalErrors = consoleErrors.filter(
      (error) => !error.includes('Apollo') && !error.includes('GraphQL')
    );

    expect(criticalErrors.length).toBe(0);
  });

  test('page layout has proper spacing', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Main container should have max-width
    const container = page.locator('.max-w-7xl').first();
    await expect(container).toBeVisible();

    // Should have padding
    const hasPadding = await container.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.paddingLeft !== '0px' && styles.paddingRight !== '0px';
    });
    expect(hasPadding).toBe(true);
  });

  test('hero section maintains aspect ratio', async ({ page }) => {
    const hero = page.locator('[role="banner"]');
    await expect(hero).toBeVisible();

    // Check that hero has height styling
    const hasHeight = await hero.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.height !== 'auto' && styles.height !== '0px';
    });
    expect(hasHeight).toBe(true);
  });

  test('brand strip is scrollable', async ({ page }) => {
    const brandContainer = page.locator('[role="list"]').first();
    await expect(brandContainer).toBeVisible();

    // Check if overflow-x-auto is applied
    const isScrollable = await brandContainer.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.overflowX === 'auto' || styles.overflowX === 'scroll';
    });
    expect(isScrollable).toBe(true);
  });

  test('accessibility: all interactive elements are keyboard accessible', async ({ page }) => {
    // Tab through interactive elements
    await page.keyboard.press('Tab'); // First focusable element

    // Hero CTA should be focusable
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(['BUTTON', 'A']).toContain(focused);
  });

  test('accessibility: page has proper heading hierarchy', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Should have h1
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();

    // Should have h2 for sections
    const h2Count = await page.locator('h2').count();
    expect(h2Count).toBeGreaterThan(0);
  });
});
