/**
 * Certifications Manager
 * Feature 011: Vendor Portal MVP
 * Sprint B.1: Profile Management UI
 *
 * Component for uploading, viewing, and managing vendor certifications
 */

import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Loader2,
  Plus,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  ExternalLink,
} from 'lucide-react';

import { Button } from '@jade/ui/components';
import { Input } from '@jade/ui/components';
import { Label } from '@jade/ui/components';
import { Badge } from '@jade/ui/components';
import { Alert, AlertDescription } from '@jade/ui/components';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@jade/ui/components';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@jade/ui/components';
import {
  ADD_CERTIFICATION_MUTATION,
  REMOVE_CERTIFICATION_MUTATION,
} from '@/graphql/queries/vendor-profile';

// Certification types (from backend CertificationTypeSchema)
const CERTIFICATION_TYPES = [
  { value: 'USDA_ORGANIC', label: 'USDA Organic' },
  { value: 'ECOCERT', label: 'Ecocert' },
  { value: 'COSMOS_ORGANIC', label: 'COSMOS Organic' },
  { value: 'COSMOS_NATURAL', label: 'COSMOS Natural' },
  { value: 'LEAPING_BUNNY', label: 'Leaping Bunny (Cruelty-Free)' },
  { value: 'PETA_CERTIFIED', label: 'PETA Certified' },
  { value: 'B_CORP', label: 'B Corporation' },
  { value: 'FAIR_TRADE', label: 'Fair Trade' },
  { value: 'FSC_CERTIFIED', label: 'FSC Certified' },
  { value: 'MADE_SAFE', label: 'Made Safe' },
  { value: 'EWG_VERIFIED', label: 'EWG Verified' },
  { value: 'WOMEN_OWNED_WBENC', label: 'Women-Owned (WBENC)' },
  { value: 'MINORITY_OWNED_NMSDC', label: 'Minority-Owned (NMSDC)' },
];

// Validation schema
const addCertificationSchema = z.object({
  type: z.string().min(1, 'Certification type is required'),
  certificateNumber: z.string().max(100).optional().or(z.literal('')),
  expirationDate: z.string().optional().or(z.literal('')),
  documentUrl: z.string().url('Must be a valid URL').max(500),
  issuingBody: z.string().min(1, 'Issuing body is required').max(255),
});

type AddCertificationFormData = z.infer<typeof addCertificationSchema>;

interface CertificationsManagerProps {
  certifications: any[];
  onSuccess: () => void;
}

