import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { WorldCupScheduleClient } from '../WorldCupScheduleClient';
import { WORLD_CUP_2026_MATCHES } from '../../../../src/data/worldcup2026/matches';
import { ALL_WORLD_CUP_VENUES } from '../../../../src/data/worldcup2026/venues';

// Mock the translation context
jest.mock('../../../../src/i18n/i18nContext', () => ({
  useTranslation: () => ({
    t: (key: string, params?: Record<string, unknown>) => {
      const translations: Record<string, string> = {
        'worldcup.schedule.title': 'FIFA World Cup 2026 Schedule',
        'worldcup.schedule.matchCount': `${params?.count || 104} matches`,
        'worldcup.countdown.until': 'to',
        'worldcup.nextMatch': 'Next Match',
        'worldcup.filterByCountry': 'Filter Matches',
        'worldcup.schedule.round': 'Round',
        'worldcup.schedule.rounds.all': 'All Rounds',
        'worldcup.schedule.rounds.groupStage': 'Group Stage',
        'worldcup.schedule.rounds.roundOf16': 'Round of 16',
        'worldcup.schedule.rounds.quarterFinals': 'Quarterfinals',
        'worldcup.schedule.rounds.semiFinals': 'Semifinals',
        'worldcup.schedule.rounds.thirdPlace': 'Third Place',
        'worldcup.schedule.rounds.final': 'Final',
        'worldcup.hostCountries': 'Host Country',
        'worldcup.countries.all': 'All Countries',
        'worldcup.countries.usa': 'USA',
        'worldcup.countries.mexico': 'Mexico',
        'worldcup.countries.canada': 'Canada',
        'sections.search': 'Search',
        'worldcup.schedule.searchMatches': 'Search teams or venues...',
        'sections.summaryStats.searchResults': `Showing ${params?.shown || 0} of ${params?.total || 0} matches`,
        'worldcup.schedule.timezoneNote': 'All times shown in venue local timezone',
        'worldcup.schedule.kickoff': 'Kickoff',
        'worldcup.schedule.localTime': 'local time',
        'worldcup.subtitle': 'Find Shaded Seats',
        'worldcup.schedule.noMatches': 'No matches found',
        'worldcup.stats.totalMatches': 'total matches'
      };
      return translations[key] || key;
    }
  })
}));

// Mock MatchCountdown component
jest.mock('../../../../src/components/MatchCountdown', () => ({
  MatchCountdown: ({ matchDate, kickoffTime }: { matchDate: string; kickoffTime: string }) => (
    <div data-testid="match-countdown">
      Countdown: {matchDate} {kickoffTime}
    </div>
  )
}));

// Mock Next.js Link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

