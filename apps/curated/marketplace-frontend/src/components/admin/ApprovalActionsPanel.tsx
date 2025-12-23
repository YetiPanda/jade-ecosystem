/**
 * Approval Actions Panel Component
 * Feature 011: Vendor Portal MVP
 * Sprint E.2: Admin Tools (Tasks E.2.6, E.2.7, E.2.8)
 *
 * Provides action buttons and forms for admin decisions:
 * - Approve with notes (E.2.7)
 * - Conditionally approve with conditions
 * - Reject with reason (E.2.8)
 * - Request additional information
 */

import { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Mail, Plus, X } from 'lucide-react';
import { cn } from '../../lib/utils';

type ActionType = 'approve' | 'conditional_approve' | 'reject' | 'request_info' | null;

interface ApprovalActionsPanelProps {
  applicationId: string;
  brandName: string;
  onApprove: (notes?: string) => Promise<void>;
  onConditionallyApprove: (conditions: string[], notes?: string) => Promise<void>;
  onReject: (reason: string) => Promise<void>;
  onRequestInfo: (details: string) => Promise<void>;
}

export function ApprovalActionsPanel({
  applicationId,
  brandName,
  onApprove,
  onConditionallyApprove,
  onReject,
  onRequestInfo,
}: ApprovalActionsPanelProps) {
  const [selectedAction, setSelectedAction] = useState<ActionType>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Approval form state
  const [approvalNotes, setApprovalNotes] = useState('');

  // Conditional approval form state
  const [conditions, setConditions] = useState<string[]>(['']);
  const [conditionalNotes, setConditionalNotes] = useState('');

  // Rejection form state
  const [rejectionReason, setRejectionReason] = useState('');

  // Request info form state
  const [infoRequest, setInfoRequest] = useState('');

  const handleSubmit = async () => {
    if (!selectedAction) return;

    setIsSubmitting(true);
    try {
      switch (selectedAction) {
        case 'approve':
          await onApprove(approvalNotes || undefined);
          break;

        case 'conditional_approve':
          const validConditions = conditions.filter((c) => c.trim().length > 0);
          if (validConditions.length === 0) {
            alert('Please add at least one condition');
            setIsSubmitting(false);
            return;
          }
          await onConditionallyApprove(validConditions, conditionalNotes || undefined);
          break;

        case 'reject':
          if (!rejectionReason.trim()) {
            alert('Please provide a rejection reason');
            setIsSubmitting(false);
            return;
          }
          await onReject(rejectionReason);
          break;

        case 'request_info':
          if (!infoRequest.trim()) {
            alert('Please specify what information is needed');
            setIsSubmitting(false);
            return;
          }
          await onRequestInfo(infoRequest);
          break;
      }

      // Reset form on success
      setSelectedAction(null);
      setApprovalNotes('');
      setConditions(['']);
      setConditionalNotes('');
      setRejectionReason('');
      setInfoRequest('');
    } catch (error) {
      console.error('Error submitting decision:', error);
      alert('Failed to submit decision. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setSelectedAction(null);
    setApprovalNotes('');
    setConditions(['']);
    setConditionalNotes('');
    setRejectionReason('');
    setInfoRequest('');
  };

  const addCondition = () => {
    setConditions([...conditions, '']);
  };

  const removeCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const updateCondition = (index: number, value: string) => {
    const updated = [...conditions];
    updated[index] = value;
    setConditions(updated);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Decision</h3>

      {!selectedAction ? (
        // Action selection buttons
        <div className="space-y-3">
          <button
            onClick={() => setSelectedAction('approve')}
            className="w-full flex items-center justify-between p-4 border-2 border-green-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all group"
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div className="text-left">
                <p className="font-semibold text-gray-900">Approve</p>
                <p className="text-sm text-gray-600">Accept application without conditions</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setSelectedAction('conditional_approve')}
            className="w-full flex items-center justify-between p-4 border-2 border-amber-200 rounded-lg hover:border-amber-400 hover:bg-amber-50 transition-all group"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-amber-600" />
              <div className="text-left">
                <p className="font-semibold text-gray-900">Conditionally Approve</p>
                <p className="text-sm text-gray-600">Approve with conditions to address during onboarding</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setSelectedAction('request_info')}
            className="w-full flex items-center justify-between p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all group"
          >
            <div className="flex items-center gap-3">
              <Mail className="h-6 w-6 text-blue-600" />
              <div className="text-left">
                <p className="font-semibold text-gray-900">Request Information</p>
                <p className="text-sm text-gray-600">Ask vendor for additional details</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setSelectedAction('reject')}
            className="w-full flex items-center justify-between p-4 border-2 border-red-200 rounded-lg hover:border-red-400 hover:bg-red-50 transition-all group"
          >
            <div className="flex items-center gap-3">
              <XCircle className="h-6 w-6 text-red-600" />
              <div className="text-left">
                <p className="font-semibold text-gray-900">Reject</p>
                <p className="text-sm text-gray-600">Decline this application</p>
              </div>
            </div>
          </button>
        </div>
      ) : (
        // Action forms
        <div className="space-y-4">
          {/* Approve Form */}
          {selectedAction === 'approve' && (
            <>
              <div
                className={cn('p-4 rounded-lg border-2', 'bg-green-50 border-green-200')}
              >
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h4 className="font-semibold text-green-900">Approve {brandName}</h4>
                </div>
                <p className="text-sm text-green-800">
                  This will approve the application and trigger the onboarding process.
                </p>
              </div>

              <div>
                <label htmlFor="approval-notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Internal Notes (Optional)
                </label>
                <textarea
                  id="approval-notes"
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Add any notes about this approval..."
                />
                <p className="text-xs text-gray-500 mt-1">These notes are for internal tracking only.</p>
              </div>
            </>
          )}

          {/* Conditional Approve Form */}
          {selectedAction === 'conditional_approve' && (
            <>
              <div className="p-4 rounded-lg border-2 bg-amber-50 border-amber-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                  <h4 className="font-semibold text-amber-900">Conditionally Approve {brandName}</h4>
                </div>
                <p className="text-sm text-amber-800">
                  List conditions that must be addressed during onboarding. The vendor will see these conditions.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Conditions <span className="text-red-600">*</span>
                </label>
                <div className="space-y-2">
                  {conditions.map((condition, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={condition}
                        onChange={(e) => updateCondition(index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder={`Condition ${index + 1}...`}
                      />
                      {conditions.length > 1 && (
                        <button
                          onClick={() => removeCondition(index)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={addCondition}
                  className="mt-2 flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700"
                >
                  <Plus className="h-4 w-4" />
                  Add another condition
                </button>
              </div>

              <div>
                <label htmlFor="conditional-notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Internal Notes (Optional)
                </label>
                <textarea
                  id="conditional-notes"
                  value={conditionalNotes}
                  onChange={(e) => setConditionalNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Add any notes about this conditional approval..."
                />
              </div>
            </>
          )}

          {/* Reject Form */}
          {selectedAction === 'reject' && (
            <>
              <div className="p-4 rounded-lg border-2 bg-red-50 border-red-200">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <h4 className="font-semibold text-red-900">Reject {brandName}</h4>
                </div>
                <p className="text-sm text-red-800">
                  This will reject the application. The vendor will receive the rejection reason.
                </p>
              </div>

              <div>
                <label htmlFor="rejection-reason" className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason <span className="text-red-600">*</span>
                </label>
                <textarea
                  id="rejection-reason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Explain why this application is being rejected..."
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Be professional and specific. This will be sent to the vendor.
                </p>
              </div>
            </>
          )}

          {/* Request Info Form */}
          {selectedAction === 'request_info' && (
            <>
              <div className="p-4 rounded-lg border-2 bg-blue-50 border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-900">Request Information from {brandName}</h4>
                </div>
                <p className="text-sm text-blue-800">
                  Ask the vendor to provide additional information. Review will resume after they respond.
                </p>
              </div>

              <div>
                <label htmlFor="info-request" className="block text-sm font-medium text-gray-700 mb-2">
                  What information do you need? <span className="text-red-600">*</span>
                </label>
                <textarea
                  id="info-request"
                  value={infoRequest}
                  onChange={(e) => setInfoRequest(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe what additional information or clarification is needed..."
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Be specific about what's needed. This will be sent to the vendor via email.
                </p>
              </div>
            </>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={cn(
                'flex-1 px-6 py-2 rounded-lg font-semibold transition-all',
                selectedAction === 'approve'
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : selectedAction === 'conditional_approve'
                  ? 'bg-amber-600 text-white hover:bg-amber-700'
                  : selectedAction === 'reject'
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : selectedAction === 'request_info'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500',
                isSubmitting && 'opacity-50 cursor-not-allowed'
              )}
            >
              {isSubmitting ? (
                'Submitting...'
              ) : selectedAction === 'approve' ? (
                'Approve Application'
              ) : selectedAction === 'conditional_approve' ? (
                'Conditionally Approve'
              ) : selectedAction === 'reject' ? (
                'Reject Application'
              ) : selectedAction === 'request_info' ? (
                'Send Information Request'
              ) : (
                'Submit'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
