export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
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
  readonly __typename: 'AIPerformanceMetrics';
  readonly analysisMetrics: AnalysisMetrics;
  readonly predictionAccuracy: PredictionAccuracyMetrics;
  readonly recommendationPerformance: RecommendationMetrics;
};

/** User Access Level for threshold filtering */
export enum AccessLevel {
  EXPERT = 'EXPERT',
  PROFESSIONAL = 'PROFESSIONAL',
  PUBLIC = 'PUBLIC',
  REGISTERED = 'REGISTERED'
}

export type AcknowledgeAlertInput = {
  readonly alertId: Scalars['ID']['input'];
  readonly note?: InputMaybe<Scalars['String']['input']>;
};

/** Actionable recommendation */
export type ActionableRecommendation = {
  readonly __typename: 'ActionableRecommendation';
  readonly category: RecommendationCategory;
  readonly dependencies: ReadonlyArray<Scalars['String']['output']>;
  readonly description: Scalars['String']['output'];
  readonly estimatedImpact: Scalars['String']['output'];
  readonly id: Scalars['ID']['output'];
  readonly implementationEffort: EffortLevel;
  readonly priority: SignificanceLevel;
  readonly successMetrics: ReadonlyArray<Scalars['String']['output']>;
  readonly timeline: Scalars['String']['output'];
  readonly title: Scalars['String']['output'];
};

export type ActiveIngredient = {
  readonly __typename: 'ActiveIngredient';
  readonly concentration: Scalars['Float']['output'];
  readonly name: Scalars['String']['output'];
  readonly type: Scalars['String']['output'];
};

export type ActiveIngredientInput = {
  readonly concentration: Scalars['Float']['input'];
  readonly name: Scalars['String']['input'];
  readonly type: Scalars['String']['input'];
};

export type AddCertificationInput = {
  readonly certificateNumber?: InputMaybe<Scalars['String']['input']>;
  readonly documentUrl: Scalars['String']['input'];
  readonly expirationDate?: InputMaybe<Scalars['DateTime']['input']>;
  readonly issuingBody: Scalars['String']['input'];
  readonly type: CertificationType;
};

export type AddShippingInfoInput = {
  readonly carrier: Scalars['String']['input'];
  readonly estimatedDelivery?: InputMaybe<Scalars['DateTime']['input']>;
  readonly orderId: Scalars['ID']['input'];
  readonly trackingNumber: Scalars['String']['input'];
};

/** Address type */
export type Address = {
  readonly __typename: 'Address';
  readonly city: Scalars['String']['output'];
  readonly country: Scalars['String']['output'];
  readonly line1: Scalars['String']['output'];
  readonly line2?: Maybe<Scalars['String']['output']>;
  readonly postalCode: Scalars['String']['output'];
  readonly state: Scalars['String']['output'];
  readonly street1: Scalars['String']['output'];
  readonly street2?: Maybe<Scalars['String']['output']>;
};

export type AddressInput = {
  readonly city: Scalars['String']['input'];
  readonly country: Scalars['String']['input'];
  readonly postalCode: Scalars['String']['input'];
  readonly state: Scalars['String']['input'];
  readonly street1: Scalars['String']['input'];
  readonly street2?: InputMaybe<Scalars['String']['input']>;
};

export enum AlertCategory {
  CUSTOMER = 'CUSTOMER',
  FINANCIAL = 'FINANCIAL',
  OPERATIONAL = 'OPERATIONAL',
  PRODUCT = 'PRODUCT',
  TECHNICAL = 'TECHNICAL'
}

export enum AlertSeverity {
  CRITICAL = 'CRITICAL',
  INFO = 'INFO',
  WARNING = 'WARNING'
}

export type AnalysisMetrics = {
  readonly __typename: 'AnalysisMetrics';
  readonly accuracyScore: Scalars['Float']['output'];
  readonly avgProcessingTimeMs: Scalars['Int']['output'];
  readonly totalAnalyses: Scalars['Int']['output'];
  readonly userSatisfaction: Scalars['Float']['output'];
};

/** Anomaly detection insight */
export type AnomalyInsight = {
  readonly __typename: 'AnomalyInsight';
  readonly actualValue: Scalars['Float']['output'];
  readonly deviation: Scalars['Float']['output'];
  readonly expectedValue: Scalars['Float']['output'];
  readonly metric: Scalars['String']['output'];
  readonly possibleCauses: ReadonlyArray<Scalars['String']['output']>;
  readonly recommendedActions: ReadonlyArray<Scalars['String']['output']>;
  readonly severity: AlertSeverity;
  readonly timestamp: Scalars['DateTime']['output'];
};

/** App Preferences - UI and behavior preferences */
export type AppPreferences = {
  readonly __typename: 'AppPreferences';
  /** Compact mode for dense information display */
  readonly compactMode: Scalars['Boolean']['output'];
  /** Preferred currency for display */
  readonly currency: Scalars['String']['output'];
  /** Default landing page after login */
  readonly defaultView: DefaultView;
  /** Number of items per page in lists */
  readonly itemsPerPage: Scalars['Int']['output'];
  /** Enable keyboard shortcuts */
  readonly keyboardShortcuts: Scalars['Boolean']['output'];
  /** Show product prices including tax */
  readonly showPricesWithTax: Scalars['Boolean']['output'];
  /** Sidebar collapsed by default */
  readonly sidebarCollapsed: Scalars['Boolean']['output'];
  /** UI theme preference */
  readonly theme: ThemePreference;
};

export type ApplicationDocuments = {
  readonly __typename: 'ApplicationDocuments';
  readonly businessLicenseUrl?: Maybe<Scalars['String']['output']>;
  readonly insuranceCertificateUrl?: Maybe<Scalars['String']['output']>;
  readonly lineSheetUrl?: Maybe<Scalars['String']['output']>;
  readonly productCatalogUrl?: Maybe<Scalars['String']['output']>;
};

export enum ApplicationReviewDecision {
  APPROVE = 'APPROVE',
  CONDITIONALLY_APPROVE = 'CONDITIONALLY_APPROVE',
  REJECT = 'REJECT',
  REQUEST_INFO = 'REQUEST_INFO'
}

export type ApplicationReviewDecisionInput = {
  readonly applicationId: Scalars['ID']['input'];
  readonly approvalConditions?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  readonly decision: ApplicationReviewDecision;
  readonly decisionNote?: InputMaybe<Scalars['String']['input']>;
  readonly rejectionReason?: InputMaybe<Scalars['String']['input']>;
};

export enum ApplicationStatus {
  ADDITIONAL_INFO_REQUESTED = 'ADDITIONAL_INFO_REQUESTED',
  APPROVED = 'APPROVED',
  CONDITIONALLY_APPROVED = 'CONDITIONALLY_APPROVED',
  REJECTED = 'REJECTED',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  WITHDRAWN = 'WITHDRAWN'
}

/** Appointment */
export type Appointment = {
  readonly __typename: 'Appointment';
  readonly actualEnd?: Maybe<Scalars['DateTime']['output']>;
  readonly actualStart?: Maybe<Scalars['DateTime']['output']>;
  readonly cancellationReason?: Maybe<Scalars['String']['output']>;
  readonly cancelledAt?: Maybe<Scalars['DateTime']['output']>;
  readonly client: Client;
  readonly clientFeedback?: Maybe<ClientFeedback>;
  readonly createdAt: Scalars['DateTime']['output'];
  readonly id: Scalars['ID']['output'];
  readonly location: Location;
  readonly notes?: Maybe<Scalars['String']['output']>;
  readonly productsUsed: ReadonlyArray<ProductUsage>;
  readonly scheduledEnd: Scalars['DateTime']['output'];
  readonly scheduledStart: Scalars['DateTime']['output'];
  readonly serviceProvider: ServiceProvider;
  readonly serviceType: Scalars['String']['output'];
  readonly status: AppointmentStatus;
  readonly updatedAt: Scalars['DateTime']['output'];
};

export type AppointmentConnection = {
  readonly __typename: 'AppointmentConnection';
  readonly edges: ReadonlyArray<AppointmentEdge>;
  readonly pageInfo: PageInfo;
  readonly totalCount: Scalars['Int']['output'];
};

export type AppointmentEdge = {
  readonly __typename: 'AppointmentEdge';
  readonly cursor: Scalars['String']['output'];
  readonly node: Appointment;
};

/** Filters and pagination */
export type AppointmentFiltersInput = {
  readonly clientId?: InputMaybe<Scalars['ID']['input']>;
  readonly dateRange?: InputMaybe<DateRangeInput>;
  readonly locationId?: InputMaybe<Scalars['ID']['input']>;
  readonly serviceProviderId?: InputMaybe<Scalars['ID']['input']>;
  readonly spaOrganizationId?: InputMaybe<Scalars['ID']['input']>;
  readonly status?: InputMaybe<AppointmentStatus>;
};

/** Result types */
export type AppointmentResult = {
  readonly __typename: 'AppointmentResult';
  readonly appointment?: Maybe<Appointment>;
  readonly errors?: Maybe<ReadonlyArray<Error>>;
  readonly success: Scalars['Boolean']['output'];
};

export enum AppointmentStatus {
  CANCELLED = 'CANCELLED',
  CHECKED_IN = 'CHECKED_IN',
  COMPLETED = 'COMPLETED',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  NO_SHOW = 'NO_SHOW',
  PENDING = 'PENDING'
}

export enum ApprovalDecision {
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  REQUEST_INFO = 'REQUEST_INFO'
}

export enum ApprovalStatus {
  APPROVED = 'APPROVED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  REQUIRES_INFO = 'REQUIRES_INFO'
}

/** Atom with full Intelligence data */
export type AtomWithIntelligence = {
  readonly __typename: 'AtomWithIntelligence';
  readonly accessible: Scalars['Boolean']['output'];
  readonly atom?: Maybe<SkincareAtom>;
  readonly causalSummary?: Maybe<Scalars['String']['output']>;
  readonly efficacySummary?: Maybe<EfficacySummary>;
  readonly evidenceSummary?: Maybe<EvidenceSummary>;
  readonly goldilocksParameters: ReadonlyArray<GoldilocksParameter>;
  readonly whyItWorks?: Maybe<Scalars['String']['output']>;
};

/** Authentication result */
export type AuthResult = {
  readonly __typename: 'AuthResult';
  readonly accessToken?: Maybe<Scalars['String']['output']>;
  readonly errors?: Maybe<ReadonlyArray<Error>>;
  readonly refreshToken?: Maybe<Scalars['String']['output']>;
  readonly success: Scalars['Boolean']['output'];
  readonly user?: Maybe<User>;
};

export type BulkTaxonomyError = {
  readonly __typename: 'BulkTaxonomyError';
  readonly message: Scalars['String']['output'];
  readonly productId: Scalars['ID']['output'];
};

export type BulkTaxonomyResult = {
  readonly __typename: 'BulkTaxonomyResult';
  readonly errors?: Maybe<ReadonlyArray<BulkTaxonomyError>>;
  readonly success: Scalars['Boolean']['output'];
  readonly updatedCount: Scalars['Int']['output'];
};

/** Bulk taxonomy update for admin operations */
export type BulkTaxonomyUpdate = {
  readonly categoryId?: InputMaybe<Scalars['ID']['input']>;
  readonly primaryFunctionIds?: InputMaybe<ReadonlyArray<Scalars['ID']['input']>>;
  readonly productId: Scalars['ID']['input'];
};

/** Business alert */
export type BusinessAlert = {
  readonly __typename: 'BusinessAlert';
  readonly acknowledged: Scalars['Boolean']['output'];
  readonly acknowledgedAt?: Maybe<Scalars['DateTime']['output']>;
  readonly acknowledgedBy?: Maybe<Scalars['ID']['output']>;
  readonly affectedMetrics: ReadonlyArray<Scalars['String']['output']>;
  readonly category: AlertCategory;
  readonly currentValue?: Maybe<Scalars['Float']['output']>;
  readonly description: Scalars['String']['output'];
  readonly id: Scalars['ID']['output'];
  readonly recommendedActions: ReadonlyArray<Scalars['String']['output']>;
  readonly severity: AlertSeverity;
  readonly thresholdValue?: Maybe<Scalars['Float']['output']>;
  readonly timestamp: Scalars['DateTime']['output'];
  readonly title: Scalars['String']['output'];
};

export type BusinessLicense = {
  readonly __typename: 'BusinessLicense';
  readonly documentUrl: Scalars['String']['output'];
  readonly expirationDate: Scalars['DateTime']['output'];
  readonly number: Scalars['String']['output'];
  readonly state: Scalars['String']['output'];
};

export type BusinessLicenseInput = {
  readonly documentUrl: Scalars['String']['input'];
  readonly expirationDate: Scalars['DateTime']['input'];
  readonly number: Scalars['String']['input'];
  readonly state: Scalars['String']['input'];
};

/** Comprehensive business metrics for a given timeframe */
export type BusinessMetrics = {
  readonly __typename: 'BusinessMetrics';
  readonly ai: AiPerformanceMetrics;
  readonly computedAt: Scalars['DateTime']['output'];
  readonly customers: CustomerMetrics;
  readonly financial: FinancialMetrics;
  readonly products: ProductMetrics;
  readonly skincare: SkincareAnalytics;
  readonly timeframe: Scalars['String']['output'];
};

export type CampaignFilterInput = {
  readonly dateRange?: InputMaybe<DateRangeInput>;
  readonly status?: InputMaybe<ReadonlyArray<CampaignStatus>>;
  readonly type?: InputMaybe<CampaignType>;
};

export type CampaignPerformanceSummary = {
  readonly __typename: 'CampaignPerformanceSummary';
  readonly activeCampaigns: Scalars['Int']['output'];
  readonly channelPerformance: ReadonlyArray<ChannelPerformance>;
  readonly completedCampaigns: Scalars['Int']['output'];
  readonly dateRange: DateRange;
  readonly overallCTR: Scalars['Float']['output'];
  readonly overallConversionRate: Scalars['Float']['output'];
  readonly overallROAS: Scalars['Float']['output'];
  readonly topCampaignsByROAS: ReadonlyArray<MarketingCampaign>;
  readonly topCampaignsByRevenue: ReadonlyArray<MarketingCampaign>;
  readonly totalRevenue: Scalars['Float']['output'];
  readonly totalSpent: Scalars['Float']['output'];
};

export enum CampaignStatus {
  ACTIVE = 'ACTIVE',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  DRAFT = 'DRAFT',
  PAUSED = 'PAUSED',
  SCHEDULED = 'SCHEDULED'
}

export enum CampaignType {
  AFFILIATE = 'AFFILIATE',
  CONTENT = 'CONTENT',
  DISPLAY = 'DISPLAY',
  EMAIL = 'EMAIL',
  PAID_SEARCH = 'PAID_SEARCH',
  SOCIAL = 'SOCIAL'
}

export type CategoryCoverage = {
  readonly __typename: 'CategoryCoverage';
  readonly averageScore: Scalars['Float']['output'];
  readonly category: ProductCategory;
  readonly productCount: Scalars['Int']['output'];
};

export type CategoryPerformance = {
  readonly __typename: 'CategoryPerformance';
  readonly category: Scalars['String']['output'];
  readonly growthRate: Scalars['Float']['output'];
  readonly productCount: Scalars['Int']['output'];
  readonly revenue: Scalars['Float']['output'];
};

/** Causal Chain Node for graph traversal */
export type CausalChainNode = {
  readonly __typename: 'CausalChainNode';
  readonly atom: SkincareAtom;
  readonly depth: Scalars['Int']['output'];
  readonly direction: Scalars['String']['output'];
  readonly mechanismSummary?: Maybe<Scalars['String']['output']>;
  readonly relationship?: Maybe<SkincareRelationship>;
};

/** Causal Direction for graph traversal */
export enum CausalDirection {
  BOTH = 'BOTH',
  DOWNSTREAM = 'DOWNSTREAM',
  UPSTREAM = 'UPSTREAM'
}

/** Causal Path Step */
export type CausalPathStep = {
  readonly __typename: 'CausalPathStep';
  readonly atom: SkincareAtom;
  readonly mechanismSummary: Scalars['String']['output'];
  readonly relationship?: Maybe<SkincareRelationship>;
};

export type Certification = {
  readonly __typename: 'Certification';
  readonly certificateUrl?: Maybe<Scalars['String']['output']>;
  readonly expirationDate?: Maybe<Scalars['DateTime']['output']>;
  readonly issueDate: Scalars['DateTime']['output'];
  readonly issuingOrg: Scalars['String']['output'];
  readonly name: Scalars['String']['output'];
};

export type CertificationInput = {
  readonly certificateUrl?: InputMaybe<Scalars['String']['input']>;
  readonly expirationDate?: InputMaybe<Scalars['DateTime']['input']>;
  readonly issueDate: Scalars['DateTime']['input'];
  readonly issuingOrg: Scalars['String']['input'];
  readonly name: Scalars['String']['input'];
};

export type CertificationResult = {
  readonly __typename: 'CertificationResult';
  readonly certification?: Maybe<VendorCertification>;
  readonly errors?: Maybe<ReadonlyArray<VendorPortalError>>;
  readonly success: Scalars['Boolean']['output'];
};

export enum CertificationStatus {
  EXPIRED = 'EXPIRED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  VERIFIED = 'VERIFIED'
}

/** Certification Types - Require human verification (13 total) */
export enum CertificationType {
  B_CORP = 'B_CORP',
  COSMOS_NATURAL = 'COSMOS_NATURAL',
  COSMOS_ORGANIC = 'COSMOS_ORGANIC',
  ECOCERT = 'ECOCERT',
  EWG_VERIFIED = 'EWG_VERIFIED',
  FAIR_TRADE = 'FAIR_TRADE',
  FSC_CERTIFIED = 'FSC_CERTIFIED',
  LEAPING_BUNNY = 'LEAPING_BUNNY',
  MADE_SAFE = 'MADE_SAFE',
  MINORITY_OWNED_NMSDC = 'MINORITY_OWNED_NMSDC',
  PETA_CERTIFIED = 'PETA_CERTIFIED',
  USDA_ORGANIC = 'USDA_ORGANIC',
  WOMEN_OWNED_WBENC = 'WOMEN_OWNED_WBENC'
}

export enum CertificationVerificationDecision {
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  REQUEST_CLEARER_DOCUMENT = 'REQUEST_CLEARER_DOCUMENT'
}

export type CertificationVerificationInput = {
  readonly certificationId: Scalars['ID']['input'];
  readonly decision: CertificationVerificationDecision;
  readonly note?: InputMaybe<Scalars['String']['input']>;
  readonly rejectionReason?: InputMaybe<Scalars['String']['input']>;
};

export type ChannelPerformance = {
  readonly __typename: 'ChannelPerformance';
  readonly campaigns: Scalars['Int']['output'];
  readonly channel: CampaignType;
  readonly conversions: Scalars['Int']['output'];
  readonly revenue: Scalars['Float']['output'];
  readonly roas: Scalars['Float']['output'];
  readonly spent: Scalars['Float']['output'];
};

/** Claim Evidence - scientific backing for SKA atom claims */
export type ClaimEvidence = {
  readonly __typename: 'ClaimEvidence';
  readonly atomId: Scalars['ID']['output'];
  readonly claim: Scalars['String']['output'];
  readonly confidenceScore?: Maybe<Scalars['Float']['output']>;
  readonly createdAt: Scalars['String']['output'];
  readonly evidenceLevel: EvidenceLevel;
  readonly id: Scalars['ID']['output'];
  readonly notes?: Maybe<Scalars['String']['output']>;
  readonly publicationYear?: Maybe<Scalars['Int']['output']>;
  readonly sampleSize?: Maybe<Scalars['Int']['output']>;
  readonly sourceReference?: Maybe<Scalars['String']['output']>;
  readonly sourceType?: Maybe<Scalars['String']['output']>;
  readonly studyDuration?: Maybe<Scalars['String']['output']>;
  readonly updatedAt: Scalars['String']['output'];
};

/** Claim Evidence input for mutations */
export type ClaimEvidenceInput = {
  readonly claim: Scalars['String']['input'];
  readonly confidenceScore?: InputMaybe<Scalars['Float']['input']>;
  readonly evidenceLevel: EvidenceLevel;
  readonly notes?: InputMaybe<Scalars['String']['input']>;
  readonly publicationYear?: InputMaybe<Scalars['Int']['input']>;
  readonly sampleSize?: InputMaybe<Scalars['Int']['input']>;
  readonly sourceReference?: InputMaybe<Scalars['String']['input']>;
  readonly sourceType?: InputMaybe<Scalars['String']['input']>;
  readonly studyDuration?: InputMaybe<Scalars['String']['input']>;
};

/** Client */
export type Client = {
  readonly __typename: 'Client';
  readonly allergies: ReadonlyArray<Scalars['String']['output']>;
  readonly appointments: ReadonlyArray<Appointment>;
  readonly createdAt: Scalars['DateTime']['output'];
  readonly dateOfBirth?: Maybe<Scalars['DateTime']['output']>;
  readonly email?: Maybe<Scalars['String']['output']>;
  readonly firstName: Scalars['String']['output'];
  readonly id: Scalars['ID']['output'];
  readonly lastName: Scalars['String']['output'];
  readonly notes?: Maybe<Scalars['String']['output']>;
  readonly phone?: Maybe<Scalars['String']['output']>;
  readonly preferences: ClientPreferences;
  readonly skinProfile: SkinProfile;
  readonly spaOrganization: SpaOrganization;
  readonly treatmentPlans: ReadonlyArray<TreatmentPlan>;
  readonly updatedAt: Scalars['DateTime']['output'];
  readonly user?: Maybe<User>;
  readonly userId?: Maybe<Scalars['ID']['output']>;
};

export type ClientConnection = {
  readonly __typename: 'ClientConnection';
  readonly edges: ReadonlyArray<ClientEdge>;
  readonly pageInfo: PageInfo;
  readonly totalCount: Scalars['Int']['output'];
};

export type ClientEdge = {
  readonly __typename: 'ClientEdge';
  readonly cursor: Scalars['String']['output'];
  readonly node: Client;
};

export type ClientFeedback = {
  readonly __typename: 'ClientFeedback';
  readonly comments?: Maybe<Scalars['String']['output']>;
  readonly rating: Scalars['Int']['output'];
  readonly submittedAt: Scalars['DateTime']['output'];
  readonly wouldRecommend: Scalars['Boolean']['output'];
};

