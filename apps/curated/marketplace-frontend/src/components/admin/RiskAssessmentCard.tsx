/**
 * Risk Assessment Card Component
 * Feature 011: Vendor Portal MVP
 * Sprint E.2: Admin Tools (Task E.2.9)
 *
 * Displays automated risk assessment for vendor applications.
 * Shows overall risk level and individual check results.
 */

import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';
import { cn } from '../../lib/utils';

export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export interface RiskCheck {
  id: string;
  name: string;
  status: 'pass' | 'warn' | 'fail';
  message: string;
  weight: number; // 1-10, how important this check is
}

export interface RiskAssessment {
  overallRisk: RiskLevel;
  score: number; // 0-100, where 100 is lowest risk
  checks: RiskCheck[];
  lastUpdated: Date;
}

interface RiskAssessmentCardProps {
  assessment: RiskAssessment;
  className?: string;
}

export function RiskAssessmentCard({ assessment, className }: RiskAssessmentCardProps) {
  const getRiskDisplay = (risk: RiskLevel) => {
    switch (risk) {
      case RiskLevel.LOW:
        return {
          icon: CheckCircle,
          text: 'Low Risk',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
        };
      case RiskLevel.MEDIUM:
        return {
          icon: Info,
          text: 'Medium Risk',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
        };
      case RiskLevel.HIGH:
        return {
          icon: AlertTriangle,
          text: 'High Risk',
          color: 'text-amber-600',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
        };
      case RiskLevel.CRITICAL:
        return {
          icon: XCircle,
          text: 'Critical Risk',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
        };
    }
  };

  const getCheckIcon = (status: RiskCheck['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warn':
        return <AlertTriangle className="h-5 w-5 text-amber-600" />;
      case 'fail':
        return <XCircle className="h-5 w-5 text-red-600" />;
    }
  };

  const getCheckTextColor = (status: RiskCheck['status']) => {
    switch (status) {
      case 'pass':
        return 'text-gray-900';
      case 'warn':
        return 'text-amber-900';
      case 'fail':
        return 'text-red-900';
    }
  };

  const riskDisplay = getRiskDisplay(assessment.overallRisk);
  const RiskIcon = riskDisplay.icon;

  // Sort checks by status priority (fail > warn > pass) then by weight
  const sortedChecks = [...assessment.checks].sort((a, b) => {
    const statusPriority = { fail: 0, warn: 1, pass: 2 };
    const statusDiff = statusPriority[a.status] - statusPriority[b.status];
    if (statusDiff !== 0) return statusDiff;
    return b.weight - a.weight;
  });

  const passedCount = assessment.checks.filter((c) => c.status === 'pass').length;
  const warnCount = assessment.checks.filter((c) => c.status === 'warn').length;
  const failCount = assessment.checks.filter((c) => c.status === 'fail').length;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className={cn('bg-white rounded-lg border border-gray-200 p-6', className)}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment</h3>

      {/* Overall Risk Score */}
      <div className={cn('p-4 rounded-lg border mb-4', riskDisplay.bgColor, riskDisplay.borderColor)}>
        <div className="flex items-center gap-3 mb-2">
          <RiskIcon className={cn('h-6 w-6', riskDisplay.color)} />
          <div className="flex-1">
            <p className="font-semibold text-gray-900">Overall: {riskDisplay.text}</p>
            <p className="text-sm text-gray-600">Risk Score: {assessment.score}/100</p>
          </div>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full transition-all duration-500',
              assessment.overallRisk === RiskLevel.LOW
                ? 'bg-green-600'
                : assessment.overallRisk === RiskLevel.MEDIUM
                ? 'bg-blue-600'
                : assessment.overallRisk === RiskLevel.HIGH
                ? 'bg-amber-600'
                : 'bg-red-600'
            )}
            style={{ width: `${assessment.score}%` }}
          />
        </div>
      </div>

      {/* Check Summary */}
      <div className="flex items-center gap-4 mb-4 text-sm">
        {passedCount > 0 && (
          <div className="flex items-center gap-1.5">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-gray-600">
              {passedCount} passed
            </span>
          </div>
        )}
        {warnCount > 0 && (
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <span className="text-gray-600">
              {warnCount} warning{warnCount !== 1 ? 's' : ''}
            </span>
          </div>
        )}
        {failCount > 0 && (
          <div className="flex items-center gap-1.5">
            <XCircle className="h-4 w-4 text-red-600" />
            <span className="text-gray-600">
              {failCount} failed
            </span>
          </div>
        )}
      </div>

      {/* Individual Checks */}
      <div className="space-y-2">
        {sortedChecks.map((check) => (
          <div
            key={check.id}
            className={cn(
              'flex items-start gap-3 p-3 rounded-lg transition-colors',
              check.status === 'fail'
                ? 'bg-red-50 hover:bg-red-100'
                : check.status === 'warn'
                ? 'bg-amber-50 hover:bg-amber-100'
                : 'hover:bg-gray-50'
            )}
          >
            <div className="flex-shrink-0 mt-0.5">{getCheckIcon(check.status)}</div>
            <div className="flex-1 min-w-0">
              <p className={cn('text-sm font-medium', getCheckTextColor(check.status))}>
                {check.name}
              </p>
              <p className="text-xs text-gray-600 mt-0.5">{check.message}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Last Updated */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Last updated: {formatDate(assessment.lastUpdated)}
        </p>
      </div>

      {/* Risk Score Explanation */}
      <div className="mt-4 bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">How risk is calculated</h4>
        <p className="text-xs text-gray-600 leading-relaxed">
          Risk score is calculated based on automated checks including business verification,
          website activity, social media presence, certification claims, pricing analysis, and brand alignment with marketplace values.
          Each check is weighted by importance.
        </p>
      </div>
    </div>
  );
}