export function CertificationsManager({ certifications, onSuccess }: CertificationsManagerProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<AddCertificationFormData>({
    resolver: zodResolver(addCertificationSchema),
  });

  const [addCertification, { loading: addLoading, error: addError }] = useMutation(
    ADD_CERTIFICATION_MUTATION,
    {
      onCompleted: (data) => {
        if (data.addCertification.success) {
          setSuccessMessage('Certification submitted for review!');
          setTimeout(() => setSuccessMessage(null), 3000);
          setIsAddDialogOpen(false);
          reset();
          onSuccess();
        }
      },
    }
  );

  const [removeCertification, { loading: removeLoading }] = useMutation(
    REMOVE_CERTIFICATION_MUTATION,
    {
      onCompleted: () => {
        setSuccessMessage('Certification removed successfully');
        setTimeout(() => setSuccessMessage(null), 3000);
        onSuccess();
      },
    }
  );

  const onSubmit = async (data: AddCertificationFormData) => {
    // Remove empty optional fields
    const input: any = {
      type: data.type,
      documentUrl: data.documentUrl,
      issuingBody: data.issuingBody,
    };

    if (data.certificateNumber) input.certificateNumber = data.certificateNumber;
    if (data.expirationDate) input.expirationDate = new Date(data.expirationDate).toISOString();

    await addCertification({
      variables: { input },
    });
  };

  const handleRemove = async (certificationId: string) => {
    if (confirm('Are you sure you want to remove this certification?')) {
      await removeCertification({
        variables: { certificationId },
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        );
      case 'PENDING':
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
            <Clock className="h-3 w-3 mr-1" />
            Pending Review
          </Badge>
        );
      case 'REJECTED':
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  const getCertificationLabel = (type: string) => {
    return CERTIFICATION_TYPES.find((ct) => ct.value === type)?.label || type;
  };

  const selectedType = watch('type');

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

      {/* Add Certification Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Certification
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Certification</DialogTitle>
            <DialogDescription>
              Upload a certification to build trust with spas. Our team will review and verify
              within 3 business days.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Error Message */}
            {addError && (
              <Alert variant="destructive">
                <AlertDescription>{addError.message}</AlertDescription>
              </Alert>
            )}

            {/* Certification Type */}
            <div className="space-y-2">
              <Label htmlFor="type">
                Certification Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={selectedType}
                onValueChange={(value) => setValue('type', value)}
              >
                <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select certification type" />
                </SelectTrigger>
                <SelectContent>
                  {CERTIFICATION_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-red-500">{errors.type.message}</p>
              )}
            </div>

            {/* Issuing Body */}
            <div className="space-y-2">
              <Label htmlFor="issuingBody">
                Issuing Body <span className="text-red-500">*</span>
              </Label>
              <Input
                id="issuingBody"
                placeholder="e.g., USDA, B Lab, PETA"
                {...register('issuingBody')}
                className={errors.issuingBody ? 'border-red-500' : ''}
              />
              {errors.issuingBody && (
                <p className="text-sm text-red-500">{errors.issuingBody.message}</p>
              )}
            </div>

            {/* Certificate Number */}
            <div className="space-y-2">
              <Label htmlFor="certificateNumber">Certificate Number</Label>
              <Input
                id="certificateNumber"
                placeholder="e.g., 12345-ABC"
                {...register('certificateNumber')}
                className={errors.certificateNumber ? 'border-red-500' : ''}
              />
              {errors.certificateNumber && (
                <p className="text-sm text-red-500">{errors.certificateNumber.message}</p>
              )}
            </div>

            {/* Expiration Date */}
            <div className="space-y-2">
              <Label htmlFor="expirationDate">Expiration Date (if applicable)</Label>
              <Input
                id="expirationDate"
                type="date"
                {...register('expirationDate')}
                className={errors.expirationDate ? 'border-red-500' : ''}
              />
              {errors.expirationDate && (
                <p className="text-sm text-red-500">{errors.expirationDate.message}</p>
              )}
            </div>

            {/* Document URL */}
            <div className="space-y-2">
              <Label htmlFor="documentUrl">
                Document URL <span className="text-red-500">*</span>
              </Label>
              <Input
                id="documentUrl"
                type="url"
                placeholder="e.g., https://s3.aws.com/certifications/cert.pdf"
                {...register('documentUrl')}
                className={errors.documentUrl ? 'border-red-500' : ''}
              />
              {errors.documentUrl && (
                <p className="text-sm text-red-500">{errors.documentUrl.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Upload your certificate to a service like S3 or Dropbox, then paste the public
                URL here
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={addLoading}>
                {addLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Submit for Review
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Certifications List */}
      {certifications.length === 0 ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <FileText className="h-8 w-8 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-muted-foreground">
            No certifications yet. Add your first certification to build trust with spas.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="border rounded-lg p-4 flex items-start justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <h4 className="font-semibold">{getCertificationLabel(cert.type)}</h4>
                  {getStatusBadge(cert.verificationStatus)}
                </div>

                <div className="text-sm text-muted-foreground space-y-1">
                  <p>
                    <span className="font-medium">Issuing Body:</span> {cert.issuingBody}
                  </p>
                  {cert.certificateNumber && (
                    <p>
                      <span className="font-medium">Certificate #:</span>{' '}
                      {cert.certificateNumber}
                    </p>
                  )}
                  {cert.expirationDate && (
                    <p>
                      <span className="font-medium">Expires:</span>{' '}
                      {new Date(cert.expirationDate).toLocaleDateString()}
                    </p>
                  )}
                  {cert.verificationStatus === 'PENDING' && cert.slaDeadline && (
                    <p className="text-yellow-600">
                      <span className="font-medium">Review deadline:</span>{' '}
                      {new Date(cert.slaDeadline).toLocaleDateString()}
                    </p>
                  )}
                  {cert.verificationStatus === 'REJECTED' && cert.rejectionReason && (
                    <p className="text-red-600">
                      <span className="font-medium">Rejection reason:</span>{' '}
                      {cert.rejectionReason}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={cert.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    View Document
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemove(cert.id)}
                disabled={removeLoading}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