export type ClientPreferences = {
  readonly __typename: 'ClientPreferences';
  readonly communicationChannel: CommunicationChannel;
  readonly marketingOptIn: Scalars['Boolean']['output'];
  readonly preferredProviders?: Maybe<ReadonlyArray<Scalars['ID']['output']>>;
  readonly reminderPreference: ReminderPreference;
};

export type ClientPreferencesInput = {
  readonly communicationChannel: CommunicationChannel;
  readonly marketingOptIn: Scalars['Boolean']['input'];
  readonly preferredProviders?: InputMaybe<ReadonlyArray<Scalars['ID']['input']>>;
  readonly reminderPreference: ReminderPreferenceInput;
};

export type ClientResult = {
  readonly __typename: 'ClientResult';
  readonly client?: Maybe<Client>;
  readonly errors?: Maybe<ReadonlyArray<Error>>;
  readonly success: Scalars['Boolean']['output'];
};

export type ClinicalData = {
  readonly __typename: 'ClinicalData';
  readonly certifications: ReadonlyArray<Scalars['String']['output']>;
  readonly testReports: ReadonlyArray<TestReport>;
  readonly trials: ReadonlyArray<ClinicalTrial>;
};

export type ClinicalTrial = {
  readonly __typename: 'ClinicalTrial';
  readonly duration: Scalars['String']['output'];
  readonly participants: Scalars['Int']['output'];
  readonly publicationUrl?: Maybe<Scalars['String']['output']>;
  readonly results: Scalars['String']['output'];
  readonly studyName: Scalars['String']['output'];
};

export enum CommunicationChannel {
  BOTH = 'BOTH',
  EMAIL = 'EMAIL',
  SMS = 'SMS'
}

/** Comment on a community post */
export type CommunityComment = {
  readonly __typename: 'CommunityComment';
  readonly author: SanctuaryMember;
  readonly content: Scalars['String']['output'];
  readonly createdAt: Scalars['DateTime']['output'];
  readonly hasLiked: Scalars['Boolean']['output'];
  readonly id: Scalars['ID']['output'];
  readonly isAcceptedAnswer: Scalars['Boolean']['output'];
  readonly likeCount: Scalars['Int']['output'];
  readonly replies: ReadonlyArray<CommunityComment>;
  readonly updatedAt: Scalars['DateTime']['output'];
};

/** Community event (workshop, webinar, meetup, conference) */
export type CommunityEvent = {
  readonly __typename: 'CommunityEvent';
  readonly attendeeCount: Scalars['Int']['output'];
  readonly createdAt: Scalars['DateTime']['output'];
  readonly description?: Maybe<Scalars['String']['output']>;
  readonly endTime?: Maybe<Scalars['DateTime']['output']>;
  readonly eventType: EventType;
  readonly format: EventFormat;
  readonly id: Scalars['ID']['output'];
  readonly isRegistered: Scalars['Boolean']['output'];
  readonly location?: Maybe<Scalars['String']['output']>;
  readonly maxAttendees?: Maybe<Scalars['Int']['output']>;
  readonly organizer: SanctuaryMember;
  readonly priceCents: Scalars['Int']['output'];
  readonly registrationDeadline?: Maybe<Scalars['DateTime']['output']>;
  readonly skaTopics: ReadonlyArray<SkincareAtom>;
  readonly startTime: Scalars['DateTime']['output'];
  readonly status: EventStatus;
  readonly title: Scalars['String']['output'];
  readonly virtualLink?: Maybe<Scalars['String']['output']>;
};

/** Paginated event connection */
export type CommunityEventConnection = {
  readonly __typename: 'CommunityEventConnection';
  readonly hasMore: Scalars['Boolean']['output'];
  readonly items: ReadonlyArray<CommunityEvent>;
  readonly totalCount: Scalars['Int']['output'];
};

/** Community post (discussion, question, article, case study) */
export type CommunityPost = {
  readonly __typename: 'CommunityPost';
  readonly author: SanctuaryMember;
  readonly category?: Maybe<Scalars['String']['output']>;
  readonly commentCount: Scalars['Int']['output'];
  readonly comments: ReadonlyArray<CommunityComment>;
  readonly content: Scalars['String']['output'];
  readonly createdAt: Scalars['DateTime']['output'];
  readonly hasLiked: Scalars['Boolean']['output'];
  readonly id: Scalars['ID']['output'];
  readonly isFeatured: Scalars['Boolean']['output'];
  readonly isPinned: Scalars['Boolean']['output'];
  readonly likeCount: Scalars['Int']['output'];
  readonly postType: PostType;
  readonly skaAtoms: ReadonlyArray<SkincareAtom>;
  readonly status: PostStatus;
  readonly tags: ReadonlyArray<Scalars['String']['output']>;
  readonly title: Scalars['String']['output'];
  readonly updatedAt: Scalars['DateTime']['output'];
  readonly viewCount: Scalars['Int']['output'];
};


/** Community post (discussion, question, article, case study) */
export type CommunityPostCommentsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

/** Paginated post connection */
export type CommunityPostConnection = {
  readonly __typename: 'CommunityPostConnection';
  readonly hasMore: Scalars['Boolean']['output'];
  readonly items: ReadonlyArray<CommunityPost>;
  readonly totalCount: Scalars['Int']['output'];
};

/** Compatibility Analysis Result */
export type CompatibilityResult = {
  readonly __typename: 'CompatibilityResult';
  readonly compatible: Scalars['Boolean']['output'];
  readonly conflicts: ReadonlyArray<IngredientInteraction>;
  readonly interactions: ReadonlyArray<IngredientInteraction>;
  readonly overallScore: Scalars['Int']['output'];
  readonly sequenceRecommendation: ReadonlyArray<SkincareAtom>;
  readonly synergies: ReadonlyArray<IngredientInteraction>;
  readonly tips: ReadonlyArray<Scalars['String']['output']>;
  readonly warnings: ReadonlyArray<Scalars['String']['output']>;
};

export type CompleteAppointmentInput = {
  readonly notes?: InputMaybe<Scalars['String']['input']>;
  readonly productsUsed?: InputMaybe<ReadonlyArray<ProductUsageInput>>;
};

export type CompleteOnboardingStepInput = {
  readonly data?: InputMaybe<Scalars['JSON']['input']>;
  readonly stepId: Scalars['ID']['input'];
};

/** Compliance severity levels */
export enum ComplianceSeverity {
  CRITICAL = 'CRITICAL',
  INFO = 'INFO',
  WARNING = 'WARNING'
}

export type ConcernAnalysis = {
  readonly __typename: 'ConcernAnalysis';
  readonly avgResolutionDays?: Maybe<Scalars['Int']['output']>;
  readonly concern: Scalars['String']['output'];
  readonly frequency: Scalars['Int']['output'];
  readonly growthRate: Scalars['Float']['output'];
};

export enum ConcernSeverity {
  MILD = 'MILD',
  MODERATE = 'MODERATE',
  SEVERE = 'SEVERE'
}

/** Conflict Type classification */
export enum ConflictType {
  DILUTION = 'DILUTION',
  INACTIVATION = 'INACTIVATION',
  IRRITATION = 'IRRITATION',
  OXIDATION = 'OXIDATION',
  PENETRATION_BARRIER = 'PENETRATION_BARRIER',
  PH_INCOMPATIBILITY = 'PH_INCOMPATIBILITY'
}

export type ConsultationMetrics = {
  readonly __typename: 'ConsultationMetrics';
  readonly avgSatisfaction: Scalars['Float']['output'];
  readonly avgSessionDuration: Scalars['Int']['output'];
  readonly successRate: Scalars['Float']['output'];
  readonly totalSessions: Scalars['Int']['output'];
};

export type Conversation = {
  readonly __typename: 'Conversation';
  readonly createdAt: Scalars['DateTime']['output'];
  readonly id: Scalars['ID']['output'];
  readonly lastMessageAt?: Maybe<Scalars['DateTime']['output']>;
  readonly spaId: Scalars['String']['output'];
  readonly spaName: Scalars['String']['output'];
  readonly status: ConversationStatus;
  readonly subject: Scalars['String']['output'];
  readonly unreadCount: Scalars['Int']['output'];
  readonly vendorId: Scalars['String']['output'];
};

export type ConversationFilterInput = {
  readonly search?: InputMaybe<Scalars['String']['input']>;
  readonly status?: InputMaybe<ConversationStatus>;
};

export type ConversationMessage = {
  readonly __typename: 'ConversationMessage';
  readonly content: Scalars['String']['output'];
  readonly conversationId: Scalars['ID']['output'];
  readonly createdAt: Scalars['DateTime']['output'];
  readonly id: Scalars['ID']['output'];
  readonly isRead: Scalars['Boolean']['output'];
  readonly isSystemMessage: Scalars['Boolean']['output'];
  readonly senderId: Scalars['String']['output'];
  readonly senderName: Scalars['String']['output'];
  readonly senderType: MessageSenderType;
};

export type ConversationMessagesResponse = {
  readonly __typename: 'ConversationMessagesResponse';
  readonly hasMore: Scalars['Boolean']['output'];
  readonly messages: ReadonlyArray<ConversationMessage>;
  readonly totalCount: Scalars['Int']['output'];
};

export enum ConversationStatus {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
  RESOLVED = 'RESOLVED'
}

/** Input types */
export type CreateAppointmentInput = {
  readonly clientId: Scalars['ID']['input'];
  readonly locationId: Scalars['ID']['input'];
  readonly notes?: InputMaybe<Scalars['String']['input']>;
  readonly scheduledEnd: Scalars['DateTime']['input'];
  readonly scheduledStart: Scalars['DateTime']['input'];
  readonly serviceProviderId: Scalars['ID']['input'];
  readonly serviceType: Scalars['String']['input'];
};

export type CreateCampaignInput = {
  readonly audienceDetails?: InputMaybe<Scalars['JSON']['input']>;
  readonly audienceSize?: InputMaybe<Scalars['Int']['input']>;
  readonly budgetDollars: Scalars['Float']['input'];
  readonly description?: InputMaybe<Scalars['String']['input']>;
  readonly endDate: Scalars['DateTime']['input'];
  readonly metadata?: InputMaybe<Scalars['JSON']['input']>;
  readonly name: Scalars['String']['input'];
  readonly startDate: Scalars['DateTime']['input'];
  readonly type: CampaignType;
};

export type CreateClientInput = {
  readonly allergies?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  readonly dateOfBirth?: InputMaybe<Scalars['DateTime']['input']>;
  readonly email?: InputMaybe<Scalars['String']['input']>;
  readonly firstName: Scalars['String']['input'];
  readonly lastName: Scalars['String']['input'];
  readonly notes?: InputMaybe<Scalars['String']['input']>;
  readonly phone?: InputMaybe<Scalars['String']['input']>;
  readonly preferences?: InputMaybe<ClientPreferencesInput>;
  readonly skinProfile: SkinProfileInput;
  readonly spaOrganizationId: Scalars['ID']['input'];
  readonly userId?: InputMaybe<Scalars['ID']['input']>;
};

export type CreateConversationInput = {
  readonly contextId?: InputMaybe<Scalars['String']['input']>;
  readonly contextType?: InputMaybe<Scalars['String']['input']>;
  readonly spaId: Scalars['String']['input'];
  readonly subject: Scalars['String']['input'];
  readonly vendorId: Scalars['String']['input'];
};

/** Input for creating a new event */
export type CreateEventInput = {
  readonly description?: InputMaybe<Scalars['String']['input']>;
  readonly endTime?: InputMaybe<Scalars['DateTime']['input']>;
  readonly eventType: EventType;
  readonly format: EventFormat;
  readonly location?: InputMaybe<Scalars['String']['input']>;
  readonly maxAttendees?: InputMaybe<Scalars['Int']['input']>;
  readonly priceCents?: InputMaybe<Scalars['Int']['input']>;
  readonly registrationDeadline?: InputMaybe<Scalars['DateTime']['input']>;
  readonly skaTopicIds?: InputMaybe<ReadonlyArray<Scalars['ID']['input']>>;
  readonly startTime: Scalars['DateTime']['input'];
  readonly title: Scalars['String']['input'];
  readonly virtualLink?: InputMaybe<Scalars['String']['input']>;
};

/** Input for creating a new post */
export type CreatePostInput = {
  readonly category?: InputMaybe<Scalars['String']['input']>;
  readonly content: Scalars['String']['input'];
  readonly postType: PostType;
  readonly skaAtomIds?: InputMaybe<ReadonlyArray<Scalars['ID']['input']>>;
  readonly status?: InputMaybe<PostStatus>;
  readonly tags?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  readonly title: Scalars['String']['input'];
};

/** Create product input */
export type CreateProductInput = {
  readonly glance: ProductGlanceInput;
  readonly scan: ProductScanInput;
  readonly study?: InputMaybe<ProductStudyInput>;
  readonly vendorOrganizationId: Scalars['ID']['input'];
  readonly vendureProductId: Scalars['ID']['input'];
};

/** Input types */
export type CreateSpaOrganizationInput = {
  readonly address: AddressInput;
  readonly contactEmail: Scalars['String']['input'];
  readonly contactPhone?: InputMaybe<Scalars['String']['input']>;
  readonly displayName: Scalars['String']['input'];
  readonly logoUrl?: InputMaybe<Scalars['String']['input']>;
  readonly name: Scalars['String']['input'];
  readonly subscriptionTier?: InputMaybe<SubscriptionTier>;
};

export type CreateVendorOrganizationInput = {
  readonly address: AddressInput;
  readonly businessLicense: BusinessLicenseInput;
  readonly certifications: ReadonlyArray<CertificationInput>;
  readonly companyName: Scalars['String']['input'];
  readonly contactEmail: Scalars['String']['input'];
  readonly contactPhone?: InputMaybe<Scalars['String']['input']>;
  readonly displayName: Scalars['String']['input'];
  readonly fulfillmentSettings: FulfillmentSettingsInput;
  readonly insurance: InsuranceInfoInput;
};

export type CreateVendorProfileInput = {
  readonly brandName: Scalars['String']['input'];
  readonly vendorId: Scalars['ID']['input'];
};

export type CrossSellPair = {
  readonly __typename: 'CrossSellPair';
  readonly coOccurrenceCount: Scalars['Int']['output'];
  readonly correlation: Scalars['Float']['output'];
  readonly product1Id: Scalars['ID']['output'];
  readonly product1Name: Scalars['String']['output'];
  readonly product2Id: Scalars['ID']['output'];
  readonly product2Name: Scalars['String']['output'];
};

/** Customer analytics */
export type CustomerMetrics = {
  readonly __typename: 'CustomerMetrics';
  readonly averageCustomerAge: Scalars['Int']['output'];
  readonly churnedCustomers: Scalars['Int']['output'];
  readonly geographicDistribution: ReadonlyArray<GeographicRegion>;
  readonly journeyStageDistribution: ReadonlyArray<JourneyStage>;
  readonly newAcquisitions: Scalars['Int']['output'];
  readonly topSegments: ReadonlyArray<CustomerSegment>;
  readonly totalActive: Scalars['Int']['output'];
};

export type CustomerSegment = {
  readonly __typename: 'CustomerSegment';
  readonly count: Scalars['Int']['output'];
  readonly growthRate: Scalars['Float']['output'];
  readonly revenue: Scalars['Float']['output'];
  readonly segment: Scalars['String']['output'];
};

export type DashboardMetric = {
  readonly __typename: 'DashboardMetric';
  readonly changePercent: Scalars['Float']['output'];
  readonly previousValue: Scalars['Float']['output'];
  readonly trend: TrendDirection;
  readonly value: Scalars['Float']['output'];
};

/** Quick dashboard summary for executive view */
export type DashboardSummary = {
  readonly __typename: 'DashboardSummary';
  readonly aiRecommendationAcceptance: DashboardMetric;
  readonly avgOrderValue: DashboardMetric;
  readonly churnRate: DashboardMetric;
  readonly customers: DashboardMetric;
  readonly keyInsights: ReadonlyArray<Scalars['String']['output']>;
  readonly orders: DashboardMetric;
  readonly recentAlerts: ReadonlyArray<BusinessAlert>;
  readonly revenue: DashboardMetric;
  readonly topProducts: ReadonlyArray<ProductPerformance>;
};

/** Date format options */
export enum DateFormat {
  DD_MM_YYYY = 'DD_MM_YYYY',
  MM_DD_YYYY = 'MM_DD_YYYY',
  YYYY_MM_DD = 'YYYY_MM_DD'
}

export type DateRange = {
  readonly __typename: 'DateRange';
  readonly endDate: Scalars['DateTime']['output'];
  readonly startDate: Scalars['DateTime']['output'];
};

/** Date range filter */
export type DateRangeInput = {
  readonly endDate: Scalars['DateTime']['input'];
  readonly startDate: Scalars['DateTime']['input'];
};

/** Default view after login */
export enum DefaultView {
  APPOINTMENTS = 'APPOINTMENTS',
  AURA = 'AURA',
  CLIENTS = 'CLIENTS',
  DASHBOARD = 'DASHBOARD',
  ECOSYSTEM = 'ECOSYSTEM',
  MARKETPLACE = 'MARKETPLACE',
  SANCTUARY = 'SANCTUARY'
}

/** Progressive Disclosure Detail Level */
export enum DetailLevel {
  GLANCE = 'GLANCE',
  SCAN = 'SCAN',
  STUDY = 'STUDY'
}

/** Progressive Disclosure Content */
export type DisclosureContent = {
  readonly __typename: 'DisclosureContent';
  readonly glance: Scalars['String']['output'];
  readonly scan: Scalars['String']['output'];
  readonly study: Scalars['String']['output'];
};

/** Progressive Disclosure Level */
export enum DisclosureLevel {
  GLANCE = 'GLANCE',
  SCAN = 'SCAN',
  STUDY = 'STUDY'
}

export type DiscoveryAnalytics = {
  readonly __typename: 'DiscoveryAnalytics';
  readonly impressions: ImpressionMetrics;
  readonly missedQueries: ReadonlyArray<SearchQueryInsight>;
  readonly profileEngagement: ProfileEngagement;
  readonly queriesLeadingToYou: ReadonlyArray<SearchQueryInsight>;
  readonly recommendations: ReadonlyArray<DiscoveryRecommendation>;
  readonly valuesPerformance: ReadonlyArray<ValuePerformance>;
};

export type DiscoveryRecommendation = {
  readonly __typename: 'DiscoveryRecommendation';
  readonly actionLabel: Scalars['String']['output'];
  readonly actionRoute: Scalars['String']['output'];
  readonly description: Scalars['String']['output'];
  readonly potentialImpact: Scalars['String']['output'];
  readonly priority: RecommendationPriority;
  readonly title: Scalars['String']['output'];
  readonly type: RecommendationType;
};

/** Efficacy Indicator - measurable outcomes for atoms */
export type EfficacyIndicator = {
  readonly __typename: 'EfficacyIndicator';
  readonly atomId: Scalars['ID']['output'];
  readonly baselineValue?: Maybe<Scalars['Float']['output']>;
  readonly createdAt: Scalars['String']['output'];
  readonly evidenceLevel?: Maybe<EvidenceLevel>;
  readonly goldilocksZone?: Maybe<Scalars['String']['output']>;
  readonly id: Scalars['ID']['output'];
  readonly indicatorName: Scalars['String']['output'];
  readonly measurementType?: Maybe<Scalars['String']['output']>;
  readonly notes?: Maybe<Scalars['String']['output']>;
  readonly optimalMax?: Maybe<Scalars['Float']['output']>;
  readonly optimalMin?: Maybe<Scalars['Float']['output']>;
  readonly targetValue?: Maybe<Scalars['Float']['output']>;
  readonly timeToEffect?: Maybe<Scalars['String']['output']>;
  readonly unit?: Maybe<Scalars['String']['output']>;
  readonly updatedAt: Scalars['String']['output'];
};

/** Efficacy Indicator input for mutations */
export type EfficacyIndicatorInput = {
  readonly baselineValue?: InputMaybe<Scalars['Float']['input']>;
  readonly evidenceLevel?: InputMaybe<EvidenceLevel>;
  readonly goldilocksZone?: InputMaybe<Scalars['String']['input']>;
  readonly indicatorName: Scalars['String']['input'];
  readonly measurementType?: InputMaybe<Scalars['String']['input']>;
  readonly notes?: InputMaybe<Scalars['String']['input']>;
  readonly optimalMax?: InputMaybe<Scalars['Float']['input']>;
  readonly optimalMin?: InputMaybe<Scalars['Float']['input']>;
  readonly targetValue?: InputMaybe<Scalars['Float']['input']>;
  readonly timeToEffect?: InputMaybe<Scalars['String']['input']>;
  readonly unit?: InputMaybe<Scalars['String']['input']>;
};

/** Efficacy Summary for an atom */
export type EfficacySummary = {
  readonly __typename: 'EfficacySummary';
  readonly averageImprovement: Scalars['Float']['output'];
  readonly highQualityCount: Scalars['Int']['output'];
  readonly indicators: ReadonlyArray<EfficacyIndicator>;
  readonly shortestTimeframe?: Maybe<Scalars['String']['output']>;
};

export enum EffortLevel {
  HIGH = 'HIGH',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM'
}

/** Common error type */
export type Error = {
  readonly __typename: 'Error';
  readonly code: Scalars['String']['output'];
  readonly field?: Maybe<Scalars['String']['output']>;
  readonly message: Scalars['String']['output'];
};

/** Event format */
export enum EventFormat {
  HYBRID = 'HYBRID',
  IN_PERSON = 'IN_PERSON',
  VIRTUAL = 'VIRTUAL'
}

/** Event status */
export enum EventStatus {
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  ONGOING = 'ONGOING',
  UPCOMING = 'UPCOMING'
}

/** Event type categorization */
export enum EventType {
  CONFERENCE = 'CONFERENCE',
  MEETUP = 'MEETUP',
  WEBINAR = 'WEBINAR',
  WORKSHOP = 'WORKSHOP'
}

/**
 * Evidence Level Classification
 * 7-tier system for scientific rigor
 */
