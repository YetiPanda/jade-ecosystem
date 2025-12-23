import { gql } from '@apollo/client';

/**
 * GraphQL mutations for vendor application & onboarding
 * Sprint E.1 - Application & Onboarding
 */

export const SAVE_APPLICATION_DRAFT = gql`
  mutation SaveApplicationDraft($input: ApplicationDraftInput!) {
    saveApplicationDraft(input: $input) {
      applicationId
      status
      updatedAt
    }
  }
`;

export const SUBMIT_VENDOR_APPLICATION = gql`
  mutation SubmitVendorApplication($input: VendorApplicationInput!) {
    submitVendorApplication(input: $input) {
      applicationId
      status
      submittedAt
      slaDeadline
    }
  }
`;

export const UPDATE_ONBOARDING_STEP = gql`
  mutation UpdateOnboardingStep($stepId: ID!, $status: OnboardingStepStatus!) {
    updateOnboardingStep(stepId: $stepId, status: $status) {
      stepId
      status
      completedAt
    }
  }
`;

export const COMPLETE_ONBOARDING = gql`
  mutation CompleteOnboarding($vendorId: ID!) {
    completeOnboarding(vendorId: $vendorId) {
      vendorId
      completedAt
      percentComplete
    }
  }
`;

export const GET_VENDOR_APPLICATION = gql`
  query GetVendorApplication($applicationId: ID!) {
    vendorApplication(applicationId: $applicationId) {
      applicationId
      status
      contactInfo {
        firstName
        lastName
        email
        phone
        role
      }
      companyInfo {
        brandName
        legalName
        website
        yearFounded
        headquarters
        employeeCount
        annualRevenue
      }
      productInfo {
        productCategories
        skuCount
        priceRange
        minimumOrderValue
        leadTime
        targetMarket
        currentDistribution
      }
      values
      certifications
      whyJade
      documents {
        productCatalog
        lineSheet
        insuranceCertificate
        businessLicense
      }
      assignedReviewer
      reviewNotes {
        reviewerId
        reviewerName
        note
        category
        createdAt
      }
      riskScore
      submittedAt
      reviewStartedAt
      decidedAt
      slaDeadline
      createdAt
      updatedAt
    }
  }
`;

export const GET_VENDOR_ONBOARDING = gql`
  query GetVendorOnboarding($vendorId: ID!) {
    vendorOnboarding(vendorId: $vendorId) {
      vendorId
      applicationId
      steps {
        stepId
        name
        description
        order
        status
        completedAt
        isRequired
        estimatedMinutes
        resources {
          title
          type
          url
        }
      }
      completedSteps
      totalSteps
      percentComplete
      startedAt
      targetCompletionDate
      completedAt
      assignedSuccessManager
      supportThreadId
    }
  }
`;
