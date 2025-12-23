/**
 * GraphQL Queries for Product Taxonomy
 */

import { gql } from '@apollo/client';

// ========================================
// Fragments
// ========================================

export const PRODUCT_CATEGORY_FRAGMENT = gql`
  fragment ProductCategoryFields on ProductCategory {
    id
    name
    seoSlug
    description
    level
    displayOrder
    isActive
    productCount
  }
`;

export const PRODUCT_FUNCTION_FRAGMENT = gql`
  fragment ProductFunctionFields on ProductFunction {
    id
    name
    description
    displayOrder
    isActive
    productCount
  }
`;

export const SKIN_CONCERN_FRAGMENT = gql`
  fragment SkinConcernFields on SkinConcern {
    id
    name
    description
    displayOrder
    isActive
    productCount
  }
`;

export const PRODUCT_FORMAT_FRAGMENT = gql`
  fragment ProductFormatFields on ProductFormat {
    id
    name
    category
    description
    isActive
    productCount
  }
`;

// ========================================
// Queries
// ========================================

/**
 * Get all taxonomy filter options
 * Used to populate filter sidebar
 */
export const GET_TAXONOMY_FILTER_OPTIONS = gql`
  ${PRODUCT_CATEGORY_FRAGMENT}
  ${PRODUCT_FUNCTION_FRAGMENT}
  ${SKIN_CONCERN_FRAGMENT}
  ${PRODUCT_FORMAT_FRAGMENT}

  query GetTaxonomyFilterOptions {
    taxonomyFilterOptions {
      categories {
        ...ProductCategoryFields
        children {
          ...ProductCategoryFields
        }
      }
      functions {
        ...ProductFunctionFields
      }
      concerns {
        ...SkinConcernFields
      }
      formats {
        ...ProductFormatFields
      }
      targetAreas {
        id
        name
        description
        isActive
      }
      regions {
        id
        name
        countryCode
        description
        isActive
      }
      usageTimes
      professionalLevels
    }
  }
`;

/**
 * Get product categories
 * Optional filters: parentId, level, isActive
 */
export const GET_PRODUCT_CATEGORIES = gql`
  ${PRODUCT_CATEGORY_FRAGMENT}

  query GetProductCategories($parentId: ID, $level: Int, $isActive: Boolean) {
    productCategories(parentId: $parentId, level: $level, isActive: $isActive) {
      ...ProductCategoryFields
      parent {
        id
        name
      }
      children {
        ...ProductCategoryFields
      }
    }
  }
`;

/**
 * Get single product category by ID
 */
export const GET_PRODUCT_CATEGORY = gql`
  ${PRODUCT_CATEGORY_FRAGMENT}

  query GetProductCategory($id: ID!) {
    productCategory(id: $id) {
      ...ProductCategoryFields
      parent {
        id
        name
      }
      children {
        ...ProductCategoryFields
      }
    }
  }
`;

/**
 * Get product category by slug
 */
export const GET_PRODUCT_CATEGORY_BY_SLUG = gql`
  ${PRODUCT_CATEGORY_FRAGMENT}

  query GetProductCategoryBySlug($slug: String!) {
    productCategoryBySlug(slug: $slug) {
      ...ProductCategoryFields
      parent {
        id
        name
      }
      children {
        ...ProductCategoryFields
      }
    }
  }
`;

/**
 * Get all product functions
 */
export const GET_PRODUCT_FUNCTIONS = gql`
  ${PRODUCT_FUNCTION_FRAGMENT}

  query GetProductFunctions($isActive: Boolean) {
    productFunctions(isActive: $isActive) {
      ...ProductFunctionFields
    }
  }
`;

/**
 * Get all skin concerns
 */
export const GET_SKIN_CONCERNS = gql`
  ${SKIN_CONCERN_FRAGMENT}

  query GetSkinConcerns($isActive: Boolean) {
    skinConcerns(isActive: $isActive) {
      ...SkinConcernFields
    }
  }
`;

/**
 * Get all product formats
 */
export const GET_PRODUCT_FORMATS = gql`
  ${PRODUCT_FORMAT_FRAGMENT}

  query GetProductFormats($isActive: Boolean, $category: String) {
    productFormats(isActive: $isActive, category: $category) {
      ...ProductFormatFields
    }
  }
`;

/**
 * Get product taxonomy by product ID
 */
