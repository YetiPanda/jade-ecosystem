/**
 * Spa-ce Sanctuary SKA Integration Service
 *
 * AI-powered service for connecting community content with SKA Knowledge Graph:
 * - Topic suggestions based on content analysis
 * - Related discussions by SKA atom
 * - Auto-tagging posts with relevant SKA atoms
 */

import { AppDataSource } from '../config/database';
import { generateEmbedding } from './openai.service';
import { zillizClient } from '../config/zilliz';

// Zilliz collection for SKA atoms
const SKA_COLLECTION = 'jade_skincare_atoms';

export interface SKAAtomBasic {
  id: string;
  title: string;
  pillarId: string;
  atomType: string;
  glanceText: string;
}

/**
 * Suggest relevant SKA topics for community content
 * Uses semantic similarity to find related knowledge atoms
 */
export async function suggestSkaTopicsForContent(
  content: string,
  limit: number = 5
): Promise<SKAAtomBasic[]> {
  try {
    // Check if Zilliz collection exists
    const hasCollection = await zillizClient.hasCollection({
      collection_name: SKA_COLLECTION,
    });

    if (!hasCollection.value) {
      // Fallback to keyword-based matching
      return await fallbackKeywordSearch(content, limit);
    }

    // Generate embedding for the content
    const embedding = await generateEmbedding(content);

    // Search Zilliz for similar atoms
    const searchResult = await zillizClient.search({
      collection_name: SKA_COLLECTION,
      vector: embedding,
      limit,
      output_fields: ['id', 'title', 'pillar_id', 'atom_type', 'glance_text'],
      metric_type: 'COSINE',
    });

    // Map results to SKA atom format
    return searchResult.results.map((result) => ({
      id: String(result.id),
      title: String(result.title || ''),
      pillarId: String(result.pillar_id || ''),
      atomType: String(result.atom_type || ''),
      glanceText: String(result.glance_text || ''),
    }));
  } catch (error) {
    console.warn('SKA topic suggestion failed, using fallback:', error);
    return await fallbackKeywordSearch(content, limit);
  }
}

/**
 * Fallback keyword-based search when vector search is unavailable
 */
async function fallbackKeywordSearch(
  content: string,
  limit: number
): Promise<SKAAtomBasic[]> {
  // Extract keywords from content
  const keywords = extractKeywords(content);

  if (keywords.length === 0) {
    return [];
  }

  // Search atoms by keywords in title and glance_text
  const result = await AppDataSource.query(
    `SELECT id, title, pillar_id, atom_type, glance_text
     FROM jade.skincare_atoms
     WHERE to_tsvector('english', title || ' ' || COALESCE(glance_text, ''))
           @@ to_tsquery('english', $1)
     LIMIT $2`,
    [keywords.join(' | '), limit]
  );

  return (result as Array<{
    id: string;
    title: string;
    pillar_id: string;
    atom_type: string;
    glance_text: string;
  }>).map((row) => ({
    id: row.id,
    title: row.title,
    pillarId: row.pillar_id,
    atomType: row.atom_type,
    glanceText: row.glance_text,
  }));
}

/**
 * Extract meaningful keywords from content for search
 */
function extractKeywords(content: string): string[] {
  // Common skincare terms that might be topics
  const skincareTerms = [
    'retinol', 'vitamin c', 'niacinamide', 'hyaluronic acid', 'salicylic acid',
    'glycolic acid', 'peptide', 'collagen', 'ceramide', 'spf', 'sunscreen',
    'acne', 'wrinkle', 'aging', 'hyperpigmentation', 'melasma', 'rosacea',
    'eczema', 'psoriasis', 'sensitive skin', 'oily skin', 'dry skin',
    'moisturizer', 'cleanser', 'serum', 'toner', 'exfoliant', 'mask',
    'hydration', 'brightening', 'anti-aging', 'pore', 'blemish',
    'AHA', 'BHA', 'PHA', 'tretinoin', 'benzoyl peroxide',
  ];

  const normalizedContent = content.toLowerCase();
  const foundTerms: string[] = [];

  for (const term of skincareTerms) {
    if (normalizedContent.includes(term.toLowerCase())) {
      foundTerms.push(term);
    }
  }

  // Also extract capitalized words that might be brand/product names
  const capitalizedWords = content.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) || [];
  for (const word of capitalizedWords) {
    if (word.length > 3 && !foundTerms.includes(word.toLowerCase())) {
      foundTerms.push(word);
    }
  }

  return foundTerms.slice(0, 10); // Limit to 10 keywords
}

/**
 * Auto-tag a post with relevant SKA atom IDs
 * Called when creating/updating a post
 */
export async function autoTagPostWithSkaAtoms(
  content: string,
  maxTags: number = 3
): Promise<string[]> {
  const suggestions = await suggestSkaTopicsForContent(content, maxTags);
  return suggestions.map((s) => s.id);
}

/**
 * Get SKA atoms by their IDs
 */
export async function getSkaAtomsByIds(ids: string[]): Promise<SKAAtomBasic[]> {
  if (ids.length === 0) {
    return [];
  }

  const result = await AppDataSource.query(
    `SELECT id, title, pillar_id, atom_type, glance_text
     FROM jade.skincare_atoms
     WHERE id = ANY($1::uuid[])`,
    [ids]
  );

  return (result as Array<{
    id: string;
    title: string;
    pillar_id: string;
    atom_type: string;
    glance_text: string;
  }>).map((row) => ({
    id: row.id,
    title: row.title,
    pillarId: row.pillar_id,
    atomType: row.atom_type,
    glanceText: row.glance_text,
  }));
}

/**
 * Find related community discussions for a SKA atom
 */
export async function findRelatedDiscussions(
  atomId: string,
  limit: number = 10
) {
  const result = await AppDataSource.query(
    `SELECT * FROM jade.community_post
     WHERE $1 = ANY(ska_atom_ids) AND status = 'published'
     ORDER BY like_count DESC, created_at DESC
     LIMIT $2`,
    [atomId, limit]
  );

  return result;
}

export default {
  suggestSkaTopicsForContent,
  autoTagPostWithSkaAtoms,
  getSkaAtomsByIds,
  findRelatedDiscussions,
};
