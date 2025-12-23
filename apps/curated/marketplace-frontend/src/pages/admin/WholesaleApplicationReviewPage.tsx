/**
 * Wholesale Application Review Page
 * Week 8: Practitioner Verification System
 *
 * Curator dashboard for reviewing wholesale account applications
 */

import { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  FileText,
  Camera,
  Search,
  Filter,
  Eye,
  CheckSquare,
  XSquare,
} from 'lucide-react';

// GraphQL Queries
const WHOLESALE_APPLICATIONS = gql`
  query WholesaleApplications($filters: ApplicationFiltersInput, $pagination: ApplicationPaginationInput) {
    wholesaleApplications(filters: $filters, pagination: $pagination) {
      items {
        id
        businessName
        businessType
        status
        submittedAt
        licenseDocuments {
          id
          filename
          url
        }
        locationPhotos {
          id
          filename
          url
        }
        user {
          id
          email
        }
      }
      totalCount
    }
  }
`;

const WHOLESALE_APPLICATION = gql`
  query WholesaleApplication($id: ID!) {
    wholesaleApplication(id: $id) {
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
      }
      wholesalePaperworkSigned
      status
      reviewNotes
      rejectionReason
      submittedAt
      reviewedAt
      approvedAt
      applicantNotes
      user {
        id
        email
        firstName
        lastName
      }
    }
  }
`;

