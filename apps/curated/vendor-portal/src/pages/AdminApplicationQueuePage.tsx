/**
 * AdminApplicationQueuePage - Application review queue
 * Sprint E.2 - Admin Tools
 */

import { ApplicationStatus } from '../types/application';
import {
  ApplicationQueueItem,
  getSLAStatus,
} from '../types/admin';
import {
  getApplicationStatusColor,
  getApplicationStatusLabel,
  formatSLADeadline,
} from '../types/application';
import './Page.css';
import './AdminApplicationQueuePage.css';

export function AdminApplicationQueuePage() {

  // Mock queue data
  const mockQueue: ApplicationQueueItem[] = [
    {
      applicationId: 'APP-2025-001',
      brandName: 'GlowNaturals',
      contactName: 'Jane Smith',
      status: ApplicationStatus.UNDER_REVIEW,
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      slaDeadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      riskScore: 25,
      assignedReviewer: 'Sarah Chen',
    },
    {
      applicationId: 'APP-2025-002',
      brandName: 'PureEssence Botanicals',
      contactName: 'Michael Johnson',
      status: ApplicationStatus.SUBMITTED,
      submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      slaDeadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      riskScore: 45,
    },
    {
      applicationId: 'APP-2025-003',
      brandName: 'Zenith Spa Products',
      contactName: 'Lisa Rodriguez',
      status: ApplicationStatus.UNDER_REVIEW,
      submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      slaDeadline: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000),
      riskScore: 15,
      assignedReviewer: 'David Park',
    },
  ];

  const getRiskLevel = (score: number) => {
    if (score >= 50) return { level: 'critical', color: '#ef4444' };
    if (score >= 30) return { level: 'high', color: '#f59e0b' };
    if (score >= 15) return { level: 'medium', color: '#eab308' };
    return { level: 'low', color: '#22c55e' };
  };

  return (
    <div className="page admin-application-queue-page">
      <div className="page-header">
        <div>
          <h1>Application Queue</h1>
          <p>Review and manage vendor applications</p>
        </div>
      </div>

      {/* Stats */}
      <div className="queue-stats">
        <div className="stat-card">
          <div className="stat-value">{mockQueue.length}</div>
          <div className="stat-label">Total Applications</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {mockQueue.filter((app) => app.status === ApplicationStatus.SUBMITTED).length}
          </div>
          <div className="stat-label">Pending Review</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {mockQueue.filter((app) => getSLAStatus(app.slaDeadline) === 'at_risk').length}
          </div>
          <div className="stat-label">At Risk</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {mockQueue.filter((app) => getSLAStatus(app.slaDeadline) === 'breached').length}
          </div>
          <div className="stat-label">SLA Breached</div>
        </div>
      </div>

      {/* Queue Table */}
      <div className="queue-table-container">
        <table className="queue-table">
          <thead>
            <tr>
              <th>Application ID</th>
              <th>Brand Name</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Risk Score</th>
              <th>SLA Deadline</th>
              <th>Assignee</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockQueue.map((app) => {
              const slaStatus = getSLAStatus(app.slaDeadline);
              const risk = getRiskLevel(app.riskScore);

              return (
                <tr key={app.applicationId} className={`sla-${slaStatus}`}>
                  <td className="app-id">{app.applicationId}</td>
                  <td className="brand-name">{app.brandName}</td>
                  <td>{app.contactName}</td>
                  <td>
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getApplicationStatusColor(app.status) }}
                    >
                      {getApplicationStatusLabel(app.status)}
                    </span>
                  </td>
                  <td>
                    <div className="risk-score" style={{ color: risk.color }}>
                      {app.riskScore}
                      <span className="risk-level">{risk.level}</span>
                    </div>
                  </td>
                  <td>
                    <div className={`sla-cell ${slaStatus}`}>
                      {formatSLADeadline(app.slaDeadline)}
                    </div>
                  </td>
                  <td>
                    {app.assignedReviewer ? (
                      <div className="assignee">{app.assignedReviewer}</div>
                    ) : (
                      <span className="unassigned">Unassigned</span>
                    )}
                  </td>
                  <td>
                    <button className="review-btn">Review</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
