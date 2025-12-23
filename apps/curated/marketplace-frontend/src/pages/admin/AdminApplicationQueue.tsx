/**
 * Admin Application Queue Page
 * Feature 011: Vendor Portal MVP
 * Sprint E.2: Admin Tools (Task E.2.1)
 *
 * Admin interface for reviewing vendor applications.
 * Features:
 * - Filterable application list
 * - SLA status indicators
 * - Assignee management
 * - Quick actions
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Download, Settings, AlertCircle, CheckCircle, Clock, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAdminVendorApplicationsQuery, ApplicationStatus } from '../../graphql/generated';

export interface VendorApplication {
  id: string;
  brandName: string;
  contactFirstName: string;
  contactLastName: string;
  contactEmail: string;
  status: ApplicationStatus;
  submittedAt: Date;
  slaDeadline: Date;
  assignee: {
    id: string;
    name: string;
  } | null;
  productCategories: string[];
  values: string[];
}

interface AdminApplicationQueueProps {
  onExport?: () => void;
}

export function AdminApplicationQueue({
  onExport,
}: AdminApplicationQueueProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  const [slaFilter, setSlaFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch applications from GraphQL backend
  const { data, loading, error, refetch } = useAdminVendorApplicationsQuery({
    variables: {
      statusFilter: statusFilter !== 'all' ? (statusFilter as ApplicationStatus) : undefined,
      assigneeFilter: assigneeFilter !== 'all' ? assigneeFilter : undefined,
      limit: 100,
      offset: 0,
    },
  });

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Clock className="h-12 w-12 text-gray-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-medium mb-2">Error loading applications</p>
          <p className="text-gray-600 text-sm">{error.message}</p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Convert GraphQL data to component format
  const applications: VendorApplication[] = (data?.adminVendorApplications || []).map((app) => ({
    id: app.id,
    brandName: app.brandName,
    contactFirstName: app.contactFirstName,
    contactLastName: app.contactLastName,
    contactEmail: app.contactEmail,
    status: app.status,
    submittedAt: new Date(app.submittedAt),
    slaDeadline: new Date(app.slaDeadline || app.submittedAt),
    assignee: app.assignedReviewerId
      ? {
          id: app.assignedReviewerId,
          name: app.assignedReviewerName || 'Unknown',
        }
      : null,
    productCategories: [...app.productCategories],
    values: [...app.values],
  }));

  // Get unique assignees from applications
  const assignees = Array.from(
    new Set(
      applications
        .filter((app) => app.assignee)
        .map((app) => JSON.stringify({ id: app.assignee!.id, name: app.assignee!.name }))
    )
  ).map((str) => JSON.parse(str));

  // Calculate SLA status
  const getSlaStatus = (deadline: Date): 'at-risk' | 'on-time' | 'overdue' => {
    const now = new Date();
    const hoursRemaining = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursRemaining < 0) return 'overdue';
    if (hoursRemaining < 24) return 'at-risk';
    return 'on-time';
  };

  const getSlaText = (deadline: Date): string => {
    const now = new Date();
    const hoursRemaining = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursRemaining < 0) {
      const daysOverdue = Math.ceil(Math.abs(hoursRemaining) / 24);
      return `${daysOverdue} day${daysOverdue !== 1 ? 's' : ''} overdue`;
    }

    const daysRemaining = Math.ceil(hoursRemaining / 24);
    if (daysRemaining === 0) return 'Due today';
    return `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}`;
  };

  // Filter applications
  const filteredApplications = applications.filter((app) => {
    // Status filter
    if (statusFilter !== 'all' && app.status !== statusFilter) return false;

    // Assignee filter
    if (assigneeFilter !== 'all') {
      if (assigneeFilter === 'unassigned' && app.assignee) return false;
      if (assigneeFilter !== 'unassigned' && app.assignee?.id !== assigneeFilter) return false;
    }

    // SLA filter
    if (slaFilter !== 'all') {
      const slaStatus = getSlaStatus(app.slaDeadline);
      if (slaFilter !== slaStatus) return false;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        app.brandName.toLowerCase().includes(query) ||
        app.contactFirstName.toLowerCase().includes(query) ||
        app.contactLastName.toLowerCase().includes(query) ||
        app.contactEmail.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Calculate summary stats
  const pendingCount = applications.filter(
    (app) => app.status === ApplicationStatus.Submitted || app.status === ApplicationStatus.UnderReview
  ).length;

  const atRiskCount = applications.filter(
    (app) =>
      (app.status === ApplicationStatus.Submitted || app.status === ApplicationStatus.UnderReview) &&
      getSlaStatus(app.slaDeadline) === 'at-risk'
  ).length;

  const onTimePercentage = applications.length > 0
    ? Math.round(
        (applications.filter((app) => {
          if (app.status === ApplicationStatus.Submitted || app.status === ApplicationStatus.UnderReview) {
            return getSlaStatus(app.slaDeadline) !== 'overdue';
          }
          return true; // Completed applications are considered on-time
        }).length /
          applications.length) *
          100
      )
    : 100;

  // Get status icon and color
  const getStatusDisplay = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.Submitted:
        return { icon: Clock, text: 'Submitted', color: 'text-gray-600 bg-gray-100' };
      case ApplicationStatus.UnderReview:
        return { icon: Clock, text: 'Under Review', color: 'text-amber-600 bg-amber-100' };
      case ApplicationStatus.AdditionalInfoRequested:
        return { icon: AlertCircle, text: 'Info Requested', color: 'text-blue-600 bg-blue-100' };
      case ApplicationStatus.Approved:
        return { icon: CheckCircle, text: 'Approved', color: 'text-green-600 bg-green-100' };
      case ApplicationStatus.ConditionallyApproved:
        return { icon: CheckCircle, text: 'Conditionally Approved', color: 'text-green-600 bg-green-100' };
      case ApplicationStatus.Rejected:
        return { icon: AlertCircle, text: 'Rejected', color: 'text-red-600 bg-red-100' };
      case ApplicationStatus.Withdrawn:
        return { icon: AlertCircle, text: 'Withdrawn', color: 'text-gray-600 bg-gray-100' };
      default:
        return { icon: AlertCircle, text: 'Unknown', color: 'text-gray-600 bg-gray-100' };
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Application Queue</h1>
              <p className="text-sm text-gray-600 mt-1">Review and manage vendor applications</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onExport}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Settings className="h-4 w-4" />
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All</option>
                <option value={ApplicationStatus.Submitted}>Submitted</option>
                <option value={ApplicationStatus.UnderReview}>Under Review</option>
                <option value={ApplicationStatus.AdditionalInfoRequested}>Info Requested</option>
                <option value={ApplicationStatus.Approved}>Approved</option>
                <option value={ApplicationStatus.Rejected}>Rejected</option>
              </select>
            </div>

            {/* Assignee Filter */}
            <div>
              <label htmlFor="assignee-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Assignee
              </label>
              <select
                id="assignee-filter"
                value={assigneeFilter}
                onChange={(e) => setAssigneeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All</option>
                <option value="unassigned">Unassigned</option>
                {assignees.map((assignee) => (
                  <option key={assignee.id} value={assignee.id}>
                    {assignee.name}
                  </option>
                ))}
              </select>
            </div>

            {/* SLA Filter */}
            <div>
              <label htmlFor="sla-filter" className="block text-sm font-medium text-gray-700 mb-1">
                SLA Status
              </label>
              <select
                id="sla-filter"
                value={slaFilter}
                onChange={(e) => setSlaFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All</option>
                <option value="at-risk">At Risk (&lt; 24hrs)</option>
                <option value="on-time">On Time</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>

            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Brand name, contact..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SLA Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Review</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{pendingCount}</p>
              </div>
              <Clock className="h-10 w-10 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500 mt-2">Under Review</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">At Risk</p>
                <p className="text-3xl font-bold text-red-600 mt-1">{atRiskCount}</p>
              </div>
              <AlertCircle className="h-10 w-10 text-red-400" />
            </div>
            <p className="text-xs text-gray-500 mt-2">&lt; 24 hrs left</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">On-Time Rate</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{onTimePercentage}%</p>
              </div>
              <CheckCircle className="h-10 w-10 text-green-400" />
            </div>
            <p className="text-xs text-gray-500 mt-2">This month</p>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Brand
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assignee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SLA
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No applications found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((app) => {
                    const statusDisplay = getStatusDisplay(app.status);
                    const slaStatus = getSlaStatus(app.slaDeadline);
                    const StatusIcon = statusDisplay.icon;

                    return (
                      <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{app.brandName}</div>
                          <div className="text-sm text-gray-500">{app.contactEmail}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(app.submittedAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={cn(
                              'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
                              statusDisplay.color
                            )}
                          >
                            <StatusIcon className="h-3.5 w-3.5" />
                            {statusDisplay.text}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {app.assignee ? app.assignee.name : <span className="text-gray-400">Unassigned</span>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            {slaStatus === 'overdue' ? (
                              <AlertCircle className="h-4 w-4 text-red-600" />
                            ) : slaStatus === 'at-risk' ? (
                              <AlertCircle className="h-4 w-4 text-amber-600" />
                            ) : (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            )}
                            <span
                              className={cn(
                                'text-sm font-medium',
                                slaStatus === 'overdue'
                                  ? 'text-red-600'
                                  : slaStatus === 'at-risk'
                                  ? 'text-amber-600'
                                  : 'text-green-600'
                              )}
                            >
                              {getSlaText(app.slaDeadline)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            to={`/admin/applications/${app.id}`}
                            className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-900 transition-colors"
                          >
                            Review
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results count */}
        {filteredApplications.length > 0 && (
          <div className="mt-4 text-sm text-gray-600 text-center">
            Showing {filteredApplications.length} of {applications.length} application
            {applications.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
}
