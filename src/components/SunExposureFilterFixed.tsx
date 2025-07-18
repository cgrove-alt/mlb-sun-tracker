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

export const SunExposureFilterFixed: React.FC<SunExposureFilterProps> = ({
  onFilterChange,
  disabled = false
}) => {
  const [sunPreference, setSunPreference] = useState<'any' | 'avoid' | 'prefer' | 'custom'>('any');
  const [customMin, setCustomMin] = useState<number>(0);
  const [customMax, setCustomMax] = useState<number>(100);
  const [selectedLevels, setSelectedLevels] = useState<Array<'field' | 'lower' | 'club' | 'upper' | 'suite'>>([]);
  const [coveredPreference, setCoveredPreference] = useState<'any' | 'covered' | 'uncovered'>('any');
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<Array<'value' | 'moderate' | 'premium' | 'luxury'>>([]);
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    sunPreference: true,
    seatingLevel: false,
    coverage: false,
    priceRange: false
  });

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

  const clearFilters = () => {
    setSunPreference('any');
    setCustomMin(0);
    setCustomMax(100);
    setSelectedLevels([]);
    setCoveredPreference('any');
    setSelectedPriceRanges([]);
    onFilterChange({});
  };

  const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const activeFiltersCount = [
    sunPreference !== 'any' ? 1 : 0,
    selectedLevels.length > 0 ? 1 : 0,
    coveredPreference !== 'any' ? 1 : 0,
    selectedPriceRanges.length > 0 ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  return (
    <div 
      className={`sun-exposure-filter ${disabled ? 'disabled' : ''}`}
      role="region"
      aria-label="Filter options"
    >
      <div className="filter-header">
        <h3 id="section-filter-title" className="filter-title">
          <span className="filter-title-icon">🎯</span>
          Filter Sections
          {activeFiltersCount > 0 && (
            <span className="active-filters-count">{activeFiltersCount}</span>
          )}
        </h3>
        <button 
          onClick={clearFilters}
          onKeyDown={(e) => handleKeyDown(e, clearFilters)}
          disabled={disabled}
          className="clear-filters-btn"
          aria-label="Clear all filters"
        >
          Clear All
        </button>
      </div>

      <div className="filter-section">
        <button
          onClick={() => toggleSection('sunPreference')}
          onKeyDown={(e) => handleKeyDown(e, () => toggleSection('sunPreference'))}
          className="filter-section-header"
          aria-expanded={expandedSections.sunPreference}
          aria-controls="sun-preference-content"
        >
          <span className="filter-section-title" title="Choose your sun exposure preference to filter sections">
            <span className="filter-section-icon">☀️</span>
            Sun Preference
          </span>
          <span className={`filter-section-chevron ${expandedSections.sunPreference ? 'expanded' : ''}`}>
            ▼
          </span>
        </button>
        
        {expandedSections.sunPreference && (
          <div 
            id="sun-preference-content"
            className="filter-content"
            role="radiogroup"
            aria-labelledby="sun-preference-label"
            style={{ background: 'lightblue', padding: '10px', border: '1px solid blue' }}
          >
            <div>CONTENT IS RENDERING</div>
            <div className={`filter-option ${sunPreference === 'any' ? 'selected' : ''}`} style={{ display: 'flex', padding: '8px', background: 'white' }}>
              <input
                type="radio"
                id="sun-pref-any"
                name="sun-preference"
                value="any"
                checked={sunPreference === 'any'}
                onChange={() => handleSunPreferenceChange('any')}
                disabled={disabled}
              />
              <label htmlFor="sun-pref-any" className="filter-option-label">Any amount of sun</label>
            </div>
            
            <div className={`filter-option ${sunPreference === 'avoid' ? 'selected' : ''}`}>
              <input
                type="radio"
                id="sun-pref-avoid"
                name="sun-preference"
                value="avoid"
                checked={sunPreference === 'avoid'}
                onChange={() => handleSunPreferenceChange('avoid')}
                disabled={disabled}
              />
              <label htmlFor="sun-pref-avoid" className="filter-option-label">Avoid sun (≤20% exposure)</label>
            </div>
            
            <div className={`filter-option ${sunPreference === 'prefer' ? 'selected' : ''}`}>
              <input
                type="radio"
                id="sun-pref-prefer"
                name="sun-preference"
                value="prefer"
                checked={sunPreference === 'prefer'}
                onChange={() => handleSunPreferenceChange('prefer')}
                disabled={disabled}
              />
              <label htmlFor="sun-pref-prefer" className="filter-option-label">Prefer sun (≥60% exposure)</label>
            </div>
            
            <div className={`filter-option ${sunPreference === 'custom' ? 'selected' : ''}`}>
              <input
                type="radio"
                id="sun-pref-custom"
                name="sun-preference"
                value="custom"
                checked={sunPreference === 'custom'}
                onChange={() => handleSunPreferenceChange('custom')}
                disabled={disabled}
              />
              <label htmlFor="sun-pref-custom" className="filter-option-label">Custom range</label>
            </div>
          </div>
        )}

        {sunPreference === 'custom' && expandedSections.sunPreference && (
          <div className="custom-range-container">
            <div className="range-input-group">
              <label 
                htmlFor="custom-min-range"
                className="range-label"
              >
                Minimum Exposure: <span className="range-value">{customMin}%</span>
              </label>
              <input
                id="custom-min-range"
                type="range"
                min="0"
                max="100"
                value={customMin}
                onChange={(e) => handleCustomRangeChange(Number(e.target.value), customMax)}
                disabled={disabled}
                className="range-slider"
                aria-label={`Minimum exposure: ${customMin}%`}
              />
            </div>
            <div className="range-input-group">
              <label 
                htmlFor="custom-max-range"
                className="range-label"
              >
                Maximum Exposure: <span className="range-value">{customMax}%</span>
              </label>
              <input
                id="custom-max-range"
                type="range"
                min="0"
                max="100"
                value={customMax}
                onChange={(e) => handleCustomRangeChange(customMin, Number(e.target.value))}
                disabled={disabled}
                className="range-slider"
                aria-label={`Maximum exposure: ${customMax}%`}
              />
            </div>
          </div>
        )}
      </div>

      <div className="filter-section">
        <button
          onClick={() => toggleSection('seatingLevel')}
          onKeyDown={(e) => handleKeyDown(e, () => toggleSection('seatingLevel'))}
          className="filter-section-header"
          aria-expanded={expandedSections.seatingLevel}
          aria-controls="seating-level-content"
        >
          <span className="filter-section-title" title="Filter by seating level">
            <span className="filter-section-icon">🏟️</span>
            Seating Level
          </span>
          <span className={`filter-section-chevron ${expandedSections.seatingLevel ? 'expanded' : ''}`}>
            ▼
          </span>
        </button>
        
        {expandedSections.seatingLevel && (
          <div 
            id="seating-level-content"
            className="filter-content"
            role="group"
            aria-labelledby="seating-level-label"
          >
            {[
              { value: 'field', label: 'Field Level', icon: '⚾' },
              { value: 'lower', label: 'Lower Bowl', icon: '🎫' },
              { value: 'club', label: 'Club Level', icon: '🥂' },
              { value: 'upper', label: 'Upper Deck', icon: '🎪' },
              { value: 'suite', label: 'Suites', icon: '👑' }
            ].map(level => (
              <div key={level.value} className={`filter-option ${selectedLevels.includes(level.value as any) ? 'selected' : ''}`}>
                <input
                  type="checkbox"
                  id={`level-${level.value}`}
                  checked={selectedLevels.includes(level.value as any)}
                  onChange={() => handleLevelToggle(level.value as any)}
                  disabled={disabled}
                />
                <label htmlFor={`level-${level.value}`} className="filter-option-label">
                  <span className="filter-option-icon">{level.icon}</span>
                  {level.label}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="filter-section">
        <button
          onClick={() => toggleSection('coverage')}
          onKeyDown={(e) => handleKeyDown(e, () => toggleSection('coverage'))}
          className="filter-section-header"
          aria-expanded={expandedSections.coverage}
          aria-controls="coverage-content"
        >
          <span className="filter-section-title" title="Filter by roof coverage">
            <span className="filter-section-icon">🏛️</span>
            Coverage
          </span>
          <span className={`filter-section-chevron ${expandedSections.coverage ? 'expanded' : ''}`}>
            ▼
          </span>
        </button>
        
        {expandedSections.coverage && (
          <div 
            id="coverage-content"
            className="filter-content"
            role="radiogroup"
            aria-labelledby="coverage-label"
          >
            <div className={`filter-option ${coveredPreference === 'any' ? 'selected' : ''}`}>
              <input
                type="radio"
                id="coverage-any"
                name="covered-preference"
                value="any"
                checked={coveredPreference === 'any'}
                onChange={() => handleCoveredPreferenceChange('any')}
                disabled={disabled}
              />
              <label htmlFor="coverage-any" className="filter-option-label">Any coverage</label>
            </div>
            
            <div className={`filter-option ${coveredPreference === 'covered' ? 'selected' : ''}`}>
              <input
                type="radio"
                id="coverage-covered"
                name="covered-preference"
                value="covered"
                checked={coveredPreference === 'covered'}
                onChange={() => handleCoveredPreferenceChange('covered')}
                disabled={disabled}
              />
              <label htmlFor="coverage-covered" className="filter-option-label">Covered sections only</label>
            </div>
            
            <div className={`filter-option ${coveredPreference === 'uncovered' ? 'selected' : ''}`}>
              <input
                type="radio"
                id="coverage-uncovered"
                name="covered-preference"
                value="uncovered"
                checked={coveredPreference === 'uncovered'}
                onChange={() => handleCoveredPreferenceChange('uncovered')}
                disabled={disabled}
              />
              <label htmlFor="coverage-uncovered" className="filter-option-label">Uncovered sections only</label>
            </div>
          </div>
        )}
      </div>

      <div className="filter-section">
        <button
          onClick={() => toggleSection('priceRange')}
          onKeyDown={(e) => handleKeyDown(e, () => toggleSection('priceRange'))}
          className="filter-section-header"
          aria-expanded={expandedSections.priceRange}
          aria-controls="price-range-content"
        >
          <span className="filter-section-title" title="Filter by typical price range">
            <span className="filter-section-icon">💰</span>
            Price Range
          </span>
          <span className={`filter-section-chevron ${expandedSections.priceRange ? 'expanded' : ''}`}>
            ▼
          </span>
        </button>
        
        {expandedSections.priceRange && (
          <div 
            id="price-range-content"
            className="filter-content"
            role="group"
            aria-labelledby="price-range-label"
          >
            {[
              { value: 'value', label: 'Value', icon: '💵' },
              { value: 'moderate', label: 'Moderate', icon: '💶' },
              { value: 'premium', label: 'Premium', icon: '💷' },
              { value: 'luxury', label: 'Luxury', icon: '💎' }
            ].map(price => (
              <div key={price.value} className={`filter-option ${selectedPriceRanges.includes(price.value as any) ? 'selected' : ''}`}>
                <input
                  type="checkbox"
                  id={`price-${price.value}`}
                  checked={selectedPriceRanges.includes(price.value as any)}
                  onChange={() => handlePriceRangeToggle(price.value as any)}
                  disabled={disabled}
                />
                <label htmlFor={`price-${price.value}`} className="filter-option-label">
                  <span className="filter-option-icon">{price.icon}</span>
                  {price.label}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};