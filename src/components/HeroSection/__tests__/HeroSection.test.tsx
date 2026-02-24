import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HeroSection } from '../HeroSection';

describe('HeroSection', () => {
  it('should render the hero section with headline', () => {
    const mockOnGetStarted = jest.fn();
    render(<HeroSection onGetStarted={mockOnGetStarted} />);

    expect(screen.getByText(/Find Your Shade/i)).toBeInTheDocument();
    expect(screen.getByText(/Enjoy the Game/i)).toBeInTheDocument();
  });

  it('should render the feature badge with stats', () => {
    const mockOnGetStarted = jest.fn();
    render(<HeroSection onGetStarted={mockOnGetStarted} />);

    expect(screen.getByText(/250\+ Stadiums/i)).toBeInTheDocument();
    expect(screen.getByText(/Row-Level Accuracy/i)).toBeInTheDocument();
    expect(screen.getByText(/Real-Time Sun Tracking/i)).toBeInTheDocument();
  });

  it('should render the CTA button and call handler on click', () => {
    const mockOnGetStarted = jest.fn();
    render(<HeroSection onGetStarted={mockOnGetStarted} />);

    const ctaButton = screen.getByRole('button', { name: /Get started finding shaded seats/i });
    expect(ctaButton).toBeInTheDocument();

    fireEvent.click(ctaButton);
    expect(mockOnGetStarted).toHaveBeenCalledTimes(1);
  });

  it('should render stats section', () => {
    const mockOnGetStarted = jest.fn();
    render(<HeroSection onGetStarted={mockOnGetStarted} />);

    // Check for stats
    const statsNumbers = screen.getAllByText(/250\+|Row-Level|Real-Time/i);
    expect(statsNumbers.length).toBeGreaterThan(0);
  });

  it('should have proper ARIA labels for accessibility', () => {
    const mockOnGetStarted = jest.fn();
    render(<HeroSection onGetStarted={mockOnGetStarted} />);

    const ctaButton = screen.getByRole('button', { name: /Get started finding shaded seats/i });
    expect(ctaButton).toHaveAttribute('aria-label');
  });

  it('should render subheadline with accurate description', () => {
    const mockOnGetStarted = jest.fn();
    render(<HeroSection onGetStarted={mockOnGetStarted} />);

    expect(
      screen.getByText(/The most accurate stadium shade finder for MLB, NFL, MiLB, and World Cup 2026/i)
    ).toBeInTheDocument();
  });
});
