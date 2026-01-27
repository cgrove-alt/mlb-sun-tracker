import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ComparePageClient } from '../ComparePageClient';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(() => null),
  }),
}));

// Mock World Cup data
jest.mock('../../../../src/data/worldcup2026/venues', () => ({
  ALL_WORLD_CUP_VENUES: [
    {
      id: 'metlife-stadium-wc',
      commonName: 'MetLife Stadium',
      fifaName: 'New York New Jersey Stadium',
      city: 'East Rutherford',
      country: 'USA',
      latitude: 40.8135,
      longitude: -74.0745,
      timezone: 'America/New_York',
      capacity: 82500,
      soccerCapacity: 87000,
      sections: [],
      openingYear: 2010,
      surfaceType: 'grass',
      roof: 'open',
      hostMatches: 8,
      basedOnNFLStadium: true,
      fieldOrientation: 90,
      fieldDimensions: { length: 110, width: 75 },
    },
    {
      id: 'sofi-stadium-wc',
      commonName: 'SoFi Stadium',
      fifaName: 'Los Angeles Stadium',
      city: 'Inglewood',
      country: 'USA',
      latitude: 33.9535,
      longitude: -118.3392,
      timezone: 'America/Los_Angeles',
      capacity: 70240,
      soccerCapacity: 70000,
      sections: [],
      openingYear: 2020,
      surfaceType: 'artificial',
      roof: 'fixed',
      hostMatches: 8,
      basedOnNFLStadium: true,
      fieldOrientation: 93,
      fieldDimensions: { length: 110, width: 75 },
    },
  ],
}));

jest.mock('../../../../src/data/worldcup2026/matches', () => ({
  getMatchesByVenue: jest.fn(() => [
    { matchId: '1', venue: 'metlife-stadium-wc' },
    { matchId: '2', venue: 'metlife-stadium-wc' },
  ]),
}));

// Mock i18n context
jest.mock('../../../../src/i18n/i18nContext', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('ComparePageClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the comparison page', () => {
    render(<ComparePageClient />);

    expect(screen.getByText('Compare World Cup 2026 Venues')).toBeInTheDocument();
    expect(screen.getByText(/Select 2-4 stadiums to compare side-by-side/i)).toBeInTheDocument();
  });

  it('should display venue cards in compare mode', () => {
    render(<ComparePageClient />);

    expect(screen.getByText('MetLife Stadium')).toBeInTheDocument();
    expect(screen.getByText('SoFi Stadium')).toBeInTheDocument();
  });

  it('should show selection count initially at 0', () => {
    render(<ComparePageClient />);

    expect(screen.getByText('0 of 4 venues selected')).toBeInTheDocument();
  });

  it('should display instructions', () => {
    render(<ComparePageClient />);

    expect(screen.getByText('How to Compare Venues')).toBeInTheDocument();
    expect(screen.getByText(/Select 2-4 venues below by clicking on the cards/)).toBeInTheDocument();
  });

  it('should have a back link to venues page', () => {
    render(<ComparePageClient />);

    const backLink = screen.getByText('← Back to Venues');
    expect(backLink).toBeInTheDocument();
    expect(backLink.closest('a')).toHaveAttribute('href', '/worldcup2026/venues');
  });

  it('should display venue grid', () => {
    render(<ComparePageClient />);

    // Should show all 16 venues (mocked to 2 for testing)
    const venueCards = screen.getAllByText(/Stadium/);
    expect(venueCards.length).toBeGreaterThan(0);
  });

  it('should show helpful text when no venues selected', () => {
    render(<ComparePageClient />);

    expect(screen.getByText('Select at least 2 venues to start comparing')).toBeInTheDocument();
  });
});
