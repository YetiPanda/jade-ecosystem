/**
 * PostDetail Page
 *
 * Displays a single community post with comments
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, gql } from '@apollo/client';
import { formatDistanceToNow, format } from 'date-fns';
import {
  ArrowLeft,
  ThumbsUp,
  MessageCircle,
  Eye,
  Share2,
  Bookmark,
  Pin,
  Star,
  HelpCircle,
  FileText,
  MessageSquare,
  Briefcase,
  CheckCircle,
  MoreHorizontal,
  Flag,
  Trash2,
  Edit,
  Link2,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Skeleton } from '../../components/ui/skeleton';
import { Textarea } from '../../components/ui/textarea';
import { Separator } from '../../components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { CommentThread, Comment } from '../../components/community/CommentThread';

// GraphQL Queries & Mutations
const GET_POST = gql`
  query GetCommunityPost($id: ID!) {
    communityPost(id: $id) {
      id
      title
      content
      postType
      category
      tags
      viewCount
      likeCount
      commentCount
      isPinned
      isFeatured
      status
      createdAt
      updatedAt
      hasLiked
      author {
        id
        displayName
        bio
        profileImageUrl
        isVerified
        reputationScore
        expertiseAreas
      }
      comments(limit: 50) {
        id
        content
        likeCount
        isAcceptedAnswer
        createdAt
        updatedAt
        hasLiked
        author {
          id
          displayName
          profileImageUrl
          isVerified
        }
        replies {
          id
          content
          likeCount
          isAcceptedAnswer
          createdAt
          hasLiked
          author {
            id
            displayName
            profileImageUrl
            isVerified
          }
        }
      }
    }
  }
`;

const VIEW_POST = gql`
  mutation ViewPost($id: ID!) {
    viewPost(id: $id) {
      id
      viewCount
    }
  }
`;

const LIKE_POST = gql`
  mutation LikePost($id: ID!) {
    likePost(id: $id) {
      id
      likeCount
      hasLiked
    }
  }
`;

const UNLIKE_POST = gql`
  mutation UnlikePost($id: ID!) {
    unlikePost(id: $id) {
      id
      likeCount
      hasLiked
    }
  }
`;

const CREATE_COMMENT = gql`
  mutation CreateComment($postId: ID!, $content: String!, $parentCommentId: ID) {
    createComment(postId: $postId, content: $content, parentCommentId: $parentCommentId) {
      id
      content
      likeCount
      createdAt
      author {
        id
        displayName
        profileImageUrl
        isVerified
      }
    }
  }
`;

const LIKE_COMMENT = gql`
  mutation LikeComment($id: ID!) {
    likeComment(id: $id) {
      id
      likeCount
      hasLiked
    }
  }
`;

const UNLIKE_COMMENT = gql`
  mutation UnlikeComment($id: ID!) {
    unlikeComment(id: $id) {
      id
      likeCount
      hasLiked
    }
  }
`;

const ACCEPT_ANSWER = gql`
  mutation AcceptAnswer($commentId: ID!) {
    acceptAnswer(commentId: $commentId) {
      id
      isAcceptedAnswer
    }
  }
`;

const postTypeConfig = {
  DISCUSSION: {
    icon: MessageSquare,
    label: 'Discussion',
    color: '#2E8B57',
  },
  QUESTION: {
    icon: HelpCircle,
    label: 'Question',
    color: '#6B5B95',
  },
  ARTICLE: {
    icon: FileText,
    label: 'Article',
    color: '#006994',
  },
  CASE_STUDY: {
    icon: Briefcase,
    label: 'Case Study',
    color: '#8B4513',
  },
};

export const PostDetailPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, loading, error, refetch } = useQuery(GET_POST, {
    variables: { id: postId },
    skip: !postId,
  });

  const [viewPost] = useMutation(VIEW_POST);
  const [likePost] = useMutation(LIKE_POST);
  const [unlikePost] = useMutation(UNLIKE_POST);
  const [createComment] = useMutation(CREATE_COMMENT);
  const [likeComment] = useMutation(LIKE_COMMENT);
  const [unlikeComment] = useMutation(UNLIKE_COMMENT);
  const [acceptAnswer] = useMutation(ACCEPT_ANSWER);

  // Track view on mount
  useEffect(() => {
    if (postId) {
      viewPost({ variables: { id: postId } }).catch(() => {
        // Ignore view tracking errors
      });
    }
  }, [postId, viewPost]);

  const post = data?.communityPost;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLikePost = async () => {
    if (!postId) return;
    try {
      if (post?.hasLiked) {
        await unlikePost({ variables: { id: postId } });
      } else {
        await likePost({ variables: { id: postId } });
      }
      refetch();
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !postId) return;
    setIsSubmitting(true);
    try {
      await createComment({
        variables: { postId, content: newComment },
      });
      setNewComment('');
      refetch();
    } catch (err) {
      console.error('Failed to create comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReplyToComment = async (parentCommentId: string, content: string) => {
    if (!postId) return;
    try {
      await createComment({
        variables: { postId, content, parentCommentId },
      });
      refetch();
    } catch (err) {
      console.error('Failed to reply:', err);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    try {
      await likeComment({ variables: { id: commentId } });
      refetch();
    } catch (err) {
      console.error('Failed to like comment:', err);
    }
  };

  const handleUnlikeComment = async (commentId: string) => {
    try {
      await unlikeComment({ variables: { id: commentId } });
      refetch();
    } catch (err) {
      console.error('Failed to unlike comment:', err);
    }
  };

  const handleAcceptAnswer = async (commentId: string) => {
    try {
      await acceptAnswer({ variables: { commentId } });
      refetch();
    } catch (err) {
      console.error('Failed to accept answer:', err);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-4 w-48 mb-6" />
              <Skeleton className="h-32 w-full mb-6" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Button variant="ghost" onClick={() => navigate('/app/sanctuary')} className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Community
          </Button>
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Post not found</h2>
              <p className="text-muted-foreground mb-4">
                This post may have been deleted or doesn't exist.
              </p>
              <Button asChild>
                <Link to="/app/sanctuary">Return to Community</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const typeConfig = postTypeConfig[post.postType as keyof typeof postTypeConfig];
  const TypeIcon = typeConfig?.icon || MessageSquare;
  const isQuestion = post.postType === 'QUESTION';

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate('/app/sanctuary')} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Community
        </Button>

        {/* Main Post */}
        <Card className="mb-6">
          <CardContent className="p-6">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {post.isPinned && (
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  <Pin className="h-3 w-3 mr-1" />
                  Pinned
                </Badge>
              )}
              {post.isFeatured && (
                <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
              <Badge
                variant="outline"
                style={{
                  borderColor: `${typeConfig?.color || '#666'}40`,
                  color: typeConfig?.color || '#666',
                }}
              >
                <TypeIcon className="h-3 w-3 mr-1" />
                {typeConfig?.label || 'Post'}
              </Badge>
              {post.category && (
                <Badge variant="outline" className="text-muted-foreground">
                  {post.category}
                </Badge>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-foreground mb-4">{post.title}</h1>

            {/* Author & Meta */}
            <div className="flex items-center justify-between mb-6">
              <Link
                to={`/app/sanctuary/member/${post.author.id}`}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <Avatar className="h-10 w-10">
                  {post.author.profileImageUrl && (
                    <AvatarImage src={post.author.profileImageUrl} />
                  )}
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getInitials(post.author.displayName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{post.author.displayName}</span>
                    {post.author.isVerified && (
                      <CheckCircle className="h-4 w-4 text-primary fill-primary/20" />
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {post.author.reputationScore?.toLocaleString()} reputation
                    {post.author.expertiseAreas?.length > 0 && (
                      <span> · {post.author.expertiseAreas[0]}</span>
                    )}
                  </div>
                </div>
              </Link>

              <div className="text-sm text-muted-foreground">
                {format(new Date(post.createdAt), 'MMM d, yyyy')}
                {post.updatedAt !== post.createdAt && ' (edited)'}
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-sm max-w-none mb-6">
              <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                {post.content}
              </div>
            </div>

            {/* Tags */}
            {post.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag: string) => (
                  <Link
                    key={tag}
                    to={`/app/sanctuary?tag=${tag}`}
                    className="text-sm px-3 py-1 rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            <Separator className="my-4" />

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant={post.hasLiked ? 'default' : 'outline'}
                  size="sm"
                  onClick={handleLikePost}
                >
                  <ThumbsUp className={`h-4 w-4 mr-1 ${post.hasLiked ? 'fill-current' : ''}`} />
                  {post.likeCount}
                </Button>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm">{post.commentCount} comments</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  <span className="text-sm">{post.viewCount} views</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Bookmark className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleShare}>
                      <Link2 className="h-4 w-4 mr-2" />
                      Copy Link
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Flag className="h-4 w-4 mr-2" />
                      Report
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comment Form */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <h2 className="text-lg font-semibold">Add a comment</h2>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Share your thoughts..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={4}
              className="mb-3"
            />
            <div className="flex justify-end">
              <Button
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || isSubmitting}
              >
                {isSubmitting ? 'Posting...' : 'Post Comment'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card>
          <CardHeader className="pb-3">
            <h2 className="text-lg font-semibold">
              {post.commentCount} {post.commentCount === 1 ? 'Comment' : 'Comments'}
            </h2>
          </CardHeader>
          <CardContent>
            {post.comments?.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Show accepted answers first for questions */}
                {isQuestion &&
                  post.comments
                    ?.filter((c: Comment) => c.isAcceptedAnswer)
                    .map((comment: Comment) => (
                      <CommentThread
                        key={comment.id}
                        comment={comment}
                        postAuthorId={post.author.id}
                        isQuestionPost={isQuestion}
                        onLike={handleLikeComment}
                        onUnlike={handleUnlikeComment}
                        onReply={handleReplyToComment}
                        onAcceptAnswer={handleAcceptAnswer}
                      />
                    ))}

                {/* Regular comments */}
                {post.comments
                  ?.filter((c: Comment) => !c.isAcceptedAnswer)
                  .map((comment: Comment) => (
                    <CommentThread
                      key={comment.id}
                      comment={comment}
                      postAuthorId={post.author.id}
                      isQuestionPost={isQuestion}
                      onLike={handleLikeComment}
                      onUnlike={handleUnlikeComment}
                      onReply={handleReplyToComment}
                      onAcceptAnswer={handleAcceptAnswer}
                    />
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PostDetailPage;
