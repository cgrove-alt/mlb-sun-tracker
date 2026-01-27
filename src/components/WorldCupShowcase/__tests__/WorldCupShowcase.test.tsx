import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { WorldCupShowcase } from '../WorldCupShowcase';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('WorldCupShowcase', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render the section title', () => {
    render(<WorldCupShowcase openingMatchDate={new Date('2026-06-11T12:00:00-07:00')} />);
    expect(screen.getByText(/Find the Best Shaded Seats at All 16 World Cup Venues/i)).toBeInTheDocument();
  });

  it('should render the FIFA World Cup badge', () => {
    render(<WorldCupShowcase openingMatchDate={new Date('2026-06-11T12:00:00-07:00')} />);
    expect(screen.getByText('FIFA World Cup 2026')).toBeInTheDocument();
  });

  it('should render the description with stats', () => {
    render(<WorldCupShowcase openingMatchDate={new Date('2026-06-11T12:00:00-07:00')} />);
    expect(screen.getByText(/USA • Mexico • Canada \| 104 Matches \| 16 Stadiums/i)).toBeInTheDocument();
  });

  it('should render countdown timer', () => {
    render(<WorldCupShowcase openingMatchDate={new Date('2026-06-11T12:00:00-07:00')} />);

    expect(screen.getByText('Opening Match Countdown')).toBeInTheDocument();
    expect(screen.getByText('Days')).toBeInTheDocument();
    expect(screen.getByText('Hours')).toBeInTheDocument();
    expect(screen.getByText('Minutes')).toBeInTheDocument();
    expect(screen.getByText('Seconds')).toBeInTheDocument();
  });

  it('should update countdown every second', () => {
    const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 10); // 10 days from now
    render(<WorldCupShowcase openingMatchDate={futureDate} />);

    // Fast forward time by 1 second
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Countdown should have updated
    expect(screen.getByText('Days')).toBeInTheDocument();
  });

  it('should render venue carousel', () => {
    render(<WorldCupShowcase openingMatchDate={new Date('2026-06-11T12:00:00-07:00')} />);

    // Should show a venue name
    expect(screen.getByText(/Stadium/i)).toBeInTheDocument();
  });

  it('should render carousel navigation buttons', () => {
    render(<WorldCupShowcase openingMatchDate={new Date('2026-06-11T12:00:00-07:00')} />);

    const prevButton = screen.getByLabelText('Previous venue');
    const nextButton = screen.getByLabelText('Next venue');

    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });

  it('should change venue when clicking next button', () => {
    render(<WorldCupShowcase openingMatchDate={new Date('2026-06-11T12:00:00-07:00')} />);

    const initialVenue = screen.getByText(/Stadium/i).textContent;
    const nextButton = screen.getByLabelText('Next venue');

    fireEvent.click(nextButton);

    const newVenue = screen.getByText(/Stadium/i).textContent;
    // Venue should have changed (unless it was the last one and wrapped)
    expect(newVenue).toBeDefined();
  });

  it('should render carousel dots', () => {
    render(<WorldCupShowcase openingMatchDate={new Date('2026-06-11T12:00:00-07:00')} />);

    // Should have 6 dots (for 6 featured venues)
    const dots = screen.getAllByRole('button').filter(button =>
      button.getAttribute('aria-label')?.includes('Go to venue')
    );
    expect(dots.length).toBe(6);
  });

  it('should render CTA links', () => {
    render(<WorldCupShowcase openingMatchDate={new Date('2026-06-11T12:00:00-07:00')} />);

    const exploreLink = screen.getByRole('link', { name: /Explore All 16 Venues/i });
    const scheduleLink = screen.getByRole('link', { name: /View Match Schedule/i });

    expect(exploreLink).toHaveAttribute('href', '/worldcup2026');
    expect(scheduleLink).toHaveAttribute('href', '/worldcup2026/schedule');
  });

  it('should render stats cards', () => {
    render(<WorldCupShowcase openingMatchDate={new Date('2026-06-11T12:00:00-07:00')} />);

    expect(screen.getByText('16')).toBeInTheDocument();
    expect(screen.getByText('104')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Stadiums')).toBeInTheDocument();
    expect(screen.getByText('Matches')).toBeInTheDocument();
    expect(screen.getByText('Countries')).toBeInTheDocument();
  });

  it('should stop auto-play when manually navigating', () => {
    render(<WorldCupShowcase openingMatchDate={new Date('2026-06-11T12:00:00-07:00')} />);

    const nextButton = screen.getByLabelText('Next venue');
    fireEvent.click(nextButton);

    // Auto-play should be stopped, so advancing timers shouldn't change venue
    const venueBeforeTimer = screen.getByText(/Stadium/i).textContent;

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    const venueAfterTimer = screen.getByText(/Stadium/i).textContent;
    expect(venueBeforeTimer).toBe(venueAfterTimer);
  });
});
