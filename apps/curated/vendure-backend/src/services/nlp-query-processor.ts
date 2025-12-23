/**
 * Natural Language Query Processor
 * Week 5 Day 4: Natural language search query processing
 *
 * Parses user queries to extract:
 * - Search intent (semantic, compatibility, specific attributes)
 * - Filters (price range, professional level, categories)
 * - Context expansion (synonyms, related terms)
 */

import { OpenAI } from 'openai';

// Check if OpenAI is configured
const isOpenAIConfigured = Boolean(process.env.OPENAI_API_KEY);

// Lazy-initialized OpenAI client
let _openai: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!isOpenAIConfigured) {
    throw new Error('OpenAI is not configured. Set OPENAI_API_KEY environment variable.');
  }
  if (!_openai) {
    _openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return _openai;
}

/**
 * Parsed query structure
 */
export interface ParsedQuery {
  // Core search terms (cleaned and normalized)
  searchTerms: string;

  // Detected filters from natural language
  filters: {
    professionalLevels?: ('OTC' | 'PROFESSIONAL' | 'MEDICAL_GRADE' | 'IN_OFFICE_ONLY')[];
    priceRange?: { min: number; max: number };
    categoryHints?: string[];
    skinConcerns?: string[];
    productFunctions?: string[];
    usageTime?: 'MORNING' | 'EVENING' | 'ANYTIME' | 'NIGHT_ONLY' | 'POST_TREATMENT';
  };

  // Search intent
  intent: 'product_search' | 'compatibility' | 'recommendation' | 'information';

  // Query expansion suggestions
  expandedTerms?: string[];

  // Confidence score (0-1)
  confidence: number;
}

/**
 * Extract professional level mentions from query
 */
function extractProfessionalLevel(query: string): ('OTC' | 'PROFESSIONAL' | 'MEDICAL_GRADE' | 'IN_OFFICE_ONLY')[] | undefined {
  const levels: Set<'OTC' | 'PROFESSIONAL' | 'MEDICAL_GRADE' | 'IN_OFFICE_ONLY'> = new Set();
  const lowerQuery = query.toLowerCase();

  // OTC / Consumer level
  if (lowerQuery.match(/\b(otc|over.the.counter|consumer|retail|drugstore)\b/)) {
    levels.add('OTC');
  }

  // Professional level
  if (lowerQuery.match(/\b(professional|esthetician|spa|salon)\b/)) {
    levels.add('PROFESSIONAL');
  }

  // Medical grade
  if (lowerQuery.match(/\b(medical.grade|prescription|clinical|doctor|dermatologist)\b/)) {
    levels.add('MEDICAL_GRADE');
  }

  // In-office only
  if (lowerQuery.match(/\b(in.office|treatment.room|professional.use.only)\b/)) {
    levels.add('IN_OFFICE_ONLY');
  }

  return levels.size > 0 ? Array.from(levels) : undefined;
}

/**
 * Extract price range from query
 */
function extractPriceRange(query: string): { min: number; max: number } | undefined {
  const lowerQuery = query.toLowerCase();

  // Explicit price range: "$50-$100", "between $20 and $80"
  const rangeMatch = lowerQuery.match(/\$?(\d+)(?:\s*(?:to|-|and)\s*)\$?(\d+)/);
  if (rangeMatch) {
    return {
      min: parseInt(rangeMatch[1], 10) * 100, // Convert to cents
      max: parseInt(rangeMatch[2], 10) * 100,
    };
  }

  // Under/below threshold: "under $50", "below $100"
  const underMatch = lowerQuery.match(/(?:under|below|less\s+than)\s+\$?(\d+)/);
  if (underMatch) {
    return {
      min: 0,
      max: parseInt(underMatch[1], 10) * 100,
    };
  }

  // Over/above threshold: "over $100", "above $50"
  const overMatch = lowerQuery.match(/(?:over|above|more\s+than)\s+\$?(\d+)/);
  if (overMatch) {
    return {
      min: parseInt(overMatch[1], 10) * 100,
      max: 100000, // $1000 upper bound
    };
  }

  // Budget descriptors
  if (lowerQuery.match(/\b(budget|affordable|cheap|inexpensive)\b/)) {
    return { min: 0, max: 5000 }; // Under $50
  }

  if (lowerQuery.match(/\b(luxury|premium|high.end)\b/)) {
    return { min: 10000, max: 100000 }; // $100+
  }

  return undefined;
}

