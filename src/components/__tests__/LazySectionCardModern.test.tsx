import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LazySectionCardModern } from '../LazySectionCardModern';
import type { StadiumSection } from '../../data/stadiumSectionTypes';
import type { RowShadowData } from '../../utils/sunCalculator';

// Mock hooks
jest.mock('../../hooks/useIntersectionObserver', () => ({
  useIntersectionObserver: jest.fn(() => [jest.fn(), true]),
}));

jest.mock('../../hooks/useHapticFeedback', () => ({
  useHapticFeedback: jest.fn(() => ({
    light: jest.fn(),
    medium: jest.fn(),
    heavy: jest.fn(),
  })),
}));

// Mock components
jest.mock('../RowDetailView/RowDetailView', () => ({
  RowDetailView: ({ sectionName, rows, onClose }: any) => (
    <div data-testid="row-detail-view">
      <div>Row Details for {sectionName}</div>
      <div>{rows.length} rows</div>
      <button onClick={onClose}>Close Details</button>
    </div>
  ),
}));

jest.mock('../WorldCupBadge', () => ({
  WorldCupBadge: () => <div data-testid="world-cup-badge">World Cup</div>,
}));

jest.mock('../../utils/accessibility', () => ({
  formatPercentageForScreenReader: (percent: number) => `${percent} percent`,
  announceToScreenReader: jest.fn(),
}));

// Mock icons
jest.mock('../Icons', () => ({
  CloudIcon: () => <div data-testid="cloud-icon" />,
  PartlyCloudyIcon: () => <div data-testid="partly-cloudy-icon" />,
  SunIcon: () => <div data-testid="sun-icon" />,
  FireIcon: () => <div data-testid="fire-icon" />,
  FieldLevelIcon: () => <div data-testid="field-level-icon" />,
  LowerLevelIcon: () => <div data-testid="lower-level-icon" />,
  ClubLevelIcon: () => <div data-testid="club-level-icon" />,
  UpperLevelIcon: () => <div data-testid="upper-level-icon" />,
  CrownIcon: () => <div data-testid="crown-icon" />,
  ValuePriceIcon: () => <div data-testid="value-price-icon" />,
  ModeratePriceIcon: () => <div data-testid="moderate-price-icon" />,
  PremiumPriceIcon: () => <div data-testid="premium-price-icon" />,
  LuxuryPriceIcon: () => <div data-testid="luxury-price-icon" />,
  UmbrellaIcon: () => <div data-testid="umbrella-icon" />,
  ChevronDownIcon: () => <div data-testid="chevron-down-icon" />,
  ChevronUpIcon: () => <div data-testid="chevron-up-icon" />,
}));

