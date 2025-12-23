import { useState } from 'react';
import { OrderStatus, OrderFilters as OrderFiltersType } from '../types/orders';
import { OrderStatusBadge } from './OrderStatusBadge';
import './OrderFilters.css';

export interface OrderFiltersProps {
  filters: OrderFiltersType;
  onChange: (filters: OrderFiltersType) => void;
  onReset: () => void;
}

export function OrderFilters({ filters, onChange, onReset }: OrderFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleStatusToggle = (status: OrderStatus) => {
    const currentStatuses = filters.status || [];
    const newStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter((s) => s !== status)
      : [...currentStatuses, status];

    onChange({
      ...filters,
      status: newStatuses.length > 0 ? newStatuses : undefined,
    });
  };

  const handleSearchChange = (query: string) => {
    onChange({
      ...filters,
      searchQuery: query || undefined,
    });
  };

  const handleDateFromChange = (date: string) => {
    onChange({
      ...filters,
      dateFrom: date || undefined,
    });
  };

  const handleDateToChange = (date: string) => {
    onChange({
      ...filters,
      dateTo: date || undefined,
    });
  };

  const hasActiveFilters =
    (filters.status && filters.status.length > 0) ||
    filters.searchQuery ||
    filters.dateFrom ||
    filters.dateTo;

  const activeFilterCount = [
    filters.status && filters.status.length > 0,
    filters.searchQuery,
    filters.dateFrom,
    filters.dateTo,
  ].filter(Boolean).length;

  return (
    <div className="order-filters">
      <div className="filters-header">
        <div className="filters-search">
          <input
            type="text"
            className="search-input"
            placeholder="Search orders by order #, customer name..."
            value={filters.searchQuery || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        <div className="filters-actions">
          <button
            className="filters-toggle-btn"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            🔍 Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            <span className="toggle-icon">{isExpanded ? '▲' : '▼'}</span>
          </button>

          {hasActiveFilters && (
            <button className="filters-reset-btn" onClick={onReset}>
              ✕ Clear Filters
            </button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="filters-expanded">
          {/* Status Filters */}
          <div className="filter-group">
            <h4 className="filter-group-title">Order Status</h4>
            <div className="status-filter-grid">
              {Object.values(OrderStatus).map((status) => {
                const isSelected = filters.status?.includes(status) || false;
                return (
                  <button
                    key={status}
                    type="button"
                    className={`status-filter-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleStatusToggle(status)}
                  >
                    <OrderStatusBadge status={status} showIcon={false} />
                    {isSelected && <span className="selected-check">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Range Filters */}
          <div className="filter-group">
            <h4 className="filter-group-title">Date Range</h4>
            <div className="date-filter-group">
              <div className="date-input-wrapper">
                <label htmlFor="date-from">From</label>
                <input
                  id="date-from"
                  type="date"
                  className="date-input"
                  value={filters.dateFrom || ''}
                  onChange={(e) => handleDateFromChange(e.target.value)}
                  max={filters.dateTo || undefined}
                />
              </div>
              <div className="date-input-wrapper">
                <label htmlFor="date-to">To</label>
                <input
                  id="date-to"
                  type="date"
                  className="date-input"
                  value={filters.dateTo || ''}
                  onChange={(e) => handleDateToChange(e.target.value)}
                  min={filters.dateFrom || undefined}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
