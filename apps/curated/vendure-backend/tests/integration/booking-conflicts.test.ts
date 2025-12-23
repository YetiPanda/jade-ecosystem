/**
 * Integration Test for Double-Booking Prevention
 * Phase 4: User Story 2 - Appointment Scheduling & Client Management
 * Task: T097
 *
 * Purpose: Validate that the booking system prevents double-booking conflicts
 * These tests verify business logic and MUST FAIL before implementation
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';

/**
 * Test Scenarios for Double-Booking Prevention
 *
 * 1. Same provider, same time slot → REJECT
 * 2. Same provider, overlapping time → REJECT
 * 3. Same provider, back-to-back bookings → ACCEPT
 * 4. Same client, overlapping appointments → REJECT
 * 5. Different provider, same time → ACCEPT
 * 6. Provider at capacity, additional booking → REJECT
 * 7. Concurrent booking attempts (race condition) → Only first succeeds
 */

describe('Double-Booking Prevention - Integration Tests', () => {
  let testProviderId: string;
  let testClientId: string;
  let testServiceId: string;

  beforeAll(async () => {
    // Setup: Create test provider, client, and service
    // This will be implemented when entities are created
    testProviderId = 'provider-test-001';
    testClientId = 'client-test-001';
    testServiceId = 'service-facial-60min';
  });

  afterAll(async () => {
    // Cleanup: Remove test data
  });

  beforeEach(async () => {
    // Clear all appointments before each test
  });

  /**
   * Scenario 1: Same provider, exact same time slot
   * Expected: Second booking should be REJECTED with conflict error
   */
  it('should reject booking when provider is already booked at exact same time', async () => {
    const bookingInput = {
      providerId: testProviderId,
      clientId: testClientId,
      serviceId: testServiceId,
      startTime: '2025-10-20T10:00:00Z',
      duration: 60,
    };

    // First booking should succeed
    const firstBooking = await bookAppointment(bookingInput);
    expect(firstBooking.success).toBe(true);
    expect(firstBooking.appointment).toBeDefined();
    expect(firstBooking.appointment.id).toBeDefined();

    // Second booking at same time should FAIL
    const secondBooking = await bookAppointment(bookingInput);
    expect(secondBooking.success).toBe(false);
    expect(secondBooking.errors).toBeDefined();
    expect(secondBooking.errors[0].code).toBe('PROVIDER_UNAVAILABLE');
    expect(secondBooking.errors[0].message).toContain('already booked');
  });

  /**
   * Scenario 2: Same provider, overlapping time slots
   * Expected: REJECT with specific conflict details
   */
  it('should reject booking when time overlaps with existing appointment', async () => {
    // Book 10:00-11:00
    const firstBooking = await bookAppointment({
      providerId: testProviderId,
      clientId: testClientId,
      serviceId: testServiceId,
      startTime: '2025-10-20T10:00:00Z',
      duration: 60,
    });
    expect(firstBooking.success).toBe(true);

    // Try to book 10:30-11:30 (overlaps)
    const overlappingBooking = await bookAppointment({
      providerId: testProviderId,
      clientId: 'client-test-002',
      serviceId: testServiceId,
      startTime: '2025-10-20T10:30:00Z',
      duration: 60,
    });

    expect(overlappingBooking.success).toBe(false);
    expect(overlappingBooking.errors[0].code).toBe('TIME_CONFLICT');
    expect(overlappingBooking.errors[0].message).toContain('overlaps');

    // Verify conflict details
    expect(overlappingBooking.errors[0].conflictingAppointmentId).toBe(firstBooking.appointment.id);
  });

  /**
   * Scenario 3: Same provider, back-to-back bookings
   * Expected: ACCEPT - no overlap, should work
   */
  it('should allow back-to-back bookings for same provider', async () => {
    // Book 10:00-11:00
    const firstBooking = await bookAppointment({
      providerId: testProviderId,
      clientId: testClientId,
      serviceId: testServiceId,
      startTime: '2025-10-20T10:00:00Z',
      duration: 60,
    });
    expect(firstBooking.success).toBe(true);

    // Book 11:00-12:00 (immediately after)
    const secondBooking = await bookAppointment({
      providerId: testProviderId,
      clientId: 'client-test-002',
      serviceId: testServiceId,
      startTime: '2025-10-20T11:00:00Z',
      duration: 60,
    });

    expect(secondBooking.success).toBe(true);
    expect(secondBooking.appointment).toBeDefined();
    expect(secondBooking.appointment.id).not.toBe(firstBooking.appointment.id);
  });

  /**
   * Scenario 4: Same client, overlapping appointments
   * Expected: REJECT - client cannot be in two places at once
   */
  it('should reject booking when client already has appointment at same time', async () => {
    const provider1 = testProviderId;
    const provider2 = 'provider-test-002';
    const client = testClientId;

    // Book with provider 1 at 10:00
    const firstBooking = await bookAppointment({
      providerId: provider1,
      clientId: client,
      serviceId: testServiceId,
      startTime: '2025-10-20T10:00:00Z',
      duration: 60,
    });
    expect(firstBooking.success).toBe(true);

    // Try to book with provider 2 at 10:30 (client conflict)
    const conflictingBooking = await bookAppointment({
      providerId: provider2,
      clientId: client,
      serviceId: testServiceId,
      startTime: '2025-10-20T10:30:00Z',
      duration: 60,
    });

    expect(conflictingBooking.success).toBe(false);
    expect(conflictingBooking.errors[0].code).toBe('CLIENT_UNAVAILABLE');
    expect(conflictingBooking.errors[0].message).toContain('already has an appointment');
  });

  /**
   * Scenario 5: Different providers, same time
   * Expected: ACCEPT - different providers can work at same time
   */
  it('should allow bookings for different providers at same time', async () => {
    const provider1 = testProviderId;
    const provider2 = 'provider-test-002';

    const booking1 = await bookAppointment({
      providerId: provider1,
      clientId: testClientId,
      serviceId: testServiceId,
      startTime: '2025-10-20T10:00:00Z',
      duration: 60,
    });

    const booking2 = await bookAppointment({
      providerId: provider2,
      clientId: 'client-test-002',
      serviceId: testServiceId,
      startTime: '2025-10-20T10:00:00Z',
      duration: 60,
    });

    expect(booking1.success).toBe(true);
    expect(booking2.success).toBe(true);
  });

  /**
   * Scenario 6: Provider at capacity
   * Expected: REJECT when capacity is full
   */
  it('should reject booking when provider slot is at capacity', async () => {
    // Setup: Provider with capacity of 2 for group sessions
    const groupServiceId = 'service-group-yoga';
    const slotCapacity = 2;

    // Book first client
    const booking1 = await bookAppointment({
      providerId: testProviderId,
      clientId: 'client-test-001',
      serviceId: groupServiceId,
      startTime: '2025-10-20T14:00:00Z',
      duration: 60,
    });
    expect(booking1.success).toBe(true);

    // Book second client
    const booking2 = await bookAppointment({
      providerId: testProviderId,
      clientId: 'client-test-002',
      serviceId: groupServiceId,
      startTime: '2025-10-20T14:00:00Z',
      duration: 60,
    });
    expect(booking2.success).toBe(true);

    // Try third client (exceeds capacity)
    const booking3 = await bookAppointment({
      providerId: testProviderId,
      clientId: 'client-test-003',
      serviceId: groupServiceId,
      startTime: '2025-10-20T14:00:00Z',
      duration: 60,
    });

    expect(booking3.success).toBe(false);
    expect(booking3.errors[0].code).toBe('SLOT_FULL');
    expect(booking3.errors[0].message).toContain('capacity');
  });

  /**
   * Scenario 7: Concurrent booking attempts (race condition)
   * Expected: Database locks prevent double-booking
   */
  it('should handle concurrent booking attempts with database locking', async () => {
    const bookingInput = {
      providerId: testProviderId,
      clientId: testClientId,
      serviceId: testServiceId,
      startTime: '2025-10-20T15:00:00Z',
      duration: 60,
    };

    // Simulate 10 concurrent booking attempts
    const concurrentBookings = await Promise.allSettled([
      bookAppointment({ ...bookingInput, clientId: 'client-001' }),
      bookAppointment({ ...bookingInput, clientId: 'client-002' }),
      bookAppointment({ ...bookingInput, clientId: 'client-003' }),
      bookAppointment({ ...bookingInput, clientId: 'client-004' }),
      bookAppointment({ ...bookingInput, clientId: 'client-005' }),
      bookAppointment({ ...bookingInput, clientId: 'client-006' }),
      bookAppointment({ ...bookingInput, clientId: 'client-007' }),
      bookAppointment({ ...bookingInput, clientId: 'client-008' }),
      bookAppointment({ ...bookingInput, clientId: 'client-009' }),
      bookAppointment({ ...bookingInput, clientId: 'client-010' }),
    ]);

    // Only ONE should succeed
    const successful = concurrentBookings.filter(
      (result) => result.status === 'fulfilled' && (result.value as any).success === true
    );

    const failed = concurrentBookings.filter(
      (result) => result.status === 'fulfilled' && (result.value as any).success === false
    );

    expect(successful.length).toBe(1);
    expect(failed.length).toBe(9);

    // All failures should be due to conflict
    failed.forEach((result) => {
      if (result.status === 'fulfilled') {
        expect((result.value as any).errors[0].code).toBe('PROVIDER_UNAVAILABLE');
      }
    });
  });

  /**
   * Scenario 8: Booking outside provider working hours
   * Expected: REJECT
   */
  it('should reject booking outside provider working hours', async () => {
    // Provider works 9am-5pm
    // Try to book at 7am
    const earlyBooking = await bookAppointment({
      providerId: testProviderId,
      clientId: testClientId,
      serviceId: testServiceId,
      startTime: '2025-10-20T07:00:00Z',
      duration: 60,
    });

    expect(earlyBooking.success).toBe(false);
    expect(earlyBooking.errors[0].code).toBe('OUTSIDE_WORKING_HOURS');

    // Try to book at 6pm (ends at 7pm, outside hours)
    const lateBooking = await bookAppointment({
      providerId: testProviderId,
      clientId: testClientId,
      serviceId: testServiceId,
      startTime: '2025-10-20T18:00:00Z',
      duration: 60,
    });

    expect(lateBooking.success).toBe(false);
    expect(lateBooking.errors[0].code).toBe('OUTSIDE_WORKING_HOURS');
  });

  /**
   * Scenario 9: Booking during blocked time
   * Expected: REJECT
   */
  it('should reject booking during provider blocked time', async () => {
    // Block time 2pm-3pm for lunch break
    await blockProviderTime({
      providerId: testProviderId,
      startTime: '2025-10-20T14:00:00Z',
      endTime: '2025-10-20T15:00:00Z',
      reason: 'Lunch break',
    });

    // Try to book during blocked time
    const blockedTimeBooking = await bookAppointment({
      providerId: testProviderId,
      clientId: testClientId,
      serviceId: testServiceId,
      startTime: '2025-10-20T14:00:00Z',
      duration: 60,
    });

    expect(blockedTimeBooking.success).toBe(false);
    expect(blockedTimeBooking.errors[0].code).toBe('TIME_BLOCKED');
    expect(blockedTimeBooking.errors[0].message).toContain('unavailable');
  });

  /**
   * Scenario 10: Rescheduling creates conflict
   * Expected: REJECT reschedule if new time has conflict
   */
  it('should reject reschedule if new time conflicts with existing appointment', async () => {
    // Book appointment 1 at 10:00
    const appointment1 = await bookAppointment({
      providerId: testProviderId,
      clientId: 'client-test-001',
      serviceId: testServiceId,
      startTime: '2025-10-20T10:00:00Z',
      duration: 60,
    });

    // Book appointment 2 at 11:00
    const appointment2 = await bookAppointment({
      providerId: testProviderId,
      clientId: 'client-test-002',
      serviceId: testServiceId,
      startTime: '2025-10-20T11:00:00Z',
      duration: 60,
    });

    expect(appointment1.success).toBe(true);
    expect(appointment2.success).toBe(true);

    // Try to reschedule appointment 1 to 11:00 (conflicts with appointment 2)
    const reschedule = await rescheduleAppointment({
      appointmentId: appointment1.appointment.id,
      newStartTime: '2025-10-20T11:00:00Z',
    });

    expect(reschedule.success).toBe(false);
    expect(reschedule.errors[0].code).toBe('TIME_CONFLICT');
  });
});

