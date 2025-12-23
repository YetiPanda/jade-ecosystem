/**
 * BookingPortal Page Component
 * Phase 4: User Story 2 - Appointment Scheduling & Client Management
 * Task: T118, T128
 *
 * Features:
 * - Client-facing booking interface
 * - Service selection
 * - Provider selection (optional)
 * - Available time slot display
 * - Client information form
 * - Booking confirmation
 * - Multi-step wizard
 * - Conflict detection and warnings
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ConflictWarning, { AppointmentConflict } from '../../components/scheduling/ConflictWarning';

/**
 * Booking steps
 */
type BookingStep = 'service' | 'provider' | 'datetime' | 'client-info' | 'review' | 'confirmation';

/**
 * Service type
 */
interface Service {
  type: string;
  name: string;
  duration: number;
  price: number;
  description: string;
}

/**
 * Provider type
 */
interface Provider {
  id: string;
  name: string;
  title: string;
  bio: string;
  photoUrl?: string;
  services: string[];
  rating: number;
  reviewCount: number;
}

/**
 * Available time slot
 */
interface TimeSlot {
  startTime: Date;
  endTime: Date;
  duration: number;
  slotId: string;
  isAvailable: boolean;
}

/**
 * Client information
 */
interface ClientInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes?: string;
}

/**
 * Booking data
 */
interface BookingData {
  service?: Service;
  provider?: Provider;
  timeSlot?: TimeSlot;
  clientInfo?: ClientInfo;
}

/**
 * BookingPortal Page
 *
 * Multi-step booking flow for clients to schedule appointments online
 */
