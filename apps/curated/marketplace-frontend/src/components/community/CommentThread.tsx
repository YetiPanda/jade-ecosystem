/**
 * CommentThread Component
 *
 * Displays a threaded comment with replies
 */

import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import {
  ThumbsUp,
  MessageCircle,
  CheckCircle,
  MoreHorizontal,
  Reply,
  Flag,
  Trash2,
  Award,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export interface CommentAuthor {
  id: string;
  displayName: string;
  profileImageUrl?: string;
  isVerified: boolean;
}

export interface Comment {
  id: string;
  author: CommentAuthor;
  content: string;
  likeCount: number;
  isAcceptedAnswer: boolean;
  createdAt: string;
  updatedAt: string;
  replies: Comment[];
  hasLiked?: boolean;
}

export interface CommentThreadProps {
  comment: Comment;
  postAuthorId?: string;
  isQuestionPost?: boolean;
  onLike?: (commentId: string) => void;
  onUnlike?: (commentId: string) => void;
  onReply?: (commentId: string, content: string) => void;
  onAcceptAnswer?: (commentId: string) => void;
  onDelete?: (commentId: string) => void;
  currentUserId?: string;
  depth?: number;
}

export const CommentThread: React.FC<CommentThreadProps> = ({
  comment,
  postAuthorId,
  isQuestionPost,
  onLike,
  onUnlike,
  onReply,
  onAcceptAnswer,
  onDelete,
  currentUserId,
  depth = 0,
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const maxDepth = 3;
  const isNested = depth > 0;
  const canReply = depth < maxDepth;
  const isOwnComment = currentUserId === comment.author.id;
  const isPostAuthor = currentUserId === postAuthorId;
  const canAcceptAnswer = isQuestionPost && isPostAuthor && !comment.isAcceptedAnswer;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSubmitReply = async () => {
    if (!replyContent.trim() || !onReply) return;
    setIsSubmitting(true);
    try {
      await onReply(comment.id, replyContent);
      setReplyContent('');
      setShowReplyForm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeToggle = () => {
    if (comment.hasLiked) {
      onUnlike?.(comment.id);
    } else {
      onLike?.(comment.id);
    }
  };

  return (
    <div className={`${isNested ? 'ml-8 mt-4' : ''}`}>
      <div
        className={`relative ${
          comment.isAcceptedAnswer
            ? 'bg-green-50 border border-green-200 rounded-lg p-4'
            : isNested
              ? 'border-l-2 border-muted pl-4'
              : ''
        }`}
      >
        {/* Accepted Answer Badge */}
        {comment.isAcceptedAnswer && (
          <div className="absolute -top-3 left-4">
            <Badge className="bg-green-600 text-white">
              <Award className="h-3 w-3 mr-1" />
              Accepted Answer
            </Badge>
          </div>
        )}

        {/* Comment Header */}
        <div className="flex items-start gap-3">
          <Avatar className={`${isNested ? 'h-7 w-7' : 'h-9 w-9'} flex-shrink-0`}>
            {comment.author.profileImageUrl && (
              <AvatarImage src={comment.author.profileImageUrl} />
            )}
            <AvatarFallback
              className={`${isNested ? 'text-xs' : 'text-sm'} bg-primary/10 text-primary`}
            >
              {getInitials(comment.author.displayName)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            {/* Author Info */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`font-medium ${isNested ? 'text-sm' : ''}`}>
                {comment.author.displayName}
              </span>
              {comment.author.isVerified && (
                <CheckCircle className="h-3.5 w-3.5 text-primary fill-primary/20" />
              )}
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
              </span>
            </div>

            {/* Comment Content */}
            <div className={`mt-2 ${isNested ? 'text-sm' : ''} text-foreground whitespace-pre-wrap`}>
              {comment.content}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 mt-3">
              <button
                onClick={handleLikeToggle}
                className={`flex items-center gap-1 text-sm ${
                  comment.hasLiked ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                } transition-colors`}
              >
                <ThumbsUp className={`h-4 w-4 ${comment.hasLiked ? 'fill-current' : ''}`} />
                <span>{comment.likeCount}</span>
              </button>

              {canReply && (
                <button
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Reply className="h-4 w-4" />
                  <span>Reply</span>
                </button>
              )}

              {canAcceptAnswer && (
                <button
                  onClick={() => onAcceptAnswer?.(comment.id)}
                  className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700 transition-colors"
                >
                  <Award className="h-4 w-4" />
                  <span>Accept Answer</span>
                </button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-muted-foreground hover:text-foreground transition-colors">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Flag className="h-4 w-4 mr-2" />
                    Report
                  </DropdownMenuItem>
                  {isOwnComment && (
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => onDelete?.(comment.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Reply Form */}
            {showReplyForm && (
              <div className="mt-4 space-y-3">
                <Textarea
                  placeholder="Write a reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  rows={3}
                  className="text-sm"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleSubmitReply}
                    disabled={!replyContent.trim() || isSubmitting}
                  >
                    {isSubmitting ? 'Posting...' : 'Post Reply'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setShowReplyForm(false);
                      setReplyContent('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4">
          {comment.replies.map((reply) => (
            <CommentThread
              key={reply.id}
              comment={reply}
              postAuthorId={postAuthorId}
              isQuestionPost={isQuestionPost}
              onLike={onLike}
              onUnlike={onUnlike}
              onReply={onReply}
              onAcceptAnswer={onAcceptAnswer}
              onDelete={onDelete}
              currentUserId={currentUserId}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentThread;
