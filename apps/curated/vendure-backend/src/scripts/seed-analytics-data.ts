/**
 * Seed Analytics Test Data
 *
 * Generates comprehensive test data for analytics testing:
 * - 50+ appointments across date ranges
 * - 20+ client profiles with treatment history
 * - Revenue data (orders linked to appointments)
 * - Marketing channel attribution data
 */

import { config } from 'dotenv';
config();

import { AppDataSource } from '../config/database';
import { randomUUID } from 'crypto';

// Helper to generate random date within range
function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Helper to pick random item from array
function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Helper to generate random number in range
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Test data constants
const FIRST_NAMES = [
  'Emma', 'Olivia', 'Ava', 'Isabella', 'Sophia', 'Mia', 'Charlotte', 'Amelia',
  'Harper', 'Evelyn', 'Abigail', 'Emily', 'Elizabeth', 'Sofia', 'Avery',
  'Ella', 'Scarlett', 'Grace', 'Victoria', 'Riley', 'Aria', 'Lily', 'Aubrey',
  'Zoey', 'Penelope', 'Chloe', 'Layla', 'Luna', 'Hazel', 'Nora'
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson'
];

const SERVICES = [
  { name: 'Classic Facial', duration: 60, price: 12000 }, // $120
  { name: 'Deep Cleansing Facial', duration: 75, price: 15000 },
  { name: 'Anti-Aging Facial', duration: 90, price: 18000 },
  { name: 'Hydrating Facial', duration: 60, price: 13000 },
  { name: 'Acne Treatment Facial', duration: 75, price: 14000 },
  { name: 'Microdermabrasion', duration: 45, price: 15000 },
  { name: 'Chemical Peel', duration: 45, price: 17500 },
  { name: 'LED Light Therapy', duration: 30, price: 8000 },
  { name: 'Dermaplaning', duration: 45, price: 12500 },
  { name: 'HydraFacial', duration: 60, price: 20000 },
  { name: 'Oxygen Facial', duration: 60, price: 16000 },
  { name: 'Collagen Boost Treatment', duration: 75, price: 19000 },
  { name: 'Vitamin C Brightening', duration: 60, price: 14500 },
  { name: 'Sensitive Skin Facial', duration: 60, price: 13500 },
  { name: 'Express Facial', duration: 30, price: 7500 },
];

const MARKETING_CHANNELS = [
  { channel: 'ORGANIC_SEARCH', weight: 25 },
  { channel: 'PAID_SEARCH', weight: 15 },
  { channel: 'SOCIAL_MEDIA', weight: 20 },
  { channel: 'EMAIL', weight: 15 },
  { channel: 'REFERRAL', weight: 15 },
  { channel: 'DIRECT', weight: 10 },
];

const APPOINTMENT_STATUSES = ['COMPLETED', 'COMPLETED', 'COMPLETED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'];

const SKIN_TYPES = ['NORMAL', 'DRY', 'OILY', 'COMBINATION', 'SENSITIVE'];
const SKIN_CONCERNS = ['AGING', 'ACNE', 'HYPERPIGMENTATION', 'DEHYDRATION', 'REDNESS', 'TEXTURE', 'PORES'];

/**
 * Get weighted random marketing channel
 */
function getRandomChannel(): string {
  const totalWeight = MARKETING_CHANNELS.reduce((sum, c) => sum + c.weight, 0);
  let random = Math.random() * totalWeight;

  for (const channel of MARKETING_CHANNELS) {
    random -= channel.weight;
    if (random <= 0) return channel.channel;
  }

  return 'DIRECT';
}

/**
 * Generate client data
 */
interface ClientData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  skinType: string;
  skinConcerns: string[];
  acquisitionChannel: string;
  createdAt: Date;
  totalSpent: number;
  visitCount: number;
}

