/**
 * Taxonomy Quality Control Dashboard
 * Week 3 Day 5: Admin dashboard for monitoring taxonomy completeness
 *
 * Features:
 * - Overall taxonomy statistics
 * - Completeness score distribution
 * - Products needing taxonomy improvements
 * - Category coverage analysis
 * - Quality trend charts
 */

import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_TAXONOMY_STATS, GET_PRODUCT_TAXONOMIES } from '../../graphql/taxonomy.queries';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

interface TaxonomyStats {
  totalProducts: number;
  averageCompletenessScore: number;
  categoryCounts: Array<{
    categoryId: string;
    count: number;
  }>;
}

type FilterLevel = 'all' | 'excellent' | 'good' | 'fair' | 'poor';

export function TaxonomyQualityDashboard() {
  const [filterLevel, setFilterLevel] = useState<FilterLevel>('all');

  const { data: statsData, loading: statsLoading, error: statsError } = useQuery(GET_TAXONOMY_STATS);

  const {
    data: taxonomiesData,
    loading: taxonomiesLoading,
    refetch: refetchTaxonomies,
  } = useQuery(GET_PRODUCT_TAXONOMIES, {
    variables: {
      filter: getFilterForLevel(filterLevel),
    },
  });

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading taxonomy statistics...</p>
        </div>
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6 max-w-md">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{statsError.message}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </Card>
      </div>
    );
  }

  const stats: TaxonomyStats = statsData?.taxonomyStats || {
    totalProducts: 0,
    averageCompletenessScore: 0,
    categoryCounts: [],
  };

  // Calculate distribution
  const excellent = taxonomiesData?.productTaxonomies?.filter(
    (t: any) => t.taxonomyCompletenessScore >= 90
  ).length || 0;
  const good = taxonomiesData?.productTaxonomies?.filter(
    (t: any) => t.taxonomyCompletenessScore >= 70 && t.taxonomyCompletenessScore < 90
  ).length || 0;
  const fair = taxonomiesData?.productTaxonomies?.filter(
    (t: any) => t.taxonomyCompletenessScore >= 50 && t.taxonomyCompletenessScore < 70
  ).length || 0;
  const poor = taxonomiesData?.productTaxonomies?.filter(
    (t: any) => t.taxonomyCompletenessScore < 50
  ).length || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Taxonomy Quality Dashboard</h1>
        <p className="text-gray-600">
          Monitor and improve product taxonomy completeness across the marketplace
        </p>
      </div>

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total Products</h3>
            <span className="text-2xl">📦</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
          <p className="text-sm text-gray-500 mt-1">With taxonomy data</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Avg. Completeness</h3>
            <span className="text-2xl">📊</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {Math.round(stats.averageCompletenessScore)}%
          </p>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={cn(
                  'h-2 rounded-full transition-all',
                  stats.averageCompletenessScore >= 90
                    ? 'bg-green-600'
                    : stats.averageCompletenessScore >= 70
                    ? 'bg-blue-600'
                    : stats.averageCompletenessScore >= 50
                    ? 'bg-yellow-600'
                    : 'bg-red-600'
                )}
                style={{ width: `${stats.averageCompletenessScore}%` }}
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Categories</h3>
            <span className="text-2xl">🏷️</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.categoryCounts.length}</p>
          <p className="text-sm text-gray-500 mt-1">Active categories</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Quality Score</h3>
            <span className="text-2xl">⭐</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {getOverallQualityGrade(stats.averageCompletenessScore)}
          </p>
          <p className="text-sm text-gray-500 mt-1">Overall grade</p>
        </Card>
      </div>

      {/* Completeness Distribution */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Completeness Score Distribution</h2>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <button
            onClick={() => setFilterLevel('excellent')}
            className={cn(
              'p-4 rounded-lg border-2 transition-all',
              filterLevel === 'excellent'
                ? 'border-green-600 bg-green-50'
                : 'border-gray-200 hover:border-green-300'
            )}
          >
            <div className="text-sm font-medium text-gray-600 mb-1">Excellent (90-100)</div>
            <div className="text-2xl font-bold text-green-600">{excellent}</div>
            <div className="text-xs text-gray-500 mt-1">
              {stats.totalProducts > 0 ? Math.round((excellent / stats.totalProducts) * 100) : 0}%
            </div>
          </button>

          <button
            onClick={() => setFilterLevel('good')}
            className={cn(
              'p-4 rounded-lg border-2 transition-all',
              filterLevel === 'good'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            )}
          >
            <div className="text-sm font-medium text-gray-600 mb-1">Good (70-89)</div>
            <div className="text-2xl font-bold text-blue-600">{good}</div>
            <div className="text-xs text-gray-500 mt-1">
              {stats.totalProducts > 0 ? Math.round((good / stats.totalProducts) * 100) : 0}%
            </div>
          </button>

          <button
            onClick={() => setFilterLevel('fair')}
            className={cn(
              'p-4 rounded-lg border-2 transition-all',
              filterLevel === 'fair'
                ? 'border-yellow-600 bg-yellow-50'
                : 'border-gray-200 hover:border-yellow-300'
            )}
          >
            <div className="text-sm font-medium text-gray-600 mb-1">Fair (50-69)</div>
            <div className="text-2xl font-bold text-yellow-600">{fair}</div>
            <div className="text-xs text-gray-500 mt-1">
              {stats.totalProducts > 0 ? Math.round((fair / stats.totalProducts) * 100) : 0}%
            </div>
          </button>

          <button
            onClick={() => setFilterLevel('poor')}
            className={cn(
              'p-4 rounded-lg border-2 transition-all',
              filterLevel === 'poor'
                ? 'border-red-600 bg-red-50'
                : 'border-gray-200 hover:border-red-300'
            )}
          >
            <div className="text-sm font-medium text-gray-600 mb-1">Poor (0-49)</div>
            <div className="text-2xl font-bold text-red-600">{poor}</div>
            <div className="text-xs text-gray-500 mt-1">
              {stats.totalProducts > 0 ? Math.round((poor / stats.totalProducts) * 100) : 0}%
            </div>
          </button>
        </div>

        {filterLevel !== 'all' && (
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              Showing products with {getFilterLevelName(filterLevel)} completeness
            </p>
            <Button variant="outline" size="sm" onClick={() => setFilterLevel('all')}>
              Clear Filter
            </Button>
          </div>
        )}
      </Card>

      {/* Category Coverage */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Category Coverage</h2>

        <div className="space-y-3">
          {stats.categoryCounts.length > 0 ? (
            stats.categoryCounts.map((categoryCount) => (
              <div key={categoryCount.categoryId} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      Category {categoryCount.categoryId}
                    </span>
                    <span className="text-sm text-gray-500">{categoryCount.count} products</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min((categoryCount.count / stats.totalProducts) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No category data available</p>
          )}
        </div>
      </Card>

      {/* Action Items */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommended Actions</h2>

        <div className="space-y-3">
          {poor > 0 && (
            <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
              <span className="text-2xl">⚠️</span>
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 mb-1">Critical: Poor Taxonomy Quality</h3>
                <p className="text-sm text-red-700 mb-2">
                  {poor} products have completeness scores below 50%. These should be prioritized for
                  taxonomy improvements.
                </p>
                <Button variant="outline" size="sm" onClick={() => setFilterLevel('poor')}>
                  View Products
                </Button>
              </div>
            </div>
          )}

          {fair > 0 && (
            <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <span className="text-2xl">📝</span>
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-900 mb-1">Improve Fair Quality Products</h3>
                <p className="text-sm text-yellow-700 mb-2">
                  {fair} products have fair completeness (50-69%). Adding missing taxonomy data can
                  improve discoverability.
                </p>
                <Button variant="outline" size="sm" onClick={() => setFilterLevel('fair')}>
                  View Products
                </Button>
              </div>
            </div>
          )}

          {excellent + good === stats.totalProducts && stats.totalProducts > 0 && (
            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
              <span className="text-2xl">✅</span>
              <div className="flex-1">
                <h3 className="font-semibold text-green-900 mb-1">Excellent Work!</h3>
                <p className="text-sm text-green-700">
                  All products have good or excellent taxonomy quality. Keep up the great work!
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

// Helper Functions

function getFilterForLevel(level: FilterLevel) {
  switch (level) {
    case 'excellent':
      return { minCompletenessScore: 90 };
    case 'good':
      return { minCompletenessScore: 70, maxCompletenessScore: 89 };
    case 'fair':
      return { minCompletenessScore: 50, maxCompletenessScore: 69 };
    case 'poor':
      return { maxCompletenessScore: 49 };
    default:
      return {};
  }
}

function getFilterLevelName(level: FilterLevel): string {
  const names: Record<FilterLevel, string> = {
    all: 'all',
    excellent: 'excellent',
    good: 'good',
    fair: 'fair',
    poor: 'poor',
  };
  return names[level];
}

function getOverallQualityGrade(score: number): string {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}
