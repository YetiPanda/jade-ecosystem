/**
 * ClientProfile Page Component
 * Phase 4: User Story 2 - Appointment Scheduling & Client Management
 * Task: T119
 *
 * Features:
 * - Client information display
 * - Skin profile and medical history
 * - Complete treatment history
 * - Appointment timeline
 * - Treatment outcomes with photos
 * - Product recommendations
 * - Statistics and analytics
 * - Edit capabilities
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

/**
 * Client data structure
 */
interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: Date;
  skinProfile?: {
    skinType: string;
    concerns: string[];
    allergies: string[];
    sensitivities: string[];
  };
  medicalHistory?: {
    medications: string[];
    conditions: string[];
    allergies: string[];
    contraindications: string[];
    lastUpdated: string;
  };
  consentForms: Array<{
    formType: string;
    signedAt: string;
    expiresAt?: string;
  }>;
  loyaltyPoints: number;
  totalSpent: number;
  notes: string;
  isActive: boolean;
  createdAt: Date;
}

/**
 * Treatment history data
 */
interface TreatmentHistory {
  client: Client;
  appointments: Array<{
    id: string;
    appointmentNumber: string;
    serviceType: string;
    startTime: Date;
    endTime: Date;
    status: string;
    productsUsed: Array<{
      productName: string;
      amountUsed?: string;
    }>;
    treatmentOutcome?: {
      skinConditionBefore: string;
      skinConditionAfter: string;
      productsRecommended: string[];
      homeCarePlan: string;
      clientSatisfactionRating?: number;
    };
  }>;
  totalTreatments: number;
  favoriteServices: string[];
  lastVisit: Date | null;
  lifetimeValue: number;
}

/**
 * Client statistics
 */
interface ClientStatistics {
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  noShowAppointments: number;
  lifetimeValue: number;
  averageSpendPerVisit: number;
  favoriteProvider: string | null;
  favoriteService: string | null;
  lastVisit: Date | null;
  nextAppointment: Date | null;
}

/**
 * ClientProfile Page
 *
 * Comprehensive client profile with treatment history and analytics
 */
