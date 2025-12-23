import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_VENDOR_PROFILE } from '../graphql/profile.mutations';
import { VendorProfile } from '../types/profile';
import './ProfileSection.css';

export interface BrandIdentitySectionProps {
  profile: VendorProfile;
  onUpdate?: () => void;
}

export function BrandIdentitySection({ profile, onUpdate }: BrandIdentitySectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [brandName, setBrandName] = useState(profile.brandName);
  const [tagline, setTagline] = useState(profile.tagline || '');
  const [story, setStory] = useState(profile.story || '');

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
            brandName,
            tagline: tagline || null,
            story: story || null,
          },
        },
      });
    } catch (err) {
      console.error('Failed to update brand identity:', err);
    }
  };

  const handleCancel = () => {
    setBrandName(profile.brandName);
    setTagline(profile.tagline || '');
    setStory(profile.story || '');
    setIsEditing(false);
  };

  const hasChanges =
    brandName !== profile.brandName ||
    tagline !== (profile.tagline || '') ||
    story !== (profile.story || '');

  return (
    <div className="profile-section">
      <div className="profile-section-header">
        <div>
          <h2 className="profile-section-title">Brand Identity</h2>
          <p className="profile-section-subtitle">
            Your brand name, tagline, and story
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
            Failed to update brand identity: {error.message}
          </div>
        )}

        <div className="profile-form-group">
          <label htmlFor="brand-name" className="profile-label">
            Brand Name <span className="required">*</span>
          </label>
          <input
            id="brand-name"
            type="text"
            className="profile-input"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            disabled={!isEditing}
            required
            maxLength={100}
          />
          <p className="profile-hint">
            Your official brand or company name (max 100 characters)
          </p>
        </div>

        <div className="profile-form-group">
          <label htmlFor="tagline" className="profile-label">
            Tagline
          </label>
          <input
            id="tagline"
            type="text"
            className="profile-input"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            disabled={!isEditing}
            placeholder="e.g., Clean Beauty for Every Skin Type"
            maxLength={150}
          />
          <p className="profile-hint">
            A short, memorable phrase that captures your brand essence (max 150 characters)
          </p>
        </div>

        <div className="profile-form-group">
          <label htmlFor="story" className="profile-label">
            Brand Story
          </label>
          <textarea
            id="story"
            className="profile-textarea"
            value={story}
            onChange={(e) => setStory(e.target.value)}
            disabled={!isEditing}
            placeholder="Tell spa owners about your brand's mission, values, and what makes you unique..."
            rows={6}
            maxLength={1000}
          />
          <p className="profile-hint">
            Share your brand's origin story and mission ({story.length}/1000 characters)
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
              disabled={!hasChanges || loading || !brandName.trim()}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
