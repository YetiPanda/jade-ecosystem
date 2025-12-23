/**
 * ProviderSchedule Component
 * Phase 4: User Story 2 - Appointment Scheduling & Client Management
 * Task: T120
 *
 * Features:
 * - Weekly schedule management
 * - Working hours configuration
 * - Break time management
 * - Time-off blocking
 * - Recurring schedule patterns
 * - Service-specific availability
 */

import React, { useState, useEffect } from 'react';

/**
 * Time slot for a shift
 */
interface TimeSlot {
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
}

/**
 * Day schedule
 */
interface DaySchedule {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  isWorkingDay: boolean;
  shifts: TimeSlot[];
}

/**
 * Blocked time period
 */
interface BlockedTime {
  id?: string;
  type: 'BLOCKED_TIME' | 'VACATION' | 'UNAVAILABLE';
  startTime: Date;
  endTime: Date;
  reason: string;
  isRecurring: boolean;
}

/**
 * Provider schedule props
 */
interface ProviderScheduleProps {
  providerId: string;
  onScheduleUpdate?: (schedule: DaySchedule[]) => void;
  onBlockTimeCreate?: (blockedTime: BlockedTime) => void;
}

/**
 * ProviderSchedule Component
 *
 * Manage provider working hours, breaks, and time-off
 */
