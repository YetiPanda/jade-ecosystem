/**
 * Training Resources Component
 * Week 4 Day 5: Provides educational content and training for vendors
 */

import { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: 'getting-started' | 'product-submission' | 'taxonomy' | 'best-practices';
  completed: boolean;
  content: TrainingContent[];
}

interface TrainingContent {
  type: 'text' | 'video' | 'quiz' | 'checklist';
  title: string;
  content: string;
  items?: string[];
}

const TRAINING_MODULES: TrainingModule[] = [
  {
    id: 'getting-started',
    title: 'Getting Started as a Vendor',
    description: 'Learn the basics of selling on our platform',
    duration: '10 min',
    category: 'getting-started',
    completed: false,
    content: [
      {
        type: 'text',
        title: 'Welcome to the Vendor Portal',
        content:
          'As a vendor on our platform, you have access to powerful tools to manage your products, track performance, and grow your business in the professional skincare market.',
      },
      {
        type: 'checklist',
        title: 'Getting Started Checklist',
        content: 'Complete these steps to set up your vendor account:',
        items: [
          'Complete your vendor profile',
          'Add your business information and branding',
          'Review platform policies and guidelines',
          'Submit your first product',
          'Set up payment and shipping preferences',
        ],
      },
    ],
  },
  {
    id: 'product-submission',
    title: 'Product Submission Best Practices',
    description: 'How to create compelling product listings',
    duration: '15 min',
    category: 'product-submission',
    completed: false,
    content: [
      {
        type: 'text',
        title: 'Creating Quality Product Listings',
        content:
          'High-quality product listings help customers find and understand your products. Follow these guidelines to create listings that convert.',
      },
      {
        type: 'checklist',
        title: 'Product Information Essentials',
        content: 'Every product listing should include:',
        items: [
          'Clear, descriptive product name (50-100 characters)',
          'Detailed description highlighting key benefits (200+ words)',
          'Accurate wholesale pricing',
          'High-resolution product images (minimum 1000x1000px)',
          'Complete INCI ingredient list',
          'Clear usage instructions',
        ],
      },
      {
        type: 'text',
        title: 'Writing Effective Descriptions',
        content:
          'Focus on benefits, not just features. Describe how your product solves specific skin concerns. Use professional language appropriate for licensed practitioners.',
      },
    ],
  },
  {
    id: 'taxonomy-guide',
    title: 'Understanding Product Taxonomy',
    description: 'Master the art of product categorization',
    duration: '20 min',
    category: 'taxonomy',
    completed: false,
    content: [
      {
        type: 'text',
        title: 'Why Taxonomy Matters',
        content:
          'Accurate product taxonomy ensures your products appear in relevant searches and recommendations. This directly impacts your product visibility and sales.',
      },
      {
        type: 'text',
        title: 'Product Functions',
        content:
          'Functions describe what your product does (e.g., Hydrate, Exfoliate, Protect). Select 1-5 functions that best represent your product\'s primary benefits. More isn\'t always better - focus on the core functions.',
      },
      {
        type: 'text',
        title: 'Skin Concerns',
        content:
          'Concerns represent the skin issues your product addresses (e.g., Acne, Aging, Hyperpigmentation). You can select up to 8 concerns, but typically 2-4 is most effective.',
      },
      {
        type: 'text',
        title: 'Target Areas',
        content:
          'Specify which areas of the body your product is designed for (e.g., Face, Eyes, Body). Select 1-4 target areas based on intended use.',
      },
      {
        type: 'checklist',
        title: 'Taxonomy Best Practices',
        content: 'Follow these guidelines:',
        items: [
          'Be specific but not overly broad',
          'Consider your product from the customer\'s perspective',
          'Focus on primary benefits, not secondary effects',
          'Use the taxonomy wizard for guided selection',
          'Review similar products for reference',
        ],
      },
    ],
  },
  {
    id: 'quality-standards',
    title: 'Quality Standards and Compliance',
    description: 'Meet platform quality requirements',
    duration: '12 min',
    category: 'best-practices',
    completed: false,
    content: [
      {
        type: 'text',
        title: 'Platform Quality Standards',
        content:
          'Our platform maintains high quality standards to ensure customer trust and satisfaction. All products must meet these requirements to be approved.',
      },
      {
        type: 'checklist',
        title: 'Required Product Information',
        content: 'Every product must include:',
        items: [
          'Complete and accurate INCI ingredient list',
          'Concentration percentages for key actives',
          'Clear usage instructions and frequency',
          'Appropriate warnings and precautions',
          'Professional-grade product images',
          'Accurate taxonomy selections',
        ],
      },
      {
        type: 'text',
        title: 'Image Guidelines',
        content:
          'Product images should be high-resolution (minimum 1000x1000px), well-lit, and show the product clearly. Include multiple angles and lifestyle shots when possible.',
      },
      {
        type: 'text',
        title: 'Content Guidelines',
        content:
          'All product content should be accurate, professional, and appropriate for licensed practitioners. Avoid making unsubstantiated claims or medical claims.',
      },
    ],
  },
];

