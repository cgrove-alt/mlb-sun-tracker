import React, { useState } from 'react';
import { Tooltip } from './Tooltip';

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

  return (
    <div 
      style={{
        background: 'white',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        marginBottom: '20px',
        width: '100%',
        maxWidth: '400px',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}
      role="region"
      aria-label="Section filtering options"
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        paddingBottom: '10px',
        borderBottom: '2px solid #f0f0f0'
      }}>
        <h3 id="section-filter-title" style={{margin: 0, color: '#333', fontSize: '1.2em'}}>
          🎯 Section Filter
        </h3>
        <button 
          onClick={clearFilters}
          onKeyDown={(e) => handleKeyDown(e, clearFilters)}
          disabled={disabled}
          style={{
            background: '#f8f9fa',
            border: '1px solid #dee2e6',
            borderRadius: '6px',
            padding: '6px 12px',
            fontSize: '0.85em',
            color: '#6c757d',
            cursor: disabled ? 'not-allowed' : 'pointer',
            outline: 'none'
          }}
          aria-label="Clear all filters"
        >
          Clear All
        </button>
      </div>

      <div style={{marginBottom: '24px'}}>
        <button
          onClick={() => toggleSection('sunPreference')}
          onKeyDown={(e) => handleKeyDown(e, () => toggleSection('sunPreference'))}
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'none',
            border: 'none',
            padding: '8px 0',
            margin: '0 0 12px 0',
            color: '#495057',
            fontSize: '1em',
            fontWeight: 600,
            cursor: 'pointer',
            borderBottom: '1px solid #dee2e6'
          }}
          aria-expanded={expandedSections.sunPreference}
          aria-controls="sun-preference-content"
        >
          <Tooltip content="Filter sections based on how much direct sunlight they receive during the game">
            <span>☀️ Sun Preference</span>
          </Tooltip>
          <span style={{fontSize: '0.8em', transition: 'transform 0.2s ease', transform: expandedSections.sunPreference ? 'rotate(180deg)' : 'rotate(0deg)'}}>
            ▼
          </span>
        </button>
        
        {expandedSections.sunPreference && (
          <div 
            id="sun-preference-content"
            style={{display: 'flex', flexDirection: 'column', gap: '8px'}}
            role="radiogroup"
            aria-labelledby="sun-preference-label"
          >
          <label style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px', borderRadius: '6px', border: '1px solid #dee2e6'}}>
            <input
              type="radio"
              name="sun-preference"
              value="any"
              checked={sunPreference === 'any'}
              onChange={() => handleSunPreferenceChange('any')}
              disabled={disabled}
              style={{margin: 0, cursor: 'pointer'}}
              aria-describedby="sun-any-desc"
            />
            <span id="sun-any-desc" style={{fontSize: '0.9em', color: '#333'}}>Any (no preference)</span>
          </label>
          
          <label style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px', borderRadius: '6px', border: '1px solid #dee2e6'}}>
            <input
              type="radio"
              name="sun-preference"
              value="avoid"
              checked={sunPreference === 'avoid'}
              onChange={() => handleSunPreferenceChange('avoid')}
              disabled={disabled}
              style={{margin: 0, cursor: 'pointer'}}
              aria-describedby="sun-avoid-desc"
            />
            <span id="sun-avoid-desc" style={{fontSize: '0.9em', color: '#333'}}>Avoid sun (≤20% exposure)</span>
          </label>
          
          <label style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px', borderRadius: '6px', border: '1px solid #dee2e6'}}>
            <input
              type="radio"
              name="sun-preference"
              value="prefer"
              checked={sunPreference === 'prefer'}
              onChange={() => handleSunPreferenceChange('prefer')}
              disabled={disabled}
              style={{margin: 0, cursor: 'pointer'}}
              aria-describedby="sun-prefer-desc"
            />
            <span id="sun-prefer-desc" style={{fontSize: '0.9em', color: '#333'}}>Prefer sun (≥60% exposure)</span>
          </label>
          
          <label style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px', borderRadius: '6px', border: '1px solid #dee2e6'}}>
            <input
              type="radio"
              name="sun-preference"
              value="custom"
              checked={sunPreference === 'custom'}
              onChange={() => handleSunPreferenceChange('custom')}
              disabled={disabled}
              style={{margin: 0, cursor: 'pointer'}}
              aria-describedby="sun-custom-desc"
            />
            <span id="sun-custom-desc" style={{fontSize: '0.9em', color: '#333'}}>Custom range</span>
          </label>
          </div>
        )}

        {sunPreference === 'custom' && expandedSections.sunPreference && (
          <div style={{marginTop: '12px', padding: '12px', background: '#f8f9fa', borderRadius: '6px'}}>
            <div style={{marginBottom: '12px'}}>
              <label 
                htmlFor="custom-min-range"
                style={{display: 'block', marginBottom: '6px', fontSize: '0.85em', color: '#6c757d', fontWeight: 500}}
              >
                Min exposure: {customMin}%
              </label>
              <input
                id="custom-min-range"
                type="range"
                min="0"
                max="100"
                value={customMin}
                onChange={(e) => handleCustomRangeChange(Number(e.target.value), customMax)}
                disabled={disabled}
                style={{width: '100%', height: '6px', borderRadius: '3px', background: '#dee2e6', outline: 'none', cursor: 'pointer'}}
                aria-label={`Minimum sun exposure percentage: ${customMin}%`}
              />
            </div>
            <div style={{marginBottom: '0'}}>
              <label 
                htmlFor="custom-max-range"
                style={{display: 'block', marginBottom: '6px', fontSize: '0.85em', color: '#6c757d', fontWeight: 500}}
              >
                Max exposure: {customMax}%
              </label>
              <input
                id="custom-max-range"
                type="range"
                min="0"
                max="100"
                value={customMax}
                onChange={(e) => handleCustomRangeChange(customMin, Number(e.target.value))}
                disabled={disabled}
                style={{width: '100%', height: '6px', borderRadius: '3px', background: '#dee2e6', outline: 'none', cursor: 'pointer'}}
                aria-label={`Maximum sun exposure percentage: ${customMax}%`}
              />
            </div>
          </div>
        )}
      </div>

      <div style={{marginBottom: '24px'}}>
        <button
          onClick={() => toggleSection('seatingLevel')}
          onKeyDown={(e) => handleKeyDown(e, () => toggleSection('seatingLevel'))}
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'none',
            border: 'none',
            padding: '8px 0',
            margin: '0 0 12px 0',
            color: '#495057',
            fontSize: '1em',
            fontWeight: 600,
            cursor: 'pointer',
            borderBottom: '1px solid #dee2e6'
          }}
          aria-expanded={expandedSections.seatingLevel}
          aria-controls="seating-level-content"
        >
          <Tooltip content="Filter by the level of seating in the stadium (field level closest to the action, upper deck highest up)">
            <span>🏟️ Seating Level</span>
          </Tooltip>
          <span style={{fontSize: '0.8em', transition: 'transform 0.2s ease', transform: expandedSections.seatingLevel ? 'rotate(180deg)' : 'rotate(0deg)'}}>
            ▼
          </span>
        </button>
        
        {expandedSections.seatingLevel && (
          <div 
            id="seating-level-content"
            style={{display: 'flex', flexDirection: 'column', gap: '8px'}}
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
            <label key={level.value} style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px', borderRadius: '6px', border: '1px solid #dee2e6'}}>
              <input
                type="checkbox"
                checked={selectedLevels.includes(level.value as any)}
                onChange={() => handleLevelToggle(level.value as any)}
                disabled={disabled}
                style={{margin: 0, cursor: 'pointer'}}
                aria-describedby={`level-${level.value}-desc`}
              />
              <span id={`level-${level.value}-desc`} style={{fontSize: '0.9em', color: '#333'}}>{level.icon} {level.label}</span>
            </label>
          ))}
          </div>
        )}
      </div>

      <div style={{marginBottom: '24px'}}>
        <button
          onClick={() => toggleSection('coverage')}
          onKeyDown={(e) => handleKeyDown(e, () => toggleSection('coverage'))}
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'none',
            border: 'none',
            padding: '8px 0',
            margin: '0 0 12px 0',
            color: '#495057',
            fontSize: '1em',
            fontWeight: 600,
            cursor: 'pointer',
            borderBottom: '1px solid #dee2e6'
          }}
          aria-expanded={expandedSections.coverage}
          aria-controls="coverage-content"
        >
          <Tooltip content="Filter by whether sections are covered by a roof or overhang, providing protection from sun and weather">
            <span>🏛️ Coverage</span>
          </Tooltip>
          <span style={{fontSize: '0.8em', transition: 'transform 0.2s ease', transform: expandedSections.coverage ? 'rotate(180deg)' : 'rotate(0deg)'}}>
            ▼
          </span>
        </button>
        
        {expandedSections.coverage && (
        <div 
          style={{display: 'flex', flexDirection: 'column', gap: '8px'}}
          role="radiogroup"
          aria-labelledby="coverage-label"
        >
          <label style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px', borderRadius: '6px', border: '1px solid #dee2e6'}}>
            <input
              type="radio"
              name="covered-preference"
              value="any"
              checked={coveredPreference === 'any'}
              onChange={() => handleCoveredPreferenceChange('any')}
              disabled={disabled}
              style={{margin: 0, cursor: 'pointer'}}
              aria-describedby="coverage-any-desc"
            />
            <span id="coverage-any-desc" style={{fontSize: '0.9em', color: '#333'}}>Any</span>
          </label>
          
          <label style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px', borderRadius: '6px', border: '1px solid #dee2e6'}}>
            <input
              type="radio"
              name="covered-preference"
              value="covered"
              checked={coveredPreference === 'covered'}
              onChange={() => handleCoveredPreferenceChange('covered')}
              disabled={disabled}
              style={{margin: 0, cursor: 'pointer'}}
              aria-describedby="coverage-covered-desc"
            />
            <span id="coverage-covered-desc" style={{fontSize: '0.9em', color: '#333'}}>Covered sections only</span>
          </label>
          
          <label style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px', borderRadius: '6px', border: '1px solid #dee2e6'}}>
            <input
              type="radio"
              name="covered-preference"
              value="uncovered"
              checked={coveredPreference === 'uncovered'}
              onChange={() => handleCoveredPreferenceChange('uncovered')}
              disabled={disabled}
              style={{margin: 0, cursor: 'pointer'}}
              aria-describedby="coverage-uncovered-desc"
            />
            <span id="coverage-uncovered-desc" style={{fontSize: '0.9em', color: '#333'}}>Uncovered sections only</span>
          </label>
        </div>
        )}
      </div>

      <div style={{marginBottom: '24px'}}>
        <button
          onClick={() => toggleSection('priceRange')}
          onKeyDown={(e) => handleKeyDown(e, () => toggleSection('priceRange'))}
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'none',
            border: 'none',
            padding: '8px 0',
            margin: '0 0 12px 0',
            color: '#495057',
            fontSize: '1em',
            fontWeight: 600,
            cursor: 'pointer',
            borderBottom: '1px solid #dee2e6'
          }}
          aria-expanded={expandedSections.priceRange}
          aria-controls="price-range-content"
        >
          <Tooltip content="Filter by the typical price range for tickets in different sections (value = budget-friendly, luxury = premium pricing)">
            <span>💰 Price Range</span>
          </Tooltip>
          <span style={{fontSize: '0.8em', transition: 'transform 0.2s ease', transform: expandedSections.priceRange ? 'rotate(180deg)' : 'rotate(0deg)'}}>
            ▼
          </span>
        </button>
        
        {expandedSections.priceRange && (
        <div 
          style={{display: 'flex', flexDirection: 'column', gap: '8px'}}
          role="group"
          aria-labelledby="price-range-label"
        >
          {[
            { value: 'value', label: 'Value', icon: '💵' },
            { value: 'moderate', label: 'Moderate', icon: '💶' },
            { value: 'premium', label: 'Premium', icon: '💷' },
            { value: 'luxury', label: 'Luxury', icon: '💎' }
          ].map(price => (
            <label key={price.value} style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px', borderRadius: '6px', border: '1px solid #dee2e6'}}>
              <input
                type="checkbox"
                checked={selectedPriceRanges.includes(price.value as any)}
                onChange={() => handlePriceRangeToggle(price.value as any)}
                disabled={disabled}
                style={{margin: 0, cursor: 'pointer'}}
                aria-describedby={`price-${price.value}-desc`}
              />
              <span id={`price-${price.value}-desc`} style={{fontSize: '0.9em', color: '#333'}}>{price.icon} {price.label}</span>
            </label>
          ))}
        </div>
        )}
      </div>
    </div>
  );
};