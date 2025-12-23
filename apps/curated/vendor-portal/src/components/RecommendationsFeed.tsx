import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { COMPLETE_RECOMMENDATION, DISMISS_RECOMMENDATION } from '../graphql/discovery.queries';
import {
  DiscoveryRecommendation,
  RECOMMENDATION_PRIORITY_COLORS,
  RECOMMENDATION_EFFORT_LABELS,
} from '../types/discovery';
import './RecommendationsFeed.css';

export interface RecommendationsFeedProps {
  recommendations: DiscoveryRecommendation[];
  onUpdate?: () => void;
  loading?: boolean;
}

export function RecommendationsFeed({
  recommendations,
  onUpdate,
  loading,
}: RecommendationsFeedProps) {
  if (loading) {
    return <RecommendationsFeedSkeleton />;
  }

  const activeRecommendations = recommendations.filter((r) => !r.completedAt);

  if (activeRecommendations.length === 0) {
    return (
      <div className="recommendations-feed">
        <div className="feed-header">
          <h3>Recommendations</h3>
        </div>
        <div className="recommendations-empty">
          <div className="empty-icon">✨</div>
          <p>Great job! No recommendations at this time.</p>
          <p className="empty-subtitle">Keep up the good work maintaining your visibility score.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recommendations-feed">
      <div className="feed-header">
        <h3>Recommendations</h3>
        <div className="recommendations-count">{activeRecommendations.length} active</div>
      </div>

      <div className="recommendations-list">
        {activeRecommendations.map((recommendation) => (
          <RecommendationCard
            key={recommendation.id}
            recommendation={recommendation}
            onUpdate={onUpdate}
          />
        ))}
      </div>
    </div>
  );
}

interface RecommendationCardProps {
  recommendation: DiscoveryRecommendation;
  onUpdate?: () => void;
}

function RecommendationCard({ recommendation, onUpdate }: RecommendationCardProps) {
  const [expanded, setExpanded] = useState(false);

  const [completeRecommendation, { loading: completing }] = useMutation(COMPLETE_RECOMMENDATION, {
    onCompleted: () => onUpdate?.(),
  });

  const [dismissRecommendation, { loading: dismissing }] = useMutation(DISMISS_RECOMMENDATION, {
    onCompleted: () => onUpdate?.(),
  });

  const handleComplete = () => {
    completeRecommendation({
      variables: { recommendationId: recommendation.id },
    });
  };

  const handleDismiss = () => {
    if (confirm('Are you sure you want to dismiss this recommendation?')) {
      dismissRecommendation({
        variables: { recommendationId: recommendation.id },
      });
    }
  };

  const priorityColor = RECOMMENDATION_PRIORITY_COLORS[recommendation.priority];
  const effortLabel = RECOMMENDATION_EFFORT_LABELS[recommendation.effort];

  return (
    <div
      className={`recommendation-card ${expanded ? 'expanded' : ''}`}
      data-priority={recommendation.priority}
    >
      <div className="card-header" onClick={() => setExpanded(!expanded)}>
        <div className="card-header-left">
          <div className="priority-indicator" style={{ backgroundColor: priorityColor }} />
          <div className="card-title">{recommendation.title}</div>
        </div>
        <div className="card-header-right">
          <div className="effort-badge" data-effort={recommendation.effort}>
            {effortLabel}
          </div>
          <button className="expand-btn" type="button">
            {expanded ? '−' : '+'}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="card-content">
          <div className="card-description">{recommendation.description}</div>

          <div className="card-impact">
            <div className="impact-label">Expected Impact:</div>
            <div className="impact-value">{recommendation.impact}</div>
          </div>

          <div className="card-actions">
            <button
              className="complete-btn"
              onClick={handleComplete}
              disabled={completing || dismissing}
            >
              {completing ? 'Marking...' : '✓ Mark as Done'}
            </button>
            <button
              className="dismiss-btn"
              onClick={handleDismiss}
              disabled={completing || dismissing}
            >
              {dismissing ? 'Dismissing...' : '✕ Dismiss'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function RecommendationsFeedSkeleton() {
  return (
    <div className="recommendations-feed skeleton-feed">
      <div className="feed-header">
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-count" />
      </div>
      <div className="recommendations-list">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton skeleton-card" />
        ))}
      </div>
    </div>
  );
}
