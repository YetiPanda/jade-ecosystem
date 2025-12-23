/**
 * Progressive Disclosure - Study Level Component
 *
 * 5+ minute deep dive: Comprehensive clinical and scientific data
 * - Everything from Scan level
 * - Full ingredient list with INCI names
 * - Clinical studies and efficacy data
 * - Detailed usage instructions
 * - Safety information
 * - Professional recommendations
 * - Treatment protocol integration
 */

import React, { useState } from 'react';
import type { ProductStudyData } from './types';

export interface ProductStudyProps {
  data: ProductStudyData;
  className?: string;
}

/**
 * ProductStudy - Comprehensive product analysis
 *
 * Design principles:
 * - Tabbed interface for organized navigation
 * - Scientific rigor with citations
 * - Professional-grade detail
 * - Decision-making support
 */
export function ProductStudy({ data, className = '' }: ProductStudyProps) {
  const {
    name,
    description,
    fullIngredientList,
    clinicalData,
    usage,
    protocols,
    safety,
    professionalNotes,
    vendor,
  } = data;

  // Tab state management
  const [activeTab, setActiveTab] = useState<'overview' | 'ingredients' | 'clinical' | 'usage' | 'professional'>('overview');

  /**
   * Render Overview Tab
   */
  const renderOverviewTab = () => (
    <div className="product-study__tab-content">
      <h4 className="product-study__section-title">Product Description</h4>
      <p className="product-study__description">{description}</p>

      {protocols && protocols.length > 0 && (
        <div className="product-study__protocols">
          <h4 className="product-study__section-title">Treatment Protocols</h4>
          <div className="product-study__protocols-list">
            {protocols.map((protocol) => (
              <div key={protocol.id} className="product-study__protocol">
                <span className="product-study__protocol-name">{protocol.name}</span>
                <span className="product-study__protocol-role">{protocol.role}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {vendor && (
        <div className="product-study__vendor">
          <h4 className="product-study__section-title">Vendor Information</h4>
          <div className="product-study__vendor-info">
            <p><strong>Vendor:</strong> {vendor.name}</p>
            <p><strong>SKU:</strong> {vendor.sku}</p>
            {vendor.catalogNumber && (
              <p><strong>Catalog #:</strong> {vendor.catalogNumber}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );

  /**
   * Render Ingredients Tab
   */
  const renderIngredientsTab = () => (
    <div className="product-study__tab-content">
      <h4 className="product-study__section-title">Complete Ingredient List</h4>
      <p className="product-study__ingredients-note">
        Listed in order of concentration. Active ingredients are highlighted.
      </p>
      <div className="product-study__ingredients-table">
        {fullIngredientList.map((ingredient, index) => (
          <div
            key={index}
            className={`product-study__ingredient-row ${
              ingredient.isActive ? 'product-study__ingredient-row--active' : ''
            }`}
          >
            <div className="product-study__ingredient-main">
              <span className="product-study__ingredient-name">
                {ingredient.name}
                {ingredient.isActive && (
                  <span className="product-study__ingredient-badge">Active</span>
                )}
              </span>
              <span className="product-study__ingredient-inci">
                INCI: {ingredient.inci}
              </span>
            </div>
            <div className="product-study__ingredient-details">
              {ingredient.percentage && (
                <span className="product-study__ingredient-percentage">
                  {ingredient.percentage}%
                </span>
              )}
              <span className="product-study__ingredient-purpose">
                {ingredient.purpose}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  /**
   * Render Clinical Data Tab
   */
  const renderClinicalTab = () => (
    <div className="product-study__tab-content">
      {clinicalData?.studies && clinicalData.studies.length > 0 && (
        <div className="product-study__clinical-studies">
          <h4 className="product-study__section-title">Clinical Studies</h4>
          {clinicalData.studies.map((study, index) => (
            <div key={index} className="product-study__study">
              <h5 className="product-study__study-title">{study.title}</h5>
              <p className="product-study__study-summary">{study.summary}</p>
              {study.methodology && (
                <div className="product-study__study-methodology">
                  <strong>Methodology:</strong> {study.methodology}
                </div>
              )}
              <div className="product-study__study-results">
                <strong>Results:</strong> {study.results}
              </div>
              {study.source && (
                <div className="product-study__study-source">
                  <em>Source: {study.source}</em>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {clinicalData?.efficacyMetrics && clinicalData.efficacyMetrics.length > 0 && (
        <div className="product-study__efficacy">
          <h4 className="product-study__section-title">Efficacy Metrics</h4>
          <div className="product-study__metrics-grid">
            {clinicalData.efficacyMetrics.map((metric, index) => (
              <div key={index} className="product-study__metric">
                <div className="product-study__metric-claim">{metric.claim}</div>
                <div className="product-study__metric-value">
                  {metric.improvement > 0 ? '+' : ''}
                  {metric.improvement}
                  {metric.unit}
                </div>
                <div className="product-study__metric-timeframe">{metric.timeframe}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!clinicalData?.studies && !clinicalData?.efficacyMetrics && (
        <p className="product-study__no-data">No clinical data available for this product.</p>
      )}
    </div>
  );

  /**
   * Render Usage Instructions Tab
   */
  const renderUsageTab = () => (
    <div className="product-study__tab-content">
      <h4 className="product-study__section-title">How to Use</h4>

      <div className="product-study__usage-frequency">
        <strong>Frequency:</strong> {usage.frequency}
      </div>

      <div className="product-study__usage-instructions">
        <strong>Instructions:</strong>
        <p>{usage.instructions}</p>
      </div>

      {usage.tips && usage.tips.length > 0 && (
        <div className="product-study__usage-tips">
          <strong>Professional Tips:</strong>
          <ul>
            {usage.tips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {usage.warnings && usage.warnings.length > 0 && (
        <div className="product-study__usage-warnings">
          <strong>  Warnings:</strong>
          <ul>
            {usage.warnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </div>
      )}

      {safety && (
        <div className="product-study__safety">
          <h4 className="product-study__section-title">Safety Information</h4>

          {safety.phLevel && (
            <p><strong>pH Level:</strong> {safety.phLevel}</p>
          )}

          {safety.pregnancySafe !== undefined && (
            <p>
              <strong>Pregnancy Safe:</strong>{' '}
              {safety.pregnancySafe ? ' Yes' : ' Consult physician'}
            </p>
          )}

          {safety.allergenWarnings && safety.allergenWarnings.length > 0 && (
            <div className="product-study__allergens">
              <strong>Allergen Warnings:</strong>
              <ul>
                {safety.allergenWarnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </div>
          )}

          {safety.contraindications && safety.contraindications.length > 0 && (
            <div className="product-study__contraindications">
              <strong>Contraindications:</strong>
              <ul>
                {safety.contraindications.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );

  /**
   * Render Professional Notes Tab
   */
  const renderProfessionalTab = () => (
    <div className="product-study__tab-content">
      <h4 className="product-study__section-title">Professional Recommendations</h4>

      {professionalNotes?.bestFor && professionalNotes.bestFor.length > 0 && (
        <div className="product-study__best-for">
          <strong>Best For:</strong>
          <ul>
            {professionalNotes.bestFor.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {professionalNotes?.pairsWith && professionalNotes.pairsWith.length > 0 && (
        <div className="product-study__pairs-with">
          <strong> Pairs Well With:</strong>
          <ul>
            {professionalNotes.pairsWith.map((productId, index) => (
              <li key={index}>Product ID: {productId}</li>
            ))}
          </ul>
        </div>
      )}

      {professionalNotes?.avoidWith && professionalNotes.avoidWith.length > 0 && (
        <div className="product-study__avoid-with">
          <strong> Avoid Using With:</strong>
          <ul>
            {professionalNotes.avoidWith.map((productId, index) => (
              <li key={index}>Product ID: {productId}</li>
            ))}
          </ul>
        </div>
      )}

      {professionalNotes?.notes && (
        <div className="product-study__professional-notes">
          <strong>Additional Notes:</strong>
          <p>{professionalNotes.notes}</p>
        </div>
      )}

      {!professionalNotes && (
        <p className="product-study__no-data">No professional notes available for this product.</p>
      )}
    </div>
  );

  /**
   * Get tab content based on active tab
   */
  const getTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'ingredients':
        return renderIngredientsTab();
      case 'clinical':
        return renderClinicalTab();
      case 'usage':
        return renderUsageTab();
      case 'professional':
        return renderProfessionalTab();
      default:
        return renderOverviewTab();
    }
  };

  return (
    <div className={`product-study ${className}`}>
      {/* Header */}
      <div className="product-study__header">
        <h3 className="product-study__title">{name}</h3>
        <p className="product-study__subtitle">Complete Product Analysis</p>
      </div>

      {/* Tab Navigation */}
      <div className="product-study__tabs" role="tablist">
        <button
          role="tab"
          aria-selected={activeTab === 'overview'}
          className={`product-study__tab ${activeTab === 'overview' ? 'product-study__tab--active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'ingredients'}
          className={`product-study__tab ${activeTab === 'ingredients' ? 'product-study__tab--active' : ''}`}
          onClick={() => setActiveTab('ingredients')}
        >
          Ingredients ({fullIngredientList.length})
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'clinical'}
          className={`product-study__tab ${activeTab === 'clinical' ? 'product-study__tab--active' : ''}`}
          onClick={() => setActiveTab('clinical')}
        >
          Clinical Data
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'usage'}
          className={`product-study__tab ${activeTab === 'usage' ? 'product-study__tab--active' : ''}`}
          onClick={() => setActiveTab('usage')}
        >
          Usage & Safety
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'professional'}
          className={`product-study__tab ${activeTab === 'professional' ? 'product-study__tab--active' : ''}`}
          onClick={() => setActiveTab('professional')}
        >
          Professional Notes
        </button>
      </div>

      {/* Tab Content */}
      <div className="product-study__content" role="tabpanel">
        {getTabContent()}
      </div>
    </div>
  );
}

/**
 * Default export for convenience
 */
export default ProductStudy;
