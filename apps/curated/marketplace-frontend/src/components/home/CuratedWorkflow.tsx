/**
 * CuratedWorkflow Component
 *
 * Feature: Vendor-Focused Homepage
 *
 * Explains the vendor onboarding and product management workflow
 * Shows how Curated marketplace works with Progressive Disclosure
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  UserPlus,
  Package,
  BarChart3,
  Rocket,
  Check,
  ArrowRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Button } from '../ui/Button';

export interface CuratedWorkflowProps {
  className?: string;
}

interface WorkflowStep {
  number: number;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  glance: string;
  scan: string[];
  study: {
    features: string[];
    timeEstimate: string;
  };
  color: string;
}

/**
 * CuratedWorkflow Component
 *
 * Step-by-step guide showing vendors how to get started
 * Progressive Disclosure: Glance (title) → Scan (features) → Study (detailed info)
 */
export const CuratedWorkflow: React.FC<CuratedWorkflowProps> = ({ className = '' }) => {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const steps: WorkflowStep[] = [
    {
      number: 1,
      icon: UserPlus,
      title: 'Create Vendor Account',
      subtitle: 'Quick signup and profile setup',
      glance: 'Sign up in under 5 minutes',
      scan: [
        'Company information and branding',
        'Business verification and credentials',
        'Payment and shipping setup',
        'Automated account approval',
      ],
      study: {
        features: [
          'Automated tax ID verification',
          'Stripe Connect integration for payments',
          'Customizable vendor storefront',
          'Multi-user team access with role-based permissions',
        ],
        timeEstimate: '5-10 minutes',
      },
      color: 'from-blue-500 to-indigo-600',
    },
    {
      number: 2,
      icon: Package,
      title: 'Add Your Products',
      subtitle: 'Guided taxonomy and bulk upload',
      glance: 'Upload products with AI assistance',
      scan: [
        'Bulk CSV upload or manual entry',
        'Guided taxonomy classification wizard',
        'Auto-complete for ingredients and actives',
        'Real-time quality score feedback',
      ],
      study: {
        features: [
          'AI-powered category suggestions',
          'Ingredient standardization engine',
          'Protocol documentation upload (for professional products)',
          'Automatic duplicate detection',
          'SEO optimization recommendations',
        ],
        timeEstimate: '30-60 minutes for first product catalog',
      },
      color: 'from-purple-500 to-pink-600',
    },
    {
      number: 3,
      icon: BarChart3,
      title: 'Monitor Performance',
      subtitle: 'Real-time analytics and insights',
      glance: 'Track sales and discover trends',
      scan: [
        'Dashboard with key performance indicators',
        'Category-level sales analysis',
        'Customer behavior insights',
        'Inventory alerts and recommendations',
      ],
      study: {
        features: [
          'Revenue by taxonomy category (sunburst charts)',
          'Ingredient popularity trends over time',
          'Professional vs OTC sales breakdown',
          'Customer journey mapping (entry points, cross-category navigation)',
          'Competitive benchmarking within categories',
        ],
        timeEstimate: 'Daily monitoring (5-10 minutes)',
      },
      color: 'from-green-500 to-emerald-600',
    },
    {
      number: 4,
      icon: Rocket,
      title: 'Grow Your Business',
      subtitle: 'AI-powered recommendations and marketing',
      glance: 'Reach spa professionals automatically',
      scan: [
        'Featured on homepage and category pages',
        'AI-powered product recommendations',
        'Natural language search visibility',
        'Email marketing to qualified leads',
      ],
      study: {
        features: [
          '13D tensor mathematics for product compatibility matching',
          'Hypergraph interaction analysis for bundle suggestions',
          'Automatic inclusion in "Complete AM/PM Regimen" recommendations',
          'Professional upgrade pathway suggestions (OTC → Professional)',
          'Concern-specific bundle creation',
        ],
        timeEstimate: 'Automated (passive growth)',
      },
      color: 'from-orange-500 to-red-600',
    },
  ];

  const toggleStep = (stepNumber: number) => {
    setExpandedStep(expandedStep === stepNumber ? null : stepNumber);
  };

  return (
    <section className={`curated-workflow py-16 bg-gradient-to-br from-gray-50 to-blue-50 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How Curated by Jade Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From signup to sales in 4 simple steps. Join the marketplace built for professional skincare.
          </p>
        </div>

        {/* Workflow Steps */}
        <div className="max-w-5xl mx-auto space-y-6">
          {steps.map((step) => {
            const Icon = step.icon;
            const isExpanded = expandedStep === step.number;

            return (
              <div
                key={step.number}
                className={`workflow-step bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-2 ${
                  isExpanded ? 'border-blue-400' : 'border-transparent'
                }`}
              >
                {/* Glance Level - Always visible */}
                <div
                  className="step-header p-6 cursor-pointer"
                  onClick={() => toggleStep(step.number)}
                >
                  <div className="flex items-start gap-6">
                    {/* Step number and icon */}
                    <div className="flex-shrink-0">
                      <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} text-white flex items-center justify-center shadow-lg`}>
                        <Icon className="h-8 w-8" />
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-white text-gray-900 rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                          {step.number}
                        </div>
                      </div>
                    </div>

                    {/* Title and subtitle */}
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-lg text-gray-600 mb-2">{step.subtitle}</p>
                      <p className="text-sm text-blue-600 font-medium">{step.glance}</p>
                    </div>

                    {/* Expand/Collapse button */}
                    <button className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      {isExpanded ? (
                        <ChevronUp className="h-6 w-6 text-gray-600" />
                      ) : (
                        <ChevronDown className="h-6 w-6 text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Scan & Study Levels - Expandable */}
                {isExpanded && (
                  <div className="step-details bg-gradient-to-br from-gray-50 to-white p-6 border-t border-gray-200">
                    {/* Scan Level - Key features */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        Key Features
                      </h4>
                      <div className="grid md:grid-cols-2 gap-3">
                        {step.scan.map((feature, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Study Level - Detailed features */}
                    <div className="bg-white rounded-xl p-5 border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                          Advanced Capabilities
                        </h4>
                        <span className="text-sm text-blue-600 font-medium">
                          ⏱️ {step.study.timeEstimate}
                        </span>
                      </div>
                      <ul className="space-y-2">
                        {step.study.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                            <ArrowRight className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link to="/auth/login/curated">
            <Button
              variant="primary"
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold px-10 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Start Your Vendor Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="text-sm text-gray-500 mt-4">
            No credit card required • Free to list products • Only pay when you sell
          </p>
        </div>
      </div>

      <style jsx>{`
        .workflow-step {
          transition: all 0.3s ease;
        }

        .workflow-step:hover {
          transform: translateY(-2px);
        }

        .step-header {
          user-select: none;
        }

        .step-details {
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .step-header {
            padding: 1.25rem;
          }

          .step-details {
            padding: 1.25rem;
          }
        }
      `}</style>
    </section>
  );
};

export default CuratedWorkflow;
