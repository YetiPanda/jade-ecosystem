/**
 * Progressive Disclosure - Base Content Component
 *
 * Generic component that orchestrates progressive disclosure pattern
 * Can be used with any data type through renderers
 */

import React, { useEffect } from 'react';
import './progressive.css';
import { useProgressiveState } from './hooks/useProgressiveState';
import { TRANSITION_CLASSES, generateTransition, getAnimationConfig } from './animations';
import type { ProgressiveContentProps, ProgressiveLevel } from './types';

/**
 * ProgressiveContent - Generic progressive disclosure container
 *
 * Usage:
 * ```tsx
 * <ProgressiveContent
 *   data={productData}
 *   glanceRenderer={(data) => <ProductGlance {...data} />}
 *   scanRenderer={(data) => <ProductScan {...data} />}
 *   studyRenderer={(data) => <ProductStudy {...data} />}
 * />
 * ```
 */
export function ProgressiveContent<T>({
  data,
  glanceRenderer,
  scanRenderer,
  studyRenderer,
  initialLevel = 'glance',
  transitionDuration = 300,
  onLevelChange,
  className = '',
}: ProgressiveContentProps<T>) {
  const {
    level,
    isTransitioning,
    transitionToScan,
    transitionToStudy,
    resetToGlance,
    transitionState,
  } = useProgressiveState(initialLevel, transitionDuration);

  /**
   * Notify parent when level changes
   */
  useEffect(() => {
    if (onLevelChange && !isTransitioning) {
      onLevelChange(level);
    }
  }, [level, isTransitioning, onLevelChange]);

  /**
   * Get appropriate renderer for current level
   */
  const getCurrentRenderer = () => {
    switch (level) {
      case 'glance':
        return glanceRenderer(data);
      case 'scan':
        return scanRenderer(data);
      case 'study':
        return studyRenderer(data);
      default:
        return glanceRenderer(data);
    }
  };

  /**
   * Get CSS classes for current state
   */
  const getStateClasses = () => {
    const classes = [
      'progressive-content',
      TRANSITION_CLASSES[level],
      className,
    ];

    if (isTransitioning) {
      classes.push(TRANSITION_CLASSES.transitioning);
    }

    return classes.filter(Boolean).join(' ');
  };

  /**
   * Get transition style for current state
   */
  const getTransitionStyle = (): React.CSSProperties => {
    if (!transitionState.previousLevel) {
      return {};
    }

    const config = getAnimationConfig(
      transitionState.previousLevel,
      transitionState.currentLevel
    );

    return {
      transition: generateTransition(config),
    };
  };

  /**
   * Handle mouse enter - transition to scan level
   */
  const handleMouseEnter = () => {
    if (level === 'glance') {
      transitionToScan();
    }
  };

  /**
   * Handle mouse leave - reset to glance level
   */
  const handleMouseLeave = () => {
    if (level === 'scan' || level === 'study') {
      resetToGlance();
    }
  };

  /**
   * Handle click - transition to study level
   */
  const handleClick = () => {
    if (level === 'scan') {
      transitionToStudy();
    }
  };

  return (
    <div
      className={getStateClasses()}
      style={getTransitionStyle()}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      data-level={level}
      data-transitioning={isTransitioning}
    >
      {getCurrentRenderer()}
    </div>
  );
}

/**
 * Default export for convenience
 */
export default ProgressiveContent;
