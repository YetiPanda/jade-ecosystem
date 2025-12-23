/**
 * Unit tests for Mock Vector Generation Utilities
 * Tests T253 - Validates FR-054 (must complete in <100ms)
 */

import { describe, it, expect } from 'vitest';
import {
  generateMockEmbedding,
  generateMockTensor,
  validateVector,
} from '../mockVectorGeneration';

describe('generateMockEmbedding', () => {
  it('should generate a 792-dimensional embedding', () => {
    const text = 'hydrating serum';
    const embedding = generateMockEmbedding(text);

    expect(embedding).toHaveLength(792);
  });

  it('should generate deterministic embeddings for the same input', () => {
    const text = 'retinol cream';
    const embedding1 = generateMockEmbedding(text);
    const embedding2 = generateMockEmbedding(text);

    expect(embedding1).toEqual(embedding2);
  });

  it('should generate different embeddings for different inputs', () => {
    const embedding1 = generateMockEmbedding('vitamin c serum');
    const embedding2 = generateMockEmbedding('hyaluronic acid');

    expect(embedding1).not.toEqual(embedding2);
  });

  it('should generate values between 0 and 1', () => {
    const text = 'gentle cleanser';
    const embedding = generateMockEmbedding(text);

    embedding.forEach((value, index) => {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(1);
      expect(typeof value).toBe('number');
      expect(isNaN(value)).toBe(false);
    });
  });

  it('should be case-insensitive', () => {
    const embedding1 = generateMockEmbedding('NIACINAMIDE');
    const embedding2 = generateMockEmbedding('niacinamide');

    expect(embedding1).toEqual(embedding2);
  });

  it('should throw error for empty text', () => {
    expect(() => generateMockEmbedding('')).toThrow('Text cannot be empty');
    expect(() => generateMockEmbedding('   ')).toThrow('Text cannot be empty');
  });

  it('should throw error for text exceeding 500 characters', () => {
    const longText = 'a'.repeat(501);
    expect(() => generateMockEmbedding(longText)).toThrow(
      'Text exceeds maximum length of 500 characters'
    );
  });

  it('should handle maximum allowed text length (500 chars)', () => {
    const maxText = 'a'.repeat(500);
    const embedding = generateMockEmbedding(maxText);

    expect(embedding).toHaveLength(792);
  });

  it('should complete in under 100ms (FR-054)', () => {
    const text = 'sensitive skin facial cleanser with ceramides';
    const startTime = performance.now();

    generateMockEmbedding(text);

    const endTime = performance.now();
    const duration = endTime - startTime;

    expect(duration).toBeLessThan(100);
  });

  it('should handle special characters', () => {
    const text = 'anti-aging cream & moisturizer (24/7)';
    const embedding = generateMockEmbedding(text);

    expect(embedding).toHaveLength(792);
  });
});