export default function ClientProfile() {
  const { clientId } = useParams<{ clientId: string }>();

  // State
  const [client, setClient] = useState<Client | null>(null);
  const [history, setHistory] = useState<TreatmentHistory | null>(null);
  const [statistics, setStatistics] = useState<ClientStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'profile'>('overview');
  const [editMode, setEditMode] = useState(false);

  /**
   * Load client data
   */
  const loadClient = async () => {
    if (!clientId) return;

    setLoading(true);
    try {
      // TODO: Replace with GraphQL queries
      // client query
      // clientTreatmentHistory query
      // clientStatistics query

      // Mock data for now
      setClient(null);
      setHistory(null);
      setStatistics(null);
    } catch (error) {
      console.error('Failed to load client:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load data on mount
   */
  useEffect(() => {
    loadClient();
  }, [clientId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Client Not Found</h2>
          <p className="text-gray-600 mb-6">
            The client you're looking for doesn't exist or has been deleted.
          </p>
          <Link
            to="/scheduling/clients"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            ← Back to Clients
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/scheduling/clients"
          className="text-sm text-blue-600 hover:text-blue-700 mb-2 inline-flex items-center"
        >
          ← Back to Clients
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {client.firstName} {client.lastName}
            </h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <span>{client.email}</span>
              <span>•</span>
              <span>{client.phone}</span>
              <span>•</span>
              <span>Client since {new Date(client.createdAt).getFullYear()}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setEditMode(!editMode)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
            >
              {editMode ? 'Cancel' : 'Edit Profile'}
            </button>
            <Link
              to={`/scheduling/book?clientId=${client.id}`}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Book Appointment
            </Link>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Lifetime Value</div>
            <div className="text-3xl font-bold text-gray-900">
              ${statistics.lifetimeValue.toFixed(0)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              ${statistics.averageSpendPerVisit.toFixed(0)} avg/visit
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Total Visits</div>
            <div className="text-3xl font-bold text-gray-900">
              {statistics.totalAppointments}
            </div>
            <div className="text-xs text-green-600 mt-1">
              {statistics.completedAppointments} completed
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Loyalty Points</div>
            <div className="text-3xl font-bold text-purple-600">{client.loyaltyPoints}</div>
            <div className="text-xs text-gray-500 mt-1">Redeemable now</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Last Visit</div>
            <div className="text-lg font-semibold text-gray-900">
              {statistics.lastVisit
                ? new Date(statistics.lastVisit).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })
                : 'Never'}
            </div>
            {statistics.nextAppointment && (
              <div className="text-xs text-blue-600 mt-1">
                Next: {new Date(statistics.nextAppointment).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Treatment History
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Health Profile
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Favorite Services */}
              {history && history.favoriteServices.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Favorite Services
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {history.favoriteServices.map((service) => (
                      <span
                        key={service}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Skin Profile</h3>
                  {client.skinProfile ? (
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">Skin Type:</span>{' '}
                        <span className="font-medium text-gray-900">
                          {client.skinProfile.skinType}
                        </span>
                      </div>
                      {client.skinProfile.concerns.length > 0 && (
                        <div>
                          <span className="text-gray-600">Concerns:</span>{' '}
                          <span className="text-gray-900">
                            {client.skinProfile.concerns.join(', ')}
                          </span>
                        </div>
                      )}
                      {client.skinProfile.allergies.length > 0 && (
                        <div>
                          <span className="text-gray-600">Allergies:</span>{' '}
                          <span className="text-red-600 font-medium">
                            {client.skinProfile.allergies.join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No skin profile recorded</p>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Medical Information
                  </h3>
                  {client.medicalHistory ? (
                    <div className="space-y-2 text-sm">
                      {client.medicalHistory.medications.length > 0 && (
                        <div>
                          <span className="text-gray-600">Medications:</span>{' '}
                          <span className="text-gray-900">
                            {client.medicalHistory.medications.join(', ')}
                          </span>
                        </div>
                      )}
                      {client.medicalHistory.conditions.length > 0 && (
                        <div>
                          <span className="text-gray-600">Conditions:</span>{' '}
                          <span className="text-gray-900">
                            {client.medicalHistory.conditions.join(', ')}
                          </span>
                        </div>
                      )}
                      <div className="text-xs text-gray-500 mt-2">
                        Last updated:{' '}
                        {new Date(client.medicalHistory.lastUpdated).toLocaleDateString()}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No medical history recorded</p>
                  )}
                </div>
              </div>

              {/* Consent Forms */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Consent Forms</h3>
                {client.consentForms.length > 0 ? (
                  <div className="space-y-2">
                    {client.consentForms.map((form, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <div className="font-medium text-gray-900">{form.formType}</div>
                          <div className="text-xs text-gray-600">
                            Signed: {new Date(form.signedAt).toLocaleDateString()}
                          </div>
                        </div>
                        {form.expiresAt && (
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              new Date(form.expiresAt) > new Date()
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {new Date(form.expiresAt) > new Date()
                              ? 'Valid'
                              : 'Expired'}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No consent forms on file</p>
                )}
              </div>

              {/* Notes */}
              {client.notes && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Notes</h3>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {client.notes}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && history && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Treatment History ({history.totalTreatments} total)
                </h3>
              </div>

              {history.appointments.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No treatment history yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {history.appointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {appointment.serviceType}
                          </h4>
                          <div className="text-sm text-gray-600">
                            {new Date(appointment.startTime).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </div>
                        </div>
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                          {appointment.status}
                        </span>
                      </div>

                      {appointment.treatmentOutcome && (
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-gray-600">Before:</span>{' '}
                            <span className="text-gray-900">
                              {appointment.treatmentOutcome.skinConditionBefore}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">After:</span>{' '}
                            <span className="text-gray-900">
                              {appointment.treatmentOutcome.skinConditionAfter}
                            </span>
                          </div>
                          {appointment.treatmentOutcome.clientSatisfactionRating && (
                            <div>
                              <span className="text-gray-600">Satisfaction:</span>{' '}
                              <span className="text-yellow-600">
                                {'★'.repeat(
                                  appointment.treatmentOutcome.clientSatisfactionRating
                                )}
                                {'☆'.repeat(
                                  5 - appointment.treatmentOutcome.clientSatisfactionRating
                                )}
                              </span>
                            </div>
                          )}
                          {appointment.treatmentOutcome.productsRecommended.length > 0 && (
                            <div>
                              <span className="text-gray-600">Recommended Products:</span>{' '}
                              <span className="text-gray-900">
                                {appointment.treatmentOutcome.productsRecommended.join(', ')}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {appointment.productsUsed.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="text-xs text-gray-600 mb-1">Products Used:</div>
                          <div className="flex flex-wrap gap-2">
                            {appointment.productsUsed.map((product, idx) => (
                              <span
                                key={idx}
                                className="text-xs bg-gray-100 px-2 py-1 rounded"
                              >
                                {product.productName}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="max-w-2xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Complete Health Profile
              </h3>
              {/* This would contain edit forms for skin profile and medical history */}
              <p className="text-gray-500">
                Edit functionality coming soon. Use the Edit Profile button to update client
                information.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