export default function ProviderSchedule({
  providerId,
  onScheduleUpdate,
  onBlockTimeCreate,
}: ProviderScheduleProps) {
  // State
  const [weeklySchedule, setWeeklySchedule] = useState<DaySchedule[]>([]);
  const [blockedTimes, setBlockedTimes] = useState<BlockedTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [showBlockTimeModal, setShowBlockTimeModal] = useState(false);

  // Block time form
  const [blockTimeForm, setBlockTimeForm] = useState<BlockedTime>({
    type: 'VACATION',
    startTime: new Date(),
    endTime: new Date(),
    reason: '',
    isRecurring: false,
  });

  /**
   * Days of week
   */
  const daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  /**
   * Load provider schedule
   */
  const loadSchedule = async () => {
    setLoading(true);
    try {
      // TODO: Replace with GraphQL query
      // provider query to get weeklySchedule
      // getBlockedTimes query

      // Initialize default schedule (Monday-Friday 9-5)
      const defaultSchedule: DaySchedule[] = [
        { dayOfWeek: 0, isWorkingDay: false, shifts: [] }, // Sunday
        { dayOfWeek: 1, isWorkingDay: true, shifts: [{ startTime: '09:00', endTime: '17:00' }] },
        { dayOfWeek: 2, isWorkingDay: true, shifts: [{ startTime: '09:00', endTime: '17:00' }] },
        { dayOfWeek: 3, isWorkingDay: true, shifts: [{ startTime: '09:00', endTime: '17:00' }] },
        { dayOfWeek: 4, isWorkingDay: true, shifts: [{ startTime: '09:00', endTime: '17:00' }] },
        { dayOfWeek: 5, isWorkingDay: true, shifts: [{ startTime: '09:00', endTime: '17:00' }] },
        { dayOfWeek: 6, isWorkingDay: false, shifts: [] }, // Saturday
      ];

      setWeeklySchedule(defaultSchedule);
      setBlockedTimes([]);
    } catch (error) {
      console.error('Failed to load schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Toggle working day
   */
  const toggleWorkingDay = (dayOfWeek: number) => {
    const updated = weeklySchedule.map((day) => {
      if (day.dayOfWeek === dayOfWeek) {
        return {
          ...day,
          isWorkingDay: !day.isWorkingDay,
          shifts: !day.isWorkingDay ? [{ startTime: '09:00', endTime: '17:00' }] : [],
        };
      }
      return day;
    });

    setWeeklySchedule(updated);
    onScheduleUpdate?.(updated);
  };

  /**
   * Add shift to day
   */
  const addShift = (dayOfWeek: number) => {
    const updated = weeklySchedule.map((day) => {
      if (day.dayOfWeek === dayOfWeek) {
        return {
          ...day,
          shifts: [...day.shifts, { startTime: '09:00', endTime: '17:00' }],
        };
      }
      return day;
    });

    setWeeklySchedule(updated);
    onScheduleUpdate?.(updated);
  };

  /**
   * Update shift time
   */
  const updateShift = (
    dayOfWeek: number,
    shiftIndex: number,
    field: 'startTime' | 'endTime',
    value: string
  ) => {
    const updated = weeklySchedule.map((day) => {
      if (day.dayOfWeek === dayOfWeek) {
        const shifts = [...day.shifts];
        shifts[shiftIndex] = { ...shifts[shiftIndex], [field]: value };
        return { ...day, shifts };
      }
      return day;
    });

    setWeeklySchedule(updated);
    onScheduleUpdate?.(updated);
  };

  /**
   * Remove shift
   */
  const removeShift = (dayOfWeek: number, shiftIndex: number) => {
    const updated = weeklySchedule.map((day) => {
      if (day.dayOfWeek === dayOfWeek) {
        return {
          ...day,
          shifts: day.shifts.filter((_, index) => index !== shiftIndex),
        };
      }
      return day;
    });

    setWeeklySchedule(updated);
    onScheduleUpdate?.(updated);
  };

  /**
   * Submit block time
   */
  const handleBlockTimeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // TODO: Replace with GraphQL mutation
      // blockProviderTime mutation

      onBlockTimeCreate?.(blockTimeForm);
      setBlockedTimes([...blockedTimes, blockTimeForm]);
      setShowBlockTimeModal(false);
      setBlockTimeForm({
        type: 'VACATION',
        startTime: new Date(),
        endTime: new Date(),
        reason: '',
        isRecurring: false,
      });
    } catch (error) {
      console.error('Failed to block time:', error);
    }
  };

  /**
   * Load schedule on mount
   */
  useEffect(() => {
    loadSchedule();
  }, [providerId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Weekly Schedule</h3>
          <p className="text-sm text-gray-600">Set your regular working hours</p>
        </div>
        <button
          onClick={() => setShowBlockTimeModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          Block Time Off
        </button>
      </div>

      {/* Weekly Schedule */}
      <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
        {weeklySchedule.map((day) => (
          <div key={day.dayOfWeek} className="p-4">
            <div className="flex items-start gap-4">
              {/* Day Toggle */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`day-${day.dayOfWeek}`}
                  checked={day.isWorkingDay}
                  onChange={() => toggleWorkingDay(day.dayOfWeek)}
                  className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor={`day-${day.dayOfWeek}`}
                  className="ml-3 text-sm font-medium text-gray-900 w-24"
                >
                  {daysOfWeek[day.dayOfWeek]}
                </label>
              </div>

              {/* Shifts */}
              <div className="flex-1">
                {day.isWorkingDay ? (
                  <div className="space-y-2">
                    {day.shifts.map((shift, shiftIndex) => (
                      <div key={shiftIndex} className="flex items-center gap-2">
                        <input
                          type="time"
                          value={shift.startTime}
                          onChange={(e) =>
                            updateShift(day.dayOfWeek, shiftIndex, 'startTime', e.target.value)
                          }
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <span className="text-gray-500">to</span>
                        <input
                          type="time"
                          value={shift.endTime}
                          onChange={(e) =>
                            updateShift(day.dayOfWeek, shiftIndex, 'endTime', e.target.value)
                          }
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {day.shifts.length > 1 && (
                          <button
                            onClick={() => removeShift(day.dayOfWeek, shiftIndex)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => addShift(day.dayOfWeek)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      + Add Another Shift
                    </button>
                  </div>
                ) : (
                  <span className="text-sm text-gray-500">Not working</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Blocked Time Periods */}
      {blockedTimes.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Blocked Time</h3>
          <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
            {blockedTimes.map((blocked, index) => (
              <div key={index} className="p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                      {blocked.type}
                    </span>
                    {blocked.isRecurring && (
                      <span className="text-xs text-gray-500">Recurring</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-900 font-medium">{blocked.reason}</div>
                  <div className="text-sm text-gray-600">
                    {new Date(blocked.startTime).toLocaleDateString()} -{' '}
                    {new Date(blocked.endTime).toLocaleDateString()}
                  </div>
                </div>
                <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Block Time Modal */}
      {showBlockTimeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full m-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Block Time Off</h3>

              <form onSubmit={handleBlockTimeSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={blockTimeForm.type}
                    onChange={(e) =>
                      setBlockTimeForm({
                        ...blockTimeForm,
                        type: e.target.value as BlockedTime['type'],
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="VACATION">Vacation</option>
                    <option value="BLOCKED_TIME">Blocked Time</option>
                    <option value="UNAVAILABLE">Unavailable</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={blockTimeForm.startTime.toISOString().slice(0, 16)}
                    onChange={(e) =>
                      setBlockTimeForm({
                        ...blockTimeForm,
                        startTime: new Date(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={blockTimeForm.endTime.toISOString().slice(0, 16)}
                    onChange={(e) =>
                      setBlockTimeForm({
                        ...blockTimeForm,
                        endTime: new Date(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                  <textarea
                    value={blockTimeForm.reason}
                    onChange={(e) =>
                      setBlockTimeForm({ ...blockTimeForm, reason: e.target.value })
                    }
                    rows={3}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="recurring"
                    checked={blockTimeForm.isRecurring}
                    onChange={(e) =>
                      setBlockTimeForm({ ...blockTimeForm, isRecurring: e.target.checked })
                    }
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="recurring" className="ml-2 text-sm text-gray-700">
                    Recurring (repeat weekly)
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowBlockTimeModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  >
                    Block Time
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
