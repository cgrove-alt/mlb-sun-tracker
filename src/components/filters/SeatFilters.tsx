'use client';

import React from 'react';

export type ShadeLevel = 'full-shade' | 'mostly-shade' | 'partial' | 'any';
export type SectionLevel = 'field' | 'club' | 'lower' | 'upper' | 'any';
export type ViewQuality = 'excellent' | 'good' | 'fair' | 'any';
export type PriceRange = 'value' | 'moderate' | 'premium' | 'luxury' | 'any';

export interface SeatFilterState {
  shadeLevel: ShadeLevel;
  sectionLevel: SectionLevel;
  accessibility: {
    wheelchairAccessible: boolean;
    companionSeat: boolean;
  };
  viewQuality: ViewQuality;
  priceRange: PriceRange;
}

export const DEFAULT_FILTERS: SeatFilterState = {
  shadeLevel: 'any',
  sectionLevel: 'any',
  accessibility: {
    wheelchairAccessible: false,
    companionSeat: false,
  },
  viewQuality: 'any',
  priceRange: 'any',
};

interface SeatFiltersProps {
  filters: SeatFilterState;
  onFilterChange: (filters: SeatFilterState) => void;
  showPriceFilter?: boolean; // Only show if price data is available
  compact?: boolean; // Compact view for mobile
}

/**
 * SeatFilters Component
 * Primary filtering interface for seat search
 *
 * Shade level is the primary filter (most prominent)
 * Other filters help narrow down the search
 */
