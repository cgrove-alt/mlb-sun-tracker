import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RowDetailView } from '../RowDetailView';
import type { RowShadowData } from '../../../utils/sunCalculator';

// Mock dependencies
jest.mock('../../Icons', () => ({
  CloudIcon: ({ size }: { size: number }) => <div data-testid="cloud-icon" data-size={size} />,
  PartlyCloudyIcon: ({ size }: { size: number }) => (
    <div data-testid="partly-cloudy-icon" data-size={size} />
  ),
  SunIcon: ({ size, color }: { size: number; color?: string }) => (
    <div data-testid="sun-icon" data-size={size} data-color={color} />
  ),
  FireIcon: ({ size, color }: { size: number; color?: string }) => (
    <div data-testid="fire-icon" data-size={size} data-color={color} />
  ),
  ChevronDownIcon: ({ size }: { size: number }) => (
    <div data-testid="chevron-down-icon" data-size={size} />
  ),
  ChevronUpIcon: ({ size }: { size: number }) => (
    <div data-testid="chevron-up-icon" data-size={size} />
  ),
}));

jest.mock('../ShadeTimeline', () => ({
  ShadeTimeline: ({ overallShade }: { overallShade: number }) => (
    <div data-testid="shade-timeline">Timeline with {overallShade}% shade</div>
  ),
}));

