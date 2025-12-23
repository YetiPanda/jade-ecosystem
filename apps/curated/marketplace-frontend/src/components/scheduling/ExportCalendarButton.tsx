/**
 * Export Calendar Button Component
 * Phase 4: User Story 2 - Appointment Scheduling & Client Management
 * Task: T129
 *
 * Purpose: Button component for exporting appointments to iCal format
 * Features:
 * - Single appointment export
 * - Multiple appointment export
 * - Provider calendar export
 * - Export options configuration
 */

import React, { useState } from 'react';
import { useICalExport, ICalExportOptions } from '../../hooks/useICalExport';

/**
 * Export button props
 */
interface ExportCalendarButtonProps {
  // Export type
  type: 'appointment' | 'appointments' | 'provider-calendar';

  // Data for export
  appointmentId?: string;
  appointmentNumber?: string;
  appointmentIds?: string[];
  providerId?: string;
  providerName?: string;
  startDate?: Date;
  endDate?: Date;

  // UI customization
  label?: string;
  className?: string;
  showIcon?: boolean;

  // Export options
  options?: ICalExportOptions;

  // Callbacks
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

/**
 * Export Calendar Button Component
 */
export default function ExportCalendarButton({
  type,
  appointmentId,
  appointmentNumber,
  appointmentIds,
  providerId,
  providerName,
  startDate,
  endDate,
  label,
  className = '',
  showIcon = true,
  options,
  onSuccess,
  onError,
}: ExportCalendarButtonProps) {
  const [exporting, setExporting] = useState(false);
  const { exportAppointment, exportAppointments, exportProviderCalendar } = useICalExport();

  const handleExport = async () => {
    setExporting(true);

    try {
      let result;

      switch (type) {
        case 'appointment':
          if (!appointmentId || !appointmentNumber) {
            throw new Error('Appointment ID and number required');
          }
          result = await exportAppointment(appointmentId, appointmentNumber, options);
          break;

        case 'appointments':
          if (!appointmentIds || appointmentIds.length === 0) {
            throw new Error('Appointment IDs required');
          }
          result = await exportAppointments(appointmentIds, undefined, options);
          break;

        case 'provider-calendar':
          if (!providerId || !providerName || !startDate || !endDate) {
            throw new Error('Provider details and date range required');
          }
          result = await exportProviderCalendar(
            providerId,
            providerName,
            startDate,
            endDate,
            options
          );
          break;

        default:
          throw new Error('Invalid export type');
      }

      if (result.success) {
        onSuccess?.();
      } else {
        throw new Error(result.error || 'Export failed');
      }
    } catch (error: any) {
      console.error('Export error:', error);
      onError?.(error.message);
    } finally {
      setExporting(false);
    }
  };

  const getLabel = () => {
    if (label) return label;

    switch (type) {
      case 'appointment':
        return 'Export to Calendar';
      case 'appointments':
        return `Export ${appointmentIds?.length || 0} Appointments`;
      case 'provider-calendar':
        return 'Export Calendar';
      default:
        return 'Export';
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={exporting}
      className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {showIcon && (
        <svg
          className="-ml-1 mr-2 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {exporting ? (
            // Loading spinner
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              className="animate-spin"
            />
          ) : (
            // Calendar icon
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          )}
        </svg>
      )}
      <span>{exporting ? 'Exporting...' : getLabel()}</span>
    </button>
  );
}

/**
 * Dropdown menu with export options
 */
interface ExportMenuProps {
  appointmentId?: string;
  appointmentNumber?: string;
  providerId?: string;
  providerName?: string;
  startDate?: Date;
  endDate?: Date;
}

export function ExportCalendarMenu({
  appointmentId,
  appointmentNumber,
  providerId,
  providerName,
  startDate,
  endDate,
}: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [exportOptions, setExportOptions] = useState<ICalExportOptions>({
    includeReminders: true,
    reminderMinutes: 60,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    method: 'PUBLISH',
  });

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        <svg
          className="-ml-1 mr-2 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        Export Options
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="p-4 space-y-4">
            <h3 className="text-sm font-medium text-gray-900">Export Settings</h3>

            {/* Include Reminders */}
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={exportOptions.includeReminders}
                onChange={(e) =>
                  setExportOptions({ ...exportOptions, includeReminders: e.target.checked })
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Include reminders</span>
            </label>

            {/* Reminder Minutes */}
            {exportOptions.includeReminders && (
              <div>
                <label className="block text-sm text-gray-700">Reminder time (minutes before):</label>
                <select
                  value={exportOptions.reminderMinutes}
                  onChange={(e) =>
                    setExportOptions({
                      ...exportOptions,
                      reminderMinutes: parseInt(e.target.value),
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                  <option value="1440">1 day</option>
                </select>
              </div>
            )}

            {/* Export Button */}
            <div className="pt-2">
              {appointmentId && appointmentNumber && (
                <ExportCalendarButton
                  type="appointment"
                  appointmentId={appointmentId}
                  appointmentNumber={appointmentNumber}
                  options={exportOptions}
                  className="w-full justify-center"
                  onSuccess={() => setIsOpen(false)}
                />
              )}

              {providerId && providerName && startDate && endDate && (
                <ExportCalendarButton
                  type="provider-calendar"
                  providerId={providerId}
                  providerName={providerName}
                  startDate={startDate}
                  endDate={endDate}
                  options={exportOptions}
                  className="w-full justify-center"
                  onSuccess={() => setIsOpen(false)}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
