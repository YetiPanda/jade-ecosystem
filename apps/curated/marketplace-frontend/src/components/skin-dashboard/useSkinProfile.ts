/**
 * useSkinProfile Hook
 *
 * DermaLogica Intelligence MVP - Phase 4: Skin Dashboard
 *
 * Custom hook for managing skin health profile state including:
 * - Fetching profile data
 * - Creating/updating profiles
 * - Managing tensor coordinates
 * - Generating insights
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { gql, useQuery, useMutation, useLazyQuery } from '@apollo/client';

/**
 * Types matching backend
 */
export type SkinType = 'NORMAL' | 'DRY' | 'OILY' | 'COMBINATION' | 'SENSITIVE' | 'MATURE';

export type SkinConcern =
  | 'ACNE'
  | 'AGING'
  | 'DARK_SPOTS'
  | 'DRYNESS'
  | 'DULLNESS'
  | 'ENLARGED_PORES'
  | 'FINE_LINES'
  | 'HYPERPIGMENTATION'
  | 'OILINESS'
  | 'REDNESS'
  | 'SENSITIVITY'
  | 'TEXTURE'
  | 'WRINKLES'
  | 'DEHYDRATION'
  | 'DARK_CIRCLES'
  | 'SAGGING';

export type LifestyleFactor =
  | 'HIGH_STRESS'
  | 'POOR_SLEEP'
  | 'HIGH_SUN_EXPOSURE'
  | 'SMOKER'
  | 'HIGH_POLLUTION'
  | 'ACTIVE_LIFESTYLE'
  | 'DIET_BALANCED'
  | 'DIET_HIGH_SUGAR'
  | 'HORMONAL_CHANGES'
  | 'MEDICATIONS';

export interface SkinTensorCoordinates {
  hydrationLevel: number;
  oilProduction: number;
  barrierHealth: number;
  elasticity: number;
  pigmentation: number;
  cellTurnover: number;
  inflammationLevel: number;
  antioxidantCapacity: number;
  collagenDensity: number;
  microbiomeBalance: number;
  sensitivityIndex: number;
  poreSize: number;
  surfaceTexture: number;
  photoaging: number;
  pHBalance: number;
  circulation: number;
  environmentalProtection: number;
}

export interface SkinConcernEntry {
  concern: SkinConcern;
  severity: number;
  duration: string;
  notes?: string;
}

export interface SkinInsight {
  type: 'recommendation' | 'warning' | 'info' | 'progress';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  relatedConcerns?: SkinConcern[];
  relatedTensorDimensions?: string[];
  actionable?: boolean;
  actionText?: string;
}

