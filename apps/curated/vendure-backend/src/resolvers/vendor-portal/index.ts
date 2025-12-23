/**
 * Vendor Portal Resolvers Index
 * Feature 011: Vendor Portal MVP
 *
 * Exports all vendor portal resolvers
 */

import { vendorDashboard, discoveryAnalytics } from './dashboard.resolver';
import { updateOrderStatus, addShippingInfo } from './order.resolver';
import {
  vendorProfile,
  updateVendorProfile,
  addCertification,
  removeCertification,
} from './profile.resolver';
import {
  vendorConversations,
  conversation,
  conversationMessages,
  vendorUnreadCount,
  createConversation,
  sendMessage,
  markConversationAsRead,
  archiveConversation,
  flagMessage,
} from './messaging.resolver';
import {
  vendorApplication,
  adminVendorApplications,
  submitVendorApplication,
  reviewVendorApplication,
  assignApplicationReviewer,
} from './application.resolver';
import {
  vendorCampaigns,
  vendorCampaign,
  campaignPerformanceSummary,
  createCampaign,
  updateCampaign,
  updateCampaignMetrics,
  deleteCampaign,
} from './marketing.resolver';

export const vendorPortalQueryResolvers = {
  vendorDashboard,
  discoveryAnalytics, // Sprint D.1: Discovery Analytics
  vendorProfile, // Sprint B.3
  // Messaging (Sprint C.1)
  vendorConversations,
  conversation,
  conversationMessages,
  vendorUnreadCount,
  // Application (Sprint E.2: Admin Tools)
  vendorApplication,
  adminVendorApplications,
  // Marketing Analytics Integration
  vendorCampaigns,
  vendorCampaign,
  campaignPerformanceSummary,
};

export const vendorPortalMutationResolvers = {
  // Order Management (Sprint B.4)
  updateOrderStatus,
  addShippingInfo,
  // Profile Management (Sprint B.3)
  updateVendorProfile,
  addCertification,
  removeCertification,
  // Messaging (Sprint C.1)
  createConversation,
  sendMessage,
  markConversationAsRead,
  archiveConversation,
  flagMessage,
  // Application & Onboarding (Sprint E.2: Admin Tools)
  submitVendorApplication,
  reviewVendorApplication,
  assignApplicationReviewer,
  // Marketing Analytics Integration
  createCampaign,
  updateCampaign,
  updateCampaignMetrics,
  deleteCampaign,
};

export const vendorPortalFieldResolvers = {
  // TODO: Add field resolvers if needed
};
