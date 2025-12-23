/**
 * Progressive Product Card - Example Implementation
 *
 * Demonstrates how to use the Progressive Disclosure pattern
 * with real product data
 */

import React, { useState } from 'react';
import { ProgressiveContent } from '../ProgressiveContent';
import { ProductGlance } from '../ProductGlance';
import { ProductScan } from '../ProductScan';
import { ProductStudy } from '../ProductStudy';
import type { ProductStudyData, ProgressiveLevel } from '../types';

export interface ProgressiveProductCardProps {
  product: ProductStudyData;
  onLevelChange?: (level: ProgressiveLevel) => void;
  className?: string;
}

/**
 * ProgressiveProductCard - Complete example implementation
 *
 * Usage:
 * ```tsx
 * import { ProgressiveProductCard } from './examples/ProgressiveProductCard';
 * import { mockProductData } from './examples/mockData';
 *
 * function ProductGrid() {
 *   return (
 *     <div className="product-grid">
 *       <ProgressiveProductCard product={mockProductData} />
 *     </div>
 *   );
 * }
 * ```
 */
export function ProgressiveProductCard({
  product,
  onLevelChange,
  className,
}: ProgressiveProductCardProps) {
  const [currentLevel, setCurrentLevel] = useState<ProgressiveLevel>('glance');

  /**
   * Handle level change events
   */
  const handleLevelChange = (level: ProgressiveLevel) => {
    setCurrentLevel(level);
    if (onLevelChange) {
      onLevelChange(level);
    }

    // Optional: Analytics tracking
    console.log(`Product ${product.id} disclosure level changed to: ${level}`);
  };

  return (
    <ProgressiveContent
      data={product}
      glanceRenderer={(data) => <ProductGlance data={data} />}
      scanRenderer={(data) => <ProductScan data={data} />}
      studyRenderer={(data) => <ProductStudy data={data} />}
      initialLevel="glance"
      transitionDuration={300}
      onLevelChange={handleLevelChange}
      className={className}
    />
  );
}

/**
 * Product Grid Example - Multiple cards with progressive disclosure
 */
export interface ProductGridProps {
  products: ProductStudyData[];
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '2rem',
        padding: '2rem',
      }}
    >
      {products.map((product) => (
        <ProgressiveProductCard
          key={product.id}
          product={product}
          onLevelChange={(level) => {
            console.log(`Product ${product.id} is now at ${level} level`);
          }}
        />
      ))}
    </div>
  );
}

/**
 * Demo Page - Complete demonstration with all features
 */
export function ProgressiveDisclosureDemo() {
  const [activeLevels, setActiveLevels] = useState<Record<string, ProgressiveLevel>>({});

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
          Progressive Disclosure Pattern Demo
        </h1>
        <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
          Hover over cards to reveal more details. Click for comprehensive analysis.
        </p>
      </header>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
          Interaction Guide
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          <div
            style={{
              padding: '1.5rem',
              background: '#f3f4f6',
              borderRadius: '0.5rem',
              borderLeft: '4px solid #2563eb',
            }}
          >
            <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
              =A Glance (Default)
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>
              Quick 3-second view with essential info: image, name, price, rating
            </p>
          </div>
          <div
            style={{
              padding: '1.5rem',
              background: '#f3f4f6',
              borderRadius: '0.5rem',
              borderLeft: '4px solid #10b981',
            }}
          >
            <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
              = Scan (Hover)
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>
              30-second evaluation with ingredients, benefits, certifications
            </p>
          </div>
          <div
            style={{
              padding: '1.5rem',
              background: '#f3f4f6',
              borderRadius: '0.5rem',
              borderLeft: '4px solid #f59e0b',
            }}
          >
            <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
              =Ê Study (Click)
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>
              5+ minute deep dive with clinical data, full ingredients, safety info
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
          Active Disclosure Levels
        </h2>
        <div
          style={{
            padding: '1rem',
            background: '#f9fafb',
            borderRadius: '0.5rem',
            marginBottom: '2rem',
            fontFamily: 'monospace',
            fontSize: '0.875rem',
          }}
        >
          {Object.keys(activeLevels).length === 0 ? (
            <p style={{ color: '#6b7280' }}>No products expanded yet...</p>
          ) : (
            <pre>{JSON.stringify(activeLevels, null, 2)}</pre>
          )}
        </div>
      </section>
    </div>
  );
}

/**
 * Default export for convenience
 */
export default ProgressiveProductCard;
