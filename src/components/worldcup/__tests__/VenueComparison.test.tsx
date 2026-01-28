import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { VenueComparison } from '../VenueComparison';
import { WorldCupVenue } from '../../../data/worldcup2026/types';

// Mock venues for testing
const mockVenue1: WorldCupVenue = {
  id: 'metlife-stadium-wc',
  fifaName: 'New York New Jersey Stadium',
  commonName: 'MetLife Stadium',
  city: 'East Rutherford',
  country: 'USA',
  latitude: 40.8135,
  longitude: -74.0745,
  timezone: 'America/New_York',
  capacity: 82500,
  soccerCapacity: 87000,
  basedOnNFLStadium: true,
  fieldOrientation: 90,
  fieldDimensions: { length: 110, width: 75 },
  sections: [],
  openingYear: 2010,
  surfaceType: 'grass',
  roof: 'open',
  hostMatches: 8,
};

const mockVenue2: WorldCupVenue = {
  id: 'sofi-stadium-wc',
  fifaName: 'Los Angeles Stadium',
  commonName: 'SoFi Stadium',
  city: 'Inglewood',
  country: 'USA',
  latitude: 33.9535,
  longitude: -118.3392,
  timezone: 'America/Los_Angeles',
  capacity: 70240,
  soccerCapacity: 70000,
  basedOnNFLStadium: true,
  fieldOrientation: 93,
  fieldDimensions: { length: 110, width: 75 },
  sections: [],
  openingYear: 2020,
  surfaceType: 'artificial',
  roof: 'fixed',
  hostMatches: 8,
};

const mockVenue3: WorldCupVenue = {
  id: 'estadio-azteca-wc',
  fifaName: 'Estadio Azteca',
  commonName: 'Estadio Azteca',
  city: 'Mexico City',
  country: 'Mexico',
  latitude: 19.3029,
  longitude: -99.1506,
  timezone: 'America/Mexico_City',
  capacity: 87523,
  soccerCapacity: 90000,
  basedOnNFLStadium: false,
  fieldOrientation: 0,
  fieldDimensions: { length: 105, width: 68 },
  sections: [],
  openingYear: 1966,
  surfaceType: 'grass',
  roof: 'open',
  hostMatches: 5,
};

describe('VenueComparison', () => {
  const mockVenueCounts = {
    'metlife-stadium-wc': 8,
    'sofi-stadium-wc': 8,
    'estadio-azteca-wc': 5,
  };

  const mockOnClose = jest.fn();
  const mockOnRemoveVenue = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render comparison with 2 venues', () => {
    render(
      <VenueComparison
        selectedVenues={[mockVenue1, mockVenue2]}
        venueCounts={mockVenueCounts}
        onClose={mockOnClose}
        onRemoveVenue={mockOnRemoveVenue}
      />
    );

    expect(screen.getByText('Compare Venues (2)')).toBeInTheDocument();
    expect(screen.getByText('MetLife Stadium')).toBeInTheDocument();
    expect(screen.getByText('SoFi Stadium')).toBeInTheDocument();
  });

  it('should render comparison with 3 venues', () => {
    render(
      <VenueComparison
        selectedVenues={[mockVenue1, mockVenue2, mockVenue3]}
        venueCounts={mockVenueCounts}
        onClose={mockOnClose}
        onRemoveVenue={mockOnRemoveVenue}
      />
    );

    expect(screen.getByText('Compare Venues (3)')).toBeInTheDocument();
    expect(screen.getByText('MetLife Stadium')).toBeInTheDocument();
    expect(screen.getByText('SoFi Stadium')).toBeInTheDocument();
    expect(screen.getByText('Estadio Azteca')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    render(
      <VenueComparison
        selectedVenues={[mockVenue1, mockVenue2]}
        venueCounts={mockVenueCounts}
        onClose={mockOnClose}
        onRemoveVenue={mockOnRemoveVenue}
      />
    );

    const closeButtons = screen.getAllByLabelText('Close comparison');
    fireEvent.click(closeButtons[0]);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should display travel distances between venues', () => {
    render(
      <VenueComparison
        selectedVenues={[mockVenue1, mockVenue2]}
        venueCounts={mockVenueCounts}
        onClose={mockOnClose}
        onRemoveVenue={mockOnRemoveVenue}
      />
    );

    expect(screen.getByText(/Travel Distances/i)).toBeInTheDocument();
    expect(screen.getByText(/MetLife Stadium → SoFi Stadium/)).toBeInTheDocument();
  });

  it('should display packing tips', () => {
    render(
      <VenueComparison
        selectedVenues={[mockVenue1, mockVenue2, mockVenue3]}
        venueCounts={mockVenueCounts}
        onClose={mockOnClose}
        onRemoveVenue={mockOnRemoveVenue}
      />
    );

    expect(screen.getByText(/Travel Tips/i)).toBeInTheDocument();
  });

  it('should identify best shade venue', () => {
    render(
      <VenueComparison
        selectedVenues={[mockVenue1, mockVenue2]}
        venueCounts={mockVenueCounts}
        onClose={mockOnClose}
        onRemoveVenue={mockOnRemoveVenue}
      />
    );

    // SoFi Stadium has fixed roof, should be best shade
    expect(screen.getByText('Best Shade')).toBeInTheDocument();
  });

  it('should identify largest venue', () => {
    render(
      <VenueComparison
        selectedVenues={[mockVenue1, mockVenue2, mockVenue3]}
        venueCounts={mockVenueCounts}
        onClose={mockOnClose}
        onRemoveVenue={mockOnRemoveVenue}
      />
    );

    // Estadio Azteca has largest capacity (90000)
    expect(screen.getByText('Largest')).toBeInTheDocument();
  });

  it('should identify newest venue', () => {
    render(
      <VenueComparison
        selectedVenues={[mockVenue1, mockVenue2, mockVenue3]}
        venueCounts={mockVenueCounts}
        onClose={mockOnClose}
        onRemoveVenue={mockOnRemoveVenue}
      />
    );

    // SoFi Stadium opened in 2020
    expect(screen.getByText('Newest')).toBeInTheDocument();
  });

  it('should identify venue with most matches', () => {
    render(
      <VenueComparison
        selectedVenues={[mockVenue1, mockVenue2, mockVenue3]}
        venueCounts={mockVenueCounts}
        onClose={mockOnClose}
        onRemoveVenue={mockOnRemoveVenue}
      />
    );

    // MetLife and SoFi both have 8 matches
    const mostMatchesBadges = screen.getAllByText('Most Matches');
    expect(mostMatchesBadges.length).toBeGreaterThan(0);
  });

  it('should return null when no venues selected', () => {
    const { container } = render(
      <VenueComparison
        selectedVenues={[]}
        venueCounts={mockVenueCounts}
        onClose={mockOnClose}
        onRemoveVenue={mockOnRemoveVenue}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should handle keyboard navigation (Escape key)', () => {
    render(
      <VenueComparison
        selectedVenues={[mockVenue1, mockVenue2]}
        venueCounts={mockVenueCounts}
        onClose={mockOnClose}
        onRemoveVenue={mockOnRemoveVenue}
      />
    );

    const dialog = screen.getByRole('dialog');
    fireEvent.keyDown(dialog, { key: 'Escape' });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
