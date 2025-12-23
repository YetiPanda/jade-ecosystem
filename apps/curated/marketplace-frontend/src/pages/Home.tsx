/**
 * Home Page
 *
 * Feature: 008-homepage-integration
 *
 * Main homepage with hero section, brand strip, product grids, and editorial content.
 * Integrates with GraphQL to fetch bestsellers and new arrivals.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import {
  HeroSection,
  BrandStrip,
  ProductGrid,
  EditorialBlock,
  VendorValueProp,
  CuratedWorkflow,
} from '../components/home';
import type {
  GetBestsellersData,
  GetNewArrivalsData,
} from '../types/homepage';
import {
  getMockFeaturedBrands,
  getMockBestsellers,
  getMockNewArrivals,
  getEditorialContent,
} from '../utils/homepageTransforms';

/**
 * GraphQL Queries
 * Updated to fetch both glance and scan data for Progressive Disclosure
 */
const GET_BESTSELLERS = gql`
  query GetBestsellers {
    products(limit: 4, offset: 0) {
      id
      vendureProductId
      glance {
        heroBenefit
        skinTypes
        rating
        reviewCount
        price {
          amount
          currency
        }
        thumbnail
      }
      scan {
        keyActives {
          name
          concentration
          type
        }
        usageInstructions {
          application
          frequency
          timeOfDay
          patchTestRequired
        }
        ingredients {
          inci {
            name
            concentration
            function
          }
          actives {
            name
            concentration
            type
          }
          allergens
          vegan
          crueltyFree
        }
        warnings
        images
      }
      vendorOrganization {
        id
        displayName
        companyName
      }
      createdAt
    }
  }
`;

const GET_NEW_ARRIVALS = gql`
  query GetNewArrivals {
    products(limit: 4, offset: 0) {
      id
      vendureProductId
      glance {
        heroBenefit
        skinTypes
        rating
        reviewCount
        price {
          amount
          currency
        }
        thumbnail
      }
      scan {
        keyActives {
          name
          concentration
          type
        }
        usageInstructions {
          application
          frequency
          timeOfDay
          patchTestRequired
        }
        ingredients {
          inci {
            name
            concentration
            function
          }
          actives {
            name
            concentration
            type
          }
          allergens
          vegan
          crueltyFree
        }
        warnings
        images
      }
      vendorOrganization {
        id
        displayName
        companyName
      }
      createdAt
    }
  }
`;

/**
 * HomePage Component
 *
 * Orchestrates all homepage sections and manages data fetching
 */
const HomePage: React.FC = () => {
  // Fetch bestsellers
  const {
    data: bestsellersData,
    loading: bestsellersLoading,
    error: bestsellersError,
  } = useQuery<GetBestsellersData>(GET_BESTSELLERS, {
    fetchPolicy: 'cache-and-network',
  });

  // Fetch new arrivals
  const {
    data: newArrivalsData,
    loading: newArrivalsLoading,
    error: newArrivalsError,
  } = useQuery<GetNewArrivalsData>(GET_NEW_ARRIVALS, {
    fetchPolicy: 'cache-and-network',
  });

  // Get static data (brands and editorial content)
  const featuredBrands = getMockFeaturedBrands();
  const editorialContent = getEditorialContent();

  // Pass JADE products directly (or use mock fallback)
  const bestsellers = bestsellersData && bestsellersData.products.length > 0
    ? bestsellersData.products
    : null;

  const newArrivals = newArrivalsData && newArrivalsData.products.length > 0
    ? newArrivalsData.products
    : null;

  // Fallback to mock data if no real data
  const mockBestsellers = getMockBestsellers();
  const mockNewArrivals = getMockNewArrivals();

  // Only show loading/error states if we're not using mock data
  const showBestsellersLoading = bestsellersLoading && !bestsellers;
  const showBestsellersError = bestsellersError && !bestsellers;
  const showNewArrivalsLoading = newArrivalsLoading && !newArrivals;
  const showNewArrivalsError = newArrivalsError && !newArrivals;

  return (
    <div className="homepage-container">
      <div className="mx-auto max-w-7xl px-4 py-8 space-y-16">
        {/* Hero Section with Dual Login */}
        <HeroSection />

        {/* Vendor Value Proposition - NEW */}
        <VendorValueProp />
      </div>

      {/* How Curated Works - NEW (full-width background) */}
      <CuratedWorkflow />

      <div className="mx-auto max-w-7xl px-4 py-8 space-y-16">
        {/* Featured Brands */}
        {featuredBrands.length > 0 && (
          <BrandStrip brands={featuredBrands} title="Featured Skincare Brands" />
        )}

        {/* Bestselling Products */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-foreground">
              Bestselling spa products
            </h2>
            <Link
              to="/app/products?filter=bestseller"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              View all →
            </Link>
          </div>
          <ProductGrid
            products={bestsellers || mockBestsellers}
            columns={4}
            loading={showBestsellersLoading}
            error={showBestsellersError ? bestsellersError : null}
            useProgressiveDisclosure={true}
          />
        </section>

        {/* Editorial Block */}
        <EditorialBlock {...editorialContent} />

        {/* New Arrivals */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-foreground">
              New arrivals
            </h2>
            <Link
              to="/app/products?sort=new"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              View all →
            </Link>
          </div>
          <ProductGrid
            products={newArrivals || mockNewArrivals}
            columns={4}
            loading={showNewArrivalsLoading}
            error={showNewArrivalsError ? newArrivalsError : null}
            useProgressiveDisclosure={true}
          />
        </section>
      </div>
    </div>
  );
};

export default HomePage;
