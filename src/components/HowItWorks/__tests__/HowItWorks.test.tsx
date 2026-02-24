import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HowItWorks } from '../HowItWorks';

describe('HowItWorks', () => {
  it('should render the section title', () => {
    render(<HowItWorks />);
    expect(screen.getByText('How It Works')).toBeInTheDocument();
  });

  it('should render all three steps', () => {
    render(<HowItWorks />);

    expect(screen.getByText('Select Your Stadium')).toBeInTheDocument();
    expect(screen.getByText('Choose Game Time')).toBeInTheDocument();
    expect(screen.getByText('Find Your Shade')).toBeInTheDocument();
  });

  it('should render step numbers', () => {
    render(<HowItWorks />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should render step descriptions', () => {
    render(<HowItWorks />);

    expect(screen.getByText(/Choose from 250\+ MLB, NFL, MiLB, and World Cup venues/i)).toBeInTheDocument();
    expect(screen.getByText(/Pick your game date and time to see real-time sun position/i)).toBeInTheDocument();
    expect(screen.getByText(/Get detailed shade coverage for every section and row/i)).toBeInTheDocument();
  });

  it('should render methodology link', () => {
    render(<HowItWorks />);

    const methodologyLink = screen.getByRole('link', { name: /Learn more about our methodology/i });
    expect(methodologyLink).toBeInTheDocument();
    expect(methodologyLink).toHaveAttribute('href', '/faq');
  });

  it('should render section description', () => {
    render(<HowItWorks />);

    expect(screen.getByText(/Find the perfect shaded seats in three simple steps/i)).toBeInTheDocument();
  });

  it('should render methodology explanation', () => {
    render(<HowItWorks />);

    expect(
      screen.getByText(/Our advanced calculations use real-time sun position, 3D stadium models/i)
    ).toBeInTheDocument();
  });
});
