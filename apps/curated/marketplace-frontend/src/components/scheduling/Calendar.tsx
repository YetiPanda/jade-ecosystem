/**
 * Calendar Component
 * Phase 4: User Story 2 - Appointment Scheduling & Client Management
 * Task: T117, T127
 *
 * Features:
 * - Day/Week/Month views
 * - Appointment display
 * - Time slot grid
 * - Drag and drop (future)
 * - Color-coded by status
 * - Provider filtering
 * - Real-time updates via subscriptions
 */

import React, { useMemo, useState, useEffect } from 'react';
import { useCalendarAutoRefresh } from '../../hooks/useAppointmentSubscriptions';

/**
 * Calendar view mode
 */
type CalendarView = 'day' | 'week' | 'month';

/**
 * Appointment data structure
 */
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
  clientName?: string;
  providerName?: string;
}

/**
 * Calendar component props
 */
interface CalendarProps {
  view: CalendarView;
  selectedDate: Date;
  appointments: Appointment[];
  onAppointmentClick: (appointment: Appointment) => void;
  onDateChange: (date: Date) => void;
  onTimeSlotClick?: (date: Date) => void;
  providerId?: string | null;
  onRefetch?: () => void;
}

/**
 * Calendar Component
 *
 * Displays appointments in day, week, or month view with time slots
 */
