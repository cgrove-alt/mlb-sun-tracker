import React, { useState } from 'react';
import styles from './SectionFilters.module.css';
import { SunIcon, CloudIcon, PartlyCloudyIcon, FireIcon, MoneyIcon } from '../Icons';
import { FilterPresets } from '../FilterPresets/FilterPresets';

export interface SectionFilterValues {
  maxSunExposure?: number;
  sectionType: string[];
  priceRange: string[];
}

interface SectionFiltersProps {
  filters: SectionFilterValues;
  onChange: (filters: SectionFilterValues) => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export const SectionFilters: React.FC<SectionFiltersProps> = ({
  filters,
  onChange,
  isExpanded = true,
  onToggleExpand
}) => {
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const handlePresetSelect = (presetFilters: SectionFilterValues, presetId: string) => {
    setActivePreset(presetId);
    onChange(presetFilters);
  };

  const handleFilterChange = (newFilters: SectionFilterValues) => {
    // Clear active preset when manually adjusting filters
    setActivePreset(null);
    onChange(newFilters);
  };

  const toggleFilter = (category: 'sectionType' | 'priceRange', value: string) => {
    const currentValues = filters[category];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];

    handleFilterChange({
      ...filters,
      [category]: newValues
    });
  };

  const handleSliderChange = (value: number) => {
    handleFilterChange({
      ...filters,
      maxSunExposure: value === 100 ? undefined : value
    });
  };

  const handlePresetClick = (value: number) => {
    handleFilterChange({
      ...filters,
      maxSunExposure: value === 100 ? undefined : value
    });
  };

  const clearCategory = (category: 'sunExposure' | 'sectionType' | 'priceRange') => {
    if (category === 'sunExposure') {
      handleFilterChange({
        ...filters,
        maxSunExposure: undefined
      });
    } else {
      handleFilterChange({
        ...filters,
        [category]: []
      });
    }
  };

  const clearAllFilters = () => {
    setActivePreset(null);
    onChange({
      maxSunExposure: undefined,
      sectionType: [],
      priceRange: []
    });
  };

  const hasActiveFilters =
    (filters.maxSunExposure !== undefined && filters.maxSunExposure !== 100) ||
    filters.sectionType.length > 0 ||
    filters.priceRange.length > 0;

  const activeFilterCount =
    (filters.maxSunExposure !== undefined && filters.maxSunExposure !== 100 ? 1 : 0) +
    filters.sectionType.length +
    filters.priceRange.length;

  const presets = [
    { label: 'All Sections', value: 100, icon: '🌤️' },
    { label: 'Mostly Shaded', value: 25, icon: '☁️' },
    { label: 'Balanced', value: 50, icon: '⛅' },
    { label: 'Some Sun', value: 75, icon: '☀️' }
  ];

  const sectionTypes = [
    { value: 'covered', label: 'Covered', description: 'Has roof/overhang' },
    { value: 'field', label: 'Field Level' },
    { value: 'lower', label: 'Lower Bowl' },
    { value: 'club', label: 'Club Level' },
    { value: 'upper', label: 'Upper Deck' }
  ];

  const priceRanges = [
    { value: 'value', label: 'Value', icon: <MoneyIcon size={16} /> },
    { value: 'moderate', label: 'Moderate', icon: <MoneyIcon size={16} /> },
    { value: 'premium', label: 'Premium', icon: <MoneyIcon size={16} /> },
    { value: 'luxury', label: 'Luxury', icon: <MoneyIcon size={16} /> }
  ];

