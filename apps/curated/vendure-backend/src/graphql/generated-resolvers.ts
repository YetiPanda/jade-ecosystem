import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { GraphQLContext } from '../graphql/apollo-server';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: string; output: string; }
  JSON: { input: any; output: any; }
  Upload: { input: any; output: any; }
};

/** AI system performance metrics */
export type AiPerformanceMetrics = {
  __typename?: 'AIPerformanceMetrics';
  analysisMetrics: AnalysisMetrics;
  predictionAccuracy: PredictionAccuracyMetrics;
  recommendationPerformance: RecommendationMetrics;
};

/** User Access Level for threshold filtering */
export enum AccessLevel {
  Expert = 'EXPERT',
  Professional = 'PROFESSIONAL',
  Public = 'PUBLIC',
  Registered = 'REGISTERED'
}

export type AcknowledgeAlertInput = {
  alertId: Scalars['ID']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
};

/** Actionable recommendation */
export type ActionableRecommendation = {
  __typename?: 'ActionableRecommendation';
  category: RecommendationCategory;
  dependencies: Array<Scalars['String']['output']>;
  description: Scalars['String']['output'];
  estimatedImpact: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  implementationEffort: EffortLevel;
  priority: SignificanceLevel;
  successMetrics: Array<Scalars['String']['output']>;
  timeline: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type ActiveIngredient = {
  __typename?: 'ActiveIngredient';
  concentration: Scalars['Float']['output'];
  name: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type ActiveIngredientInput = {
  concentration: Scalars['Float']['input'];
  name: Scalars['String']['input'];
  type: Scalars['String']['input'];
};

export type AddCertificationInput = {
  certificateNumber?: InputMaybe<Scalars['String']['input']>;
  documentUrl: Scalars['String']['input'];
  expirationDate?: InputMaybe<Scalars['DateTime']['input']>;
  issuingBody: Scalars['String']['input'];
  type: CertificationType;
};

export type AddShippingInfoInput = {
  carrier: Scalars['String']['input'];
  estimatedDelivery?: InputMaybe<Scalars['DateTime']['input']>;
  orderId: Scalars['ID']['input'];
  trackingNumber: Scalars['String']['input'];
};

/** Address type */
export type Address = {
  __typename?: 'Address';
  city: Scalars['String']['output'];
  country: Scalars['String']['output'];
  line1: Scalars['String']['output'];
  line2?: Maybe<Scalars['String']['output']>;
  postalCode: Scalars['String']['output'];
  state: Scalars['String']['output'];
  street1: Scalars['String']['output'];
  street2?: Maybe<Scalars['String']['output']>;
};

export type AddressInput = {
  city: Scalars['String']['input'];
  country: Scalars['String']['input'];
  postalCode: Scalars['String']['input'];
  state: Scalars['String']['input'];
  street1: Scalars['String']['input'];
  street2?: InputMaybe<Scalars['String']['input']>;
};

export enum AlertCategory {
  Customer = 'CUSTOMER',
  Financial = 'FINANCIAL',
  Operational = 'OPERATIONAL',
  Product = 'PRODUCT',
  Technical = 'TECHNICAL'
}

export enum AlertSeverity {
  Critical = 'CRITICAL',
  Info = 'INFO',
  Warning = 'WARNING'
}

export type AnalysisMetrics = {
  __typename?: 'AnalysisMetrics';
  accuracyScore: Scalars['Float']['output'];
  avgProcessingTimeMs: Scalars['Int']['output'];
  totalAnalyses: Scalars['Int']['output'];
  userSatisfaction: Scalars['Float']['output'];
};

/** Anomaly detection insight */
export type AnomalyInsight = {
  __typename?: 'AnomalyInsight';
  actualValue: Scalars['Float']['output'];
  deviation: Scalars['Float']['output'];
  expectedValue: Scalars['Float']['output'];
  metric: Scalars['String']['output'];
  possibleCauses: Array<Scalars['String']['output']>;
  recommendedActions: Array<Scalars['String']['output']>;
  severity: AlertSeverity;
  timestamp: Scalars['DateTime']['output'];
};

/** App Preferences - UI and behavior preferences */
export type AppPreferences = {
  __typename?: 'AppPreferences';
  /** Compact mode for dense information display */
  compactMode: Scalars['Boolean']['output'];
  /** Preferred currency for display */
  currency: Scalars['String']['output'];
  /** Default landing page after login */
  defaultView: DefaultView;
  /** Number of items per page in lists */
  itemsPerPage: Scalars['Int']['output'];
  /** Enable keyboard shortcuts */
  keyboardShortcuts: Scalars['Boolean']['output'];
  /** Show product prices including tax */
  showPricesWithTax: Scalars['Boolean']['output'];
  /** Sidebar collapsed by default */
  sidebarCollapsed: Scalars['Boolean']['output'];
  /** UI theme preference */
  theme: ThemePreference;
};

export type ApplicationDocuments = {
  __typename?: 'ApplicationDocuments';
  businessLicenseUrl?: Maybe<Scalars['String']['output']>;
  insuranceCertificateUrl?: Maybe<Scalars['String']['output']>;
  lineSheetUrl?: Maybe<Scalars['String']['output']>;
  productCatalogUrl?: Maybe<Scalars['String']['output']>;
};

export enum ApplicationReviewDecision {
  Approve = 'APPROVE',
  ConditionallyApprove = 'CONDITIONALLY_APPROVE',
  Reject = 'REJECT',
  RequestInfo = 'REQUEST_INFO'
}

export type ApplicationReviewDecisionInput = {
  applicationId: Scalars['ID']['input'];
  approvalConditions?: InputMaybe<Array<Scalars['String']['input']>>;
  decision: ApplicationReviewDecision;
  decisionNote?: InputMaybe<Scalars['String']['input']>;
  rejectionReason?: InputMaybe<Scalars['String']['input']>;
};

export enum ApplicationStatus {
  AdditionalInfoRequested = 'ADDITIONAL_INFO_REQUESTED',
  Approved = 'APPROVED',
  ConditionallyApproved = 'CONDITIONALLY_APPROVED',
  Rejected = 'REJECTED',
  Submitted = 'SUBMITTED',
  UnderReview = 'UNDER_REVIEW',
  Withdrawn = 'WITHDRAWN'
}

/** Appointment */
export type Appointment = {
  __typename?: 'Appointment';
  actualEnd?: Maybe<Scalars['DateTime']['output']>;
  actualStart?: Maybe<Scalars['DateTime']['output']>;
  cancellationReason?: Maybe<Scalars['String']['output']>;
  cancelledAt?: Maybe<Scalars['DateTime']['output']>;
  client: Client;
  clientFeedback?: Maybe<ClientFeedback>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  location: Location;
  notes?: Maybe<Scalars['String']['output']>;
  productsUsed: Array<ProductUsage>;
  scheduledEnd: Scalars['DateTime']['output'];
  scheduledStart: Scalars['DateTime']['output'];
  serviceProvider: ServiceProvider;
  serviceType: Scalars['String']['output'];
  status: AppointmentStatus;
  updatedAt: Scalars['DateTime']['output'];
};

export type AppointmentConnection = {
  __typename?: 'AppointmentConnection';
  edges: Array<AppointmentEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type AppointmentEdge = {
  __typename?: 'AppointmentEdge';
  cursor: Scalars['String']['output'];
  node: Appointment;
};

/** Filters and pagination */
export type AppointmentFiltersInput = {
  clientId?: InputMaybe<Scalars['ID']['input']>;
  dateRange?: InputMaybe<DateRangeInput>;
  locationId?: InputMaybe<Scalars['ID']['input']>;
  serviceProviderId?: InputMaybe<Scalars['ID']['input']>;
  spaOrganizationId?: InputMaybe<Scalars['ID']['input']>;
  status?: InputMaybe<AppointmentStatus>;
};

/** Result types */
export type AppointmentResult = {
  __typename?: 'AppointmentResult';
  appointment?: Maybe<Appointment>;
  errors?: Maybe<Array<Error>>;
  success: Scalars['Boolean']['output'];
};

export enum AppointmentStatus {
  Cancelled = 'CANCELLED',
  CheckedIn = 'CHECKED_IN',
  Completed = 'COMPLETED',
  Confirmed = 'CONFIRMED',
  InProgress = 'IN_PROGRESS',
  NoShow = 'NO_SHOW',
  Pending = 'PENDING'
}

export enum ApprovalDecision {
  Approve = 'APPROVE',
  Reject = 'REJECT',
  RequestInfo = 'REQUEST_INFO'
}

export enum ApprovalStatus {
  Approved = 'APPROVED',
  Pending = 'PENDING',
  Rejected = 'REJECTED',
  RequiresInfo = 'REQUIRES_INFO'
}

/** Atom with full Intelligence data */
export type AtomWithIntelligence = {
  __typename?: 'AtomWithIntelligence';
  accessible: Scalars['Boolean']['output'];
  atom?: Maybe<SkincareAtom>;
  causalSummary?: Maybe<Scalars['String']['output']>;
  efficacySummary?: Maybe<EfficacySummary>;
  evidenceSummary?: Maybe<EvidenceSummary>;
  goldilocksParameters: Array<GoldilocksParameter>;
  whyItWorks?: Maybe<Scalars['String']['output']>;
};

/** Authentication result */
export type AuthResult = {
  __typename?: 'AuthResult';
  accessToken?: Maybe<Scalars['String']['output']>;
  errors?: Maybe<Array<Error>>;
  refreshToken?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  user?: Maybe<User>;
};

export type BulkTaxonomyError = {
  __typename?: 'BulkTaxonomyError';
  message: Scalars['String']['output'];
  productId: Scalars['ID']['output'];
};

export type BulkTaxonomyResult = {
  __typename?: 'BulkTaxonomyResult';
  errors?: Maybe<Array<BulkTaxonomyError>>;
  success: Scalars['Boolean']['output'];
  updatedCount: Scalars['Int']['output'];
};

/** Bulk taxonomy update for admin operations */
export type BulkTaxonomyUpdate = {
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  primaryFunctionIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  productId: Scalars['ID']['input'];
};

/** Business alert */
export type BusinessAlert = {
  __typename?: 'BusinessAlert';
  acknowledged: Scalars['Boolean']['output'];
  acknowledgedAt?: Maybe<Scalars['DateTime']['output']>;
  acknowledgedBy?: Maybe<Scalars['ID']['output']>;
  affectedMetrics: Array<Scalars['String']['output']>;
  category: AlertCategory;
  currentValue?: Maybe<Scalars['Float']['output']>;
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  recommendedActions: Array<Scalars['String']['output']>;
  severity: AlertSeverity;
  thresholdValue?: Maybe<Scalars['Float']['output']>;
  timestamp: Scalars['DateTime']['output'];
  title: Scalars['String']['output'];
};

export type BusinessLicense = {
  __typename?: 'BusinessLicense';
  documentUrl: Scalars['String']['output'];
  expirationDate: Scalars['DateTime']['output'];
  number: Scalars['String']['output'];
  state: Scalars['String']['output'];
};

export type BusinessLicenseInput = {
  documentUrl: Scalars['String']['input'];
  expirationDate: Scalars['DateTime']['input'];
  number: Scalars['String']['input'];
  state: Scalars['String']['input'];
};

/** Comprehensive business metrics for a given timeframe */
export type BusinessMetrics = {
  __typename?: 'BusinessMetrics';
  ai: AiPerformanceMetrics;
  computedAt: Scalars['DateTime']['output'];
  customers: CustomerMetrics;
  financial: FinancialMetrics;
  products: ProductMetrics;
  skincare: SkincareAnalytics;
  timeframe: Scalars['String']['output'];
};

export type CampaignFilterInput = {
  dateRange?: InputMaybe<DateRangeInput>;
  status?: InputMaybe<Array<CampaignStatus>>;
  type?: InputMaybe<CampaignType>;
};

export type CampaignPerformanceSummary = {
  __typename?: 'CampaignPerformanceSummary';
  activeCampaigns: Scalars['Int']['output'];
  channelPerformance: Array<ChannelPerformance>;
  completedCampaigns: Scalars['Int']['output'];
  dateRange: DateRange;
  overallCTR: Scalars['Float']['output'];
  overallConversionRate: Scalars['Float']['output'];
  overallROAS: Scalars['Float']['output'];
  topCampaignsByROAS: Array<MarketingCampaign>;
  topCampaignsByRevenue: Array<MarketingCampaign>;
  totalRevenue: Scalars['Float']['output'];
  totalSpent: Scalars['Float']['output'];
};

export enum CampaignStatus {
  Active = 'ACTIVE',
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Draft = 'DRAFT',
  Paused = 'PAUSED',
  Scheduled = 'SCHEDULED'
}

export enum CampaignType {
  Affiliate = 'AFFILIATE',
  Content = 'CONTENT',
  Display = 'DISPLAY',
  Email = 'EMAIL',
  PaidSearch = 'PAID_SEARCH',
  Social = 'SOCIAL'
}

export type CategoryCoverage = {
  __typename?: 'CategoryCoverage';
  averageScore: Scalars['Float']['output'];
  category: ProductCategory;
  productCount: Scalars['Int']['output'];
};

export type CategoryPerformance = {
  __typename?: 'CategoryPerformance';
  category: Scalars['String']['output'];
  growthRate: Scalars['Float']['output'];
  productCount: Scalars['Int']['output'];
  revenue: Scalars['Float']['output'];
};

/** Causal Chain Node for graph traversal */
export type CausalChainNode = {
  __typename?: 'CausalChainNode';
  atom: SkincareAtom;
  depth: Scalars['Int']['output'];
  direction: Scalars['String']['output'];
  mechanismSummary?: Maybe<Scalars['String']['output']>;
  relationship?: Maybe<SkincareRelationship>;
};

/** Causal Direction for graph traversal */
export enum CausalDirection {
  Both = 'BOTH',
  Downstream = 'DOWNSTREAM',
  Upstream = 'UPSTREAM'
}

/** Causal Path Step */
export type CausalPathStep = {
  __typename?: 'CausalPathStep';
  atom: SkincareAtom;
  mechanismSummary: Scalars['String']['output'];
  relationship?: Maybe<SkincareRelationship>;
};

export type Certification = {
  __typename?: 'Certification';
  certificateUrl?: Maybe<Scalars['String']['output']>;
  expirationDate?: Maybe<Scalars['DateTime']['output']>;
  issueDate: Scalars['DateTime']['output'];
  issuingOrg: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type CertificationInput = {
  certificateUrl?: InputMaybe<Scalars['String']['input']>;
  expirationDate?: InputMaybe<Scalars['DateTime']['input']>;
  issueDate: Scalars['DateTime']['input'];
  issuingOrg: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type CertificationResult = {
  __typename?: 'CertificationResult';
  certification?: Maybe<VendorCertification>;
  errors?: Maybe<Array<VendorPortalError>>;
  success: Scalars['Boolean']['output'];
};

export enum CertificationStatus {
  Expired = 'EXPIRED',
  Pending = 'PENDING',
  Rejected = 'REJECTED',
  UnderReview = 'UNDER_REVIEW',
  Verified = 'VERIFIED'
}

/** Certification Types - Require human verification (13 total) */
export enum CertificationType {
  BCorp = 'B_CORP',
  CosmosNatural = 'COSMOS_NATURAL',
  CosmosOrganic = 'COSMOS_ORGANIC',
  Ecocert = 'ECOCERT',
  EwgVerified = 'EWG_VERIFIED',
  FairTrade = 'FAIR_TRADE',
  FscCertified = 'FSC_CERTIFIED',
  LeapingBunny = 'LEAPING_BUNNY',
  MadeSafe = 'MADE_SAFE',
  MinorityOwnedNmsdc = 'MINORITY_OWNED_NMSDC',
  PetaCertified = 'PETA_CERTIFIED',
  UsdaOrganic = 'USDA_ORGANIC',
  WomenOwnedWbenc = 'WOMEN_OWNED_WBENC'
}

export enum CertificationVerificationDecision {
  Approve = 'APPROVE',
  Reject = 'REJECT',
  RequestClearerDocument = 'REQUEST_CLEARER_DOCUMENT'
}

export type CertificationVerificationInput = {
  certificationId: Scalars['ID']['input'];
  decision: CertificationVerificationDecision;
  note?: InputMaybe<Scalars['String']['input']>;
  rejectionReason?: InputMaybe<Scalars['String']['input']>;
};

export type ChannelPerformance = {
  __typename?: 'ChannelPerformance';
  campaigns: Scalars['Int']['output'];
  channel: CampaignType;
  conversions: Scalars['Int']['output'];
  revenue: Scalars['Float']['output'];
  roas: Scalars['Float']['output'];
  spent: Scalars['Float']['output'];
};

/** Claim Evidence - scientific backing for SKA atom claims */
export type ClaimEvidence = {
  __typename?: 'ClaimEvidence';
  atomId: Scalars['ID']['output'];
  claim: Scalars['String']['output'];
  confidenceScore?: Maybe<Scalars['Float']['output']>;
  createdAt: Scalars['String']['output'];
  evidenceLevel: EvidenceLevel;
  id: Scalars['ID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  publicationYear?: Maybe<Scalars['Int']['output']>;
  sampleSize?: Maybe<Scalars['Int']['output']>;
  sourceReference?: Maybe<Scalars['String']['output']>;
  sourceType?: Maybe<Scalars['String']['output']>;
  studyDuration?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['String']['output'];
};

/** Claim Evidence input for mutations */
export type ClaimEvidenceInput = {
  claim: Scalars['String']['input'];
  confidenceScore?: InputMaybe<Scalars['Float']['input']>;
  evidenceLevel: EvidenceLevel;
  notes?: InputMaybe<Scalars['String']['input']>;
  publicationYear?: InputMaybe<Scalars['Int']['input']>;
  sampleSize?: InputMaybe<Scalars['Int']['input']>;
  sourceReference?: InputMaybe<Scalars['String']['input']>;
  sourceType?: InputMaybe<Scalars['String']['input']>;
  studyDuration?: InputMaybe<Scalars['String']['input']>;
};

/** Client */
export type Client = {
  __typename?: 'Client';
  allergies: Array<Scalars['String']['output']>;
  appointments: Array<Appointment>;
  createdAt: Scalars['DateTime']['output'];
  dateOfBirth?: Maybe<Scalars['DateTime']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  preferences: ClientPreferences;
  skinProfile: SkinProfile;
  spaOrganization: SpaOrganization;
  treatmentPlans: Array<TreatmentPlan>;
  updatedAt: Scalars['DateTime']['output'];
  user?: Maybe<User>;
  userId?: Maybe<Scalars['ID']['output']>;
};

export type ClientConnection = {
  __typename?: 'ClientConnection';
  edges: Array<ClientEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ClientEdge = {
  __typename?: 'ClientEdge';
  cursor: Scalars['String']['output'];
  node: Client;
};

export type ClientFeedback = {
  __typename?: 'ClientFeedback';
  comments?: Maybe<Scalars['String']['output']>;
  rating: Scalars['Int']['output'];
  submittedAt: Scalars['DateTime']['output'];
  wouldRecommend: Scalars['Boolean']['output'];
};

export type ClientPreferences = {
  __typename?: 'ClientPreferences';
  communicationChannel: CommunicationChannel;
  marketingOptIn: Scalars['Boolean']['output'];
  preferredProviders?: Maybe<Array<Scalars['ID']['output']>>;
  reminderPreference: ReminderPreference;
};

export type ClientPreferencesInput = {
  communicationChannel: CommunicationChannel;
  marketingOptIn: Scalars['Boolean']['input'];
  preferredProviders?: InputMaybe<Array<Scalars['ID']['input']>>;
  reminderPreference: ReminderPreferenceInput;
};

export type ClientResult = {
  __typename?: 'ClientResult';
  client?: Maybe<Client>;
  errors?: Maybe<Array<Error>>;
  success: Scalars['Boolean']['output'];
};

export type ClinicalData = {
  __typename?: 'ClinicalData';
  certifications: Array<Scalars['String']['output']>;
  testReports: Array<TestReport>;
  trials: Array<ClinicalTrial>;
};

export type ClinicalTrial = {
  __typename?: 'ClinicalTrial';
  duration: Scalars['String']['output'];
  participants: Scalars['Int']['output'];
  publicationUrl?: Maybe<Scalars['String']['output']>;
  results: Scalars['String']['output'];
  studyName: Scalars['String']['output'];
};

export enum CommunicationChannel {
  Both = 'BOTH',
  Email = 'EMAIL',
  Sms = 'SMS'
}

/** Comment on a community post */
export type CommunityComment = {
  __typename?: 'CommunityComment';
  author: SanctuaryMember;
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  hasLiked: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  isAcceptedAnswer: Scalars['Boolean']['output'];
  likeCount: Scalars['Int']['output'];
  replies: Array<CommunityComment>;
  updatedAt: Scalars['DateTime']['output'];
};

/** Community event (workshop, webinar, meetup, conference) */
export type CommunityEvent = {
  __typename?: 'CommunityEvent';
  attendeeCount: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  endTime?: Maybe<Scalars['DateTime']['output']>;
  eventType: EventType;
  format: EventFormat;
  id: Scalars['ID']['output'];
  isRegistered: Scalars['Boolean']['output'];
  location?: Maybe<Scalars['String']['output']>;
  maxAttendees?: Maybe<Scalars['Int']['output']>;
  organizer: SanctuaryMember;
  priceCents: Scalars['Int']['output'];
  registrationDeadline?: Maybe<Scalars['DateTime']['output']>;
  skaTopics: Array<SkincareAtom>;
  startTime: Scalars['DateTime']['output'];
  status: EventStatus;
  title: Scalars['String']['output'];
  virtualLink?: Maybe<Scalars['String']['output']>;
};

/** Paginated event connection */
export type CommunityEventConnection = {
  __typename?: 'CommunityEventConnection';
  hasMore: Scalars['Boolean']['output'];
  items: Array<CommunityEvent>;
  totalCount: Scalars['Int']['output'];
};

/** Community post (discussion, question, article, case study) */
export type CommunityPost = {
  __typename?: 'CommunityPost';
  author: SanctuaryMember;
  category?: Maybe<Scalars['String']['output']>;
  commentCount: Scalars['Int']['output'];
  comments: Array<CommunityComment>;
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  hasLiked: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  isFeatured: Scalars['Boolean']['output'];
  isPinned: Scalars['Boolean']['output'];
  likeCount: Scalars['Int']['output'];
  postType: PostType;
  skaAtoms: Array<SkincareAtom>;
  status: PostStatus;
  tags: Array<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  viewCount: Scalars['Int']['output'];
};


/** Community post (discussion, question, article, case study) */
export type CommunityPostCommentsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

/** Paginated post connection */
export type CommunityPostConnection = {
  __typename?: 'CommunityPostConnection';
  hasMore: Scalars['Boolean']['output'];
  items: Array<CommunityPost>;
  totalCount: Scalars['Int']['output'];
};

/** Compatibility Analysis Result */
export type CompatibilityResult = {
  __typename?: 'CompatibilityResult';
  compatible: Scalars['Boolean']['output'];
  conflicts: Array<IngredientInteraction>;
  interactions: Array<IngredientInteraction>;
  overallScore: Scalars['Int']['output'];
  sequenceRecommendation: Array<SkincareAtom>;
  synergies: Array<IngredientInteraction>;
  tips: Array<Scalars['String']['output']>;
  warnings: Array<Scalars['String']['output']>;
};

export type CompleteAppointmentInput = {
  notes?: InputMaybe<Scalars['String']['input']>;
  productsUsed?: InputMaybe<Array<ProductUsageInput>>;
};

export type CompleteOnboardingStepInput = {
  data?: InputMaybe<Scalars['JSON']['input']>;
  stepId: Scalars['ID']['input'];
};

/** Compliance severity levels */
export enum ComplianceSeverity {
  Critical = 'CRITICAL',
  Info = 'INFO',
  Warning = 'WARNING'
}

export type ConcernAnalysis = {
  __typename?: 'ConcernAnalysis';
  avgResolutionDays?: Maybe<Scalars['Int']['output']>;
  concern: Scalars['String']['output'];
  frequency: Scalars['Int']['output'];
  growthRate: Scalars['Float']['output'];
};

export enum ConcernSeverity {
  Mild = 'MILD',
  Moderate = 'MODERATE',
  Severe = 'SEVERE'
}

/** Conflict Type classification */
export enum ConflictType {
  Dilution = 'DILUTION',
  Inactivation = 'INACTIVATION',
  Irritation = 'IRRITATION',
  Oxidation = 'OXIDATION',
  PenetrationBarrier = 'PENETRATION_BARRIER',
  PhIncompatibility = 'PH_INCOMPATIBILITY'
}

export type ConsultationMetrics = {
  __typename?: 'ConsultationMetrics';
  avgSatisfaction: Scalars['Float']['output'];
  avgSessionDuration: Scalars['Int']['output'];
  successRate: Scalars['Float']['output'];
  totalSessions: Scalars['Int']['output'];
};

export type Conversation = {
  __typename?: 'Conversation';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  lastMessageAt?: Maybe<Scalars['DateTime']['output']>;
  spaId: Scalars['String']['output'];
  spaName: Scalars['String']['output'];
  status: ConversationStatus;
  subject: Scalars['String']['output'];
  unreadCount: Scalars['Int']['output'];
  vendorId: Scalars['String']['output'];
};

export type ConversationFilterInput = {
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<ConversationStatus>;
};

export type ConversationMessage = {
  __typename?: 'ConversationMessage';
  content: Scalars['String']['output'];
  conversationId: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  isRead: Scalars['Boolean']['output'];
  isSystemMessage: Scalars['Boolean']['output'];
  senderId: Scalars['String']['output'];
  senderName: Scalars['String']['output'];
  senderType: MessageSenderType;
};

export type ConversationMessagesResponse = {
  __typename?: 'ConversationMessagesResponse';
  hasMore: Scalars['Boolean']['output'];
  messages: Array<ConversationMessage>;
  totalCount: Scalars['Int']['output'];
};

export enum ConversationStatus {
  Active = 'ACTIVE',
  Archived = 'ARCHIVED',
  Resolved = 'RESOLVED'
}

/** Input types */
export type CreateAppointmentInput = {
  clientId: Scalars['ID']['input'];
  locationId: Scalars['ID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  scheduledEnd: Scalars['DateTime']['input'];
  scheduledStart: Scalars['DateTime']['input'];
  serviceProviderId: Scalars['ID']['input'];
  serviceType: Scalars['String']['input'];
};

export type CreateCampaignInput = {
  audienceDetails?: InputMaybe<Scalars['JSON']['input']>;
  audienceSize?: InputMaybe<Scalars['Int']['input']>;
  budgetDollars: Scalars['Float']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  endDate: Scalars['DateTime']['input'];
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  name: Scalars['String']['input'];
  startDate: Scalars['DateTime']['input'];
  type: CampaignType;
};

export type CreateClientInput = {
  allergies?: InputMaybe<Array<Scalars['String']['input']>>;
  dateOfBirth?: InputMaybe<Scalars['DateTime']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  preferences?: InputMaybe<ClientPreferencesInput>;
  skinProfile: SkinProfileInput;
  spaOrganizationId: Scalars['ID']['input'];
  userId?: InputMaybe<Scalars['ID']['input']>;
};

export type CreateConversationInput = {
  contextId?: InputMaybe<Scalars['String']['input']>;
  contextType?: InputMaybe<Scalars['String']['input']>;
  spaId: Scalars['String']['input'];
  subject: Scalars['String']['input'];
  vendorId: Scalars['String']['input'];
};

/** Input for creating a new event */
export type CreateEventInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  endTime?: InputMaybe<Scalars['DateTime']['input']>;
  eventType: EventType;
  format: EventFormat;
  location?: InputMaybe<Scalars['String']['input']>;
  maxAttendees?: InputMaybe<Scalars['Int']['input']>;
  priceCents?: InputMaybe<Scalars['Int']['input']>;
  registrationDeadline?: InputMaybe<Scalars['DateTime']['input']>;
  skaTopicIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  startTime: Scalars['DateTime']['input'];
  title: Scalars['String']['input'];
  virtualLink?: InputMaybe<Scalars['String']['input']>;
};

/** Input for creating a new post */
export type CreatePostInput = {
  category?: InputMaybe<Scalars['String']['input']>;
  content: Scalars['String']['input'];
  postType: PostType;
  skaAtomIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  status?: InputMaybe<PostStatus>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  title: Scalars['String']['input'];
};

/** Create product input */
export type CreateProductInput = {
  glance: ProductGlanceInput;
  scan: ProductScanInput;
  study?: InputMaybe<ProductStudyInput>;
  vendorOrganizationId: Scalars['ID']['input'];
  vendureProductId: Scalars['ID']['input'];
};

/** Input types */
export type CreateSpaOrganizationInput = {
  address: AddressInput;
  contactEmail: Scalars['String']['input'];
  contactPhone?: InputMaybe<Scalars['String']['input']>;
  displayName: Scalars['String']['input'];
  logoUrl?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  subscriptionTier?: InputMaybe<SubscriptionTier>;
};

export type CreateVendorOrganizationInput = {
  address: AddressInput;
  businessLicense: BusinessLicenseInput;
  certifications: Array<CertificationInput>;
  companyName: Scalars['String']['input'];
  contactEmail: Scalars['String']['input'];
  contactPhone?: InputMaybe<Scalars['String']['input']>;
  displayName: Scalars['String']['input'];
  fulfillmentSettings: FulfillmentSettingsInput;
  insurance: InsuranceInfoInput;
};

export type CreateVendorProfileInput = {
  brandName: Scalars['String']['input'];
  vendorId: Scalars['ID']['input'];
};

export type CrossSellPair = {
  __typename?: 'CrossSellPair';
  coOccurrenceCount: Scalars['Int']['output'];
  correlation: Scalars['Float']['output'];
  product1Id: Scalars['ID']['output'];
  product1Name: Scalars['String']['output'];
  product2Id: Scalars['ID']['output'];
  product2Name: Scalars['String']['output'];
};

/** Customer analytics */
export type CustomerMetrics = {
  __typename?: 'CustomerMetrics';
  averageCustomerAge: Scalars['Int']['output'];
  churnedCustomers: Scalars['Int']['output'];
  geographicDistribution: Array<GeographicRegion>;
  journeyStageDistribution: Array<JourneyStage>;
  newAcquisitions: Scalars['Int']['output'];
  topSegments: Array<CustomerSegment>;
  totalActive: Scalars['Int']['output'];
};

export type CustomerSegment = {
  __typename?: 'CustomerSegment';
  count: Scalars['Int']['output'];
  growthRate: Scalars['Float']['output'];
  revenue: Scalars['Float']['output'];
  segment: Scalars['String']['output'];
};

export type DashboardMetric = {
  __typename?: 'DashboardMetric';
  changePercent: Scalars['Float']['output'];
  previousValue: Scalars['Float']['output'];
  trend: TrendDirection;
  value: Scalars['Float']['output'];
};

/** Quick dashboard summary for executive view */
export type DashboardSummary = {
  __typename?: 'DashboardSummary';
  aiRecommendationAcceptance: DashboardMetric;
  avgOrderValue: DashboardMetric;
  churnRate: DashboardMetric;
  customers: DashboardMetric;
  keyInsights: Array<Scalars['String']['output']>;
  orders: DashboardMetric;
  recentAlerts: Array<BusinessAlert>;
  revenue: DashboardMetric;
  topProducts: Array<ProductPerformance>;
};

/** Date format options */
export enum DateFormat {
  DdMmYyyy = 'DD_MM_YYYY',
  MmDdYyyy = 'MM_DD_YYYY',
  YyyyMmDd = 'YYYY_MM_DD'
}

export type DateRange = {
  __typename?: 'DateRange';
  endDate: Scalars['DateTime']['output'];
  startDate: Scalars['DateTime']['output'];
};

/** Date range filter */
export type DateRangeInput = {
  endDate: Scalars['DateTime']['input'];
  startDate: Scalars['DateTime']['input'];
};

/** Default view after login */
export enum DefaultView {
  Appointments = 'APPOINTMENTS',
  Aura = 'AURA',
  Clients = 'CLIENTS',
  Dashboard = 'DASHBOARD',
  Ecosystem = 'ECOSYSTEM',
  Marketplace = 'MARKETPLACE',
  Sanctuary = 'SANCTUARY'
}

/** Progressive Disclosure Detail Level */
export enum DetailLevel {
  Glance = 'GLANCE',
  Scan = 'SCAN',
  Study = 'STUDY'
}

/** Progressive Disclosure Content */
export type DisclosureContent = {
  __typename?: 'DisclosureContent';
  glance: Scalars['String']['output'];
  scan: Scalars['String']['output'];
  study: Scalars['String']['output'];
};

/** Progressive Disclosure Level */
export enum DisclosureLevel {
  Glance = 'GLANCE',
  Scan = 'SCAN',
  Study = 'STUDY'
}

export type DiscoveryAnalytics = {
  __typename?: 'DiscoveryAnalytics';
  impressions: ImpressionMetrics;
  missedQueries: Array<SearchQueryInsight>;
  profileEngagement: ProfileEngagement;
  queriesLeadingToYou: Array<SearchQueryInsight>;
  recommendations: Array<DiscoveryRecommendation>;
  valuesPerformance: Array<ValuePerformance>;
};

export type DiscoveryRecommendation = {
  __typename?: 'DiscoveryRecommendation';
  actionLabel: Scalars['String']['output'];
  actionRoute: Scalars['String']['output'];
  description: Scalars['String']['output'];
  potentialImpact: Scalars['String']['output'];
  priority: RecommendationPriority;
  title: Scalars['String']['output'];
  type: RecommendationType;
};

/** Efficacy Indicator - measurable outcomes for atoms */
export type EfficacyIndicator = {
  __typename?: 'EfficacyIndicator';
  atomId: Scalars['ID']['output'];
  baselineValue?: Maybe<Scalars['Float']['output']>;
  createdAt: Scalars['String']['output'];
  evidenceLevel?: Maybe<EvidenceLevel>;
  goldilocksZone?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  indicatorName: Scalars['String']['output'];
  measurementType?: Maybe<Scalars['String']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  optimalMax?: Maybe<Scalars['Float']['output']>;
  optimalMin?: Maybe<Scalars['Float']['output']>;
  targetValue?: Maybe<Scalars['Float']['output']>;
  timeToEffect?: Maybe<Scalars['String']['output']>;
  unit?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['String']['output'];
};

/** Efficacy Indicator input for mutations */
export type EfficacyIndicatorInput = {
  baselineValue?: InputMaybe<Scalars['Float']['input']>;
  evidenceLevel?: InputMaybe<EvidenceLevel>;
  goldilocksZone?: InputMaybe<Scalars['String']['input']>;
  indicatorName: Scalars['String']['input'];
  measurementType?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  optimalMax?: InputMaybe<Scalars['Float']['input']>;
  optimalMin?: InputMaybe<Scalars['Float']['input']>;
  targetValue?: InputMaybe<Scalars['Float']['input']>;
  timeToEffect?: InputMaybe<Scalars['String']['input']>;
  unit?: InputMaybe<Scalars['String']['input']>;
};

/** Efficacy Summary for an atom */
export type EfficacySummary = {
  __typename?: 'EfficacySummary';
  averageImprovement: Scalars['Float']['output'];
  highQualityCount: Scalars['Int']['output'];
  indicators: Array<EfficacyIndicator>;
  shortestTimeframe?: Maybe<Scalars['String']['output']>;
};

export enum EffortLevel {
  High = 'HIGH',
  Low = 'LOW',
  Medium = 'MEDIUM'
}

/** Common error type */
export type Error = {
  __typename?: 'Error';
  code: Scalars['String']['output'];
  field?: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
};

/** Event format */
export enum EventFormat {
  Hybrid = 'HYBRID',
  InPerson = 'IN_PERSON',
  Virtual = 'VIRTUAL'
}

/** Event status */
export enum EventStatus {
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Ongoing = 'ONGOING',
  Upcoming = 'UPCOMING'
}

/** Event type categorization */
export enum EventType {
  Conference = 'CONFERENCE',
  Meetup = 'MEETUP',
  Webinar = 'WEBINAR',
  Workshop = 'WORKSHOP'
}

/**
 * Evidence Level Classification
 * 7-tier system for scientific rigor
 */
export enum EvidenceLevel {
  Anecdotal = 'ANECDOTAL',
  Animal = 'ANIMAL',
  GoldStandard = 'GOLD_STANDARD',
  HumanControlled = 'HUMAN_CONTROLLED',
  HumanPilot = 'HUMAN_PILOT',
  InVitro = 'IN_VITRO',
  MetaAnalysis = 'META_ANALYSIS'
}

/** Evidence Summary for an atom */
export type EvidenceSummary = {
  __typename?: 'EvidenceSummary';
  averageEvidenceStrength: Scalars['Float']['output'];
  claimsByLevel: Scalars['JSON']['output'];
  highestEvidenceLevel?: Maybe<EvidenceLevel>;
  totalClaims: Scalars['Int']['output'];
};

/** Financial performance metrics */
export type FinancialMetrics = {
  __typename?: 'FinancialMetrics';
  averageOrderValue: Scalars['Float']['output'];
  churnRate: Scalars['Float']['output'];
  conversionRate: Scalars['Float']['output'];
  customerLifetimeValue: Scalars['Float']['output'];
  growthRate: Scalars['Float']['output'];
  monthlyRecurringRevenue: Scalars['Float']['output'];
  retentionRate: Scalars['Float']['output'];
  revenueByPeriod: Array<RevenuePeriod>;
  totalRevenue: Scalars['Float']['output'];
};

export type FulfillmentInfo = {
  __typename?: 'FulfillmentInfo';
  actualDelivery?: Maybe<Scalars['DateTime']['output']>;
  carrier?: Maybe<Scalars['String']['output']>;
  estimatedDelivery?: Maybe<Scalars['DateTime']['output']>;
  trackingNumber?: Maybe<Scalars['String']['output']>;
  trackingUrl?: Maybe<Scalars['String']['output']>;
};

export type FulfillmentSettings = {
  __typename?: 'FulfillmentSettings';
  freeShippingThreshold?: Maybe<Scalars['Float']['output']>;
  handlingTime: Scalars['Int']['output'];
  returnPolicy: Scalars['String']['output'];
  shippingMethods: Array<Scalars['String']['output']>;
};

export type FulfillmentSettingsInput = {
  freeShippingThreshold?: InputMaybe<Scalars['Float']['input']>;
  handlingTime: Scalars['Int']['input'];
  returnPolicy: Scalars['String']['input'];
  shippingMethods: Array<Scalars['String']['input']>;
};

export type GenerateReportInput = {
  filters?: InputMaybe<MetricsFiltersInput>;
  format: ReportFormat;
  includeCharts?: InputMaybe<Scalars['Boolean']['input']>;
  includeRawData?: InputMaybe<Scalars['Boolean']['input']>;
  includeRecommendations?: InputMaybe<Scalars['Boolean']['input']>;
  timeframe: MetricsTimeframeInput;
  type: ReportType;
};

export type GeographicRegion = {
  __typename?: 'GeographicRegion';
  customers: Scalars['Int']['output'];
  region: Scalars['String']['output'];
  revenue: Scalars['Float']['output'];
};

/** Goldilocks parameter - optimal ranges for ingredients/protocols */
export type GoldilocksParameter = {
  __typename?: 'GoldilocksParameter';
  absoluteMax?: Maybe<Scalars['Float']['output']>;
  absoluteMin?: Maybe<Scalars['Float']['output']>;
  atomId: Scalars['ID']['output'];
  context?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  evidenceLevel?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  optimalMax: Scalars['Float']['output'];
  optimalMin: Scalars['Float']['output'];
  parameterName: Scalars['String']['output'];
  parameterUnit?: Maybe<Scalars['String']['output']>;
  skinType?: Maybe<Scalars['String']['output']>;
  sourceType?: Maybe<SourceType>;
  sourceUrl?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['String']['output'];
};

export type ImpressionMetrics = {
  __typename?: 'ImpressionMetrics';
  bySource: ImpressionsBySource;
  percentChange: Scalars['Float']['output'];
  total: Scalars['Int']['output'];
  trend: TrendIndicator;
};

export type ImpressionsBySource = {
  __typename?: 'ImpressionsBySource';
  browse: Scalars['Int']['output'];
  direct: Scalars['Int']['output'];
  recommendation: Scalars['Int']['output'];
  search: Scalars['Int']['output'];
  values: Scalars['Int']['output'];
};

export type Ingredient = {
  __typename?: 'Ingredient';
  concentration?: Maybe<Scalars['Float']['output']>;
  function: Scalars['String']['output'];
  name: Scalars['String']['output'];
  warnings?: Maybe<Array<Scalars['String']['output']>>;
};

export type IngredientAnalysis = {
  __typename?: 'IngredientAnalysis';
  avgEfficacyScore?: Maybe<Scalars['Float']['output']>;
  ingredient: Scalars['String']['output'];
  productCount: Scalars['Int']['output'];
  satisfaction: Scalars['Float']['output'];
  usage: Scalars['Int']['output'];
};

export type IngredientInput = {
  concentration?: InputMaybe<Scalars['Float']['input']>;
  function: Scalars['String']['input'];
  name: Scalars['String']['input'];
  warnings?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** Ingredient Interaction result */
export type IngredientInteraction = {
  __typename?: 'IngredientInteraction';
  atomA: SkincareAtom;
  atomB: SkincareAtom;
  conflictType?: Maybe<ConflictType>;
  interactionType: InteractionType;
  mechanism: Scalars['String']['output'];
  recommendation: Scalars['String']['output'];
  severity: Scalars['Int']['output'];
  synergyType?: Maybe<SynergyType>;
  waitTime?: Maybe<Scalars['String']['output']>;
};

export type IngredientList = {
  __typename?: 'IngredientList';
  actives: Array<ActiveIngredient>;
  allergens: Array<Scalars['String']['output']>;
  crueltyFree: Scalars['Boolean']['output'];
  inci: Array<Ingredient>;
  vegan: Scalars['Boolean']['output'];
};

export type IngredientListInput = {
  actives: Array<ActiveIngredientInput>;
  allergens: Array<Scalars['String']['input']>;
  crueltyFree: Scalars['Boolean']['input'];
  inci: Array<IngredientInput>;
  vegan: Scalars['Boolean']['input'];
};

/** AI-generated insights for business intelligence */
export type InsightEngine = {
  __typename?: 'InsightEngine';
  actionableRecommendations: Array<ActionableRecommendation>;
  anomalyDetection: Array<AnomalyInsight>;
  businessAlerts: Array<BusinessAlert>;
  generatedAt: Scalars['DateTime']['output'];
  predictiveInsights: Array<PredictiveInsight>;
  trendAnalysis: Array<TrendInsight>;
};

export type InsuranceInfo = {
  __typename?: 'InsuranceInfo';
  coverage: Money;
  documentUrl: Scalars['String']['output'];
  expirationDate: Scalars['DateTime']['output'];
  policyNumber: Scalars['String']['output'];
  provider: Scalars['String']['output'];
};

export type InsuranceInfoInput = {
  coverage: MoneyInput;
  documentUrl: Scalars['String']['input'];
  expirationDate: Scalars['DateTime']['input'];
  policyNumber: Scalars['String']['input'];
  provider: Scalars['String']['input'];
};

/** Intelligence Search filters */
export type IntelligenceSearchFilters = {
  atomTypes?: InputMaybe<Array<SkincareAtomType>>;
  maxSensitivity?: InputMaybe<Scalars['Float']['input']>;
  minAntiAging?: InputMaybe<Scalars['Float']['input']>;
  minEvidenceLevel?: InputMaybe<EvidenceLevel>;
  minHydration?: InputMaybe<Scalars['Float']['input']>;
  thresholds?: InputMaybe<Array<KnowledgeThreshold>>;
};

/** Intelligence Search Response */
export type IntelligenceSearchResponse = {
  __typename?: 'IntelligenceSearchResponse';
  executionTimeMs?: Maybe<Scalars['Int']['output']>;
  query?: Maybe<Scalars['String']['output']>;
  results: Array<IntelligenceSearchResult>;
  totalCount: Scalars['Int']['output'];
};

/** Intelligence Search Result */
export type IntelligenceSearchResult = {
  __typename?: 'IntelligenceSearchResult';
  atom: SkincareAtom;
  combinedScore: Scalars['Float']['output'];
  evidenceStrength: Scalars['Float']['output'];
  knowledgeThreshold?: Maybe<KnowledgeThreshold>;
  semanticScore: Scalars['Float']['output'];
  tensorScore: Scalars['Float']['output'];
};

/** Interaction Type between ingredients */
export enum InteractionType {
  Conflict = 'CONFLICT',
  Neutral = 'NEUTRAL',
  Sequencing = 'SEQUENCING',
  Synergy = 'SYNERGY'
}

export enum JobStatus {
  Completed = 'COMPLETED',
  Failed = 'FAILED',
  Pending = 'PENDING',
  Processing = 'PROCESSING'
}

/** Job status response for async operations */
export type JobStatusResponse = {
  __typename?: 'JobStatusResponse';
  jobId: Scalars['String']['output'];
  message?: Maybe<Scalars['String']['output']>;
  status: JobStatus;
};

export type JourneyStage = {
  __typename?: 'JourneyStage';
  count: Scalars['Int']['output'];
  percentage: Scalars['Float']['output'];
  stage: Scalars['String']['output'];
};

/**
 * Knowledge Threshold Levels (T1-T8)
 * Hierarchical classification of knowledge complexity and access levels
 */
export enum KnowledgeThreshold {
  T1SkinBiology = 'T1_SKIN_BIOLOGY',
  T2IngredientScience = 'T2_INGREDIENT_SCIENCE',
  T3ProductFormulation = 'T3_PRODUCT_FORMULATION',
  T4TreatmentProtocols = 'T4_TREATMENT_PROTOCOLS',
  T5Contraindications = 'T5_CONTRAINDICATIONS',
  T6ProfessionalTechniques = 'T6_PROFESSIONAL_TECHNIQUES',
  T7RegulatoryCompliance = 'T7_REGULATORY_COMPLIANCE',
  T8SystemicPatterns = 'T8_SYSTEMIC_PATTERNS'
}

export type LicenseInfo = {
  __typename?: 'LicenseInfo';
  expirationDate: Scalars['DateTime']['output'];
  number: Scalars['String']['output'];
  state: Scalars['String']['output'];
  type: LicenseType;
  verified: Scalars['Boolean']['output'];
  verifiedAt?: Maybe<Scalars['DateTime']['output']>;
  verifiedBy?: Maybe<Scalars['ID']['output']>;
};

export enum LicenseType {
  Cosmetologist = 'COSMETOLOGIST',
  Esthetician = 'ESTHETICIAN',
  MassageTherapist = 'MASSAGE_THERAPIST',
  MedicalDirector = 'MEDICAL_DIRECTOR',
  NursePractitioner = 'NURSE_PRACTITIONER'
}

/** Location (for spa chains) */
export type Location = {
  __typename?: 'Location';
  address: Address;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  operatingHours: Scalars['JSON']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  serviceProviders: Array<ServiceProvider>;
  spaOrganizationId: Scalars['ID']['output'];
  timezone: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

/** Login input */
export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

/** Market Segments (5 categories) */
export enum MarketSegment {
  Luxury = 'LUXURY',
  Mass = 'MASS',
  Medical = 'MEDICAL',
  Natural = 'NATURAL',
  Prestige = 'PRESTIGE'
}

export type MarketingCampaign = {
  __typename?: 'MarketingCampaign';
  audienceDetails?: Maybe<Scalars['JSON']['output']>;
  audienceSize?: Maybe<Scalars['Int']['output']>;
  budgetDollars: Scalars['Float']['output'];
  budgetUtilization: Scalars['Float']['output'];
  clicks: Scalars['Int']['output'];
  conversionRate: Scalars['Float']['output'];
  conversions: Scalars['Int']['output'];
  cpcDollars: Scalars['Float']['output'];
  createdAt: Scalars['DateTime']['output'];
  ctr: Scalars['Float']['output'];
  description?: Maybe<Scalars['String']['output']>;
  endDate: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  impressions: Scalars['Int']['output'];
  metadata?: Maybe<Scalars['JSON']['output']>;
  name: Scalars['String']['output'];
  revenueDollars: Scalars['Float']['output'];
  roas: Scalars['Float']['output'];
  spentDollars: Scalars['Float']['output'];
  startDate: Scalars['DateTime']['output'];
  status: CampaignStatus;
  type: CampaignType;
  updatedAt: Scalars['DateTime']['output'];
  vendorId: Scalars['ID']['output'];
};

export type MarketingCampaignResult = {
  __typename?: 'MarketingCampaignResult';
  campaign?: Maybe<MarketingCampaign>;
  errors?: Maybe<Array<VendorPortalError>>;
  success: Scalars['Boolean']['output'];
};

export type MessageAttachmentInput = {
  fileSize: Scalars['Int']['input'];
  fileType: Scalars['String']['input'];
  filename: Scalars['String']['input'];
  url: Scalars['String']['input'];
};

export enum MessageSenderType {
  Spa = 'SPA',
  System = 'SYSTEM',
  Vendor = 'VENDOR'
}

export type MetricsFiltersInput = {
  organizationId?: InputMaybe<Scalars['ID']['input']>;
  productCategory?: InputMaybe<Scalars['String']['input']>;
  region?: InputMaybe<Scalars['String']['input']>;
  skinType?: InputMaybe<Scalars['String']['input']>;
};

export type MetricsTimeframeInput = {
  /** Custom end date */
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** Timeframe preset: 7d, 30d, 90d, 1y, mtd, ytd */
  preset?: InputMaybe<Scalars['String']['input']>;
  /** Custom start date */
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
};

/** Money type for currency values */
export type Money = {
  __typename?: 'Money';
  amount: Scalars['Float']['output'];
  currency: Scalars['String']['output'];
};

export type MoneyInput = {
  amount: Scalars['Float']['input'];
  currency: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Mark a comment as accepted answer (for question posts) */
  acceptAnswer: CommunityComment;
  /** Acknowledge a business alert */
  acknowledgeAlert: BusinessAlert;
  /**
   * Add certification to profile
   * Requires: Vendor authentication
   * Sprint A.1: Vendor Profile Schema
   */
  addCertification: CertificationResult;
  /**
   * Add shipping information to an order
   * Requires: Vendor authentication
   * Sprint B.4: Order Management
   */
  addShippingInfo: VendorOrder;
  /** Approve/reject vendor organization (admin only) */
  approveVendorOrganization: VendorOrganizationResult;
  /**
   * Archive a conversation
   * Requires: Vendor authentication
   * Sprint C: Communication
   */
  archiveConversation: Conversation;
  /**
   * Assign reviewer to vendor application (Admin only)
   * Requires: Admin authentication
   * Sprint E.2: Admin Tools
   */
  assignApplicationReviewer: VendorApplicationResult;
  /**
   * Bulk update taxonomy for multiple products
   * Admin only - for data cleanup
   */
  bulkUpdateTaxonomy: BulkTaxonomyResult;
  /** Cancel appointment */
  cancelAppointment: AppointmentResult;
  /** Cancel an event */
  cancelEvent: CommunityEvent;
  /** Cancel event registration */
  cancelRegistration: CommunityEvent;
  /** Check in client for appointment */
  checkInAppointment: AppointmentResult;
  /** Complete appointment */
  completeAppointment: AppointmentResult;
  /**
   * Complete an onboarding step
   * Requires: Vendor authentication
   * Sprint A.2: Application & Onboarding
   */
  completeOnboardingStep: OnboardingStepResult;
  /** Create appointment */
  createAppointment: AppointmentResult;
  /**
   * Create a new marketing campaign
   * Requires: Vendor authentication
   * Marketing Analytics Integration
   */
  createCampaign: MarketingCampaignResult;
  /** Create client profile */
  createClient: ClientResult;
  /** Create a comment on a post */
  createComment: CommunityComment;
  /**
   * Create a new conversation with a spa
   * Requires: Vendor authentication
   * Sprint C: Communication
   */
  createConversation: Conversation;
  /** Create a new community event */
  createEvent: CommunityEvent;
  /** Create a mock product for testing */
  createMockProduct: ProductResult;
  /** Create a new community post */
  createPost: CommunityPost;
  /** Create a new product */
  createProduct: ProductResult;
  /** Create new product taxonomy */
  createProductTaxonomy: ProductTaxonomy;
  /** Create spa organization */
  createSpaOrganization: SpaOrganizationResult;
  /** Create vendor organization */
  createVendorOrganization: VendorOrganizationResult;
  /**
   * Create vendor profile (first-time setup after application approval)
   * Requires: Vendor authentication
   * Sprint A.1: Vendor Profile Schema
   */
  createVendorProfile: VendorProfileResult;
  /**
   * Delete a marketing campaign
   * Requires: Vendor authentication
   * Marketing Analytics Integration
   */
  deleteCampaign: MarketingCampaignResult;
  /** Delete a comment */
  deleteComment: Scalars['Boolean']['output'];
  /** Delete a post */
  deletePost: Scalars['Boolean']['output'];
  /** Delete product taxonomy */
  deleteProductTaxonomy: Scalars['Boolean']['output'];
  /** Delete scheduled report */
  deleteScheduledReport: Scalars['Boolean']['output'];
  /**
   * Flag a message for moderation
   * Requires: Vendor authentication
   * Sprint C: Communication
   */
  flagMessage: ConversationMessage;
  /** Generate embeddings for all products (admin utility) */
  generateAllProductEmbeddings: Scalars['Int']['output'];
  /** Generate semantic embedding for product */
  generateProductEmbedding: JobStatusResponse;
  /** Generate tensor vector for product */
  generateProductTensor: JobStatusResponse;
  /** Generate a report on demand */
  generateReport: Report;
  /** Add claim evidence to an atom */
  intelligenceAddClaimEvidence: ClaimEvidence;
  /** Add efficacy indicator to an atom */
  intelligenceAddEfficacyIndicator: EfficacyIndicator;
  /** Batch sync embeddings */
  intelligenceBatchSyncEmbeddings: Scalars['JSON']['output'];
  /** Delete claim evidence */
  intelligenceDeleteClaimEvidence: Scalars['Boolean']['output'];
  /** Delete efficacy indicator */
  intelligenceDeleteEfficacyIndicator: Scalars['Boolean']['output'];
  /** Update atom knowledge threshold */
  intelligenceSetAtomThreshold: SkincareAtom;
  /** Update atom Why It Works explanation */
  intelligenceSetWhyItWorks: SkincareAtom;
  /** Sync atom embedding to vector database */
  intelligenceSyncEmbedding: Scalars['Boolean']['output'];
  /** Update claim evidence */
  intelligenceUpdateClaimEvidence: ClaimEvidence;
  /** Update efficacy indicator */
  intelligenceUpdateEfficacyIndicator: EfficacyIndicator;
  /** Create or get sanctuary member for current user */
  joinSanctuary: SanctuaryMember;
  /** Like a comment */
  likeComment: CommunityComment;
  /** Like a post */
  likePost: CommunityPost;
  /** Login with email and password */
  login: AuthResult;
  /** Logout (invalidate tokens) */
  logout: SuccessResponse;
  /**
   * Mark conversation as read
   * Requires: Vendor authentication
   * Sprint C: Communication
   */
  markConversationAsRead: Conversation;
  /** Record an analytics event (for internal tracking) */
  recordAnalyticsEvent: Scalars['Boolean']['output'];
  /** Refresh access token */
  refreshToken: AuthResult;
  /** Register new user */
  register: AuthResult;
  /** Register for an event */
  registerForEvent: CommunityEvent;
  /**
   * Remove certification from profile
   * Requires: Vendor authentication
   * Sprint A.1: Vendor Profile Schema
   */
  removeCertification: CertificationResult;
  /** Request password reset */
  requestPasswordReset: SuccessResponse;
  /** Reset password with token */
  resetPassword: SuccessResponse;
  /** Reset user settings to defaults */
  resetUserSettings: UserSettingsResult;
  /**
   * Review and approve/reject vendor application (Admin only)
   * Requires: Admin authentication
   * Sprint A.2: Application & Onboarding
   */
  reviewVendorApplication: VendorApplicationResult;
  /** Schedule recurring reports */
  scheduleReport: ScheduledReport;
  /**
   * Send a message in a conversation
   * Requires: Vendor authentication
   * Sprint C: Communication
   */
  sendMessage: ConversationMessage;
  /** Create a new skincare atom */
  skaCreateAtom: SkincareAtom;
  /** Create a relationship between atoms */
  skaCreateRelationship: SkincareRelationship;
  /** Delete a skincare atom */
  skaDeleteAtom: Scalars['Boolean']['output'];
  /** Delete a relationship */
  skaDeleteRelationship: Scalars['Boolean']['output'];
  /** Generate or update 17-D tensor for an atom */
  skaGenerateTensor17D: SkincareAtomTensor;
  /** Set Goldilocks parameter for an atom */
  skaSetGoldilocksParameter: GoldilocksParameter;
  /** Update a skincare atom */
  skaUpdateAtom: SkincareAtom;
  /**
   * Skip an optional onboarding step
   * Requires: Vendor authentication
   * Sprint A.2: Application & Onboarding
   */
  skipOnboardingStep: OnboardingStepResult;
  /**
   * Submit vendor application to join marketplace
   * Public mutation (no auth required)
   * Sprint A.2: Application & Onboarding
   */
  submitVendorApplication: VendorApplicationResult;
  /** Unlike a comment */
  unlikeComment: CommunityComment;
  /** Unlike a post */
  unlikePost: CommunityPost;
  /** Update current user's app preferences */
  updateAppPreferences: UserSettingsResult;
  /** Update appointment */
  updateAppointment: AppointmentResult;
  /**
   * Update an existing marketing campaign
   * Requires: Vendor authentication
   * Marketing Analytics Integration
   */
  updateCampaign: MarketingCampaignResult;
  /**
   * Update campaign performance metrics
   * Requires: Vendor authentication
   * Marketing Analytics Integration
   */
  updateCampaignMetrics: MarketingCampaignResult;
  /** Update client profile */
  updateClient: ClientResult;
  /** Update a comment */
  updateComment: CommunityComment;
  /** Update an event */
  updateEvent: CommunityEvent;
  /** Update current user's notification preferences */
  updateNotificationSettings: UserSettingsResult;
  /**
   * Update the status of an order
   * Requires: Vendor authentication
   * Sprint B.4: Order Management
   */
  updateOrderStatus: VendorOrder;
  /** Update an existing post */
  updatePost: CommunityPost;
  /** Update product information */
  updateProduct: ProductResult;
  /**
   * Create or update product taxonomy
   * Used by vendors during product submission
   */
  updateProductTaxonomy: ProductTaxonomy;
  /** Update user profile */
  updateProfile: UserResult;
  /** Update current user's profile settings */
  updateProfileSettings: UserSettingsResult;
  /** Update sanctuary profile */
  updateSanctuaryProfile: SanctuaryMember;
  /** Update scheduled report */
  updateScheduledReport: ScheduledReport;
  /** Update spa organization */
  updateSpaOrganization: SpaOrganizationResult;
  /** Update all user settings at once */
  updateUserSettings: UserSettingsResult;
  /** Update vendor organization */
  updateVendorOrganization: VendorOrganizationResult;
  /**
   * Update vendor profile
   * Requires: Vendor authentication
   * Sprint A.1: Vendor Profile Schema
   */
  updateVendorProfile: VendorProfileResult;
  /**
   * Verify vendor certification (Admin only)
   * Requires: Admin authentication
   * Sprint A.1: Vendor Profile Schema
   */
  verifyCertification: CertificationResult;
  /** Increment view count for a post */
  viewPost: CommunityPost;
};


export type MutationAcceptAnswerArgs = {
  commentId: Scalars['ID']['input'];
};


export type MutationAcknowledgeAlertArgs = {
  input: AcknowledgeAlertInput;
};


export type MutationAddCertificationArgs = {
  input: AddCertificationInput;
};


export type MutationAddShippingInfoArgs = {
  input: AddShippingInfoInput;
};


export type MutationApproveVendorOrganizationArgs = {
  decision: ApprovalDecision;
  id: Scalars['ID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
};


export type MutationArchiveConversationArgs = {
  conversationId: Scalars['ID']['input'];
};


export type MutationAssignApplicationReviewerArgs = {
  applicationId: Scalars['ID']['input'];
  reviewerId: Scalars['ID']['input'];
};


export type MutationBulkUpdateTaxonomyArgs = {
  updates: Array<BulkTaxonomyUpdate>;
};


export type MutationCancelAppointmentArgs = {
  id: Scalars['ID']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCancelEventArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCancelRegistrationArgs = {
  eventId: Scalars['ID']['input'];
};


export type MutationCheckInAppointmentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCompleteAppointmentArgs = {
  id: Scalars['ID']['input'];
  input: CompleteAppointmentInput;
};


export type MutationCompleteOnboardingStepArgs = {
  input: CompleteOnboardingStepInput;
};


export type MutationCreateAppointmentArgs = {
  input: CreateAppointmentInput;
};


export type MutationCreateCampaignArgs = {
  input: CreateCampaignInput;
};


export type MutationCreateClientArgs = {
  input: CreateClientInput;
};


export type MutationCreateCommentArgs = {
  content: Scalars['String']['input'];
  parentCommentId?: InputMaybe<Scalars['ID']['input']>;
  postId: Scalars['ID']['input'];
};


export type MutationCreateConversationArgs = {
  input: CreateConversationInput;
};


export type MutationCreateEventArgs = {
  input: CreateEventInput;
};


export type MutationCreateMockProductArgs = {
  vendorOrganizationId: Scalars['ID']['input'];
};


export type MutationCreatePostArgs = {
  input: CreatePostInput;
};


export type MutationCreateProductArgs = {
  input: CreateProductInput;
};


export type MutationCreateProductTaxonomyArgs = {
  input: ProductTaxonomyInput;
};


export type MutationCreateSpaOrganizationArgs = {
  input: CreateSpaOrganizationInput;
};


export type MutationCreateVendorOrganizationArgs = {
  input: CreateVendorOrganizationInput;
};


export type MutationCreateVendorProfileArgs = {
  input: CreateVendorProfileInput;
};


export type MutationDeleteCampaignArgs = {
  campaignId: Scalars['ID']['input'];
};


export type MutationDeleteCommentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePostArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteProductTaxonomyArgs = {
  productId: Scalars['ID']['input'];
};


export type MutationDeleteScheduledReportArgs = {
  id: Scalars['ID']['input'];
};


export type MutationFlagMessageArgs = {
  messageId: Scalars['ID']['input'];
  reason: Scalars['String']['input'];
};


export type MutationGenerateProductEmbeddingArgs = {
  productId: Scalars['ID']['input'];
};


export type MutationGenerateProductTensorArgs = {
  productId: Scalars['ID']['input'];
};


export type MutationGenerateReportArgs = {
  input: GenerateReportInput;
};


export type MutationIntelligenceAddClaimEvidenceArgs = {
  atomId: Scalars['ID']['input'];
  input: ClaimEvidenceInput;
};


export type MutationIntelligenceAddEfficacyIndicatorArgs = {
  atomId: Scalars['ID']['input'];
  input: EfficacyIndicatorInput;
};


export type MutationIntelligenceBatchSyncEmbeddingsArgs = {
  atomIds: Array<Scalars['ID']['input']>;
};


export type MutationIntelligenceDeleteClaimEvidenceArgs = {
  id: Scalars['ID']['input'];
};


export type MutationIntelligenceDeleteEfficacyIndicatorArgs = {
  id: Scalars['ID']['input'];
};


export type MutationIntelligenceSetAtomThresholdArgs = {
  atomId: Scalars['ID']['input'];
  threshold: KnowledgeThreshold;
};


export type MutationIntelligenceSetWhyItWorksArgs = {
  atomId: Scalars['ID']['input'];
  causalSummary?: InputMaybe<Scalars['String']['input']>;
  whyItWorks: Scalars['String']['input'];
};


export type MutationIntelligenceSyncEmbeddingArgs = {
  atomId: Scalars['ID']['input'];
};


export type MutationIntelligenceUpdateClaimEvidenceArgs = {
  id: Scalars['ID']['input'];
  input: ClaimEvidenceInput;
};


export type MutationIntelligenceUpdateEfficacyIndicatorArgs = {
  id: Scalars['ID']['input'];
  input: EfficacyIndicatorInput;
};


export type MutationJoinSanctuaryArgs = {
  displayName: Scalars['String']['input'];
};


export type MutationLikeCommentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationLikePostArgs = {
  id: Scalars['ID']['input'];
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationMarkConversationAsReadArgs = {
  conversationId: Scalars['ID']['input'];
};


export type MutationRecordAnalyticsEventArgs = {
  eventData: Scalars['JSON']['input'];
  eventType: Scalars['String']['input'];
  organizationId?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationRefreshTokenArgs = {
  refreshToken: Scalars['String']['input'];
};


export type MutationRegisterArgs = {
  input: RegisterInput;
};


export type MutationRegisterForEventArgs = {
  eventId: Scalars['ID']['input'];
};


export type MutationRemoveCertificationArgs = {
  certificationId: Scalars['ID']['input'];
};


export type MutationRequestPasswordResetArgs = {
  email: Scalars['String']['input'];
};


export type MutationResetPasswordArgs = {
  input: ResetPasswordInput;
};


export type MutationReviewVendorApplicationArgs = {
  input: ApplicationReviewDecisionInput;
};


export type MutationScheduleReportArgs = {
  input: ScheduleReportInput;
};


export type MutationSendMessageArgs = {
  input: SendMessageInput;
};


export type MutationSkaCreateAtomArgs = {
  atomType: SkincareAtomType;
  casNumber?: InputMaybe<Scalars['String']['input']>;
  glanceText: Scalars['String']['input'];
  inciName?: InputMaybe<Scalars['String']['input']>;
  marketSegment?: InputMaybe<MarketSegment>;
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  pillarId: Scalars['ID']['input'];
  pricePoint?: InputMaybe<PricePoint>;
  scanText: Scalars['String']['input'];
  slug: Scalars['String']['input'];
  studyText: Scalars['String']['input'];
  title: Scalars['String']['input'];
};


export type MutationSkaCreateRelationshipArgs = {
  evidenceDescription?: InputMaybe<Scalars['String']['input']>;
  fromAtomId: Scalars['ID']['input'];
  relationshipType: SkincareRelationshipType;
  sourceType?: InputMaybe<SourceType>;
  sourceUrl?: InputMaybe<Scalars['String']['input']>;
  strength?: InputMaybe<Scalars['Float']['input']>;
  toAtomId: Scalars['ID']['input'];
};


export type MutationSkaDeleteAtomArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSkaDeleteRelationshipArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSkaGenerateTensor17DArgs = {
  atomId: Scalars['ID']['input'];
  tensor: SkaTensorProfileInput;
};


export type MutationSkaSetGoldilocksParameterArgs = {
  absoluteMax?: InputMaybe<Scalars['Float']['input']>;
  absoluteMin?: InputMaybe<Scalars['Float']['input']>;
  atomId: Scalars['ID']['input'];
  context?: InputMaybe<Scalars['String']['input']>;
  evidenceLevel?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  optimalMax: Scalars['Float']['input'];
  optimalMin: Scalars['Float']['input'];
  parameterName: Scalars['String']['input'];
  parameterUnit?: InputMaybe<Scalars['String']['input']>;
  skinType?: InputMaybe<Scalars['String']['input']>;
};


export type MutationSkaUpdateAtomArgs = {
  causesPurging?: InputMaybe<Scalars['Boolean']['input']>;
  crueltyFree?: InputMaybe<Scalars['Boolean']['input']>;
  efficacyScore?: InputMaybe<Scalars['Float']['input']>;
  euCompliant?: InputMaybe<Scalars['Boolean']['input']>;
  fdaApproved?: InputMaybe<Scalars['Boolean']['input']>;
  glanceText?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  innovationScore?: InputMaybe<Scalars['Float']['input']>;
  marketSegment?: InputMaybe<MarketSegment>;
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  pricePoint?: InputMaybe<PricePoint>;
  purgingDescription?: InputMaybe<Scalars['String']['input']>;
  purgingDurationWeeks?: InputMaybe<Scalars['Int']['input']>;
  scanText?: InputMaybe<Scalars['String']['input']>;
  studyText?: InputMaybe<Scalars['String']['input']>;
  sustainabilityScore?: InputMaybe<Scalars['Float']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};


export type MutationSkipOnboardingStepArgs = {
  stepId: Scalars['ID']['input'];
};


export type MutationSubmitVendorApplicationArgs = {
  input: SubmitVendorApplicationInput;
};


export type MutationUnlikeCommentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUnlikePostArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateAppPreferencesArgs = {
  input: UpdateAppPreferencesInput;
};


export type MutationUpdateAppointmentArgs = {
  id: Scalars['ID']['input'];
  input: UpdateAppointmentInput;
};


export type MutationUpdateCampaignArgs = {
  input: UpdateCampaignInput;
};


export type MutationUpdateCampaignMetricsArgs = {
  input: UpdateCampaignMetricsInput;
};


export type MutationUpdateClientArgs = {
  id: Scalars['ID']['input'];
  input: UpdateClientInput;
};


export type MutationUpdateCommentArgs = {
  content: Scalars['String']['input'];
  id: Scalars['ID']['input'];
};


export type MutationUpdateEventArgs = {
  id: Scalars['ID']['input'];
  input: CreateEventInput;
};


export type MutationUpdateNotificationSettingsArgs = {
  input: UpdateNotificationSettingsInput;
};


export type MutationUpdateOrderStatusArgs = {
  input: UpdateOrderStatusInput;
};


export type MutationUpdatePostArgs = {
  id: Scalars['ID']['input'];
  input: UpdatePostInput;
};


export type MutationUpdateProductArgs = {
  id: Scalars['ID']['input'];
  input: UpdateProductInput;
};


export type MutationUpdateProductTaxonomyArgs = {
  input: ProductTaxonomyInput;
};


export type MutationUpdateProfileArgs = {
  input: UpdateProfileInput;
};


export type MutationUpdateProfileSettingsArgs = {
  input: UpdateProfileSettingsInput;
};


export type MutationUpdateSanctuaryProfileArgs = {
  input: UpdateSanctuaryProfileInput;
};


export type MutationUpdateScheduledReportArgs = {
  id: Scalars['ID']['input'];
  input: ScheduleReportInput;
};


export type MutationUpdateSpaOrganizationArgs = {
  id: Scalars['ID']['input'];
  input: UpdateSpaOrganizationInput;
};


export type MutationUpdateUserSettingsArgs = {
  input: UpdateUserSettingsInput;
};


export type MutationUpdateVendorOrganizationArgs = {
  id: Scalars['ID']['input'];
  input: UpdateVendorOrganizationInput;
};


export type MutationUpdateVendorProfileArgs = {
  input: UpdateVendorProfileInput;
};


export type MutationVerifyCertificationArgs = {
  input: CertificationVerificationInput;
};


export type MutationViewPostArgs = {
  id: Scalars['ID']['input'];
};

/** Notification Settings - User's notification preferences */
export type NotificationSettings = {
  __typename?: 'NotificationSettings';
  /** Appointment reminder notifications */
  appointmentReminders: Scalars['Boolean']['output'];
  /** Community activity notifications */
  communityActivity: Scalars['Boolean']['output'];
  /** Receive email notifications */
  emailEnabled: Scalars['Boolean']['output'];
  /** Marketing and promotional emails */
  marketingEmails: Scalars['Boolean']['output'];
  /** Order status update notifications */
  orderUpdates: Scalars['Boolean']['output'];
  /** New product announcements */
  productAnnouncements: Scalars['Boolean']['output'];
  /** Receive push notifications */
  pushEnabled: Scalars['Boolean']['output'];
  /** Hours before appointment to send reminder */
  reminderHours: Scalars['Int']['output'];
  /** Receive SMS notifications */
  smsEnabled: Scalars['Boolean']['output'];
  /** Weekly digest of activity */
  weeklyDigest: Scalars['Boolean']['output'];
};

export type OnboardingStep = {
  __typename?: 'OnboardingStep';
  completedAt?: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  helpArticleUrl?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  onboardingId: Scalars['ID']['output'];
  order: Scalars['Int']['output'];
  required: Scalars['Boolean']['output'];
  status: OnboardingStepStatus;
};

export type OnboardingStepResult = {
  __typename?: 'OnboardingStepResult';
  errors?: Maybe<Array<VendorPortalError>>;
  onboarding?: Maybe<VendorOnboarding>;
  step?: Maybe<OnboardingStep>;
  success: Scalars['Boolean']['output'];
};

export enum OnboardingStepStatus {
  Completed = 'COMPLETED',
  InProgress = 'IN_PROGRESS',
  Pending = 'PENDING',
  Skipped = 'SKIPPED'
}

export type OrderFilterInput = {
  dateRange?: InputMaybe<DateRangeInput>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
  spaId?: InputMaybe<Scalars['ID']['input']>;
  status?: InputMaybe<Array<OrderStatus>>;
};

export type OrderItem = {
  __typename?: 'OrderItem';
  imageUrl?: Maybe<Scalars['String']['output']>;
  productId: Scalars['ID']['output'];
  productName: Scalars['String']['output'];
  quantity: Scalars['Int']['output'];
  sku: Scalars['String']['output'];
  totalPrice: Scalars['Float']['output'];
  unitPrice: Scalars['Float']['output'];
};

export type OrderMetrics = {
  __typename?: 'OrderMetrics';
  avgOrderValue: Scalars['Float']['output'];
  count: Scalars['Int']['output'];
  fromNewSpas: Scalars['Int']['output'];
  fromRepeatSpas: Scalars['Int']['output'];
  percentChange: Scalars['Float']['output'];
  trend: TrendIndicator;
};

export enum OrderSortField {
  CreatedAt = 'CREATED_AT',
  Status = 'STATUS',
  Total = 'TOTAL',
  UpdatedAt = 'UPDATED_AT'
}

export type OrderSortInput = {
  direction: SortOrder;
  field: OrderSortField;
};

export enum OrderStatus {
  Cancelled = 'CANCELLED',
  Confirmed = 'CONFIRMED',
  Delivered = 'DELIVERED',
  Disputed = 'DISPUTED',
  Pending = 'PENDING',
  Processing = 'PROCESSING',
  Returned = 'RETURNED',
  Shipped = 'SHIPPED'
}

export type OrderStatusCounts = {
  __typename?: 'OrderStatusCounts';
  cancelled: Scalars['Int']['output'];
  confirmed: Scalars['Int']['output'];
  delivered: Scalars['Int']['output'];
  disputed: Scalars['Int']['output'];
  pending: Scalars['Int']['output'];
  processing: Scalars['Int']['output'];
  shipped: Scalars['Int']['output'];
};

/** Page information for cursor-based pagination */
export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

/** Pagination input for cursor-based pagination */
export type PaginationInput = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

/** Sorting options for posts */
export enum PostSortOption {
  MostDiscussed = 'MOST_DISCUSSED',
  MostLiked = 'MOST_LIKED',
  Newest = 'NEWEST',
  Trending = 'TRENDING'
}

/** Post publication status */
export enum PostStatus {
  Archived = 'ARCHIVED',
  Draft = 'DRAFT',
  Moderated = 'MODERATED',
  Published = 'PUBLISHED'
}

/** Post type categorization */
export enum PostType {
  Article = 'ARTICLE',
  CaseStudy = 'CASE_STUDY',
  Discussion = 'DISCUSSION',
  Question = 'QUESTION'
}

export type PredictionAccuracyMetrics = {
  __typename?: 'PredictionAccuracyMetrics';
  churnPrediction: Scalars['Float']['output'];
  ltvPrediction: Scalars['Float']['output'];
  replenishmentPrediction: Scalars['Float']['output'];
};

export type PredictionFactor = {
  __typename?: 'PredictionFactor';
  factor: Scalars['String']['output'];
  weight: Scalars['Float']['output'];
};

/** Predictive insight */
export type PredictiveInsight = {
  __typename?: 'PredictiveInsight';
  confidence: Scalars['Float']['output'];
  factors: Array<PredictionFactor>;
  impact: SignificanceLevel;
  prediction: Scalars['String']['output'];
  recommendation: Scalars['String']['output'];
  timeframe: Scalars['String']['output'];
};

/** Price Points (4 tiers) */
export enum PricePoint {
  Budget = 'BUDGET',
  Luxury = 'LUXURY',
  MidRange = 'MID_RANGE',
  Premium = 'PREMIUM'
}

export type PriceRangeInput = {
  max?: InputMaybe<Scalars['Float']['input']>;
  min?: InputMaybe<Scalars['Float']['input']>;
};

/** Price tier enumeration */
export enum PriceTier {
  /** Budget-friendly ($0-$20) */
  Budget = 'BUDGET',
  /** Luxury ($100+) */
  Luxury = 'LUXURY',
  /** Moderate ($$20-$50) */
  Moderate = 'MODERATE',
  /** Premium ($50-$100) */
  Premium = 'PREMIUM'
}

/** Product with progressive disclosure structure */
export type Product = {
  __typename?: 'Product';
  createdAt: Scalars['DateTime']['output'];
  embeddingGenerated: Scalars['Boolean']['output'];
  /** Glance level - Quick overview */
  glance: ProductGlance;
  id: Scalars['ID']['output'];
  /** Scan level - Detailed information */
  scan: ProductScan;
  /** Study level - Professional/clinical data */
  study?: Maybe<ProductStudy>;
  /** Complete taxonomy classification for this product */
  taxonomy?: Maybe<ProductTaxonomy>;
  /** Vector data status */
  tensorGenerated: Scalars['Boolean']['output'];
  updatedAt: Scalars['DateTime']['output'];
  vendorOrganization: VendorOrganization;
  vendureProductId: Scalars['ID']['output'];
};

/**
 * Product Category - Hierarchical (3 levels)
 * Level 1: Main (Skincare, Body Care, Supplements)
 * Level 2: Sub (Cleansers, Serums, Moisturizers)
 * Level 3: Micro (Foaming Cleansers, Cream Cleansers)
 */
export type ProductCategory = {
  __typename?: 'ProductCategory';
  children: Array<ProductCategory>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  displayOrder: Scalars['Int']['output'];
  fullPath: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  level: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  parent?: Maybe<ProductCategory>;
  productCount: Scalars['Int']['output'];
  seoSlug: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

/** Product connection for pagination */
export type ProductConnection = {
  __typename?: 'ProductConnection';
  edges: Array<ProductEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ProductEdge = {
  __typename?: 'ProductEdge';
  cursor: Scalars['String']['output'];
  node: Product;
};

/** Product filters */
export type ProductFiltersInput = {
  brand?: InputMaybe<Scalars['String']['input']>;
  category?: InputMaybe<Scalars['String']['input']>;
  inStock?: InputMaybe<Scalars['Boolean']['input']>;
  priceRange?: InputMaybe<PriceRangeInput>;
  skinTypes?: InputMaybe<Array<SkinType>>;
};

/**
 * Product Format - Physical form of product
 * Examples: Cream, Gel, Serum, Oil, Balm, Foam
 */
export type ProductFormat = {
  __typename?: 'ProductFormat';
  category?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  productCount: Scalars['Int']['output'];
};

/**
 * Product Function - Multi-select
 * Examples: Hydrating, Exfoliating, Anti-Aging, Brightening
 */
export type ProductFunction = {
  __typename?: 'ProductFunction';
  categoryCompatibility?: Maybe<Array<Scalars['ID']['output']>>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  displayOrder: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  productCount: Scalars['Int']['output'];
};

/** Glance Level - Quick Product Overview */
export type ProductGlance = {
  __typename?: 'ProductGlance';
  heroBenefit: Scalars['String']['output'];
  price: Money;
  rating?: Maybe<Scalars['Float']['output']>;
  reviewCount?: Maybe<Scalars['Int']['output']>;
  skinTypes: Array<SkinType>;
  thumbnail?: Maybe<Scalars['String']['output']>;
};

export type ProductGlanceInput = {
  heroBenefit: Scalars['String']['input'];
  rating?: InputMaybe<Scalars['Float']['input']>;
  reviewCount?: InputMaybe<Scalars['Int']['input']>;
  skinTypes: Array<SkinType>;
};

/** Product performance metrics */
export type ProductMetrics = {
  __typename?: 'ProductMetrics';
  categoryPerformance: Array<CategoryPerformance>;
  crossSellOpportunities: Array<CrossSellPair>;
  topPerformers: Array<ProductPerformance>;
  totalCatalog: Scalars['Int']['output'];
  underPerformers: Array<ProductPerformance>;
};

export type ProductPerformance = {
  __typename?: 'ProductPerformance';
  addToCartClicks: Scalars['Int']['output'];
  category?: Maybe<Scalars['String']['output']>;
  conversionRate: Scalars['Float']['output'];
  orderCount: Scalars['Int']['output'];
  price?: Maybe<Scalars['Float']['output']>;
  productId: Scalars['ID']['output'];
  productName: Scalars['String']['output'];
  productSku?: Maybe<Scalars['String']['output']>;
  returnRate: Scalars['Float']['output'];
  revenue: Scalars['Float']['output'];
  uniqueSpas: Scalars['Int']['output'];
  unitsSold: Scalars['Int']['output'];
  views: Scalars['Int']['output'];
};

/**
 * Product Region - Geographic origin/style
 * Examples: K-Beauty, J-Beauty, French Pharmacy, USA
 */
export type ProductRegion = {
  __typename?: 'ProductRegion';
  countryCode?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  productCount: Scalars['Int']['output'];
};

/** Product operation result */
export type ProductResult = {
  __typename?: 'ProductResult';
  errors?: Maybe<Array<Error>>;
  product?: Maybe<Product>;
  success: Scalars['Boolean']['output'];
};

/** Scan Level - Detailed Product Information */
export type ProductScan = {
  __typename?: 'ProductScan';
  images: Array<Scalars['String']['output']>;
  ingredients: IngredientList;
  keyActives: Array<ActiveIngredient>;
  usageInstructions: UsageInstructions;
  warnings: Array<Scalars['String']['output']>;
};

export type ProductScanInput = {
  ingredients: IngredientListInput;
  keyActives: Array<ActiveIngredientInput>;
  usageInstructions: UsageInstructionsInput;
  warnings: Array<Scalars['String']['input']>;
};

/** Study Level - Professional/Clinical Data */
export type ProductStudy = {
  __typename?: 'ProductStudy';
  clinicalData?: Maybe<ClinicalData>;
  contraindications: Array<Scalars['String']['output']>;
  detailedSteps: Array<Scalars['String']['output']>;
  expectedResults: Scalars['String']['output'];
  formulationScience?: Maybe<Scalars['String']['output']>;
  professionalNotes?: Maybe<Scalars['String']['output']>;
  timeToResults: Scalars['String']['output'];
};

export type ProductStudyInput = {
  contraindications: Array<Scalars['String']['input']>;
  detailedSteps: Array<Scalars['String']['input']>;
  expectedResults: Scalars['String']['input'];
  formulationScience?: InputMaybe<Scalars['String']['input']>;
  professionalNotes?: InputMaybe<Scalars['String']['input']>;
  timeToResults: Scalars['String']['input'];
};

/** Product Taxonomy - Complete classification for a product */
export type ProductTaxonomy = {
  __typename?: 'ProductTaxonomy';
  category?: Maybe<ProductCategory>;
  createdAt: Scalars['DateTime']['output'];
  formulationBase?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lastReviewedAt?: Maybe<Scalars['DateTime']['output']>;
  primaryFunctions: Array<ProductFunction>;
  productFormat?: Maybe<ProductFormat>;
  productId: Scalars['ID']['output'];
  professionalLevel: ProfessionalLevel;
  protocolRequired: Scalars['Boolean']['output'];
  region?: Maybe<ProductRegion>;
  reviewedBy?: Maybe<Scalars['ID']['output']>;
  skinConcerns: Array<SkinConcern>;
  targetAreas: Array<TargetArea>;
  taxonomyCompletenessScore: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
  usageTime: UsageTime;
};

/** Input for creating/updating product taxonomy */
export type ProductTaxonomyInput = {
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  formulationBase?: InputMaybe<Scalars['String']['input']>;
  primaryFunctionIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  productFormatId?: InputMaybe<Scalars['ID']['input']>;
  productId: Scalars['ID']['input'];
  professionalLevel?: InputMaybe<ProfessionalLevel>;
  protocolRequired?: InputMaybe<Scalars['Boolean']['input']>;
  regionId?: InputMaybe<Scalars['ID']['input']>;
  skinConcernIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  targetAreaIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  usageTime?: InputMaybe<UsageTime>;
};

export type ProductUsage = {
  __typename?: 'ProductUsage';
  notes?: Maybe<Scalars['String']['output']>;
  product: Product;
  productId: Scalars['ID']['output'];
  quantity?: Maybe<Scalars['Int']['output']>;
};

export type ProductUsageInput = {
  notes?: InputMaybe<Scalars['String']['input']>;
  productId: Scalars['ID']['input'];
  quantity?: InputMaybe<Scalars['Int']['input']>;
};

/** Professional Level - Who can use/purchase */
export enum ProfessionalLevel {
  InOfficeOnly = 'IN_OFFICE_ONLY',
  MedicalGrade = 'MEDICAL_GRADE',
  Otc = 'OTC',
  Professional = 'PROFESSIONAL'
}

export type ProfileEngagement = {
  __typename?: 'ProfileEngagement';
  avgTimeOnProfile: Scalars['Int']['output'];
  bounceRate: Scalars['Float']['output'];
  catalogBrowses: Scalars['Int']['output'];
  contactClicks: Scalars['Int']['output'];
  productClicks: Scalars['Int']['output'];
  profileViews: Scalars['Int']['output'];
};

/** Profile Settings - User display and contact preferences */
export type ProfileSettings = {
  __typename?: 'ProfileSettings';
  /** Date format preference */
  dateFormat: DateFormat;
  /** Display name shown in the app */
  displayName?: Maybe<Scalars['String']['output']>;
  /** Preferred language code */
  language: Scalars['String']['output'];
  /** Phone number for SMS notifications */
  phoneNumber?: Maybe<Scalars['String']['output']>;
  /** Whether phone is verified for SMS */
  phoneVerified: Scalars['Boolean']['output'];
  /** Time format preference (12h/24h) */
  timeFormat: TimeFormat;
  /** User's timezone for scheduling */
  timezone: Scalars['String']['output'];
};

export type PurgeAnalysis = {
  __typename?: 'PurgeAnalysis';
  activeCount: Scalars['Int']['output'];
  avgDurationDays: Scalars['Int']['output'];
  completedCount: Scalars['Int']['output'];
  successRate: Scalars['Float']['output'];
};

export type Query = {
  __typename?: 'Query';
  /**
   * Get all vendor applications (Admin only)
   * Requires: Admin authentication
   * Sprint E.2: Admin Tools
   */
  adminVendorApplications: Array<VendorApplication>;
  /** Get appointment by ID */
  appointment?: Maybe<Appointment>;
  /** List appointments with filters */
  appointments: AppointmentConnection;
  /**
   * Build a complete skincare routine recommendation
   * Returns products for each step: Cleanse, Treat, Moisturize, Protect
   */
  buildSkincareRoutine: SkincareRoutine;
  /** Get a specific alert by ID */
  businessAlert?: Maybe<BusinessAlert>;
  /** Get active business alerts */
  businessAlerts: Array<BusinessAlert>;
  /** Get AI-generated insights based on current metrics */
  businessInsights: InsightEngine;
  /** Get comprehensive business metrics for a timeframe */
  businessMetrics: BusinessMetrics;
  /**
   * Get campaign performance summary
   * Requires: Vendor authentication
   * Marketing Analytics Integration
   */
  campaignPerformanceSummary: CampaignPerformanceSummary;
  /** Get client by ID */
  client?: Maybe<Client>;
  /** List clients for spa organization */
  clients: ClientConnection;
  /** Get a single event by ID */
  communityEvent?: Maybe<CommunityEvent>;
  /** Get paginated community events */
  communityEvents: CommunityEventConnection;
  /** Get a single post by ID */
  communityPost?: Maybe<CommunityPost>;
  /** Get paginated community posts with optional filters */
  communityPosts: CommunityPostConnection;
  /**
   * Get a single conversation by ID
   * Requires: Vendor authentication
   * Sprint C.1: Messaging System
   */
  conversation?: Maybe<Conversation>;
  /**
   * Get messages for a conversation
   * Requires: Vendor authentication
   * Sprint C.1: Messaging System
   */
  conversationMessages: ConversationMessagesResponse;
  /** Get dashboard summary for quick overview */
  dashboardSummary: DashboardSummary;
  /**
   * Get discovery analytics (how spas find you)
   * Requires: Vendor authentication
   * Sprint A.3: Analytics Schema
   */
  discoveryAnalytics: DiscoveryAnalytics;
  /** Get featured posts */
  featuredPosts: Array<CommunityPost>;
  /**
   * Find products similar to a given product
   * Uses semantic similarity matching
   */
  findSimilarSkincareProducts: Array<SkincareProduct>;
  /** Analyze compatibility between ingredients */
  intelligenceAnalyzeCompatibility: CompatibilityResult;
  /** Get atom with full intelligence data */
  intelligenceAtom: AtomWithIntelligence;
  /** Navigate causal chain from an atom */
  intelligenceCausalChain: Array<CausalChainNode>;
  /** Check if user has access to threshold */
  intelligenceCheckAccess: Scalars['Boolean']['output'];
  /** Get claim evidence for an atom */
  intelligenceClaimEvidence: Array<ClaimEvidence>;
  /** Get efficacy indicators for an atom */
  intelligenceEfficacyIndicators: Array<EfficacyIndicator>;
  /** Get efficacy summary for an atom */
  intelligenceEfficacySummary: EfficacySummary;
  /** Get evidence summary for an atom */
  intelligenceEvidenceSummary: EvidenceSummary;
  /** Find causal path between two atoms */
  intelligenceFindPath: Array<CausalPathStep>;
  /** Find similar atoms by tensor profile */
  intelligenceFindSimilar: Array<IntelligenceSearchResult>;
  /** Get Goldilocks parameters for an atom */
  intelligenceGoldilocksParameters: Array<GoldilocksParameter>;
  /** Get max accessible threshold for access level */
  intelligenceMaxThreshold: KnowledgeThreshold;
  /** Search with intelligence filters */
  intelligenceSearch: IntelligenceSearchResponse;
  /** Get Why It Works explanation */
  intelligenceWhyExplanation?: Maybe<WhyExplanation>;
  /** Get current user */
  me?: Maybe<User>;
  /** Get current user's sanctuary profile */
  mySanctuaryProfile?: Maybe<SanctuaryMember>;
  /** Get current user's settings */
  mySettings?: Maybe<UserSettings>;
  /**
   * Get order counts by status
   * Requires: Vendor authentication
   * Sprint B.4: Order Management
   */
  orderStatusCounts: OrderStatusCounts;
  /** Get product by ID with progressive disclosure */
  product?: Maybe<Product>;
  /**
   * Get all product categories (hierarchical)
   * Returns root categories with subcategories nested
   */
  productCategories: Array<ProductCategory>;
  /** Get single category by ID or slug */
  productCategory?: Maybe<ProductCategory>;
  /** Get single category by slug */
  productCategoryBySlug?: Maybe<ProductCategory>;
  /** Get single product format by ID */
  productFormat?: Maybe<ProductFormat>;
  /** Get all product formats (cream, gel, serum, etc.) */
  productFormats: Array<ProductFormat>;
  /** Get single product function by ID */
  productFunction?: Maybe<ProductFunction>;
  /**
   * Get all product functions
   * For multi-select in product creation
   */
  productFunctions: Array<ProductFunction>;
  /**
   * Get product performance metrics
   * Requires: Vendor authentication
   * Sprint A.3: Analytics Schema
   */
  productPerformance: Array<ProductPerformance>;
  /** Get single product region by ID */
  productRegion?: Maybe<ProductRegion>;
  /** Get all product regions (K-Beauty, J-Beauty, etc.) */
  productRegions: Array<ProductRegion>;
  /** Get all product taxonomies with optional filter */
  productTaxonomies: Array<ProductTaxonomy>;
  /** Get product taxonomy data for a specific product */
  productTaxonomy?: Maybe<ProductTaxonomy>;
  /** List all products with pagination (simple version) */
  products: Array<Product>;
  /** Search products by vendor organization */
  productsByVendor: Array<Product>;
  /** Get personalized product recommendations based on skin profile */
  recommendSkincareProducts: Array<SkincareProduct>;
  /** Get discussions related to a SKA atom */
  relatedDiscussions: Array<CommunityPost>;
  /** Get a specific report by ID */
  report?: Maybe<Report>;
  /** Get generated reports */
  reports: Array<Report>;
  /** Get a sanctuary member by ID */
  sanctuaryMember?: Maybe<SanctuaryMember>;
  /** Get scheduled reports */
  scheduledReports: Array<ScheduledReport>;
  /** Vector search for similar products */
  searchProducts: Array<Product>;
  /** Search products with filters (advanced) */
  searchProductsAdvanced: ProductConnection;
  /** Search products by semantic text query */
  searchProductsByText: Array<Product>;
  /**
   * Semantic search for skincare products
   * Uses AI-powered natural language understanding
   *
   * Example queries:
   * - "gentle gel cleanser for oily skin"
   * - "vitamin C serum for dark spots"
   * - "hydrating night cream for dry skin"
   */
  searchSkincareProducts: Array<SkincareProduct>;
  /** Search products using vector similarity */
  similarProducts: Array<Product>;
  /** Get causal chain (prerequisites and consequences) for an atom */
  skaCausalChain: SkaCausalChain;
  /** Check compatibility between multiple ingredients */
  skaCheckCompatibility: SkaCompatibilityResult;
  /** Get purging information for an ingredient */
  skaGetPurgingInfo: SkaPurgingInfo;
  /** Get knowledge graph statistics */
  skaKnowledgeGraphStats: SkaKnowledgeGraphStats;
  /** Quick compliance check - pass/fail with critical issues only */
  skaQuickComplianceCheck: SkaQuickComplianceResult;
  /** Score marketing copy for FDA/FTC compliance */
  skaScoreCompliance: SkaComplianceScore;
  /** Search skincare atoms with filters */
  skaSearchAtoms: SkaSearchResponse;
  /** Get single skin concern by ID */
  skinConcern?: Maybe<SkinConcern>;
  /**
   * Get all skin concerns
   * For multi-select in product creation
   */
  skinConcerns: Array<SkinConcern>;
  /** Get a skincare atom by ID */
  skincareAtom?: Maybe<SkincareAtom>;
  /** Get a skincare atom by INCI name (ingredients only) */
  skincareAtomByInci?: Maybe<SkincareAtom>;
  /** Get a skincare atom by slug */
  skincareAtomBySlug?: Maybe<SkincareAtom>;
  /** Get all available skincare categories */
  skincareCategories: Array<Scalars['String']['output']>;
  /** Get filter options for skincare search UI */
  skincareFilterOptions: SkincareFilterOptions;
  /** Get a specific pillar by ID */
  skincarePillar?: Maybe<SkincarePillar>;
  /** Get all skincare pillars */
  skincarePillars: Array<SkincarePillar>;
  /** Get a single skincare product by ID */
  skincareProduct?: Maybe<SkincareProduct>;
  /** Get skincare products by category */
  skincareProductsByCategory: Array<SkincareProduct>;
  /** Get spa organization by ID */
  spaOrganization?: Maybe<SpaOrganization>;
  /** List all spa organizations (admin only) */
  spaOrganizations: SpaOrganizationConnection;
  /**
   * Get spa-vendor relationships (customer list)
   * Requires: Vendor authentication
   * Sprint A.3: Analytics Schema
   */
  spaRelationships: Array<SpaVendorRelationship>;
  /** Get AI-suggested SKA topics for content */
  suggestedSkaTopics: Array<SkincareAtom>;
  /** Get single target area by ID */
  targetArea?: Maybe<TargetArea>;
  /** Get all target areas (face, eye, body, etc.) */
  targetAreas: Array<TargetArea>;
  /** Get all taxonomy filter options for UI dropdowns */
  taxonomyFilterOptions: TaxonomyFilterOptions;
  /**
   * Get taxonomy completeness statistics
   * For quality control dashboard
   */
  taxonomyStats: TaxonomyStats;
  /** Get top contributors by reputation */
  topContributors: Array<SanctuaryMember>;
  /** Get trending topics in the community */
  trendingTopics: Array<TrendingTopic>;
  /** Get user by ID (admin only) */
  user?: Maybe<User>;
  /** Get user settings by user ID (admin only) */
  userSettings?: Maybe<UserSettings>;
  /**
   * Get vendor application by ID
   * Requires: Vendor authentication (own application) or Admin
   * Sprint A.2: Application & Onboarding
   */
  vendorApplication?: Maybe<VendorApplication>;
  /**
   * Get a single marketing campaign by ID
   * Requires: Vendor authentication
   * Marketing Analytics Integration
   */
  vendorCampaign?: Maybe<MarketingCampaign>;
  /**
   * Get vendor's marketing campaigns
   * Requires: Vendor authentication
   * Marketing Analytics Integration
   */
  vendorCampaigns: Array<MarketingCampaign>;
  /**
   * Get vendor conversations (messaging)
   * Requires: Vendor authentication
   * Sprint C.1: Messaging System
   */
  vendorConversations: Array<Conversation>;
  /**
   * Get vendor dashboard metrics
   * Requires: Vendor authentication
   * Sprint A.3: Analytics Schema
   */
  vendorDashboard: VendorDashboardMetrics;
  /**
   * Get vendor onboarding progress
   * Requires: Vendor authentication
   * Sprint A.2: Application & Onboarding
   */
  vendorOnboarding?: Maybe<VendorOnboarding>;
  /**
   * Get a single vendor order by ID
   * Requires: Vendor authentication
   * Sprint B.4: Order Management
   */
  vendorOrder?: Maybe<VendorOrder>;
  /**
   * Get vendor orders with filtering and pagination
   * Requires: Vendor authentication
   * Sprint B.4: Order Management
   */
  vendorOrders: VendorOrderConnection;
  /** Get vendor organization by ID */
  vendorOrganization?: Maybe<VendorOrganization>;
  /** List vendor organizations */
  vendorOrganizations: VendorOrganizationConnection;
  /**
   * Get current vendor's profile
   * Requires: Vendor authentication
   * Sprint A.1: Vendor Profile Schema
   */
  vendorProfile?: Maybe<VendorProfile>;
  /**
   * Get unread message count for vendor
   * Requires: Vendor authentication
   * Sprint C.1: Messaging System
   */
  vendorUnreadCount: Scalars['Int']['output'];
};


export type QueryAdminVendorApplicationsArgs = {
  assigneeFilter?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  statusFilter?: InputMaybe<ApplicationStatus>;
};


export type QueryAppointmentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAppointmentsArgs = {
  filters?: InputMaybe<AppointmentFiltersInput>;
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryBuildSkincareRoutineArgs = {
  profile: SkinProfileInput;
};


export type QueryBusinessAlertArgs = {
  id: Scalars['ID']['input'];
};


export type QueryBusinessAlertsArgs = {
  acknowledged?: InputMaybe<Scalars['Boolean']['input']>;
  category?: InputMaybe<AlertCategory>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  severity?: InputMaybe<AlertSeverity>;
};


export type QueryBusinessInsightsArgs = {
  filters?: InputMaybe<MetricsFiltersInput>;
  timeframe?: InputMaybe<MetricsTimeframeInput>;
};


export type QueryBusinessMetricsArgs = {
  filters?: InputMaybe<MetricsFiltersInput>;
  timeframe?: InputMaybe<MetricsTimeframeInput>;
};


export type QueryCampaignPerformanceSummaryArgs = {
  dateRange: DateRangeInput;
};


export type QueryClientArgs = {
  id: Scalars['ID']['input'];
};


export type QueryClientsArgs = {
  pagination?: InputMaybe<PaginationInput>;
  search?: InputMaybe<Scalars['String']['input']>;
  spaOrganizationId: Scalars['ID']['input'];
};


export type QueryCommunityEventArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCommunityEventsArgs = {
  eventType?: InputMaybe<EventType>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  upcoming?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryCommunityPostArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCommunityPostsArgs = {
  category?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  postType?: InputMaybe<PostType>;
  skaAtomId?: InputMaybe<Scalars['ID']['input']>;
  sortBy?: InputMaybe<PostSortOption>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryConversationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryConversationMessagesArgs = {
  conversationId: Scalars['ID']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryDashboardSummaryArgs = {
  organizationId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryDiscoveryAnalyticsArgs = {
  dateRange: DateRangeInput;
};


export type QueryFeaturedPostsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryFindSimilarSkincareProductsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  productId: Scalars['ID']['input'];
};


export type QueryIntelligenceAnalyzeCompatibilityArgs = {
  accessLevel?: InputMaybe<AccessLevel>;
  atomIds: Array<Scalars['ID']['input']>;
};


export type QueryIntelligenceAtomArgs = {
  accessLevel?: InputMaybe<AccessLevel>;
  atomId: Scalars['ID']['input'];
};


export type QueryIntelligenceCausalChainArgs = {
  accessLevel?: InputMaybe<AccessLevel>;
  atomId: Scalars['ID']['input'];
  direction: CausalDirection;
  maxDepth?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryIntelligenceCheckAccessArgs = {
  accessLevel: AccessLevel;
  threshold: KnowledgeThreshold;
};


export type QueryIntelligenceClaimEvidenceArgs = {
  atomId: Scalars['ID']['input'];
  minLevel?: InputMaybe<EvidenceLevel>;
};


export type QueryIntelligenceEfficacyIndicatorsArgs = {
  atomId: Scalars['ID']['input'];
  highQualityOnly?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryIntelligenceEfficacySummaryArgs = {
  atomId: Scalars['ID']['input'];
};


export type QueryIntelligenceEvidenceSummaryArgs = {
  atomId: Scalars['ID']['input'];
};


export type QueryIntelligenceFindPathArgs = {
  accessLevel?: InputMaybe<AccessLevel>;
  fromAtomId: Scalars['ID']['input'];
  toAtomId: Scalars['ID']['input'];
};


export type QueryIntelligenceFindSimilarArgs = {
  atomId: Scalars['ID']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryIntelligenceGoldilocksParametersArgs = {
  atomId: Scalars['ID']['input'];
};


export type QueryIntelligenceMaxThresholdArgs = {
  accessLevel: AccessLevel;
};


export type QueryIntelligenceSearchArgs = {
  filters?: InputMaybe<IntelligenceSearchFilters>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  query: Scalars['String']['input'];
  semanticWeight?: InputMaybe<Scalars['Float']['input']>;
  tensorWeight?: InputMaybe<Scalars['Float']['input']>;
};


export type QueryIntelligenceWhyExplanationArgs = {
  accessLevel?: InputMaybe<AccessLevel>;
  atomId: Scalars['ID']['input'];
  targetAtomId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryProductArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProductCategoriesArgs = {
  includeInactive?: InputMaybe<Scalars['Boolean']['input']>;
  level?: InputMaybe<Scalars['Int']['input']>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryProductCategoryArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};


export type QueryProductCategoryBySlugArgs = {
  slug: Scalars['String']['input'];
};


export type QueryProductFormatArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProductFormatsArgs = {
  category?: InputMaybe<Scalars['String']['input']>;
  includeInactive?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryProductFunctionArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProductFunctionsArgs = {
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  includeInactive?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryProductPerformanceArgs = {
  dateRange: DateRangeInput;
  limit?: InputMaybe<Scalars['Int']['input']>;
  productIds?: InputMaybe<Array<Scalars['ID']['input']>>;
};


export type QueryProductRegionArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProductRegionsArgs = {
  includeInactive?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryProductTaxonomiesArgs = {
  filter?: InputMaybe<TaxonomyFilterInput>;
};


export type QueryProductTaxonomyArgs = {
  productId: Scalars['ID']['input'];
};


export type QueryProductsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryProductsByVendorArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  vendorId: Scalars['ID']['input'];
};


export type QueryRecommendSkincareProductsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  profile: SkinProfileInput;
};


export type QueryRelatedDiscussionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  skaAtomId: Scalars['ID']['input'];
};


export type QueryReportArgs = {
  id: Scalars['ID']['input'];
};


export type QueryReportsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<ReportType>;
};


export type QuerySanctuaryMemberArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySearchProductsArgs = {
  embedding?: InputMaybe<Array<Scalars['Float']['input']>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  tensor?: InputMaybe<Array<Scalars['Float']['input']>>;
  tensorWeight?: InputMaybe<Scalars['Float']['input']>;
};


export type QuerySearchProductsAdvancedArgs = {
  filters?: InputMaybe<ProductFiltersInput>;
  pagination?: InputMaybe<PaginationInput>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySearchProductsByTextArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  query: Scalars['String']['input'];
};


export type QuerySearchSkincareProductsArgs = {
  filters?: InputMaybe<SkincareSearchFilters>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  query: Scalars['String']['input'];
};


export type QuerySimilarProductsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  productId: Scalars['ID']['input'];
};


export type QuerySkaCausalChainArgs = {
  atomId: Scalars['ID']['input'];
  maxDepth?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerySkaCheckCompatibilityArgs = {
  atomIds: Array<Scalars['ID']['input']>;
};


export type QuerySkaGetPurgingInfoArgs = {
  atomId: Scalars['ID']['input'];
};


export type QuerySkaQuickComplianceCheckArgs = {
  copy: Scalars['String']['input'];
};


export type QuerySkaScoreComplianceArgs = {
  copy: Scalars['String']['input'];
  productId?: InputMaybe<Scalars['ID']['input']>;
};


export type QuerySkaSearchAtomsArgs = {
  filters?: InputMaybe<SkaSearchFilters>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySkinConcernArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySkinConcernsArgs = {
  includeInactive?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QuerySkincareAtomArgs = {
  detailLevel?: InputMaybe<DetailLevel>;
  id: Scalars['ID']['input'];
};


export type QuerySkincareAtomByInciArgs = {
  inciName: Scalars['String']['input'];
};


export type QuerySkincareAtomBySlugArgs = {
  detailLevel?: InputMaybe<DetailLevel>;
  slug: Scalars['String']['input'];
};


export type QuerySkincarePillarArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySkincareProductArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySkincareProductsByCategoryArgs = {
  category: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerySpaOrganizationArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySpaOrganizationsArgs = {
  pagination?: InputMaybe<PaginationInput>;
};


export type QuerySpaRelationshipsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<RelationshipStatus>;
};


export type QuerySuggestedSkaTopicsArgs = {
  content: Scalars['String']['input'];
};


export type QueryTargetAreaArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTargetAreasArgs = {
  includeInactive?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryTopContributorsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryTrendingTopicsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserSettingsArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryVendorApplicationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryVendorCampaignArgs = {
  id: Scalars['ID']['input'];
};


export type QueryVendorCampaignsArgs = {
  filter?: InputMaybe<CampaignFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryVendorConversationsArgs = {
  filter?: InputMaybe<ConversationFilterInput>;
};


export type QueryVendorDashboardArgs = {
  dateRange: DateRangeInput;
};


export type QueryVendorOrderArgs = {
  id: Scalars['ID']['input'];
};


export type QueryVendorOrdersArgs = {
  filter?: InputMaybe<OrderFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
  sort?: InputMaybe<OrderSortInput>;
};


export type QueryVendorOrganizationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryVendorOrganizationsArgs = {
  pagination?: InputMaybe<PaginationInput>;
  status?: InputMaybe<ApprovalStatus>;
};

export enum RecommendationCategory {
  Growth = 'GROWTH',
  Optimization = 'OPTIMIZATION',
  Retention = 'RETENTION',
  RiskMitigation = 'RISK_MITIGATION'
}

export type RecommendationMetrics = {
  __typename?: 'RecommendationMetrics';
  acceptanceRate: Scalars['Float']['output'];
  avgConfidenceScore: Scalars['Float']['output'];
  conversionRate: Scalars['Float']['output'];
  totalGenerated: Scalars['Int']['output'];
};

export enum RecommendationPriority {
  High = 'HIGH',
  Low = 'LOW',
  Medium = 'MEDIUM'
}

export enum RecommendationType {
  Certifications = 'CERTIFICATIONS',
  Content = 'CONTENT',
  Products = 'PRODUCTS',
  Profile = 'PROFILE',
  Values = 'VALUES'
}

/** Register input */
export type RegisterInput = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
  role: UserRole;
  spaOrganizationId?: InputMaybe<Scalars['ID']['input']>;
  vendorOrganizationId?: InputMaybe<Scalars['ID']['input']>;
};

export enum RelationshipStatus {
  Active = 'ACTIVE',
  AtRisk = 'AT_RISK',
  Churned = 'CHURNED',
  New = 'NEW'
}

export type ReminderPreference = {
  __typename?: 'ReminderPreference';
  enabled: Scalars['Boolean']['output'];
  hoursBeforeAppointment: Scalars['Int']['output'];
};

export type ReminderPreferenceInput = {
  enabled: Scalars['Boolean']['input'];
  hoursBeforeAppointment: Scalars['Int']['input'];
};

/** Generated report */
export type Report = {
  __typename?: 'Report';
  downloadUrl?: Maybe<Scalars['String']['output']>;
  expiresAt?: Maybe<Scalars['DateTime']['output']>;
  format: ReportFormat;
  generatedAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  insights?: Maybe<InsightEngine>;
  metrics?: Maybe<BusinessMetrics>;
  status: ReportStatus;
  timeframe: Scalars['String']['output'];
  type: ReportType;
};

export enum ReportFormat {
  Excel = 'EXCEL',
  Html = 'HTML',
  Json = 'JSON',
  Pdf = 'PDF'
}

export enum ReportFrequency {
  Daily = 'DAILY',
  Monthly = 'MONTHLY',
  Quarterly = 'QUARTERLY',
  Weekly = 'WEEKLY'
}

export enum ReportStatus {
  Completed = 'COMPLETED',
  Failed = 'FAILED',
  Generating = 'GENERATING',
  Pending = 'PENDING'
}

export enum ReportType {
  Analytical = 'ANALYTICAL',
  Customer = 'CUSTOMER',
  Executive = 'EXECUTIVE',
  Financial = 'FINANCIAL',
  Operational = 'OPERATIONAL',
  Product = 'PRODUCT'
}

/** Reset password input */
export type ResetPasswordInput = {
  newPassword: Scalars['String']['input'];
  token: Scalars['String']['input'];
};

export type RevenueMetrics = {
  __typename?: 'RevenueMetrics';
  fromNewSpas: Scalars['Float']['output'];
  fromRepeatSpas: Scalars['Float']['output'];
  percentChange: Scalars['Float']['output'];
  total: Scalars['Float']['output'];
  trend: TrendIndicator;
};

export type RevenuePeriod = {
  __typename?: 'RevenuePeriod';
  orderCount: Scalars['Int']['output'];
  period: Scalars['String']['output'];
  revenue: Scalars['Float']['output'];
};

export enum RiskLevel {
  Critical = 'CRITICAL',
  High = 'HIGH',
  Low = 'LOW',
  Medium = 'MEDIUM'
}

export type RoutineComplexityBreakdown = {
  __typename?: 'RoutineComplexityBreakdown';
  advanced: Scalars['Int']['output'];
  basic: Scalars['Int']['output'];
  expert: Scalars['Int']['output'];
  minimal: Scalars['Int']['output'];
};

/** Causal chain response */
export type SkaCausalChain = {
  __typename?: 'SKACausalChain';
  atom: SkincareAtom;
  consequences: Array<SkaCausalNode>;
  maxDepth: Scalars['Int']['output'];
  prerequisites: Array<SkaCausalNode>;
};

/** Causal chain node for prerequisite/consequence traversal */
export type SkaCausalNode = {
  __typename?: 'SKACausalNode';
  atom: SkincareAtom;
  depth: Scalars['Int']['output'];
  relationship: SkincareRelationship;
};

/** Compatibility check result */
export type SkaCompatibilityResult = {
  __typename?: 'SKACompatibilityResult';
  compatible: Scalars['Boolean']['output'];
  conflicts: Array<SkincareRelationship>;
  recommendations: Array<Scalars['String']['output']>;
  score: Scalars['Float']['output'];
  synergies: Array<SkincareRelationship>;
  warnings: Array<Scalars['String']['output']>;
};

/** Full compliance score result */
export type SkaComplianceScore = {
  __typename?: 'SKAComplianceScore';
  analyzedAt: Scalars['String']['output'];
  criticalCount: Scalars['Int']['output'];
  infoCount: Scalars['Int']['output'];
  overallScore: Scalars['Int']['output'];
  passed: Scalars['Boolean']['output'];
  processingTimeMs: Scalars['Int']['output'];
  suggestions: Array<SkaComplianceSuggestion>;
  totalClaims: Scalars['Int']['output'];
  warningCount: Scalars['Int']['output'];
  warnings: Array<SkaComplianceWarning>;
};

/** AI-generated suggestion for compliant alternative */
export type SkaComplianceSuggestion = {
  __typename?: 'SKAComplianceSuggestion';
  explanation: Scalars['String']['output'];
  originalClaim: Scalars['String']['output'];
  regulationReference?: Maybe<Scalars['String']['output']>;
  suggestedReplacement: Scalars['String']['output'];
};

/** Single compliance warning for a flagged claim */
export type SkaComplianceWarning = {
  __typename?: 'SKAComplianceWarning';
  claim: Scalars['String']['output'];
  claimType: Scalars['String']['output'];
  confidence: Scalars['Float']['output'];
  issue: Scalars['String']['output'];
  matchedAtomId?: Maybe<Scalars['ID']['output']>;
  matchedAtomTitle?: Maybe<Scalars['String']['output']>;
  regulation: Scalars['String']['output'];
  severity: ComplianceSeverity;
  suggestion: Scalars['String']['output'];
};

/** Search highlight showing where matches occurred */
export type SkaHighlight = {
  __typename?: 'SKAHighlight';
  field: Scalars['String']['output'];
  matches: Array<Scalars['String']['output']>;
};

/** Knowledge graph statistics */
export type SkaKnowledgeGraphStats = {
  __typename?: 'SKAKnowledgeGraphStats';
  atomsByPillar: Scalars['JSON']['output'];
  atomsByType: Scalars['JSON']['output'];
  recentlyAdded: Array<SkincareAtom>;
  topIngredients: Array<SkincareAtom>;
  totalAtoms: Scalars['Int']['output'];
  totalPillars: Scalars['Int']['output'];
  totalRelationships: Scalars['Int']['output'];
};

/** Purging information response */
export type SkaPurgingInfo = {
  __typename?: 'SKAPurgingInfo';
  causesPurging: Scalars['Boolean']['output'];
  description?: Maybe<Scalars['String']['output']>;
  durationWeeks?: Maybe<Scalars['Int']['output']>;
  relatedIngredients: Array<SkincareAtom>;
};

/** Quick compliance check result */
export type SkaQuickComplianceResult = {
  __typename?: 'SKAQuickComplianceResult';
  criticalIssues: Array<Scalars['String']['output']>;
  passed: Scalars['Boolean']['output'];
};

/** Search filters for SKA queries */
export type SkaSearchFilters = {
  atomTypes?: InputMaybe<Array<SkincareAtomType>>;
  causesPurging?: InputMaybe<Scalars['Boolean']['input']>;
  containsIngredients?: InputMaybe<Array<Scalars['String']['input']>>;
  crueltyFree?: InputMaybe<Scalars['Boolean']['input']>;
  euCompliant?: InputMaybe<Scalars['Boolean']['input']>;
  excludesIngredients?: InputMaybe<Array<Scalars['String']['input']>>;
  fdaApproved?: InputMaybe<Scalars['Boolean']['input']>;
  marketSegments?: InputMaybe<Array<MarketSegment>>;
  minEfficacyScore?: InputMaybe<Scalars['Float']['input']>;
  minInnovationScore?: InputMaybe<Scalars['Float']['input']>;
  pillars?: InputMaybe<Array<Scalars['Int']['input']>>;
  pricePoints?: InputMaybe<Array<PricePoint>>;
  yearRange?: InputMaybe<Array<Scalars['Int']['input']>>;
};

/** Paginated search response */
export type SkaSearchResponse = {
  __typename?: 'SKASearchResponse';
  executionTimeMs?: Maybe<Scalars['Int']['output']>;
  hasMore: Scalars['Boolean']['output'];
  query?: Maybe<Scalars['String']['output']>;
  results: Array<SkaSearchResult>;
  totalCount: Scalars['Int']['output'];
};

/** Search result with relevance score */
export type SkaSearchResult = {
  __typename?: 'SKASearchResult';
  atom: SkincareAtom;
  highlights?: Maybe<Array<SkaHighlight>>;
  relevanceScore?: Maybe<Scalars['Float']['output']>;
};

/** 17-D Tensor profile for ingredient matching */
export type SkaTensorProfileInput = {
  antiAgingPotency?: InputMaybe<Scalars['Float']['input']>;
  antiInflammatory?: InputMaybe<Scalars['Float']['input']>;
  antioxidantCapacity?: InputMaybe<Scalars['Float']['input']>;
  barrierRepair?: InputMaybe<Scalars['Float']['input']>;
  brighteningEfficacy?: InputMaybe<Scalars['Float']['input']>;
  clinicalEvidenceLevel?: InputMaybe<Scalars['Float']['input']>;
  collagenStimulation?: InputMaybe<Scalars['Float']['input']>;
  compatibilityScore?: InputMaybe<Scalars['Float']['input']>;
  exfoliationStrength?: InputMaybe<Scalars['Float']['input']>;
  hydrationIndex?: InputMaybe<Scalars['Float']['input']>;
  marketSaturation?: InputMaybe<Scalars['Float']['input']>;
  molecularPenetration?: InputMaybe<Scalars['Float']['input']>;
  phDependency?: InputMaybe<Scalars['Float']['input']>;
  photosensitivity?: InputMaybe<Scalars['Float']['input']>;
  sebumRegulation?: InputMaybe<Scalars['Float']['input']>;
  sensitivityRisk?: InputMaybe<Scalars['Float']['input']>;
  stabilityRating?: InputMaybe<Scalars['Float']['input']>;
};

/** Community member profile for Spa-ce Sanctuary */
export type SanctuaryMember = {
  __typename?: 'SanctuaryMember';
  bio?: Maybe<Scalars['String']['output']>;
  certifications: Array<Scalars['String']['output']>;
  commentCount: Scalars['Int']['output'];
  displayName: Scalars['String']['output'];
  expertiseAreas: Array<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isVerified: Scalars['Boolean']['output'];
  joinedAt: Scalars['DateTime']['output'];
  lastActiveAt?: Maybe<Scalars['DateTime']['output']>;
  postCount: Scalars['Int']['output'];
  profileImageUrl?: Maybe<Scalars['String']['output']>;
  reputationScore: Scalars['Int']['output'];
  yearsExperience?: Maybe<Scalars['Int']['output']>;
};

export type ScheduleReportInput = {
  filters?: InputMaybe<MetricsFiltersInput>;
  format: ReportFormat;
  frequency: ReportFrequency;
  name: Scalars['String']['input'];
  recipients: Array<Scalars['String']['input']>;
  type: ReportType;
};

/** Scheduled report configuration */
export type ScheduledReport = {
  __typename?: 'ScheduledReport';
  createdAt: Scalars['DateTime']['output'];
  format: ReportFormat;
  frequency: ReportFrequency;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  lastRunAt?: Maybe<Scalars['DateTime']['output']>;
  name: Scalars['String']['output'];
  nextRunAt?: Maybe<Scalars['DateTime']['output']>;
  recipients: Array<Scalars['String']['output']>;
  type: ReportType;
};

export type ScoreDistribution = {
  __typename?: 'ScoreDistribution';
  excellent: Scalars['Int']['output'];
  fair: Scalars['Int']['output'];
  good: Scalars['Int']['output'];
  poor: Scalars['Int']['output'];
};

export type SearchQueryInsight = {
  __typename?: 'SearchQueryInsight';
  query: Scalars['String']['output'];
  topCompetitor?: Maybe<Scalars['String']['output']>;
  volume: Scalars['Int']['output'];
  yourPosition?: Maybe<Scalars['Int']['output']>;
};

export type SendMessageInput = {
  attachments?: InputMaybe<Array<MessageAttachmentInput>>;
  content: Scalars['String']['input'];
  conversationId: Scalars['ID']['input'];
};

/** Service Provider */
export type ServiceProvider = {
  __typename?: 'ServiceProvider';
  appointments: Array<Appointment>;
  availabilityWindows: Scalars['JSON']['output'];
  avatarUrl?: Maybe<Scalars['String']['output']>;
  bio?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  licenseInfo: LicenseInfo;
  location?: Maybe<Location>;
  spaOrganization: SpaOrganization;
  specialties: Array<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  user: User;
  userId: Scalars['ID']['output'];
};

export enum SignificanceLevel {
  High = 'HIGH',
  Low = 'LOW',
  Medium = 'MEDIUM'
}

/**
 * Skin Concern - What skin issues the product addresses
 * Examples: Acne, Aging, Hyperpigmentation, Dryness
 */
export type SkinConcern = {
  __typename?: 'SkinConcern';
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  displayOrder: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  productCount: Scalars['Int']['output'];
  relatedIngredients?: Maybe<Array<Scalars['String']['output']>>;
  severityLevels?: Maybe<Array<ConcernSeverity>>;
};

export type SkinProfile = {
  __typename?: 'SkinProfile';
  concerns: Array<Scalars['String']['output']>;
  currentRoutine?: Maybe<Scalars['String']['output']>;
  goals: Array<Scalars['String']['output']>;
  sensitivities: Array<Scalars['String']['output']>;
  skinType: Scalars['String']['output'];
};

/** User's skin profile for personalized recommendations */
export type SkinProfileInput = {
  /** Budget preference ($, $$, $$$, $$$$) */
  budgetTier?: InputMaybe<Scalars['String']['input']>;
  /** Skin concerns to address */
  concerns: Array<Scalars['String']['input']>;
  currentRoutine?: InputMaybe<Scalars['String']['input']>;
  goals: Array<Scalars['String']['input']>;
  /** Prefer fragrance-free products */
  preferFragranceFree?: InputMaybe<Scalars['Boolean']['input']>;
  /** Prefer vegan products */
  preferVegan?: InputMaybe<Scalars['Boolean']['input']>;
  /** Known sensitivities or allergies */
  sensitivities: Array<Scalars['String']['input']>;
  /** Primary skin type (Normal, Dry, Oily, Combination, Sensitive, Mature) */
  skinType: Scalars['String']['input'];
};

export enum SkinType {
  Combination = 'COMBINATION',
  Dry = 'DRY',
  Normal = 'NORMAL',
  Oily = 'OILY',
  Sensitive = 'SENSITIVE'
}

/** Skincare-specific analytics */
export type SkincareAnalytics = {
  __typename?: 'SkincareAnalytics';
  consultationEffectiveness: ConsultationMetrics;
  popularIngredients: Array<IngredientAnalysis>;
  purgePhaseAnalysis: PurgeAnalysis;
  routineComplexity: RoutineComplexityBreakdown;
  topConcerns: Array<ConcernAnalysis>;
};

/** Skincare Knowledge Atom - core knowledge unit */
export type SkincareAtom = {
  __typename?: 'SkincareAtom';
  annualRevenue?: Maybe<Scalars['Float']['output']>;
  atomType: SkincareAtomType;
  bannerImageUrl?: Maybe<Scalars['String']['output']>;
  casNumber?: Maybe<Scalars['String']['output']>;
  /** Summary of causal relationships */
  causalSummary?: Maybe<Scalars['String']['output']>;
  causesPurging?: Maybe<Scalars['Boolean']['output']>;
  /** Claim evidence for this atom */
  claimEvidences: Array<ClaimEvidence>;
  cleanBeauty?: Maybe<Scalars['Boolean']['output']>;
  createdAt: Scalars['String']['output'];
  crueltyFree?: Maybe<Scalars['Boolean']['output']>;
  /** Efficacy indicators for this atom */
  efficacyIndicators: Array<EfficacyIndicator>;
  efficacyScore?: Maybe<Scalars['Float']['output']>;
  /** Efficacy summary */
  efficacySummary?: Maybe<EfficacySummary>;
  euCompliant?: Maybe<Scalars['Boolean']['output']>;
  /** Evidence summary */
  evidenceSummary?: Maybe<EvidenceSummary>;
  fdaApproved?: Maybe<Scalars['Boolean']['output']>;
  featured?: Maybe<Scalars['Boolean']['output']>;
  featuredOrder?: Maybe<Scalars['Int']['output']>;
  glanceText: Scalars['String']['output'];
  goldilocksParameters: Array<GoldilocksParameter>;
  growthRate?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  imageUrls?: Maybe<Array<Scalars['String']['output']>>;
  inciName?: Maybe<Scalars['String']['output']>;
  infographicUrl?: Maybe<Scalars['String']['output']>;
  innovationScore?: Maybe<Scalars['Float']['output']>;
  keyIngredients?: Maybe<Array<Scalars['String']['output']>>;
  /** Knowledge threshold level */
  knowledgeThreshold?: Maybe<KnowledgeThreshold>;
  logoUrl?: Maybe<Scalars['String']['output']>;
  marketCap?: Maybe<Scalars['Float']['output']>;
  marketSegment?: Maybe<MarketSegment>;
  marketShare?: Maybe<Scalars['Float']['output']>;
  maxConcentration?: Maybe<Scalars['Float']['output']>;
  metadata?: Maybe<Scalars['JSON']['output']>;
  molecularFormula?: Maybe<Scalars['String']['output']>;
  molecularWeight?: Maybe<Scalars['Float']['output']>;
  parentCompany?: Maybe<SkincareAtom>;
  parentCompanyId?: Maybe<Scalars['ID']['output']>;
  patentYear?: Maybe<Scalars['Int']['output']>;
  phRangeMax?: Maybe<Scalars['Float']['output']>;
  phRangeMin?: Maybe<Scalars['Float']['output']>;
  pillar?: Maybe<SkincarePillar>;
  pillarId: Scalars['ID']['output'];
  pricePoint?: Maybe<PricePoint>;
  productImageUrl?: Maybe<Scalars['String']['output']>;
  purgingDescription?: Maybe<Scalars['String']['output']>;
  purgingDurationWeeks?: Maybe<Scalars['Int']['output']>;
  regulationYear?: Maybe<Scalars['Int']['output']>;
  relationships: Array<SkincareRelationship>;
  scanText: Scalars['String']['output'];
  slug: Scalars['String']['output'];
  sources?: Maybe<Scalars['JSON']['output']>;
  studyText: Scalars['String']['output'];
  sustainabilityScore?: Maybe<Scalars['Float']['output']>;
  targetDemographics?: Maybe<Array<Scalars['String']['output']>>;
  tensor?: Maybe<SkincareAtomTensor>;
  title: Scalars['String']['output'];
  trendEmergenceYear?: Maybe<Scalars['Int']['output']>;
  updatedAt: Scalars['String']['output'];
  veganCertified?: Maybe<Scalars['Boolean']['output']>;
  videoUrl?: Maybe<Scalars['String']['output']>;
  viewCount?: Maybe<Scalars['Int']['output']>;
  /** Why this ingredient/concept works */
  whyItWorks?: Maybe<Scalars['String']['output']>;
  yearEstablished?: Maybe<Scalars['Int']['output']>;
  yearIntroduced?: Maybe<Scalars['Int']['output']>;
};

/** 17-D Domain Tensor for skincare matching */
export type SkincareAtomTensor = {
  __typename?: 'SkincareAtomTensor';
  antiAgingPotency: Scalars['Float']['output'];
  antiInflammatory: Scalars['Float']['output'];
  antioxidantCapacity: Scalars['Float']['output'];
  atomId: Scalars['ID']['output'];
  barrierRepair: Scalars['Float']['output'];
  brighteningEfficacy: Scalars['Float']['output'];
  clinicalEvidenceLevel: Scalars['Float']['output'];
  collagenStimulation: Scalars['Float']['output'];
  compatibilityScore: Scalars['Float']['output'];
  createdAt: Scalars['String']['output'];
  exfoliationStrength: Scalars['Float']['output'];
  hydrationIndex: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  marketSaturation: Scalars['Float']['output'];
  molecularPenetration: Scalars['Float']['output'];
  phDependency: Scalars['Float']['output'];
  photosensitivity: Scalars['Float']['output'];
  sebumRegulation: Scalars['Float']['output'];
  sensitivityRisk: Scalars['Float']['output'];
  stabilityRating: Scalars['Float']['output'];
  tensorVector?: Maybe<Array<Scalars['Float']['output']>>;
  updatedAt: Scalars['String']['output'];
};

/** 8 Atom Types for Skincare Industry Knowledge */
export enum SkincareAtomType {
  Brand = 'BRAND',
  Company = 'COMPANY',
  Ingredient = 'INGREDIENT',
  MarketData = 'MARKET_DATA',
  Product = 'PRODUCT',
  Regulation = 'REGULATION',
  ScientificConcept = 'SCIENTIFIC_CONCEPT',
  Trend = 'TREND'
}

/** Available filter options for skincare search UI */
export type SkincareFilterOptions = {
  __typename?: 'SkincareFilterOptions';
  /** Available categories */
  categories: Array<Scalars['String']['output']>;
  /** Available skin concerns */
  concerns: Array<Scalars['String']['output']>;
  /** Available price tiers */
  priceTiers: Array<PriceTier>;
  /** Available routine steps */
  routineSteps: Array<Scalars['String']['output']>;
  /** Available skin types */
  skinTypes: Array<Scalars['String']['output']>;
  /** Available subcategories */
  subcategories: Array<Scalars['String']['output']>;
  /** Available textures */
  textures: Array<Scalars['String']['output']>;
};

/** 7 Categorical Pillars organizing skincare knowledge */
export type SkincarePillar = {
  __typename?: 'SkincarePillar';
  atomCount: Scalars['Int']['output'];
  atoms: Array<SkincareAtom>;
  createdAt: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  displayOrder: Scalars['Int']['output'];
  hexColor?: Maybe<Scalars['String']['output']>;
  iconUrl?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  number: Scalars['Int']['output'];
  slug: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};


/** 7 Categorical Pillars organizing skincare knowledge */
export type SkincarePillarAtomsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};

/** Skincare product with full metadata */
export type SkincareProduct = {
  __typename?: 'SkincareProduct';
  /** Functional benefits */
  benefits: Array<Scalars['String']['output']>;
  /** Brand name */
  brand: Scalars['String']['output'];
  /** Main category (Cleansers, Treatments, etc.) */
  category: Scalars['String']['output'];
  /** Skin concerns this product targets */
  concerns: Array<Scalars['String']['output']>;
  /** Is cruelty-free */
  crueltyFree: Scalars['Boolean']['output'];
  /** Is fragrance-free */
  fragranceFree: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  /** Active ingredients */
  ingredients: Array<Scalars['String']['output']>;
  /** Key product benefits (marketing highlights) */
  keyBenefits: Array<Scalars['String']['output']>;
  /** Price tier ($, $$, $$$, $$$$) */
  priceTier: PriceTier;
  /** Product name */
  productName: Scalars['String']['output'];
  /** Routine step (Cleanse, Treat, Moisturize, Protect) */
  routineStep: Scalars['String']['output'];
  /** Relevance score (0-1, higher is more relevant) */
  score: Scalars['Float']['output'];
  /** Skin types this product is suitable for */
  skinTypes: Array<Scalars['String']['output']>;
  /** Subcategory (Gel Cleanser, Vitamin C Serum, etc.) */
  subcategory: Scalars['String']['output'];
  /** Product texture (Gel, Cream, Serum, etc.) */
  texture: Scalars['String']['output'];
  /** Is vegan */
  vegan: Scalars['Boolean']['output'];
  /** Product volume/size */
  volume: Scalars['String']['output'];
};

/** Semantic/causal relationship between atoms */
export type SkincareRelationship = {
  __typename?: 'SkincareRelationship';
  createdAt: Scalars['String']['output'];
  establishedYear?: Maybe<Scalars['Int']['output']>;
  evidenceDescription?: Maybe<Scalars['String']['output']>;
  fromAtom?: Maybe<SkincareAtom>;
  fromAtomId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  metadata?: Maybe<Scalars['JSON']['output']>;
  relationshipType: SkincareRelationshipType;
  sourceType?: Maybe<SourceType>;
  sourceUrl?: Maybe<Scalars['String']['output']>;
  strength?: Maybe<Scalars['Float']['output']>;
  toAtom?: Maybe<SkincareAtom>;
  toAtomId: Scalars['ID']['output'];
};

/** Relationship Types (16 semantic relationships) */
export enum SkincareRelationshipType {
  Acquires = 'ACQUIRES',
  Approves = 'APPROVES',
  CompetesWith = 'COMPETES_WITH',
  ConflictsWith = 'CONFLICTS_WITH',
  ConsequenceOf = 'CONSEQUENCE_OF',
  Disrupts = 'DISRUPTS',
  Enables = 'ENABLES',
  FormulatedWith = 'FORMULATED_WITH',
  Influences = 'INFLUENCES',
  Inhibits = 'INHIBITS',
  OwnedBy = 'OWNED_BY',
  PrerequisiteOf = 'PREREQUISITE_OF',
  Regulates = 'REGULATES',
  Replaces = 'REPLACES',
  Restricts = 'RESTRICTS',
  SynergizesWith = 'SYNERGIZES_WITH'
}

/** Skincare routine with products for each step */
export type SkincareRoutine = {
  __typename?: 'SkincareRoutine';
  /** Routine steps with recommended products */
  steps: Array<SkincareRoutineStep>;
};

/** Single step in a skincare routine */
export type SkincareRoutineStep = {
  __typename?: 'SkincareRoutineStep';
  /** Recommended products for this step */
  products: Array<SkincareProduct>;
  /** Step name (Cleanse, Treat, Moisturize, Protect) */
  step: Scalars['String']['output'];
};

/** Filters for skincare product search */
export type SkincareSearchFilters = {
  /** Filter by category */
  category?: InputMaybe<Scalars['String']['input']>;
  /** Filter by targeted concerns */
  concerns?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Filter for cruelty-free products only */
  crueltyFree?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter for fragrance-free products only */
  fragranceFree?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by price tier */
  priceTier?: InputMaybe<PriceTier>;
  /** Filter by routine step */
  routineStep?: InputMaybe<Scalars['String']['input']>;
  /** Filter by compatible skin types */
  skinTypes?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Filter by subcategory */
  subcategory?: InputMaybe<Scalars['String']['input']>;
  /** Filter by texture */
  texture?: InputMaybe<Scalars['String']['input']>;
  /** Filter for vegan products only */
  vegan?: InputMaybe<Scalars['Boolean']['input']>;
};

export type SocialLinks = {
  __typename?: 'SocialLinks';
  facebook?: Maybe<Scalars['String']['output']>;
  instagram?: Maybe<Scalars['String']['output']>;
  linkedin?: Maybe<Scalars['String']['output']>;
  tiktok?: Maybe<Scalars['String']['output']>;
};

export type SocialLinksInput = {
  facebook?: InputMaybe<Scalars['String']['input']>;
  instagram?: InputMaybe<Scalars['String']['input']>;
  linkedin?: InputMaybe<Scalars['String']['input']>;
  tiktok?: InputMaybe<Scalars['String']['input']>;
};

/** Common sorting options */
export enum SortOrder {
  Asc = 'ASC',
  Desc = 'DESC'
}

/** Source Types (6 evidence types) */
export enum SourceType {
  CompanyFiling = 'COMPANY_FILING',
  IndustryReport = 'INDUSTRY_REPORT',
  MarketResearch = 'MARKET_RESEARCH',
  Patent = 'PATENT',
  PeerReviewed = 'PEER_REVIEWED',
  RegulatoryDocument = 'REGULATORY_DOCUMENT'
}

export type SpaContact = {
  __typename?: 'SpaContact';
  email: Scalars['String']['output'];
  name: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
};

export type SpaMetrics = {
  __typename?: 'SpaMetrics';
  active: Scalars['Int']['output'];
  new: Scalars['Int']['output'];
  percentChange: Scalars['Float']['output'];
  reorderRate: Scalars['Float']['output'];
  repeat: Scalars['Int']['output'];
  trend: TrendIndicator;
};

/** Spa Organization */
export type SpaOrganization = {
  __typename?: 'SpaOrganization';
  address: Address;
  contactEmail: Scalars['String']['output'];
  contactPhone?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  displayName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  locations: Array<Location>;
  logoUrl?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  subscriptionStatus: SubscriptionStatus;
  subscriptionTier: SubscriptionTier;
  updatedAt: Scalars['DateTime']['output'];
};

/** Pagination connections */
export type SpaOrganizationConnection = {
  __typename?: 'SpaOrganizationConnection';
  edges: Array<SpaOrganizationEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type SpaOrganizationEdge = {
  __typename?: 'SpaOrganizationEdge';
  cursor: Scalars['String']['output'];
  node: SpaOrganization;
};

/** Result types */
export type SpaOrganizationResult = {
  __typename?: 'SpaOrganizationResult';
  errors?: Maybe<Array<Error>>;
  spaOrganization?: Maybe<SpaOrganization>;
  success: Scalars['Boolean']['output'];
};

export type SpaVendorRelationship = {
  __typename?: 'SpaVendorRelationship';
  avgDaysBetweenOrders?: Maybe<Scalars['Int']['output']>;
  avgOrderValue: Scalars['Float']['output'];
  createdAt: Scalars['DateTime']['output'];
  daysSinceLastOrder?: Maybe<Scalars['Int']['output']>;
  favoriteCategories?: Maybe<Array<Scalars['String']['output']>>;
  firstOrderAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  lastMessageAt?: Maybe<Scalars['DateTime']['output']>;
  lastOrderAt?: Maybe<Scalars['DateTime']['output']>;
  lifetimeValue: Scalars['Float']['output'];
  messageCount: Scalars['Int']['output'];
  orderCount: Scalars['Int']['output'];
  profileViews: Scalars['Int']['output'];
  spaId: Scalars['ID']['output'];
  spaName?: Maybe<Scalars['String']['output']>;
  status: RelationshipStatus;
  topProducts?: Maybe<Array<Scalars['ID']['output']>>;
  updatedAt: Scalars['DateTime']['output'];
  vendorId: Scalars['ID']['output'];
};

export type StatusChange = {
  __typename?: 'StatusChange';
  changedAt: Scalars['DateTime']['output'];
  changedBy: Scalars['String']['output'];
  note?: Maybe<Scalars['String']['output']>;
  status: OrderStatus;
};

export type SubmitVendorApplicationInput = {
  annualRevenue?: InputMaybe<Scalars['String']['input']>;
  brandName: Scalars['String']['input'];
  businessLicenseUrl?: InputMaybe<Scalars['String']['input']>;
  certifications?: InputMaybe<Array<CertificationType>>;
  contactEmail: Scalars['String']['input'];
  contactFirstName: Scalars['String']['input'];
  contactLastName: Scalars['String']['input'];
  contactPhone?: InputMaybe<Scalars['String']['input']>;
  contactRole: Scalars['String']['input'];
  currentDistribution?: InputMaybe<Array<Scalars['String']['input']>>;
  employeeCount: Scalars['String']['input'];
  headquarters: Scalars['String']['input'];
  insuranceCertificateUrl?: InputMaybe<Scalars['String']['input']>;
  legalName: Scalars['String']['input'];
  lineSheetUrl?: InputMaybe<Scalars['String']['input']>;
  priceRange: Scalars['String']['input'];
  productCatalogUrl?: InputMaybe<Scalars['String']['input']>;
  productCategories: Array<Scalars['String']['input']>;
  skuCount: Scalars['String']['input'];
  targetMarket: Array<Scalars['String']['input']>;
  values: Array<VendorValue>;
  website: Scalars['String']['input'];
  whyJade: Scalars['String']['input'];
  yearFounded: Scalars['Int']['input'];
};

export enum SubscriptionStatus {
  Active = 'ACTIVE',
  Cancelled = 'CANCELLED',
  PastDue = 'PAST_DUE',
  Trial = 'TRIAL'
}

export enum SubscriptionTier {
  Basic = 'BASIC',
  Enterprise = 'ENTERPRISE',
  Professional = 'PROFESSIONAL'
}

/** Success response */
export type SuccessResponse = {
  __typename?: 'SuccessResponse';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

/** Synergy Type classification */
export enum SynergyType {
  Complementary = 'COMPLEMENTARY',
  Enhancement = 'ENHANCEMENT',
  Penetration = 'PENETRATION',
  Protection = 'PROTECTION',
  Stabilization = 'STABILIZATION'
}

/**
 * Target Area - Body area for application
 * Examples: Face, Eye Area, Lips, Neck, Body
 */
export type TargetArea = {
  __typename?: 'TargetArea';
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  productCount: Scalars['Int']['output'];
};

/** Filter input for taxonomy queries */
export type TaxonomyFilterInput = {
  categoryIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  concernIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  functionIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  maxCompletenessScore?: InputMaybe<Scalars['Int']['input']>;
  minCompletenessScore?: InputMaybe<Scalars['Int']['input']>;
  professionalLevels?: InputMaybe<Array<ProfessionalLevel>>;
  protocolRequired?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Taxonomy filter options for UI dropdowns */
export type TaxonomyFilterOptions = {
  __typename?: 'TaxonomyFilterOptions';
  categories: Array<ProductCategory>;
  concerns: Array<SkinConcern>;
  formats: Array<ProductFormat>;
  functions: Array<ProductFunction>;
  professionalLevels: Array<ProfessionalLevel>;
  regions: Array<ProductRegion>;
  targetAreas: Array<TargetArea>;
  usageTimes: Array<UsageTime>;
};

/**
 * Taxonomy completeness statistics
 * For quality control dashboard
 */
export type TaxonomyStats = {
  __typename?: 'TaxonomyStats';
  averageCompletenessScore: Scalars['Float']['output'];
  categoryCoverage: Array<CategoryCoverage>;
  missingCategories: Scalars['Int']['output'];
  missingFormats: Scalars['Int']['output'];
  missingFunctions: Scalars['Int']['output'];
  needsReview: Scalars['Int']['output'];
  productsWithTaxonomy: Scalars['Int']['output'];
  productsWithoutTaxonomy: Scalars['Int']['output'];
  scoreDistribution: ScoreDistribution;
  totalProducts: Scalars['Int']['output'];
};

export enum TeamSize {
  ElevenToFifty = 'ELEVEN_TO_FIFTY',
  FiftyOneToTwoHundred = 'FIFTY_ONE_TO_TWO_HUNDRED',
  Solo = 'SOLO',
  TwoHundredPlus = 'TWO_HUNDRED_PLUS',
  TwoToTen = 'TWO_TO_TEN'
}

export type TestReport = {
  __typename?: 'TestReport';
  reportUrl: Scalars['String']['output'];
  testType: Scalars['String']['output'];
  testedAt: Scalars['DateTime']['output'];
};

/** Theme preference options */
export enum ThemePreference {
  Dark = 'DARK',
  Light = 'LIGHT',
  System = 'SYSTEM'
}

/** Time format options */
export enum TimeFormat {
  TwelveHour = 'TWELVE_HOUR',
  TwentyFourHour = 'TWENTY_FOUR_HOUR'
}

export enum TimeOfDay {
  Both = 'BOTH',
  Evening = 'EVENING',
  Morning = 'MORNING'
}

export type TimeSeriesDataPoint = {
  __typename?: 'TimeSeriesDataPoint';
  date: Scalars['String']['output'];
  value: Scalars['Float']['output'];
};

/** Treatment Plan */
export type TreatmentPlan = {
  __typename?: 'TreatmentPlan';
  client: Client;
  completedSessions: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  serviceProvider: ServiceProvider;
  sessions: Scalars['JSON']['output'];
  status: TreatmentPlanStatus;
  title: Scalars['String']['output'];
  totalSessions: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export enum TreatmentPlanStatus {
  Active = 'ACTIVE',
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Paused = 'PAUSED'
}

export enum TrendDirection {
  Decreasing = 'DECREASING',
  Increasing = 'INCREASING',
  Stable = 'STABLE',
  Volatile = 'VOLATILE'
}

export enum TrendIndicator {
  Down = 'DOWN',
  Flat = 'FLAT',
  Up = 'UP'
}

/** Trend analysis insight */
export type TrendInsight = {
  __typename?: 'TrendInsight';
  changePercent: Scalars['Float']['output'];
  context: Scalars['String']['output'];
  description: Scalars['String']['output'];
  metric: Scalars['String']['output'];
  significance: SignificanceLevel;
  timeframe: Scalars['String']['output'];
  trend: TrendDirection;
};

/** Trending topic in the community */
export type TrendingTopic = {
  __typename?: 'TrendingTopic';
  name: Scalars['String']['output'];
  postCount: Scalars['Int']['output'];
  skaAtom?: Maybe<SkincareAtom>;
};

export type UpdateAppPreferencesInput = {
  compactMode?: InputMaybe<Scalars['Boolean']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  defaultView?: InputMaybe<DefaultView>;
  itemsPerPage?: InputMaybe<Scalars['Int']['input']>;
  keyboardShortcuts?: InputMaybe<Scalars['Boolean']['input']>;
  showPricesWithTax?: InputMaybe<Scalars['Boolean']['input']>;
  sidebarCollapsed?: InputMaybe<Scalars['Boolean']['input']>;
  theme?: InputMaybe<ThemePreference>;
};

export type UpdateAppointmentInput = {
  notes?: InputMaybe<Scalars['String']['input']>;
  scheduledEnd?: InputMaybe<Scalars['DateTime']['input']>;
  scheduledStart?: InputMaybe<Scalars['DateTime']['input']>;
  serviceType?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCampaignInput = {
  audienceDetails?: InputMaybe<Scalars['JSON']['input']>;
  audienceSize?: InputMaybe<Scalars['Int']['input']>;
  budgetDollars?: InputMaybe<Scalars['Float']['input']>;
  campaignId: Scalars['ID']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  status?: InputMaybe<CampaignStatus>;
  type?: InputMaybe<CampaignType>;
};

export type UpdateCampaignMetricsInput = {
  campaignId: Scalars['ID']['input'];
  clicks?: InputMaybe<Scalars['Int']['input']>;
  conversions?: InputMaybe<Scalars['Int']['input']>;
  impressions?: InputMaybe<Scalars['Int']['input']>;
  revenueDollars?: InputMaybe<Scalars['Float']['input']>;
  spentDollars?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateClientInput = {
  allergies?: InputMaybe<Array<Scalars['String']['input']>>;
  dateOfBirth?: InputMaybe<Scalars['DateTime']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  preferences?: InputMaybe<ClientPreferencesInput>;
  skinProfile?: InputMaybe<SkinProfileInput>;
};

export type UpdateNotificationSettingsInput = {
  appointmentReminders?: InputMaybe<Scalars['Boolean']['input']>;
  communityActivity?: InputMaybe<Scalars['Boolean']['input']>;
  emailEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  marketingEmails?: InputMaybe<Scalars['Boolean']['input']>;
  orderUpdates?: InputMaybe<Scalars['Boolean']['input']>;
  productAnnouncements?: InputMaybe<Scalars['Boolean']['input']>;
  pushEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  reminderHours?: InputMaybe<Scalars['Int']['input']>;
  smsEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  weeklyDigest?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateOrderStatusInput = {
  note?: InputMaybe<Scalars['String']['input']>;
  orderId: Scalars['ID']['input'];
  status: OrderStatus;
};

/** Input for updating a post */
export type UpdatePostInput = {
  category?: InputMaybe<Scalars['String']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  skaAtomIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  status?: InputMaybe<PostStatus>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateProductInput = {
  glance?: InputMaybe<ProductGlanceInput>;
  scan?: InputMaybe<ProductScanInput>;
  study?: InputMaybe<ProductStudyInput>;
};

/** Update profile input */
export type UpdateProfileInput = {
  avatarUrl?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
};

/** Input types for mutations */
export type UpdateProfileSettingsInput = {
  dateFormat?: InputMaybe<DateFormat>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  language?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  timeFormat?: InputMaybe<TimeFormat>;
  timezone?: InputMaybe<Scalars['String']['input']>;
};

/** Input for updating member profile */
export type UpdateSanctuaryProfileInput = {
  bio?: InputMaybe<Scalars['String']['input']>;
  certifications?: InputMaybe<Array<Scalars['String']['input']>>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  expertiseAreas?: InputMaybe<Array<Scalars['String']['input']>>;
  profileImageUrl?: InputMaybe<Scalars['String']['input']>;
  yearsExperience?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateSpaOrganizationInput = {
  address?: InputMaybe<AddressInput>;
  contactEmail?: InputMaybe<Scalars['String']['input']>;
  contactPhone?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  logoUrl?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserSettingsInput = {
  notifications?: InputMaybe<UpdateNotificationSettingsInput>;
  preferences?: InputMaybe<UpdateAppPreferencesInput>;
  profile?: InputMaybe<UpdateProfileSettingsInput>;
};

export type UpdateVendorOrganizationInput = {
  address?: InputMaybe<AddressInput>;
  businessLicense?: InputMaybe<BusinessLicenseInput>;
  certifications?: InputMaybe<Array<CertificationInput>>;
  contactEmail?: InputMaybe<Scalars['String']['input']>;
  contactPhone?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  fulfillmentSettings?: InputMaybe<FulfillmentSettingsInput>;
  insurance?: InputMaybe<InsuranceInfoInput>;
};

export type UpdateVendorProfileInput = {
  brandColorPrimary?: InputMaybe<Scalars['String']['input']>;
  brandColorSecondary?: InputMaybe<Scalars['String']['input']>;
  brandName?: InputMaybe<Scalars['String']['input']>;
  brandVideoUrl?: InputMaybe<Scalars['String']['input']>;
  foundedYear?: InputMaybe<Scalars['Int']['input']>;
  founderStory?: InputMaybe<Scalars['String']['input']>;
  galleryImages?: InputMaybe<Array<Scalars['String']['input']>>;
  headquarters?: InputMaybe<Scalars['String']['input']>;
  heroImageUrl?: InputMaybe<Scalars['String']['input']>;
  logoUrl?: InputMaybe<Scalars['String']['input']>;
  missionStatement?: InputMaybe<Scalars['String']['input']>;
  socialLinks?: InputMaybe<SocialLinksInput>;
  tagline?: InputMaybe<Scalars['String']['input']>;
  teamSize?: InputMaybe<TeamSize>;
  values?: InputMaybe<Array<VendorValue>>;
  websiteUrl?: InputMaybe<Scalars['String']['input']>;
};

export type UsageInstructions = {
  __typename?: 'UsageInstructions';
  application: Scalars['String']['output'];
  frequency: Scalars['String']['output'];
  patchTestRequired: Scalars['Boolean']['output'];
  timeOfDay: TimeOfDay;
};

export type UsageInstructionsInput = {
  application: Scalars['String']['input'];
  frequency: Scalars['String']['input'];
  patchTestRequired: Scalars['Boolean']['input'];
  timeOfDay: TimeOfDay;
};

/** Usage Time - When to use the product */
export enum UsageTime {
  Anytime = 'ANYTIME',
  Evening = 'EVENING',
  Morning = 'MORNING',
  NightOnly = 'NIGHT_ONLY',
  PostTreatment = 'POST_TREATMENT'
}

/** User type */
export type User = {
  __typename?: 'User';
  avatarUrl?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  emailVerified: Scalars['Boolean']['output'];
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  role: UserRole;
  spaOrganization?: Maybe<SpaOrganization>;
  updatedAt: Scalars['DateTime']['output'];
  vendorOrganization?: Maybe<VendorOrganization>;
};

/** User operation result */
export type UserResult = {
  __typename?: 'UserResult';
  errors?: Maybe<Array<Error>>;
  success: Scalars['Boolean']['output'];
  user?: Maybe<User>;
};

export enum UserRole {
  Admin = 'ADMIN',
  Client = 'CLIENT',
  ServiceProvider = 'SERVICE_PROVIDER',
  SpaManager = 'SPA_MANAGER',
  SpaOwner = 'SPA_OWNER',
  SpaStaff = 'SPA_STAFF',
  Vendor = 'VENDOR',
  VendorOwner = 'VENDOR_OWNER',
  VendorStaff = 'VENDOR_STAFF'
}

/** User Settings - Complete settings object for a user */
export type UserSettings = {
  __typename?: 'UserSettings';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  notifications: NotificationSettings;
  preferences: AppPreferences;
  profile: ProfileSettings;
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['ID']['output'];
};

/** Result type for settings operations */
export type UserSettingsResult = {
  __typename?: 'UserSettingsResult';
  errors?: Maybe<Array<Error>>;
  settings?: Maybe<UserSettings>;
  success: Scalars['Boolean']['output'];
};

export type ValuePerformance = {
  __typename?: 'ValuePerformance';
  clicks: Scalars['Int']['output'];
  conversionRate: Scalars['Float']['output'];
  conversions: Scalars['Int']['output'];
  ctr: Scalars['Float']['output'];
  impressions: Scalars['Int']['output'];
  rank: Scalars['Int']['output'];
  value: Scalars['String']['output'];
};

export type VendorApplication = {
  __typename?: 'VendorApplication';
  annualRevenue?: Maybe<Scalars['String']['output']>;
  approvalConditions?: Maybe<Array<Scalars['String']['output']>>;
  assignedReviewerId?: Maybe<Scalars['String']['output']>;
  assignedReviewerName?: Maybe<Scalars['String']['output']>;
  brandName: Scalars['String']['output'];
  certifications?: Maybe<Array<CertificationType>>;
  contactEmail: Scalars['String']['output'];
  contactFirstName: Scalars['String']['output'];
  contactLastName: Scalars['String']['output'];
  contactPhone?: Maybe<Scalars['String']['output']>;
  contactRole: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  currentDistribution?: Maybe<Array<Scalars['String']['output']>>;
  decidedAt?: Maybe<Scalars['DateTime']['output']>;
  documents?: Maybe<ApplicationDocuments>;
  employeeCount: Scalars['String']['output'];
  headquarters: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  legalName: Scalars['String']['output'];
  onboarding?: Maybe<VendorOnboarding>;
  priceRange: Scalars['String']['output'];
  productCategories: Array<Scalars['String']['output']>;
  rejectionReason?: Maybe<Scalars['String']['output']>;
  riskAssessment?: Maybe<Scalars['JSON']['output']>;
  riskLevel?: Maybe<RiskLevel>;
  skuCount: Scalars['String']['output'];
  slaDeadline?: Maybe<Scalars['DateTime']['output']>;
  status: ApplicationStatus;
  submittedAt: Scalars['DateTime']['output'];
  targetMarket: Array<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  values: Array<VendorValue>;
  website: Scalars['String']['output'];
  whyJade: Scalars['String']['output'];
  yearFounded: Scalars['Int']['output'];
};

export type VendorApplicationResult = {
  __typename?: 'VendorApplicationResult';
  application?: Maybe<VendorApplication>;
  errors?: Maybe<Array<VendorPortalError>>;
  success: Scalars['Boolean']['output'];
};

export type VendorCertification = {
  __typename?: 'VendorCertification';
  certificateNumber?: Maybe<Scalars['String']['output']>;
  documentUrl: Scalars['String']['output'];
  expirationDate?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  issuingBody: Scalars['String']['output'];
  rejectionReason?: Maybe<Scalars['String']['output']>;
  slaDeadline?: Maybe<Scalars['DateTime']['output']>;
  submittedAt: Scalars['DateTime']['output'];
  type: CertificationType;
  verificationStatus: CertificationStatus;
  verifiedAt?: Maybe<Scalars['DateTime']['output']>;
  verifiedBy?: Maybe<Scalars['String']['output']>;
};

export type VendorDashboardMetrics = {
  __typename?: 'VendorDashboardMetrics';
  dateRange: DateRange;
  impressions: ImpressionMetrics;
  orders: OrderMetrics;
  ordersTimeSeries: Array<TimeSeriesDataPoint>;
  revenue: RevenueMetrics;
  revenueTimeSeries: Array<TimeSeriesDataPoint>;
  spas: SpaMetrics;
  topCustomers: Array<SpaVendorRelationship>;
  topProducts: Array<ProductPerformance>;
};

export type VendorOnboarding = {
  __typename?: 'VendorOnboarding';
  applicationId: Scalars['ID']['output'];
  completedAt?: Maybe<Scalars['DateTime']['output']>;
  completedSteps: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  percentComplete: Scalars['Int']['output'];
  requiredStepsRemaining: Scalars['Int']['output'];
  startedAt?: Maybe<Scalars['DateTime']['output']>;
  steps: Array<OnboardingStep>;
  successManagerEmail?: Maybe<Scalars['String']['output']>;
  successManagerName?: Maybe<Scalars['String']['output']>;
  targetCompletionDate?: Maybe<Scalars['DateTime']['output']>;
  totalSteps: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type VendorOrder = {
  __typename?: 'VendorOrder';
  conversationId?: Maybe<Scalars['ID']['output']>;
  createdAt: Scalars['DateTime']['output'];
  fulfillment?: Maybe<FulfillmentInfo>;
  id: Scalars['ID']['output'];
  items: Array<OrderItem>;
  orderNumber: Scalars['String']['output'];
  shipping: Scalars['Float']['output'];
  shippingAddress: Address;
  spaContact: SpaContact;
  spaId: Scalars['ID']['output'];
  spaName: Scalars['String']['output'];
  status: OrderStatus;
  statusHistory: Array<StatusChange>;
  subtotal: Scalars['Float']['output'];
  tax: Scalars['Float']['output'];
  total: Scalars['Float']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type VendorOrderConnection = {
  __typename?: 'VendorOrderConnection';
  edges: Array<VendorOrderEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type VendorOrderEdge = {
  __typename?: 'VendorOrderEdge';
  cursor: Scalars['String']['output'];
  node: VendorOrder;
};

/** Vendor Organization */
export type VendorOrganization = {
  __typename?: 'VendorOrganization';
  address: Address;
  approvalStatus: ApprovalStatus;
  approvedAt?: Maybe<Scalars['DateTime']['output']>;
  businessLicense: BusinessLicense;
  certifications: Array<Certification>;
  companyName: Scalars['String']['output'];
  contactEmail: Scalars['String']['output'];
  contactPhone?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  displayName: Scalars['String']['output'];
  fulfillmentSettings: FulfillmentSettings;
  id: Scalars['ID']['output'];
  insurance: InsuranceInfo;
  isActive: Scalars['Boolean']['output'];
  products: Array<Product>;
  qualityScore: Scalars['Float']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type VendorOrganizationConnection = {
  __typename?: 'VendorOrganizationConnection';
  edges: Array<VendorOrganizationEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type VendorOrganizationEdge = {
  __typename?: 'VendorOrganizationEdge';
  cursor: Scalars['String']['output'];
  node: VendorOrganization;
};

export type VendorOrganizationResult = {
  __typename?: 'VendorOrganizationResult';
  errors?: Maybe<Array<Error>>;
  success: Scalars['Boolean']['output'];
  vendorOrganization?: Maybe<VendorOrganization>;
};

export type VendorPortalError = {
  __typename?: 'VendorPortalError';
  code: VendorPortalErrorCode;
  field?: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
};

export enum VendorPortalErrorCode {
  ApplicationNotFound = 'APPLICATION_NOT_FOUND',
  CannotSkipRequiredStep = 'CANNOT_SKIP_REQUIRED_STEP',
  CertificationNotFound = 'CERTIFICATION_NOT_FOUND',
  DuplicateApplication = 'DUPLICATE_APPLICATION',
  DuplicateCertification = 'DUPLICATE_CERTIFICATION',
  ExpiredCertification = 'EXPIRED_CERTIFICATION',
  Forbidden = 'FORBIDDEN',
  InternalError = 'INTERNAL_ERROR',
  InvalidApplicationStatus = 'INVALID_APPLICATION_STATUS',
  InvalidBrandName = 'INVALID_BRAND_NAME',
  InvalidCertificationType = 'INVALID_CERTIFICATION_TYPE',
  InvalidColor = 'INVALID_COLOR',
  InvalidDocumentUrl = 'INVALID_DOCUMENT_URL',
  InvalidEmail = 'INVALID_EMAIL',
  InvalidUrl = 'INVALID_URL',
  InvalidYear = 'INVALID_YEAR',
  MissingRequiredField = 'MISSING_REQUIRED_FIELD',
  OnboardingNotFound = 'ONBOARDING_NOT_FOUND',
  ProfileAlreadyExists = 'PROFILE_ALREADY_EXISTS',
  ProfileNotFound = 'PROFILE_NOT_FOUND',
  SlaBreach = 'SLA_BREACH',
  StepAlreadyCompleted = 'STEP_ALREADY_COMPLETED',
  StepNotFound = 'STEP_NOT_FOUND',
  Unauthorized = 'UNAUTHORIZED',
  ValidationError = 'VALIDATION_ERROR'
}

export type VendorProfile = {
  __typename?: 'VendorProfile';
  brandColorPrimary?: Maybe<Scalars['String']['output']>;
  brandColorSecondary?: Maybe<Scalars['String']['output']>;
  brandName: Scalars['String']['output'];
  brandVideoUrl?: Maybe<Scalars['String']['output']>;
  certifications: Array<VendorCertification>;
  completenessScore: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  foundedYear?: Maybe<Scalars['Int']['output']>;
  founderStory?: Maybe<Scalars['String']['output']>;
  galleryImages?: Maybe<Array<Scalars['String']['output']>>;
  headquarters?: Maybe<Scalars['String']['output']>;
  heroImageUrl?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  logoUrl?: Maybe<Scalars['String']['output']>;
  missionStatement?: Maybe<Scalars['String']['output']>;
  socialLinks?: Maybe<SocialLinks>;
  tagline?: Maybe<Scalars['String']['output']>;
  teamSize?: Maybe<TeamSize>;
  updatedAt: Scalars['DateTime']['output'];
  values: Array<VendorValue>;
  vendorId: Scalars['ID']['output'];
  websiteUrl?: Maybe<Scalars['String']['output']>;
};

export type VendorProfileResult = {
  __typename?: 'VendorProfileResult';
  errors?: Maybe<Array<VendorPortalError>>;
  profile?: Maybe<VendorProfile>;
  success: Scalars['Boolean']['output'];
};

/**
 * Vendor Values - Searchable attributes (25 total)
 * Categories: Ingredient Philosophy (8), Sustainability (6), Founder Identity (6), Specialization (5)
 */
export enum VendorValue {
  BipocOwned = 'BIPOC_OWNED',
  CarbonNeutral = 'CARBON_NEUTRAL',
  CleanBeauty = 'CLEAN_BEAUTY',
  ClinicalResults = 'CLINICAL_RESULTS',
  CrueltyFree = 'CRUELTY_FREE',
  DermatologistTested = 'DERMATOLOGIST_TESTED',
  EcoPackaging = 'ECO_PACKAGING',
  EstheticianDeveloped = 'ESTHETICIAN_DEVELOPED',
  FamilyOwned = 'FAMILY_OWNED',
  FragranceFree = 'FRAGRANCE_FREE',
  LgbtqOwned = 'LGBTQ_OWNED',
  MedicalGrade = 'MEDICAL_GRADE',
  Natural = 'NATURAL',
  Organic = 'ORGANIC',
  ParabenFree = 'PARABEN_FREE',
  ProfessionalOnly = 'PROFESSIONAL_ONLY',
  ReefSafe = 'REEF_SAFE',
  Refillable = 'REFILLABLE',
  SmallBatch = 'SMALL_BATCH',
  SulfateFree = 'SULFATE_FREE',
  Sustainable = 'SUSTAINABLE',
  Vegan = 'VEGAN',
  VeteranOwned = 'VETERAN_OWNED',
  WomanFounded = 'WOMAN_FOUNDED',
  ZeroWaste = 'ZERO_WASTE'
}

/** Why Explanation - causal path with evidence */
export type WhyExplanation = {
  __typename?: 'WhyExplanation';
  confidenceScore: Scalars['Float']['output'];
  disclosureContent: DisclosureContent;
  evidenceStrength: Scalars['Float']['output'];
  path: Array<CausalPathStep>;
  summary: Scalars['String']['output'];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AIPerformanceMetrics: ResolverTypeWrapper<AiPerformanceMetrics>;
  AccessLevel: AccessLevel;
  AcknowledgeAlertInput: AcknowledgeAlertInput;
  ActionableRecommendation: ResolverTypeWrapper<ActionableRecommendation>;
  ActiveIngredient: ResolverTypeWrapper<ActiveIngredient>;
  ActiveIngredientInput: ActiveIngredientInput;
  AddCertificationInput: AddCertificationInput;
  AddShippingInfoInput: AddShippingInfoInput;
  Address: ResolverTypeWrapper<Address>;
  AddressInput: AddressInput;
  AlertCategory: AlertCategory;
  AlertSeverity: AlertSeverity;
  AnalysisMetrics: ResolverTypeWrapper<AnalysisMetrics>;
  AnomalyInsight: ResolverTypeWrapper<AnomalyInsight>;
  AppPreferences: ResolverTypeWrapper<AppPreferences>;
  ApplicationDocuments: ResolverTypeWrapper<ApplicationDocuments>;
  ApplicationReviewDecision: ApplicationReviewDecision;
  ApplicationReviewDecisionInput: ApplicationReviewDecisionInput;
  ApplicationStatus: ApplicationStatus;
  Appointment: ResolverTypeWrapper<Appointment>;
  AppointmentConnection: ResolverTypeWrapper<AppointmentConnection>;
  AppointmentEdge: ResolverTypeWrapper<AppointmentEdge>;
  AppointmentFiltersInput: AppointmentFiltersInput;
  AppointmentResult: ResolverTypeWrapper<AppointmentResult>;
  AppointmentStatus: AppointmentStatus;
  ApprovalDecision: ApprovalDecision;
  ApprovalStatus: ApprovalStatus;
  AtomWithIntelligence: ResolverTypeWrapper<AtomWithIntelligence>;
  AuthResult: ResolverTypeWrapper<AuthResult>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  BulkTaxonomyError: ResolverTypeWrapper<BulkTaxonomyError>;
  BulkTaxonomyResult: ResolverTypeWrapper<BulkTaxonomyResult>;
  BulkTaxonomyUpdate: BulkTaxonomyUpdate;
  BusinessAlert: ResolverTypeWrapper<BusinessAlert>;
  BusinessLicense: ResolverTypeWrapper<BusinessLicense>;
  BusinessLicenseInput: BusinessLicenseInput;
  BusinessMetrics: ResolverTypeWrapper<BusinessMetrics>;
  CampaignFilterInput: CampaignFilterInput;
  CampaignPerformanceSummary: ResolverTypeWrapper<CampaignPerformanceSummary>;
  CampaignStatus: CampaignStatus;
  CampaignType: CampaignType;
  CategoryCoverage: ResolverTypeWrapper<CategoryCoverage>;
  CategoryPerformance: ResolverTypeWrapper<CategoryPerformance>;
  CausalChainNode: ResolverTypeWrapper<CausalChainNode>;
  CausalDirection: CausalDirection;
  CausalPathStep: ResolverTypeWrapper<CausalPathStep>;
  Certification: ResolverTypeWrapper<Certification>;
  CertificationInput: CertificationInput;
  CertificationResult: ResolverTypeWrapper<CertificationResult>;
  CertificationStatus: CertificationStatus;
  CertificationType: CertificationType;
  CertificationVerificationDecision: CertificationVerificationDecision;
  CertificationVerificationInput: CertificationVerificationInput;
  ChannelPerformance: ResolverTypeWrapper<ChannelPerformance>;
  ClaimEvidence: ResolverTypeWrapper<ClaimEvidence>;
  ClaimEvidenceInput: ClaimEvidenceInput;
  Client: ResolverTypeWrapper<Client>;
  ClientConnection: ResolverTypeWrapper<ClientConnection>;
  ClientEdge: ResolverTypeWrapper<ClientEdge>;
  ClientFeedback: ResolverTypeWrapper<ClientFeedback>;
  ClientPreferences: ResolverTypeWrapper<ClientPreferences>;
  ClientPreferencesInput: ClientPreferencesInput;
  ClientResult: ResolverTypeWrapper<ClientResult>;
  ClinicalData: ResolverTypeWrapper<ClinicalData>;
  ClinicalTrial: ResolverTypeWrapper<ClinicalTrial>;
  CommunicationChannel: CommunicationChannel;
  CommunityComment: ResolverTypeWrapper<CommunityComment>;
  CommunityEvent: ResolverTypeWrapper<CommunityEvent>;
  CommunityEventConnection: ResolverTypeWrapper<CommunityEventConnection>;
  CommunityPost: ResolverTypeWrapper<CommunityPost>;
  CommunityPostConnection: ResolverTypeWrapper<CommunityPostConnection>;
  CompatibilityResult: ResolverTypeWrapper<CompatibilityResult>;
  CompleteAppointmentInput: CompleteAppointmentInput;
  CompleteOnboardingStepInput: CompleteOnboardingStepInput;
  ComplianceSeverity: ComplianceSeverity;
  ConcernAnalysis: ResolverTypeWrapper<ConcernAnalysis>;
  ConcernSeverity: ConcernSeverity;
  ConflictType: ConflictType;
  ConsultationMetrics: ResolverTypeWrapper<ConsultationMetrics>;
  Conversation: ResolverTypeWrapper<Conversation>;
  ConversationFilterInput: ConversationFilterInput;
  ConversationMessage: ResolverTypeWrapper<ConversationMessage>;
  ConversationMessagesResponse: ResolverTypeWrapper<ConversationMessagesResponse>;
  ConversationStatus: ConversationStatus;
  CreateAppointmentInput: CreateAppointmentInput;
  CreateCampaignInput: CreateCampaignInput;
  CreateClientInput: CreateClientInput;
  CreateConversationInput: CreateConversationInput;
  CreateEventInput: CreateEventInput;
  CreatePostInput: CreatePostInput;
  CreateProductInput: CreateProductInput;
  CreateSpaOrganizationInput: CreateSpaOrganizationInput;
  CreateVendorOrganizationInput: CreateVendorOrganizationInput;
  CreateVendorProfileInput: CreateVendorProfileInput;
  CrossSellPair: ResolverTypeWrapper<CrossSellPair>;
  CustomerMetrics: ResolverTypeWrapper<CustomerMetrics>;
  CustomerSegment: ResolverTypeWrapper<CustomerSegment>;
  DashboardMetric: ResolverTypeWrapper<DashboardMetric>;
  DashboardSummary: ResolverTypeWrapper<DashboardSummary>;
  DateFormat: DateFormat;
  DateRange: ResolverTypeWrapper<DateRange>;
  DateRangeInput: DateRangeInput;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  DefaultView: DefaultView;
  DetailLevel: DetailLevel;
  DisclosureContent: ResolverTypeWrapper<DisclosureContent>;
  DisclosureLevel: DisclosureLevel;
  DiscoveryAnalytics: ResolverTypeWrapper<DiscoveryAnalytics>;
  DiscoveryRecommendation: ResolverTypeWrapper<DiscoveryRecommendation>;
  EfficacyIndicator: ResolverTypeWrapper<EfficacyIndicator>;
  EfficacyIndicatorInput: EfficacyIndicatorInput;
  EfficacySummary: ResolverTypeWrapper<EfficacySummary>;
  EffortLevel: EffortLevel;
  Error: ResolverTypeWrapper<Error>;
  EventFormat: EventFormat;
  EventStatus: EventStatus;
  EventType: EventType;
  EvidenceLevel: EvidenceLevel;
  EvidenceSummary: ResolverTypeWrapper<EvidenceSummary>;
  FinancialMetrics: ResolverTypeWrapper<FinancialMetrics>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  FulfillmentInfo: ResolverTypeWrapper<FulfillmentInfo>;
  FulfillmentSettings: ResolverTypeWrapper<FulfillmentSettings>;
  FulfillmentSettingsInput: FulfillmentSettingsInput;
  GenerateReportInput: GenerateReportInput;
  GeographicRegion: ResolverTypeWrapper<GeographicRegion>;
  GoldilocksParameter: ResolverTypeWrapper<GoldilocksParameter>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  ImpressionMetrics: ResolverTypeWrapper<ImpressionMetrics>;
  ImpressionsBySource: ResolverTypeWrapper<ImpressionsBySource>;
  Ingredient: ResolverTypeWrapper<Ingredient>;
  IngredientAnalysis: ResolverTypeWrapper<IngredientAnalysis>;
  IngredientInput: IngredientInput;
  IngredientInteraction: ResolverTypeWrapper<IngredientInteraction>;
  IngredientList: ResolverTypeWrapper<IngredientList>;
  IngredientListInput: IngredientListInput;
  InsightEngine: ResolverTypeWrapper<InsightEngine>;
  InsuranceInfo: ResolverTypeWrapper<InsuranceInfo>;
  InsuranceInfoInput: InsuranceInfoInput;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  IntelligenceSearchFilters: IntelligenceSearchFilters;
  IntelligenceSearchResponse: ResolverTypeWrapper<IntelligenceSearchResponse>;
  IntelligenceSearchResult: ResolverTypeWrapper<IntelligenceSearchResult>;
  InteractionType: InteractionType;
  JSON: ResolverTypeWrapper<Scalars['JSON']['output']>;
  JobStatus: JobStatus;
  JobStatusResponse: ResolverTypeWrapper<JobStatusResponse>;
  JourneyStage: ResolverTypeWrapper<JourneyStage>;
  KnowledgeThreshold: KnowledgeThreshold;
  LicenseInfo: ResolverTypeWrapper<LicenseInfo>;
  LicenseType: LicenseType;
  Location: ResolverTypeWrapper<Location>;
  LoginInput: LoginInput;
  MarketSegment: MarketSegment;
  MarketingCampaign: ResolverTypeWrapper<MarketingCampaign>;
  MarketingCampaignResult: ResolverTypeWrapper<MarketingCampaignResult>;
  MessageAttachmentInput: MessageAttachmentInput;
  MessageSenderType: MessageSenderType;
  MetricsFiltersInput: MetricsFiltersInput;
  MetricsTimeframeInput: MetricsTimeframeInput;
  Money: ResolverTypeWrapper<Money>;
  MoneyInput: MoneyInput;
  Mutation: ResolverTypeWrapper<{}>;
  NotificationSettings: ResolverTypeWrapper<NotificationSettings>;
  OnboardingStep: ResolverTypeWrapper<OnboardingStep>;
  OnboardingStepResult: ResolverTypeWrapper<OnboardingStepResult>;
  OnboardingStepStatus: OnboardingStepStatus;
  OrderFilterInput: OrderFilterInput;
  OrderItem: ResolverTypeWrapper<OrderItem>;
  OrderMetrics: ResolverTypeWrapper<OrderMetrics>;
  OrderSortField: OrderSortField;
  OrderSortInput: OrderSortInput;
  OrderStatus: OrderStatus;
  OrderStatusCounts: ResolverTypeWrapper<OrderStatusCounts>;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  PaginationInput: PaginationInput;
  PostSortOption: PostSortOption;
  PostStatus: PostStatus;
  PostType: PostType;
  PredictionAccuracyMetrics: ResolverTypeWrapper<PredictionAccuracyMetrics>;
  PredictionFactor: ResolverTypeWrapper<PredictionFactor>;
  PredictiveInsight: ResolverTypeWrapper<PredictiveInsight>;
  PricePoint: PricePoint;
  PriceRangeInput: PriceRangeInput;
  PriceTier: PriceTier;
  Product: ResolverTypeWrapper<Product>;
  ProductCategory: ResolverTypeWrapper<ProductCategory>;
  ProductConnection: ResolverTypeWrapper<ProductConnection>;
  ProductEdge: ResolverTypeWrapper<ProductEdge>;
  ProductFiltersInput: ProductFiltersInput;
  ProductFormat: ResolverTypeWrapper<ProductFormat>;
  ProductFunction: ResolverTypeWrapper<ProductFunction>;
  ProductGlance: ResolverTypeWrapper<ProductGlance>;
  ProductGlanceInput: ProductGlanceInput;
  ProductMetrics: ResolverTypeWrapper<ProductMetrics>;
  ProductPerformance: ResolverTypeWrapper<ProductPerformance>;
  ProductRegion: ResolverTypeWrapper<ProductRegion>;
  ProductResult: ResolverTypeWrapper<ProductResult>;
  ProductScan: ResolverTypeWrapper<ProductScan>;
  ProductScanInput: ProductScanInput;
  ProductStudy: ResolverTypeWrapper<ProductStudy>;
  ProductStudyInput: ProductStudyInput;
  ProductTaxonomy: ResolverTypeWrapper<ProductTaxonomy>;
  ProductTaxonomyInput: ProductTaxonomyInput;
  ProductUsage: ResolverTypeWrapper<ProductUsage>;
  ProductUsageInput: ProductUsageInput;
  ProfessionalLevel: ProfessionalLevel;
  ProfileEngagement: ResolverTypeWrapper<ProfileEngagement>;
  ProfileSettings: ResolverTypeWrapper<ProfileSettings>;
  PurgeAnalysis: ResolverTypeWrapper<PurgeAnalysis>;
  Query: ResolverTypeWrapper<{}>;
  RecommendationCategory: RecommendationCategory;
  RecommendationMetrics: ResolverTypeWrapper<RecommendationMetrics>;
  RecommendationPriority: RecommendationPriority;
  RecommendationType: RecommendationType;
  RegisterInput: RegisterInput;
  RelationshipStatus: RelationshipStatus;
  ReminderPreference: ResolverTypeWrapper<ReminderPreference>;
  ReminderPreferenceInput: ReminderPreferenceInput;
  Report: ResolverTypeWrapper<Report>;
  ReportFormat: ReportFormat;
  ReportFrequency: ReportFrequency;
  ReportStatus: ReportStatus;
  ReportType: ReportType;
  ResetPasswordInput: ResetPasswordInput;
  RevenueMetrics: ResolverTypeWrapper<RevenueMetrics>;
  RevenuePeriod: ResolverTypeWrapper<RevenuePeriod>;
  RiskLevel: RiskLevel;
  RoutineComplexityBreakdown: ResolverTypeWrapper<RoutineComplexityBreakdown>;
  SKACausalChain: ResolverTypeWrapper<SkaCausalChain>;
  SKACausalNode: ResolverTypeWrapper<SkaCausalNode>;
  SKACompatibilityResult: ResolverTypeWrapper<SkaCompatibilityResult>;
  SKAComplianceScore: ResolverTypeWrapper<SkaComplianceScore>;
  SKAComplianceSuggestion: ResolverTypeWrapper<SkaComplianceSuggestion>;
  SKAComplianceWarning: ResolverTypeWrapper<SkaComplianceWarning>;
  SKAHighlight: ResolverTypeWrapper<SkaHighlight>;
  SKAKnowledgeGraphStats: ResolverTypeWrapper<SkaKnowledgeGraphStats>;
  SKAPurgingInfo: ResolverTypeWrapper<SkaPurgingInfo>;
  SKAQuickComplianceResult: ResolverTypeWrapper<SkaQuickComplianceResult>;
  SKASearchFilters: SkaSearchFilters;
  SKASearchResponse: ResolverTypeWrapper<SkaSearchResponse>;
  SKASearchResult: ResolverTypeWrapper<SkaSearchResult>;
  SKATensorProfileInput: SkaTensorProfileInput;
  SanctuaryMember: ResolverTypeWrapper<SanctuaryMember>;
  ScheduleReportInput: ScheduleReportInput;
  ScheduledReport: ResolverTypeWrapper<ScheduledReport>;
  ScoreDistribution: ResolverTypeWrapper<ScoreDistribution>;
  SearchQueryInsight: ResolverTypeWrapper<SearchQueryInsight>;
  SendMessageInput: SendMessageInput;
  ServiceProvider: ResolverTypeWrapper<ServiceProvider>;
  SignificanceLevel: SignificanceLevel;
  SkinConcern: ResolverTypeWrapper<SkinConcern>;
  SkinProfile: ResolverTypeWrapper<SkinProfile>;
  SkinProfileInput: SkinProfileInput;
  SkinType: SkinType;
  SkincareAnalytics: ResolverTypeWrapper<SkincareAnalytics>;
  SkincareAtom: ResolverTypeWrapper<SkincareAtom>;
  SkincareAtomTensor: ResolverTypeWrapper<SkincareAtomTensor>;
  SkincareAtomType: SkincareAtomType;
  SkincareFilterOptions: ResolverTypeWrapper<SkincareFilterOptions>;
  SkincarePillar: ResolverTypeWrapper<SkincarePillar>;
  SkincareProduct: ResolverTypeWrapper<SkincareProduct>;
  SkincareRelationship: ResolverTypeWrapper<SkincareRelationship>;
  SkincareRelationshipType: SkincareRelationshipType;
  SkincareRoutine: ResolverTypeWrapper<SkincareRoutine>;
  SkincareRoutineStep: ResolverTypeWrapper<SkincareRoutineStep>;
  SkincareSearchFilters: SkincareSearchFilters;
  SocialLinks: ResolverTypeWrapper<SocialLinks>;
  SocialLinksInput: SocialLinksInput;
  SortOrder: SortOrder;
  SourceType: SourceType;
  SpaContact: ResolverTypeWrapper<SpaContact>;
  SpaMetrics: ResolverTypeWrapper<SpaMetrics>;
  SpaOrganization: ResolverTypeWrapper<SpaOrganization>;
  SpaOrganizationConnection: ResolverTypeWrapper<SpaOrganizationConnection>;
  SpaOrganizationEdge: ResolverTypeWrapper<SpaOrganizationEdge>;
  SpaOrganizationResult: ResolverTypeWrapper<SpaOrganizationResult>;
  SpaVendorRelationship: ResolverTypeWrapper<SpaVendorRelationship>;
  StatusChange: ResolverTypeWrapper<StatusChange>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  SubmitVendorApplicationInput: SubmitVendorApplicationInput;
  SubscriptionStatus: SubscriptionStatus;
  SubscriptionTier: SubscriptionTier;
  SuccessResponse: ResolverTypeWrapper<SuccessResponse>;
  SynergyType: SynergyType;
  TargetArea: ResolverTypeWrapper<TargetArea>;
  TaxonomyFilterInput: TaxonomyFilterInput;
  TaxonomyFilterOptions: ResolverTypeWrapper<TaxonomyFilterOptions>;
  TaxonomyStats: ResolverTypeWrapper<TaxonomyStats>;
  TeamSize: TeamSize;
  TestReport: ResolverTypeWrapper<TestReport>;
  ThemePreference: ThemePreference;
  TimeFormat: TimeFormat;
  TimeOfDay: TimeOfDay;
  TimeSeriesDataPoint: ResolverTypeWrapper<TimeSeriesDataPoint>;
  TreatmentPlan: ResolverTypeWrapper<TreatmentPlan>;
  TreatmentPlanStatus: TreatmentPlanStatus;
  TrendDirection: TrendDirection;
  TrendIndicator: TrendIndicator;
  TrendInsight: ResolverTypeWrapper<TrendInsight>;
  TrendingTopic: ResolverTypeWrapper<TrendingTopic>;
  UpdateAppPreferencesInput: UpdateAppPreferencesInput;
  UpdateAppointmentInput: UpdateAppointmentInput;
  UpdateCampaignInput: UpdateCampaignInput;
  UpdateCampaignMetricsInput: UpdateCampaignMetricsInput;
  UpdateClientInput: UpdateClientInput;
  UpdateNotificationSettingsInput: UpdateNotificationSettingsInput;
  UpdateOrderStatusInput: UpdateOrderStatusInput;
  UpdatePostInput: UpdatePostInput;
  UpdateProductInput: UpdateProductInput;
  UpdateProfileInput: UpdateProfileInput;
  UpdateProfileSettingsInput: UpdateProfileSettingsInput;
  UpdateSanctuaryProfileInput: UpdateSanctuaryProfileInput;
  UpdateSpaOrganizationInput: UpdateSpaOrganizationInput;
  UpdateUserSettingsInput: UpdateUserSettingsInput;
  UpdateVendorOrganizationInput: UpdateVendorOrganizationInput;
  UpdateVendorProfileInput: UpdateVendorProfileInput;
  Upload: ResolverTypeWrapper<Scalars['Upload']['output']>;
  UsageInstructions: ResolverTypeWrapper<UsageInstructions>;
  UsageInstructionsInput: UsageInstructionsInput;
  UsageTime: UsageTime;
  User: ResolverTypeWrapper<User>;
  UserResult: ResolverTypeWrapper<UserResult>;
  UserRole: UserRole;
  UserSettings: ResolverTypeWrapper<UserSettings>;
  UserSettingsResult: ResolverTypeWrapper<UserSettingsResult>;
  ValuePerformance: ResolverTypeWrapper<ValuePerformance>;
  VendorApplication: ResolverTypeWrapper<VendorApplication>;
  VendorApplicationResult: ResolverTypeWrapper<VendorApplicationResult>;
  VendorCertification: ResolverTypeWrapper<VendorCertification>;
  VendorDashboardMetrics: ResolverTypeWrapper<VendorDashboardMetrics>;
  VendorOnboarding: ResolverTypeWrapper<VendorOnboarding>;
  VendorOrder: ResolverTypeWrapper<VendorOrder>;
  VendorOrderConnection: ResolverTypeWrapper<VendorOrderConnection>;
  VendorOrderEdge: ResolverTypeWrapper<VendorOrderEdge>;
  VendorOrganization: ResolverTypeWrapper<VendorOrganization>;
  VendorOrganizationConnection: ResolverTypeWrapper<VendorOrganizationConnection>;
  VendorOrganizationEdge: ResolverTypeWrapper<VendorOrganizationEdge>;
  VendorOrganizationResult: ResolverTypeWrapper<VendorOrganizationResult>;
  VendorPortalError: ResolverTypeWrapper<VendorPortalError>;
  VendorPortalErrorCode: VendorPortalErrorCode;
  VendorProfile: ResolverTypeWrapper<VendorProfile>;
  VendorProfileResult: ResolverTypeWrapper<VendorProfileResult>;
  VendorValue: VendorValue;
  WhyExplanation: ResolverTypeWrapper<WhyExplanation>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AIPerformanceMetrics: AiPerformanceMetrics;
  AcknowledgeAlertInput: AcknowledgeAlertInput;
  ActionableRecommendation: ActionableRecommendation;
  ActiveIngredient: ActiveIngredient;
  ActiveIngredientInput: ActiveIngredientInput;
  AddCertificationInput: AddCertificationInput;
  AddShippingInfoInput: AddShippingInfoInput;
  Address: Address;
  AddressInput: AddressInput;
  AnalysisMetrics: AnalysisMetrics;
  AnomalyInsight: AnomalyInsight;
  AppPreferences: AppPreferences;
  ApplicationDocuments: ApplicationDocuments;
  ApplicationReviewDecisionInput: ApplicationReviewDecisionInput;
  Appointment: Appointment;
  AppointmentConnection: AppointmentConnection;
  AppointmentEdge: AppointmentEdge;
  AppointmentFiltersInput: AppointmentFiltersInput;
  AppointmentResult: AppointmentResult;
  AtomWithIntelligence: AtomWithIntelligence;
  AuthResult: AuthResult;
  Boolean: Scalars['Boolean']['output'];
  BulkTaxonomyError: BulkTaxonomyError;
  BulkTaxonomyResult: BulkTaxonomyResult;
  BulkTaxonomyUpdate: BulkTaxonomyUpdate;
  BusinessAlert: BusinessAlert;
  BusinessLicense: BusinessLicense;
  BusinessLicenseInput: BusinessLicenseInput;
  BusinessMetrics: BusinessMetrics;
  CampaignFilterInput: CampaignFilterInput;
  CampaignPerformanceSummary: CampaignPerformanceSummary;
  CategoryCoverage: CategoryCoverage;
  CategoryPerformance: CategoryPerformance;
  CausalChainNode: CausalChainNode;
  CausalPathStep: CausalPathStep;
  Certification: Certification;
  CertificationInput: CertificationInput;
  CertificationResult: CertificationResult;
  CertificationVerificationInput: CertificationVerificationInput;
  ChannelPerformance: ChannelPerformance;
  ClaimEvidence: ClaimEvidence;
  ClaimEvidenceInput: ClaimEvidenceInput;
  Client: Client;
  ClientConnection: ClientConnection;
  ClientEdge: ClientEdge;
  ClientFeedback: ClientFeedback;
  ClientPreferences: ClientPreferences;
  ClientPreferencesInput: ClientPreferencesInput;
  ClientResult: ClientResult;
  ClinicalData: ClinicalData;
  ClinicalTrial: ClinicalTrial;
  CommunityComment: CommunityComment;
  CommunityEvent: CommunityEvent;
  CommunityEventConnection: CommunityEventConnection;
  CommunityPost: CommunityPost;
  CommunityPostConnection: CommunityPostConnection;
  CompatibilityResult: CompatibilityResult;
  CompleteAppointmentInput: CompleteAppointmentInput;
  CompleteOnboardingStepInput: CompleteOnboardingStepInput;
  ConcernAnalysis: ConcernAnalysis;
  ConsultationMetrics: ConsultationMetrics;
  Conversation: Conversation;
  ConversationFilterInput: ConversationFilterInput;
  ConversationMessage: ConversationMessage;
  ConversationMessagesResponse: ConversationMessagesResponse;
  CreateAppointmentInput: CreateAppointmentInput;
  CreateCampaignInput: CreateCampaignInput;
  CreateClientInput: CreateClientInput;
  CreateConversationInput: CreateConversationInput;
  CreateEventInput: CreateEventInput;
  CreatePostInput: CreatePostInput;
  CreateProductInput: CreateProductInput;
  CreateSpaOrganizationInput: CreateSpaOrganizationInput;
  CreateVendorOrganizationInput: CreateVendorOrganizationInput;
  CreateVendorProfileInput: CreateVendorProfileInput;
  CrossSellPair: CrossSellPair;
  CustomerMetrics: CustomerMetrics;
  CustomerSegment: CustomerSegment;
  DashboardMetric: DashboardMetric;
  DashboardSummary: DashboardSummary;
  DateRange: DateRange;
  DateRangeInput: DateRangeInput;
  DateTime: Scalars['DateTime']['output'];
  DisclosureContent: DisclosureContent;
  DiscoveryAnalytics: DiscoveryAnalytics;
  DiscoveryRecommendation: DiscoveryRecommendation;
  EfficacyIndicator: EfficacyIndicator;
  EfficacyIndicatorInput: EfficacyIndicatorInput;
  EfficacySummary: EfficacySummary;
  Error: Error;
  EvidenceSummary: EvidenceSummary;
  FinancialMetrics: FinancialMetrics;
  Float: Scalars['Float']['output'];
  FulfillmentInfo: FulfillmentInfo;
  FulfillmentSettings: FulfillmentSettings;
  FulfillmentSettingsInput: FulfillmentSettingsInput;
  GenerateReportInput: GenerateReportInput;
  GeographicRegion: GeographicRegion;
  GoldilocksParameter: GoldilocksParameter;
  ID: Scalars['ID']['output'];
  ImpressionMetrics: ImpressionMetrics;
  ImpressionsBySource: ImpressionsBySource;
  Ingredient: Ingredient;
  IngredientAnalysis: IngredientAnalysis;
  IngredientInput: IngredientInput;
  IngredientInteraction: IngredientInteraction;
  IngredientList: IngredientList;
  IngredientListInput: IngredientListInput;
  InsightEngine: InsightEngine;
  InsuranceInfo: InsuranceInfo;
  InsuranceInfoInput: InsuranceInfoInput;
  Int: Scalars['Int']['output'];
  IntelligenceSearchFilters: IntelligenceSearchFilters;
  IntelligenceSearchResponse: IntelligenceSearchResponse;
  IntelligenceSearchResult: IntelligenceSearchResult;
  JSON: Scalars['JSON']['output'];
  JobStatusResponse: JobStatusResponse;
  JourneyStage: JourneyStage;
  LicenseInfo: LicenseInfo;
  Location: Location;
  LoginInput: LoginInput;
  MarketingCampaign: MarketingCampaign;
  MarketingCampaignResult: MarketingCampaignResult;
  MessageAttachmentInput: MessageAttachmentInput;
  MetricsFiltersInput: MetricsFiltersInput;
  MetricsTimeframeInput: MetricsTimeframeInput;
  Money: Money;
  MoneyInput: MoneyInput;
  Mutation: {};
  NotificationSettings: NotificationSettings;
  OnboardingStep: OnboardingStep;
  OnboardingStepResult: OnboardingStepResult;
  OrderFilterInput: OrderFilterInput;
  OrderItem: OrderItem;
  OrderMetrics: OrderMetrics;
  OrderSortInput: OrderSortInput;
  OrderStatusCounts: OrderStatusCounts;
  PageInfo: PageInfo;
  PaginationInput: PaginationInput;
  PredictionAccuracyMetrics: PredictionAccuracyMetrics;
  PredictionFactor: PredictionFactor;
  PredictiveInsight: PredictiveInsight;
  PriceRangeInput: PriceRangeInput;
  Product: Product;
  ProductCategory: ProductCategory;
  ProductConnection: ProductConnection;
  ProductEdge: ProductEdge;
  ProductFiltersInput: ProductFiltersInput;
  ProductFormat: ProductFormat;
  ProductFunction: ProductFunction;
  ProductGlance: ProductGlance;
  ProductGlanceInput: ProductGlanceInput;
  ProductMetrics: ProductMetrics;
  ProductPerformance: ProductPerformance;
  ProductRegion: ProductRegion;
  ProductResult: ProductResult;
  ProductScan: ProductScan;
  ProductScanInput: ProductScanInput;
  ProductStudy: ProductStudy;
  ProductStudyInput: ProductStudyInput;
  ProductTaxonomy: ProductTaxonomy;
  ProductTaxonomyInput: ProductTaxonomyInput;
  ProductUsage: ProductUsage;
  ProductUsageInput: ProductUsageInput;
  ProfileEngagement: ProfileEngagement;
  ProfileSettings: ProfileSettings;
  PurgeAnalysis: PurgeAnalysis;
  Query: {};
  RecommendationMetrics: RecommendationMetrics;
  RegisterInput: RegisterInput;
  ReminderPreference: ReminderPreference;
  ReminderPreferenceInput: ReminderPreferenceInput;
  Report: Report;
  ResetPasswordInput: ResetPasswordInput;
  RevenueMetrics: RevenueMetrics;
  RevenuePeriod: RevenuePeriod;
  RoutineComplexityBreakdown: RoutineComplexityBreakdown;
  SKACausalChain: SkaCausalChain;
  SKACausalNode: SkaCausalNode;
  SKACompatibilityResult: SkaCompatibilityResult;
  SKAComplianceScore: SkaComplianceScore;
  SKAComplianceSuggestion: SkaComplianceSuggestion;
  SKAComplianceWarning: SkaComplianceWarning;
  SKAHighlight: SkaHighlight;
  SKAKnowledgeGraphStats: SkaKnowledgeGraphStats;
  SKAPurgingInfo: SkaPurgingInfo;
  SKAQuickComplianceResult: SkaQuickComplianceResult;
  SKASearchFilters: SkaSearchFilters;
  SKASearchResponse: SkaSearchResponse;
  SKASearchResult: SkaSearchResult;
  SKATensorProfileInput: SkaTensorProfileInput;
  SanctuaryMember: SanctuaryMember;
  ScheduleReportInput: ScheduleReportInput;
  ScheduledReport: ScheduledReport;
  ScoreDistribution: ScoreDistribution;
  SearchQueryInsight: SearchQueryInsight;
  SendMessageInput: SendMessageInput;
  ServiceProvider: ServiceProvider;
  SkinConcern: SkinConcern;
  SkinProfile: SkinProfile;
  SkinProfileInput: SkinProfileInput;
  SkincareAnalytics: SkincareAnalytics;
  SkincareAtom: SkincareAtom;
  SkincareAtomTensor: SkincareAtomTensor;
  SkincareFilterOptions: SkincareFilterOptions;
  SkincarePillar: SkincarePillar;
  SkincareProduct: SkincareProduct;
  SkincareRelationship: SkincareRelationship;
  SkincareRoutine: SkincareRoutine;
  SkincareRoutineStep: SkincareRoutineStep;
  SkincareSearchFilters: SkincareSearchFilters;
  SocialLinks: SocialLinks;
  SocialLinksInput: SocialLinksInput;
  SpaContact: SpaContact;
  SpaMetrics: SpaMetrics;
  SpaOrganization: SpaOrganization;
  SpaOrganizationConnection: SpaOrganizationConnection;
  SpaOrganizationEdge: SpaOrganizationEdge;
  SpaOrganizationResult: SpaOrganizationResult;
  SpaVendorRelationship: SpaVendorRelationship;
  StatusChange: StatusChange;
  String: Scalars['String']['output'];
  SubmitVendorApplicationInput: SubmitVendorApplicationInput;
  SuccessResponse: SuccessResponse;
  TargetArea: TargetArea;
  TaxonomyFilterInput: TaxonomyFilterInput;
  TaxonomyFilterOptions: TaxonomyFilterOptions;
  TaxonomyStats: TaxonomyStats;
  TestReport: TestReport;
  TimeSeriesDataPoint: TimeSeriesDataPoint;
  TreatmentPlan: TreatmentPlan;
  TrendInsight: TrendInsight;
  TrendingTopic: TrendingTopic;
  UpdateAppPreferencesInput: UpdateAppPreferencesInput;
  UpdateAppointmentInput: UpdateAppointmentInput;
  UpdateCampaignInput: UpdateCampaignInput;
  UpdateCampaignMetricsInput: UpdateCampaignMetricsInput;
  UpdateClientInput: UpdateClientInput;
  UpdateNotificationSettingsInput: UpdateNotificationSettingsInput;
  UpdateOrderStatusInput: UpdateOrderStatusInput;
  UpdatePostInput: UpdatePostInput;
  UpdateProductInput: UpdateProductInput;
  UpdateProfileInput: UpdateProfileInput;
  UpdateProfileSettingsInput: UpdateProfileSettingsInput;
  UpdateSanctuaryProfileInput: UpdateSanctuaryProfileInput;
  UpdateSpaOrganizationInput: UpdateSpaOrganizationInput;
  UpdateUserSettingsInput: UpdateUserSettingsInput;
  UpdateVendorOrganizationInput: UpdateVendorOrganizationInput;
  UpdateVendorProfileInput: UpdateVendorProfileInput;
  Upload: Scalars['Upload']['output'];
  UsageInstructions: UsageInstructions;
  UsageInstructionsInput: UsageInstructionsInput;
  User: User;
  UserResult: UserResult;
  UserSettings: UserSettings;
  UserSettingsResult: UserSettingsResult;
  ValuePerformance: ValuePerformance;
  VendorApplication: VendorApplication;
  VendorApplicationResult: VendorApplicationResult;
  VendorCertification: VendorCertification;
  VendorDashboardMetrics: VendorDashboardMetrics;
  VendorOnboarding: VendorOnboarding;
  VendorOrder: VendorOrder;
  VendorOrderConnection: VendorOrderConnection;
  VendorOrderEdge: VendorOrderEdge;
  VendorOrganization: VendorOrganization;
  VendorOrganizationConnection: VendorOrganizationConnection;
  VendorOrganizationEdge: VendorOrganizationEdge;
  VendorOrganizationResult: VendorOrganizationResult;
  VendorPortalError: VendorPortalError;
  VendorProfile: VendorProfile;
  VendorProfileResult: VendorProfileResult;
  WhyExplanation: WhyExplanation;
}>;

export type AiPerformanceMetricsResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['AIPerformanceMetrics'] = ResolversParentTypes['AIPerformanceMetrics']> = ResolversObject<{
  analysisMetrics?: Resolver<ResolversTypes['AnalysisMetrics'], ParentType, ContextType>;
  predictionAccuracy?: Resolver<ResolversTypes['PredictionAccuracyMetrics'], ParentType, ContextType>;
  recommendationPerformance?: Resolver<ResolversTypes['RecommendationMetrics'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ActionableRecommendationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ActionableRecommendation'] = ResolversParentTypes['ActionableRecommendation']> = ResolversObject<{
  category?: Resolver<ResolversTypes['RecommendationCategory'], ParentType, ContextType>;
  dependencies?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  estimatedImpact?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  implementationEffort?: Resolver<ResolversTypes['EffortLevel'], ParentType, ContextType>;
  priority?: Resolver<ResolversTypes['SignificanceLevel'], ParentType, ContextType>;
  successMetrics?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  timeline?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ActiveIngredientResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ActiveIngredient'] = ResolversParentTypes['ActiveIngredient']> = ResolversObject<{
  concentration?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AddressResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Address'] = ResolversParentTypes['Address']> = ResolversObject<{
  city?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  country?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  line1?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  line2?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  postalCode?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  state?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  street1?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  street2?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AnalysisMetricsResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['AnalysisMetrics'] = ResolversParentTypes['AnalysisMetrics']> = ResolversObject<{
  accuracyScore?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  avgProcessingTimeMs?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalAnalyses?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  userSatisfaction?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AnomalyInsightResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['AnomalyInsight'] = ResolversParentTypes['AnomalyInsight']> = ResolversObject<{
  actualValue?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  deviation?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  expectedValue?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  metric?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  possibleCauses?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  recommendedActions?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  severity?: Resolver<ResolversTypes['AlertSeverity'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AppPreferencesResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['AppPreferences'] = ResolversParentTypes['AppPreferences']> = ResolversObject<{
  compactMode?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  currency?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  defaultView?: Resolver<ResolversTypes['DefaultView'], ParentType, ContextType>;
  itemsPerPage?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  keyboardShortcuts?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  showPricesWithTax?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  sidebarCollapsed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  theme?: Resolver<ResolversTypes['ThemePreference'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ApplicationDocumentsResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ApplicationDocuments'] = ResolversParentTypes['ApplicationDocuments']> = ResolversObject<{
  businessLicenseUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  insuranceCertificateUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  lineSheetUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  productCatalogUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AppointmentResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Appointment'] = ResolversParentTypes['Appointment']> = ResolversObject<{
  actualEnd?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  actualStart?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  cancellationReason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  cancelledAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  client?: Resolver<ResolversTypes['Client'], ParentType, ContextType>;
  clientFeedback?: Resolver<Maybe<ResolversTypes['ClientFeedback']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  location?: Resolver<ResolversTypes['Location'], ParentType, ContextType>;
  notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  productsUsed?: Resolver<Array<ResolversTypes['ProductUsage']>, ParentType, ContextType>;
  scheduledEnd?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  scheduledStart?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  serviceProvider?: Resolver<ResolversTypes['ServiceProvider'], ParentType, ContextType>;
  serviceType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['AppointmentStatus'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AppointmentConnectionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['AppointmentConnection'] = ResolversParentTypes['AppointmentConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['AppointmentEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AppointmentEdgeResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['AppointmentEdge'] = ResolversParentTypes['AppointmentEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Appointment'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AppointmentResultResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['AppointmentResult'] = ResolversParentTypes['AppointmentResult']> = ResolversObject<{
  appointment?: Resolver<Maybe<ResolversTypes['Appointment']>, ParentType, ContextType>;
  errors?: Resolver<Maybe<Array<ResolversTypes['Error']>>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AtomWithIntelligenceResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['AtomWithIntelligence'] = ResolversParentTypes['AtomWithIntelligence']> = ResolversObject<{
  accessible?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  atom?: Resolver<Maybe<ResolversTypes['SkincareAtom']>, ParentType, ContextType>;
  causalSummary?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  efficacySummary?: Resolver<Maybe<ResolversTypes['EfficacySummary']>, ParentType, ContextType>;
  evidenceSummary?: Resolver<Maybe<ResolversTypes['EvidenceSummary']>, ParentType, ContextType>;
  goldilocksParameters?: Resolver<Array<ResolversTypes['GoldilocksParameter']>, ParentType, ContextType>;
  whyItWorks?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AuthResultResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['AuthResult'] = ResolversParentTypes['AuthResult']> = ResolversObject<{
  accessToken?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  errors?: Resolver<Maybe<Array<ResolversTypes['Error']>>, ParentType, ContextType>;
  refreshToken?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BulkTaxonomyErrorResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['BulkTaxonomyError'] = ResolversParentTypes['BulkTaxonomyError']> = ResolversObject<{
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  productId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BulkTaxonomyResultResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['BulkTaxonomyResult'] = ResolversParentTypes['BulkTaxonomyResult']> = ResolversObject<{
  errors?: Resolver<Maybe<Array<ResolversTypes['BulkTaxonomyError']>>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  updatedCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BusinessAlertResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['BusinessAlert'] = ResolversParentTypes['BusinessAlert']> = ResolversObject<{
  acknowledged?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  acknowledgedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  acknowledgedBy?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  affectedMetrics?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  category?: Resolver<ResolversTypes['AlertCategory'], ParentType, ContextType>;
  currentValue?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  recommendedActions?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  severity?: Resolver<ResolversTypes['AlertSeverity'], ParentType, ContextType>;
  thresholdValue?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BusinessLicenseResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['BusinessLicense'] = ResolversParentTypes['BusinessLicense']> = ResolversObject<{
  documentUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  expirationDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  number?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  state?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BusinessMetricsResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['BusinessMetrics'] = ResolversParentTypes['BusinessMetrics']> = ResolversObject<{
  ai?: Resolver<ResolversTypes['AIPerformanceMetrics'], ParentType, ContextType>;
  computedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  customers?: Resolver<ResolversTypes['CustomerMetrics'], ParentType, ContextType>;
  financial?: Resolver<ResolversTypes['FinancialMetrics'], ParentType, ContextType>;
  products?: Resolver<ResolversTypes['ProductMetrics'], ParentType, ContextType>;
  skincare?: Resolver<ResolversTypes['SkincareAnalytics'], ParentType, ContextType>;
  timeframe?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CampaignPerformanceSummaryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['CampaignPerformanceSummary'] = ResolversParentTypes['CampaignPerformanceSummary']> = ResolversObject<{
  activeCampaigns?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  channelPerformance?: Resolver<Array<ResolversTypes['ChannelPerformance']>, ParentType, ContextType>;
  completedCampaigns?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  dateRange?: Resolver<ResolversTypes['DateRange'], ParentType, ContextType>;
  overallCTR?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  overallConversionRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  overallROAS?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  topCampaignsByROAS?: Resolver<Array<ResolversTypes['MarketingCampaign']>, ParentType, ContextType>;
  topCampaignsByRevenue?: Resolver<Array<ResolversTypes['MarketingCampaign']>, ParentType, ContextType>;
  totalRevenue?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  totalSpent?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CategoryCoverageResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['CategoryCoverage'] = ResolversParentTypes['CategoryCoverage']> = ResolversObject<{
  averageScore?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  category?: Resolver<ResolversTypes['ProductCategory'], ParentType, ContextType>;
  productCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CategoryPerformanceResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['CategoryPerformance'] = ResolversParentTypes['CategoryPerformance']> = ResolversObject<{
  category?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  growthRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  productCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  revenue?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CausalChainNodeResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['CausalChainNode'] = ResolversParentTypes['CausalChainNode']> = ResolversObject<{
  atom?: Resolver<ResolversTypes['SkincareAtom'], ParentType, ContextType>;
  depth?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  direction?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  mechanismSummary?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  relationship?: Resolver<Maybe<ResolversTypes['SkincareRelationship']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CausalPathStepResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['CausalPathStep'] = ResolversParentTypes['CausalPathStep']> = ResolversObject<{
  atom?: Resolver<ResolversTypes['SkincareAtom'], ParentType, ContextType>;
  mechanismSummary?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  relationship?: Resolver<Maybe<ResolversTypes['SkincareRelationship']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CertificationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Certification'] = ResolversParentTypes['Certification']> = ResolversObject<{
  certificateUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  expirationDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  issueDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  issuingOrg?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CertificationResultResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['CertificationResult'] = ResolversParentTypes['CertificationResult']> = ResolversObject<{
  certification?: Resolver<Maybe<ResolversTypes['VendorCertification']>, ParentType, ContextType>;
  errors?: Resolver<Maybe<Array<ResolversTypes['VendorPortalError']>>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ChannelPerformanceResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ChannelPerformance'] = ResolversParentTypes['ChannelPerformance']> = ResolversObject<{
  campaigns?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  channel?: Resolver<ResolversTypes['CampaignType'], ParentType, ContextType>;
  conversions?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  revenue?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  roas?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  spent?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ClaimEvidenceResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ClaimEvidence'] = ResolversParentTypes['ClaimEvidence']> = ResolversObject<{
  atomId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  claim?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  confidenceScore?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  evidenceLevel?: Resolver<ResolversTypes['EvidenceLevel'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  publicationYear?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  sampleSize?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  sourceReference?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sourceType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  studyDuration?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ClientResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Client'] = ResolversParentTypes['Client']> = ResolversObject<{
  allergies?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  appointments?: Resolver<Array<ResolversTypes['Appointment']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  dateOfBirth?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  preferences?: Resolver<ResolversTypes['ClientPreferences'], ParentType, ContextType>;
  skinProfile?: Resolver<ResolversTypes['SkinProfile'], ParentType, ContextType>;
  spaOrganization?: Resolver<ResolversTypes['SpaOrganization'], ParentType, ContextType>;
  treatmentPlans?: Resolver<Array<ResolversTypes['TreatmentPlan']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ClientConnectionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ClientConnection'] = ResolversParentTypes['ClientConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['ClientEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ClientEdgeResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ClientEdge'] = ResolversParentTypes['ClientEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Client'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ClientFeedbackResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ClientFeedback'] = ResolversParentTypes['ClientFeedback']> = ResolversObject<{
  comments?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  rating?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  submittedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  wouldRecommend?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ClientPreferencesResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ClientPreferences'] = ResolversParentTypes['ClientPreferences']> = ResolversObject<{
  communicationChannel?: Resolver<ResolversTypes['CommunicationChannel'], ParentType, ContextType>;
  marketingOptIn?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  preferredProviders?: Resolver<Maybe<Array<ResolversTypes['ID']>>, ParentType, ContextType>;
  reminderPreference?: Resolver<ResolversTypes['ReminderPreference'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ClientResultResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ClientResult'] = ResolversParentTypes['ClientResult']> = ResolversObject<{
  client?: Resolver<Maybe<ResolversTypes['Client']>, ParentType, ContextType>;
  errors?: Resolver<Maybe<Array<ResolversTypes['Error']>>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ClinicalDataResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ClinicalData'] = ResolversParentTypes['ClinicalData']> = ResolversObject<{
  certifications?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  testReports?: Resolver<Array<ResolversTypes['TestReport']>, ParentType, ContextType>;
  trials?: Resolver<Array<ResolversTypes['ClinicalTrial']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ClinicalTrialResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ClinicalTrial'] = ResolversParentTypes['ClinicalTrial']> = ResolversObject<{
  duration?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  participants?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  publicationUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  results?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  studyName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CommunityCommentResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['CommunityComment'] = ResolversParentTypes['CommunityComment']> = ResolversObject<{
  author?: Resolver<ResolversTypes['SanctuaryMember'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  hasLiked?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isAcceptedAnswer?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  likeCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  replies?: Resolver<Array<ResolversTypes['CommunityComment']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CommunityEventResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['CommunityEvent'] = ResolversParentTypes['CommunityEvent']> = ResolversObject<{
  attendeeCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  endTime?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  eventType?: Resolver<ResolversTypes['EventType'], ParentType, ContextType>;
  format?: Resolver<ResolversTypes['EventFormat'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isRegistered?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  location?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  maxAttendees?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  organizer?: Resolver<ResolversTypes['SanctuaryMember'], ParentType, ContextType>;
  priceCents?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  registrationDeadline?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  skaTopics?: Resolver<Array<ResolversTypes['SkincareAtom']>, ParentType, ContextType>;
  startTime?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['EventStatus'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  virtualLink?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CommunityEventConnectionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['CommunityEventConnection'] = ResolversParentTypes['CommunityEventConnection']> = ResolversObject<{
  hasMore?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  items?: Resolver<Array<ResolversTypes['CommunityEvent']>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CommunityPostResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['CommunityPost'] = ResolversParentTypes['CommunityPost']> = ResolversObject<{
  author?: Resolver<ResolversTypes['SanctuaryMember'], ParentType, ContextType>;
  category?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  commentCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  comments?: Resolver<Array<ResolversTypes['CommunityComment']>, ParentType, ContextType, Partial<CommunityPostCommentsArgs>>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  hasLiked?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isFeatured?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isPinned?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  likeCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  postType?: Resolver<ResolversTypes['PostType'], ParentType, ContextType>;
  skaAtoms?: Resolver<Array<ResolversTypes['SkincareAtom']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['PostStatus'], ParentType, ContextType>;
  tags?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  viewCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CommunityPostConnectionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['CommunityPostConnection'] = ResolversParentTypes['CommunityPostConnection']> = ResolversObject<{
  hasMore?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  items?: Resolver<Array<ResolversTypes['CommunityPost']>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CompatibilityResultResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['CompatibilityResult'] = ResolversParentTypes['CompatibilityResult']> = ResolversObject<{
  compatible?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  conflicts?: Resolver<Array<ResolversTypes['IngredientInteraction']>, ParentType, ContextType>;
  interactions?: Resolver<Array<ResolversTypes['IngredientInteraction']>, ParentType, ContextType>;
  overallScore?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  sequenceRecommendation?: Resolver<Array<ResolversTypes['SkincareAtom']>, ParentType, ContextType>;
  synergies?: Resolver<Array<ResolversTypes['IngredientInteraction']>, ParentType, ContextType>;
  tips?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  warnings?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ConcernAnalysisResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ConcernAnalysis'] = ResolversParentTypes['ConcernAnalysis']> = ResolversObject<{
  avgResolutionDays?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  concern?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  frequency?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  growthRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ConsultationMetricsResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ConsultationMetrics'] = ResolversParentTypes['ConsultationMetrics']> = ResolversObject<{
  avgSatisfaction?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  avgSessionDuration?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  successRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  totalSessions?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ConversationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Conversation'] = ResolversParentTypes['Conversation']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastMessageAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  spaId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  spaName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['ConversationStatus'], ParentType, ContextType>;
  subject?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  unreadCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  vendorId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ConversationMessageResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ConversationMessage'] = ResolversParentTypes['ConversationMessage']> = ResolversObject<{
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  conversationId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isRead?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isSystemMessage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  senderId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  senderName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  senderType?: Resolver<ResolversTypes['MessageSenderType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ConversationMessagesResponseResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ConversationMessagesResponse'] = ResolversParentTypes['ConversationMessagesResponse']> = ResolversObject<{
  hasMore?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  messages?: Resolver<Array<ResolversTypes['ConversationMessage']>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CrossSellPairResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['CrossSellPair'] = ResolversParentTypes['CrossSellPair']> = ResolversObject<{
  coOccurrenceCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  correlation?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  product1Id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  product1Name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  product2Id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  product2Name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CustomerMetricsResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['CustomerMetrics'] = ResolversParentTypes['CustomerMetrics']> = ResolversObject<{
  averageCustomerAge?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  churnedCustomers?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  geographicDistribution?: Resolver<Array<ResolversTypes['GeographicRegion']>, ParentType, ContextType>;
  journeyStageDistribution?: Resolver<Array<ResolversTypes['JourneyStage']>, ParentType, ContextType>;
  newAcquisitions?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  topSegments?: Resolver<Array<ResolversTypes['CustomerSegment']>, ParentType, ContextType>;
  totalActive?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CustomerSegmentResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['CustomerSegment'] = ResolversParentTypes['CustomerSegment']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  growthRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  revenue?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  segment?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DashboardMetricResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['DashboardMetric'] = ResolversParentTypes['DashboardMetric']> = ResolversObject<{
  changePercent?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  previousValue?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  trend?: Resolver<ResolversTypes['TrendDirection'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DashboardSummaryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['DashboardSummary'] = ResolversParentTypes['DashboardSummary']> = ResolversObject<{
  aiRecommendationAcceptance?: Resolver<ResolversTypes['DashboardMetric'], ParentType, ContextType>;
  avgOrderValue?: Resolver<ResolversTypes['DashboardMetric'], ParentType, ContextType>;
  churnRate?: Resolver<ResolversTypes['DashboardMetric'], ParentType, ContextType>;
  customers?: Resolver<ResolversTypes['DashboardMetric'], ParentType, ContextType>;
  keyInsights?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  orders?: Resolver<ResolversTypes['DashboardMetric'], ParentType, ContextType>;
  recentAlerts?: Resolver<Array<ResolversTypes['BusinessAlert']>, ParentType, ContextType>;
  revenue?: Resolver<ResolversTypes['DashboardMetric'], ParentType, ContextType>;
  topProducts?: Resolver<Array<ResolversTypes['ProductPerformance']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DateRangeResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['DateRange'] = ResolversParentTypes['DateRange']> = ResolversObject<{
  endDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  startDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type DisclosureContentResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['DisclosureContent'] = ResolversParentTypes['DisclosureContent']> = ResolversObject<{
  glance?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  scan?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  study?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DiscoveryAnalyticsResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['DiscoveryAnalytics'] = ResolversParentTypes['DiscoveryAnalytics']> = ResolversObject<{
  impressions?: Resolver<ResolversTypes['ImpressionMetrics'], ParentType, ContextType>;
  missedQueries?: Resolver<Array<ResolversTypes['SearchQueryInsight']>, ParentType, ContextType>;
  profileEngagement?: Resolver<ResolversTypes['ProfileEngagement'], ParentType, ContextType>;
  queriesLeadingToYou?: Resolver<Array<ResolversTypes['SearchQueryInsight']>, ParentType, ContextType>;
  recommendations?: Resolver<Array<ResolversTypes['DiscoveryRecommendation']>, ParentType, ContextType>;
  valuesPerformance?: Resolver<Array<ResolversTypes['ValuePerformance']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DiscoveryRecommendationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['DiscoveryRecommendation'] = ResolversParentTypes['DiscoveryRecommendation']> = ResolversObject<{
  actionLabel?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  actionRoute?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  potentialImpact?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  priority?: Resolver<ResolversTypes['RecommendationPriority'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['RecommendationType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EfficacyIndicatorResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['EfficacyIndicator'] = ResolversParentTypes['EfficacyIndicator']> = ResolversObject<{
  atomId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  baselineValue?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  evidenceLevel?: Resolver<Maybe<ResolversTypes['EvidenceLevel']>, ParentType, ContextType>;
  goldilocksZone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  indicatorName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  measurementType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  optimalMax?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  optimalMin?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  targetValue?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  timeToEffect?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  unit?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EfficacySummaryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['EfficacySummary'] = ResolversParentTypes['EfficacySummary']> = ResolversObject<{
  averageImprovement?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  highQualityCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  indicators?: Resolver<Array<ResolversTypes['EfficacyIndicator']>, ParentType, ContextType>;
  shortestTimeframe?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ErrorResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Error'] = ResolversParentTypes['Error']> = ResolversObject<{
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  field?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EvidenceSummaryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['EvidenceSummary'] = ResolversParentTypes['EvidenceSummary']> = ResolversObject<{
  averageEvidenceStrength?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  claimsByLevel?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  highestEvidenceLevel?: Resolver<Maybe<ResolversTypes['EvidenceLevel']>, ParentType, ContextType>;
  totalClaims?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FinancialMetricsResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['FinancialMetrics'] = ResolversParentTypes['FinancialMetrics']> = ResolversObject<{
  averageOrderValue?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  churnRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  conversionRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  customerLifetimeValue?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  growthRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  monthlyRecurringRevenue?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  retentionRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  revenueByPeriod?: Resolver<Array<ResolversTypes['RevenuePeriod']>, ParentType, ContextType>;
  totalRevenue?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FulfillmentInfoResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['FulfillmentInfo'] = ResolversParentTypes['FulfillmentInfo']> = ResolversObject<{
  actualDelivery?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  carrier?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  estimatedDelivery?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  trackingNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  trackingUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FulfillmentSettingsResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['FulfillmentSettings'] = ResolversParentTypes['FulfillmentSettings']> = ResolversObject<{
  freeShippingThreshold?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  handlingTime?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  returnPolicy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  shippingMethods?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GeographicRegionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['GeographicRegion'] = ResolversParentTypes['GeographicRegion']> = ResolversObject<{
  customers?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  region?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  revenue?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GoldilocksParameterResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['GoldilocksParameter'] = ResolversParentTypes['GoldilocksParameter']> = ResolversObject<{
  absoluteMax?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  absoluteMin?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  atomId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  context?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  evidenceLevel?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  optimalMax?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  optimalMin?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  parameterName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  parameterUnit?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  skinType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sourceType?: Resolver<Maybe<ResolversTypes['SourceType']>, ParentType, ContextType>;
  sourceUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ImpressionMetricsResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ImpressionMetrics'] = ResolversParentTypes['ImpressionMetrics']> = ResolversObject<{
  bySource?: Resolver<ResolversTypes['ImpressionsBySource'], ParentType, ContextType>;
  percentChange?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  trend?: Resolver<ResolversTypes['TrendIndicator'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ImpressionsBySourceResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ImpressionsBySource'] = ResolversParentTypes['ImpressionsBySource']> = ResolversObject<{
  browse?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  direct?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  recommendation?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  search?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  values?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type IngredientResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Ingredient'] = ResolversParentTypes['Ingredient']> = ResolversObject<{
  concentration?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  function?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  warnings?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type IngredientAnalysisResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['IngredientAnalysis'] = ResolversParentTypes['IngredientAnalysis']> = ResolversObject<{
  avgEfficacyScore?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  ingredient?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  productCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  satisfaction?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  usage?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type IngredientInteractionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['IngredientInteraction'] = ResolversParentTypes['IngredientInteraction']> = ResolversObject<{
  atomA?: Resolver<ResolversTypes['SkincareAtom'], ParentType, ContextType>;
  atomB?: Resolver<ResolversTypes['SkincareAtom'], ParentType, ContextType>;
  conflictType?: Resolver<Maybe<ResolversTypes['ConflictType']>, ParentType, ContextType>;
  interactionType?: Resolver<ResolversTypes['InteractionType'], ParentType, ContextType>;
  mechanism?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  recommendation?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  severity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  synergyType?: Resolver<Maybe<ResolversTypes['SynergyType']>, ParentType, ContextType>;
  waitTime?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type IngredientListResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['IngredientList'] = ResolversParentTypes['IngredientList']> = ResolversObject<{
  actives?: Resolver<Array<ResolversTypes['ActiveIngredient']>, ParentType, ContextType>;
  allergens?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  crueltyFree?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  inci?: Resolver<Array<ResolversTypes['Ingredient']>, ParentType, ContextType>;
  vegan?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type InsightEngineResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['InsightEngine'] = ResolversParentTypes['InsightEngine']> = ResolversObject<{
  actionableRecommendations?: Resolver<Array<ResolversTypes['ActionableRecommendation']>, ParentType, ContextType>;
  anomalyDetection?: Resolver<Array<ResolversTypes['AnomalyInsight']>, ParentType, ContextType>;
  businessAlerts?: Resolver<Array<ResolversTypes['BusinessAlert']>, ParentType, ContextType>;
  generatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  predictiveInsights?: Resolver<Array<ResolversTypes['PredictiveInsight']>, ParentType, ContextType>;
  trendAnalysis?: Resolver<Array<ResolversTypes['TrendInsight']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type InsuranceInfoResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['InsuranceInfo'] = ResolversParentTypes['InsuranceInfo']> = ResolversObject<{
  coverage?: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  documentUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  expirationDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  policyNumber?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  provider?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type IntelligenceSearchResponseResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['IntelligenceSearchResponse'] = ResolversParentTypes['IntelligenceSearchResponse']> = ResolversObject<{
  executionTimeMs?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  results?: Resolver<Array<ResolversTypes['IntelligenceSearchResult']>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type IntelligenceSearchResultResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['IntelligenceSearchResult'] = ResolversParentTypes['IntelligenceSearchResult']> = ResolversObject<{
  atom?: Resolver<ResolversTypes['SkincareAtom'], ParentType, ContextType>;
  combinedScore?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  evidenceStrength?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  knowledgeThreshold?: Resolver<Maybe<ResolversTypes['KnowledgeThreshold']>, ParentType, ContextType>;
  semanticScore?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  tensorScore?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type JobStatusResponseResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['JobStatusResponse'] = ResolversParentTypes['JobStatusResponse']> = ResolversObject<{
  jobId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['JobStatus'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type JourneyStageResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['JourneyStage'] = ResolversParentTypes['JourneyStage']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  percentage?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  stage?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LicenseInfoResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['LicenseInfo'] = ResolversParentTypes['LicenseInfo']> = ResolversObject<{
  expirationDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  number?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  state?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['LicenseType'], ParentType, ContextType>;
  verified?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  verifiedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  verifiedBy?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LocationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Location'] = ResolversParentTypes['Location']> = ResolversObject<{
  address?: Resolver<ResolversTypes['Address'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isActive?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  operatingHours?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  serviceProviders?: Resolver<Array<ResolversTypes['ServiceProvider']>, ParentType, ContextType>;
  spaOrganizationId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  timezone?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MarketingCampaignResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['MarketingCampaign'] = ResolversParentTypes['MarketingCampaign']> = ResolversObject<{
  audienceDetails?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  audienceSize?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  budgetDollars?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  budgetUtilization?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  clicks?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  conversionRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  conversions?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  cpcDollars?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  ctr?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  endDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  impressions?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  metadata?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  revenueDollars?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  roas?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  spentDollars?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  startDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['CampaignStatus'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['CampaignType'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  vendorId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MarketingCampaignResultResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['MarketingCampaignResult'] = ResolversParentTypes['MarketingCampaignResult']> = ResolversObject<{
  campaign?: Resolver<Maybe<ResolversTypes['MarketingCampaign']>, ParentType, ContextType>;
  errors?: Resolver<Maybe<Array<ResolversTypes['VendorPortalError']>>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MoneyResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Money'] = ResolversParentTypes['Money']> = ResolversObject<{
  amount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  currency?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  acceptAnswer?: Resolver<ResolversTypes['CommunityComment'], ParentType, ContextType, RequireFields<MutationAcceptAnswerArgs, 'commentId'>>;
  acknowledgeAlert?: Resolver<ResolversTypes['BusinessAlert'], ParentType, ContextType, RequireFields<MutationAcknowledgeAlertArgs, 'input'>>;
  addCertification?: Resolver<ResolversTypes['CertificationResult'], ParentType, ContextType, RequireFields<MutationAddCertificationArgs, 'input'>>;
  addShippingInfo?: Resolver<ResolversTypes['VendorOrder'], ParentType, ContextType, RequireFields<MutationAddShippingInfoArgs, 'input'>>;
  approveVendorOrganization?: Resolver<ResolversTypes['VendorOrganizationResult'], ParentType, ContextType, RequireFields<MutationApproveVendorOrganizationArgs, 'decision' | 'id'>>;
  archiveConversation?: Resolver<ResolversTypes['Conversation'], ParentType, ContextType, RequireFields<MutationArchiveConversationArgs, 'conversationId'>>;
  assignApplicationReviewer?: Resolver<ResolversTypes['VendorApplicationResult'], ParentType, ContextType, RequireFields<MutationAssignApplicationReviewerArgs, 'applicationId' | 'reviewerId'>>;
  bulkUpdateTaxonomy?: Resolver<ResolversTypes['BulkTaxonomyResult'], ParentType, ContextType, RequireFields<MutationBulkUpdateTaxonomyArgs, 'updates'>>;
  cancelAppointment?: Resolver<ResolversTypes['AppointmentResult'], ParentType, ContextType, RequireFields<MutationCancelAppointmentArgs, 'id'>>;
  cancelEvent?: Resolver<ResolversTypes['CommunityEvent'], ParentType, ContextType, RequireFields<MutationCancelEventArgs, 'id'>>;
  cancelRegistration?: Resolver<ResolversTypes['CommunityEvent'], ParentType, ContextType, RequireFields<MutationCancelRegistrationArgs, 'eventId'>>;
  checkInAppointment?: Resolver<ResolversTypes['AppointmentResult'], ParentType, ContextType, RequireFields<MutationCheckInAppointmentArgs, 'id'>>;
  completeAppointment?: Resolver<ResolversTypes['AppointmentResult'], ParentType, ContextType, RequireFields<MutationCompleteAppointmentArgs, 'id' | 'input'>>;
  completeOnboardingStep?: Resolver<ResolversTypes['OnboardingStepResult'], ParentType, ContextType, RequireFields<MutationCompleteOnboardingStepArgs, 'input'>>;
  createAppointment?: Resolver<ResolversTypes['AppointmentResult'], ParentType, ContextType, RequireFields<MutationCreateAppointmentArgs, 'input'>>;
  createCampaign?: Resolver<ResolversTypes['MarketingCampaignResult'], ParentType, ContextType, RequireFields<MutationCreateCampaignArgs, 'input'>>;
  createClient?: Resolver<ResolversTypes['ClientResult'], ParentType, ContextType, RequireFields<MutationCreateClientArgs, 'input'>>;
  createComment?: Resolver<ResolversTypes['CommunityComment'], ParentType, ContextType, RequireFields<MutationCreateCommentArgs, 'content' | 'postId'>>;
  createConversation?: Resolver<ResolversTypes['Conversation'], ParentType, ContextType, RequireFields<MutationCreateConversationArgs, 'input'>>;
  createEvent?: Resolver<ResolversTypes['CommunityEvent'], ParentType, ContextType, RequireFields<MutationCreateEventArgs, 'input'>>;
  createMockProduct?: Resolver<ResolversTypes['ProductResult'], ParentType, ContextType, RequireFields<MutationCreateMockProductArgs, 'vendorOrganizationId'>>;
  createPost?: Resolver<ResolversTypes['CommunityPost'], ParentType, ContextType, RequireFields<MutationCreatePostArgs, 'input'>>;
  createProduct?: Resolver<ResolversTypes['ProductResult'], ParentType, ContextType, RequireFields<MutationCreateProductArgs, 'input'>>;
  createProductTaxonomy?: Resolver<ResolversTypes['ProductTaxonomy'], ParentType, ContextType, RequireFields<MutationCreateProductTaxonomyArgs, 'input'>>;
  createSpaOrganization?: Resolver<ResolversTypes['SpaOrganizationResult'], ParentType, ContextType, RequireFields<MutationCreateSpaOrganizationArgs, 'input'>>;
  createVendorOrganization?: Resolver<ResolversTypes['VendorOrganizationResult'], ParentType, ContextType, RequireFields<MutationCreateVendorOrganizationArgs, 'input'>>;
  createVendorProfile?: Resolver<ResolversTypes['VendorProfileResult'], ParentType, ContextType, RequireFields<MutationCreateVendorProfileArgs, 'input'>>;
  deleteCampaign?: Resolver<ResolversTypes['MarketingCampaignResult'], ParentType, ContextType, RequireFields<MutationDeleteCampaignArgs, 'campaignId'>>;
  deleteComment?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteCommentArgs, 'id'>>;
  deletePost?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeletePostArgs, 'id'>>;
  deleteProductTaxonomy?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteProductTaxonomyArgs, 'productId'>>;
  deleteScheduledReport?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteScheduledReportArgs, 'id'>>;
  flagMessage?: Resolver<ResolversTypes['ConversationMessage'], ParentType, ContextType, RequireFields<MutationFlagMessageArgs, 'messageId' | 'reason'>>;
  generateAllProductEmbeddings?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  generateProductEmbedding?: Resolver<ResolversTypes['JobStatusResponse'], ParentType, ContextType, RequireFields<MutationGenerateProductEmbeddingArgs, 'productId'>>;
  generateProductTensor?: Resolver<ResolversTypes['JobStatusResponse'], ParentType, ContextType, RequireFields<MutationGenerateProductTensorArgs, 'productId'>>;
  generateReport?: Resolver<ResolversTypes['Report'], ParentType, ContextType, RequireFields<MutationGenerateReportArgs, 'input'>>;
  intelligenceAddClaimEvidence?: Resolver<ResolversTypes['ClaimEvidence'], ParentType, ContextType, RequireFields<MutationIntelligenceAddClaimEvidenceArgs, 'atomId' | 'input'>>;
  intelligenceAddEfficacyIndicator?: Resolver<ResolversTypes['EfficacyIndicator'], ParentType, ContextType, RequireFields<MutationIntelligenceAddEfficacyIndicatorArgs, 'atomId' | 'input'>>;
  intelligenceBatchSyncEmbeddings?: Resolver<ResolversTypes['JSON'], ParentType, ContextType, RequireFields<MutationIntelligenceBatchSyncEmbeddingsArgs, 'atomIds'>>;
  intelligenceDeleteClaimEvidence?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationIntelligenceDeleteClaimEvidenceArgs, 'id'>>;
  intelligenceDeleteEfficacyIndicator?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationIntelligenceDeleteEfficacyIndicatorArgs, 'id'>>;
  intelligenceSetAtomThreshold?: Resolver<ResolversTypes['SkincareAtom'], ParentType, ContextType, RequireFields<MutationIntelligenceSetAtomThresholdArgs, 'atomId' | 'threshold'>>;
  intelligenceSetWhyItWorks?: Resolver<ResolversTypes['SkincareAtom'], ParentType, ContextType, RequireFields<MutationIntelligenceSetWhyItWorksArgs, 'atomId' | 'whyItWorks'>>;
  intelligenceSyncEmbedding?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationIntelligenceSyncEmbeddingArgs, 'atomId'>>;
  intelligenceUpdateClaimEvidence?: Resolver<ResolversTypes['ClaimEvidence'], ParentType, ContextType, RequireFields<MutationIntelligenceUpdateClaimEvidenceArgs, 'id' | 'input'>>;
  intelligenceUpdateEfficacyIndicator?: Resolver<ResolversTypes['EfficacyIndicator'], ParentType, ContextType, RequireFields<MutationIntelligenceUpdateEfficacyIndicatorArgs, 'id' | 'input'>>;
  joinSanctuary?: Resolver<ResolversTypes['SanctuaryMember'], ParentType, ContextType, RequireFields<MutationJoinSanctuaryArgs, 'displayName'>>;
  likeComment?: Resolver<ResolversTypes['CommunityComment'], ParentType, ContextType, RequireFields<MutationLikeCommentArgs, 'id'>>;
  likePost?: Resolver<ResolversTypes['CommunityPost'], ParentType, ContextType, RequireFields<MutationLikePostArgs, 'id'>>;
  login?: Resolver<ResolversTypes['AuthResult'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'input'>>;
  logout?: Resolver<ResolversTypes['SuccessResponse'], ParentType, ContextType>;
  markConversationAsRead?: Resolver<ResolversTypes['Conversation'], ParentType, ContextType, RequireFields<MutationMarkConversationAsReadArgs, 'conversationId'>>;
  recordAnalyticsEvent?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationRecordAnalyticsEventArgs, 'eventData' | 'eventType'>>;
  refreshToken?: Resolver<ResolversTypes['AuthResult'], ParentType, ContextType, RequireFields<MutationRefreshTokenArgs, 'refreshToken'>>;
  register?: Resolver<ResolversTypes['AuthResult'], ParentType, ContextType, RequireFields<MutationRegisterArgs, 'input'>>;
  registerForEvent?: Resolver<ResolversTypes['CommunityEvent'], ParentType, ContextType, RequireFields<MutationRegisterForEventArgs, 'eventId'>>;
  removeCertification?: Resolver<ResolversTypes['CertificationResult'], ParentType, ContextType, RequireFields<MutationRemoveCertificationArgs, 'certificationId'>>;
  requestPasswordReset?: Resolver<ResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<MutationRequestPasswordResetArgs, 'email'>>;
  resetPassword?: Resolver<ResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<MutationResetPasswordArgs, 'input'>>;
  resetUserSettings?: Resolver<ResolversTypes['UserSettingsResult'], ParentType, ContextType>;
  reviewVendorApplication?: Resolver<ResolversTypes['VendorApplicationResult'], ParentType, ContextType, RequireFields<MutationReviewVendorApplicationArgs, 'input'>>;
  scheduleReport?: Resolver<ResolversTypes['ScheduledReport'], ParentType, ContextType, RequireFields<MutationScheduleReportArgs, 'input'>>;
  sendMessage?: Resolver<ResolversTypes['ConversationMessage'], ParentType, ContextType, RequireFields<MutationSendMessageArgs, 'input'>>;
  skaCreateAtom?: Resolver<ResolversTypes['SkincareAtom'], ParentType, ContextType, RequireFields<MutationSkaCreateAtomArgs, 'atomType' | 'glanceText' | 'pillarId' | 'scanText' | 'slug' | 'studyText' | 'title'>>;
  skaCreateRelationship?: Resolver<ResolversTypes['SkincareRelationship'], ParentType, ContextType, RequireFields<MutationSkaCreateRelationshipArgs, 'fromAtomId' | 'relationshipType' | 'toAtomId'>>;
  skaDeleteAtom?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationSkaDeleteAtomArgs, 'id'>>;
  skaDeleteRelationship?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationSkaDeleteRelationshipArgs, 'id'>>;
  skaGenerateTensor17D?: Resolver<ResolversTypes['SkincareAtomTensor'], ParentType, ContextType, RequireFields<MutationSkaGenerateTensor17DArgs, 'atomId' | 'tensor'>>;
  skaSetGoldilocksParameter?: Resolver<ResolversTypes['GoldilocksParameter'], ParentType, ContextType, RequireFields<MutationSkaSetGoldilocksParameterArgs, 'atomId' | 'optimalMax' | 'optimalMin' | 'parameterName'>>;
  skaUpdateAtom?: Resolver<ResolversTypes['SkincareAtom'], ParentType, ContextType, RequireFields<MutationSkaUpdateAtomArgs, 'id'>>;
  skipOnboardingStep?: Resolver<ResolversTypes['OnboardingStepResult'], ParentType, ContextType, RequireFields<MutationSkipOnboardingStepArgs, 'stepId'>>;
  submitVendorApplication?: Resolver<ResolversTypes['VendorApplicationResult'], ParentType, ContextType, RequireFields<MutationSubmitVendorApplicationArgs, 'input'>>;
  unlikeComment?: Resolver<ResolversTypes['CommunityComment'], ParentType, ContextType, RequireFields<MutationUnlikeCommentArgs, 'id'>>;
  unlikePost?: Resolver<ResolversTypes['CommunityPost'], ParentType, ContextType, RequireFields<MutationUnlikePostArgs, 'id'>>;
  updateAppPreferences?: Resolver<ResolversTypes['UserSettingsResult'], ParentType, ContextType, RequireFields<MutationUpdateAppPreferencesArgs, 'input'>>;
  updateAppointment?: Resolver<ResolversTypes['AppointmentResult'], ParentType, ContextType, RequireFields<MutationUpdateAppointmentArgs, 'id' | 'input'>>;
  updateCampaign?: Resolver<ResolversTypes['MarketingCampaignResult'], ParentType, ContextType, RequireFields<MutationUpdateCampaignArgs, 'input'>>;
  updateCampaignMetrics?: Resolver<ResolversTypes['MarketingCampaignResult'], ParentType, ContextType, RequireFields<MutationUpdateCampaignMetricsArgs, 'input'>>;
  updateClient?: Resolver<ResolversTypes['ClientResult'], ParentType, ContextType, RequireFields<MutationUpdateClientArgs, 'id' | 'input'>>;
  updateComment?: Resolver<ResolversTypes['CommunityComment'], ParentType, ContextType, RequireFields<MutationUpdateCommentArgs, 'content' | 'id'>>;
  updateEvent?: Resolver<ResolversTypes['CommunityEvent'], ParentType, ContextType, RequireFields<MutationUpdateEventArgs, 'id' | 'input'>>;
  updateNotificationSettings?: Resolver<ResolversTypes['UserSettingsResult'], ParentType, ContextType, RequireFields<MutationUpdateNotificationSettingsArgs, 'input'>>;
  updateOrderStatus?: Resolver<ResolversTypes['VendorOrder'], ParentType, ContextType, RequireFields<MutationUpdateOrderStatusArgs, 'input'>>;
  updatePost?: Resolver<ResolversTypes['CommunityPost'], ParentType, ContextType, RequireFields<MutationUpdatePostArgs, 'id' | 'input'>>;
  updateProduct?: Resolver<ResolversTypes['ProductResult'], ParentType, ContextType, RequireFields<MutationUpdateProductArgs, 'id' | 'input'>>;
  updateProductTaxonomy?: Resolver<ResolversTypes['ProductTaxonomy'], ParentType, ContextType, RequireFields<MutationUpdateProductTaxonomyArgs, 'input'>>;
  updateProfile?: Resolver<ResolversTypes['UserResult'], ParentType, ContextType, RequireFields<MutationUpdateProfileArgs, 'input'>>;
  updateProfileSettings?: Resolver<ResolversTypes['UserSettingsResult'], ParentType, ContextType, RequireFields<MutationUpdateProfileSettingsArgs, 'input'>>;
  updateSanctuaryProfile?: Resolver<ResolversTypes['SanctuaryMember'], ParentType, ContextType, RequireFields<MutationUpdateSanctuaryProfileArgs, 'input'>>;
  updateScheduledReport?: Resolver<ResolversTypes['ScheduledReport'], ParentType, ContextType, RequireFields<MutationUpdateScheduledReportArgs, 'id' | 'input'>>;
  updateSpaOrganization?: Resolver<ResolversTypes['SpaOrganizationResult'], ParentType, ContextType, RequireFields<MutationUpdateSpaOrganizationArgs, 'id' | 'input'>>;
  updateUserSettings?: Resolver<ResolversTypes['UserSettingsResult'], ParentType, ContextType, RequireFields<MutationUpdateUserSettingsArgs, 'input'>>;
  updateVendorOrganization?: Resolver<ResolversTypes['VendorOrganizationResult'], ParentType, ContextType, RequireFields<MutationUpdateVendorOrganizationArgs, 'id' | 'input'>>;
  updateVendorProfile?: Resolver<ResolversTypes['VendorProfileResult'], ParentType, ContextType, RequireFields<MutationUpdateVendorProfileArgs, 'input'>>;
  verifyCertification?: Resolver<ResolversTypes['CertificationResult'], ParentType, ContextType, RequireFields<MutationVerifyCertificationArgs, 'input'>>;
  viewPost?: Resolver<ResolversTypes['CommunityPost'], ParentType, ContextType, RequireFields<MutationViewPostArgs, 'id'>>;
}>;

export type NotificationSettingsResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['NotificationSettings'] = ResolversParentTypes['NotificationSettings']> = ResolversObject<{
  appointmentReminders?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  communityActivity?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  emailEnabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  marketingEmails?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  orderUpdates?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  productAnnouncements?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  pushEnabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  reminderHours?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  smsEnabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  weeklyDigest?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type OnboardingStepResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['OnboardingStep'] = ResolversParentTypes['OnboardingStep']> = ResolversObject<{
  completedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  helpArticleUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  onboardingId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  order?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  required?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['OnboardingStepStatus'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type OnboardingStepResultResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['OnboardingStepResult'] = ResolversParentTypes['OnboardingStepResult']> = ResolversObject<{
  errors?: Resolver<Maybe<Array<ResolversTypes['VendorPortalError']>>, ParentType, ContextType>;
  onboarding?: Resolver<Maybe<ResolversTypes['VendorOnboarding']>, ParentType, ContextType>;
  step?: Resolver<Maybe<ResolversTypes['OnboardingStep']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type OrderItemResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['OrderItem'] = ResolversParentTypes['OrderItem']> = ResolversObject<{
  imageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  productId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  productName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  sku?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  totalPrice?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  unitPrice?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type OrderMetricsResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['OrderMetrics'] = ResolversParentTypes['OrderMetrics']> = ResolversObject<{
  avgOrderValue?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  fromNewSpas?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  fromRepeatSpas?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  percentChange?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  trend?: Resolver<ResolversTypes['TrendIndicator'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type OrderStatusCountsResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['OrderStatusCounts'] = ResolversParentTypes['OrderStatusCounts']> = ResolversObject<{
  cancelled?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  confirmed?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  delivered?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  disputed?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  pending?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  processing?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  shipped?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PageInfoResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = ResolversObject<{
  endCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  startCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PredictionAccuracyMetricsResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['PredictionAccuracyMetrics'] = ResolversParentTypes['PredictionAccuracyMetrics']> = ResolversObject<{
  churnPrediction?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  ltvPrediction?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  replenishmentPrediction?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PredictionFactorResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['PredictionFactor'] = ResolversParentTypes['PredictionFactor']> = ResolversObject<{
  factor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  weight?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PredictiveInsightResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['PredictiveInsight'] = ResolversParentTypes['PredictiveInsight']> = ResolversObject<{
  confidence?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  factors?: Resolver<Array<ResolversTypes['PredictionFactor']>, ParentType, ContextType>;
  impact?: Resolver<ResolversTypes['SignificanceLevel'], ParentType, ContextType>;
  prediction?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  recommendation?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  timeframe?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ProductResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Product'] = ResolversParentTypes['Product']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  embeddingGenerated?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  glance?: Resolver<ResolversTypes['ProductGlance'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  scan?: Resolver<ResolversTypes['ProductScan'], ParentType, ContextType>;
  study?: Resolver<Maybe<ResolversTypes['ProductStudy']>, ParentType, ContextType>;
  taxonomy?: Resolver<Maybe<ResolversTypes['ProductTaxonomy']>, ParentType, ContextType>;
  tensorGenerated?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  vendorOrganization?: Resolver<ResolversTypes['VendorOrganization'], ParentType, ContextType>;
  vendureProductId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ProductCategoryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ProductCategory'] = ResolversParentTypes['ProductCategory']> = ResolversObject<{
  children?: Resolver<Array<ResolversTypes['ProductCategory']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  displayOrder?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  fullPath?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isActive?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  level?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  parent?: Resolver<Maybe<ResolversTypes['ProductCategory']>, ParentType, ContextType>;
  productCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  seoSlug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ProductConnectionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ProductConnection'] = ResolversParentTypes['ProductConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['ProductEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ProductEdgeResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ProductEdge'] = ResolversParentTypes['ProductEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Product'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ProductFormatResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ProductFormat'] = ResolversParentTypes['ProductFormat']> = ResolversObject<{
  category?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isActive?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  productCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ProductFunctionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ProductFunction'] = ResolversParentTypes['ProductFunction']> = ResolversObject<{
  categoryCompatibility?: Resolver<Maybe<Array<ResolversTypes['ID']>>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  displayOrder?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isActive?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  productCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ProductGlanceResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ProductGlance'] = ResolversParentTypes['ProductGlance']> = ResolversObject<{
  heroBenefit?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  rating?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  reviewCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  skinTypes?: Resolver<Array<ResolversTypes['SkinType']>, ParentType, ContextType>;
  thumbnail?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ProductMetricsResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ProductMetrics'] = ResolversParentTypes['ProductMetrics']> = ResolversObject<{
  categoryPerformance?: Resolver<Array<ResolversTypes['CategoryPerformance']>, ParentType, ContextType>;
  crossSellOpportunities?: Resolver<Array<ResolversTypes['CrossSellPair']>, ParentType, ContextType>;
  topPerformers?: Resolver<Array<ResolversTypes['ProductPerformance']>, ParentType, ContextType>;
  totalCatalog?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  underPerformers?: Resolver<Array<ResolversTypes['ProductPerformance']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ProductPerformanceResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ProductPerformance'] = ResolversParentTypes['ProductPerformance']> = ResolversObject<{
  addToCartClicks?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  category?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  conversionRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  orderCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  price?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  productId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  productName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  productSku?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  returnRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  revenue?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  uniqueSpas?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  unitsSold?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  views?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ProductRegionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ProductRegion'] = ResolversParentTypes['ProductRegion']> = ResolversObject<{
  countryCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isActive?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  productCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ProductResultResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ProductResult'] = ResolversParentTypes['ProductResult']> = ResolversObject<{
  errors?: Resolver<Maybe<Array<ResolversTypes['Error']>>, ParentType, ContextType>;
  product?: Resolver<Maybe<ResolversTypes['Product']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ProductScanResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ProductScan'] = ResolversParentTypes['ProductScan']> = ResolversObject<{
  images?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  ingredients?: Resolver<ResolversTypes['IngredientList'], ParentType, ContextType>;
  keyActives?: Resolver<Array<ResolversTypes['ActiveIngredient']>, ParentType, ContextType>;
  usageInstructions?: Resolver<ResolversTypes['UsageInstructions'], ParentType, ContextType>;
  warnings?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ProductStudyResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ProductStudy'] = ResolversParentTypes['ProductStudy']> = ResolversObject<{
  clinicalData?: Resolver<Maybe<ResolversTypes['ClinicalData']>, ParentType, ContextType>;
  contraindications?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  detailedSteps?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  expectedResults?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  formulationScience?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  professionalNotes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  timeToResults?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ProductTaxonomyResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ProductTaxonomy'] = ResolversParentTypes['ProductTaxonomy']> = ResolversObject<{
  category?: Resolver<Maybe<ResolversTypes['ProductCategory']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  formulationBase?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastReviewedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  primaryFunctions?: Resolver<Array<ResolversTypes['ProductFunction']>, ParentType, ContextType>;
  productFormat?: Resolver<Maybe<ResolversTypes['ProductFormat']>, ParentType, ContextType>;
  productId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  professionalLevel?: Resolver<ResolversTypes['ProfessionalLevel'], ParentType, ContextType>;
  protocolRequired?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  region?: Resolver<Maybe<ResolversTypes['ProductRegion']>, ParentType, ContextType>;
  reviewedBy?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  skinConcerns?: Resolver<Array<ResolversTypes['SkinConcern']>, ParentType, ContextType>;
  targetAreas?: Resolver<Array<ResolversTypes['TargetArea']>, ParentType, ContextType>;
  taxonomyCompletenessScore?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  usageTime?: Resolver<ResolversTypes['UsageTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ProductUsageResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ProductUsage'] = ResolversParentTypes['ProductUsage']> = ResolversObject<{
  notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  product?: Resolver<ResolversTypes['Product'], ParentType, ContextType>;
  productId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  quantity?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ProfileEngagementResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ProfileEngagement'] = ResolversParentTypes['ProfileEngagement']> = ResolversObject<{
  avgTimeOnProfile?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  bounceRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  catalogBrowses?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  contactClicks?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  productClicks?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  profileViews?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ProfileSettingsResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ProfileSettings'] = ResolversParentTypes['ProfileSettings']> = ResolversObject<{
  dateFormat?: Resolver<ResolversTypes['DateFormat'], ParentType, ContextType>;
  displayName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  language?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phoneNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phoneVerified?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  timeFormat?: Resolver<ResolversTypes['TimeFormat'], ParentType, ContextType>;
  timezone?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PurgeAnalysisResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['PurgeAnalysis'] = ResolversParentTypes['PurgeAnalysis']> = ResolversObject<{
  activeCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  avgDurationDays?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  completedCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  successRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  adminVendorApplications?: Resolver<Array<ResolversTypes['VendorApplication']>, ParentType, ContextType, Partial<QueryAdminVendorApplicationsArgs>>;
  appointment?: Resolver<Maybe<ResolversTypes['Appointment']>, ParentType, ContextType, RequireFields<QueryAppointmentArgs, 'id'>>;
  appointments?: Resolver<ResolversTypes['AppointmentConnection'], ParentType, ContextType, Partial<QueryAppointmentsArgs>>;
  buildSkincareRoutine?: Resolver<ResolversTypes['SkincareRoutine'], ParentType, ContextType, RequireFields<QueryBuildSkincareRoutineArgs, 'profile'>>;
  businessAlert?: Resolver<Maybe<ResolversTypes['BusinessAlert']>, ParentType, ContextType, RequireFields<QueryBusinessAlertArgs, 'id'>>;
  businessAlerts?: Resolver<Array<ResolversTypes['BusinessAlert']>, ParentType, ContextType, Partial<QueryBusinessAlertsArgs>>;
  businessInsights?: Resolver<ResolversTypes['InsightEngine'], ParentType, ContextType, Partial<QueryBusinessInsightsArgs>>;
  businessMetrics?: Resolver<ResolversTypes['BusinessMetrics'], ParentType, ContextType, Partial<QueryBusinessMetricsArgs>>;
  campaignPerformanceSummary?: Resolver<ResolversTypes['CampaignPerformanceSummary'], ParentType, ContextType, RequireFields<QueryCampaignPerformanceSummaryArgs, 'dateRange'>>;
  client?: Resolver<Maybe<ResolversTypes['Client']>, ParentType, ContextType, RequireFields<QueryClientArgs, 'id'>>;
  clients?: Resolver<ResolversTypes['ClientConnection'], ParentType, ContextType, RequireFields<QueryClientsArgs, 'spaOrganizationId'>>;
  communityEvent?: Resolver<Maybe<ResolversTypes['CommunityEvent']>, ParentType, ContextType, RequireFields<QueryCommunityEventArgs, 'id'>>;
  communityEvents?: Resolver<ResolversTypes['CommunityEventConnection'], ParentType, ContextType, Partial<QueryCommunityEventsArgs>>;
  communityPost?: Resolver<Maybe<ResolversTypes['CommunityPost']>, ParentType, ContextType, RequireFields<QueryCommunityPostArgs, 'id'>>;
  communityPosts?: Resolver<ResolversTypes['CommunityPostConnection'], ParentType, ContextType, Partial<QueryCommunityPostsArgs>>;
  conversation?: Resolver<Maybe<ResolversTypes['Conversation']>, ParentType, ContextType, RequireFields<QueryConversationArgs, 'id'>>;
  conversationMessages?: Resolver<ResolversTypes['ConversationMessagesResponse'], ParentType, ContextType, RequireFields<QueryConversationMessagesArgs, 'conversationId'>>;
  dashboardSummary?: Resolver<ResolversTypes['DashboardSummary'], ParentType, ContextType, Partial<QueryDashboardSummaryArgs>>;
  discoveryAnalytics?: Resolver<ResolversTypes['DiscoveryAnalytics'], ParentType, ContextType, RequireFields<QueryDiscoveryAnalyticsArgs, 'dateRange'>>;
  featuredPosts?: Resolver<Array<ResolversTypes['CommunityPost']>, ParentType, ContextType, Partial<QueryFeaturedPostsArgs>>;
  findSimilarSkincareProducts?: Resolver<Array<ResolversTypes['SkincareProduct']>, ParentType, ContextType, RequireFields<QueryFindSimilarSkincareProductsArgs, 'productId'>>;
  intelligenceAnalyzeCompatibility?: Resolver<ResolversTypes['CompatibilityResult'], ParentType, ContextType, RequireFields<QueryIntelligenceAnalyzeCompatibilityArgs, 'atomIds'>>;
  intelligenceAtom?: Resolver<ResolversTypes['AtomWithIntelligence'], ParentType, ContextType, RequireFields<QueryIntelligenceAtomArgs, 'atomId'>>;
  intelligenceCausalChain?: Resolver<Array<ResolversTypes['CausalChainNode']>, ParentType, ContextType, RequireFields<QueryIntelligenceCausalChainArgs, 'atomId' | 'direction'>>;
  intelligenceCheckAccess?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<QueryIntelligenceCheckAccessArgs, 'accessLevel' | 'threshold'>>;
  intelligenceClaimEvidence?: Resolver<Array<ResolversTypes['ClaimEvidence']>, ParentType, ContextType, RequireFields<QueryIntelligenceClaimEvidenceArgs, 'atomId'>>;
  intelligenceEfficacyIndicators?: Resolver<Array<ResolversTypes['EfficacyIndicator']>, ParentType, ContextType, RequireFields<QueryIntelligenceEfficacyIndicatorsArgs, 'atomId'>>;
  intelligenceEfficacySummary?: Resolver<ResolversTypes['EfficacySummary'], ParentType, ContextType, RequireFields<QueryIntelligenceEfficacySummaryArgs, 'atomId'>>;
  intelligenceEvidenceSummary?: Resolver<ResolversTypes['EvidenceSummary'], ParentType, ContextType, RequireFields<QueryIntelligenceEvidenceSummaryArgs, 'atomId'>>;
  intelligenceFindPath?: Resolver<Array<ResolversTypes['CausalPathStep']>, ParentType, ContextType, RequireFields<QueryIntelligenceFindPathArgs, 'fromAtomId' | 'toAtomId'>>;
  intelligenceFindSimilar?: Resolver<Array<ResolversTypes['IntelligenceSearchResult']>, ParentType, ContextType, RequireFields<QueryIntelligenceFindSimilarArgs, 'atomId'>>;
  intelligenceGoldilocksParameters?: Resolver<Array<ResolversTypes['GoldilocksParameter']>, ParentType, ContextType, RequireFields<QueryIntelligenceGoldilocksParametersArgs, 'atomId'>>;
  intelligenceMaxThreshold?: Resolver<ResolversTypes['KnowledgeThreshold'], ParentType, ContextType, RequireFields<QueryIntelligenceMaxThresholdArgs, 'accessLevel'>>;
  intelligenceSearch?: Resolver<ResolversTypes['IntelligenceSearchResponse'], ParentType, ContextType, RequireFields<QueryIntelligenceSearchArgs, 'query'>>;
  intelligenceWhyExplanation?: Resolver<Maybe<ResolversTypes['WhyExplanation']>, ParentType, ContextType, RequireFields<QueryIntelligenceWhyExplanationArgs, 'atomId'>>;
  me?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  mySanctuaryProfile?: Resolver<Maybe<ResolversTypes['SanctuaryMember']>, ParentType, ContextType>;
  mySettings?: Resolver<Maybe<ResolversTypes['UserSettings']>, ParentType, ContextType>;
  orderStatusCounts?: Resolver<ResolversTypes['OrderStatusCounts'], ParentType, ContextType>;
  product?: Resolver<Maybe<ResolversTypes['Product']>, ParentType, ContextType, RequireFields<QueryProductArgs, 'id'>>;
  productCategories?: Resolver<Array<ResolversTypes['ProductCategory']>, ParentType, ContextType, Partial<QueryProductCategoriesArgs>>;
  productCategory?: Resolver<Maybe<ResolversTypes['ProductCategory']>, ParentType, ContextType, Partial<QueryProductCategoryArgs>>;
  productCategoryBySlug?: Resolver<Maybe<ResolversTypes['ProductCategory']>, ParentType, ContextType, RequireFields<QueryProductCategoryBySlugArgs, 'slug'>>;
  productFormat?: Resolver<Maybe<ResolversTypes['ProductFormat']>, ParentType, ContextType, RequireFields<QueryProductFormatArgs, 'id'>>;
  productFormats?: Resolver<Array<ResolversTypes['ProductFormat']>, ParentType, ContextType, Partial<QueryProductFormatsArgs>>;
  productFunction?: Resolver<Maybe<ResolversTypes['ProductFunction']>, ParentType, ContextType, RequireFields<QueryProductFunctionArgs, 'id'>>;
  productFunctions?: Resolver<Array<ResolversTypes['ProductFunction']>, ParentType, ContextType, Partial<QueryProductFunctionsArgs>>;
  productPerformance?: Resolver<Array<ResolversTypes['ProductPerformance']>, ParentType, ContextType, RequireFields<QueryProductPerformanceArgs, 'dateRange' | 'limit'>>;
  productRegion?: Resolver<Maybe<ResolversTypes['ProductRegion']>, ParentType, ContextType, RequireFields<QueryProductRegionArgs, 'id'>>;
  productRegions?: Resolver<Array<ResolversTypes['ProductRegion']>, ParentType, ContextType, Partial<QueryProductRegionsArgs>>;
  productTaxonomies?: Resolver<Array<ResolversTypes['ProductTaxonomy']>, ParentType, ContextType, Partial<QueryProductTaxonomiesArgs>>;
  productTaxonomy?: Resolver<Maybe<ResolversTypes['ProductTaxonomy']>, ParentType, ContextType, RequireFields<QueryProductTaxonomyArgs, 'productId'>>;
  products?: Resolver<Array<ResolversTypes['Product']>, ParentType, ContextType, Partial<QueryProductsArgs>>;
  productsByVendor?: Resolver<Array<ResolversTypes['Product']>, ParentType, ContextType, RequireFields<QueryProductsByVendorArgs, 'vendorId'>>;
  recommendSkincareProducts?: Resolver<Array<ResolversTypes['SkincareProduct']>, ParentType, ContextType, RequireFields<QueryRecommendSkincareProductsArgs, 'profile'>>;
  relatedDiscussions?: Resolver<Array<ResolversTypes['CommunityPost']>, ParentType, ContextType, RequireFields<QueryRelatedDiscussionsArgs, 'skaAtomId'>>;
  report?: Resolver<Maybe<ResolversTypes['Report']>, ParentType, ContextType, RequireFields<QueryReportArgs, 'id'>>;
  reports?: Resolver<Array<ResolversTypes['Report']>, ParentType, ContextType, Partial<QueryReportsArgs>>;
  sanctuaryMember?: Resolver<Maybe<ResolversTypes['SanctuaryMember']>, ParentType, ContextType, RequireFields<QuerySanctuaryMemberArgs, 'id'>>;
  scheduledReports?: Resolver<Array<ResolversTypes['ScheduledReport']>, ParentType, ContextType>;
  searchProducts?: Resolver<Array<ResolversTypes['Product']>, ParentType, ContextType, Partial<QuerySearchProductsArgs>>;
  searchProductsAdvanced?: Resolver<ResolversTypes['ProductConnection'], ParentType, ContextType, Partial<QuerySearchProductsAdvancedArgs>>;
  searchProductsByText?: Resolver<Array<ResolversTypes['Product']>, ParentType, ContextType, RequireFields<QuerySearchProductsByTextArgs, 'limit' | 'query'>>;
  searchSkincareProducts?: Resolver<Array<ResolversTypes['SkincareProduct']>, ParentType, ContextType, RequireFields<QuerySearchSkincareProductsArgs, 'query'>>;
  similarProducts?: Resolver<Array<ResolversTypes['Product']>, ParentType, ContextType, RequireFields<QuerySimilarProductsArgs, 'limit' | 'productId'>>;
  skaCausalChain?: Resolver<ResolversTypes['SKACausalChain'], ParentType, ContextType, RequireFields<QuerySkaCausalChainArgs, 'atomId'>>;
  skaCheckCompatibility?: Resolver<ResolversTypes['SKACompatibilityResult'], ParentType, ContextType, RequireFields<QuerySkaCheckCompatibilityArgs, 'atomIds'>>;
  skaGetPurgingInfo?: Resolver<ResolversTypes['SKAPurgingInfo'], ParentType, ContextType, RequireFields<QuerySkaGetPurgingInfoArgs, 'atomId'>>;
  skaKnowledgeGraphStats?: Resolver<ResolversTypes['SKAKnowledgeGraphStats'], ParentType, ContextType>;
  skaQuickComplianceCheck?: Resolver<ResolversTypes['SKAQuickComplianceResult'], ParentType, ContextType, RequireFields<QuerySkaQuickComplianceCheckArgs, 'copy'>>;
  skaScoreCompliance?: Resolver<ResolversTypes['SKAComplianceScore'], ParentType, ContextType, RequireFields<QuerySkaScoreComplianceArgs, 'copy'>>;
  skaSearchAtoms?: Resolver<ResolversTypes['SKASearchResponse'], ParentType, ContextType, Partial<QuerySkaSearchAtomsArgs>>;
  skinConcern?: Resolver<Maybe<ResolversTypes['SkinConcern']>, ParentType, ContextType, RequireFields<QuerySkinConcernArgs, 'id'>>;
  skinConcerns?: Resolver<Array<ResolversTypes['SkinConcern']>, ParentType, ContextType, Partial<QuerySkinConcernsArgs>>;
  skincareAtom?: Resolver<Maybe<ResolversTypes['SkincareAtom']>, ParentType, ContextType, RequireFields<QuerySkincareAtomArgs, 'id'>>;
  skincareAtomByInci?: Resolver<Maybe<ResolversTypes['SkincareAtom']>, ParentType, ContextType, RequireFields<QuerySkincareAtomByInciArgs, 'inciName'>>;
  skincareAtomBySlug?: Resolver<Maybe<ResolversTypes['SkincareAtom']>, ParentType, ContextType, RequireFields<QuerySkincareAtomBySlugArgs, 'slug'>>;
  skincareCategories?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  skincareFilterOptions?: Resolver<ResolversTypes['SkincareFilterOptions'], ParentType, ContextType>;
  skincarePillar?: Resolver<Maybe<ResolversTypes['SkincarePillar']>, ParentType, ContextType, RequireFields<QuerySkincarePillarArgs, 'id'>>;
  skincarePillars?: Resolver<Array<ResolversTypes['SkincarePillar']>, ParentType, ContextType>;
  skincareProduct?: Resolver<Maybe<ResolversTypes['SkincareProduct']>, ParentType, ContextType, RequireFields<QuerySkincareProductArgs, 'id'>>;
  skincareProductsByCategory?: Resolver<Array<ResolversTypes['SkincareProduct']>, ParentType, ContextType, RequireFields<QuerySkincareProductsByCategoryArgs, 'category'>>;
  spaOrganization?: Resolver<Maybe<ResolversTypes['SpaOrganization']>, ParentType, ContextType, RequireFields<QuerySpaOrganizationArgs, 'id'>>;
  spaOrganizations?: Resolver<ResolversTypes['SpaOrganizationConnection'], ParentType, ContextType, Partial<QuerySpaOrganizationsArgs>>;
  spaRelationships?: Resolver<Array<ResolversTypes['SpaVendorRelationship']>, ParentType, ContextType, RequireFields<QuerySpaRelationshipsArgs, 'limit'>>;
  suggestedSkaTopics?: Resolver<Array<ResolversTypes['SkincareAtom']>, ParentType, ContextType, RequireFields<QuerySuggestedSkaTopicsArgs, 'content'>>;
  targetArea?: Resolver<Maybe<ResolversTypes['TargetArea']>, ParentType, ContextType, RequireFields<QueryTargetAreaArgs, 'id'>>;
  targetAreas?: Resolver<Array<ResolversTypes['TargetArea']>, ParentType, ContextType, Partial<QueryTargetAreasArgs>>;
  taxonomyFilterOptions?: Resolver<ResolversTypes['TaxonomyFilterOptions'], ParentType, ContextType>;
  taxonomyStats?: Resolver<ResolversTypes['TaxonomyStats'], ParentType, ContextType>;
  topContributors?: Resolver<Array<ResolversTypes['SanctuaryMember']>, ParentType, ContextType, Partial<QueryTopContributorsArgs>>;
  trendingTopics?: Resolver<Array<ResolversTypes['TrendingTopic']>, ParentType, ContextType, Partial<QueryTrendingTopicsArgs>>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
  userSettings?: Resolver<Maybe<ResolversTypes['UserSettings']>, ParentType, ContextType, RequireFields<QueryUserSettingsArgs, 'userId'>>;
  vendorApplication?: Resolver<Maybe<ResolversTypes['VendorApplication']>, ParentType, ContextType, RequireFields<QueryVendorApplicationArgs, 'id'>>;
  vendorCampaign?: Resolver<Maybe<ResolversTypes['MarketingCampaign']>, ParentType, ContextType, RequireFields<QueryVendorCampaignArgs, 'id'>>;
  vendorCampaigns?: Resolver<Array<ResolversTypes['MarketingCampaign']>, ParentType, ContextType, RequireFields<QueryVendorCampaignsArgs, 'limit' | 'offset'>>;
  vendorConversations?: Resolver<Array<ResolversTypes['Conversation']>, ParentType, ContextType, Partial<QueryVendorConversationsArgs>>;
  vendorDashboard?: Resolver<ResolversTypes['VendorDashboardMetrics'], ParentType, ContextType, RequireFields<QueryVendorDashboardArgs, 'dateRange'>>;
  vendorOnboarding?: Resolver<Maybe<ResolversTypes['VendorOnboarding']>, ParentType, ContextType>;
  vendorOrder?: Resolver<Maybe<ResolversTypes['VendorOrder']>, ParentType, ContextType, RequireFields<QueryVendorOrderArgs, 'id'>>;
  vendorOrders?: Resolver<ResolversTypes['VendorOrderConnection'], ParentType, ContextType, Partial<QueryVendorOrdersArgs>>;
  vendorOrganization?: Resolver<Maybe<ResolversTypes['VendorOrganization']>, ParentType, ContextType, RequireFields<QueryVendorOrganizationArgs, 'id'>>;
  vendorOrganizations?: Resolver<ResolversTypes['VendorOrganizationConnection'], ParentType, ContextType, Partial<QueryVendorOrganizationsArgs>>;
  vendorProfile?: Resolver<Maybe<ResolversTypes['VendorProfile']>, ParentType, ContextType>;
  vendorUnreadCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type RecommendationMetricsResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['RecommendationMetrics'] = ResolversParentTypes['RecommendationMetrics']> = ResolversObject<{
  acceptanceRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  avgConfidenceScore?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  conversionRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  totalGenerated?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ReminderPreferenceResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ReminderPreference'] = ResolversParentTypes['ReminderPreference']> = ResolversObject<{
  enabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hoursBeforeAppointment?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ReportResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Report'] = ResolversParentTypes['Report']> = ResolversObject<{
  downloadUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  expiresAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  format?: Resolver<ResolversTypes['ReportFormat'], ParentType, ContextType>;
  generatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  insights?: Resolver<Maybe<ResolversTypes['InsightEngine']>, ParentType, ContextType>;
  metrics?: Resolver<Maybe<ResolversTypes['BusinessMetrics']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['ReportStatus'], ParentType, ContextType>;
  timeframe?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['ReportType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RevenueMetricsResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['RevenueMetrics'] = ResolversParentTypes['RevenueMetrics']> = ResolversObject<{
  fromNewSpas?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  fromRepeatSpas?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  percentChange?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  trend?: Resolver<ResolversTypes['TrendIndicator'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RevenuePeriodResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['RevenuePeriod'] = ResolversParentTypes['RevenuePeriod']> = ResolversObject<{
  orderCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  period?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  revenue?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RoutineComplexityBreakdownResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['RoutineComplexityBreakdown'] = ResolversParentTypes['RoutineComplexityBreakdown']> = ResolversObject<{
  advanced?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  basic?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  expert?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  minimal?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SkaCausalChainResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SKACausalChain'] = ResolversParentTypes['SKACausalChain']> = ResolversObject<{
  atom?: Resolver<ResolversTypes['SkincareAtom'], ParentType, ContextType>;
  consequences?: Resolver<Array<ResolversTypes['SKACausalNode']>, ParentType, ContextType>;
  maxDepth?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  prerequisites?: Resolver<Array<ResolversTypes['SKACausalNode']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SkaCausalNodeResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SKACausalNode'] = ResolversParentTypes['SKACausalNode']> = ResolversObject<{
  atom?: Resolver<ResolversTypes['SkincareAtom'], ParentType, ContextType>;
  depth?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  relationship?: Resolver<ResolversTypes['SkincareRelationship'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SkaCompatibilityResultResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SKACompatibilityResult'] = ResolversParentTypes['SKACompatibilityResult']> = ResolversObject<{
  compatible?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  conflicts?: Resolver<Array<ResolversTypes['SkincareRelationship']>, ParentType, ContextType>;
  recommendations?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  score?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  synergies?: Resolver<Array<ResolversTypes['SkincareRelationship']>, ParentType, ContextType>;
  warnings?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SkaComplianceScoreResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SKAComplianceScore'] = ResolversParentTypes['SKAComplianceScore']> = ResolversObject<{
  analyzedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  criticalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  infoCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  overallScore?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  passed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  processingTimeMs?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  suggestions?: Resolver<Array<ResolversTypes['SKAComplianceSuggestion']>, ParentType, ContextType>;
  totalClaims?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  warningCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  warnings?: Resolver<Array<ResolversTypes['SKAComplianceWarning']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SkaComplianceSuggestionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SKAComplianceSuggestion'] = ResolversParentTypes['SKAComplianceSuggestion']> = ResolversObject<{
  explanation?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  originalClaim?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  regulationReference?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  suggestedReplacement?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SkaComplianceWarningResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SKAComplianceWarning'] = ResolversParentTypes['SKAComplianceWarning']> = ResolversObject<{
  claim?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  claimType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  confidence?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  issue?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  matchedAtomId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  matchedAtomTitle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  regulation?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  severity?: Resolver<ResolversTypes['ComplianceSeverity'], ParentType, ContextType>;
  suggestion?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SkaHighlightResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SKAHighlight'] = ResolversParentTypes['SKAHighlight']> = ResolversObject<{
  field?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  matches?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SkaKnowledgeGraphStatsResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SKAKnowledgeGraphStats'] = ResolversParentTypes['SKAKnowledgeGraphStats']> = ResolversObject<{
  atomsByPillar?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  atomsByType?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  recentlyAdded?: Resolver<Array<ResolversTypes['SkincareAtom']>, ParentType, ContextType>;
  topIngredients?: Resolver<Array<ResolversTypes['SkincareAtom']>, ParentType, ContextType>;
  totalAtoms?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalPillars?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalRelationships?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SkaPurgingInfoResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SKAPurgingInfo'] = ResolversParentTypes['SKAPurgingInfo']> = ResolversObject<{
  causesPurging?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  durationWeeks?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  relatedIngredients?: Resolver<Array<ResolversTypes['SkincareAtom']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SkaQuickComplianceResultResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SKAQuickComplianceResult'] = ResolversParentTypes['SKAQuickComplianceResult']> = ResolversObject<{
  criticalIssues?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  passed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SkaSearchResponseResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SKASearchResponse'] = ResolversParentTypes['SKASearchResponse']> = ResolversObject<{
  executionTimeMs?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  hasMore?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  results?: Resolver<Array<ResolversTypes['SKASearchResult']>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SkaSearchResultResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SKASearchResult'] = ResolversParentTypes['SKASearchResult']> = ResolversObject<{
  atom?: Resolver<ResolversTypes['SkincareAtom'], ParentType, ContextType>;
  highlights?: Resolver<Maybe<Array<ResolversTypes['SKAHighlight']>>, ParentType, ContextType>;
  relevanceScore?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SanctuaryMemberResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SanctuaryMember'] = ResolversParentTypes['SanctuaryMember']> = ResolversObject<{
  bio?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  certifications?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  commentCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  displayName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  expertiseAreas?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isVerified?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  joinedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  lastActiveAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  postCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  profileImageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  reputationScore?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  yearsExperience?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ScheduledReportResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ScheduledReport'] = ResolversParentTypes['ScheduledReport']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  format?: Resolver<ResolversTypes['ReportFormat'], ParentType, ContextType>;
  frequency?: Resolver<ResolversTypes['ReportFrequency'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isActive?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  lastRunAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nextRunAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  recipients?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['ReportType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ScoreDistributionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ScoreDistribution'] = ResolversParentTypes['ScoreDistribution']> = ResolversObject<{
  excellent?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  fair?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  good?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  poor?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SearchQueryInsightResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SearchQueryInsight'] = ResolversParentTypes['SearchQueryInsight']> = ResolversObject<{
  query?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  topCompetitor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  volume?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  yourPosition?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ServiceProviderResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ServiceProvider'] = ResolversParentTypes['ServiceProvider']> = ResolversObject<{
  appointments?: Resolver<Array<ResolversTypes['Appointment']>, ParentType, ContextType>;
  availabilityWindows?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  avatarUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  bio?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isActive?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  licenseInfo?: Resolver<ResolversTypes['LicenseInfo'], ParentType, ContextType>;
  location?: Resolver<Maybe<ResolversTypes['Location']>, ParentType, ContextType>;
  spaOrganization?: Resolver<ResolversTypes['SpaOrganization'], ParentType, ContextType>;
  specialties?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SkinConcernResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SkinConcern'] = ResolversParentTypes['SkinConcern']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  displayOrder?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isActive?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  productCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  relatedIngredients?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  severityLevels?: Resolver<Maybe<Array<ResolversTypes['ConcernSeverity']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SkinProfileResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SkinProfile'] = ResolversParentTypes['SkinProfile']> = ResolversObject<{
  concerns?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  currentRoutine?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  goals?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  sensitivities?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  skinType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SkincareAnalyticsResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SkincareAnalytics'] = ResolversParentTypes['SkincareAnalytics']> = ResolversObject<{
  consultationEffectiveness?: Resolver<ResolversTypes['ConsultationMetrics'], ParentType, ContextType>;
  popularIngredients?: Resolver<Array<ResolversTypes['IngredientAnalysis']>, ParentType, ContextType>;
  purgePhaseAnalysis?: Resolver<ResolversTypes['PurgeAnalysis'], ParentType, ContextType>;
  routineComplexity?: Resolver<ResolversTypes['RoutineComplexityBreakdown'], ParentType, ContextType>;
  topConcerns?: Resolver<Array<ResolversTypes['ConcernAnalysis']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SkincareAtomResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SkincareAtom'] = ResolversParentTypes['SkincareAtom']> = ResolversObject<{
  annualRevenue?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  atomType?: Resolver<ResolversTypes['SkincareAtomType'], ParentType, ContextType>;
  bannerImageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  casNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  causalSummary?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  causesPurging?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  claimEvidences?: Resolver<Array<ResolversTypes['ClaimEvidence']>, ParentType, ContextType>;
  cleanBeauty?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  crueltyFree?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  efficacyIndicators?: Resolver<Array<ResolversTypes['EfficacyIndicator']>, ParentType, ContextType>;
  efficacyScore?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  efficacySummary?: Resolver<Maybe<ResolversTypes['EfficacySummary']>, ParentType, ContextType>;
  euCompliant?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  evidenceSummary?: Resolver<Maybe<ResolversTypes['EvidenceSummary']>, ParentType, ContextType>;
  fdaApproved?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  featured?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  featuredOrder?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  glanceText?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  goldilocksParameters?: Resolver<Array<ResolversTypes['GoldilocksParameter']>, ParentType, ContextType>;
  growthRate?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  imageUrls?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  inciName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  infographicUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  innovationScore?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  keyIngredients?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  knowledgeThreshold?: Resolver<Maybe<ResolversTypes['KnowledgeThreshold']>, ParentType, ContextType>;
  logoUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  marketCap?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  marketSegment?: Resolver<Maybe<ResolversTypes['MarketSegment']>, ParentType, ContextType>;
  marketShare?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  maxConcentration?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  metadata?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  molecularFormula?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  molecularWeight?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  parentCompany?: Resolver<Maybe<ResolversTypes['SkincareAtom']>, ParentType, ContextType>;
  parentCompanyId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  patentYear?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  phRangeMax?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  phRangeMin?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  pillar?: Resolver<Maybe<ResolversTypes['SkincarePillar']>, ParentType, ContextType>;
  pillarId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  pricePoint?: Resolver<Maybe<ResolversTypes['PricePoint']>, ParentType, ContextType>;
  productImageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  purgingDescription?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  purgingDurationWeeks?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  regulationYear?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  relationships?: Resolver<Array<ResolversTypes['SkincareRelationship']>, ParentType, ContextType>;
  scanText?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sources?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  studyText?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sustainabilityScore?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  targetDemographics?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  tensor?: Resolver<Maybe<ResolversTypes['SkincareAtomTensor']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trendEmergenceYear?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  veganCertified?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  videoUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  viewCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  whyItWorks?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  yearEstablished?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  yearIntroduced?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SkincareAtomTensorResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SkincareAtomTensor'] = ResolversParentTypes['SkincareAtomTensor']> = ResolversObject<{
  antiAgingPotency?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  antiInflammatory?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  antioxidantCapacity?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  atomId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  barrierRepair?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  brighteningEfficacy?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  clinicalEvidenceLevel?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  collagenStimulation?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  compatibilityScore?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  exfoliationStrength?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  hydrationIndex?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  marketSaturation?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  molecularPenetration?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  phDependency?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  photosensitivity?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  sebumRegulation?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  sensitivityRisk?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  stabilityRating?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  tensorVector?: Resolver<Maybe<Array<ResolversTypes['Float']>>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SkincareFilterOptionsResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SkincareFilterOptions'] = ResolversParentTypes['SkincareFilterOptions']> = ResolversObject<{
  categories?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  concerns?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  priceTiers?: Resolver<Array<ResolversTypes['PriceTier']>, ParentType, ContextType>;
  routineSteps?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  skinTypes?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  subcategories?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  textures?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SkincarePillarResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SkincarePillar'] = ResolversParentTypes['SkincarePillar']> = ResolversObject<{
  atomCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  atoms?: Resolver<Array<ResolversTypes['SkincareAtom']>, ParentType, ContextType, Partial<SkincarePillarAtomsArgs>>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  displayOrder?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  hexColor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  iconUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  number?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SkincareProductResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SkincareProduct'] = ResolversParentTypes['SkincareProduct']> = ResolversObject<{
  benefits?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  brand?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  category?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  concerns?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  crueltyFree?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  fragranceFree?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  ingredients?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  keyBenefits?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  priceTier?: Resolver<ResolversTypes['PriceTier'], ParentType, ContextType>;
  productName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  routineStep?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  score?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  skinTypes?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  subcategory?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  texture?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  vegan?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  volume?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SkincareRelationshipResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SkincareRelationship'] = ResolversParentTypes['SkincareRelationship']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  establishedYear?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  evidenceDescription?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  fromAtom?: Resolver<Maybe<ResolversTypes['SkincareAtom']>, ParentType, ContextType>;
  fromAtomId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  metadata?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  relationshipType?: Resolver<ResolversTypes['SkincareRelationshipType'], ParentType, ContextType>;
  sourceType?: Resolver<Maybe<ResolversTypes['SourceType']>, ParentType, ContextType>;
  sourceUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  strength?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  toAtom?: Resolver<Maybe<ResolversTypes['SkincareAtom']>, ParentType, ContextType>;
  toAtomId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SkincareRoutineResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SkincareRoutine'] = ResolversParentTypes['SkincareRoutine']> = ResolversObject<{
  steps?: Resolver<Array<ResolversTypes['SkincareRoutineStep']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SkincareRoutineStepResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SkincareRoutineStep'] = ResolversParentTypes['SkincareRoutineStep']> = ResolversObject<{
  products?: Resolver<Array<ResolversTypes['SkincareProduct']>, ParentType, ContextType>;
  step?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SocialLinksResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SocialLinks'] = ResolversParentTypes['SocialLinks']> = ResolversObject<{
  facebook?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  instagram?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  linkedin?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tiktok?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SpaContactResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SpaContact'] = ResolversParentTypes['SpaContact']> = ResolversObject<{
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SpaMetricsResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SpaMetrics'] = ResolversParentTypes['SpaMetrics']> = ResolversObject<{
  active?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  new?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  percentChange?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  reorderRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  repeat?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  trend?: Resolver<ResolversTypes['TrendIndicator'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SpaOrganizationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SpaOrganization'] = ResolversParentTypes['SpaOrganization']> = ResolversObject<{
  address?: Resolver<ResolversTypes['Address'], ParentType, ContextType>;
  contactEmail?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  contactPhone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  displayName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isActive?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  locations?: Resolver<Array<ResolversTypes['Location']>, ParentType, ContextType>;
  logoUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  subscriptionStatus?: Resolver<ResolversTypes['SubscriptionStatus'], ParentType, ContextType>;
  subscriptionTier?: Resolver<ResolversTypes['SubscriptionTier'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SpaOrganizationConnectionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SpaOrganizationConnection'] = ResolversParentTypes['SpaOrganizationConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['SpaOrganizationEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SpaOrganizationEdgeResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SpaOrganizationEdge'] = ResolversParentTypes['SpaOrganizationEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['SpaOrganization'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SpaOrganizationResultResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SpaOrganizationResult'] = ResolversParentTypes['SpaOrganizationResult']> = ResolversObject<{
  errors?: Resolver<Maybe<Array<ResolversTypes['Error']>>, ParentType, ContextType>;
  spaOrganization?: Resolver<Maybe<ResolversTypes['SpaOrganization']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SpaVendorRelationshipResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SpaVendorRelationship'] = ResolversParentTypes['SpaVendorRelationship']> = ResolversObject<{
  avgDaysBetweenOrders?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  avgOrderValue?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  daysSinceLastOrder?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  favoriteCategories?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  firstOrderAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastMessageAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  lastOrderAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  lifetimeValue?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  messageCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  orderCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  profileViews?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  spaId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  spaName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['RelationshipStatus'], ParentType, ContextType>;
  topProducts?: Resolver<Maybe<Array<ResolversTypes['ID']>>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  vendorId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type StatusChangeResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['StatusChange'] = ResolversParentTypes['StatusChange']> = ResolversObject<{
  changedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  changedBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  note?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['OrderStatus'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SuccessResponseResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SuccessResponse'] = ResolversParentTypes['SuccessResponse']> = ResolversObject<{
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TargetAreaResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['TargetArea'] = ResolversParentTypes['TargetArea']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isActive?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  productCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TaxonomyFilterOptionsResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['TaxonomyFilterOptions'] = ResolversParentTypes['TaxonomyFilterOptions']> = ResolversObject<{
  categories?: Resolver<Array<ResolversTypes['ProductCategory']>, ParentType, ContextType>;
  concerns?: Resolver<Array<ResolversTypes['SkinConcern']>, ParentType, ContextType>;
  formats?: Resolver<Array<ResolversTypes['ProductFormat']>, ParentType, ContextType>;
  functions?: Resolver<Array<ResolversTypes['ProductFunction']>, ParentType, ContextType>;
  professionalLevels?: Resolver<Array<ResolversTypes['ProfessionalLevel']>, ParentType, ContextType>;
  regions?: Resolver<Array<ResolversTypes['ProductRegion']>, ParentType, ContextType>;
  targetAreas?: Resolver<Array<ResolversTypes['TargetArea']>, ParentType, ContextType>;
  usageTimes?: Resolver<Array<ResolversTypes['UsageTime']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TaxonomyStatsResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['TaxonomyStats'] = ResolversParentTypes['TaxonomyStats']> = ResolversObject<{
  averageCompletenessScore?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  categoryCoverage?: Resolver<Array<ResolversTypes['CategoryCoverage']>, ParentType, ContextType>;
  missingCategories?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  missingFormats?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  missingFunctions?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  needsReview?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  productsWithTaxonomy?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  productsWithoutTaxonomy?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  scoreDistribution?: Resolver<ResolversTypes['ScoreDistribution'], ParentType, ContextType>;
  totalProducts?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TestReportResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['TestReport'] = ResolversParentTypes['TestReport']> = ResolversObject<{
  reportUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  testType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  testedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TimeSeriesDataPointResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['TimeSeriesDataPoint'] = ResolversParentTypes['TimeSeriesDataPoint']> = ResolversObject<{
  date?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TreatmentPlanResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['TreatmentPlan'] = ResolversParentTypes['TreatmentPlan']> = ResolversObject<{
  client?: Resolver<ResolversTypes['Client'], ParentType, ContextType>;
  completedSessions?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  serviceProvider?: Resolver<ResolversTypes['ServiceProvider'], ParentType, ContextType>;
  sessions?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['TreatmentPlanStatus'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  totalSessions?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TrendInsightResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['TrendInsight'] = ResolversParentTypes['TrendInsight']> = ResolversObject<{
  changePercent?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  context?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  metric?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  significance?: Resolver<ResolversTypes['SignificanceLevel'], ParentType, ContextType>;
  timeframe?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trend?: Resolver<ResolversTypes['TrendDirection'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TrendingTopicResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['TrendingTopic'] = ResolversParentTypes['TrendingTopic']> = ResolversObject<{
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  postCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  skaAtom?: Resolver<Maybe<ResolversTypes['SkincareAtom']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface UploadScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
  name: 'Upload';
}

export type UsageInstructionsResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['UsageInstructions'] = ResolversParentTypes['UsageInstructions']> = ResolversObject<{
  application?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  frequency?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  patchTestRequired?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  timeOfDay?: Resolver<ResolversTypes['TimeOfDay'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  avatarUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  emailVerified?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  firstName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isActive?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  role?: Resolver<ResolversTypes['UserRole'], ParentType, ContextType>;
  spaOrganization?: Resolver<Maybe<ResolversTypes['SpaOrganization']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  vendorOrganization?: Resolver<Maybe<ResolversTypes['VendorOrganization']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserResultResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['UserResult'] = ResolversParentTypes['UserResult']> = ResolversObject<{
  errors?: Resolver<Maybe<Array<ResolversTypes['Error']>>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserSettingsResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['UserSettings'] = ResolversParentTypes['UserSettings']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  notifications?: Resolver<ResolversTypes['NotificationSettings'], ParentType, ContextType>;
  preferences?: Resolver<ResolversTypes['AppPreferences'], ParentType, ContextType>;
  profile?: Resolver<ResolversTypes['ProfileSettings'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserSettingsResultResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['UserSettingsResult'] = ResolversParentTypes['UserSettingsResult']> = ResolversObject<{
  errors?: Resolver<Maybe<Array<ResolversTypes['Error']>>, ParentType, ContextType>;
  settings?: Resolver<Maybe<ResolversTypes['UserSettings']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ValuePerformanceResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ValuePerformance'] = ResolversParentTypes['ValuePerformance']> = ResolversObject<{
  clicks?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  conversionRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  conversions?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  ctr?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  impressions?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  rank?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VendorApplicationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['VendorApplication'] = ResolversParentTypes['VendorApplication']> = ResolversObject<{
  annualRevenue?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  approvalConditions?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  assignedReviewerId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  assignedReviewerName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  brandName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  certifications?: Resolver<Maybe<Array<ResolversTypes['CertificationType']>>, ParentType, ContextType>;
  contactEmail?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  contactFirstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  contactLastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  contactPhone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  contactRole?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  currentDistribution?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  decidedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  documents?: Resolver<Maybe<ResolversTypes['ApplicationDocuments']>, ParentType, ContextType>;
  employeeCount?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  headquarters?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  legalName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  onboarding?: Resolver<Maybe<ResolversTypes['VendorOnboarding']>, ParentType, ContextType>;
  priceRange?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  productCategories?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  rejectionReason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  riskAssessment?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  riskLevel?: Resolver<Maybe<ResolversTypes['RiskLevel']>, ParentType, ContextType>;
  skuCount?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  slaDeadline?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['ApplicationStatus'], ParentType, ContextType>;
  submittedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  targetMarket?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  values?: Resolver<Array<ResolversTypes['VendorValue']>, ParentType, ContextType>;
  website?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  whyJade?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  yearFounded?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VendorApplicationResultResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['VendorApplicationResult'] = ResolversParentTypes['VendorApplicationResult']> = ResolversObject<{
  application?: Resolver<Maybe<ResolversTypes['VendorApplication']>, ParentType, ContextType>;
  errors?: Resolver<Maybe<Array<ResolversTypes['VendorPortalError']>>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VendorCertificationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['VendorCertification'] = ResolversParentTypes['VendorCertification']> = ResolversObject<{
  certificateNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  documentUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  expirationDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  issuingBody?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  rejectionReason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  slaDeadline?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  submittedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['CertificationType'], ParentType, ContextType>;
  verificationStatus?: Resolver<ResolversTypes['CertificationStatus'], ParentType, ContextType>;
  verifiedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  verifiedBy?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VendorDashboardMetricsResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['VendorDashboardMetrics'] = ResolversParentTypes['VendorDashboardMetrics']> = ResolversObject<{
  dateRange?: Resolver<ResolversTypes['DateRange'], ParentType, ContextType>;
  impressions?: Resolver<ResolversTypes['ImpressionMetrics'], ParentType, ContextType>;
  orders?: Resolver<ResolversTypes['OrderMetrics'], ParentType, ContextType>;
  ordersTimeSeries?: Resolver<Array<ResolversTypes['TimeSeriesDataPoint']>, ParentType, ContextType>;
  revenue?: Resolver<ResolversTypes['RevenueMetrics'], ParentType, ContextType>;
  revenueTimeSeries?: Resolver<Array<ResolversTypes['TimeSeriesDataPoint']>, ParentType, ContextType>;
  spas?: Resolver<ResolversTypes['SpaMetrics'], ParentType, ContextType>;
  topCustomers?: Resolver<Array<ResolversTypes['SpaVendorRelationship']>, ParentType, ContextType>;
  topProducts?: Resolver<Array<ResolversTypes['ProductPerformance']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VendorOnboardingResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['VendorOnboarding'] = ResolversParentTypes['VendorOnboarding']> = ResolversObject<{
  applicationId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  completedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  completedSteps?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  percentComplete?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  requiredStepsRemaining?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  startedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  steps?: Resolver<Array<ResolversTypes['OnboardingStep']>, ParentType, ContextType>;
  successManagerEmail?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  successManagerName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  targetCompletionDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  totalSteps?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VendorOrderResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['VendorOrder'] = ResolversParentTypes['VendorOrder']> = ResolversObject<{
  conversationId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  fulfillment?: Resolver<Maybe<ResolversTypes['FulfillmentInfo']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  items?: Resolver<Array<ResolversTypes['OrderItem']>, ParentType, ContextType>;
  orderNumber?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  shipping?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  shippingAddress?: Resolver<ResolversTypes['Address'], ParentType, ContextType>;
  spaContact?: Resolver<ResolversTypes['SpaContact'], ParentType, ContextType>;
  spaId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  spaName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['OrderStatus'], ParentType, ContextType>;
  statusHistory?: Resolver<Array<ResolversTypes['StatusChange']>, ParentType, ContextType>;
  subtotal?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  tax?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VendorOrderConnectionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['VendorOrderConnection'] = ResolversParentTypes['VendorOrderConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['VendorOrderEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VendorOrderEdgeResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['VendorOrderEdge'] = ResolversParentTypes['VendorOrderEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['VendorOrder'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VendorOrganizationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['VendorOrganization'] = ResolversParentTypes['VendorOrganization']> = ResolversObject<{
  address?: Resolver<ResolversTypes['Address'], ParentType, ContextType>;
  approvalStatus?: Resolver<ResolversTypes['ApprovalStatus'], ParentType, ContextType>;
  approvedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  businessLicense?: Resolver<ResolversTypes['BusinessLicense'], ParentType, ContextType>;
  certifications?: Resolver<Array<ResolversTypes['Certification']>, ParentType, ContextType>;
  companyName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  contactEmail?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  contactPhone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  displayName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  fulfillmentSettings?: Resolver<ResolversTypes['FulfillmentSettings'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  insurance?: Resolver<ResolversTypes['InsuranceInfo'], ParentType, ContextType>;
  isActive?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  products?: Resolver<Array<ResolversTypes['Product']>, ParentType, ContextType>;
  qualityScore?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VendorOrganizationConnectionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['VendorOrganizationConnection'] = ResolversParentTypes['VendorOrganizationConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['VendorOrganizationEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VendorOrganizationEdgeResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['VendorOrganizationEdge'] = ResolversParentTypes['VendorOrganizationEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['VendorOrganization'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VendorOrganizationResultResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['VendorOrganizationResult'] = ResolversParentTypes['VendorOrganizationResult']> = ResolversObject<{
  errors?: Resolver<Maybe<Array<ResolversTypes['Error']>>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  vendorOrganization?: Resolver<Maybe<ResolversTypes['VendorOrganization']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VendorPortalErrorResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['VendorPortalError'] = ResolversParentTypes['VendorPortalError']> = ResolversObject<{
  code?: Resolver<ResolversTypes['VendorPortalErrorCode'], ParentType, ContextType>;
  field?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VendorProfileResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['VendorProfile'] = ResolversParentTypes['VendorProfile']> = ResolversObject<{
  brandColorPrimary?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  brandColorSecondary?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  brandName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  brandVideoUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  certifications?: Resolver<Array<ResolversTypes['VendorCertification']>, ParentType, ContextType>;
  completenessScore?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  foundedYear?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  founderStory?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  galleryImages?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  headquarters?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  heroImageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  logoUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  missionStatement?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  socialLinks?: Resolver<Maybe<ResolversTypes['SocialLinks']>, ParentType, ContextType>;
  tagline?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  teamSize?: Resolver<Maybe<ResolversTypes['TeamSize']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  values?: Resolver<Array<ResolversTypes['VendorValue']>, ParentType, ContextType>;
  vendorId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  websiteUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VendorProfileResultResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['VendorProfileResult'] = ResolversParentTypes['VendorProfileResult']> = ResolversObject<{
  errors?: Resolver<Maybe<Array<ResolversTypes['VendorPortalError']>>, ParentType, ContextType>;
  profile?: Resolver<Maybe<ResolversTypes['VendorProfile']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type WhyExplanationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['WhyExplanation'] = ResolversParentTypes['WhyExplanation']> = ResolversObject<{
  confidenceScore?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  disclosureContent?: Resolver<ResolversTypes['DisclosureContent'], ParentType, ContextType>;
  evidenceStrength?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  path?: Resolver<Array<ResolversTypes['CausalPathStep']>, ParentType, ContextType>;
  summary?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = GraphQLContext> = ResolversObject<{
  AIPerformanceMetrics?: AiPerformanceMetricsResolvers<ContextType>;
  ActionableRecommendation?: ActionableRecommendationResolvers<ContextType>;
  ActiveIngredient?: ActiveIngredientResolvers<ContextType>;
  Address?: AddressResolvers<ContextType>;
  AnalysisMetrics?: AnalysisMetricsResolvers<ContextType>;
  AnomalyInsight?: AnomalyInsightResolvers<ContextType>;
  AppPreferences?: AppPreferencesResolvers<ContextType>;
  ApplicationDocuments?: ApplicationDocumentsResolvers<ContextType>;
  Appointment?: AppointmentResolvers<ContextType>;
  AppointmentConnection?: AppointmentConnectionResolvers<ContextType>;
  AppointmentEdge?: AppointmentEdgeResolvers<ContextType>;
  AppointmentResult?: AppointmentResultResolvers<ContextType>;
  AtomWithIntelligence?: AtomWithIntelligenceResolvers<ContextType>;
  AuthResult?: AuthResultResolvers<ContextType>;
  BulkTaxonomyError?: BulkTaxonomyErrorResolvers<ContextType>;
  BulkTaxonomyResult?: BulkTaxonomyResultResolvers<ContextType>;
  BusinessAlert?: BusinessAlertResolvers<ContextType>;
  BusinessLicense?: BusinessLicenseResolvers<ContextType>;
  BusinessMetrics?: BusinessMetricsResolvers<ContextType>;
  CampaignPerformanceSummary?: CampaignPerformanceSummaryResolvers<ContextType>;
  CategoryCoverage?: CategoryCoverageResolvers<ContextType>;
  CategoryPerformance?: CategoryPerformanceResolvers<ContextType>;
  CausalChainNode?: CausalChainNodeResolvers<ContextType>;
  CausalPathStep?: CausalPathStepResolvers<ContextType>;
  Certification?: CertificationResolvers<ContextType>;
  CertificationResult?: CertificationResultResolvers<ContextType>;
  ChannelPerformance?: ChannelPerformanceResolvers<ContextType>;
  ClaimEvidence?: ClaimEvidenceResolvers<ContextType>;
  Client?: ClientResolvers<ContextType>;
  ClientConnection?: ClientConnectionResolvers<ContextType>;
  ClientEdge?: ClientEdgeResolvers<ContextType>;
  ClientFeedback?: ClientFeedbackResolvers<ContextType>;
  ClientPreferences?: ClientPreferencesResolvers<ContextType>;
  ClientResult?: ClientResultResolvers<ContextType>;
  ClinicalData?: ClinicalDataResolvers<ContextType>;
  ClinicalTrial?: ClinicalTrialResolvers<ContextType>;
  CommunityComment?: CommunityCommentResolvers<ContextType>;
  CommunityEvent?: CommunityEventResolvers<ContextType>;
  CommunityEventConnection?: CommunityEventConnectionResolvers<ContextType>;
  CommunityPost?: CommunityPostResolvers<ContextType>;
  CommunityPostConnection?: CommunityPostConnectionResolvers<ContextType>;
  CompatibilityResult?: CompatibilityResultResolvers<ContextType>;
  ConcernAnalysis?: ConcernAnalysisResolvers<ContextType>;
  ConsultationMetrics?: ConsultationMetricsResolvers<ContextType>;
  Conversation?: ConversationResolvers<ContextType>;
  ConversationMessage?: ConversationMessageResolvers<ContextType>;
  ConversationMessagesResponse?: ConversationMessagesResponseResolvers<ContextType>;
  CrossSellPair?: CrossSellPairResolvers<ContextType>;
  CustomerMetrics?: CustomerMetricsResolvers<ContextType>;
  CustomerSegment?: CustomerSegmentResolvers<ContextType>;
  DashboardMetric?: DashboardMetricResolvers<ContextType>;
  DashboardSummary?: DashboardSummaryResolvers<ContextType>;
  DateRange?: DateRangeResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  DisclosureContent?: DisclosureContentResolvers<ContextType>;
  DiscoveryAnalytics?: DiscoveryAnalyticsResolvers<ContextType>;
  DiscoveryRecommendation?: DiscoveryRecommendationResolvers<ContextType>;
  EfficacyIndicator?: EfficacyIndicatorResolvers<ContextType>;
  EfficacySummary?: EfficacySummaryResolvers<ContextType>;
  Error?: ErrorResolvers<ContextType>;
  EvidenceSummary?: EvidenceSummaryResolvers<ContextType>;
  FinancialMetrics?: FinancialMetricsResolvers<ContextType>;
  FulfillmentInfo?: FulfillmentInfoResolvers<ContextType>;
  FulfillmentSettings?: FulfillmentSettingsResolvers<ContextType>;
  GeographicRegion?: GeographicRegionResolvers<ContextType>;
  GoldilocksParameter?: GoldilocksParameterResolvers<ContextType>;
  ImpressionMetrics?: ImpressionMetricsResolvers<ContextType>;
  ImpressionsBySource?: ImpressionsBySourceResolvers<ContextType>;
  Ingredient?: IngredientResolvers<ContextType>;
  IngredientAnalysis?: IngredientAnalysisResolvers<ContextType>;
  IngredientInteraction?: IngredientInteractionResolvers<ContextType>;
  IngredientList?: IngredientListResolvers<ContextType>;
  InsightEngine?: InsightEngineResolvers<ContextType>;
  InsuranceInfo?: InsuranceInfoResolvers<ContextType>;
  IntelligenceSearchResponse?: IntelligenceSearchResponseResolvers<ContextType>;
  IntelligenceSearchResult?: IntelligenceSearchResultResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  JobStatusResponse?: JobStatusResponseResolvers<ContextType>;
  JourneyStage?: JourneyStageResolvers<ContextType>;
  LicenseInfo?: LicenseInfoResolvers<ContextType>;
  Location?: LocationResolvers<ContextType>;
  MarketingCampaign?: MarketingCampaignResolvers<ContextType>;
  MarketingCampaignResult?: MarketingCampaignResultResolvers<ContextType>;
  Money?: MoneyResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  NotificationSettings?: NotificationSettingsResolvers<ContextType>;
  OnboardingStep?: OnboardingStepResolvers<ContextType>;
  OnboardingStepResult?: OnboardingStepResultResolvers<ContextType>;
  OrderItem?: OrderItemResolvers<ContextType>;
  OrderMetrics?: OrderMetricsResolvers<ContextType>;
  OrderStatusCounts?: OrderStatusCountsResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  PredictionAccuracyMetrics?: PredictionAccuracyMetricsResolvers<ContextType>;
  PredictionFactor?: PredictionFactorResolvers<ContextType>;
  PredictiveInsight?: PredictiveInsightResolvers<ContextType>;
  Product?: ProductResolvers<ContextType>;
  ProductCategory?: ProductCategoryResolvers<ContextType>;
  ProductConnection?: ProductConnectionResolvers<ContextType>;
  ProductEdge?: ProductEdgeResolvers<ContextType>;
  ProductFormat?: ProductFormatResolvers<ContextType>;
  ProductFunction?: ProductFunctionResolvers<ContextType>;
  ProductGlance?: ProductGlanceResolvers<ContextType>;
  ProductMetrics?: ProductMetricsResolvers<ContextType>;
  ProductPerformance?: ProductPerformanceResolvers<ContextType>;
  ProductRegion?: ProductRegionResolvers<ContextType>;
  ProductResult?: ProductResultResolvers<ContextType>;
  ProductScan?: ProductScanResolvers<ContextType>;
  ProductStudy?: ProductStudyResolvers<ContextType>;
  ProductTaxonomy?: ProductTaxonomyResolvers<ContextType>;
  ProductUsage?: ProductUsageResolvers<ContextType>;
  ProfileEngagement?: ProfileEngagementResolvers<ContextType>;
  ProfileSettings?: ProfileSettingsResolvers<ContextType>;
  PurgeAnalysis?: PurgeAnalysisResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RecommendationMetrics?: RecommendationMetricsResolvers<ContextType>;
  ReminderPreference?: ReminderPreferenceResolvers<ContextType>;
  Report?: ReportResolvers<ContextType>;
  RevenueMetrics?: RevenueMetricsResolvers<ContextType>;
  RevenuePeriod?: RevenuePeriodResolvers<ContextType>;
  RoutineComplexityBreakdown?: RoutineComplexityBreakdownResolvers<ContextType>;
  SKACausalChain?: SkaCausalChainResolvers<ContextType>;
  SKACausalNode?: SkaCausalNodeResolvers<ContextType>;
  SKACompatibilityResult?: SkaCompatibilityResultResolvers<ContextType>;
  SKAComplianceScore?: SkaComplianceScoreResolvers<ContextType>;
  SKAComplianceSuggestion?: SkaComplianceSuggestionResolvers<ContextType>;
  SKAComplianceWarning?: SkaComplianceWarningResolvers<ContextType>;
  SKAHighlight?: SkaHighlightResolvers<ContextType>;
  SKAKnowledgeGraphStats?: SkaKnowledgeGraphStatsResolvers<ContextType>;
  SKAPurgingInfo?: SkaPurgingInfoResolvers<ContextType>;
  SKAQuickComplianceResult?: SkaQuickComplianceResultResolvers<ContextType>;
  SKASearchResponse?: SkaSearchResponseResolvers<ContextType>;
  SKASearchResult?: SkaSearchResultResolvers<ContextType>;
  SanctuaryMember?: SanctuaryMemberResolvers<ContextType>;
  ScheduledReport?: ScheduledReportResolvers<ContextType>;
  ScoreDistribution?: ScoreDistributionResolvers<ContextType>;
  SearchQueryInsight?: SearchQueryInsightResolvers<ContextType>;
  ServiceProvider?: ServiceProviderResolvers<ContextType>;
  SkinConcern?: SkinConcernResolvers<ContextType>;
  SkinProfile?: SkinProfileResolvers<ContextType>;
  SkincareAnalytics?: SkincareAnalyticsResolvers<ContextType>;
  SkincareAtom?: SkincareAtomResolvers<ContextType>;
  SkincareAtomTensor?: SkincareAtomTensorResolvers<ContextType>;
  SkincareFilterOptions?: SkincareFilterOptionsResolvers<ContextType>;
  SkincarePillar?: SkincarePillarResolvers<ContextType>;
  SkincareProduct?: SkincareProductResolvers<ContextType>;
  SkincareRelationship?: SkincareRelationshipResolvers<ContextType>;
  SkincareRoutine?: SkincareRoutineResolvers<ContextType>;
  SkincareRoutineStep?: SkincareRoutineStepResolvers<ContextType>;
  SocialLinks?: SocialLinksResolvers<ContextType>;
  SpaContact?: SpaContactResolvers<ContextType>;
  SpaMetrics?: SpaMetricsResolvers<ContextType>;
  SpaOrganization?: SpaOrganizationResolvers<ContextType>;
  SpaOrganizationConnection?: SpaOrganizationConnectionResolvers<ContextType>;
  SpaOrganizationEdge?: SpaOrganizationEdgeResolvers<ContextType>;
  SpaOrganizationResult?: SpaOrganizationResultResolvers<ContextType>;
  SpaVendorRelationship?: SpaVendorRelationshipResolvers<ContextType>;
  StatusChange?: StatusChangeResolvers<ContextType>;
  SuccessResponse?: SuccessResponseResolvers<ContextType>;
  TargetArea?: TargetAreaResolvers<ContextType>;
  TaxonomyFilterOptions?: TaxonomyFilterOptionsResolvers<ContextType>;
  TaxonomyStats?: TaxonomyStatsResolvers<ContextType>;
  TestReport?: TestReportResolvers<ContextType>;
  TimeSeriesDataPoint?: TimeSeriesDataPointResolvers<ContextType>;
  TreatmentPlan?: TreatmentPlanResolvers<ContextType>;
  TrendInsight?: TrendInsightResolvers<ContextType>;
  TrendingTopic?: TrendingTopicResolvers<ContextType>;
  Upload?: GraphQLScalarType;
  UsageInstructions?: UsageInstructionsResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserResult?: UserResultResolvers<ContextType>;
  UserSettings?: UserSettingsResolvers<ContextType>;
  UserSettingsResult?: UserSettingsResultResolvers<ContextType>;
  ValuePerformance?: ValuePerformanceResolvers<ContextType>;
  VendorApplication?: VendorApplicationResolvers<ContextType>;
  VendorApplicationResult?: VendorApplicationResultResolvers<ContextType>;
  VendorCertification?: VendorCertificationResolvers<ContextType>;
  VendorDashboardMetrics?: VendorDashboardMetricsResolvers<ContextType>;
  VendorOnboarding?: VendorOnboardingResolvers<ContextType>;
  VendorOrder?: VendorOrderResolvers<ContextType>;
  VendorOrderConnection?: VendorOrderConnectionResolvers<ContextType>;
  VendorOrderEdge?: VendorOrderEdgeResolvers<ContextType>;
  VendorOrganization?: VendorOrganizationResolvers<ContextType>;
  VendorOrganizationConnection?: VendorOrganizationConnectionResolvers<ContextType>;
  VendorOrganizationEdge?: VendorOrganizationEdgeResolvers<ContextType>;
  VendorOrganizationResult?: VendorOrganizationResultResolvers<ContextType>;
  VendorPortalError?: VendorPortalErrorResolvers<ContextType>;
  VendorProfile?: VendorProfileResolvers<ContextType>;
  VendorProfileResult?: VendorProfileResultResolvers<ContextType>;
  WhyExplanation?: WhyExplanationResolvers<ContextType>;
}>;

