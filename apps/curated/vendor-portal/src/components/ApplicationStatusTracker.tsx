/**
 * ApplicationStatusTracker - Shows applicant-facing application status
 * Sprint E.1 - Application & Onboarding
 */

import {
  VendorApplication,
  ApplicationStatus,
  getApplicationStatusColor,
  getApplicationStatusLabel,
  formatSLADeadline,
  isSLAAtRisk,
  isSLABreached,
} from '../types/application';
import './ApplicationStatusTracker.css';

interface ApplicationStatusTrackerProps {
  application: VendorApplication;
}

export function ApplicationStatusTracker({ application }: ApplicationStatusTrackerProps) {
  const statusColor = getApplicationStatusColor(application.status);
  const statusLabel = getApplicationStatusLabel(application.status);

  // Timeline steps
  const timelineSteps = [
    {
      label: 'Submitted',
      date: application.submittedAt,
      status: 'completed' as const,
    },
    {
      label: 'Under Review',
      date: application.reviewStartedAt,
      status:
        application.status === ApplicationStatus.UNDER_REVIEW ||
        application.status === ApplicationStatus.ADDITIONAL_INFO_REQUESTED ||
        application.decidedAt
          ? ('completed' as const)
          : ('pending' as const),
    },
    {
      label: 'Decision',
      date: application.decidedAt,
      status: application.decidedAt ? ('completed' as const) : ('pending' as const),
    },
  ];

  const getNextStepMessage = () => {
    switch (application.status) {
      case ApplicationStatus.SUBMITTED:
        return 'Your application has been received and is in the queue for review. Our team will begin reviewing it shortly.';
      case ApplicationStatus.UNDER_REVIEW:
        return `Our curation team is currently reviewing your application. Estimated decision by ${formatSLADeadline(application.slaDeadline)}.`;
      case ApplicationStatus.ADDITIONAL_INFO_REQUESTED:
        return 'We need some additional information to complete our review. Please check the notes below and respond as soon as possible.';
      case ApplicationStatus.APPROVED:
        return "Congratulations! Your application has been approved. You'll receive onboarding instructions via email shortly.";
      case ApplicationStatus.CONDITIONALLY_APPROVED:
        return 'Your application has been conditionally approved. Please complete the requirements listed below to finalize your approval.';
      case ApplicationStatus.REJECTED:
        return "We appreciate your interest in Jade Marketplace. After careful review, we've decided not to move forward at this time. See notes below for feedback.";
      case ApplicationStatus.WITHDRAWN:
        return 'This application has been withdrawn.';
      default:
        return 'Your application is being processed.';
    }
  };

  const showSLAWarning =
    application.slaDeadline &&
    !application.decidedAt &&
    (isSLAAtRisk(application.slaDeadline) || isSLABreached(application.slaDeadline));

  return (
    <div className="application-status-tracker">
      {/* Status Header */}
      <div className="status-header">
        <div className="status-badge" style={{ backgroundColor: statusColor }}>
          {statusLabel}
        </div>
        <div className="application-id">Application #{application.applicationId}</div>
      </div>

      {/* Next Step Message */}
      <div className="next-step-message">
        <div className="message-icon">ℹ️</div>
        <p>{getNextStepMessage()}</p>
      </div>

      {/* SLA Warning */}
      {showSLAWarning && (
        <div className={`sla-warning ${isSLABreached(application.slaDeadline) ? 'breached' : 'at-risk'}`}>
          <div className="warning-icon">⚠️</div>
          <div>
            <strong>
              {isSLABreached(application.slaDeadline)
                ? 'Review deadline exceeded'
                : 'Review deadline approaching'}
            </strong>
            <p>
              Decision target: {formatSLADeadline(application.slaDeadline)}. Our team is
              working to provide a decision as soon as possible.
            </p>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="status-timeline">
        <h3>Application Timeline</h3>
        <div className="timeline">
          {timelineSteps.map((step, index) => (
            <div
              key={index}
              className={`timeline-step ${step.status}`}
            >
              <div className="timeline-marker">
                {step.status === 'completed' ? '✓' : index + 1}
              </div>
              <div className="timeline-content">
                <div className="timeline-label">{step.label}</div>
                {step.date && (
                  <div className="timeline-date">
                    {new Date(step.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </div>
                )}
              </div>
              {index < timelineSteps.length - 1 && (
                <div className={`timeline-connector ${step.status === 'completed' ? 'completed' : ''}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Review Notes (if any) */}
      {application.reviewNotes && application.reviewNotes.length > 0 && (
        <div className="review-notes-section">
          <h3>Reviewer Notes</h3>
          <div className="review-notes">
            {application.reviewNotes.map((note, index) => (
              <div key={index} className="review-note">
                <div className="note-header">
                  <div className="note-category" data-category={note.category}>
                    {note.category.replace(/_/g, ' ').toUpperCase()}
                  </div>
                  <div className="note-date">
                    {new Date(note.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
                <div className="note-content">{note.note}</div>
                <div className="note-author">— {note.reviewerName}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Application Details Summary */}
      <div className="application-summary">
        <h3>Application Summary</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-label">Brand Name</span>
            <span className="summary-value">{application.companyInfo.brandName}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Submitted By</span>
            <span className="summary-value">
              {application.contactInfo.firstName} {application.contactInfo.lastName}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Product Categories</span>
            <span className="summary-value">
              {application.productInfo.productCategories.join(', ')}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Values Selected</span>
            <span className="summary-value">{application.values.length} values</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Certifications</span>
            <span className="summary-value">{application.certifications.length} certifications</span>
          </div>
        </div>
      </div>

      {/* Contact Support */}
      <div className="support-section">
        <h3>Need Help?</h3>
        <p>
          If you have questions about your application status, please contact our vendor
          success team at{' '}
          <a href="mailto:vendors@jade.com">vendors@jade.com</a>
        </p>
      </div>
    </div>
  );
}