/**
 * Helper Functions (Mock implementations - will be replaced with real API calls)
 */

async function bookAppointment(input: any): Promise<any> {
  // This will call the real BookingService once implemented
  // For now, this will fail as the service doesn't exist yet
  throw new Error('BookingService not implemented - TDD: implement to pass this test');
}

async function blockProviderTime(input: any): Promise<any> {
  throw new Error('CalendarService not implemented - TDD: implement to pass this test');
}

async function rescheduleAppointment(input: any): Promise<any> {
  throw new Error('BookingService.reschedule not implemented - TDD: implement to pass this test');
}

/**
 * Test Summary - Double-Booking Prevention
 *
 * Total Scenarios: 10
 * Expected Status: ALL TESTS FAIL until implementation
 *
 * Key Business Rules Validated:
 * 1. Provider cannot be double-booked (same time)
 * 2. Provider cannot have overlapping appointments
 * 3. Back-to-back appointments are allowed
 * 4. Client cannot have multiple appointments at same time
 * 5. Different providers can work simultaneously
 * 6. Capacity limits are enforced
 * 7. Race conditions are handled with database locks
 * 8. Working hours are enforced
 * 9. Blocked time prevents booking
 * 10. Rescheduling respects conflict detection
 *
 * Implementation Requirements:
 * - Database-level locking (SELECT FOR UPDATE)
 * - Transaction isolation (READ COMMITTED minimum)
 * - Conflict detection algorithm
 * - Capacity tracking
 * - Working hours validation
 */