/**
 * Extract usage time from query
 */
function extractUsageTime(query: string): 'MORNING' | 'EVENING' | 'ANYTIME' | 'NIGHT_ONLY' | 'POST_TREATMENT' | undefined {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.match(/\b(morning|am|daytime|day)\b/)) {
    return 'MORNING';
  }

  if (lowerQuery.match(/\b(evening|pm|night|bedtime)\b/)) {
    return 'EVENING';
  }

  if (lowerQuery.match(/\b(post.treatment|after.treatment|recovery)\b/)) {
    return 'POST_TREATMENT';
  }

  return undefined;
}

/**
 * Extract category hints from query
 */
function extractCategoryHints(query: string): string[] {
  const categories: string[] = [];
  const lowerQuery = query.toLowerCase();

  // Main categories
  const categoryMap: Record<string, string> = {
    'serum|essence': 'Serums',
    'cleanser|face wash': 'Cleansers',
    'moisturizer|cream|lotion': 'Moisturizers',
    'mask|masque': 'Masks',
    'peel|exfoliant|scrub': 'Exfoliants',
    'toner|essence|mist': 'Toners',
    'eye cream|eye serum': 'Eye Care',
    'sunscreen|spf|sun protection': 'Sun Protection',
    'treatment|spot treatment': 'Treatments',
  };

  for (const [pattern, category] of Object.entries(categoryMap)) {
    if (lowerQuery.match(new RegExp(`\\b(${pattern})\\b`))) {
      categories.push(category);
    }
  }

  return categories;
}

/**
 * Extract skin concerns from query
 */
function extractSkinConcerns(query: string): string[] {
  const concerns: string[] = [];
  const lowerQuery = query.toLowerCase();

  const concernMap: Record<string, string> = {
    'acne|breakout|blemish|pimple': 'Acne',
    'aging|wrinkle|fine line|anti.aging': 'Aging',
    'hyperpigmentation|dark spot|melasma': 'Hyperpigmentation',
    'redness|rosacea|sensitivity': 'Redness',
    'dryness|dehydrat': 'Dryness',
    'oily|shine|sebum': 'Oiliness',
    'dull|brightening|glow': 'Dullness',
    'pore|enlarged pore': 'Large Pores',
    'scar|texture': 'Scarring',
  };

  for (const [pattern, concern] of Object.entries(concernMap)) {
    if (lowerQuery.match(new RegExp(`\\b(${pattern})\\b`))) {
      concerns.push(concern);
    }
  }

  return concerns;
}

/**
 * Extract product functions from query
 */
function extractProductFunctions(query: string): string[] {
  const functions: string[] = [];
  const lowerQuery = query.toLowerCase();

  const functionMap: Record<string, string> = {
    'hydrat|moisture': 'Hydrate',
    'exfoliat|peel|resurface': 'Exfoliate',
    'brighten|illuminat': 'Brighten',
    'firm|lift|tighten': 'Firm',
    'sooth|calm': 'Soothe',
    'protect|barrier': 'Protect',
    'repair|restore': 'Repair',
    'cleanse|clean|purif': 'Cleanse',
    'nourish|feed': 'Nourish',
  };

  for (const [pattern, func] of Object.entries(functionMap)) {
    if (lowerQuery.match(new RegExp(`\\b(${pattern})\\b`))) {
      functions.push(func);
    }
  }

  return functions;
}

/**
 * Determine search intent from query
 */
