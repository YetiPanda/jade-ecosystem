/**
 * ClientResolver - Client Profile & Treatment History
 * Phase 4: User Story 2 - Appointment Scheduling & Client Management
 * Task: T114
 *
 * Purpose: GraphQL resolvers for client management and treatment history
 */

import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { ClientService } from '../services/client.service';

/**
 * Query Arguments
 */
interface GetClientArgs {
  id: string;
}

interface TreatmentHistoryArgs {
  clientId: string;
  startDate?: Date;
  endDate?: Date;
  serviceType?: string;
  providerId?: string;
}

interface SearchClientsArgs {
  searchTerm: string;
}

interface GetClientStatisticsArgs {
  clientId: string;
}

/**
 * Mutation Arguments
 */
interface CreateClientArgs {
  input: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth?: Date;
    skinProfile?: {
      skinType: 'DRY' | 'OILY' | 'COMBINATION' | 'SENSITIVE' | 'NORMAL';
      concerns: string[];
      allergies: string[];
      sensitivities: string[];
    };
    medicalHistory?: {
      medications: string[];
      conditions: string[];
      allergies: string[];
      contraindications: string[];
    };
  };
}

interface UpdateClientArgs {
  input: {
    clientId: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };
}

interface AddConsentArgs {
  input: {
    clientId: string;
    formType: string;
    documentUrl: string;
    expiresAt?: Date;
  };
}

interface UpdateMedicalHistoryArgs {
  input: {
    clientId: string;
    medications: string[];
    conditions: string[];
    allergies: string[];
    contraindications: string[];
  };
}

interface UpdateSkinProfileArgs {
  input: {
    clientId: string;
    skinType: 'DRY' | 'OILY' | 'COMBINATION' | 'SENSITIVE' | 'NORMAL';
    concerns: string[];
    allergies: string[];
    sensitivities: string[];
    currentProducts?: string[];
    previousTreatments?: string[];
  };
}

interface AddClientNoteArgs {
  clientId: string;
  note: string;
  addedBy: string;
}

@Resolver()
export class ClientResolver {
  constructor(private readonly clientService: ClientService) {}

