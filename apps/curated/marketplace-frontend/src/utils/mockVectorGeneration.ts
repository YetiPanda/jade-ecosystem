/**
 * Mock Vector Generation Utilities
 *
 * These utilities generate deterministic mock vectors for Phase 7 Vector Search UI.
 * They enable development and testing without requiring a real embedding service.
 *
 * IMPORTANT: These functions will be replaced with real embedding service calls
 * in the future without requiring changes to UI components (per FR-062, FR-064).
 */

/**
 * Generates a deterministic 792-dimensional mock embedding from text.
 * Uses a hash-based algorithm to ensure consistent output for the same input.
 *
 * Per FR-061: Initial Phase 7 implementation uses mock embeddings
 * Per FR-062: Encapsulated in utility for seamless replacement
 * Per FR-054: Must complete in <100ms
 *
 * @param text - Search text to generate embedding from (1-500 characters)
 * @returns Array of 792 floating-point values between 0 and 1
 */
export function generateMockEmbedding(text: string): number[] {
  if (!text || text.trim().length === 0) {
    throw new Error('Text cannot be empty');
  }

  if (text.length > 500) {
    throw new Error('Text exceeds maximum length of 500 characters');
  }

  // Generate seed from text using simple character code sum
  const seed = text
    .toLowerCase()
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  // Generate 792-dimensional embedding using deterministic algorithm
  const embedding: number[] = [];
  for (let i = 0; i < 792; i++) {
    // Use sine function with seed and index for deterministic variation
    // Normalize to 0-1 range
    const value = Math.abs(Math.sin(seed * 0.0001 + i * 0.01)) * 0.8 + 0.1;
    embedding.push(value);
  }

  return embedding;
}

/**
 * Generates a deterministic 13-dimensional mock tensor from text.
 * Uses a hash-based algorithm to ensure consistent output for the same input.
 *
 * Per FR-061: Initial Phase 7 implementation uses mock tensors
 * Per FR-062: Encapsulated in utility for seamless replacement
 * Per FR-054: Must complete in <100ms
 *
 * @param text - Search text to generate tensor from (1-500 characters)
 * @returns Array of 13 floating-point values between 0 and 1
 */
export function generateMockTensor(text: string): number[] {
  if (!text || text.trim().length === 0) {
    throw new Error('Text cannot be empty');
  }

  if (text.length > 500) {
    throw new Error('Text exceeds maximum length of 500 characters');
  }

  // Generate seed from text using character code sum with different algorithm
  const seed = text
    .toLowerCase()
    .split('')
    .reduce((acc, char, idx) => acc + char.charCodeAt(0) * (idx + 1), 0);

  // Generate 13-dimensional tensor using deterministic algorithm
  const tensor: number[] = [];
  for (let i = 0; i < 13; i++) {
    // Use cosine function with seed and index for deterministic variation
    // Normalize to 0-1 range
    const value = (Math.cos(seed * 0.001 + i * 0.5) + 1) * 0.5;
    tensor.push(value);
  }

  return tensor;
}

/**
 * Validates that a vector has the expected dimensionality and value range.
 * Useful for testing and debugging.
 *
 * @param vector - Vector to validate
 * @param expectedDimensions - Expected number of dimensions
 * @returns True if valid, throws error otherwise
 */
export function validateVector(
  vector: number[],
  expectedDimensions: number
): boolean {
  if (!Array.isArray(vector)) {
    throw new Error('Vector must be an array');
  }

  if (vector.length !== expectedDimensions) {
    throw new Error(
      `Vector has ${vector.length} dimensions, expected ${expectedDimensions}`
    );
  }

  for (let i = 0; i < vector.length; i++) {
    const value = vector[i];
    if (typeof value !== 'number' || isNaN(value)) {
      throw new Error(`Invalid value at index ${i}: ${value}`);
    }
    if (value < 0 || value > 1) {
      throw new Error(
        `Value at index ${i} is out of range [0, 1]: ${value}`
      );
    }
  }

  return true;
}

/**
 * Future: This function will be replaced with real embedding service call.
 *
 * Example real implementation (per FR-064):
 *
 * export async function generateEmbedding(text: string): Promise<number[]> {
 *   const response = await fetch('/api/embeddings', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({ text })
 *   });
 *   const data = await response.json();
 *   return data.embedding; // 792-D vector
 * }
 */

/**
 * Future: This function will be replaced with real tensor generation service.
 *
 * Example real implementation (per FR-064):
 *
 * export async function generateTensor(text: string): Promise<number[]> {
 *   const response = await fetch('/api/tensors', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({ text })
 *   });
 *   const data = await response.json();
 *   return data.tensor; // 13-D vector
 * }
 */
