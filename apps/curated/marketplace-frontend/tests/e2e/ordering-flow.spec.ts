/**
 * E2E Test: Complete Ordering Journey (T058)
 *
 * Tests the end-to-end user flow for spa owner product ordering:
 * 1. Browse product catalog
 * 2. Filter products by criteria
 * 3. View product details with progressive disclosure
 * 4. Add products to cart
 * 5. Update cart quantities
 * 6. Proceed to checkout
 * 7. Complete order
 * 8. Receive order confirmation
 * 9. View order in history
 *
 * Following TDD: This test will FAIL until all UI components and backend
 * integration are complete
 */

import { test, expect, Page } from '@playwright/test';

// Test configuration
const BASE_URL = process.env.VITE_APP_URL || 'http://localhost:5173';
const API_URL = process.env.VITE_GRAPHQL_ENDPOINT || 'http://localhost:3001/graphql';

// Test data
const TEST_USER = {
  email: 'spa-owner@example.com',
  password: 'TestPassword123!',
  firstName: 'Jane',
  lastName: 'Owner',
  spaName: 'Luxury Day Spa'
};

const TEST_SHIPPING_ADDRESS = {
  street: '123 Spa Boulevard',
  city: 'Beverly Hills',
  state: 'CA',
  zipCode: '90210',
  country: 'United States'
};

const TEST_PAYMENT = {
  cardNumber: '4242424242424242',
  expiry: '12/25',
  cvc: '123',
  name: 'Jane Owner'
};

