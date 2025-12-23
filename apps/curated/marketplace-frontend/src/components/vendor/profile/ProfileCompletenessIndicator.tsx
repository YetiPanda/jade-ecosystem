/**
 * Profile Completeness Indicator
 * Feature 011: Vendor Portal MVP
 * Sprint B.1: Profile Management UI
 *
 * Visual indicator of profile completion with actionable recommendations
 */

import React from 'react';
import { Card, CardContent } from '@jade/ui/components';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';

interface ProfileCompleteness {
  completenessScore: number;
  profile: any | null;
}

/**
 * Get missing sections based on profile data
 */
function getMissingSections(profile: any): Array<{ label: string; priority: 'high' | 'medium' | 'low' }> {
  if (!profile) {
    return [{ label: 'Create your profile', priority: 'high' }];
  }

  const missing: Array<{ label: string; priority: 'high' | 'medium' | 'low' }> = [];

  // High priority (critical for discovery)
  if (!profile.brandName) missing.push({ label: 'Brand name', priority: 'high' });
  if (!profile.logoUrl) missing.push({ label: 'Logo', priority: 'high' });
  if (!profile.tagline) missing.push({ label: 'Tagline', priority: 'high' });
  if (!profile.values || profile.values.length < 3) {
    missing.push({ label: 'Brand values (minimum 3)', priority: 'high' });
  }

  // Medium priority (important for credibility)
  if (!profile.founderStory || profile.founderStory.length < 100) {
    missing.push({ label: 'Founder story (minimum 100 characters)', priority: 'medium' });
  }
  if (!profile.heroImageUrl) missing.push({ label: 'Hero image', priority: 'medium' });
  if (!profile.missionStatement) missing.push({ label: 'Mission statement', priority: 'medium' });
  if (!profile.certifications || profile.certifications.length === 0) {
    missing.push({ label: 'At least 1 certification', priority: 'medium' });
  }

  // Low priority (nice to have)
  if (!profile.brandVideoUrl) missing.push({ label: 'Brand video', priority: 'low' });
  if (!profile.galleryImages || profile.galleryImages.length < 3) {
    missing.push({ label: 'Gallery images (minimum 3)', priority: 'low' });
  }
  if (!profile.websiteUrl) missing.push({ label: 'Website URL', priority: 'low' });
  if (!profile.socialLinks || Object.keys(profile.socialLinks).length < 2) {
    missing.push({ label: 'Social links (minimum 2)', priority: 'low' });
  }

  return missing;
}

/**
 * Get completion status badge
 */
function getCompletionStatus(score: number): {
  label: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
  color: string;
} {
  if (score >= 85) {
    return { label: 'Excellent', variant: 'default', color: 'text-green-600' };
  } else if (score >= 70) {
    return { label: 'Good', variant: 'secondary', color: 'text-blue-600' };
  } else if (score >= 50) {
    return { label: 'Fair', variant: 'outline', color: 'text-yellow-600' };
  } else {
    return { label: 'Incomplete', variant: 'destructive', color: 'text-red-600' };
  }
}

export function ProfileCompletenessIndicator({ completenessScore, profile }: ProfileCompleteness) {
  const missingSections = getMissingSections(profile);
  const status = getCompletionStatus(completenessScore);

  return (
    <Card className="border-l-4 border-l-primary">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Score Display */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Profile Completeness</h3>
              <p className="text-sm text-muted-foreground">
                {completenessScore}% complete
              </p>
            </div>
            <Badge variant={status.variant} className="text-sm">
              {status.label}
            </Badge>
          </div>

          {/* Progress Bar */}
          <Progress value={completenessScore} className="h-2" />

          {/* Missing Sections */}
          {missingSections.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Complete these sections to improve your profile:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {missingSections.slice(0, 6).map((section, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm"
                  >
                    {section.priority === 'high' ? (
                      <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                    ) : section.priority === 'medium' ? (
                      <Circle className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                    ) : (
                      <Circle className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    )}
                    <span className={section.priority === 'high' ? 'font-medium' : ''}>
                      {section.label}
                    </span>
                  </div>
                ))}
              </div>
              {missingSections.length > 6 && (
                <p className="text-xs text-muted-foreground">
                  +{missingSections.length - 6} more sections to complete
                </p>
              )}
            </div>
          )}

          {/* Completion Message */}
          {missingSections.length === 0 && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">
                Your profile is complete! Great job!
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