export default function BookingPortal() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // State
  const [currentStep, setCurrentStep] = useState<BookingStep>('service');
  const [bookingData, setBookingData] = useState<BookingData>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conflicts, setConflicts] = useState<AppointmentConflict[]>([]);

  // Available options
  const [services, setServices] = useState<Service[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  /**
   * Load available services
   */
  const loadServices = async () => {
    // TODO: Replace with GraphQL query
    const mockServices: Service[] = [
      {
        type: 'FACIAL',
        name: 'Signature Facial',
        duration: 60,
        price: 120,
        description: 'Our most popular facial treatment for all skin types',
      },
      {
        type: 'MICRODERMABRASION',
        name: 'Microdermabrasion',
        duration: 45,
        price: 95,
        description: 'Exfoliation treatment for smoother, brighter skin',
      },
      {
        type: 'CHEMICAL_PEEL',
        name: 'Chemical Peel',
        duration: 60,
        price: 150,
        description: 'Deep exfoliation for improved texture and tone',
      },
      {
        type: 'MASSAGE',
        name: 'Relaxation Massage',
        duration: 90,
        price: 140,
        description: 'Full body massage for deep relaxation',
      },
    ];

    setServices(mockServices);
  };

  /**
   * Load available providers for selected service
   */
  const loadProviders = async (serviceType: string) => {
    setLoading(true);
    try {
      // TODO: Replace with GraphQL query
      // findCapableProviders query
      const mockProviders: Provider[] = [];
      setProviders(mockProviders);
    } catch (err) {
      setError('Failed to load providers');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load available time slots
   */
  const loadAvailableSlots = async (providerId?: string) => {
    if (!bookingData.service) return;

    setLoading(true);
    try {
      // Calculate date range (next 7 days)
      const startDate = new Date(selectedDate);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 7);

      // TODO: Replace with GraphQL query
      // availableSlots or providerAvailability query
      const mockSlots: TimeSlot[] = [];
      setAvailableSlots(mockSlots);
    } catch (err) {
      setError('Failed to load available slots');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Submit booking
   */
  const submitBooking = async () => {
    if (!bookingData.service || !bookingData.timeSlot || !bookingData.clientInfo) {
      setError('Missing required booking information');
      return;
    }

    setLoading(true);
    try {
      // TODO: Replace with GraphQL mutation
      // bookAppointment mutation
      // const response = await apolloClient.mutate({
      //   mutation: BOOK_APPOINTMENT_MUTATION,
      //   variables: {
      //     input: {
      //       clientId: 'new', // Or existing client ID
      //       providerId: bookingData.provider?.id,
      //       serviceType: bookingData.service.type,
      //       startTime: bookingData.timeSlot.startTime,
      //       endTime: bookingData.timeSlot.endTime,
      //       notes: bookingData.clientInfo.notes,
      //     },
      //   },
      // });

      setCurrentStep('confirmation');
    } catch (err) {
      setError('Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load services on mount
   */
  useEffect(() => {
    loadServices();
  }, []);

  /**
   * Load providers when service is selected
   */
  useEffect(() => {
    if (bookingData.service) {
      loadProviders(bookingData.service.type);
    }
  }, [bookingData.service]);

  /**
   * Load slots when provider or date changes
   */
  useEffect(() => {
    if (bookingData.service && currentStep === 'datetime') {
      loadAvailableSlots(bookingData.provider?.id);
    }
  }, [bookingData.service, bookingData.provider, selectedDate, currentStep]);

  /**
   * Progress indicator
   */
  const steps: Array<{ id: BookingStep; label: string }> = [
    { id: 'service', label: 'Service' },
    { id: 'provider', label: 'Provider' },
    { id: 'datetime', label: 'Date & Time' },
    { id: 'client-info', label: 'Your Info' },
    { id: 'review', label: 'Review' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  /**
   * Render step content
   */
  const renderStepContent = () => {
    switch (currentStep) {
      case 'service':
        return renderServiceSelection();
      case 'provider':
        return renderProviderSelection();
      case 'datetime':
        return renderDateTimeSelection();
      case 'client-info':
        return renderClientInfoForm();
      case 'review':
        return renderReview();
      case 'confirmation':
        return renderConfirmation();
    }
  };

  /**
   * Render service selection step
   */
  const renderServiceSelection = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Select a Service</h2>
      <p className="text-gray-600 mb-6">Choose the treatment you'd like to book</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => (
          <div
            key={service.type}
            onClick={() => {
              setBookingData({ ...bookingData, service });
              setCurrentStep('provider');
            }}
            className={`p-6 border rounded-lg cursor-pointer transition-all ${
              bookingData.service?.type === service.type
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
            }`}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{service.description}</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{service.duration} minutes</span>
              <span className="text-lg font-bold text-gray-900">${service.price}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  /**
   * Render provider selection step
   */
  const renderProviderSelection = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Provider</h2>
      <p className="text-gray-600 mb-6">Select a provider or let us choose for you</p>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <button
            onClick={() => {
              setBookingData({ ...bookingData, provider: undefined });
              setCurrentStep('datetime');
            }}
            className="w-full p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all mb-4"
          >
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900 mb-1">
                No Preference
              </div>
              <div className="text-sm text-gray-600">
                We'll assign the next available provider
              </div>
            </div>
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {providers.map((provider) => (
              <div
                key={provider.id}
                onClick={() => {
                  setBookingData({ ...bookingData, provider });
                  setCurrentStep('datetime');
                }}
                className={`p-6 border rounded-lg cursor-pointer transition-all ${
                  bookingData.provider?.id === provider.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-4">
                  {provider.photoUrl ? (
                    <img
                      src={provider.photoUrl}
                      alt={provider.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-2xl text-gray-600">
                        {provider.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{provider.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{provider.title}</p>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="text-yellow-500">★</span>
                      <span className="ml-1">{provider.rating}</span>
                      <span className="ml-1">({provider.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <button
        onClick={() => setCurrentStep('service')}
        className="mt-6 px-4 py-2 text-gray-600 hover:text-gray-900"
      >
        ← Back to Services
      </button>
    </div>
  );

  /**
   * Render date/time selection step
   */
  const renderDateTimeSelection = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Date & Time</h2>
      <p className="text-gray-600 mb-6">
        Choose an available time slot for your {bookingData.service?.name}
      </p>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : availableSlots.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
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
          <p className="text-gray-600">No available slots found</p>
          <p className="text-sm text-gray-500 mt-2">Try selecting a different date or provider</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {availableSlots.map((slot) => (
            <button
              key={slot.slotId}
              onClick={() => {
                setBookingData({ ...bookingData, timeSlot: slot });
                setCurrentStep('client-info');
              }}
              className={`p-4 border rounded-lg text-center transition-all ${
                bookingData.timeSlot?.slotId === slot.slotId
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
              }`}
            >
              <div className="font-medium text-gray-900">
                {new Date(slot.startTime).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })}
              </div>
            </button>
          ))}
        </div>
      )}

      <button
        onClick={() => setCurrentStep('provider')}
        className="mt-6 px-4 py-2 text-gray-600 hover:text-gray-900"
      >
        ← Back to Providers
      </button>
    </div>
  );

  /**
   * Render client info form
   */
  const renderClientInfoForm = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Information</h2>
      <p className="text-gray-600 mb-6">Please provide your contact details</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setCurrentStep('review');
        }}
        className="space-y-4 max-w-md"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name *
          </label>
          <input
            type="text"
            required
            value={bookingData.clientInfo?.firstName || ''}
            onChange={(e) =>
              setBookingData({
                ...bookingData,
                clientInfo: { ...bookingData.clientInfo!, firstName: e.target.value },
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name *
          </label>
          <input
            type="text"
            required
            value={bookingData.clientInfo?.lastName || ''}
            onChange={(e) =>
              setBookingData({
                ...bookingData,
                clientInfo: { ...bookingData.clientInfo!, lastName: e.target.value },
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <input
            type="email"
            required
            value={bookingData.clientInfo?.email || ''}
            onChange={(e) =>
              setBookingData({
                ...bookingData,
                clientInfo: { ...bookingData.clientInfo!, email: e.target.value },
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
          <input
            type="tel"
            required
            value={bookingData.clientInfo?.phone || ''}
            onChange={(e) =>
              setBookingData({
                ...bookingData,
                clientInfo: { ...bookingData.clientInfo!, phone: e.target.value },
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Special Requests (Optional)
          </label>
          <textarea
            rows={3}
            value={bookingData.clientInfo?.notes || ''}
            onChange={(e) =>
              setBookingData({
                ...bookingData,
                clientInfo: { ...bookingData.clientInfo!, notes: e.target.value },
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setCurrentStep('datetime')}
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            ← Back
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Review Booking
          </button>
        </div>
      </form>
    </div>
  );

  /**
   * Render review step
   */
  const renderReview = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Your Booking</h2>
      <p className="text-gray-600 mb-6">Please confirm your appointment details</p>

      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4 max-w-md">
        <div>
          <div className="text-sm text-gray-600">Service</div>
          <div className="font-medium text-gray-900">{bookingData.service?.name}</div>
          <div className="text-sm text-gray-600">
            {bookingData.service?.duration} minutes • ${bookingData.service?.price}
          </div>
        </div>

        {bookingData.provider && (
          <div>
            <div className="text-sm text-gray-600">Provider</div>
            <div className="font-medium text-gray-900">{bookingData.provider.name}</div>
          </div>
        )}

        <div>
          <div className="text-sm text-gray-600">Date & Time</div>
          <div className="font-medium text-gray-900">
            {bookingData.timeSlot &&
              new Date(bookingData.timeSlot.startTime).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
          </div>
          <div className="text-sm text-gray-600">
            {bookingData.timeSlot &&
              new Date(bookingData.timeSlot.startTime).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              })}{' '}
            -{' '}
            {bookingData.timeSlot &&
              new Date(bookingData.timeSlot.endTime).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              })}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="text-sm text-gray-600">Contact Information</div>
          <div className="font-medium text-gray-900">
            {bookingData.clientInfo?.firstName} {bookingData.clientInfo?.lastName}
          </div>
          <div className="text-sm text-gray-600">{bookingData.clientInfo?.email}</div>
          <div className="text-sm text-gray-600">{bookingData.clientInfo?.phone}</div>
        </div>

        {bookingData.clientInfo?.notes && (
          <div>
            <div className="text-sm text-gray-600">Special Requests</div>
            <div className="text-sm text-gray-900">{bookingData.clientInfo.notes}</div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      <div className="flex gap-3 mt-6">
        <button
          onClick={() => setCurrentStep('client-info')}
          className="px-4 py-2 text-gray-600 hover:text-gray-900"
          disabled={loading}
        >
          ← Back
        </button>
        <button
          onClick={submitBooking}
          disabled={loading}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 max-w-xs"
        >
          {loading ? 'Booking...' : 'Confirm Booking'}
        </button>
      </div>
    </div>
  );

  /**
   * Render confirmation step
   */
  const renderConfirmation = () => (
    <div className="text-center max-w-md mx-auto">
      <div className="mb-6">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
      <p className="text-gray-600 mb-6">
        Your appointment has been successfully scheduled. We've sent a confirmation email to{' '}
        {bookingData.clientInfo?.email}
      </p>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <div className="text-sm text-blue-800 mb-1">Appointment Details</div>
        <div className="text-lg font-semibold text-blue-900 mb-2">
          {bookingData.service?.name}
        </div>
        <div className="text-sm text-blue-800">
          {bookingData.timeSlot &&
            new Date(bookingData.timeSlot.startTime).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}{' '}
          at{' '}
          {bookingData.timeSlot &&
            new Date(bookingData.timeSlot.startTime).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            })}
        </div>
      </div>

      <button
        onClick={() => navigate('/scheduling')}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
      >
        View My Appointments
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Progress Bar */}
      {currentStep !== 'confirmation' && (
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex-1 flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    index <= currentStepIndex
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {index + 1}
                </div>
                <div
                  className={`text-xs ml-2 hidden sm:block ${
                    index <= currentStepIndex ? 'text-blue-600' : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 ${
                      index < currentStepIndex ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step Content */}
      <div>{renderStepContent()}</div>
    </div>
  );
}
