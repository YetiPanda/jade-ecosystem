/**
 * ApprovalActionsPanel - Admin approval/rejection interface
 * Sprint E.2 - Admin Tools
 */

import { useState } from 'react';
import { ApprovalDecision } from '../types/admin';
import './ApprovalActionsPanel.css';

interface ApprovalActionsPanelProps {
  applicationId: string;
  onSubmit: (decision: ApprovalDecision) => void;
  isSubmitting?: boolean;
}

export function ApprovalActionsPanel({
  applicationId,
  onSubmit,
  isSubmitting = false,
}: ApprovalActionsPanelProps) {
  const [activeAction, setActiveAction] = useState<
    'approve' | 'conditionally_approve' | 'reject' | 'request_info' | null
  >(null);
  const [reviewerNotes, setReviewerNotes] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [conditions, setConditions] = useState<string[]>([]);
  const [newCondition, setNewCondition] = useState('');

  const handleAddCondition = () => {
    if (newCondition.trim()) {
      setConditions([...conditions, newCondition.trim()]);
      setNewCondition('');
    }
  };

  const handleRemoveCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!activeAction) return;

    const decision: ApprovalDecision = {
      applicationId,
      decision: activeAction,
      reviewerNotes: reviewerNotes.trim(),
      conditions:
        activeAction === 'conditionally_approve' && conditions.length > 0
          ? conditions
          : undefined,
      internalNotes: internalNotes.trim() || undefined,
    };

    onSubmit(decision);
  };

  const canSubmit = activeAction && reviewerNotes.trim().length > 0;

  return (
    <div className="approval-actions-panel">
      {/* Header */}
      <div className="panel-header">
        <h3>Review Decision</h3>
        <p>Select an action and provide notes for the applicant</p>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button
          className={`action-btn approve ${activeAction === 'approve' ? 'active' : ''}`}
          onClick={() => setActiveAction('approve')}
          disabled={isSubmitting}
        >
          <span className="btn-icon">✓</span>
          <span className="btn-label">Approve</span>
        </button>

        <button
          className={`action-btn conditional ${activeAction === 'conditionally_approve' ? 'active' : ''}`}
          onClick={() => setActiveAction('conditionally_approve')}
          disabled={isSubmitting}
        >
          <span className="btn-icon">⚠</span>
          <span className="btn-label">Conditional Approval</span>
        </button>

        <button
          className={`action-btn request-info ${activeAction === 'request_info' ? 'active' : ''}`}
          onClick={() => setActiveAction('request_info')}
          disabled={isSubmitting}
        >
          <span className="btn-icon">?</span>
          <span className="btn-label">Request Info</span>
        </button>

        <button
          className={`action-btn reject ${activeAction === 'reject' ? 'active' : ''}`}
          onClick={() => setActiveAction('reject')}
          disabled={isSubmitting}
        >
          <span className="btn-icon">✕</span>
          <span className="btn-label">Reject</span>
        </button>
      </div>

      {/* Decision Form */}
      {activeAction && (
        <div className="decision-form">
          {/* Reviewer Notes (Visible to Applicant) */}
          <div className="form-section">
            <label htmlFor="reviewerNotes">
              Notes for Applicant <span className="required">*</span>
            </label>
            <p className="field-description">
              This will be visible to the applicant. Be professional and constructive.
            </p>
            <textarea
              id="reviewerNotes"
              rows={5}
              placeholder={
                activeAction === 'approve'
                  ? 'Congratulations! Your application has been approved because...'
                  : activeAction === 'reject'
                  ? 'Thank you for your interest. After careful review, we have decided...'
                  : 'We need some additional information to complete our review...'
              }
              value={reviewerNotes}
              onChange={(e) => setReviewerNotes(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Conditions (For Conditional Approval) */}
          {activeAction === 'conditionally_approve' && (
            <div className="form-section">
              <label>Approval Conditions</label>
              <p className="field-description">
                List specific requirements that must be met before final approval
              </p>
              <div className="conditions-input">
                <input
                  type="text"
                  placeholder="Add a condition (e.g., Submit insurance certificate)"
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCondition()}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="add-condition-btn"
                  onClick={handleAddCondition}
                  disabled={!newCondition.trim() || isSubmitting}
                >
                  Add
                </button>
              </div>
              {conditions.length > 0 && (
                <ul className="conditions-list">
                  {conditions.map((condition, index) => (
                    <li key={index}>
                      <span>{condition}</span>
                      <button
                        type="button"
                        className="remove-condition-btn"
                        onClick={() => handleRemoveCondition(index)}
                        disabled={isSubmitting}
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Internal Notes (Not Visible to Applicant) */}
          <div className="form-section">
            <label htmlFor="internalNotes">Internal Notes (Optional)</label>
            <p className="field-description">
              These notes are for internal use only and will not be visible to the applicant
            </p>
            <textarea
              id="internalNotes"
              rows={3}
              placeholder="Internal observations, follow-up actions, etc."
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          {/* Submit Button */}
          <div className="submit-section">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setActiveAction(null)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="submit-decision-btn"
              onClick={handleSubmit}
              disabled={!canSubmit || isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : `Submit ${activeAction.replace(/_/g, ' ')}`}
            </button>
          </div>
        </div>
      )}

      {/* No Action Selected */}
      {!activeAction && (
        <div className="no-action-message">
          <p>Select an action above to begin your review</p>
        </div>
      )}
    </div>
  );
}
