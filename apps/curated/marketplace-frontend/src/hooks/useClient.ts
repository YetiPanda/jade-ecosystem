/**
 * Custom hooks for client management
 * Task: T125 - Create custom hooks for client data
 */

import { useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';

// Queries
const GET_CLIENT = gql`
  query GetClient($id: ID!) {
    client(id: $id) {
      id
      firstName
      lastName
      email
      phone
      dateOfBirth
      skinProfile {
        skinType
        concerns
        allergies
        sensitivities
        currentProducts
        previousTreatments
      }
      medicalHistory {
        medications
        conditions
        allergies
        contraindications
        lastUpdated
      }
      preferences {
        communicationMethod
        reminderSettings {
          enabled
          daysBeforeAppointment
          method
        }
        marketingOptIn
        preferredProviders
        preferredTimes
      }
      consentForms {
        formId
        formType
        signedAt
        expiresAt
        documentUrl
      }
      emergencyContact {
        name
        relationship
        phone
      }
      tags
      loyaltyPoints
      totalSpent
      notes
      isActive
      createdAt
      updatedAt
    }
  }
`;

const CLIENT_TREATMENT_HISTORY = gql`
  query ClientTreatmentHistory(
    $clientId: ID!
    $startDate: DateTime
    $endDate: DateTime
    $serviceType: String
    $providerId: ID
  ) {
    clientTreatmentHistory(
      clientId: $clientId
      startDate: $startDate
      endDate: $endDate
      serviceType: $serviceType
      providerId: $providerId
    ) {
      client {
        id
        firstName
        lastName
        email
        phone
        skinProfile {
          skinType
          concerns
          allergies
          sensitivities
        }
        medicalHistory {
          medications
          conditions
          allergies
          contraindications
          lastUpdated
        }
      }
      appointments {
        id
        appointmentNumber
        serviceType
        startTime
        endTime
        status
        productsUsed {
          productId
          productName
          amountUsed
        }
        treatmentOutcome {
          skinConditionBefore
          skinConditionAfter
          productsRecommended
          homeCarePlan
          clientSatisfactionRating
          photos {
            url
            type
            takenAt
            notes
          }
        }
      }
      totalTreatments
      favoriteServices
      lastVisit
      lifetimeValue
    }
  }
`;

const CLIENT_STATISTICS = gql`
  query ClientStatistics($clientId: ID!) {
    clientStatistics(clientId: $clientId) {
      totalAppointments
      completedAppointments
      cancelledAppointments
      noShowAppointments
      lifetimeValue
      averageSpendPerVisit
      favoriteProvider
      favoriteService
      lastVisit
      nextAppointment
    }
  }
`;

const SEARCH_CLIENTS = gql`
  query SearchClients($searchTerm: String!) {
    searchClients(searchTerm: $searchTerm) {
      id
      firstName
      lastName
      email
      phone
      lastVisit
      totalSpent
    }
  }
`;

// Mutations
const CREATE_CLIENT = gql`
  mutation CreateClient($input: CreateClientInput!) {
    createClient(input: $input) {
      id
      firstName
      lastName
      email
      phone
      skinProfile {
        skinType
        concerns
        allergies
        sensitivities
      }
      medicalHistory {
        medications
        conditions
        allergies
        contraindications
      }
      consentForms {
        formType
        signedAt
        expiresAt
      }
      loyaltyPoints
      totalSpent
      isActive
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_CLIENT = gql`
  mutation UpdateClient($input: UpdateClientInput!) {
    updateClient(input: $input) {
      id
      firstName
      lastName
      email
      phone
      updatedAt
    }
  }
`;

const ADD_CLIENT_CONSENT = gql`
  mutation AddClientConsent($input: AddConsentInput!) {
    addClientConsent(input: $input) {
      id
      consentForms {
        formId
        formType
        signedAt
        expiresAt
        documentUrl
      }
      updatedAt
    }
  }
`;

const UPDATE_CLIENT_MEDICAL_HISTORY = gql`
  mutation UpdateClientMedicalHistory($input: UpdateMedicalHistoryInput!) {
    updateClientMedicalHistory(input: $input) {
      id
      medicalHistory {
        medications
        conditions
        allergies
        contraindications
        lastUpdated
      }
      updatedAt
    }
  }
`;

const UPDATE_CLIENT_SKIN_PROFILE = gql`
  mutation UpdateClientSkinProfile($input: UpdateSkinProfileInput!) {
    updateClientSkinProfile(input: $input) {
      id
      skinProfile {
        skinType
        concerns
        allergies
        sensitivities
        currentProducts
        previousTreatments
      }
      updatedAt
    }
  }
`;

/**
 * Hook for fetching a single client
 */
export function useClient(clientId: string | null) {
  const { data, loading, error, refetch } = useQuery(GET_CLIENT, {
    variables: { id: clientId },
    skip: !clientId,
    fetchPolicy: 'cache-and-network',
  });

  return {
    client: data?.client,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook for client treatment history
 */
export function useClientTreatmentHistory(
  clientId: string | null,
  filters?: {
    startDate?: Date;
    endDate?: Date;
    serviceType?: string;
    providerId?: string;
  }
) {
  const { data, loading, error, refetch } = useQuery(CLIENT_TREATMENT_HISTORY, {
    variables: {
      clientId,
      startDate: filters?.startDate?.toISOString(),
      endDate: filters?.endDate?.toISOString(),
      serviceType: filters?.serviceType,
      providerId: filters?.providerId,
    },
    skip: !clientId,
    fetchPolicy: 'cache-and-network',
  });

  const history = data?.clientTreatmentHistory;

  return {
    client: history?.client,
    appointments: history?.appointments || [],
    totalTreatments: history?.totalTreatments || 0,
    favoriteServices: history?.favoriteServices || [],
    lastVisit: history?.lastVisit,
    lifetimeValue: history?.lifetimeValue || 0,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook for client statistics
 */
export function useClientStatistics(clientId: string | null) {
  const { data, loading, error, refetch } = useQuery(CLIENT_STATISTICS, {
    variables: { clientId },
    skip: !clientId,
    fetchPolicy: 'cache-and-network',
  });

  return {
    statistics: data?.clientStatistics,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook for searching clients
 */
export function useClientSearch(searchTerm: string) {
  const { data, loading, error, refetch } = useQuery(SEARCH_CLIENTS, {
    variables: { searchTerm },
    skip: !searchTerm || searchTerm.length < 2,
    fetchPolicy: 'cache-and-network',
  });

  return {
    clients: data?.searchClients || [],
    loading,
    error,
    refetch,
  };
}

/**
 * Hook for client management operations
 */
export function useClientManagement() {
  const [createClientMutation, { loading: creating }] = useMutation(CREATE_CLIENT);
  const [updateClientMutation, { loading: updating }] = useMutation(UPDATE_CLIENT);
  const [addConsentMutation, { loading: addingConsent }] = useMutation(ADD_CLIENT_CONSENT);
  const [updateMedicalHistoryMutation, { loading: updatingMedical }] = useMutation(UPDATE_CLIENT_MEDICAL_HISTORY);
  const [updateSkinProfileMutation, { loading: updatingSkin }] = useMutation(UPDATE_CLIENT_SKIN_PROFILE);

  /**
   * Create a new client
   */
  const createClient = useCallback(
    async (input: any) => {
      try {
        const result = await createClientMutation({
          variables: { input },
        });

        return {
          success: true,
          client: result.data?.createClient,
        };
      } catch (err: any) {
        return {
          success: false,
          error: err.message,
        };
      }
    },
    [createClientMutation]
  );

  /**
   * Update client basic info
   */
  const updateClient = useCallback(
    async (input: any) => {
      try {
        const result = await updateClientMutation({
          variables: { input },
        });

        return {
          success: true,
          client: result.data?.updateClient,
        };
      } catch (err: any) {
        return {
          success: false,
          error: err.message,
        };
      }
    },
    [updateClientMutation]
  );

  /**
   * Add consent form
   */
  const addConsent = useCallback(
    async (input: any) => {
      try {
        const result = await addConsentMutation({
          variables: { input },
        });

        return {
          success: true,
          client: result.data?.addClientConsent,
        };
      } catch (err: any) {
        return {
          success: false,
          error: err.message,
        };
      }
    },
    [addConsentMutation]
  );

  /**
   * Update medical history
   */
  const updateMedicalHistory = useCallback(
    async (input: any) => {
      try {
        const result = await updateMedicalHistoryMutation({
          variables: { input },
        });

        return {
          success: true,
          client: result.data?.updateClientMedicalHistory,
        };
      } catch (err: any) {
        return {
          success: false,
          error: err.message,
        };
      }
    },
    [updateMedicalHistoryMutation]
  );

  /**
   * Update skin profile
   */
  const updateSkinProfile = useCallback(
    async (input: any) => {
      try {
        const result = await updateSkinProfileMutation({
          variables: { input },
        });

        return {
          success: true,
          client: result.data?.updateClientSkinProfile,
        };
      } catch (err: any) {
        return {
          success: false,
          error: err.message,
        };
      }
    },
    [updateSkinProfileMutation]
  );

  return {
    createClient,
    updateClient,
    addConsent,
    updateMedicalHistory,
    updateSkinProfile,
    loading: creating || updating || addingConsent || updatingMedical || updatingSkin,
    creating,
    updating,
    addingConsent,
    updatingMedical,
    updatingSkin,
  };
}
