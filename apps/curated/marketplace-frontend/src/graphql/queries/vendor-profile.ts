/**
 * Vendor Profile GraphQL Queries
 * Feature 011: Vendor Portal MVP
 * Sprint B.1: Profile Management UI
 */

import { gql } from '@apollo/client';

export const VENDOR_PROFILE_QUERY = gql`
  query VendorProfile {
    vendorProfile {
      id
      vendorId

      # Brand Identity
      brandName
      tagline
      founderStory
      missionStatement
      brandVideoUrl

      # Visual Identity
      logoUrl
      heroImageUrl
      brandColorPrimary
      brandColorSecondary
      galleryImages

      # Contact & Links
      websiteUrl
      socialLinks {
        instagram
        facebook
        tiktok
        linkedin
      }

      # Business Info
      foundedYear
      headquarters
      teamSize

      # Values
      values

      # Certifications
      certifications {
        id
        type
        certificateNumber
        issuingBody
        expirationDate
        verificationStatus
        documentUrl
        verifiedAt
        verifiedBy
        rejectionReason
        submittedAt
        slaDeadline
      }

      # Metadata
      completenessScore
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_VENDOR_PROFILE_MUTATION = gql`
  mutation UpdateVendorProfile($input: UpdateVendorProfileInput!) {
    updateVendorProfile(input: $input) {
      success
      profile {
        id
        brandName
        tagline
        founderStory
        missionStatement
        brandVideoUrl
        logoUrl
        heroImageUrl
        brandColorPrimary
        brandColorSecondary
        galleryImages
        websiteUrl
        socialLinks {
          instagram
          facebook
          tiktok
          linkedin
        }
        foundedYear
        headquarters
        teamSize
        values
        completenessScore
      }
      errors {
        field
        message
        code
      }
    }
  }
`;

export const ADD_CERTIFICATION_MUTATION = gql`
  mutation AddCertification($input: AddCertificationInput!) {
    addCertification(input: $input) {
      success
      certification {
        id
        type
        certificateNumber
        issuingBody
        expirationDate
        verificationStatus
        documentUrl
        submittedAt
        slaDeadline
      }
      errors {
        field
        message
        code
      }
    }
  }
`;

export const REMOVE_CERTIFICATION_MUTATION = gql`
  mutation RemoveCertification($certificationId: ID!) {
    removeCertification(certificationId: $certificationId)
  }
`;