export enum EvidenceLevel {
  ANECDOTAL = 'ANECDOTAL',
  ANIMAL = 'ANIMAL',
  GOLD_STANDARD = 'GOLD_STANDARD',
  HUMAN_CONTROLLED = 'HUMAN_CONTROLLED',
  HUMAN_PILOT = 'HUMAN_PILOT',
  IN_VITRO = 'IN_VITRO',
  META_ANALYSIS = 'META_ANALYSIS'
}

/** Evidence Summary for an atom */
export type EvidenceSummary = {
  readonly __typename: 'EvidenceSummary';
  readonly averageEvidenceStrength: Scalars['Float']['output'];
  readonly claimsByLevel: Scalars['JSON']['output'];
  readonly highestEvidenceLevel?: Maybe<EvidenceLevel>;
  readonly totalClaims: Scalars['Int']['output'];
};

/** Financial performance metrics */
export type FinancialMetrics = {
  readonly __typename: 'FinancialMetrics';
  readonly averageOrderValue: Scalars['Float']['output'];
  readonly churnRate: Scalars['Float']['output'];
  readonly conversionRate: Scalars['Float']['output'];
  readonly customerLifetimeValue: Scalars['Float']['output'];
  readonly growthRate: Scalars['Float']['output'];
  readonly monthlyRecurringRevenue: Scalars['Float']['output'];
  readonly retentionRate: Scalars['Float']['output'];
  readonly revenueByPeriod: ReadonlyArray<RevenuePeriod>;
  readonly totalRevenue: Scalars['Float']['output'];
};

export type FulfillmentInfo = {
  readonly __typename: 'FulfillmentInfo';
  readonly actualDelivery?: Maybe<Scalars['DateTime']['output']>;
  readonly carrier?: Maybe<Scalars['String']['output']>;
  readonly estimatedDelivery?: Maybe<Scalars['DateTime']['output']>;
  readonly trackingNumber?: Maybe<Scalars['String']['output']>;
  readonly trackingUrl?: Maybe<Scalars['String']['output']>;
};

export type FulfillmentSettings = {
  readonly __typename: 'FulfillmentSettings';
  readonly freeShippingThreshold?: Maybe<Scalars['Float']['output']>;
  readonly handlingTime: Scalars['Int']['output'];
  readonly returnPolicy: Scalars['String']['output'];
  readonly shippingMethods: ReadonlyArray<Scalars['String']['output']>;
};

export type FulfillmentSettingsInput = {
  readonly freeShippingThreshold?: InputMaybe<Scalars['Float']['input']>;
  readonly handlingTime: Scalars['Int']['input'];
  readonly returnPolicy: Scalars['String']['input'];
  readonly shippingMethods: ReadonlyArray<Scalars['String']['input']>;
};

export type GenerateReportInput = {
  readonly filters?: InputMaybe<MetricsFiltersInput>;
  readonly format: ReportFormat;
  readonly includeCharts?: InputMaybe<Scalars['Boolean']['input']>;
  readonly includeRawData?: InputMaybe<Scalars['Boolean']['input']>;
  readonly includeRecommendations?: InputMaybe<Scalars['Boolean']['input']>;
  readonly timeframe: MetricsTimeframeInput;
  readonly type: ReportType;
};

export type GeographicRegion = {
  readonly __typename: 'GeographicRegion';
  readonly customers: Scalars['Int']['output'];
  readonly region: Scalars['String']['output'];
  readonly revenue: Scalars['Float']['output'];
};

/** Goldilocks parameter - optimal ranges for ingredients/protocols */
export type GoldilocksParameter = {
  readonly __typename: 'GoldilocksParameter';
  readonly absoluteMax?: Maybe<Scalars['Float']['output']>;
  readonly absoluteMin?: Maybe<Scalars['Float']['output']>;
  readonly atomId: Scalars['ID']['output'];
  readonly context?: Maybe<Scalars['String']['output']>;
  readonly createdAt: Scalars['String']['output'];
  readonly evidenceLevel?: Maybe<Scalars['String']['output']>;
  readonly id: Scalars['ID']['output'];
  readonly notes?: Maybe<Scalars['String']['output']>;
  readonly optimalMax: Scalars['Float']['output'];
  readonly optimalMin: Scalars['Float']['output'];
  readonly parameterName: Scalars['String']['output'];
  readonly parameterUnit?: Maybe<Scalars['String']['output']>;
  readonly skinType?: Maybe<Scalars['String']['output']>;
  readonly sourceType?: Maybe<SourceType>;
  readonly sourceUrl?: Maybe<Scalars['String']['output']>;
  readonly updatedAt: Scalars['String']['output'];
};

export type ImpressionMetrics = {
  readonly __typename: 'ImpressionMetrics';
  readonly bySource: ImpressionsBySource;
  readonly percentChange: Scalars['Float']['output'];
  readonly total: Scalars['Int']['output'];
  readonly trend: TrendIndicator;
};

export type ImpressionsBySource = {
  readonly __typename: 'ImpressionsBySource';
  readonly browse: Scalars['Int']['output'];
  readonly direct: Scalars['Int']['output'];
  readonly recommendation: Scalars['Int']['output'];
  readonly search: Scalars['Int']['output'];
  readonly values: Scalars['Int']['output'];
};

export type Ingredient = {
  readonly __typename: 'Ingredient';
  readonly concentration?: Maybe<Scalars['Float']['output']>;
  readonly function: Scalars['String']['output'];
  readonly name: Scalars['String']['output'];
  readonly warnings?: Maybe<ReadonlyArray<Scalars['String']['output']>>;
};

export type IngredientAnalysis = {
  readonly __typename: 'IngredientAnalysis';
  readonly avgEfficacyScore?: Maybe<Scalars['Float']['output']>;
  readonly ingredient: Scalars['String']['output'];
  readonly productCount: Scalars['Int']['output'];
  readonly satisfaction: Scalars['Float']['output'];
  readonly usage: Scalars['Int']['output'];
};

export type IngredientInput = {
  readonly concentration?: InputMaybe<Scalars['Float']['input']>;
  readonly function: Scalars['String']['input'];
  readonly name: Scalars['String']['input'];
  readonly warnings?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
};

/** Ingredient Interaction result */
export type IngredientInteraction = {
  readonly __typename: 'IngredientInteraction';
  readonly atomA: SkincareAtom;
  readonly atomB: SkincareAtom;
  readonly conflictType?: Maybe<ConflictType>;
  readonly interactionType: InteractionType;
  readonly mechanism: Scalars['String']['output'];
  readonly recommendation: Scalars['String']['output'];
  readonly severity: Scalars['Int']['output'];
  readonly synergyType?: Maybe<SynergyType>;
  readonly waitTime?: Maybe<Scalars['String']['output']>;
};

export type IngredientList = {
  readonly __typename: 'IngredientList';
  readonly actives: ReadonlyArray<ActiveIngredient>;
  readonly allergens: ReadonlyArray<Scalars['String']['output']>;
  readonly crueltyFree: Scalars['Boolean']['output'];
  readonly inci: ReadonlyArray<Ingredient>;
  readonly vegan: Scalars['Boolean']['output'];
};

export type IngredientListInput = {
  readonly actives: ReadonlyArray<ActiveIngredientInput>;
  readonly allergens: ReadonlyArray<Scalars['String']['input']>;
  readonly crueltyFree: Scalars['Boolean']['input'];
  readonly inci: ReadonlyArray<IngredientInput>;
  readonly vegan: Scalars['Boolean']['input'];
};

/** AI-generated insights for business intelligence */
export type InsightEngine = {
  readonly __typename: 'InsightEngine';
  readonly actionableRecommendations: ReadonlyArray<ActionableRecommendation>;
  readonly anomalyDetection: ReadonlyArray<AnomalyInsight>;
  readonly businessAlerts: ReadonlyArray<BusinessAlert>;
  readonly generatedAt: Scalars['DateTime']['output'];
  readonly predictiveInsights: ReadonlyArray<PredictiveInsight>;
  readonly trendAnalysis: ReadonlyArray<TrendInsight>;
};

export type InsuranceInfo = {
  readonly __typename: 'InsuranceInfo';
  readonly coverage: Money;
  readonly documentUrl: Scalars['String']['output'];
  readonly expirationDate: Scalars['DateTime']['output'];
  readonly policyNumber: Scalars['String']['output'];
  readonly provider: Scalars['String']['output'];
};

export type InsuranceInfoInput = {
  readonly coverage: MoneyInput;
  readonly documentUrl: Scalars['String']['input'];
  readonly expirationDate: Scalars['DateTime']['input'];
  readonly policyNumber: Scalars['String']['input'];
  readonly provider: Scalars['String']['input'];
};

/** Intelligence Search filters */
export type IntelligenceSearchFilters = {
  readonly atomTypes?: InputMaybe<ReadonlyArray<SkincareAtomType>>;
  readonly maxSensitivity?: InputMaybe<Scalars['Float']['input']>;
  readonly minAntiAging?: InputMaybe<Scalars['Float']['input']>;
  readonly minEvidenceLevel?: InputMaybe<EvidenceLevel>;
  readonly minHydration?: InputMaybe<Scalars['Float']['input']>;
  readonly thresholds?: InputMaybe<ReadonlyArray<KnowledgeThreshold>>;
};

/** Intelligence Search Response */
export type IntelligenceSearchResponse = {
  readonly __typename: 'IntelligenceSearchResponse';
  readonly executionTimeMs?: Maybe<Scalars['Int']['output']>;
  readonly query?: Maybe<Scalars['String']['output']>;
  readonly results: ReadonlyArray<IntelligenceSearchResult>;
  readonly totalCount: Scalars['Int']['output'];
};

/** Intelligence Search Result */
export type IntelligenceSearchResult = {
  readonly __typename: 'IntelligenceSearchResult';
  readonly atom: SkincareAtom;
  readonly combinedScore: Scalars['Float']['output'];
  readonly evidenceStrength: Scalars['Float']['output'];
  readonly knowledgeThreshold?: Maybe<KnowledgeThreshold>;
  readonly semanticScore: Scalars['Float']['output'];
  readonly tensorScore: Scalars['Float']['output'];
};

/** Interaction Type between ingredients */
export enum InteractionType {
  CONFLICT = 'CONFLICT',
  NEUTRAL = 'NEUTRAL',
  SEQUENCING = 'SEQUENCING',
  SYNERGY = 'SYNERGY'
}

export enum JobStatus {
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING'
}

/** Job status response for async operations */
export type JobStatusResponse = {
  readonly __typename: 'JobStatusResponse';
  readonly jobId: Scalars['String']['output'];
  readonly message?: Maybe<Scalars['String']['output']>;
  readonly status: JobStatus;
};

export type JourneyStage = {
  readonly __typename: 'JourneyStage';
  readonly count: Scalars['Int']['output'];
  readonly percentage: Scalars['Float']['output'];
  readonly stage: Scalars['String']['output'];
};

/**
 * Knowledge Threshold Levels (T1-T8)
 * Hierarchical classification of knowledge complexity and access levels
 */
export enum KnowledgeThreshold {
  T1_SKIN_BIOLOGY = 'T1_SKIN_BIOLOGY',
  T2_INGREDIENT_SCIENCE = 'T2_INGREDIENT_SCIENCE',
  T3_PRODUCT_FORMULATION = 'T3_PRODUCT_FORMULATION',
  T4_TREATMENT_PROTOCOLS = 'T4_TREATMENT_PROTOCOLS',
  T5_CONTRAINDICATIONS = 'T5_CONTRAINDICATIONS',
  T6_PROFESSIONAL_TECHNIQUES = 'T6_PROFESSIONAL_TECHNIQUES',
  T7_REGULATORY_COMPLIANCE = 'T7_REGULATORY_COMPLIANCE',
  T8_SYSTEMIC_PATTERNS = 'T8_SYSTEMIC_PATTERNS'
}

export type LicenseInfo = {
  readonly __typename: 'LicenseInfo';
  readonly expirationDate: Scalars['DateTime']['output'];
  readonly number: Scalars['String']['output'];
  readonly state: Scalars['String']['output'];
  readonly type: LicenseType;
  readonly verified: Scalars['Boolean']['output'];
  readonly verifiedAt?: Maybe<Scalars['DateTime']['output']>;
  readonly verifiedBy?: Maybe<Scalars['ID']['output']>;
};

export enum LicenseType {
  COSMETOLOGIST = 'COSMETOLOGIST',
  ESTHETICIAN = 'ESTHETICIAN',
  MASSAGE_THERAPIST = 'MASSAGE_THERAPIST',
  MEDICAL_DIRECTOR = 'MEDICAL_DIRECTOR',
  NURSE_PRACTITIONER = 'NURSE_PRACTITIONER'
}

/** Location (for spa chains) */
export type Location = {
  readonly __typename: 'Location';
  readonly address: Address;
  readonly createdAt: Scalars['DateTime']['output'];
  readonly id: Scalars['ID']['output'];
  readonly isActive: Scalars['Boolean']['output'];
  readonly name: Scalars['String']['output'];
  readonly operatingHours: Scalars['JSON']['output'];
  readonly phone?: Maybe<Scalars['String']['output']>;
  readonly serviceProviders: ReadonlyArray<ServiceProvider>;
  readonly spaOrganizationId: Scalars['ID']['output'];
  readonly timezone: Scalars['String']['output'];
  readonly updatedAt: Scalars['DateTime']['output'];
};

/** Login input */
export type LoginInput = {
  readonly email: Scalars['String']['input'];
  readonly password: Scalars['String']['input'];
};

/** Market Segments (5 categories) */
export enum MarketSegment {
  LUXURY = 'LUXURY',
  MASS = 'MASS',
  MEDICAL = 'MEDICAL',
  NATURAL = 'NATURAL',
  PRESTIGE = 'PRESTIGE'
}

export type MarketingCampaign = {
  readonly __typename: 'MarketingCampaign';
  readonly audienceDetails?: Maybe<Scalars['JSON']['output']>;
  readonly audienceSize?: Maybe<Scalars['Int']['output']>;
  readonly budgetDollars: Scalars['Float']['output'];
  readonly budgetUtilization: Scalars['Float']['output'];
  readonly clicks: Scalars['Int']['output'];
  readonly conversionRate: Scalars['Float']['output'];
  readonly conversions: Scalars['Int']['output'];
  readonly cpcDollars: Scalars['Float']['output'];
  readonly createdAt: Scalars['DateTime']['output'];
  readonly ctr: Scalars['Float']['output'];
  readonly description?: Maybe<Scalars['String']['output']>;
  readonly endDate: Scalars['DateTime']['output'];
  readonly id: Scalars['ID']['output'];
  readonly impressions: Scalars['Int']['output'];
  readonly metadata?: Maybe<Scalars['JSON']['output']>;
  readonly name: Scalars['String']['output'];
  readonly revenueDollars: Scalars['Float']['output'];
  readonly roas: Scalars['Float']['output'];
  readonly spentDollars: Scalars['Float']['output'];
  readonly startDate: Scalars['DateTime']['output'];
  readonly status: CampaignStatus;
  readonly type: CampaignType;
  readonly updatedAt: Scalars['DateTime']['output'];
  readonly vendorId: Scalars['ID']['output'];
};

export type MarketingCampaignResult = {
  readonly __typename: 'MarketingCampaignResult';
  readonly campaign?: Maybe<MarketingCampaign>;
  readonly errors?: Maybe<ReadonlyArray<VendorPortalError>>;
  readonly success: Scalars['Boolean']['output'];
};

export type MessageAttachmentInput = {
  readonly fileSize: Scalars['Int']['input'];
  readonly fileType: Scalars['String']['input'];
  readonly filename: Scalars['String']['input'];
  readonly url: Scalars['String']['input'];
};

export enum MessageSenderType {
  SPA = 'SPA',
  SYSTEM = 'SYSTEM',
  VENDOR = 'VENDOR'
}

export type MetricsFiltersInput = {
  readonly organizationId?: InputMaybe<Scalars['ID']['input']>;
  readonly productCategory?: InputMaybe<Scalars['String']['input']>;
  readonly region?: InputMaybe<Scalars['String']['input']>;
  readonly skinType?: InputMaybe<Scalars['String']['input']>;
};

export type MetricsTimeframeInput = {
  /** Custom end date */
  readonly endDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** Timeframe preset: 7d, 30d, 90d, 1y, mtd, ytd */
  readonly preset?: InputMaybe<Scalars['String']['input']>;
  /** Custom start date */
  readonly startDate?: InputMaybe<Scalars['DateTime']['input']>;
};

/** Money type for currency values */
export type Money = {
  readonly __typename: 'Money';
  readonly amount: Scalars['Float']['output'];
  readonly currency: Scalars['String']['output'];
};

export type MoneyInput = {
  readonly amount: Scalars['Float']['input'];
  readonly currency: Scalars['String']['input'];
};

