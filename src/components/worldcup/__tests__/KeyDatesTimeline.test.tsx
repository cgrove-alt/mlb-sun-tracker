import React from 'react';
import { render, screen } from '@testing-library/react';
import { KeyDatesTimeline } from '../KeyDatesTimeline';
import { WORLD_CUP_2026_INFO } from '../../../data/worldcup2026/types';

// Mock dependencies
jest.mock('../../../i18n/i18nContext', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

const mockVenues = [
  {
    id: 'estadio-azteca-wc',
    commonName: 'Estadio Azteca',
    fifaName: 'Estadio Azteca',
    city: 'Mexico City',
    country: 'Mexico',
    nflStadiumId: null
  },
  {
    id: 'metlife-stadium-wc',
    commonName: 'MetLife Stadium',
    fifaName: 'New York New Jersey Stadium',
    city: 'New York/New Jersey',
    country: 'USA',
    nflStadiumId: 'metlife-stadium-giants'
  }
];

jest.mock('../../../data/worldcup2026/venues', () => ({
  ALL_WORLD_CUP_VENUES: mockVenues
}));

describe('KeyDatesTimeline', () => {
  it('renders the timeline header', () => {
    render(<KeyDatesTimeline />);

    expect(screen.getByText('📅 Tournament Timeline')).toBeInTheDocument();
    expect(screen.getByText(/Key dates and match rounds/i)).toBeInTheDocument();
  });

  it('displays opening match event', () => {
    render(<KeyDatesTimeline />);

    expect(screen.getByText('Opening Match 🎉')).toBeInTheDocument();
    expect(screen.getByText(WORLD_CUP_2026_INFO.openingMatch.date)).toBeInTheDocument();
    expect(screen.getByText(/The tournament begins!/i)).toBeInTheDocument();
  });

  it('displays all tournament rounds', () => {
    render(<KeyDatesTimeline />);

    expect(screen.getByText('Group Stage')).toBeInTheDocument();
    expect(screen.getByText('Round of 32')).toBeInTheDocument();
    expect(screen.getByText('Round of 16')).toBeInTheDocument();
    expect(screen.getByText('Quarterfinals')).toBeInTheDocument();
    expect(screen.getByText('Semifinals')).toBeInTheDocument();
    expect(screen.getByText('Third Place Match')).toBeInTheDocument();
    expect(screen.getByText('Final 🏆')).toBeInTheDocument();
  });

  it('displays group stage dates', () => {
    render(<KeyDatesTimeline />);

    expect(screen.getByText('2026-06-11 to 2026-06-26')).toBeInTheDocument();
  });

  it('displays round of 32 dates', () => {
    render(<KeyDatesTimeline />);

    expect(screen.getByText('2026-06-27 to 2026-06-30')).toBeInTheDocument();
  });

  it('displays round of 16 dates', () => {
    render(<KeyDatesTimeline />);

    expect(screen.getByText('2026-07-01 to 2026-07-03')).toBeInTheDocument();
  });

  it('displays quarterfinals dates', () => {
    render(<KeyDatesTimeline />);

    expect(screen.getByText('2026-07-09 to 2026-07-11')).toBeInTheDocument();
  });

  it('displays semifinals dates', () => {
    render(<KeyDatesTimeline />);

    expect(screen.getByText('2026-07-14 & 2026-07-15')).toBeInTheDocument();
  });

  it('displays third place match date', () => {
    render(<KeyDatesTimeline />);

    expect(screen.getByText('2026-07-18')).toBeInTheDocument();
  });

  it('displays final match date', () => {
    render(<KeyDatesTimeline />);

    expect(screen.getByText(WORLD_CUP_2026_INFO.final.date)).toBeInTheDocument();
  });

  it('displays opening match venue information', () => {
    render(<KeyDatesTimeline />);

    expect(screen.getByText('📍 Estadio Azteca')).toBeInTheDocument();
    expect(screen.getByText(WORLD_CUP_2026_INFO.openingMatch.city)).toBeInTheDocument();
  });

  it('displays final match venue information', () => {
    render(<KeyDatesTimeline />);

    expect(screen.getByText('📍 MetLife Stadium')).toBeInTheDocument();
    expect(screen.getByText(WORLD_CUP_2026_INFO.final.city)).toBeInTheDocument();
  });

  it('has links to find shaded seats for opening match', () => {
    render(<KeyDatesTimeline />);

    const links = screen.getAllByRole('link', { name: /Find Shaded Seats/i });
    expect(links.length).toBeGreaterThan(0);

    // Opening match should link correctly (no NFL stadium ID)
    const openingLink = links.find(link =>
      link.closest('div')?.textContent?.includes('Estadio Azteca')
    );
    expect(openingLink).toHaveAttribute('href', '/venue/estadio-azteca-wc');
  });

  it('has links to find shaded seats for final match', () => {
    render(<KeyDatesTimeline />);

    const links = screen.getAllByRole('link', { name: /Find Shaded Seats/i });

    // Final should link to NFL stadium ID
    const finalLink = links.find(link =>
      link.closest('div')?.textContent?.includes('MetLife Stadium')
    );
    expect(finalLink).toHaveAttribute('href', '/venue/metlife-stadium-giants');
  });

  it('displays round descriptions', () => {
    render(<KeyDatesTimeline />);

    expect(screen.getByText(/48 teams compete in 16 groups/i)).toBeInTheDocument();
    expect(screen.getByText(/Win or go home/i)).toBeInTheDocument();
    expect(screen.getByText(/Only 8 teams remain/i)).toBeInTheDocument();
    expect(screen.getByText(/The final four compete/i)).toBeInTheDocument();
    expect(screen.getByText(/One team will be crowned World Cup champion/i)).toBeInTheDocument();
  });

  it('displays appropriate emoji icons for each round', () => {
    render(<KeyDatesTimeline />);

    expect(screen.getByText('⚽')).toBeInTheDocument();
    expect(screen.getByText('🏆')).toBeInTheDocument();
    expect(screen.getByText('🎯')).toBeInTheDocument();
    expect(screen.getByText('⚡')).toBeInTheDocument();
    expect(screen.getByText('🔥')).toBeInTheDocument();
    expect(screen.getByText('⭐')).toBeInTheDocument();
    expect(screen.getByText('🥉')).toBeInTheDocument();
    expect(screen.getByText('👑')).toBeInTheDocument();
  });

  it('displays footer CTA section', () => {
    render(<KeyDatesTimeline />);

    expect(screen.getByText('Plan Your World Cup Journey')).toBeInTheDocument();
    expect(screen.getByText(/View the complete match schedule/i)).toBeInTheDocument();
  });

  it('has CTA links in footer', () => {
    render(<KeyDatesTimeline />);

    const scheduleLink = screen.getByRole('link', { name: /Full Match Schedule/i });
    const compareLink = screen.getByRole('link', { name: /Compare Venues/i });

    expect(scheduleLink).toHaveAttribute('href', '/worldcup2026/schedule');
    expect(compareLink).toHaveAttribute('href', '/worldcup2026/compare');
  });

  it('applies custom className', () => {
    const { container } = render(<KeyDatesTimeline className="custom-class" />);

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('has proper heading hierarchy', () => {
    render(<KeyDatesTimeline />);

    const mainHeading = screen.getByRole('heading', { level: 2, name: /Tournament Timeline/i });
    expect(mainHeading).toBeInTheDocument();

    const subHeadings = screen.getAllByRole('heading', { level: 3 });
    expect(subHeadings.length).toBeGreaterThan(0);
  });

  it('displays all 8 timeline events', () => {
    render(<KeyDatesTimeline />);

    const timelineEvents = [
      'Opening Match',
      'Group Stage',
      'Round of 32',
      'Round of 16',
      'Quarterfinals',
      'Semifinals',
      'Third Place Match',
      'Final'
    ];

    timelineEvents.forEach(event => {
      expect(screen.getByText(new RegExp(event, 'i'))).toBeInTheDocument();
    });
  });

  it('uses color-coded design for different rounds', () => {
    const { container } = render(<KeyDatesTimeline />);

    // Check that different color classes are applied
    const bgGreen = container.querySelector('.bg-green-50');
    const bgBlue = container.querySelector('.bg-blue-50');
    const bgPurple = container.querySelector('.bg-purple-50');
    const bgOrange = container.querySelector('.bg-orange-50');

    expect(bgGreen).toBeInTheDocument();
    expect(bgBlue).toBeInTheDocument();
    expect(bgPurple).toBeInTheDocument();
    expect(bgOrange).toBeInTheDocument();
  });
});
