/**
 * Community Page - Spa-ce Sanctuary
 *
 * Main community hub with discussions, events, and trending topics
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import {
  BookOpen,
  MessageSquare,
  HelpCircle,
  FileText,
  Briefcase,
  Calendar,
  TrendingUp,
  Users,
  Plus,
  Search,
  Filter,
  ChevronRight,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@jade/ui/components';
import { Button } from '@jade/ui/components';
import { Badge } from '../../components/ui/badge';
import { Input } from '@jade/ui/components';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Skeleton } from '../../components/ui/skeleton';
import { PostCard } from '../../components/community/PostCard';
import { EventCard } from '../../components/community/EventCard';

// GraphQL Queries
const GET_COMMUNITY_POSTS = gql`
  query GetCommunityPosts(
    $category: String
    $postType: PostType
    $limit: Int
    $offset: Int
    $sortBy: PostSortOption
  ) {
    communityPosts(
      category: $category
      postType: $postType
      limit: $limit
      offset: $offset
      sortBy: $sortBy
    ) {
      items {
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
        createdAt
        hasLiked
        author {
          id
          displayName
          profileImageUrl
          isVerified
        }
      }
      totalCount
      hasMore
    }
  }
`;

const GET_FEATURED_POSTS = gql`
  query GetFeaturedPosts($limit: Int) {
    featuredPosts(limit: $limit) {
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

const GET_TRENDING_TOPICS = gql`
  query GetTrendingTopics($limit: Int) {
    trendingTopics(limit: $limit) {
      name
      postCount
    }
  }
`;

const GET_UPCOMING_EVENTS = gql`
  query GetUpcomingEvents($limit: Int) {
    communityEvents(upcoming: true, limit: $limit) {
      items {
        id
        title
        description
        eventType
        format
        location
        startTime
        endTime
        maxAttendees
        priceCents
        attendeeCount
        isRegistered
        status
        organizer {
          id
          displayName
          profileImageUrl
          isVerified
        }
      }
      totalCount
    }
  }
`;

const GET_TOP_CONTRIBUTORS = gql`
  query GetTopContributors($limit: Int) {
    topContributors(limit: $limit) {
      id
      displayName
      profileImageUrl
      isVerified
      reputationScore
      expertiseAreas
    }
  }
`;

const categories = [
  { id: 'all', label: 'All', icon: BookOpen },
  { id: 'treatment-protocols', label: 'Treatment Protocols', icon: FileText },
  { id: 'ingredient-science', label: 'Ingredient Science', icon: Sparkles },
  { id: 'client-management', label: 'Client Management', icon: Users },
  { id: 'business-marketing', label: 'Business & Marketing', icon: TrendingUp },
  { id: 'products-brands', label: 'Products & Brands', icon: Briefcase },
];

const postTypes = [
  { id: 'all', label: 'All Posts', icon: BookOpen },
  { id: 'DISCUSSION', label: 'Discussions', icon: MessageSquare },
  { id: 'QUESTION', label: 'Questions', icon: HelpCircle },
  { id: 'ARTICLE', label: 'Articles', icon: FileText },
  { id: 'CASE_STUDY', label: 'Case Studies', icon: Briefcase },
];

export const CommunityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('feed');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPostType, setSelectedPostType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Queries
  const {
    data: postsData,
    loading: postsLoading,
    error: postsError,
  } = useQuery(GET_COMMUNITY_POSTS, {
    variables: {
      category: selectedCategory === 'all' ? null : selectedCategory,
      postType: selectedPostType === 'all' ? null : selectedPostType,
      limit: 10,
      offset: 0,
      sortBy: 'NEWEST',
    },
  });

  const { data: featuredData, loading: featuredLoading } = useQuery(GET_FEATURED_POSTS, {
    variables: { limit: 3 },
  });

  const { data: trendingData, loading: trendingLoading } = useQuery(GET_TRENDING_TOPICS, {
    variables: { limit: 10 },
  });

  const { data: eventsData, loading: eventsLoading } = useQuery(GET_UPCOMING_EVENTS, {
    variables: { limit: 5 },
  });

  const { data: contributorsData, loading: contributorsLoading } = useQuery(GET_TOP_CONTRIBUTORS, {
    variables: { limit: 5 },
  });

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-[#8B9A6B]/10 to-background py-12 border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-[#8B9A6B]/20 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-[#8B9A6B]" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Spa-ce Sanctuary</h1>
                  <p className="text-muted-foreground">
                    Connect, learn, and grow with skincare professionals
                  </p>
                </div>
              </div>
            </div>
            <Button className="rounded-xl" asChild>
              <Link to="/app/sanctuary/create-post">
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Categories & Filters */}
          <div className="hidden lg:block space-y-6">
            {/* Categories */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Categories</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-1">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    const isActive = selectedCategory === category.id;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                          isActive
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {category.label}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Trending Topics */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Trending Topics
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {trendingLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Skeleton key={i} className="h-6 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {trendingData?.trendingTopics?.map(
                      (topic: { name: string; postCount: number }) => (
                        <button
                          key={topic.name}
                          onClick={() => setSearchQuery(topic.name)}
                          className="w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm hover:bg-muted transition-colors"
                        >
                          <span className="text-primary">#{topic.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {topic.postCount} posts
                          </span>
                        </button>
                      )
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Top Contributors */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Top Contributors
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {contributorsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {contributorsData?.topContributors?.map(
                      (contributor: {
                        id: string;
                        displayName: string;
                        profileImageUrl?: string;
                        isVerified: boolean;
                        reputationScore: number;
                      }) => (
                        <Link
                          key={contributor.id}
                          to={`/app/sanctuary/member/${contributor.id}`}
                          className="flex items-center gap-2 hover:bg-muted p-1.5 rounded-lg transition-colors"
                        >
                          <Avatar className="h-8 w-8">
                            {contributor.profileImageUrl && (
                              <AvatarImage src={contributor.profileImageUrl} />
                            )}
                            <AvatarFallback className="text-xs bg-primary/10 text-primary">
                              {getInitials(contributor.displayName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-medium truncate">
                                {contributor.displayName}
                              </span>
                              {contributor.isVerified && (
                                <CheckCircle className="h-3 w-3 text-primary fill-primary/20 flex-shrink-0" />
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {contributor.reputationScore.toLocaleString()} rep
                            </span>
                          </div>
                        </Link>
                      )
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search discussions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                {postTypes.slice(0, 4).map((type) => {
                  const Icon = type.icon;
                  const isActive = selectedPostType === type.id;
                  return (
                    <Button
                      key={type.id}
                      variant={isActive ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedPostType(type.id)}
                      className="hidden sm:flex"
                    >
                      <Icon className="h-4 w-4 mr-1" />
                      {type.label.split(' ')[0]}
                    </Button>
                  );
                })}
                <Button variant="outline" size="sm" className="sm:hidden">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full justify-start">
                <TabsTrigger value="feed">Latest</TabsTrigger>
                <TabsTrigger value="featured">Featured</TabsTrigger>
                <TabsTrigger value="popular">Popular</TabsTrigger>
              </TabsList>

              <TabsContent value="feed" className="mt-4 space-y-4">
                {postsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Card key={i}>
                        <CardContent className="p-5">
                          <div className="space-y-3">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-16 w-full" />
                            <div className="flex justify-between">
                              <Skeleton className="h-8 w-32" />
                              <Skeleton className="h-8 w-24" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : postsError ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-muted-foreground">Unable to load posts. Please try again later.</p>
                    </CardContent>
                  </Card>
                ) : postsData?.communityPosts?.items?.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No posts yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Be the first to start a discussion!
                      </p>
                      <Button asChild>
                        <Link to="/app/sanctuary/create-post">
                          <Plus className="h-4 w-4 mr-2" />
                          Create Post
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {postsData?.communityPosts?.items?.map((post: any) => (
                      <PostCard
                        key={post.id}
                        id={post.id}
                        title={post.title}
                        content={post.content}
                        postType={post.postType}
                        category={post.category}
                        tags={post.tags}
                        author={post.author}
                        viewCount={post.viewCount}
                        likeCount={post.likeCount}
                        commentCount={post.commentCount}
                        isPinned={post.isPinned}
                        isFeatured={post.isFeatured}
                        createdAt={post.createdAt}
                        hasLiked={post.hasLiked}
                      />
                    ))}
                    {postsData?.communityPosts?.hasMore && (
                      <div className="text-center pt-4">
                        <Button variant="outline">Load More</Button>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="featured" className="mt-4 space-y-4">
                {featuredLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Card key={i}>
                        <CardContent className="p-5">
                          <Skeleton className="h-32 w-full" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {featuredData?.featuredPosts?.map((post: any) => (
                      <PostCard
                        key={post.id}
                        id={post.id}
                        title={post.title}
                        content={post.content}
                        postType={post.postType}
                        category={post.category}
                        tags={post.tags}
                        author={post.author}
                        viewCount={post.viewCount}
                        likeCount={post.likeCount}
                        commentCount={post.commentCount}
                        isPinned={post.isPinned}
                        isFeatured={post.isFeatured}
                        createdAt={post.createdAt}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="popular" className="mt-4 space-y-4">
                <Card>
                  <CardContent className="p-8 text-center">
                    <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Popular Posts</h3>
                    <p className="text-muted-foreground">
                      Coming soon - see the most engaged discussions from the community.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar - Events */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    Upcoming Events
                  </CardTitle>
                  <Link
                    to="/app/sanctuary/events"
                    className="text-xs text-primary hover:underline flex items-center"
                  >
                    View All
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                {eventsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : eventsData?.communityEvents?.items?.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No upcoming events
                  </p>
                ) : (
                  <div className="space-y-4">
                    {eventsData?.communityEvents?.items?.slice(0, 3).map((event: any) => (
                      <EventCard
                        key={event.id}
                        id={event.id}
                        title={event.title}
                        description={event.description}
                        eventType={event.eventType}
                        format={event.format}
                        location={event.location}
                        startTime={event.startTime}
                        endTime={event.endTime}
                        maxAttendees={event.maxAttendees}
                        priceCents={event.priceCents}
                        attendeeCount={event.attendeeCount}
                        isRegistered={event.isRegistered}
                        status={event.status}
                        organizer={event.organizer}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/app/sanctuary/create-post">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Start a Discussion
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/app/sanctuary/create-post?type=question">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Ask a Question
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/app/sanctuary/events">
                    <Calendar className="h-4 w-4 mr-2" />
                    Browse Events
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Community Stats */}
            <Card className="bg-gradient-to-br from-[#8B9A6B]/10 to-transparent">
              <CardContent className="p-5">
                <h3 className="font-medium mb-4">Community Stats</h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {postsData?.communityPosts?.totalCount || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Discussions</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {eventsData?.communityEvents?.totalCount || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Events</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
