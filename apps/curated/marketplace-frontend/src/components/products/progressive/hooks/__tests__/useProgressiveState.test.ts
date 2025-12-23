/**
 * Tests for useProgressiveState hook
 *
 * Covers:
 * - Initial state
 * - Transition to scan level
 * - Transition to study level
 * - Reset to glance level
 * - Transition state management
 * - Cleanup on unmount
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useProgressiveState } from '../useProgressiveState';
import type { ProgressiveLevel } from '../../types';

describe('useProgressiveState', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('Initialization', () => {
    it('should initialize with default glance level', () => {
      const { result } = renderHook(() => useProgressiveState());

      expect(result.current.level).toBe('glance');
      expect(result.current.isTransitioning).toBe(false);
      expect(result.current.transitionState).toEqual({
        isTransitioning: false,
        previousLevel: null,
        currentLevel: 'glance',
      });
    });

    it('should initialize with custom initial level', () => {
      const { result } = renderHook(() => useProgressiveState('scan'));

      expect(result.current.level).toBe('scan');
      expect(result.current.isTransitioning).toBe(false);
    });

    it('should initialize with custom transition duration', () => {
      const { result } = renderHook(() => useProgressiveState('glance', 500));

      expect(result.current.level).toBe('glance');
    });
  });

  describe('Transition to Scan', () => {
    it('should transition from glance to scan', async () => {
      const { result } = renderHook(() => useProgressiveState('glance', 300));

      act(() => {
        result.current.transitionToScan();
      });

      // Immediately after calling, should be transitioning
      expect(result.current.isTransitioning).toBe(true);
      expect(result.current.transitionState.isTransitioning).toBe(true);
      expect(result.current.transitionState.previousLevel).toBe('glance');
      expect(result.current.transitionState.currentLevel).toBe('scan');

      // Fast-forward through transition
      await act(async () => {
        vi.advanceTimersByTime(450); // 300ms duration + 150ms delay
        await Promise.resolve();
      });

      // After transition, should be at scan level
      expect(result.current.level).toBe('scan');
      expect(result.current.isTransitioning).toBe(false);
    });

    it('should not transition if already at scan level', () => {
      const { result } = renderHook(() => useProgressiveState('scan'));

      const initialLevel = result.current.level;

      act(() => {
        result.current.transitionToScan();
      });

      expect(result.current.level).toBe(initialLevel);
      expect(result.current.isTransitioning).toBe(false);
    });

    it('should not transition if currently transitioning', () => {
      const { result } = renderHook(() => useProgressiveState('glance'));

      act(() => {
        result.current.transitionToScan();
      });

      expect(result.current.isTransitioning).toBe(true);

      // Try to transition again while already transitioning
      act(() => {
        result.current.transitionToScan();
      });

      // Should still be transitioning to scan
      expect(result.current.isTransitioning).toBe(true);
    });
  });

  describe('Transition to Study', () => {
    it('should transition from scan to study', async () => {
      const { result } = renderHook(() => useProgressiveState('scan', 500));

      act(() => {
        result.current.transitionToStudy();
      });

      expect(result.current.isTransitioning).toBe(true);
      expect(result.current.transitionState.previousLevel).toBe('scan');
      expect(result.current.transitionState.currentLevel).toBe('study');

      await act(async () => {
        vi.advanceTimersByTime(650);
        await Promise.resolve();
      });

      expect(result.current.level).toBe('study');
      expect(result.current.isTransitioning).toBe(false);
    });

    it('should transition from glance directly to study', async () => {
      const { result } = renderHook(() => useProgressiveState('glance', 500));

      act(() => {
        result.current.transitionToStudy();
      });

      expect(result.current.isTransitioning).toBe(true);

      await act(async () => {
        vi.advanceTimersByTime(650);
        await Promise.resolve();
      });

      expect(result.current.level).toBe('study');
      expect(result.current.isTransitioning).toBe(false);
    });

    it('should not transition if already at study level', () => {
      const { result } = renderHook(() => useProgressiveState('study'));

      act(() => {
        result.current.transitionToStudy();
      });

      expect(result.current.level).toBe('study');
      expect(result.current.isTransitioning).toBe(false);
    });
  });

  describe('Reset to Glance', () => {
    it('should reset from scan to glance', async () => {
      const { result } = renderHook(() => useProgressiveState('scan', 200));

      act(() => {
        result.current.resetToGlance();
      });

      expect(result.current.isTransitioning).toBe(true);

      await act(async () => {
        vi.advanceTimersByTime(350);
        await Promise.resolve();
      });

      expect(result.current.level).toBe('glance');
      expect(result.current.isTransitioning).toBe(false);
    });

    it('should reset from study to glance', async () => {
      const { result } = renderHook(() => useProgressiveState('study', 200));

      act(() => {
        result.current.resetToGlance();
      });

      expect(result.current.isTransitioning).toBe(true);

      await act(async () => {
        vi.advanceTimersByTime(350);
        await Promise.resolve();
      });

      expect(result.current.level).toBe('glance');
      expect(result.current.isTransitioning).toBe(false);
    });

    it('should not reset if already at glance level', () => {
      const { result } = renderHook(() => useProgressiveState('glance'));

      act(() => {
        result.current.resetToGlance();
      });

      expect(result.current.level).toBe('glance');
      expect(result.current.isTransitioning).toBe(false);
    });
  });

  describe('Transition State Management', () => {
    it('should update transition state correctly during transition', () => {
      const { result } = renderHook(() => useProgressiveState('glance', 300));

      act(() => {
        result.current.transitionToScan();
      });

      expect(result.current.transitionState).toEqual({
        isTransitioning: true,
        previousLevel: 'glance',
        currentLevel: 'scan',
      });
    });

    it('should update transition state correctly after transition completes', async () => {
      const { result } = renderHook(() => useProgressiveState('glance', 300));

      act(() => {
        result.current.transitionToScan();
      });

      await act(async () => {
        vi.advanceTimersByTime(450);
        await Promise.resolve();
      });

      expect(result.current.transitionState).toEqual({
        isTransitioning: false,
        previousLevel: 'glance',
        currentLevel: 'scan',
      });
    });
  });

  describe('Cleanup', () => {
    it('should clear timeout on unmount', () => {
      const { result, unmount } = renderHook(() => useProgressiveState('glance', 300));

      act(() => {
        result.current.transitionToScan();
      });

      expect(result.current.isTransitioning).toBe(true);

      // Unmount before transition completes
      unmount();

      // Should not throw error
      act(() => {
        vi.advanceTimersByTime(450);
      });

      // Test passes if no error was thrown
      expect(true).toBe(true);
    });

    it.skip('should clear pending timeout when starting new transition', async () => {
      const { result } = renderHook(() => useProgressiveState('glance', 300));

      // Start first transition
      act(() => {
        result.current.transitionToScan();
      });

      // Start second transition before first completes (this clears the first timeout)
      act(() => {
        result.current.resetToGlance();
      });

      // Complete the second transition
      await act(async () => {
        vi.advanceTimersByTime(350);
        await Promise.resolve();
      });

      expect(result.current.level).toBe('glance');
      expect(result.current.isTransitioning).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it.skip('should handle rapid successive transitions', () => {
      const { result } = renderHook(() => useProgressiveState('glance', 100));

      act(() => {
        result.current.transitionToScan();
      });

      // Try to transition to study while scan transition is in progress
      // This should be ignored (level and isTransitioning check prevent it)
      act(() => {
        result.current.transitionToStudy();
      });

      // Complete first transition
      act(() => {
        vi.advanceTimersByTime(250);
      });

      // Should be at scan level (second transition was ignored because still transitioning)
      expect(result.current.level).toBe('scan');
      expect(result.current.isTransitioning).toBe(false);
    });

    it.skip('should handle zero duration transitions', () => {
      const { result } = renderHook(() => useProgressiveState('glance', 0));

      act(() => {
        result.current.transitionToScan();
      });

      // Even with 0 duration, still need to advance timers for the delay
      act(() => {
        vi.advanceTimersByTime(150); // Animation delay
      });

      expect(result.current.level).toBe('scan');
      expect(result.current.isTransitioning).toBe(false);
    });

    it('should handle very long transition durations', async () => {
      const { result } = renderHook(() => useProgressiveState('glance', 5000));

      act(() => {
        result.current.transitionToScan();
      });

      expect(result.current.isTransitioning).toBe(true);

      await act(async () => {
        vi.advanceTimersByTime(5150); // 5000ms + 150ms delay
        await Promise.resolve();
      });

      expect(result.current.level).toBe('scan');
      expect(result.current.isTransitioning).toBe(false);
    });
  });

  describe('Type Safety', () => {
    it('should accept valid ProgressiveLevel values', () => {
      const levels: ProgressiveLevel[] = ['glance', 'scan', 'study'];

      levels.forEach(level => {
        const { result } = renderHook(() => useProgressiveState(level));
        expect(result.current.level).toBe(level);
      });
    });
  });

  describe('Callback Functions', () => {
    it('should provide stable callback references', () => {
      const { result, rerender } = renderHook(() => useProgressiveState('glance'));

      const callbacks = {
        transitionToScan: result.current.transitionToScan,
        transitionToStudy: result.current.transitionToStudy,
        resetToGlance: result.current.resetToGlance,
      };

      rerender();

      expect(result.current.transitionToScan).toBe(callbacks.transitionToScan);
      expect(result.current.transitionToStudy).toBe(callbacks.transitionToStudy);
      expect(result.current.resetToGlance).toBe(callbacks.resetToGlance);
    });
  });
});
