/**
 * Visual Identity Form
 * Feature 011: Vendor Portal MVP
 * Sprint B.1: Profile Management UI
 *
 * Form for uploading logo, hero image, brand colors, and product gallery
 */

import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Save, Upload, X, Plus, Image as ImageIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UPDATE_VENDOR_PROFILE_MUTATION } from '@/graphql/queries/vendor-profile';

// Validation schema
const visualIdentitySchema = z.object({
  logoUrl: z
    .string()
    .url('Must be a valid URL')
    .max(500, 'URL is too long')
    .optional()
    .or(z.literal('')),
  heroImageUrl: z
    .string()
    .url('Must be a valid URL')
    .max(500, 'URL is too long')
    .optional()
    .or(z.literal('')),
  brandColorPrimary: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color (e.g., #FF5733)')
    .length(7, 'Hex color must be exactly 7 characters (#RRGGBB)')
    .optional()
    .or(z.literal('')),
  brandColorSecondary: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color (e.g., #33FF57)')
    .length(7, 'Hex color must be exactly 7 characters (#RRGGBB)')
    .optional()
    .or(z.literal('')),
  galleryImages: z
    .array(
      z.object({
        url: z.string().url('Must be a valid URL'),
      })
    )
    .max(10, 'Maximum 10 gallery images allowed'),
});

type VisualIdentityFormData = z.infer<typeof visualIdentitySchema>;

interface VisualIdentityFormProps {
  profile: any | null;
  onSuccess: () => void;
}

export function VisualIdentityForm({ profile, onSuccess }: VisualIdentityFormProps) {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    control,
    watch,
  } = useForm<VisualIdentityFormData>({
    resolver: zodResolver(visualIdentitySchema),
    defaultValues: {
      logoUrl: profile?.logoUrl || '',
      heroImageUrl: profile?.heroImageUrl || '',
      brandColorPrimary: profile?.brandColorPrimary || '',
      brandColorSecondary: profile?.brandColorSecondary || '',
      galleryImages:
        profile?.galleryImages?.map((url: string) => ({ url })) || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'galleryImages',
  });

  const [updateProfile, { loading, error }] = useMutation(UPDATE_VENDOR_PROFILE_MUTATION, {
    onCompleted: (data) => {
      if (data.updateVendorProfile.success) {
        setSuccessMessage('Visual identity updated successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
        onSuccess();
      }
    },
  });

  const onSubmit = async (data: VisualIdentityFormData) => {
    // Convert gallery images array to string array
    const galleryUrls = data.galleryImages.map((img) => img.url);

    // Remove empty strings
    const input: any = {};
    if (data.logoUrl) input.logoUrl = data.logoUrl;
    if (data.heroImageUrl) input.heroImageUrl = data.heroImageUrl;
    if (data.brandColorPrimary) input.brandColorPrimary = data.brandColorPrimary;
    if (data.brandColorSecondary) input.brandColorSecondary = data.brandColorSecondary;
    if (galleryUrls.length > 0) input.galleryImages = galleryUrls;

    await updateProfile({
      variables: { input },
    });
  };

  // Watch colors for preview
  const primaryColor = watch('brandColorPrimary');
  const secondaryColor = watch('brandColorSecondary');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

      {/* Logo URL */}
      <div className="space-y-2">
        <Label htmlFor="logoUrl" className="flex items-center gap-2">
          <ImageIcon className="h-4 w-4" />
          Logo URL
        </Label>
        <Input
          id="logoUrl"
          type="url"
          placeholder="e.g., https://cdn.example.com/logo.png"
          {...register('logoUrl')}
          className={errors.logoUrl ? 'border-red-500' : ''}
        />
        {errors.logoUrl && (
          <p className="text-sm text-red-500">{errors.logoUrl.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Upload your logo to a service like Cloudinary or S3, then paste the URL here
        </p>
      </div>

      {/* Hero Image URL */}
      <div className="space-y-2">
        <Label htmlFor="heroImageUrl" className="flex items-center gap-2">
          <ImageIcon className="h-4 w-4" />
          Hero Image URL
        </Label>
        <Input
          id="heroImageUrl"
          type="url"
          placeholder="e.g., https://cdn.example.com/hero.jpg"
          {...register('heroImageUrl')}
          className={errors.heroImageUrl ? 'border-red-500' : ''}
        />
        {errors.heroImageUrl && (
          <p className="text-sm text-red-500">{errors.heroImageUrl.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Large banner image for your vendor profile page (recommended: 1920x600px)
        </p>
      </div>

      {/* Brand Colors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Primary Color */}
        <div className="space-y-2">
          <Label htmlFor="brandColorPrimary">Primary Brand Color</Label>
          <div className="flex gap-2">
            <Input
              id="brandColorPrimary"
              placeholder="#FF5733"
              {...register('brandColorPrimary')}
              className={errors.brandColorPrimary ? 'border-red-500' : ''}
            />
            <div
              className="w-12 h-10 rounded border-2 border-gray-300 flex-shrink-0"
              style={{
                backgroundColor: primaryColor || '#cccccc',
              }}
            />
          </div>
          {errors.brandColorPrimary && (
            <p className="text-sm text-red-500">{errors.brandColorPrimary.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Hex format (e.g., #FF5733)
          </p>
        </div>

        {/* Secondary Color */}
        <div className="space-y-2">
          <Label htmlFor="brandColorSecondary">Secondary Brand Color</Label>
          <div className="flex gap-2">
            <Input
              id="brandColorSecondary"
              placeholder="#33FF57"
              {...register('brandColorSecondary')}
              className={errors.brandColorSecondary ? 'border-red-500' : ''}
            />
            <div
              className="w-12 h-10 rounded border-2 border-gray-300 flex-shrink-0"
              style={{
                backgroundColor: secondaryColor || '#cccccc',
              }}
            />
          </div>
          {errors.brandColorSecondary && (
            <p className="text-sm text-red-500">{errors.brandColorSecondary.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Hex format (e.g., #33FF57)
          </p>
        </div>
      </div>

      {/* Gallery Images */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Product Gallery (up to 10 images)</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ url: '' })}
            disabled={fields.length >= 10}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Image
          </Button>
        </div>

        {fields.length === 0 && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-muted-foreground">
              No gallery images yet. Click "Add Image" to get started.
            </p>
          </div>
        )}

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Input
                placeholder={`Image ${index + 1} URL (e.g., https://cdn.example.com/product-${index + 1}.jpg)`}
                {...register(`galleryImages.${index}.url`)}
                className={
                  errors.galleryImages?.[index]?.url ? 'border-red-500' : ''
                }
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {errors.galleryImages && (
          <p className="text-sm text-red-500">
            {errors.galleryImages.message || 'Invalid gallery image URLs'}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={loading || !isDirty}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Visual Identity
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