export default function Calendar({
  view,
  selectedDate,
  appointments,
  onAppointmentClick,
  onDateChange,
  onTimeSlotClick,
  providerId,
  onRefetch,
}: CalendarProps) {
  // Calculate date range for subscription based on view
  const dateRange = useMemo(() => {
    const start = new Date(selectedDate);
    const end = new Date(selectedDate);

    if (view === 'week') {
      // Start of week (Sunday) to end of week (Saturday)
      start.setDate(selectedDate.getDate() - selectedDate.getDay());
      end.setDate(start.getDate() + 6);
    } else if (view === 'month') {
      // Start of month to end of month
      start.setDate(1);
      end.setDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate());
    }

    return { start, end };
  }, [selectedDate, view]);

  // Subscribe to real-time calendar updates
  useCalendarAutoRefresh(
    dateRange.start,
    dateRange.end,
    providerId || null,
    () => {
      console.log('📅 Calendar data refreshed due to real-time update');
      onRefetch?.();
    }
  );

  /**
   * Generate time slots (30-minute intervals from 8 AM to 8 PM)
   */
  const timeSlots = useMemo(() => {
    const slots: string[] = [];
    for (let hour = 8; hour < 20; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  }, []);

  /**
   * Get days for week view
   */
  const weekDays = useMemo(() => {
    const days: Date[] = [];
    const start = new Date(selectedDate);
    start.setDate(start.getDate() - start.getDay()); // Start on Sunday

    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(day.getDate() + i);
      days.push(day);
    }

    return days;
  }, [selectedDate]);

  /**
   * Get days for month view
   */
  const monthDays = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days: (Date | null)[] = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  }, [selectedDate]);

  /**
   * Get appointments for a specific date
   */
  const getAppointmentsForDate = (date: Date): Appointment[] => {
    return appointments.filter((apt) => {
      const aptDate = new Date(apt.startTime);
      return (
        aptDate.getFullYear() === date.getFullYear() &&
        aptDate.getMonth() === date.getMonth() &&
        aptDate.getDate() === date.getDate()
      );
    });
  };

  /**
   * Get appointments for a specific time slot
   */
  const getAppointmentsForTimeSlot = (date: Date, timeSlot: string): Appointment[] => {
    const [hours, minutes] = timeSlot.split(':').map(Number);
    return appointments.filter((apt) => {
      const aptDate = new Date(apt.startTime);
      return (
        aptDate.getFullYear() === date.getFullYear() &&
        aptDate.getMonth() === date.getMonth() &&
        aptDate.getDate() === date.getDate() &&
        aptDate.getHours() === hours &&
        aptDate.getMinutes() === minutes
      );
    });
  };

  /**
   * Get status color
   */
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'CHECKED_IN':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'NO_SHOW':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  /**
   * Format time for display
   */
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  /**
   * Check if date is today
   */
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  /**
   * Render Day View
   */
  const renderDayView = () => {
    return (
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
          <div className="text-center">
            <div className="text-sm text-gray-600">
              {selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {selectedDate.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
          </div>
        </div>

        {/* Time Slots */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-[auto_1fr] gap-0">
            {timeSlots.map((timeSlot) => {
              const dayAppointments = getAppointmentsForTimeSlot(selectedDate, timeSlot);

              return (
                <React.Fragment key={timeSlot}>
                  {/* Time Label */}
                  <div className="px-4 py-3 text-sm text-gray-600 border-b border-gray-200">
                    {timeSlot}
                  </div>

                  {/* Time Slot Content */}
                  <div
                    className="border-b border-gray-200 p-2 hover:bg-gray-50 cursor-pointer min-h-[60px]"
                    onClick={() => {
                      if (onTimeSlotClick) {
                        const [hours, minutes] = timeSlot.split(':').map(Number);
                        const slotDate = new Date(selectedDate);
                        slotDate.setHours(hours, minutes, 0, 0);
                        onTimeSlotClick(slotDate);
                      }
                    }}
                  >
                    {dayAppointments.map((apt) => (
                      <div
                        key={apt.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onAppointmentClick(apt);
                        }}
                        className={`p-2 rounded border mb-2 cursor-pointer hover:shadow-md transition-shadow ${getStatusColor(apt.status)}`}
                      >
                        <div className="font-medium text-sm">
                          {formatTime(new Date(apt.startTime))} - {formatTime(new Date(apt.endTime))}
                        </div>
                        <div className="text-sm">{apt.clientName || apt.clientId}</div>
                        <div className="text-xs">{apt.serviceType}</div>
                      </div>
                    ))}
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  /**
   * Render Week View
   */
  const renderWeekView = () => {
    return (
      <div className="flex flex-col h-full">
        {/* Week Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200">
          <div className="grid grid-cols-[auto_repeat(7,1fr)]">
            <div className="w-16"></div>
            {weekDays.map((day) => (
              <div
                key={day.toISOString()}
                className="p-3 text-center border-l border-gray-200"
              >
                <div className="text-xs text-gray-600">
                  {day.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div
                  className={`text-lg font-semibold ${
                    isToday(day) ? 'text-blue-600' : 'text-gray-900'
                  }`}
                >
                  {day.getDate()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Week Time Slots */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-[auto_repeat(7,1fr)]">
            {timeSlots.map((timeSlot) => (
              <React.Fragment key={timeSlot}>
                {/* Time Label */}
                <div className="w-16 px-2 py-3 text-xs text-gray-600 border-b border-gray-200">
                  {timeSlot}
                </div>

                {/* Day Columns */}
                {weekDays.map((day) => {
                  const dayAppointments = getAppointmentsForTimeSlot(day, timeSlot);

                  return (
                    <div
                      key={day.toISOString()}
                      className="border-b border-l border-gray-200 p-1 hover:bg-gray-50 cursor-pointer min-h-[50px]"
                      onClick={() => {
                        if (onTimeSlotClick) {
                          const [hours, minutes] = timeSlot.split(':').map(Number);
                          const slotDate = new Date(day);
                          slotDate.setHours(hours, minutes, 0, 0);
                          onTimeSlotClick(slotDate);
                        }
                      }}
                    >
                      {dayAppointments.map((apt) => (
                        <div
                          key={apt.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onAppointmentClick(apt);
                          }}
                          className={`p-1 rounded text-xs cursor-pointer hover:shadow-md transition-shadow mb-1 ${getStatusColor(apt.status)}`}
                        >
                          <div className="font-medium truncate">
                            {apt.clientName || apt.clientId}
                          </div>
                          <div className="truncate">{apt.serviceType}</div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    );
  };

  /**
   * Render Month View
   */
  const renderMonthView = () => {
    return (
      <div className="p-4">
        {/* Month Header */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-sm font-semibold text-gray-700 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Month Days */}
        <div className="grid grid-cols-7 gap-2">
          {monthDays.map((day, index) => {
            if (!day) {
              return <div key={`empty-${index}`} className="h-24 bg-gray-50 rounded"></div>;
            }

            const dayAppointments = getAppointmentsForDate(day);

            return (
              <div
                key={day.toISOString()}
                onClick={() => onDateChange(day)}
                className={`h-24 border rounded p-2 cursor-pointer hover:shadow-md transition-shadow ${
                  isToday(day)
                    ? 'bg-blue-50 border-blue-300'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div
                  className={`text-sm font-semibold mb-1 ${
                    isToday(day) ? 'text-blue-600' : 'text-gray-900'
                  }`}
                >
                  {day.getDate()}
                </div>
                <div className="space-y-1">
                  {dayAppointments.slice(0, 2).map((apt) => (
                    <div
                      key={apt.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAppointmentClick(apt);
                      }}
                      className={`text-xs p-1 rounded truncate ${getStatusColor(apt.status)}`}
                    >
                      {formatTime(new Date(apt.startTime))}
                    </div>
                  ))}
                  {dayAppointments.length > 2 && (
                    <div className="text-xs text-gray-600">
                      +{dayAppointments.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  /**
   * Render appropriate view
   */
  return (
    <div className="h-full">
      {view === 'day' && renderDayView()}
      {view === 'week' && renderWeekView()}
      {view === 'month' && renderMonthView()}
    </div>
  );
}