export function TrainingResources() {
  const [selectedModule, setSelectedModule] = useState<TrainingModule | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const filteredModules =
    filter === 'all'
      ? TRAINING_MODULES
      : TRAINING_MODULES.filter((module) => module.category === filter);

  const completedCount = TRAINING_MODULES.filter((m) => m.completed).length;
  const totalCount = TRAINING_MODULES.length;

  if (selectedModule) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Button variant="outline" onClick={() => setSelectedModule(null)} className="mb-4">
          ← Back to Training
        </Button>

        <Card className="p-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold">{selectedModule.title}</h1>
              <span className="text-sm text-gray-500">{selectedModule.duration}</span>
            </div>
            <p className="text-gray-600">{selectedModule.description}</p>
          </div>

          <div className="space-y-8">
            {selectedModule.content.map((section, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-6 py-2">
                <h2 className="text-xl font-semibold mb-3">{section.title}</h2>

                {section.type === 'text' && (
                  <p className="text-gray-700 leading-relaxed">{section.content}</p>
                )}

                {section.type === 'checklist' && (
                  <div>
                    <p className="text-gray-700 mb-3">{section.content}</p>
                    <ul className="space-y-2">
                      {section.items?.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start">
                          <span className="text-green-500 mr-3 mt-1">✓</span>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {section.type === 'video' && (
                  <div className="bg-gray-100 rounded-lg p-8 text-center">
                    <svg
                      className="w-16 h-16 mx-auto text-gray-400 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-gray-600">Video content coming soon</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t">
            <Button
              onClick={() => {
                // Mark as complete
                setSelectedModule(null);
              }}
              className="w-full"
            >
              Mark as Complete
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Training Resources</h1>
        <p className="text-gray-600">
          Learn best practices for creating quality product listings and growing your business
        </p>
      </div>

      {/* Progress Overview */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold">Your Progress</h2>
            <p className="text-gray-600 text-sm">
              {completedCount} of {totalCount} modules completed
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">
              {Math.round((completedCount / totalCount) * 100)}%
            </div>
            <p className="text-sm text-gray-600">Complete</p>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${(completedCount / totalCount) * 100}%` }}
          />
        </div>
      </Card>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        {[
          { id: 'all', label: 'All Modules' },
          { id: 'getting-started', label: 'Getting Started' },
          { id: 'product-submission', label: 'Product Submission' },
          { id: 'taxonomy', label: 'Taxonomy' },
          { id: 'best-practices', label: 'Best Practices' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              filter === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Training Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredModules.map((module) => (
          <Card
            key={module.id}
            className={`p-6 hover:shadow-lg transition-shadow cursor-pointer ${
              module.completed ? 'border-2 border-green-500' : ''
            }`}
            onClick={() => setSelectedModule(module)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">{module.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{module.description}</p>
              </div>
              {module.completed && (
                <div className="ml-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-500">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {module.duration}
              </div>
              <Button variant="outline" size="sm">
                {module.completed ? 'Review' : 'Start'}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Help Section */}
      <Card className="mt-8 p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Need Help?</h3>
            <p className="text-blue-800 text-sm mb-3">
              If you have questions or need assistance, our vendor support team is here to help.
            </p>
            <Button variant="outline" size="sm">
              Contact Support
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