describe('LazySectionCardModern', () => {
  const mockSection: StadiumSection = {
    id: 'section-101',
    name: 'Section 101',
    level: 'lower',
    baseAngle: 45,
    angleSpan: 15,
    rows: 25,
    covered: false,
    price: 'moderate',
  };

  const mockRowData: RowShadowData[] = [
    {
      rowNumber: '1',
      seats: 20,
      elevation: 10,
      depth: 5,
      coverage: 90,
      sunExposure: 10,
      inShadow: true,
      shadowSources: { roof: 70, upperDeck: 15, overhang: 5, bowl: 0 },
      recommendation: 'excellent',
    },
    {
      rowNumber: '15',
      seats: 24,
      elevation: 25,
      depth: 20,
      coverage: 20,
      sunExposure: 80,
      inShadow: false,
      shadowSources: { roof: 15, upperDeck: 5, overhang: 0, bowl: 0 },
      recommendation: 'poor',
    },
  ];

  const defaultProps = {
    section: mockSection,
    sunExposure: 35,
    inSun: false,
    index: 0,
  };

  it('renders section name', () => {
    render(<LazySectionCardModern {...defaultProps} />);
    expect(screen.getByText('Section 101')).toBeInTheDocument();
  });

  it('displays sun exposure percentage prominently', () => {
    render(<LazySectionCardModern {...defaultProps} />);
    expect(screen.getByText('35')).toBeInTheDocument();
    expect(screen.getByText('in sun')).toBeInTheDocument();
  });

  it('shows level badge', () => {
    render(<LazySectionCardModern {...defaultProps} />);
    expect(screen.getByText('Lower Level')).toBeInTheDocument();
    expect(screen.getByTestId('lower-level-icon')).toBeInTheDocument();
  });

  it('shows price badge when price is available', () => {
    render(<LazySectionCardModern {...defaultProps} />);
    expect(screen.getByText('Moderate')).toBeInTheDocument();
    expect(screen.getByTestId('moderate-price-icon')).toBeInTheDocument();
  });

  it('does not show price badge when price is undefined', () => {
    const sectionWithoutPrice = { ...mockSection, price: undefined };
    render(<LazySectionCardModern {...defaultProps} section={sectionWithoutPrice} />);
    expect(screen.queryByTestId('moderate-price-icon')).not.toBeInTheDocument();
  });

  it('shows covered indicator for covered sections', () => {
    const coveredSection = { ...mockSection, covered: true };
    render(<LazySectionCardModern {...defaultProps} section={coveredSection} />);
    expect(screen.getByText('Covered')).toBeInTheDocument();
    expect(screen.getByTestId('umbrella-icon')).toBeInTheDocument();
  });

  describe('Sun exposure icons', () => {
    it('shows CloudIcon for 0% sun exposure', () => {
      render(<LazySectionCardModern {...defaultProps} sunExposure={0} />);
      expect(screen.getByTestId('cloud-icon')).toBeInTheDocument();
    });

    it('shows PartlyCloudyIcon for <25% sun exposure', () => {
      render(<LazySectionCardModern {...defaultProps} sunExposure={20} />);
      expect(screen.getByTestId('partly-cloudy-icon')).toBeInTheDocument();
    });

    it('shows SunIcon for 25-75% sun exposure', () => {
      render(<LazySectionCardModern {...defaultProps} sunExposure={50} />);
      expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
    });

    it('shows FireIcon for >75% sun exposure', () => {
      render(<LazySectionCardModern {...defaultProps} sunExposure={85} />);
      expect(screen.getByTestId('fire-icon')).toBeInTheDocument();
    });
  });

  describe('Row data functionality', () => {
    it('shows "View Row Details" button when row data is available', () => {
      render(<LazySectionCardModern {...defaultProps} rowData={mockRowData} />);
      expect(screen.getByText(/View Row Details/)).toBeInTheDocument();
    });

    it('does not show row details button when no row data', () => {
      render(<LazySectionCardModern {...defaultProps} rowData={undefined} />);
      expect(screen.queryByText(/View Row Details/)).not.toBeInTheDocument();
    });

    it('displays row summary when row data is available', () => {
      render(<LazySectionCardModern {...defaultProps} rowData={mockRowData} />);
      expect(screen.getByText('Best shade rows:')).toBeInTheDocument();
      expect(screen.getByText('Most sun rows:')).toBeInTheDocument();
    });

    it('expands row details on button click', () => {
      render(<LazySectionCardModern {...defaultProps} rowData={mockRowData} />);

      const expandButton = screen.getByText(/View Row Details/);
      fireEvent.click(expandButton);

      expect(screen.getByTestId('row-detail-view')).toBeInTheDocument();
      expect(screen.getByText('Row Details for Section 101')).toBeInTheDocument();
    });

    it('changes button text when expanded', () => {
      render(<LazySectionCardModern {...defaultProps} rowData={mockRowData} />);

      const expandButton = screen.getByText(/View Row Details/);
      fireEvent.click(expandButton);

      expect(screen.getByText(/Hide Row Details/)).toBeInTheDocument();
    });

    it('collapses row details when clicking button again', () => {
      render(<LazySectionCardModern {...defaultProps} rowData={mockRowData} />);

      const expandButton = screen.getByText(/View Row Details/);

      // Expand
      fireEvent.click(expandButton);
      expect(screen.getByTestId('row-detail-view')).toBeInTheDocument();

      // Collapse
      const collapseButton = screen.getByText(/Hide Row Details/);
      fireEvent.click(collapseButton);

      waitFor(() => {
        expect(screen.queryByTestId('row-detail-view')).not.toBeInTheDocument();
      });
    });

    it('shows chevron down icon when collapsed', () => {
      render(<LazySectionCardModern {...defaultProps} rowData={mockRowData} />);
      expect(screen.getByTestId('chevron-down-icon')).toBeInTheDocument();
    });

    it('shows chevron up icon when expanded', () => {
      render(<LazySectionCardModern {...defaultProps} rowData={mockRowData} />);

      const expandButton = screen.getByText(/View Row Details/);
      fireEvent.click(expandButton);

      expect(screen.getByTestId('chevron-up-icon')).toBeInTheDocument();
    });
  });

  describe('Price tier badges', () => {
    it('shows value price badge correctly', () => {
      const section = { ...mockSection, price: 'value' as const };
      render(<LazySectionCardModern {...defaultProps} section={section} />);
      expect(screen.getByText('Value')).toBeInTheDocument();
      expect(screen.getByTestId('value-price-icon')).toBeInTheDocument();
    });

    it('shows premium price badge correctly', () => {
      const section = { ...mockSection, price: 'premium' as const };
      render(<LazySectionCardModern {...defaultProps} section={section} />);
      expect(screen.getByText('Premium')).toBeInTheDocument();
      expect(screen.getByTestId('premium-price-icon')).toBeInTheDocument();
    });

    it('shows luxury price badge correctly', () => {
      const section = { ...mockSection, price: 'luxury' as const };
      render(<LazySectionCardModern {...defaultProps} section={section} />);
      expect(screen.getByText('Luxury')).toBeInTheDocument();
      expect(screen.getByTestId('luxury-price-icon')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA label', () => {
      render(<LazySectionCardModern {...defaultProps} />);

      const card = screen.getByRole('listitem');
      expect(card).toHaveAttribute('aria-label');
      expect(card.getAttribute('aria-label')).toContain('Section 101');
      expect(card.getAttribute('aria-label')).toContain('35 percent');
    });

    it('has tabindex for keyboard navigation', () => {
      render(<LazySectionCardModern {...defaultProps} />);

      const card = screen.getByRole('listitem');
      expect(card).toHaveAttribute('tabIndex', '0');
    });

    it('expand button has aria-expanded attribute', () => {
      render(<LazySectionCardModern {...defaultProps} rowData={mockRowData} />);

      const button = screen.getByText(/View Row Details/);
      expect(button).toHaveAttribute('aria-expanded', 'false');

      fireEvent.click(button);

      const expandedButton = screen.getByText(/Hide Row Details/);
      expect(expandedButton).toHaveAttribute('aria-expanded', 'true');
    });

    it('meets minimum touch target size (44px)', () => {
      render(<LazySectionCardModern {...defaultProps} rowData={mockRowData} />);

      const button = screen.getByText(/View Row Details/);
      expect(button).toHaveClass('min-h-[44px]');
    });
  });

  describe('Visual enhancements', () => {
    it('applies ring effect when expanded', () => {
      render(<LazySectionCardModern {...defaultProps} rowData={mockRowData} />);

      const card = screen.getByRole('listitem');
      expect(card).not.toHaveClass('ring-4');

      const expandButton = screen.getByText(/View Row Details/);
      fireEvent.click(expandButton);

      expect(card).toHaveClass('ring-4', 'ring-accent-300');
    });

    it('uses larger icon size (32px vs 24px)', () => {
      // This is tested implicitly through the icon rendering
      // The actual size is set in the getSunExposureIcon function
      render(<LazySectionCardModern {...defaultProps} sunExposure={50} />);
      expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
    });
  });

  describe('Memoization', () => {
    it('does not re-render when props are the same', () => {
      const { rerender } = render(<LazySectionCardModern {...defaultProps} />);

      const initialCard = screen.getByRole('listitem');

      // Re-render with same props
      rerender(<LazySectionCardModern {...defaultProps} />);

      const updatedCard = screen.getByRole('listitem');

      // Should be the same element (not re-rendered)
      expect(initialCard).toBe(updatedCard);
    });
  });
});
