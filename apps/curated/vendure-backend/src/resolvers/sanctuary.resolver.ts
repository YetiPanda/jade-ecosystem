/**
 * Spa-ce Sanctuary GraphQL Resolvers
 *
 * Implements the community platform queries and mutations
 * Based on contracts/sanctuary.graphql schema
 */

import * as sanctuaryService from '../services/sanctuary.service';
import { suggestSkaTopicsForContent } from '../services/sanctuary-ska.service';

// Context type (placeholder - should match your auth context)
export interface RequestContext {
  user?: {
    id: string;
  };
  sanctuaryMemberId?: string;
}

// Helper to get current member ID
async function getCurrentMemberId(context: RequestContext): Promise<string | null> {
  if (context.sanctuaryMemberId) {
    return context.sanctuaryMemberId;
  }
  if (context.user?.id) {
    const member = await sanctuaryService.getMemberByUserId(context.user.id);
    return member?.id || null;
  }
  return null;
}

// Query Resolvers
export const sanctuaryQueryResolvers = {
  // Posts
  async communityPosts(
    _parent: unknown,
    args: {
      category?: string;
      postType?: string;
      tags?: string[];
      skaAtomId?: string;
      limit?: number;
      offset?: number;
      sortBy?: string;
    }
  ) {
    return sanctuaryService.getPosts(
      {
        category: args.category,
        postType: args.postType,
        tags: args.tags,
        skaAtomId: args.skaAtomId,
      },
      args.limit ?? 20,
      args.offset ?? 0,
      args.sortBy ?? 'NEWEST'
    );
  },

  async communityPost(_parent: unknown, args: { id: string }) {
    return sanctuaryService.getPostById(args.id);
  },

  async featuredPosts(_parent: unknown, args: { limit?: number }) {
    return sanctuaryService.getFeaturedPosts(args.limit ?? 5);
  },

  async trendingTopics(_parent: unknown, args: { limit?: number }) {
    return sanctuaryService.getTrendingTopics(args.limit ?? 10);
  },

  // Events
  async communityEvents(
    _parent: unknown,
    args: {
      eventType?: string;
      upcoming?: boolean;
      limit?: number;
      offset?: number;
    }
  ) {
    return sanctuaryService.getEvents(
      {
        eventType: args.eventType,
        upcoming: args.upcoming,
      },
      args.limit ?? 20,
      args.offset ?? 0
    );
  },

  async communityEvent(_parent: unknown, args: { id: string }) {
    return sanctuaryService.getEventById(args.id);
  },

  // Members
  async sanctuaryMember(_parent: unknown, args: { id: string }) {
    return sanctuaryService.getMemberById(args.id);
  },

  async mySanctuaryProfile(
    _parent: unknown,
    _args: unknown,
    context: RequestContext
  ) {
    if (!context.user?.id) {
      return null;
    }
    return sanctuaryService.getMemberByUserId(context.user.id);
  },

  async topContributors(_parent: unknown, args: { limit?: number }) {
    return sanctuaryService.getTopContributors(args.limit ?? 10);
  },

  // SKA Integration
  async suggestedSkaTopics(_parent: unknown, args: { content: string }) {
    return suggestSkaTopicsForContent(args.content);
  },

  async relatedDiscussions(_parent: unknown, args: { skaAtomId: string; limit?: number }) {
    return sanctuaryService.getPostsBySkaAtomId(args.skaAtomId, args.limit ?? 10);
  },
};

