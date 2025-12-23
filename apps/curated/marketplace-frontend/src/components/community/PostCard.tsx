/**
 * PostCard Component
 *
 * Displays a community post preview in the feed
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import {
  ThumbsUp,
  MessageCircle,
  Eye,
  Pin,
  Star,
  HelpCircle,
  FileText,
  MessageSquare,
  Briefcase,
  CheckCircle,
} from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export interface PostAuthor {
  id: string;
  displayName: string;
  profileImageUrl?: string;
  isVerified: boolean;
}

export interface PostCardProps {
  id: string;
  title: string;
  content: string;
  postType: 'DISCUSSION' | 'QUESTION' | 'ARTICLE' | 'CASE_STUDY';
  category?: string;
  tags: string[];
  author: PostAuthor;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isPinned: boolean;
  isFeatured: boolean;
  createdAt: string;
  hasLiked?: boolean;
  onClick?: () => void;
}

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

export const PostCard: React.FC<PostCardProps> = ({
  id,
  title,
  content,
  postType,
  category,
  tags,
  author,
  viewCount,
  likeCount,
  commentCount,
  isPinned,
  isFeatured,
  createdAt,
  hasLiked,
  onClick,
}) => {
  const typeConfig = postTypeConfig[postType];
  const TypeIcon = typeConfig.icon;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const truncateContent = (text: string, maxLength: number = 200) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
  };

  const plainContent = content
    .replace(/[#*`_\[\]]/g, '')
    .replace(/\n+/g, ' ')
    .trim();

  return (
    <Link to={`/app/sanctuary/post/${id}`} onClick={onClick}>
      <Card
        className={`transition-all duration-200 hover:shadow-md cursor-pointer ${
          isPinned ? 'border-primary/30 bg-primary/5' : ''
        } ${isFeatured ? 'ring-1 ring-amber-400/50' : ''}`}
      >
        <CardContent className="p-5">
          {/* Header: Badges and Meta */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex flex-wrap items-center gap-2">
              {isPinned && (
                <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                  <Pin className="h-3 w-3 mr-1" />
                  Pinned
                </Badge>
              )}
              {isFeatured && (
                <Badge variant="secondary" className="bg-amber-100 text-amber-700 text-xs">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
              <Badge
                variant="outline"
                className="text-xs"
                style={{
                  borderColor: `${typeConfig.color}40`,
                  color: typeConfig.color,
                }}
              >
                <TypeIcon className="h-3 w-3 mr-1" />
                {typeConfig.label}
              </Badge>
              {category && (
                <Badge variant="outline" className="text-xs text-muted-foreground">
                  {category}
                </Badge>
              )}
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-foreground mb-2 leading-tight hover:text-primary transition-colors">
            {title}
          </h3>

          {/* Content Preview */}
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            {truncateContent(plainContent)}
          </p>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                >
                  #{tag}
                </span>
              ))}
              {tags.length > 4 && (
                <span className="text-xs text-muted-foreground">+{tags.length - 4} more</span>
              )}
            </div>
          )}

          {/* Footer: Author and Stats */}
          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center gap-2">
              <Avatar className="h-7 w-7">
                {author.profileImageUrl && <AvatarImage src={author.profileImageUrl} />}
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {getInitials(author.displayName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-foreground">{author.displayName}</span>
                {author.isVerified && (
                  <CheckCircle className="h-3.5 w-3.5 text-primary fill-primary/20" />
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span className="text-xs">{viewCount}</span>
              </div>
              <div className={`flex items-center gap-1 ${hasLiked ? 'text-primary' : ''}`}>
                <ThumbsUp className={`h-4 w-4 ${hasLiked ? 'fill-current' : ''}`} />
                <span className="text-xs">{likeCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                <span className="text-xs">{commentCount}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default PostCard;
