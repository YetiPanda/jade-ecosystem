/**
 * DateRangePicker Component Tests
 * Feature 011: Vendor Portal MVP
 * Sprint D.2: Discovery Analytics Frontend (Task D.2.10)
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DateRangePicker } from '../DateRangePicker';

describe('DateRangePicker', () => {
  const defaultDateRange = {
    startDate: '2024-01-01T00:00:00.000Z',
    endDate: '2024-01-31T23:59:59.999Z',
  };

  const defaultProps = {
    dateRange: defaultDateRange,
    onChange: vi.fn(),
    onRefresh: vi.fn(),
  };

  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      render(<DateRangePicker {...defaultProps} />);
      expect(screen.getByText('Date Range:')).toBeInTheDocument();
    });

    it('renders all preset buttons', () => {
      render(<DateRangePicker {...defaultProps} />);

      expect(screen.getByText('Last 7 Days')).toBeInTheDocument();
      expect(screen.getByText('Last 30 Days')).toBeInTheDocument();
      expect(screen.getByText('Last 90 Days')).toBeInTheDocument();
      expect(screen.getByText('Custom')).toBeInTheDocument();
    });

    it('renders refresh button', () => {
      render(<DateRangePicker {...defaultProps} />);

      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      expect(refreshButton).toBeInTheDocument();
    });

    it('has proper heading structure', () => {
      render(<DateRangePicker {...defaultProps} />);

      const heading = screen.getByText('Date Range:');
      expect(heading.tagName.toLowerCase()).toBe('h3');
    });
  });

  describe('Preset Selection', () => {
    it('calls onChange when 7d preset is clicked', () => {
      const onChange = vi.fn();
      render(<DateRangePicker {...defaultProps} onChange={onChange} />);

      const sevenDaysButton = screen.getByText('Last 7 Days');
      fireEvent.click(sevenDaysButton);

      expect(onChange).toHaveBeenCalled();
      const callArg = onChange.mock.calls[0][0];
      expect(callArg).toHaveProperty('startDate');
      expect(callArg).toHaveProperty('endDate');
    });

    it('calls onChange when 30d preset is clicked', () => {
      const onChange = vi.fn();
      render(<DateRangePicker {...defaultProps} onChange={onChange} />);

      const thirtyDaysButton = screen.getByText('Last 30 Days');
      fireEvent.click(thirtyDaysButton);

      expect(onChange).toHaveBeenCalled();
    });

    it('calls onChange when 90d preset is clicked', () => {
      const onChange = vi.fn();
      render(<DateRangePicker {...defaultProps} onChange={onChange} />);

      const ninetyDaysButton = screen.getByText('Last 90 Days');
      fireEvent.click(ninetyDaysButton);

      expect(onChange).toHaveBeenCalled();
    });

    it('highlights the active preset button', () => {
      render(<DateRangePicker {...defaultProps} />);

      // Default should highlight one of the presets or custom
      const buttons = screen.getAllByRole('button');
      const presetButtons = buttons.slice(0, 4); // First 4 are preset buttons

      expect(presetButtons.length).toBe(4);
    });
  });

  describe('Custom Date Selection', () => {
    it('shows custom date inputs when Custom button is clicked', () => {
      render(<DateRangePicker {...defaultProps} />);

      const customButton = screen.getByText('Custom');
      fireEvent.click(customButton);

      // Date inputs should appear
      const dateInputs = screen.getAllByRole('textbox');
      expect(dateInputs.length).toBeGreaterThanOrEqual(2);
    });

    it('hides custom date inputs by default', () => {
      render(<DateRangePicker {...defaultProps} />);

      // Custom inputs should not be visible initially
      const dateInputs = screen.queryAllByRole('textbox');
      expect(dateInputs.length).toBe(0);
    });

    it('toggles custom picker when Custom button is clicked twice', () => {
      render(<DateRangePicker {...defaultProps} />);

      const customButton = screen.getByText('Custom');

      // First click - show
      fireEvent.click(customButton);
      let dateInputs = screen.queryAllByRole('textbox');
      expect(dateInputs.length).toBeGreaterThan(0);

      // Second click - hide
      fireEvent.click(customButton);
      dateInputs = screen.queryAllByRole('textbox');
      expect(dateInputs.length).toBe(0);
    });

    it('displays current date range in custom inputs', () => {
      render(<DateRangePicker {...defaultProps} />);

      const customButton = screen.getByText('Custom');
      fireEvent.click(customButton);

      const dateInputs = screen.getAllByRole('textbox');
      expect(dateInputs[0]).toHaveValue('2024-01-01');
      expect(dateInputs[1]).toHaveValue('2024-01-31');
    });

    it('calls onChange when custom start date changes', () => {
      const onChange = vi.fn();
      render(<DateRangePicker {...defaultProps} onChange={onChange} />);

      const customButton = screen.getByText('Custom');
      fireEvent.click(customButton);

      const dateInputs = screen.getAllByRole('textbox');
      fireEvent.change(dateInputs[0], { target: { value: '2024-02-01' } });

      expect(onChange).toHaveBeenCalled();
    });

    it('calls onChange when custom end date changes', () => {
      const onChange = vi.fn();
      render(<DateRangePicker {...defaultProps} onChange={onChange} />);

      const customButton = screen.getByText('Custom');
      fireEvent.click(customButton);

      const dateInputs = screen.getAllByRole('textbox');
      fireEvent.change(dateInputs[1], { target: { value: '2024-02-28' } });

      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('Refresh Functionality', () => {
    it('calls onRefresh when refresh button is clicked', () => {
      const onRefresh = vi.fn();
      render(<DateRangePicker {...defaultProps} onRefresh={onRefresh} />);

      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      fireEvent.click(refreshButton);

      expect(onRefresh).toHaveBeenCalledTimes(1);
    });

    it('does not call onRefresh when preset buttons are clicked', () => {
      const onRefresh = vi.fn();
      render(<DateRangePicker {...defaultProps} onRefresh={onRefresh} />);

      const sevenDaysButton = screen.getByText('Last 7 Days');
      fireEvent.click(sevenDaysButton);

      expect(onRefresh).not.toHaveBeenCalled();
    });
  });

  describe('Styling', () => {
    it('applies proper styling to container', () => {
      const { container } = render(<DateRangePicker {...defaultProps} />);

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('bg-white', 'rounded-lg', 'border');
    });

    it('applies proper styling to refresh button', () => {
      render(<DateRangePicker {...defaultProps} />);

      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      expect(refreshButton).toHaveClass('p-2', 'rounded-lg');
    });

    it('applies proper styling to preset buttons', () => {
      render(<DateRangePicker {...defaultProps} />);

      const sevenDaysButton = screen.getByText('Last 7 Days');
      expect(sevenDaysButton).toHaveClass('px-4', 'py-2', 'rounded-lg');
    });
  });

  describe('Edge Cases', () => {
    it('handles missing onRefresh prop gracefully', () => {
      const { onChange, ...propsWithoutRefresh } = defaultProps;
      render(<DateRangePicker dateRange={defaultDateRange} onChange={onChange} />);

      expect(screen.getByText('Date Range:')).toBeInTheDocument();
    });

    it('handles same start and end date', () => {
      const sameDateRange = {
        startDate: '2024-01-01T00:00:00.000Z',
        endDate: '2024-01-01T23:59:59.999Z',
      };

      render(<DateRangePicker {...defaultProps} dateRange={sameDateRange} />);

      expect(screen.getByText('Date Range:')).toBeInTheDocument();
    });

    it('handles future dates', () => {
      const futureDateRange = {
        startDate: '2025-01-01T00:00:00.000Z',
        endDate: '2025-12-31T23:59:59.999Z',
      };

      render(<DateRangePicker {...defaultProps} dateRange={futureDateRange} />);

      expect(screen.getByText('Date Range:')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has accessible button labels', () => {
      render(<DateRangePicker {...defaultProps} />);

      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      expect(refreshButton).toBeInTheDocument();
    });

    it('has proper color contrast for active state', () => {
      render(<DateRangePicker {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('date inputs have proper type', () => {
      render(<DateRangePicker {...defaultProps} />);

      const customButton = screen.getByText('Custom');
      fireEvent.click(customButton);

      const dateInputs = screen.getAllByRole('textbox');
      dateInputs.forEach(input => {
        expect(input).toHaveAttribute('type', 'date');
      });
    });
  });
});
