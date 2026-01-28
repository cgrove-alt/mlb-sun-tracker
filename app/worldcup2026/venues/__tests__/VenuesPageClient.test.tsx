/**
 * Integration Tests for VenuesPageClient with Country Features
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { VenuesPageClient } from '../VenuesPageClient';

// Mock the translation context
jest.mock('../../../../src/i18n/i18nContext', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

describe('VenuesPageClient - Country Features', () => {
  describe('Country Filter', () => {
    it('renders country filter dropdown', () => {
      render(<VenuesPageClient />);

      expect(screen.getByLabelText(/Filter by Country/i)).toBeInTheDocument();
    });

    it('displays all country options with venue counts', () => {
      render(<VenuesPageClient />);

      const select = screen.getByLabelText(/Filter by Country/i) as HTMLSelectElement;

      expect(select).toContainHTML('All Countries (16)');
      expect(select).toContainHTML('USA (11)');
      expect(select).toContainHTML('Mexico (3)');
      expect(select).toContainHTML('Canada (2)');
    });

    it('includes flag emojis in country options', () => {
      render(<VenuesPageClient />);

      const select = screen.getByLabelText(/Filter by Country/i) as HTMLSelectElement;

      expect(select.textContent).toContain('🇺🇸');
      expect(select.textContent).toContain('🇲🇽');
      expect(select.textContent).toContain('🇨🇦');
    });

    it('filters venues when USA is selected', () => {
      render(<VenuesPageClient />);

      const select = screen.getByLabelText(/Filter by Country/i) as HTMLSelectElement;
      fireEvent.change(select, { target: { value: 'USA' } });

      expect(screen.getByText(/Showing/)).toHaveTextContent('11');
    });

    it('filters venues when Mexico is selected', () => {
      render(<VenuesPageClient />);

      const select = screen.getByLabelText(/Filter by Country/i) as HTMLSelectElement;
      fireEvent.change(select, { target: { value: 'Mexico' } });

      expect(screen.getByText(/Showing/)).toHaveTextContent('3');
    });

    it('filters venues when Canada is selected', () => {
      render(<VenuesPageClient />);

      const select = screen.getByLabelText(/Filter by Country/i) as HTMLSelectElement;
      fireEvent.change(select, { target: { value: 'Canada' } });

      expect(screen.getByText(/Showing/)).toHaveTextContent('2');
    });

    it('shows active filter badge when country is selected', () => {
      render(<VenuesPageClient />);

      const select = screen.getByLabelText(/Filter by Country/i) as HTMLSelectElement;
      fireEvent.change(select, { target: { value: 'USA' } });

      expect(screen.getByText(/Active filters:/i)).toBeInTheDocument();
      expect(screen.getByText('USA')).toBeInTheDocument();
    });

    it('clears country filter when badge is clicked', () => {
      render(<VenuesPageClient />);

      const select = screen.getByLabelText(/Filter by Country/i) as HTMLSelectElement;
      fireEvent.change(select, { target: { value: 'USA' } });

      const filterBadge = screen.getByText('USA').closest('button');
      fireEvent.click(filterBadge!);

      expect(screen.getByText(/Showing/)).toHaveTextContent('16');
    });
  });

  describe('Climate Messaging Integration', () => {
    it('shows climate messaging when USA filter is active', () => {
      render(<VenuesPageClient />);

      const select = screen.getByLabelText(/Filter by Country/i) as HTMLSelectElement;
      fireEvent.change(select, { target: { value: 'USA' } });

      expect(screen.getByText(/Summer heat - shade critical for comfort/i)).toBeInTheDocument();
    });

    it('shows climate messaging when Mexico filter is active', () => {
      render(<VenuesPageClient />);

      const select = screen.getByLabelText(/Filter by Country/i) as HTMLSelectElement;
      fireEvent.change(select, { target: { value: 'Mexico' } });

      expect(screen.getByText(/High altitude - intense sun exposure/i)).toBeInTheDocument();
    });

    it('shows climate messaging when Canada filter is active', () => {
      render(<VenuesPageClient />);

      const select = screen.getByLabelText(/Filter by Country/i) as HTMLSelectElement;
      fireEvent.change(select, { target: { value: 'Canada' } });

      expect(screen.getByText(/Mild climate - less sun concern, but still check/i)).toBeInTheDocument();
    });

    it('does not show climate messaging when all countries are shown', () => {
      render(<VenuesPageClient />);

      expect(screen.queryByText(/Summer heat - shade critical for comfort/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/High altitude - intense sun exposure/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Mild climate - less sun concern, but still check/i)).not.toBeInTheDocument();
    });

    it('shows compact climate messages in grouped view (all countries)', () => {
      render(<VenuesPageClient />);

      // In grouped view, we show compact climate messages for each country
      const climateMessages = screen.getAllByText(/shade|sun|climate/i);
      expect(climateMessages.length).toBeGreaterThan(0);
    });
  });

  describe('Country Grouping', () => {
    it('groups venues by country when no filter is active', () => {
      render(<VenuesPageClient />);

      expect(screen.getByText('USA')).toBeInTheDocument();
      expect(screen.getByText('Mexico')).toBeInTheDocument();
      expect(screen.getByText('Canada')).toBeInTheDocument();
    });

    it('displays country flags in grouped headers', () => {
      const { container } = render(<VenuesPageClient />);

      // Check for flag emojis in the page
      expect(container.textContent).toContain('🇺🇸');
      expect(container.textContent).toContain('🇲🇽');
      expect(container.textContent).toContain('🇨🇦');
    });

    it('shows venue count per country in grouped view', () => {
      render(<VenuesPageClient />);

      // USA: 11 venues
      expect(screen.getByText(/11 venues/i)).toBeInTheDocument();
      // Mexico: 3 venues
      expect(screen.getByText(/3 venues/i)).toBeInTheDocument();
      // Canada: 2 venues
      expect(screen.getByText(/2 venues/i)).toBeInTheDocument();
    });

    it('does not group venues when search is active', () => {
      render(<VenuesPageClient />);

      const searchInput = screen.getByPlaceholderText(/Search by stadium name or city/i);
      fireEvent.change(searchInput, { target: { value: 'MetLife' } });

      // Should not see country group headers when searching
      // The text "USA" may still exist in other places, so we check for the specific grouped heading structure
      const usaHeading = screen.queryByRole('heading', { name: 'USA' });
      expect(usaHeading).not.toBeInTheDocument();
    });
  });

  describe('Search and Filter Combination', () => {
    it('applies both search and country filter', () => {
      render(<VenuesPageClient />);

      const select = screen.getByLabelText(/Filter by Country/i) as HTMLSelectElement;
      fireEvent.change(select, { target: { value: 'USA' } });

      const searchInput = screen.getByPlaceholderText(/Search by stadium name or city/i);
      fireEvent.change(searchInput, { target: { value: 'MetLife' } });

      // Should show 1 venue (MetLife Stadium in USA)
      expect(screen.getByText(/Showing/)).toHaveTextContent('1');
    });

    it('shows both active filters', () => {
      render(<VenuesPageClient />);

      const select = screen.getByLabelText(/Filter by Country/i) as HTMLSelectElement;
      fireEvent.change(select, { target: { value: 'USA' } });

      const searchInput = screen.getByPlaceholderText(/Search by stadium name or city/i);
      fireEvent.change(searchInput, { target: { value: 'stadium' } });

      expect(screen.getByText(/Active filters:/i)).toBeInTheDocument();
      expect(screen.getByText('USA')).toBeInTheDocument();
      expect(screen.getByText(/Search: "stadium"/i)).toBeInTheDocument();
    });

    it('clears all filters when Clear All is clicked', () => {
      render(<VenuesPageClient />);

      const select = screen.getByLabelText(/Filter by Country/i) as HTMLSelectElement;
      fireEvent.change(select, { target: { value: 'USA' } });

      const searchInput = screen.getByPlaceholderText(/Search by stadium name or city/i);
      fireEvent.change(searchInput, { target: { value: 'test' } });

      const clearAllButton = screen.getByText(/Clear all/i);
      fireEvent.click(clearAllButton);

      expect(screen.getByText(/Showing/)).toHaveTextContent('16');
      expect(screen.queryByText(/Active filters:/i)).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper labels for all form controls', () => {
      render(<VenuesPageClient />);

      expect(screen.getByLabelText(/Search Venues/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Filter by Country/i)).toBeInTheDocument();
    });

    it('displays results count for screen readers', () => {
      render(<VenuesPageClient />);

      const resultsText = screen.getByText(/Showing/);
      expect(resultsText).toBeInTheDocument();
      expect(resultsText.textContent).toMatch(/\d+ venue/);
    });
  });

  describe('No Results State', () => {
    it('shows no results message when search yields no matches', () => {
      render(<VenuesPageClient />);

      const searchInput = screen.getByPlaceholderText(/Search by stadium name or city/i);
      fireEvent.change(searchInput, { target: { value: 'nonexistent stadium xyz123' } });

      expect(screen.getByText(/No venues found matching your filters/i)).toBeInTheDocument();
    });

    it('shows clear filters button in no results state', () => {
      render(<VenuesPageClient />);

      const searchInput = screen.getByPlaceholderText(/Search by stadium name or city/i);
      fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

      const clearButton = screen.getByText(/Clear all filters/i);
      expect(clearButton).toBeInTheDocument();
    });
  });
});