function generateClients(count: number): ClientData[] {
  const clients: ClientData[] = [];
  const usedEmails = new Set<string>();

  for (let i = 0; i < count; i++) {
    const firstName = randomItem(FIRST_NAMES);
    const lastName = randomItem(LAST_NAMES);
    let email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomInt(1, 999)}@test.jade`;

    // Ensure unique email
    while (usedEmails.has(email)) {
      email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomInt(1, 9999)}@test.jade`;
    }
    usedEmails.add(email);

    // Random skin concerns (1-3)
    const concernCount = randomInt(1, 3);
    const concerns: string[] = [];
    while (concerns.length < concernCount) {
      const concern = randomItem(SKIN_CONCERNS);
      if (!concerns.includes(concern)) concerns.push(concern);
    }

    clients.push({
      id: randomUUID(),
      firstName,
      lastName,
      email,
      phone: `(${randomInt(200, 999)}) ${randomInt(200, 999)}-${randomInt(1000, 9999)}`,
      skinType: randomItem(SKIN_TYPES),
      skinConcerns: concerns,
      acquisitionChannel: getRandomChannel(),
      createdAt: randomDate(new Date('2024-01-01'), new Date('2024-10-01')),
      totalSpent: 0,
      visitCount: 0,
    });
  }

  return clients;
}

/**
 * Generate appointments and orders for clients
 */
interface AppointmentData {
  id: string;
  clientId: string;
  serviceProviderId: string;
  locationId: string;
  serviceType: string;
  serviceName: string;
  servicePrice: number;
  duration: number;
  status: string;
  scheduledStart: Date;
  scheduledEnd: Date;
  completedAt: Date | null;
  notes: string | null;
  marketingChannel: string;
}

function generateAppointments(
  clients: ClientData[],
  minAppointments: number,
  serviceProviderIds: string[],
  locationIds: string[]
): AppointmentData[] {
  const appointments: AppointmentData[] = [];

  // Ensure minimum total appointments
  let totalAppointments = 0;

  // First pass: give each client at least 1 appointment
  for (const client of clients) {
    const appointmentCount = randomInt(1, 5);
    client.visitCount = appointmentCount;

    for (let j = 0; j < appointmentCount; j++) {
      const service = randomItem(SERVICES);
      const status = randomItem(APPOINTMENT_STATUSES);
      const scheduledStart = randomDate(client.createdAt, new Date());

      // Business hours: 9am - 6pm
      scheduledStart.setHours(randomInt(9, 17));
      scheduledStart.setMinutes(randomItem([0, 15, 30, 45]));

      // Calculate end time based on duration
      const scheduledEnd = new Date(scheduledStart.getTime() + service.duration * 60 * 1000);

      const appointment: AppointmentData = {
        id: randomUUID(),
        clientId: client.id,
        serviceProviderId: randomItem(serviceProviderIds),
        locationId: randomItem(locationIds),
        serviceType: service.name.toUpperCase().replace(/\s+/g, '_'),
        serviceName: service.name,
        servicePrice: service.price,
        duration: service.duration,
        status,
        scheduledStart,
        scheduledEnd,
        completedAt: status === 'COMPLETED' ? scheduledEnd : null,
        notes: status === 'COMPLETED' ? randomItem([null, 'Client was satisfied', 'Recommended follow-up', 'First visit']) : null,
        marketingChannel: j === 0 ? client.acquisitionChannel : randomItem(['RETURN_VISIT', client.acquisitionChannel]),
      };

      if (status === 'COMPLETED') {
        client.totalSpent += service.price;
      }

      appointments.push(appointment);
      totalAppointments++;
    }
  }

  // Second pass: add more appointments if needed to hit minimum
  while (totalAppointments < minAppointments) {
    const client = randomItem(clients);
    const service = randomItem(SERVICES);
    const status = randomItem(APPOINTMENT_STATUSES);
    const scheduledStart = randomDate(client.createdAt, new Date());

    scheduledStart.setHours(randomInt(9, 17));
    scheduledStart.setMinutes(randomItem([0, 15, 30, 45]));

    const scheduledEnd = new Date(scheduledStart.getTime() + service.duration * 60 * 1000);

    const appointment: AppointmentData = {
      id: randomUUID(),
      clientId: client.id,
      serviceProviderId: randomItem(serviceProviderIds),
      locationId: randomItem(locationIds),
      serviceType: service.name.toUpperCase().replace(/\s+/g, '_'),
      serviceName: service.name,
      servicePrice: service.price,
      duration: service.duration,
      status,
      scheduledStart,
      scheduledEnd,
      completedAt: status === 'COMPLETED' ? scheduledEnd : null,
      notes: null,
      marketingChannel: 'RETURN_VISIT',
    };

    if (status === 'COMPLETED') {
      client.totalSpent += service.price;
    }
    client.visitCount++;

    appointments.push(appointment);
    totalAppointments++;
  }

  return appointments;
}

