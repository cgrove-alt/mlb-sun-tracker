/**
 * Tests for ClimateMessaging Component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  ClimateMessaging,
  CountryClimateGrid,
  getClimateSeverityColor,
  getClimateMessage
} from '../ClimateMessaging';

describe('ClimateMessaging Component', () => {
  describe('Compact Variant', () => {
    it('renders USA climate message in compact mode', () => {
      render(<ClimateMessaging country="USA" variant="compact" />);

      expect(screen.getByText(/Summer heat - shade critical for comfort/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Climate information for USA/i)).toBeInTheDocument();
    });

    it('renders Mexico climate message in compact mode', () => {
      render(<ClimateMessaging country="Mexico" variant="compact" />);

      expect(screen.getByText(/High altitude - intense sun exposure/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Climate information for Mexico/i)).toBeInTheDocument();
    });

    it('renders Canada climate message in compact mode', () => {
      render(<ClimateMessaging country="Canada" variant="compact" />);

      expect(screen.getByText(/Mild climate - less sun concern, but still check/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Climate information for Canada/i)).toBeInTheDocument();
    });

    it('applies correct severity styling for USA (high)', () => {
      const { container } = render(<ClimateMessaging country="USA" variant="compact" />);
      const alert = container.querySelector('[role="alert"]');

      expect(alert).toHaveClass('bg-red-50');
      expect(alert).toHaveClass('border-red-200');
      expect(alert).toHaveClass('text-red-900');
    });

    it('applies correct severity styling for Canada (low)', () => {
      const { container } = render(<ClimateMessaging country="Canada" variant="compact" />);
      const alert = container.querySelector('[role="alert"]');

      expect(alert).toHaveClass('bg-blue-50');
      expect(alert).toHaveClass('border-blue-200');
      expect(alert).toHaveClass('text-blue-900');
    });

    it('applies custom className', () => {
      const { container } = render(<ClimateMessaging country="USA" variant="compact" className="custom-class" />);
      const alert = container.querySelector('[role="alert"]');

      expect(alert).toHaveClass('custom-class');
    });
  });

  describe('Detailed Variant', () => {
    it('renders USA climate guide in detailed mode', () => {
      render(<ClimateMessaging country="USA" variant="detailed" />);

      expect(screen.getByText('USA Climate Guide')).toBeInTheDocument();
      expect(screen.getByText(/Summer heat - shade critical for comfort/i)).toBeInTheDocument();
      expect(screen.getByText(/What to Know:/i)).toBeInTheDocument();
    });

    it('displays all climate tips for USA', () => {
      render(<ClimateMessaging country="USA" variant="detailed" />);

      expect(screen.getByText(/June-July temperatures often exceed 85°F/i)).toBeInTheDocument();
      expect(screen.getByText(/Shaded seats provide 10-15°F cooler experience/i)).toBeInTheDocument();
      expect(screen.getByText(/Afternoon matches.*highest sun exposure/i)).toBeInTheDocument();
      expect(screen.getByText(/Stay hydrated and consider sun protection/i)).toBeInTheDocument();
    });

    it('displays all climate tips for Mexico', () => {
      render(<ClimateMessaging country="Mexico" variant="detailed" />);

      expect(screen.getByText(/High altitude increases UV exposure by 8-10%/i)).toBeInTheDocument();
      expect(screen.getByText(/Shade is essential for comfort at 7,000\+ feet/i)).toBeInTheDocument();
      expect(screen.getByText(/Drink extra water due to altitude and heat/i)).toBeInTheDocument();
      expect(screen.getByText(/Sun protection critical even in covered areas/i)).toBeInTheDocument();
    });

    it('displays all climate tips for Canada', () => {
      render(<ClimateMessaging country="Canada" variant="detailed" />);

      expect(screen.getByText(/June-July temperatures typically 65-75°F/i)).toBeInTheDocument();
      expect(screen.getByText(/Shade still improves comfort during sunny days/i)).toBeInTheDocument();
      expect(screen.getByText(/Evening matches may be cooler, bring layers/i)).toBeInTheDocument();
      expect(screen.getByText(/UV exposure still significant in summer months/i)).toBeInTheDocument();
    });

    it('renders climate icon for each country', () => {
      const { container: usaContainer } = render(<ClimateMessaging country="USA" variant="detailed" />);
      expect(usaContainer.textContent).toContain('☀️');

      const { container: mexicoContainer } = render(<ClimateMessaging country="Mexico" variant="detailed" />);
      expect(mexicoContainer.textContent).toContain('🌡️');

      const { container: canadaContainer } = render(<ClimateMessaging country="Canada" variant="detailed" />);
      expect(canadaContainer.textContent).toContain('🌤️');
    });
  });

  describe('CountryClimateGrid Component', () => {
    it('renders climate information for all three countries', () => {
      render(<CountryClimateGrid />);

      expect(screen.getByText('USA Climate Guide')).toBeInTheDocument();
      expect(screen.getByText('Mexico Climate Guide')).toBeInTheDocument();
      expect(screen.getByText('Canada Climate Guide')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(<CountryClimateGrid className="custom-grid-class" />);
      const grid = container.firstChild;

      expect(grid).toHaveClass('custom-grid-class');
    });

    it('uses detailed variant for all countries', () => {
      render(<CountryClimateGrid />);

      // Check that detailed content is present (tips section)
      const whatToKnow = screen.getAllByText(/What to Know:/i);
      expect(whatToKnow).toHaveLength(3); // One for each country
    });
  });

  describe('Utility Functions', () => {
    describe('getClimateSeverityColor', () => {
      it('returns red for USA (high severity)', () => {
        expect(getClimateSeverityColor('USA')).toBe('red');
      });

      it('returns red for Mexico (high severity)', () => {
        expect(getClimateSeverityColor('Mexico')).toBe('red');
      });

      it('returns blue for Canada (low severity)', () => {
        expect(getClimateSeverityColor('Canada')).toBe('blue');
      });
    });

    describe('getClimateMessage', () => {
      it('returns correct message for USA', () => {
        expect(getClimateMessage('USA')).toBe('Summer heat - shade critical for comfort');
      });

      it('returns correct message for Mexico', () => {
        expect(getClimateMessage('Mexico')).toBe('High altitude - intense sun exposure');
      });

      it('returns correct message for Canada', () => {
        expect(getClimateMessage('Canada')).toBe('Mild climate - less sun concern, but still check');
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA role for alerts', () => {
      render(<ClimateMessaging country="USA" variant="compact" />);

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('has proper aria-label for screen readers', () => {
      render(<ClimateMessaging country="USA" variant="compact" />);

      expect(screen.getByLabelText('Climate information for USA')).toBeInTheDocument();
    });

    it('hides decorative icons from screen readers', () => {
      const { container } = render(<ClimateMessaging country="USA" variant="compact" />);
      const icon = container.querySelector('[aria-hidden="true"]');

      expect(icon).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('applies responsive grid classes to CountryClimateGrid', () => {
      const { container } = render(<CountryClimateGrid />);
      const grid = container.firstChild;

      expect(grid).toHaveClass('grid');
      expect(grid).toHaveClass('md:grid-cols-3');
      expect(grid).toHaveClass('gap-6');
    });
  });
});
