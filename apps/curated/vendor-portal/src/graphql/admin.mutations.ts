import { gql } from '@apollo/client';

/**
 * GraphQL mutations for admin operations
 * Sprint E.2 - Admin Tools
 */

export const APPROVE_APPLICATION = gql`
  mutation ApproveApplication($input: ApprovalDecisionInput!) {
    approveApplication(input: $input) {
      applicationId
      status
      decidedAt
    }
  }
`;

export const REJECT_APPLICATION = gql`
  mutation RejectApplication($input: ApprovalDecisionInput!) {
    rejectApplication(input: $input) {
      applicationId
      status
      decidedAt
    }
  }
`;

export const REQUEST_ADDITIONAL_INFO = gql`
  mutation RequestAdditionalInfo($input: ApprovalDecisionInput!) {
    requestAdditionalInfo(input: $input) {
      applicationId
      status
    }
  }
`;

export const ASSIGN_REVIEWER = gql`
  mutation AssignReviewer($applicationId: ID!, $reviewerId: ID!) {
    assignReviewer(applicationId: $applicationId, reviewerId: $reviewerId) {
      applicationId
      assignedReviewer
    }
  }
`;

export const GET_APPLICATION_QUEUE = gql`
  query GetApplicationQueue($filters: ApplicationQueueFiltersInput) {
    applicationQueue(filters: $filters) {
      applicationId
      brandName
      contactName
      status
      submittedAt
      slaDeadline
      riskScore
      assignedReviewer
    }
  }
`;

export const GET_SLA_METRICS = gql`
  query GetSLAMetrics {
    slaMetrics {
      totalApplications
      withinSLA
      atRisk
      breached
      averageReviewTime
      onTimePercentage
    }
  }
`;