export type Mutation = {
  readonly __typename: 'Mutation';
  /** Mark a comment as accepted answer (for question posts) */
  readonly acceptAnswer: CommunityComment;
  /** Acknowledge a business alert */
  readonly acknowledgeAlert: BusinessAlert;
  /**
   * Add certification to profile
   * Requires: Vendor authentication
   * Sprint A.1: Vendor Profile Schema
   */
  readonly addCertification: CertificationResult;
  /**
   * Add shipping information to an order
   * Requires: Vendor authentication
   * Sprint B.4: Order Management
   */
  readonly addShippingInfo: VendorOrder;
  /** Approve/reject vendor organization (admin only) */
  readonly approveVendorOrganization: VendorOrganizationResult;
  /**
   * Archive a conversation
   * Requires: Vendor authentication
   * Sprint C: Communication
   */
  readonly archiveConversation: Conversation;
  /**
   * Assign reviewer to vendor application (Admin only)
   * Requires: Admin authentication
   * Sprint E.2: Admin Tools
   */
  readonly assignApplicationReviewer: VendorApplicationResult;
  /**
   * Bulk update taxonomy for multiple products
   * Admin only - for data cleanup
   */
  readonly bulkUpdateTaxonomy: BulkTaxonomyResult;
  /** Cancel appointment */
  readonly cancelAppointment: AppointmentResult;
  /** Cancel an event */
  readonly cancelEvent: CommunityEvent;
  /** Cancel event registration */
  readonly cancelRegistration: CommunityEvent;
  /** Check in client for appointment */
  readonly checkInAppointment: AppointmentResult;
  /** Complete appointment */
  readonly completeAppointment: AppointmentResult;
  /**
   * Complete an onboarding step
   * Requires: Vendor authentication
   * Sprint A.2: Application & Onboarding
   */
  readonly completeOnboardingStep: OnboardingStepResult;
  /** Create appointment */
  readonly createAppointment: AppointmentResult;
  /**
   * Create a new marketing campaign
   * Requires: Vendor authentication
   * Marketing Analytics Integration
   */
  readonly createCampaign: MarketingCampaignResult;
  /** Create client profile */
  readonly createClient: ClientResult;
  /** Create a comment on a post */
  readonly createComment: CommunityComment;
  /**
   * Create a new conversation with a spa
   * Requires: Vendor authentication
   * Sprint C: Communication
   */
  readonly createConversation: Conversation;
  /** Create a new community event */
  readonly createEvent: CommunityEvent;
  /** Create a mock product for testing */
  readonly createMockProduct: ProductResult;
  /** Create a new community post */
  readonly createPost: CommunityPost;
  /** Create a new product */
  readonly createProduct: ProductResult;
  /** Create new product taxonomy */
  readonly createProductTaxonomy: ProductTaxonomy;
  /** Create spa organization */
  readonly createSpaOrganization: SpaOrganizationResult;
  /** Create vendor organization */
  readonly createVendorOrganization: VendorOrganizationResult;
  /**
   * Create vendor profile (first-time setup after application approval)
   * Requires: Vendor authentication
   * Sprint A.1: Vendor Profile Schema
   */
  readonly createVendorProfile: VendorProfileResult;
  /**
   * Delete a marketing campaign
   * Requires: Vendor authentication
   * Marketing Analytics Integration
   */
  readonly deleteCampaign: MarketingCampaignResult;
  /** Delete a comment */
  readonly deleteComment: Scalars['Boolean']['output'];
  /** Delete a post */
  readonly deletePost: Scalars['Boolean']['output'];
  /** Delete product taxonomy */
  readonly deleteProductTaxonomy: Scalars['Boolean']['output'];
  /** Delete scheduled report */
  readonly deleteScheduledReport: Scalars['Boolean']['output'];
  /**
   * Flag a message for moderation
   * Requires: Vendor authentication
   * Sprint C: Communication
   */
  readonly flagMessage: ConversationMessage;
  /** Generate embeddings for all products (admin utility) */
  readonly generateAllProductEmbeddings: Scalars['Int']['output'];
  /** Generate semantic embedding for product */
  readonly generateProductEmbedding: JobStatusResponse;
  /** Generate tensor vector for product */
  readonly generateProductTensor: JobStatusResponse;
  /** Generate a report on demand */
  readonly generateReport: Report;
  /** Add claim evidence to an atom */
  readonly intelligenceAddClaimEvidence: ClaimEvidence;
  /** Add efficacy indicator to an atom */
  readonly intelligenceAddEfficacyIndicator: EfficacyIndicator;
  /** Batch sync embeddings */
  readonly intelligenceBatchSyncEmbeddings: Scalars['JSON']['output'];
  /** Delete claim evidence */
  readonly intelligenceDeleteClaimEvidence: Scalars['Boolean']['output'];
  /** Delete efficacy indicator */
  readonly intelligenceDeleteEfficacyIndicator: Scalars['Boolean']['output'];
  /** Update atom knowledge threshold */
  readonly intelligenceSetAtomThreshold: SkincareAtom;
  /** Update atom Why It Works explanation */
  readonly intelligenceSetWhyItWorks: SkincareAtom;
  /** Sync atom embedding to vector database */
  readonly intelligenceSyncEmbedding: Scalars['Boolean']['output'];
  /** Update claim evidence */
  readonly intelligenceUpdateClaimEvidence: ClaimEvidence;
  /** Update efficacy indicator */
  readonly intelligenceUpdateEfficacyIndicator: EfficacyIndicator;
  /** Create or get sanctuary member for current user */
  readonly joinSanctuary: SanctuaryMember;
  /** Like a comment */
  readonly likeComment: CommunityComment;
  /** Like a post */
  readonly likePost: CommunityPost;
  /** Login with email and password */
  readonly login: AuthResult;
  /** Logout (invalidate tokens) */
  readonly logout: SuccessResponse;
  /**
   * Mark conversation as read
   * Requires: Vendor authentication
   * Sprint C: Communication
   */
  readonly markConversationAsRead: Conversation;
  /** Record an analytics event (for internal tracking) */
  readonly recordAnalyticsEvent: Scalars['Boolean']['output'];
  /** Refresh access token */
  readonly refreshToken: AuthResult;
  /** Register new user */
  readonly register: AuthResult;
  /** Register for an event */
  readonly registerForEvent: CommunityEvent;
  /**
   * Remove certification from profile
   * Requires: Vendor authentication
   * Sprint A.1: Vendor Profile Schema
   */
  readonly removeCertification: CertificationResult;
  /** Request password reset */
  readonly requestPasswordReset: SuccessResponse;
  /** Reset password with token */
  readonly resetPassword: SuccessResponse;
  /** Reset user settings to defaults */
  readonly resetUserSettings: UserSettingsResult;
  /**
   * Review and approve/reject vendor application (Admin only)
   * Requires: Admin authentication
   * Sprint A.2: Application & Onboarding
   */
  readonly reviewVendorApplication: VendorApplicationResult;
  /** Schedule recurring reports */
  readonly scheduleReport: ScheduledReport;
  /**
   * Send a message in a conversation
   * Requires: Vendor authentication
   * Sprint C: Communication
   */
  readonly sendMessage: ConversationMessage;
  /** Create a new skincare atom */
  readonly skaCreateAtom: SkincareAtom;
  /** Create a relationship between atoms */
  readonly skaCreateRelationship: SkincareRelationship;
  /** Delete a skincare atom */
  readonly skaDeleteAtom: Scalars['Boolean']['output'];
  /** Delete a relationship */
  readonly skaDeleteRelationship: Scalars['Boolean']['output'];
  /** Generate or update 17-D tensor for an atom */
  readonly skaGenerateTensor17D: SkincareAtomTensor;
  /** Set Goldilocks parameter for an atom */
  readonly skaSetGoldilocksParameter: GoldilocksParameter;
  /** Update a skincare atom */
  readonly skaUpdateAtom: SkincareAtom;
  /**
   * Skip an optional onboarding step
   * Requires: Vendor authentication
   * Sprint A.2: Application & Onboarding
   */
  readonly skipOnboardingStep: OnboardingStepResult;
  /**
   * Submit vendor application to join marketplace
   * Public mutation (no auth required)
   * Sprint A.2: Application & Onboarding
   */
  readonly submitVendorApplication: VendorApplicationResult;
  /** Unlike a comment */
  readonly unlikeComment: CommunityComment;
  /** Unlike a post */
  readonly unlikePost: CommunityPost;
  /** Update current user's app preferences */
  readonly updateAppPreferences: UserSettingsResult;
  /** Update appointment */
  readonly updateAppointment: AppointmentResult;
  /**
   * Update an existing marketing campaign
   * Requires: Vendor authentication
   * Marketing Analytics Integration
   */
  readonly updateCampaign: MarketingCampaignResult;
  /**
   * Update campaign performance metrics
   * Requires: Vendor authentication
   * Marketing Analytics Integration
   */
  readonly updateCampaignMetrics: MarketingCampaignResult;
  /** Update client profile */
  readonly updateClient: ClientResult;
  /** Update a comment */
  readonly updateComment: CommunityComment;
  /** Update an event */
  readonly updateEvent: CommunityEvent;
  /** Update current user's notification preferences */
  readonly updateNotificationSettings: UserSettingsResult;
  /**
   * Update the status of an order
   * Requires: Vendor authentication
   * Sprint B.4: Order Management
   */
  readonly updateOrderStatus: VendorOrder;
  /** Update an existing post */
  readonly updatePost: CommunityPost;
  /** Update product information */
  readonly updateProduct: ProductResult;
  /**
   * Create or update product taxonomy
   * Used by vendors during product submission
   */
  readonly updateProductTaxonomy: ProductTaxonomy;
  /** Update user profile */
  readonly updateProfile: UserResult;
  /** Update current user's profile settings */
  readonly updateProfileSettings: UserSettingsResult;
  /** Update sanctuary profile */
  readonly updateSanctuaryProfile: SanctuaryMember;
  /** Update scheduled report */
  readonly updateScheduledReport: ScheduledReport;
  /** Update spa organization */
  readonly updateSpaOrganization: SpaOrganizationResult;
  /** Update all user settings at once */
  readonly updateUserSettings: UserSettingsResult;
  /** Update vendor organization */
  readonly updateVendorOrganization: VendorOrganizationResult;
  /**
   * Update vendor profile
   * Requires: Vendor authentication
   * Sprint A.1: Vendor Profile Schema
   */
  readonly updateVendorProfile: VendorProfileResult;
  /**
   * Verify vendor certification (Admin only)
   * Requires: Admin authentication
   * Sprint A.1: Vendor Profile Schema
   */
  readonly verifyCertification: CertificationResult;
  /** Increment view count for a post */
  readonly viewPost: CommunityPost;
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
  updates: ReadonlyArray<BulkTaxonomyUpdate>;
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
  atomIds: ReadonlyArray<Scalars['ID']['input']>;
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
  readonly __typename: 'NotificationSettings';
  /** Appointment reminder notifications */
  readonly appointmentReminders: Scalars['Boolean']['output'];
  /** Community activity notifications */
  readonly communityActivity: Scalars['Boolean']['output'];
  /** Receive email notifications */
  readonly emailEnabled: Scalars['Boolean']['output'];
  /** Marketing and promotional emails */
  readonly marketingEmails: Scalars['Boolean']['output'];
  /** Order status update notifications */
  readonly orderUpdates: Scalars['Boolean']['output'];
  /** New product announcements */
  readonly productAnnouncements: Scalars['Boolean']['output'];
  /** Receive push notifications */
  readonly pushEnabled: Scalars['Boolean']['output'];
  /** Hours before appointment to send reminder */
  readonly reminderHours: Scalars['Int']['output'];
  /** Receive SMS notifications */
  readonly smsEnabled: Scalars['Boolean']['output'];
  /** Weekly digest of activity */
  readonly weeklyDigest: Scalars['Boolean']['output'];
};

export type OnboardingStep = {
  readonly __typename: 'OnboardingStep';
  readonly completedAt?: Maybe<Scalars['DateTime']['output']>;
  readonly createdAt: Scalars['DateTime']['output'];
  readonly description?: Maybe<Scalars['String']['output']>;
  readonly helpArticleUrl?: Maybe<Scalars['String']['output']>;
  readonly id: Scalars['ID']['output'];
  readonly name: Scalars['String']['output'];
  readonly onboardingId: Scalars['ID']['output'];
  readonly order: Scalars['Int']['output'];
  readonly required: Scalars['Boolean']['output'];
  readonly status: OnboardingStepStatus;
};

export type OnboardingStepResult = {
  readonly __typename: 'OnboardingStepResult';
  readonly errors?: Maybe<ReadonlyArray<VendorPortalError>>;
  readonly onboarding?: Maybe<VendorOnboarding>;
  readonly step?: Maybe<OnboardingStep>;
  readonly success: Scalars['Boolean']['output'];
};

export enum OnboardingStepStatus {
  COMPLETED = 'COMPLETED',
  IN_PROGRESS = 'IN_PROGRESS',
  PENDING = 'PENDING',
  SKIPPED = 'SKIPPED'
}

export type OrderFilterInput = {
  readonly dateRange?: InputMaybe<DateRangeInput>;
  readonly searchQuery?: InputMaybe<Scalars['String']['input']>;
  readonly spaId?: InputMaybe<Scalars['ID']['input']>;
  readonly status?: InputMaybe<ReadonlyArray<OrderStatus>>;
};

export type OrderItem = {
  readonly __typename: 'OrderItem';
  readonly imageUrl?: Maybe<Scalars['String']['output']>;
  readonly productId: Scalars['ID']['output'];
  readonly productName: Scalars['String']['output'];
  readonly quantity: Scalars['Int']['output'];
  readonly sku: Scalars['String']['output'];
  readonly totalPrice: Scalars['Float']['output'];
  readonly unitPrice: Scalars['Float']['output'];
};

export type OrderMetrics = {
  readonly __typename: 'OrderMetrics';
  readonly avgOrderValue: Scalars['Float']['output'];
  readonly count: Scalars['Int']['output'];
  readonly fromNewSpas: Scalars['Int']['output'];
  readonly fromRepeatSpas: Scalars['Int']['output'];
  readonly percentChange: Scalars['Float']['output'];
  readonly trend: TrendIndicator;
};

export enum OrderSortField {
  CREATED_AT = 'CREATED_AT',
  STATUS = 'STATUS',
  TOTAL = 'TOTAL',
  UPDATED_AT = 'UPDATED_AT'
}

export type OrderSortInput = {
  readonly direction: SortOrder;
  readonly field: OrderSortField;
};

export enum OrderStatus {
  CANCELLED = 'CANCELLED',
  CONFIRMED = 'CONFIRMED',
  DELIVERED = 'DELIVERED',
  DISPUTED = 'DISPUTED',
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  RETURNED = 'RETURNED',
  SHIPPED = 'SHIPPED'
}

export type OrderStatusCounts = {
  readonly __typename: 'OrderStatusCounts';
  readonly cancelled: Scalars['Int']['output'];
  readonly confirmed: Scalars['Int']['output'];
  readonly delivered: Scalars['Int']['output'];
  readonly disputed: Scalars['Int']['output'];
  readonly pending: Scalars['Int']['output'];
  readonly processing: Scalars['Int']['output'];
  readonly shipped: Scalars['Int']['output'];
};

/** Page information for cursor-based pagination */
export type PageInfo = {
  readonly __typename: 'PageInfo';
  readonly endCursor?: Maybe<Scalars['String']['output']>;
  readonly hasNextPage: Scalars['Boolean']['output'];
  readonly hasPreviousPage: Scalars['Boolean']['output'];
  readonly startCursor?: Maybe<Scalars['String']['output']>;
};

/** Pagination input for cursor-based pagination */
export type PaginationInput = {
  readonly after?: InputMaybe<Scalars['String']['input']>;
  readonly before?: InputMaybe<Scalars['String']['input']>;
  readonly first?: InputMaybe<Scalars['Int']['input']>;
  readonly last?: InputMaybe<Scalars['Int']['input']>;
};

/** Sorting options for posts */
export enum PostSortOption {
  MOST_DISCUSSED = 'MOST_DISCUSSED',
  MOST_LIKED = 'MOST_LIKED',
  NEWEST = 'NEWEST',
  TRENDING = 'TRENDING'
}

/** Post publication status */
export enum PostStatus {
  ARCHIVED = 'ARCHIVED',
  DRAFT = 'DRAFT',
  MODERATED = 'MODERATED',
  PUBLISHED = 'PUBLISHED'
}

/** Post type categorization */
export enum PostType {
  ARTICLE = 'ARTICLE',
  CASE_STUDY = 'CASE_STUDY',
  DISCUSSION = 'DISCUSSION',
  QUESTION = 'QUESTION'
}

export type PredictionAccuracyMetrics = {
  readonly __typename: 'PredictionAccuracyMetrics';
  readonly churnPrediction: Scalars['Float']['output'];
  readonly ltvPrediction: Scalars['Float']['output'];
  readonly replenishmentPrediction: Scalars['Float']['output'];
};

export type PredictionFactor = {
  readonly __typename: 'PredictionFactor';
  readonly factor: Scalars['String']['output'];
  readonly weight: Scalars['Float']['output'];
};

/** Predictive insight */
export type PredictiveInsight = {
  readonly __typename: 'PredictiveInsight';
  readonly confidence: Scalars['Float']['output'];
  readonly factors: ReadonlyArray<PredictionFactor>;
  readonly impact: SignificanceLevel;
  readonly prediction: Scalars['String']['output'];
  readonly recommendation: Scalars['String']['output'];
  readonly timeframe: Scalars['String']['output'];
};

/** Price Points (4 tiers) */
export enum PricePoint {
  BUDGET = 'BUDGET',
  LUXURY = 'LUXURY',
  MID_RANGE = 'MID_RANGE',
  PREMIUM = 'PREMIUM'
}

export type PriceRangeInput = {
  readonly max?: InputMaybe<Scalars['Float']['input']>;
  readonly min?: InputMaybe<Scalars['Float']['input']>;
};

/** Price tier enumeration */
export enum PriceTier {
  /** Budget-friendly ($0-$20) */
  BUDGET = 'BUDGET',
  /** Luxury ($100+) */
  LUXURY = 'LUXURY',
  /** Moderate ($$20-$50) */
  MODERATE = 'MODERATE',
  /** Premium ($50-$100) */
  PREMIUM = 'PREMIUM'
}

/** Product with progressive disclosure structure */
export type Product = {
  readonly __typename: 'Product';
  readonly createdAt: Scalars['DateTime']['output'];
  readonly embeddingGenerated: Scalars['Boolean']['output'];
  /** Glance level - Quick overview */
  readonly glance: ProductGlance;
  readonly id: Scalars['ID']['output'];
  /** Scan level - Detailed information */
  readonly scan: ProductScan;
  /** Study level - Professional/clinical data */
  readonly study?: Maybe<ProductStudy>;
  /** Complete taxonomy classification for this product */
  readonly taxonomy?: Maybe<ProductTaxonomy>;
  /** Vector data status */
  readonly tensorGenerated: Scalars['Boolean']['output'];
  readonly updatedAt: Scalars['DateTime']['output'];
  readonly vendorOrganization: VendorOrganization;
  readonly vendureProductId: Scalars['ID']['output'];
};

/**
 * Product Category - Hierarchical (3 levels)
 * Level 1: Main (Skincare, Body Care, Supplements)
 * Level 2: Sub (Cleansers, Serums, Moisturizers)
 * Level 3: Micro (Foaming Cleansers, Cream Cleansers)
 */
export type ProductCategory = {
  readonly __typename: 'ProductCategory';
  readonly children: ReadonlyArray<ProductCategory>;
  readonly createdAt: Scalars['DateTime']['output'];
  readonly description?: Maybe<Scalars['String']['output']>;
  readonly displayOrder: Scalars['Int']['output'];
  readonly fullPath: Scalars['String']['output'];
  readonly id: Scalars['ID']['output'];
  readonly isActive: Scalars['Boolean']['output'];
  readonly level: Scalars['Int']['output'];
  readonly name: Scalars['String']['output'];
  readonly parent?: Maybe<ProductCategory>;
  readonly productCount: Scalars['Int']['output'];
  readonly seoSlug: Scalars['String']['output'];
  readonly updatedAt: Scalars['DateTime']['output'];
};

/** Product connection for pagination */
export type ProductConnection = {
  readonly __typename: 'ProductConnection';
  readonly edges: ReadonlyArray<ProductEdge>;
  readonly pageInfo: PageInfo;
  readonly totalCount: Scalars['Int']['output'];
};

export type ProductEdge = {
  readonly __typename: 'ProductEdge';
  readonly cursor: Scalars['String']['output'];
  readonly node: Product;
};

/** Product filters */
export type ProductFiltersInput = {
  readonly brand?: InputMaybe<Scalars['String']['input']>;
  readonly category?: InputMaybe<Scalars['String']['input']>;
  readonly inStock?: InputMaybe<Scalars['Boolean']['input']>;
  readonly priceRange?: InputMaybe<PriceRangeInput>;
  readonly skinTypes?: InputMaybe<ReadonlyArray<SkinType>>;
};

/**
 * Product Format - Physical form of product
 * Examples: Cream, Gel, Serum, Oil, Balm, Foam
 */
export type ProductFormat = {
  readonly __typename: 'ProductFormat';
  readonly category?: Maybe<Scalars['String']['output']>;
  readonly createdAt: Scalars['DateTime']['output'];
  readonly description?: Maybe<Scalars['String']['output']>;
  readonly id: Scalars['ID']['output'];
  readonly isActive: Scalars['Boolean']['output'];
  readonly name: Scalars['String']['output'];
  readonly productCount: Scalars['Int']['output'];
};

/**
 * Product Function - Multi-select
 * Examples: Hydrating, Exfoliating, Anti-Aging, Brightening
 */
export type ProductFunction = {
  readonly __typename: 'ProductFunction';
  readonly categoryCompatibility?: Maybe<ReadonlyArray<Scalars['ID']['output']>>;
  readonly createdAt: Scalars['DateTime']['output'];
  readonly description?: Maybe<Scalars['String']['output']>;
  readonly displayOrder: Scalars['Int']['output'];
  readonly id: Scalars['ID']['output'];
  readonly isActive: Scalars['Boolean']['output'];
  readonly name: Scalars['String']['output'];
  readonly productCount: Scalars['Int']['output'];
};

/** Glance Level - Quick Product Overview */
export type ProductGlance = {
  readonly __typename: 'ProductGlance';
  readonly heroBenefit: Scalars['String']['output'];
  readonly price: Money;
  readonly rating?: Maybe<Scalars['Float']['output']>;
  readonly reviewCount?: Maybe<Scalars['Int']['output']>;
  readonly skinTypes: ReadonlyArray<SkinType>;
  readonly thumbnail?: Maybe<Scalars['String']['output']>;
};

export type ProductGlanceInput = {
  readonly heroBenefit: Scalars['String']['input'];
  readonly rating?: InputMaybe<Scalars['Float']['input']>;
  readonly reviewCount?: InputMaybe<Scalars['Int']['input']>;
  readonly skinTypes: ReadonlyArray<SkinType>;
};

/** Product performance metrics */
export type ProductMetrics = {
  readonly __typename: 'ProductMetrics';
  readonly categoryPerformance: ReadonlyArray<CategoryPerformance>;
  readonly crossSellOpportunities: ReadonlyArray<CrossSellPair>;
  readonly topPerformers: ReadonlyArray<ProductPerformance>;
  readonly totalCatalog: Scalars['Int']['output'];
  readonly underPerformers: ReadonlyArray<ProductPerformance>;
};

export type ProductPerformance = {
  readonly __typename: 'ProductPerformance';
  readonly addToCartClicks: Scalars['Int']['output'];
  readonly category?: Maybe<Scalars['String']['output']>;
  readonly conversionRate: Scalars['Float']['output'];
  readonly orderCount: Scalars['Int']['output'];
  readonly price?: Maybe<Scalars['Float']['output']>;
  readonly productId: Scalars['ID']['output'];
  readonly productName: Scalars['String']['output'];
  readonly productSku?: Maybe<Scalars['String']['output']>;
  readonly returnRate: Scalars['Float']['output'];
  readonly revenue: Scalars['Float']['output'];
  readonly uniqueSpas: Scalars['Int']['output'];
  readonly unitsSold: Scalars['Int']['output'];
  readonly views: Scalars['Int']['output'];
};

/**
 * Product Region - Geographic origin/style
 * Examples: K-Beauty, J-Beauty, French Pharmacy, USA
 */
export type ProductRegion = {
  readonly __typename: 'ProductRegion';
  readonly countryCode?: Maybe<Scalars['String']['output']>;
  readonly createdAt: Scalars['DateTime']['output'];
  readonly description?: Maybe<Scalars['String']['output']>;
  readonly id: Scalars['ID']['output'];
  readonly isActive: Scalars['Boolean']['output'];
  readonly name: Scalars['String']['output'];
  readonly productCount: Scalars['Int']['output'];
};

/** Product operation result */
export type ProductResult = {
  readonly __typename: 'ProductResult';
  readonly errors?: Maybe<ReadonlyArray<Error>>;
  readonly product?: Maybe<Product>;
  readonly success: Scalars['Boolean']['output'];
};

/** Scan Level - Detailed Product Information */
export type ProductScan = {
  readonly __typename: 'ProductScan';
  readonly images: ReadonlyArray<Scalars['String']['output']>;
  readonly ingredients: IngredientList;
  readonly keyActives: ReadonlyArray<ActiveIngredient>;
  readonly usageInstructions: UsageInstructions;
  readonly warnings: ReadonlyArray<Scalars['String']['output']>;
};

export type ProductScanInput = {
  readonly ingredients: IngredientListInput;
  readonly keyActives: ReadonlyArray<ActiveIngredientInput>;
  readonly usageInstructions: UsageInstructionsInput;
  readonly warnings: ReadonlyArray<Scalars['String']['input']>;
};

/** Study Level - Professional/Clinical Data */
export type ProductStudy = {
  readonly __typename: 'ProductStudy';
  readonly clinicalData?: Maybe<ClinicalData>;
  readonly contraindications: ReadonlyArray<Scalars['String']['output']>;
  readonly detailedSteps: ReadonlyArray<Scalars['String']['output']>;
  readonly expectedResults: Scalars['String']['output'];
  readonly formulationScience?: Maybe<Scalars['String']['output']>;
  readonly professionalNotes?: Maybe<Scalars['String']['output']>;
  readonly timeToResults: Scalars['String']['output'];
};

export type ProductStudyInput = {
  readonly contraindications: ReadonlyArray<Scalars['String']['input']>;
  readonly detailedSteps: ReadonlyArray<Scalars['String']['input']>;
  readonly expectedResults: Scalars['String']['input'];
  readonly formulationScience?: InputMaybe<Scalars['String']['input']>;
  readonly professionalNotes?: InputMaybe<Scalars['String']['input']>;
  readonly timeToResults: Scalars['String']['input'];
};

/** Product Taxonomy - Complete classification for a product */
export type ProductTaxonomy = {
  readonly __typename: 'ProductTaxonomy';
  readonly category?: Maybe<ProductCategory>;
  readonly createdAt: Scalars['DateTime']['output'];
  readonly formulationBase?: Maybe<Scalars['String']['output']>;
  readonly id: Scalars['ID']['output'];
  readonly lastReviewedAt?: Maybe<Scalars['DateTime']['output']>;
  readonly primaryFunctions: ReadonlyArray<ProductFunction>;
  readonly productFormat?: Maybe<ProductFormat>;
  readonly productId: Scalars['ID']['output'];
  readonly professionalLevel: ProfessionalLevel;
  readonly protocolRequired: Scalars['Boolean']['output'];
  readonly region?: Maybe<ProductRegion>;
  readonly reviewedBy?: Maybe<Scalars['ID']['output']>;
  readonly skinConcerns: ReadonlyArray<SkinConcern>;
  readonly targetAreas: ReadonlyArray<TargetArea>;
  readonly taxonomyCompletenessScore: Scalars['Int']['output'];
  readonly updatedAt: Scalars['DateTime']['output'];
  readonly usageTime: UsageTime;
};

