import { useState } from 'react';
import { DateRangeInput } from '../types/dashboard';
import './DateRangePicker.css';

export interface DateRangePickerProps {
  value: DateRangeInput;
  onChange: (dateRange: DateRangeInput) => void;
  minDate?: string;
  maxDate?: string;
}

export function DateRangePicker({
  value,
  onChange,
  minDate,
  maxDate = new Date().toISOString().split('T')[0],
}: DateRangePickerProps) {
  const [startDate, setStartDate] = useState(value.startDate);
  const [endDate, setEndDate] = useState(value.endDate);
  const [isOpen, setIsOpen] = useState(false);

  const handleApply = () => {
    if (startDate && endDate) {
      onChange({ startDate, endDate });
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    setStartDate(value.startDate);
    setEndDate(value.endDate);
    setIsOpen(false);
  };

  const handleQuickSelect = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);

    const newRange = {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
    };

    setStartDate(newRange.startDate);
    setEndDate(newRange.endDate);
    onChange(newRange);
    setIsOpen(false);
  };

  // Format date range for display
  const formatDateRange = () => {
    const start = new Date(value.startDate);
    const end = new Date(value.endDate);
    const formatter = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    });
    return `${formatter.format(start)} - ${formatter.format(end)}`;
  };

  return (
    <div className="date-range-picker">
      <button
        className="date-range-trigger"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <span className="date-range-icon">📅</span>
        <span className="date-range-text">{formatDateRange()}</span>
        <span className="date-range-chevron">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="date-range-dropdown">
          <div className="date-range-header">
            <h4>Select Date Range</h4>
          </div>

          <div className="date-range-quick-select">
            <button onClick={() => handleQuickSelect(7)} type="button">
              Last 7 days
            </button>
            <button onClick={() => handleQuickSelect(30)} type="button">
              Last 30 days
            </button>
            <button onClick={() => handleQuickSelect(90)} type="button">
              Last 90 days
            </button>
          </div>

          <div className="date-range-inputs">
            <div className="date-range-input-group">
              <label htmlFor="start-date">Start Date</label>
              <input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={minDate}
                max={endDate || maxDate}
              />
            </div>

            <div className="date-range-input-group">
              <label htmlFor="end-date">End Date</label>
              <input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                max={maxDate}
              />
            </div>
          </div>

          <div className="date-range-actions">
            <button
              className="date-range-cancel"
              onClick={handleCancel}
              type="button"
            >
              Cancel
            </button>
            <button
              className="date-range-apply"
              onClick={handleApply}
              disabled={!startDate || !endDate}
              type="button"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
