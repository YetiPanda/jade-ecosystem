/**
 * DualLoginNav Component
 *
 * Feature: Homepage Login Navigation
 *
 * Provides clear separation between:
 * 1. Curated Dashboard (Vendor Login)
 * 2. Aura by Jade (Spa Owner Login)
 *
 * Follows Progressive Disclosure pattern with visual distinction
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Store, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

export interface DualLoginNavProps {
  variant?: 'header' | 'hero' | 'fullpage';
  className?: string;
}

/**
 * DualLoginNav Component
 *
 * Displays two distinct login paths:
 * - Curated: For vendors managing product catalog
 * - Aura: For spa owners managing scheduling & client experience
 */
export const DualLoginNav: React.FC<DualLoginNavProps> = ({
  variant = 'header',
  className = '',
}) => {
  const [hoveredCard, setHoveredCard] = useState<'curated' | 'aura' | null>(null);

  if (variant === 'header') {
    // Compact header navigation version
    return (
      <nav className={`flex items-center gap-4 ${className}`}>
        <Link
          to="/auth/login/curated"
          className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 transition-all duration-300"
        >
          <Store className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-900">Vendor Login</span>
          <ArrowRight className="h-3 w-3 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>

        <Link
          to="/auth/login/aura"
          className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border border-purple-200 transition-all duration-300"
        >
          <Calendar className="h-4 w-4 text-purple-600" />
          <span className="text-sm font-medium text-purple-900">Spa Owner Login</span>
          <ArrowRight className="h-3 w-3 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
      </nav>
    );
  }

  if (variant === 'hero') {
    // Hero section embedded version - Stacked vertically, aligned right
    return (
      <div className={`flex flex-col gap-4 items-end ${className}`}>
        <Link
          to="/auth/login/curated"
          className="group relative overflow-hidden rounded-2xl bg-white/95 backdrop-blur-sm hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300 p-6 w-[340px]"
          onMouseEnter={() => setHoveredCard('curated')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
              <Store className="h-6 w-6" />
            </div>
            <ArrowRight
              className={`h-5 w-5 text-blue-600 transition-all duration-300 ${
                hoveredCard === 'curated' ? 'translate-x-1 opacity-100' : 'opacity-0'
              }`}
            />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Curated Dashboard</h3>
          <p className="text-sm text-gray-600">Vendor product management & analytics</p>
        </Link>

        <Link
          to="/auth/login/aura"
          className="group relative overflow-hidden rounded-2xl bg-white/95 backdrop-blur-sm hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300 p-6 w-[340px]"
          onMouseEnter={() => setHoveredCard('aura')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white relative">
              <Calendar className="h-6 w-6" />
              <Sparkles className="h-3 w-3 absolute -top-1 -right-1 text-yellow-300" />
            </div>
            <ArrowRight
              className={`h-5 w-5 text-purple-600 transition-all duration-300 ${
                hoveredCard === 'aura' ? 'translate-x-1 opacity-100' : 'opacity-0'
              }`}
            />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Aura by Jade</h3>
          <p className="text-sm text-gray-600">Spa scheduling & client experience</p>
        </Link>
      </div>
    );
  }

  // Full-page version with detailed cards
  return (
    <div className={`grid md:grid-cols-2 gap-8 max-w-5xl mx-auto ${className}`}>
      {/* Curated Card */}
      <Link
        to="/auth/login/curated"
        className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 via-white to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-2 border-blue-200 hover:border-blue-300 shadow-xl hover:shadow-2xl transition-all duration-500 p-8"
        onMouseEnter={() => setHoveredCard('curated')}
        onMouseLeave={() => setHoveredCard(null)}
      >
        {/* Icon */}
        <div className="flex items-center justify-between mb-6">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
            <Store className="h-8 w-8" />
          </div>
          <ArrowRight
            className={`h-6 w-6 text-blue-600 transition-all duration-300 ${
              hoveredCard === 'curated'
                ? 'translate-x-2 opacity-100 scale-110'
                : 'opacity-40'
            }`}
          />
        </div>

        {/* Content */}
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Curated Dashboard
        </h2>
        <p className="text-lg text-gray-700 mb-6">
          Vendor Portal for Product Management
        </p>

        {/* Features */}
        <ul className="space-y-3 mb-8">
          <li className="flex items-start gap-3 text-gray-600">
            <div className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0" />
            <span>Manage product catalog with advanced taxonomy</span>
          </li>
          <li className="flex items-start gap-3 text-gray-600">
            <div className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0" />
            <span>Real-time analytics & business intelligence</span>
          </li>
          <li className="flex items-start gap-3 text-gray-600">
            <div className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0" />
            <span>Bulk operations & quality control tools</span>
          </li>
          <li className="flex items-start gap-3 text-gray-600">
            <div className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0" />
            <span>AI-powered product recommendations</span>
          </li>
        </ul>

        {/* CTA */}
        <Button
          variant="primary"
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl shadow-md group-hover:shadow-lg transition-all"
        >
          Login to Curated
        </Button>
      </Link>

      {/* Aura Card */}
      <Link
        to="/auth/login/aura"
        className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-50 via-white to-pink-50 hover:from-purple-100 hover:to-pink-100 border-2 border-purple-200 hover:border-purple-300 shadow-xl hover:shadow-2xl transition-all duration-500 p-8"
        onMouseEnter={() => setHoveredCard('aura')}
        onMouseLeave={() => setHoveredCard(null)}
      >
        {/* Icon with sparkle */}
        <div className="flex items-center justify-between mb-6">
          <div className="relative p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-lg">
            <Calendar className="h-8 w-8" />
            <Sparkles className="h-4 w-4 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
          </div>
          <ArrowRight
            className={`h-6 w-6 text-purple-600 transition-all duration-300 ${
              hoveredCard === 'aura'
                ? 'translate-x-2 opacity-100 scale-110'
                : 'opacity-40'
            }`}
          />
        </div>

        {/* Content */}
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Aura by Jade
        </h2>
        <p className="text-lg text-gray-700 mb-6">
          Spa Owner Scheduling & Client Experience
        </p>

        {/* Features */}
        <ul className="space-y-3 mb-8">
          <li className="flex items-start gap-3 text-gray-600">
            <div className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-500 flex-shrink-0" />
            <span>Intelligent appointment scheduling system</span>
          </li>
          <li className="flex items-start gap-3 text-gray-600">
            <div className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-500 flex-shrink-0" />
            <span>Client relationship management (CRM)</span>
          </li>
          <li className="flex items-start gap-3 text-gray-600">
            <div className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-500 flex-shrink-0" />
            <span>Treatment history & protocol tracking</span>
          </li>
          <li className="flex items-start gap-3 text-gray-600">
            <div className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-500 flex-shrink-0" />
            <span>Integrated product ordering from Curated</span>
          </li>
        </ul>

        {/* CTA */}
        <Button
          variant="primary"
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-xl shadow-md group-hover:shadow-lg transition-all"
        >
          Login to Aura
        </Button>
      </Link>
    </div>
  );
};

export default DualLoginNav;
