/**
 * Values Selector
 * Feature 011: Vendor Portal MVP
 * Sprint B.1: Profile Management UI
 *
 * Multi-select component for choosing brand values (up to 25) across 4 categories
 */

import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Loader2, Save, Check } from 'lucide-react';

import { Button } from '@jade/ui/components';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UPDATE_VENDOR_PROFILE_MUTATION } from '@/graphql/queries/vendor-profile';

// Value categories and options (from backend VendorValueSchema)
const VALUE_CATEGORIES = [
  {
    category: 'Ingredient Philosophy',
    values: [
      { value: 'CLEAN_BEAUTY', label: 'Clean Beauty' },
      { value: 'ORGANIC', label: 'Organic' },
      { value: 'NATURAL', label: 'Natural' },
      { value: 'VEGAN', label: 'Vegan' },
      { value: 'CRUELTY_FREE', label: 'Cruelty-Free' },
      { value: 'FRAGRANCE_FREE', label: 'Fragrance-Free' },
      { value: 'PARABEN_FREE', label: 'Paraben-Free' },
      { value: 'SULFATE_FREE', label: 'Sulfate-Free' },
    ],
  },
  {
    category: 'Sustainability',
    values: [
      { value: 'SUSTAINABLE', label: 'Sustainable' },
      { value: 'ECO_PACKAGING', label: 'Eco-Friendly Packaging' },
      { value: 'REFILLABLE', label: 'Refillable' },
      { value: 'ZERO_WASTE', label: 'Zero Waste' },
      { value: 'CARBON_NEUTRAL', label: 'Carbon Neutral' },
      { value: 'REEF_SAFE', label: 'Reef Safe' },
    ],
  },
  {
    category: 'Founder Identity',
    values: [
      { value: 'WOMAN_FOUNDED', label: 'Woman-Founded' },
      { value: 'BIPOC_OWNED', label: 'BIPOC-Owned' },
      { value: 'LGBTQ_OWNED', label: 'LGBTQ+ Owned' },
      { value: 'VETERAN_OWNED', label: 'Veteran-Owned' },
      { value: 'FAMILY_OWNED', label: 'Family-Owned' },
      { value: 'SMALL_BATCH', label: 'Small Batch' },
    ],
  },
  {
    category: 'Specialization',
    values: [
      { value: 'MEDICAL_GRADE', label: 'Medical Grade' },
      { value: 'ESTHETICIAN_DEVELOPED', label: 'Esthetician-Developed' },
      { value: 'DERMATOLOGIST_TESTED', label: 'Dermatologist-Tested' },
      { value: 'CLINICAL_RESULTS', label: 'Clinical Results' },
      { value: 'PROFESSIONAL_ONLY', label: 'Professional-Only' },
    ],
  },
];

interface ValuesSelectorProps {
  selectedValues: string[];
  onSuccess: () => void;
}

export function ValuesSelector({ selectedValues: initialValues, onSuccess }: ValuesSelectorProps) {
  const [selectedValues, setSelectedValues] = useState<string[]>(initialValues || []);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [updateProfile, { loading, error }] = useMutation(UPDATE_VENDOR_PROFILE_MUTATION, {
    onCompleted: (data) => {
      if (data.updateVendorProfile.success) {
        setSuccessMessage('Brand values updated successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
        onSuccess();
      }
    },
  });

  const toggleValue = (value: string) => {
    setSelectedValues((prev) => {
      if (prev.includes(value)) {
        return prev.filter((v) => v !== value);
      } else if (prev.length < 25) {
        return [...prev, value];
      } else {
        return prev; // Max 25 values
      }
    });
  };

  const handleSubmit = async () => {
    await updateProfile({
      variables: {
        input: {
          values: selectedValues,
        },
      },
    });
  };

  const isDirty = JSON.stringify(selectedValues.sort()) !== JSON.stringify((initialValues || []).sort());

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      {/* Selected Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {selectedValues.length} of 25 values selected
          {selectedValues.length >= 3 && (
            <span className="text-green-600 ml-2">
              ✓ Minimum 3 values met
            </span>
          )}
          {selectedValues.length < 3 && (
            <span className="text-yellow-600 ml-2">
              (Select at least 3 values for better profile completeness)
            </span>
          )}
        </p>
        {selectedValues.length === 25 && (
          <Badge variant="secondary">Maximum reached</Badge>
        )}
      </div>

      {/* Value Categories */}
      <div className="space-y-6">
        {VALUE_CATEGORIES.map((category) => (
          <div key={category.category} className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">
              {category.category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {category.values.map((item) => {
                const isSelected = selectedValues.includes(item.value);
                return (
                  <Button
                    key={item.value}
                    type="button"
                    variant={isSelected ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleValue(item.value)}
                    className={`transition-all ${
                      isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3 mr-1" />}
                    {item.label}
                  </Button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => setSelectedValues(initialValues || [])}
          disabled={!isDirty || loading}
        >
          Reset
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={loading || !isDirty}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Values
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
