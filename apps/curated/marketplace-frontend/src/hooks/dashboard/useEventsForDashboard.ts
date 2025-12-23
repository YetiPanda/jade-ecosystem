import { useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { toast } from 'sonner';

/**
 * Dashboard Event Type
 */
export interface DashboardEvent {
  id: string;
  title: string;
  description: string;
  type: 'training' | 'webinar' | 'conference' | 'product-launch' | 'workshop';
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  startDate: Date;
  endDate: Date;
  location: string;
  isVirtual: boolean;
  maxAttendees: number;
  currentAttendees: number;
  registrationDeadline: Date;
  price: number;
  instructor?: string;
  imageUrl?: string;
}

export interface EventFilters {
  type?: string;
  status?: string;
  searchTerm?: string;
}

const GET_EVENTS_FOR_DASHBOARD = gql`
  query GetEventsForDashboard($filters: EventFilters) {
    events(filters: $filters) {
      id
      title
      description
      type
      status
      startDate
      endDate
      location
      isVirtual
      maxAttendees
      currentAttendees
      registrationDeadline
      price
      instructor
      imageUrl
    }
  }
`;

const CREATE_EVENT = gql`
  mutation CreateEvent($input: CreateEventInput!) {
    createEvent(input: $input) {
      id
      title
      status
    }
  }
`;

const UPDATE_EVENT = gql`
  mutation UpdateEvent($id: ID!, $input: UpdateEventInput!) {
    updateEvent(id: $id, input: $input) {
      id
      title
      status
    }
  }
`;

const DELETE_EVENT = gql`
  mutation DeleteEvent($id: ID!) {
    deleteEvent(id: $id) {
      success
      message
    }
  }
`;

/**
 * Generate mock events for development
 */
function generateMockEvents(): DashboardEvent[] {
  const now = new Date();

  return [
    {
      id: '1',
      title: 'Advanced HydraFacial Techniques',
      description: 'Master advanced techniques for HydraFacial treatments, including customization for different skin types.',
      type: 'training',
      status: 'upcoming',
      startDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      endDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), // 4 hours later
      location: 'Los Angeles, CA',
      isVirtual: false,
      maxAttendees: 25,
      currentAttendees: 18,
      registrationDeadline: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
      price: 495,
      instructor: 'Dr. Sarah Johnson',
    },
    {
      id: '2',
      title: 'Injectable Safety & Best Practices',
      description: 'Comprehensive training on safety protocols and best practices for Botox and dermal filler injections.',
      type: 'webinar',
      status: 'upcoming',
      startDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
      location: 'Virtual',
      isVirtual: true,
      maxAttendees: 100,
      currentAttendees: 67,
      registrationDeadline: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
      price: 149,
      instructor: 'Dr. Michael Chen',
    },
    {
      id: '3',
      title: 'Medical Spa Business Summit 2025',
      description: 'Annual conference covering business strategies, marketing, and growth for medical spa owners.',
      type: 'conference',
      status: 'upcoming',
      startDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 32 * 24 * 60 * 60 * 1000),
      location: 'Las Vegas, NV',
      isVirtual: false,
      maxAttendees: 500,
      currentAttendees: 324,
      registrationDeadline: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000),
      price: 1295,
    },
    {
      id: '4',
      title: 'New Product Line Introduction',
      description: 'Virtual launch event for our new organic skincare product line.',
      type: 'product-launch',
      status: 'completed',
      startDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000),
      location: 'Virtual',
      isVirtual: true,
      maxAttendees: 200,
      currentAttendees: 156,
      registrationDeadline: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
      price: 0,
    },
  ];
}

/**
 * Hook to fetch and transform events data
 */
export function useEventsForDashboard(filters?: EventFilters) {
  const { data, loading, error, refetch } = useQuery(GET_EVENTS_FOR_DASHBOARD, {
    variables: { filters: filters || {} },
    fetchPolicy: 'cache-and-network',
    // Skip if API not available
    skip: true, // TODO: Change to false when API is ready
  });

  const events = useMemo((): DashboardEvent[] => {
    if (data?.events) {
      return data.events.map((event: any) => ({
        ...event,
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate),
        registrationDeadline: new Date(event.registrationDeadline),
      }));
    }

    // Use mock data for development
    let mockEvents = generateMockEvents();

    // Apply filters
    if (filters?.type && filters.type !== 'all') {
      mockEvents = mockEvents.filter(event => event.type === filters.type);
    }

    if (filters?.status && filters.status !== 'all') {
      mockEvents = mockEvents.filter(event => event.status === filters.status);
    }

    if (filters?.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      mockEvents = mockEvents.filter(
        event =>
          event.title.toLowerCase().includes(term) ||
          event.description.toLowerCase().includes(term)
      );
    }

    return mockEvents;
  }, [data, filters]);

  return {
    events,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook for event mutations
 */
export function useEventMutations() {
  const [createEventMutation, { loading: creating }] = useMutation(CREATE_EVENT);
  const [updateEventMutation, { loading: updating }] = useMutation(UPDATE_EVENT);
  const [deleteEventMutation, { loading: deleting }] = useMutation(DELETE_EVENT);

  const createEvent = async (eventData: Partial<DashboardEvent>) => {
    try {
      const result = await createEventMutation({
        variables: { input: eventData },
        refetchQueries: ['GetEventsForDashboard'],
      });

      toast.success('Event created successfully');
      return result.data?.createEvent;
    } catch (error: any) {
      toast.error(`Failed to create event: ${error.message}`);
      throw error;
    }
  };

  const updateEvent = async (id: string, eventData: Partial<DashboardEvent>) => {
    try {
      const result = await updateEventMutation({
        variables: { id, input: eventData },
        refetchQueries: ['GetEventsForDashboard'],
      });

      toast.success('Event updated successfully');
      return result.data?.updateEvent;
    } catch (error: any) {
      toast.error(`Failed to update event: ${error.message}`);
      throw error;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const result = await deleteEventMutation({
        variables: { id },
        refetchQueries: ['GetEventsForDashboard'],
        update(cache) {
          cache.evict({ id: `Event:${id}` });
          cache.gc();
        },
      });

      toast.success('Event deleted successfully');
      return result.data?.deleteEvent;
    } catch (error: any) {
      toast.error(`Failed to delete event: ${error.message}`);
      throw error;
    }
  };

  return {
    createEvent,
    updateEvent,
    deleteEvent,
    loading: creating || updating || deleting,
  };
}

/**
 * Hook to get event statistics
 */
export function useEventStats() {
  const { events, loading } = useEventsForDashboard();

  const stats = useMemo(() => {
    if (loading || !events.length) {
      return {
        totalEvents: 0,
        upcomingEvents: 0,
        ongoingEvents: 0,
        completedEvents: 0,
        totalRegistrations: 0,
        avgAttendanceRate: 0,
      };
    }

    const totalRegistrations = events.reduce((sum, event) => sum + event.currentAttendees, 0);
    const eventsWithAttendees = events.filter(e => e.maxAttendees > 0);
    const avgAttendanceRate = eventsWithAttendees.length > 0
      ? eventsWithAttendees.reduce((sum, event) =>
          sum + (event.currentAttendees / event.maxAttendees) * 100, 0
        ) / eventsWithAttendees.length
      : 0;

    return {
      totalEvents: events.length,
      upcomingEvents: events.filter(e => e.status === 'upcoming').length,
      ongoingEvents: events.filter(e => e.status === 'ongoing').length,
      completedEvents: events.filter(e => e.status === 'completed').length,
      totalRegistrations,
      avgAttendanceRate,
    };
  }, [events, loading]);

  return { stats, loading };
}
