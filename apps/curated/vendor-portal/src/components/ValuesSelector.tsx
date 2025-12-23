import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_VENDOR_VALUE, REMOVE_VENDOR_VALUE } from '../graphql/profile.mutations';
import { VendorValue, VENDOR_VALUE_LABELS } from '../types/profile';
import './ValuesSelector.css';

export interface ValuesSelectorProps {
  selectedValues: VendorValue[];
  onUpdate?: () => void;
}

// Group values by category for better UX
const VALUE_CATEGORIES = {
  'Sourcing & Production': [
    VendorValue.ORGANIC,
    VendorValue.VEGAN,
    VendorValue.CRUELTY_FREE,
    VendorValue.SUSTAINABLY_SOURCED,
    VendorValue.FAIR_TRADE,
    VendorValue.HANDMADE,
    VendorValue.SMALL_BATCH,
  ],
  'Ingredients': [
    VendorValue.NATURAL_INGREDIENTS,
    VendorValue.PLANT_BASED,
    VendorValue.CLEAN_BEAUTY,
    VendorValue.FRAGRANCE_FREE,
    VendorValue.ESSENTIAL_OILS_ONLY,
    VendorValue.PARABEN_FREE,
    VendorValue.SULFATE_FREE,
  ],
  'Business Practices': [
    VendorValue.WOMAN_OWNED,
    VendorValue.MINORITY_OWNED,
    VendorValue.FAMILY_OWNED,
    VendorValue.CARBON_NEUTRAL,
    VendorValue.GIVES_BACK,
  ],
  'Packaging': [
    VendorValue.RECYCLABLE_PACKAGING,
    VendorValue.PLASTIC_FREE,
    VendorValue.REFILLABLE,
    VendorValue.MINIMAL_PACKAGING,
  ],
  'Origin': [VendorValue.MADE_IN_USA, VendorValue.LOCAL],
};

export function ValuesSelector({ selectedValues, onUpdate }: ValuesSelectorProps) {
  const [localSelectedValues, setLocalSelectedValues] = useState<Set<VendorValue>>(
    new Set(selectedValues)
  );

  const [addValue, { loading: addLoading }] = useMutation(ADD_VENDOR_VALUE, {
    onCompleted: () => {
      onUpdate?.();
    },
  });

  const [removeValue, { loading: removeLoading }] = useMutation(REMOVE_VENDOR_VALUE, {
    onCompleted: () => {
      onUpdate?.();
    },
  });

  const loading = addLoading || removeLoading;

  const handleToggleValue = async (value: VendorValue) => {
    const isSelected = localSelectedValues.has(value);

    // Optimistic UI update
    const newValues = new Set(localSelectedValues);
    if (isSelected) {
      newValues.delete(value);
    } else {
      newValues.add(value);
    }
    setLocalSelectedValues(newValues);

    try {
      if (isSelected) {
        await removeValue({
          variables: { input: { value } },
        });
      } else {
        await addValue({
          variables: { input: { value } },
        });
      }
    } catch (err) {
      // Revert on error
      setLocalSelectedValues(new Set(selectedValues));
      console.error('Failed to update value:', err);
    }
  };

  return (
    <div className="profile-section">
      <div className="profile-section-header">
        <div>
          <h2 className="profile-section-title">Brand Values</h2>
          <p className="profile-section-subtitle">
            Select all values that apply to your brand ({localSelectedValues.size} selected)
          </p>
        </div>
      </div>

      <div className="profile-section-content">
        <p className="profile-hint" style={{ marginBottom: '1rem' }}>
          These values will be displayed on your vendor profile and used to help spas discover
          your products based on their preferences.
        </p>

        {Object.entries(VALUE_CATEGORIES).map(([category, values]) => (
          <div key={category} className="values-category">
            <h3 className="values-category-title">{category}</h3>
            <div className="values-grid">
              {values.map((value) => {
                const isSelected = localSelectedValues.has(value);
                return (
                  <button
                    key={value}
                    type="button"
                    className={`value-chip ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleToggleValue(value)}
                    disabled={loading}
                  >
                    <span className="value-chip-icon">{isSelected ? '✓' : '+'}</span>
                    <span className="value-chip-label">{VENDOR_VALUE_LABELS[value]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {localSelectedValues.size === 0 && (
          <div className="values-empty-state">
            <p>👆 Select values that represent your brand to help spas discover you</p>
          </div>
        )}
      </div>
    </div>
  );
}
