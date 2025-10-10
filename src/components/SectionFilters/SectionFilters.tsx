import React from 'react';
import styles from './SectionFilters.module.css';
import { SunIcon, CloudIcon, PartlyCloudyIcon, FireIcon, MoneyIcon } from '../Icons';

export interface SectionFilterValues {
  sunPreference?: 'any' | 'avoid' | 'prefer' | 'custom';
  customMin?: number;
  customMax?: number;
  shadeLevel: string[];
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
  const toggleFilter = (category: 'shadeLevel' | 'sectionType' | 'priceRange', value: string) => {
    const currentValues = filters[category];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];

    onChange({
      ...filters,
      [category]: newValues
    });
  };

  const handleSunPreferenceChange = (preference: 'any' | 'avoid' | 'prefer' | 'custom') => {
    onChange({
      ...filters,
      sunPreference: preference
    });
  };

  const handleCustomRangeChange = (min: number, max: number) => {
    onChange({
      ...filters,
      customMin: min,
      customMax: max
    });
  };

  const clearCategory = (category: 'shadeLevel' | 'sectionType' | 'priceRange' | 'sunPreference') => {
    if (category === 'sunPreference') {
      onChange({
        ...filters,
        sunPreference: 'any',
        customMin: 0,
        customMax: 100
      });
    } else {
      onChange({
        ...filters,
        [category]: []
      });
    }
  };

  const clearAllFilters = () => {
    onChange({
      sunPreference: 'any',
      customMin: 0,
      customMax: 100,
      shadeLevel: [],
      sectionType: [],
      priceRange: []
    });
  };

  const hasActiveFilters =
    (filters.sunPreference && filters.sunPreference !== 'any') ||
    filters.shadeLevel.length > 0 ||
    filters.sectionType.length > 0 ||
    filters.priceRange.length > 0;

  const activeFilterCount =
    (filters.sunPreference && filters.sunPreference !== 'any' ? 1 : 0) +
    filters.shadeLevel.length +
    filters.sectionType.length +
    filters.priceRange.length;

  const shadeLevels = [
    { value: 'fully-shaded', label: 'Fully Shaded', icon: <CloudIcon size={16} />, description: '100% shade' },
    { value: 'mostly-shaded', label: 'Mostly Shaded', icon: <CloudIcon size={16} />, description: '75-99% shade' },
    { value: 'partial-shade', label: 'Partial Shade', icon: <PartlyCloudyIcon size={16} />, description: '25-74% shade' },
    { value: 'mostly-sunny', label: 'Mostly Sunny', icon: <SunIcon size={16} color="#f59e0b" />, description: '1-24% shade' },
    { value: 'full-sun', label: 'Full Sun', icon: <FireIcon size={16} color="#dc2626" />, description: '0% shade' }
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
          {/* Sun Preference Filters */}
          <div className={styles.filterGroup}>
            <div className={styles.groupHeader}>
              <h5 className={styles.groupTitle}>Sun Preference</h5>
              {filters.sunPreference && filters.sunPreference !== 'any' && (
                <button
                  className={styles.clearGroupBtn}
                  onClick={() => clearCategory('sunPreference')}
                  aria-label="Clear sun preference filter"
                >
                  Clear
                </button>
              )}
            </div>
            <div className={styles.filterOptions}>
              <label className={styles.radioOption}>
                <input
                  type="radio"
                  name="sunPreference"
                  value="any"
                  checked={!filters.sunPreference || filters.sunPreference === 'any'}
                  onChange={() => handleSunPreferenceChange('any')}
                />
                <span>Any amount of sun</span>
              </label>
              <label className={styles.radioOption}>
                <input
                  type="radio"
                  name="sunPreference"
                  value="avoid"
                  checked={filters.sunPreference === 'avoid'}
                  onChange={() => handleSunPreferenceChange('avoid')}
                />
                <span>Avoid sun (≤20% of game)</span>
              </label>
              <label className={styles.radioOption}>
                <input
                  type="radio"
                  name="sunPreference"
                  value="prefer"
                  checked={filters.sunPreference === 'prefer'}
                  onChange={() => handleSunPreferenceChange('prefer')}
                />
                <span>Prefer sun (≥60% of game)</span>
              </label>
              <label className={styles.radioOption}>
                <input
                  type="radio"
                  name="sunPreference"
                  value="custom"
                  checked={filters.sunPreference === 'custom'}
                  onChange={() => handleSunPreferenceChange('custom')}
                />
                <span>Custom range</span>
              </label>
              {filters.sunPreference === 'custom' && (
                <div className={styles.customRange}>
                  <div className={styles.rangeInput}>
                    <label htmlFor="customMin">
                      Min: <strong>{filters.customMin || 0}%</strong>
                    </label>
                    <input
                      id="customMin"
                      type="range"
                      min="0"
                      max="100"
                      value={filters.customMin || 0}
                      onChange={(e) => handleCustomRangeChange(Number(e.target.value), filters.customMax || 100)}
                    />
                  </div>
                  <div className={styles.rangeInput}>
                    <label htmlFor="customMax">
                      Max: <strong>{filters.customMax || 100}%</strong>
                    </label>
                    <input
                      id="customMax"
                      type="range"
                      min="0"
                      max="100"
                      value={filters.customMax || 100}
                      onChange={(e) => handleCustomRangeChange(filters.customMin || 0, Number(e.target.value))}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Shade Level Filters */}
          <div className={styles.filterGroup}>
            <div className={styles.groupHeader}>
              <h5 className={styles.groupTitle}>Shade Level</h5>
              {filters.shadeLevel.length > 0 && (
                <button
                  className={styles.clearGroupBtn}
                  onClick={() => clearCategory('shadeLevel')}
                  aria-label="Clear shade level filters"
                >
                  Clear
                </button>
              )}
            </div>
            <div className={styles.filterChips}>
              {shadeLevels.map(level => (
                <button
                  key={level.value}
                  className={`${styles.filterChip} ${
                    filters.shadeLevel.includes(level.value) ? styles.active : ''
                  }`}
                  onClick={() => toggleFilter('shadeLevel', level.value)}
                  aria-pressed={filters.shadeLevel.includes(level.value)}
                  title={level.description}
                >
                  {level.icon}
                  <span>{level.label}</span>
                </button>
              ))}
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
          {filters.sunPreference && filters.sunPreference !== 'any' && (
            <span className={styles.badge}>
              {filters.sunPreference === 'avoid' && 'Avoid sun (≤20%)'}
              {filters.sunPreference === 'prefer' && 'Prefer sun (≥60%)'}
              {filters.sunPreference === 'custom' && `Sun ${filters.customMin || 0}%-${filters.customMax || 100}%`}
              <button
                className={styles.removeBadge}
                onClick={() => clearCategory('sunPreference')}
                aria-label="Remove sun preference filter"
              >
                ×
              </button>
            </span>
          )}
          {filters.shadeLevel.map(value => {
            const level = shadeLevels.find(l => l.value === value);
            return level ? (
              <span key={value} className={styles.badge}>
                {level.label}
                <button
                  className={styles.removeBadge}
                  onClick={() => toggleFilter('shadeLevel', value)}
                  aria-label={`Remove ${level.label} filter`}
                >
                  ×
                </button>
              </span>
            ) : null;
          })}
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