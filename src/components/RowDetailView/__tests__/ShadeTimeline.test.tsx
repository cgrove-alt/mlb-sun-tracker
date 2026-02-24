import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ShadeTimeline } from '../ShadeTimeline';

// Mock icons
jest.mock('../../Icons', () => ({
  SunIcon: ({ size, color }: { size: number; color?: string }) => (
    <div data-testid="sun-icon" data-size={size} data-color={color} />
  ),
  CloudIcon: ({ size, color }: { size: number; color?: string }) => (
    <div data-testid="cloud-icon" data-size={size} data-color={color} />
  ),
  PartlyCloudyIcon: ({ size, color }: { size: number; color?: string }) => (
    <div data-testid="partly-cloudy-icon" data-size={size} data-color={color} />
  ),
}));

describe('ShadeTimeline', () => {
  describe('Default mode (full)', () => {
    it('renders timeline header', () => {
      render(<ShadeTimeline overallShade={65} />);
      expect(screen.getByText('Shade Throughout Game')).toBeInTheDocument();
    });

    it('displays average shade percentage', () => {
      render(<ShadeTimeline overallShade={75} />);
      expect(screen.getByText(/75%/)).toBeInTheDocument();
      expect(screen.getByText(/average shade/)).toBeInTheDocument();
    });

    it('renders 9 innings', () => {
      render(<ShadeTimeline overallShade={60} />);

      // Check for inning labels 1-9
      for (let i = 1; i <= 9; i++) {
        expect(screen.getByText(i.toString())).toBeInTheDocument();
      }
    });

    it('displays optimal timing recommendation', () => {
      render(<ShadeTimeline overallShade={80} />);
      expect(screen.getByText('Optimal Timing')).toBeInTheDocument();
      expect(screen.getByText(/Shaded from first pitch|Mostly shaded|Best to arrive|Limited shade|Full sun/)).toBeInTheDocument();
    });

    it('shows legend', () => {
      render(<ShadeTimeline overallShade={50} />);
      expect(screen.getByText('75%+ Shade')).toBeInTheDocument();
      expect(screen.getByText('40-74% Shade')).toBeInTheDocument();
      expect(screen.getByText('<40% Shade')).toBeInTheDocument();
    });

    it('generates default inning data when not provided', () => {
      render(<ShadeTimeline overallShade={60} />);

      // Should show percentages for all 9 innings
      const percentages = screen.getAllByText(/%$/);
      expect(percentages.length).toBeGreaterThanOrEqual(9);
    });
  });

  describe('Compact mode', () => {
    it('renders compact timeline bar', () => {
      render(<ShadeTimeline overallShade={70} compact={true} />);

      // Should still have 9 innings
      for (let i = 1; i <= 9; i++) {
        expect(screen.getByText(i.toString())).toBeInTheDocument();
      }
    });

    it('does not show full header in compact mode', () => {
      render(<ShadeTimeline overallShade={70} compact={true} />);

      expect(screen.queryByText('Shade Throughout Game')).not.toBeInTheDocument();
      expect(screen.queryByText('Optimal Timing')).not.toBeInTheDocument();
    });

    it('shows recommendation text in compact mode', () => {
      render(<ShadeTimeline overallShade={70} compact={true} />);

      expect(screen.getByText(/Shaded from first pitch|Mostly shaded|Best to arrive|Limited shade|Full sun/)).toBeInTheDocument();
    });
  });

  describe('Shade calculation logic', () => {
    it('recommends "Shaded from first pitch" for high initial shade', () => {
      // Very high overall shade means good coverage from start
      render(<ShadeTimeline overallShade={95} />);
      expect(screen.getByText('Shaded from first pitch')).toBeInTheDocument();
    });

    it('recommends arrival time for gradual shade', () => {
      // Moderate shade that builds up over time
      render(<ShadeTimeline overallShade={60} />);
      expect(screen.getByText(/Best to arrive|Mostly shaded/)).toBeInTheDocument();
    });

    it('warns about full sun for low overall shade', () => {
      // Low shade throughout
      render(<ShadeTimeline overallShade={15} />);
      expect(screen.getByText(/Limited shade|Full sun/)).toBeInTheDocument();
    });
  });

  describe('Icon rendering', () => {
    it('uses CloudIcon for high shade innings', () => {
      render(<ShadeTimeline overallShade={90} />);
      expect(screen.getAllByTestId('cloud-icon').length).toBeGreaterThan(0);
    });

    it('uses SunIcon for low shade innings', () => {
      render(<ShadeTimeline overallShade={20} />);
      expect(screen.getAllByTestId('sun-icon').length).toBeGreaterThan(0);
    });

    it('uses PartlyCloudyIcon for moderate shade innings', () => {
      render(<ShadeTimeline overallShade={55} />);
      expect(screen.getAllByTestId('partly-cloudy-icon').length).toBeGreaterThan(0);
    });
  });

  describe('Accessibility', () => {
    it('has aria-label for each inning cell', () => {
      render(<ShadeTimeline overallShade={60} />);

      // Each inning should have role="img" with aria-label
      const inningCells = screen.getAllByRole('img');
      expect(inningCells.length).toBe(9);

      inningCells.forEach((cell) => {
        expect(cell).toHaveAttribute('aria-label');
        expect(cell.getAttribute('aria-label')).toMatch(/Inning \d+: \d+% shade coverage/);
      });
    });
  });

  describe('Custom inning data', () => {
    const customInningData = [
      { inning: 1, label: '1', shadePercentage: 20, isShaded: false },
      { inning: 2, label: '2', shadePercentage: 30, isShaded: false },
      { inning: 3, label: '3', shadePercentage: 45, isShaded: false },
      { inning: 4, label: '4', shadePercentage: 60, isShaded: true },
      { inning: 5, label: '5', shadePercentage: 70, isShaded: true },
      { inning: 6, label: '6', shadePercentage: 80, isShaded: true },
      { inning: 7, label: '7', shadePercentage: 85, isShaded: true },
      { inning: 8, label: '8', shadePercentage: 90, isShaded: true },
      { inning: 9, label: '9', shadePercentage: 95, isShaded: true },
    ];

    it('uses custom inning data when provided', () => {
      render(<ShadeTimeline overallShade={65} inningShadeData={customInningData} />);

      // Should show custom percentages
      expect(screen.getByText('20%')).toBeInTheDocument();
      expect(screen.getByText('95%')).toBeInTheDocument();
    });

    it('recommends arrival by inning 4 when shade crosses 60% threshold', () => {
      render(<ShadeTimeline overallShade={65} inningShadeData={customInningData} />);

      // Inning 4 is first with >=60% shade
      expect(screen.getByText(/Best to arrive by inning 4|Mostly shaded by inning 4/)).toBeInTheDocument();
    });
  });
});
