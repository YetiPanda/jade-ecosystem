/**
 * Tests for ProgressiveContent component
 *
 * Covers:
 * - Rendering with different data types
 * - Level transitions on interactions
 * - Callback invocations
 * - CSS class management
 * - Accessibility
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ProgressiveContent } from '../ProgressiveContent';
import type { ProgressiveLevel } from '../types';

// Simple test data
interface TestData {
  id: string;
  title: string;
  description: string;
}

const mockData: TestData = {
  id: 'test-1',
  title: 'Test Product',
  description: 'Test description',
};

// Mock renderers
const mockGlanceRenderer = (data: TestData) => (
  <div data-testid="glance-view">
    <h3>{data.title}</h3>
  </div>
);

const mockScanRenderer = (data: TestData) => (
  <div data-testid="scan-view">
    <h3>{data.title}</h3>
    <p>{data.description}</p>
  </div>
);

const mockStudyRenderer = (data: TestData) => (
  <div data-testid="study-view">
    <h3>{data.title}</h3>
    <p>{data.description}</p>
    <div>Detailed information</div>
  </div>
);

describe('ProgressiveContent', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('Rendering', () => {
    it('should render glance view by default', () => {
      render(
        <ProgressiveContent
          data={mockData}
          glanceRenderer={mockGlanceRenderer}
          scanRenderer={mockScanRenderer}
          studyRenderer={mockStudyRenderer}
        />
      );

      expect(screen.getByTestId('glance-view')).toBeInTheDocument();
      expect(screen.queryByTestId('scan-view')).not.toBeInTheDocument();
      expect(screen.queryByTestId('study-view')).not.toBeInTheDocument();
    });

    it('should render with custom initial level', () => {
      render(
        <ProgressiveContent
          data={mockData}
          glanceRenderer={mockGlanceRenderer}
          scanRenderer={mockScanRenderer}
          studyRenderer={mockStudyRenderer}
          initialLevel="scan"
        />
      );

      expect(screen.queryByTestId('glance-view')).not.toBeInTheDocument();
      expect(screen.getByTestId('scan-view')).toBeInTheDocument();
      expect(screen.queryByTestId('study-view')).not.toBeInTheDocument();
    });

    it('should render data correctly', () => {
      render(
        <ProgressiveContent
          data={mockData}
          glanceRenderer={mockGlanceRenderer}
          scanRenderer={mockScanRenderer}
          studyRenderer={mockStudyRenderer}
        />
      );

      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <ProgressiveContent
          data={mockData}
          glanceRenderer={mockGlanceRenderer}
          scanRenderer={mockScanRenderer}
          studyRenderer={mockStudyRenderer}
          className="custom-class"
        />
      );

      const element = container.querySelector('.progressive-content');
      expect(element).toHaveClass('custom-class');
    });
  });

  describe('Mouse Interactions', () => {
    it('should transition to scan on mouse enter', async () => {
      const { container } = render(
        <ProgressiveContent
          data={mockData}
          glanceRenderer={mockGlanceRenderer}
          scanRenderer={mockScanRenderer}
          studyRenderer={mockStudyRenderer}
          transitionDuration={300}
        />
      );

      const element = container.querySelector('.progressive-content');
      expect(element).not.toBeNull();

      await act(async () => {
        fireEvent.mouseEnter(element!);
        vi.advanceTimersByTime(450);
        await Promise.resolve();
      });

      expect(screen.getByTestId('scan-view')).toBeInTheDocument();
    });

    it('should reset to glance on mouse leave from scan', async () => {
      const { container } = render(
        <ProgressiveContent
          data={mockData}
          glanceRenderer={mockGlanceRenderer}
          scanRenderer={mockScanRenderer}
          studyRenderer={mockStudyRenderer}
          initialLevel="scan"
          transitionDuration={200}
        />
      );

      const element = container.querySelector('.progressive-content');

      await act(async () => {
        fireEvent.mouseLeave(element!);
        vi.advanceTimersByTime(350);
        await Promise.resolve();
      });

      expect(screen.getByTestId('glance-view')).toBeInTheDocument();
    });

    it('should transition to study on click from scan', async () => {
      const { container } = render(
        <ProgressiveContent
          data={mockData}
          glanceRenderer={mockGlanceRenderer}
          scanRenderer={mockScanRenderer}
          studyRenderer={mockStudyRenderer}
          initialLevel="scan"
          transitionDuration={500}
        />
      );

      const element = container.querySelector('.progressive-content');

      await act(async () => {
        fireEvent.click(element!);
        vi.advanceTimersByTime(650);
        await Promise.resolve();
      });

      expect(screen.getByTestId('study-view')).toBeInTheDocument();
    });

    it('should not transition on click from glance', () => {
      const { container } = render(
        <ProgressiveContent
          data={mockData}
          glanceRenderer={mockGlanceRenderer}
          scanRenderer={mockScanRenderer}
          studyRenderer={mockStudyRenderer}
        />
      );

      const element = container.querySelector('.progressive-content');
      fireEvent.click(element!);

      expect(screen.getByTestId('glance-view')).toBeInTheDocument();
      expect(screen.queryByTestId('study-view')).not.toBeInTheDocument();
    });
  });

  describe('Level Change Callback', () => {
    it('should call onLevelChange when level changes', async () => {
      const handleLevelChange = vi.fn();
      const { container } = render(
        <ProgressiveContent
          data={mockData}
          glanceRenderer={mockGlanceRenderer}
          scanRenderer={mockScanRenderer}
          studyRenderer={mockStudyRenderer}
          onLevelChange={handleLevelChange}
          transitionDuration={300}
        />
      );

      const element = container.querySelector('.progressive-content');

      await act(async () => {
        fireEvent.mouseEnter(element!);
        vi.advanceTimersByTime(450);
        await Promise.resolve();
      });

      expect(handleLevelChange).toHaveBeenCalledWith('scan');
    });

    it('should not call onLevelChange during transition', async () => {
      const handleLevelChange = vi.fn();
      const { container } = render(
        <ProgressiveContent
          data={mockData}
          glanceRenderer={mockGlanceRenderer}
          scanRenderer={mockScanRenderer}
          studyRenderer={mockStudyRenderer}
          onLevelChange={handleLevelChange}
          transitionDuration={300}
        />
      );

      // Clear the initial call from mount
      handleLevelChange.mockClear();

      const element = container.querySelector('.progressive-content');

      await act(async () => {
        fireEvent.mouseEnter(element!);
        // Don't advance timer enough - still transitioning
        vi.advanceTimersByTime(100);
        await Promise.resolve();
      });

      // Should not have been called during transition
      expect(handleLevelChange).not.toHaveBeenCalled();
    });
  });

  describe('CSS Classes', () => {
    it('should apply level-specific class for glance', () => {
      const { container } = render(
        <ProgressiveContent
          data={mockData}
          glanceRenderer={mockGlanceRenderer}
          scanRenderer={mockScanRenderer}
          studyRenderer={mockStudyRenderer}
        />
      );

      const element = container.querySelector('.progressive-content');
      expect(element).toHaveClass('progressive-glance');
    });

    it('should apply level-specific class for scan', async () => {
      const { container } = render(
        <ProgressiveContent
          data={mockData}
          glanceRenderer={mockGlanceRenderer}
          scanRenderer={mockScanRenderer}
          studyRenderer={mockStudyRenderer}
          initialLevel="scan"
        />
      );

      const element = container.querySelector('.progressive-content');
      expect(element).toHaveClass('progressive-scan');
    });

    it('should apply transitioning class during transition', () => {
      const { container } = render(
        <ProgressiveContent
          data={mockData}
          glanceRenderer={mockGlanceRenderer}
          scanRenderer={mockScanRenderer}
          studyRenderer={mockStudyRenderer}
        />
      );

      const element = container.querySelector('.progressive-content');
      fireEvent.mouseEnter(element!);

      // During transition
      expect(element).toHaveClass('progressive-transitioning');
    });
  });

  describe('Data Attributes', () => {
    it('should set data-level attribute', () => {
      const { container } = render(
        <ProgressiveContent
          data={mockData}
          glanceRenderer={mockGlanceRenderer}
          scanRenderer={mockScanRenderer}
          studyRenderer={mockStudyRenderer}
        />
      );

      const element = container.querySelector('.progressive-content');
      expect(element).toHaveAttribute('data-level', 'glance');
    });

    it('should set data-transitioning attribute', () => {
      const { container } = render(
        <ProgressiveContent
          data={mockData}
          glanceRenderer={mockGlanceRenderer}
          scanRenderer={mockScanRenderer}
          studyRenderer={mockStudyRenderer}
        />
      );

      const element = container.querySelector('.progressive-content');

      // Initially not transitioning
      expect(element).toHaveAttribute('data-transitioning', 'false');

      fireEvent.mouseEnter(element!);

      // During transition
      expect(element).toHaveAttribute('data-transitioning', 'true');
    });
  });

  describe('Generic Data Types', () => {
    interface CustomData {
      value: number;
      label: string;
    }

    it('should work with custom data types', () => {
      const customData: CustomData = { value: 42, label: 'Answer' };

      render(
        <ProgressiveContent
          data={customData}
          glanceRenderer={(data) => <div>{data.label}</div>}
          scanRenderer={(data) => <div>{data.value}</div>}
          studyRenderer={(data) => <div>{data.value} - {data.label}</div>}
        />
      );

      expect(screen.getByText('Answer')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid mouse enter/leave', async () => {
      const { container } = render(
        <ProgressiveContent
          data={mockData}
          glanceRenderer={mockGlanceRenderer}
          scanRenderer={mockScanRenderer}
          studyRenderer={mockStudyRenderer}
          transitionDuration={300}
        />
      );

      const element = container.querySelector('.progressive-content');

      await act(async () => {
        // Rapid interactions
        fireEvent.mouseEnter(element!);
        fireEvent.mouseLeave(element!);
        fireEvent.mouseEnter(element!);
        vi.advanceTimersByTime(450);
        await Promise.resolve();
      });

      // Should end up at scan level
      expect(screen.getByTestId('scan-view')).toBeInTheDocument();
    });

    it('should handle click during transition', () => {
      const { container } = render(
        <ProgressiveContent
          data={mockData}
          glanceRenderer={mockGlanceRenderer}
          scanRenderer={mockScanRenderer}
          studyRenderer={mockStudyRenderer}
        />
      );

      const element = container.querySelector('.progressive-content');

      fireEvent.mouseEnter(element!);

      // Click during transition to scan
      fireEvent.click(element!);

      // Should still be transitioning to scan, not study
      expect(screen.queryByTestId('study-view')).not.toBeInTheDocument();
    });
  });

  describe('Transition Duration', () => {
    it('should complete transition after animation duration', async () => {
      const { container } = render(
        <ProgressiveContent
          data={mockData}
          glanceRenderer={mockGlanceRenderer}
          scanRenderer={mockScanRenderer}
          studyRenderer={mockStudyRenderer}
          transitionDuration={300}
        />
      );

      const element = container.querySelector('.progressive-content');

      // Start the transition
      await act(async () => {
        fireEvent.mouseEnter(element!);
        await Promise.resolve();
      });

      // Not yet transitioned after 200ms (less than 300ms + 150ms delay)
      await act(async () => {
        vi.advanceTimersByTime(200);
        await Promise.resolve();
      });

      // Still transitioning
      expect(element).toHaveClass('progressive-transitioning');

      // Complete transition (total: 300ms + 150ms delay = 450ms, already advanced 200ms, need 250ms more)
      await act(async () => {
        vi.advanceTimersByTime(250);
        await Promise.resolve();
      });

      expect(screen.getByTestId('scan-view')).toBeInTheDocument();
      expect(element).not.toHaveClass('progressive-transitioning');
    });
  });
});
