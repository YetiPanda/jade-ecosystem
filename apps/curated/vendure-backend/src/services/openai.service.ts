/**
 * OpenAI Service
 *
 * Centralized OpenAI API wrapper for:
 * - Text embeddings (text-embedding-3-small)
 * - Claim extraction (GPT-4)
 * - Compliance analysis (GPT-4)
 *
 * Part of Marketing Compliance Scoring system (Pillar 6)
 *
 * NOTE: OpenAI is optional - the server will start without it, but AI-powered
 * features will be unavailable until OPENAI_API_KEY is configured.
 */

import { OpenAI } from 'openai';

// Check if OpenAI is configured
export const isOpenAIConfigured = Boolean(process.env.OPENAI_API_KEY);

// Lazy-initialized client
let _openai: OpenAI | null = null;

/**
 * Get the OpenAI client (lazy initialization)
 * Throws an error if OpenAI is not configured
 */
function getOpenAIClient(): OpenAI {
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

// Model configurations
const EMBEDDING_MODEL = 'text-embedding-3-small';
const EMBEDDING_DIMENSIONS = 768;
const CHAT_MODEL = 'gpt-4-turbo-preview';

/**
 * Extracted claim from marketing copy
 */
export interface ExtractedClaim {
  claim: string;
  claimType: 'disease' | 'drug' | 'efficacy' | 'comparative' | 'permanence' | 'unsubstantiated' | 'safe';
  originalText: string;
  confidence: number;
}

/**
 * Compliance suggestion from AI
 */
export interface ComplianceSuggestion {
  originalClaim: string;
  suggestedReplacement: string;
  explanation: string;
  regulationReference?: string;
}

/**
 * Generate text embedding using OpenAI
 * @param text Text to embed
 * @returns 768-dimensional embedding vector
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await getOpenAIClient().embeddings.create({
      model: EMBEDDING_MODEL,
      input: text,
      dimensions: EMBEDDING_DIMENSIONS,
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error('OpenAI embedding generation failed:', error);
    // Return zero vector for graceful degradation
    return new Array(EMBEDDING_DIMENSIONS).fill(0);
  }
}

/**
 * Extract marketing claims from copy using GPT-4
 * Identifies claims that may have regulatory implications
 */
export async function extractClaimsFromText(text: string): Promise<ExtractedClaim[]> {
  const systemPrompt = `You are an FDA/FTC compliance expert analyzing cosmetic marketing copy for regulatory claims.

Identify and categorize all claims in the text. Categories:
- "disease": Claims about treating, curing, or preventing diseases (FDA violation)
- "drug": Claims about drug-like effects or medical outcomes (FDA violation)
- "efficacy": Claims about product effectiveness that may need substantiation
- "comparative": Claims comparing to other products ("#1", "best", etc.)
- "permanence": Claims about permanent or lasting effects
- "unsubstantiated": Claims using absolutes ("100%", "guaranteed", "proven")
- "safe": Marketing puffery that is generally acceptable

For each claim, extract:
1. The specific claim text
2. The category
3. The original sentence containing the claim
4. Your confidence (0-1) that this is a regulatory concern

Return JSON array of claims. Be thorough but don't flag normal marketing language.`;

  try {
    const response = await getOpenAIClient().chat.completions.create({
      model: CHAT_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Analyze this marketing copy:\n\n${text}` },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2,
    });

    const content = response.choices[0].message.content;
    if (!content) return [];

    const parsed = JSON.parse(content);
    return parsed.claims || [];
  } catch (error) {
    console.error('Claim extraction failed:', error);
    return [];
  }
}

/**
 * Generate compliant alternative suggestions for flagged claims
 */
export async function generateComplianceSuggestions(
  claims: ExtractedClaim[],
  productContext?: string
): Promise<ComplianceSuggestion[]> {
  if (claims.length === 0) return [];

  const violatingClaims = claims.filter(c => c.claimType !== 'safe');
  if (violatingClaims.length === 0) return [];

  const systemPrompt = `You are an FDA/FTC compliance expert helping rewrite cosmetic marketing claims.

For each problematic claim, provide:
1. The original claim
2. A compliant replacement that maintains marketing appeal
3. Brief explanation of why the change is needed
4. Relevant regulation reference (FDA 21 CFR, FTC Act, etc.)

Guidelines for compliant language:
- Replace disease claims with appearance/cosmetic benefits
- Use "helps", "may help", "designed to" instead of absolutes
- Replace "cures/treats" with "addresses the appearance of"
- Replace "eliminates" with "reduces the appearance of"
- Add qualifiers like "temporary", "with regular use"
- For comparative claims, ensure substantiation or remove

${productContext ? `Product context: ${productContext}` : ''}

Return JSON with array of suggestions.`;

  try {
    const response = await getOpenAIClient().chat.completions.create({
      model: CHAT_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Generate compliant alternatives for:\n\n${JSON.stringify(violatingClaims, null, 2)}` },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    const content = response.choices[0].message.content;
    if (!content) return [];

    const parsed = JSON.parse(content);
    return parsed.suggestions || [];
  } catch (error) {
    console.error('Suggestion generation failed:', error);
    return [];
  }
}

/**
 * Calculate semantic similarity between two texts
 * Uses cosine similarity on embeddings
 */
export async function calculateSimilarity(text1: string, text2: string): Promise<number> {
  const [embedding1, embedding2] = await Promise.all([
    generateEmbedding(text1),
    generateEmbedding(text2),
  ]);

  return cosineSimilarity(embedding1, embedding2);
}

/**
 * Cosine similarity between two vectors
 */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Batch generate embeddings for multiple texts
 * More efficient than individual calls
 */
export async function batchGenerateEmbeddings(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];

  try {
    const response = await getOpenAIClient().embeddings.create({
      model: EMBEDDING_MODEL,
      input: texts,
      dimensions: EMBEDDING_DIMENSIONS,
    });

    return response.data.map(d => d.embedding);
  } catch (error) {
    console.error('Batch embedding generation failed:', error);
    return texts.map(() => new Array(EMBEDDING_DIMENSIONS).fill(0));
  }
}

export default {
  generateEmbedding,
  extractClaimsFromText,
  generateComplianceSuggestions,
  calculateSimilarity,
  batchGenerateEmbeddings,
};
