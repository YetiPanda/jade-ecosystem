/**
 * ClientService - Client Profile & Treatment History Management
 * Phase 4: User Story 2 - Appointment Scheduling & Client Management
 * Task: T107
 *
 * Purpose: Manage client profiles, treatment history, and medical records
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Client,
  SkinProfile,
  MedicalHistory,
  ConsentForm,
  Preference,
} from '../entities/client.entity';
import { Appointment } from '../entities/appointment.entity';

/**
 * Create Client Input
 */
export interface CreateClientInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: Date;
  skinProfile?: SkinProfile;
  medicalHistory?: MedicalHistory;
  preferences?: Preference;
}

/**
 * Update Client Input
 */
export interface UpdateClientInput {
  clientId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  skinProfile?: SkinProfile;
  medicalHistory?: MedicalHistory;
  preferences?: Preference;
}

/**
 * Treatment History Query
 */
export interface TreatmentHistoryQuery {
  clientId: string;
  startDate?: Date;
  endDate?: Date;
  serviceType?: string;
  providerId?: string;
}

/**
 * Treatment History Result
 */
export interface TreatmentHistoryResult {
  client: Client;
  appointments: Appointment[];
  totalTreatments: number;
  favoriteServices: string[];
  lastVisit: Date | null;
  lifetimeValue: number;
}

/**
 * Consent Form Input
 */