/** Input for creating/updating product taxonomy */
export type ProductTaxonomyInput = {
  readonly categoryId?: InputMaybe<Scalars['ID']['input']>;
  readonly formulationBase?: InputMaybe<Scalars['String']['input']>;
  readonly primaryFunctionIds?: InputMaybe<ReadonlyArray<Scalars['ID']['input']>>;
  readonly productFormatId?: InputMaybe<Scalars['ID']['input']>;
  readonly productId: Scalars['ID']['input'];
  readonly professionalLevel?: InputMaybe<ProfessionalLevel>;
  readonly protocolRequired?: InputMaybe<Scalars['Boolean']['input']>;
  readonly regionId?: InputMaybe<Scalars['ID']['input']>;
  readonly skinConcernIds?: InputMaybe<ReadonlyArray<Scalars['ID']['input']>>;
  readonly targetAreaIds?: InputMaybe<ReadonlyArray<Scalars['ID']['input']>>;
  readonly usageTime?: InputMaybe<UsageTime>;
};

export type ProductUsage = {
  readonly __typename: 'ProductUsage';
  readonly notes?: Maybe<Scalars['String']['output']>;
  readonly product: Product;
  readonly productId: Scalars['ID']['output'];
  readonly quantity?: Maybe<Scalars['Int']['output']>;
};

export type ProductUsageInput = {
  readonly notes?: InputMaybe<Scalars['String']['input']>;
  readonly productId: Scalars['ID']['input'];
  readonly quantity?: InputMaybe<Scalars['Int']['input']>;
};

/** Professional Level - Who can use/purchase */
export enum ProfessionalLevel {
  IN_OFFICE_ONLY = 'IN_OFFICE_ONLY',
  MEDICAL_GRADE = 'MEDICAL_GRADE',
  OTC = 'OTC',
  PROFESSIONAL = 'PROFESSIONAL'
}

export type ProfileEngagement = {
  readonly __typename: 'ProfileEngagement';
  readonly avgTimeOnProfile: Scalars['Int']['output'];
  readonly bounceRate: Scalars['Float']['output'];
  readonly catalogBrowses: Scalars['Int']['output'];
  readonly contactClicks: Scalars['Int']['output'];
  readonly productClicks: Scalars['Int']['output'];
  readonly profileViews: Scalars['Int']['output'];
};

/** Profile Settings - User display and contact preferences */
export type ProfileSettings = {
  readonly __typename: 'ProfileSettings';
  /** Date format preference */
  readonly dateFormat: DateFormat;
  /** Display name shown in the app */
  readonly displayName?: Maybe<Scalars['String']['output']>;
  /** Preferred language code */
  readonly language: Scalars['String']['output'];
  /** Phone number for SMS notifications */
  readonly phoneNumber?: Maybe<Scalars['String']['output']>;
  /** Whether phone is verified for SMS */
  readonly phoneVerified: Scalars['Boolean']['output'];
  /** Time format preference (12h/24h) */
  readonly timeFormat: TimeFormat;
  /** User's timezone for scheduling */
  readonly timezone: Scalars['String']['output'];
};

export type PurgeAnalysis = {
  readonly __typename: 'PurgeAnalysis';
  readonly activeCount: Scalars['Int']['output'];
  readonly avgDurationDays: Scalars['Int']['output'];
  readonly completedCount: Scalars['Int']['output'];
  readonly successRate: Scalars['Float']['output'];
};

export type Query = {
  readonly __typename: 'Query';
  /**
   * Get all vendor applications (Admin only)
   * Requires: Admin authentication
   * Sprint E.2: Admin Tools
   */
  readonly adminVendorApplications: ReadonlyArray<VendorApplication>;
  /** Get appointment by ID */
  readonly appointment?: Maybe<Appointment>;
  /** List appointments with filters */
  readonly appointments: AppointmentConnection;
  /**
   * Build a complete skincare routine recommendation
   * Returns products for each step: Cleanse, Treat, Moisturize, Protect
   */
  readonly buildSkincareRoutine: SkincareRoutine;
  /** Get a specific alert by ID */
  readonly businessAlert?: Maybe<BusinessAlert>;
  /** Get active business alerts */
  readonly businessAlerts: ReadonlyArray<BusinessAlert>;
  /** Get AI-generated insights based on current metrics */
  readonly businessInsights: InsightEngine;
  /** Get comprehensive business metrics for a timeframe */
  readonly businessMetrics: BusinessMetrics;
  /**
   * Get campaign performance summary
   * Requires: Vendor authentication
   * Marketing Analytics Integration
   */
  readonly campaignPerformanceSummary: CampaignPerformanceSummary;
  /** Get client by ID */
  readonly client?: Maybe<Client>;
  /** List clients for spa organization */
  readonly clients: ClientConnection;
  /** Get a single event by ID */
  readonly communityEvent?: Maybe<CommunityEvent>;
  /** Get paginated community events */
  readonly communityEvents: CommunityEventConnection;
  /** Get a single post by ID */
  readonly communityPost?: Maybe<CommunityPost>;
  /** Get paginated community posts with optional filters */
  readonly communityPosts: CommunityPostConnection;
  /**
   * Get a single conversation by ID
   * Requires: Vendor authentication
   * Sprint C.1: Messaging System
   */
  readonly conversation?: Maybe<Conversation>;
  /**
   * Get messages for a conversation
   * Requires: Vendor authentication
   * Sprint C.1: Messaging System
   */
  readonly conversationMessages: ConversationMessagesResponse;
  /** Get dashboard summary for quick overview */
  readonly dashboardSummary: DashboardSummary;
  /**
   * Get discovery analytics (how spas find you)
   * Requires: Vendor authentication
   * Sprint A.3: Analytics Schema
   */
  readonly discoveryAnalytics: DiscoveryAnalytics;
  /** Get featured posts */
  readonly featuredPosts: ReadonlyArray<CommunityPost>;
  /**
   * Find products similar to a given product
   * Uses semantic similarity matching
   */
  readonly findSimilarSkincareProducts: ReadonlyArray<SkincareProduct>;
  /** Analyze compatibility between ingredients */
  readonly intelligenceAnalyzeCompatibility: CompatibilityResult;
  /** Get atom with full intelligence data */
  readonly intelligenceAtom: AtomWithIntelligence;
  /** Navigate causal chain from an atom */
  readonly intelligenceCausalChain: ReadonlyArray<CausalChainNode>;
  /** Check if user has access to threshold */
  readonly intelligenceCheckAccess: Scalars['Boolean']['output'];
  /** Get claim evidence for an atom */
  readonly intelligenceClaimEvidence: ReadonlyArray<ClaimEvidence>;
  /** Get efficacy indicators for an atom */
  readonly intelligenceEfficacyIndicators: ReadonlyArray<EfficacyIndicator>;
  /** Get efficacy summary for an atom */
  readonly intelligenceEfficacySummary: EfficacySummary;
  /** Get evidence summary for an atom */
  readonly intelligenceEvidenceSummary: EvidenceSummary;
  /** Find causal path between two atoms */
  readonly intelligenceFindPath: ReadonlyArray<CausalPathStep>;
  /** Find similar atoms by tensor profile */
  readonly intelligenceFindSimilar: ReadonlyArray<IntelligenceSearchResult>;
  /** Get Goldilocks parameters for an atom */
  readonly intelligenceGoldilocksParameters: ReadonlyArray<GoldilocksParameter>;
  /** Get max accessible threshold for access level */
  readonly intelligenceMaxThreshold: KnowledgeThreshold;
  /** Search with intelligence filters */
  readonly intelligenceSearch: IntelligenceSearchResponse;
  /** Get Why It Works explanation */
  readonly intelligenceWhyExplanation?: Maybe<WhyExplanation>;
  /** Get current user */
  readonly me?: Maybe<User>;
  /** Get current user's sanctuary profile */
  readonly mySanctuaryProfile?: Maybe<SanctuaryMember>;
  /** Get current user's settings */
  readonly mySettings?: Maybe<UserSettings>;
  /**
   * Get order counts by status
   * Requires: Vendor authentication
   * Sprint B.4: Order Management
   */
  readonly orderStatusCounts: OrderStatusCounts;
  /** Get product by ID with progressive disclosure */
  readonly product?: Maybe<Product>;
  /**
   * Get all product categories (hierarchical)
   * Returns root categories with subcategories nested
   */
  readonly productCategories: ReadonlyArray<ProductCategory>;
  /** Get single category by ID or slug */
  readonly productCategory?: Maybe<ProductCategory>;
  /** Get single category by slug */
  readonly productCategoryBySlug?: Maybe<ProductCategory>;
  /** Get single product format by ID */
  readonly productFormat?: Maybe<ProductFormat>;
  /** Get all product formats (cream, gel, serum, etc.) */
  readonly productFormats: ReadonlyArray<ProductFormat>;
  /** Get single product function by ID */
  readonly productFunction?: Maybe<ProductFunction>;
  /**
   * Get all product functions
   * For multi-select in product creation
   */
  readonly productFunctions: ReadonlyArray<ProductFunction>;
  /**
   * Get product performance metrics
   * Requires: Vendor authentication
   * Sprint A.3: Analytics Schema
   */
  readonly productPerformance: ReadonlyArray<ProductPerformance>;
  /** Get single product region by ID */
  readonly productRegion?: Maybe<ProductRegion>;
  /** Get all product regions (K-Beauty, J-Beauty, etc.) */
  readonly productRegions: ReadonlyArray<ProductRegion>;
  /** Get all product taxonomies with optional filter */
  readonly productTaxonomies: ReadonlyArray<ProductTaxonomy>;
  /** Get product taxonomy data for a specific product */
  readonly productTaxonomy?: Maybe<ProductTaxonomy>;
  /** List all products with pagination (simple version) */
  readonly products: ReadonlyArray<Product>;
  /** Search products by vendor organization */
  readonly productsByVendor: ReadonlyArray<Product>;
  /** Get personalized product recommendations based on skin profile */
  readonly recommendSkincareProducts: ReadonlyArray<SkincareProduct>;
  /** Get discussions related to a SKA atom */
  readonly relatedDiscussions: ReadonlyArray<CommunityPost>;
  /** Get a specific report by ID */
  readonly report?: Maybe<Report>;
  /** Get generated reports */
  readonly reports: ReadonlyArray<Report>;
  /** Get a sanctuary member by ID */
  readonly sanctuaryMember?: Maybe<SanctuaryMember>;
  /** Get scheduled reports */
  readonly scheduledReports: ReadonlyArray<ScheduledReport>;
  /** Vector search for similar products */
  readonly searchProducts: ReadonlyArray<Product>;
  /** Search products with filters (advanced) */
  readonly searchProductsAdvanced: ProductConnection;
  /** Search products by semantic text query */
  readonly searchProductsByText: ReadonlyArray<Product>;
  /**
   * Semantic search for skincare products
   * Uses AI-powered natural language understanding
   *
   * Example queries:
   * - "gentle gel cleanser for oily skin"
   * - "vitamin C serum for dark spots"
   * - "hydrating night cream for dry skin"
   */
  readonly searchSkincareProducts: ReadonlyArray<SkincareProduct>;
  /** Search products using vector similarity */
  readonly similarProducts: ReadonlyArray<Product>;
  /** Get causal chain (prerequisites and consequences) for an atom */
  readonly skaCausalChain: SkaCausalChain;
  /** Check compatibility between multiple ingredients */
  readonly skaCheckCompatibility: SkaCompatibilityResult;
  /** Get purging information for an ingredient */
  readonly skaGetPurgingInfo: SkaPurgingInfo;
  /** Get knowledge graph statistics */
  readonly skaKnowledgeGraphStats: SkaKnowledgeGraphStats;
  /** Quick compliance check - pass/fail with critical issues only */
  readonly skaQuickComplianceCheck: SkaQuickComplianceResult;
  /** Score marketing copy for FDA/FTC compliance */
  readonly skaScoreCompliance: SkaComplianceScore;
  /** Search skincare atoms with filters */
  readonly skaSearchAtoms: SkaSearchResponse;
  /** Get single skin concern by ID */
  readonly skinConcern?: Maybe<SkinConcern>;
  /**
   * Get all skin concerns
   * For multi-select in product creation
   */
  readonly skinConcerns: ReadonlyArray<SkinConcern>;
  /** Get a skincare atom by ID */
  readonly skincareAtom?: Maybe<SkincareAtom>;
  /** Get a skincare atom by INCI name (ingredients only) */
  readonly skincareAtomByInci?: Maybe<SkincareAtom>;
  /** Get a skincare atom by slug */
  readonly skincareAtomBySlug?: Maybe<SkincareAtom>;
  /** Get all available skincare categories */
  readonly skincareCategories: ReadonlyArray<Scalars['String']['output']>;
  /** Get filter options for skincare search UI */
  readonly skincareFilterOptions: SkincareFilterOptions;
  /** Get a specific pillar by ID */
  readonly skincarePillar?: Maybe<SkincarePillar>;
  /** Get all skincare pillars */
  readonly skincarePillars: ReadonlyArray<SkincarePillar>;
  /** Get a single skincare product by ID */
  readonly skincareProduct?: Maybe<SkincareProduct>;
  /** Get skincare products by category */
  readonly skincareProductsByCategory: ReadonlyArray<SkincareProduct>;
  /** Get spa organization by ID */
  readonly spaOrganization?: Maybe<SpaOrganization>;
  /** List all spa organizations (admin only) */
  readonly spaOrganizations: SpaOrganizationConnection;
  /**
   * Get spa-vendor relationships (customer list)
   * Requires: Vendor authentication
   * Sprint A.3: Analytics Schema
   */
  readonly spaRelationships: ReadonlyArray<SpaVendorRelationship>;
  /** Get AI-suggested SKA topics for content */
  readonly suggestedSkaTopics: ReadonlyArray<SkincareAtom>;
  /** Get single target area by ID */
  readonly targetArea?: Maybe<TargetArea>;
  /** Get all target areas (face, eye, body, etc.) */
  readonly targetAreas: ReadonlyArray<TargetArea>;
  /** Get all taxonomy filter options for UI dropdowns */
  readonly taxonomyFilterOptions: TaxonomyFilterOptions;
  /**
   * Get taxonomy completeness statistics
   * For quality control dashboard
   */
  readonly taxonomyStats: TaxonomyStats;
  /** Get top contributors by reputation */
  readonly topContributors: ReadonlyArray<SanctuaryMember>;
  /** Get trending topics in the community */
  readonly trendingTopics: ReadonlyArray<TrendingTopic>;
  /** Get user by ID (admin only) */
  readonly user?: Maybe<User>;
  /** Get user settings by user ID (admin only) */
  readonly userSettings?: Maybe<UserSettings>;
  /**
   * Get vendor application by ID
   * Requires: Vendor authentication (own application) or Admin
   * Sprint A.2: Application & Onboarding
   */
  readonly vendorApplication?: Maybe<VendorApplication>;
  /**
   * Get a single marketing campaign by ID
   * Requires: Vendor authentication
   * Marketing Analytics Integration
   */
  readonly vendorCampaign?: Maybe<MarketingCampaign>;
  /**
   * Get vendor's marketing campaigns
   * Requires: Vendor authentication
   * Marketing Analytics Integration
   */
  readonly vendorCampaigns: ReadonlyArray<MarketingCampaign>;
  /**
   * Get vendor conversations (messaging)
   * Requires: Vendor authentication
   * Sprint C.1: Messaging System
   */
  readonly vendorConversations: ReadonlyArray<Conversation>;
  /**
   * Get vendor dashboard metrics
   * Requires: Vendor authentication
   * Sprint A.3: Analytics Schema
   */
  readonly vendorDashboard: VendorDashboardMetrics;
  /**
   * Get vendor onboarding progress
   * Requires: Vendor authentication
   * Sprint A.2: Application & Onboarding
   */
  readonly vendorOnboarding?: Maybe<VendorOnboarding>;
  /**
   * Get a single vendor order by ID
   * Requires: Vendor authentication
   * Sprint B.4: Order Management
   */
  readonly vendorOrder?: Maybe<VendorOrder>;
  /**
   * Get vendor orders with filtering and pagination
   * Requires: Vendor authentication
   * Sprint B.4: Order Management
   */
  readonly vendorOrders: VendorOrderConnection;
  /** Get vendor organization by ID */
  readonly vendorOrganization?: Maybe<VendorOrganization>;
  /** List vendor organizations */
  readonly vendorOrganizations: VendorOrganizationConnection;
  /**
   * Get current vendor's profile
   * Requires: Vendor authentication
   * Sprint A.1: Vendor Profile Schema
   */
  readonly vendorProfile?: Maybe<VendorProfile>;
  /**
   * Get unread message count for vendor
   * Requires: Vendor authentication
   * Sprint C.1: Messaging System
   */
  readonly vendorUnreadCount: Scalars['Int']['output'];
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
  tags?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
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
  atomIds: ReadonlyArray<Scalars['ID']['input']>;
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
  productIds?: InputMaybe<ReadonlyArray<Scalars['ID']['input']>>;
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
  embedding?: InputMaybe<ReadonlyArray<Scalars['Float']['input']>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  tensor?: InputMaybe<ReadonlyArray<Scalars['Float']['input']>>;
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
  atomIds: ReadonlyArray<Scalars['ID']['input']>;
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
  GROWTH = 'GROWTH',
  OPTIMIZATION = 'OPTIMIZATION',
  RETENTION = 'RETENTION',
  RISK_MITIGATION = 'RISK_MITIGATION'
}

export type RecommendationMetrics = {
  readonly __typename: 'RecommendationMetrics';
  readonly acceptanceRate: Scalars['Float']['output'];
  readonly avgConfidenceScore: Scalars['Float']['output'];
  readonly conversionRate: Scalars['Float']['output'];
  readonly totalGenerated: Scalars['Int']['output'];
};

export enum RecommendationPriority {
  HIGH = 'HIGH',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM'
}

export enum RecommendationType {
  CERTIFICATIONS = 'CERTIFICATIONS',
  CONTENT = 'CONTENT',
  PRODUCTS = 'PRODUCTS',
  PROFILE = 'PROFILE',
  VALUES = 'VALUES'
}

/** Register input */
export type RegisterInput = {
  readonly email: Scalars['String']['input'];
  readonly firstName: Scalars['String']['input'];
  readonly lastName: Scalars['String']['input'];
  readonly password: Scalars['String']['input'];
  readonly phone?: InputMaybe<Scalars['String']['input']>;
  readonly role: UserRole;
  readonly spaOrganizationId?: InputMaybe<Scalars['ID']['input']>;
  readonly vendorOrganizationId?: InputMaybe<Scalars['ID']['input']>;
};

export enum RelationshipStatus {
  ACTIVE = 'ACTIVE',
  AT_RISK = 'AT_RISK',
  CHURNED = 'CHURNED',
  NEW = 'NEW'
}

export type ReminderPreference = {
  readonly __typename: 'ReminderPreference';
  readonly enabled: Scalars['Boolean']['output'];
  readonly hoursBeforeAppointment: Scalars['Int']['output'];
};

export type ReminderPreferenceInput = {
  readonly enabled: Scalars['Boolean']['input'];
  readonly hoursBeforeAppointment: Scalars['Int']['input'];
};

/** Generated report */
export type Report = {
  readonly __typename: 'Report';
  readonly downloadUrl?: Maybe<Scalars['String']['output']>;
  readonly expiresAt?: Maybe<Scalars['DateTime']['output']>;
  readonly format: ReportFormat;
  readonly generatedAt: Scalars['DateTime']['output'];
  readonly id: Scalars['ID']['output'];
  readonly insights?: Maybe<InsightEngine>;
  readonly metrics?: Maybe<BusinessMetrics>;
  readonly status: ReportStatus;
  readonly timeframe: Scalars['String']['output'];
  readonly type: ReportType;
};

export enum ReportFormat {
  EXCEL = 'EXCEL',
  HTML = 'HTML',
  JSON = 'JSON',
  PDF = 'PDF'
}

export enum ReportFrequency {
  DAILY = 'DAILY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  WEEKLY = 'WEEKLY'
}

export enum ReportStatus {
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  GENERATING = 'GENERATING',
  PENDING = 'PENDING'
}

export enum ReportType {
  ANALYTICAL = 'ANALYTICAL',
  CUSTOMER = 'CUSTOMER',
  EXECUTIVE = 'EXECUTIVE',
  FINANCIAL = 'FINANCIAL',
  OPERATIONAL = 'OPERATIONAL',
  PRODUCT = 'PRODUCT'
}

/** Reset password input */
export type ResetPasswordInput = {
  readonly newPassword: Scalars['String']['input'];
  readonly token: Scalars['String']['input'];
};

export type RevenueMetrics = {
  readonly __typename: 'RevenueMetrics';
  readonly fromNewSpas: Scalars['Float']['output'];
  readonly fromRepeatSpas: Scalars['Float']['output'];
  readonly percentChange: Scalars['Float']['output'];
  readonly total: Scalars['Float']['output'];
  readonly trend: TrendIndicator;
};

export type RevenuePeriod = {
  readonly __typename: 'RevenuePeriod';
  readonly orderCount: Scalars['Int']['output'];
  readonly period: Scalars['String']['output'];
  readonly revenue: Scalars['Float']['output'];
};

export enum RiskLevel {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM'
}

export type RoutineComplexityBreakdown = {
  readonly __typename: 'RoutineComplexityBreakdown';
  readonly advanced: Scalars['Int']['output'];
  readonly basic: Scalars['Int']['output'];
  readonly expert: Scalars['Int']['output'];
  readonly minimal: Scalars['Int']['output'];
};

/** Causal chain response */
export type SkaCausalChain = {
  readonly __typename: 'SKACausalChain';
  readonly atom: SkincareAtom;
  readonly consequences: ReadonlyArray<SkaCausalNode>;
  readonly maxDepth: Scalars['Int']['output'];
  readonly prerequisites: ReadonlyArray<SkaCausalNode>;
};

