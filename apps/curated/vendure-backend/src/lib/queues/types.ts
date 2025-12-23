/**
 * BullMQ Queue Types and Job Interfaces
 *
 * Defines all queue names and job data structures
 */

export enum QueueName {
  VECTOR_GENERATION = 'vector-generation',
  EMAIL = 'email',
  EXPORT = 'export',
  ANALYTICS = 'analytics',
  ORDER_FULFILLMENT = 'order-fulfillment',
  NOTIFICATION = 'notification',
}

/**
 * Vector Generation Jobs
 */
export interface GenerateTensorJobData {
  productId: string;
  productData: {
    name: string;
    description: string;
    glanceData: any;
    scanData: any;
    studyData?: any;
  };
}

export interface GenerateEmbeddingJobData {
  productId: string;
  text: string;
  textSource: 'name' | 'description' | 'combined';
}

export interface VectorJobResult {
  productId: string;
  success: boolean;
  vector?: number[];
  error?: string;
}

/**
 * Email Jobs
 */
export interface SendEmailJobData {
  to: string;
  from?: string;
  subject: string;
  template: string;
  context: Record<string, any>;
}

export interface EmailJobResult {
  messageId: string;
  success: boolean;
  error?: string;
}

/**
 * Export Jobs
 */
export enum ExportFormat {
  CSV = 'CSV',
  EXCEL = 'EXCEL',
  PDF = 'PDF',
  JSON = 'JSON',
}

export interface ExportJobData {
  userId: string;
  exportType: 'products' | 'orders' | 'clients' | 'appointments';
  format: ExportFormat;
  filters?: Record<string, any>;
  spaOrganizationId?: string;
}

export interface ExportJobResult {
  fileUrl: string;
  fileName: string;
  rowCount: number;
  success: boolean;
  error?: string;
}

/**
 * Analytics Jobs
 */
export interface AnalyticsJobData {
  eventType: string;
  userId?: string;
  spaOrganizationId?: string;
  metadata: Record<string, any>;
  timestamp: Date;
}

export interface CalculateInsightsJobData {
  spaOrganizationId: string;
  dateRange: {
    start: Date;
    end: Date;
  };
  metrics: string[];
}

/**
 * Order Fulfillment Jobs
 */
export interface ProcessFulfillmentJobData {
  orderId: string;
  orderLineIds: string[];
  vendorOrganizationId: string;
}

export interface UpdateTrackingJobData {
  fulfillmentId: string;
  trackingNumber: string;
  carrier: string;
  estimatedDelivery?: Date;
}

export interface FulfillmentJobResult {
  fulfillmentId: string;
  status: string;
  success: boolean;
  error?: string;
}

/**
 * Notification Jobs
 */
export enum NotificationType {
  APPOINTMENT_REMINDER = 'APPOINTMENT_REMINDER',
  ORDER_SHIPPED = 'ORDER_SHIPPED',
  ORDER_DELIVERED = 'ORDER_DELIVERED',
  VENDOR_APPROVAL = 'VENDOR_APPROVAL',
  LOW_STOCK = 'LOW_STOCK',
  REVIEW_REQUEST = 'REVIEW_REQUEST',
}

export interface SendNotificationJobData {
  userId: string;
  type: NotificationType;
  channels: ('email' | 'sms' | 'push')[];
  data: Record<string, any>;
}

export interface NotificationJobResult {
  userId: string;
  sent: ('email' | 'sms' | 'push')[];
  failed: ('email' | 'sms' | 'push')[];
  success: boolean;
  error?: string;
}

/**
 * Job Options
 */
export interface JobOptions {
  priority?: number;
  delay?: number; // milliseconds
  attempts?: number;
  backoff?: {
    type: 'exponential' | 'fixed';
    delay: number;
  };
  removeOnComplete?: boolean | number; // true or keep N jobs
  removeOnFail?: boolean | number;
}

/**
 * Job Progress
 */
export interface JobProgress {
  percentage: number;
  message?: string;
  current?: number;
  total?: number;
}
