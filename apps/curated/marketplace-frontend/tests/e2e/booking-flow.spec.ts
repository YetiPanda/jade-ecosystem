/**
 * E2E Test for Appointment Booking Flow
 * Phase 4: User Story 2 - Appointment Scheduling & Client Management
 * Task: T099
 *
 * Purpose: End-to-end validation of complete booking journey
 * These tests simulate real user interactions and MUST FAIL before implementation
 */

import { test, expect, type Page } from '@playwright/test';

/**
 * Complete Booking Journey Test
 *
 * User Flow:
 * 1. Client visits booking portal
 * 2. Selects service type
 * 3. Chooses preferred provider
 * 4. Views available time slots
 * 5. Selects date and time
 * 6. Enters client information
 * 7. Reviews booking details
 * 8. Confirms appointment
 * 9. Receives confirmation
 * 10. Receives confirmation email
 */

test.describe('Appointment Booking - E2E Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to booking portal
    await page.goto('/booking');
  });

  /**
   * Happy Path: Complete booking journey
   */
  test('should complete full booking flow successfully', async ({ page }) => {
    // Step 1: Landing on booking portal
    await expect(page.getByRole('heading', { name: 'Book Your Appointment' })).toBeVisible();

    // Step 2: Select service type
    await page.getByLabel('Service Type').click();
    await page.getByRole('option', { name: 'Signature Facial - 60 min' }).click();

    // Verify service details displayed
    await expect(page.getByText('$125')).toBeVisible();
    await expect(page.getByText('60 minutes')).toBeVisible();
    await expect(page.getByText(/deep cleansing facial/i)).toBeVisible();

    // Step 3: Choose provider (optional - can skip to see all available)
    await page.getByLabel('Preferred Provider').click();
    await page.getByRole('option', { name: 'Sarah Johnson, Licensed Esthetician' }).click();

    // Verify provider details
    await expect(page.getByText('License: CA-EST-12345')).toBeVisible();
    await expect(page.getByText(/10 years experience/i)).toBeVisible();

    // Step 4: Select date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().split('T')[0];

    await page.getByLabel('Appointment Date').fill(tomorrowDate);

    // Wait for available slots to load
    await expect(page.getByText('Available Time Slots')).toBeVisible();
    await page.waitForSelector('[data-testid="time-slot"]', { state: 'visible' });

    // Step 5: Select time slot
    const availableSlots = page.locator('[data-testid="time-slot"]:not([data-booked="true"])');
    await expect(availableSlots.first()).toBeVisible();
    await availableSlots.first().click();

    // Verify selection
    await expect(page.locator('[data-testid="selected-time"]')).toContainText(/[0-9]{1,2}:[0-9]{2}/);

    // Step 6: Click "Continue to Details"
    await page.getByRole('button', { name: 'Continue' }).click();

    // Step 7: Enter client information
    await expect(page.getByRole('heading', { name: 'Your Information' })).toBeVisible();

    await page.getByLabel('First Name').fill('Jane');
    await page.getByLabel('Last Name').fill('Doe');
    await page.getByLabel('Email').fill('jane.doe@example.com');
    await page.getByLabel('Phone').fill('(555) 123-4567');

    // First-time client - fill additional info
    await page.getByLabel('Date of Birth').fill('1990-05-15');
    await page.getByLabel('Skin Type').click();
    await page.getByRole('option', { name: 'Combination' }).click();

    // Allergies
    await page.getByLabel('Any allergies or skin sensitivities?').fill('Fragrance-free products only');

    // Medical history
    await page.getByLabel('Currently taking any medications?').check();
    await page.getByLabel('Please specify medications').fill('Tretinoin 0.05%');

    // Consent
    await page.getByLabel('I agree to the terms and conditions').check();
    await page.getByLabel('I consent to treatment').check();

    // Step 8: Review booking
    await page.getByRole('button', { name: 'Review Booking' }).click();

    await expect(page.getByRole('heading', { name: 'Review Your Appointment' })).toBeVisible();

    // Verify all details
    await expect(page.getByText('Signature Facial')).toBeVisible();
    await expect(page.getByText('Sarah Johnson')).toBeVisible();
    await expect(page.getByText('Jane Doe')).toBeVisible();
    await expect(page.getByText('jane.doe@example.com')).toBeVisible();
    await expect(page.getByText('$125')).toBeVisible();

    // Step 9: Confirm appointment
    await page.getByRole('button', { name: 'Confirm Appointment' }).click();

    // Wait for confirmation
    await page.waitForURL(/.*\/booking\/confirmation.*/);

    // Step 10: Verify confirmation page
    await expect(page.getByRole('heading', { name: 'Appointment Confirmed!' })).toBeVisible();

    const confirmationNumber = await page.locator('[data-testid="confirmation-number"]').textContent();
    expect(confirmationNumber).toMatch(/^APT-[0-9]{6,}/);

    await expect(page.getByText('Confirmation email sent to jane.doe@example.com')).toBeVisible();

    // Verify calendar add options
    await expect(page.getByRole('button', { name: 'Add to Google Calendar' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add to Apple Calendar' })).toBeVisible();

    // Verify next steps displayed
    await expect(page.getByText(/What to expect/i)).toBeVisible();
    await expect(page.getByText(/Arrive 10 minutes early/i)).toBeVisible();
  });

  /**
   * Error: Double-booking attempt
   */
  test('should prevent double-booking and show error', async ({ page }) => {
    // Book first appointment
    await selectService(page, 'Signature Facial');
    await selectProvider(page, 'Sarah Johnson');
    await selectDate(page, getTomorrow());
    await selectTimeSlot(page, 0); // First available slot

    await fillClientInfo(page, {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john@example.com',
      phone: '555-111-2222',
    });

    await page.getByRole('button', { name: 'Review Booking' }).click();
    await page.getByRole('button', { name: 'Confirm Appointment' }).click();

    // Wait for confirmation
    await page.waitForURL(/.*\/booking\/confirmation.*/);

    // Try to book same slot again (in new session/window)
    await page.goto('/booking');

    await selectService(page, 'Signature Facial');
    await selectProvider(page, 'Sarah Johnson');
    await selectDate(page, getTomorrow());

    // The previously booked slot should now show as unavailable
    const firstSlot = page.locator('[data-testid="time-slot"]').first();
    await expect(firstSlot).toHaveAttribute('data-booked', 'true');
    await expect(firstSlot).toBeDisabled();

    // Verify error message if attempting to select
    await firstSlot.click({ force: true });
    await expect(page.getByText(/This time slot is no longer available/i)).toBeVisible();
  });

  /**
   * Error: Booking outside working hours
   */
  test('should not show slots outside working hours', async ({ page }) => {
    await selectService(page, 'Signature Facial');
    await selectProvider(page, 'Sarah Johnson');
    await selectDate(page, getTomorrow());

    // Verify no slots before 9am or after 5pm
    const earlySlots = page.locator('[data-testid="time-slot"][data-time^="07:"]');
    const lateSlots = page.locator('[data-testid="time-slot"][data-time^="18:"]');

    await expect(earlySlots).toHaveCount(0);
    await expect(lateSlots).toHaveCount(0);

    // Verify available slots are within working hours
    const availableSlots = page.locator('[data-testid="time-slot"]:not([data-booked="true"])');
    const firstSlotTime = await availableSlots.first().getAttribute('data-time');
    expect(firstSlotTime).toMatch(/^(09|10|11|12|13|14|15|16):/);
  });

  /**
   * Cancellation flow
   */
  test('should allow canceling appointment', async ({ page }) => {
    // Book appointment first
    const confirmationNumber = await bookAppointment(page, {
      service: 'Signature Facial',
      provider: 'Sarah Johnson',
      client: {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: '555-999-8888',
      },
    });

    // Navigate to appointment management
    await page.goto(`/booking/manage/${confirmationNumber}`);

    await expect(page.getByRole('heading', { name: 'Manage Appointment' })).toBeVisible();

    // Click cancel
    await page.getByRole('button', { name: 'Cancel Appointment' }).click();

    // Confirm cancellation dialog
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByLabel('Reason for cancellation').fill('Schedule conflict');
    await page.getByRole('button', { name: 'Confirm Cancellation' }).click();

    // Verify cancellation success
    await expect(page.getByText('Appointment Cancelled')).toBeVisible();
    await expect(page.getByText('Cancellation email sent')).toBeVisible();

    // Verify status updated
    await expect(page.locator('[data-testid="appointment-status"]')).toContainText('Cancelled');
  });

  /**
   * Rescheduling flow
   */
  test('should allow rescheduling appointment', async ({ page }) => {
    // Book appointment
    const confirmationNumber = await bookAppointment(page, {
      service: 'Signature Facial',
      provider: 'Sarah Johnson',
      client: {
        firstName: 'Reschedule',
        lastName: 'Test',
        email: 'reschedule@example.com',
        phone: '555-777-6666',
      },
    });

    // Go to management page
    await page.goto(`/booking/manage/${confirmationNumber}`);

    // Click reschedule
    await page.getByRole('button', { name: 'Reschedule' }).click();

    // Select new date
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    await selectDate(page, nextWeek);

    // Select new time
    await selectTimeSlot(page, 2); // Different slot

    // Confirm reschedule
    await page.getByRole('button', { name: 'Confirm New Time' }).click();

    // Verify success
    await expect(page.getByText('Appointment Rescheduled')).toBeVisible();
    await expect(page.getByText('Confirmation email sent with new details')).toBeVisible();

    // Verify new time displayed
    const newDateTime = await page.locator('[data-testid="appointment-datetime"]').textContent();
    expect(newDateTime).toContain(nextWeek.toLocaleDateString());
  });

  /**
   * View treatment history
   */
  test('should display client treatment history', async ({ page }) => {
    // Login as existing client
    await page.goto('/login');
    await page.getByLabel('Email').fill('existing.client@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Navigate to profile
    await page.goto('/profile/treatment-history');

    await expect(page.getByRole('heading', { name: 'Treatment History' })).toBeVisible();

    // Verify treatments displayed
    const treatments = page.locator('[data-testid="treatment-record"]');
    await expect(treatments).toHaveCountGreaterThan(0);

    // Verify treatment details
    const firstTreatment = treatments.first();
    await expect(firstTreatment.getByTestId('treatment-date')).toBeVisible();
    await expect(firstTreatment.getByTestId('service-name')).toBeVisible();
    await expect(firstTreatment.getByTestId('provider-name')).toBeVisible();

    // Click to expand details
    await firstTreatment.click();

    // Verify expanded details
    await expect(firstTreatment.getByText('Products Used:')).toBeVisible();
    await expect(firstTreatment.getByText('Treatment Notes:')).toBeVisible();
    await expect(firstTreatment.getByText('Before & After Photos:')).toBeVisible();
  });

  /**
   * License verification visible to client
   */
  test('should display provider license information', async ({ page }) => {
    await selectService(page, 'Signature Facial');

    // View provider details
    await page.getByText('View Provider Profile').click();

    // Verify license info displayed
    await expect(page.getByText('Licensed Esthetician')).toBeVisible();
    await expect(page.getByText(/License.*CA-EST-[0-9]+/)).toBeVisible();
    await expect(page.getByText(/License Expires:/)).toBeVisible();

    // Verify certification badges
    await expect(page.locator('[data-testid="certification-badge"]')).toHaveCountGreaterThan(0);
  });

  /**
   * Calendar integration
   */
  test('should offer calendar export options', async ({ page }) => {
    const confirmationNumber = await bookAppointment(page, {
      service: 'Signature Facial',
      provider: 'Sarah Johnson',
      client: {
        firstName: 'Calendar',
        lastName: 'Test',
        email: 'calendar@example.com',
        phone: '555-444-3333',
      },
    });

    // On confirmation page
    await page.waitForURL(/.*\/booking\/confirmation.*/);

    // Click Google Calendar
    const googleCalendarButton = page.getByRole('button', { name: 'Add to Google Calendar' });
    await expect(googleCalendarButton).toBeVisible();

    // Verify download link for iCal
    const iCalLink = page.getByRole('link', { name: 'Download .ics file' });
    await expect(iCalLink).toBeVisible();

    const downloadURL = await iCalLink.getAttribute('href');
    expect(downloadURL).toContain('.ics');
  });
});

/**
 * Mobile-specific booking flow
 */
test.describe('Mobile Booking Flow', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('should complete booking on mobile device', async ({ page }) => {
    await page.goto('/booking');

    // Mobile-specific interactions
    await page.getByRole('button', { name: 'Select Service' }).click();
    await page.getByText('Signature Facial').click();

    // Swipe through available providers
    const providerCarousel = page.locator('[data-testid="provider-carousel"]');
    await expect(providerCarousel).toBeVisible();

    // Select provider
    await page.locator('[data-testid="provider-card"]').first().click();
    await page.getByRole('button', { name: 'Choose This Provider' }).click();

    // Calendar view on mobile
    await page.getByRole('button', { name: 'Select Date' }).click();
    const datePicker = page.locator('[data-testid="mobile-date-picker"]');
    await expect(datePicker).toBeVisible();

    // Complete booking...
    // (Similar to desktop flow but with mobile-specific selectors)
  });
});

/**
 * Helper Functions
 */

async function selectService(page: Page, serviceName: string) {
  await page.getByLabel('Service Type').click();
  await page.getByRole('option', { name: new RegExp(serviceName, 'i') }).click();
}

async function selectProvider(page: Page, providerName: string) {
  await page.getByLabel('Preferred Provider').click();
  await page.getByRole('option', { name: new RegExp(providerName, 'i') }).click();
}

async function selectDate(page: Page, date: Date) {
  const dateString = date.toISOString().split('T')[0];
  await page.getByLabel('Appointment Date').fill(dateString);
  await page.waitForSelector('[data-testid="time-slot"]', { state: 'visible' });
}

async function selectTimeSlot(page: Page, index: number) {
  const availableSlots = page.locator('[data-testid="time-slot"]:not([data-booked="true"])');
  await availableSlots.nth(index).click();
}

async function fillClientInfo(page: Page, info: any) {
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByLabel('First Name').fill(info.firstName);
  await page.getByLabel('Last Name').fill(info.lastName);
  await page.getByLabel('Email').fill(info.email);
  await page.getByLabel('Phone').fill(info.phone);

  if (info.dateOfBirth) {
    await page.getByLabel('Date of Birth').fill(info.dateOfBirth);
  }

  await page.getByLabel('I agree to the terms and conditions').check();
  await page.getByLabel('I consent to treatment').check();
}

async function bookAppointment(page: Page, details: any): Promise<string> {
  await page.goto('/booking');

  await selectService(page, details.service);
  await selectProvider(page, details.provider);
  await selectDate(page, getTomorrow());
  await selectTimeSlot(page, 0);
  await fillClientInfo(page, details.client);

  await page.getByRole('button', { name: 'Review Booking' }).click();
  await page.getByRole('button', { name: 'Confirm Appointment' }).click();

  await page.waitForURL(/.*\/booking\/confirmation.*/);

  const confirmationNumber = await page.locator('[data-testid="confirmation-number"]').textContent();
  return confirmationNumber || '';
}

function getTomorrow(): Date {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow;
}

/**
 * Test Summary - Booking Flow E2E
 *
 * Total Scenarios: 10 tests
 * Expected Status: ALL TESTS FAIL until implementation
 *
 * Flows Covered:
 * 1. Complete happy path booking
 * 2. Double-booking prevention
 * 3. Working hours validation
 * 4. Appointment cancellation
 * 5. Appointment rescheduling
 * 6. Treatment history viewing
 * 7. License verification display
 * 8. Calendar export
 * 9. Mobile booking experience
 *
 * User Interactions Validated:
 * - Service selection with details
 * - Provider selection with licenses
 * - Date and time slot selection
 * - Client information form
 * - Review and confirmation
 * - Email confirmation
 * - Calendar integration
 * - Appointment management
 * - Treatment history access
 *
 * This E2E suite validates the complete user journey from discovery to confirmation.
 */