describe('RowDetailView', () => {
  const mockRows: RowShadowData[] = [
    {
      rowNumber: '1',
      seats: 20,
      elevation: 10,
      depth: 5,
      coverage: 95,
      sunExposure: 5,
      inShadow: true,
      shadowSources: { roof: 80, upperDeck: 10, overhang: 5, bowl: 0 },
      recommendation: 'excellent',
    },
    {
      rowNumber: '5',
      seats: 22,
      elevation: 15,
      depth: 10,
      coverage: 70,
      sunExposure: 30,
      inShadow: true,
      shadowSources: { roof: 50, upperDeck: 15, overhang: 5, bowl: 0 },
      recommendation: 'good',
    },
    {
      rowNumber: '10',
      seats: 24,
      elevation: 20,
      depth: 15,
      coverage: 45,
      sunExposure: 55,
      inShadow: false,
      shadowSources: { roof: 30, upperDeck: 10, overhang: 5, bowl: 0 },
      recommendation: 'fair',
    },
    {
      rowNumber: '15',
      seats: 26,
      elevation: 25,
      depth: 20,
      coverage: 15,
      sunExposure: 85,
      inShadow: false,
      shadowSources: { roof: 10, upperDeck: 5, overhang: 0, bowl: 0 },
      recommendation: 'poor',
    },
  ];

  const defaultProps = {
    sectionId: 'section-101',
    sectionName: 'Section 101',
    rows: mockRows,
  };

  it('renders without crashing', () => {
    render(<RowDetailView {...defaultProps} />);
    expect(screen.getByText('Row Details - Section 101')).toBeInTheDocument();
  });

  it('displays correct row count', () => {
    render(<RowDetailView {...defaultProps} />);
    expect(screen.getByText('4 of 4 rows')).toBeInTheDocument();
  });

  it('shows best shade rows summary', () => {
    render(<RowDetailView {...defaultProps} />);
    expect(screen.getByText('🏆 Best Shade Rows')).toBeInTheDocument();
    expect(screen.getByText('#1 Row 1')).toBeInTheDocument();
    expect(screen.getByText('95% shade')).toBeInTheDocument();
  });

  it('shows most sun rows summary', () => {
    render(<RowDetailView {...defaultProps} />);
    expect(screen.getByText('☀️ Most Sun Rows')).toBeInTheDocument();
    expect(screen.getByText('#1 Row 15')).toBeInTheDocument();
    expect(screen.getByText('15% shade')).toBeInTheDocument();
  });

  it('displays shade timeline by default', () => {
    render(<RowDetailView {...defaultProps} />);
    expect(screen.getByTestId('shade-timeline')).toBeInTheDocument();
  });

  it('toggles shade timeline on button click', () => {
    render(<RowDetailView {...defaultProps} />);

    const toggleButton = screen.getByRole('button', { name: /shade throughout game/i });

    // Timeline should be visible initially
    expect(screen.getByTestId('shade-timeline')).toBeInTheDocument();
    expect(toggleButton).toHaveAttribute('aria-expanded', 'true');

    // Click to hide
    fireEvent.click(toggleButton);
    expect(screen.queryByTestId('shade-timeline')).not.toBeInTheDocument();
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');

    // Click to show again
    fireEvent.click(toggleButton);
    expect(screen.getByTestId('shade-timeline')).toBeInTheDocument();
  });

  describe('Filtering', () => {
    it('filters rows by recommendation', () => {
      render(<RowDetailView {...defaultProps} />);

      const filterSelect = screen.getByLabelText(/filter rows by recommendation/i);

      // Filter to excellent only
      fireEvent.change(filterSelect, { target: { value: 'excellent' } });

      // Should show 1 of 4 rows
      expect(screen.getByText('1 of 4 rows')).toBeInTheDocument();
    });

    it('shows all rows when filter is set to "all"', () => {
      render(<RowDetailView {...defaultProps} />);

      const filterSelect = screen.getByLabelText(/filter rows by recommendation/i);

      fireEvent.change(filterSelect, { target: { value: 'all' } });

      expect(screen.getByText('4 of 4 rows')).toBeInTheDocument();
    });

    it('shows empty state when no rows match filter', () => {
      const singleRowData = [mockRows[0]]; // Only one excellent row
      render(<RowDetailView {...defaultProps} rows={singleRowData} />);

      const filterSelect = screen.getByLabelText(/filter rows by recommendation/i);

      // Filter to poor (no matches)
      fireEvent.change(filterSelect, { target: { value: 'poor' } });

      expect(screen.getByText('No rows match the selected filter.')).toBeInTheDocument();
      expect(screen.getByText('Clear filter')).toBeInTheDocument();
    });

    it('can clear filter from empty state', () => {
      const singleRowData = [mockRows[0]];
      render(<RowDetailView {...defaultProps} rows={singleRowData} />);

      const filterSelect = screen.getByLabelText(/filter rows by recommendation/i);

      // Filter to poor (no matches)
      fireEvent.change(filterSelect, { target: { value: 'poor' } });

      // Click clear filter button
      const clearButton = screen.getByText('Clear filter');
      fireEvent.click(clearButton);

      expect(screen.getByText('1 of 1 rows')).toBeInTheDocument();
    });
  });

  describe('Sorting', () => {
    it('sorts by row number ascending by default', () => {
      render(<RowDetailView {...defaultProps} />);

      // Get all row labels in mobile view
      const rowLabels = screen.getAllByText(/^Row \d+$/);
      expect(rowLabels[0]).toHaveTextContent('Row 1');
      expect(rowLabels[rowLabels.length - 1]).toHaveTextContent('Row 15');
    });

    it('sorts by coverage when coverage header clicked', () => {
      render(<RowDetailView {...defaultProps} />);

      const coverageButton = screen.getByRole('button', { name: /sort by shade coverage/i });
      fireEvent.click(coverageButton);

      // After sorting by coverage ascending, Row 15 (15% coverage) should be first
      const rowLabels = screen.getAllByText(/^Row \d+$/);
      expect(rowLabels[0]).toHaveTextContent('Row 15');
    });

    it('toggles sort direction on repeated clicks', () => {
      render(<RowDetailView {...defaultProps} />);

      const rowButton = screen.getByRole('button', { name: /sort by row/i });

      // First click: descending
      fireEvent.click(rowButton);
      let rowLabels = screen.getAllByText(/^Row \d+$/);
      expect(rowLabels[0]).toHaveTextContent('Row 15');

      // Second click: ascending again
      fireEvent.click(rowButton);
      rowLabels = screen.getAllByText(/^Row \d+$/);
      expect(rowLabels[0]).toHaveTextContent('Row 1');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      render(<RowDetailView {...defaultProps} />);

      expect(screen.getByLabelText(/filter rows by recommendation/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sort by row/i })).toBeInTheDocument();
    });

    it('displays recommendation badges with proper text', () => {
      render(<RowDetailView {...defaultProps} />);

      expect(screen.getByText('⭐ Excellent')).toBeInTheDocument();
      expect(screen.getByText('👍 Good')).toBeInTheDocument();
      expect(screen.getByText('👌 Fair')).toBeInTheDocument();
      expect(screen.getByText('⚠️ Poor')).toBeInTheDocument();
    });
  });

  describe('onClose callback', () => {
    it('calls onClose when close button clicked', () => {
      const onClose = jest.fn();
      render(<RowDetailView {...defaultProps} onClose={onClose} />);

      const closeButton = screen.getByRole('button', { name: /close row details/i });
      fireEvent.click(closeButton);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not render close button when onClose not provided', () => {
      render(<RowDetailView {...defaultProps} onClose={undefined} />);

      expect(screen.queryByRole('button', { name: /close row details/i })).not.toBeInTheDocument();
    });
  });

  describe('Coverage Icons', () => {
    it('displays correct icons based on coverage percentage', () => {
      render(<RowDetailView {...defaultProps} />);

      // Row 1: 95% coverage -> CloudIcon
      // Row 5: 70% coverage -> PartlyCloudyIcon
      // Row 10: 45% coverage -> SunIcon
      // Row 15: 15% coverage -> FireIcon

      expect(screen.getAllByTestId('cloud-icon').length).toBeGreaterThan(0);
      expect(screen.getAllByTestId('partly-cloudy-icon').length).toBeGreaterThan(0);
      expect(screen.getAllByTestId('sun-icon').length).toBeGreaterThan(0);
      expect(screen.getAllByTestId('fire-icon').length).toBeGreaterThan(0);
    });
  });

  describe('Responsive behavior', () => {
    it('renders both desktop table and mobile cards', () => {
      render(<RowDetailView {...defaultProps} />);

      // Desktop table should have class "hidden md:block"
      const table = screen.getByRole('table');
      expect(table.parentElement).toHaveClass('hidden', 'md:block');

      // Mobile cards container should have class "md:hidden"
      const mobileContainer = screen.getByText(/^Row 1$/).closest('.md\\:hidden');
      expect(mobileContainer).toBeInTheDocument();
    });
  });
});
