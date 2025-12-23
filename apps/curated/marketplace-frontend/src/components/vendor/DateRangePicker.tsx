/**
 * Date Range Picker Component
 *
 * Feature 011: Vendor Portal MVP
 * Sprint B.2: Dashboard Charts & Tables (Task B.2.4)
 *
 * Allows vendors to select custom date ranges for dashboard data
 */

import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Calendar } from 'lucide-react';

export interface DateRange {
  startDate: string; // ISO date string (YYYY-MM-DD)
  endDate: string;   // ISO date string (YYYY-MM-DD)
}

export interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  disabled?: boolean;
}

/**
 * Preset date ranges for quick selection
 */
const PRESETS = [
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
  { label: 'Last 6 months', days: 180 },
  { label: 'Last year', days: 365 },
] as const;

/**
 * Format date range for display
 */
function formatDateRange(range: DateRange): string {
  const start = new Date(range.startDate);
  const end = new Date(range.endDate);

  const formatOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };

  return `${start.toLocaleDateString('en-US', formatOptions)} - ${end.toLocaleDateString('en-US', formatOptions)}`;
}

/**
 * Calculate date range from preset
 */
function calculatePresetRange(days: number): DateRange {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  };
}

/**
 * Main DateRangePicker Component
 */
export function DateRangePicker({
  value,
  onChange,
  disabled = false,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customStartDate, setCustomStartDate] = useState(value.startDate);
  const [customEndDate, setCustomEndDate] = useState(value.endDate);

  const handlePresetClick = (days: number) => {
    const newRange = calculatePresetRange(days);
    onChange(newRange);
    setCustomStartDate(newRange.startDate);
    setCustomEndDate(newRange.endDate);
    setIsOpen(false);
  };

  const handleCustomApply = () => {
    // Validate dates
    const start = new Date(customStartDate);
    const end = new Date(customEndDate);

    if (start > end) {
      alert('Start date must be before end date');
      return;
    }

    onChange({
      startDate: customStartDate,
      endDate: customEndDate,
    });
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="flex items-center space-x-2"
      >
        <Calendar className="h-4 w-4" />
        <span className="text-sm">{formatDateRange(value)}</span>
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-lg z-50 p-4">
            <div className="space-y-4">
              {/* Presets */}
              <div>
                <h3 className="text-sm font-medium mb-2">Quick Select</h3>
                <div className="grid grid-cols-2 gap-2">
                  {PRESETS.map((preset) => (
                    <Button
                      key={preset.days}
                      variant="outline"
                      size="sm"
                      onClick={() => handlePresetClick(preset.days)}
                      className="justify-start text-xs"
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Custom Date Range */}
              <div>
                <h3 className="text-sm font-medium mb-2">Custom Range</h3>
                <div className="space-y-2">
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-jade/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-jade/50"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleCustomApply}
                  style={{ backgroundColor: '#2E8B57' }}
                  className="text-white hover:opacity-90"
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
