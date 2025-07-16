import React, { useState, useEffect } from 'react';
import { useTranslation } from '../i18n/i18nContext';
import { SeatingSectionSun } from '../utils/sunCalculations';
import './SeatGeekTicketFilter.css';

export interface TicketFilterCriteria {
  priceRange: {
    min: number;
    max: number;
  };
  sunExposure: {
    min: number;
    max: number;
  };
  seatingLevels: string[];
  coverage: 'any' | 'covered' | 'uncovered';
  showOnlyAvailable: boolean;
  sortBy: 'price' | 'sunExposure' | 'section';
  sortOrder: 'asc' | 'desc';
}

interface SeatGeekTicketFilterProps {
  onFilterChange: (criteria: TicketFilterCriteria) => void;
  availableSections: SeatingSectionSun[];
  priceRange: { min: number; max: number };
  disabled?: boolean;
}

export const SeatGeekTicketFilter: React.FC<SeatGeekTicketFilterProps> = ({
  onFilterChange,
  availableSections,
  priceRange,
  disabled = false
}) => {
  const { t } = useTranslation();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<TicketFilterCriteria>({
    priceRange: {
      min: priceRange.min,
      max: Math.min(priceRange.max, 100) // Cap at $100 by default
    },
    sunExposure: {
      min: 0,
      max: 20 // Default to shaded sections
    },
    seatingLevels: [],
    coverage: 'any',
    showOnlyAvailable: true,
    sortBy: 'price',
    sortOrder: 'asc'
  });

  // Get unique seating levels from available sections
  const availableLevels = Array.from(new Set(availableSections.map(s => s.section.level)));

  // Update price range when prop changes
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      priceRange: {
        min: priceRange.min,
        max: Math.min(priceRange.max, prev.priceRange.max)
      }
    }));
  }, [priceRange]);

  // Notify parent when filters change
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handlePriceChange = (type: 'min' | 'max', value: number) => {
    setFilters(prev => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [type]: value
      }
    }));
  };

  const handleSunExposureChange = (type: 'min' | 'max', value: number) => {
    setFilters(prev => ({
      ...prev,
      sunExposure: {
        ...prev.sunExposure,
        [type]: value
      }
    }));
  };

  const handleSeatingLevelChange = (level: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      seatingLevels: checked 
        ? [...prev.seatingLevels, level]
        : prev.seatingLevels.filter(l => l !== level)
    }));
  };

  const handleCoverageChange = (coverage: 'any' | 'covered' | 'uncovered') => {
    setFilters(prev => ({
      ...prev,
      coverage
    }));
  };

  const handleSortChange = (sortBy: 'price' | 'sunExposure' | 'section') => {
    setFilters(prev => ({
      ...prev,
      sortBy,
      sortOrder: prev.sortBy === sortBy && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  };

  const resetFilters = () => {
    setFilters({
      priceRange: {
        min: priceRange.min,
        max: Math.min(priceRange.max, 100)
      },
      sunExposure: {
        min: 0,
        max: 20
      },
      seatingLevels: [],
      coverage: 'any',
      showOnlyAvailable: true,
      sortBy: 'price',
      sortOrder: 'asc'
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.priceRange.max < priceRange.max) count++;
    if (filters.sunExposure.max < 100) count++;
    if (filters.seatingLevels.length > 0) count++;
    if (filters.coverage !== 'any') count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className={`seatgeek-ticket-filter ${disabled ? 'disabled' : ''}`}>
      <div className="filter-header">
        <button
          className="filter-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
          disabled={disabled}
          aria-expanded={isExpanded}
          aria-label={t('tickets.filterToggle')}
        >
          <div className="filter-icon">
            <span className="filter-icon-symbol">🎛️</span>
            <span className="filter-title">{t('tickets.filterTickets')}</span>
            {activeFilterCount > 0 && (
              <span className="filter-count">{activeFilterCount}</span>
            )}
          </div>
          <span className={`expand-arrow ${isExpanded ? 'expanded' : ''}`}>
            ▼
          </span>
        </button>
        
        {activeFilterCount > 0 && (
          <button
            className="reset-filters"
            onClick={resetFilters}
            disabled={disabled}
            aria-label={t('tickets.resetFilters')}
          >
            {t('app.reset')}
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="filter-content">
          {/* Price Range Filter */}
          <div className="filter-section">
            <h4>{t('tickets.priceRange')}</h4>
            <div className="price-range-controls">
              <div className="price-input-group">
                <label>{t('tickets.minPrice')}</label>
                <div className="price-input-wrapper">
                  <span className="currency">$</span>
                  <input
                    type="number"
                    min={priceRange.min}
                    max={filters.priceRange.max}
                    value={filters.priceRange.min}
                    onChange={(e) => handlePriceChange('min', parseInt(e.target.value) || priceRange.min)}
                    disabled={disabled}
                  />
                </div>
              </div>
              <div className="price-input-group">
                <label>{t('tickets.maxPrice')}</label>
                <div className="price-input-wrapper">
                  <span className="currency">$</span>
                  <input
                    type="number"
                    min={filters.priceRange.min}
                    max={priceRange.max}
                    value={filters.priceRange.max}
                    onChange={(e) => handlePriceChange('max', parseInt(e.target.value) || priceRange.max)}
                    disabled={disabled}
                  />
                </div>
              </div>
            </div>
            <div className="price-range-slider">
              <input
                type="range"
                min={priceRange.min}
                max={priceRange.max}
                value={filters.priceRange.max}
                onChange={(e) => handlePriceChange('max', parseInt(e.target.value))}
                disabled={disabled}
                className="price-slider"
              />
              <div className="price-labels">
                <span>${priceRange.min}</span>
                <span>${priceRange.max}</span>
              </div>
            </div>
          </div>

          {/* Sun Exposure Filter */}
          <div className="filter-section">
            <h4>{t('sun.exposure')}</h4>
            <div className="sun-exposure-controls">
              <div className="sun-input-group">
                <label>{t('sun.preferences.minExposure')}</label>
                <div className="sun-input-wrapper">
                  <input
                    type="number"
                    min={0}
                    max={filters.sunExposure.max}
                    value={filters.sunExposure.min}
                    onChange={(e) => handleSunExposureChange('min', parseInt(e.target.value) || 0)}
                    disabled={disabled}
                  />
                  <span className="percentage">%</span>
                </div>
              </div>
              <div className="sun-input-group">
                <label>{t('sun.preferences.maxExposure')}</label>
                <div className="sun-input-wrapper">
                  <input
                    type="number"
                    min={filters.sunExposure.min}
                    max={100}
                    value={filters.sunExposure.max}
                    onChange={(e) => handleSunExposureChange('max', parseInt(e.target.value) || 100)}
                    disabled={disabled}
                  />
                  <span className="percentage">%</span>
                </div>
              </div>
            </div>
            <div className="sun-presets">
              <button
                className={`preset-btn ${filters.sunExposure.max <= 20 ? 'active' : ''}`}
                onClick={() => setFilters(prev => ({ ...prev, sunExposure: { min: 0, max: 20 } }))}
                disabled={disabled}
              >
                🌫️ {t('sun.preferences.avoid')}
              </button>
              <button
                className={`preset-btn ${filters.sunExposure.min >= 60 ? 'active' : ''}`}
                onClick={() => setFilters(prev => ({ ...prev, sunExposure: { min: 60, max: 100 } }))}
                disabled={disabled}
              >
                ☀️ {t('sun.preferences.prefer')}
              </button>
              <button
                className={`preset-btn ${filters.sunExposure.min === 0 && filters.sunExposure.max === 100 ? 'active' : ''}`}
                onClick={() => setFilters(prev => ({ ...prev, sunExposure: { min: 0, max: 100 } }))}
                disabled={disabled}
              >
                🌤️ {t('sun.preferences.any')}
              </button>
            </div>
          </div>

          {/* Seating Level Filter */}
          <div className="filter-section">
            <h4>{t('filter.seatingLevel.title')}</h4>
            <div className="seating-level-checkboxes">
              {availableLevels.map(level => (
                <label key={level} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.seatingLevels.includes(level)}
                    onChange={(e) => handleSeatingLevelChange(level, e.target.checked)}
                    disabled={disabled}
                  />
                  <span className="checkbox-text">
                    {t(`sections.levels.${level}`)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Coverage Filter */}
          <div className="filter-section">
            <h4>{t('filter.coverage.title')}</h4>
            <div className="coverage-radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="coverage"
                  value="any"
                  checked={filters.coverage === 'any'}
                  onChange={() => handleCoverageChange('any')}
                  disabled={disabled}
                />
                <span className="radio-text">{t('filter.coverage.any')}</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="coverage"
                  value="covered"
                  checked={filters.coverage === 'covered'}
                  onChange={() => handleCoverageChange('covered')}
                  disabled={disabled}
                />
                <span className="radio-text">{t('filter.coverage.covered')}</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="coverage"
                  value="uncovered"
                  checked={filters.coverage === 'uncovered'}
                  onChange={() => handleCoverageChange('uncovered')}
                  disabled={disabled}
                />
                <span className="radio-text">{t('filter.coverage.uncovered')}</span>
              </label>
            </div>
          </div>

          {/* Sort Options */}
          <div className="filter-section">
            <h4>{t('sections.sort')}</h4>
            <div className="sort-controls">
              <button
                className={`sort-btn ${filters.sortBy === 'price' ? 'active' : ''}`}
                onClick={() => handleSortChange('price')}
                disabled={disabled}
              >
                💰 {t('sections.priceRange')}
                {filters.sortBy === 'price' && (
                  <span className="sort-arrow">
                    {filters.sortOrder === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </button>
              <button
                className={`sort-btn ${filters.sortBy === 'sunExposure' ? 'active' : ''}`}
                onClick={() => handleSortChange('sunExposure')}
                disabled={disabled}
              >
                ☀️ {t('sun.exposure')}
                {filters.sortBy === 'sunExposure' && (
                  <span className="sort-arrow">
                    {filters.sortOrder === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </button>
              <button
                className={`sort-btn ${filters.sortBy === 'section' ? 'active' : ''}`}
                onClick={() => handleSortChange('section')}
                disabled={disabled}
              >
                🎫 {t('sections.section')}
                {filters.sortBy === 'section' && (
                  <span className="sort-arrow">
                    {filters.sortOrder === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Additional Options */}
          <div className="filter-section">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.showOnlyAvailable}
                onChange={(e) => setFilters(prev => ({ ...prev, showOnlyAvailable: e.target.checked }))}
                disabled={disabled}
              />
              <span className="checkbox-text">
                {t('tickets.showOnlyAvailable')}
              </span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};