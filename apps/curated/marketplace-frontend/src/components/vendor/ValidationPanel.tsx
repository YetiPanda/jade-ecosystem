/**
 * Validation Panel Component
 * Week 4 Day 5: Display validation results with scores
 */

import { ValidationResult } from '../../utils/productValidation';

interface ValidationPanelProps {
  validation: ValidationResult;
  showDetails?: boolean;
}

export function ValidationPanel({ validation, showDetails = true }: ValidationPanelProps) {
  const { errors, warnings, completenessScore, qualityScore, isValid } = validation;

  const criticalErrors = errors.filter((e) => e.severity === 'error');
  const minorErrors = errors.filter((e) => e.severity === 'warning');

  return (
    <div className="space-y-4">
      {/* Score Cards */}
      <div className="grid grid-cols-2 gap-4">
        <ScoreCard
          title="Completeness"
          score={completenessScore}
          description="Required fields filled"
        />
        <ScoreCard
          title="Quality"
          score={qualityScore}
          description="Content quality"
        />
      </div>

      {/* Overall Status */}
      {isValid ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-green-800 font-medium">
              Ready to submit! All validation checks passed.
            </span>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-yellow-800 font-medium">
              {criticalErrors.length} issue{criticalErrors.length !== 1 ? 's' : ''} need{' '}
              {criticalErrors.length === 1 ? 's' : ''} attention before submission
            </span>
          </div>
        </div>
      )}

      {/* Validation Details */}
      {showDetails && (
        <div className="space-y-3">
          {/* Errors */}
          {criticalErrors.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-red-900">Errors ({criticalErrors.length})</h4>
              {criticalErrors.map((error, index) => (
                <div
                  key={`error-${index}`}
                  className="bg-red-50 border border-red-200 rounded-lg p-3"
                >
                  <div className="flex items-start">
                    <svg
                      className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-900">
                        {formatFieldName(error.field)}
                      </p>
                      <p className="text-sm text-red-700 mt-1">{error.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Warnings */}
          {warnings.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-yellow-900">
                Suggestions ({warnings.length})
              </h4>
              {warnings.map((warning, index) => (
                <div
                  key={`warning-${index}`}
                  className="bg-yellow-50 border border-yellow-200 rounded-lg p-3"
                >
                  <div className="flex items-start">
                    <svg
                      className="w-5 h-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-yellow-900">
                        {formatFieldName(warning.field)}
                      </p>
                      <p className="text-sm text-yellow-700 mt-1">{warning.message}</p>
                      {warning.suggestion && (
                        <p className="text-sm text-yellow-600 mt-2 italic">
                          💡 {warning.suggestion}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* All Clear */}
          {criticalErrors.length === 0 && warnings.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <svg
                className="w-16 h-16 mx-auto text-green-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-lg font-medium text-gray-700">All validations passed!</p>
              <p className="text-sm text-gray-500 mt-2">
                Your product submission looks great.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Score Card Component
function ScoreCard({
  title,
  score,
  description,
}: {
  title: string;
  score: number;
  description: string;
}) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className={`border rounded-lg p-4 ${getScoreBgColor(score)}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{title}</span>
        <span className={`text-2xl font-bold ${getScoreColor(score)}`}>{score}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
          }`}
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="text-xs text-gray-600">{description}</p>
    </div>
  );
}

// Helper function to format field names for display
function formatFieldName(field: string): string {
  // Handle array indices
  const arrayMatch = field.match(/^(\w+)\[(\d+)\]\.(\w+)$/);
  if (arrayMatch) {
    const [, arrayName, index, prop] = arrayMatch;
    return `${formatName(arrayName)} #${parseInt(index) + 1} - ${formatName(prop)}`;
  }

  return formatName(field);
}

function formatName(name: string): string {
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}