/**
 * Main seed function
 */
async function main(): Promise<void> {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  JADE - Seeding Analytics Test Data');
  console.log('═══════════════════════════════════════════════════════════════');

  try {
    // Initialize database connection
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('✓ Database connected');
    }

    // Get spa organization for test data
    const orgResult = await AppDataSource.query(
      `SELECT id FROM jade.spa_organization LIMIT 1`
    );

    if (orgResult.length === 0) {
      console.log('\n⚠️  No spa organization found. Run pnpm run seed first.');
      return;
    }

    const spaOrgId = orgResult[0].id;
    console.log(`\n📍 Using spa organization: ${spaOrgId}`);

    // Get or create locations first (service_provider may reference it)
    let locationIds: string[] = [];
    const locResult = await AppDataSource.query(
      `SELECT id FROM jade.location WHERE spa_organization_id = $1 LIMIT 5`,
      [spaOrgId]
    );
    if (locResult.length > 0) {
      locationIds = locResult.map((r: { id: string }) => r.id);
    } else {
      // Create a test location with proper jsonb address
      const locId = randomUUID();
      await AppDataSource.query(
        `INSERT INTO jade.location (id, spa_organization_id, name, address, is_active)
         VALUES ($1, $2, 'Main Spa Location', $3, true)
         ON CONFLICT DO NOTHING`,
        [locId, spaOrgId, JSON.stringify({
          line1: '123 Spa Street',
          city: 'Los Angeles',
          state: 'CA',
          postalCode: '90001',
          country: 'USA'
        })]
      );
      locationIds = [locId];
    }
    console.log(`\n📍 Using ${locationIds.length} location(s)`);

    // Get or create service providers
    let serviceProviderIds: string[] = [];
    const spResult = await AppDataSource.query(
      `SELECT id FROM jade.service_provider WHERE spa_organization_id = $1 LIMIT 5`,
      [spaOrgId]
    );
    if (spResult.length > 0) {
      serviceProviderIds = spResult.map((r: { id: string }) => r.id);
    } else {
      // Need a user to link service provider to - check for existing users
      const userResult = await AppDataSource.query(
        `SELECT id FROM jade.user WHERE role = 'SERVICE_PROVIDER' LIMIT 1`
      );

      let userId: string;
      if (userResult.length > 0) {
        userId = userResult[0].id;
      } else {
        // Create a test user for the service provider
        userId = randomUUID();
        await AppDataSource.query(
          `INSERT INTO jade.user (id, email, password_hash, role, is_active)
           VALUES ($1, 'test.provider@jade.test', 'test_hash', 'SERVICE_PROVIDER', true)
           ON CONFLICT (email) DO UPDATE SET id = jade.user.id RETURNING id`,
          [userId]
        );
        // Get the actual id in case of conflict
        const actualUser = await AppDataSource.query(
          `SELECT id FROM jade.user WHERE email = 'test.provider@jade.test'`
        );
        if (actualUser.length > 0) {
          userId = actualUser[0].id;
        }
      }

      // Create a test service provider with proper license_info jsonb
      const spId = randomUUID();
      await AppDataSource.query(
        `INSERT INTO jade.service_provider (id, user_id, spa_organization_id, location_id, license_info, specialties, is_active)
         VALUES ($1, $2, $3, $4, $5, ARRAY['facial', 'skincare'], true)
         ON CONFLICT DO NOTHING`,
        [spId, userId, spaOrgId, locationIds[0], JSON.stringify({
          licenseNumber: 'TEST-12345',
          licenseState: 'CA',
          expirationDate: '2026-12-31'
        })]
      );
      serviceProviderIds = [spId];
    }
    console.log(`👤 Using ${serviceProviderIds.length} service provider(s)`);

    // Generate test data
    console.log('\n📊 Generating test data...');

    const clients = generateClients(25);
    console.log(`  ✓ Generated ${clients.length} clients`);

    const appointments = generateAppointments(clients, 60, serviceProviderIds, locationIds);
    console.log(`  ✓ Generated ${appointments.length} appointments`);

    // Insert clients
    console.log('\n👥 Inserting clients...');
    let insertedClients = 0;
    for (const client of clients) {
      try {
        await AppDataSource.query(
          `INSERT INTO jade.client (
            id, spa_organization_id, first_name, last_name, email, phone,
            skin_type, skin_concerns, acquisition_channel, total_spent,
            visit_count, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          ON CONFLICT (id) DO UPDATE SET
            skin_type = EXCLUDED.skin_type,
            skin_concerns = EXCLUDED.skin_concerns,
            total_spent = EXCLUDED.total_spent,
            visit_count = EXCLUDED.visit_count,
            updated_at = NOW()`,
          [
            client.id,
            spaOrgId,
            client.firstName,
            client.lastName,
            client.email,
            client.phone,
            client.skinType,
            client.skinConcerns,
            client.acquisitionChannel,
            client.totalSpent,
            client.visitCount,
            client.createdAt,
          ]
        );
        insertedClients++;
      } catch (error) {
        // Skip duplicates silently
      }
    }
    console.log(`  ✓ Inserted ${insertedClients} clients`);

    // Insert appointments
    console.log('\n📅 Inserting appointments...');
    let insertedAppointments = 0;

    for (const appt of appointments) {
      try {
        await AppDataSource.query(
          `INSERT INTO jade.appointment (
            id, client_id, service_provider_id, location_id, service_type,
            spa_organization_id, service_name, service_price,
            duration_minutes, status, scheduled_start, scheduled_end,
            completed_at, notes, marketing_channel, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
          ON CONFLICT DO NOTHING`,
          [
            appt.id,
            appt.clientId,
            appt.serviceProviderId,
            appt.locationId,
            appt.serviceType,
            spaOrgId,
            appt.serviceName,
            appt.servicePrice,
            appt.duration,
            appt.status,
            appt.scheduledStart,
            appt.scheduledEnd,
            appt.completedAt,
            appt.notes,
            appt.marketingChannel,
            appt.scheduledStart,
          ]
        );
        insertedAppointments++;
      } catch (error) {
        // Ignore constraint errors
        console.error('Appointment insert error:', error);
      }
    }
    console.log(`  ✓ Inserted ${insertedAppointments} appointments`);

    // Generate summary statistics
    console.log('\n📈 Analytics Summary:');

    const stats = {
      totalClients: clients.length,
      totalAppointments: appointments.length,
      completedAppointments: appointments.filter(a => a.status === 'COMPLETED').length,
      cancelledAppointments: appointments.filter(a => a.status === 'CANCELLED').length,
      noShows: appointments.filter(a => a.status === 'NO_SHOW').length,
      totalRevenue: clients.reduce((sum, c) => sum + c.totalSpent, 0) / 100,
      avgSpendPerClient: clients.reduce((sum, c) => sum + c.totalSpent, 0) / clients.length / 100,
      avgVisitsPerClient: clients.reduce((sum, c) => sum + c.visitCount, 0) / clients.length,
    };

    const channelBreakdown: Record<string, number> = {};
    for (const client of clients) {
      channelBreakdown[client.acquisitionChannel] = (channelBreakdown[client.acquisitionChannel] || 0) + 1;
    }

    console.log(`  Total Clients: ${stats.totalClients}`);
    console.log(`  Total Appointments: ${stats.totalAppointments}`);
    console.log(`    - Completed: ${stats.completedAppointments}`);
    console.log(`    - Cancelled: ${stats.cancelledAppointments}`);
    console.log(`    - No-Shows: ${stats.noShows}`);
    console.log(`  Total Revenue: $${stats.totalRevenue.toFixed(2)}`);
    console.log(`  Avg Spend/Client: $${stats.avgSpendPerClient.toFixed(2)}`);
    console.log(`  Avg Visits/Client: ${stats.avgVisitsPerClient.toFixed(1)}`);
    console.log('\n  Acquisition Channels:');
    for (const [channel, count] of Object.entries(channelBreakdown)) {
      console.log(`    - ${channel}: ${count} clients`);
    }

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('  ✅ Analytics test data seeded successfully!');
    console.log('═══════════════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('\n✗ Seeding failed:', error);
    process.exit(1);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

// Run if called directly
main().catch(console.error);
