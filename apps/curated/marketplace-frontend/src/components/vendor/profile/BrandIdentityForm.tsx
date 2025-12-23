/**
 * Brand Identity Form
 * Feature 011: Vendor Portal MVP
 * Sprint B.1: Profile Management UI
 *
 * Form for editing brand name, tagline, founder story, mission, and brand video
 */

import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Save, Youtube } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UPDATE_VENDOR_PROFILE_MUTATION } from '@/graphql/queries/vendor-profile';

// Validation schema
const brandIdentitySchema = z.object({
  brandName: z
    .string()
    .min(2, 'Brand name must be at least 2 characters')
    .max(255, 'Brand name is too long'),
  tagline: z
    .string()
    .max(200, 'Tagline is too long (max 200 characters)')
    .optional()
    .or(z.literal('')),
  founderStory: z
    .string()
    .max(2000, 'Founder story is too long (max 2000 characters)')
    .optional()
    .or(z.literal('')),
  missionStatement: z
    .string()
    .max(500, 'Mission statement is too long (max 500 characters)')
    .optional()
    .or(z.literal('')),
  brandVideoUrl: z
    .string()
    .url('Must be a valid URL')
    .max(500, 'URL is too long')
    .optional()
    .or(z.literal('')),
});

type BrandIdentityFormData = z.infer<typeof brandIdentitySchema>;

interface BrandIdentityFormProps {
  profile: any | null;
  onSuccess: () => void;
}

export function BrandIdentityForm({ profile, onSuccess }: BrandIdentityFormProps) {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
  } = useForm<BrandIdentityFormData>({
    resolver: zodResolver(brandIdentitySchema),
    defaultValues: {
      brandName: profile?.brandName || '',
      tagline: profile?.tagline || '',
      founderStory: profile?.founderStory || '',
      missionStatement: profile?.missionStatement || '',
      brandVideoUrl: profile?.brandVideoUrl || '',
    },
  });

  const [updateProfile, { loading, error }] = useMutation(UPDATE_VENDOR_PROFILE_MUTATION, {
    onCompleted: (data) => {
      if (data.updateVendorProfile.success) {
        setSuccessMessage('Brand identity updated successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
        onSuccess();
      }
    },
  });

  const onSubmit = async (data: BrandIdentityFormData) => {
    // Remove empty strings to avoid sending null values
    const input = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== '')
    );

    await updateProfile({
      variables: { input },
    });
  };

  // Watch field values for character count
  const founderStory = watch('founderStory');
  const missionStatement = watch('missionStatement');

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

      {/* Brand Name */}
      <div className="space-y-2">
        <Label htmlFor="brandName">
          Brand Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="brandName"
          placeholder="e.g., Radiant Glow Skincare"
          {...register('brandName')}
          className={errors.brandName ? 'border-red-500' : ''}
        />
        {errors.brandName && (
          <p className="text-sm text-red-500">{errors.brandName.message}</p>
        )}
      </div>

      {/* Tagline */}
      <div className="space-y-2">
        <Label htmlFor="tagline">Tagline</Label>
        <Input
          id="tagline"
          placeholder="e.g., Pure, sustainable skincare for every skin type"
          {...register('tagline')}
          className={errors.tagline ? 'border-red-500' : ''}
        />
        {errors.tagline && (
          <p className="text-sm text-red-500">{errors.tagline.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          A short, memorable phrase that captures your brand essence (max 200 characters)
        </p>
      </div>

      {/* Founder Story */}
      <div className="space-y-2">
        <Label htmlFor="founderStory">Founder Story</Label>
        <Textarea
          id="founderStory"
          placeholder="Tell the story behind your brand. What inspired you to start? What challenges did you overcome?"
          rows={6}
          {...register('founderStory')}
          className={errors.founderStory ? 'border-red-500' : ''}
        />
        {errors.founderStory && (
          <p className="text-sm text-red-500">{errors.founderStory.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          {founderStory?.length || 0} / 2000 characters
          {founderStory && founderStory.length < 100 && (
            <span className="text-yellow-600 ml-2">
              (Recommended: at least 100 characters for better engagement)
            </span>
          )}
        </p>
      </div>

      {/* Mission Statement */}
      <div className="space-y-2">
        <Label htmlFor="missionStatement">Mission Statement</Label>
        <Textarea
          id="missionStatement"
          placeholder="e.g., To create clean beauty products that empower people to feel confident in their skin"
          rows={3}
          {...register('missionStatement')}
          className={errors.missionStatement ? 'border-red-500' : ''}
        />
        {errors.missionStatement && (
          <p className="text-sm text-red-500">{errors.missionStatement.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          {missionStatement?.length || 0} / 500 characters
        </p>
      </div>

      {/* Brand Video URL */}
      <div className="space-y-2">
        <Label htmlFor="brandVideoUrl" className="flex items-center gap-2">
          <Youtube className="h-4 w-4" />
          Brand Video URL
        </Label>
        <Input
          id="brandVideoUrl"
          type="url"
          placeholder="e.g., https://youtube.com/watch?v=..."
          {...register('brandVideoUrl')}
          className={errors.brandVideoUrl ? 'border-red-500' : ''}
        />
        {errors.brandVideoUrl && (
          <p className="text-sm text-red-500">{errors.brandVideoUrl.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          YouTube, Vimeo, or other video platform URL showcasing your brand
        </p>
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
              Save Brand Identity
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
