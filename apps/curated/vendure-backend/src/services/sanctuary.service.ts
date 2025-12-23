/**
 * Spa-ce Sanctuary Community Service
 *
 * Core business logic for the community platform:
 * - Member management
 * - Posts and comments
 * - Events and registrations
 * - Reputation system
 */

import { AppDataSource } from '../config/database';

// Database row types
export interface SanctuaryMemberRow {
  id: string;
  user_id: string | null;
  display_name: string;
  bio: string | null;
  expertise_areas: string[] | null;
  certifications: string[] | null;
  years_experience: number | null;
  profile_image_url: string | null;
  is_verified: boolean;
  reputation_score: number;
  joined_at: Date;
  last_active_at: Date | null;
}

export interface CommunityPostRow {
  id: string;
  member_id: string;
  title: string;
  content: string;
  post_type: string;
  category: string | null;
  tags: string[] | null;
  ska_atom_ids: string[] | null;
  view_count: number;
  like_count: number;
  comment_count: number;
  is_pinned: boolean;
  is_featured: boolean;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export interface CommunityCommentRow {
  id: string;
  post_id: string;
  member_id: string;
  parent_comment_id: string | null;
  content: string;
  like_count: number;
  is_accepted_answer: boolean;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export interface CommunityEventRow {
  id: string;
  organizer_id: string;
  title: string;
  description: string | null;
  event_type: string;
  format: string;
  location: string | null;
  virtual_link: string | null;
  start_time: Date;
  end_time: Date | null;
  max_attendees: number | null;
  registration_deadline: Date | null;
  price_cents: number;
  ska_topic_ids: string[] | null;
  status: string;
  created_at: Date;
  updated_at: Date;
}

// Convert database rows to GraphQL types
export function memberToGraphQL(row: SanctuaryMemberRow) {
  return {
    id: row.id,
    userId: row.user_id,
    displayName: row.display_name,
    bio: row.bio,
    expertiseAreas: row.expertise_areas || [],
    certifications: row.certifications || [],
    yearsExperience: row.years_experience,
    profileImageUrl: row.profile_image_url,
    isVerified: row.is_verified,
    reputationScore: row.reputation_score,
    joinedAt: row.joined_at,
    lastActiveAt: row.last_active_at,
  };
}

export function postToGraphQL(row: CommunityPostRow) {
  return {
    id: row.id,
    memberId: row.member_id,
    title: row.title,
    content: row.content,
    postType: row.post_type.toUpperCase(),
    category: row.category,
    tags: row.tags || [],
    skaAtomIds: row.ska_atom_ids || [],
    viewCount: row.view_count,
    likeCount: row.like_count,
    commentCount: row.comment_count,
    isPinned: row.is_pinned,
    isFeatured: row.is_featured,
    status: row.status.toUpperCase(),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function commentToGraphQL(row: CommunityCommentRow) {
  return {
    id: row.id,
    postId: row.post_id,
    memberId: row.member_id,
    parentCommentId: row.parent_comment_id,
    content: row.content,
    likeCount: row.like_count,
    isAcceptedAnswer: row.is_accepted_answer,
    status: row.status.toUpperCase(),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function eventToGraphQL(row: CommunityEventRow) {
  return {
    id: row.id,
    organizerId: row.organizer_id,
    title: row.title,
    description: row.description,
    eventType: row.event_type.toUpperCase(),
    format: row.format.toUpperCase(),
    location: row.location,
    virtualLink: row.virtual_link,
    startTime: row.start_time,
    endTime: row.end_time,
    maxAttendees: row.max_attendees,
    registrationDeadline: row.registration_deadline,
    priceCents: row.price_cents,
    skaTopicIds: row.ska_topic_ids || [],
    status: row.status.toUpperCase(),
    createdAt: row.created_at,
  };
}

// ==========================================
// Member Operations
// ==========================================

export async function getMemberById(id: string) {
  const result = await AppDataSource.query(
    'SELECT * FROM jade.sanctuary_member WHERE id = $1',
    [id]
  );
  const rows = result as SanctuaryMemberRow[];
  return rows[0] ? memberToGraphQL(rows[0]) : null;
}

export async function getMemberByUserId(userId: string) {
  const result = await AppDataSource.query(
    'SELECT * FROM jade.sanctuary_member WHERE user_id = $1',
    [userId]
  );
  const rows = result as SanctuaryMemberRow[];
  return rows[0] ? memberToGraphQL(rows[0]) : null;
}

export async function getOrCreateMember(userId: string, displayName: string) {
  // Try to find existing member
  let result = await AppDataSource.query(
    'SELECT * FROM jade.sanctuary_member WHERE user_id = $1',
    [userId]
  );
  let rows = result as SanctuaryMemberRow[];

  if (rows[0]) {
    return memberToGraphQL(rows[0]);
  }

  // Create new member
  result = await AppDataSource.query(
    `INSERT INTO jade.sanctuary_member (user_id, display_name)
     VALUES ($1, $2)
     RETURNING *`,
    [userId, displayName]
  );
  rows = result as SanctuaryMemberRow[];
  return memberToGraphQL(rows[0]);
}

export async function updateMemberProfile(
  memberId: string,
  input: {
    displayName?: string;
    bio?: string;
    expertiseAreas?: string[];
    certifications?: string[];
    yearsExperience?: number;
    profileImageUrl?: string;
  }
) {
  const updates: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  if (input.displayName !== undefined) {
    updates.push(`display_name = $${paramIndex++}`);
    params.push(input.displayName);
  }
  if (input.bio !== undefined) {
    updates.push(`bio = $${paramIndex++}`);
    params.push(input.bio);
  }
  if (input.expertiseAreas !== undefined) {
    updates.push(`expertise_areas = $${paramIndex++}`);
    params.push(input.expertiseAreas);
  }
  if (input.certifications !== undefined) {
    updates.push(`certifications = $${paramIndex++}`);
    params.push(input.certifications);
  }
  if (input.yearsExperience !== undefined) {
    updates.push(`years_experience = $${paramIndex++}`);
    params.push(input.yearsExperience);
  }
  if (input.profileImageUrl !== undefined) {
    updates.push(`profile_image_url = $${paramIndex++}`);
    params.push(input.profileImageUrl);
  }

  if (updates.length === 0) {
    return getMemberById(memberId);
  }

  params.push(memberId);
  const result = await AppDataSource.query(
    `UPDATE jade.sanctuary_member SET ${updates.join(', ')}, last_active_at = NOW()
     WHERE id = $${paramIndex}
     RETURNING *`,
    params
  );
  const rows = result as SanctuaryMemberRow[];
  return rows[0] ? memberToGraphQL(rows[0]) : null;
}

export async function getTopContributors(limit: number = 10) {
  const result = await AppDataSource.query(
    `SELECT * FROM jade.sanctuary_member
     ORDER BY reputation_score DESC
     LIMIT $1`,
    [limit]
  );
  return (result as SanctuaryMemberRow[]).map(memberToGraphQL);
}

export async function getMemberPostCount(memberId: string): Promise<number> {
  const result = await AppDataSource.query(
    `SELECT COUNT(*) FROM jade.community_post WHERE member_id = $1 AND status = 'published'`,
    [memberId]
  );
  return parseInt((result as [{ count: string }])[0].count, 10);
}

export async function getMemberCommentCount(memberId: string): Promise<number> {
  const result = await AppDataSource.query(
    `SELECT COUNT(*) FROM jade.community_comment WHERE member_id = $1 AND status = 'published'`,
    [memberId]
  );
  return parseInt((result as [{ count: string }])[0].count, 10);
}

// ==========================================
// Post Operations
// ==========================================

export interface PostFilters {
  category?: string;
  postType?: string;
  tags?: string[];
  skaAtomId?: string;
  memberId?: string;
}

export async function getPosts(
  filters: PostFilters = {},
  limit: number = 20,
  offset: number = 0,
  sortBy: string = 'NEWEST'
) {
  const params: unknown[] = [];
  let paramIndex = 1;
  let whereClause = "WHERE status = 'published'";

  if (filters.category) {
    whereClause += ` AND category = $${paramIndex++}`;
    params.push(filters.category);
  }
  if (filters.postType) {
    whereClause += ` AND post_type = $${paramIndex++}`;
    params.push(filters.postType.toLowerCase());
  }
  if (filters.tags?.length) {
    whereClause += ` AND tags && $${paramIndex++}`;
    params.push(filters.tags);
  }
  if (filters.skaAtomId) {
    whereClause += ` AND $${paramIndex++} = ANY(ska_atom_ids)`;
    params.push(filters.skaAtomId);
  }
  if (filters.memberId) {
    whereClause += ` AND member_id = $${paramIndex++}`;
    params.push(filters.memberId);
  }

  // Sort order
  let orderBy = 'created_at DESC';
  switch (sortBy) {
    case 'MOST_LIKED':
      orderBy = 'like_count DESC, created_at DESC';
      break;
    case 'MOST_DISCUSSED':
      orderBy = 'comment_count DESC, created_at DESC';
      break;
    case 'TRENDING':
      // Simple trending: recent posts with high engagement
      orderBy = `(like_count + comment_count * 2) / EXTRACT(EPOCH FROM (NOW() - created_at)) DESC`;
      break;
    default:
      orderBy = 'created_at DESC';
  }

  // Count query
  const countResult = await AppDataSource.query(
    `SELECT COUNT(*) FROM jade.community_post ${whereClause}`,
    params
  );
  const totalCount = parseInt((countResult as [{ count: string }])[0].count, 10);

  // Main query
  params.push(limit);
  params.push(offset);
  const result = await AppDataSource.query(
    `SELECT * FROM jade.community_post ${whereClause}
     ORDER BY is_pinned DESC, ${orderBy}
     LIMIT $${paramIndex++} OFFSET $${paramIndex}`,
    params
  );

  const items = (result as CommunityPostRow[]).map(postToGraphQL);

  return {
    items,
    totalCount,
    hasMore: offset + items.length < totalCount,
  };
}

export async function getPostById(id: string) {
  const result = await AppDataSource.query(
    'SELECT * FROM jade.community_post WHERE id = $1',
    [id]
  );
  const rows = result as CommunityPostRow[];
  return rows[0] ? postToGraphQL(rows[0]) : null;
}

export async function getFeaturedPosts(limit: number = 5) {
  const result = await AppDataSource.query(
    `SELECT * FROM jade.community_post
     WHERE is_featured = true AND status = 'published'
     ORDER BY created_at DESC
     LIMIT $1`,
    [limit]
  );
  return (result as CommunityPostRow[]).map(postToGraphQL);
}

export async function createPost(
  memberId: string,
  input: {
    title: string;
    content: string;
    postType: string;
    category?: string;
    tags?: string[];
    skaAtomIds?: string[];
    status?: string;
  }
) {
  const result = await AppDataSource.query(
    `INSERT INTO jade.community_post (
      member_id, title, content, post_type, category, tags, ska_atom_ids, status
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *`,
    [
      memberId,
      input.title,
      input.content,
      input.postType.toLowerCase(),
      input.category || null,
      input.tags || [],
      input.skaAtomIds || [],
      input.status?.toLowerCase() || 'published',
    ]
  );

  // Update member's last active
  await AppDataSource.query(
    `UPDATE jade.sanctuary_member SET last_active_at = NOW() WHERE id = $1`,
    [memberId]
  );

  // Increment reputation for creating content
  await updateReputation(memberId, 'CREATE_POST');

  return postToGraphQL((result as CommunityPostRow[])[0]);
}

export async function updatePost(
  postId: string,
  memberId: string,
  input: {
    title?: string;
    content?: string;
    category?: string;
    tags?: string[];
    skaAtomIds?: string[];
    status?: string;
  }
) {
  // Verify ownership
  const existing = await AppDataSource.query(
    'SELECT member_id FROM jade.community_post WHERE id = $1',
    [postId]
  );
  if (!(existing as CommunityPostRow[])[0] || (existing as CommunityPostRow[])[0].member_id !== memberId) {
    throw new Error('Not authorized to update this post');
  }

  const updates: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  if (input.title !== undefined) {
    updates.push(`title = $${paramIndex++}`);
    params.push(input.title);
  }
  if (input.content !== undefined) {
    updates.push(`content = $${paramIndex++}`);
    params.push(input.content);
  }
  if (input.category !== undefined) {
    updates.push(`category = $${paramIndex++}`);
    params.push(input.category);
  }
  if (input.tags !== undefined) {
    updates.push(`tags = $${paramIndex++}`);
    params.push(input.tags);
  }
  if (input.skaAtomIds !== undefined) {
    updates.push(`ska_atom_ids = $${paramIndex++}`);
    params.push(input.skaAtomIds);
  }
  if (input.status !== undefined) {
    updates.push(`status = $${paramIndex++}`);
    params.push(input.status.toLowerCase());
  }

  if (updates.length === 0) {
    return getPostById(postId);
  }

  params.push(postId);
  const result = await AppDataSource.query(
    `UPDATE jade.community_post SET ${updates.join(', ')}, updated_at = NOW()
     WHERE id = $${paramIndex}
     RETURNING *`,
    params
  );
  return postToGraphQL((result as CommunityPostRow[])[0]);
}

export async function deletePost(postId: string, memberId: string): Promise<boolean> {
  const result = await AppDataSource.query(
    'DELETE FROM jade.community_post WHERE id = $1 AND member_id = $2',
    [postId, memberId]
  );
  return (result as { rowCount: number }).rowCount === 1;
}

export async function incrementViewCount(postId: string) {
  await AppDataSource.query(
    'UPDATE jade.community_post SET view_count = view_count + 1 WHERE id = $1',
    [postId]
  );
  return getPostById(postId);
}

export async function likePost(postId: string, memberId: string) {
  await AppDataSource.query(
    `INSERT INTO jade.post_like (post_id, member_id)
     VALUES ($1, $2)
     ON CONFLICT DO NOTHING`,
    [postId, memberId]
  );

  // Get post author for reputation
  const post = await AppDataSource.query(
    'SELECT member_id FROM jade.community_post WHERE id = $1',
    [postId]
  );
  if ((post as CommunityPostRow[])[0]) {
    await updateReputation((post as CommunityPostRow[])[0].member_id, 'RECEIVE_LIKE');
  }

  return getPostById(postId);
}

export async function unlikePost(postId: string, memberId: string) {
  await AppDataSource.query(
    'DELETE FROM jade.post_like WHERE post_id = $1 AND member_id = $2',
    [postId, memberId]
  );
  return getPostById(postId);
}

export async function hasLikedPost(postId: string, memberId: string): Promise<boolean> {
  const result = await AppDataSource.query(
    'SELECT 1 FROM jade.post_like WHERE post_id = $1 AND member_id = $2',
    [postId, memberId]
  );
  return (result as unknown[]).length > 0;
}

// ==========================================
// Comment Operations
// ==========================================

export async function getCommentsByPostId(postId: string, limit: number = 50, offset: number = 0) {
  const result = await AppDataSource.query(
    `SELECT * FROM jade.community_comment
     WHERE post_id = $1 AND parent_comment_id IS NULL AND status = 'published'
     ORDER BY is_accepted_answer DESC, created_at ASC
     LIMIT $2 OFFSET $3`,
    [postId, limit, offset]
  );
  return (result as CommunityCommentRow[]).map(commentToGraphQL);
}

export async function getCommentReplies(commentId: string) {
  const result = await AppDataSource.query(
    `SELECT * FROM jade.community_comment
     WHERE parent_comment_id = $1 AND status = 'published'
     ORDER BY created_at ASC`,
    [commentId]
  );
  return (result as CommunityCommentRow[]).map(commentToGraphQL);
}

export async function createComment(
  postId: string,
  memberId: string,
  content: string,
  parentCommentId?: string
) {
  const result = await AppDataSource.query(
    `INSERT INTO jade.community_comment (post_id, member_id, content, parent_comment_id)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [postId, memberId, content, parentCommentId || null]
  );

  // Update member's last active
  await AppDataSource.query(
    `UPDATE jade.sanctuary_member SET last_active_at = NOW() WHERE id = $1`,
    [memberId]
  );

  // Get post author for reputation
  const post = await AppDataSource.query(
    'SELECT member_id FROM jade.community_post WHERE id = $1',
    [postId]
  );
  if ((post as CommunityPostRow[])[0] && (post as CommunityPostRow[])[0].member_id !== memberId) {
    await updateReputation((post as CommunityPostRow[])[0].member_id, 'RECEIVE_COMMENT');
  }

  return commentToGraphQL((result as CommunityCommentRow[])[0]);
}

export async function updateComment(commentId: string, memberId: string, content: string) {
  const result = await AppDataSource.query(
    `UPDATE jade.community_comment SET content = $1, updated_at = NOW()
     WHERE id = $2 AND member_id = $3
     RETURNING *`,
    [content, commentId, memberId]
  );
  const rows = result as CommunityCommentRow[];
  return rows[0] ? commentToGraphQL(rows[0]) : null;
}

export async function deleteComment(commentId: string, memberId: string): Promise<boolean> {
  const result = await AppDataSource.query(
    'DELETE FROM jade.community_comment WHERE id = $1 AND member_id = $2',
    [commentId, memberId]
  );
  return (result as { rowCount: number }).rowCount === 1;
}

export async function likeComment(commentId: string, memberId: string) {
  await AppDataSource.query(
    `INSERT INTO jade.comment_like (comment_id, member_id)
     VALUES ($1, $2)
     ON CONFLICT DO NOTHING`,
    [commentId, memberId]
  );

  const comment = await AppDataSource.query(
    'SELECT * FROM jade.community_comment WHERE id = $1',
    [commentId]
  );
  return (comment as CommunityCommentRow[])[0] ? commentToGraphQL((comment as CommunityCommentRow[])[0]) : null;
}

export async function unlikeComment(commentId: string, memberId: string) {
  await AppDataSource.query(
    'DELETE FROM jade.comment_like WHERE comment_id = $1 AND member_id = $2',
    [commentId, memberId]
  );

  const comment = await AppDataSource.query(
    'SELECT * FROM jade.community_comment WHERE id = $1',
    [commentId]
  );
  return (comment as CommunityCommentRow[])[0] ? commentToGraphQL((comment as CommunityCommentRow[])[0]) : null;
}

export async function hasLikedComment(commentId: string, memberId: string): Promise<boolean> {
  const result = await AppDataSource.query(
    'SELECT 1 FROM jade.comment_like WHERE comment_id = $1 AND member_id = $2',
    [commentId, memberId]
  );
  return (result as unknown[]).length > 0;
}

export async function acceptAnswer(commentId: string, postAuthorId: string) {
  // Get comment and verify post ownership
  const comment = await AppDataSource.query(
    `SELECT c.*, p.member_id as post_author_id
     FROM jade.community_comment c
     JOIN jade.community_post p ON c.post_id = p.id
     WHERE c.id = $1`,
    [commentId]
  );

  if (!(comment as (CommunityCommentRow & { post_author_id: string })[])[0]) {
    throw new Error('Comment not found');
  }

  const commentRow = (comment as (CommunityCommentRow & { post_author_id: string })[])[0];
  if (commentRow.post_author_id !== postAuthorId) {
    throw new Error('Only the post author can accept an answer');
  }

  // Clear any existing accepted answer
  await AppDataSource.query(
    `UPDATE jade.community_comment SET is_accepted_answer = false
     WHERE post_id = $1`,
    [commentRow.post_id]
  );

  // Mark this comment as accepted
  const result = await AppDataSource.query(
    `UPDATE jade.community_comment SET is_accepted_answer = true
     WHERE id = $1
     RETURNING *`,
    [commentId]
  );

  // Award reputation to comment author
  await updateReputation(commentRow.member_id, 'ACCEPTED_ANSWER');

  return commentToGraphQL((result as CommunityCommentRow[])[0]);
}

// ==========================================
// Event Operations
// ==========================================

export async function getEvents(
  filters: { eventType?: string; upcoming?: boolean } = {},
  limit: number = 20,
  offset: number = 0
) {
  const params: unknown[] = [];
  let paramIndex = 1;
  let whereClause = "WHERE status != 'cancelled'";

  if (filters.eventType) {
    whereClause += ` AND event_type = $${paramIndex++}`;
    params.push(filters.eventType.toLowerCase());
  }
  if (filters.upcoming) {
    whereClause += ` AND start_time > NOW()`;
  }

  // Count query
  const countResult = await AppDataSource.query(
    `SELECT COUNT(*) FROM jade.community_event ${whereClause}`,
    params
  );
  const totalCount = parseInt((countResult as [{ count: string }])[0].count, 10);

  // Main query
  params.push(limit);
  params.push(offset);
  const result = await AppDataSource.query(
    `SELECT * FROM jade.community_event ${whereClause}
     ORDER BY start_time ASC
     LIMIT $${paramIndex++} OFFSET $${paramIndex}`,
    params
  );

  const items = (result as CommunityEventRow[]).map(eventToGraphQL);

  return {
    items,
    totalCount,
    hasMore: offset + items.length < totalCount,
  };
}

export async function getEventById(id: string) {
  const result = await AppDataSource.query(
    'SELECT * FROM jade.community_event WHERE id = $1',
    [id]
  );
  const rows = result as CommunityEventRow[];
  return rows[0] ? eventToGraphQL(rows[0]) : null;
}

export async function createEvent(
  organizerId: string,
  input: {
    title: string;
    description?: string;
    eventType: string;
    format: string;
    location?: string;
    virtualLink?: string;
    startTime: Date;
    endTime?: Date;
    maxAttendees?: number;
    registrationDeadline?: Date;
    priceCents?: number;
    skaTopicIds?: string[];
  }
) {
  const result = await AppDataSource.query(
    `INSERT INTO jade.community_event (
      organizer_id, title, description, event_type, format,
      location, virtual_link, start_time, end_time,
      max_attendees, registration_deadline, price_cents, ska_topic_ids
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    RETURNING *`,
    [
      organizerId,
      input.title,
      input.description || null,
      input.eventType.toLowerCase(),
      input.format.toLowerCase(),
      input.location || null,
      input.virtualLink || null,
      input.startTime,
      input.endTime || null,
      input.maxAttendees || null,
      input.registrationDeadline || null,
      input.priceCents || 0,
      input.skaTopicIds || [],
    ]
  );
  return eventToGraphQL((result as CommunityEventRow[])[0]);
}

export async function cancelEvent(eventId: string, organizerId: string) {
  const result = await AppDataSource.query(
    `UPDATE jade.community_event SET status = 'cancelled'
     WHERE id = $1 AND organizer_id = $2
     RETURNING *`,
    [eventId, organizerId]
  );
  const rows = result as CommunityEventRow[];
  return rows[0] ? eventToGraphQL(rows[0]) : null;
}

export async function registerForEvent(eventId: string, memberId: string) {
  // Check if already registered
  const existing = await AppDataSource.query(
    'SELECT 1 FROM jade.event_registration WHERE event_id = $1 AND member_id = $2',
    [eventId, memberId]
  );
  if ((existing as unknown[]).length > 0) {
    return getEventById(eventId);
  }

  // Check capacity
  const event = await AppDataSource.query(
    'SELECT max_attendees FROM jade.community_event WHERE id = $1',
    [eventId]
  );
  const eventRow = (event as CommunityEventRow[])[0];
  if (eventRow?.max_attendees) {
    const countResult = await AppDataSource.query(
      "SELECT COUNT(*) FROM jade.event_registration WHERE event_id = $1 AND status = 'registered'",
      [eventId]
    );
    const currentCount = parseInt((countResult as [{ count: string }])[0].count, 10);
    if (currentCount >= eventRow.max_attendees) {
      throw new Error('Event is at capacity');
    }
  }

  await AppDataSource.query(
    `INSERT INTO jade.event_registration (event_id, member_id)
     VALUES ($1, $2)`,
    [eventId, memberId]
  );

  return getEventById(eventId);
}

export async function cancelRegistration(eventId: string, memberId: string) {
  await AppDataSource.query(
    `UPDATE jade.event_registration SET status = 'cancelled'
     WHERE event_id = $1 AND member_id = $2`,
    [eventId, memberId]
  );
  return getEventById(eventId);
}

export async function getEventAttendeeCount(eventId: string): Promise<number> {
  const result = await AppDataSource.query(
    "SELECT COUNT(*) FROM jade.event_registration WHERE event_id = $1 AND status = 'registered'",
    [eventId]
  );
  return parseInt((result as [{ count: string }])[0].count, 10);
}

export async function isRegisteredForEvent(eventId: string, memberId: string): Promise<boolean> {
  const result = await AppDataSource.query(
    "SELECT 1 FROM jade.event_registration WHERE event_id = $1 AND member_id = $2 AND status = 'registered'",
    [eventId, memberId]
  );
  return (result as unknown[]).length > 0;
}

// ==========================================
// Reputation System
// ==========================================

type ReputationAction =
  | 'CREATE_POST'
  | 'RECEIVE_LIKE'
  | 'RECEIVE_COMMENT'
  | 'ACCEPTED_ANSWER'
  | 'CREATE_EVENT';

const REPUTATION_POINTS: Record<ReputationAction, number> = {
  CREATE_POST: 5,
  RECEIVE_LIKE: 1,
  RECEIVE_COMMENT: 2,
  ACCEPTED_ANSWER: 15,
  CREATE_EVENT: 10,
};

async function updateReputation(memberId: string, action: ReputationAction) {
  const points = REPUTATION_POINTS[action];
  await AppDataSource.query(
    `UPDATE jade.sanctuary_member
     SET reputation_score = reputation_score + $1
     WHERE id = $2`,
    [points, memberId]
  );
}

// ==========================================
// Trending Topics
// ==========================================

export async function getTrendingTopics(limit: number = 10) {
  // Get tags used in recent posts with their counts
  const result = await AppDataSource.query(
    `SELECT unnest(tags) as tag_name, COUNT(*) as post_count
     FROM jade.community_post
     WHERE status = 'published' AND created_at > NOW() - INTERVAL '7 days'
     GROUP BY tag_name
     ORDER BY post_count DESC
     LIMIT $1`,
    [limit]
  );

  return (result as { tag_name: string; post_count: string }[]).map((row) => ({
    name: row.tag_name,
    postCount: parseInt(row.post_count, 10),
    skaAtom: null, // Can be linked to SKA atoms if matching
  }));
}

// ==========================================
// SKA Integration Helpers
// ==========================================

export async function getPostsBySkaAtomId(atomId: string, limit: number = 10) {
  const result = await AppDataSource.query(
    `SELECT * FROM jade.community_post
     WHERE $1 = ANY(ska_atom_ids) AND status = 'published'
     ORDER BY created_at DESC
     LIMIT $2`,
    [atomId, limit]
  );
  return (result as CommunityPostRow[]).map(postToGraphQL);
}

export default {
  getMemberById,
  getMemberByUserId,
  getOrCreateMember,
  updateMemberProfile,
  getTopContributors,
  getMemberPostCount,
  getMemberCommentCount,
  getPosts,
  getPostById,
  getFeaturedPosts,
  createPost,
  updatePost,
  deletePost,
  incrementViewCount,
  likePost,
  unlikePost,
  hasLikedPost,
  getCommentsByPostId,
  getCommentReplies,
  createComment,
  updateComment,
  deleteComment,
  likeComment,
  unlikeComment,
  hasLikedComment,
  acceptAnswer,
  getEvents,
  getEventById,
  createEvent,
  cancelEvent,
  registerForEvent,
  cancelRegistration,
  getEventAttendeeCount,
  isRegisteredForEvent,
  getTrendingTopics,
  getPostsBySkaAtomId,
};