test.describe('Complete Ordering Journey E2E', () => {
  test.beforeEach(async ({ page }) => {
    // TODO: Set up test data (seed products, create test user)
    // TODO: Clear any existing cart
    await page.goto(BASE_URL);
  });

  test('should complete full ordering journey from browsing to confirmation', async ({ page }) => {
    // This is the main happy path test that covers the entire journey

    // Step 1: Login as spa owner
    await loginAsSpaOwner(page);

    // Step 2: Navigate to product catalog
    await page.click('[data-testid="products-link"]');
    await expect(page).toHaveURL(/\/app\/products/);
    await expect(page.getByRole('heading', { name: /product catalog/i })).toBeVisible();

    // Step 3: Verify products are displayed
    const productCards = page.locator('[data-testid="product-card"]');
    await expect(productCards).toHaveCount(await productCards.count());
    expect(await productCards.count()).toBeGreaterThan(0);

    // Step 4: Apply filters to narrow down products
    await page.click('[data-testid="filter-toggle"]');

    // Filter by skin type
    await page.check('[data-testid="filter-skin-type-oily"]');

    // Filter by price range
    await page.fill('[data-testid="filter-price-min"]', '20');
    await page.fill('[data-testid="filter-price-max"]', '100');

    // Apply filters
    await page.click('[data-testid="apply-filters"]');

    // Wait for filtered results
    await page.waitForSelector('[data-testid="product-card"]');

    // Verify glance-level data is visible on product cards
    const firstProduct = productCards.first();
    await expect(firstProduct.locator('[data-testid="product-name"]')).toBeVisible();
    await expect(firstProduct.locator('[data-testid="product-price"]')).toBeVisible();
    await expect(firstProduct.locator('[data-testid="product-hero-benefit"]')).toBeVisible();
    await expect(firstProduct.locator('[data-testid="product-rating"]')).toBeVisible();

    // Step 5: View product details (progressive disclosure)
    const firstProductName = await firstProduct.locator('[data-testid="product-name"]').textContent();
    await firstProduct.click();

    // Should navigate to product detail page
    await expect(page).toHaveURL(/\/app\/products\/.+/);
    await expect(page.getByRole('heading', { name: firstProductName || '' })).toBeVisible();

    // Verify glance-level data
    await expect(page.locator('[data-testid="glance-hero-benefit"]')).toBeVisible();
    await expect(page.locator('[data-testid="glance-rating"]')).toBeVisible();
    await expect(page.locator('[data-testid="glance-skin-types"]')).toBeVisible();

    // Expand to scan-level data
    await page.click('[data-testid="show-scan-data"]');
    await expect(page.locator('[data-testid="scan-ingredients"]')).toBeVisible();
    await expect(page.locator('[data-testid="scan-usage-instructions"]')).toBeVisible();
    await expect(page.locator('[data-testid="scan-key-actives"]')).toBeVisible();

    // Expand to study-level data
    await page.click('[data-testid="show-study-data"]');
    await expect(page.locator('[data-testid="study-clinical-data"]')).toBeVisible();
    await expect(page.locator('[data-testid="study-formulation-science"]')).toBeVisible();

    // Step 6: Add product to cart with quantity
    await page.fill('[data-testid="quantity-input"]', '12'); // Trigger tier 3 pricing

    // Verify pricing tier is shown
    await expect(page.locator('[data-testid="applied-tier"]')).toContainText('20% off');
    await expect(page.locator('[data-testid="unit-price"]')).toBeVisible();
    await expect(page.locator('[data-testid="line-total"]')).toBeVisible();

    await page.click('[data-testid="add-to-cart"]');

    // Verify cart badge updates
    await expect(page.locator('[data-testid="cart-badge"]')).toContainText('12');

    // Verify success notification
    await expect(page.locator('[data-testid="toast-notification"]')).toContainText('Added to cart');

    // Step 7: Go back to catalog and add another product
    await page.click('[data-testid="back-to-products"]');
    await expect(page).toHaveURL(/\/app\/products/);

    // Add second product (from different vendor for multi-vendor testing)
    const secondProduct = productCards.nth(1);
    await secondProduct.click();

    await page.fill('[data-testid="quantity-input"]', '6'); // Trigger tier 2 pricing
    await expect(page.locator('[data-testid="applied-tier"]')).toContainText('10% off');

    await page.click('[data-testid="add-to-cart"]');
    await expect(page.locator('[data-testid="cart-badge"]')).toContainText('18'); // 12 + 6

    // Step 8: View cart
    await page.click('[data-testid="cart-icon"]');

    // Verify cart page or drawer opens
    await expect(page.locator('[data-testid="cart-items"]')).toBeVisible();

    // Verify both products in cart
    const cartItems = page.locator('[data-testid="cart-item"]');
    await expect(cartItems).toHaveCount(2);

    // Verify cart calculations
    await expect(page.locator('[data-testid="cart-subtotal"]')).toBeVisible();
    await expect(page.locator('[data-testid="cart-tax"]')).toBeVisible();
    await expect(page.locator('[data-testid="cart-shipping"]')).toBeVisible();
    await expect(page.locator('[data-testid="cart-total"]')).toBeVisible();

    // Step 9: Update quantity in cart
    const firstCartItem = cartItems.first();
    await firstCartItem.locator('[data-testid="quantity-input"]').fill('15');

    // Verify totals recalculate
    await page.waitForTimeout(500); // Wait for debounce and recalculation

    // Step 10: Proceed to checkout
    await page.click('[data-testid="checkout-button"]');
    await expect(page).toHaveURL(/\/app\/checkout/);

    // Step 11: Fill shipping address
    await page.fill('[data-testid="shipping-street"]', TEST_SHIPPING_ADDRESS.street);
    await page.fill('[data-testid="shipping-city"]', TEST_SHIPPING_ADDRESS.city);
    await page.fill('[data-testid="shipping-state"]', TEST_SHIPPING_ADDRESS.state);
    await page.fill('[data-testid="shipping-zipcode"]', TEST_SHIPPING_ADDRESS.zipCode);

    // Step 12: Copy shipping to billing
    await page.check('[data-testid="same-as-shipping"]');

    // Step 13: Select payment method
    await page.click('[data-testid="payment-method-credit-card"]');

    // Fill payment details (using test Stripe token in dev)
    await page.fill('[data-testid="card-number"]', TEST_PAYMENT.cardNumber);
    await page.fill('[data-testid="card-expiry"]', TEST_PAYMENT.expiry);
    await page.fill('[data-testid="card-cvc"]', TEST_PAYMENT.cvc);
    await page.fill('[data-testid="card-name"]', TEST_PAYMENT.name);

    // Step 14: Review order summary
    await expect(page.locator('[data-testid="order-summary"]')).toBeVisible();

    // Verify multi-vendor split is shown
    const vendorSections = page.locator('[data-testid="vendor-section"]');
    expect(await vendorSections.count()).toBeGreaterThan(0);

    // Verify each vendor shows their products and shipping
    for (let i = 0; i < await vendorSections.count(); i++) {
      const vendorSection = vendorSections.nth(i);
      await expect(vendorSection.locator('[data-testid="vendor-name"]')).toBeVisible();
      await expect(vendorSection.locator('[data-testid="vendor-subtotal"]')).toBeVisible();
      await expect(vendorSection.locator('[data-testid="vendor-shipping"]')).toBeVisible();
    }

    // Add order notes
    await page.fill('[data-testid="order-notes"]', 'Please call before delivery');

    // Step 15: Place order
    await page.click('[data-testid="place-order-button"]');

    // Verify loading state
    await expect(page.locator('[data-testid="place-order-button"]')).toBeDisabled();
    await expect(page.locator('[data-testid="order-processing"]')).toBeVisible();

    // Wait for order confirmation
    await page.waitForURL(/\/app\/orders\/.+/, { timeout: 10000 });

    // Step 16: Verify order confirmation page
    await expect(page.getByRole('heading', { name: /order confirmed/i })).toBeVisible();

    const orderNumber = await page.locator('[data-testid="order-number"]').textContent();
    expect(orderNumber).toBeTruthy();
    expect(orderNumber).toMatch(/^ORD-\d+$/); // Format: ORD-12345

    // Verify order details
    await expect(page.locator('[data-testid="order-status"]')).toContainText('Pending');
    await expect(page.locator('[data-testid="order-total"]')).toBeVisible();
    await expect(page.locator('[data-testid="shipping-address"]')).toContainText(TEST_SHIPPING_ADDRESS.street);

    // Verify vendor splits shown
    await expect(page.locator('[data-testid="vendor-orders"]')).toBeVisible();

    // Step 17: Verify cart is empty
    await page.click('[data-testid="cart-icon"]');
    await expect(page.locator('[data-testid="empty-cart-message"]')).toBeVisible();

    // Step 18: Navigate to order history
    await page.click('[data-testid="orders-link"]');
    await expect(page).toHaveURL(/\/app\/orders/);

    // Verify new order appears in history
    const orderRows = page.locator('[data-testid="order-row"]');
    const firstOrder = orderRows.first();

    await expect(firstOrder.locator('[data-testid="order-number"]')).toContainText(orderNumber || '');
    await expect(firstOrder.locator('[data-testid="order-date"]')).toBeVisible();
    await expect(firstOrder.locator('[data-testid="order-total"]')).toBeVisible();
    await expect(firstOrder.locator('[data-testid="order-status"]')).toBeVisible();

    // Step 19: Click to view order details again
    await firstOrder.click();
    await expect(page).toHaveURL(new RegExp(`/app/orders/${orderNumber}`));
    await expect(page.locator('[data-testid="order-number"]')).toContainText(orderNumber || '');
  });

  test('should show validation errors for incomplete checkout', async ({ page }) => {
    // Login and add product to cart
    await loginAsSpaOwner(page);
    await addProductToCart(page, 1, 5);

    // Go to checkout
    await page.click('[data-testid="checkout-button"]');

    // Try to place order without filling required fields
    await page.click('[data-testid="place-order-button"]');

    // Verify validation errors
    await expect(page.locator('[data-testid="error-shipping-street"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-shipping-city"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-payment-method"]')).toBeVisible();

    // Order should not be placed
    await expect(page).toHaveURL(/\/app\/checkout/);
  });

  test('should handle out-of-stock items in cart', async ({ page }) => {
    // TODO: Set product inventory to low level

    await loginAsSpaOwner(page);

    // Try to add quantity exceeding stock
    await page.goto(`${BASE_URL}/app/products/low-stock-product`);
    await page.fill('[data-testid="quantity-input"]', '100');
    await page.click('[data-testid="add-to-cart"]');

    // Should show error
    await expect(page.locator('[data-testid="error-insufficient-stock"]')).toBeVisible();

    // Cart badge should not update
    await expect(page.locator('[data-testid="cart-badge"]')).not.toContainText('100');
  });

  test('should update pricing tier when quantity changes', async ({ page }) => {
    await loginAsSpaOwner(page);
    await page.goto(`${BASE_URL}/app/products/tiered-pricing-product`);

    // Start with quantity 5 (base tier)
    await page.fill('[data-testid="quantity-input"]', '5');
    const basePriceText = await page.locator('[data-testid="unit-price"]').textContent();

    // Increase to 12 (tier 3 - 20% off)
    await page.fill('[data-testid="quantity-input"]', '12');
    await page.waitForTimeout(300); // Wait for tier recalculation

    const tier3PriceText = await page.locator('[data-testid="unit-price"]').textContent();
    await expect(page.locator('[data-testid="applied-tier"]')).toContainText('20% off');

    // Verify price decreased
    expect(tier3PriceText).not.toBe(basePriceText);
  });

  test('should handle payment failure gracefully', async ({ page }) => {
    await loginAsSpaOwner(page);
    await addProductToCart(page, 1, 5);

    // Go to checkout
    await page.click('[data-testid="checkout-button"]');

    // Fill shipping address
    await fillShippingAddress(page, TEST_SHIPPING_ADDRESS);

    // Use test card that will decline
    await page.click('[data-testid="payment-method-credit-card"]');
    await page.fill('[data-testid="card-number"]', '4000000000000002'); // Test decline card
    await page.fill('[data-testid="card-expiry"]', '12/25');
    await page.fill('[data-testid="card-cvc"]', '123');

    // Attempt to place order
    await page.click('[data-testid="place-order-button"]');

    // Should show payment error
    await expect(page.locator('[data-testid="payment-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="payment-error"]')).toContainText(/declined|failed/i);

    // Should stay on checkout page
    await expect(page).toHaveURL(/\/app\/checkout/);

    // Cart should still have items
    await page.click('[data-testid="cart-icon"]');
    await expect(page.locator('[data-testid="cart-item"]')).toHaveCount(1);
  });

  test('should persist cart across page refreshes', async ({ page }) => {
    await loginAsSpaOwner(page);
    await addProductToCart(page, 1, 5);

    // Verify cart badge shows 5
    await expect(page.locator('[data-testid="cart-badge"]')).toContainText('5');

    // Refresh page
    await page.reload();

    // Cart should still have items
    await expect(page.locator('[data-testid="cart-badge"]')).toContainText('5');

    // Open cart and verify
    await page.click('[data-testid="cart-icon"]');
    await expect(page.locator('[data-testid="cart-item"]')).toHaveCount(1);
  });

  test('should show similar products on product detail page', async ({ page }) => {
    await loginAsSpaOwner(page);
    await page.goto(`${BASE_URL}/app/products/test-product-1`);

    // Scroll to similar products section
    await page.locator('[data-testid="similar-products"]').scrollIntoViewIfNeeded();

    // Verify similar products are shown
    const similarProducts = page.locator('[data-testid="similar-product-card"]');
    await expect(similarProducts).toHaveCount(6); // Exactly 6 per FR-050

    // Click on similar product
    const firstSimilar = similarProducts.first();
    await firstSimilar.click();

    // Should navigate to that product's detail page
    await expect(page).toHaveURL(/\/app\/products\/.+/);
  });

  test('should allow removing items from cart', async ({ page }) => {
    await loginAsSpaOwner(page);
    await addProductToCart(page, 1, 5);
    await addProductToCart(page, 2, 3);

    // Open cart
    await page.click('[data-testid="cart-icon"]');
    await expect(page.locator('[data-testid="cart-item"]')).toHaveCount(2);

    // Remove first item
    const firstCartItem = page.locator('[data-testid="cart-item"]').first();
    await firstCartItem.locator('[data-testid="remove-item"]').click();

    // Confirm removal if there's a confirmation dialog
    const confirmButton = page.locator('[data-testid="confirm-remove"]');
    if (await confirmButton.isVisible()) {
      await confirmButton.click();
    }

    // Verify item removed
    await expect(page.locator('[data-testid="cart-item"]')).toHaveCount(1);

    // Verify cart badge updated
    await expect(page.locator('[data-testid="cart-badge"]')).toContainText('3');
  });

  test('should show search results with vector search', async ({ page }) => {
    await loginAsSpaOwner(page);

    // Navigate to search page
    await page.click('[data-testid="search-link"]');
    await expect(page).toHaveURL(/\/app\/search/);

    // Enter search query
    await page.fill('[data-testid="search-input"]', 'hyaluronic acid serum');
    await page.click('[data-testid="search-button"]');

    // Verify search results appear
    await expect(page.locator('[data-testid="search-results"]')).toBeVisible();

    const results = page.locator('[data-testid="product-card"]');
    expect(await results.count()).toBeGreaterThan(0);

    // Verify hybrid search controls visible
    await expect(page.locator('[data-testid="tensor-weight-slider"]')).toBeVisible();
  });

  test('should complete quick reorder from order history', async ({ page }) => {
    // TODO: Create previous order for test user

    await loginAsSpaOwner(page);
    await page.goto(`${BASE_URL}/app/orders`);

    // Click reorder on first order
    const firstOrder = page.locator('[data-testid="order-row"]').first();
    await firstOrder.locator('[data-testid="reorder-button"]').click();

    // Should add items to cart
    await expect(page.locator('[data-testid="toast-notification"]')).toContainText('Added to cart');

    // Verify cart badge updates
    await expect(page.locator('[data-testid="cart-badge"]')).not.toContainText('0');

    // Open cart to verify items
    await page.click('[data-testid="cart-icon"]');
    const cartItems = page.locator('[data-testid="cart-item"]');
    expect(await cartItems.count()).toBeGreaterThan(0);
  });
});