/** Causal chain node for prerequisite/consequence traversal */
export type SkaCausalNode = {
  readonly __typename: 'SKACausalNode';
  readonly atom: SkincareAtom;
  readonly depth: Scalars['Int']['output'];
  readonly relationship: SkincareRelationship;
};

/** Compatibility check result */
export type SkaCompatibilityResult = {
  readonly __typename: 'SKACompatibilityResult';
  readonly compatible: Scalars['Boolean']['output'];
  readonly conflicts: ReadonlyArray<SkincareRelationship>;
  readonly recommendations: ReadonlyArray<Scalars['String']['output']>;
  readonly score: Scalars['Float']['output'];
  readonly synergies: ReadonlyArray<SkincareRelationship>;
  readonly warnings: ReadonlyArray<Scalars['String']['output']>;
};

/** Full compliance score result */
export type SkaComplianceScore = {
  readonly __typename: 'SKAComplianceScore';
  readonly analyzedAt: Scalars['String']['output'];
  readonly criticalCount: Scalars['Int']['output'];
  readonly infoCount: Scalars['Int']['output'];
  readonly overallScore: Scalars['Int']['output'];
  readonly passed: Scalars['Boolean']['output'];
  readonly processingTimeMs: Scalars['Int']['output'];
  readonly suggestions: ReadonlyArray<SkaComplianceSuggestion>;
  readonly totalClaims: Scalars['Int']['output'];
  readonly warningCount: Scalars['Int']['output'];
  readonly warnings: ReadonlyArray<SkaComplianceWarning>;
};

/** AI-generated suggestion for compliant alternative */
export type SkaComplianceSuggestion = {
  readonly __typename: 'SKAComplianceSuggestion';
  readonly explanation: Scalars['String']['output'];
  readonly originalClaim: Scalars['String']['output'];
  readonly regulationReference?: Maybe<Scalars['String']['output']>;
  readonly suggestedReplacement: Scalars['String']['output'];
};

/** Single compliance warning for a flagged claim */
export type SkaComplianceWarning = {
  readonly __typename: 'SKAComplianceWarning';
  readonly claim: Scalars['String']['output'];
  readonly claimType: Scalars['String']['output'];
  readonly confidence: Scalars['Float']['output'];
  readonly issue: Scalars['String']['output'];
  readonly matchedAtomId?: Maybe<Scalars['ID']['output']>;
  readonly matchedAtomTitle?: Maybe<Scalars['String']['output']>;
  readonly regulation: Scalars['String']['output'];
  readonly severity: ComplianceSeverity;
  readonly suggestion: Scalars['String']['output'];
};

/** Search highlight showing where matches occurred */
export type SkaHighlight = {
  readonly __typename: 'SKAHighlight';
  readonly field: Scalars['String']['output'];
  readonly matches: ReadonlyArray<Scalars['String']['output']>;
};

/** Knowledge graph statistics */
export type SkaKnowledgeGraphStats = {
  readonly __typename: 'SKAKnowledgeGraphStats';
  readonly atomsByPillar: Scalars['JSON']['output'];
  readonly atomsByType: Scalars['JSON']['output'];
  readonly recentlyAdded: ReadonlyArray<SkincareAtom>;
  readonly topIngredients: ReadonlyArray<SkincareAtom>;
  readonly totalAtoms: Scalars['Int']['output'];
  readonly totalPillars: Scalars['Int']['output'];
  readonly totalRelationships: Scalars['Int']['output'];
};

/** Purging information response */
export type SkaPurgingInfo = {
  readonly __typename: 'SKAPurgingInfo';
  readonly causesPurging: Scalars['Boolean']['output'];
  readonly description?: Maybe<Scalars['String']['output']>;
  readonly durationWeeks?: Maybe<Scalars['Int']['output']>;
  readonly relatedIngredients: ReadonlyArray<SkincareAtom>;
};

/** Quick compliance check result */
export type SkaQuickComplianceResult = {
  readonly __typename: 'SKAQuickComplianceResult';
  readonly criticalIssues: ReadonlyArray<Scalars['String']['output']>;
  readonly passed: Scalars['Boolean']['output'];
};

/** Search filters for SKA queries */
export type SkaSearchFilters = {
  readonly atomTypes?: InputMaybe<ReadonlyArray<SkincareAtomType>>;
  readonly causesPurging?: InputMaybe<Scalars['Boolean']['input']>;
  readonly containsIngredients?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  readonly crueltyFree?: InputMaybe<Scalars['Boolean']['input']>;
  readonly euCompliant?: InputMaybe<Scalars['Boolean']['input']>;
  readonly excludesIngredients?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  readonly fdaApproved?: InputMaybe<Scalars['Boolean']['input']>;
  readonly marketSegments?: InputMaybe<ReadonlyArray<MarketSegment>>;
  readonly minEfficacyScore?: InputMaybe<Scalars['Float']['input']>;
  readonly minInnovationScore?: InputMaybe<Scalars['Float']['input']>;
  readonly pillars?: InputMaybe<ReadonlyArray<Scalars['Int']['input']>>;
  readonly pricePoints?: InputMaybe<ReadonlyArray<PricePoint>>;
  readonly yearRange?: InputMaybe<ReadonlyArray<Scalars['Int']['input']>>;
};

/** Paginated search response */
export type SkaSearchResponse = {
  readonly __typename: 'SKASearchResponse';
  readonly executionTimeMs?: Maybe<Scalars['Int']['output']>;
  readonly hasMore: Scalars['Boolean']['output'];
  readonly query?: Maybe<Scalars['String']['output']>;
  readonly results: ReadonlyArray<SkaSearchResult>;
  readonly totalCount: Scalars['Int']['output'];
};

/** Search result with relevance score */
export type SkaSearchResult = {
  readonly __typename: 'SKASearchResult';
  readonly atom: SkincareAtom;
  readonly highlights?: Maybe<ReadonlyArray<SkaHighlight>>;
  readonly relevanceScore?: Maybe<Scalars['Float']['output']>;
};

/** 17-D Tensor profile for ingredient matching */
export type SkaTensorProfileInput = {
  readonly antiAgingPotency?: InputMaybe<Scalars['Float']['input']>;
  readonly antiInflammatory?: InputMaybe<Scalars['Float']['input']>;
  readonly antioxidantCapacity?: InputMaybe<Scalars['Float']['input']>;
  readonly barrierRepair?: InputMaybe<Scalars['Float']['input']>;
  readonly brighteningEfficacy?: InputMaybe<Scalars['Float']['input']>;
  readonly clinicalEvidenceLevel?: InputMaybe<Scalars['Float']['input']>;
  readonly collagenStimulation?: InputMaybe<Scalars['Float']['input']>;
  readonly compatibilityScore?: InputMaybe<Scalars['Float']['input']>;
  readonly exfoliationStrength?: InputMaybe<Scalars['Float']['input']>;
  readonly hydrationIndex?: InputMaybe<Scalars['Float']['input']>;
  readonly marketSaturation?: InputMaybe<Scalars['Float']['input']>;
  readonly molecularPenetration?: InputMaybe<Scalars['Float']['input']>;
  readonly phDependency?: InputMaybe<Scalars['Float']['input']>;
  readonly photosensitivity?: InputMaybe<Scalars['Float']['input']>;
  readonly sebumRegulation?: InputMaybe<Scalars['Float']['input']>;
  readonly sensitivityRisk?: InputMaybe<Scalars['Float']['input']>;
  readonly stabilityRating?: InputMaybe<Scalars['Float']['input']>;
};

/** Community member profile for Spa-ce Sanctuary */
export type SanctuaryMember = {
  readonly __typename: 'SanctuaryMember';
  readonly bio?: Maybe<Scalars['String']['output']>;
  readonly certifications: ReadonlyArray<Scalars['String']['output']>;
  readonly commentCount: Scalars['Int']['output'];
  readonly displayName: Scalars['String']['output'];
  readonly expertiseAreas: ReadonlyArray<Scalars['String']['output']>;
  readonly id: Scalars['ID']['output'];
  readonly isVerified: Scalars['Boolean']['output'];
  readonly joinedAt: Scalars['DateTime']['output'];
  readonly lastActiveAt?: Maybe<Scalars['DateTime']['output']>;
  readonly postCount: Scalars['Int']['output'];
  readonly profileImageUrl?: Maybe<Scalars['String']['output']>;
  readonly reputationScore: Scalars['Int']['output'];
  readonly yearsExperience?: Maybe<Scalars['Int']['output']>;
};

export type ScheduleReportInput = {
  readonly filters?: InputMaybe<MetricsFiltersInput>;
  readonly format: ReportFormat;
  readonly frequency: ReportFrequency;
  readonly name: Scalars['String']['input'];
  readonly recipients: ReadonlyArray<Scalars['String']['input']>;
  readonly type: ReportType;
};

/** Scheduled report configuration */
export type ScheduledReport = {
  readonly __typename: 'ScheduledReport';
  readonly createdAt: Scalars['DateTime']['output'];
  readonly format: ReportFormat;
  readonly frequency: ReportFrequency;
  readonly id: Scalars['ID']['output'];
  readonly isActive: Scalars['Boolean']['output'];
  readonly lastRunAt?: Maybe<Scalars['DateTime']['output']>;
  readonly name: Scalars['String']['output'];
  readonly nextRunAt?: Maybe<Scalars['DateTime']['output']>;
  readonly recipients: ReadonlyArray<Scalars['String']['output']>;
  readonly type: ReportType;
};

export type ScoreDistribution = {
  readonly __typename: 'ScoreDistribution';
  readonly excellent: Scalars['Int']['output'];
  readonly fair: Scalars['Int']['output'];
  readonly good: Scalars['Int']['output'];
  readonly poor: Scalars['Int']['output'];
};

export type SearchQueryInsight = {
  readonly __typename: 'SearchQueryInsight';
  readonly query: Scalars['String']['output'];
  readonly topCompetitor?: Maybe<Scalars['String']['output']>;
  readonly volume: Scalars['Int']['output'];
  readonly yourPosition?: Maybe<Scalars['Int']['output']>;
};

export type SendMessageInput = {
  readonly attachments?: InputMaybe<ReadonlyArray<MessageAttachmentInput>>;
  readonly content: Scalars['String']['input'];
  readonly conversationId: Scalars['ID']['input'];
};

/** Service Provider */
export type ServiceProvider = {
  readonly __typename: 'ServiceProvider';
  readonly appointments: ReadonlyArray<Appointment>;
  readonly availabilityWindows: Scalars['JSON']['output'];
  readonly avatarUrl?: Maybe<Scalars['String']['output']>;
  readonly bio?: Maybe<Scalars['String']['output']>;
  readonly createdAt: Scalars['DateTime']['output'];
  readonly id: Scalars['ID']['output'];
  readonly isActive: Scalars['Boolean']['output'];
  readonly licenseInfo: LicenseInfo;
  readonly location?: Maybe<Location>;
  readonly spaOrganization: SpaOrganization;
  readonly specialties: ReadonlyArray<Scalars['String']['output']>;
  readonly updatedAt: Scalars['DateTime']['output'];
  readonly user: User;
  readonly userId: Scalars['ID']['output'];
};

export enum SignificanceLevel {
  HIGH = 'HIGH',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM'
}

/**
 * Skin Concern - What skin issues the product addresses
 * Examples: Acne, Aging, Hyperpigmentation, Dryness
 */
export type SkinConcern = {
  readonly __typename: 'SkinConcern';
  readonly createdAt: Scalars['DateTime']['output'];
  readonly description?: Maybe<Scalars['String']['output']>;
  readonly displayOrder: Scalars['Int']['output'];
  readonly id: Scalars['ID']['output'];
  readonly isActive: Scalars['Boolean']['output'];
  readonly name: Scalars['String']['output'];
  readonly productCount: Scalars['Int']['output'];
  readonly relatedIngredients?: Maybe<ReadonlyArray<Scalars['String']['output']>>;
  readonly severityLevels?: Maybe<ReadonlyArray<ConcernSeverity>>;
};

export type SkinProfile = {
  readonly __typename: 'SkinProfile';
  readonly concerns: ReadonlyArray<Scalars['String']['output']>;
  readonly currentRoutine?: Maybe<Scalars['String']['output']>;
  readonly goals: ReadonlyArray<Scalars['String']['output']>;
  readonly sensitivities: ReadonlyArray<Scalars['String']['output']>;
  readonly skinType: Scalars['String']['output'];
};

/** User's skin profile for personalized recommendations */
export type SkinProfileInput = {
  /** Budget preference ($, $$, $$$, $$$$) */
  readonly budgetTier?: InputMaybe<Scalars['String']['input']>;
  /** Skin concerns to address */
  readonly concerns: ReadonlyArray<Scalars['String']['input']>;
  readonly currentRoutine?: InputMaybe<Scalars['String']['input']>;
  readonly goals: ReadonlyArray<Scalars['String']['input']>;
  /** Prefer fragrance-free products */
  readonly preferFragranceFree?: InputMaybe<Scalars['Boolean']['input']>;
  /** Prefer vegan products */
  readonly preferVegan?: InputMaybe<Scalars['Boolean']['input']>;
  /** Known sensitivities or allergies */
  readonly sensitivities: ReadonlyArray<Scalars['String']['input']>;
  /** Primary skin type (Normal, Dry, Oily, Combination, Sensitive, Mature) */
  readonly skinType: Scalars['String']['input'];
};

export enum SkinType {
  COMBINATION = 'COMBINATION',
  DRY = 'DRY',
  NORMAL = 'NORMAL',
  OILY = 'OILY',
  SENSITIVE = 'SENSITIVE'
}

/** Skincare-specific analytics */
export type SkincareAnalytics = {
  readonly __typename: 'SkincareAnalytics';
  readonly consultationEffectiveness: ConsultationMetrics;
  readonly popularIngredients: ReadonlyArray<IngredientAnalysis>;
  readonly purgePhaseAnalysis: PurgeAnalysis;
  readonly routineComplexity: RoutineComplexityBreakdown;
  readonly topConcerns: ReadonlyArray<ConcernAnalysis>;
};

/** Skincare Knowledge Atom - core knowledge unit */
export type SkincareAtom = {
  readonly __typename: 'SkincareAtom';
  readonly annualRevenue?: Maybe<Scalars['Float']['output']>;
  readonly atomType: SkincareAtomType;
  readonly bannerImageUrl?: Maybe<Scalars['String']['output']>;
  readonly casNumber?: Maybe<Scalars['String']['output']>;
  /** Summary of causal relationships */
  readonly causalSummary?: Maybe<Scalars['String']['output']>;
  readonly causesPurging?: Maybe<Scalars['Boolean']['output']>;
  /** Claim evidence for this atom */
  readonly claimEvidences: ReadonlyArray<ClaimEvidence>;
  readonly cleanBeauty?: Maybe<Scalars['Boolean']['output']>;
  readonly createdAt: Scalars['String']['output'];
  readonly crueltyFree?: Maybe<Scalars['Boolean']['output']>;
  /** Efficacy indicators for this atom */
  readonly efficacyIndicators: ReadonlyArray<EfficacyIndicator>;
  readonly efficacyScore?: Maybe<Scalars['Float']['output']>;
  /** Efficacy summary */
  readonly efficacySummary?: Maybe<EfficacySummary>;
  readonly euCompliant?: Maybe<Scalars['Boolean']['output']>;
  /** Evidence summary */
  readonly evidenceSummary?: Maybe<EvidenceSummary>;
  readonly fdaApproved?: Maybe<Scalars['Boolean']['output']>;
  readonly featured?: Maybe<Scalars['Boolean']['output']>;
  readonly featuredOrder?: Maybe<Scalars['Int']['output']>;
  readonly glanceText: Scalars['String']['output'];
  readonly goldilocksParameters: ReadonlyArray<GoldilocksParameter>;
  readonly growthRate?: Maybe<Scalars['Float']['output']>;
  readonly id: Scalars['ID']['output'];
  readonly imageUrls?: Maybe<ReadonlyArray<Scalars['String']['output']>>;
  readonly inciName?: Maybe<Scalars['String']['output']>;
  readonly infographicUrl?: Maybe<Scalars['String']['output']>;
  readonly innovationScore?: Maybe<Scalars['Float']['output']>;
  readonly keyIngredients?: Maybe<ReadonlyArray<Scalars['String']['output']>>;
  /** Knowledge threshold level */
  readonly knowledgeThreshold?: Maybe<KnowledgeThreshold>;
  readonly logoUrl?: Maybe<Scalars['String']['output']>;
  readonly marketCap?: Maybe<Scalars['Float']['output']>;
  readonly marketSegment?: Maybe<MarketSegment>;
  readonly marketShare?: Maybe<Scalars['Float']['output']>;
  readonly maxConcentration?: Maybe<Scalars['Float']['output']>;
  readonly metadata?: Maybe<Scalars['JSON']['output']>;
  readonly molecularFormula?: Maybe<Scalars['String']['output']>;
  readonly molecularWeight?: Maybe<Scalars['Float']['output']>;
  readonly parentCompany?: Maybe<SkincareAtom>;
  readonly parentCompanyId?: Maybe<Scalars['ID']['output']>;
  readonly patentYear?: Maybe<Scalars['Int']['output']>;
  readonly phRangeMax?: Maybe<Scalars['Float']['output']>;
  readonly phRangeMin?: Maybe<Scalars['Float']['output']>;
  readonly pillar?: Maybe<SkincarePillar>;
  readonly pillarId: Scalars['ID']['output'];
  readonly pricePoint?: Maybe<PricePoint>;
  readonly productImageUrl?: Maybe<Scalars['String']['output']>;
  readonly purgingDescription?: Maybe<Scalars['String']['output']>;
  readonly purgingDurationWeeks?: Maybe<Scalars['Int']['output']>;
  readonly regulationYear?: Maybe<Scalars['Int']['output']>;
  readonly relationships: ReadonlyArray<SkincareRelationship>;
  readonly scanText: Scalars['String']['output'];
  readonly slug: Scalars['String']['output'];
  readonly sources?: Maybe<Scalars['JSON']['output']>;
  readonly studyText: Scalars['String']['output'];
  readonly sustainabilityScore?: Maybe<Scalars['Float']['output']>;
  readonly targetDemographics?: Maybe<ReadonlyArray<Scalars['String']['output']>>;
  readonly tensor?: Maybe<SkincareAtomTensor>;
  readonly title: Scalars['String']['output'];
  readonly trendEmergenceYear?: Maybe<Scalars['Int']['output']>;
  readonly updatedAt: Scalars['String']['output'];
  readonly veganCertified?: Maybe<Scalars['Boolean']['output']>;
  readonly videoUrl?: Maybe<Scalars['String']['output']>;
  readonly viewCount?: Maybe<Scalars['Int']['output']>;
  /** Why this ingredient/concept works */
  readonly whyItWorks?: Maybe<Scalars['String']['output']>;
  readonly yearEstablished?: Maybe<Scalars['Int']['output']>;
  readonly yearIntroduced?: Maybe<Scalars['Int']['output']>;
};

/** 17-D Domain Tensor for skincare matching */
export type SkincareAtomTensor = {
  readonly __typename: 'SkincareAtomTensor';
  readonly antiAgingPotency: Scalars['Float']['output'];
  readonly antiInflammatory: Scalars['Float']['output'];
  readonly antioxidantCapacity: Scalars['Float']['output'];
  readonly atomId: Scalars['ID']['output'];
  readonly barrierRepair: Scalars['Float']['output'];
  readonly brighteningEfficacy: Scalars['Float']['output'];
  readonly clinicalEvidenceLevel: Scalars['Float']['output'];
  readonly collagenStimulation: Scalars['Float']['output'];
  readonly compatibilityScore: Scalars['Float']['output'];
  readonly createdAt: Scalars['String']['output'];
  readonly exfoliationStrength: Scalars['Float']['output'];
  readonly hydrationIndex: Scalars['Float']['output'];
  readonly id: Scalars['ID']['output'];
  readonly marketSaturation: Scalars['Float']['output'];
  readonly molecularPenetration: Scalars['Float']['output'];
  readonly phDependency: Scalars['Float']['output'];
  readonly photosensitivity: Scalars['Float']['output'];
  readonly sebumRegulation: Scalars['Float']['output'];
  readonly sensitivityRisk: Scalars['Float']['output'];
  readonly stabilityRating: Scalars['Float']['output'];
  readonly tensorVector?: Maybe<ReadonlyArray<Scalars['Float']['output']>>;
  readonly updatedAt: Scalars['String']['output'];
};

/** 8 Atom Types for Skincare Industry Knowledge */
export enum SkincareAtomType {
  BRAND = 'BRAND',
  COMPANY = 'COMPANY',
  INGREDIENT = 'INGREDIENT',
  MARKET_DATA = 'MARKET_DATA',
  PRODUCT = 'PRODUCT',
  REGULATION = 'REGULATION',
  SCIENTIFIC_CONCEPT = 'SCIENTIFIC_CONCEPT',
  TREND = 'TREND'
}

/** Available filter options for skincare search UI */
export type SkincareFilterOptions = {
  readonly __typename: 'SkincareFilterOptions';
  /** Available categories */
  readonly categories: ReadonlyArray<Scalars['String']['output']>;
  /** Available skin concerns */
  readonly concerns: ReadonlyArray<Scalars['String']['output']>;
  /** Available price tiers */
  readonly priceTiers: ReadonlyArray<PriceTier>;
  /** Available routine steps */
  readonly routineSteps: ReadonlyArray<Scalars['String']['output']>;
  /** Available skin types */
  readonly skinTypes: ReadonlyArray<Scalars['String']['output']>;
  /** Available subcategories */
  readonly subcategories: ReadonlyArray<Scalars['String']['output']>;
  /** Available textures */
  readonly textures: ReadonlyArray<Scalars['String']['output']>;
};

/** 7 Categorical Pillars organizing skincare knowledge */
export type SkincarePillar = {
  readonly __typename: 'SkincarePillar';
  readonly atomCount: Scalars['Int']['output'];
  readonly atoms: ReadonlyArray<SkincareAtom>;
  readonly createdAt: Scalars['String']['output'];
  readonly description?: Maybe<Scalars['String']['output']>;
  readonly displayOrder: Scalars['Int']['output'];
  readonly hexColor?: Maybe<Scalars['String']['output']>;
  readonly iconUrl?: Maybe<Scalars['String']['output']>;
  readonly id: Scalars['ID']['output'];
  readonly name: Scalars['String']['output'];
  readonly number: Scalars['Int']['output'];
  readonly slug: Scalars['String']['output'];
  readonly updatedAt: Scalars['String']['output'];
};


