import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DataFreshness } from '../DataFreshness';

describe('DataFreshness Component', () => {
  describe('Rendering', () => {
    it('should render with current data (less than 1 year old)', () => {
      const recentDate = new Date();
      recentDate.setMonth(recentDate.getMonth() - 6); // 6 months ago
      const dateString = recentDate.toISOString().split('T')[0];

      render(<DataFreshness lastUpdated={dateString} />);

      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByText(/Data is current/i)).toBeInTheDocument();
      expect(screen.getByText(/Last updated:/i)).toBeInTheDocument();
    });

    it('should render warning for stale data (1-2 years old)', () => {
      const staleDate = new Date();
      staleDate.setFullYear(staleDate.getFullYear() - 1, staleDate.getMonth() - 3); // 15 months ago
      const dateString = staleDate.toISOString().split('T')[0];

      render(<DataFreshness lastUpdated={dateString} />);

      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByText(/Data needs review/i)).toBeInTheDocument();
      expect(screen.getByText(/over 1 year old/i)).toBeInTheDocument();
    });

    it('should render error for outdated data (over 2 years old)', () => {
      const outdatedDate = new Date();
      outdatedDate.setFullYear(outdatedDate.getFullYear() - 3); // 3 years ago
      const dateString = outdatedDate.toISOString().split('T')[0];

      render(<DataFreshness lastUpdated={dateString} />);

      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByText(/Data may be outdated/i)).toBeInTheDocument();
      expect(screen.getByText(/over 2 years old/i)).toBeInTheDocument();
    });

    it('should render alert when no lastUpdated provided', () => {
      render(<DataFreshness />);

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText(/Data update date unavailable/i)).toBeInTheDocument();
    });
  });

  describe('Report Link', () => {
    it('should show report link by default for stale data', () => {
      const staleDate = new Date();
      staleDate.setFullYear(staleDate.getFullYear() - 1, staleDate.getMonth() - 3);
      const dateString = staleDate.toISOString().split('T')[0];

      render(<DataFreshness lastUpdated={dateString} />);

      const reportButton = screen.getByRole('button', { name: /Report an inaccuracy/i });
      expect(reportButton).toBeInTheDocument();
    });

    it('should hide report link when showReportLink is false', () => {
      const staleDate = new Date();
      staleDate.setFullYear(staleDate.getFullYear() - 1, staleDate.getMonth() - 3);
      const dateString = staleDate.toISOString().split('T')[0];

      render(<DataFreshness lastUpdated={dateString} showReportLink={false} />);

      expect(screen.queryByRole('button', { name: /Report an inaccuracy/i })).not.toBeInTheDocument();
    });

    it('should not show report link for current data', () => {
      const recentDate = new Date();
      recentDate.setMonth(recentDate.getMonth() - 3);
      const dateString = recentDate.toISOString().split('T')[0];

      render(<DataFreshness lastUpdated={dateString} />);

      expect(screen.queryByRole('button', { name: /Report an inaccuracy/i })).not.toBeInTheDocument();
    });

    it('should call onReportClick when report button is clicked', () => {
      const mockReportClick = jest.fn();
      const staleDate = new Date();
      staleDate.setFullYear(staleDate.getFullYear() - 1, staleDate.getMonth() - 3);
      const dateString = staleDate.toISOString().split('T')[0];

      render(<DataFreshness lastUpdated={dateString} onReportClick={mockReportClick} />);

      const reportButton = screen.getByRole('button', { name: /Report an inaccuracy/i });
      reportButton.click();

      expect(mockReportClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Stadium Name', () => {
    it('should include stadium name in aria-label when provided', () => {
      const staleDate = new Date();
      staleDate.setFullYear(staleDate.getFullYear() - 1, staleDate.getMonth() - 3);
      const dateString = staleDate.toISOString().split('T')[0];

      render(<DataFreshness lastUpdated={dateString} stadiumName="Yankee Stadium" />);

      const reportButton = screen.getByRole('button', { name: /Report inaccuracy for Yankee Stadium/i });
      expect(reportButton).toBeInTheDocument();
    });
  });

  describe('Styling and Accessibility', () => {
    it('should apply custom className', () => {
      const recentDate = new Date();
      recentDate.setMonth(recentDate.getMonth() - 3);
      const dateString = recentDate.toISOString().split('T')[0];

      const { container } = render(<DataFreshness lastUpdated={dateString} className="custom-class" />);

      const element = container.firstChild as HTMLElement;
      expect(element).toHaveClass('custom-class');
    });

    it('should have appropriate ARIA attributes', () => {
      const recentDate = new Date();
      recentDate.setMonth(recentDate.getMonth() - 3);
      const dateString = recentDate.toISOString().split('T')[0];

      render(<DataFreshness lastUpdated={dateString} />);

      const statusElement = screen.getByRole('status');
      expect(statusElement).toHaveAttribute('aria-live', 'polite');
    });

    it('should render icon with aria-hidden', () => {
      const recentDate = new Date();
      recentDate.setMonth(recentDate.getMonth() - 3);
      const dateString = recentDate.toISOString().split('T')[0];

      const { container } = render(<DataFreshness lastUpdated={dateString} />);

      const icon = container.querySelector('svg');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Date Formatting', () => {
    it('should format date correctly', () => {
      const testDate = new Date('2024-01-15');
      const dateString = testDate.toISOString().split('T')[0];

      render(<DataFreshness lastUpdated={dateString} />);

      expect(screen.getByText(/January 15, 2024/i)).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle invalid date format gracefully', () => {
      // Component should not crash with invalid date
      expect(() => {
        render(<DataFreshness lastUpdated="invalid-date" />);
      }).not.toThrow();
    });

    it('should handle empty string', () => {
      render(<DataFreshness lastUpdated="" />);

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('should handle future date', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const dateString = futureDate.toISOString().split('T')[0];

      render(<DataFreshness lastUpdated={dateString} />);

      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByText(/Data is current/i)).toBeInTheDocument();
    });
  });
});
