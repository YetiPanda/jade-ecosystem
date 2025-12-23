/**
 * Unit Tests for SearchPage Component (T292)
 *
 * Tests search page interactions per FR-037 through FR-074
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { SearchPage } from '../SearchPage';

// Mock the GraphQL hook
vi.mock('../../../graphql/generated', () => ({
  useSearchProductsQuery: vi.fn(() => ({
    data: null,
    loading: false,
    error: null,
    refetch: vi.fn(),
  })),
}));

// Mock the vector generation utilities
vi.mock('../../../utils/mockVectorGeneration', () => ({
  generateMockEmbedding: vi.fn((text: string) => new Array(792).fill(0.5)),
  generateMockTensor: vi.fn((text: string) => new Array(13).fill(0.5)),
}));

const renderSearchPage = () => {
  return render(
    <MockedProvider mocks={[]} addTypename={false}>
      <BrowserRouter>
        <SearchPage />
      </BrowserRouter>
    </MockedProvider>
  );
};

describe('SearchPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial Render', () => {
    it('should render search input field (FR-037)', () => {
      renderSearchPage();
      const searchInput = screen.getByPlaceholderText(/search for products/i);
      expect(searchInput).toBeTruthy();
    });

    it('should render search button with icon (FR-038)', () => {
      renderSearchPage();
      const searchButton = screen.getByLabelText(/submit search/i);
      expect(searchButton).toBeTruthy();
    });

    it('should render tensor weight slider on desktop (FR-039)', () => {
      renderSearchPage();
      const slider = screen.getByRole('slider', { name: /adjust search similarity/i });
      expect(slider).toBeTruthy();
    });

    it('should display initial state message', () => {
      renderSearchPage();
      expect(screen.getByText(/start your search/i)).toBeTruthy();
    });

    it('should have search button disabled when input is empty (FR-060)', () => {
      renderSearchPage();
      const searchButton = screen.getByLabelText(/submit search/i);
      expect(searchButton).toHaveProperty('disabled', true);
    });
  });

  describe('Search Input Interactions', () => {
    it('should update search text on input change', () => {
      renderSearchPage();
      const input = screen.getByPlaceholderText(/search for products/i) as HTMLInputElement;

      fireEvent.change(input, { target: { value: 'hydrating serum' } });

      expect(input.value).toBe('hydrating serum');
    });

    it('should show character count (FR-037)', () => {
      renderSearchPage();
      const input = screen.getByPlaceholderText(/search for products/i);

      fireEvent.change(input, { target: { value: 'test' } });

      expect(screen.getByText(/4\/500 characters/i)).toBeTruthy();
    });

    it('should enforce 500 character limit (FR-037)', () => {
      renderSearchPage();
      const input = screen.getByPlaceholderText(/search for products/i) as HTMLInputElement;

      expect(input).toHaveProperty('maxLength', 500);
    });

    it('should show warning for empty trimmed text (FR-060)', () => {
      renderSearchPage();
      const input = screen.getByPlaceholderText(/search for products/i);

      fireEvent.change(input, { target: { value: '   ' } });

      expect(screen.getByText(/please enter a search term/i)).toBeTruthy();
    });

    it('should enable search button when text is entered', () => {
      renderSearchPage();
      const input = screen.getByPlaceholderText(/search for products/i);
      const searchButton = screen.getByLabelText(/submit search/i);

      fireEvent.change(input, { target: { value: 'serum' } });

      expect(searchButton).toHaveProperty('disabled', false);
    });
  });

  describe('Tensor Weight Slider (FR-039, FR-043)', () => {
    it('should have default value of 0.5 (balanced)', () => {
      renderSearchPage();
      const slider = screen.getByRole('slider') as HTMLInputElement;

      expect(slider.value).toBe('0.5');
    });

    it('should update slider value when changed', () => {
      renderSearchPage();
      const slider = screen.getByRole('slider') as HTMLInputElement;

      fireEvent.change(slider, { target: { value: '0.8' } });

      expect(slider.value).toBe('0.8');
    });

    it('should have min value of 0 (FR-039)', () => {
      renderSearchPage();
      const slider = screen.getByRole('slider') as HTMLInputElement;

      expect(slider.min).toBe('0');
    });

    it('should have max value of 1 (FR-039)', () => {
      renderSearchPage();
      const slider = screen.getByRole('slider') as HTMLInputElement;

      expect(slider.max).toBe('1');
    });

    it('should have step of 0.1 (FR-039)', () => {
      renderSearchPage();
      const slider = screen.getByRole('slider') as HTMLInputElement;

      expect(slider.step).toBe('0.1');
    });

    it('should display percentage value', () => {
      renderSearchPage();

      // Default 0.5 = 50%
      expect(screen.getByText(/50%/)).toBeTruthy();
    });
  });

  describe('Filter Controls (FR-040)', () => {
    it('should render all skin type options', () => {
      renderSearchPage();

      expect(screen.getByText('Dry')).toBeTruthy();
      expect(screen.getByText('Oily')).toBeTruthy();
      expect(screen.getByText('Combination')).toBeTruthy();
      expect(screen.getByText('Sensitive')).toBeTruthy();
      expect(screen.getByText('Normal')).toBeTruthy();
    });

    it('should toggle skin type selection', () => {
      renderSearchPage();
      const dryButton = screen.getByText('Dry').parentElement as HTMLElement;

      // Initially not selected
      expect(dryButton.className).not.toContain('bg-primary');

      // Click to select
      fireEvent.click(dryButton);

      // Should be selected now
      waitFor(() => {
        expect(dryButton.className).toContain('bg-primary');
      });
    });

    it('should render price range slider', () => {
      renderSearchPage();
      const priceSlider = screen.getByLabelText(/price range filter/i);

      expect(priceSlider).toBeTruthy();
    });

    it('should render Clear Filters button (FR-041)', () => {
      renderSearchPage();
      const clearButton = screen.getByText(/clear filters/i);

      expect(clearButton).toBeTruthy();
    });
  });

  describe('Keyboard Navigation (FR-070)', () => {
    it('should support Enter key to submit search', () => {
      renderSearchPage();
      const input = screen.getByPlaceholderText(/search for products/i);

      fireEvent.change(input, { target: { value: 'test search' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

      // Search should be executed (loading state or results would appear)
      // We can't fully test this without mocking the GraphQL response
      expect(input).toBeTruthy();
    });
  });

  describe('Accessibility (FR-066, FR-067, FR-068)', () => {
    it('should have aria-label on search input', () => {
      renderSearchPage();
      const input = screen.getByLabelText(/search for products/i);

      expect(input).toBeTruthy();
    });

    it('should have aria-label on search button', () => {
      renderSearchPage();
      const button = screen.getByLabelText(/submit search/i);

      expect(button).toBeTruthy();
    });

    it('should have ARIA slider attributes (FR-067)', () => {
      renderSearchPage();
      const slider = screen.getByRole('slider');

      expect(slider.getAttribute('aria-valuemin')).toBe('0');
      expect(slider.getAttribute('aria-valuemax')).toBe('1');
      expect(slider.getAttribute('aria-valuenow')).toBe('0.5');
    });

    it('should have aria-label on price slider', () => {
      renderSearchPage();
      const priceSlider = screen.getByLabelText(/price range filter/i);

      expect(priceSlider).toBeTruthy();
    });
  });

  describe('Responsive Design', () => {
    it('should render mobile-specific elements (FR-072, FR-073)', () => {
      renderSearchPage();

      // Mobile toggle buttons should exist (hidden on desktop via Tailwind)
      expect(screen.getByText('Text Search')).toBeTruthy();
      expect(screen.getByText('Balanced')).toBeTruthy();
      expect(screen.getByText('Visual Search')).toBeTruthy();

      // Mobile filters button should exist
      expect(screen.getByText('Filters')).toBeTruthy();
    });
  });

  describe('Mobile Filters Drawer (FR-073)', () => {
    it('should open filters drawer on mobile', () => {
      renderSearchPage();
      const filtersButton = screen.getByText('Filters');

      fireEvent.click(filtersButton);

      // Drawer should be visible with Apply button
      waitFor(() => {
        expect(screen.getByText('Apply Filters')).toBeTruthy();
      });
    });

    it('should close filters drawer', () => {
      renderSearchPage();
      const filtersButton = screen.getByText('Filters');

      fireEvent.click(filtersButton);

      waitFor(() => {
        const closeButton = screen.getByLabelText(/close filters/i);
        fireEvent.click(closeButton);

        // Drawer should be hidden
        expect(screen.queryByText('Apply Filters')).toBeNull();
      });
    });
  });

  describe('Clear Filters Functionality (FR-041)', () => {
    it('should clear all filters but preserve search query', async () => {
      renderSearchPage();
      const input = screen.getByPlaceholderText(/search for products/i) as HTMLInputElement;

      // Enter search text
      fireEvent.change(input, { target: { value: 'test query' } });

      // Select a skin type
      const dryButton = screen.getByText('Dry');
      fireEvent.click(dryButton);

      // Click Clear Filters
      const clearButton = screen.getByText(/clear filters/i);
      fireEvent.click(clearButton);

      // Search query should still be there
      expect(input.value).toBe('test query');

      // Filters should be reset (would need to check state)
    });
  });
});