export interface SkinHealthProfile {
  id: string;
  userId: string;
  skinType: SkinType;
  sensitivityLevel: number;
  currentTensor: SkinTensorCoordinates | null;
  idealTensor: SkinTensorCoordinates | null;
  concerns: SkinConcernEntry[];
  lifestyleFactors: LifestyleFactor[];
  age: number | null;
  gender: string | null;
  fitzpatrickType: number | null;
  allergies: string[];
  avoidedIngredients: string[];
  profileCompleteness: number;
  lastAssessmentDate: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SkinHealthScore {
  overall: number;
  byCategory: Record<string, number>;
  trend?: 'improving' | 'stable' | 'declining';
}

export interface TensorDimensionInfo {
  key: string;
  label: string;
  description: string;
  idealRange: { min: number; max: number };
}

/**
 * GraphQL Queries
 */
const GET_PROFILE_BY_USER = gql`
  query SkinHealthProfileByUser($userId: String!) {
    skinHealthProfileByUser(userId: $userId) {
      id
      userId
      skinType
      sensitivityLevel
      currentTensor
      idealTensor
      concerns
      lifestyleFactors
      age
      gender
      fitzpatrickType
      allergies
      avoidedIngredients
      profileCompleteness
      lastAssessmentDate
      isActive
      createdAt
      updatedAt
    }
  }
`;

const GET_INSIGHTS = gql`
  query SkinHealthInsights($profileId: String!) {
    skinHealthInsights(profileId: $profileId) {
      type
      priority
      title
      description
      relatedConcerns
      relatedTensorDimensions
      actionable
      actionText
    }
  }
`;

const GET_HEALTH_SCORE = gql`
  query SkinHealthScore($profileId: String!) {
    skinHealthScore(profileId: $profileId) {
      overall
      byCategory
      trend
    }
  }
`;

const GET_TENSOR_DIMENSIONS = gql`
  query TensorDimensions {
    tensorDimensions {
      key
      label
      description
      idealRange {
        min
        max
      }
    }
  }
`;

/**
 * GraphQL Mutations
 */
const CREATE_PROFILE = gql`
  mutation CreateSkinHealthProfile($input: CreateSkinProfileInput!) {
    createSkinHealthProfile(input: $input) {
      id
      userId
      skinType
      sensitivityLevel
      currentTensor
      idealTensor
      concerns
      lifestyleFactors
      age
      gender
      fitzpatrickType
      allergies
      avoidedIngredients
      profileCompleteness
      lastAssessmentDate
      isActive
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_PROFILE = gql`
  mutation UpdateSkinHealthProfile($profileId: String!, $input: UpdateSkinProfileInput!) {
    updateSkinHealthProfile(profileId: $profileId, input: $input) {
      id
      userId
      skinType
      sensitivityLevel
      currentTensor
      idealTensor
      concerns
      lifestyleFactors
      age
      gender
      fitzpatrickType
      allergies
      avoidedIngredients
      profileCompleteness
      lastAssessmentDate
      isActive
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_TENSOR = gql`
  mutation UpdateSkinTensor($profileId: String!, $tensor: SkinTensorCoordinatesInput!) {
    updateSkinTensor(profileId: $profileId, tensor: $tensor) {
      id
      currentTensor
      lastAssessmentDate
    }
  }
`;

const ADD_CONCERN = gql`
  mutation AddSkinConcern($profileId: String!, $concern: SkinConcernEntryInput!) {
    addSkinConcern(profileId: $profileId, concern: $concern) {
      id
      concerns
    }
  }
`;

const REMOVE_CONCERN = gql`
  mutation RemoveSkinConcern($profileId: String!, $concern: SkinConcern!) {
    removeSkinConcern(profileId: $profileId, concern: $concern) {
      id
      concerns
    }
  }
`;

/**
 * Hook options
 */
export interface UseSkinProfileOptions {
  /** User ID to fetch profile for */
  userId?: string;
  /** Whether to auto-fetch on mount */
  autoFetch?: boolean;
  /** Callback when profile is loaded */
  onProfileLoaded?: (profile: SkinHealthProfile) => void;
  /** Callback on error */
  onError?: (error: Error) => void;
}

/**
 * Hook return type
 */
export interface UseSkinProfileReturn {
  // Data
  profile: SkinHealthProfile | null;
  insights: SkinInsight[];
  healthScore: SkinHealthScore | null;
  tensorDimensions: TensorDimensionInfo[];

  // Loading states
  loading: boolean;
  loadingInsights: boolean;
  loadingScore: boolean;

  // Error states
  error: Error | null;

  // Actions
  createProfile: (data: Partial<SkinHealthProfile>) => Promise<SkinHealthProfile>;
  updateProfile: (data: Partial<SkinHealthProfile>) => Promise<SkinHealthProfile>;
  updateTensor: (tensor: SkinTensorCoordinates) => Promise<void>;
  addConcern: (concern: SkinConcernEntry) => Promise<void>;
  removeConcern: (concern: SkinConcern) => Promise<void>;
  refetch: () => Promise<void>;
  fetchInsights: () => Promise<void>;
  fetchHealthScore: () => Promise<void>;

  // Computed values
  hasProfile: boolean;
  profileCompleteness: number;
  needsUpdate: boolean;
  primaryConcerns: SkinConcernEntry[];
}

/**
 * useSkinProfile - Custom hook for skin profile management
 */
export function useSkinProfile(options: UseSkinProfileOptions = {}): UseSkinProfileReturn {
  const { userId, autoFetch = true, onProfileLoaded, onError } = options;

  // Local state
  const [insights, setInsights] = useState<SkinInsight[]>([]);
  const [healthScore, setHealthScore] = useState<SkinHealthScore | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [loadingScore, setLoadingScore] = useState(false);

  // Profile query
  const {
    data: profileData,
    loading: profileLoading,
    error: profileError,
    refetch: refetchProfile,
  } = useQuery(GET_PROFILE_BY_USER, {
    variables: { userId },
    skip: !userId || !autoFetch,
    onCompleted: (data) => {
      if (data?.skinHealthProfileByUser) {
        onProfileLoaded?.(data.skinHealthProfileByUser);
      }
    },
    onError: (error) => {
      onError?.(error);
    },
  });

  // Tensor dimensions query
  const { data: dimensionsData } = useQuery(GET_TENSOR_DIMENSIONS);

  // Lazy queries for insights and score
  const [fetchInsightsQuery] = useLazyQuery(GET_INSIGHTS);
  const [fetchScoreQuery] = useLazyQuery(GET_HEALTH_SCORE);

  // Mutations
  const [createProfileMutation] = useMutation(CREATE_PROFILE);
  const [updateProfileMutation] = useMutation(UPDATE_PROFILE);
  const [updateTensorMutation] = useMutation(UPDATE_TENSOR);
  const [addConcernMutation] = useMutation(ADD_CONCERN);
  const [removeConcernMutation] = useMutation(REMOVE_CONCERN);

  // Extract profile from query data
  const profile = profileData?.skinHealthProfileByUser || null;
  const tensorDimensions = dimensionsData?.tensorDimensions || [];

  /**
   * Fetch insights for current profile
   */
  const fetchInsights = useCallback(async () => {
    if (!profile?.id) return;

    setLoadingInsights(true);
    try {
      const { data } = await fetchInsightsQuery({
        variables: { profileId: profile.id },
      });
      setInsights(data?.skinHealthInsights || []);
    } catch (err) {
      console.error('Failed to fetch insights:', err);
    } finally {
      setLoadingInsights(false);
    }
  }, [profile?.id, fetchInsightsQuery]);

  /**
   * Fetch health score for current profile
   */
  const fetchHealthScore = useCallback(async () => {
    if (!profile?.id) return;

    setLoadingScore(true);
    try {
      const { data } = await fetchScoreQuery({
        variables: { profileId: profile.id },
      });
      setHealthScore(data?.skinHealthScore || null);
    } catch (err) {
      console.error('Failed to fetch health score:', err);
    } finally {
      setLoadingScore(false);
    }
  }, [profile?.id, fetchScoreQuery]);

  /**
   * Create a new profile
   */
  const createProfile = useCallback(async (data: Partial<SkinHealthProfile>) => {
    const { data: result } = await createProfileMutation({
      variables: {
        input: {
          userId: data.userId || userId,
          skinType: data.skinType,
          sensitivityLevel: data.sensitivityLevel,
          concerns: data.concerns,
          lifestyleFactors: data.lifestyleFactors,
          age: data.age,
          gender: data.gender,
          fitzpatrickType: data.fitzpatrickType,
          allergies: data.allergies,
          avoidedIngredients: data.avoidedIngredients,
        },
      },
    });
    return result.createSkinHealthProfile;
  }, [createProfileMutation, userId]);

  /**
   * Update existing profile
   */
  const updateProfile = useCallback(async (data: Partial<SkinHealthProfile>) => {
    if (!profile?.id) throw new Error('No profile to update');

    const { data: result } = await updateProfileMutation({
      variables: {
        profileId: profile.id,
        input: {
          skinType: data.skinType,
          sensitivityLevel: data.sensitivityLevel,
          currentTensor: data.currentTensor,
          idealTensor: data.idealTensor,
          concerns: data.concerns,
          lifestyleFactors: data.lifestyleFactors,
          age: data.age,
          gender: data.gender,
          fitzpatrickType: data.fitzpatrickType,
          allergies: data.allergies,
          avoidedIngredients: data.avoidedIngredients,
        },
      },
    });
    return result.updateSkinHealthProfile;
  }, [profile?.id, updateProfileMutation]);

  /**
   * Update tensor coordinates
   */
  const updateTensor = useCallback(async (tensor: SkinTensorCoordinates) => {
    if (!profile?.id) throw new Error('No profile to update');

    await updateTensorMutation({
      variables: {
        profileId: profile.id,
        tensor,
      },
    });

    await refetchProfile();
  }, [profile?.id, updateTensorMutation, refetchProfile]);

  /**
   * Add a concern
   */
  const addConcern = useCallback(async (concern: SkinConcernEntry) => {
    if (!profile?.id) throw new Error('No profile to update');

    await addConcernMutation({
      variables: {
        profileId: profile.id,
        concern,
      },
    });

    await refetchProfile();
  }, [profile?.id, addConcernMutation, refetchProfile]);

  /**
   * Remove a concern
   */
  const removeConcern = useCallback(async (concern: SkinConcern) => {
    if (!profile?.id) throw new Error('No profile to update');

    await removeConcernMutation({
      variables: {
        profileId: profile.id,
        concern,
      },
    });

    await refetchProfile();
  }, [profile?.id, removeConcernMutation, refetchProfile]);

  /**
   * Refetch all data
   */
  const refetch = useCallback(async () => {
    await refetchProfile();
    if (profile?.id) {
      await Promise.all([fetchInsights(), fetchHealthScore()]);
    }
  }, [refetchProfile, profile?.id, fetchInsights, fetchHealthScore]);

  // Auto-fetch insights and score when profile loads
  useEffect(() => {
    if (profile?.id) {
      fetchInsights();
      fetchHealthScore();
    }
  }, [profile?.id, fetchInsights, fetchHealthScore]);

  // Computed values
  const hasProfile = !!profile;
  const profileCompleteness = profile?.profileCompleteness || 0;

  const needsUpdate = useMemo(() => {
    if (!profile?.lastAssessmentDate) return true;
    const lastDate = new Date(profile.lastAssessmentDate);
    const daysSince = (Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysSince > 30;
  }, [profile?.lastAssessmentDate]);

  const primaryConcerns = useMemo(() => {
    if (!profile?.concerns) return [];
    return profile.concerns.filter((c) => c.severity >= 7);
  }, [profile?.concerns]);

  return {
    // Data
    profile,
    insights,
    healthScore,
    tensorDimensions,

    // Loading states
    loading: profileLoading,
    loadingInsights,
    loadingScore,

    // Error states
    error: profileError || null,

    // Actions
    createProfile,
    updateProfile,
    updateTensor,
    addConcern,
    removeConcern,
    refetch,
    fetchInsights,
    fetchHealthScore,

    // Computed values
    hasProfile,
    profileCompleteness,
    needsUpdate,
    primaryConcerns,
  };
}

export default useSkinProfile;