// Helper functions

async function loginAsSpaOwner(page: Page) {
  // Navigate to login
  await page.goto(`${BASE_URL}/login`);

  // Fill credentials
  await page.fill('[data-testid="email-input"]', TEST_USER.email);
  await page.fill('[data-testid="password-input"]', TEST_USER.password);

  // Submit
  await page.click('[data-testid="login-button"]');

  // Wait for redirect to dashboard/home
  await page.waitForURL(/\/app/);

  // Verify logged in
  await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
}

async function addProductToCart(page: Page, productIndex: number, quantity: number) {
  // Navigate to products
  await page.goto(`${BASE_URL}/app/products`);

  // Click on product
  const productCards = page.locator('[data-testid="product-card"]');
  await productCards.nth(productIndex).click();

  // Set quantity
  await page.fill('[data-testid="quantity-input"]', quantity.toString());

  // Add to cart
  await page.click('[data-testid="add-to-cart"]');

  // Wait for confirmation
  await expect(page.locator('[data-testid="toast-notification"]')).toBeVisible();
}

async function fillShippingAddress(page: Page, address: typeof TEST_SHIPPING_ADDRESS) {
  await page.fill('[data-testid="shipping-street"]', address.street);
  await page.fill('[data-testid="shipping-city"]', address.city);
  await page.fill('[data-testid="shipping-state"]', address.state);
  await page.fill('[data-testid="shipping-zipcode"]', address.zipCode);
}
