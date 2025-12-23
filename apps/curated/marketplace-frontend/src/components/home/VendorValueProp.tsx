/**
 * VendorValueProp Component
 *
 * Feature: Vendor-Focused Homepage
 *
 * Highlights the value proposition of Curated by Jade for vendors
 * Emphasizes product taxonomy, AI-native search, and business intelligence
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Store, TrendingUp, Brain, Shield, Zap, BarChart3 } from 'lucide-react';
import { Button } from '../ui/Button';

export interface VendorValuePropProps {
  className?: string;
}

/**
 * VendorValueProp Component
 *
 * Showcases key benefits for vendors joining the Curated marketplace
 * Uses Progressive Disclosure pattern for information hierarchy
 */
export const VendorValueProp: React.FC<VendorValuePropProps> = ({ className = '' }) => {
  const benefits = [
    {
      icon: Brain,
      title: '13D Tensor Search',
      description: 'AI-powered product discovery with hypergraph interaction analysis',
      color: 'from-blue-500 to-indigo-600',
      glance: 'AI Search',
      scan: 'Advanced product compatibility matching using 13-dimensional tensor mathematics',
    },
    {
      icon: TrendingUp,
      title: 'Growth Analytics',
      description: 'Real-time insights on sales, trends, and customer behavior',
      color: 'from-green-500 to-emerald-600',
      glance: 'Analytics',
      scan: 'Comprehensive KPIs including AOV, CLV, conversion rates by product taxonomy',
    },
    {
      icon: Shield,
      title: 'Quality Control',
      description: 'Automated taxonomy validation and product quality scoring',
      color: 'from-purple-500 to-pink-600',
      glance: 'Quality',
      scan: 'Taxonomy completeness scoring, duplicate detection, consistency warnings',
    },
    {
      icon: Zap,
      title: 'Instant Visibility',
      description: 'Get discovered by spa professionals searching for your products',
      color: 'from-orange-500 to-red-600',
      glance: 'Visibility',
      scan: 'Featured on homepage, category pages, and AI-powered recommendations',
    },
    {
      icon: BarChart3,
      title: 'Business Intelligence',
      description: 'Track performance across categories, skin concerns, and ingredient trends',
      color: 'from-cyan-500 to-blue-600',
      glance: 'Insights',
      scan: 'Sunburst charts, heatmaps, sankey diagrams for category performance analysis',
    },
    {
      icon: Store,
      title: 'Self-Service Portal',
      description: 'Manage products, inventory, and orders from one intuitive dashboard',
      color: 'from-indigo-500 to-purple-600',
      glance: 'Portal',
      scan: 'Bulk upload tools, guided taxonomy selection, protocol documentation management',
    },
  ];

  return (
    <section className={`py-16 bg-gradient-to-b from-white via-gray-50 to-white ${className}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-4">
            <Store className="h-4 w-4" />
            <span>For Vendors</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose Curated by Jade?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join the marketplace built specifically for professional skincare brands.
            Advanced technology meets intuitive management tools.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="benefit-card group relative overflow-hidden rounded-2xl bg-white border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-xl transition-all duration-300 p-6"
              >
                {/* Icon with gradient background */}
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${benefit.color} text-white mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-6 w-6" />
                </div>

                {/* Glance Level - Title */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>

                {/* Scan Level - Description */}
                <p className="text-gray-600 mb-4">
                  {benefit.description}
                </p>

                {/* Study Level - Detailed info (shown on hover) */}
                <div className="detailed-info opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-sm text-gray-500 italic border-t border-gray-100 pt-3">
                    {benefit.scan}
                  </p>
                </div>

                {/* Hover gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`} />
              </div>
            );
          })}
        </div>

        {/* Stats Section - Progressive Disclosure */}
        <div className="stats-section bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-8 mb-12">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="stat">
              <div className="text-4xl font-bold text-blue-600 mb-2">13D</div>
              <div className="text-sm text-gray-600">Tensor Mathematics</div>
              <div className="text-xs text-gray-500 mt-1">Advanced product compatibility</div>
            </div>
            <div className="stat">
              <div className="text-4xl font-bold text-indigo-600 mb-2">100%</div>
              <div className="text-sm text-gray-600">Taxonomy Coverage</div>
              <div className="text-xs text-gray-500 mt-1">Complete product classification</div>
            </div>
            <div className="stat">
              <div className="text-4xl font-bold text-purple-600 mb-2">AI-Native</div>
              <div className="text-sm text-gray-600">Search & Discovery</div>
              <div className="text-xs text-gray-500 mt-1">Natural language queries</div>
            </div>
            <div className="stat">
              <div className="text-4xl font-bold text-pink-600 mb-2">Real-Time</div>
              <div className="text-sm text-gray-600">Analytics Dashboard</div>
              <div className="text-xs text-gray-500 mt-1">Live performance metrics</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="cta-section text-center bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-12 text-white">
          <h3 className="text-3xl font-bold mb-4">
            Ready to grow your professional skincare business?
          </h3>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Join leading skincare brands already using Curated by Jade to reach spa professionals worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth/login/curated">
              <Button
                variant="default"
                size="lg"
                className="bg-white text-blue-700 hover:bg-blue-50 font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Get Started as a Vendor
              </Button>
            </Link>
            <Link to="/app/products">
              <Button
                variant="ghost"
                size="lg"
                className="text-white border-2 border-white/30 hover:border-white/50 hover:bg-white/10 backdrop-blur-sm font-semibold px-8 py-4 rounded-xl transition-all"
              >
                Explore the Marketplace
              </Button>
            </Link>
          </div>
        </div>
      </div>

    </section>
  );
};

export default VendorValueProp;