// Mutation Resolvers
export const sanctuaryMutationResolvers = {
  // Join Sanctuary (create member profile)
  async joinSanctuary(
    _parent: unknown,
    args: { displayName: string },
    context: RequestContext
  ) {
    if (!context.user?.id) {
      throw new Error('Authentication required');
    }
    return sanctuaryService.getOrCreateMember(context.user.id, args.displayName);
  },

  // Update profile
  async updateSanctuaryProfile(
    _parent: unknown,
    args: {
      input: {
        displayName?: string;
        bio?: string;
        expertiseAreas?: string[];
        certifications?: string[];
        yearsExperience?: number;
        profileImageUrl?: string;
      };
    },
    context: RequestContext
  ) {
    const memberId = await getCurrentMemberId(context);
    if (!memberId) {
      throw new Error('Sanctuary membership required');
    }
    return sanctuaryService.updateMemberProfile(memberId, args.input);
  },

  // Posts
  async createPost(
    _parent: unknown,
    args: {
      input: {
        title: string;
        content: string;
        postType: string;
        category?: string;
        tags?: string[];
        skaAtomIds?: string[];
        status?: string;
      };
    },
    context: RequestContext
  ) {
    const memberId = await getCurrentMemberId(context);
    if (!memberId) {
      throw new Error('Sanctuary membership required');
    }
    return sanctuaryService.createPost(memberId, args.input);
  },

  async updatePost(
    _parent: unknown,
    args: {
      id: string;
      input: {
        title?: string;
        content?: string;
        category?: string;
        tags?: string[];
        skaAtomIds?: string[];
        status?: string;
      };
    },
    context: RequestContext
  ) {
    const memberId = await getCurrentMemberId(context);
    if (!memberId) {
      throw new Error('Sanctuary membership required');
    }
    return sanctuaryService.updatePost(args.id, memberId, args.input);
  },

  async deletePost(
    _parent: unknown,
    args: { id: string },
    context: RequestContext
  ) {
    const memberId = await getCurrentMemberId(context);
    if (!memberId) {
      throw new Error('Sanctuary membership required');
    }
    return sanctuaryService.deletePost(args.id, memberId);
  },

  async likePost(
    _parent: unknown,
    args: { id: string },
    context: RequestContext
  ) {
    const memberId = await getCurrentMemberId(context);
    if (!memberId) {
      throw new Error('Sanctuary membership required');
    }
    return sanctuaryService.likePost(args.id, memberId);
  },

  async unlikePost(
    _parent: unknown,
    args: { id: string },
    context: RequestContext
  ) {
    const memberId = await getCurrentMemberId(context);
    if (!memberId) {
      throw new Error('Sanctuary membership required');
    }
    return sanctuaryService.unlikePost(args.id, memberId);
  },

  async viewPost(_parent: unknown, args: { id: string }) {
    return sanctuaryService.incrementViewCount(args.id);
  },

  // Comments
  async createComment(
    _parent: unknown,
    args: {
      postId: string;
      content: string;
      parentCommentId?: string;
    },
    context: RequestContext
  ) {
    const memberId = await getCurrentMemberId(context);
    if (!memberId) {
      throw new Error('Sanctuary membership required');
    }
    return sanctuaryService.createComment(
      args.postId,
      memberId,
      args.content,
      args.parentCommentId
    );
  },

  async updateComment(
    _parent: unknown,
    args: { id: string; content: string },
    context: RequestContext
  ) {
    const memberId = await getCurrentMemberId(context);
    if (!memberId) {
      throw new Error('Sanctuary membership required');
    }
    return sanctuaryService.updateComment(args.id, memberId, args.content);
  },

  async deleteComment(
    _parent: unknown,
    args: { id: string },
    context: RequestContext
  ) {
    const memberId = await getCurrentMemberId(context);
    if (!memberId) {
      throw new Error('Sanctuary membership required');
    }
    return sanctuaryService.deleteComment(args.id, memberId);
  },

  async likeComment(
    _parent: unknown,
    args: { id: string },
    context: RequestContext
  ) {
    const memberId = await getCurrentMemberId(context);
    if (!memberId) {
      throw new Error('Sanctuary membership required');
    }
    return sanctuaryService.likeComment(args.id, memberId);
  },

  async unlikeComment(
    _parent: unknown,
    args: { id: string },
    context: RequestContext
  ) {
    const memberId = await getCurrentMemberId(context);
    if (!memberId) {
      throw new Error('Sanctuary membership required');
    }
    return sanctuaryService.unlikeComment(args.id, memberId);
  },

  async acceptAnswer(
    _parent: unknown,
    args: { commentId: string },
    context: RequestContext
  ) {
    const memberId = await getCurrentMemberId(context);
    if (!memberId) {
      throw new Error('Sanctuary membership required');
    }
    return sanctuaryService.acceptAnswer(args.commentId, memberId);
  },

  // Events
  async createEvent(
    _parent: unknown,
    args: {
      input: {
        title: string;
        description?: string;
        eventType: string;
        format: string;
        location?: string;
        virtualLink?: string;
        startTime: string;
        endTime?: string;
        maxAttendees?: number;
        registrationDeadline?: string;
        priceCents?: number;
        skaTopicIds?: string[];
      };
    },
    context: RequestContext
  ) {
    const memberId = await getCurrentMemberId(context);
    if (!memberId) {
      throw new Error('Sanctuary membership required');
    }
    return sanctuaryService.createEvent(memberId, {
      ...args.input,
      startTime: new Date(args.input.startTime),
      endTime: args.input.endTime ? new Date(args.input.endTime) : undefined,
      registrationDeadline: args.input.registrationDeadline
        ? new Date(args.input.registrationDeadline)
        : undefined,
    });
  },

  async updateEvent(
    _parent: unknown,
    args: {
      id: string;
      input: {
        title: string;
        description?: string;
        eventType: string;
        format: string;
        location?: string;
        virtualLink?: string;
        startTime: string;
        endTime?: string;
        maxAttendees?: number;
        registrationDeadline?: string;
        priceCents?: number;
        skaTopicIds?: string[];
      };
    },
    context: RequestContext
  ) {
    const memberId = await getCurrentMemberId(context);
    if (!memberId) {
      throw new Error('Sanctuary membership required');
    }
    // TODO: Implement updateEvent in service
    throw new Error('Not implemented');
  },

  async cancelEvent(
    _parent: unknown,
    args: { id: string },
    context: RequestContext
  ) {
    const memberId = await getCurrentMemberId(context);
    if (!memberId) {
      throw new Error('Sanctuary membership required');
    }
    return sanctuaryService.cancelEvent(args.id, memberId);
  },

  async registerForEvent(
    _parent: unknown,
    args: { eventId: string },
    context: RequestContext
  ) {
    const memberId = await getCurrentMemberId(context);
    if (!memberId) {
      throw new Error('Sanctuary membership required');
    }
    return sanctuaryService.registerForEvent(args.eventId, memberId);
  },

  async cancelRegistration(
    _parent: unknown,
    args: { eventId: string },
    context: RequestContext
  ) {
    const memberId = await getCurrentMemberId(context);
    if (!memberId) {
      throw new Error('Sanctuary membership required');
    }
    return sanctuaryService.cancelRegistration(args.eventId, memberId);
  },
};