export interface AddConsentFormInput {
  clientId: string;
  formType: string;
  documentUrl: string;
  expiresAt?: Date;
}

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepo: Repository<Client>,
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
  ) {}

  /**
   * Create a new client
   */
  async createClient(input: CreateClientInput): Promise<Client> {
    // Check for duplicate email
    const existing = await this.clientRepo.findOne({
      where: { email: input.email },
    });

    if (existing) {
      throw new Error(`Client with email ${input.email} already exists`);
    }

    // Create client
    const client = this.clientRepo.create({
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone,
      dateOfBirth: input.dateOfBirth,
      skinProfile: input.skinProfile || null,
      medicalHistory: input.medicalHistory || null,
      preferences: input.preferences || {
        communicationMethod: 'EMAIL',
        reminderSettings: {
          enabled: true,
          daysBeforeAppointment: 1,
          method: 'EMAIL',
        },
        marketingOptIn: false,
      },
      consentForms: [],
      emergencyContact: null,
      tags: [],
      loyaltyPoints: 0,
      totalSpent: 0,
      notes: '',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return await this.clientRepo.save(client);
  }

  /**
   * Update client profile
   */
  async updateClient(input: UpdateClientInput): Promise<Client> {
    const client = await this.clientRepo.findOne({
      where: { id: input.clientId },
    });

    if (!client) {
      throw new Error(`Client with ID ${input.clientId} not found`);
    }

    // Update fields
    if (input.firstName) client.firstName = input.firstName;
    if (input.lastName) client.lastName = input.lastName;
    if (input.email) client.email = input.email;
    if (input.phone) client.phone = input.phone;
    if (input.skinProfile) client.skinProfile = input.skinProfile;
    if (input.medicalHistory) client.medicalHistory = input.medicalHistory;
    if (input.preferences) client.preferences = input.preferences;

    client.updatedAt = new Date();

    return await this.clientRepo.save(client);
  }

  /**
   * Get client by ID
   */
  async getClient(clientId: string): Promise<Client | null> {
    return await this.clientRepo.findOne({
      where: { id: clientId },
    });
  }

  /**
   * Get client by email
   */
  async getClientByEmail(email: string): Promise<Client | null> {
    return await this.clientRepo.findOne({
      where: { email },
    });
  }

  /**
   * Search clients by name, email, or phone
   */
  async searchClients(searchTerm: string): Promise<Client[]> {
    return await this.clientRepo
      .createQueryBuilder('client')
      .where('client.firstName ILIKE :term', { term: `%${searchTerm}%` })
      .orWhere('client.lastName ILIKE :term', { term: `%${searchTerm}%` })
      .orWhere('client.email ILIKE :term', { term: `%${searchTerm}%` })
      .orWhere('client.phone ILIKE :term', { term: `%${searchTerm}%` })
      .andWhere('client.deletedAt IS NULL')
      .orderBy('client.lastName', 'ASC')
      .limit(50)
      .getMany();
  }

  /**
   * Get complete treatment history for a client
   */
  async getTreatmentHistory(
    query: TreatmentHistoryQuery,
  ): Promise<TreatmentHistoryResult> {
    const client = await this.clientRepo.findOne({
      where: { id: query.clientId },
    });

    if (!client) {
      throw new Error(`Client with ID ${query.clientId} not found`);
    }

    // Build appointment query
    const appointmentQuery = this.appointmentRepo
      .createQueryBuilder('appointment')
      .where('appointment.clientId = :clientId', { clientId: query.clientId })
      .andWhere('appointment.status IN (:...statuses)', {
        statuses: ['COMPLETED'],
      })
      .andWhere('appointment.deletedAt IS NULL');

    if (query.startDate) {
      appointmentQuery.andWhere('appointment.startTime >= :startDate', {
        startDate: query.startDate,
      });
    }

    if (query.endDate) {
      appointmentQuery.andWhere('appointment.endTime <= :endDate', {
        endDate: query.endDate,
      });
    }

    if (query.serviceType) {
      appointmentQuery.andWhere('appointment.serviceType = :serviceType', {
        serviceType: query.serviceType,
      });
    }

    if (query.providerId) {
      appointmentQuery.andWhere('appointment.providerId = :providerId', {
        providerId: query.providerId,
      });
    }

    const appointments = await appointmentQuery
      .orderBy('appointment.startTime', 'DESC')
      .getMany();

    // Calculate favorite services
    const serviceCounts = appointments.reduce(
      (acc, apt) => {
        acc[apt.serviceType] = (acc[apt.serviceType] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const favoriteServices = Object.entries(serviceCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([service]) => service);

    // Find last visit
    const lastVisit = appointments.length > 0 ? appointments[0].startTime : null;

    // Calculate lifetime value using helper
    const lifetimeValue = client.calculateLifetimeValue();

    return {
      client,
      appointments,
      totalTreatments: appointments.length,
      favoriteServices,
      lastVisit,
      lifetimeValue,
    };
  }

  /**
   * Add consent form for client
   */
  async addConsentForm(input: AddConsentFormInput): Promise<Client> {
    const client = await this.clientRepo.findOne({
      where: { id: input.clientId },
    });

    if (!client) {
      throw new Error(`Client with ID ${input.clientId} not found`);
    }

    const consentForm: ConsentForm = {
      formId: `CONSENT-${Date.now()}`,
      formType: input.formType,
      signedAt: new Date().toISOString(),
      expiresAt: input.expiresAt?.toISOString(),
      documentUrl: input.documentUrl,
    };

    client.consentForms.push(consentForm);
    client.updatedAt = new Date();

    return await this.clientRepo.save(client);
  }

  /**
   * Check if client has valid consent for a service
   */
  async checkConsent(
    clientId: string,
    serviceType: string,
  ): Promise<{
    hasConsent: boolean;
    expiresAt?: string;
    requiresRenewal: boolean;
  }> {
    const client = await this.clientRepo.findOne({
      where: { id: clientId },
    });

    if (!client) {
      throw new Error(`Client with ID ${clientId} not found`);
    }

    const hasConsent = client.hasValidConsent(serviceType);
    const consentForm = client.consentForms.find((c) => c.formType === serviceType);

    return {
      hasConsent,
      expiresAt: consentForm?.expiresAt,
      requiresRenewal: consentForm?.expiresAt
        ? new Date(consentForm.expiresAt) < new Date()
        : false,
    };
  }

  /**
   * Update medical history
   */
  async updateMedicalHistory(
    clientId: string,
    medicalHistory: MedicalHistory,
  ): Promise<Client> {
    const client = await this.clientRepo.findOne({
      where: { id: clientId },
    });

    if (!client) {
      throw new Error(`Client with ID ${clientId} not found`);
    }

    client.medicalHistory = {
      ...medicalHistory,
      lastUpdated: new Date().toISOString(),
    };

    client.updatedAt = new Date();

    return await this.clientRepo.save(client);
  }

  /**
   * Update skin profile
   */
  async updateSkinProfile(
    clientId: string,
    skinProfile: SkinProfile,
  ): Promise<Client> {
    const client = await this.clientRepo.findOne({
      where: { id: clientId },
    });

    if (!client) {
      throw new Error(`Client with ID ${clientId} not found`);
    }

    client.skinProfile = skinProfile;
    client.updatedAt = new Date();

    return await this.clientRepo.save(client);
  }

  /**
   * Add loyalty points
   */
  async addLoyaltyPoints(
    clientId: string,
    points: number,
    reason: string,
  ): Promise<Client> {
    const client = await this.clientRepo.findOne({
      where: { id: clientId },
    });

    if (!client) {
      throw new Error(`Client with ID ${clientId} not found`);
    }

    client.loyaltyPoints = (client.loyaltyPoints || 0) + points;
    client.updatedAt = new Date();

    return await this.clientRepo.save(client);
  }

  /**
   * Add client note
   */
  async addClientNote(
    clientId: string,
    note: string,
    addedBy: string,
  ): Promise<Client> {
    const client = await this.clientRepo.findOne({
      where: { id: clientId },
    });

    if (!client) {
      throw new Error(`Client with ID ${clientId} not found`);
    }

    const timestamp = new Date().toISOString();
    const formattedNote = `[${timestamp}] ${addedBy}: ${note}`;

    client.notes = client.notes
      ? `${client.notes}\n${formattedNote}`
      : formattedNote;
    client.updatedAt = new Date();

    return await this.clientRepo.save(client);
  }

  /**
   * Get clients who need medical history updates
   */
  async getClientsNeedingMedicalUpdate(): Promise<Client[]> {
    const allClients = await this.clientRepo.find({
      where: { isActive: true },
    });

    return allClients.filter((client) => client.needsMedicalHistoryUpdate());
  }

  /**
   * Get clients at risk of churn
   */
  async getChurnRiskClients(daysSinceLastVisit: number = 90): Promise<Client[]> {
    const allClients = await this.clientRepo.find({
      where: { isActive: true },
    });

    return allClients.filter((client) =>
      client.isAtRiskOfChurn(daysSinceLastVisit),
    );
  }

  /**
   * Get top clients by lifetime value
   */
  async getTopClients(limit: number = 10): Promise<
    Array<{
      client: Client;
      lifetimeValue: number;
      totalAppointments: number;
    }>
  > {
    const clients = await this.clientRepo.find({
      where: { isActive: true },
      order: { totalSpent: 'DESC' },
      take: limit,
    });

    const clientData = await Promise.all(
      clients.map(async (client) => {
        const appointments = await this.appointmentRepo.count({
          where: {
            clientId: client.id,
            status: 'COMPLETED',
          },
        });

        return {
          client,
          lifetimeValue: client.calculateLifetimeValue(),
          totalAppointments: appointments,
        };
      }),
    );

    return clientData.sort((a, b) => b.lifetimeValue - a.lifetimeValue);
  }

  /**
   * Deactivate client (soft delete)
   */
  async deactivateClient(clientId: string, reason: string): Promise<Client> {
    const client = await this.clientRepo.findOne({
      where: { id: clientId },
    });

    if (!client) {
      throw new Error(`Client with ID ${clientId} not found`);
    }

    client.isActive = false;
    client.deletedAt = new Date();
    client.notes = client.notes
      ? `${client.notes}\n[DEACTIVATED] ${reason}`
      : `[DEACTIVATED] ${reason}`;
    client.updatedAt = new Date();

    return await this.clientRepo.save(client);
  }

  /**
   * Reactivate client
   */
  async reactivateClient(clientId: string): Promise<Client> {
    const client = await this.clientRepo.findOne({
      where: { id: clientId },
      withDeleted: true,
    });

    if (!client) {
      throw new Error(`Client with ID ${clientId} not found`);
    }

    client.isActive = true;
    client.deletedAt = null;
    client.updatedAt = new Date();

    return await this.clientRepo.save(client);
  }

  /**
   * Get client statistics
   */
  async getClientStatistics(clientId: string): Promise<{
    totalAppointments: number;
    completedAppointments: number;
    cancelledAppointments: number;
    noShowAppointments: number;
    lifetimeValue: number;
    averageSpendPerVisit: number;
    favoriteProvider: string | null;
    favoriteService: string | null;
    lastVisit: Date | null;
    nextAppointment: Date | null;
  }> {
    const client = await this.clientRepo.findOne({
      where: { id: clientId },
    });

    if (!client) {
      throw new Error(`Client with ID ${clientId} not found`);
    }

    // Get all appointments
    const allAppointments = await this.appointmentRepo.find({
      where: { clientId },
    });

    const completed = allAppointments.filter((a) => a.status === 'COMPLETED');
    const cancelled = allAppointments.filter((a) => a.status === 'CANCELLED');
    const noShow = allAppointments.filter((a) => a.status === 'NO_SHOW');

    // Calculate favorite provider
    const providerCounts = completed.reduce(
      (acc, apt) => {
        acc[apt.providerId] = (acc[apt.providerId] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
    const favoriteProvider =
      Object.entries(providerCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || null;

    // Calculate favorite service
    const serviceCounts = completed.reduce(
      (acc, apt) => {
        acc[apt.serviceType] = (acc[apt.serviceType] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
    const favoriteService =
      Object.entries(serviceCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || null;

    // Last visit
    const lastVisit = completed.length > 0 ? completed[0].startTime : null;

    // Next appointment
    const upcoming = allAppointments
      .filter(
        (a) =>
          a.status === 'SCHEDULED' &&
          a.startTime > new Date() &&
          !a.deletedAt,
      )
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    const nextAppointment = upcoming.length > 0 ? upcoming[0].startTime : null;

    const lifetimeValue = client.calculateLifetimeValue();
    const averageSpendPerVisit =
      completed.length > 0 ? lifetimeValue / completed.length : 0;

    return {
      totalAppointments: allAppointments.length,
      completedAppointments: completed.length,
      cancelledAppointments: cancelled.length,
      noShowAppointments: noShow.length,
      lifetimeValue,
      averageSpendPerVisit,
      favoriteProvider,
      favoriteService,
      lastVisit,
      nextAppointment,
    };
  }
}
