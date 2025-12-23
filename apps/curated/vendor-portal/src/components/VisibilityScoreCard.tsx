import {
  VisibilityScore,
  getVisibilityScoreColor,
  formatTrend,
  getTrendColor,
} from '../types/discovery';
import './VisibilityScoreCard.css';

export interface VisibilityScoreCardProps {
  score: VisibilityScore;
  loading?: boolean;
}

export function VisibilityScoreCard({ score, loading }: VisibilityScoreCardProps) {
  if (loading) {
    return <VisibilityScoreCardSkeleton />;
  }

  const scoreColor = getVisibilityScoreColor(score.overall);
  const trendColor = getTrendColor(score.trend);

  return (
    <div className="visibility-score-card">
      <div className="score-card-header">
        <h3>Visibility Score</h3>
        <div className="score-rank">
          #{score.rank} of {score.totalVendors}
        </div>
      </div>

      <div className="score-card-main">
        <div className="score-circle" style={{ borderColor: scoreColor }}>
          <div className="score-value" style={{ color: scoreColor }}>
            {score.overall}
          </div>
          <div className="score-label">out of 100</div>
        </div>

        <div className="score-trend" style={{ color: trendColor }}>
          <span className="trend-icon">{score.trend >= 0 ? '↑' : '↓'}</span>
          <span className="trend-value">{formatTrend(score.trend)}</span>
          <span className="trend-label">vs last period</span>
        </div>
      </div>

      <div className="score-components">
        <h4>Score Breakdown</h4>
        <div className="score-component-grid">
          <ScoreComponent
            label="Impressions"
            score={score.impressionScore}
            tooltip="Volume of times your products were shown"
          />
          <ScoreComponent
            label="Engagement"
            score={score.engagementScore}
            tooltip="Click-through rate on your products"
          />
          <ScoreComponent
            label="Conversion"
            score={score.conversionScore}
            tooltip="Percentage of clicks that result in orders"
          />
          <ScoreComponent
            label="Quality"
            score={score.qualityScore}
            tooltip="Alignment with spa values and certifications"
          />
        </div>
      </div>

      <div className="score-card-footer">
        <p className="score-help">
          Your visibility score determines how prominently your products appear in search results
          and recommendations.
        </p>
      </div>
    </div>
  );
}

interface ScoreComponentProps {
  label: string;
  score: number;
  tooltip: string;
}

function ScoreComponent({ label, score, tooltip }: ScoreComponentProps) {
  const color = getVisibilityScoreColor(score);

  return (
    <div className="score-component" title={tooltip}>
      <div className="component-label">{label}</div>
      <div className="component-bar-container">
        <div className="component-bar-bg">
          <div
            className="component-bar-fill"
            style={{
              width: `${score}%`,
              backgroundColor: color,
            }}
          />
        </div>
        <div className="component-score" style={{ color }}>
          {score}
        </div>
      </div>
    </div>
  );
}

function VisibilityScoreCardSkeleton() {
  return (
    <div className="visibility-score-card skeleton-card">
      <div className="score-card-header">
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-rank" />
      </div>
      <div className="score-card-main">
        <div className="skeleton skeleton-circle" />
        <div className="skeleton skeleton-trend" />
      </div>
      <div className="score-components">
        <div className="skeleton skeleton-subtitle" />
        <div className="score-component-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton skeleton-component" />
          ))}
        </div>
      </div>
    </div>
  );
}
