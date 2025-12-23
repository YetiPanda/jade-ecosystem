/**
 * Progressive Disclosure - State Management Hook
 *
 * Manages transition state between disclosure levels
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import type { ProgressiveLevel, TransitionState, UseProgressiveStateReturn } from '../types';
import { ANIMATION_DURATION, getAnimationConfig } from '../animations';

/**
 * Custom hook for managing progressive disclosure state
 */
export function useProgressiveState(
  initialLevel: ProgressiveLevel = 'glance',
  transitionDuration: number = ANIMATION_DURATION.normal
): UseProgressiveStateReturn {
  const [level, setLevel] = useState<ProgressiveLevel>(initialLevel);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionState, setTransitionState] = useState<TransitionState>({
    isTransitioning: false,
    previousLevel: null,
    currentLevel: initialLevel,
  });

  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Generic transition handler
   */
  const transitionTo = useCallback(
    (targetLevel: ProgressiveLevel) => {
      if (level === targetLevel || isTransitioning) {
        return;
      }

      // Clear any pending transitions
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }

      // Start transition
      setIsTransitioning(true);
      setTransitionState({
        isTransitioning: true,
        previousLevel: level,
        currentLevel: targetLevel,
      });

      // Get animation config for this transition
      const config = getAnimationConfig(level, targetLevel);
      const totalDuration = config.duration + (config.delay || 0);

      // Complete transition after animation
      transitionTimeoutRef.current = setTimeout(() => {
        setLevel(targetLevel);
        setIsTransitioning(false);
        setTransitionState({
          isTransitioning: false,
          previousLevel: level,
          currentLevel: targetLevel,
        });
      }, totalDuration);
    },
    [level, isTransitioning]
  );

  /**
   * Transition to scan level
   */
  const transitionToScan = useCallback(() => {
    transitionTo('scan');
  }, [transitionTo]);

  /**
   * Transition to study level
   */
  const transitionToStudy = useCallback(() => {
    transitionTo('study');
  }, [transitionTo]);

  /**
   * Reset to glance level
   */
  const resetToGlance = useCallback(() => {
    transitionTo('glance');
  }, [transitionTo]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  return {
    level,
    isTransitioning,
    transitionToScan,
    transitionToStudy,
    resetToGlance,
    transitionState,
  };
}
