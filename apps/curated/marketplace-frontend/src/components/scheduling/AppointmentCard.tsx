/**
 * AppointmentCard Component
 * Displays appointment information in list view
 */

import React from 'react';

interface Appointment {
  id: string;
  appointmentNumber: string;
  clientId: string;
  providerId: string;
  serviceType: string;
  duration: number;
  startTime: Date;
  endTime: Date;
  status: string;
  notes: string;
  clientName?: string;
  providerName?: string;
}

interface AppointmentCardProps {
  appointment: Appointment;
  onClick: () => void;
}

export default function AppointmentCard({ appointment, onClick }: AppointmentCardProps) {
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800';
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'CHECKED_IN':
        return 'bg-purple-100 text-purple-800';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'NO_SHOW':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (date: Date): string => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div
      onClick={onClick}
      className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-sm text-gray-600">
              {appointment.appointmentNumber}
            </span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(appointment.status)}`}>
              {appointment.status}
            </span>
          </div>
          <div className="font-medium text-gray-900 mb-1">
            {appointment.clientName || appointment.clientId}
          </div>
          <div className="text-sm text-gray-600 mb-2">
            {appointment.serviceType} • {appointment.duration} min
          </div>
          <div className="text-sm text-gray-600">
            {formatDate(appointment.startTime)} at {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
          </div>
          {appointment.providerName && (
            <div className="text-sm text-gray-500 mt-1">
              with {appointment.providerName}
            </div>
          )}
        </div>
        <div>
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
