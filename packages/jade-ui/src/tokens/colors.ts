/**
 * JADE Design System - Color Tokens
 *
 * Color palette for the JADE ecosystem.
 * Based on the Jade green brand identity with semantic color naming.
 */

export const colors = {
  // Primary Jade palette
  jade: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',  // Primary brand color
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },

  // Neutral grays
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#030712',
  },

  // Semantic colors
  blue: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    900: '#1e3a8a',
  },

  red: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    600: '#dc2626',
    900: '#7f1d1d',
  },

  yellow: {
    50: '#fefce8',
    100: '#fef9c3',
    500: '#eab308',
    600: '#ca8a04',
    900: '#713f12',
  },

  // Semantic aliases
  success: {
    DEFAULT: '#22c55e',
    light: '#86efac',
    dark: '#15803d',
  },

  warning: {
    DEFAULT: '#eab308',
    light: '#fef9c3',
    dark: '#ca8a04',
  },

  error: {
    DEFAULT: '#ef4444',
    light: '#fee2e2',
    dark: '#dc2626',
  },

  info: {
    DEFAULT: '#3b82f6',
    light: '#dbeafe',
    dark: '#2563eb',
  },
} as const;

// CSS variable mapping
export const semanticColors = {
  background: 'hsl(0 0% 100%)',
  foreground: 'hsl(222.2 84% 4.9%)',

  card: 'hsl(0 0% 100%)',
  cardForeground: 'hsl(222.2 84% 4.9%)',

  popover: 'hsl(0 0% 100%)',
  popoverForeground: 'hsl(222.2 84% 4.9%)',

  primary: 'hsl(142.1 76.2% 36.3%)',  // jade-500
  primaryForeground: 'hsl(355.7 100% 97.3%)',

  secondary: 'hsl(210 40% 96.1%)',
  secondaryForeground: 'hsl(222.2 47.4% 11.2%)',

  muted: 'hsl(210 40% 96.1%)',
  mutedForeground: 'hsl(215.4 16.3% 46.9%)',

  accent: 'hsl(210 40% 96.1%)',
  accentForeground: 'hsl(222.2 47.4% 11.2%)',

  destructive: 'hsl(0 84.2% 60.2%)',  // red-500
  destructiveForeground: 'hsl(210 40% 98%)',

  border: 'hsl(214.3 31.8% 91.4%)',
  input: 'hsl(214.3 31.8% 91.4%)',
  ring: 'hsl(142.1 76.2% 36.3%)',  // jade-500

  radius: '0.5rem',
} as const;

// Dark mode colors
export const darkColors = {
  background: 'hsl(222.2 84% 4.9%)',
  foreground: 'hsl(210 40% 98%)',

  card: 'hsl(222.2 84% 4.9%)',
  cardForeground: 'hsl(210 40% 98%)',

  popover: 'hsl(222.2 84% 4.9%)',
  popoverForeground: 'hsl(210 40% 98%)',

  primary: 'hsl(142.1 70.6% 45.3%)',  // jade-400
  primaryForeground: 'hsl(144.9 80.4% 10%)',

  secondary: 'hsl(217.2 32.6% 17.5%)',
  secondaryForeground: 'hsl(210 40% 98%)',

  muted: 'hsl(217.2 32.6% 17.5%)',
  mutedForeground: 'hsl(215 20.2% 65.1%)',

  accent: 'hsl(217.2 32.6% 17.5%)',
  accentForeground: 'hsl(210 40% 98%)',

  destructive: 'hsl(0 62.8% 30.6%)',
  destructiveForeground: 'hsl(210 40% 98%)',

  border: 'hsl(217.2 32.6% 17.5%)',
  input: 'hsl(217.2 32.6% 17.5%)',
  ring: 'hsl(142.1 70.6% 45.3%)',  // jade-400
} as const;

export type ColorToken = keyof typeof colors;
export type SemanticColorToken = keyof typeof semanticColors;