/** 7 Categorical Pillars organizing skincare knowledge */
export type SkincarePillarAtomsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};

/** Skincare product with full metadata */
export type SkincareProduct = {
  readonly __typename: 'SkincareProduct';
  /** Functional benefits */
  readonly benefits: ReadonlyArray<Scalars['String']['output']>;
  /** Brand name */
  readonly brand: Scalars['String']['output'];
  /** Main category (Cleansers, Treatments, etc.) */
  readonly category: Scalars['String']['output'];
  /** Skin concerns this product targets */
  readonly concerns: ReadonlyArray<Scalars['String']['output']>;
  /** Is cruelty-free */
  readonly crueltyFree: Scalars['Boolean']['output'];
  /** Is fragrance-free */
  readonly fragranceFree: Scalars['Boolean']['output'];
  readonly id: Scalars['ID']['output'];
  /** Active ingredients */
  readonly ingredients: ReadonlyArray<Scalars['String']['output']>;
  /** Key product benefits (marketing highlights) */
  readonly keyBenefits: ReadonlyArray<Scalars['String']['output']>;
  /** Price tier ($, $$, $$$, $$$$) */
  readonly priceTier: PriceTier;
  /** Product name */
  readonly productName: Scalars['String']['output'];
  /** Routine step (Cleanse, Treat, Moisturize, Protect) */
  readonly routineStep: Scalars['String']['output'];
  /** Relevance score (0-1, higher is more relevant) */
  readonly score: Scalars['Float']['output'];
  /** Skin types this product is suitable for */
  readonly skinTypes: ReadonlyArray<Scalars['String']['output']>;
  /** Subcategory (Gel Cleanser, Vitamin C Serum, etc.) */
  readonly subcategory: Scalars['String']['output'];
  /** Product texture (Gel, Cream, Serum, etc.) */
  readonly texture: Scalars['String']['output'];
  /** Is vegan */
  readonly vegan: Scalars['Boolean']['output'];
  /** Product volume/size */
  readonly volume: Scalars['String']['output'];
};

/** Semantic/causal relationship between atoms */
export type SkincareRelationship = {
  readonly __typename: 'SkincareRelationship';
  readonly createdAt: Scalars['String']['output'];
  readonly establishedYear?: Maybe<Scalars['Int']['output']>;
  readonly evidenceDescription?: Maybe<Scalars['String']['output']>;
  readonly fromAtom?: Maybe<SkincareAtom>;
  readonly fromAtomId: Scalars['ID']['output'];
  readonly id: Scalars['ID']['output'];
  readonly metadata?: Maybe<Scalars['JSON']['output']>;
  readonly relationshipType: SkincareRelationshipType;
  readonly sourceType?: Maybe<SourceType>;
  readonly sourceUrl?: Maybe<Scalars['String']['output']>;
  readonly strength?: Maybe<Scalars['Float']['output']>;
  readonly toAtom?: Maybe<SkincareAtom>;
  readonly toAtomId: Scalars['ID']['output'];
};

/** Relationship Types (16 semantic relationships) */
export enum SkincareRelationshipType {
  ACQUIRES = 'ACQUIRES',
  APPROVES = 'APPROVES',
  COMPETES_WITH = 'COMPETES_WITH',
  CONFLICTS_WITH = 'CONFLICTS_WITH',
  CONSEQUENCE_OF = 'CONSEQUENCE_OF',
  DISRUPTS = 'DISRUPTS',
  ENABLES = 'ENABLES',
  FORMULATED_WITH = 'FORMULATED_WITH',
  INFLUENCES = 'INFLUENCES',
  INHIBITS = 'INHIBITS',
  OWNED_BY = 'OWNED_BY',
  PREREQUISITE_OF = 'PREREQUISITE_OF',
  REGULATES = 'REGULATES',
  REPLACES = 'REPLACES',
  RESTRICTS = 'RESTRICTS',
  SYNERGIZES_WITH = 'SYNERGIZES_WITH'
}

/** Skincare routine with products for each step */
export type SkincareRoutine = {
  readonly __typename: 'SkincareRoutine';
  /** Routine steps with recommended products */
  readonly steps: ReadonlyArray<SkincareRoutineStep>;
};

/** Single step in a skincare routine */
export type SkincareRoutineStep = {
  readonly __typename: 'SkincareRoutineStep';
  /** Recommended products for this step */
  readonly products: ReadonlyArray<SkincareProduct>;
  /** Step name (Cleanse, Treat, Moisturize, Protect) */
  readonly step: Scalars['String']['output'];
};

/** Filters for skincare product search */
export type SkincareSearchFilters = {
  /** Filter by category */
  readonly category?: InputMaybe<Scalars['String']['input']>;
  /** Filter by targeted concerns */
  readonly concerns?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  /** Filter for cruelty-free products only */
  readonly crueltyFree?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter for fragrance-free products only */
  readonly fragranceFree?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by price tier */
  readonly priceTier?: InputMaybe<PriceTier>;
  /** Filter by routine step */
  readonly routineStep?: InputMaybe<Scalars['String']['input']>;
  /** Filter by compatible skin types */
  readonly skinTypes?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  /** Filter by subcategory */
  readonly subcategory?: InputMaybe<Scalars['String']['input']>;
  /** Filter by texture */
  readonly texture?: InputMaybe<Scalars['String']['input']>;
  /** Filter for vegan products only */
  readonly vegan?: InputMaybe<Scalars['Boolean']['input']>;
};

export type SocialLinks = {
  readonly __typename: 'SocialLinks';
  readonly facebook?: Maybe<Scalars['String']['output']>;
  readonly instagram?: Maybe<Scalars['String']['output']>;
  readonly linkedin?: Maybe<Scalars['String']['output']>;
  readonly tiktok?: Maybe<Scalars['String']['output']>;
};

export type SocialLinksInput = {
  readonly facebook?: InputMaybe<Scalars['String']['input']>;
  readonly instagram?: InputMaybe<Scalars['String']['input']>;
  readonly linkedin?: InputMaybe<Scalars['String']['input']>;
  readonly tiktok?: InputMaybe<Scalars['String']['input']>;
};

/** Common sorting options */
export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC'
}

/** Source Types (6 evidence types) */
export enum SourceType {
  COMPANY_FILING = 'COMPANY_FILING',
  INDUSTRY_REPORT = 'INDUSTRY_REPORT',
  MARKET_RESEARCH = 'MARKET_RESEARCH',
  PATENT = 'PATENT',
  PEER_REVIEWED = 'PEER_REVIEWED',
  REGULATORY_DOCUMENT = 'REGULATORY_DOCUMENT'
}

export type SpaContact = {
  readonly __typename: 'SpaContact';
  readonly email: Scalars['String']['output'];
  readonly name: Scalars['String']['output'];
  readonly phone?: Maybe<Scalars['String']['output']>;
};

export type SpaMetrics = {
  readonly __typename: 'SpaMetrics';
  readonly active: Scalars['Int']['output'];
  readonly new: Scalars['Int']['output'];
  readonly percentChange: Scalars['Float']['output'];
  readonly reorderRate: Scalars['Float']['output'];
  readonly repeat: Scalars['Int']['output'];
  readonly trend: TrendIndicator;
};

/** Spa Organization */
export type SpaOrganization = {
  readonly __typename: 'SpaOrganization';
  readonly address: Address;
  readonly contactEmail: Scalars['String']['output'];
  readonly contactPhone?: Maybe<Scalars['String']['output']>;
  readonly createdAt: Scalars['DateTime']['output'];
  readonly displayName: Scalars['String']['output'];
  readonly id: Scalars['ID']['output'];
  readonly isActive: Scalars['Boolean']['output'];
  readonly locations: ReadonlyArray<Location>;
  readonly logoUrl?: Maybe<Scalars['String']['output']>;
  readonly name: Scalars['String']['output'];
  readonly subscriptionStatus: SubscriptionStatus;
  readonly subscriptionTier: SubscriptionTier;
  readonly updatedAt: Scalars['DateTime']['output'];
};

/** Pagination connections */
export type SpaOrganizationConnection = {
  readonly __typename: 'SpaOrganizationConnection';
  readonly edges: ReadonlyArray<SpaOrganizationEdge>;
  readonly pageInfo: PageInfo;
  readonly totalCount: Scalars['Int']['output'];
};

export type SpaOrganizationEdge = {
  readonly __typename: 'SpaOrganizationEdge';
  readonly cursor: Scalars['String']['output'];
  readonly node: SpaOrganization;
};

/** Result types */
export type SpaOrganizationResult = {
  readonly __typename: 'SpaOrganizationResult';
  readonly errors?: Maybe<ReadonlyArray<Error>>;
  readonly spaOrganization?: Maybe<SpaOrganization>;
  readonly success: Scalars['Boolean']['output'];
};

export type SpaVendorRelationship = {
  readonly __typename: 'SpaVendorRelationship';
  readonly avgDaysBetweenOrders?: Maybe<Scalars['Int']['output']>;
  readonly avgOrderValue: Scalars['Float']['output'];
  readonly createdAt: Scalars['DateTime']['output'];
  readonly daysSinceLastOrder?: Maybe<Scalars['Int']['output']>;
  readonly favoriteCategories?: Maybe<ReadonlyArray<Scalars['String']['output']>>;
  readonly firstOrderAt?: Maybe<Scalars['DateTime']['output']>;
  readonly id: Scalars['ID']['output'];
  readonly lastMessageAt?: Maybe<Scalars['DateTime']['output']>;
  readonly lastOrderAt?: Maybe<Scalars['DateTime']['output']>;
  readonly lifetimeValue: Scalars['Float']['output'];
  readonly messageCount: Scalars['Int']['output'];
  readonly orderCount: Scalars['Int']['output'];
  readonly profileViews: Scalars['Int']['output'];
  readonly spaId: Scalars['ID']['output'];
  readonly spaName?: Maybe<Scalars['String']['output']>;
  readonly status: RelationshipStatus;
  readonly topProducts?: Maybe<ReadonlyArray<Scalars['ID']['output']>>;
  readonly updatedAt: Scalars['DateTime']['output'];
  readonly vendorId: Scalars['ID']['output'];
};

export type StatusChange = {
  readonly __typename: 'StatusChange';
  readonly changedAt: Scalars['DateTime']['output'];
  readonly changedBy: Scalars['String']['output'];
  readonly note?: Maybe<Scalars['String']['output']>;
  readonly status: OrderStatus;
};

export type SubmitVendorApplicationInput = {
  readonly annualRevenue?: InputMaybe<Scalars['String']['input']>;
  readonly brandName: Scalars['String']['input'];
  readonly businessLicenseUrl?: InputMaybe<Scalars['String']['input']>;
  readonly certifications?: InputMaybe<ReadonlyArray<CertificationType>>;
  readonly contactEmail: Scalars['String']['input'];
  readonly contactFirstName: Scalars['String']['input'];
  readonly contactLastName: Scalars['String']['input'];
  readonly contactPhone?: InputMaybe<Scalars['String']['input']>;
  readonly contactRole: Scalars['String']['input'];
  readonly currentDistribution?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  readonly employeeCount: Scalars['String']['input'];
  readonly headquarters: Scalars['String']['input'];
  readonly insuranceCertificateUrl?: InputMaybe<Scalars['String']['input']>;
  readonly legalName: Scalars['String']['input'];
  readonly lineSheetUrl?: InputMaybe<Scalars['String']['input']>;
  readonly priceRange: Scalars['String']['input'];
  readonly productCatalogUrl?: InputMaybe<Scalars['String']['input']>;
  readonly productCategories: ReadonlyArray<Scalars['String']['input']>;
  readonly skuCount: Scalars['String']['input'];
  readonly targetMarket: ReadonlyArray<Scalars['String']['input']>;
  readonly values: ReadonlyArray<VendorValue>;
  readonly website: Scalars['String']['input'];
  readonly whyJade: Scalars['String']['input'];
  readonly yearFounded: Scalars['Int']['input'];
};

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  CANCELLED = 'CANCELLED',
  PAST_DUE = 'PAST_DUE',
  TRIAL = 'TRIAL'
}

export enum SubscriptionTier {
  BASIC = 'BASIC',
  ENTERPRISE = 'ENTERPRISE',
  PROFESSIONAL = 'PROFESSIONAL'
}

/** Success response */
export type SuccessResponse = {
  readonly __typename: 'SuccessResponse';
  readonly message?: Maybe<Scalars['String']['output']>;
  readonly success: Scalars['Boolean']['output'];
};

/** Synergy Type classification */
export enum SynergyType {
  COMPLEMENTARY = 'COMPLEMENTARY',
  ENHANCEMENT = 'ENHANCEMENT',
  PENETRATION = 'PENETRATION',
  PROTECTION = 'PROTECTION',
  STABILIZATION = 'STABILIZATION'
}

/**
 * Target Area - Body area for application
 * Examples: Face, Eye Area, Lips, Neck, Body
 */
export type TargetArea = {
  readonly __typename: 'TargetArea';
  readonly createdAt: Scalars['DateTime']['output'];
  readonly description?: Maybe<Scalars['String']['output']>;
  readonly id: Scalars['ID']['output'];
  readonly isActive: Scalars['Boolean']['output'];
  readonly name: Scalars['String']['output'];
  readonly productCount: Scalars['Int']['output'];
};

