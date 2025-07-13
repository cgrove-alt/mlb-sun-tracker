import React, { useState } from 'react';
import './SunExposureFilter.css';

export interface SunFilterCriteria {
  minExposure?: number;
  maxExposure?: number;
  levels?: Array<'field' | 'lower' | 'club' | 'upper' | 'suite'>;
  covered?: boolean;
  priceRange?: Array<'value' | 'moderate' | 'premium' | 'luxury'>;
}

interface SunExposureFilterProps {
  onFilterChange: (criteria: SunFilterCriteria) => void;
  disabled?: boolean;
}

export const SunExposureFilter: React.FC<SunExposureFilterProps> = ({
  onFilterChange,
  disabled = false
}) => {
  const [sunPreference, setSunPreference] = useState<'any' | 'avoid' | 'prefer' | 'custom'>('any');
  const [customMin, setCustomMin] = useState<number>(0);
  const [customMax, setCustomMax] = useState<number>(100);
  const [selectedLevels, setSelectedLevels] = useState<Array<'field' | 'lower' | 'club' | 'upper' | 'suite'>>([]);
  const [coveredPreference, setCoveredPreference] = useState<'any' | 'covered' | 'uncovered'>('any');
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<Array<'value' | 'moderate' | 'premium' | 'luxury'>>([]);

  const handleSunPreferenceChange = (preference: 'any' | 'avoid' | 'prefer' | 'custom') => {
    setSunPreference(preference);
    updateFilter(preference, customMin, customMax, selectedLevels, coveredPreference, selectedPriceRanges);
  };

  const handleCustomRangeChange = (min: number, max: number) => {
    setCustomMin(min);
    setCustomMax(max);
    updateFilter(sunPreference, min, max, selectedLevels, coveredPreference, selectedPriceRanges);
  };

  const handleLevelToggle = (level: 'field' | 'lower' | 'club' | 'upper' | 'suite') => {
    const newLevels = selectedLevels.includes(level)
      ? selectedLevels.filter(l => l !== level)
      : [...selectedLevels, level];
    setSelectedLevels(newLevels);
    updateFilter(sunPreference, customMin, customMax, newLevels, coveredPreference, selectedPriceRanges);
  };

  const handleCoveredPreferenceChange = (preference: 'any' | 'covered' | 'uncovered') => {
    setCoveredPreference(preference);
    updateFilter(sunPreference, customMin, customMax, selectedLevels, preference, selectedPriceRanges);
  };

  const handlePriceRangeToggle = (priceRange: 'value' | 'moderate' | 'premium' | 'luxury') => {
    const newPriceRanges = selectedPriceRanges.includes(priceRange)
      ? selectedPriceRanges.filter(p => p !== priceRange)
      : [...selectedPriceRanges, priceRange];
    setSelectedPriceRanges(newPriceRanges);
    updateFilter(sunPreference, customMin, customMax, selectedLevels, coveredPreference, newPriceRanges);
  };

  const updateFilter = (
    preference: 'any' | 'avoid' | 'prefer' | 'custom',
    min: number,
    max: number,
    levels: Array<'field' | 'lower' | 'club' | 'upper' | 'suite'>,
    covered: 'any' | 'covered' | 'uncovered',
    priceRanges: Array<'value' | 'moderate' | 'premium' | 'luxury'>
  ) => {
    const criteria: SunFilterCriteria = {};

    // Set sun exposure criteria based on preference
    switch (preference) {
      case 'avoid':
        criteria.maxExposure = 20;
        break;
      case 'prefer':
        criteria.minExposure = 60;
        break;
      case 'custom':
        criteria.minExposure = min;
        criteria.maxExposure = max;
        break;
      case 'any':
      default:
        // No exposure restrictions
        break;
    }

    // Set level filter
    if (levels.length > 0) {
      criteria.levels = levels;
    }

    // Set covered preference
    if (covered !== 'any') {
      criteria.covered = covered === 'covered';
    }

    // Set price range filter
    if (priceRanges.length > 0) {
      criteria.priceRange = priceRanges;
    }

    onFilterChange(criteria);
  };

  const clearAllFilters = () => {
    setSunPreference('any');
    setCustomMin(0);
    setCustomMax(100);
    setSelectedLevels([]);
    setCoveredPreference('any');
    setSelectedPriceRanges([]);
    onFilterChange({});
  };

  return (
    <div className={`sun-exposure-filter ${disabled ? 'disabled' : ''}`}>
      <div className="filter-header">
        <h3>🎯 Section Filter</h3>
        <button 
          className="clear-filters-btn"
          onClick={clearAllFilters}
          disabled={disabled}
        >
          Clear All
        </button>
      </div>

      <div className="filter-section">
        <h4>☀️ Sun Preference</h4>
        <div className="radio-group">
          <label className="radio-option">
            <input
              type="radio"
              name="sun-preference"
              value="any"
              checked={sunPreference === 'any'}
              onChange={() => handleSunPreferenceChange('any')}
              disabled={disabled}
            />
            <span>Any (no preference)</span>
          </label>
          
          <label className="radio-option">
            <input
              type="radio"
              name="sun-preference"
              value="avoid"
              checked={sunPreference === 'avoid'}
              onChange={() => handleSunPreferenceChange('avoid')}
              disabled={disabled}
            />
            <span>Avoid sun (≤20% exposure)</span>
          </label>
          
          <label className="radio-option">
            <input
              type="radio"
              name="sun-preference"
              value="prefer"
              checked={sunPreference === 'prefer'}
              onChange={() => handleSunPreferenceChange('prefer')}
              disabled={disabled}
            />
            <span>Prefer sun (≥60% exposure)</span>
          </label>
          
          <label className="radio-option">
            <input
              type="radio"
              name="sun-preference"
              value="custom"
              checked={sunPreference === 'custom'}
              onChange={() => handleSunPreferenceChange('custom')}
              disabled={disabled}
            />
            <span>Custom range</span>
          </label>
        </div>

        {sunPreference === 'custom' && (
          <div className="custom-range">
            <div className="range-input">
              <label>Min exposure: {customMin}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={customMin}
                onChange={(e) => handleCustomRangeChange(Number(e.target.value), customMax)}
                disabled={disabled}
              />
            </div>
            <div className="range-input">
              <label>Max exposure: {customMax}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={customMax}
                onChange={(e) => handleCustomRangeChange(customMin, Number(e.target.value))}
                disabled={disabled}
              />
            </div>
          </div>
        )}
      </div>

      <div className="filter-section">
        <h4>🏟️ Seating Level</h4>
        <div className="checkbox-group">
          {[
            { value: 'field', label: 'Field Level', icon: '⚾' },
            { value: 'lower', label: 'Lower Bowl', icon: '🎫' },
            { value: 'club', label: 'Club Level', icon: '🥂' },
            { value: 'upper', label: 'Upper Deck', icon: '🎪' },
            { value: 'suite', label: 'Suites', icon: '👑' }
          ].map(level => (
            <label key={level.value} className="checkbox-option">
              <input
                type="checkbox"
                checked={selectedLevels.includes(level.value as any)}
                onChange={() => handleLevelToggle(level.value as any)}
                disabled={disabled}
              />
              <span>{level.icon} {level.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h4>🏛️ Coverage</h4>
        <div className="radio-group">
          <label className="radio-option">
            <input
              type="radio"
              name="covered-preference"
              value="any"
              checked={coveredPreference === 'any'}
              onChange={() => handleCoveredPreferenceChange('any')}
              disabled={disabled}
            />
            <span>Any</span>
          </label>
          
          <label className="radio-option">
            <input
              type="radio"
              name="covered-preference"
              value="covered"
              checked={coveredPreference === 'covered'}
              onChange={() => handleCoveredPreferenceChange('covered')}
              disabled={disabled}
            />
            <span>Covered sections only</span>
          </label>
          
          <label className="radio-option">
            <input
              type="radio"
              name="covered-preference"
              value="uncovered"
              checked={coveredPreference === 'uncovered'}
              onChange={() => handleCoveredPreferenceChange('uncovered')}
              disabled={disabled}
            />
            <span>Uncovered sections only</span>
          </label>
        </div>
      </div>

      <div className="filter-section">
        <h4>💰 Price Range</h4>
        <div className="checkbox-group">
          {[
            { value: 'value', label: 'Value', icon: '💵' },
            { value: 'moderate', label: 'Moderate', icon: '💶' },
            { value: 'premium', label: 'Premium', icon: '💷' },
            { value: 'luxury', label: 'Luxury', icon: '💎' }
          ].map(price => (
            <label key={price.value} className="checkbox-option">
              <input
                type="checkbox"
                checked={selectedPriceRanges.includes(price.value as any)}
                onChange={() => handlePriceRangeToggle(price.value as any)}
                disabled={disabled}
              />
              <span>{price.icon} {price.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};