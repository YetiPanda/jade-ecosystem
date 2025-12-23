/**
 * ProfileCompletenessIndicator Tests
 * Feature 011: Vendor Portal MVP
 * Sprint B.1: Profile Management UI - Task B.1.9
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProfileCompletenessIndicator } from '../ProfileCompletenessIndicator';

describe('ProfileCompletenessIndicator', () => {
  it('should display correct score and status for excellent profile (85%+)', () => {
    const profile = {
      brandName: 'Test Brand',
      logoUrl: 'https://example.com/logo.png',
      tagline: 'Test Tagline',
      founderStory: 'A'.repeat(150), // Long enough
      heroImageUrl: 'https://example.com/hero.jpg',
      missionStatement: 'Test Mission',
      values: ['CLEAN_BEAUTY', 'VEGAN', 'WOMAN_FOUNDED'],
      certifications: [{ verificationStatus: 'VERIFIED' }],
      brandVideoUrl: 'https://youtube.com/watch?v=123',
      galleryImages: ['img1.jpg', 'img2.jpg', 'img3.jpg'],
      websiteUrl: 'https://example.com',
      socialLinks: { instagram: 'https://instagram.com/test', facebook: 'https://facebook.com/test' },
      foundedYear: 2020,
      headquarters: 'Austin, TX',
      teamSize: 'TWO_TO_TEN',
    };

    render(<ProfileCompletenessIndicator completenessScore={90} profile={profile} />);

    expect(screen.getByText('90% complete')).toBeInTheDocument();
    expect(screen.getByText('Excellent')).toBeInTheDocument();
    expect(screen.getByText(/your profile is complete/i)).toBeInTheDocument();
  });

  it('should display correct status for good profile (70-84%)', () => {
    const profile = {
      brandName: 'Test Brand',
      logoUrl: 'https://example.com/logo.png',
      tagline: 'Test Tagline',
      values: ['CLEAN_BEAUTY', 'VEGAN', 'WOMAN_FOUNDED'],
    };

    render(<ProfileCompletenessIndicator completenessScore={75} profile={profile} />);

    expect(screen.getByText('75% complete')).toBeInTheDocument();
    expect(screen.getByText('Good')).toBeInTheDocument();
  });

  it('should display correct status for fair profile (50-69%)', () => {
    const profile = {
      brandName: 'Test Brand',
      logoUrl: 'https://example.com/logo.png',
    };

    render(<ProfileCompletenessIndicator completenessScore={55} profile={profile} />);

    expect(screen.getByText('55% complete')).toBeInTheDocument();
    expect(screen.getByText('Fair')).toBeInTheDocument();
  });

  it('should display correct status for incomplete profile (<50%)', () => {
    const profile = {
      brandName: 'Test Brand',
    };

    render(<ProfileCompletenessIndicator completenessScore={20} profile={profile} />);

    expect(screen.getByText('20% complete')).toBeInTheDocument();
    expect(screen.getByText('Incomplete')).toBeInTheDocument();
  });

  it('should show missing sections for incomplete profile', () => {
    const profile = {
      brandName: 'Test Brand',
      // Missing: logo, tagline, values, certifications, etc.
    };

    render(<ProfileCompletenessIndicator completenessScore={5} profile={profile} />);

    expect(screen.getByText(/complete these sections to improve your profile/i)).toBeInTheDocument();
    expect(screen.getByText('Logo')).toBeInTheDocument();
    expect(screen.getByText('Tagline')).toBeInTheDocument();
    expect(screen.getByText(/brand values/i)).toBeInTheDocument();
  });

  it('should prioritize high-priority missing sections', () => {
    const profile = {
      brandName: 'Test Brand',
      // Missing high-priority items: logo, tagline, values
    };

    render(<ProfileCompletenessIndicator completenessScore={5} profile={profile} />);

    // High priority items should be marked with AlertCircle (red)
    expect(screen.getByText('Logo')).toBeInTheDocument();
    expect(screen.getByText('Tagline')).toBeInTheDocument();
    expect(screen.getByText(/brand values/i)).toBeInTheDocument();
  });

  it('should handle null profile gracefully', () => {
    render(<ProfileCompletenessIndicator completenessScore={0} profile={null} />);

    expect(screen.getByText('0% complete')).toBeInTheDocument();
    expect(screen.getByText('Create your profile')).toBeInTheDocument();
  });

  it('should identify insufficient founder story length', () => {
    const profile = {
      brandName: 'Test Brand',
      logoUrl: 'https://example.com/logo.png',
      tagline: 'Test Tagline',
      founderStory: 'Too short', // Less than 100 characters
      values: ['CLEAN_BEAUTY', 'VEGAN', 'WOMAN_FOUNDED'],
    };

    render(<ProfileCompletenessIndicator completenessScore={40} profile={profile} />);

    expect(screen.getByText(/founder story \(minimum 100 characters\)/i)).toBeInTheDocument();
  });

  it('should identify insufficient values count', () => {
    const profile = {
      brandName: 'Test Brand',
      logoUrl: 'https://example.com/logo.png',
      tagline: 'Test Tagline',
      values: ['CLEAN_BEAUTY'], // Less than 3
    };

    render(<ProfileCompletenessIndicator completenessScore={30} profile={profile} />);

    expect(screen.getByText(/brand values \(minimum 3\)/i)).toBeInTheDocument();
  });

  it('should identify missing certifications', () => {
    const profile = {
      brandName: 'Test Brand',
      logoUrl: 'https://example.com/logo.png',
      tagline: 'Test Tagline',
      values: ['CLEAN_BEAUTY', 'VEGAN', 'WOMAN_FOUNDED'],
      certifications: [], // No certifications
    };

    render(<ProfileCompletenessIndicator completenessScore={50} profile={profile} />);

    expect(screen.getByText(/at least 1 certification/i)).toBeInTheDocument();
  });

  it('should limit display to 6 missing sections', () => {
    const profile = {
      brandName: 'Test Brand',
      // Almost everything missing (will have >6 missing sections)
    };

    render(<ProfileCompletenessIndicator completenessScore={5} profile={profile} />);

    const missingSections = screen.queryAllByText(/logo|tagline|hero|mission|values|certification|video|gallery|website|social/i);

    // Should show "+X more sections to complete" message
    expect(screen.getByText(/\+\d+ more sections to complete/)).toBeInTheDocument();
  });

  it('should identify insufficient gallery images', () => {
    const profile = {
      brandName: 'Test Brand',
      logoUrl: 'https://example.com/logo.png',
      tagline: 'Test Tagline',
      values: ['CLEAN_BEAUTY', 'VEGAN', 'WOMAN_FOUNDED'],
      galleryImages: ['img1.jpg'], // Less than 3
    };

    render(<ProfileCompletenessIndicator completenessScore={40} profile={profile} />);

    expect(screen.getByText(/gallery images \(minimum 3\)/i)).toBeInTheDocument();
  });

  it('should identify insufficient social links', () => {
    const profile = {
      brandName: 'Test Brand',
      logoUrl: 'https://example.com/logo.png',
      tagline: 'Test Tagline',
      values: ['CLEAN_BEAUTY', 'VEGAN', 'WOMAN_FOUNDED'],
      socialLinks: { instagram: 'https://instagram.com/test' }, // Less than 2
    };

    render(<ProfileCompletenessIndicator completenessScore={40} profile={profile} />);

    expect(screen.getByText(/social links \(minimum 2\)/i)).toBeInTheDocument();
  });
});
