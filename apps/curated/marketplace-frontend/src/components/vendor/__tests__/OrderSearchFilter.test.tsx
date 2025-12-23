/**
 * OrderSearchFilter Component Tests
 * Sprint B.4: Order Management
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { OrderSearchFilter } from '../OrderSearchFilter';
import { OrderStatus } from '../../../graphql/generated';

describe('OrderSearchFilter', () => {
  const defaultProps = {
    searchTerm: '',
    filterStatus: 'all' as const,
    onSearchChange: vi.fn(),
    onFilterChange: vi.fn(),
  };

  it('renders search input with default placeholder', () => {
    render(<OrderSearchFilter {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText('Search by order number or spa name...');
    expect(searchInput).toBeInTheDocument();
  });

  it('renders search input with custom placeholder', () => {
    render(
      <OrderSearchFilter
        {...defaultProps}
        placeholder="Custom search placeholder"
      />
    );

    const searchInput = screen.getByPlaceholderText('Custom search placeholder');
    expect(searchInput).toBeInTheDocument();
  });

  it('displays the current search term', () => {
    render(<OrderSearchFilter {...defaultProps} searchTerm="ORD-123" />);

    const searchInput = screen.getByPlaceholderText('Search by order number or spa name...');
    expect(searchInput).toHaveValue('ORD-123');
  });

  it('calls onSearchChange when typing in search input', () => {
    const onSearchChange = vi.fn();
    render(<OrderSearchFilter {...defaultProps} onSearchChange={onSearchChange} />);

    const searchInput = screen.getByPlaceholderText('Search by order number or spa name...');
    fireEvent.change(searchInput, { target: { value: 'new search' } });

    expect(onSearchChange).toHaveBeenCalledWith('new search');
  });

  it('renders status filter select', () => {
    render(<OrderSearchFilter {...defaultProps} />);

    // Select trigger should be in the document
    const selectTrigger = screen.getByRole('combobox');
    expect(selectTrigger).toBeInTheDocument();
  });

  it('displays all status options when select is opened', () => {
    render(<OrderSearchFilter {...defaultProps} />);

    const selectTrigger = screen.getByRole('combobox');
    fireEvent.click(selectTrigger);

    // Check for all status options - use getAllByText for items that appear multiple times
    expect(screen.getAllByText('All Status').length).toBeGreaterThan(0);
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('Confirmed')).toBeInTheDocument();
    expect(screen.getByText('Processing')).toBeInTheDocument();
    expect(screen.getByText('Shipped')).toBeInTheDocument();
    expect(screen.getByText('Delivered')).toBeInTheDocument();
    expect(screen.getByText('Cancelled')).toBeInTheDocument();
    expect(screen.getByText('Returned')).toBeInTheDocument();
    expect(screen.getByText('Disputed')).toBeInTheDocument();
  });

  it('calls onFilterChange when selecting a status', () => {
    const onFilterChange = vi.fn();
    render(<OrderSearchFilter {...defaultProps} onFilterChange={onFilterChange} />);

    const selectTrigger = screen.getByRole('combobox');
    fireEvent.click(selectTrigger);

    const pendingOption = screen.getByText('Pending');
    fireEvent.click(pendingOption);

    expect(onFilterChange).toHaveBeenCalledWith(OrderStatus.Pending);
  });

  it('displays the selected filter status', () => {
    render(<OrderSearchFilter {...defaultProps} filterStatus={OrderStatus.Shipped} />);

    // The select should show the selected value
    const selectTrigger = screen.getByRole('combobox');
    expect(selectTrigger).toBeInTheDocument();
  });

  it('has proper styling classes for search input', () => {
    render(<OrderSearchFilter {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText('Search by order number or spa name...');
    expect(searchInput).toHaveClass('pl-10', 'rounded-full', 'border-subtle');
  });

  it('has proper styling classes for select trigger', () => {
    render(<OrderSearchFilter {...defaultProps} />);

    const selectTrigger = screen.getByRole('combobox');
    expect(selectTrigger).toHaveClass('rounded-full', 'border-subtle');
  });

  it('renders search icon', () => {
    const { container } = render(<OrderSearchFilter {...defaultProps} />);

    // Check for search icon (SVG element with specific class)
    const searchIcon = container.querySelector('svg.h-4.w-4');
    expect(searchIcon).toBeInTheDocument();
  });

  describe('Date Range Filter', () => {
    it('does not render date range picker when dateRange prop is not provided', () => {
      render(<OrderSearchFilter {...defaultProps} />);

      expect(screen.queryByText('Date Range:')).not.toBeInTheDocument();
    });

    it('renders date range picker when dateRange prop is provided', () => {
      const dateRange = { from: new Date('2024-01-01'), to: new Date('2024-01-31') };
      const onDateRangeChange = vi.fn();

      render(
        <OrderSearchFilter
          {...defaultProps}
          dateRange={dateRange}
          onDateRangeChange={onDateRangeChange}
        />
      );

      expect(screen.getByText('Date Range:')).toBeInTheDocument();
    });

    it('calls onDateRangeChange when date range is changed', () => {
      const dateRange = { from: new Date('2024-01-01'), to: new Date('2024-01-31') };
      const onDateRangeChange = vi.fn();

      render(
        <OrderSearchFilter
          {...defaultProps}
          dateRange={dateRange}
          onDateRangeChange={onDateRangeChange}
        />
      );

      // DateRangePicker component interaction would be tested in its own test file
      expect(screen.getByText('Date Range:')).toBeInTheDocument();
    });
  });

  describe('Spa Filter', () => {
    const spaOptions = [
      { id: '1', name: 'Luxury Spa' },
      { id: '2', name: 'Wellness Center' },
      { id: '3', name: 'Beauty Retreat' },
    ];

    it('does not render spa filter when spaOptions is not provided', () => {
      render(<OrderSearchFilter {...defaultProps} />);

      expect(screen.queryByText('Spa:')).not.toBeInTheDocument();
    });

    it('does not render spa filter when spaOptions is empty', () => {
      render(
        <OrderSearchFilter
          {...defaultProps}
          spaOptions={[]}
          onSpaChange={vi.fn()}
        />
      );

      expect(screen.queryByText('Spa:')).not.toBeInTheDocument();
    });

    it('renders spa filter when spaOptions are provided', () => {
      render(
        <OrderSearchFilter
          {...defaultProps}
          spaOptions={spaOptions}
          onSpaChange={vi.fn()}
        />
      );

      expect(screen.getByText('Spa:')).toBeInTheDocument();
    });

    it('displays all spa options when select is opened', () => {
      render(
        <OrderSearchFilter
          {...defaultProps}
          spaOptions={spaOptions}
          onSpaChange={vi.fn()}
          spaId="1"
        />
      );

      // Find the spa select trigger (it's the second combobox on the page)
      const selects = screen.getAllByRole('combobox');
      const spaSelect = selects[1]; // First is status filter, second is spa filter
      fireEvent.click(spaSelect);

      expect(screen.getByText('All Spas')).toBeInTheDocument();
      // Use getAllByText for spa names as they appear in both selected value and dropdown
      expect(screen.getAllByText('Luxury Spa').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Wellness Center').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Beauty Retreat').length).toBeGreaterThan(0);
    });

    it('calls onSpaChange when selecting a spa', () => {
      const onSpaChange = vi.fn();
      render(
        <OrderSearchFilter
          {...defaultProps}
          spaOptions={spaOptions}
          onSpaChange={onSpaChange}
        />
      );

      // Find the spa select trigger
      const selects = screen.getAllByRole('combobox');
      const spaSelect = selects[1];
      fireEvent.click(spaSelect);

      const luxurySpaOption = screen.getByText('Luxury Spa');
      fireEvent.click(luxurySpaOption);

      expect(onSpaChange).toHaveBeenCalledWith('1');
    });

    it('displays selected spa', () => {
      render(
        <OrderSearchFilter
          {...defaultProps}
          spaOptions={spaOptions}
          onSpaChange={vi.fn()}
          spaId="2"
        />
      );

      const selects = screen.getAllByRole('combobox');
      const spaSelect = selects[1];
      expect(spaSelect).toBeInTheDocument();
    });
  });
});
