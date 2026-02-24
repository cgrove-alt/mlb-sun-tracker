import React from 'react';
import { render, screen } from '@testing-library/react';
import { WorldCupHero } from '../WorldCupHero';
import { WORLD_CUP_2026_INFO } from '../../../data/worldcup2026/types';

// Mock dependencies
jest.mock('../../../i18n/i18nContext', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

jest.mock('../../../data/worldcup2026/matches', () => ({
  getNextMatch: () => ({
    matchId: 'wc2026-001',
    date: '2026-06-11',
    kickoffTime: '17:00',
    venue: 'estadio-azteca-wc',
    round: 'Group Stage',
    teamA: 'Mexico',
    teamB: 'TBD'
  }),
  ALL_WORLD_CUP_MATCHES: []
}));

jest.mock('../../../data/worldcup2026/venues', () => ({
  ALL_WORLD_CUP_VENUES: [
    {
      id: 'estadio-azteca-wc',
      commonName: 'Estadio Azteca',
      timezone: 'America/Mexico_City',
      city: 'Mexico City',
      country: 'Mexico'
    }
  ]
}));

jest.mock('../../MatchCountdown', () => ({
  MatchCountdown: ({ teamA, teamB, venueName }: any) => (
    <div data-testid="match-countdown">
      {teamA} vs {teamB} at {venueName}
    </div>
  )
}));

describe('WorldCupHero', () => {
  it('renders the hero section', () => {
    render(<WorldCupHero />);

    expect(screen.getByText('worldcup.title')).toBeInTheDocument();
    expect(screen.getByText('worldcup.subtitle')).toBeInTheDocument();
    expect(screen.getByText('worldcup.description')).toBeInTheDocument();
  });

  it('displays World Cup badge with correct text', () => {
    render(<WorldCupHero />);

    expect(screen.getByText('FIFA World Cup 2026')).toBeInTheDocument();
  });

  it('displays host country badges', () => {
    render(<WorldCupHero />);

    expect(screen.getByText('🇺🇸')).toBeInTheDocument();
    expect(screen.getByText('🇲🇽')).toBeInTheDocument();
    expect(screen.getByText('🇨🇦')).toBeInTheDocument();
    expect(screen.getByText('USA')).toBeInTheDocument();
    expect(screen.getByText('Mexico')).toBeInTheDocument();
    expect(screen.getByText('Canada')).toBeInTheDocument();
  });

  it('displays key statistics', () => {
    render(<WorldCupHero />);

    expect(screen.getByText(WORLD_CUP_2026_INFO.totalVenues.toString())).toBeInTheDocument();
    expect(screen.getByText(WORLD_CUP_2026_INFO.totalMatches.toString())).toBeInTheDocument();
    expect(screen.getByText(WORLD_CUP_2026_INFO.participatingTeams.toString())).toBeInTheDocument();
    expect(screen.getByText(WORLD_CUP_2026_INFO.totalCountries.toString())).toBeInTheDocument();
  });

  it('displays opening match countdown', () => {
    render(<WorldCupHero />);

    const countdown = screen.getByTestId('match-countdown');
    expect(countdown).toBeInTheDocument();
    expect(countdown).toHaveTextContent('Mexico vs TBD at Estadio Azteca');
  });

  it('displays CTA buttons with correct links', () => {
    render(<WorldCupHero />);

    const scheduleLink = screen.getByRole('link', { name: /worldcup.viewSchedule/i });
    expect(scheduleLink).toHaveAttribute('href', '/worldcup2026/schedule');

    const venuesLink = screen.getByRole('link', { name: /worldcup.navigation.venues/i });
    expect(venuesLink).toHaveAttribute('href', '#venues');

    const compareLink = screen.getByRole('link', { name: /Compare Venues/i });
    expect(compareLink).toHaveAttribute('href', '/worldcup2026/compare');
  });

  it('displays tournament dates', () => {
    render(<WorldCupHero />);

    expect(screen.getByText(WORLD_CUP_2026_INFO.startDate)).toBeInTheDocument();
    expect(screen.getByText(WORLD_CUP_2026_INFO.endDate)).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const { container } = render(<WorldCupHero className="custom-class" />);

    const heroElement = container.firstChild as HTMLElement;
    expect(heroElement).toHaveClass('custom-class');
  });

  it('has proper accessibility structure', () => {
    render(<WorldCupHero />);

    // Check for heading hierarchy
    const mainHeading = screen.getByRole('heading', { level: 1 });
    expect(mainHeading).toBeInTheDocument();

    // Check for links
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);

    // All links should have accessible names
    links.forEach(link => {
      expect(link).toHaveAccessibleName();
    });
  });
});
