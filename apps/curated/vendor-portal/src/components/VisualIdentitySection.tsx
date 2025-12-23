import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_VENDOR_PROFILE } from '../graphql/profile.mutations';
import { VendorProfile } from '../types/profile';
import './ProfileSection.css';

export interface VisualIdentitySectionProps {
  profile: VendorProfile;
  onUpdate?: () => void;
}

export function VisualIdentitySection({ profile, onUpdate }: VisualIdentitySectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [logoUrl, setLogoUrl] = useState(profile.logoUrl || '');
  const [heroImageUrl, setHeroImageUrl] = useState(profile.heroImageUrl || '');
  const [primaryColor, setPrimaryColor] = useState(profile.primaryColor || '#646cff');
  const [secondaryColor, setSecondaryColor] = useState(profile.secondaryColor || '#22c55e');

  const [updateProfile, { loading, error }] = useMutation(UPDATE_VENDOR_PROFILE, {
    onCompleted: () => {
      setIsEditing(false);
      onUpdate?.();
    },
  });

  const handleSave = async () => {
    try {
      await updateProfile({
        variables: {
          input: {
            logoUrl: logoUrl || null,
            heroImageUrl: heroImageUrl || null,
            primaryColor,
            secondaryColor,
          },
        },
      });
    } catch (err) {
      console.error('Failed to update visual identity:', err);
    }
  };

  const handleCancel = () => {
    setLogoUrl(profile.logoUrl || '');
    setHeroImageUrl(profile.heroImageUrl || '');
    setPrimaryColor(profile.primaryColor || '#646cff');
    setSecondaryColor(profile.secondaryColor || '#22c55e');
    setIsEditing(false);
  };

  const hasChanges =
    logoUrl !== (profile.logoUrl || '') ||
    heroImageUrl !== (profile.heroImageUrl || '') ||
    primaryColor !== (profile.primaryColor || '#646cff') ||
    secondaryColor !== (profile.secondaryColor || '#22c55e');

  return (
    <div className="profile-section">
      <div className="profile-section-header">
        <div>
          <h2 className="profile-section-title">Visual Identity</h2>
          <p className="profile-section-subtitle">
            Logo, hero image, and brand colors
          </p>
        </div>
        {!isEditing && (
          <button
            className="profile-edit-button"
            onClick={() => setIsEditing(true)}
          >
            ✏️ Edit
          </button>
        )}
      </div>

      <div className="profile-section-content">
        {error && (
          <div className="profile-error">
            Failed to update visual identity: {error.message}
          </div>
        )}

        <div className="visual-grid">
          {/* Logo Upload */}
          <div className="profile-form-group">
            <label className="profile-label">Brand Logo</label>
            <div className={`image-upload-area ${logoUrl ? 'has-image' : ''}`}>
              {logoUrl ? (
                <>
                  <img src={logoUrl} alt="Brand Logo" className="image-preview" />
                  {isEditing && (
                    <div className="image-upload-actions">
                      <button
                        type="button"
                        className="profile-button profile-button-secondary"
                        onClick={() => setLogoUrl('')}
                      >
                        Remove
                      </button>
                      <button
                        type="button"
                        className="profile-button profile-button-primary"
                        onClick={() => {
                          const url = prompt('Enter logo URL:', logoUrl);
                          if (url !== null) setLogoUrl(url);
                        }}
                      >
                        Change URL
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div
                  onClick={() => {
                    if (isEditing) {
                      const url = prompt('Enter logo URL:');
                      if (url) setLogoUrl(url);
                    }
                  }}
                >
                  <div className="image-upload-icon">🖼️</div>
                  <div className="image-upload-placeholder">
                    {isEditing ? 'Click to add logo URL' : 'No logo uploaded'}
                  </div>
                  {isEditing && (
                    <p className="image-upload-text">
                      Recommended: Square image, 500x500px minimum
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Hero Image Upload */}
          <div className="profile-form-group">
            <label className="profile-label">Hero Image</label>
            <div className={`image-upload-area ${heroImageUrl ? 'has-image' : ''}`}>
              {heroImageUrl ? (
                <>
                  <img src={heroImageUrl} alt="Hero Image" className="image-preview" />
                  {isEditing && (
                    <div className="image-upload-actions">
                      <button
                        type="button"
                        className="profile-button profile-button-secondary"
                        onClick={() => setHeroImageUrl('')}
                      >
                        Remove
                      </button>
                      <button
                        type="button"
                        className="profile-button profile-button-primary"
                        onClick={() => {
                          const url = prompt('Enter hero image URL:', heroImageUrl);
                          if (url !== null) setHeroImageUrl(url);
                        }}
                      >
                        Change URL
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div
                  onClick={() => {
                    if (isEditing) {
                      const url = prompt('Enter hero image URL:');
                      if (url) setHeroImageUrl(url);
                    }
                  }}
                >
                  <div className="image-upload-icon">🌄</div>
                  <div className="image-upload-placeholder">
                    {isEditing ? 'Click to add hero image URL' : 'No hero image uploaded'}
                  </div>
                  {isEditing && (
                    <p className="image-upload-text">
                      Recommended: 16:9 aspect ratio, 1920x1080px minimum
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Brand Colors */}
        <div className="profile-form-group">
          <label className="profile-label">Brand Colors</label>
          <div className="color-picker-group">
            <div className="color-input-wrapper">
              <div
                className="color-preview"
                style={{ backgroundColor: primaryColor }}
                onClick={() => {
                  if (isEditing) {
                    const color = prompt('Enter primary color (hex):', primaryColor);
                    if (color && /^#[0-9A-F]{6}$/i.test(color)) {
                      setPrimaryColor(color);
                    }
                  }
                }}
                title={isEditing ? 'Click to change primary color' : primaryColor}
              />
              <div>
                <p className="profile-label" style={{ marginBottom: '0.25rem' }}>
                  Primary Color
                </p>
                <p className="profile-hint">{primaryColor}</p>
              </div>
            </div>

            <div className="color-input-wrapper">
              <div
                className="color-preview"
                style={{ backgroundColor: secondaryColor }}
                onClick={() => {
                  if (isEditing) {
                    const color = prompt('Enter secondary color (hex):', secondaryColor);
                    if (color && /^#[0-9A-F]{6}$/i.test(color)) {
                      setSecondaryColor(color);
                    }
                  }
                }}
                title={isEditing ? 'Click to change secondary color' : secondaryColor}
              />
              <div>
                <p className="profile-label" style={{ marginBottom: '0.25rem' }}>
                  Secondary Color
                </p>
                <p className="profile-hint">{secondaryColor}</p>
              </div>
            </div>
          </div>
          <p className="profile-hint">
            These colors will be used in your vendor profile page and product listings
          </p>
        </div>

        {isEditing && (
          <div className="profile-actions">
            <button
              className="profile-button profile-button-secondary"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="profile-button profile-button-primary"
              onClick={handleSave}
              disabled={!hasChanges || loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
