/**
 * Progressive Disclosure Component
 *
 * Displays product information in three levels: Glance, Scan, Study
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import type { GetProductWithFullDetailsQuery } from '../../graphql/generated';

type Product = NonNullable<GetProductWithFullDetailsQuery['product']>;

interface ProgressiveDisclosureProps {
  product: Product;
}

type DisclosureLevel = 'glance' | 'scan' | 'study';

export const ProgressiveDisclosure: React.FC<ProgressiveDisclosureProps> = ({ product }) => {
  const [activeLevel, setActiveLevel] = useState<DisclosureLevel>('glance');

  const tabs = [
    { id: 'glance' as const, label: 'Glance', description: 'Quick Overview' },
    { id: 'scan' as const, label: 'Scan', description: 'Detailed Info' },
    { id: 'study' as const, label: 'Study', description: 'Professional Data' },
  ];

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveLevel(tab.id)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeLevel === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <div className="flex flex-col items-center">
                <span className="font-semibold">{tab.label}</span>
                <span className="text-xs">{tab.description}</span>
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeLevel === 'glance' && <GlanceLevel product={product} />}
        {activeLevel === 'scan' && <ScanLevel product={product} />}
        {activeLevel === 'study' && <StudyLevel product={product} />}
      </div>
    </div>
  );
};

// Glance Level Component
const GlanceLevel: React.FC<{ product: Product }> = ({ product }) => {
  const { glance } = product;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quick Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Hero Benefit */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{glance.heroBenefit}</h3>
          </div>

          {/* Price & Rating */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-3xl font-bold text-primary-600">
                ${glance.price.amount}
              </span>
              <span className="text-gray-500 ml-2">{glance.price.currency}</span>
            </div>
            {glance.rating && (
              <div className="flex items-center">
                <span className="text-yellow-400 text-2xl">★</span>
                <span className="text-xl font-semibold ml-1">{glance.rating.toFixed(1)}</span>
                {glance.reviewCount && (
                  <span className="text-gray-500 ml-2">({glance.reviewCount} reviews)</span>
                )}
              </div>
            )}
          </div>

          {/* Skin Types */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Suitable For:</h4>
            <div className="flex flex-wrap gap-2">
              {glance.skinTypes.map((type) => (
                <span
                  key={type}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {type.replace('_', ' ')}
                </span>
              ))}
            </div>
          </div>

          {/* Thumbnail */}
          {glance.thumbnail && (
            <div className="mt-4">
              <img
                src={glance.thumbnail}
                alt="Product thumbnail"
                className="w-full h-64 object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Product+Image';
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Scan Level Component
const ScanLevel: React.FC<{ product: Product }> = ({ product }) => {
  const { scan } = product;

  return (
    <div className="space-y-6">
      {/* Usage Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <span className="font-medium text-gray-700">Application: </span>
            <span className="text-gray-600">{scan.usageInstructions.application}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Frequency: </span>
            <span className="text-gray-600">{scan.usageInstructions.frequency}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Time of Day: </span>
            <span className="text-gray-600">{scan.usageInstructions.timeOfDay}</span>
          </div>
          {scan.usageInstructions.patchTestRequired && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ Patch test recommended before first use
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Key Actives */}
      <Card>
        <CardHeader>
          <CardTitle>Key Active Ingredients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {scan.keyActives.map((active, idx) => (
              <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-900">{active.name}</h4>
                    <p className="text-sm text-gray-600">{active.type}</p>
                  </div>
                  <span className="text-sm font-medium text-primary-600">
                    {active.concentration}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Full Ingredient List */}
      <Card>
        <CardHeader>
          <CardTitle>Complete Ingredient List (INCI)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {scan.ingredients.inci.map((ingredient, idx) => (
              <div key={idx} className="border-b border-gray-100 pb-2 last:border-0">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <span className="font-medium text-gray-900">{ingredient.name}</span>
                    <span className="text-sm text-gray-500 ml-2">({ingredient.function})</span>
                  </div>
                  {ingredient.concentration && (
                    <span className="text-sm text-gray-600">{ingredient.concentration}%</span>
                  )}
                </div>
                {ingredient.warnings && ingredient.warnings.length > 0 && (
                  <div className="mt-1">
                    {ingredient.warnings.map((warning, wIdx) => (
                      <p key={wIdx} className="text-xs text-orange-600">
                        ⚠️ {warning}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Product Attributes */}
          <div className="mt-4 flex gap-2">
            {scan.ingredients.vegan && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                🌱 Vegan
              </span>
            )}
            {scan.ingredients.crueltyFree && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                🐰 Cruelty-Free
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Warnings */}
      {scan.warnings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Important Warnings</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1">
              {scan.warnings.map((warning, idx) => (
                <li key={idx} className="text-gray-700">
                  {warning}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Image Gallery */}
      {scan.images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Product Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {scan.images.map((image, idx) => (
                <img
                  key={idx}
                  src={image}
                  alt={`Product image ${idx + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Image';
                  }}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Study Level Component
const StudyLevel: React.FC<{ product: Product }> = ({ product }) => {
  const { study } = product;

  if (!study) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">Professional study data not available for this product</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Formulation Science */}
      {study.formulationScience && (
        <Card>
          <CardHeader>
            <CardTitle>Formulation Science</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{study.formulationScience}</p>
          </CardContent>
        </Card>
      )}

      {/* Clinical Trials */}
      {study.clinicalData?.trials && study.clinicalData.trials.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Clinical Studies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {study.clinicalData.trials.map((trial, idx) => (
                <div key={idx} className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">{trial.studyName}</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                    <div>
                      <span className="text-gray-600">Participants:</span>
                      <span className="ml-2 font-medium">{trial.participants}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Duration:</span>
                      <span className="ml-2 font-medium">{trial.duration}</span>
                    </div>
                  </div>
                  <p className="text-gray-700">{trial.results}</p>
                  {trial.publicationUrl && (
                    <a
                      href={trial.publicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 text-sm hover:underline mt-2 inline-block"
                    >
                      View Publication →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Certifications */}
      {study.clinicalData?.certifications && study.clinicalData.certifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Certifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {study.clinicalData.certifications.map((cert, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                >
                  ✓ {cert}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Application Steps */}
      {study.detailedSteps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Detailed Application Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2">
              {study.detailedSteps.map((step, idx) => (
                <li key={idx} className="text-gray-700">
                  {step}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}

      {/* Expected Results */}
      <Card>
        <CardHeader>
          <CardTitle>Expected Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-gray-700">{study.expectedResults}</p>
          <div className="p-3 bg-purple-50 rounded-lg">
            <span className="font-medium text-gray-700">Time to Results: </span>
            <span className="text-purple-700">{study.timeToResults}</span>
          </div>
        </CardContent>
      </Card>

      {/* Contraindications */}
      {study.contraindications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Contraindications</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1">
              {study.contraindications.map((contra, idx) => (
                <li key={idx} className="text-red-700">
                  {contra}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Professional Notes */}
      {study.professionalNotes && (
        <Card>
          <CardHeader>
            <CardTitle>Professional Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 italic">{study.professionalNotes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProgressiveDisclosure;
