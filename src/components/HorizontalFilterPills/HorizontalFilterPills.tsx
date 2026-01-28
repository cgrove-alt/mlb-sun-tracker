'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SunIcon, CloudIcon, PartlyCloudyIcon, MoneyIcon, CloseIcon } from '../Icons';
import styles from './HorizontalFilterPills.module.css';

/**
 * Filter values for section filtering
 */
export interface FilterValues {
  maxSunExposure?: number;
  sectionType: string[];
  priceRange: string[];
}

export interface HorizontalFilterPillsProps {
  filters: FilterValues;
  onChange: (filters: FilterValues) => void;
  className?: string;
}

// Filter option configurations
const SUN_PRESETS = [
  { label: 'All Sun Levels', value: 100, icon: '🌤️' },
  { label: 'Mostly Shaded (≤25%)', value: 25, icon: '☁️' },
  { label: 'Balanced (≤50%)', value: 50, icon: '⛅' },
  { label: 'Some Sun (≤75%)', value: 75, icon: '☀️' },
];

const SECTION_TYPES = [
  { value: 'covered', label: 'Covered' },
  { value: 'field', label: 'Field Level' },
  { value: 'lower', label: 'Lower Bowl' },
  { value: 'club', label: 'Club Level' },
  { value: 'upper', label: 'Upper Deck' },
];

const PRICE_RANGES = [
  { value: 'value', label: 'Value ($)' },
  { value: 'moderate', label: 'Moderate ($$)' },
  { value: 'premium', label: 'Premium ($$$)' },
  { value: 'luxury', label: 'Luxury ($$$$)' },
];

/**
 * HorizontalFilterPills - Horizontal filter bar with dropdown popovers
 *
 * Replaces the cramped sidebar filters with a clean horizontal layout.
 * Features:
 * - Pill buttons for each filter category
 * - Dropdown popovers for filter options
 * - Active filter badges
 * - Clear all button
 * - URL param persistence (handled by parent)
 */
