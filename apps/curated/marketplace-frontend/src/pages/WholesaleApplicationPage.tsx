/**
 * Wholesale Application Page
 * Week 8: Practitioner Verification System
 *
 * Progressive Disclosure Pattern:
 * - Glance: Overview and simple "3 Steps" intro
 * - Scan: Section-by-section form with progress bar
 * - Study: Review complete application before submission
 *
 * Features:
 * - Multi-step form with validation
 * - Document upload for licenses and photos
 * - Wholesale paperwork acknowledgment
 * - Draft save functionality
 * - Application status tracking
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@jade/ui/components';
import { Button } from '@jade/ui/components';
import { Input } from '@jade/ui/components';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { Badge } from '../components/ui/badge';
import { FileUpload, UploadedFile } from '../components/FileUpload';
import {
  CheckCircle,
  AlertCircle,
  Building2,
  FileText,
  Camera,
  Send,
  Save,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';

// GraphQL Queries
const MY_WHOLESALE_APPLICATION = gql`
  query MyWholesaleApplication {
    myWholesaleApplication {
      id
      businessName
      businessType
      taxId
      businessAddress {
        street
        street2
        city
        state
        zipCode
        country
      }
      yearsInOperation
      websiteUrl
      phoneNumber
      licenseDocuments {
        id
        filename
        url
        size
        mimeType
        uploadedAt
        documentType
      }
      locationPhotos {
        id
        filename
        url
        size
        mimeType
        uploadedAt
        documentType
      }
      wholesalePaperworkSigned
      status
      reviewNotes
      rejectionReason
      submittedAt
      reviewedAt
      approvedAt
      applicantNotes
      createdAt
      updatedAt
    }
  }
`;

const CREATE_APPLICATION = gql`
  mutation CreateWholesaleApplication($input: CreateWholesaleApplicationInput!) {
    createWholesaleApplication(input: $input) {
      application {
        id
        businessName
        status
        createdAt
      }
      message
    }
  }
`;

const UPDATE_APPLICATION = gql`
  mutation UpdateWholesaleApplication($id: ID!, $input: UpdateWholesaleApplicationInput!) {
    updateWholesaleApplication(id: $id, input: $input) {
      id
      businessName
      status
      updatedAt
    }
  }
`;

const SUBMIT_APPLICATION = gql`
  mutation SubmitWholesaleApplication($id: ID!) {
    submitWholesaleApplication(id: $id) {
      application {
        id
        status
        submittedAt
      }
      message
    }
  }
`;

enum ApplicationStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  INFO_REQUESTED = 'INFO_REQUESTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
}

enum BusinessType {
  DAY_SPA = 'DAY_SPA',
  MEDICAL_SPA = 'MEDICAL_SPA',
  SALON = 'SALON',
  WELLNESS_CENTER = 'WELLNESS_CENTER',
  CLINIC = 'CLINIC',
  INDEPENDENT_PRACTITIONER = 'INDEPENDENT_PRACTITIONER',
  RETAIL_STORE = 'RETAIL_STORE',
  OTHER = 'OTHER',
}

interface FormData {
  businessName: string;
  businessType: BusinessType | '';
  taxId: string;
  street: string;
  street2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  yearsInOperation: string;
  websiteUrl: string;
  phoneNumber: string;
  applicantNotes: string;
  wholesalePaperworkSigned: boolean;
}

const BUSINESS_TYPE_LABELS: Record<BusinessType, string> = {
  [BusinessType.DAY_SPA]: 'Day Spa',
  [BusinessType.MEDICAL_SPA]: 'Medical Spa',
  [BusinessType.SALON]: 'Salon',
  [BusinessType.WELLNESS_CENTER]: 'Wellness Center',
  [BusinessType.CLINIC]: 'Clinic',
  [BusinessType.INDEPENDENT_PRACTITIONER]: 'Independent Practitioner',
  [BusinessType.RETAIL_STORE]: 'Retail Store',
  [BusinessType.OTHER]: 'Other',
};

export function WholesaleApplicationPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0); // 0 = Glance, 1-3 = Scan steps, 4 = Study
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    businessType: '',
    taxId: '',
    street: '',
    street2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    yearsInOperation: '',
    websiteUrl: '',
    phoneNumber: '',
    applicantNotes: '',
    wholesalePaperworkSigned: false,
  });
  const [licenseDocuments, setLicenseDocuments] = useState<UploadedFile[]>([]);
  const [locationPhotos, setLocationPhotos] = useState<UploadedFile[]>([]);

  const { data, loading, error } = useQuery(MY_WHOLESALE_APPLICATION);
  const [createApplication, { loading: creating }] = useMutation(CREATE_APPLICATION);
  const [updateApplication, { loading: updating }] = useMutation(UPDATE_APPLICATION);
  const [submitApplication, { loading: submitting }] = useMutation(SUBMIT_APPLICATION);

  const existingApplication = data?.myWholesaleApplication;

  // Check application status
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Building2 className="h-12 w-12 animate-pulse mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading application...</p>
        </div>
      </div>
    );
  }

  if (existingApplication?.status === ApplicationStatus.APPROVED) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="border-subtle shadow-warm">
          <CardHeader>
            <CardTitle className="flex items-center text-green-600">
              <CheckCircle className="h-6 w-6 mr-2" />
              Wholesale Account Approved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Your wholesale account has been approved! You now have access to wholesale pricing.
            </p>
            <Button onClick={() => navigate('/app/marketplace')}>
              Browse Products
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (existingApplication?.status === ApplicationStatus.UNDER_REVIEW || existingApplication?.status === ApplicationStatus.PENDING) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="border-subtle shadow-warm">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-600">
              <AlertCircle className="h-6 w-6 mr-2" />
              Application Under Review
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Your application is currently being reviewed by our team. We'll notify you via email once a decision has been made.
            </p>
            <div className="p-4 bg-accent/20 rounded-lg">
              <p className="text-sm font-medium">Application Details:</p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                <li>Business: {existingApplication.businessName}</li>
                <li>Type: {BUSINESS_TYPE_LABELS[existingApplication.businessType as BusinessType]}</li>
                <li>Submitted: {new Date(existingApplication.submittedAt).toLocaleDateString()}</li>
              </ul>
            </div>
            <Button variant="outline" onClick={() => navigate('/app/marketplace')}>
              Return to Marketplace
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveDraft = async () => {
    // TODO: Implement save draft functionality
    console.log('Saving draft...', formData);
  };

  const handleSubmit = async () => {
    // TODO: Implement full submission
    console.log('Submitting application...', formData);
  };

  // File upload handlers
  const handleLicenseUpload = async (files: File[]): Promise<void> => {
    // TODO: Implement actual file upload to server
    // For now, create mock uploaded file objects
    const newFiles: UploadedFile[] = files.map((file, index) => ({
      id: `license-${Date.now()}-${index}`,
      filename: file.name,
      url: URL.createObjectURL(file),
      size: file.size,
      mimeType: file.type,
      uploadedAt: new Date().toISOString(),
      documentType: 'LICENSE',
    }));

    setLicenseDocuments((prev) => [...prev, ...newFiles]);
  };

  const handleLicenseRemove = (fileId: string) => {
    setLicenseDocuments((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handlePhotoUpload = async (files: File[]): Promise<void> => {
    // TODO: Implement actual file upload to server
    // For now, create mock uploaded file objects
    const newFiles: UploadedFile[] = files.map((file, index) => ({
      id: `photo-${Date.now()}-${index}`,
      filename: file.name,
      url: URL.createObjectURL(file),
      size: file.size,
      mimeType: file.type,
      uploadedAt: new Date().toISOString(),
      documentType: 'LOCATION_PHOTO',
    }));

    setLocationPhotos((prev) => [...prev, ...newFiles]);
  };

  const handlePhotoRemove = (fileId: string) => {
    setLocationPhotos((prev) => prev.filter((f) => f.id !== fileId));
  };

  // Glance Level: Simple Overview
  if (currentStep === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="border-subtle shadow-warm">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-light mb-2">
              Apply for Wholesale Account
            </CardTitle>
            <CardDescription className="font-light text-base">
              Get access to professional wholesale pricing in just 3 simple steps
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* 3 Steps Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 rounded-lg bg-accent/20">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Business Information</h3>
                <p className="text-sm text-muted-foreground">
                  Tell us about your business and location
                </p>
              </div>

              <div className="text-center p-6 rounded-lg bg-accent/20">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-medium mb-2">License Documents</h3>
                <p className="text-sm text-muted-foreground">
                  Upload your professional licenses
                </p>
              </div>

              <div className="text-center p-6 rounded-lg bg-accent/20">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Camera className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Location Photos</h3>
                <p className="text-sm text-muted-foreground">
                  Share photos of your business location
                </p>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-accent/10 p-6 rounded-lg">
              <h3 className="font-medium mb-3">Wholesale Benefits:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Access to professional-grade products</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Tiered wholesale pricing based on volume</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Dedicated account support</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Early access to new product launches</span>
                </li>
              </ul>
            </div>

            {/* CTA */}
            <div className="flex justify-center">
              <Button size="lg" onClick={handleNext} className="rounded-full px-8">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Scan Level: Step 1 - Business Information
  if (currentStep === 1) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Card className="border-subtle shadow-warm">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <Badge variant="outline">Step 1 of 3</Badge>
              <Button variant="ghost" size="sm" onClick={handleSaveDraft} disabled={updating}>
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
            </div>
            <CardTitle className="font-normal">Business Information</CardTitle>
            <CardDescription className="font-light">
              Tell us about your business and practice
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Business Name */}
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Legal Name *</Label>
              <Input
                id="businessName"
                value={formData.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                placeholder="JADE Wellness Spa LLC"
                required
              />
            </div>

            {/* Business Type */}
            <div className="space-y-2">
              <Label htmlFor="businessType">Business Type *</Label>
              <Select
                value={formData.businessType}
                onValueChange={(value) => handleInputChange('businessType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(BUSINESS_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tax ID */}
            <div className="space-y-2">
              <Label htmlFor="taxId">Tax ID / EIN</Label>
              <Input
                id="taxId"
                value={formData.taxId}
                onChange={(e) => handleInputChange('taxId', e.target.value)}
                placeholder="12-3456789"
              />
            </div>

            {/* Business Address */}
            <div className="space-y-4">
              <Label>Business Address *</Label>
              <div className="grid grid-cols-1 gap-4">
                <Input
                  value={formData.street}
                  onChange={(e) => handleInputChange('street', e.target.value)}
                  placeholder="Street Address"
                  required
                />
                <Input
                  value={formData.street2}
                  onChange={(e) => handleInputChange('street2', e.target.value)}
                  placeholder="Suite, Unit, etc. (optional)"
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="City"
                    required
                  />
                  <Input
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="State"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    placeholder="ZIP Code"
                    required
                  />
                  <Input
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    placeholder="Country"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Years in Operation */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="yearsInOperation">Years in Operation</Label>
                <Input
                  id="yearsInOperation"
                  type="number"
                  value={formData.yearsInOperation}
                  onChange={(e) => handleInputChange('yearsInOperation', e.target.value)}
                  placeholder="5"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  required
                />
              </div>
            </div>

            {/* Website */}
            <div className="space-y-2">
              <Label htmlFor="websiteUrl">Website URL</Label>
              <Input
                id="websiteUrl"
                type="url"
                value={formData.websiteUrl}
                onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                placeholder="https://www.example.com"
              />
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-4 border-t">
              <Button variant="outline" onClick={handleBack} className="rounded-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={handleNext}
                className="rounded-full"
                disabled={!formData.businessName || !formData.businessType || !formData.street || !formData.city || !formData.state || !formData.zipCode || !formData.phoneNumber}
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Scan Level: Step 2 - License Documents
  if (currentStep === 2) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Card className="border-subtle shadow-warm">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <Badge variant="outline">Step 2 of 3</Badge>
              <Button variant="ghost" size="sm" onClick={handleSaveDraft} disabled={updating}>
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
            </div>
            <CardTitle className="font-normal">License Documents</CardTitle>
            <CardDescription className="font-light">
              Upload your professional licenses and business permits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FileUpload
              accept="image/*,.pdf"
              maxSize={10 * 1024 * 1024}
              maxFiles={10}
              files={licenseDocuments}
              onUpload={handleLicenseUpload}
              onRemove={handleLicenseRemove}
              label="License Documents"
              helpText="Upload esthetician licenses, business licenses, resale certificates, or other professional credentials. Accepted formats: JPG, PNG, PDF (max 10MB each)"
              required
            />

            <div className="p-4 bg-accent/20 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Accepted Documents:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Esthetician or Cosmetology License</li>
                <li>• Medical Director Credentials (for medical spas)</li>
                <li>• Business License or Operating Permit</li>
                <li>• Resale Certificate or Tax Exemption</li>
                <li>• Professional Liability Insurance (optional)</li>
              </ul>
            </div>

            <div className="flex justify-between pt-4 border-t">
              <Button variant="outline" onClick={handleBack} className="rounded-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={handleNext}
                className="rounded-full"
                disabled={licenseDocuments.length < 1}
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Scan Level: Step 3 - Location Photos
  if (currentStep === 3) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Card className="border-subtle shadow-warm">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <Badge variant="outline">Step 3 of 3</Badge>
              <Button variant="ghost" size="sm" onClick={handleSaveDraft} disabled={updating}>
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
            </div>
            <CardTitle className="font-normal">Location Photos</CardTitle>
            <CardDescription className="font-light">
              Share photos of your business location
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FileUpload
              accept="image/*"
              maxSize={10 * 1024 * 1024}
              maxFiles={20}
              files={locationPhotos}
              onUpload={handlePhotoUpload}
              onRemove={handlePhotoRemove}
              label="Location Photos"
              helpText="Upload photos of your business exterior, interior, reception area, and treatment rooms. Minimum 3 photos required. Accepted formats: JPG, PNG (max 10MB each)"
              required
            />

            <div className="p-4 bg-accent/20 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Photo Guidelines:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Business exterior with visible signage</li>
                <li>• Reception or waiting area</li>
                <li>• Treatment rooms or service areas</li>
                <li>• Product display or retail area (if applicable)</li>
                <li>• Clear, well-lit photos showing professional environment</li>
              </ul>
            </div>

            <div className="flex justify-between pt-4 border-t">
              <Button variant="outline" onClick={handleBack} className="rounded-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={handleNext}
                className="rounded-full"
                disabled={locationPhotos.length < 3}
              >
                Review Application
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Study Level: Step 4 - Review & Submit
  if (currentStep === 4) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Card className="border-subtle shadow-warm">
          <CardHeader>
            <CardTitle className="font-normal">Review Your Application</CardTitle>
            <CardDescription className="font-light">
              Please review all information before submitting
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Business Information Summary */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium flex items-center">
                  <Building2 className="h-4 w-4 mr-2 text-primary" />
                  Business Information
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setCurrentStep(1)}>
                  Edit
                </Button>
              </div>
              <div className="p-4 bg-accent/10 rounded-lg space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-muted-foreground">Business Name:</div>
                  <div className="font-medium">{formData.businessName || '—'}</div>
                  <div className="text-muted-foreground">Business Type:</div>
                  <div className="font-medium">
                    {formData.businessType ? BUSINESS_TYPE_LABELS[formData.businessType as BusinessType] : '—'}
                  </div>
                  <div className="text-muted-foreground">Tax ID:</div>
                  <div className="font-medium">{formData.taxId || '—'}</div>
                  <div className="text-muted-foreground">Phone:</div>
                  <div className="font-medium">{formData.phoneNumber || '—'}</div>
                </div>
                <div className="pt-2 border-t">
                  <div className="text-muted-foreground mb-1">Address:</div>
                  <div className="font-medium">
                    {formData.street && (
                      <>
                        {formData.street}
                        {formData.street2 && `, ${formData.street2}`}
                        <br />
                        {formData.city}, {formData.state} {formData.zipCode}
                        <br />
                        {formData.country}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* License Documents Summary */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-primary" />
                  License Documents ({licenseDocuments.length})
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setCurrentStep(2)}>
                  Edit
                </Button>
              </div>
              <div className="p-4 bg-accent/10 rounded-lg">
                {licenseDocuments.length > 0 ? (
                  <ul className="space-y-1 text-sm">
                    {licenseDocuments.map((doc) => (
                      <li key={doc.id} className="flex items-center">
                        <CheckCircle className="h-3 w-3 text-green-600 mr-2" />
                        {doc.filename}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No documents uploaded</p>
                )}
              </div>
            </div>

            {/* Location Photos Summary */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium flex items-center">
                  <Camera className="h-4 w-4 mr-2 text-primary" />
                  Location Photos ({locationPhotos.length})
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setCurrentStep(3)}>
                  Edit
                </Button>
              </div>
              <div className="p-4 bg-accent/10 rounded-lg">
                {locationPhotos.length > 0 ? (
                  <div className="grid grid-cols-4 gap-2">
                    {locationPhotos.map((photo) => (
                      <div key={photo.id} className="aspect-square rounded overflow-hidden">
                        <img
                          src={photo.url}
                          alt={photo.filename}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No photos uploaded</p>
                )}
              </div>
            </div>

            {/* Additional Notes */}
            <div className="space-y-2">
              <Label htmlFor="applicantNotes">Additional Notes (Optional)</Label>
              <Textarea
                id="applicantNotes"
                value={formData.applicantNotes}
                onChange={(e) => handleInputChange('applicantNotes', e.target.value)}
                placeholder="Any additional information you'd like us to know..."
                rows={4}
              />
            </div>

            {/* Wholesale Paperwork Agreement */}
            <div className="p-4 bg-accent/20 rounded-lg border border-primary/20">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="wholesalePaperwork"
                  checked={formData.wholesalePaperworkSigned}
                  onCheckedChange={(checked) =>
                    handleInputChange('wholesalePaperworkSigned', checked)
                  }
                />
                <div className="flex-1">
                  <Label htmlFor="wholesalePaperwork" className="cursor-pointer">
                    I agree to the wholesale terms and conditions *
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    By checking this box, you acknowledge that you have read and agree to our wholesale
                    pricing agreement, payment terms, and business conduct policies.
                  </p>
                </div>
              </div>
            </div>

            {/* Validation Messages */}
            {(!formData.wholesalePaperworkSigned || licenseDocuments.length < 1 || locationPhotos.length < 3) && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600 font-medium mb-1">Please complete the following:</p>
                <ul className="text-xs text-red-600 space-y-1">
                  {licenseDocuments.length < 1 && <li>• Upload at least 1 license document</li>}
                  {locationPhotos.length < 3 && <li>• Upload at least 3 location photos</li>}
                  {!formData.wholesalePaperworkSigned && <li>• Accept the wholesale terms and conditions</li>}
                </ul>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-4 border-t">
              <Button variant="outline" onClick={handleBack} className="rounded-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                className="rounded-full"
                disabled={
                  !formData.wholesalePaperworkSigned ||
                  licenseDocuments.length < 1 ||
                  locationPhotos.length < 3 ||
                  submitting
                }
              >
                <Send className="mr-2 h-4 w-4" />
                {submitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}

export default WholesaleApplicationPage;
