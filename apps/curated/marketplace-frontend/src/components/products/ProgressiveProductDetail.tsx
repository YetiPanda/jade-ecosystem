/**
 * Progressive Product Detail Component
 *
 * Task: Day 4 - ProductDetail Enhancement
 *
 * Enhanced product detail page with smooth progressive disclosure transitions
 * Replaces tab-based interface with fluid animations and keyboard navigation
 *
 * Features:
 * - Smooth transitions between disclosure levels (no tabs)
 * - Keyboard shortcuts (1: Glance, 2: Scan, 3: Study)
 * - Auto-expand to scan after initial view (optional)
 * - Lazy-load study data on demand
 * - Visual progress indicator
 * - Accessible ARIA labels
 */

import React, { useEffect, useState, useCallback } from 'react';
import { ProgressiveContent } from './progressive/ProgressiveContent';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { mapGlanceData, mapScanData, mapStudyData } from '../../utils/productDataAdapter';
import type { Product } from '../../graphql/generated';
import type {
  ProductGlanceData,
  ProductScanData,
  ProductStudyData,
  ProgressiveLevel,
} from './progressive/types';

interface ProgressiveProductDetailProps {
  /** Full GraphQL Product object */
  product: Product;
  /** Initial disclosure level (default: 'glance') */
  initialLevel?: ProgressiveLevel;
  /** Auto-expand to scan after delay (default: false) */
  autoExpand?: boolean;
  /** Auto-expand delay in ms (default: 3000) */
  autoExpandDelay?: number;
  /** Callback when study data needs to be loaded */
  onLoadStudyData?: () => Promise<void>;
  /** Is study data currently loading? */
  studyLoading?: boolean;
}

/**
 * Progress Indicator Component
 * Shows current level and provides navigation
 */
const ProgressIndicator: React.FC<{
  currentLevel: ProgressiveLevel;
  onLevelChange: (level: ProgressiveLevel) => void;
  isTransitioning: boolean;
}> = ({ currentLevel, onLevelChange, isTransitioning }) => {
  const levels = [
    { id: 'glance' as const, label: 'Glance', time: '3s', description: 'Quick Overview' },
    { id: 'scan' as const, label: 'Scan', time: '30s', description: 'Detailed Info' },
    { id: 'study' as const, label: 'Study', time: '5min+', description: 'Professional Data' },
  ];

  return (
    <div className="progress-indicator" role="navigation" aria-label="Disclosure level navigation">
      {levels.map((level, index) => {
        const isActive = currentLevel === level.id;
        const isPast = levels.findIndex(l => l.id === currentLevel) > index;

        return (
          <button
            key={level.id}
            onClick={() => onLevelChange(level.id)}
            disabled={isTransitioning}
            className={`level-button ${isActive ? 'active' : ''} ${isPast ? 'past' : ''}`}
            aria-current={isActive ? 'step' : undefined}
            aria-label={`${level.label}: ${level.description}`}
          >
            <div className="level-number">{index + 1}</div>
            <div className="level-info">
              <div className="level-label">{level.label}</div>
              <div className="level-time">{level.time}</div>
            </div>
          </button>
        );
      })}

      <style jsx>{`
        .progress-indicator {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: linear-gradient(to right, #f9fafb, #ffffff, #f9fafb);
          border-radius: 0.75rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .level-button {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.5rem;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          flex: 1;
          max-width: 200px;
        }

        .level-button:hover:not(:disabled) {
          border-color: #3b82f6;
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(59, 130, 246, 0.1);
        }

        .level-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .level-button.active {
          border-color: #3b82f6;
          background: #eff6ff;
          box-shadow: 0 4px 6px rgba(59, 130, 246, 0.2);
        }

        .level-button.past {
          border-color: #10b981;
          background: #f0fdf4;
        }

        .level-number {
          width: 2rem;
          height: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #e5e7eb;
          border-radius: 50%;
          font-weight: 700;
          font-size: 0.875rem;
          color: #374151;
        }

        .level-button.active .level-number {
          background: #3b82f6;
          color: white;
        }

        .level-button.past .level-number {
          background: #10b981;
          color: white;
        }

        .level-info {
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        .level-label {
          font-weight: 600;
          font-size: 0.875rem;
          color: #111827;
        }

        .level-time {
          font-size: 0.75rem;
          color: #6b7280;
        }

        @media (max-width: 768px) {
          .progress-indicator {
            flex-direction: column;
          }

          .level-button {
            max-width: none;
          }
        }
      `}</style>
    </div>
  );
};

