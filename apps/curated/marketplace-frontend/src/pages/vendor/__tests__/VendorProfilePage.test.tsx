/**
 * VendorProfilePage Tests
 * Feature 011: Vendor Portal MVP
 * Sprint B.1: Profile Management UI - Task B.1.9
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter } from 'react-router-dom';
import { VendorProfilePage } from '../VendorProfilePage';
import { VENDOR_PROFILE_QUERY } from '@/graphql/queries/vendor-profile';

// Mock child components
vi.mock('@/components/vendor/profile/BrandIdentityForm', () => ({
  BrandIdentityForm: () => <div data-testid="brand-identity-form">Brand Identity Form</div>,
}));

vi.mock('@/components/vendor/profile/VisualIdentityForm', () => ({
  VisualIdentityForm: () => <div data-testid="visual-identity-form">Visual Identity Form</div>,
}));

vi.mock('@/components/vendor/profile/ValuesSelector', () => ({
  ValuesSelector: () => <div data-testid="values-selector">Values Selector</div>,
}));

vi.mock('@/components/vendor/profile/CertificationsManager', () => ({
  CertificationsManager: () => <div data-testid="certifications-manager">Certifications Manager</div>,
}));

vi.mock('@/components/vendor/profile/ProfileCompletenessIndicator', () => ({
  ProfileCompletenessIndicator: ({ completenessScore }: { completenessScore: number }) => (
    <div data-testid="completeness-indicator">
      Completeness: {completenessScore}%
    </div>
  ),
}));

const mockProfile = {
  id: 'profile-123',
  vendorId: 'vendor-456',
  brandName: 'Radiant Glow',
  tagline: 'Pure, sustainable skincare',
  founderStory: 'Founded by Jane Doe...',
  missionStatement: 'To create clean beauty products',
  brandVideoUrl: 'https://youtube.com/watch?v=123',
  logoUrl: 'https://cdn.example.com/logo.png',
  heroImageUrl: 'https://cdn.example.com/hero.jpg',
  brandColorPrimary: '#FF5733',
  brandColorSecondary: '#33FF57',
  galleryImages: ['https://cdn.example.com/1.jpg', 'https://cdn.example.com/2.jpg'],
  websiteUrl: 'https://radiantglow.com',
  socialLinks: { instagram: 'https://instagram.com/radiantglow' },
  foundedYear: 2020,
  headquarters: 'Austin, TX',
  teamSize: 'TWO_TO_TEN',
  values: ['CLEAN_BEAUTY', 'VEGAN', 'WOMAN_FOUNDED'],
  certifications: [
    {
      id: 'cert-123',
      type: 'USDA_ORGANIC',
      certificateNumber: '12345',
      issuingBody: 'USDA',
      expirationDate: '2026-12-31',
      verificationStatus: 'VERIFIED',
      documentUrl: 'https://s3.aws.com/cert.pdf',
      verifiedAt: '2025-01-01',
      verifiedBy: 'Admin User',
      rejectionReason: null,
      submittedAt: '2024-12-20',
      slaDeadline: '2024-12-23',
    },
  ],
  completenessScore: 85,
  createdAt: '2024-12-01',
  updatedAt: '2024-12-20',
};

describe('VendorProfilePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state initially', () => {
    const mocks = [
      {
        request: {
          query: VENDOR_PROFILE_QUERY,
        },
        result: {
          data: { vendorProfile: mockProfile },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <VendorProfilePage />
        </BrowserRouter>
      </MockedProvider>
    );

    expect(screen.getByText(/loading your profile/i)).toBeInTheDocument();
  });

  it('should render profile page with all tabs', async () => {
    const mocks = [
      {
        request: {
          query: VENDOR_PROFILE_QUERY,
        },
        result: {
          data: { vendorProfile: mockProfile },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <VendorProfilePage />
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Vendor Profile')).toBeInTheDocument();
    });

    // Check that all tabs are present
    expect(screen.getByText('Brand Identity')).toBeInTheDocument();
    expect(screen.getByText('Visual Identity')).toBeInTheDocument();
    expect(screen.getByText('Values & Certifications')).toBeInTheDocument();
  });

  it('should display completeness indicator', async () => {
    const mocks = [
      {
        request: {
          query: VENDOR_PROFILE_QUERY,
        },
        result: {
          data: { vendorProfile: mockProfile },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <VendorProfilePage />
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('completeness-indicator')).toHaveTextContent('Completeness: 85%');
    });
  });

  it('should display info banner for incomplete profiles', async () => {
    const incompleteProfile = { ...mockProfile, completenessScore: 45 };

    const mocks = [
      {
        request: {
          query: VENDOR_PROFILE_QUERY,
        },
        result: {
          data: { vendorProfile: incompleteProfile },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <VendorProfilePage />
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/complete your profile to get discovered/i)).toBeInTheDocument();
    });
  });

  it('should not display info banner for complete profiles', async () => {
    const completeProfile = { ...mockProfile, completenessScore: 90 };

    const mocks = [
      {
        request: {
          query: VENDOR_PROFILE_QUERY,
        },
        result: {
          data: { vendorProfile: completeProfile },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <VendorProfilePage />
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText(/complete your profile to get discovered/i)).not.toBeInTheDocument();
    });
  });

  it('should handle GraphQL error gracefully', async () => {
    const mocks = [
      {
        request: {
          query: VENDOR_PROFILE_QUERY,
        },
        error: new Error('Network error'),
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <VendorProfilePage />
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/failed to load your profile/i)).toBeInTheDocument();
    });
  });

  it('should render brand identity form in first tab', async () => {
    const mocks = [
      {
        request: {
          query: VENDOR_PROFILE_QUERY,
        },
        result: {
          data: { vendorProfile: mockProfile },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <VendorProfilePage />
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('brand-identity-form')).toBeInTheDocument();
    });
  });
});