export const SeatFilters: React.FC<SeatFiltersProps> = ({
  filters,
  onFilterChange,
  showPriceFilter = false,
  compact = false,
}) => {
  const handleShadeChange = (shadeLevel: ShadeLevel) => {
    onFilterChange({ ...filters, shadeLevel });
  };

  const handleSectionChange = (sectionLevel: SectionLevel) => {
    onFilterChange({ ...filters, sectionLevel });
  };

  const handleViewQualityChange = (viewQuality: ViewQuality) => {
    onFilterChange({ ...filters, viewQuality });
  };

  const handlePriceChange = (priceRange: PriceRange) => {
    onFilterChange({ ...filters, priceRange });
  };

  const handleAccessibilityChange = (key: keyof SeatFilterState['accessibility'], value: boolean) => {
    onFilterChange({
      ...filters,
      accessibility: {
        ...filters.accessibility,
        [key]: value,
      },
    });
  };

  const handleResetFilters = () => {
    onFilterChange(DEFAULT_FILTERS);
  };

  // Check if any filters are active (not default)
  const hasActiveFilters =
    filters.shadeLevel !== 'any' ||
    filters.sectionLevel !== 'any' ||
    filters.viewQuality !== 'any' ||
    filters.priceRange !== 'any' ||
    filters.accessibility.wheelchairAccessible ||
    filters.accessibility.companionSeat;

  // Compact view for mobile
  if (compact) {
    return (
      <div className="seat-filters-compact">
        <div className="filter-section">
          <label className="filter-label">Shade</label>
          <select
            value={filters.shadeLevel}
            onChange={(e) => handleShadeChange(e.target.value as ShadeLevel)}
            className="filter-select"
          >
            <option value="any">Any</option>
            <option value="full-shade">🌑 Full Shade</option>
            <option value="mostly-shade">🌤️ Mostly Shade</option>
            <option value="partial">⛅ Partial</option>
          </select>
        </div>

        <div className="filter-section">
          <label className="filter-label">Level</label>
          <select
            value={filters.sectionLevel}
            onChange={(e) => handleSectionChange(e.target.value as SectionLevel)}
            className="filter-select"
          >
            <option value="any">Any</option>
            <option value="field">Field</option>
            <option value="club">Club</option>
            <option value="lower">Lower</option>
            <option value="upper">Upper</option>
          </select>
        </div>

        {hasActiveFilters && (
          <button onClick={handleResetFilters} className="reset-button-compact">
            Clear
          </button>
        )}

        <style jsx>{`
          .seat-filters-compact {
            display: flex;
            gap: 0.5rem;
            padding: 0.75rem;
            background: white;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }

          .filter-section {
            flex: 1;
            min-width: 0;
          }

          .filter-label {
            display: block;
            font-size: 0.75rem;
            font-weight: 600;
            color: #374151;
            margin-bottom: 0.25rem;
          }

          .filter-select {
            width: 100%;
            padding: 0.5rem;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            font-size: 0.875rem;
            background: white;
          }

          .reset-button-compact {
            padding: 0.5rem 0.75rem;
            background: #ef4444;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 0.75rem;
            font-weight: 600;
            cursor: pointer;
            margin-top: 1.25rem;
          }

          .reset-button-compact:hover {
            background: #dc2626;
          }
        `}</style>
      </div>
    );
  }

  // Full view
  return (
    <div className="seat-filters">
      {/* Header */}
      <div className="filters-header">
        <h3 className="filters-title">Filter Seats</h3>
        {hasActiveFilters && (
          <button onClick={handleResetFilters} className="reset-button">
            Reset All
          </button>
        )}
      </div>

      {/* Primary Filter: Shade Level */}
      <div className="filter-group primary">
        <label className="filter-group-label">Shade Level</label>
        <div className="shade-options">
          <button
            onClick={() => handleShadeChange('full-shade')}
            className={`shade-option ${filters.shadeLevel === 'full-shade' ? 'active' : ''}`}
          >
            <span className="shade-icon">🌑</span>
            <span className="shade-label">Full Shade</span>
            <span className="shade-description">0% sun</span>
          </button>

          <button
            onClick={() => handleShadeChange('mostly-shade')}
            className={`shade-option ${filters.shadeLevel === 'mostly-shade' ? 'active' : ''}`}
          >
            <span className="shade-icon">🌤️</span>
            <span className="shade-label">Mostly Shade</span>
            <span className="shade-description">&lt;30% sun</span>
          </button>

          <button
            onClick={() => handleShadeChange('partial')}
            className={`shade-option ${filters.shadeLevel === 'partial' ? 'active' : ''}`}
          >
            <span className="shade-icon">⛅</span>
            <span className="shade-label">Partial</span>
            <span className="shade-description">30-70% sun</span>
          </button>

          <button
            onClick={() => handleShadeChange('any')}
            className={`shade-option ${filters.shadeLevel === 'any' ? 'active' : ''}`}
          >
            <span className="shade-icon">🔆</span>
            <span className="shade-label">Any</span>
            <span className="shade-description">All seats</span>
          </button>
        </div>
      </div>

      {/* Section Level */}
      <div className="filter-group">
        <label className="filter-group-label">Section Level</label>
        <div className="radio-group">
          {[
            { value: 'any', label: 'Any Level' },
            { value: 'field', label: 'Field Level' },
            { value: 'club', label: 'Club Level' },
            { value: 'lower', label: 'Lower Deck' },
            { value: 'upper', label: 'Upper Deck' },
          ].map((option) => (
            <label key={option.value} className="radio-option">
              <input
                type="radio"
                name="sectionLevel"
                value={option.value}
                checked={filters.sectionLevel === option.value}
                onChange={(e) => handleSectionChange(e.target.value as SectionLevel)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* View Quality */}
      <div className="filter-group">
        <label className="filter-group-label">View Quality</label>
        <div className="radio-group">
          {[
            { value: 'any', label: 'Any Quality' },
            { value: 'excellent', label: 'Excellent' },
            { value: 'good', label: 'Good' },
            { value: 'fair', label: 'Fair' },
          ].map((option) => (
            <label key={option.value} className="radio-option">
              <input
                type="radio"
                name="viewQuality"
                value={option.value}
                checked={filters.viewQuality === option.value}
                onChange={(e) => handleViewQualityChange(e.target.value as ViewQuality)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range (optional) */}
      {showPriceFilter && (
        <div className="filter-group">
          <label className="filter-group-label">Price Range</label>
          <div className="radio-group">
            {[
              { value: 'any', label: 'Any Price' },
              { value: 'value', label: 'Value' },
              { value: 'moderate', label: 'Moderate' },
              { value: 'premium', label: 'Premium' },
              { value: 'luxury', label: 'Luxury' },
            ].map((option) => (
              <label key={option.value} className="radio-option">
                <input
                  type="radio"
                  name="priceRange"
                  value={option.value}
                  checked={filters.priceRange === option.value}
                  onChange={(e) => handlePriceChange(e.target.value as PriceRange)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Accessibility Options */}
      <div className="filter-group">
        <label className="filter-group-label">Accessibility</label>
        <div className="checkbox-group">
          <label className="checkbox-option">
            <input
              type="checkbox"
              checked={filters.accessibility.wheelchairAccessible}
              onChange={(e) => handleAccessibilityChange('wheelchairAccessible', e.target.checked)}
            />
            <span>♿ Wheelchair Accessible</span>
          </label>
          <label className="checkbox-option">
            <input
              type="checkbox"
              checked={filters.accessibility.companionSeat}
              onChange={(e) => handleAccessibilityChange('companionSeat', e.target.checked)}
            />
            <span>Companion Seat Available</span>
          </label>
        </div>
      </div>

      <style jsx>{`
        .seat-filters {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .filters-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #e5e7eb;
        }

        .filters-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #111827;
        }

        .reset-button {
          padding: 0.5rem 1rem;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .reset-button:hover {
          background: #dc2626;
        }

        .filter-group {
          margin-bottom: 1.5rem;
        }

        .filter-group.primary {
          background: #f9fafb;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 2rem;
        }

        .filter-group-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        /* Shade Options - Primary Filter */
        .shade-options {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }

        .shade-option {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1rem;
          border: 2px solid #d1d5db;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
        }

        .shade-option:hover {
          border-color: #3b82f6;
          box-shadow: 0 2px 4px rgba(59, 130, 246, 0.1);
        }

        .shade-option.active {
          border-color: #3b82f6;
          background: #eff6ff;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .shade-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .shade-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 0.25rem;
        }

        .shade-description {
          font-size: 0.75rem;
          color: #6b7280;
        }

        /* Radio Groups */
        .radio-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .radio-option {
          display: flex;
          align-items: center;
          padding: 0.5rem;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .radio-option:hover {
          background: #f9fafb;
        }

        .radio-option input[type="radio"] {
          margin-right: 0.5rem;
          cursor: pointer;
        }

        .radio-option span {
          font-size: 0.875rem;
          color: #374151;
        }

        /* Checkbox Groups */
        .checkbox-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .checkbox-option {
          display: flex;
          align-items: center;
          padding: 0.5rem;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .checkbox-option:hover {
          background: #f9fafb;
        }

        .checkbox-option input[type="checkbox"] {
          margin-right: 0.5rem;
          cursor: pointer;
        }

        .checkbox-option span {
          font-size: 0.875rem;
          color: #374151;
        }

        @media (max-width: 768px) {
          .shade-options {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default SeatFilters;
