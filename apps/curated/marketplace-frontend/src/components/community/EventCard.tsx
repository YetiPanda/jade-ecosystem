/**
 * EventCard Component
 *
 * Displays a community event preview
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { format, isAfter, isBefore, addDays } from 'date-fns';
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Users,
  DollarSign,
  CheckCircle,
  Presentation,
  Users2,
  Globe,
  CalendarDays,
} from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/Button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export interface EventOrganizer {
  id: string;
  displayName: string;
  profileImageUrl?: string;
  isVerified: boolean;
}

export interface EventCardProps {
  id: string;
  title: string;
  description?: string;
  eventType: 'WORKSHOP' | 'WEBINAR' | 'MEETUP' | 'CONFERENCE';
  format: 'VIRTUAL' | 'IN_PERSON' | 'HYBRID';
  location?: string;
  virtualLink?: string;
  startTime: string;
  endTime?: string;
  maxAttendees?: number;
  registrationDeadline?: string;
  priceCents: number;
  attendeeCount: number;
  isRegistered?: boolean;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  organizer: EventOrganizer;
  onRegister?: () => void;
}

const eventTypeConfig = {
  WORKSHOP: {
    icon: Presentation,
    label: 'Workshop',
    color: '#2E8B57',
  },
  WEBINAR: {
    icon: Video,
    label: 'Webinar',
    color: '#006994',
  },
  MEETUP: {
    icon: Users2,
    label: 'Meetup',
    color: '#6B5B95',
  },
  CONFERENCE: {
    icon: Globe,
    label: 'Conference',
    color: '#8B4513',
  },
};

const formatConfig = {
  VIRTUAL: {
    icon: Video,
    label: 'Virtual',
    color: '#0077B5',
  },
  IN_PERSON: {
    icon: MapPin,
    label: 'In Person',
    color: '#2E8B57',
  },
  HYBRID: {
    icon: Globe,
    label: 'Hybrid',
    color: '#6B5B95',
  },
};

export const EventCard: React.FC<EventCardProps> = ({
  id,
  title,
  description,
  eventType,
  format: eventFormat,
  location,
  startTime,
  endTime,
  maxAttendees,
  registrationDeadline,
  priceCents,
  attendeeCount,
  isRegistered,
  status,
  organizer,
  onRegister,
}) => {
  const typeConfig = eventTypeConfig[eventType];
  const fmtConfig = formatConfig[eventFormat];
  const TypeIcon = typeConfig.icon;
  const FormatIcon = fmtConfig.icon;

  const startDate = new Date(startTime);
  const now = new Date();
  const isSoon = isAfter(startDate, now) && isBefore(startDate, addDays(now, 7));
  const spotsLeft = maxAttendees ? maxAttendees - attendeeCount : null;
  const isFull = spotsLeft !== null && spotsLeft <= 0;
  const deadlinePassed = registrationDeadline && isAfter(now, new Date(registrationDeadline));

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatPrice = (cents: number) => {
    if (cents === 0) return 'Free';
    return `$${(cents / 100).toFixed(0)}`;
  };

  return (
    <Card
      className={`transition-all duration-200 hover:shadow-md ${
        status === 'CANCELLED' ? 'opacity-60' : ''
      }`}
    >
      <CardContent className="p-5">
        {/* Header: Event Type and Status */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-2">
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
            <Badge
              variant="outline"
              className="text-xs"
              style={{
                borderColor: `${fmtConfig.color}40`,
                color: fmtConfig.color,
              }}
            >
              <FormatIcon className="h-3 w-3 mr-1" />
              {fmtConfig.label}
            </Badge>
            {isSoon && status === 'UPCOMING' && (
              <Badge className="bg-amber-100 text-amber-700 text-xs">Soon</Badge>
            )}
            {status === 'ONGOING' && (
              <Badge className="bg-green-100 text-green-700 text-xs">Live Now</Badge>
            )}
            {status === 'CANCELLED' && (
              <Badge variant="destructive" className="text-xs">
                Cancelled
              </Badge>
            )}
          </div>
          <div className="text-right">
            <span className="text-lg font-bold text-primary">{formatPrice(priceCents)}</span>
          </div>
        </div>

        {/* Title */}
        <Link to={`/app/sanctuary/event/${id}`}>
          <h3 className="text-lg font-semibold text-foreground mb-2 leading-tight hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>

        {/* Description */}
        {description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{description}</p>
        )}

        {/* Event Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground">{format(startDate, 'EEEE, MMMM d, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground">
              {format(startDate, 'h:mm a')}
              {endTime && ` - ${format(new Date(endTime), 'h:mm a')}`}
            </span>
          </div>
          {location && eventFormat !== 'VIRTUAL' && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{location}</span>
            </div>
          )}
        </div>

        {/* Capacity */}
        {maxAttendees && (
          <div className="flex items-center gap-2 text-sm mb-4">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className={`${isFull ? 'text-destructive' : 'text-muted-foreground'}`}>
              {isFull
                ? 'Event is full'
                : `${attendeeCount}/${maxAttendees} registered${
                    spotsLeft && spotsLeft <= 10 ? ` (${spotsLeft} spots left)` : ''
                  }`}
            </span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7">
              {organizer.profileImageUrl && <AvatarImage src={organizer.profileImageUrl} />}
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                {getInitials(organizer.displayName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-1">
              <span className="text-sm text-muted-foreground">Hosted by</span>
              <span className="text-sm font-medium text-foreground">{organizer.displayName}</span>
              {organizer.isVerified && (
                <CheckCircle className="h-3.5 w-3.5 text-primary fill-primary/20" />
              )}
            </div>
          </div>

          {status === 'UPCOMING' && (
            <div>
              {isRegistered ? (
                <Badge className="bg-green-100 text-green-700">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Registered
                </Badge>
              ) : (
                <Button
                  size="sm"
                  disabled={isFull || deadlinePassed || false}
                  onClick={(e) => {
                    e.preventDefault();
                    onRegister?.();
                  }}
                >
                  {isFull
                    ? 'Full'
                    : deadlinePassed
                      ? 'Closed'
                      : priceCents === 0
                        ? 'Register Free'
                        : 'Register'}
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
