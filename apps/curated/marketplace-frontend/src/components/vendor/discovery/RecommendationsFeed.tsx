/**
 * Recommendations Feed Component
 * Feature 011: Vendor Portal MVP
 * Sprint D.2: Discovery Analytics Frontend - Task D.2.6
 *
 * Displays AI-powered recommendations for improving vendor visibility:
 * - Priority-sorted recommendations (high → medium → low)
 * - Actionable cards with clear CTAs
 * - Impact estimates
 * - Direct links to optimization pages
 *
 * Recommendation types:
 * - PROFILE: Profile completeness and optimization
 * - VALUES: Values selection and positioning
 * - PRODUCTS: Catalog and product presentation
 * - CONTENT: Brand story, tagline, messaging
 * - CERTIFICATIONS: Credibility and trust signals
 */

import React from 'react';
import { AlertCircle, CheckCircle, Info, User, Award, ShoppingBag, FileText, Shield, ArrowRight, TrendingUp } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Link } from 'react-router-dom';

interface DiscoveryRecommendation {
  type: 'PROFILE' | 'VALUES' | 'PRODUCTS' | 'CONTENT' | 'CERTIFICATIONS';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  actionLabel: string;
  actionRoute: string;
  potentialImpact: string;
}

interface RecommendationsFeedProps {
  recommendations: DiscoveryRecommendation[];
}

// Type configuration with icons and colors
const TYPE_CONFIG = {
  PROFILE: { icon: User, color: 'blue', label: 'Profile' },
  VALUES: { icon: Award, color: 'amber', label: 'Values' },
  PRODUCTS: { icon: ShoppingBag, color: 'green', label: 'Products' },
  CONTENT: { icon: FileText, color: 'purple', label: 'Content' },
  CERTIFICATIONS: { icon: Shield, color: 'indigo', label: 'Certifications' },
} as const;

// Priority configuration
const PRIORITY_CONFIG = {
  HIGH: {
    icon: AlertCircle,
    label: 'High Priority',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-700',
    badgeColor: 'bg-red-100 text-red-700',
  },
  MEDIUM: {
    icon: Info,
    label: 'Medium Priority',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-700',
    badgeColor: 'bg-amber-100 text-amber-700',
  },
  LOW: {
    icon: CheckCircle,
    label: 'Low Priority',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    badgeColor: 'bg-blue-100 text-blue-700',
  },
} as const;

export function RecommendationsFeed({ recommendations }: RecommendationsFeedProps) {
  // Handle undefined or empty data
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-muted-foreground">No recommendations available</p>
        </div>
      </div>
    );
  }

  // Group recommendations by priority
  const highPriority = recommendations.filter(r => r.priority === 'HIGH');
  const mediumPriority = recommendations.filter(r => r.priority === 'MEDIUM');
  const lowPriority = recommendations.filter(r => r.priority === 'LOW');

  // Recommendation card component
  const RecommendationCard = ({ rec }: { rec: DiscoveryRecommendation }) => {
    const typeConfig = TYPE_CONFIG[rec.type];
    const priorityConfig = PRIORITY_CONFIG[rec.priority];
    const TypeIcon = typeConfig.icon;
    const PriorityIcon = priorityConfig.icon;

    return (
      <div className={cn(
        'bg-white rounded-lg border-2 p-6 transition-all hover:shadow-lg',
        priorityConfig.borderColor
      )}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1">
            {/* Type Icon */}
            <div className={cn('p-2 rounded-lg', `bg-${typeConfig.color}-100`)}>
              <TypeIcon className={cn('h-5 w-5', `text-${typeConfig.color}-600`)} />
            </div>

            {/* Title and Description */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{rec.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{rec.description}</p>
            </div>
          </div>

          {/* Priority Badge */}
          <div className="flex items-center gap-1.5">
            <span className={cn('inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium', priorityConfig.badgeColor)}>
              <PriorityIcon className="h-3.5 w-3.5" />
              {priorityConfig.label}
            </span>
          </div>
        </div>

        {/* Impact */}
        <div className={cn('rounded-lg p-3 mb-4', priorityConfig.bgColor)}>
          <div className="flex items-start gap-2">
            <TrendingUp className={cn('h-4 w-4 mt-0.5 flex-shrink-0', priorityConfig.textColor)} />
            <div>
              <div className="text-xs font-medium text-gray-700 mb-0.5">Potential Impact</div>
              <div className={cn('text-sm font-semibold', priorityConfig.textColor)}>
                {rec.potentialImpact}
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Link
          to={rec.actionRoute}
          className={cn(
            'flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg font-medium text-sm transition-colors',
            rec.priority === 'HIGH'
              ? 'bg-red-600 text-white hover:bg-red-700'
              : rec.priority === 'MEDIUM'
              ? 'bg-amber-600 text-white hover:bg-amber-700'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          )}
        >
          {rec.actionLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* High Priority Recommendations */}
      {highPriority.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <h3 className="text-lg font-semibold text-gray-900">Action Required</h3>
            <span className="text-sm text-gray-600">({highPriority.length})</span>
          </div>
          <div className="space-y-4">
            {highPriority.map((rec, index) => (
              <RecommendationCard key={index} rec={rec} />
            ))}
          </div>
        </div>
      )}

      {/* Medium Priority Recommendations */}
      {mediumPriority.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Info className="h-5 w-5 text-amber-600" />
            <h3 className="text-lg font-semibold text-gray-900">Optimization Opportunities</h3>
            <span className="text-sm text-gray-600">({mediumPriority.length})</span>
          </div>
          <div className="space-y-4">
            {mediumPriority.map((rec, index) => (
              <RecommendationCard key={index} rec={rec} />
            ))}
          </div>
        </div>
      )}

      {/* Low Priority Recommendations */}
      {lowPriority.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Nice to Have</h3>
            <span className="text-sm text-gray-600">({lowPriority.length})</span>
          </div>
          <div className="space-y-4">
            {lowPriority.map((rec, index) => (
              <RecommendationCard key={index} rec={rec} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {recommendations.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">All Set!</h3>
          <p className="text-sm text-gray-500">
            Your profile is optimized. We'll let you know if we have any new recommendations.
          </p>
        </div>
      )}

      {/* Footer Tip */}
      {recommendations.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-sm text-gray-700">
              <strong>Pro Tip:</strong> Focus on high-priority recommendations first for maximum impact. Even small improvements can significantly boost your visibility.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
