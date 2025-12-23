import { BrandIdentitySection } from '../components/BrandIdentitySection';
import { VisualIdentitySection } from '../components/VisualIdentitySection';
import { ValuesSelector } from '../components/ValuesSelector';
import { CertificationsManager } from '../components/CertificationsManager';
import { useVendorProfile } from '../hooks/useVendorProfile';
import './Page.css';

export function ProfilePage() {
  const { profile, loading, error, refetch } = useVendorProfile();

  if (loading && !profile) {
    return (
      <div className="page">
        <div className="page-header">
          <h1>Brand Profile</h1>
          <p>Loading your profile...</p>
        </div>
        <div className="page-content">
          <div className="info-box">
            <p>Loading vendor profile data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="page-header">
          <h1>Brand Profile</h1>
          <p>Manage your brand identity, values, and certifications</p>
        </div>
        <div className="page-content">
          <div className="info-box" style={{ borderColor: '#ef4444' }}>
            <h3>⚠️ Error Loading Profile</h3>
            <p style={{ color: '#ef4444' }}>
              {error.message || 'Failed to load vendor profile. Please try again.'}
            </p>
            <p className="info-note">
              <strong>Tip:</strong> Make sure the backend GraphQL server is running and you are
              authenticated.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="page">
        <div className="page-header">
          <h1>Brand Profile</h1>
          <p>Manage your brand identity, values, and certifications</p>
        </div>
        <div className="page-content">
          <div className="info-box">
            <h3>📝 No Profile Found</h3>
            <p>No vendor profile found for your account.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Brand Profile</h1>
          <p>Manage your brand identity, values, and certifications</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.875rem', color: '#888', marginBottom: '0.25rem' }}>
            Profile Completeness
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#646cff' }}>
            {profile.completenessScore}%
          </div>
        </div>
      </div>

      <div className="page-content">
        {/* Brand Identity */}
        <BrandIdentitySection profile={profile} onUpdate={refetch} />

        {/* Visual Identity */}
        <VisualIdentitySection profile={profile} onUpdate={refetch} />

        {/* Brand Values */}
        <ValuesSelector selectedValues={profile.values} onUpdate={refetch} />

        {/* Certifications */}
        <CertificationsManager certifications={profile.certifications} onUpdate={refetch} />

        {/* Sprint Completion Info */}
        <div className="info-box">
          <h3>✅ Sprint B.3 Complete - Profile Management</h3>
          <p>
            Your brand profile page is now fully functional. You can manage all aspects of your
            brand identity, visual assets, values, and certifications.
          </p>
          <div style={{ marginTop: '1rem' }}>
            <strong>Profile Completeness:</strong> {profile.completenessScore}%
            <br />
            <strong>Verification Status:</strong>{' '}
            {profile.isVerified ? '✓ Verified' : '⏳ Pending Verification'}
            <br />
            <strong>Selected Values:</strong> {profile.values.length} of 25
            <br />
            <strong>Certifications:</strong> {profile.certifications.length} active
          </div>
          <p className="info-note">
            <strong>Next Sprint (B.4):</strong> Order Management - View orders, track status,
            manage fulfillment.
          </p>
        </div>
      </div>
    </div>
  );
}
