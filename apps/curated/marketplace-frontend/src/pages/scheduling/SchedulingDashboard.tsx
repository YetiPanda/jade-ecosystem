/**
 * SchedulingDashboard Page Component
 * Phase 4: User Story 2 - Appointment Scheduling & Client Management
 * Task: T116
 *
 * Features:
 * - Calendar view of appointments
 * - Provider schedule overview
 * - Appointment list with filters
 * - Quick actions (book, reschedule, cancel)
 * - Daily/weekly/monthly views
 * - Provider utilization metrics
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Calendar from '../../components/scheduling/Calendar';
import AppointmentCard from '../../components/scheduling/AppointmentCard';
import ProviderFilter from '../../components/scheduling/ProviderFilter';
import StatusFilter from '../../components/scheduling/StatusFilter';

/**
 * Appointment filters state
 */
interface AppointmentFilters {
  providerId?: string;
  clientId?: string;
  status?: 'SCHEDULED' | 'CONFIRMED' | 'CHECKED_IN' | 'IN_PROGRESS' | 'COMPLETED' | 'NO_SHOW' | 'CANCELLED';
  startDate?: Date;
  endDate?: Date;
}

/**
 * View mode for calendar
 */
type CalendarView = 'day' | 'week' | 'month' | 'list';

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
  timezone: string;
  status: string;
  notes: string;
  clientName?: string;
  providerName?: string;
}

/**
 * Provider summary for dashboard
 */
interface ProviderSummary {
  id: string;
  name: string;
  todayAppointments: number;
  upcomingAppointments: number;
  utilization: number;
  availableSlots: number;
}

/**
 * SchedulingDashboard Page
 *
 * Main scheduling interface for spa managers to view and manage appointments
 */
