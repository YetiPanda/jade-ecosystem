/**
 * GraphQL Schema for Product Taxonomy
 *
 * Provides queries for:
 * - Product categories (hierarchical)
 * - Product functions
 * - Skin concerns
 * - Product formats
 * - Target areas
 * - Regions
 * - Full product taxonomy data
 */

export const taxonomyTypeDefs = `#graphql
  # Enums
  enum UsageTime {
    MORNING
    EVENING
    ANYTIME
    NIGHT_ONLY
    POST_TREATMENT
  }

  enum ProfessionalLevel {
    OTC
    PROFESSIONAL
    MEDICAL_GRADE
    IN_OFFICE_ONLY
  }

  enum ConcernSeverity {
    MILD
    MODERATE
    SEVERE
  }

  # Product Category (Hierarchical)
  type ProductCategory {
    id: ID!
    name: String!
    parentId: ID
    parent: ProductCategory
    children: [ProductCategory!]!
    level: Int!
    description: String
    seoSlug: String!
    displayOrder: Int!
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
    productCount: Int
  }

  # Product Function
  type ProductFunction {
    id: ID!
    name: String!
    description: String
    categoryCompatibility: String
    displayOrder: Int!
    isActive: Boolean!
    createdAt: String!
    productCount: Int
  }

  # Skin Concern
  type SkinConcern {
    id: ID!
    name: String!
    description: String
    severityLevels: String
    relatedIngredients: String
    displayOrder: Int!
    isActive: Boolean!
    createdAt: String!
    productCount: Int
  }

  # Product Format
  type ProductFormat {
    id: ID!
    name: String!
    category: String
    description: String
    isActive: Boolean!
    createdAt: String!
    productCount: Int
  }

  # Target Area
  type TargetArea {
    id: ID!
    name: String!
    description: String
    isActive: Boolean!
    createdAt: String!
    productCount: Int
  }

  # Product Region
  type ProductRegion {
    id: ID!
    name: String!
    countryCode: String
    description: String
    isActive: Boolean!
    createdAt: String!
    productCount: Int
  }

  # Product Taxonomy (Full taxonomy data for a product)
  type ProductTaxonomy {
    id: ID!
    productId: ID!
    category: ProductCategory
    primaryFunctions: [ProductFunction!]!
    skinConcerns: [SkinConcern!]!
    targetAreas: [TargetArea!]!
    productFormat: ProductFormat
    region: ProductRegion
    usageTime: UsageTime!
    professionalLevel: ProfessionalLevel!
    protocolRequired: Boolean!
    formulationBase: String
    taxonomyCompletenessScore: Int
    lastReviewedAt: String
    reviewedBy: ID
    createdAt: String!
    updatedAt: String!
  }

  # Taxonomy Filter Options (for building filter UI)
  type TaxonomyFilterOptions {
    categories: [ProductCategory!]!
    functions: [ProductFunction!]!
    concerns: [SkinConcern!]!
    formats: [ProductFormat!]!
    targetAreas: [TargetArea!]!
    regions: [ProductRegion!]!
    usageTimes: [UsageTime!]!
    professionalLevels: [ProfessionalLevel!]!
  }

  # Taxonomy Statistics
  type TaxonomyStats {
    totalProducts: Int!
    categoryCounts: [CategoryCount!]!
    functionCounts: [FunctionCount!]!
    concernCounts: [ConcernCount!]!
    averageCompletenessScore: Float!
  }

  type CategoryCount {
    category: ProductCategory!
    count: Int!
  }

  type FunctionCount {
    function: ProductFunction!
    count: Int!
  }

  type ConcernCount {
    concern: SkinConcern!
    count: Int!
  }

  # Input types for filtering
  input ProductTaxonomyFilter {
    categoryIds: [ID!]
    functionIds: [ID!]
    concernIds: [ID!]
    formatIds: [ID!]
    targetAreaIds: [ID!]
    regionIds: [ID!]
    usageTimes: [UsageTime!]
    professionalLevels: [ProfessionalLevel!]
    minCompletenessScore: Int
    protocolRequired: Boolean
  }

  # Input types for mutations
  input CreateProductTaxonomyInput {
    productId: ID!
    categoryId: ID
    primaryFunctionIds: [ID!]
    skinConcernIds: [ID!]
    targetAreaIds: [ID!]
    productFormatId: ID
    regionId: ID
    usageTime: UsageTime
    professionalLevel: ProfessionalLevel
    protocolRequired: Boolean
    formulationBase: String
  }

  input UpdateProductTaxonomyInput {
    categoryId: ID
    primaryFunctionIds: [ID!]
    skinConcernIds: [ID!]
    targetAreaIds: [ID!]
    productFormatId: ID
    regionId: ID
    usageTime: UsageTime
    professionalLevel: ProfessionalLevel
    protocolRequired: Boolean
    formulationBase: String
  }

  # Queries
  type Query {
    # Category queries
    productCategories(
      parentId: ID
      level: Int
      isActive: Boolean
    ): [ProductCategory!]!

    productCategory(id: ID!): ProductCategory

    productCategoryBySlug(slug: String!): ProductCategory

    # Function queries
    productFunctions(isActive: Boolean): [ProductFunction!]!

    productFunction(id: ID!): ProductFunction

    # Skin concern queries
    skinConcerns(isActive: Boolean): [SkinConcern!]!

    skinConcern(id: ID!): SkinConcern

    # Format queries
    productFormats(isActive: Boolean, category: String): [ProductFormat!]!

    productFormat(id: ID!): ProductFormat

    # Target area queries
    targetAreas(isActive: Boolean): [TargetArea!]!

    targetArea(id: ID!): TargetArea

    # Region queries
    productRegions(isActive: Boolean): [ProductRegion!]!

    productRegion(id: ID!): ProductRegion

    # Taxonomy queries
    productTaxonomy(productId: ID!): ProductTaxonomy

    productTaxonomies(filter: ProductTaxonomyFilter): [ProductTaxonomy!]!

    # Filter options (for building UI)
    taxonomyFilterOptions: TaxonomyFilterOptions!

    # Statistics
    taxonomyStats: TaxonomyStats!
  }

  # Mutations
  type Mutation {
    # Create taxonomy for a product
    createProductTaxonomy(input: CreateProductTaxonomyInput!): ProductTaxonomy!

    # Update taxonomy for a product
    updateProductTaxonomy(productId: ID!, input: UpdateProductTaxonomyInput!): ProductTaxonomy!

    # Delete taxonomy for a product
    deleteProductTaxonomy(productId: ID!): Boolean!

    # Trigger embedding generation for a product
    generateProductEmbedding(productId: ID!): Boolean!

    # Batch generate embeddings for all products with taxonomy
    generateAllProductEmbeddings: Int!
  }
`;
