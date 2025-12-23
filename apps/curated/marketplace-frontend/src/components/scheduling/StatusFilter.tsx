/**
 * StatusFilter Component
 * Filter appointments by status
 */

import React from 'react';

type AppointmentStatus = 'SCHEDULED' | 'CONFIRMED' | 'CHECKED_IN' | 'IN_PROGRESS' | 'COMPLETED' | 'NO_SHOW' | 'CANCELLED';

interface StatusFilterProps {
  value?: AppointmentStatus;
  onChange: (status: AppointmentStatus | undefined) => void;
}

export default function StatusFilter({ value, onChange }: StatusFilterProps) {
  const statuses: Array<{ value: AppointmentStatus; label: string }> = [
    { value: 'SCHEDULED', label: 'Scheduled' },
    { value: 'CONFIRMED', label: 'Confirmed' },
    { value: 'CHECKED_IN', label: 'Checked In' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'NO_SHOW', label: 'No Show' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ];

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="status-filter" className="text-sm font-medium text-gray-700">
        Status:
      </label>
      <select
        id="status-filter"
        value={value || ''}
        onChange={(e) => onChange((e.target.value as AppointmentStatus) || undefined)}
        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">All Statuses</option>
        {statuses.map((status) => (
          <option key={status.value} value={status.value}>
            {status.label}
          </option>
        ))}
      </select>
    </div>
  );
}
