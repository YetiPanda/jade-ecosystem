/**
 * Vendor Profile Page
 * Feature 011: Vendor Portal MVP
 * Sprint B.1: Profile Management UI
 *
 * Main vendor profile management interface with tabbed navigation
 */

import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Store, Palette, Award, Info } from 'lucide-react';

import { BrandIdentityForm } from '@/components/vendor/profile/BrandIdentityForm';
import { VisualIdentityForm } from '@/components/vendor/profile/VisualIdentityForm';
import { ValuesSelector } from '@/components/vendor/profile/ValuesSelector';
import { CertificationsManager } from '@/components/vendor/profile/CertificationsManager';
import { ProfileCompletenessIndicator } from '@/components/vendor/profile/ProfileCompletenessIndicator';
import { VENDOR_PROFILE_QUERY } from '@/graphql/queries/vendor-profile';

/**
 * VendorProfilePage
 *
 * Tabbed interface for managing vendor profile:
 * - Brand Identity: Name, tagline, story, mission, video
 * - Visual Identity: Logo, hero image, colors, gallery
 * - Values & Certifications: Brand values and certifications
 */
export function VendorProfilePage() {
  const [activeTab, setActiveTab] = useState('brand');

  // Fetch vendor profile data
  const { data, loading, error, refetch } = useQuery(VENDOR_PROFILE_QUERY, {
    fetchPolicy: 'cache-and-network',
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load your profile. Please try again later.
            <br />
            <span className="text-sm text-muted-foreground">{error.message}</span>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const profile = data?.vendorProfile;

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vendor Profile</h1>
          <p className="text-muted-foreground mt-1">
            Manage your brand identity, values, and certifications
          </p>
        </div>
      </div>

      {/* Completeness Indicator */}
      <ProfileCompletenessIndicator
        completenessScore={profile?.completenessScore || 0}
        profile={profile}
      />

      {/* Profile Info Banner */}
      {(!profile || profile.completenessScore < 50) && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Complete your profile to get discovered!</strong> Spas are 5x more likely to
            view vendors with complete profiles (85%+ completeness score).
          </AlertDescription>
        </Alert>
      )}

      {/* Tabbed Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
          <TabsTrigger value="brand" className="space-x-2">
            <Store className="h-4 w-4" />
            <span>Brand Identity</span>
          </TabsTrigger>
          <TabsTrigger value="visual" className="space-x-2">
            <Palette className="h-4 w-4" />
            <span>Visual Identity</span>
          </TabsTrigger>
          <TabsTrigger value="values" className="space-x-2">
            <Award className="h-4 w-4" />
            <span>Values & Certifications</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Brand Identity */}
        <TabsContent value="brand" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Brand Identity</CardTitle>
              <CardDescription>
                Tell your brand story and communicate your mission to spas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BrandIdentityForm profile={profile} onSuccess={refetch} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Visual Identity */}
        <TabsContent value="visual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Visual Identity</CardTitle>
              <CardDescription>
                Upload your logo, hero image, brand colors, and product gallery
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VisualIdentityForm profile={profile} onSuccess={refetch} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Values & Certifications */}
        <TabsContent value="values" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Brand Values</CardTitle>
              <CardDescription>
                Select the values that define your brand (up to 25)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ValuesSelector
                selectedValues={profile?.values || []}
                onSuccess={refetch}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Certifications</CardTitle>
              <CardDescription>
                Upload certifications to build trust with spas (reviewed within 3 business days)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CertificationsManager
                certifications={profile?.certifications || []}
                onSuccess={refetch}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
