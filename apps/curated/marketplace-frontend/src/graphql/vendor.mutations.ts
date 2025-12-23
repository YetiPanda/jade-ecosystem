/**
 * Vendor GraphQL Mutations
 * Week 5 Day 1: Product submission and vendor management mutations
 */

import { gql } from '@apollo/client';

export const CREATE_PRODUCT_SUBMISSION = gql`
  mutation CreateProductSubmission($input: CreateProductSubmissionInput!) {
    createProductSubmission(input: $input) {
      id
      vendorProfileId
      productId
      submissionStatus
      taxonomyCompletenessScore
      validationErrors {
        field
        message
        severity
        code
      }
      validationWarnings {
        field
        message
        suggestion
      }
      trainingCompleted
      submittedAt
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_VENDOR_PROFILE = gql`
  mutation UpdateVendorProfile($id: ID!, $input: UpdateVendorProfileInput!) {
    updateVendorProfile(id: $id, input: $input) {
      id
      companyName
      contactName
      contactEmail
      contactPhone
      websiteUrl
      description
      specializations
      updatedAt
    }
  }
`;

export const START_TRAINING_MODULE = gql`
  mutation StartTrainingModule($input: StartTrainingModuleInput!) {
    startTrainingModule(input: $input) {
      id
      moduleId
      moduleName
      status
      progressPercentage
      startedAt
    }
  }
`;

export const COMPLETE_TRAINING_MODULE = gql`
  mutation CompleteTrainingModule($input: CompleteTrainingModuleInput!) {
    completeTrainingModule(input: $input) {
      id
      moduleId
      moduleName
      status
      progressPercentage
      completedAt
      quizScore
      certificationEarned
    }
  }
`;
