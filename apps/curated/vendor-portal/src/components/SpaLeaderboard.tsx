import { useState } from 'react';
import { SpaMetric, formatCurrency, formatPercentage } from '../types/dashboard';
import './SpaLeaderboard.css';

export interface SpaLeaderboardProps {
  data: SpaMetric[];
  loading?: boolean;
  error?: Error;
  limit?: number;
}

export function SpaLeaderboard({
  data,
  loading,
  error,
  limit = 10,
}: SpaLeaderboardProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  if (loading) {
    return <SpaLeaderboardSkeleton />;
  }

  if (error) {
    return (
      <div className="table-container">
        <div className="table-error">
          <p>Failed to load spa leaderboard</p>
          <p className="table-error-detail">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="table-container">
        <div className="table-empty">
          <p>No spa data available</p>
        </div>
      </div>
    );
  }

  const toggleRow = (spaId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(spaId)) {
      newExpanded.delete(spaId);
    } else {
      newExpanded.add(spaId);
    }
    setExpandedRows(newExpanded);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const displayData = data.slice(0, limit);

  return (
    <div className="table-container">
      <div className="table-header">
        <h3 className="table-title">Top Spa Customers</h3>
        <p className="table-subtitle">
          Ranked by lifetime value - Click row to expand details
        </p>
      </div>

      <div className="table-wrapper">
        <table className="spa-leaderboard-table">
          <thead>
            <tr>
              <th className="col-rank">#</th>
              <th className="col-spa-name">Spa Name</th>
              <th className="col-ltv">Lifetime Value</th>
              <th className="col-orders">Orders</th>
              <th className="col-reorder">Reorder Rate</th>
              <th className="col-last-order">Last Order</th>
              <th className="col-expand"></th>
            </tr>
          </thead>
          <tbody>
            {displayData.map((spa, index) => {
              const isExpanded = expandedRows.has(spa.spaId);
              return (
                <>
                  <tr
                    key={spa.spaId}
                    className={`spa-row ${isExpanded ? 'expanded' : ''}`}
                    onClick={() => toggleRow(spa.spaId)}
                  >
                    <td className="col-rank">
                      <span className="rank-badge">{index + 1}</span>
                    </td>
                    <td className="col-spa-name">
                      <div className="spa-name-cell">
                        <span className="spa-name">{spa.spaName}</span>
                        <span className="spa-id">ID: {spa.spaId}</span>
                      </div>
                    </td>
                    <td className="col-ltv">
                      <strong>{formatCurrency(spa.lifetimeValue)}</strong>
                    </td>
                    <td className="col-orders">
                      <span className="orders-badge">{spa.orderCount}</span>
                    </td>
                    <td className="col-reorder">
                      <span
                        className={`reorder-badge ${
                          spa.reorderRate >= 50
                            ? 'high'
                            : spa.reorderRate >= 25
                            ? 'medium'
                            : 'low'
                        }`}
                      >
                        {formatPercentage(spa.reorderRate)}
                      </span>
                    </td>
                    <td className="col-last-order">
                      {formatDate(spa.lastOrderDate)}
                    </td>
                    <td className="col-expand">
                      <span className="expand-icon">{isExpanded ? '−' : '+'}</span>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr className="spa-detail-row">
                      <td colSpan={7}>
                        <SpaDetailPanel spa={spa} />
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SpaDetailPanel({ spa }: { spa: SpaMetric }) {
  const avgOrderValue = spa.orderCount > 0 ? spa.lifetimeValue / spa.orderCount : 0;

  return (
    <div className="spa-detail-panel">
      <div className="spa-detail-grid">
        <div className="spa-detail-item">
          <span className="spa-detail-label">Spa ID</span>
          <span className="spa-detail-value">{spa.spaId}</span>
        </div>
        <div className="spa-detail-item">
          <span className="spa-detail-label">Total Orders</span>
          <span className="spa-detail-value">{spa.orderCount}</span>
        </div>
        <div className="spa-detail-item">
          <span className="spa-detail-label">Lifetime Value</span>
          <span className="spa-detail-value">{formatCurrency(spa.lifetimeValue)}</span>
        </div>
        <div className="spa-detail-item">
          <span className="spa-detail-label">Avg Order Value</span>
          <span className="spa-detail-value">{formatCurrency(avgOrderValue)}</span>
        </div>
        <div className="spa-detail-item">
          <span className="spa-detail-label">Reorder Rate</span>
          <span className="spa-detail-value">{formatPercentage(spa.reorderRate)}</span>
        </div>
        <div className="spa-detail-item">
          <span className="spa-detail-label">Last Order</span>
          <span className="spa-detail-value">
            {new Date(spa.lastOrderDate).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>
      </div>
    </div>
  );
}

function SpaLeaderboardSkeleton() {
  return (
    <div className="table-container">
      <div className="table-header">
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-subtitle" />
      </div>
      <div className="table-skeleton">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="skeleton skeleton-row" />
        ))}
      </div>
    </div>
  );
}
