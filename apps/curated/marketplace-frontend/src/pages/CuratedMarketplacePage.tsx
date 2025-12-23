/**
 * Curated Marketplace Page
 *
 * Public-facing curated marketplace showing featured brands and products
 * Based on faire-starter template design
 */

import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useGetProductsQuery } from '../graphql/generated';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SearchBar } from '../components/search/SearchBar';
import { ArrowRight, Sparkles, ShieldCheck, Truck, Search as SearchIcon, Star, Award } from 'lucide-react';
import { getMockFeaturedBrands, getMockBestsellers, getMockNewArrivals, getEditorialContent } from '../utils/homepageTransforms';

export const CuratedMarketplacePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Check if we're on a nested route (products or search)
  const isNestedRoute = location.pathname !== '/app/marketplace';
  const isProductsRoute = location.pathname.startsWith('/app/marketplace/products');

  // Get mock data from homepage transforms
  const featuredBrands = getMockFeaturedBrands();
  const bestsellers = getMockBestsellers();
  const newArrivals = getMockNewArrivals();
  const editorialContent = getEditorialContent();

  // If we're on a nested route, show the sub-navigation and outlet
  if (isNestedRoute) {
    return (
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Sub-Navigation */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-6">
            <Link
              to="/app/marketplace"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to Marketplace
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-4">
            <Link
              to="/app/marketplace/products"
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isProductsRoute
                  ? 'bg-primary text-white'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              Browse Products
            </Link>
            <Link
              to="/app/search"
              className="px-4 py-2 text-sm font-medium rounded-lg text-foreground hover:bg-muted transition-colors flex items-center gap-2"
            >
              <SearchIcon className="h-4 w-4" />
              Advanced Search
            </Link>
          </div>
        </div>

        {/* Search Bar - only show on products page */}
        {isProductsRoute && (
          <div className="max-w-2xl">
            <SearchBar
              placeholder="Search products by name, brand, or category..."
              onResultSelect={(result) => {
                if (result.id) {
                  navigate(`/app/marketplace/products/${result.id}`);
                }
              }}
              showSemanticToggle={false}
            />
          </div>
        )}

        {/* Nested Route Content */}
        <Outlet />
      </div>
    );
  }

  // Landing page content
  return (
    <div className="space-y-16">
      {/* Hero Section - Full Width */}
      <section className="relative min-h-[50vh] overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-background rounded-3xl mx-4">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2070')] bg-cover bg-center opacity-20 rounded-3xl"></div>
        <div className="relative z-10 w-full px-8 sm:px-16">
          <div className="max-w-2xl py-12 sm:py-16 flex flex-col justify-center min-h-[50vh]">
            <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm border border-primary/20">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Curated with Care</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Find your next bestseller.
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">
              Discover premium spa and wellness products, carefully curated for professional practitioners.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/app/marketplace/products">
                <Button size="lg" className="gap-2">
                  Start browsing
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/app/wholesale-application">
                <Button variant="outline" size="lg">
                  Apply for Wholesale
                </Button>
              </Link>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Content Container */}
      <div className="mx-auto max-w-7xl px-4 space-y-16">
        {/* Featured Skincare Brands */}
        <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Featured Skincare Brands</h2>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-muted transition-colors">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="p-2 rounded-full hover:bg-muted transition-colors">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex items-center gap-8 overflow-x-auto pb-4 scrollbar-hide">
          {featuredBrands.slice(0, 7).map((brand) => (
            <Link
              key={brand.id}
              to="/app/marketplace/products"
              className="flex-shrink-0 w-28 h-28 rounded-full bg-white border hover:border-primary flex items-center justify-center transition-all p-3 grayscale hover:grayscale-0"
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="w-full h-full object-contain"
              />
            </Link>
          ))}
        </div>
      </section>

      {/* Discover Our Curated Collection */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="aspect-[4/3] rounded-3xl overflow-hidden">
          <img
            src={editorialContent.image}
            alt={editorialContent.imageAlt}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-8 lg:pl-8">
          <h2 className="text-4xl font-bold">{editorialContent.title}</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {editorialContent.description}
          </p>
          <Link to={editorialContent.ctaLink}>
            <Button size="lg" className="rounded-full px-10 py-6 text-lg">
              {editorialContent.ctaText}
            </Button>
          </Link>
        </div>
      </section>

      {/* Bestselling spa products */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-4xl font-bold">Bestselling Spa Products</h2>
          <Link to="/app/marketplace/products" className="text-sm text-primary hover:underline">
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {bestsellers.map((product) => (
            <Link
              key={product.id}
              to={`/app/marketplace/products/${product.id}`}
              className="group block"
            >
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                {/* Product Image */}
                <div className="aspect-square bg-white relative overflow-hidden border-b">
                  <img
                    src={product.glance.thumbnail}
                    alt={product.glance.heroBenefit}
                    className="w-full h-full object-cover"
                  />
                  {/* Bestseller Badge */}
                  {product.glance.rating && product.glance.rating >= 4.7 && (
                    <div className="absolute top-3 left-3">
                      <div className="w-12 h-12 rounded-full bg-white border-2 border-primary flex items-center justify-center shadow-lg">
                        <Award className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <CardContent className="p-4 space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    {product.vendorOrganization.displayName}
                  </p>
                  <h3 className="text-sm font-medium line-clamp-2 min-h-[2.5rem]">
                    {product.glance.heroBenefit}
                  </h3>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-semibold">{product.glance.rating?.toFixed(1)}</span>
                    <span className="text-xs text-muted-foreground">({product.glance.reviewCount})</span>
                  </div>
                  <p className="text-lg font-bold">${product.glance.price.amount.toFixed(2)}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* New arrivals */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-4xl font-bold">New Arrivals</h2>
          <Link to="/app/marketplace/products" className="text-sm text-primary hover:underline">
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {newArrivals.map((product, idx) => {
            const isAwardWinner = idx === 1; // Second product gets award winner badge
            return (
              <Link
                key={product.id}
                to={`/app/marketplace/products/${product.id}`}
                className="group block"
              >
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                  {/* Product Image */}
                  <div className="aspect-square bg-white relative overflow-hidden border-b">
                    <img
                      src={product.glance.thumbnail}
                      alt={product.glance.heroBenefit}
                      className="w-full h-full object-cover"
                    />
                    {/* Badges */}
                    <div className="absolute top-3 left-3">
                      <div className={`w-12 h-12 rounded-full bg-white ${isAwardWinner ? 'border-2 border-amber-500' : 'border-2 border-blue-500'} flex items-center justify-center shadow-lg`}>
                        {isAwardWinner ? (
                          <Award className="h-6 w-6 text-amber-500" />
                        ) : (
                          <Sparkles className="h-6 w-6 text-blue-500" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <CardContent className="p-4 space-y-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      {product.vendorOrganization.displayName}
                    </p>
                    <h3 className="text-sm font-medium line-clamp-2 min-h-[2.5rem]">
                      {product.glance.heroBenefit}
                    </h3>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-semibold">{product.glance.rating?.toFixed(1)}</span>
                      <span className="text-xs text-muted-foreground">({product.glance.reviewCount})</span>
                    </div>
                    <p className="text-lg font-bold">${product.glance.price.amount.toFixed(2)}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-background rounded-3xl p-8 sm:p-12 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold">Ready to elevate your spa?</h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of practitioners who trust JADE for their professional supplies
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/app/marketplace/products">
              <Button size="lg" className="gap-2">
                Browse Catalog
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/app/wholesale-application">
              <Button variant="outline" size="lg">
                Apply for Wholesale Access
              </Button>
            </Link>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
};

export default CuratedMarketplacePage;
