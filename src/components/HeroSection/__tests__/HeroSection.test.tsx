import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HeroSection } from '../HeroSection';

describe('HeroSection', () => {
  it('should render the hero section with headline', () => {
    render(<HeroSection />);

    expect(screen.getByText(/Find Your Shade/i)).toBeInTheDocument();
    expect(screen.getByText(/Enjoy the Game/i)).toBeInTheDocument();
  });

  it('should render the feature badge with stats', () => {
    render(<HeroSection />);

    expect(screen.getByText(/250\+ Stadiums/i)).toBeInTheDocument();
    expect(screen.getByText(/Row-Level Accuracy/i)).toBeInTheDocument();
    expect(screen.getByText(/Real-Time Sun Tracking/i)).toBeInTheDocument();
  });

  it('should render the CTA link pointing to #shade-finder', () => {
    render(<HeroSection />);

    const ctaLink = screen.getByRole('link', { name: /Find your shade at any stadium/i });
    expect(ctaLink).toBeInTheDocument();
    expect(ctaLink).toHaveAttribute('href', '#shade-finder');
  });

  it('should render stats section', () => {
    render(<HeroSection />);

    const statsNumbers = screen.getAllByText(/250\+|Row-Level|Real-Time/i);
    expect(statsNumbers.length).toBeGreaterThan(0);
  });

  it('should have proper ARIA labels for accessibility', () => {
    render(<HeroSection />);

    const ctaLink = screen.getByRole('link', { name: /Find your shade at any stadium/i });
    expect(ctaLink).toHaveAttribute('aria-label');
  });

  it('should render subheadline with accurate description', () => {
    render(<HeroSection />);

    expect(
      screen.getByText(/The most accurate stadium shade finder for MLB, NFL, MiLB, and World Cup 2026/i)
    ).toBeInTheDocument();
  });
});
