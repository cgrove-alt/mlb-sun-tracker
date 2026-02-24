import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FilterPresets, FILTER_PRESETS } from '../FilterPresets';
import { SectionFilterValues } from '../../SectionFilters/SectionFilters';

describe('FilterPresets', () => {
  const mockOnPresetSelect = jest.fn();
  const defaultFilters: SectionFilterValues = {
    maxSunExposure: undefined,
    sectionType: [],
    priceRange: []
  };

  beforeEach(() => {
    mockOnPresetSelect.mockClear();
  });

  describe('Rendering', () => {
    it('renders all 4 preset buttons', () => {
      render(
        <FilterPresets
          currentFilters={defaultFilters}
          onPresetSelect={mockOnPresetSelect}
        />
      );

      expect(screen.getByText('Maximum Shade')).toBeInTheDocument();
      expect(screen.getByText('Budget Friendly')).toBeInTheDocument();
      expect(screen.getByText('Close & Shaded')).toBeInTheDocument();
      expect(screen.getByText('Accessible')).toBeInTheDocument();
    });

    it('displays preset descriptions', () => {
      render(
        <FilterPresets
          currentFilters={defaultFilters}
          onPresetSelect={mockOnPresetSelect}
        />
      );

      expect(screen.getByText('Best shaded seats, covered preferred')).toBeInTheDocument();
      expect(screen.getByText('Value seats with good shade')).toBeInTheDocument();
      expect(screen.getByText('Field/lower level with minimal sun')).toBeInTheDocument();
      expect(screen.getByText('Accessible sections, moderate shade')).toBeInTheDocument();
    });

    it('displays preset icons', () => {
      render(
        <FilterPresets
          currentFilters={defaultFilters}
          onPresetSelect={mockOnPresetSelect}
        />
      );

      expect(screen.getByText('☁️')).toBeInTheDocument();
      expect(screen.getByText('💰')).toBeInTheDocument();
      expect(screen.getByText('🎯')).toBeInTheDocument();
      expect(screen.getByText('♿')).toBeInTheDocument();
    });
  });

  describe('Preset Selection', () => {
    it('calls onPresetSelect with correct filters when Maximum Shade is clicked', () => {
      render(
        <FilterPresets
          currentFilters={defaultFilters}
          onPresetSelect={mockOnPresetSelect}
        />
      );

      const maximumShadeButton = screen.getByLabelText(/Apply Maximum Shade preset/i);
      fireEvent.click(maximumShadeButton);

      expect(mockOnPresetSelect).toHaveBeenCalledWith(
        {
          maxSunExposure: 20,
          sectionType: ['covered'],
          priceRange: []
        },
        'maximum-shade'
      );
    });

    it('calls onPresetSelect with correct filters when Budget Friendly is clicked', () => {
      render(
        <FilterPresets
          currentFilters={defaultFilters}
          onPresetSelect={mockOnPresetSelect}
        />
      );

      const budgetButton = screen.getByLabelText(/Apply Budget Friendly preset/i);
      fireEvent.click(budgetButton);

      expect(mockOnPresetSelect).toHaveBeenCalledWith(
        {
          maxSunExposure: 50,
          sectionType: [],
          priceRange: ['value', 'moderate']
        },
        'budget-friendly'
      );
    });

    it('calls onPresetSelect with correct filters when Close & Shaded is clicked', () => {
      render(
        <FilterPresets
          currentFilters={defaultFilters}
          onPresetSelect={mockOnPresetSelect}
        />
      );

      const closeButton = screen.getByLabelText(/Apply Close & Shaded preset/i);
      fireEvent.click(closeButton);

      expect(mockOnPresetSelect).toHaveBeenCalledWith(
        {
          maxSunExposure: 30,
          sectionType: ['field', 'lower'],
          priceRange: []
        },
        'close-shaded'
      );
    });

    it('calls onPresetSelect with correct filters when Accessible is clicked', () => {
      render(
        <FilterPresets
          currentFilters={defaultFilters}
          onPresetSelect={mockOnPresetSelect}
        />
      );

      const accessibleButton = screen.getByLabelText(/Apply Accessible preset/i);
      fireEvent.click(accessibleButton);

      expect(mockOnPresetSelect).toHaveBeenCalledWith(
        {
          maxSunExposure: 50,
          sectionType: ['field', 'lower'],
          priceRange: []
        },
        'accessible'
      );
    });
  });

  describe('Active State', () => {
    it('highlights the active preset when provided', () => {
      render(
        <FilterPresets
          currentFilters={defaultFilters}
          onPresetSelect={mockOnPresetSelect}
          activePreset="maximum-shade"
        />
      );

      const maximumShadeButton = screen.getByLabelText(/Apply Maximum Shade preset/i);
      expect(maximumShadeButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('shows checkmark on active preset', () => {
      render(
        <FilterPresets
          currentFilters={defaultFilters}
          onPresetSelect={mockOnPresetSelect}
          activePreset="budget-friendly"
        />
      );

      const checkmarks = screen.getAllByText('✓');
      expect(checkmarks).toHaveLength(1);
    });

    it('auto-detects active preset from matching filters', () => {
      const maximumShadeFilters: SectionFilterValues = {
        maxSunExposure: 20,
        sectionType: ['covered'],
        priceRange: []
      };

      render(
        <FilterPresets
          currentFilters={maximumShadeFilters}
          onPresetSelect={mockOnPresetSelect}
        />
      );

      const maximumShadeButton = screen.getByLabelText(/Apply Maximum Shade preset/i);
      expect(maximumShadeButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('shows custom badge when filters dont match any preset', () => {
      const customFilters: SectionFilterValues = {
        maxSunExposure: 35,
        sectionType: ['upper'],
        priceRange: ['luxury']
      };

      render(
        <FilterPresets
          currentFilters={customFilters}
          onPresetSelect={mockOnPresetSelect}
        />
      );

      expect(screen.getByText('Custom')).toBeInTheDocument();
    });

    it('does not show custom badge when no filters are active', () => {
      render(
        <FilterPresets
          currentFilters={defaultFilters}
          onPresetSelect={mockOnPresetSelect}
        />
      );

      expect(screen.queryByText('Custom')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels for all preset buttons', () => {
      render(
        <FilterPresets
          currentFilters={defaultFilters}
          onPresetSelect={mockOnPresetSelect}
        />
      );

      expect(screen.getByLabelText(/Apply Maximum Shade preset/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Apply Budget Friendly preset/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Apply Close & Shaded preset/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Apply Accessible preset/i)).toBeInTheDocument();
    });

    it('has proper aria-pressed attributes', () => {
      render(
        <FilterPresets
          currentFilters={defaultFilters}
          onPresetSelect={mockOnPresetSelect}
          activePreset="budget-friendly"
        />
      );

      const budgetButton = screen.getByLabelText(/Apply Budget Friendly preset/i);
      const maximumShadeButton = screen.getByLabelText(/Apply Maximum Shade preset/i);

      expect(budgetButton).toHaveAttribute('aria-pressed', 'true');
      expect(maximumShadeButton).toHaveAttribute('aria-pressed', 'false');
    });

    it('checkmark is aria-hidden', () => {
      render(
        <FilterPresets
          currentFilters={defaultFilters}
          onPresetSelect={mockOnPresetSelect}
          activePreset="maximum-shade"
        />
      );

      const checkmark = screen.getByText('✓');
      expect(checkmark).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('FILTER_PRESETS constant', () => {
    it('exports correct preset definitions', () => {
      expect(FILTER_PRESETS).toHaveLength(4);
      expect(FILTER_PRESETS[0].id).toBe('maximum-shade');
      expect(FILTER_PRESETS[1].id).toBe('budget-friendly');
      expect(FILTER_PRESETS[2].id).toBe('close-shaded');
      expect(FILTER_PRESETS[3].id).toBe('accessible');
    });

    it('has valid filter values for all presets', () => {
      FILTER_PRESETS.forEach(preset => {
        expect(preset.filters).toHaveProperty('maxSunExposure');
        expect(preset.filters).toHaveProperty('sectionType');
        expect(preset.filters).toHaveProperty('priceRange');
        expect(Array.isArray(preset.filters.sectionType)).toBe(true);
        expect(Array.isArray(preset.filters.priceRange)).toBe(true);
      });
    });
  });

  describe('Filter Matching Logic', () => {
    it('correctly matches Budget Friendly preset', () => {
      const budgetFilters: SectionFilterValues = {
        maxSunExposure: 50,
        sectionType: [],
        priceRange: ['value', 'moderate']
      };

      render(
        <FilterPresets
          currentFilters={budgetFilters}
          onPresetSelect={mockOnPresetSelect}
        />
      );

      const budgetButton = screen.getByLabelText(/Apply Budget Friendly preset/i);
      expect(budgetButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('correctly matches Close & Shaded preset', () => {
      const closeFilters: SectionFilterValues = {
        maxSunExposure: 30,
        sectionType: ['field', 'lower'],
        priceRange: []
      };

      render(
        <FilterPresets
          currentFilters={closeFilters}
          onPresetSelect={mockOnPresetSelect}
        />
      );

      const closeButton = screen.getByLabelText(/Apply Close & Shaded preset/i);
      expect(closeButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('handles array order independence in matching', () => {
      const reversedFilters: SectionFilterValues = {
        maxSunExposure: 50,
        sectionType: [],
        priceRange: ['moderate', 'value'] // Reversed order
      };

      render(
        <FilterPresets
          currentFilters={reversedFilters}
          onPresetSelect={mockOnPresetSelect}
        />
      );

      const budgetButton = screen.getByLabelText(/Apply Budget Friendly preset/i);
      expect(budgetButton).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined currentFilters gracefully', () => {
      render(
        <FilterPresets
          currentFilters={defaultFilters}
          onPresetSelect={mockOnPresetSelect}
        />
      );

      expect(screen.getByText('Filter Presets')).toBeInTheDocument();
    });

    it('handles multiple rapid clicks', () => {
      render(
        <FilterPresets
          currentFilters={defaultFilters}
          onPresetSelect={mockOnPresetSelect}
        />
      );

      const button = screen.getByLabelText(/Apply Maximum Shade preset/i);
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      expect(mockOnPresetSelect).toHaveBeenCalledTimes(3);
    });
  });
});
