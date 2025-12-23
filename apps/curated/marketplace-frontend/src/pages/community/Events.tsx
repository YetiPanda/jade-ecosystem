/**
 * Events Page
 *
 * Community events calendar and list view
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, gql } from '@apollo/client';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  List,
  Grid3X3,
  Video,
  MapPin,
  Globe,
  Presentation,
  Users2,
  Filter,
  Search,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/Input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Skeleton } from '../../components/ui/skeleton';
import { EventCard } from '../../components/community/EventCard';

// GraphQL
const GET_EVENTS = gql`
  query GetCommunityEvents($eventType: EventType, $upcoming: Boolean, $limit: Int, $offset: Int) {
    communityEvents(eventType: $eventType, upcoming: $upcoming, limit: $limit, offset: $offset) {
      items {
        id
        title
        description
        eventType
        format
        location
        virtualLink
        startTime
        endTime
        maxAttendees
        registrationDeadline
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
      hasMore
    }
  }
`;

const REGISTER_FOR_EVENT = gql`
  mutation RegisterForEvent($eventId: ID!) {
    registerForEvent(eventId: $eventId) {
      id
      attendeeCount
      isRegistered
    }
  }
`;

const eventTypeConfig = {
  WORKSHOP: { icon: Presentation, label: 'Workshop', color: '#2E8B57' },
  WEBINAR: { icon: Video, label: 'Webinar', color: '#006994' },
  MEETUP: { icon: Users2, label: 'Meetup', color: '#6B5B95' },
  CONFERENCE: { icon: Globe, label: 'Conference', color: '#8B4513' },
};

export const EventsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showPast, setShowPast] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { data, loading, error, refetch } = useQuery(GET_EVENTS, {
    variables: {
      eventType: selectedType === 'all' ? null : selectedType,
      upcoming: !showPast,
      limit: 50,
      offset: 0,
    },
  });

  const [registerForEvent] = useMutation(REGISTER_FOR_EVENT);

  const events = data?.communityEvents?.items || [];

  const handleRegister = async (eventId: string) => {
    try {
      await registerForEvent({ variables: { eventId } });
      refetch();
    } catch (err) {
      console.error('Failed to register:', err);
    }
  };

  // Calendar helpers
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDay = (day: Date) => {
    return events.filter((event: any) => isSameDay(new Date(event.startTime), day));
  };

  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-b from-[#8B9A6B]/10 to-background py-12 border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-[#8B9A6B]/20 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-[#8B9A6B]" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Community Events</h1>
                  <p className="text-muted-foreground">
                    Workshops, webinars, and networking opportunities
                  </p>
                </div>
              </div>
            </div>
            <Button className="rounded-xl" disabled>
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters & Controls */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>

            {/* Type Filter */}
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Event Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="WORKSHOP">Workshops</SelectItem>
                <SelectItem value="WEBINAR">Webinars</SelectItem>
                <SelectItem value="MEETUP">Meetups</SelectItem>
                <SelectItem value="CONFERENCE">Conferences</SelectItem>
              </SelectContent>
            </Select>

            {/* Past/Upcoming Toggle */}
            <Button
              variant={showPast ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowPast(!showPast)}
            >
              {showPast ? 'Past Events' : 'Upcoming'}
            </Button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4 mr-1" />
              List
            </Button>
            <Button
              variant={viewMode === 'calendar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('calendar')}
            >
              <Grid3X3 className="h-4 w-4 mr-1" />
              Calendar
            </Button>
          </div>
        </div>

        {/* Event Type Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {Object.entries(eventTypeConfig).map(([type, config]) => {
            const Icon = config.icon;
            const count = events.filter((e: any) => e.eventType === type).length;
            return (
              <Card
                key={type}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedType === type ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedType(selectedType === type ? 'all' : type)}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${config.color}20` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: config.color }} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{count}</div>
                    <div className="text-xs text-muted-foreground">{config.label}s</div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Content */}
        {viewMode === 'list' ? (
          /* List View */
          <div className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-5">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-4" />
                      <Skeleton className="h-20 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">Unable to load events. Please try again later.</p>
                </CardContent>
              </Card>
            ) : events.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No events found</h3>
                  <p className="text-muted-foreground">
                    {showPast
                      ? 'No past events match your criteria.'
                      : 'No upcoming events scheduled. Check back soon!'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              events
                .filter((event: any) =>
                  searchQuery
                    ? event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      event.description?.toLowerCase().includes(searchQuery.toLowerCase())
                    : true
                )
                .map((event: any) => (
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
                    registrationDeadline={event.registrationDeadline}
                    priceCents={event.priceCents}
                    attendeeCount={event.attendeeCount}
                    isRegistered={event.isRegistered}
                    status={event.status}
                    organizer={event.organizer}
                    onRegister={() => handleRegister(event.id)}
                  />
                ))
            )}
          </div>
        ) : (
          /* Calendar View */
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{format(currentMonth, 'MMMM yyyy')}</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={previousMonth}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentMonth(new Date())}
                  >
                    Today
                  </Button>
                  <Button variant="outline" size="sm" onClick={nextMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-px bg-muted rounded-lg overflow-hidden">
                {/* Day Headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div
                    key={day}
                    className="bg-muted-foreground/5 p-2 text-center text-sm font-medium"
                  >
                    {day}
                  </div>
                ))}

                {/* Calendar Days */}
                {daysInMonth.map((day) => {
                  const dayEvents = getEventsForDay(day);
                  const isToday = isSameDay(day, new Date());

                  return (
                    <div
                      key={day.toISOString()}
                      className={`bg-background min-h-[100px] p-2 ${
                        !isSameMonth(day, currentMonth) ? 'opacity-50' : ''
                      }`}
                    >
                      <div
                        className={`text-sm mb-1 ${
                          isToday
                            ? 'bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center'
                            : ''
                        }`}
                      >
                        {format(day, 'd')}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map((event: any) => {
                          const config =
                            eventTypeConfig[event.eventType as keyof typeof eventTypeConfig];
                          return (
                            <Link
                              key={event.id}
                              to={`/app/sanctuary/event/${event.id}`}
                              className="block text-xs p-1 rounded truncate hover:bg-muted"
                              style={{
                                backgroundColor: `${config?.color || '#666'}15`,
                                color: config?.color || '#666',
                              }}
                            >
                              {format(new Date(event.startTime), 'h:mm a')} {event.title}
                            </Link>
                          );
                        })}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-muted-foreground text-center">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Load More */}
        {data?.communityEvents?.hasMore && viewMode === 'list' && (
          <div className="text-center mt-6">
            <Button variant="outline">Load More Events</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
