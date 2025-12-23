import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { VendorProfile } from '../types/profile';

const GET_VENDOR_PROFILE = gql`
  query GetVendorProfile {
    vendorProfile {
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
      values
      certifications {
        id
        type
        certificationNumber
        issuedDate
        expiryDate
        documentUrl
        isVerified
      }
    }
  }
`;

export interface UseVendorProfileResult {
  profile: VendorProfile | null;
  loading: boolean;
  error: Error | undefined;
  refetch: () => void;
}

export function useVendorProfile(): UseVendorProfileResult {
  const { data, loading, error, refetch } = useQuery(GET_VENDOR_PROFILE, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  return {
    profile: data?.vendorProfile || null,
    loading,
    error,
    refetch: () => {
      refetch();
    },
  };
}
