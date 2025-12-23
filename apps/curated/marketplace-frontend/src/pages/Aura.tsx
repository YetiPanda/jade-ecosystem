/**
 * Aura by Jade Page
 *
 * Comprehensive spa management analytics dashboard showing business intelligence,
 * marketing performance, appointments, revenue metrics, and recent activity
 */

import React, { useState } from 'react';
import {
  DollarSign,
  Calendar,
  Users,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  Globe,
  Smartphone,
  Mail,
  MessageSquare,
  Star,
  Clock,
  UserPlus,
  Target,
  Bell,
  Download,
  ChevronDown,
  Award,
  Activity,
  Heart,
  ArrowUpRight,
  Gift
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@jade/ui/components';
import { Button } from '@jade/ui/components';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

interface MetricCard {
  title: string;
  value: string;
  change: string;
  period: string;
  isPositive: boolean;
  icon: React.ElementType;
}

interface MarketingChannel {
  id: string;
  name: string;
  roas: string;
  impressions: string;
  clicks: string;
  cost: string;
  ctr: string;
  conversions: number;
  icon: React.ElementType;
}

interface QuickStat {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
}

interface Activity {
  type: string;
  title: string;
  subtitle: string;
  time: string;
  value?: string;
  rating?: number;
  badge?: string;
}

export const AuraPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('7d');

  const metrics: MetricCard[] = [
    {
      title: 'REVENUE',
      value: '$47,830',
      change: '+12.3%',
      period: 'vs last 30 days',
      isPositive: true,
      icon: DollarSign
    },
    {
      title: 'APPOINTMENTS',
      value: '892',
      change: '+8.7%',
      period: 'this month',
      isPositive: true,
      icon: Calendar
    },
    {
      title: 'NEW CLIENTS',
      value: '156',
      change: '+23.1%',
      period: 'this month',
      isPositive: true,
      icon: Users
    },
    {
      title: 'AVG ORDER VALUE',
      value: '$187',
      change: '-2.4%',
      period: 'vs last month',
      isPositive: false,
      icon: ShoppingCart
    }
  ];

  const marketingChannels: MarketingChannel[] = [
    {
      id: 'google-ads',
      name: 'Google Ads',
      roas: '4.2x',
      impressions: '45.2K',
      clicks: '2.1K',
      cost: '$1,250',
      ctr: '4.6%',
      conversions: 89,
      icon: Globe
    },
    {
      id: 'meta-ads',
      name: 'Meta Ads',
      roas: '5.1x',
      impressions: '78.9K',
      clicks: '3.8K',
      cost: '$2,100',
      ctr: '4.8%',
      conversions: 156,
      icon: Smartphone
    },
    {
      id: 'email',
      name: 'Email',
      roas: '8.9x',
      impressions: '12.4K',
      clicks: '1.2K',
      cost: '$89',
      ctr: '9.7%',
      conversions: 67,
      icon: Mail
    },
    {
      id: 'sms',
      name: 'SMS',
      roas: '3.8x',
      impressions: '5.6K',
      clicks: '890',
      cost: '$156',
      ctr: '1.6%',
      conversions: 45,
      icon: MessageSquare
    }
  ];

  const quickStats: QuickStat[] = [
    { label: 'Online Visibility Score', value: '85/100', change: '+5', isPositive: true },
    { label: 'Customer Satisfaction', value: '4.8/5', change: '+0.2', isPositive: true },
    { label: 'Staff Utilization', value: '78%', change: '+3%', isPositive: true },
    { label: 'Rebooking Rate', value: '67%', change: '+8%', isPositive: true }
  ];

  const recentActivity: Activity[] = [
    {
      type: 'appointment',
      title: 'New appointment booked',
      subtitle: 'Sarah Johnson - HydraFacial Express',
      time: '5 minutes ago',
      value: '$150'
    },
    {
      type: 'review',
      title: 'New 5-star review received',
      subtitle: 'Google Reviews - "Amazing experience!"',
      time: '1 hour ago',
      rating: 5
    },
    {
      type: 'campaign',
      title: 'Meta campaign performing well',
      subtitle: 'Holiday Glow Package - 12 new leads',
      time: '2 hours ago',
      badge: '+12 leads'
    },
    {
      type: 'certification',
      title: 'Emily completed certification',
      subtitle: 'Advanced Microneedling Techniques',
      time: '3 hours ago'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-white font-medium">J</span>
                </div>
                <h1 className="text-lg font-normal text-foreground">Aura by Jade</h1>
                <Badge variant="outline" className="ml-2">
                  Analytics
                </Badge>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Download className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="sm" className="rounded-full">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {/* Tab Navigation - Outside main, matches Dashboard layout */}
        <div className="bg-background border-b border-border">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-3">
            <TabsList className="bg-transparent h-auto p-0 border-0 gap-2">
              <TabsTrigger
                value="overview"
                className="rounded-full px-6 py-2 data-[state=active]:bg-muted data-[state=inactive]:bg-transparent"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="business"
                className="rounded-full px-6 py-2 data-[state=active]:bg-muted data-[state=inactive]:bg-transparent"
              >
                Business
              </TabsTrigger>
              <TabsTrigger
                value="marketing"
                className="rounded-full px-6 py-2 data-[state=active]:bg-muted data-[state=inactive]:bg-transparent"
              >
                Marketing
              </TabsTrigger>
              <TabsTrigger
                value="staff"
                className="rounded-full px-6 py-2 data-[state=active]:bg-muted data-[state=inactive]:bg-transparent"
              >
                Staff
              </TabsTrigger>
              <TabsTrigger
                value="customers"
                className="rounded-full px-6 py-2 data-[state=active]:bg-muted data-[state=inactive]:bg-transparent"
              >
                Customers
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
          <TabsContent value="overview" className="space-y-8 mt-0">
            {/* Welcome Section */}
            <div className="text-center">
              <h2 className="text-3xl font-light mb-2">Welcome back, Luxe Spa & Wellness</h2>
              <p className="text-muted-foreground font-light">
                Your comprehensive business intelligence dashboard with insights from all your marketing channels and operational metrics.
              </p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {metrics.map((metric, index) => (
                <Card key={index} className="border-border hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {metric.title}
                      </CardTitle>
                      <metric.icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-3xl font-semibold mb-2">{metric.value}</div>
                    <div className="flex items-center space-x-2 text-sm">
                      <div className={`flex items-center ${metric.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {metric.isPositive ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        <span className="font-medium">{metric.change}</span>
                      </div>
                      <span className="text-muted-foreground">{metric.period}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Marketing Channels Performance */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Marketing Channels Performance</CardTitle>
                    <CardDescription>
                      Real-time data from Google, Meta, Email, and SMS campaigns
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {marketingChannels.map((channel) => (
                        <div key={channel.id} className="border border-border rounded-lg p-5">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <channel.icon className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-sm">{channel.name}</h4>
                                <p className="text-xs text-muted-foreground">ROAS: {channel.roas}</p>
                              </div>
                            </div>
                            <Badge className="bg-primary/10 text-primary border-primary/20">
                              {channel.conversions} conversions
                            </Badge>
                          </div>

                          <div className="grid grid-cols-4 gap-4 text-sm">
                            <div>
                              <div className="text-muted-foreground text-xs mb-1">Impressions</div>
                              <div className="font-semibold">{channel.impressions}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground text-xs mb-1">Clicks</div>
                              <div className="font-semibold">{channel.clicks}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground text-xs mb-1">Cost</div>
                              <div className="font-semibold">{channel.cost}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground text-xs mb-1">CTR</div>
                              <div className="font-semibold">{channel.ctr}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Stats */}
              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                    <CardDescription>
                      Key performance indicators
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-5">
                      {quickStats.map((stat, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">{stat.label}</div>
                            <div className="text-lg font-semibold">{stat.value}</div>
                          </div>
                          <Badge
                            variant="secondary"
                            className={stat.isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
                          >
                            {stat.change}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>
                      Latest updates across all channels
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-start space-x-3 pb-4 border-b border-border last:border-0 last:pb-0">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                            {activity.type === 'appointment' && <Calendar className="h-4 w-4 text-primary" />}
                            {activity.type === 'review' && <Star className="h-4 w-4 text-yellow-500" />}
                            {activity.type === 'campaign' && <Target className="h-4 w-4 text-primary" />}
                            {activity.type === 'certification' && <UserPlus className="h-4 w-4 text-primary" />}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium mb-0.5">{activity.title}</h4>
                            <p className="text-xs text-muted-foreground mb-1">{activity.subtitle}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">{activity.time}</span>
                              {activity.value && (
                                <Badge variant="outline" className="text-xs">
                                  {activity.value}
                                </Badge>
                              )}
                              {activity.rating && (
                                <div className="flex items-center space-x-0.5">
                                  {[...Array(activity.rating)].map((_, i) => (
                                    <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  ))}
                                </div>
                              )}
                              {activity.badge && (
                                <Badge className="text-xs bg-primary/10 text-primary">
                                  {activity.badge}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common tasks and shortcuts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-24 flex flex-col space-y-2">
                    <Calendar className="h-6 w-6" />
                    <span className="text-sm">Book Appointment</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col space-y-2">
                    <UserPlus className="h-6 w-6" />
                    <span className="text-sm">Add Client</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col space-y-2">
                    <Target className="h-6 w-6" />
                    <span className="text-sm">View Campaigns</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col space-y-2">
                    <TrendingUp className="h-6 w-6" />
                    <span className="text-sm">Analytics</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="business" className="space-y-8 mt-0">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold mb-1">Business Metrics</h2>
                <p className="text-sm text-muted-foreground">Real-time operational KPIs and business performance data</p>
              </div>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export Report
              </Button>
            </div>

            {/* Daily Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                      Daily Revenue
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-3xl font-semibold mb-2">$1,594</div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Target: $1,800</span>
                      <span className="font-medium">89%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '89%' }}></div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="mt-3 text-xs">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12% vs yesterday
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                      Appointments Today
                    </CardTitle>
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-3xl font-semibold mb-2">28</div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Target: 32</span>
                      <span className="font-medium">88%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '88%' }}></div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="mt-3 text-xs">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +3 vs yesterday
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                      Staff Utilization
                    </CardTitle>
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-3xl font-semibold mb-2">82%</div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Target: 85%</span>
                      <span className="font-medium">96%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '96%' }}></div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="mt-3 text-xs">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +5% vs yesterday
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                      Avg Service Time
                    </CardTitle>
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-3xl font-semibold mb-2">78 min</div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Target: 75 min</span>
                      <span className="font-medium text-amber-600">104%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-amber-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  <Badge variant="outline" className="mt-3 text-xs border-amber-500 text-amber-700">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    -2 min vs target
                  </Badge>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Service Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-semibold">Service Performance</CardTitle>
                  <CardDescription>Breakdown by service type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: 'HydraFacial Express', bookings: 12, revenue: '$780', utilization: 92, color: 'bg-blue-500' },
                      { name: 'Signature Facial', bookings: 8, revenue: '$520', utilization: 85, color: 'bg-purple-500' },
                      { name: 'Chemical Peel', bookings: 3, revenue: '$390', utilization: 68, color: 'bg-green-500' },
                      { name: 'Microneedling', bookings: 2, revenue: '$340', utilization: 45, color: 'bg-orange-500' },
                      { name: 'LED Light Therapy', bookings: 3, revenue: '$180', utilization: 62, color: 'bg-pink-500' }
                    ].map((service, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{service.name}</p>
                            <p className="text-xs text-muted-foreground">{service.bookings} bookings • {service.revenue}</p>
                          </div>
                          <span className="text-sm font-medium">{service.utilization}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className={`${service.color} h-2 rounded-full`} style={{ width: `${service.utilization}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Operational KPIs */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-semibold">Operational KPIs</CardTitle>
                  <CardDescription>Key performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">No-Show Rate</p>
                        <p className="text-2xl font-semibold mt-1">3.2%</p>
                      </div>
                      <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                        Excellent
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Rebooking Rate</p>
                        <p className="text-2xl font-semibold mt-1">67%</p>
                      </div>
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                        Good
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Average Wait Time</p>
                        <p className="text-2xl font-semibold mt-1">8 min</p>
                      </div>
                      <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                        Excellent
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Client Satisfaction</p>
                        <p className="text-2xl font-semibold mt-1">4.8/5</p>
                      </div>
                      <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                        Excellent
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="marketing" className="space-y-8 mt-0">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold mb-1">Marketing Channels</h2>
                <p className="text-sm text-muted-foreground">Comprehensive analytics from Google, Meta, Email, SMS, and organic channels</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export Data
                </Button>
              </div>
            </div>

            {/* Overview Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                      Total Ad Spend
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-3xl font-semibold mb-2">$3,595</div>
                  <Badge variant="secondary" className="mt-1 text-xs">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +15.3% vs last period
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                      Marketing Revenue
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-3xl font-semibold mb-2">$24,173</div>
                  <Badge variant="secondary" className="mt-1 text-xs">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +23.7% vs last period
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                      Overall ROAS
                    </CardTitle>
                    <Target className="h-4 w-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-3xl font-semibold mb-2">6.7x</div>
                  <Badge variant="secondary" className="mt-1 text-xs">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +0.8x vs last period
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                      Total Conversions
                    </CardTitle>
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-3xl font-semibold mb-2">357</div>
                  <Badge variant="secondary" className="mt-1 text-xs">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +18.2% vs last period
                  </Badge>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Channel Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-semibold">Channel Performance</CardTitle>
                  <CardDescription>Detailed metrics for each marketing channel</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Google Ads */}
                    <div className="p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                            <Globe className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">Google Ads</h3>
                            <p className="text-sm text-muted-foreground">ROAS: 4.2x</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-medium">$5,250</div>
                          <div className="text-sm text-muted-foreground">$1250 spend</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-2 mb-3">
                        <div className="text-center p-2 bg-muted rounded-lg">
                          <div className="text-sm font-medium">45,200</div>
                          <div className="text-xs text-muted-foreground">Impressions</div>
                        </div>
                        <div className="text-center p-2 bg-muted rounded-lg">
                          <div className="text-sm font-medium">2,140</div>
                          <div className="text-xs text-muted-foreground">Clicks</div>
                        </div>
                        <div className="text-center p-2 bg-muted rounded-lg">
                          <div className="text-sm font-medium">89</div>
                          <div className="text-xs text-muted-foreground">Conversions</div>
                        </div>
                        <div className="text-center p-2 bg-muted rounded-lg">
                          <div className="text-sm font-medium">4.7%</div>
                          <div className="text-xs text-muted-foreground">CTR</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-2 text-xs mb-3">
                        <div><span className="text-muted-foreground">CPC:</span> <span className="font-medium">$0.58</span></div>
                        <div><span className="text-muted-foreground">CPA:</span> <span className="font-medium">$14.04</span></div>
                        <div><span className="text-muted-foreground">Conv Rate:</span> <span className="font-medium">4.2%</span></div>
                        <div><span className="text-muted-foreground">Revenue Share:</span> <span className="font-medium">21.7%</span></div>
                      </div>

                      <div className="pt-3 border-t space-y-1">
                        <h4 className="font-medium text-xs mb-2">Active Campaigns</h4>
                        <div className="flex items-center justify-between text-xs">
                          <span>HydraFacial Promotion</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-muted-foreground">32 conv</span>
                            <span className="text-muted-foreground">$450</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span>Botox Treatment</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-muted-foreground">57 conv</span>
                            <span className="text-muted-foreground">$800</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Meta Ads */}
                    <div className="p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
                            <Smartphone className="h-6 w-6 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">Meta Ads</h3>
                            <p className="text-sm text-muted-foreground">ROAS: 5.1x</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-medium">$10,710</div>
                          <div className="text-sm text-muted-foreground">$2100 spend</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-2 mb-3">
                        <div className="text-center p-2 bg-muted rounded-lg">
                          <div className="text-sm font-medium">78,900</div>
                          <div className="text-xs text-muted-foreground">Impressions</div>
                        </div>
                        <div className="text-center p-2 bg-muted rounded-lg">
                          <div className="text-sm font-medium">3,850</div>
                          <div className="text-xs text-muted-foreground">Clicks</div>
                        </div>
                        <div className="text-center p-2 bg-muted rounded-lg">
                          <div className="text-sm font-medium">156</div>
                          <div className="text-xs text-muted-foreground">Conversions</div>
                        </div>
                        <div className="text-center p-2 bg-muted rounded-lg">
                          <div className="text-sm font-medium">4.9%</div>
                          <div className="text-xs text-muted-foreground">CTR</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-2 text-xs mb-3">
                        <div><span className="text-muted-foreground">CPC:</span> <span className="font-medium">$0.55</span></div>
                        <div><span className="text-muted-foreground">CPA:</span> <span className="font-medium">$13.46</span></div>
                        <div><span className="text-muted-foreground">Conv Rate:</span> <span className="font-medium">4.1%</span></div>
                        <div><span className="text-muted-foreground">Revenue Share:</span> <span className="font-medium">44.3%</span></div>
                      </div>

                      <div className="pt-3 border-t space-y-1">
                        <h4 className="font-medium text-xs mb-2">Active Campaigns</h4>
                        <div className="flex items-center justify-between text-xs">
                          <span>Holiday Glow Package</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-muted-foreground">89 conv</span>
                            <span className="text-muted-foreground">$1200</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span>New Year Reset</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-muted-foreground">67 conv</span>
                            <span className="text-muted-foreground">$900</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Email Marketing */}
                    <div className="p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                            <Mail className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">Email Marketing</h3>
                            <p className="text-sm text-muted-foreground">ROAS: 67x</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-medium">$5,963</div>
                          <div className="text-sm text-muted-foreground">$89 spend</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-2 mb-3">
                        <div className="text-center p-2 bg-muted rounded-lg">
                          <div className="text-sm font-medium">12,400</div>
                          <div className="text-xs text-muted-foreground">Impressions</div>
                        </div>
                        <div className="text-center p-2 bg-muted rounded-lg">
                          <div className="text-sm font-medium">1,240</div>
                          <div className="text-xs text-muted-foreground">Clicks</div>
                        </div>
                        <div className="text-center p-2 bg-muted rounded-lg">
                          <div className="text-sm font-medium">67</div>
                          <div className="text-xs text-muted-foreground">Conversions</div>
                        </div>
                        <div className="text-center p-2 bg-muted rounded-lg">
                          <div className="text-sm font-medium">10%</div>
                          <div className="text-xs text-muted-foreground">CTR</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-2 text-xs mb-3">
                        <div><span className="text-muted-foreground">CPC:</span> <span className="font-medium">$0.07</span></div>
                        <div><span className="text-muted-foreground">CPA:</span> <span className="font-medium">$1.33</span></div>
                        <div><span className="text-muted-foreground">Conv Rate:</span> <span className="font-medium">5.4%</span></div>
                        <div><span className="text-muted-foreground">Revenue Share:</span> <span className="font-medium">24.7%</span></div>
                      </div>

                      <div className="pt-3 border-t space-y-1">
                        <h4 className="font-medium text-xs mb-2">Active Campaigns</h4>
                        <div className="flex items-center justify-between text-xs">
                          <span>Monthly Newsletter</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-muted-foreground">23 conv</span>
                            <span className="text-muted-foreground">$25</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span>Birthday Offers</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-muted-foreground">44 conv</span>
                            <span className="text-muted-foreground">$64</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SMS Marketing */}
                    <div className="p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center">
                            <MessageSquare className="h-6 w-6 text-pink-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">SMS Marketing</h3>
                            <p className="text-sm text-muted-foreground">ROAS: 14.4x</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-medium">$2,250</div>
                          <div className="text-sm text-muted-foreground">$156 spend</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-2 mb-3">
                        <div className="text-center p-2 bg-muted rounded-lg">
                          <div className="text-sm font-medium">5,600</div>
                          <div className="text-xs text-muted-foreground">Impressions</div>
                        </div>
                        <div className="text-center p-2 bg-muted rounded-lg">
                          <div className="text-sm font-medium">890</div>
                          <div className="text-xs text-muted-foreground">Clicks</div>
                        </div>
                        <div className="text-center p-2 bg-muted rounded-lg">
                          <div className="text-sm font-medium">45</div>
                          <div className="text-xs text-muted-foreground">Conversions</div>
                        </div>
                        <div className="text-center p-2 bg-muted rounded-lg">
                          <div className="text-sm font-medium">15.9%</div>
                          <div className="text-xs text-muted-foreground">CTR</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-2 text-xs mb-3">
                        <div><span className="text-muted-foreground">CPC:</span> <span className="font-medium">$0.18</span></div>
                        <div><span className="text-muted-foreground">CPA:</span> <span className="font-medium">$3.47</span></div>
                        <div><span className="text-muted-foreground">Conv Rate:</span> <span className="font-medium">5.1%</span></div>
                        <div><span className="text-muted-foreground">Revenue Share:</span> <span className="font-medium">9.3%</span></div>
                      </div>

                      <div className="pt-3 border-t space-y-1">
                        <h4 className="font-medium text-xs mb-2">Active Campaigns</h4>
                        <div className="flex items-center justify-between text-xs">
                          <span>Appointment Reminders</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-muted-foreground">28 conv</span>
                            <span className="text-muted-foreground">$80</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span>Flash Sale Alerts</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-muted-foreground">17 conv</span>
                            <span className="text-muted-foreground">$76</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Organic Performance & Audience Insights */}
              <div className="space-y-6">
                {/* Organic Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-semibold">Organic Performance</CardTitle>
                    <CardDescription>Non-paid traffic sources</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: 'Google Search', sessions: 2450, users: 1890, bounce: '42%', time: '3:24', badge: '3.2%' },
                        { name: 'Google My Business', sessions: 1240, users: 980, bounce: '35%', time: '4:15', badge: '7.2%' },
                        { name: 'Social Media', sessions: 890, users: 720, bounce: '58%', time: '2:18', badge: '3.8%' },
                        { name: 'Direct', sessions: 1560, users: 1320, bounce: '28%', time: '5:42', badge: '10.0%' }
                      ].map((source, index) => (
                        <div key={index} className="p-3 rounded-lg border">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-sm">{source.name}</h4>
                            <Badge variant="secondary" className="text-xs bg-green-50 text-green-700 border-green-200">
                              {source.badge}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div><span className="text-muted-foreground">Sessions:</span> <span className="font-medium">{source.sessions.toLocaleString()}</span></div>
                            <div><span className="text-muted-foreground">Users:</span> <span className="font-medium">{source.users.toLocaleString()}</span></div>
                            <div><span className="text-muted-foreground">Bounce:</span> <span className="font-medium">{source.bounce}</span></div>
                            <div><span className="text-muted-foreground">Avg Time:</span> <span className="font-medium">{source.time}</span></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Audience Insights */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-semibold">Audience Insights</CardTitle>
                    <CardDescription>Demographics and behavior</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { segment: 'Ages 25-34', percentage: 35, revenue: '$8,450', avg: '$185' },
                        { segment: 'Ages 35-44', percentage: 28, revenue: '$12,300', avg: '$245' },
                        { segment: 'Ages 45-54', percentage: 22, revenue: '$9,800', avg: '$215' },
                        { segment: 'Ages 55+', percentage: 15, revenue: '$6,200', avg: '$190' }
                      ].map((item, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">{item.segment}</span>
                            <span className="font-medium">{item.revenue}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{item.percentage}% of audience</span>
                            <span>Avg: {item.avg}</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: `${item.percentage * 2.86}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Top Performing Keywords */}
            <Card>
              <CardHeader>
                <CardTitle className="font-semibold">Top Performing Keywords</CardTitle>
                <CardDescription>Search terms driving the most conversions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { keyword: 'botox near me', impressions: 8900, clicks: 456, ctr: '5.1%', position: 2.3, convRate: '5.0%', conversions: 23 },
                    { keyword: 'hydrafacial spa', impressions: 6750, clicks: 324, ctr: '4.8%', position: 1.8, convRate: '5.6%', conversions: 18 },
                    { keyword: 'chemical peel treatment', impressions: 4200, clicks: 189, ctr: '4.5%', position: 3.1, convRate: '6.3%', conversions: 12 },
                    { keyword: 'facial spa near me', impressions: 12400, clicks: 567, ctr: '4.6%', position: 2.7, convRate: '6.0%', conversions: 34 },
                    { keyword: 'medspa services', impressions: 3890, clicks: 156, ctr: '4%', position: 3.8, convRate: '5.1%', conversions: 8 }
                  ].map((kw, index) => (
                    <div key={index} className="p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium">{kw.keyword}</h3>
                        <Badge variant="outline" className="text-xs">
                          {kw.conversions} conversions
                        </Badge>
                      </div>
                      <div className="grid grid-cols-5 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground text-xs">Impressions</span>
                          <div className="font-medium">{kw.impressions.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground text-xs">Clicks</span>
                          <div className="font-medium">{kw.clicks}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground text-xs">CTR</span>
                          <div className="font-medium">{kw.ctr}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground text-xs">Avg Position</span>
                          <div className="font-medium">{kw.position}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground text-xs">Conv Rate</span>
                          <div className="font-medium">{kw.convRate}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staff" className="space-y-8 mt-0">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold mb-1">Staff Performance</h2>
                <p className="text-sm text-muted-foreground">Individual employee KPIs, productivity metrics, and performance tracking</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export Report
                </Button>
              </div>
            </div>

            {/* Team Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                      Team Revenue
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-3xl font-semibold mb-1">$46,970</div>
                  <p className="text-sm text-muted-foreground">4 team members</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                      Total Appointments
                    </CardTitle>
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-3xl font-semibold mb-1">255</div>
                  <p className="text-sm text-muted-foreground">This period</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                      Avg Team Rating
                    </CardTitle>
                    <Star className="h-4 w-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-3xl font-semibold mb-1">4.8</div>
                  <p className="text-sm text-muted-foreground">Client satisfaction</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                      Avg Utilization
                    </CardTitle>
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-3xl font-semibold mb-1">80.5%</div>
                  <p className="text-sm text-muted-foreground">Team efficiency</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Individual Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-semibold">Individual Performance</CardTitle>
                  <CardDescription>Detailed metrics for each team member</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Dr. Sarah Chen */}
                    <div className="p-4 rounded-lg border">
                      <div className="flex items-start space-x-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                          SC
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">Dr. Sarah Chen</h3>
                              <p className="text-xs text-muted-foreground">Medical Director</p>
                              <div className="flex items-center space-x-1 mt-1">
                                <Star className="h-3 w-3 fill-current text-yellow-500" />
                                <span className="text-sm font-medium">4.8</span>
                                <span className="text-xs text-muted-foreground">(89 reviews)</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-semibold">$18,750</div>
                              <div className="text-xs text-muted-foreground">45 appointments</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-2 mb-3">
                        <div className="text-center p-2 bg-muted rounded-lg">
                          <div className="text-sm font-medium">92%</div>
                          <div className="text-xs text-muted-foreground">Utilization</div>
                        </div>
                        <div className="text-center p-2 bg-muted rounded-lg">
                          <div className="text-sm font-medium">85%</div>
                          <div className="text-xs text-muted-foreground">Rebooking</div>
                        </div>
                        <div className="text-center p-2 bg-muted rounded-lg">
                          <div className="text-sm font-medium">1.8%</div>
                          <div className="text-xs text-muted-foreground">No-Show</div>
                        </div>
                        <div className="text-center p-2 bg-muted rounded-lg">
                          <div className="text-sm font-medium">45min</div>
                          <div className="text-xs text-muted-foreground">Avg Service</div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <h4 className="font-medium text-xs mb-2">Top Services</h4>
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center justify-between">
                            <span>Botox Treatment</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-muted-foreground">28 bookings</span>
                              <span className="font-medium">$14,000</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Dermal Fillers</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-muted-foreground">12 bookings</span>
                              <span className="font-medium">$3,600</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Consultation</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-muted-foreground">15 bookings</span>
                              <span className="font-medium">$1,500</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <h4 className="font-medium text-xs mb-2">Certifications</h4>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline" className="text-xs">
                            <Award className="h-2 w-2 mr-1" />
                            Board Certified Dermatologist
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <Award className="h-2 w-2 mr-1" />
                            Botox Specialist
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <Award className="h-2 w-2 mr-1" />
                            Filler Expert
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs pt-3 border-t">
                        <div>
                          <h4 className="font-medium mb-1">Schedule</h4>
                          <div className="space-y-0.5">
                            <div className="flex justify-between"><span className="text-muted-foreground">Scheduled:</span> <span>120h</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Worked:</span> <span>118h</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Overtime:</span> <span>4h</span></div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-1">Earnings</h4>
                          <div className="space-y-0.5">
                            <div className="flex justify-between"><span className="text-muted-foreground">Revenue:</span> <span>$18,750</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Commission:</span> <span>$5,625</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Rate:</span> <span>30.0%</span></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Emily Rodriguez */}
                    <div className="p-4 rounded-lg border">
                      <div className="flex items-start space-x-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold">
                          ER
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">Emily Rodriguez</h3>
                              <p className="text-xs text-muted-foreground">Senior Esthetician</p>
                              <div className="flex items-center space-x-1 mt-1">
                                <Star className="h-3 w-3 fill-current text-yellow-500" />
                                <span className="text-sm font-medium">4.9</span>
                                <span className="text-xs text-muted-foreground">(156 reviews)</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-semibold">$12,450</div>
                              <div className="text-xs text-muted-foreground">89 appointments</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-2 mb-3">
                        <div className="text-center p-2 bg-muted rounded-lg">
                          <div className="text-sm font-medium">87%</div>
                          <div className="text-xs text-muted-foreground">Utilization</div>
                        </div>
                        <div className="text-center p-2 bg-muted rounded-lg">
                          <div className="text-sm font-medium">72%</div>
                          <div className="text-xs text-muted-foreground">Rebooking</div>
                        </div>
                        <div className="text-center p-2 bg-muted rounded-lg">
                          <div className="text-sm font-medium">3.2%</div>
                          <div className="text-xs text-muted-foreground">No-Show</div>
                        </div>
                        <div className="text-center p-2 bg-muted rounded-lg">
                          <div className="text-sm font-medium">78min</div>
                          <div className="text-xs text-muted-foreground">Avg Service</div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <h4 className="font-medium text-xs mb-2">Top Services</h4>
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center justify-between">
                            <span>HydraFacial Express</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-muted-foreground">34 bookings</span>
                              <span className="font-medium">$5,100</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Signature Facial</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-muted-foreground">28 bookings</span>
                              <span className="font-medium">$3,360</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Chemical Peel</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-muted-foreground">15 bookings</span>
                              <span className="font-medium">$3,750</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <h4 className="font-medium text-xs mb-2">Certifications</h4>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline" className="text-xs">
                            <Award className="h-2 w-2 mr-1" />
                            HydraFacial Certified
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <Award className="h-2 w-2 mr-1" />
                            Chemical Peel Specialist
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs pt-3 border-t">
                        <div>
                          <h4 className="font-medium mb-1">Schedule</h4>
                          <div className="space-y-0.5">
                            <div className="flex justify-between"><span className="text-muted-foreground">Scheduled:</span> <span>160h</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Worked:</span> <span>154h</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Overtime:</span> <span>8h</span></div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-1">Earnings</h4>
                          <div className="space-y-0.5">
                            <div className="flex justify-between"><span className="text-muted-foreground">Revenue:</span> <span>$12,450</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Commission:</span> <span>$2,490</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Rate:</span> <span>20.0%</span></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Michael Thompson */}
                    <div className="p-4 rounded-lg border">
                      <div className="flex items-start space-x-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-semibold">
                          MT
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">Michael Thompson</h3>
                              <p className="text-xs text-muted-foreground">Esthetician</p>
                              <div className="flex items-center space-x-1 mt-1">
                                <Star className="h-3 w-3 fill-current text-yellow-500" />
                                <span className="text-sm font-medium">4.7</span>
                                <span className="text-xs text-muted-foreground">(98 reviews)</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-semibold">$8,930</div>
                              <div className="text-xs text-muted-foreground">67 appointments</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-2 mb-3">
                        <div className="text-center p-2 bg-muted rounded-lg">
                          <div className="text-sm font-medium">78%</div>
                          <div className="text-xs text-muted-foreground">Utilization</div>
                        </div>
                        <div className="text-center p-2 bg-muted rounded-lg">
                          <div className="text-sm font-medium">65%</div>
                          <div className="text-xs text-muted-foreground">Rebooking</div>
                        </div>
                        <div className="text-center p-2 bg-muted rounded-lg">
                          <div className="text-sm font-medium">5.8%</div>
                          <div className="text-xs text-muted-foreground">No-Show</div>
                        </div>
                        <div className="text-center p-2 bg-muted rounded-lg">
                          <div className="text-sm font-medium">82min</div>
                          <div className="text-xs text-muted-foreground">Avg Service</div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <h4 className="font-medium text-xs mb-2">Top Services</h4>
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center justify-between">
                            <span>Signature Facial</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-muted-foreground">32 bookings</span>
                              <span className="font-medium">$3,840</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Dermaplaning</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-muted-foreground">25 bookings</span>
                              <span className="font-medium">$3,750</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Acne Treatment</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-muted-foreground">18 bookings</span>
                              <span className="font-medium">$2,160</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <h4 className="font-medium text-xs mb-2">Certifications</h4>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline" className="text-xs">
                            <Award className="h-2 w-2 mr-1" />
                            Licensed Esthetician
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <Award className="h-2 w-2 mr-1" />
                            Dermaplaning Certified
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs pt-3 border-t">
                        <div>
                          <h4 className="font-medium mb-1">Schedule</h4>
                          <div className="space-y-0.5">
                            <div className="flex justify-between"><span className="text-muted-foreground">Scheduled:</span> <span>160h</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Worked:</span> <span>148h</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Overtime:</span> <span>0h</span></div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-1">Earnings</h4>
                          <div className="space-y-0.5">
                            <div className="flex justify-between"><span className="text-muted-foreground">Revenue:</span> <span>$8,930</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Commission:</span> <span>$1,786</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Rate:</span> <span>20.0%</span></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Amanda Foster */}
                    <div className="p-4 rounded-lg border">
                      <div className="flex items-start space-x-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white font-semibold">
                          AF
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">Amanda Foster</h3>
                              <p className="text-xs text-muted-foreground">Junior Esthetician</p>
                              <div className="flex items-center space-x-1 mt-1">
                                <Star className="h-3 w-3 fill-current text-yellow-500" />
                                <span className="text-sm font-medium">4.6</span>
                                <span className="text-xs text-muted-foreground">(67 reviews)</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-semibold">$6,840</div>
                              <div className="text-xs text-muted-foreground">54 appointments</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-2 mb-3">
                        <div className="text-center p-2 bg-muted rounded-lg">
                          <div className="text-sm font-medium">65%</div>
                          <div className="text-xs text-muted-foreground">Utilization</div>
                        </div>
                        <div className="text-center p-2 bg-muted rounded-lg">
                          <div className="text-sm font-medium">58%</div>
                          <div className="text-xs text-muted-foreground">Rebooking</div>
                        </div>
                        <div className="text-center p-2 bg-muted rounded-lg">
                          <div className="text-sm font-medium">7.2%</div>
                          <div className="text-xs text-muted-foreground">No-Show</div>
                        </div>
                        <div className="text-center p-2 bg-muted rounded-lg">
                          <div className="text-sm font-medium">85min</div>
                          <div className="text-xs text-muted-foreground">Avg Service</div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <h4 className="font-medium text-xs mb-2">Top Services</h4>
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center justify-between">
                            <span>Basic Facial</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-muted-foreground">28 bookings</span>
                              <span className="font-medium">$2,800</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Cleansing Facial</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-muted-foreground">20 bookings</span>
                              <span className="font-medium">$2,400</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Eyebrow Shaping</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-muted-foreground">15 bookings</span>
                              <span className="font-medium">$900</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <h4 className="font-medium text-xs mb-2">Certifications</h4>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline" className="text-xs">
                            <Award className="h-2 w-2 mr-1" />
                            Licensed Esthetician
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs pt-3 border-t">
                        <div>
                          <h4 className="font-medium mb-1">Schedule</h4>
                          <div className="space-y-0.5">
                            <div className="flex justify-between"><span className="text-muted-foreground">Scheduled:</span> <span>140h</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Worked:</span> <span>135h</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Overtime:</span> <span>2h</span></div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-1">Earnings</h4>
                          <div className="space-y-0.5">
                            <div className="flex justify-between"><span className="text-muted-foreground">Revenue:</span> <span>$6,840</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Commission:</span> <span>$1,368</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Rate:</span> <span>20.0%</span></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Goals & Top Performers */}
              <div className="space-y-6">
                {/* Performance Goals */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-semibold">Performance Goals</CardTitle>
                    <CardDescription>Team targets and progress</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">Monthly Revenue</span>
                          <span className="text-green-600 font-medium">$46970$</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Target: $50000</span>
                          <span>94%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: '94%' }}></div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">Client Satisfaction</span>
                          <span className="text-green-600 font-medium">4.8/5</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Target: 4.8/5</span>
                          <span>99%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: '99%' }}></div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">Staff Utilization</span>
                          <span className="text-yellow-600 font-medium">80.5%</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Target: 85%</span>
                          <span>95%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">Rebooking Rate</span>
                          <span className="text-green-600 font-medium">70.0%</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Target: 70%</span>
                          <span>100%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Top Performers */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-semibold">Top Performers</CardTitle>
                    <CardDescription>Leading team members this period</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                          ER
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">Emily Rodriguez</h4>
                          <p className="text-xs text-muted-foreground">$12,450 revenue</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm font-medium">4.9</span>
                          <Star className="h-4 w-4 fill-current text-yellow-500" />
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                          SC
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">Dr. Sarah Chen</h4>
                          <p className="text-xs text-muted-foreground">$18,750 revenue</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm font-medium">4.8</span>
                          <Star className="h-4 w-4 fill-current text-yellow-500" />
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-semibold text-sm">
                          MT
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">Michael Thompson</h4>
                          <p className="text-xs text-muted-foreground">$8,930 revenue</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm font-medium">4.7</span>
                          <Star className="h-4 w-4 fill-current text-yellow-500" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="customers" className="space-y-8 mt-0">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold mb-1">Customer Analytics</h2>
                <p className="text-sm text-muted-foreground">Client behavior, satisfaction metrics, and customer lifetime value insights</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Customer Report
                </Button>
              </div>
            </div>

            {/* Key Customer Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                      Total Clients
                    </CardTitle>
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-3xl font-semibold mb-1">2,847</div>
                  <div className="flex items-center space-x-2 text-sm">
                    <ArrowUpRight className="h-3 w-3 text-green-600" />
                    <span className="text-green-600">+156</span>
                    <span className="text-muted-foreground">new this month</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                      Client Lifetime Value
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-3xl font-semibold mb-1">$1,247</div>
                  <div className="flex items-center space-x-2 text-sm">
                    <ArrowUpRight className="h-3 w-3 text-green-600" />
                    <span className="text-green-600">+8.3%</span>
                    <span className="text-muted-foreground">vs last period</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                      Retention Rate
                    </CardTitle>
                    <Heart className="h-4 w-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-3xl font-semibold mb-1">67%</div>
                  <div className="flex items-center space-x-2 text-sm">
                    <ArrowUpRight className="h-3 w-3 text-green-600" />
                    <span className="text-green-600">+5.2%</span>
                    <span className="text-muted-foreground">vs last period</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                      Avg Satisfaction
                    </CardTitle>
                    <Star className="h-4 w-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-3xl font-semibold mb-1">4.8</div>
                  <div className="flex items-center space-x-2 text-sm">
                    <ArrowUpRight className="h-3 w-3 text-green-600" />
                    <span className="text-green-600">+0.2</span>
                    <span className="text-muted-foreground">out of 5.0</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Customer Segments */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-semibold">Customer Segments</CardTitle>
                  <CardDescription>Client categorization by behavior and value</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* VIP Clients */}
                    <div className="p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-medium">VIP Clients</h3>
                          <p className="text-sm text-muted-foreground">142 clients (5% of total)</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold">$403,680</div>
                          <div className="text-sm text-muted-foreground">Total Revenue</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <div className="text-center p-2 bg-muted rounded-lg">
                          <div className="text-sm font-medium">$2,840</div>
                          <div className="text-xs text-muted-foreground">Avg Spend</div>
                        </div>
                        <div className="text-center p-2 bg-muted rounded-lg">
                          <div className="text-sm font-medium">12.4</div>
                          <div className="text-xs text-muted-foreground">Avg Visits</div>
                        </div>
                        <div className="text-center p-2 bg-muted rounded-lg">
                          <div className="text-sm font-medium">4.9</div>
                          <div className="text-xs text-muted-foreground">Satisfaction</div>
                        </div>
                      </div>

                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '5%' }}></div>
                      </div>
                    </div>

                    {/* Loyal Regulars */}
                    <div className="p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-medium">Loyal Regulars</h3>
                          <p className="text-sm text-muted-foreground">568 clients (19.9% of total)</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold">$937,200</div>
                          <div className="text-sm text-muted-foreground">Total Revenue</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <div className="text-center p-2 bg-muted rounded-lg">
                          <div className="text-sm font-medium">$1,650</div>
                          <div className="text-xs text-muted-foreground">Avg Spend</div>
                        </div>
                        <div className="text-center p-2 bg-muted rounded-lg">
                          <div className="text-sm font-medium">8.2</div>
                          <div className="text-xs text-muted-foreground">Avg Visits</div>
                        </div>
                        <div className="text-center p-2 bg-muted rounded-lg">
                          <div className="text-sm font-medium">4.8</div>
                          <div className="text-xs text-muted-foreground">Satisfaction</div>
                        </div>
                      </div>

                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '19.9%' }}></div>
                      </div>
                    </div>

                    {/* Occasional Visitors */}
                    <div className="p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-medium">Occasional Visitors</h3>
                          <p className="text-sm text-muted-foreground">1420 clients (49.9% of total)</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold">$688,700</div>
                          <div className="text-sm text-muted-foreground">Total Revenue</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <div className="text-center p-2 bg-muted rounded-lg">
                          <div className="text-sm font-medium">$485</div>
                          <div className="text-xs text-muted-foreground">Avg Spend</div>
                        </div>
                        <div className="text-center p-2 bg-muted rounded-lg">
                          <div className="text-sm font-medium">3.1</div>
                          <div className="text-xs text-muted-foreground">Avg Visits</div>
                        </div>
                        <div className="text-center p-2 bg-muted rounded-lg">
                          <div className="text-sm font-medium">4.6</div>
                          <div className="text-xs text-muted-foreground">Satisfaction</div>
                        </div>
                      </div>

                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '49.9%' }}></div>
                      </div>
                    </div>

                    {/* New Clients */}
                    <div className="p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-medium">New Clients</h3>
                          <p className="text-sm text-muted-foreground">717 clients (25.2% of total)</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold">$132,645</div>
                          <div className="text-sm text-muted-foreground">Total Revenue</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <div className="text-center p-2 bg-muted rounded-lg">
                          <div className="text-sm font-medium">$185</div>
                          <div className="text-xs text-muted-foreground">Avg Spend</div>
                        </div>
                        <div className="text-center p-2 bg-muted rounded-lg">
                          <div className="text-sm font-medium">1.2</div>
                          <div className="text-xs text-muted-foreground">Avg Visits</div>
                        </div>
                        <div className="text-center p-2 bg-muted rounded-lg">
                          <div className="text-sm font-medium">4.7</div>
                          <div className="text-xs text-muted-foreground">Satisfaction</div>
                        </div>
                      </div>

                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '25.2%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Clients & Behavior */}
              <div className="space-y-6">
                {/* Top Clients */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-semibold">Top Clients</CardTitle>
                    <CardDescription>Highest value customers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: 'Jennifer Walsh', service: 'HydraFacial Express', spend: 4850, rating: 5.0, tier: 'VIP' },
                        { name: 'Amanda Foster', service: 'Botox Treatment', spend: 3420, rating: 4.9, tier: 'VIP' },
                        { name: 'Sarah Johnson', service: 'Signature Facial', spend: 2890, rating: 4.8, tier: 'Loyal' },
                        { name: 'Emily Rodriguez', service: 'Chemical Peel', spend: 2140, rating: 4.7, tier: 'Loyal' }
                      ].map((client, index) => (
                        <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                            {client.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-sm">{client.name}</h4>
                              <Badge variant={client.tier === 'VIP' ? 'default' : 'secondary'} className="text-xs">
                                {client.tier}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{client.service}</p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-sm font-medium">${client.spend.toLocaleString()}</span>
                              <div className="flex items-center space-x-1">
                                <Star className="h-3 w-3 fill-current text-yellow-500" />
                                <span className="text-xs">{client.rating}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Behavior Insights */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-semibold">Behavior Insights</CardTitle>
                    <CardDescription>Client behavior patterns</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { metric: 'Avg Time Between Visits', value: '6.2 weeks', trend: '-0.8 weeks' },
                        { metric: 'No-Show Rate', value: '4.2%', trend: '-1.3%' },
                        { metric: 'Rebooking Rate', value: '67%', trend: '+8%' },
                        { metric: 'Referral Rate', value: '23%', trend: '+5%' }
                      ].map((behavior, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{behavior.metric}</span>
                          <div className="text-right">
                            <div className="font-medium text-sm">{behavior.value}</div>
                            <div className="text-xs text-green-600">{behavior.trend}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Service Preferences & Customer Feedback */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="font-semibold">Service Preferences</CardTitle>
                  <CardDescription>Most popular services by bookings and revenue</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { service: 'HydraFacial Express', bookings: 456, revenue: 68400, avg: 150, rating: 4.9 },
                      { service: 'Signature Facial', bookings: 389, revenue: 46680, avg: 120, rating: 4.8 },
                      { service: 'Botox Treatment', bookings: 234, revenue: 117000, avg: 500, rating: 4.9 },
                      { service: 'Chemical Peel', bookings: 198, revenue: 49500, avg: 250, rating: 4.7 },
                      { service: 'Dermaplaning', bookings: 167, revenue: 25050, avg: 150, rating: 4.6 }
                    ].map((service, index) => (
                      <div key={index} className="p-3 rounded-lg border">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">{service.service}</h4>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 fill-current text-yellow-500" />
                            <span className="text-sm">{service.rating}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground">Bookings:</span>
                            <span className="ml-1 font-medium">{service.bookings}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Revenue:</span>
                            <span className="ml-1 font-medium">${service.revenue.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Avg:</span>
                            <span className="ml-1 font-medium">${service.avg}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-semibold">Customer Feedback</CardTitle>
                  <CardDescription>Satisfaction ratings by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { category: 'Service Quality', rating: 4.8, responses: 234, percentage: 96 },
                      { category: 'Staff Friendliness', rating: 4.9, responses: 198, percentage: 98 },
                      { category: 'Cleanliness', rating: 4.7, responses: 145, percentage: 94 },
                      { category: 'Value for Money', rating: 4.6, responses: 167, percentage: 92 },
                      { category: 'Booking Process', rating: 4.5, responses: 123, percentage: 90 }
                    ].map((feedback, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{feedback.category}</span>
                          <div className="flex items-center space-x-2">
                            <Star className="h-4 w-4 fill-current text-yellow-500" />
                            <span className="font-medium">{feedback.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{feedback.responses} responses</span>
                          <span>{feedback.percentage}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: `${feedback.percentage}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Loyalty Program Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="font-semibold">Loyalty Program Performance</CardTitle>
                <CardDescription>Member engagement and program effectiveness</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-3xl font-semibold">1,890</div>
                    <div className="text-sm text-muted-foreground">Total Members</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-3xl font-semibold">1,456</div>
                    <div className="text-sm text-muted-foreground">Active Members</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-3xl font-semibold">89,400</div>
                    <div className="text-sm text-muted-foreground">Points Redeemed</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-3xl font-semibold">$234,500</div>
                    <div className="text-sm text-muted-foreground">Loyalty Revenue</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { tier: 'Bronze', members: 1234 },
                    { tier: 'Silver', members: 456 },
                    { tier: 'Gold', members: 156 },
                    { tier: 'Platinum', members: 44 }
                  ].map((tier, index) => (
                    <div key={index} className="text-center p-4 rounded-lg border">
                      <h4 className="font-medium text-sm mb-2">{tier.tier}</h4>
                      <div className="text-2xl font-semibold">{tier.members.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">members</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </main>
      </Tabs>
    </div>
  );
};

export default AuraPage;
