/**
 * OnboardingChecklist - Vendor onboarding progress tracker
 * Sprint E.1 - Application & Onboarding
 */

import {
  VendorOnboarding,
  OnboardingStep,
  calculateOnboardingProgress,
  getNextPendingStep,
  estimateTimeRemaining,
} from '../types/application';
import './OnboardingChecklist.css';

interface OnboardingChecklistProps {
  onboarding: VendorOnboarding;
  onStepClick?: (step: OnboardingStep) => void;
}

export function OnboardingChecklist({ onboarding, onStepClick }: OnboardingChecklistProps) {
  const progressPercent = calculateOnboardingProgress(onboarding.steps);
  const nextStep = getNextPendingStep(onboarding.steps);
  const timeRemaining = estimateTimeRemaining(onboarding.steps);

  const getStepIcon = (step: OnboardingStep) => {
    switch (step.status) {
      case 'completed':
        return '✓';
      case 'in_progress':
        return '⟳';
      case 'skipped':
        return '⊘';
      default:
        return step.order;
    }
  };

  const getStatusColor = (step: OnboardingStep) => {
    switch (step.status) {
      case 'completed':
        return '#22c55e';
      case 'in_progress':
        return '#646cff';
      case 'skipped':
        return '#888';
      default:
        return '#333';
    }
  };

  const formatTimeRemaining = () => {
    if (timeRemaining < 60) {
      return `${timeRemaining} minutes`;
    }
    const hours = Math.floor(timeRemaining / 60);
    const minutes = timeRemaining % 60;
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours} hours`;
  };

  return (
    <div className="onboarding-checklist">
      {/* Header */}
      <div className="checklist-header">
        <div className="header-content">
          <h2>Welcome to Jade! 🎉</h2>
          <p>
            Complete these {onboarding.totalSteps} steps to go live and start receiving orders
            from spas.
          </p>
        </div>

        {/* Progress Circle */}
        <div className="progress-circle">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="#333"
              strokeWidth="8"
            />
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="#22c55e"
              strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 52}`}
              strokeDashoffset={`${2 * Math.PI * 52 * (1 - progressPercent / 100)}`}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
            />
          </svg>
          <div className="progress-text">
            <div className="progress-value">{progressPercent}%</div>
            <div className="progress-label">Complete</div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="stats-row">
        <div className="stat-item">
          <div className="stat-value">{onboarding.completedSteps}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{onboarding.totalSteps - onboarding.completedSteps}</div>
          <div className="stat-label">Remaining</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{formatTimeRemaining()}</div>
          <div className="stat-label">Est. Time</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">
            {new Date(onboarding.targetCompletionDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </div>
          <div className="stat-label">Target Date</div>
        </div>
      </div>

      {/* Next Step Highlight */}
      {nextStep && (
        <div className="next-step-highlight">
          <div className="next-step-icon">→</div>
          <div className="next-step-content">
            <div className="next-step-label">Next Step</div>
            <div className="next-step-name">{nextStep.name}</div>
            <div className="next-step-description">{nextStep.description}</div>
          </div>
          {onStepClick && (
            <button className="next-step-btn" onClick={() => onStepClick(nextStep)}>
              Start Now
            </button>
          )}
        </div>
      )}

      {/* Checklist Steps */}
      <div className="checklist-steps">
        {onboarding.steps
          .sort((a, b) => a.order - b.order)
          .map((step) => (
            <div
              key={step.stepId}
              className={`checklist-step ${step.status} ${!step.isRequired ? 'optional' : ''}`}
              onClick={() => onStepClick && onStepClick(step)}
              style={{ cursor: onStepClick ? 'pointer' : 'default' }}
            >
              <div className="step-left">
                <div
                  className="step-icon"
                  style={{
                    backgroundColor: getStatusColor(step),
                    borderColor: getStatusColor(step),
                  }}
                >
                  {getStepIcon(step)}
                </div>
                <div className="step-content">
                  <div className="step-name">
                    {step.name}
                    {!step.isRequired && <span className="optional-badge">Optional</span>}
                  </div>
                  <div className="step-description">{step.description}</div>
                  {step.completedAt && (
                    <div className="step-completion-time">
                      Completed on{' '}
                      {new Date(step.completedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="step-right">
                {step.estimatedMinutes && step.status !== 'completed' && (
                  <div className="step-time">~{step.estimatedMinutes}min</div>
                )}
                {step.status === 'completed' && <div className="step-status-text">Done</div>}
                {step.status === 'in_progress' && (
                  <div className="step-status-text in-progress">In Progress</div>
                )}
                {step.resources && step.resources.length > 0 && (
                  <div className="step-resources">
                    {step.resources.map((resource, index) => (
                      <a
                        key={index}
                        href={resource.url}
                        className="resource-link"
                        onClick={(e) => e.stopPropagation()}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {resource.type === 'guide' && '📖'}
                        {resource.type === 'video' && '🎥'}
                        {resource.type === 'template' && '📄'}
                        {resource.type === 'link' && '🔗'}
                        <span className="resource-title">{resource.title}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>

      {/* Success Manager */}
      {onboarding.assignedSuccessManager && (
        <div className="success-manager-card">
          <div className="manager-icon">👤</div>
          <div className="manager-content">
            <h3>Your Success Manager</h3>
            <p className="manager-name">{onboarding.assignedSuccessManager}</p>
            <p className="manager-message">
              I'm here to help you get up and running. Feel free to reach out if you have
              any questions!
            </p>
          </div>
          {onboarding.supportThreadId && (
            <a href={`/messages/${onboarding.supportThreadId}`} className="contact-manager-btn">
              Send Message
            </a>
          )}
        </div>
      )}

      {/* Completion Message */}
      {progressPercent === 100 && (
        <div className="completion-message">
          <div className="completion-icon">🎊</div>
          <h3>Onboarding Complete!</h3>
          <p>
            Congratulations! Your profile is now live and visible to spas across the
            marketplace. Get ready to receive your first orders!
          </p>
          <button className="view-profile-btn">View Your Live Profile</button>
        </div>
      )}
    </div>
  );
}