  return (
    <div className={styles.filtersContainer}>
      <div className={styles.filtersHeader}>
        <h4 className={styles.filtersTitle}>
          Quick Filters
          {hasActiveFilters && (
            <span className={styles.activeCount}>
              ({activeFilterCount} active)
            </span>
          )}
        </h4>
        <div className={styles.headerActions}>
          {hasActiveFilters && (
            <button
              className={styles.clearAllBtn}
              onClick={clearAllFilters}
              aria-label="Clear all filters"
            >
              Clear All
            </button>
          )}
          {onToggleExpand && (
            <button
              className={styles.toggleBtn}
              onClick={onToggleExpand}
              aria-expanded={isExpanded}
              aria-label={isExpanded ? 'Collapse filters' : 'Expand filters'}
            >
              {isExpanded ? '−' : '+'}
            </button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className={styles.filtersContent}>
          {/* Filter Presets */}
          <FilterPresets
            currentFilters={filters}
            onPresetSelect={handlePresetSelect}
            activePreset={activePreset}
          />

          {/* Sun Exposure Slider */}
          <div className={styles.filterGroup}>
            <div className={styles.groupHeader}>
              <h5 className={styles.groupTitle}>Sun Exposure</h5>
              {filters.maxSunExposure !== undefined && filters.maxSunExposure !== 100 && (
                <button
                  className={styles.clearGroupBtn}
                  onClick={() => clearCategory('sunExposure')}
                  aria-label="Clear sun exposure filter"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Preset Buttons */}
            <div className={styles.presetButtons}>
              {presets.map(preset => (
                <button
                  key={preset.value}
                  className={`${styles.presetButton} ${
                    (filters.maxSunExposure === preset.value ||
                     (filters.maxSunExposure === undefined && preset.value === 100))
                      ? styles.active : ''
                  }`}
                  onClick={() => handlePresetClick(preset.value)}
                  title={`Maximum ${preset.value}% sun exposure`}
                >
                  <span className={styles.presetIcon}>{preset.icon}</span>
                  <span className={styles.presetLabel}>{preset.label}</span>
                </button>
              ))}
            </div>

            {/* Interactive Slider */}
            <div className={styles.sliderContainer}>
              <input
                type="range"
                min="0"
                max="100"
                value={filters.maxSunExposure || 100}
                onChange={(e) => handleSliderChange(Number(e.target.value))}
                className={styles.sunSlider}
                style={{
                  '--slider-value': `${filters.maxSunExposure || 100}%`
                } as React.CSSProperties}
                aria-label="Maximum sun exposure percentage"
              />
              <div className={styles.sliderLabels}>
                <span className={styles.sliderLabelStart}>0% sun</span>
                <span className={styles.sliderValue}>
                  {filters.maxSunExposure === undefined || filters.maxSunExposure === 100
                    ? 'No limit'
                    : `≤ ${filters.maxSunExposure}%`}
                </span>
                <span className={styles.sliderLabelEnd}>100% sun</span>
              </div>
              <p className={styles.sliderHelp}>
                {filters.maxSunExposure === undefined || filters.maxSunExposure === 100
                  ? 'Showing all sections'
                  : `Up to ${Math.round((filters.maxSunExposure / 100) * 180)} minutes of sun in a 3-hour game`}
              </p>
            </div>
          </div>

          {/* Section Type Filters */}
          <div className={styles.filterGroup}>
            <div className={styles.groupHeader}>
              <h5 className={styles.groupTitle}>Section Type</h5>
              {filters.sectionType.length > 0 && (
                <button
                  className={styles.clearGroupBtn}
                  onClick={() => clearCategory('sectionType')}
                  aria-label="Clear section type filters"
                >
                  Clear
                </button>
              )}
            </div>
            <div className={styles.filterChips}>
              {sectionTypes.map(type => (
                <button
                  key={type.value}
                  className={`${styles.filterChip} ${
                    filters.sectionType.includes(type.value) ? styles.active : ''
                  }`}
                  onClick={() => toggleFilter('sectionType', type.value)}
                  aria-pressed={filters.sectionType.includes(type.value)}
                  title={type.description}
                >
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filters */}
          <div className={styles.filterGroup}>
            <div className={styles.groupHeader}>
              <h5 className={styles.groupTitle}>Price Range</h5>
              {filters.priceRange.length > 0 && (
                <button
                  className={styles.clearGroupBtn}
                  onClick={() => clearCategory('priceRange')}
                  aria-label="Clear price range filters"
                >
                  Clear
                </button>
              )}
            </div>
            <div className={styles.filterChips}>
              {priceRanges.map(range => (
                <button
                  key={range.value}
                  className={`${styles.filterChip} ${
                    filters.priceRange.includes(range.value) ? styles.active : ''
                  }`}
                  onClick={() => toggleFilter('priceRange', range.value)}
                  aria-pressed={filters.priceRange.includes(range.value)}
                >
                  {range.icon}
                  <span>{range.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Active Filter Badges */}
      {hasActiveFilters && isExpanded && (
        <div className={styles.activeBadges}>
          {filters.maxSunExposure !== undefined && filters.maxSunExposure !== 100 && (
            <span className={styles.badge}>
              Max {filters.maxSunExposure}% sun
              <button
                className={styles.removeBadge}
                onClick={() => clearCategory('sunExposure')}
                aria-label="Remove sun exposure filter"
              >
                ×
              </button>
            </span>
          )}
          {filters.sectionType.map(value => {
            const type = sectionTypes.find(t => t.value === value);
            return type ? (
              <span key={value} className={styles.badge}>
                {type.label}
                <button
                  className={styles.removeBadge}
                  onClick={() => toggleFilter('sectionType', value)}
                  aria-label={`Remove ${type.label} filter`}
                >
                  ×
                </button>
              </span>
            ) : null;
          })}
          {filters.priceRange.map(value => {
            const range = priceRanges.find(r => r.value === value);
            return range ? (
              <span key={value} className={styles.badge}>
                {range.label}
                <button
                  className={styles.removeBadge}
                  onClick={() => toggleFilter('priceRange', value)}
                  aria-label={`Remove ${range.label} filter`}
                >
                  ×
                </button>
              </span>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
};

export default SectionFilters;