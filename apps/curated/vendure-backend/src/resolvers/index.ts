/**
 * GraphQL Resolvers Index
 *
 * Combines all resolver modules
 */

import { authResolvers } from './auth.resolver';
import { productResolvers } from './product.resolver';
import { organizationResolvers } from './organization.resolver';
import { appointmentResolvers } from './appointment.resolver';
import { taxonomyResolvers } from './taxonomy.resolver';
// TODO: Re-enable when vendor.graphql is merged with vendor-portal.graphql
// import {
//   vendorQueryResolvers,
//   vendorMutationResolvers,
//   vendorFieldResolvers,
// } from './vendor.resolver';
import {
  vendorPortalQueryResolvers,
  vendorPortalMutationResolvers,
} from './vendor-portal';
import {
  skaQueryResolvers,
  skaMutationResolvers,
  skaFieldResolvers,
} from './ska.resolver';
import {
  sanctuaryQueryResolvers,
  sanctuaryMutationResolvers,
  sanctuaryFieldResolvers,
} from './sanctuary.resolver';
import { analyticsResolvers } from './analytics.resolver';
import { skincareSearchResolvers } from './skincare-search.resolver';
import { userSettingsResolvers } from './user-settings.resolver';
import {
  intelligenceQueryResolvers,
  intelligenceMutationResolvers,
  intelligenceFieldResolvers,
} from './intelligence.resolver';
// TODO: Re-enable when governance.graphql schema issues are fixed
// import {
//   governanceQueryResolvers,
//   governanceMutationResolvers,
//   governanceFieldResolvers,
// } from './governance.resolver';

export const resolvers = {
  Query: {
    ...authResolvers.Query,
    ...productResolvers.Query,
    ...organizationResolvers.Query,
    ...appointmentResolvers.Query,
    ...taxonomyResolvers.Query,
    // ...vendorQueryResolvers, // TODO: Re-enable when vendor.graphql is merged
    ...vendorPortalQueryResolvers, // Feature 011: Vendor Portal
    ...skaQueryResolvers,
    ...sanctuaryQueryResolvers,
    ...analyticsResolvers.Query,
    ...skincareSearchResolvers.Query,
    ...userSettingsResolvers.Query,
    ...intelligenceQueryResolvers,
    // ...governanceQueryResolvers, // TODO: Re-enable when governance.graphql is fixed
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...productResolvers.Mutation,
    ...organizationResolvers.Mutation,
    ...appointmentResolvers.Mutation,
    ...taxonomyResolvers.Mutation,
    // ...vendorMutationResolvers, // TODO: Re-enable when vendor.graphql is merged
    ...vendorPortalMutationResolvers, // Feature 011: Vendor Portal
    ...skaMutationResolvers,
    ...sanctuaryMutationResolvers,
    ...analyticsResolvers.Mutation,
    ...userSettingsResolvers.Mutation,
    ...intelligenceMutationResolvers,
    // ...governanceMutationResolvers, // TODO: Re-enable when governance.graphql is fixed
  },
  // Field resolvers
  ProductCategory: taxonomyResolvers.ProductCategory,
  ProductTaxonomy: taxonomyResolvers.ProductTaxonomy,
  // VendorProfile: vendorFieldResolvers.VendorProfile, // TODO: Re-enable when vendor.graphql is merged
  SkincarePillar: skaFieldResolvers.SkincarePillar,
  // Merge SKA and Intelligence field resolvers for SkincareAtom
  SkincareAtom: {
    ...skaFieldResolvers.SkincareAtom,
    ...intelligenceFieldResolvers.SkincareAtom,
  },
  SanctuaryMember: sanctuaryFieldResolvers.SanctuaryMember,
  CommunityPost: sanctuaryFieldResolvers.CommunityPost,
  CommunityComment: sanctuaryFieldResolvers.CommunityComment,
  CommunityEvent: sanctuaryFieldResolvers.CommunityEvent,
  TrendingTopic: sanctuaryFieldResolvers.TrendingTopic,
  // Analytics field resolvers
  DashboardMetric: analyticsResolvers.DashboardMetric,
  TrendInsight: analyticsResolvers.TrendInsight,
  AnomalyInsight: analyticsResolvers.AnomalyInsight,
  PredictiveInsight: analyticsResolvers.PredictiveInsight,
  ActionableRecommendation: analyticsResolvers.ActionableRecommendation,
  BusinessAlert: analyticsResolvers.BusinessAlert,
  // Governance field resolvers
  // AIIncident: governanceFieldResolvers.AIIncident, // TODO: Re-enable when governance.graphql is fixed
};