const REVIEW_APPLICATION = gql`
  mutation ReviewWholesaleApplication($id: ID!, $input: ReviewWholesaleApplicationInput!) {
    reviewWholesaleApplication(id: $id, input: $input) {
      application {
        id
        status
        reviewedAt
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

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  [ApplicationStatus.PENDING]: 'Pending',
  [ApplicationStatus.UNDER_REVIEW]: 'Under Review',
  [ApplicationStatus.INFO_REQUESTED]: 'Info Requested',
  [ApplicationStatus.APPROVED]: 'Approved',
  [ApplicationStatus.REJECTED]: 'Rejected',
  [ApplicationStatus.WITHDRAWN]: 'Withdrawn',
};

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  [ApplicationStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
  [ApplicationStatus.UNDER_REVIEW]: 'bg-blue-100 text-blue-800',
  [ApplicationStatus.INFO_REQUESTED]: 'bg-purple-100 text-purple-800',
  [ApplicationStatus.APPROVED]: 'bg-green-100 text-green-800',
  [ApplicationStatus.REJECTED]: 'bg-red-100 text-red-800',
  [ApplicationStatus.WITHDRAWN]: 'bg-gray-100 text-gray-800',
};

export function WholesaleApplicationReviewPage() {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  const { data, loading, refetch } = useQuery(WHOLESALE_APPLICATIONS, {
    variables: {
      filters: {
        status: selectedStatus || undefined,
        businessName: searchQuery || undefined,
      },
      pagination: {
        skip: 0,
        take: 50,
      },
    },
  });

  const { data: applicationData, loading: applicationLoading } = useQuery(WHOLESALE_APPLICATION, {
    variables: { id: selectedApplication },
    skip: !selectedApplication,
  });

  const [reviewApplication, { loading: reviewing }] = useMutation(REVIEW_APPLICATION, {
    onCompleted: () => {
      refetch();
      setSelectedApplication(null);
      setReviewNotes('');
      setRejectionReason('');
    },
  });

  const applications = data?.wholesaleApplications?.items || [];
  const totalCount = data?.wholesaleApplications?.totalCount || 0;
  const application = applicationData?.wholesaleApplication;

  const handleApprove = async () => {
    if (!selectedApplication) return;

    await reviewApplication({
      variables: {
        id: selectedApplication,
        input: {
          status: ApplicationStatus.APPROVED,
          reviewNotes: reviewNotes || undefined,
        },
      },
    });
  };

  const handleReject = async () => {
    if (!selectedApplication || !rejectionReason) {
      alert('Please provide a rejection reason');
      return;
    }

    await reviewApplication({
      variables: {
        id: selectedApplication,
        input: {
          status: ApplicationStatus.REJECTED,
          reviewNotes: reviewNotes || undefined,
          rejectionReason,
        },
      },
    });
  };

  // List View
  if (!selectedApplication) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-subtle shadow-warm">
          <CardHeader>
            <CardTitle>Wholesale Applications Review</CardTitle>
            <CardDescription>
              Review and approve applications from licensed professionals
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Search Business Name</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Statuses</SelectItem>
                    <SelectItem value={ApplicationStatus.PENDING}>Pending</SelectItem>
                    <SelectItem value={ApplicationStatus.UNDER_REVIEW}>Under Review</SelectItem>
                    <SelectItem value={ApplicationStatus.INFO_REQUESTED}>Info Requested</SelectItem>
                    <SelectItem value={ApplicationStatus.APPROVED}>Approved</SelectItem>
                    <SelectItem value={ApplicationStatus.REJECTED}>Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Badge variant="outline" className="h-10 px-4 flex items-center">
                  {totalCount} Applications
                </Badge>
              </div>
            </div>

            {/* Applications List */}
            {loading ? (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Loading applications...</p>
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No applications found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app: any) => (
                  <Card key={app.id} className="hover:border-primary/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-medium">{app.businessName}</h3>
                            <Badge className={STATUS_COLORS[app.status as ApplicationStatus]}>
                              {STATUS_LABELS[app.status as ApplicationStatus]}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p>Type: {app.businessType}</p>
                            <p>Submitted: {new Date(app.submittedAt).toLocaleDateString()}</p>
                            <p>
                              Documents: {app.licenseDocuments.length} licenses, {app.locationPhotos.length} photos
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => setSelectedApplication(app.id)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Review
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Detail View
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-4">
        <Button variant="outline" onClick={() => setSelectedApplication(null)}>
          ← Back to List
        </Button>
      </div>

      {applicationLoading ? (
        <div className="text-center py-12">
          <Clock className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading application...</p>
        </div>
      ) : !application ? (
        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Application not found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{application.businessName}</CardTitle>
                  <CardDescription>
                    Submitted by {application.user?.email} on{' '}
                    {new Date(application.submittedAt).toLocaleDateString()}
                  </CardDescription>
                </div>
                <Badge className={STATUS_COLORS[application.status as ApplicationStatus]}>
                  {STATUS_LABELS[application.status as ApplicationStatus]}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Business Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Business Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Business Type</p>
                <p className="font-medium">{application.businessType}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Tax ID</p>
                <p className="font-medium">{application.taxId || '—'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Phone</p>
                <p className="font-medium">{application.phoneNumber}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Website</p>
                <p className="font-medium">{application.websiteUrl || '—'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-muted-foreground">Address</p>
                <p className="font-medium">
                  {application.businessAddress.street}
                  {application.businessAddress.street2 && `, ${application.businessAddress.street2}`}
                  <br />
                  {application.businessAddress.city}, {application.businessAddress.state}{' '}
                  {application.businessAddress.zipCode}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* License Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                License Documents ({application.licenseDocuments.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {application.licenseDocuments.map((doc: any) => (
                  <a
                    key={doc.id}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border rounded-lg p-4 hover:border-primary transition-colors"
                  >
                    <FileText className="h-8 w-8 mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium truncate">{doc.filename}</p>
                    <p className="text-xs text-muted-foreground">{doc.documentType}</p>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Location Photos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Camera className="h-5 w-5 mr-2" />
                Location Photos ({application.locationPhotos.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {application.locationPhotos.map((photo: any) => (
                  <a
                    key={photo.id}
                    href={photo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="aspect-square rounded-lg overflow-hidden border hover:border-primary transition-colors"
                  >
                    <img
                      src={photo.url}
                      alt={photo.filename}
                      className="w-full h-full object-cover"
                    />
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Review Actions */}
          {application.status !== ApplicationStatus.APPROVED &&
            application.status !== ApplicationStatus.REJECTED && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Review Application</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reviewNotes">Review Notes (Optional)</Label>
                    <Textarea
                      id="reviewNotes"
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      placeholder="Internal notes about this application..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rejectionReason">Rejection Reason (Required if rejecting)</Label>
                    <Textarea
                      id="rejectionReason"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Explain why this application is being rejected..."
                      rows={3}
                    />
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <Button
                      variant="default"
                      onClick={handleApprove}
                      disabled={reviewing}
                      className="flex-1"
                    >
                      <CheckSquare className="h-4 w-4 mr-2" />
                      {reviewing ? 'Approving...' : 'Approve Application'}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleReject}
                      disabled={reviewing || !rejectionReason}
                      className="flex-1"
                    >
                      <XSquare className="h-4 w-4 mr-2" />
                      {reviewing ? 'Rejecting...' : 'Reject Application'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

          {/* Application Notes */}
          {application.applicantNotes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Applicant Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{application.applicantNotes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

export default WholesaleApplicationReviewPage;