export const GET_PRODUCT_TAXONOMY = gql`
  ${PRODUCT_CATEGORY_FRAGMENT}
  ${PRODUCT_FUNCTION_FRAGMENT}
  ${SKIN_CONCERN_FRAGMENT}
  ${PRODUCT_FORMAT_FRAGMENT}

  query GetProductTaxonomy($productId: ID!) {
    productTaxonomy(productId: $productId) {
      id
      productId
      category {
        ...ProductCategoryFields
      }
      primaryFunctions {
        ...ProductFunctionFields
      }
      skinConcerns {
        ...SkinConcernFields
      }
      targetAreas {
        id
        name
        description
      }
      productFormat {
        ...ProductFormatFields
      }
      region {
        id
        name
        countryCode
      }
      usageTime
      professionalLevel
      protocolRequired
      formulationBase
      taxonomyCompletenessScore
      createdAt
      updatedAt
    }
  }
`;

/**
 * Get taxonomy statistics
 */
export const GET_TAXONOMY_STATS = gql`
  query GetTaxonomyStats {
    taxonomyStats {
      totalProducts
      averageCompletenessScore
      categoryCounts {
        categoryId
        count
      }
    }
  }
`;

/**
 * Get all product taxonomies with optional filtering
 * Used by admin dashboard for quality monitoring
 */
export const GET_PRODUCT_TAXONOMIES = gql`
  query GetProductTaxonomies($filter: ProductTaxonomyFilter) {
    productTaxonomies(filter: $filter) {
      id
      productId
      taxonomyCompletenessScore
      createdAt
      updatedAt
    }
  }
`;

// ========================================
// Mutations
// ========================================

/**
 * Create product taxonomy
 */
export const CREATE_PRODUCT_TAXONOMY = gql`
  mutation CreateProductTaxonomy($input: CreateProductTaxonomyInput!) {
    createProductTaxonomy(input: $input) {
      id
      productId
      taxonomyCompletenessScore
      createdAt
    }
  }
`;

/**
 * Update product taxonomy
 */
export const UPDATE_PRODUCT_TAXONOMY = gql`
  mutation UpdateProductTaxonomy(
    $productId: ID!
    $input: UpdateProductTaxonomyInput!
  ) {
    updateProductTaxonomy(productId: $productId, input: $input) {
      id
      productId
      taxonomyCompletenessScore
      updatedAt
    }
  }
`;

/**
 * Delete product taxonomy
 */
export const DELETE_PRODUCT_TAXONOMY = gql`
  mutation DeleteProductTaxonomy($productId: ID!) {
    deleteProductTaxonomy(productId: $productId)
  }
`;

/**
 * Generate product embedding
 */
export const GENERATE_PRODUCT_EMBEDDING = gql`
  mutation GenerateProductEmbedding($productId: ID!) {
    generateProductEmbedding(productId: $productId)
  }
`;

/**
 * Generate all product embeddings
 */
export const GENERATE_ALL_PRODUCT_EMBEDDINGS = gql`
  mutation GenerateAllProductEmbeddings {
    generateAllProductEmbeddings
  }
`;

// ========================================
// Search Queries
// ========================================

/**
 * Basic text search
 */
export const SEARCH_PRODUCTS = gql`
  query SearchProducts(
    $query: String!
    $limit: Int
    $filters: ProductTaxonomyFilter
  ) {
    searchProducts(query: $query, limit: $limit, filters: $filters) {
      productId
      vendureProductId
      brandName
      productName
      categoryPath
      professionalLevel
      priceWholesale
      taxonomyCompletenessScore
      relevanceScore
      matchType
    }
  }
`;

/**
 * Semantic vector search
 */
export const SEARCH_PRODUCTS_BY_SEMANTIC = gql`
  query SearchProductsBySemantic(
    $query: String!
    $limit: Int
    $filters: ProductTaxonomyFilter
  ) {
    searchProductsBySemantic(query: $query, limit: $limit, filters: $filters) {
      productId
      vendureProductId
      brandName
      productName
      categoryPath
      professionalLevel
      priceWholesale
      taxonomyCompletenessScore
      relevanceScore
      matchType
    }
  }
`;

/**
 * Find compatible products using tensor similarity
 */
export const FIND_COMPATIBLE_PRODUCTS = gql`
  query FindCompatibleProducts($productId: ID!, $limit: Int) {
    findCompatibleProducts(productId: $productId, limit: $limit) {
      productId
      vendureProductId
      brandName
      productName
      categoryPath
      professionalLevel
      priceWholesale
      taxonomyCompletenessScore
      relevanceScore
      matchType
    }
  }
`;
