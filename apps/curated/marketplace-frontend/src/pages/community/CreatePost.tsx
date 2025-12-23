/**
 * CreatePost Page
 *
 * Create a new community post with AI-powered SKA topic suggestions
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation, useLazyQuery, gql } from '@apollo/client';
import debounce from 'lodash/debounce';
import {
  ArrowLeft,
  Sparkles,
  X,
  Plus,
  Loader2,
  HelpCircle,
  MessageSquare,
  FileText,
  Briefcase,
  Eye,
  Save,
  Send,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@jade/ui/components';
import { Button } from '@jade/ui/components';
import { Badge } from '../../components/ui/badge';
import { Input } from '@jade/ui/components';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Separator } from '../../components/ui/separator';

// GraphQL
const CREATE_POST = gql`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      id
      title
      postType
      status
    }
  }
`;

const GET_SUGGESTED_TOPICS = gql`
  query GetSuggestedSkaTopics($content: String!) {
    suggestedSkaTopics(content: $content) {
      id
      title
      description
    }
  }
`;

interface SKATopic {
  id: string;
  title: string;
  description?: string;
}

const postTypes = [
  {
    id: 'DISCUSSION',
    label: 'Discussion',
    description: 'Start a conversation with the community',
    icon: MessageSquare,
  },
  {
    id: 'QUESTION',
    label: 'Question',
    description: 'Ask for help or advice',
    icon: HelpCircle,
  },
  {
    id: 'ARTICLE',
    label: 'Article',
    description: 'Share knowledge or insights',
    icon: FileText,
  },
  {
    id: 'CASE_STUDY',
    label: 'Case Study',
    description: 'Document a client case',
    icon: Briefcase,
  },
];

const categories = [
  'Treatment Protocols',
  'Ingredient Science',
  'Client Management',
  'Business & Marketing',
  'Products & Brands',
  'Device & Technology',
  'Education & Training',
  'Industry News',
];

export const CreatePostPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type')?.toUpperCase() || 'DISCUSSION';

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState(initialType);
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [selectedSkaTopics, setSelectedSkaTopics] = useState<SKATopic[]>([]);
  const [status, setStatus] = useState<'draft' | 'published'>('published');
  const [activeTab, setActiveTab] = useState('write');

  // Suggested topics state
  const [suggestedTopics, setSuggestedTopics] = useState<SKATopic[]>([]);
  const [isLoadingTopics, setIsLoadingTopics] = useState(false);

  // GraphQL
  const [createPost, { loading: isSubmitting }] = useMutation(CREATE_POST);
  const [getSuggestedTopics] = useLazyQuery(GET_SUGGESTED_TOPICS, {
    fetchPolicy: 'network-only',
  });

  // Debounced topic suggestion fetch
  const fetchSuggestedTopics = useCallback(
    debounce(async (text: string) => {
      if (text.length < 50) {
        setSuggestedTopics([]);
        return;
      }

      setIsLoadingTopics(true);
      try {
        const { data } = await getSuggestedTopics({
          variables: { content: text },
        });
        if (data?.suggestedSkaTopics) {
          setSuggestedTopics(data.suggestedSkaTopics);
        }
      } catch (err) {
        console.error('Failed to fetch suggested topics:', err);
      } finally {
        setIsLoadingTopics(false);
      }
    }, 1000),
    [getSuggestedTopics]
  );

  // Trigger topic suggestions when content changes
  useEffect(() => {
    const fullContent = `${title} ${content}`;
    fetchSuggestedTopics(fullContent);
  }, [title, content, fetchSuggestedTopics]);

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 5) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleAddSkaTopic = (topic: SKATopic) => {
    if (!selectedSkaTopics.find((t) => t.id === topic.id)) {
      setSelectedSkaTopics([...selectedSkaTopics, topic]);
    }
  };

  const handleRemoveSkaTopic = (topicId: string) => {
    setSelectedSkaTopics(selectedSkaTopics.filter((t) => t.id !== topicId));
  };

  const handleSubmit = async (publishStatus: 'draft' | 'published') => {
    if (!title.trim() || !content.trim()) return;

    try {
      const { data } = await createPost({
        variables: {
          input: {
            title: title.trim(),
            content: content.trim(),
            postType,
            category: category || null,
            tags: tags.length > 0 ? tags : null,
            skaAtomIds: selectedSkaTopics.map((t) => t.id),
            status: publishStatus === 'draft' ? 'DRAFT' : 'PUBLISHED',
          },
        },
      });

      if (data?.createPost?.id) {
        navigate(`/app/sanctuary/post/${data.createPost.id}`);
      }
    } catch (err) {
      console.error('Failed to create post:', err);
    }
  };

  const isValid = title.trim().length >= 10 && content.trim().length >= 50;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate('/app/sanctuary')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Community
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => handleSubmit('draft')}
              disabled={!isValid || isSubmitting}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button onClick={() => handleSubmit('published')} disabled={!isValid || isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Publish
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Post Type Selection */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">What type of post?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {postTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = postType === type.id;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setPostType(type.id)}
                        className={`p-4 rounded-lg border text-center transition-all ${
                          isSelected
                            ? 'border-primary bg-primary/5 ring-1 ring-primary'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <Icon
                          className={`h-6 w-6 mx-auto mb-2 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}
                        />
                        <div className={`text-sm font-medium ${isSelected ? 'text-primary' : ''}`}>
                          {type.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Title & Content */}
            <Card>
              <CardContent className="pt-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="write">Write</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                  </TabsList>

                  <TabsContent value="write" className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        placeholder={
                          postType === 'QUESTION'
                            ? 'What would you like to ask?'
                            : 'Give your post a title'
                        }
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-1.5 text-lg"
                        maxLength={255}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {title.length}/255 characters (min 10)
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="content">Content</Label>
                      <Textarea
                        id="content"
                        placeholder="Share your thoughts, questions, or insights..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="mt-1.5 min-h-[300px]"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {content.length} characters (min 50) - Markdown supported
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="preview">
                    <div className="border rounded-lg p-6 min-h-[400px]">
                      {title ? (
                        <>
                          <h1 className="text-2xl font-bold mb-4">{title}</h1>
                          <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                            {content || (
                              <span className="text-muted-foreground">
                                Start writing to see preview...
                              </span>
                            )}
                          </div>
                        </>
                      ) : (
                        <div className="text-center text-muted-foreground py-12">
                          <Eye className="h-12 w-12 mx-auto mb-3 opacity-50" />
                          <p>Add a title and content to preview your post</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Tags</CardTitle>
                <CardDescription>Add up to 5 tags to help others find your post</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="px-3 py-1">
                      #{tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    disabled={tags.length >= 5}
                  />
                  <Button
                    variant="outline"
                    onClick={handleAddTag}
                    disabled={!tagInput.trim() || tags.length >= 5}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Category */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Category</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat.toLowerCase().replace(/ & /g, '-')}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* AI Topic Suggestions */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  AI-Suggested Topics
                </CardTitle>
                <CardDescription>
                  Link your post to relevant skincare knowledge
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Selected Topics */}
                {selectedSkaTopics.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Selected:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedSkaTopics.map((topic) => (
                        <Badge
                          key={topic.id}
                          className="bg-primary text-primary-foreground"
                        >
                          {topic.title}
                          <button
                            onClick={() => handleRemoveSkaTopic(topic.id)}
                            className="ml-2"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <Separator className="my-4" />
                  </div>
                )}

                {/* Loading State */}
                {isLoadingTopics && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing your content...
                  </div>
                )}

                {/* Suggestions */}
                {!isLoadingTopics && suggestedTopics.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Suggestions:</p>
                    {suggestedTopics
                      .filter((t) => !selectedSkaTopics.find((s) => s.id === t.id))
                      .map((topic) => (
                        <button
                          key={topic.id}
                          onClick={() => handleAddSkaTopic(topic)}
                          className="w-full text-left p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-background transition-all"
                        >
                          <div className="font-medium text-sm">{topic.title}</div>
                          {topic.description && (
                            <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {topic.description}
                            </div>
                          )}
                        </button>
                      ))}
                  </div>
                )}

                {/* Empty State */}
                {!isLoadingTopics && suggestedTopics.length === 0 && content.length < 50 && (
                  <div className="text-sm text-muted-foreground py-4 text-center">
                    <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Write at least 50 characters</p>
                    <p>to see AI topic suggestions</p>
                  </div>
                )}

                {!isLoadingTopics && suggestedTopics.length === 0 && content.length >= 50 && (
                  <div className="text-sm text-muted-foreground py-4 text-center">
                    <p>No matching topics found.</p>
                    <p className="text-xs">Try adding more specific content.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Guidelines */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Posting Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>
                  <span className="font-medium text-foreground">Be respectful.</span> We're all here
                  to learn and grow together.
                </p>
                <p>
                  <span className="font-medium text-foreground">Share knowledge.</span> Back up
                  claims with sources when possible.
                </p>
                <p>
                  <span className="font-medium text-foreground">Stay on topic.</span> Keep
                  discussions relevant to skincare professionals.
                </p>
                <p>
                  <span className="font-medium text-foreground">No promotions.</span> Self-promotion
                  should be relevant and disclosed.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;