/**
 * Glance Level Renderer
 * Quick 3-second overview
 */
const GlanceRenderer: React.FC<{ data: ProductGlanceData; product: Product }> = ({ data, product }) => {
  return (
    <div className="glance-level">
      <Card>
        <CardHeader>
          <CardTitle>Quick Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Hero Benefit */}
          <div className="hero-section">
            <h3 className="hero-benefit">{data.heroBenefit}</h3>
          </div>

          {/* Price & Rating */}
          <div className="metrics-row">
            <div className="price-display">
              <span className="price-amount">${data.price.toFixed(2)}</span>
              <span className="price-label">Starting Price</span>
            </div>
            {data.rating > 0 && (
              <div className="rating-display">
                <div className="stars">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} className={i < Math.round(data.rating) ? 'filled' : ''}>★</span>
                  ))}
                </div>
                <span className="rating-text">
                  {data.rating.toFixed(1)} ({data.reviewCount} reviews)
                </span>
              </div>
            )}
          </div>

          {/* Stock Status */}
          <div className="stock-status">
            <span className={`status-badge ${data.inStock ? 'in-stock' : 'out-of-stock'}`}>
              {data.inStock ? '✓ In Stock' : '✗ Out of Stock'}
            </span>
          </div>

          {/* Product Image */}
          {data.image && (
            <div className="product-image-container">
              <img
                src={data.image}
                alt={data.name}
                className="product-image"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/600x400?text=Product+Image';
                }}
              />
            </div>
          )}

          {/* Expand Hint */}
          <div className="expand-hint">
            <p>💡 Click "Scan" above or press "2" for detailed ingredients and usage</p>
          </div>
        </CardContent>
      </Card>

      <style jsx>{`
        .glance-level {
          animation: fadeIn 0.5s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .hero-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem;
          border-radius: 0.75rem;
          color: white;
          text-align: center;
        }

        .hero-benefit {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
          line-height: 1.4;
        }

        .metrics-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          background: #f9fafb;
          border-radius: 0.5rem;
        }

        .price-display {
          display: flex;
          flex-direction: column;
        }

        .price-amount {
          font-size: 2.5rem;
          font-weight: 800;
          color: #3b82f6;
          line-height: 1;
        }

        .price-label {
          font-size: 0.875rem;
          color: #6b7280;
          margin-top: 0.25rem;
        }

        .rating-display {
          text-align: right;
        }

        .stars {
          display: flex;
          gap: 0.125rem;
          justify-content: flex-end;
          margin-bottom: 0.25rem;
        }

        .stars span {
          color: #d1d5db;
          font-size: 1.25rem;
        }

        .stars span.filled {
          color: #fbbf24;
        }

        .rating-text {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .stock-status {
          text-align: center;
        }

        .status-badge {
          display: inline-block;
          padding: 0.5rem 1.5rem;
          border-radius: 2rem;
          font-weight: 600;
          font-size: 0.875rem;
        }

        .status-badge.in-stock {
          background: #d1fae5;
          color: #065f46;
        }

        .status-badge.out-of-stock {
          background: #fee2e2;
          color: #991b1b;
        }

        .product-image-container {
          margin-top: 1rem;
        }

        .product-image {
          width: 100%;
          max-height: 400px;
          object-fit: cover;
          border-radius: 0.75rem;
        }

        .expand-hint {
          padding: 1rem;
          background: #fef3c7;
          border-left: 4px solid #f59e0b;
          border-radius: 0.5rem;
          margin-top: 1rem;
        }

        .expand-hint p {
          margin: 0;
          font-size: 0.875rem;
          color: #92400e;
        }

        @media (max-width: 768px) {
          .metrics-row {
            flex-direction: column;
            gap: 1.5rem;
          }

          .rating-display {
            text-align: center;
          }

          .stars {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

/**
 * Scan Level Renderer
 * 30-second detailed evaluation
 */
const ScanRenderer: React.FC<{ data: ProductScanData; product: Product }> = ({ data, product }) => {
  return (
    <div className="scan-level">
      <div className="scan-grid">
        {/* Key Ingredients */}
        <Card>
          <CardHeader>
            <CardTitle>Key Active Ingredients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="ingredients-list">
              {data.keyIngredients.slice(0, 5).map((ing, idx) => (
                <div key={idx} className="ingredient-item">
                  <div className="ingredient-header">
                    <span className="ingredient-name">{ing.name}</span>
                    {ing.isActive && <span className="active-badge">Active</span>}
                  </div>
                  <p className="ingredient-purpose">{ing.purpose}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card>
          <CardHeader>
            <CardTitle>Key Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="benefits-list">
              {data.benefits.slice(0, 5).map((benefit, idx) => (
                <li key={idx}>{benefit}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Brand & Certifications */}
        <Card>
          <CardHeader>
            <CardTitle>Brand & Quality</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="brand-section">
              <h4 className="brand-name">{data.brand.name}</h4>
              {data.certifications.length > 0 && (
                <div className="certifications">
                  {data.certifications.map((cert, idx) => (
                    <span key={idx} className="cert-badge" title={cert.description}>
                      {cert.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Size & Value */}
        <Card>
          <CardHeader>
            <CardTitle>Size & Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="size-info">
              <div className="size-display">
                <span className="size-value">{data.size.value}{data.size.unit}</span>
                <span className="size-label">Product Size</span>
              </div>
              {data.pricePerUnit && (
                <div className="price-per-unit">
                  <span className="unit-price">${data.pricePerUnit.value.toFixed(2)}</span>
                  <span className="unit-label">per {data.size.unit}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deep Dive Hint */}
      <div className="study-hint">
        <p>🔬 Press "3" or click "Study" above for clinical data and professional insights</p>
      </div>

      <style jsx>{`
        .scan-level {
          animation: slideIn 0.5s ease;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .scan-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .ingredients-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .ingredient-item {
          padding: 1rem;
          background: #f9fafb;
          border-radius: 0.5rem;
          border-left: 3px solid #3b82f6;
        }

        .ingredient-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .ingredient-name {
          font-weight: 600;
          color: #111827;
        }

        .active-badge {
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
          background: #dbeafe;
          color: #1e40af;
          border-radius: 0.25rem;
          font-weight: 600;
        }

        .ingredient-purpose {
          font-size: 0.875rem;
          color: #6b7280;
          margin: 0;
        }

        .benefits-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .benefits-list li {
          padding: 0.75rem;
          padding-left: 2rem;
          position: relative;
          border-bottom: 1px solid #e5e7eb;
        }

        .benefits-list li:last-child {
          border-bottom: none;
        }

        .benefits-list li:before {
          content: '✓';
          position: absolute;
          left: 0.5rem;
          color: #10b981;
          font-weight: 700;
          font-size: 1.125rem;
        }

        .brand-section {
          text-align: center;
        }

        .brand-name {
          font-size: 1.5rem;
          font-weight: 700;
          color: #111827;
          margin: 0 0 1rem 0;
        }

        .certifications {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          justify-content: center;
        }

        .cert-badge {
          padding: 0.5rem 1rem;
          background: #10b981;
          color: white;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .size-info {
          display: flex;
          justify-content: space-around;
          text-align: center;
        }

        .size-display, .price-per-unit {
          display: flex;
          flex-direction: column;
        }

        .size-value, .unit-price {
          font-size: 2rem;
          font-weight: 700;
          color: #3b82f6;
        }

        .size-label, .unit-label {
          font-size: 0.875rem;
          color: #6b7280;
          margin-top: 0.25rem;
        }

        .study-hint {
          padding: 1rem;
          background: linear-gradient(to right, #ede9fe, #ddd6fe);
          border-left: 4px solid #8b5cf6;
          border-radius: 0.5rem;
          margin-top: 1.5rem;
        }

        .study-hint p {
          margin: 0;
          font-size: 0.875rem;
          color: #5b21b6;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

/**
 * Study Level Renderer
 * 5+ minute deep dive with clinical data
 */
const StudyRenderer: React.FC<{ data: ProductStudyData; product: Product }> = ({ data, product }) => {
  return (
    <div className="study-level">
      <div className="study-header">
        <h2>Professional & Clinical Data</h2>
        <p>Comprehensive product analysis for informed decision-making</p>
      </div>

      <div className="study-content">
        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle>Product Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="description-text">{data.description}</p>
          </CardContent>
        </Card>

        {/* Clinical Data */}
        {data.clinicalData && (
          <Card>
            <CardHeader>
              <CardTitle>Clinical Studies & Efficacy</CardTitle>
            </CardHeader>
            <CardContent>
              {data.clinicalData.studies.map((study, idx) => (
                <div key={idx} className="clinical-study">
                  <h4>{study.title}</h4>
                  <p className="study-summary">{study.summary}</p>
                  {study.methodology && (
                    <div className="methodology">
                      <strong>Methodology:</strong> {study.methodology}
                    </div>
                  )}
                  <div className="results">
                    <strong>Results:</strong> {study.results}
                  </div>
                  {study.source && (
                    <div className="source">
                      <strong>Source:</strong> {study.source}
                    </div>
                  )}
                </div>
              ))}

              {data.clinicalData.efficacyMetrics && (
                <div className="efficacy-metrics">
                  <h4>Efficacy Metrics</h4>
                  <div className="metrics-grid">
                    {data.clinicalData.efficacyMetrics.map((metric, idx) => (
                      <div key={idx} className="metric-card">
                        <div className="metric-value">{metric.improvement}{metric.unit}</div>
                        <div className="metric-label">{metric.claim}</div>
                        <div className="metric-time">{metric.timeframe}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Usage Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Usage Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="usage-details">
              <div className="usage-row">
                <strong>Frequency:</strong> {data.usage.frequency}
              </div>
              <div className="usage-row">
                <strong>Application:</strong> {data.usage.instructions}
              </div>
              {data.usage.tips && data.usage.tips.length > 0 && (
                <div className="tips-section">
                  <strong>Professional Tips:</strong>
                  <ul>
                    {data.usage.tips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Safety Information */}
        {data.safety && (
          <Card>
            <CardHeader>
              <CardTitle>Safety & Contraindications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="safety-info">
                {data.safety.allergenWarnings && data.safety.allergenWarnings.length > 0 && (
                  <div className="warning-section">
                    <h4>⚠️ Allergen Warnings</h4>
                    <ul>
                      {data.safety.allergenWarnings.map((warning, idx) => (
                        <li key={idx}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {data.safety.contraindications && data.safety.contraindications.length > 0 && (
                  <div className="warning-section">
                    <h4>🚫 Contraindications</h4>
                    <ul>
                      {data.safety.contraindications.map((contra, idx) => (
                        <li key={idx}>{contra}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {data.safety.phLevel && (
                  <div className="ph-level">
                    <strong>pH Level:</strong> {data.safety.phLevel}
                  </div>
                )}

                {data.safety.pregnancySafe !== undefined && (
                  <div className={`pregnancy-${data.safety.pregnancySafe ? 'safe' : 'warning'}`}>
                    {data.safety.pregnancySafe ? '✓ Safe for pregnancy' : '⚠️ Not recommended during pregnancy'}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Full Ingredient List */}
        <Card>
          <CardHeader>
            <CardTitle>Complete Ingredient List (INCI)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="full-ingredients">
              {data.fullIngredientList.map((ingredient, idx) => (
                <div key={idx} className="ingredient-detail">
                  <div className="ingredient-name-row">
                    <span className="name">{ingredient.name}</span>
                    <span className="inci">({ingredient.inci})</span>
                    {ingredient.percentage && (
                      <span className="percentage">{ingredient.percentage}%</span>
                    )}
                  </div>
                  <div className="ingredient-info">
                    <span className="purpose">{ingredient.purpose}</span>
                    {ingredient.isActive && <span className="active-label">Active</span>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Vendor Information */}
        {data.vendor && (
          <Card>
            <CardHeader>
              <CardTitle>Vendor Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="vendor-info">
                <div className="vendor-row">
                  <strong>Vendor:</strong> {data.vendor.name}
                </div>
                <div className="vendor-row">
                  <strong>SKU:</strong> {data.vendor.sku}
                </div>
                {data.vendor.catalogNumber && (
                  <div className="vendor-row">
                    <strong>Catalog #:</strong> {data.vendor.catalogNumber}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <style jsx>{`
        .study-level {
          animation: expandIn 0.6s ease;
        }

        @keyframes expandIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        .study-header {
          text-align: center;
          margin-bottom: 2rem;
          padding: 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 0.75rem;
          color: white;
        }

        .study-header h2 {
          font-size: 2rem;
          margin: 0 0 0.5rem 0;
        }

        .study-header p {
          margin: 0;
          opacity: 0.9;
        }

        .study-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .description-text {
          line-height: 1.8;
          color: #374151;
        }

        .clinical-study {
          padding: 1.5rem;
          background: #f0f9ff;
          border-left: 4px solid #0284c7;
          border-radius: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .clinical-study h4 {
          margin: 0 0 1rem 0;
          color: #0c4a6e;
        }

        .study-summary {
          margin-bottom: 1rem;
          color: #475569;
        }

        .methodology, .results, .source {
          margin-top: 0.75rem;
          font-size: 0.875rem;
          color: #64748b;
        }

        .efficacy-metrics h4 {
          margin: 1.5rem 0 1rem 0;
          color: #111827;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
        }

        .metric-card {
          padding: 1rem;
          background: white;
          border: 2px solid #e0f2fe;
          border-radius: 0.5rem;
          text-align: center;
        }

        .metric-value {
          font-size: 2rem;
          font-weight: 800;
          color: #0284c7;
        }

        .metric-label {
          font-size: 0.875rem;
          color: #475569;
          margin: 0.5rem 0;
        }

        .metric-time {
          font-size: 0.75rem;
          color: #94a3b8;
        }

        .usage-details {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .usage-row {
          padding: 0.75rem;
          background: #f9fafb;
          border-radius: 0.375rem;
        }

        .tips-section {
          margin-top: 1rem;
        }

        .tips-section ul {
          margin-top: 0.5rem;
          padding-left: 1.5rem;
        }

        .safety-info {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .warning-section {
          padding: 1rem;
          background: #fef2f2;
          border-left: 4px solid #dc2626;
          border-radius: 0.5rem;
        }

        .warning-section h4 {
          margin: 0 0 0.75rem 0;
          color: #991b1b;
        }

        .warning-section ul {
          margin: 0;
          padding-left: 1.5rem;
          color: #7f1d1d;
        }

        .ph-level, .pregnancy-safe, .pregnancy-warning {
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          font-weight: 500;
        }

        .ph-level {
          background: #f0f9ff;
          color: #075985;
        }

        .pregnancy-safe {
          background: #f0fdf4;
          color: #166534;
        }

        .pregnancy-warning {
          background: #fef3c7;
          color: #92400e;
        }

        .full-ingredients {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .ingredient-detail {
          padding: 1rem;
          background: #f9fafb;
          border-radius: 0.5rem;
          border-left: 3px solid #8b5cf6;
        }

        .ingredient-name-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .ingredient-name-row .name {
          font-weight: 600;
          color: #111827;
        }

        .ingredient-name-row .inci {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .ingredient-name-row .percentage {
          margin-left: auto;
          font-weight: 600;
          color: #8b5cf6;
        }

        .ingredient-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .ingredient-info .purpose {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .ingredient-info .active-label {
          font-size: 0.75rem;
          padding: 0.125rem 0.5rem;
          background: #ddd6fe;
          color: #5b21b6;
          border-radius: 0.25rem;
          font-weight: 600;
        }

        .vendor-info {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .vendor-row {
          padding: 0.75rem;
          background: #f9fafb;
          border-radius: 0.375rem;
        }
      `}</style>
    </div>
  );
};

/**
 * Main Progressive Product Detail Component
 */
export const ProgressiveProductDetail: React.FC<ProgressiveProductDetailProps> = ({
  product,
  initialLevel = 'glance',
  autoExpand = false,
  autoExpandDelay = 3000,
  onLoadStudyData,
  studyLoading = false,
}) => {
  const [currentLevel, setCurrentLevel] = useState<ProgressiveLevel>(initialLevel);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Map product data
  const glanceData = mapGlanceData(product);
  const scanData = mapScanData(product);
  const studyData = mapStudyData(product);

  // Auto-expand to scan after delay
  useEffect(() => {
    if (autoExpand && currentLevel === 'glance') {
      const timer = setTimeout(() => {
        setCurrentLevel('scan');
      }, autoExpandDelay);

      return () => clearTimeout(timer);
    }
  }, [autoExpand, autoExpandDelay, currentLevel]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isTransitioning) return;

      switch (e.key) {
        case '1':
          setCurrentLevel('glance');
          break;
        case '2':
          setCurrentLevel('scan');
          break;
        case '3':
          setCurrentLevel('study');
          // Load study data if needed
          if (onLoadStudyData && !studyLoading) {
            onLoadStudyData();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isTransitioning, onLoadStudyData, studyLoading]);

  // Handle level change
  const handleLevelChange = useCallback((level: ProgressiveLevel) => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setCurrentLevel(level);

    // Load study data if transitioning to study level
    if (level === 'study' && onLoadStudyData && !studyLoading) {
      onLoadStudyData();
    }

    // Reset transition state
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  }, [isTransitioning, onLoadStudyData, studyLoading]);

  return (
    <div className="progressive-product-detail">
      {/* Progress Indicator */}
      <ProgressIndicator
        currentLevel={currentLevel}
        onLevelChange={handleLevelChange}
        isTransitioning={isTransitioning}
      />

      {/* Progressive Content */}
      <div className="detail-content">
        {currentLevel === 'glance' && <GlanceRenderer data={glanceData} product={product} />}
        {currentLevel === 'scan' && <ScanRenderer data={scanData} product={product} />}
        {currentLevel === 'study' && (
          studyLoading ? (
            <div className="loading-study">
              <div className="spinner" />
              <p>Loading clinical data...</p>
            </div>
          ) : (
            <StudyRenderer data={studyData} product={product} />
          )
        )}
      </div>

      {/* Keyboard Hints */}
      <div className="keyboard-hints">
        <span>Keyboard shortcuts:</span>
        <kbd>1</kbd> Glance
        <kbd>2</kbd> Scan
        <kbd>3</kbd> Study
      </div>

      <style jsx>{`
        .progressive-product-detail {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .detail-content {
          min-height: 400px;
        }

        .loading-study {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem;
          text-align: center;
        }

        .spinner {
          width: 3rem;
          height: 3rem;
          border: 4px solid #e5e7eb;
          border-top-color: #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .loading-study p {
          margin-top: 1rem;
          color: #6b7280;
        }

        .keyboard-hints {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-top: 2rem;
          padding: 1rem;
          background: #f9fafb;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .keyboard-hints kbd {
          padding: 0.25rem 0.5rem;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 0.25rem;
          font-family: monospace;
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        @media (max-width: 768px) {
          .progressive-product-detail {
            padding: 1rem;
          }

          .keyboard-hints {
            flex-wrap: wrap;
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ProgressiveProductDetail;