/** Filter input for taxonomy queries */
export type TaxonomyFilterInput = {
  readonly categoryIds?: InputMaybe<ReadonlyArray<Scalars['ID']['input']>>;
  readonly concernIds?: InputMaybe<ReadonlyArray<Scalars['ID']['input']>>;
  readonly functionIds?: InputMaybe<ReadonlyArray<Scalars['ID']['input']>>;
  readonly maxCompletenessScore?: InputMaybe<Scalars['Int']['input']>;
  readonly minCompletenessScore?: InputMaybe<Scalars['Int']['input']>;
  readonly professionalLevels?: InputMaybe<ReadonlyArray<ProfessionalLevel>>;
  readonly protocolRequired?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Taxonomy filter options for UI dropdowns */
export type TaxonomyFilterOptions = {
  readonly __typename: 'TaxonomyFilterOptions';
  readonly categories: ReadonlyArray<ProductCategory>;
  readonly concerns: ReadonlyArray<SkinConcern>;
  readonly formats: ReadonlyArray<ProductFormat>;
  readonly functions: ReadonlyArray<ProductFunction>;
  readonly professionalLevels: ReadonlyArray<ProfessionalLevel>;
  readonly regions: ReadonlyArray<ProductRegion>;
  readonly targetAreas: ReadonlyArray<TargetArea>;
  readonly usageTimes: ReadonlyArray<UsageTime>;
};

/**
 * Taxonomy completeness statistics
 * For quality control dashboard
 */
export type TaxonomyStats = {
  readonly __typename: 'TaxonomyStats';
  readonly averageCompletenessScore: Scalars['Float']['output'];
  readonly categoryCoverage: ReadonlyArray<CategoryCoverage>;
  readonly missingCategories: Scalars['Int']['output'];
  readonly missingFormats: Scalars['Int']['output'];
  readonly missingFunctions: Scalars['Int']['output'];
  readonly needsReview: Scalars['Int']['output'];
  readonly productsWithTaxonomy: Scalars['Int']['output'];
  readonly productsWithoutTaxonomy: Scalars['Int']['output'];
  readonly scoreDistribution: ScoreDistribution;
  readonly totalProducts: Scalars['Int']['output'];
};

export enum TeamSize {
  ELEVEN_TO_FIFTY = 'ELEVEN_TO_FIFTY',
  FIFTY_ONE_TO_TWO_HUNDRED = 'FIFTY_ONE_TO_TWO_HUNDRED',
  SOLO = 'SOLO',
  TWO_HUNDRED_PLUS = 'TWO_HUNDRED_PLUS',
  TWO_TO_TEN = 'TWO_TO_TEN'
}

export type TestReport = {
  readonly __typename: 'TestReport';
  readonly reportUrl: Scalars['String']['output'];
  readonly testType: Scalars['String']['output'];
  readonly testedAt: Scalars['DateTime']['output'];
};

/** Theme preference options */
export enum ThemePreference {
  DARK = 'DARK',
  LIGHT = 'LIGHT',
  SYSTEM = 'SYSTEM'
}

/** Time format options */
export enum TimeFormat {
  TWELVE_HOUR = 'TWELVE_HOUR',
  TWENTY_FOUR_HOUR = 'TWENTY_FOUR_HOUR'
}

export enum TimeOfDay {
  BOTH = 'BOTH',
  EVENING = 'EVENING',
  MORNING = 'MORNING'
}

export type TimeSeriesDataPoint = {
  readonly __typename: 'TimeSeriesDataPoint';
  readonly date: Scalars['String']['output'];
  readonly value: Scalars['Float']['output'];
};

/** Treatment Plan */
export type TreatmentPlan = {
  readonly __typename: 'TreatmentPlan';
  readonly client: Client;
  readonly completedSessions: Scalars['Int']['output'];
  readonly createdAt: Scalars['DateTime']['output'];
  readonly description?: Maybe<Scalars['String']['output']>;
  readonly id: Scalars['ID']['output'];
  readonly serviceProvider: ServiceProvider;
  readonly sessions: Scalars['JSON']['output'];
  readonly status: TreatmentPlanStatus;
  readonly title: Scalars['String']['output'];
  readonly totalSessions: Scalars['Int']['output'];
  readonly updatedAt: Scalars['DateTime']['output'];
};

export enum TreatmentPlanStatus {
  ACTIVE = 'ACTIVE',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  PAUSED = 'PAUSED'
}

export enum TrendDirection {
  DECREASING = 'DECREASING',
  INCREASING = 'INCREASING',
  STABLE = 'STABLE',
  VOLATILE = 'VOLATILE'
}

export enum TrendIndicator {
  DOWN = 'DOWN',
  FLAT = 'FLAT',
  UP = 'UP'
}

/** Trend analysis insight */
export type TrendInsight = {
  readonly __typename: 'TrendInsight';
  readonly changePercent: Scalars['Float']['output'];
  readonly context: Scalars['String']['output'];
  readonly description: Scalars['String']['output'];
  readonly metric: Scalars['String']['output'];
  readonly significance: SignificanceLevel;
  readonly timeframe: Scalars['String']['output'];
  readonly trend: TrendDirection;
};

/** Trending topic in the community */
export type TrendingTopic = {
  readonly __typename: 'TrendingTopic';
  readonly name: Scalars['String']['output'];
  readonly postCount: Scalars['Int']['output'];
  readonly skaAtom?: Maybe<SkincareAtom>;
};

export type UpdateAppPreferencesInput = {
  readonly compactMode?: InputMaybe<Scalars['Boolean']['input']>;
  readonly currency?: InputMaybe<Scalars['String']['input']>;
  readonly defaultView?: InputMaybe<DefaultView>;
  readonly itemsPerPage?: InputMaybe<Scalars['Int']['input']>;
  readonly keyboardShortcuts?: InputMaybe<Scalars['Boolean']['input']>;
  readonly showPricesWithTax?: InputMaybe<Scalars['Boolean']['input']>;
  readonly sidebarCollapsed?: InputMaybe<Scalars['Boolean']['input']>;
  readonly theme?: InputMaybe<ThemePreference>;
};

export type UpdateAppointmentInput = {
  readonly notes?: InputMaybe<Scalars['String']['input']>;
  readonly scheduledEnd?: InputMaybe<Scalars['DateTime']['input']>;
  readonly scheduledStart?: InputMaybe<Scalars['DateTime']['input']>;
  readonly serviceType?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCampaignInput = {
  readonly audienceDetails?: InputMaybe<Scalars['JSON']['input']>;
  readonly audienceSize?: InputMaybe<Scalars['Int']['input']>;
  readonly budgetDollars?: InputMaybe<Scalars['Float']['input']>;
  readonly campaignId: Scalars['ID']['input'];
  readonly description?: InputMaybe<Scalars['String']['input']>;
  readonly endDate?: InputMaybe<Scalars['DateTime']['input']>;
  readonly metadata?: InputMaybe<Scalars['JSON']['input']>;
  readonly name?: InputMaybe<Scalars['String']['input']>;
  readonly startDate?: InputMaybe<Scalars['DateTime']['input']>;
  readonly status?: InputMaybe<CampaignStatus>;
  readonly type?: InputMaybe<CampaignType>;
};

export type UpdateCampaignMetricsInput = {
  readonly campaignId: Scalars['ID']['input'];
  readonly clicks?: InputMaybe<Scalars['Int']['input']>;
  readonly conversions?: InputMaybe<Scalars['Int']['input']>;
  readonly impressions?: InputMaybe<Scalars['Int']['input']>;
  readonly revenueDollars?: InputMaybe<Scalars['Float']['input']>;
  readonly spentDollars?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateClientInput = {
  readonly allergies?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  readonly dateOfBirth?: InputMaybe<Scalars['DateTime']['input']>;
  readonly email?: InputMaybe<Scalars['String']['input']>;
  readonly firstName?: InputMaybe<Scalars['String']['input']>;
  readonly lastName?: InputMaybe<Scalars['String']['input']>;
  readonly notes?: InputMaybe<Scalars['String']['input']>;
  readonly phone?: InputMaybe<Scalars['String']['input']>;
  readonly preferences?: InputMaybe<ClientPreferencesInput>;
  readonly skinProfile?: InputMaybe<SkinProfileInput>;
};

export type UpdateNotificationSettingsInput = {
  readonly appointmentReminders?: InputMaybe<Scalars['Boolean']['input']>;
  readonly communityActivity?: InputMaybe<Scalars['Boolean']['input']>;
  readonly emailEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  readonly marketingEmails?: InputMaybe<Scalars['Boolean']['input']>;
  readonly orderUpdates?: InputMaybe<Scalars['Boolean']['input']>;
  readonly productAnnouncements?: InputMaybe<Scalars['Boolean']['input']>;
  readonly pushEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  readonly reminderHours?: InputMaybe<Scalars['Int']['input']>;
  readonly smsEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  readonly weeklyDigest?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateOrderStatusInput = {
  readonly note?: InputMaybe<Scalars['String']['input']>;
  readonly orderId: Scalars['ID']['input'];
  readonly status: OrderStatus;
};

/** Input for updating a post */
export type UpdatePostInput = {
  readonly category?: InputMaybe<Scalars['String']['input']>;
  readonly content?: InputMaybe<Scalars['String']['input']>;
  readonly skaAtomIds?: InputMaybe<ReadonlyArray<Scalars['ID']['input']>>;
  readonly status?: InputMaybe<PostStatus>;
  readonly tags?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  readonly title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateProductInput = {
  readonly glance?: InputMaybe<ProductGlanceInput>;
  readonly scan?: InputMaybe<ProductScanInput>;
  readonly study?: InputMaybe<ProductStudyInput>;
};

/** Update profile input */
export type UpdateProfileInput = {
  readonly avatarUrl?: InputMaybe<Scalars['String']['input']>;
  readonly firstName?: InputMaybe<Scalars['String']['input']>;
  readonly lastName?: InputMaybe<Scalars['String']['input']>;
  readonly phone?: InputMaybe<Scalars['String']['input']>;
};

/** Input types for mutations */
export type UpdateProfileSettingsInput = {
  readonly dateFormat?: InputMaybe<DateFormat>;
  readonly displayName?: InputMaybe<Scalars['String']['input']>;
  readonly language?: InputMaybe<Scalars['String']['input']>;
  readonly phoneNumber?: InputMaybe<Scalars['String']['input']>;
  readonly timeFormat?: InputMaybe<TimeFormat>;
  readonly timezone?: InputMaybe<Scalars['String']['input']>;
};

/** Input for updating member profile */
export type UpdateSanctuaryProfileInput = {
  readonly bio?: InputMaybe<Scalars['String']['input']>;
  readonly certifications?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  readonly displayName?: InputMaybe<Scalars['String']['input']>;
  readonly expertiseAreas?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  readonly profileImageUrl?: InputMaybe<Scalars['String']['input']>;
  readonly yearsExperience?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateSpaOrganizationInput = {
  readonly address?: InputMaybe<AddressInput>;
  readonly contactEmail?: InputMaybe<Scalars['String']['input']>;
  readonly contactPhone?: InputMaybe<Scalars['String']['input']>;
  readonly displayName?: InputMaybe<Scalars['String']['input']>;
  readonly logoUrl?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserSettingsInput = {
  readonly notifications?: InputMaybe<UpdateNotificationSettingsInput>;
  readonly preferences?: InputMaybe<UpdateAppPreferencesInput>;
  readonly profile?: InputMaybe<UpdateProfileSettingsInput>;
};

export type UpdateVendorOrganizationInput = {
  readonly address?: InputMaybe<AddressInput>;
  readonly businessLicense?: InputMaybe<BusinessLicenseInput>;
  readonly certifications?: InputMaybe<ReadonlyArray<CertificationInput>>;
  readonly contactEmail?: InputMaybe<Scalars['String']['input']>;
  readonly contactPhone?: InputMaybe<Scalars['String']['input']>;
  readonly displayName?: InputMaybe<Scalars['String']['input']>;
  readonly fulfillmentSettings?: InputMaybe<FulfillmentSettingsInput>;
  readonly insurance?: InputMaybe<InsuranceInfoInput>;
};

export type UpdateVendorProfileInput = {
  readonly brandColorPrimary?: InputMaybe<Scalars['String']['input']>;
  readonly brandColorSecondary?: InputMaybe<Scalars['String']['input']>;
  readonly brandName?: InputMaybe<Scalars['String']['input']>;
  readonly brandVideoUrl?: InputMaybe<Scalars['String']['input']>;
  readonly foundedYear?: InputMaybe<Scalars['Int']['input']>;
  readonly founderStory?: InputMaybe<Scalars['String']['input']>;
  readonly galleryImages?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  readonly headquarters?: InputMaybe<Scalars['String']['input']>;
  readonly heroImageUrl?: InputMaybe<Scalars['String']['input']>;
  readonly logoUrl?: InputMaybe<Scalars['String']['input']>;
  readonly missionStatement?: InputMaybe<Scalars['String']['input']>;
  readonly socialLinks?: InputMaybe<SocialLinksInput>;
  readonly tagline?: InputMaybe<Scalars['String']['input']>;
  readonly teamSize?: InputMaybe<TeamSize>;
  readonly values?: InputMaybe<ReadonlyArray<VendorValue>>;
  readonly websiteUrl?: InputMaybe<Scalars['String']['input']>;
};

export type UsageInstructions = {
  readonly __typename: 'UsageInstructions';
  readonly application: Scalars['String']['output'];
  readonly frequency: Scalars['String']['output'];
  readonly patchTestRequired: Scalars['Boolean']['output'];
  readonly timeOfDay: TimeOfDay;
};

export type UsageInstructionsInput = {
  readonly application: Scalars['String']['input'];
  readonly frequency: Scalars['String']['input'];
  readonly patchTestRequired: Scalars['Boolean']['input'];
  readonly timeOfDay: TimeOfDay;
};

/** Usage Time - When to use the product */
export enum UsageTime {
  ANYTIME = 'ANYTIME',
  EVENING = 'EVENING',
  MORNING = 'MORNING',
  NIGHT_ONLY = 'NIGHT_ONLY',
  POST_TREATMENT = 'POST_TREATMENT'
}

/** User type */
export type User = {
  readonly __typename: 'User';
  readonly avatarUrl?: Maybe<Scalars['String']['output']>;
  readonly createdAt: Scalars['DateTime']['output'];
  readonly email: Scalars['String']['output'];
  readonly emailVerified: Scalars['Boolean']['output'];
  readonly firstName?: Maybe<Scalars['String']['output']>;
  readonly id: Scalars['ID']['output'];
  readonly isActive: Scalars['Boolean']['output'];
  readonly lastName?: Maybe<Scalars['String']['output']>;
  readonly phone?: Maybe<Scalars['String']['output']>;
  readonly role: UserRole;
  readonly spaOrganization?: Maybe<SpaOrganization>;
  readonly updatedAt: Scalars['DateTime']['output'];
  readonly vendorOrganization?: Maybe<VendorOrganization>;
};

/** User operation result */
export type UserResult = {
  readonly __typename: 'UserResult';
  readonly errors?: Maybe<ReadonlyArray<Error>>;
  readonly success: Scalars['Boolean']['output'];
  readonly user?: Maybe<User>;
};

export enum UserRole {
  ADMIN = 'ADMIN',
  CLIENT = 'CLIENT',
  SERVICE_PROVIDER = 'SERVICE_PROVIDER',
  SPA_MANAGER = 'SPA_MANAGER',
  SPA_OWNER = 'SPA_OWNER',
  SPA_STAFF = 'SPA_STAFF',
  VENDOR = 'VENDOR',
  VENDOR_OWNER = 'VENDOR_OWNER',
  VENDOR_STAFF = 'VENDOR_STAFF'
}

/** User Settings - Complete settings object for a user */
export type UserSettings = {
  readonly __typename: 'UserSettings';
  readonly createdAt: Scalars['DateTime']['output'];
  readonly id: Scalars['ID']['output'];
  readonly notifications: NotificationSettings;
  readonly preferences: AppPreferences;
  readonly profile: ProfileSettings;
  readonly updatedAt: Scalars['DateTime']['output'];
  readonly userId: Scalars['ID']['output'];
};

/** Result type for settings operations */
export type UserSettingsResult = {
  readonly __typename: 'UserSettingsResult';
  readonly errors?: Maybe<ReadonlyArray<Error>>;
  readonly settings?: Maybe<UserSettings>;
  readonly success: Scalars['Boolean']['output'];
};

export type ValuePerformance = {
  readonly __typename: 'ValuePerformance';
  readonly clicks: Scalars['Int']['output'];
  readonly conversionRate: Scalars['Float']['output'];
  readonly conversions: Scalars['Int']['output'];
  readonly ctr: Scalars['Float']['output'];
  readonly impressions: Scalars['Int']['output'];
  readonly rank: Scalars['Int']['output'];
  readonly value: Scalars['String']['output'];
};

export type VendorApplication = {
  readonly __typename: 'VendorApplication';
  readonly annualRevenue?: Maybe<Scalars['String']['output']>;
  readonly approvalConditions?: Maybe<ReadonlyArray<Scalars['String']['output']>>;
  readonly assignedReviewerId?: Maybe<Scalars['String']['output']>;
  readonly assignedReviewerName?: Maybe<Scalars['String']['output']>;
  readonly brandName: Scalars['String']['output'];
  readonly certifications?: Maybe<ReadonlyArray<CertificationType>>;
  readonly contactEmail: Scalars['String']['output'];
  readonly contactFirstName: Scalars['String']['output'];
  readonly contactLastName: Scalars['String']['output'];
  readonly contactPhone?: Maybe<Scalars['String']['output']>;
  readonly contactRole: Scalars['String']['output'];
  readonly createdAt: Scalars['DateTime']['output'];
  readonly currentDistribution?: Maybe<ReadonlyArray<Scalars['String']['output']>>;
  readonly decidedAt?: Maybe<Scalars['DateTime']['output']>;
  readonly documents?: Maybe<ApplicationDocuments>;
  readonly employeeCount: Scalars['String']['output'];
  readonly headquarters: Scalars['String']['output'];
  readonly id: Scalars['ID']['output'];
  readonly legalName: Scalars['String']['output'];
  readonly onboarding?: Maybe<VendorOnboarding>;
  readonly priceRange: Scalars['String']['output'];
  readonly productCategories: ReadonlyArray<Scalars['String']['output']>;
  readonly rejectionReason?: Maybe<Scalars['String']['output']>;
  readonly riskAssessment?: Maybe<Scalars['JSON']['output']>;
  readonly riskLevel?: Maybe<RiskLevel>;
  readonly skuCount: Scalars['String']['output'];
  readonly slaDeadline?: Maybe<Scalars['DateTime']['output']>;
  readonly status: ApplicationStatus;
  readonly submittedAt: Scalars['DateTime']['output'];
  readonly targetMarket: ReadonlyArray<Scalars['String']['output']>;
  readonly updatedAt: Scalars['DateTime']['output'];
  readonly values: ReadonlyArray<VendorValue>;
  readonly website: Scalars['String']['output'];
  readonly whyJade: Scalars['String']['output'];
  readonly yearFounded: Scalars['Int']['output'];
};

export type VendorApplicationResult = {
  readonly __typename: 'VendorApplicationResult';
  readonly application?: Maybe<VendorApplication>;
  readonly errors?: Maybe<ReadonlyArray<VendorPortalError>>;
  readonly success: Scalars['Boolean']['output'];
};

export type VendorCertification = {
  readonly __typename: 'VendorCertification';
  readonly certificateNumber?: Maybe<Scalars['String']['output']>;
  readonly documentUrl: Scalars['String']['output'];
  readonly expirationDate?: Maybe<Scalars['DateTime']['output']>;
  readonly id: Scalars['ID']['output'];
  readonly issuingBody: Scalars['String']['output'];
  readonly rejectionReason?: Maybe<Scalars['String']['output']>;
  readonly slaDeadline?: Maybe<Scalars['DateTime']['output']>;
  readonly submittedAt: Scalars['DateTime']['output'];
  readonly type: CertificationType;
  readonly verificationStatus: CertificationStatus;
  readonly verifiedAt?: Maybe<Scalars['DateTime']['output']>;
  readonly verifiedBy?: Maybe<Scalars['String']['output']>;
};

export type VendorDashboardMetrics = {
  readonly __typename: 'VendorDashboardMetrics';
  readonly dateRange: DateRange;
  readonly impressions: ImpressionMetrics;
  readonly orders: OrderMetrics;
  readonly ordersTimeSeries: ReadonlyArray<TimeSeriesDataPoint>;
  readonly revenue: RevenueMetrics;
  readonly revenueTimeSeries: ReadonlyArray<TimeSeriesDataPoint>;
  readonly spas: SpaMetrics;
  readonly topCustomers: ReadonlyArray<SpaVendorRelationship>;
  readonly topProducts: ReadonlyArray<ProductPerformance>;
};

export type VendorOnboarding = {
  readonly __typename: 'VendorOnboarding';
  readonly applicationId: Scalars['ID']['output'];
  readonly completedAt?: Maybe<Scalars['DateTime']['output']>;
  readonly completedSteps: Scalars['Int']['output'];
  readonly createdAt: Scalars['DateTime']['output'];
  readonly id: Scalars['ID']['output'];
  readonly percentComplete: Scalars['Int']['output'];
  readonly requiredStepsRemaining: Scalars['Int']['output'];
  readonly startedAt?: Maybe<Scalars['DateTime']['output']>;
  readonly steps: ReadonlyArray<OnboardingStep>;
  readonly successManagerEmail?: Maybe<Scalars['String']['output']>;
  readonly successManagerName?: Maybe<Scalars['String']['output']>;
  readonly targetCompletionDate?: Maybe<Scalars['DateTime']['output']>;
  readonly totalSteps: Scalars['Int']['output'];
  readonly updatedAt: Scalars['DateTime']['output'];
};

export type VendorOrder = {
  readonly __typename: 'VendorOrder';
  readonly conversationId?: Maybe<Scalars['ID']['output']>;
  readonly createdAt: Scalars['DateTime']['output'];
  readonly fulfillment?: Maybe<FulfillmentInfo>;
  readonly id: Scalars['ID']['output'];
  readonly items: ReadonlyArray<OrderItem>;
  readonly orderNumber: Scalars['String']['output'];
  readonly shipping: Scalars['Float']['output'];
  readonly shippingAddress: Address;
  readonly spaContact: SpaContact;
  readonly spaId: Scalars['ID']['output'];
  readonly spaName: Scalars['String']['output'];
  readonly status: OrderStatus;
  readonly statusHistory: ReadonlyArray<StatusChange>;
  readonly subtotal: Scalars['Float']['output'];
  readonly tax: Scalars['Float']['output'];
  readonly total: Scalars['Float']['output'];
  readonly updatedAt: Scalars['DateTime']['output'];
};

export type VendorOrderConnection = {
  readonly __typename: 'VendorOrderConnection';
  readonly edges: ReadonlyArray<VendorOrderEdge>;
  readonly pageInfo: PageInfo;
  readonly totalCount: Scalars['Int']['output'];
};

export type VendorOrderEdge = {
  readonly __typename: 'VendorOrderEdge';
  readonly cursor: Scalars['String']['output'];
  readonly node: VendorOrder;
};

/** Vendor Organization */
export type VendorOrganization = {
  readonly __typename: 'VendorOrganization';
  readonly address: Address;
  readonly approvalStatus: ApprovalStatus;
  readonly approvedAt?: Maybe<Scalars['DateTime']['output']>;
  readonly businessLicense: BusinessLicense;
  readonly certifications: ReadonlyArray<Certification>;
  readonly companyName: Scalars['String']['output'];
  readonly contactEmail: Scalars['String']['output'];
  readonly contactPhone?: Maybe<Scalars['String']['output']>;
  readonly createdAt: Scalars['DateTime']['output'];
  readonly displayName: Scalars['String']['output'];
  readonly fulfillmentSettings: FulfillmentSettings;
  readonly id: Scalars['ID']['output'];
  readonly insurance: InsuranceInfo;
  readonly isActive: Scalars['Boolean']['output'];
  readonly products: ReadonlyArray<Product>;
  readonly qualityScore: Scalars['Float']['output'];
  readonly updatedAt: Scalars['DateTime']['output'];
};

export type VendorOrganizationConnection = {
  readonly __typename: 'VendorOrganizationConnection';
  readonly edges: ReadonlyArray<VendorOrganizationEdge>;
  readonly pageInfo: PageInfo;
  readonly totalCount: Scalars['Int']['output'];
};

export type VendorOrganizationEdge = {
  readonly __typename: 'VendorOrganizationEdge';
  readonly cursor: Scalars['String']['output'];
  readonly node: VendorOrganization;
};

export type VendorOrganizationResult = {
  readonly __typename: 'VendorOrganizationResult';
  readonly errors?: Maybe<ReadonlyArray<Error>>;
  readonly success: Scalars['Boolean']['output'];
  readonly vendorOrganization?: Maybe<VendorOrganization>;
};

export type VendorPortalError = {
  readonly __typename: 'VendorPortalError';
  readonly code: VendorPortalErrorCode;
  readonly field?: Maybe<Scalars['String']['output']>;
  readonly message: Scalars['String']['output'];
};

export enum VendorPortalErrorCode {
  APPLICATION_NOT_FOUND = 'APPLICATION_NOT_FOUND',
  CANNOT_SKIP_REQUIRED_STEP = 'CANNOT_SKIP_REQUIRED_STEP',
  CERTIFICATION_NOT_FOUND = 'CERTIFICATION_NOT_FOUND',
  DUPLICATE_APPLICATION = 'DUPLICATE_APPLICATION',
  DUPLICATE_CERTIFICATION = 'DUPLICATE_CERTIFICATION',
  EXPIRED_CERTIFICATION = 'EXPIRED_CERTIFICATION',
  FORBIDDEN = 'FORBIDDEN',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  INVALID_APPLICATION_STATUS = 'INVALID_APPLICATION_STATUS',
  INVALID_BRAND_NAME = 'INVALID_BRAND_NAME',
  INVALID_CERTIFICATION_TYPE = 'INVALID_CERTIFICATION_TYPE',
  INVALID_COLOR = 'INVALID_COLOR',
  INVALID_DOCUMENT_URL = 'INVALID_DOCUMENT_URL',
  INVALID_EMAIL = 'INVALID_EMAIL',
  INVALID_URL = 'INVALID_URL',
  INVALID_YEAR = 'INVALID_YEAR',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  ONBOARDING_NOT_FOUND = 'ONBOARDING_NOT_FOUND',
  PROFILE_ALREADY_EXISTS = 'PROFILE_ALREADY_EXISTS',
  PROFILE_NOT_FOUND = 'PROFILE_NOT_FOUND',
  SLA_BREACH = 'SLA_BREACH',
  STEP_ALREADY_COMPLETED = 'STEP_ALREADY_COMPLETED',
  STEP_NOT_FOUND = 'STEP_NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  VALIDATION_ERROR = 'VALIDATION_ERROR'
}

export type VendorProfile = {
  readonly __typename: 'VendorProfile';
  readonly brandColorPrimary?: Maybe<Scalars['String']['output']>;
  readonly brandColorSecondary?: Maybe<Scalars['String']['output']>;
  readonly brandName: Scalars['String']['output'];
  readonly brandVideoUrl?: Maybe<Scalars['String']['output']>;
  readonly certifications: ReadonlyArray<VendorCertification>;
  readonly completenessScore: Scalars['Int']['output'];
  readonly createdAt: Scalars['DateTime']['output'];
  readonly foundedYear?: Maybe<Scalars['Int']['output']>;
  readonly founderStory?: Maybe<Scalars['String']['output']>;
  readonly galleryImages?: Maybe<ReadonlyArray<Scalars['String']['output']>>;
  readonly headquarters?: Maybe<Scalars['String']['output']>;
  readonly heroImageUrl?: Maybe<Scalars['String']['output']>;
  readonly id: Scalars['ID']['output'];
  readonly logoUrl?: Maybe<Scalars['String']['output']>;
  readonly missionStatement?: Maybe<Scalars['String']['output']>;
  readonly socialLinks?: Maybe<SocialLinks>;
  readonly tagline?: Maybe<Scalars['String']['output']>;
  readonly teamSize?: Maybe<TeamSize>;
  readonly updatedAt: Scalars['DateTime']['output'];
  readonly values: ReadonlyArray<VendorValue>;
  readonly vendorId: Scalars['ID']['output'];
  readonly websiteUrl?: Maybe<Scalars['String']['output']>;
};

export type VendorProfileResult = {
  readonly __typename: 'VendorProfileResult';
  readonly errors?: Maybe<ReadonlyArray<VendorPortalError>>;
  readonly profile?: Maybe<VendorProfile>;
  readonly success: Scalars['Boolean']['output'];
};

/**
 * Vendor Values - Searchable attributes (25 total)
 * Categories: Ingredient Philosophy (8), Sustainability (6), Founder Identity (6), Specialization (5)
 */
export enum VendorValue {
  BIPOC_OWNED = 'BIPOC_OWNED',
  CARBON_NEUTRAL = 'CARBON_NEUTRAL',
  CLEAN_BEAUTY = 'CLEAN_BEAUTY',
  CLINICAL_RESULTS = 'CLINICAL_RESULTS',
  CRUELTY_FREE = 'CRUELTY_FREE',
  DERMATOLOGIST_TESTED = 'DERMATOLOGIST_TESTED',
  ECO_PACKAGING = 'ECO_PACKAGING',
  ESTHETICIAN_DEVELOPED = 'ESTHETICIAN_DEVELOPED',
  FAMILY_OWNED = 'FAMILY_OWNED',
  FRAGRANCE_FREE = 'FRAGRANCE_FREE',
  LGBTQ_OWNED = 'LGBTQ_OWNED',
  MEDICAL_GRADE = 'MEDICAL_GRADE',
  NATURAL = 'NATURAL',
  ORGANIC = 'ORGANIC',
  PARABEN_FREE = 'PARABEN_FREE',
  PROFESSIONAL_ONLY = 'PROFESSIONAL_ONLY',
  REEF_SAFE = 'REEF_SAFE',
  REFILLABLE = 'REFILLABLE',
  SMALL_BATCH = 'SMALL_BATCH',
  SULFATE_FREE = 'SULFATE_FREE',
  SUSTAINABLE = 'SUSTAINABLE',
  VEGAN = 'VEGAN',
  VETERAN_OWNED = 'VETERAN_OWNED',
  WOMAN_FOUNDED = 'WOMAN_FOUNDED',
  ZERO_WASTE = 'ZERO_WASTE'
}

/** Why Explanation - causal path with evidence */
export type WhyExplanation = {
  readonly __typename: 'WhyExplanation';
  readonly confidenceScore: Scalars['Float']['output'];
  readonly disclosureContent: DisclosureContent;
  readonly evidenceStrength: Scalars['Float']['output'];
  readonly path: ReadonlyArray<CausalPathStep>;
  readonly summary: Scalars['String']['output'];
};
