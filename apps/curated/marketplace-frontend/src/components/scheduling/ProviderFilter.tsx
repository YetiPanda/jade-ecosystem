/**
 * ProviderFilter Component
 * Filter appointments by provider
 */

import React from 'react';

interface ProviderSummary {
  id: string;
  name: string;
  todayAppointments: number;
  upcomingAppointments: number;
  utilization: number;
  availableSlots: number;
}

interface ProviderFilterProps {
  value?: string;
  onChange: (providerId: string | undefined) => void;
  providers: ProviderSummary[];
}

export default function ProviderFilter({ value, onChange, providers }: ProviderFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="provider-filter" className="text-sm font-medium text-gray-700">
        Provider:
      </label>
      <select
        id="provider-filter"
        value={value || ''}
        onChange={(e) => onChange(e.target.value || undefined)}
        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">All Providers</option>
        {providers.map((provider) => (
          <option key={provider.id} value={provider.id}>
            {provider.name} ({provider.todayAppointments} today)
          </option>
        ))}
      </select>
    </div>
  );
}