export const HorizontalFilterPills: React.FC<HorizontalFilterPillsProps> = ({
  filters,
  onChange,
  className = '',
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const handleSunChange = (value: number) => {
    onChange({
      ...filters,
      maxSunExposure: value === 100 ? undefined : value,
    });
  };

  const toggleSectionType = (value: string) => {
    const newTypes = filters.sectionType.includes(value)
      ? filters.sectionType.filter((t) => t !== value)
      : [...filters.sectionType, value];
    onChange({
      ...filters,
      sectionType: newTypes,
    });
  };

  const togglePriceRange = (value: string) => {
    const newRanges = filters.priceRange.includes(value)
      ? filters.priceRange.filter((r) => r !== value)
      : [...filters.priceRange, value];
    onChange({
      ...filters,
      priceRange: newRanges,
    });
  };

  const clearAllFilters = () => {
    onChange({
      maxSunExposure: undefined,
      sectionType: [],
      priceRange: [],
    });
    setOpenDropdown(null);
  };

  const clearCategory = useCallback(
    (category: 'sun' | 'level' | 'price') => {
      if (category === 'sun') {
        onChange({ ...filters, maxSunExposure: undefined });
      } else if (category === 'level') {
        onChange({ ...filters, sectionType: [] });
      } else {
        onChange({ ...filters, priceRange: [] });
      }
    },
    [filters, onChange]
  );

  // Count active filters
  const hasSunFilter = filters.maxSunExposure !== undefined && filters.maxSunExposure !== 100;
  const hasLevelFilter = filters.sectionType.length > 0;
  const hasPriceFilter = filters.priceRange.length > 0;
  const hasActiveFilters = hasSunFilter || hasLevelFilter || hasPriceFilter;
  const activeFilterCount =
    (hasSunFilter ? 1 : 0) + filters.sectionType.length + filters.priceRange.length;

  // Get display label for sun exposure
  const getSunLabel = () => {
    if (!hasSunFilter) return 'Sun Exposure';
    const preset = SUN_PRESETS.find((p) => p.value === filters.maxSunExposure);
    return preset ? preset.label.split(' (')[0] : `≤${filters.maxSunExposure}%`;
  };

  // Get display label for section type
  const getLevelLabel = () => {
    if (filters.sectionType.length === 0) return 'Level';
    if (filters.sectionType.length === 1) {
      const type = SECTION_TYPES.find((t) => t.value === filters.sectionType[0]);
      return type?.label || 'Level';
    }
    return `${filters.sectionType.length} Levels`;
  };

  // Get display label for price range
  const getPriceLabel = () => {
    if (filters.priceRange.length === 0) return 'Price';
    if (filters.priceRange.length === 1) {
      const range = PRICE_RANGES.find((r) => r.value === filters.priceRange[0]);
      return range?.label.split(' ')[0] || 'Price';
    }
    return `${filters.priceRange.length} Prices`;
  };

  return (
    <div className={`${styles.container} ${className}`} ref={containerRef}>
      <div className={styles.pillsRow}>
        {/* Sun Exposure Pill */}
        <div className={styles.pillWrapper}>
          <button
            className={`${styles.pill} ${hasSunFilter ? styles.active : ''} ${
              openDropdown === 'sun' ? styles.open : ''
            }`}
            onClick={() => toggleDropdown('sun')}
            aria-expanded={openDropdown === 'sun'}
            aria-haspopup="listbox"
          >
            <SunIcon size={16} />
            <span>{getSunLabel()}</span>
            <span className={styles.chevron}>▾</span>
          </button>

          {openDropdown === 'sun' && (
            <div className={styles.dropdown} role="listbox">
              <div className={styles.dropdownHeader}>
                <span>Sun Exposure</span>
                {hasSunFilter && (
                  <button
                    className={styles.clearBtn}
                    onClick={() => clearCategory('sun')}
                    aria-label="Clear sun exposure filter"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className={styles.dropdownOptions}>
                {SUN_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    className={`${styles.option} ${
                      (filters.maxSunExposure === preset.value ||
                        (filters.maxSunExposure === undefined && preset.value === 100))
                        ? styles.selected
                        : ''
                    }`}
                    onClick={() => handleSunChange(preset.value)}
                    role="option"
                    aria-selected={
                      filters.maxSunExposure === preset.value ||
                      (filters.maxSunExposure === undefined && preset.value === 100)
                    }
                  >
                    <span className={styles.optionIcon}>{preset.icon}</span>
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Section Type Pill */}
        <div className={styles.pillWrapper}>
          <button
            className={`${styles.pill} ${hasLevelFilter ? styles.active : ''} ${
              openDropdown === 'level' ? styles.open : ''
            }`}
            onClick={() => toggleDropdown('level')}
            aria-expanded={openDropdown === 'level'}
            aria-haspopup="listbox"
          >
            <span>{getLevelLabel()}</span>
            <span className={styles.chevron}>▾</span>
          </button>

          {openDropdown === 'level' && (
            <div className={styles.dropdown} role="listbox">
              <div className={styles.dropdownHeader}>
                <span>Section Level</span>
                {hasLevelFilter && (
                  <button
                    className={styles.clearBtn}
                    onClick={() => clearCategory('level')}
                    aria-label="Clear level filter"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className={styles.dropdownOptions}>
                {SECTION_TYPES.map((type) => (
                  <button
                    key={type.value}
                    className={`${styles.option} ${styles.checkbox} ${
                      filters.sectionType.includes(type.value) ? styles.selected : ''
                    }`}
                    onClick={() => toggleSectionType(type.value)}
                    role="option"
                    aria-selected={filters.sectionType.includes(type.value)}
                  >
                    <span
                      className={`${styles.checkmark} ${
                        filters.sectionType.includes(type.value) ? styles.checked : ''
                      }`}
                    >
                      {filters.sectionType.includes(type.value) ? '✓' : ''}
                    </span>
                    <span>{type.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Price Range Pill */}
        <div className={styles.pillWrapper}>
          <button
            className={`${styles.pill} ${hasPriceFilter ? styles.active : ''} ${
              openDropdown === 'price' ? styles.open : ''
            }`}
            onClick={() => toggleDropdown('price')}
            aria-expanded={openDropdown === 'price'}
            aria-haspopup="listbox"
          >
            <MoneyIcon size={16} />
            <span>{getPriceLabel()}</span>
            <span className={styles.chevron}>▾</span>
          </button>

          {openDropdown === 'price' && (
            <div className={styles.dropdown} role="listbox">
              <div className={styles.dropdownHeader}>
                <span>Price Range</span>
                {hasPriceFilter && (
                  <button
                    className={styles.clearBtn}
                    onClick={() => clearCategory('price')}
                    aria-label="Clear price filter"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className={styles.dropdownOptions}>
                {PRICE_RANGES.map((range) => (
                  <button
                    key={range.value}
                    className={`${styles.option} ${styles.checkbox} ${
                      filters.priceRange.includes(range.value) ? styles.selected : ''
                    }`}
                    onClick={() => togglePriceRange(range.value)}
                    role="option"
                    aria-selected={filters.priceRange.includes(range.value)}
                  >
                    <span
                      className={`${styles.checkmark} ${
                        filters.priceRange.includes(range.value) ? styles.checked : ''
                      }`}
                    >
                      {filters.priceRange.includes(range.value) ? '✓' : ''}
                    </span>
                    <span>{range.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Clear All Button */}
        {hasActiveFilters && (
          <button
            className={styles.clearAllBtn}
            onClick={clearAllFilters}
            aria-label={`Clear all ${activeFilterCount} filters`}
          >
            <CloseIcon size={14} />
            <span>Clear All ({activeFilterCount})</span>
          </button>
        )}
      </div>

      {/* Active Filter Badges */}
      {hasActiveFilters && (
        <div className={styles.activeBadges}>
          {hasSunFilter && (
            <span className={styles.badge}>
              {getSunLabel()}
              <button
                className={styles.removeBadge}
                onClick={() => clearCategory('sun')}
                aria-label="Remove sun exposure filter"
              >
                ×
              </button>
            </span>
          )}
          {filters.sectionType.map((value) => {
            const type = SECTION_TYPES.find((t) => t.value === value);
            return type ? (
              <span key={value} className={styles.badge}>
                {type.label}
                <button
                  className={styles.removeBadge}
                  onClick={() => toggleSectionType(value)}
                  aria-label={`Remove ${type.label} filter`}
                >
                  ×
                </button>
              </span>
            ) : null;
          })}
          {filters.priceRange.map((value) => {
            const range = PRICE_RANGES.find((r) => r.value === value);
            return range ? (
              <span key={value} className={styles.badge}>
                {range.label.split(' ')[0]}
                <button
                  className={styles.removeBadge}
                  onClick={() => togglePriceRange(value)}
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

export default HorizontalFilterPills;
