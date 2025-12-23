import { gql } from '@apollo/client';

/**
 * GraphQL mutations for vendor profile management
 */

export const UPDATE_VENDOR_PROFILE = gql`
  mutation UpdateVendorProfile($input: UpdateVendorProfileInput!) {
    updateVendorProfile(input: $input) {
      id
      brandName
      tagline
      story
      logoUrl
      heroImageUrl
      primaryColor
      secondaryColor
      socialLinks
      contactEmail
      isVerified
      completenessScore
    }
  }
`;

export const ADD_VENDOR_VALUE = gql`
  mutation AddVendorValue($input: AddVendorValueInput!) {
    addVendorValue(input: $input) {
      id
      values
      completenessScore
    }
  }
`;

export const REMOVE_VENDOR_VALUE = gql`
  mutation RemoveVendorValue($input: RemoveVendorValueInput!) {
    removeVendorValue(input: $input) {
      id
      values
      completenessScore
    }
  }
`;

export const ADD_CERTIFICATION = gql`
  mutation AddCertification($input: AddCertificationInput!) {
    addCertification(input: $input) {
      id
      type
      certificationNumber
      issuedDate
      expiryDate
      documentUrl
      isVerified
    }
  }
`;

export const UPDATE_CERTIFICATION = gql`
  mutation UpdateCertification($input: UpdateCertificationInput!) {
    updateCertification(input: $input) {
      id
      type
      certificationNumber
      issuedDate
      expiryDate
      documentUrl
      isVerified
    }
  }
`;

export const REMOVE_CERTIFICATION = gql`
  mutation RemoveCertification($id: ID!) {
    removeCertification(id: $id) {
      success
    }
  }
`;
