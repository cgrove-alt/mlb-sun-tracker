import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MobileFilterSheet } from '../MobileFilterSheet';
import { SeatingSectionSun } from '../../utils/sunCalculations';

describe('MobileFilterSheet', () => {
  const mockOnFilterChange = jest.fn();
  const mockSections: SeatingSectionSun[] = [
    {
      section: {
        id: 'section-1',
        name: 'Section 1',
        level: 'lower',
        price: 'moderate',
        baseAngle: 0,
        angleSpan: 10,
        covered: false
      },
      sunExposure: 30,
      inSun: true,
      timeInSun: 54
    },
    {
      section: {
        id: 'section-2',
        name: 'Section 2',
        level: 'upper',
        price: 'value',
        baseAngle: 90,
        angleSpan: 10,
        covered: false
      },
      sunExposure: 70,
      inSun: true,
      timeInSun: 126
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders filter trigger button', () => {
    render(
      <MobileFilterSheet
        onFilterChange={mockOnFilterChange}
        currentFilters={{}}
        resultCount={2}
        allSections={mockSections}
      />
    );

    expect(screen.getByText('Filters')).toBeInTheDocument();
  });

  it('has accessible touch target for trigger button (≥44px)', () => {
    render(
      <MobileFilterSheet
        onFilterChange={mockOnFilterChange}
        currentFilters={{}}
        resultCount={2}
        allSections={mockSections}
      />
    );

    const trigger = screen.getByLabelText('Open filters');
    const styles = window.getComputedStyle(trigger);
    const minHeight = parseInt(styles.minHeight);

    expect(minHeight).toBeGreaterThanOrEqual(44);
  });

  it('opens filter sheet when trigger is clicked', async () => {
    render(
      <MobileFilterSheet
        onFilterChange={mockOnFilterChange}
        currentFilters={{}}
        resultCount={2}
        allSections={mockSections}
      />
    );

    const trigger = screen.getByLabelText('Open filters');
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('Filter Sections')).toBeInTheDocument();
    });
  });

  it('has accessible touch targets for all buttons (≥44px)', async () => {
    render(
      <MobileFilterSheet
        onFilterChange={mockOnFilterChange}
        currentFilters={{}}
        resultCount={2}
        allSections={mockSections}
      />
    );

    const trigger = screen.getByLabelText('Open filters');
    fireEvent.click(trigger);

    await waitFor(() => {
      const closeBtn = screen.getByLabelText('Close filters');
      const styles = window.getComputedStyle(closeBtn);
      expect(parseInt(styles.minHeight) || parseInt(styles.height)).toBeGreaterThanOrEqual(44);

      const applyBtn = screen.getByText(/Show \d+ Sections/);
      const applyStyles = window.getComputedStyle(applyBtn);
      expect(parseInt(applyStyles.minHeight)).toBeGreaterThanOrEqual(44);

      const resetBtn = screen.getByText('Reset');
      const resetStyles = window.getComputedStyle(resetBtn);
      expect(parseInt(resetStyles.minHeight)).toBeGreaterThanOrEqual(44);
    });
  });

  it('supports swipe-to-close gesture', async () => {
    render(
      <MobileFilterSheet
        onFilterChange={mockOnFilterChange}
        currentFilters={{}}
        resultCount={2}
        allSections={mockSections}
      />
    );

    const trigger = screen.getByLabelText('Open filters');
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('Filter Sections')).toBeInTheDocument();
    });

    const filterContent = document.querySelector('.mobile-filter-content');
    expect(filterContent).toBeInTheDocument();

    // Simulate swipe down gesture
    fireEvent.touchStart(filterContent!, { targetTouches: [{ clientY: 100 }] });
    fireEvent.touchMove(filterContent!, { targetTouches: [{ clientY: 250 }] });
    fireEvent.touchEnd(filterContent!);

    // Sheet should close after swipe down > 100px
    await waitFor(() => {
      expect(screen.queryByText('Filter Sections')).not.toBeInTheDocument();
    });
  });

  it('applies filters correctly', async () => {
    render(
      <MobileFilterSheet
        onFilterChange={mockOnFilterChange}
        currentFilters={{}}
        resultCount={2}
        allSections={mockSections}
      />
    );

    const trigger = screen.getByLabelText('Open filters');
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('Filter Sections')).toBeInTheDocument();
    });

    // Select shade preference
    const shadeOption = screen.getByText('More shade (≤20% of game)');
    fireEvent.click(shadeOption.closest('label')!);

    const applyBtn = screen.getByText(/Show \d+ Sections/);
    fireEvent.click(applyBtn);

    expect(mockOnFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({
        sunPreference: 'shade'
      })
    );
  });

  it('shows active filter count badge', () => {
    render(
      <MobileFilterSheet
        onFilterChange={mockOnFilterChange}
        currentFilters={{ sunPreference: 'shade', maxSunExposure: 30 }}
        resultCount={1}
        allSections={mockSections}
      />
    );

    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('has fast animation (≤200ms)', async () => {
    render(
      <MobileFilterSheet
        onFilterChange={mockOnFilterChange}
        currentFilters={{}}
        resultCount={2}
        allSections={mockSections}
      />
    );

    const trigger = screen.getByLabelText('Open filters');
    fireEvent.click(trigger);

    await waitFor(() => {
      const filterContent = document.querySelector('.mobile-filter-content');
      expect(filterContent).toBeInTheDocument();

      // Check animation duration from CSS
      const styles = window.getComputedStyle(filterContent!);
      const animationDuration = styles.animationDuration;

      // Should be 0.2s or less
      expect(parseFloat(animationDuration)).toBeLessThanOrEqual(0.2);
    });
  });
});
