import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/Input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Plus, 
  Search, 
  Filter,
  Edit,
  Eye,
  Copy,
  Video,
  Globe,
  Star,
  TrendingUp,
  X,
  Save,
  CheckCircle
} from 'lucide-react';
import { useEventsForDashboard, useEventMutations, useEventStats } from '../../../hooks/dashboard';
import { toast } from 'sonner';

export function EventManagement() {
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Fetch real events data
  const { events: apiEvents, loading, error, refetch } = useEventsForDashboard({
    type: filterType !== 'all' ? filterType : undefined,
    searchTerm: searchTerm || undefined,
  });

  const { stats } = useEventStats();
  const { createEvent, updateEvent, deleteEvent, loading: mutationLoading } = useEventMutations();

  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    type: '',
    format: '',
    date: '',
    time: '',
    duration: '',
    maxAttendees: '',
    price: '',
    location: '',
    materials: '',
    prerequisites: ''
  });

  const events = [
    {
      id: 1,
      title: 'Advanced HydraFacial Techniques',
      description: 'Master advanced HydraFacial protocols for optimal client results and treatment customization.',
      type: 'training',
      format: 'in-person',
      date: '2025-01-15',
      time: '10:00 AM',
      duration: '4 hours',
      location: 'Los Angeles Training Center',
      maxAttendees: 20,
      currentAttendees: 17,
      price: 299,
      instructor: 'Dr. Sarah Chen',
      rating: 4.9,
      reviews: 234,
      status: 'upcoming',
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2070&auto=format&fit=crop'
    },
    {
      id: 2,
      title: 'Chemical Peels Certification Course',
      description: 'Comprehensive certification program covering all levels of chemical peels and safety protocols.',
      type: 'certification',
      format: 'hybrid',
      date: '2025-01-22',
      time: '9:00 AM',
      duration: '8 hours',
      location: 'Virtual + Miami Center',
      maxAttendees: 50,
      currentAttendees: 43,
      price: 599,
      instructor: 'Dr. Michael Rodriguez',
      rating: 4.8,
      reviews: 189,
      status: 'upcoming',
      image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=2070&auto=format&fit=crop'
    },
    {
      id: 3,
      title: 'Business Growth for Medspas',
      description: 'Strategic planning and marketing techniques to scale your medspa business effectively.',
      type: 'business',
      format: 'virtual',
      date: '2025-01-10',
      time: '2:00 PM',
      duration: '3 hours',
      location: 'Online Webinar',
      maxAttendees: 100,
      currentAttendees: 89,
      price: 199,
      instructor: 'Jennifer Walsh',
      rating: 4.7,
      reviews: 156,
      status: 'live',
      image: 'https://images.unsplash.com/photo-1664575602554-2087b04935a5?q=80&w=2070&auto=format&fit=crop'
    },
    {
      id: 4,
      title: 'Injectable Techniques Workshop',
      description: 'Hands-on training for Botox and dermal filler injection techniques with live models.',
      type: 'workshop',
      format: 'in-person',
      date: '2024-12-20',
      time: '1:00 PM',
      duration: '6 hours',
      location: 'New York Training Facility',
      maxAttendees: 15,
      currentAttendees: 15,
      price: 899,
      instructor: 'Dr. Amanda Foster',
      rating: 4.9,
      reviews: 98,
      status: 'completed',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop'
    }
  ];

  const eventTypes = [
    'Training',
    'Certification',
    'Workshop',
    'Webinar',
    'Business',
    'Product Launch'
  ];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || event.type === filterType;
    return matchesSearch && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'text-[#30B7D2] bg-blue-100';
      case 'live': return 'text-[#114538] bg-green-100';
      case 'completed': return 'text-[#958673] bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setNewEvent(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('New event:', newEvent);
    setShowCreateEvent(false);
    setNewEvent({
      title: '',
      description: '',
      type: '',
      format: '',
      date: '',
      time: '',
      duration: '',
      maxAttendees: '',
      price: '',
      location: '',
      materials: '',
      prerequisites: ''
    });
  };

  const totalEvents = events.length;
  const upcomingEvents = events.filter(e => e.status === 'upcoming').length;
  const totalAttendees = events.reduce((sum, e) => sum + e.currentAttendees, 0);
  const avgRating = (events.reduce((sum, e) => sum + e.rating, 0) / events.length).toFixed(1);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light mb-2">Event Management</h1>
          <p className="text-muted-foreground font-light">
            Create and manage training events, workshops, and certifications
          </p>
        </div>
        
        <Button 
          onClick={() => setShowCreateEvent(true)}
          className="rounded-full px-6"
          style={{backgroundColor: '#30B7D2', color: '#ffffff'}}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Create Event Form */}
      {showCreateEvent && (
        <Card className="border-subtle shadow-warm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-normal">Create New Event</CardTitle>
                <CardDescription className="font-light">
                  Set up a training event, workshop, or certification program
                </CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowCreateEvent(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title *</Label>
                  <Input
                    id="title"
                    value={newEvent.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="rounded-full border-subtle"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Event Type *</Label>
                  <Select onValueChange={(value) => handleInputChange('type', value)}>
                    <SelectTrigger className="rounded-full border-subtle">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map((type) => (
                        <SelectItem key={type} value={type.toLowerCase()}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Event Description *</Label>
                <Textarea
                  id="description"
                  value={newEvent.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Detailed description of the event content and objectives..."
                  className="min-h-[100px] border-subtle"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Format</Label>
                  <Select onValueChange={(value) => handleInputChange('format', value)}>
                    <SelectTrigger className="rounded-full border-subtle">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in-person">In-Person</SelectItem>
                      <SelectItem value="virtual">Virtual</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="rounded-full border-subtle"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Start Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    className="rounded-full border-subtle"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    placeholder="e.g., 4 hours"
                    value={newEvent.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    className="rounded-full border-subtle"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxAttendees">Max Attendees</Label>
                  <Input
                    id="maxAttendees"
                    type="number"
                    value={newEvent.maxAttendees}
                    onChange={(e) => handleInputChange('maxAttendees', e.target.value)}
                    className="rounded-full border-subtle"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={newEvent.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className="rounded-full border-subtle"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location/Platform</Label>
                <Input
                  id="location"
                  placeholder="Physical address or online platform"
                  value={newEvent.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="rounded-full border-subtle"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="materials">Required Materials</Label>
                <Textarea
                  id="materials"
                  value={newEvent.materials}
                  onChange={(e) => handleInputChange('materials', e.target.value)}
                  placeholder="List any materials or equipment attendees need to bring..."
                  className="min-h-[80px] border-subtle"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prerequisites">Prerequisites</Label>
                <Textarea
                  id="prerequisites"
                  value={newEvent.prerequisites}
                  onChange={(e) => handleInputChange('prerequisites', e.target.value)}
                  placeholder="Any required certifications or experience..."
                  className="min-h-[80px] border-subtle"
                />
              </div>

              <div className="flex items-center justify-end space-x-4 pt-6">
                <Button type="button" variant="outline" onClick={() => setShowCreateEvent(false)}>
                  Cancel
                </Button>
                <Button type="submit" style={{backgroundColor: '#30B7D2', color: '#ffffff'}}>
                  <Save className="h-4 w-4 mr-2" />
                  Create Event
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-subtle shadow-warm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Total Events
              </CardTitle>
              <Calendar className="h-4 w-4" style={{color: '#30B7D2'}} />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-light">{totalEvents}</div>
            <p className="text-sm text-muted-foreground">{upcomingEvents} upcoming</p>
          </CardContent>
        </Card>

        <Card className="border-subtle shadow-warm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Total Attendees
              </CardTitle>
              <Users className="h-4 w-4" style={{color: '#114538'}} />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-light">{totalAttendees}</div>
            <p className="text-sm text-muted-foreground">All events combined</p>
          </CardContent>
        </Card>

        <Card className="border-subtle shadow-warm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Average Rating
              </CardTitle>
              <Star className="h-4 w-4" style={{color: '#958673'}} />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-light">{avgRating}</div>
            <p className="text-sm text-muted-foreground">Out of 5.0</p>
          </CardContent>
        </Card>

        <Card className="border-subtle shadow-warm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Revenue (YTD)
              </CardTitle>
              <TrendingUp className="h-4 w-4" style={{color: '#2b251c'}} />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-light">$127k</div>
            <p className="text-sm text-muted-foreground">+23% vs last year</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80 rounded-full border-subtle"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40 rounded-full border-subtle">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {eventTypes.map((type) => (
                <SelectItem key={type} value={type.toLowerCase()}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="border-subtle shadow-warm overflow-hidden">
            <div className="aspect-[4/3] bg-accent/30 relative">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3">
                <Badge className={getStatusColor(event.status)}>
                  {event.status === 'upcoming' ? 'Upcoming' : 
                   event.status === 'live' ? 'Live' : 'Completed'}
                </Badge>
              </div>
              <div className="absolute top-3 right-3">
                <Badge variant="outline" className="bg-white/90">
                  {event.format === 'virtual' ? <Video className="h-3 w-3 mr-1" /> : 
                   event.format === 'hybrid' ? <Globe className="h-3 w-3 mr-1" /> : 
                   <MapPin className="h-3 w-3 mr-1" />}
                  {event.format}
                </Badge>
              </div>
            </div>
            
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-lg mb-1">{event.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 fill-current" style={{color: '#958673'}} />
                    <span className="font-medium">{event.rating}</span>
                    <span className="text-muted-foreground">({event.reviews})</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${event.price}</div>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{event.date}</span>
                    <Clock className="h-4 w-4 text-muted-foreground ml-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{event.currentAttendees}/{event.maxAttendees} attendees</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1 rounded-full">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 rounded-full">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}