import {
  SearchQuery,
  OptimizationOpportunity,
  formatRate,
  formatPosition,
  getTrendColor,
  formatTrend,
  getOpportunityColor,
  getDifficultyColor,
  OPTIMIZATION_OPPORTUNITY_LABELS,
} from '../types/discovery';
import { formatCurrency } from '../types/dashboard';
import './SearchAnalyticsSection.css';

export interface SearchAnalyticsSectionProps {
  queries: SearchQuery[];
  opportunities: OptimizationOpportunity[];
  loading?: boolean;
}

export function SearchAnalyticsSection({
  queries,
  opportunities,
  loading,
}: SearchAnalyticsSectionProps) {
  if (loading) {
    return <SearchAnalyticsSectionSkeleton />;
  }

  return (
    <div className="search-analytics-section">
      {/* Top Queries Table */}
      <div className="search-queries-table-container">
        <div className="table-header">
          <h3>Top Search Queries</h3>
          <div className="queries-count">{queries.length} queries</div>
        </div>

        <div className="table-wrapper">
          <table className="search-queries-table">
            <thead>
              <tr>
                <th className="col-query">Query</th>
                <th className="col-impressions">Impressions</th>
                <th className="col-clicks">Clicks</th>
                <th className="col-ctr">CTR</th>
                <th className="col-orders">Orders</th>
                <th className="col-revenue">Revenue</th>
                <th className="col-position">Avg Position</th>
                <th className="col-trend">Trend</th>
              </tr>
            </thead>
            <tbody>
              {queries.map((query) => (
                <tr key={query.query} className="query-row">
                  <td className="col-query">
                    <div className="query-text">{query.query}</div>
                  </td>
                  <td className="col-impressions">
                    <div className="metric-value">{query.impressions.toLocaleString()}</div>
                  </td>
                  <td className="col-clicks">
                    <div className="metric-value">{query.clicks.toLocaleString()}</div>
                  </td>
                  <td className="col-ctr">
                    <div className="ctr-badge" data-level={getCTRLevel(query.clickThroughRate)}>
                      {formatRate(query.clickThroughRate)}
                    </div>
                  </td>
                  <td className="col-orders">
                    <div className="metric-value">{query.orders.toLocaleString()}</div>
                  </td>
                  <td className="col-revenue">
                    <div className="revenue-value">{formatCurrency(query.revenue)}</div>
                  </td>
                  <td className="col-position">
                    <div className="position-value">{formatPosition(query.averagePosition)}</div>
                  </td>
                  <td className="col-trend">
                    <div className="trend-value" style={{ color: getTrendColor(query.trend) }}>
                      {query.trend >= 0 ? '↑' : '↓'} {formatTrend(query.trend)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Optimization Opportunities */}
      <div className="optimization-opportunities-container">
        <div className="opportunities-header">
          <h3>Optimization Opportunities</h3>
          <div className="opportunities-count">{opportunities.length} opportunities</div>
        </div>

        <div className="opportunities-grid">
          {opportunities.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))}
        </div>

        {opportunities.length === 0 && (
          <div className="opportunities-empty">
            <p>No optimization opportunities identified at this time.</p>
            <p className="empty-subtitle">
              Your search performance is well-optimized. Keep monitoring for new opportunities.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function getCTRLevel(ctr: number): string {
  if (ctr >= 5) return 'high';
  if (ctr >= 2) return 'medium';
  return 'low';
}

interface OpportunityCardProps {
  opportunity: OptimizationOpportunity;
}

function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const typeColor = getOpportunityColor(opportunity.type);
  const difficultyColor = getDifficultyColor(opportunity.difficulty);

  return (
    <div className="opportunity-card">
      <div className="opportunity-header">
        <div className="opportunity-type" style={{ borderColor: typeColor, color: typeColor }}>
          {OPTIMIZATION_OPPORTUNITY_LABELS[opportunity.type]}
        </div>
        <div className="opportunity-difficulty" style={{ backgroundColor: `${difficultyColor}20`, color: difficultyColor }}>
          {opportunity.difficulty.charAt(0).toUpperCase() + opportunity.difficulty.slice(1)}
        </div>
      </div>

      <div className="opportunity-query">"{opportunity.query}"</div>

      <div className="opportunity-stats">
        <div className="stat-row">
          <span className="stat-label">Current:</span>
          <span className="stat-value">
            {opportunity.currentImpressions.toLocaleString()} impr • {formatRate(opportunity.currentCTR)}
          </span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Potential:</span>
          <span className="stat-value potential">
            {opportunity.potentialImpressions.toLocaleString()} impr • {formatCurrency(opportunity.potentialRevenue)}
          </span>
        </div>
      </div>

      <div className="opportunity-recommendation">{opportunity.recommendation}</div>
    </div>
  );
}

function SearchAnalyticsSectionSkeleton() {
  return (
    <div className="search-analytics-section skeleton-section">
      <div className="search-queries-table-container">
        <div className="table-header">
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-count" />
        </div>
        <div className="table-wrapper">
          <table className="search-queries-table">
            <thead>
              <tr>
                <th className="col-query">Query</th>
                <th className="col-impressions">Impressions</th>
                <th className="col-clicks">Clicks</th>
                <th className="col-ctr">CTR</th>
                <th className="col-orders">Orders</th>
                <th className="col-revenue">Revenue</th>
                <th className="col-position">Avg Position</th>
                <th className="col-trend">Trend</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="query-row">
                  <td colSpan={8}>
                    <div className="skeleton skeleton-row" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="optimization-opportunities-container">
        <div className="opportunities-header">
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-count" />
        </div>
        <div className="opportunities-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton skeleton-card" />
          ))}
        </div>
      </div>
    </div>
  );
}
