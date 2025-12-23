/**
 * Date Range Picker Component
 * Feature 011: Vendor Portal MVP
 * Sprint D.2: Discovery Analytics Frontend - Task D.2.7
 *
 * Allows vendors to select date ranges for analytics queries with:
 * - Preset ranges (Last 7 days, Last 30 days, Last 90 days, Custom)
 * - Custom date picker for start and end dates
 * - Manual refresh button
 */

import { useState } from 'react';
import { Calendar, RefreshCw } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface DateRange {
  startDate: string;
  endDate: string;
}

interface DateRangePickerProps {
  dateRange: DateRange;
  onChange: (range: DateRange) => void;
  onRefresh: () => void;
  loading?: boolean;
}

type PresetRange = '7d' | '30d' | '90d' | 'custom';

export function DateRangePicker({ dateRange, onChange, onRefresh, loading }: DateRangePickerProps) {
  const [activePreset, setActivePreset] = useState<PresetRange>('30d');
  const [showCustomPicker, setShowCustomPicker] = useState(false);

  // Handle preset selection
  const handlePresetClick = (preset: PresetRange) => {
    setActivePreset(preset);

    if (preset === 'custom') {
      // Toggle if clicking custom again
      if (activePreset === 'custom') {
        setShowCustomPicker(!showCustomPicker);
      } else {
        setShowCustomPicker(true);
      }
      return;
    }

    setShowCustomPicker(false);

    const end = new Date();
    const start = new Date();

    switch (preset) {
      case '7d':
        start.setDate(start.getDate() - 7);
        break;
      case '30d':
        start.setDate(start.getDate() - 30);
        break;
      case '90d':
        start.setDate(start.getDate() - 90);
        break;
    }

    onChange({
      startDate: start.toISOString(),
      endDate: end.toISOString()
    });
  };

  // Handle custom date change
  const handleCustomDateChange = (type: 'start' | 'end', value: string) => {
    const date = new Date(value);
    date.setHours(type === 'start' ? 0 : 23, type === 'start' ? 0 : 59, type === 'start' ? 0 : 59);

    onChange({
      ...dateRange,
      [type === 'start' ? 'startDate' : 'endDate']: date.toISOString()
    });
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format date for input value (YYYY-MM-DD)
  const formatDateForInput = (dateStr: string) => {
    return new Date(dateStr).toISOString().split('T')[0];
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center gap-3">
        <h3 className="text-sm font-medium text-gray-700">Date Range:</h3>

        {/* Preset Buttons */}
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg border border-gray-200 p-1">
          <button
            onClick={() => handlePresetClick('7d')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              activePreset === '7d'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            )}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => handlePresetClick('30d')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              activePreset === '30d'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            )}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => handlePresetClick('90d')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              activePreset === '90d'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            )}
          >
            Last 90 Days
          </button>
        <button
          onClick={() => handlePresetClick('custom')}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5',
            activePreset === 'custom'
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          )}
        >
          <Calendar className="h-4 w-4" />
          Custom
        </button>
      </div>

      {/* Custom Date Picker */}
      {showCustomPicker && (
        <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 px-3 py-2">
          <input
            type="date"
            role="textbox"
            value={formatDateForInput(dateRange.startDate)}
            onChange={(e) => handleCustomDateChange('start', e.target.value)}
            max={formatDateForInput(dateRange.endDate)}
            className="text-sm text-gray-700 border-r border-gray-200 pr-2"
            aria-label="Start date"
          />
          <span className="text-gray-500">to</span>
          <input
            type="date"
            role="textbox"
            value={formatDateForInput(dateRange.endDate)}
            onChange={(e) => handleCustomDateChange('end', e.target.value)}
            min={formatDateForInput(dateRange.startDate)}
            max={formatDateForInput(new Date().toISOString())}
            className="text-sm text-gray-700"
            aria-label="End date"
          />
        </div>
      )}

      {/* Date Range Display (when not custom) */}
      {!showCustomPicker && (
        <div className="text-sm text-gray-600 bg-white rounded-lg border border-gray-200 px-4 py-2">
          {formatDate(dateRange.startDate)} - {formatDate(dateRange.endDate)}
        </div>
      )}

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={loading}
          className={cn(
            'p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors',
            loading && 'opacity-50 cursor-not-allowed'
          )}
          aria-label="Refresh data"
          title="Refresh data"
        >
          <RefreshCw className={cn('h-5 w-5 text-gray-700', loading && 'animate-spin')} />
        </button>
      </div>
    </div>
  );
}