  /**
   * Query: clientTreatmentHistory
   *
   * Get complete treatment history for a client with analytics
   *
   * Example query:
   * ```graphql
   * query {
   *   clientTreatmentHistory(
   *     clientId: "client-123"
   *     startDate: "2024-01-01T00:00:00Z"
   *     endDate: "2025-12-31T23:59:59Z"
   *     serviceType: "FACIAL"
   *   ) {
   *     client {
   *       id
   *       firstName
   *       lastName
   *       email
   *       skinProfile {
   *         skinType
   *         concerns
   *         allergies
   *       }
   *     }
   *     appointments {
   *       id
   *       appointmentNumber
   *       serviceType
   *       startTime
   *       endTime
   *       status
   *       productsUsed {
   *         productName
   *         amountUsed
   *       }
   *       treatmentOutcome {
   *         skinConditionBefore
   *         skinConditionAfter
   *         clientSatisfactionRating
   *       }
   *     }
   *     totalTreatments
   *     favoriteServices
   *     lastVisit
   *     lifetimeValue
   *   }
   * }
   * ```
   */
  @Query('clientTreatmentHistory')
  async clientTreatmentHistory(
    @Args() args: TreatmentHistoryArgs,
  ): Promise<{
    client: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      skinProfile?: {
        skinType: string;
        concerns: string[];
        allergies: string[];
        sensitivities: string[];
      };
      medicalHistory?: {
        medications: string[];
        conditions: string[];
        allergies: string[];
        contraindications: string[];
      };
    };
    appointments: Array<{
      id: string;
      appointmentNumber: string;
      serviceType: string;
      startTime: Date;
      endTime: Date;
      status: string;
      productsUsed: Array<{
        productId: string;
        productName: string;
        amountUsed?: string;
      }>;
      treatmentOutcome?: {
        skinConditionBefore: string;
        skinConditionAfter: string;
        productsRecommended: string[];
        homeCarePlan: string;
        clientSatisfactionRating?: number;
      };
    }>;
    totalTreatments: number;
    favoriteServices: string[];
    lastVisit: Date | null;
    lifetimeValue: number;
  }> {
    const history = await this.clientService.getTreatmentHistory({
      clientId: args.clientId,
      startDate: args.startDate,
      endDate: args.endDate,
      serviceType: args.serviceType,
      providerId: args.providerId,
    });

    return {
      client: {
        id: history.client.id,
        firstName: history.client.firstName,
        lastName: history.client.lastName,
        email: history.client.email,
        phone: history.client.phone,
        skinProfile: history.client.skinProfile || undefined,
        medicalHistory: history.client.medicalHistory || undefined,
      },
      appointments: history.appointments.map((apt) => ({
        id: apt.id,
        appointmentNumber: apt.appointmentNumber,
        serviceType: apt.serviceType,
        startTime: apt.startTime,
        endTime: apt.endTime,
        status: apt.status,
        productsUsed: apt.productsUsed.map((p) => ({
          productId: p.productId,
          productName: p.productName,
          amountUsed: p.amountUsed,
        })),
        treatmentOutcome: apt.treatmentOutcome || undefined,
      })),
      totalTreatments: history.totalTreatments,
      favoriteServices: history.favoriteServices,
      lastVisit: history.lastVisit,
      lifetimeValue: history.lifetimeValue,
    };
  }

  /**
   * Query: client
   *
   * Get single client by ID
   *
   * Example query:
   * ```graphql
   * query {
   *   client(id: "client-123") {
   *     id
   *     firstName
   *     lastName
   *     email
   *     phone
   *     skinProfile {
   *       skinType
   *       concerns
   *     }
   *     consentForms {
   *       formType
   *       signedAt
   *       expiresAt
   *     }
   *     loyaltyPoints
   *     totalSpent
   *   }
   * }
   * ```
   */
  @Query('client')
  async client(@Args() args: GetClientArgs) {
    const client = await this.clientService.getClient(args.id);

    if (!client) {
      return null;
    }

    return {
      id: client.id,
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      phone: client.phone,
      dateOfBirth: client.dateOfBirth,
      skinProfile: client.skinProfile || undefined,
      medicalHistory: client.medicalHistory || undefined,
      preferences: client.preferences,
      consentForms: client.consentForms,
      emergencyContact: client.emergencyContact || undefined,
      tags: client.tags,
      loyaltyPoints: client.loyaltyPoints,
      totalSpent: client.totalSpent,
      notes: client.notes,
      isActive: client.isActive,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };
  }

  /**
   * Query: searchClients
   *
   * Search clients by name, email, or phone
   *
   * Example query:
   * ```graphql
   * query {
   *   searchClients(searchTerm: "smith") {
   *     id
   *     firstName
   *     lastName
   *     email
   *     phone
   *   }
   * }
   * ```
   */
  @Query('searchClients')
  async searchClients(@Args() args: SearchClientsArgs) {
    const clients = await this.clientService.searchClients(args.searchTerm);

    return clients.map((client) => ({
      id: client.id,
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      phone: client.phone,
      lastVisit: null, // Would be calculated if needed
    }));
  }

  /**
   * Query: clientStatistics
   *
   * Get comprehensive statistics for a client
   *
   * Example query:
   * ```graphql
   * query {
   *   clientStatistics(clientId: "client-123") {
   *     totalAppointments
   *     completedAppointments
   *     cancelledAppointments
   *     noShowAppointments
   *     lifetimeValue
   *     averageSpendPerVisit
   *     favoriteProvider
   *     favoriteService
   *     lastVisit
   *     nextAppointment
   *   }
   * }
   * ```
   */
  @Query('clientStatistics')
  async clientStatistics(@Args() args: GetClientStatisticsArgs) {
    const stats = await this.clientService.getClientStatistics(args.clientId);
    return stats;
  }

  /**
   * Mutation: createClient
   *
   * Create a new client profile
   *
   * Example mutation:
   * ```graphql
   * mutation {
   *   createClient(input: {
   *     firstName: "Jane"
   *     lastName: "Smith"
   *     email: "jane@example.com"
   *     phone: "+1-555-0123"
   *     skinProfile: {
   *       skinType: COMBINATION
   *       concerns: ["acne", "dark_spots"]
   *       allergies: ["fragrance"]
   *       sensitivities: ["retinol"]
   *     }
   *   }) {
   *     id
   *     firstName
   *     lastName
   *     email
   *   }
   * }
   * ```
   */
  @Mutation('createClient')
  async createClient(@Args() args: CreateClientArgs) {
    const client = await this.clientService.createClient({
      firstName: args.input.firstName,
      lastName: args.input.lastName,
      email: args.input.email,
      phone: args.input.phone,
      dateOfBirth: args.input.dateOfBirth,
      skinProfile: args.input.skinProfile,
      medicalHistory: args.input.medicalHistory,
    });

    return {
      id: client.id,
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      phone: client.phone,
      skinProfile: client.skinProfile || undefined,
      medicalHistory: client.medicalHistory || undefined,
      consentForms: client.consentForms,
      loyaltyPoints: client.loyaltyPoints,
      totalSpent: client.totalSpent,
      isActive: client.isActive,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };
  }

  /**
   * Mutation: updateClient
   *
   * Update client basic information
   *
   * Example mutation:
   * ```graphql
   * mutation {
   *   updateClient(input: {
   *     clientId: "client-123"
   *     firstName: "Jane"
   *     lastName: "Doe"
   *     phone: "+1-555-9999"
   *   }) {
   *     id
   *     firstName
   *     lastName
   *     phone
   *   }
   * }
   * ```
   */
  @Mutation('updateClient')
  async updateClient(@Args() args: UpdateClientArgs) {
    const client = await this.clientService.updateClient(args.input);

    return {
      id: client.id,
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      phone: client.phone,
      updatedAt: client.updatedAt,
    };
  }

  /**
   * Mutation: addClientConsent
   *
   * Add a consent form for client
   *
   * Example mutation:
   * ```graphql
   * mutation {
   *   addClientConsent(input: {
   *     clientId: "client-123"
   *     formType: "FACIAL"
   *     documentUrl: "https://cdn.example.com/consent-facial-123.pdf"
   *     expiresAt: "2026-10-20T00:00:00Z"
   *   }) {
   *     id
   *     consentForms {
   *       formType
   *       signedAt
   *       expiresAt
   *       documentUrl
   *     }
   *   }
   * }
   * ```
   */
  @Mutation('addClientConsent')
  async addClientConsent(@Args() args: AddConsentArgs) {
    const client = await this.clientService.addConsentForm({
      clientId: args.input.clientId,
      formType: args.input.formType,
      documentUrl: args.input.documentUrl,
      expiresAt: args.input.expiresAt,
    });

    return {
      id: client.id,
      consentForms: client.consentForms,
      updatedAt: client.updatedAt,
    };
  }

  /**
   * Mutation: updateClientMedicalHistory
   *
   * Update client medical history
   *
   * Example mutation:
   * ```graphql
   * mutation {
   *   updateClientMedicalHistory(input: {
   *     clientId: "client-123"
   *     medications: ["aspirin", "vitamin-d"]
   *     conditions: ["asthma"]
   *     allergies: ["peanuts"]
   *     contraindications: ["pregnancy"]
   *   }) {
   *     id
   *     medicalHistory {
   *       medications
   *       conditions
   *       allergies
   *       contraindications
   *       lastUpdated
   *     }
   *   }
   * }
   * ```
   */
  @Mutation('updateClientMedicalHistory')
  async updateClientMedicalHistory(@Args() args: UpdateMedicalHistoryArgs) {
    const client = await this.clientService.updateMedicalHistory(
      args.input.clientId,
      {
        medications: args.input.medications,
        conditions: args.input.conditions,
        allergies: args.input.allergies,
        contraindications: args.input.contraindications,
        lastUpdated: new Date().toISOString(),
      },
    );

    return {
      id: client.id,
      medicalHistory: client.medicalHistory,
      updatedAt: client.updatedAt,
    };
  }

  /**
   * Mutation: updateClientSkinProfile
   *
   * Update client skin profile
   *
   * Example mutation:
   * ```graphql
   * mutation {
   *   updateClientSkinProfile(input: {
   *     clientId: "client-123"
   *     skinType: COMBINATION
   *     concerns: ["acne", "dark_spots", "fine_lines"]
   *     allergies: ["fragrance", "parabens"]
   *     sensitivities: ["retinol"]
   *     currentProducts: ["cleanser-001", "moisturizer-002"]
   *   }) {
   *     id
   *     skinProfile {
   *       skinType
   *       concerns
   *       allergies
   *       sensitivities
   *     }
   *   }
   * }
   * ```
   */
  @Mutation('updateClientSkinProfile')
  async updateClientSkinProfile(@Args() args: UpdateSkinProfileArgs) {
    const client = await this.clientService.updateSkinProfile(
      args.input.clientId,
      {
        skinType: args.input.skinType,
        concerns: args.input.concerns,
        allergies: args.input.allergies,
        sensitivities: args.input.sensitivities,
        currentProducts: args.input.currentProducts,
        previousTreatments: args.input.previousTreatments,
      },
    );

    return {
      id: client.id,
      skinProfile: client.skinProfile,
      updatedAt: client.updatedAt,
    };
  }

  /**
   * Mutation: addClientNote
   *
   * Add a note to client record
   *
   * Example mutation:
   * ```graphql
   * mutation {
   *   addClientNote(
   *     clientId: "client-123"
   *     note: "Client prefers morning appointments"
   *     addedBy: "provider-456"
   *   ) {
   *     id
   *     notes
   *     updatedAt
   *   }
   * }
   * ```
   */
  @Mutation('addClientNote')
  async addClientNote(@Args() args: AddClientNoteArgs) {
    const client = await this.clientService.addClientNote(
      args.clientId,
      args.note,
      args.addedBy,
    );

    return {
      id: client.id,
      notes: client.notes,
      updatedAt: client.updatedAt,
    };
  }

  /**
   * Query: topClients
   *
   * Get top clients by lifetime value
   *
   * Example query:
   * ```graphql
   * query {
   *   topClients(limit: 10) {
   *     client {
   *       id
   *       firstName
   *       lastName
   *       email
   *     }
   *     lifetimeValue
   *     totalAppointments
   *   }
   * }
   * ```
   */
  @Query('topClients')
  async topClients(@Args('limit') limit?: number) {
    const topClients = await this.clientService.getTopClients(limit || 10);

    return topClients.map((item) => ({
      client: {
        id: item.client.id,
        firstName: item.client.firstName,
        lastName: item.client.lastName,
        email: item.client.email,
        totalSpent: item.client.totalSpent,
      },
      lifetimeValue: item.lifetimeValue,
      totalAppointments: item.totalAppointments,
    }));
  }
}
