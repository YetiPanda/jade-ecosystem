/**
 * RiskAssessmentCard - Displays automated risk assessment for applications
 * Sprint E.2 - Admin Tools
 */

import {
  RiskAssessment,
  getRiskLevelColor,
  getRiskCategoryLabel,
} from '../types/admin';
import './RiskAssessmentCard.css';

interface RiskAssessmentCardProps {
  assessment: RiskAssessment;
}

export function RiskAssessmentCard({ assessment }: RiskAssessmentCardProps) {
  const riskColor = getRiskLevelColor(assessment.riskLevel);

  const factorsByCategory = assessment.factors.reduce((acc, factor) => {
    if (!acc[factor.category]) {
      acc[factor.category] = [];
    }
    acc[factor.category].push(factor);
    return acc;
  }, {} as Record<string, typeof assessment.factors>);

  return (
    <div className="risk-assessment-card">
      {/* Header */}
      <div className="risk-header">
        <h3>Risk Assessment</h3>
        <div className="assessed-time">
          Assessed {new Date(assessment.assessedAt).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
          })}
        </div>
      </div>

      {/* Overall Score */}
      <div className="risk-score-section">
        <div className="score-circle" style={{ borderColor: riskColor }}>
          <div className="score-value" style={{ color: riskColor }}>
            {assessment.overallScore}
          </div>
          <div className="score-label">Risk Score</div>
        </div>
        <div className="score-details">
          <div className="risk-level-badge" style={{ backgroundColor: riskColor }}>
            {assessment.riskLevel.toUpperCase()} RISK
          </div>
          <div className="factors-count">
            {assessment.factors.length} {assessment.factors.length === 1 ? 'factor' : 'factors'} identified
          </div>
        </div>
      </div>

      {/* Risk Factors by Category */}
      {Object.keys(factorsByCategory).length > 0 && (
        <div className="risk-factors-section">
          <h4>Risk Factors</h4>
          {Object.entries(factorsByCategory).map(([category, factors]) => (
            <div key={category} className="category-section">
              <div className="category-header">
                {getRiskCategoryLabel(category as any)}
              </div>
              <div className="factors-list">
                {factors.map((factor, index) => (
                  <div key={index} className="risk-factor">
                    <div className="factor-header">
                      <div
                        className="severity-badge"
                        data-severity={factor.severity}
                      >
                        {factor.severity.toUpperCase()}
                      </div>
                      <div className="factor-score">+{factor.score}</div>
                    </div>
                    <div className="factor-name">{factor.factor}</div>
                    <div className="factor-description">{factor.description}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recommendations */}
      {assessment.recommendations.length > 0 && (
        <div className="recommendations-section">
          <h4>Recommendations</h4>
          <ul className="recommendations-list">
            {assessment.recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      )}

      {/* No Risk Factors */}
      {assessment.factors.length === 0 && (
        <div className="no-risk-message">
          <div className="no-risk-icon">✓</div>
          <p>No significant risk factors identified</p>
          <p className="no-risk-subtitle">This application appears to be low risk</p>
        </div>
      )}
    </div>
  );
}