describe('WorldCupScheduleClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the schedule page with title', () => {
      render(<WorldCupScheduleClient />);
      expect(screen.getByText('FIFA World Cup 2026 Schedule')).toBeInTheDocument();
    });

    it('displays all 104 matches initially', () => {
      render(<WorldCupScheduleClient />);
      expect(screen.getByText(/Showing 104 of 104 matches/)).toBeInTheDocument();
    });

    it('renders timezone notice', () => {
      render(<WorldCupScheduleClient />);
      expect(screen.getByText('All times shown in venue local timezone')).toBeInTheDocument();
    });

    it('displays match cards', () => {
      render(<WorldCupScheduleClient />);
      // Check for first match (Opening match)
      expect(screen.getByText(/Mexico/)).toBeInTheDocument();
    });
  });

  describe('Round Filter', () => {
    it('filters by Group Stage', () => {
      render(<WorldCupScheduleClient />);
      const roundSelect = screen.getByLabelText('Round');
      fireEvent.change(roundSelect, { target: { value: 'Group Stage' } });

      // Group Stage has 72 matches
      expect(screen.getByText(/Showing 72 of 104 matches/)).toBeInTheDocument();
    });

    it('filters by Round of 32', () => {
      render(<WorldCupScheduleClient />);
      const roundSelect = screen.getByLabelText('Round');
      fireEvent.change(roundSelect, { target: { value: 'Round of 32' } });

      // Round of 32 has 16 matches
      expect(screen.getByText(/Showing 16 of 104 matches/)).toBeInTheDocument();
    });

    it('filters by Round of 16', () => {
      render(<WorldCupScheduleClient />);
      const roundSelect = screen.getByLabelText('Round');
      fireEvent.change(roundSelect, { target: { value: 'Round of 16' } });

      // Round of 16 has 8 matches
      expect(screen.getByText(/Showing 8 of 104 matches/)).toBeInTheDocument();
    });

    it('filters by Quarterfinal', () => {
      render(<WorldCupScheduleClient />);
      const roundSelect = screen.getByLabelText('Round');
      fireEvent.change(roundSelect, { target: { value: 'Quarterfinal' } });

      // Quarterfinals has 4 matches
      expect(screen.getByText(/Showing 4 of 104 matches/)).toBeInTheDocument();
    });

    it('filters by Semifinal', () => {
      render(<WorldCupScheduleClient />);
      const roundSelect = screen.getByLabelText('Round');
      fireEvent.change(roundSelect, { target: { value: 'Semifinal' } });

      // Semifinals has 2 matches
      expect(screen.getByText(/Showing 2 of 104 matches/)).toBeInTheDocument();
    });

    it('filters by Final', () => {
      render(<WorldCupScheduleClient />);
      const roundSelect = screen.getByLabelText('Round');
      fireEvent.change(roundSelect, { target: { value: 'Final' } });

      // Final has 1 match
      expect(screen.getByText(/Showing 1 of 104 matches/)).toBeInTheDocument();
    });
  });

  describe('Country Filter', () => {
    it('filters by USA', () => {
      render(<WorldCupScheduleClient />);
      const countrySelect = screen.getByLabelText('Host Country');
      fireEvent.change(countrySelect, { target: { value: 'USA' } });

      // USA venues host the majority of matches
      const text = screen.getByText(/Showing \d+ of 104 matches/);
      expect(text).toBeInTheDocument();
      // USA should have more than 50 matches
      const match = text.textContent?.match(/Showing (\d+) of 104 matches/);
      if (match) {
        const count = parseInt(match[1]);
        expect(count).toBeGreaterThan(50);
      }
    });

    it('filters by Mexico', () => {
      render(<WorldCupScheduleClient />);
      const countrySelect = screen.getByLabelText('Host Country');
      fireEvent.change(countrySelect, { target: { value: 'Mexico' } });

      const text = screen.getByText(/Showing \d+ of 104 matches/);
      expect(text).toBeInTheDocument();
    });

    it('filters by Canada', () => {
      render(<WorldCupScheduleClient />);
      const countrySelect = screen.getByLabelText('Host Country');
      fireEvent.change(countrySelect, { target: { value: 'Canada' } });

      const text = screen.getByText(/Showing \d+ of 104 matches/);
      expect(text).toBeInTheDocument();
    });
  });

  describe('Venue Filter', () => {
    it('displays venue dropdown with all 16 venues', () => {
      render(<WorldCupScheduleClient />);
      const venueSelect = screen.getByLabelText('Venue');
      const options = venueSelect.querySelectorAll('option');

      // Should have "All Venues" + 16 venues = 17 options
      expect(options.length).toBe(17);
      expect(options[0].textContent).toBe('All Venues');
    });

    it('filters by specific venue', () => {
      render(<WorldCupScheduleClient />);
      const venueSelect = screen.getByLabelText('Venue') as HTMLSelectElement;

      // Select the second option (first actual venue)
      fireEvent.change(venueSelect, { target: { value: venueSelect.options[1].value } });

      // Should show some matches for that venue
      const text = screen.getByText(/Showing \d+ of 104 matches/);
      expect(text).toBeInTheDocument();
    });
  });

  describe('Date Range Filter', () => {
    it('filters by start date', () => {
      render(<WorldCupScheduleClient />);
      const startDateInput = screen.getByLabelText('Start Date');
      fireEvent.change(startDateInput, { target: { value: '2026-07-01' } });

      // Should show fewer matches (only July matches)
      const text = screen.getByText(/Showing \d+ of 104 matches/);
      expect(text).toBeInTheDocument();
      const match = text.textContent?.match(/Showing (\d+) of 104 matches/);
      if (match) {
        const count = parseInt(match[1]);
        expect(count).toBeLessThan(104);
      }
    });

    it('filters by end date', () => {
      render(<WorldCupScheduleClient />);
      const endDateInput = screen.getByLabelText('End Date');
      fireEvent.change(endDateInput, { target: { value: '2026-06-20' } });

      // Should show fewer matches (only early June matches)
      const text = screen.getByText(/Showing \d+ of 104 matches/);
      expect(text).toBeInTheDocument();
      const match = text.textContent?.match(/Showing (\d+) of 104 matches/);
      if (match) {
        const count = parseInt(match[1]);
        expect(count).toBeLessThan(104);
      }
    });

    it('filters by date range', () => {
      render(<WorldCupScheduleClient />);
      const startDateInput = screen.getByLabelText('Start Date');
      const endDateInput = screen.getByLabelText('End Date');

      fireEvent.change(startDateInput, { target: { value: '2026-06-15' } });
      fireEvent.change(endDateInput, { target: { value: '2026-06-20' } });

      const text = screen.getByText(/Showing \d+ of 104 matches/);
      expect(text).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('searches by team name', () => {
      render(<WorldCupScheduleClient />);
      const searchInput = screen.getByPlaceholderText('Search teams or venues...');
      fireEvent.change(searchInput, { target: { value: 'Mexico' } });

      // Should find matches with Mexico
      const text = screen.getByText(/Showing \d+ of 104 matches/);
      expect(text).toBeInTheDocument();
    });

    it('searches by venue name', () => {
      render(<WorldCupScheduleClient />);
      const searchInput = screen.getByPlaceholderText('Search teams or venues...');
      fireEvent.change(searchInput, { target: { value: 'Stadium' } });

      // Should find matches with "Stadium" in venue name
      const text = screen.getByText(/Showing \d+ of 104 matches/);
      expect(text).toBeInTheDocument();
    });

    it('shows no results for non-existent search', () => {
      render(<WorldCupScheduleClient />);
      const searchInput = screen.getByPlaceholderText('Search teams or venues...');
      fireEvent.change(searchInput, { target: { value: 'XYZ123NonExistent' } });

      expect(screen.getByText('No matches found')).toBeInTheDocument();
    });
  });

  describe('Sorting', () => {
    it('sorts by date ascending (default)', () => {
      render(<WorldCupScheduleClient />);
      const sortButton = screen.getByText(/Date/);
      expect(sortButton).toHaveClass('bg-purple-600');
      expect(sortButton.textContent).toContain('↑');
    });

    it('sorts by date descending', () => {
      render(<WorldCupScheduleClient />);
      const sortButton = screen.getByText(/Date/);
      fireEvent.click(sortButton);

      expect(sortButton.textContent).toContain('↓');
    });

    it('sorts by venue', () => {
      render(<WorldCupScheduleClient />);
      const sortButton = screen.getByText(/Venue/);
      fireEvent.click(sortButton);

      expect(sortButton).toHaveClass('bg-purple-600');
      expect(sortButton.textContent).toContain('↑');
    });

    it('sorts by round', () => {
      render(<WorldCupScheduleClient />);
      const sortButton = screen.getByText(/Round/);
      fireEvent.click(sortButton);

      expect(sortButton).toHaveClass('bg-purple-600');
      expect(sortButton.textContent).toContain('↑');
    });
  });

  describe('Clear Filters', () => {
    it('shows clear button when filters are active', () => {
      render(<WorldCupScheduleClient />);
      const roundSelect = screen.getByLabelText('Round');
      fireEvent.change(roundSelect, { target: { value: 'Final' } });

      expect(screen.getByText('Clear All Filters')).toBeInTheDocument();
    });

    it('clears all filters when clicked', () => {
      render(<WorldCupScheduleClient />);

      // Apply multiple filters
      const roundSelect = screen.getByLabelText('Round');
      const searchInput = screen.getByPlaceholderText('Search teams or venues...');

      fireEvent.change(roundSelect, { target: { value: 'Final' } });
      fireEvent.change(searchInput, { target: { value: 'test' } });

      // Clear filters
      const clearButton = screen.getByText('Clear All Filters');
      fireEvent.click(clearButton);

      // Should show all matches again
      expect(screen.getByText(/Showing 104 of 104 matches/)).toBeInTheDocument();
    });
  });

  describe('Match Cards', () => {
    it('displays match information', () => {
      render(<WorldCupScheduleClient />);

      // Check for match details
      expect(screen.getByText(/vs/)).toBeInTheDocument();
    });

    it('displays countdown for each match', () => {
      render(<WorldCupScheduleClient />);

      // Should have multiple countdown components
      const countdowns = screen.getAllByTestId('match-countdown');
      expect(countdowns.length).toBeGreaterThan(0);
    });

    it('displays Find Shaded Seats button', () => {
      render(<WorldCupScheduleClient />);

      const buttons = screen.getAllByText('Find Shaded Seats');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('displays Venue Info button', () => {
      render(<WorldCupScheduleClient />);

      const buttons = screen.getAllByText('Venue Info');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('links have correct href with date and time params', () => {
      render(<WorldCupScheduleClient />);

      const shadeButtons = screen.getAllByText('Find Shaded Seats');
      const firstButton = shadeButtons[0].closest('a');

      expect(firstButton?.href).toContain('?date=');
      expect(firstButton?.href).toContain('&time=');
    });
  });

  describe('Combined Filters', () => {
    it('applies multiple filters together', () => {
      render(<WorldCupScheduleClient />);

      const roundSelect = screen.getByLabelText('Round');
      const countrySelect = screen.getByLabelText('Host Country');

      fireEvent.change(roundSelect, { target: { value: 'Group Stage' } });
      fireEvent.change(countrySelect, { target: { value: 'USA' } });

      // Should show filtered results
      const text = screen.getByText(/Showing \d+ of 104 matches/);
      expect(text).toBeInTheDocument();
      const match = text.textContent?.match(/Showing (\d+) of 104 matches/);
      if (match) {
        const count = parseInt(match[1]);
        expect(count).toBeLessThan(72); // Less than total group stage
        expect(count).toBeGreaterThan(0);
      }
    });
  });

  describe('Responsive Design', () => {
    it('renders match cards with responsive classes', () => {
      const { container } = render(<WorldCupScheduleClient />);

      const matchCards = container.querySelectorAll('.rounded-xl');
      expect(matchCards.length).toBeGreaterThan(0);

      // Check for responsive flex classes
      const flexContainers = container.querySelectorAll('.lg\\:flex-row');
      expect(flexContainers.length).toBeGreaterThan(0);
    });
  });

  describe('Accessibility', () => {
    it('has proper labels for all inputs', () => {
      render(<WorldCupScheduleClient />);

      expect(screen.getByLabelText('Round')).toBeInTheDocument();
      expect(screen.getByLabelText('Host Country')).toBeInTheDocument();
      expect(screen.getByLabelText('Venue')).toBeInTheDocument();
      expect(screen.getByLabelText('Start Date')).toBeInTheDocument();
      expect(screen.getByLabelText('End Date')).toBeInTheDocument();
      expect(screen.getByLabelText('Search')).toBeInTheDocument();
    });

    it('buttons have minimum touch target size', () => {
      const { container } = render(<WorldCupScheduleClient />);

      // Check for min-h-[44px] class on buttons
      const buttons = container.querySelectorAll('.min-h-\\[44px\\]');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });
});
