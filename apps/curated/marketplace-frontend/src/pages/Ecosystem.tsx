/**
 * Ecosystem Page
 *
 * Comprehensive overview of the JADE Software ecosystem showcasing
 * three integrated platforms: Aura, Curated, and Spa-ce Sanctuary
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  ShoppingCart,
  BookOpen,
  Brain,
  Heart,
  Play,
  ArrowRight,
  CheckCircle,
  Zap,
  Clock,
  Users,
  Compass,
  Coffee,
  Star
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@jade/ui/components';
import { Button } from '@jade/ui/components';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

interface Platform {
  id: 'aura' | 'curated' | 'sanctuary' | 'intelligence';
  name: string;
  subtitle: string;
  description: string;
  color: string;
  icon: React.ElementType;
  keyFeatures: string[];
  benefits: string[];
  image: string;
  route: string;
}

interface IntegrationFeature {
  title: string;
  description: string;
  icon: React.ElementType;
}

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  rating: number;
  metric: string;
}

export const EcosystemPage: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<'aura' | 'curated' | 'sanctuary' | 'intelligence'>('aura');

  const platforms: Platform[] = [
    {
      id: 'aura',
      name: 'Aura by Jade',
      subtitle: 'Operational Heart',
      description: 'Aura by Jade is the operational heart of your business. A comprehensive, all-in-one software solution designed by an industry veteran who truly gets it. We empower single proprietors, spa, and medspa owners with an intuitive platform for scheduling, client management, and point-of-sale, giving you back the most valuable thing you have: your time.',
      color: '#2E8B57',
      icon: Home,
      keyFeatures: [
        'Intuitive scheduling & calendar management',
        'Comprehensive client relationship tools',
        'Seamless point-of-sale integration',
        'Staff management & performance tracking'
      ],
      benefits: [
        'Reclaim your time to focus on what you love',
        'Never double-book or lose track of appointments again',
        'Build stronger relationships with your clients',
        'Understand your business performance at a glance'
      ],
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1974&auto=format&fit=crop',
      route: '/app/aura'
    },
    {
      id: 'curated',
      name: 'Curated by Jade',
      subtitle: 'Vetted Marketplace',
      description: 'The beauty and wellness industry can be a bit of a jungle. Curated by Jade is our solution—a curated marketplace for skincare vendors to sell directly to solo estheticians, nurses, and spa owners. We\'ve done the vetting, so you don\'t have to. This platform is a no-nonsense, seamless way to discover high-quality products and place orders.',
      color: '#6F4E37',
      icon: ShoppingCart,
      keyFeatures: [
        'Pre-vetted, high-quality product catalog',
        'Direct vendor-to-professional sales',
        'Streamlined ordering and fulfillment',
        'Educational product information'
      ],
      benefits: [
        'Skip the research and trust our vetting process',
        'Access professional-grade products easily',
        'Build relationships with reliable vendors',
        'Save time with seamless ordering'
      ],
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1974&auto=format&fit=crop',
      route: '/app/marketplace'
    },
    {
      id: 'sanctuary',
      name: 'Spa-ce Sanctuary',
      subtitle: 'Professional Community',
      description: 'Spa-ce Sanctuary is a dedicated place for connection. It\'s our virtual community for continuous learning, networking, and support—a place people will come for education, gatherings, and community. We believe a rising tide lifts all ships, and this platform is designed to connect professionals who get it.',
      color: '#8B9A6B',
      icon: BookOpen,
      keyFeatures: [
        'Virtual educational events and workshops',
        'Professional networking opportunities',
        'Peer support and mentorship programs',
        'Industry trend discussions and insights'
      ],
      benefits: [
        'Connect with professionals who understand your journey',
        'Learn from industry experts and peers',
        'Stay current with trends and techniques',
        'Find support during challenging times'
      ],
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2032&auto=format&fit=crop',
      route: '/app/sanctuary'
    },
    {
      id: 'intelligence',
      name: 'Intelligence',
      subtitle: 'Business Analytics & AI',
      description: 'Intelligence is the brain of the JADE ecosystem. Powered by advanced AI and domain-specific skincare knowledge, it provides real-time analytics, causal chain insights, evidence-based recommendations, and marketing intelligence. From ingredient compatibility analysis to business performance predictions, Intelligence helps you make data-driven decisions.',
      color: '#7C3AED',
      icon: Brain,
      keyFeatures: [
        'Real-time business analytics dashboards',
        'AI-powered skincare knowledge graph',
        'Ingredient compatibility & causal chains',
        'Evidence-based claim verification'
      ],
      benefits: [
        'Make confident, data-driven decisions',
        'Understand why ingredients work together',
        'Verify marketing claims with scientific evidence',
        'Predict trends and optimize your business'
      ],
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop',
      route: '/app/admin/business-intelligence'
    }
  ];

  const integrationFeatures: IntegrationFeature[] = [
    {
      title: 'Seamless Integration',
      description: 'All four pillars work together naturally, sharing data and insights to make your business run smoother.',
      icon: Zap
    },
    {
      title: 'Industry Understanding',
      description: 'Built by someone who\'s been in the trenches and understands the real challenges you face every day.',
      icon: Heart
    },
    {
      title: 'Time-Saving Design',
      description: 'Every feature is designed to give you back your most precious resource: time to focus on what matters.',
      icon: Clock
    },
    {
      title: 'Supportive Community',
      description: 'You\'re not alone in this journey. Connect with others who understand the unique challenges of our industry.',
      icon: Users
    }
  ];

  const testimonials: Testimonial[] = [
    {
      quote: "Aura gave me my evenings back. I used to spend hours after work managing schedules and inventory. Now everything just flows, and I can actually enjoy my personal time.",
      author: "Sarah Mitchell",
      role: "Owner, Luxe Wellness Spa",
      rating: 5,
      metric: "5+ hours saved weekly"
    },
    {
      quote: "Finding reliable vendors used to be such a headache. Curated by Jade removed all the guesswork. I know everything they offer has been thoroughly vetted by professionals.",
      author: "Michael Rodriguez",
      role: "Regional Sales Manager",
      rating: 5,
      metric: "40% faster sourcing"
    },
    {
      quote: "Spa-ce Sanctuary helped me through my first year as a solo esthetician. The community support and educational resources were invaluable when I felt overwhelmed.",
      author: "Dr. Amanda Chen",
      role: "Medical Esthetician",
      rating: 5,
      metric: "Connected with 50+ professionals"
    }
  ];

  const activePlatform = platforms.find(p => p.id === activeDemo);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-b from-muted/50 to-background">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2 mb-8">
              <Heart className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Built by professionals, for professionals</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
              Software That Actually<br />
              <span className="text-primary">Understands Your Business</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Four integrated pillars designed for the modern beauty industry by someone who's been where you are.
              <span className="text-primary font-medium"> No tech jargon, no empty promises</span> — just thoughtful tools
              that help you reclaim your time and build the business you've always envisioned.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
              <Button
                className="rounded-full px-8 py-6 text-base font-medium"
                size="lg"
                onClick={() => {
                  const element = document.getElementById('discover-platform');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              >
                <Play className="h-4 w-4 mr-2" />
                Explore the Ecosystem
              </Button>
              <Button
                variant="outline"
                className="rounded-full px-8 py-6 text-base"
                size="lg"
                asChild
              >
                <Link to="/app/marketplace">Browse Curated</Link>
              </Button>
            </div>
          </div>

          {/* Platform Preview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
            {platforms.map((platform) => (
              <Card
                key={platform.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  activeDemo === platform.id ? 'ring-2 ring-primary shadow-lg' : ''
                }`}
                onClick={() => setActiveDemo(platform.id)}
              >
                <CardHeader className="text-center pb-4">
                  <div
                    className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                    style={{backgroundColor: `${platform.color}15`}}
                  >
                    <platform.icon className="h-8 w-8" style={{color: platform.color}} />
                  </div>
                  <CardTitle className="text-xl">{platform.name}</CardTitle>
                  <CardDescription>{platform.subtitle}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                    {platform.description.split('.')[0]}.
                  </p>
                  <Button
                    className="w-full rounded-xl font-medium"
                    style={{backgroundColor: platform.color, color: '#ffffff'}}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDemo(platform.id);
                    }}
                  >
                    Explore {platform.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Deep Dive */}
      <section id="discover-platform" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">Discover Your Perfect Platform</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Each platform serves a unique purpose in your professional journey, but they all work together
              to create a seamless experience that just makes sense.
            </p>
          </div>

          <Tabs value={activeDemo} onValueChange={(value) => setActiveDemo(value as 'aura' | 'curated' | 'sanctuary' | 'intelligence')} className="w-full">
            <TabsList className="grid w-full grid-cols-4 max-w-3xl mx-auto mb-12">
              <TabsTrigger value="aura">Aura</TabsTrigger>
              <TabsTrigger value="curated">Curated</TabsTrigger>
              <TabsTrigger value="sanctuary">Sanctuary</TabsTrigger>
              <TabsTrigger value="intelligence">Intelligence</TabsTrigger>
            </TabsList>

            {platforms.map((platform) => (
              <TabsContent key={platform.id} value={platform.id} className="mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <div>
                    <div className="flex items-center space-x-4 mb-8">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center"
                        style={{backgroundColor: `${platform.color}15`}}
                      >
                        <platform.icon className="h-7 w-7" style={{color: platform.color}} />
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold text-foreground">{platform.name}</h3>
                        <p className="text-muted-foreground font-medium">{platform.subtitle}</p>
                      </div>
                    </div>

                    <div className="text-lg text-muted-foreground mb-10 leading-relaxed">
                      {platform.description}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div>
                        <h4 className="font-semibold mb-6 text-sm uppercase tracking-wider text-primary">Key Features</h4>
                        <ul className="space-y-4">
                          {platform.keyFeatures.map((feature, index) => (
                            <li key={index} className="flex items-start space-x-3 text-sm">
                              <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" style={{color: platform.color}} />
                              <span className="text-foreground">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-6 text-sm uppercase tracking-wider text-primary">How It Helps You</h4>
                        <ul className="space-y-4">
                          {platform.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start space-x-3 text-sm">
                              <Heart className="h-4 w-4 flex-shrink-0 mt-0.5" style={{color: platform.color}} />
                              <span className="text-foreground">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mt-10">
                      <Button
                        className="rounded-xl px-8 py-3 font-medium"
                        style={{backgroundColor: platform.color, color: '#ffffff'}}
                        asChild
                      >
                        <Link to={platform.route}>
                          Try {platform.name}
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>
                      <Button variant="outline" className="rounded-xl px-8 py-3" asChild>
                        <Link to={platform.route}>Learn More</Link>
                      </Button>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl bg-muted">
                      <img
                        src={platform.image}
                        alt={platform.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
                    <div className="absolute top-4 right-4">
                      <Badge
                        className="bg-white/90 backdrop-blur border-0 rounded-full"
                        style={{color: platform.color}}
                      >
                        Live Demo
                      </Badge>
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Integration Story */}
      <section className="py-24 bg-muted/50 border-y">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
              <Compass className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Everything works together</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">An Ecosystem That Just Makes Sense</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We designed these four pillars to work together seamlessly, because we know you don't have time
              to manage disconnected systems. Your business deserves <span className="text-primary font-medium">thoughtful integration</span>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {integrationFeatures.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center bg-primary/10">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-4 text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-16">
            <div className="inline-block bg-card rounded-2xl p-8 shadow-xl">
              <Coffee className="h-8 w-8 text-primary mx-auto mb-4" />
              <p className="text-sm text-muted-foreground max-w-md">
                <span className="font-medium text-foreground">From one professional to another:</span> We built this ecosystem
                because we understand the challenges you face every day. You deserve software that works as hard as you do.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">Stories from Our Community</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real experiences from real professionals who've found their rhythm with our platforms.
              These aren't corporate testimonials—they're genuine stories from people like you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <Badge className="ml-auto bg-primary/10 text-primary border-0 rounded-full">
                      {testimonial.metric}
                    </Badge>
                  </div>
                  <blockquote className="text-muted-foreground mb-8 leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="border-t pt-6">
                    <div className="font-semibold text-foreground">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary/5 via-primary/10 to-background">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <div className="inline-flex items-center space-x-2 bg-card rounded-full px-4 py-2 mb-8 shadow-lg">
            <Heart className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Ready to reclaim your time?</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">Experience the Difference</h2>
          <p className="text-lg text-muted-foreground mb-12 leading-relaxed max-w-2xl mx-auto">
            No complicated demos or sales pressure. Just explore the platforms and see how they can
            <span className="text-primary font-medium"> simplify your daily routine</span>.
            Because you deserve software that actually understands your business.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mb-8">
            <Button
              className="rounded-xl py-5 font-medium text-sm"
              asChild
            >
              <Link to="/app/aura">Try Aura</Link>
            </Button>
            <Button
              className="rounded-xl py-5 font-medium text-sm"
              variant="outline"
              asChild
            >
              <Link to="/app/marketplace">Curated</Link>
            </Button>
            <Button
              className="rounded-xl py-5 font-medium text-sm"
              variant="outline"
              asChild
            >
              <Link to="/app/sanctuary">Sanctuary</Link>
            </Button>
            <Button
              className="rounded-xl py-5 font-medium text-sm"
              variant="outline"
              asChild
            >
              <Link to="/app/admin/business-intelligence">Intelligence</Link>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            No registration required • Full feature access • Real demo environments •
            <span className="text-primary font-medium"> Genuinely helpful</span>
          </p>
        </div>
      </section>
    </div>
  );
};

export default EcosystemPage;
