import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SectionComparison } from '../SectionComparison';
import { SeatingSectionSun } from '../../../utils/sunCalculations';

// Mock useHapticFeedback hook
jest.mock('../../../hooks/useHapticFeedback', () => ({
  useHapticFeedback: () => ({
    light: jest.fn(),
    medium: jest.fn(),
    heavy: jest.fn(),
  }),
}));

const mockSections: SeatingSectionSun[] = [
  {
    section: {
      id: 'section-1',
      name: '101',
      level: 'lower',
      baseAngle: 0,
      angleSpan: 10,
      covered: false,
      price: 'value',
      rows: 20,
    },
    sunExposure: 25,
    inSun: true,
    timeInSun: 45,
  },
  {
    section: {
      id: 'section-2',
      name: '201',
      level: 'upper',
      baseAngle: 90,
      angleSpan: 10,
      covered: true,
      price: 'moderate',
      rows: 25,
    },
    sunExposure: 0,
    inSun: false,
    timeInSun: 0,
  },
  {
    section: {
      id: 'section-3',
      name: '301',
      level: 'club',
      baseAngle: 180,
      angleSpan: 10,
      covered: false,
      price: 'premium',
      rows: 15,
    },
    sunExposure: 75,
    inSun: true,
    timeInSun: 120,
  },
];

