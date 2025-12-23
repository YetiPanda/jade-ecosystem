/**
 * Progressive Disclosure - Animation Configurations
 *
 * Smooth transitions between disclosure levels
 */

import { AnimationConfig } from './types';

/**
 * Default animation durations (milliseconds)
 */
export const ANIMATION_DURATION = {
  /** Fast transitions for hover states */
  fast: 200,
  /** Normal transitions for expansions */
  normal: 300,
  /** Slow transitions for complex changes */
  slow: 500,
} as const;

/**
 * Easing functions for natural motion
 */
export const EASING = {
  /** Standard ease for most transitions */
  standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  /** Deceleration curve for entering elements */
  decelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
  /** Acceleration curve for exiting elements */
  accelerate: 'cubic-bezier(0.4, 0.0, 1, 1)',
  /** Sharp curve for attention-grabbing transitions */
  sharp: 'cubic-bezier(0.4, 0.0, 0.6, 1)',
} as const;

/**
 * Animation config for glance -> scan transition
 */
export const glanceToScanAnimation: AnimationConfig = {
  duration: ANIMATION_DURATION.normal,
  easing: EASING.decelerate,
  delay: 150, // Slight delay to prevent accidental triggers
};

/**
 * Animation config for scan -> study transition
 */
export const scanToStudyAnimation: AnimationConfig = {
  duration: ANIMATION_DURATION.slow,
  easing: EASING.standard,
  delay: 0,
};

/**
 * Animation config for collapsing back to glance
 */
export const collapseAnimation: AnimationConfig = {
  duration: ANIMATION_DURATION.fast,
  easing: EASING.accelerate,
  delay: 0,
};

/**
 * CSS class names for transition states
 */
export const TRANSITION_CLASSES = {
  glance: 'progressive-glance',
  scan: 'progressive-scan',
  study: 'progressive-study',
  transitioning: 'progressive-transitioning',
  entering: 'progressive-entering',
  exiting: 'progressive-exiting',
} as const;

/**
 * Get animation config based on level transition
 */
export function getAnimationConfig(
  from: 'glance' | 'scan' | 'study',
  to: 'glance' | 'scan' | 'study'
): AnimationConfig {
  // Collapsing to glance
  if (to === 'glance') {
    return collapseAnimation;
  }

  // Expanding from glance to scan
  if (from === 'glance' && to === 'scan') {
    return glanceToScanAnimation;
  }

  // Expanding from scan to study
  if (from === 'scan' && to === 'study') {
    return scanToStudyAnimation;
  }

  // Direct glance to study (rare)
  if (from === 'glance' && to === 'study') {
    return {
      duration: ANIMATION_DURATION.slow,
      easing: EASING.standard,
      delay: 0,
    };
  }

  // Default to normal animation
  return {
    duration: ANIMATION_DURATION.normal,
    easing: EASING.standard,
    delay: 0,
  };
}

/**
 * Generate CSS transition string
 */
export function generateTransition(config: AnimationConfig): string {
  const delay = config.delay ? `${config.delay}ms` : '0ms';
  return `all ${config.duration}ms ${config.easing} ${delay}`;
}