describe('generateMockTensor', () => {
  it('should generate a 13-dimensional tensor', () => {
    const text = 'exfoliating toner';
    const tensor = generateMockTensor(text);

    expect(tensor).toHaveLength(13);
  });

  it('should generate deterministic tensors for the same input', () => {
    const text = 'peptide serum';
    const tensor1 = generateMockTensor(text);
    const tensor2 = generateMockTensor(text);

    expect(tensor1).toEqual(tensor2);
  });

  it('should generate different tensors for different inputs', () => {
    const tensor1 = generateMockTensor('collagen booster');
    const tensor2 = generateMockTensor('glycolic acid peel');

    expect(tensor1).not.toEqual(tensor2);
  });

  it('should generate values between 0 and 1', () => {
    const text = 'sunscreen SPF 50';
    const tensor = generateMockTensor(text);

    tensor.forEach((value, index) => {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(1);
      expect(typeof value).toBe('number');
      expect(isNaN(value)).toBe(false);
    });
  });

  it('should be case-insensitive', () => {
    const tensor1 = generateMockTensor('SALICYLIC ACID');
    const tensor2 = generateMockTensor('salicylic acid');

    expect(tensor1).toEqual(tensor2);
  });

  it('should throw error for empty text', () => {
    expect(() => generateMockTensor('')).toThrow('Text cannot be empty');
    expect(() => generateMockTensor('   ')).toThrow('Text cannot be empty');
  });

  it('should throw error for text exceeding 500 characters', () => {
    const longText = 'b'.repeat(501);
    expect(() => generateMockTensor(longText)).toThrow(
      'Text exceeds maximum length of 500 characters'
    );
  });

  it('should handle maximum allowed text length (500 chars)', () => {
    const maxText = 'b'.repeat(500);
    const tensor = generateMockTensor(maxText);

    expect(tensor).toHaveLength(13);
  });

  it('should complete in under 100ms (FR-054)', () => {
    const text = 'brightening vitamin C serum with ferulic acid';
    const startTime = performance.now();

    generateMockTensor(text);

    const endTime = performance.now();
    const duration = endTime - startTime;

    expect(duration).toBeLessThan(100);
  });

  it('should generate different values than embeddings for same input', () => {
    const text = 'retinol night cream';
    const embedding = generateMockEmbedding(text);
    const tensor = generateMockTensor(text);

    // Compare first 13 values (tensor length)
    const embeddingSlice = embedding.slice(0, 13);
    expect(tensor).not.toEqual(embeddingSlice);
  });
});

describe('validateVector', () => {
  it('should validate correct 792-D embedding', () => {
    const embedding = generateMockEmbedding('test product');
    expect(validateVector(embedding, 792)).toBe(true);
  });

  it('should validate correct 13-D tensor', () => {
    const tensor = generateMockTensor('test product');
    expect(validateVector(tensor, 13)).toBe(true);
  });

  it('should throw error for non-array input', () => {
    expect(() => validateVector('not an array' as any, 10)).toThrow(
      'Vector must be an array'
    );
  });

  it('should throw error for wrong dimensions', () => {
    const vector = [0.5, 0.5, 0.5];
    expect(() => validateVector(vector, 10)).toThrow(
      'Vector has 3 dimensions, expected 10'
    );
  });

  it('should throw error for non-number values', () => {
    const vector = [0.5, 'invalid' as any, 0.5];
    expect(() => validateVector(vector, 3)).toThrow('Invalid value at index 1');
  });

  it('should throw error for NaN values', () => {
    const vector = [0.5, NaN, 0.5];
    expect(() => validateVector(vector, 3)).toThrow('Invalid value at index 1');
  });

  it('should throw error for values < 0', () => {
    const vector = [0.5, -0.1, 0.5];
    expect(() => validateVector(vector, 3)).toThrow(
      'Value at index 1 is out of range'
    );
  });

  it('should throw error for values > 1', () => {
    const vector = [0.5, 1.5, 0.5];
    expect(() => validateVector(vector, 3)).toThrow(
      'Value at index 1 is out of range'
    );
  });

  it('should accept edge values 0 and 1', () => {
    const vector = [0, 0.5, 1];
    expect(validateVector(vector, 3)).toBe(true);
  });
});

describe('Performance benchmark (FR-054)', () => {
  it('should generate both embedding and tensor in under 100ms combined', () => {
    const text = 'comprehensive skincare treatment with multiple active ingredients';
    const startTime = performance.now();

    generateMockEmbedding(text);
    generateMockTensor(text);

    const endTime = performance.now();
    const duration = endTime - startTime;

    expect(duration).toBeLessThan(100);
  });

  it('should handle multiple rapid generations efficiently', () => {
    const queries = [
      'hydrating serum',
      'anti-aging cream',
      'vitamin c',
      'retinol',
      'niacinamide',
    ];

    const startTime = performance.now();

    queries.forEach((query) => {
      generateMockEmbedding(query);
      generateMockTensor(query);
    });

    const endTime = performance.now();
    const duration = endTime - startTime;

    // 5 queries * 2 vectors each = 10 generations should be fast
    expect(duration).toBeLessThan(500);
  });
});
