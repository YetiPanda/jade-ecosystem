import { useState } from 'react';
import { useMutation } from '@apollo/client';
import {
  ADD_CERTIFICATION,
  UPDATE_CERTIFICATION,
  REMOVE_CERTIFICATION,
} from '../graphql/profile.mutations';
import {
  VendorCertification,
  CertificationType,
  CERTIFICATION_TYPE_LABELS,
} from '../types/profile';
import './CertificationsManager.css';

export interface CertificationsManagerProps {
  certifications: VendorCertification[];
  onUpdate?: () => void;
}

export function CertificationsManager({
  certifications,
  onUpdate,
}: CertificationsManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [addCertification, { loading: addLoading }] = useMutation(ADD_CERTIFICATION, {
    onCompleted: () => {
      setIsAdding(false);
      onUpdate?.();
    },
  });

  const [updateCertification, { loading: updateLoading }] = useMutation(UPDATE_CERTIFICATION, {
    onCompleted: () => {
      setEditingId(null);
      onUpdate?.();
    },
  });

  const [removeCertification, { loading: removeLoading }] = useMutation(REMOVE_CERTIFICATION, {
    onCompleted: () => {
      onUpdate?.();
    },
  });

  const loading = addLoading || updateLoading || removeLoading;

  // Get certification types that aren't already added
  const availableTypes = Object.values(CertificationType).filter(
    (type) => !certifications.some((cert) => cert.type === type)
  );

  return (
    <div className="profile-section">
      <div className="profile-section-header">
        <div>
          <h2 className="profile-section-title">Certifications</h2>
          <p className="profile-section-subtitle">
            Manage your brand certifications ({certifications.length} active)
          </p>
        </div>
        {!isAdding && availableTypes.length > 0 && (
          <button
            className="profile-edit-button"
            onClick={() => setIsAdding(true)}
            disabled={loading}
          >
            ➕ Add Certification
          </button>
        )}
      </div>

      <div className="profile-section-content">
        {/* Existing Certifications */}
        {certifications.length > 0 ? (
          <div className="certifications-list">
            {certifications.map((cert) => (
              <CertificationCard
                key={cert.id}
                certification={cert}
                isEditing={editingId === cert.id}
                onEdit={() => setEditingId(cert.id)}
                onSave={(data) => {
                  updateCertification({
                    variables: { input: { id: cert.id, ...data } },
                  });
                }}
                onCancel={() => setEditingId(null)}
                onRemove={() => {
                  if (
                    confirm(
                      `Remove ${CERTIFICATION_TYPE_LABELS[cert.type]} certification?`
                    )
                  ) {
                    removeCertification({ variables: { id: cert.id } });
                  }
                }}
                loading={loading}
              />
            ))}
          </div>
        ) : (
          <div className="certifications-empty">
            <p>No certifications added yet</p>
            <p className="profile-hint">
              Add certifications to build trust with spa customers
            </p>
          </div>
        )}

        {/* Add New Certification Form */}
        {isAdding && (
          <AddCertificationForm
            availableTypes={availableTypes}
            onAdd={(data) => {
              addCertification({ variables: { input: data } });
            }}
            onCancel={() => setIsAdding(false)}
            loading={loading}
          />
        )}

        {availableTypes.length === 0 && certifications.length > 0 && (
          <div className="certifications-complete">
            <p>✅ All available certification types have been added</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface CertificationCardProps {
  certification: VendorCertification;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (data: any) => void;
  onCancel: () => void;
  onRemove: () => void;
  loading: boolean;
}

function CertificationCard({
  certification,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onRemove,
  loading,
}: CertificationCardProps) {
  const [certNumber, setCertNumber] = useState(certification.certificationNumber || '');
  const [issuedDate, setIssuedDate] = useState(certification.issuedDate || '');
  const [expiryDate, setExpiryDate] = useState(certification.expiryDate || '');
  const [documentUrl, setDocumentUrl] = useState(certification.documentUrl || '');

  const handleSave = () => {
    onSave({
      certificationNumber: certNumber || null,
      issuedDate: issuedDate || null,
      expiryDate: expiryDate || null,
      documentUrl: documentUrl || null,
    });
  };

  return (
    <div className="certification-card">
      <div className="certification-header">
        <div className="certification-title-group">
          <h3 className="certification-name">
            {CERTIFICATION_TYPE_LABELS[certification.type]}
          </h3>
          <div className="certification-badges">
            {certification.isVerified ? (
              <span className="badge badge-verified">✓ Verified</span>
            ) : (
              <span className="badge badge-pending">⏳ Pending Verification</span>
            )}
          </div>
        </div>
        {!isEditing && (
          <div className="certification-actions-compact">
            <button
              type="button"
              className="icon-button"
              onClick={onEdit}
              disabled={loading}
              title="Edit"
            >
              ✏️
            </button>
            <button
              type="button"
              className="icon-button icon-button-danger"
              onClick={onRemove}
              disabled={loading}
              title="Remove"
            >
              🗑️
            </button>
          </div>
        )}
      </div>

      <div className="certification-details">
        {isEditing ? (
          <>
            <div className="profile-form-group">
              <label className="profile-label">Certification Number</label>
              <input
                type="text"
                className="profile-input"
                value={certNumber}
                onChange={(e) => setCertNumber(e.target.value)}
                placeholder="e.g., USDA-ORG-12345"
              />
            </div>

            <div className="certification-dates">
              <div className="profile-form-group">
                <label className="profile-label">Issued Date</label>
                <input
                  type="date"
                  className="profile-input"
                  value={issuedDate}
                  onChange={(e) => setIssuedDate(e.target.value)}
                />
              </div>
              <div className="profile-form-group">
                <label className="profile-label">Expiry Date</label>
                <input
                  type="date"
                  className="profile-input"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                />
              </div>
            </div>

            <div className="profile-form-group">
              <label className="profile-label">Document URL</label>
              <input
                type="url"
                className="profile-input"
                value={documentUrl}
                onChange={(e) => setDocumentUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div className="profile-actions">
              <button
                type="button"
                className="profile-button profile-button-secondary"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="profile-button profile-button-primary"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </>
        ) : (
          <div className="certification-info">
            {certNumber && (
              <div className="certification-field">
                <span className="field-label">Number:</span>
                <span className="field-value">{certNumber}</span>
              </div>
            )}
            {issuedDate && (
              <div className="certification-field">
                <span className="field-label">Issued:</span>
                <span className="field-value">
                  {new Date(issuedDate).toLocaleDateString()}
                </span>
              </div>
            )}
            {expiryDate && (
              <div className="certification-field">
                <span className="field-label">Expires:</span>
                <span className="field-value">
                  {new Date(expiryDate).toLocaleDateString()}
                </span>
              </div>
            )}
            {documentUrl && (
              <div className="certification-field">
                <a
                  href={documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="certification-link"
                >
                  📄 View Document
                </a>
              </div>
            )}
            {!certNumber && !issuedDate && !expiryDate && !documentUrl && (
              <p className="certification-field field-empty">
                No additional details added
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface AddCertificationFormProps {
  availableTypes: CertificationType[];
  onAdd: (data: any) => void;
  onCancel: () => void;
  loading: boolean;
}

function AddCertificationForm({
  availableTypes,
  onAdd,
  onCancel,
  loading,
}: AddCertificationFormProps) {
  const [type, setType] = useState(availableTypes[0]);
  const [certNumber, setCertNumber] = useState('');
  const [issuedDate, setIssuedDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [documentUrl, setDocumentUrl] = useState('');

  const handleAdd = () => {
    onAdd({
      type,
      certificationNumber: certNumber || null,
      issuedDate: issuedDate || null,
      expiryDate: expiryDate || null,
      documentUrl: documentUrl || null,
    });
  };

  return (
    <div className="certification-card add-certification-card">
      <h3 className="certification-name">Add New Certification</h3>

      <div className="profile-form-group">
        <label className="profile-label">
          Certification Type <span className="required">*</span>
        </label>
        <select
          className="profile-select"
          value={type}
          onChange={(e) => setType(e.target.value as CertificationType)}
        >
          {availableTypes.map((t) => (
            <option key={t} value={t}>
              {CERTIFICATION_TYPE_LABELS[t]}
            </option>
          ))}
        </select>
      </div>

      <div className="profile-form-group">
        <label className="profile-label">Certification Number</label>
        <input
          type="text"
          className="profile-input"
          value={certNumber}
          onChange={(e) => setCertNumber(e.target.value)}
          placeholder="e.g., USDA-ORG-12345"
        />
      </div>

      <div className="certification-dates">
        <div className="profile-form-group">
          <label className="profile-label">Issued Date</label>
          <input
            type="date"
            className="profile-input"
            value={issuedDate}
            onChange={(e) => setIssuedDate(e.target.value)}
          />
        </div>
        <div className="profile-form-group">
          <label className="profile-label">Expiry Date</label>
          <input
            type="date"
            className="profile-input"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
          />
        </div>
      </div>

      <div className="profile-form-group">
        <label className="profile-label">Document URL</label>
        <input
          type="url"
          className="profile-input"
          value={documentUrl}
          onChange={(e) => setDocumentUrl(e.target.value)}
          placeholder="https://..."
        />
      </div>

      <div className="profile-actions">
        <button
          type="button"
          className="profile-button profile-button-secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="button"
          className="profile-button profile-button-primary"
          onClick={handleAdd}
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Certification'}
        </button>
      </div>
    </div>
  );
}