function determineIntent(query: string): 'product_search' | 'compatibility' | 'recommendation' | 'information' {
  const lowerQuery = query.toLowerCase();

  // Compatibility intent
  if (lowerQuery.match(/\b(compatible|pair|goes with|use with|combine|mix)\b/)) {
    return 'compatibility';
  }

  // Recommendation intent
  if (lowerQuery.match(/\b(recommend|suggest|best|top|popular)\b/)) {
    return 'recommendation';
  }

  // Information intent
  if (lowerQuery.match(/\b(what|how|why|when|explain|tell me about)\b/)) {
    return 'information';
  }

  // Default: product search
  return 'product_search';
}

/**
 * Clean and normalize search terms
 */
function cleanSearchTerms(query: string): string {
  let cleaned = query;

  // Remove filter keywords already extracted
  cleaned = cleaned.replace(/\b(otc|professional|medical|under|over|below|above|morning|evening|night)\s+/gi, '');

  // Remove price mentions
  cleaned = cleaned.replace(/\$\d+(?:[\s-]+\$?\d+)?/g, '');

  // Remove common stop words for search
  const stopWords = ['the', 'a', 'an', 'for', 'with', 'that', 'this', 'some', 'any'];
  const words = cleaned.split(/\s+/);
  cleaned = words.filter(w => !stopWords.includes(w.toLowerCase())).join(' ');

  return cleaned.trim();
}

/**
 * Parse natural language query
 * Basic rule-based parsing for common patterns
 */
export async function parseQuery(query: string): Promise<ParsedQuery> {
  const filters: ParsedQuery['filters'] = {};

  // Extract structured filters
  const professionalLevels = extractProfessionalLevel(query);
  if (professionalLevels) {
    filters.professionalLevels = professionalLevels;
  }

  const priceRange = extractPriceRange(query);
  if (priceRange) {
    filters.priceRange = priceRange;
  }

  const usageTime = extractUsageTime(query);
  if (usageTime) {
    filters.usageTime = usageTime;
  }

  const categoryHints = extractCategoryHints(query);
  if (categoryHints.length > 0) {
    filters.categoryHints = categoryHints;
  }

  const skinConcerns = extractSkinConcerns(query);
  if (skinConcerns.length > 0) {
    filters.skinConcerns = skinConcerns;
  }

  const productFunctions = extractProductFunctions(query);
  if (productFunctions.length > 0) {
    filters.productFunctions = productFunctions;
  }

  // Determine intent
  const intent = determineIntent(query);

  // Clean search terms
  const searchTerms = cleanSearchTerms(query);

  // Calculate confidence based on filter extraction
  const filterCount = Object.keys(filters).length;
  const confidence = Math.min(0.5 + (filterCount * 0.1), 1.0);

  return {
    searchTerms,
    filters,
    intent,
    confidence,
  };
}

/**
 * Enhanced query parsing using OpenAI for complex queries
 * Falls back to rule-based parsing if API fails
 */
export async function parseQueryWithAI(query: string): Promise<ParsedQuery> {
  try {
    const systemPrompt = `You are a product search query parser for a professional skincare marketplace.
Extract structured filters from natural language queries.

Output format (JSON):
{
  "searchTerms": "cleaned search terms",
  "filters": {
    "professionalLevels": ["OTC" | "PROFESSIONAL" | "MEDICAL_GRADE" | "IN_OFFICE_ONLY"],
    "priceRange": {"min": number, "max": number},
    "categoryHints": ["Serums", "Cleansers", ...],
    "skinConcerns": ["Acne", "Aging", "Hyperpigmentation", ...],
    "productFunctions": ["Hydrate", "Exfoliate", "Brighten", ...],
    "usageTime": "MORNING" | "EVENING" | "ANYTIME" | "NIGHT_ONLY" | "POST_TREATMENT"
  },
  "intent": "product_search" | "compatibility" | "recommendation" | "information",
  "expandedTerms": ["synonym1", "related term2", ...]
}`;

    const response = await getOpenAI().chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: query },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const parsed = JSON.parse(response.choices[0].message.content || '{}');

    return {
      ...parsed,
      confidence: 0.9, // High confidence for AI-parsed queries
    };
  } catch (error) {
    console.error('AI query parsing failed, falling back to rule-based parsing:', error);
    // Fallback to rule-based parsing
    return parseQuery(query);
  }
}
