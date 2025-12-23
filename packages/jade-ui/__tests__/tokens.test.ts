import { describe, it, expect } from 'vitest';
import { colors, spacing, fontSize, fontWeight, semanticColors } from '../src/tokens';

describe('Design Tokens', () => {
  describe('Colors', () => {
    it('should have jade primary color palette', () => {
      expect(colors.jade[500]).toBe('#22c55e');
      expect(colors.jade[50]).toBe('#f0fdf4');
      expect(colors.jade[900]).toBe('#14532d');
    });

    it('should have gray neutral colors', () => {
      expect(colors.gray[500]).toBe('#6b7280');
      expect(colors.gray[100]).toBe('#f3f4f6');
      expect(colors.gray[900]).toBe('#111827');
    });

    it('should have semantic color aliases', () => {
      expect(colors.success.DEFAULT).toBe('#22c55e');
      expect(colors.error.DEFAULT).toBe('#ef4444');
      expect(colors.warning.DEFAULT).toBe('#eab308');
      expect(colors.info.DEFAULT).toBe('#3b82f6');
    });

    it('should have semantic colors for CSS variables', () => {
      expect(semanticColors.primary).toBeDefined();
      expect(semanticColors.background).toBeDefined();
      expect(semanticColors.foreground).toBeDefined();
    });
  });

  describe('Spacing', () => {
    it('should have base spacing scale', () => {
      expect(spacing[0]).toBe('0');
      expect(spacing[1]).toBe('0.25rem');
      expect(spacing[4]).toBe('1rem');
      expect(spacing[8]).toBe('2rem');
    });

    it('should have fractional spacing values', () => {
      expect(spacing[0.5]).toBe('0.125rem');
      expect(spacing[1.5]).toBe('0.375rem');
      expect(spacing[2.5]).toBe('0.625rem');
    });

    it('should have large spacing values', () => {
      expect(spacing[96]).toBe('24rem');
      expect(spacing[64]).toBe('16rem');
    });
  });

  describe('Typography', () => {
    it('should have font size scale', () => {
      expect(fontSize.xs).toBe('0.75rem');
      expect(fontSize.base).toBe('1rem');
      expect(fontSize.xl).toBe('1.25rem');
      expect(fontSize['4xl']).toBe('2.25rem');
    });

    it('should have font weights', () => {
      expect(fontWeight.normal).toBe('400');
      expect(fontWeight.medium).toBe('500');
      expect(fontWeight.semibold).toBe('600');
      expect(fontWeight.bold).toBe('700');
    });

    it('should have font family definitions', () => {
      const { fontFamily } = require('../src/tokens/typography');
      expect(fontFamily.sans).toContain('Inter');
      expect(fontFamily.mono).toContain('monospace');
    });
  });
});
