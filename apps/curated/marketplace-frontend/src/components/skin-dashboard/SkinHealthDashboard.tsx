/**
 * SkinHealthDashboard Component
 *
 * DermaLogica Intelligence MVP - Phase 4: Skin Dashboard
 *
 * Main dashboard component that combines:
 * - Skin health overview with score
 * - 17D tensor radar visualization
 * - Active concerns tracker
 * - AI-generated insights
 * - Profile management
 */

import React, { useState, useCallback } from 'react';
import { TensorRadarChart, SkinTensorCoordinates } from './TensorRadarChart';
import { InsightCard, InsightList, SkinInsight } from './InsightCard';
import { SkinProfileForm, SkinProfileFormData } from './SkinProfileForm';
import { useSkinProfile, SkinHealthProfile, SkinConcernEntry, SkinConcern } from './useSkinProfile';

export interface SkinHealthDashboardProps {
  /** User ID for the dashboard */
  userId: string;
  /** Custom class name */
  className?: string;
  /** Callback when profile is updated */
  onProfileUpdate?: (profile: SkinHealthProfile) => void;
}

/**
 * Health score display with categories
 */
function HealthScoreDisplay({
  overall,
  byCategory,
  trend,
}: {
  overall: number;
  byCategory: Record<string, number>;
  trend?: 'improving' | 'stable' | 'declining';
}) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'improving':
        return (
          <span className="flex items-center text-green-600 dark:text-green-400 text-sm">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            Improving
          </span>
        );
      case 'declining':
        return (
          <span className="flex items-center text-red-600 dark:text-red-400 text-sm">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            Needs attention
          </span>
        );
      default:
        return (
          <span className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
            </svg>
            Stable
          </span>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Skin Health Score
          </h3>
          {getTrendIcon()}
        </div>
        <div className="text-right">
          <div className={`text-4xl font-bold ${getScoreColor(overall)}`}>
            {overall}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">out of 100</div>
        </div>
      </div>

      {/* Category scores */}
      <div className="space-y-3">
        {Object.entries(byCategory).map(([category, score]) => (
          <div key={category}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400 capitalize">{category}</span>
              <span className={`font-medium ${getScoreColor(score)}`}>{score}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  score >= 80
                    ? 'bg-green-500'
                    : score >= 60
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Concern tracker component
 */
function ConcernTracker({
  concerns,
  onUpdateSeverity,
  onRemove,
}: {
  concerns: SkinConcernEntry[];
  onUpdateSeverity?: (concern: SkinConcern, severity: number) => void;
  onRemove?: (concern: SkinConcern) => void;
}) {
  const formatConcernName = (concern: SkinConcern) =>
    concern
      .split('_')
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');

  const getSeverityColor = (severity: number) => {
    if (severity >= 7) return 'bg-red-500';
    if (severity >= 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (concerns.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>No active concerns tracked</p>
        <p className="text-sm mt-1">Add concerns to track your skin health</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {concerns.map((entry) => (
        <div
          key={entry.concern}
          className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {formatConcernName(entry.concern)}
            </span>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-full text-xs text-white ${getSeverityColor(entry.severity)}`}>
                {entry.severity}/10
              </span>
              {onRemove && (
                <button
                  onClick={() => onRemove(entry.concern)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          {onUpdateSeverity && (
            <input
              type="range"
              min="1"
              max="10"
              value={entry.severity}
              onChange={(e) => onUpdateSeverity(entry.concern, parseInt(e.target.value))}
              className="w-full h-1.5 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
          )}
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>Duration: {entry.duration}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Profile summary card
 */
function ProfileSummary({
  profile,
  onEdit,
}: {
  profile: SkinHealthProfile;
  onEdit: () => void;
}) {
  const skinTypeLabels: Record<string, string> = {
    NORMAL: 'Normal',
    DRY: 'Dry',
    OILY: 'Oily',
    COMBINATION: 'Combination',
    SENSITIVE: 'Sensitive',
    MATURE: 'Mature',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Your Profile
        </h3>
        <button
          onClick={onEdit}
          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
        >
          Edit
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Skin Type
          </span>
          <p className="font-medium text-gray-900 dark:text-gray-100">
            {skinTypeLabels[profile.skinType] || profile.skinType}
          </p>
        </div>
        <div>
          <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Sensitivity
          </span>
          <p className="font-medium text-gray-900 dark:text-gray-100">
            {profile.sensitivityLevel}/10
          </p>
        </div>
        {profile.age && (
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Age
            </span>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {profile.age}
            </p>
          </div>
        )}
        {profile.fitzpatrickType && (
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Fitzpatrick
            </span>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              Type {profile.fitzpatrickType}
            </p>
          </div>
        )}
      </div>

      {/* Profile completeness */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600 dark:text-gray-400">Profile Completeness</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {profile.profileCompleteness}%
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all"
            style={{ width: `${profile.profileCompleteness}%` }}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Empty state for when no profile exists
 */
function EmptyState({ onCreateProfile }: { onCreateProfile: () => void }) {
  return (
    <div className="text-center py-16">
      <svg
        className="w-24 h-24 mx-auto mb-6 text-gray-300 dark:text-gray-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        Create Your Skin Profile
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
        Get personalized skincare recommendations by creating your skin health profile.
        It only takes a few minutes!
      </p>
      <button
        onClick={onCreateProfile}
        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Start Profile Setup
      </button>
    </div>
  );
}

/**
 * SkinHealthDashboard - Main dashboard component
 */
export function SkinHealthDashboard({
  userId,
  className = '',
  onProfileUpdate,
}: SkinHealthDashboardProps) {
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const {
    profile,
    insights,
    healthScore,
    loading,
    hasProfile,
    createProfile,
    updateProfile,
    removeConcern,
    refetch,
  } = useSkinProfile({ userId });

  /**
   * Handle profile form submission
   */
  const handleProfileSubmit = useCallback(async (data: SkinProfileFormData) => {
    try {
      if (isEditing && profile) {
        const updated = await updateProfile({
          ...data,
          userId,
        });
        onProfileUpdate?.(updated);
      } else {
        const created = await createProfile({
          ...data,
          userId,
        });
        onProfileUpdate?.(created);
      }
      setShowProfileForm(false);
      setIsEditing(false);
      await refetch();
    } catch (err) {
      console.error('Failed to save profile:', err);
    }
  }, [isEditing, profile, userId, updateProfile, createProfile, onProfileUpdate, refetch]);

  /**
   * Handle edit profile click
   */
  const handleEditProfile = useCallback(() => {
    setIsEditing(true);
    setShowProfileForm(true);
  }, []);

  /**
   * Handle cancel form
   */
  const handleCancelForm = useCallback(() => {
    setShowProfileForm(false);
    setIsEditing(false);
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className={`flex items-center justify-center py-16 ${className}`}>
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  // Profile form view
  if (showProfileForm) {
    return (
      <div className={className}>
        <SkinProfileForm
          initialData={isEditing && profile ? {
            skinType: profile.skinType,
            sensitivityLevel: profile.sensitivityLevel,
            concerns: profile.concerns,
            lifestyleFactors: profile.lifestyleFactors,
            age: profile.age ?? undefined,
            gender: profile.gender ?? undefined,
            fitzpatrickType: profile.fitzpatrickType ?? undefined,
            allergies: profile.allergies,
            avoidedIngredients: profile.avoidedIngredients,
          } : undefined}
          onSubmit={handleProfileSubmit}
          onCancel={handleCancelForm}
        />
      </div>
    );
  }

  // Empty state
  if (!hasProfile) {
    return (
      <div className={className}>
        <EmptyState onCreateProfile={() => setShowProfileForm(true)} />
      </div>
    );
  }

  // Dashboard view
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Skin Health Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track and improve your skin health
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          title="Refresh data"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Health score and profile */}
        <div className="space-y-6">
          {healthScore && (
            <HealthScoreDisplay
              overall={healthScore.overall}
              byCategory={healthScore.byCategory}
              trend={healthScore.trend}
            />
          )}
          {profile && (
            <ProfileSummary profile={profile} onEdit={handleEditProfile} />
          )}
        </div>

        {/* Center column - Tensor visualization */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Skin Profile Visualization
            </h3>
            <TensorRadarChart
              currentTensor={profile?.currentTensor as SkinTensorCoordinates}
              idealTensor={profile?.idealTensor as SkinTensorCoordinates}
              height={400}
              showIdeal={true}
              showCategoryColors={true}
            />
          </div>
        </div>
      </div>

      {/* Bottom row - Insights and concerns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Insights */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            AI Insights & Recommendations
          </h3>
          <InsightList
            insights={insights}
            limit={5}
            emptyMessage="Complete your profile to get personalized insights"
          />
        </div>

        {/* Active concerns */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Active Concerns
            </h3>
            <button
              onClick={handleEditProfile}
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Manage
            </button>
          </div>
          <ConcernTracker
            concerns={profile?.concerns || []}
            onRemove={removeConcern}
          />
        </div>
      </div>
    </div>
  );
}

export default SkinHealthDashboard;