// Field Resolvers
export const sanctuaryFieldResolvers = {
  SanctuaryMember: {
    async postCount(member: { id: string }) {
      return sanctuaryService.getMemberPostCount(member.id);
    },
    async commentCount(member: { id: string }) {
      return sanctuaryService.getMemberCommentCount(member.id);
    },
  },

  CommunityPost: {
    async author(post: { memberId: string }) {
      return sanctuaryService.getMemberById(post.memberId);
    },
    async comments(post: { id: string }, args: { limit?: number; offset?: number }) {
      return sanctuaryService.getCommentsByPostId(
        post.id,
        args.limit ?? 50,
        args.offset ?? 0
      );
    },
    async hasLiked(
      post: { id: string },
      _args: unknown,
      context: RequestContext
    ) {
      const memberId = await getCurrentMemberId(context);
      if (!memberId) return false;
      return sanctuaryService.hasLikedPost(post.id, memberId);
    },
    async skaAtoms(post: { skaAtomIds: string[] }) {
      // TODO: Fetch SKA atoms by IDs from SKA service
      // For now, return empty array
      return [];
    },
  },

  CommunityComment: {
    async author(comment: { memberId: string }) {
      return sanctuaryService.getMemberById(comment.memberId);
    },
    async replies(comment: { id: string }) {
      return sanctuaryService.getCommentReplies(comment.id);
    },
    async hasLiked(
      comment: { id: string },
      _args: unknown,
      context: RequestContext
    ) {
      const memberId = await getCurrentMemberId(context);
      if (!memberId) return false;
      return sanctuaryService.hasLikedComment(comment.id, memberId);
    },
  },

  CommunityEvent: {
    async organizer(event: { organizerId: string }) {
      return sanctuaryService.getMemberById(event.organizerId);
    },
    async attendeeCount(event: { id: string }) {
      return sanctuaryService.getEventAttendeeCount(event.id);
    },
    async isRegistered(
      event: { id: string },
      _args: unknown,
      context: RequestContext
    ) {
      const memberId = await getCurrentMemberId(context);
      if (!memberId) return false;
      return sanctuaryService.isRegisteredForEvent(event.id, memberId);
    },
    async skaTopics(event: { skaTopicIds: string[] }) {
      // TODO: Fetch SKA atoms by IDs from SKA service
      return [];
    },
  },

  TrendingTopic: {
    async skaAtom(topic: { name: string }) {
      // TODO: Find matching SKA atom by name
      return null;
    },
  },
};