describe('SectionComparison', () => {
  const mockOnClose = jest.fn();
  const mockOnRemoveSection = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock window.innerWidth for desktop by default
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  describe('Rendering', () => {
    it('renders comparison modal with correct title', () => {
      render(
        <SectionComparison
          selectedSections={mockSections}
          onClose={mockOnClose}
          onRemoveSection={mockOnRemoveSection}
        />
      );

      expect(screen.getByText(`Compare Sections (${mockSections.length})`)).toBeInTheDocument();
    });

    it('renders all selected sections in desktop view', () => {
      render(
        <SectionComparison
          selectedSections={mockSections}
          onClose={mockOnClose}
          onRemoveSection={mockOnRemoveSection}
        />
      );

      expect(screen.getByText('Section 101')).toBeInTheDocument();
      expect(screen.getByText('Section 201')).toBeInTheDocument();
      expect(screen.getByText('Section 301')).toBeInTheDocument();
    });

    it('displays close button', () => {
      render(
        <SectionComparison
          selectedSections={mockSections}
          onClose={mockOnClose}
          onRemoveSection={mockOnRemoveSection}
        />
      );

      const closeButton = screen.getByLabelText('Close comparison');
      expect(closeButton).toBeInTheDocument();
    });

    it('shows tips section', () => {
      render(
        <SectionComparison
          selectedSections={mockSections}
          onClose={mockOnClose}
          onRemoveSection={mockOnRemoveSection}
        />
      );

      expect(screen.getByText(/Sections with badges indicate the best value/i)).toBeInTheDocument();
    });
  });

  describe('Desktop View', () => {
    it('renders grid layout on desktop', () => {
      const { container } = render(
        <SectionComparison
          selectedSections={mockSections}
          onClose={mockOnClose}
          onRemoveSection={mockOnRemoveSection}
        />
      );

      const grid = container.querySelector('.comparison-grid');
      expect(grid).toBeInTheDocument();
    });

    it('does not render mobile controls on desktop', () => {
      const { container } = render(
        <SectionComparison
          selectedSections={mockSections}
          onClose={mockOnClose}
          onRemoveSection={mockOnRemoveSection}
        />
      );

      const mobileNav = container.querySelector('.comparison-mobile-nav');
      expect(mobileNav).not.toBeInTheDocument();
    });
  });

  describe('Mobile View', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
    });

    it('renders mobile swipe view on small screens', async () => {
      const { container } = render(
        <SectionComparison
          selectedSections={mockSections}
          onClose={mockOnClose}
          onRemoveSection={mockOnRemoveSection}
        />
      );

      await waitFor(() => {
        const mobileContainer = container.querySelector('.comparison-mobile-container');
        expect(mobileContainer).toBeInTheDocument();
      });
    });

    it('displays navigation dots', async () => {
      const { container } = render(
        <SectionComparison
          selectedSections={mockSections}
          onClose={mockOnClose}
          onRemoveSection={mockOnRemoveSection}
        />
      );

      await waitFor(() => {
        const dots = container.querySelectorAll('.comparison-dot');
        expect(dots).toHaveLength(mockSections.length);
      });
    });

    it('shows position indicator text', async () => {
      render(
        <SectionComparison
          selectedSections={mockSections}
          onClose={mockOnClose}
          onRemoveSection={mockOnRemoveSection}
        />
      );

      await waitFor(() => {
        expect(screen.getByText(`Section 1 of ${mockSections.length}`)).toBeInTheDocument();
      });
    });
  });

  describe('Interactions', () => {
    it('calls onClose when close button is clicked', () => {
      render(
        <SectionComparison
          selectedSections={mockSections}
          onClose={mockOnClose}
          onRemoveSection={mockOnRemoveSection}
        />
      );

      const closeButton = screen.getByLabelText('Close comparison');
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when Escape key is pressed', () => {
      render(
        <SectionComparison
          selectedSections={mockSections}
          onClose={mockOnClose}
          onRemoveSection={mockOnRemoveSection}
        />
      );

      fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('calls onRemoveSection when remove button is clicked', () => {
      render(
        <SectionComparison
          selectedSections={mockSections}
          onClose={mockOnClose}
          onRemoveSection={mockOnRemoveSection}
        />
      );

      const removeButtons = screen.getAllByLabelText(/Remove section/i);
      fireEvent.click(removeButtons[0]);

      expect(mockOnRemoveSection).toHaveBeenCalledWith('section-1');
    });
  });

  describe('Best Value Badges', () => {
    it('displays "Best Shade" badge for section with lowest sun exposure', () => {
      render(
        <SectionComparison
          selectedSections={mockSections}
          onClose={mockOnClose}
          onRemoveSection={mockOnRemoveSection}
        />
      );

      // Section 201 has 0% sun exposure
      expect(screen.getByText('Most Shade')).toBeInTheDocument();
    });

    it('displays "Best Price" badge for value-priced section', () => {
      render(
        <SectionComparison
          selectedSections={mockSections}
          onClose={mockOnClose}
          onRemoveSection={mockOnRemoveSection}
        />
      );

      // Section 101 has "value" price
      expect(screen.getByText('Best Price')).toBeInTheDocument();
    });

    it('displays "Best Value" badge for optimal combination', () => {
      render(
        <SectionComparison
          selectedSections={mockSections}
          onClose={mockOnClose}
          onRemoveSection={mockOnRemoveSection}
        />
      );

      expect(screen.getByText('Best Value')).toBeInTheDocument();
    });
  });

  describe('Section Details', () => {
    it('displays sun exposure percentage for each section', () => {
      render(
        <SectionComparison
          selectedSections={mockSections}
          onClose={mockOnClose}
          onRemoveSection={mockOnRemoveSection}
        />
      );

      expect(screen.getByText('25%')).toBeInTheDocument();
      expect(screen.getByText('0%')).toBeInTheDocument();
      expect(screen.getByText('75%')).toBeInTheDocument();
    });

    it('displays seating level for each section', () => {
      render(
        <SectionComparison
          selectedSections={mockSections}
          onClose={mockOnClose}
          onRemoveSection={mockOnRemoveSection}
        />
      );

      expect(screen.getByText('Lower Bowl')).toBeInTheDocument();
      expect(screen.getByText('Upper Deck')).toBeInTheDocument();
      expect(screen.getByText('Club Level')).toBeInTheDocument();
    });

    it('displays price range for each section', () => {
      render(
        <SectionComparison
          selectedSections={mockSections}
          onClose={mockOnClose}
          onRemoveSection={mockOnRemoveSection}
        />
      );

      expect(screen.getByText('Value')).toBeInTheDocument();
      expect(screen.getByText('Moderate')).toBeInTheDocument();
      expect(screen.getByText('Premium')).toBeInTheDocument();
    });

    it('shows covered status correctly', () => {
      render(
        <SectionComparison
          selectedSections={mockSections}
          onClose={mockOnClose}
          onRemoveSection={mockOnRemoveSection}
        />
      );

      const coveredElements = screen.getAllByText('✓ Covered');
      expect(coveredElements).toHaveLength(1); // Only section-2 is covered
    });
  });

  describe('Edge Cases', () => {
    it('returns null when no sections are selected', () => {
      const { container } = render(
        <SectionComparison
          selectedSections={[]}
          onClose={mockOnClose}
          onRemoveSection={mockOnRemoveSection}
        />
      );

      expect(container.firstChild).toBeNull();
    });

    it('handles two sections correctly', () => {
      const twoSections = mockSections.slice(0, 2);
      render(
        <SectionComparison
          selectedSections={twoSections}
          onClose={mockOnClose}
          onRemoveSection={mockOnRemoveSection}
        />
      );

      expect(screen.getByText('Compare Sections (2)')).toBeInTheDocument();
    });

    it('handles four sections correctly', () => {
      const fourSections = [
        ...mockSections,
        {
          section: {
            id: 'section-4',
            name: '401',
            level: 'suite',
            baseAngle: 270,
            angleSpan: 10,
            covered: true,
            price: 'luxury',
          },
          sunExposure: 10,
          inSun: true,
          timeInSun: 15,
        },
      ] as SeatingSectionSun[];

      render(
        <SectionComparison
          selectedSections={fourSections}
          onClose={mockOnClose}
          onRemoveSection={mockOnRemoveSection}
        />
      );

      expect(screen.getByText('Compare Sections (4)')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(
        <SectionComparison
          selectedSections={mockSections}
          onClose={mockOnClose}
          onRemoveSection={mockOnRemoveSection}
        />
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAttribute('aria-labelledby', 'comparison-title');
    });

    it('close button has proper aria-label', () => {
      render(
        <SectionComparison
          selectedSections={mockSections}
          onClose={mockOnClose}
          onRemoveSection={mockOnRemoveSection}
        />
      );

      expect(screen.getByLabelText('Close comparison')).toBeInTheDocument();
    });

    it('remove buttons have descriptive aria-labels', () => {
      render(
        <SectionComparison
          selectedSections={mockSections}
          onClose={mockOnClose}
          onRemoveSection={mockOnRemoveSection}
        />
      );

      expect(screen.getByLabelText('Remove section 101 from comparison')).toBeInTheDocument();
      expect(screen.getByLabelText('Remove section 201 from comparison')).toBeInTheDocument();
      expect(screen.getByLabelText('Remove section 301 from comparison')).toBeInTheDocument();
    });
  });
});
