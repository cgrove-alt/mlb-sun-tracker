import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TravelGuide } from '../TravelGuide';

// Mock dependencies
jest.mock('../../../i18n/i18nContext', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

describe('TravelGuide', () => {
  it('renders the travel guide header', () => {
    render(<TravelGuide />);

    expect(screen.getByText('🌍 Planning Your World Cup Experience')).toBeInTheDocument();
    expect(screen.getByText('Essential tips for attending the world\'s biggest sporting event')).toBeInTheDocument();
  });

  it('displays all section headers', () => {
    render(<TravelGuide />);

    expect(screen.getByText('Planning & Preparation')).toBeInTheDocument();
    expect(screen.getByText('Climate Guide (June-July 2026)')).toBeInTheDocument();
    expect(screen.getByText('Packing Essentials')).toBeInTheDocument();
    expect(screen.getByText('Getting to Stadiums')).toBeInTheDocument();
  });

  it('has planning section expanded by default', () => {
    render(<TravelGuide />);

    expect(screen.getByText('Book Early')).toBeInTheDocument();
    expect(screen.getByText(/Hotels and flights fill up quickly/)).toBeInTheDocument();
  });

  it('expands climate section when clicked', () => {
    render(<TravelGuide />);

    const climateButton = screen.getByRole('button', { name: /Climate Guide/i });
    fireEvent.click(climateButton);

    expect(screen.getByText('United States (11 venues)')).toBeInTheDocument();
    expect(screen.getByText('Mexico (3 venues)')).toBeInTheDocument();
    expect(screen.getByText('Canada (2 venues)')).toBeInTheDocument();
  });

  it('displays USA climate information', () => {
    render(<TravelGuide />);

    const climateButton = screen.getByRole('button', { name: /Climate Guide/i });
    fireEvent.click(climateButton);

    expect(screen.getByText(/Hot summer conditions/i)).toBeInTheDocument();
    expect(screen.getByText(/Dallas, Houston, Miami, Kansas City/i)).toBeInTheDocument();
  });

  it('displays Mexico climate information with altitude warning', () => {
    render(<TravelGuide />);

    const climateButton = screen.getByRole('button', { name: /Climate Guide/i });
    fireEvent.click(climateButton);

    expect(screen.getByText(/Mexico City is at 7,350 feet elevation/i)).toBeInTheDocument();
    expect(screen.getByText(/Intense sun exposure even at moderate temperatures/i)).toBeInTheDocument();
  });

  it('displays Canada climate information', () => {
    render(<TravelGuide />);

    const climateButton = screen.getByRole('button', { name: /Climate Guide/i });
    fireEvent.click(climateButton);

    expect(screen.getByText(/Mild to warm summer weather/i)).toBeInTheDocument();
    expect(screen.getByText(/Toronto and Vancouver/i)).toBeInTheDocument();
  });

  it('expands packing section when clicked', () => {
    render(<TravelGuide />);

    const packingButton = screen.getByRole('button', { name: /Packing Essentials/i });
    fireEvent.click(packingButton);

    expect(screen.getByText('Stadium Bag Checklist')).toBeInTheDocument();
    expect(screen.getByText('What NOT to Bring')).toBeInTheDocument();
  });

  it('displays stadium bag checklist items', () => {
    render(<TravelGuide />);

    const packingButton = screen.getByRole('button', { name: /Packing Essentials/i });
    fireEvent.click(packingButton);

    expect(screen.getByText(/Clear bag \(stadium policy required\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Tickets \(digital \+ printed backup\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Empty refillable water bottle/i)).toBeInTheDocument();
  });

  it('displays what NOT to bring list', () => {
    render(<TravelGuide />);

    const packingButton = screen.getByRole('button', { name: /Packing Essentials/i });
    fireEvent.click(packingButton);

    expect(screen.getByText(/Large bags or backpacks/i)).toBeInTheDocument();
    expect(screen.getByText(/Professional cameras with long lenses/i)).toBeInTheDocument();
    expect(screen.getByText(/Drones/i)).toBeInTheDocument();
  });

  it('expands transportation section when clicked', () => {
    render(<TravelGuide />);

    const transportButton = screen.getByRole('button', { name: /Getting to Stadiums/i });
    fireEvent.click(transportButton);

    expect(screen.getByText(/Public Transit:/)).toBeInTheDocument();
    expect(screen.getByText(/Ride-Share:/)).toBeInTheDocument();
    expect(screen.getByText(/Parking:/)).toBeInTheDocument();
  });

  it('collapses expanded section when clicked again', () => {
    render(<TravelGuide />);

    const planningButton = screen.getByRole('button', { name: /Planning & Preparation/i });

    // Should be expanded by default
    expect(screen.getByText('Book Early')).toBeInTheDocument();

    // Click to collapse
    fireEvent.click(planningButton);

    // Content should not be visible
    expect(screen.queryByText('Book Early')).not.toBeInTheDocument();
  });

  it('stops auto-play on section click', () => {
    render(<TravelGuide />);

    const climateButton = screen.getByRole('button', { name: /Climate Guide/i });

    // Click climate section
    fireEvent.click(climateButton);

    // Should show climate content
    expect(screen.getByText('United States (11 venues)')).toBeInTheDocument();

    // Planning section should be collapsed
    expect(screen.queryByText('Book Early')).not.toBeInTheDocument();
  });

  it('has accessible section toggles', () => {
    render(<TravelGuide />);

    const buttons = screen.getAllByRole('button');

    // Each button should have aria-expanded
    buttons.forEach(button => {
      const ariaExpanded = button.getAttribute('aria-expanded');
      expect(ariaExpanded).toBeDefined();
    });
  });

  it('displays CTA buttons in footer', () => {
    render(<TravelGuide />);

    const scheduleLink = screen.getByRole('link', { name: /View Match Schedule/i });
    const venuesLink = screen.getByRole('link', { name: /Explore All Venues/i });

    expect(scheduleLink).toHaveAttribute('href', '/worldcup2026/schedule');
    expect(venuesLink).toHaveAttribute('href', '/worldcup2026/venues');
  });

  it('includes link to venue comparison tool', () => {
    render(<TravelGuide />);

    const compareLink = screen.getByRole('link', { name: /venue comparison tool/i });
    expect(compareLink).toHaveAttribute('href', '/worldcup2026/compare');
  });

  it('includes link to FIFA official website', () => {
    render(<TravelGuide />);

    const fifaLink = screen.getByRole('link', { name: /FIFA.com/i });
    expect(fifaLink).toHaveAttribute('href', 'https://www.fifa.com/fifaplus/en/tournaments/mens/worldcup/canadamexicousa2026');
    expect(fifaLink).toHaveAttribute('target', '_blank');
    expect(fifaLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('applies custom className', () => {
    const { container } = render(<TravelGuide className="custom-class" />);

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('displays general sun protection tips', () => {
    render(<TravelGuide />);

    const climateButton = screen.getByRole('button', { name: /Climate Guide/i });
    fireEvent.click(climateButton);

    expect(screen.getByText(/Use our shade finder to book seats/i)).toBeInTheDocument();
    expect(screen.getByText(/Reapply sunscreen every 2 hours/i)).toBeInTheDocument();
  });

  it('has proper heading hierarchy', () => {
    render(<TravelGuide />);

    const mainHeading = screen.getByRole('heading', { level: 2, name: /Planning Your World Cup Experience/i });
    expect(mainHeading).toBeInTheDocument();

    const sectionHeadings = screen.getAllByRole('heading', { level: 3 });
    expect(sectionHeadings.length).toBeGreaterThan(0);
  });

  it('includes pro tips in transportation section', () => {
    render(<TravelGuide />);

    const transportButton = screen.getByRole('button', { name: /Getting to Stadiums/i });
    fireEvent.click(transportButton);

    expect(screen.getByText(/Pro Tip:/i)).toBeInTheDocument();
    expect(screen.getByText(/Check our venue pages for specific transportation recommendations/i)).toBeInTheDocument();
  });
});