export default function SchedulingDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [view, setView] = useState<CalendarView>(
    (searchParams.get('view') as CalendarView) || 'week'
  );
  const [selectedDate, setSelectedDate] = useState<Date>(
    searchParams.get('date') ? new Date(searchParams.get('date')!) : new Date()
  );
  const [filters, setFilters] = useState<AppointmentFilters>({
    providerId: searchParams.get('provider') || undefined,
    status: searchParams.get('status') as any || undefined,
  });
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [providers, setProviders] = useState<ProviderSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // Statistics
  const [stats, setStats] = useState({
    todayTotal: 0,
    todayCompleted: 0,
    upcomingToday: 0,
    weekTotal: 0,
  });

  /**
   * Load appointments from GraphQL API
   */
  const loadAppointments = async () => {
    setLoading(true);
    try {
      // Calculate date range based on view
      const startDate = getViewStartDate(selectedDate, view);
      const endDate = getViewEndDate(selectedDate, view);

      // TODO: Replace with actual GraphQL query
      // const response = await apolloClient.query({
      //   query: APPOINTMENTS_QUERY,
      //   variables: {
      //     filters: {
      //       ...filters,
      //       startDate,
      //       endDate,
      //     },
      //   },
      // });

      // Mock data for now
      const mockAppointments: Appointment[] = [];
      setAppointments(mockAppointments);

      // Calculate statistics
      calculateStats(mockAppointments);
    } catch (error) {
      console.error('Failed to load appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load provider summaries
   */
  const loadProviders = async () => {
    try {
      // TODO: Replace with actual GraphQL query
      // const response = await apolloClient.query({
      //   query: PROVIDER_SUMMARIES_QUERY,
      // });

      // Mock data for now
      const mockProviders: ProviderSummary[] = [];
      setProviders(mockProviders);
    } catch (error) {
      console.error('Failed to load providers:', error);
    }
  };

  /**
   * Calculate statistics from appointments
   */
  const calculateStats = (appts: Appointment[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const weekEnd = new Date(today);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const todayAppts = appts.filter(
      (a) => new Date(a.startTime) >= today && new Date(a.startTime) < tomorrow
    );

    const weekAppts = appts.filter(
      (a) => new Date(a.startTime) >= today && new Date(a.startTime) < weekEnd
    );

    setStats({
      todayTotal: todayAppts.length,
      todayCompleted: todayAppts.filter((a) => a.status === 'COMPLETED').length,
      upcomingToday: todayAppts.filter(
        (a) => a.status === 'SCHEDULED' || a.status === 'CONFIRMED'
      ).length,
      weekTotal: weekAppts.length,
    });
  };

  /**
   * Handle filter changes
   */
  const handleFilterChange = (newFilters: Partial<AppointmentFilters>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);

    // Update URL params
    const params = new URLSearchParams(searchParams);
    if (updated.providerId) params.set('provider', updated.providerId);
    else params.delete('provider');
    if (updated.status) params.set('status', updated.status);
    else params.delete('status');
    setSearchParams(params);
  };

  /**
   * Handle view change
   */
  const handleViewChange = (newView: CalendarView) => {
    setView(newView);
    const params = new URLSearchParams(searchParams);
    params.set('view', newView);
    setSearchParams(params);
  };

  /**
   * Handle date navigation
   */
  const handleDateChange = (newDate: Date) => {
    setSelectedDate(newDate);
    const params = new URLSearchParams(searchParams);
    params.set('date', newDate.toISOString().split('T')[0]);
    setSearchParams(params);
  };

  /**
   * Navigate to previous period
   */
  const handlePrevious = () => {
    const newDate = new Date(selectedDate);
    switch (view) {
      case 'day':
        newDate.setDate(newDate.getDate() - 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() - 7);
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() - 1);
        break;
    }
    handleDateChange(newDate);
  };

  /**
   * Navigate to next period
   */
  const handleNext = () => {
    const newDate = new Date(selectedDate);
    switch (view) {
      case 'day':
        newDate.setDate(newDate.getDate() + 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + 7);
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + 1);
        break;
    }
    handleDateChange(newDate);
  };

  /**
   * Navigate to today
   */
  const handleToday = () => {
    handleDateChange(new Date());
  };

  /**
   * Handle appointment selection
   */
  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  };

  /**
   * Load data on mount and when filters change
   */
  useEffect(() => {
    loadAppointments();
  }, [filters, selectedDate, view]);

  useEffect(() => {
    loadProviders();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Scheduling Dashboard
        </h1>
        <p className="text-gray-600">
          Manage appointments, view provider schedules, and track bookings
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Today's Appointments</div>
          <div className="text-3xl font-bold text-gray-900">{stats.todayTotal}</div>
          <div className="text-xs text-green-600 mt-1">
            {stats.todayCompleted} completed
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Upcoming Today</div>
          <div className="text-3xl font-bold text-blue-600">{stats.upcomingToday}</div>
          <div className="text-xs text-gray-500 mt-1">Scheduled/Confirmed</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">This Week</div>
          <div className="text-3xl font-bold text-gray-900">{stats.weekTotal}</div>
          <div className="text-xs text-gray-500 mt-1">Total appointments</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Active Providers</div>
          <div className="text-3xl font-bold text-gray-900">{providers.length}</div>
          <div className="text-xs text-gray-500 mt-1">Available today</div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        {/* Quick Actions */}
        <div className="flex gap-2">
          <Link
            to="/scheduling/book"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Book Appointment
          </Link>
          <Link
            to="/scheduling/clients"
            className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            View Clients
          </Link>
          <Link
            to="/scheduling/providers"
            className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Manage Providers
          </Link>
        </div>

        {/* View Selector */}
        <div className="flex bg-white border border-gray-300 rounded-lg overflow-hidden">
          <button
            onClick={() => handleViewChange('day')}
            className={`px-4 py-2 text-sm font-medium ${
              view === 'day'
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Day
          </button>
          <button
            onClick={() => handleViewChange('week')}
            className={`px-4 py-2 text-sm font-medium border-l border-r border-gray-300 ${
              view === 'week'
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => handleViewChange('month')}
            className={`px-4 py-2 text-sm font-medium ${
              view === 'month'
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => handleViewChange('list')}
            className={`px-4 py-2 text-sm font-medium border-l border-gray-300 ${
              view === 'list'
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            List
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <ProviderFilter
            value={filters.providerId}
            onChange={(providerId) => handleFilterChange({ providerId })}
            providers={providers}
          />
          <StatusFilter
            value={filters.status}
            onChange={(status) => handleFilterChange({ status })}
          />
          <button
            onClick={() => setFilters({})}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Date Navigation */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <button
            onClick={handlePrevious}
            className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            ← Previous
          </button>
          <button
            onClick={handleToday}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Today
          </button>
          <button
            onClick={handleNext}
            className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Next →
          </button>
        </div>
        <div className="text-lg font-semibold text-gray-900">
          {formatDateRange(selectedDate, view)}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-lg shadow">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : view === 'list' ? (
          /* List View */
          <div className="divide-y divide-gray-200">
            {appointments.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-gray-400 mb-2">
                  <svg
                    className="mx-auto h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No appointments found
                </h3>
                <p className="text-gray-600 mb-4">
                  {filters.providerId || filters.status
                    ? 'Try adjusting your filters'
                    : 'Book your first appointment to get started'}
                </p>
                <Link
                  to="/scheduling/book"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Book Appointment
                </Link>
              </div>
            ) : (
              appointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onClick={() => handleAppointmentClick(appointment)}
                />
              ))
            )}
          </div>
        ) : (
          /* Calendar View */
          <Calendar
            view={view}
            selectedDate={selectedDate}
            appointments={appointments}
            onAppointmentClick={handleAppointmentClick}
            onDateChange={handleDateChange}
          />
        )}
      </div>

      {/* Provider Utilization */}
      {providers.length > 0 && (
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Provider Utilization
          </h2>
          <div className="space-y-3">
            {providers.map((provider) => (
              <div key={provider.id} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {provider.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {provider.todayAppointments} appointments today
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${provider.utilization}%` }}
                    ></div>
                  </div>
                  <div className="text-sm font-medium text-gray-900 w-12 text-right">
                    {provider.utilization}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Helper: Get start date for view
 */
function getViewStartDate(date: Date, view: CalendarView): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);

  switch (view) {
    case 'day':
      return result;
    case 'week':
      // Start on Sunday
      result.setDate(result.getDate() - result.getDay());
      return result;
    case 'month':
      result.setDate(1);
      return result;
    case 'list':
      return result;
  }
}

/**
 * Helper: Get end date for view
 */
function getViewEndDate(date: Date, view: CalendarView): Date {
  const result = getViewStartDate(date, view);

  switch (view) {
    case 'day':
      result.setDate(result.getDate() + 1);
      break;
    case 'week':
      result.setDate(result.getDate() + 7);
      break;
    case 'month':
      result.setMonth(result.getMonth() + 1);
      break;
    case 'list':
      result.setDate(result.getDate() + 30);
      break;
  }

  return result;
}

/**
 * Helper: Format date range based on view
 */
function formatDateRange(date: Date, view: CalendarView): string {
  const options: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  };

  switch (view) {
    case 'day':
      return date.toLocaleDateString('en-US', options);
    case 'week': {
      const start = getViewStartDate(date, 'week');
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      return `${start.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })} - ${end.toLocaleDateString('en-US', options)}`;
    }
    case 'month':
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    case 'list':
      return 'All Appointments';
  }
}
