import React, { useState, useEffect, useRef } from 'react';
import './EnhancedSunFilter.css';
import { FilterIcon, CloseIcon, ChevronDownIcon } from './common/Icons';

export interface SunFilterCriteria {
  sunPreference?: 'any' | 'sun' | 'shade';
  minExposure?: number;
  maxExposure?: number;
  maxSunExposure?: number;
  levels?: Array<'field' | 'lower' | 'club' | 'upper' | 'suite'>;
  seatingAreas?: Array<string>;
  covered?: boolean;
  priceRange?: Array<'value' | 'moderate' | 'premium' | 'luxury'>;
}

interface EnhancedSunFilterProps {
  onFilterChange: (criteria: SunFilterCriteria) => void;
  disabled?: boolean;
  isMobile?: boolean;
}

interface FilterChip {
  id: string;
  label: string;
  category: 'sun' | 'level' | 'coverage' | 'price';
}

export const EnhancedSunFilter: React.FC<EnhancedSunFilterProps> = ({
  onFilterChange,
  disabled = false,
  isMobile = false
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(() => {
    // Load saved state from localStorage, default to collapsed
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('filterPanelCollapsed');
      return saved ? JSON.parse(saved) : true;
    }
    return true;
  });
  const [sunPreference, setSunPreference] = useState<'any' | 'avoid' | 'prefer' | 'custom'>('any');
  const [customMin, setCustomMin] = useState<number>(0);
  const [customMax, setCustomMax] = useState<number>(100);
  const [selectedLevels, setSelectedLevels] = useState<Array<'field' | 'lower' | 'club' | 'upper' | 'suite'>>([]);
  const [coveredPreference, setCoveredPreference] = useState<'any' | 'covered' | 'uncovered'>('any');
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<Array<'value' | 'moderate' | 'premium' | 'luxury'>>([]);
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    sunPreference: false,
    seatingLevel: false,
    coverage: false,
    priceRange: false
  });
  const [activeChips, setActiveChips] = useState<FilterChip[]>([]);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Update active chips whenever filters change
  useEffect(() => {
    const chips: FilterChip[] = [];
    
    if (sunPreference !== 'any') {
      let label = '';
      switch (sunPreference) {
        case 'avoid':
          label = 'Avoid sun (≤20%)';
          break;
        case 'prefer':
          label = 'Prefer sun (≥60%)';
          break;
        case 'custom':
          label = `Sun ${customMin}%-${customMax}%`;
          break;
      }
      chips.push({ id: 'sun', label, category: 'sun' });
    }
    
    selectedLevels.forEach(level => {
      const labels: Record<string, string> = {
        field: 'Field Level',
        lower: 'Lower Bowl',
        club: 'Club Level',
        upper: 'Upper Deck',
        suite: 'Suites'
      };
      chips.push({ id: `level-${level}`, label: labels[level], category: 'level' });
    });
    
    if (coveredPreference !== 'any') {
      chips.push({
        id: 'coverage',
        label: coveredPreference === 'covered' ? 'Covered only' : 'Uncovered only',
        category: 'coverage'
      });
    }
    
    selectedPriceRanges.forEach(price => {
      const labels: Record<string, string> = {
        value: 'Value',
        moderate: 'Moderate',
        premium: 'Premium',
        luxury: 'Luxury'
      };
      chips.push({ id: `price-${price}`, label: labels[price], category: 'price' });
    });
    
    setActiveChips(chips);
  }, [sunPreference, customMin, customMax, selectedLevels, coveredPreference, selectedPriceRanges]);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      if (mobile !== isMobile) {
        // Mobile state changed, could trigger re-render if needed
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [isMobile]);

  // Handle drawer backdrop click
  useEffect(() => {
    const handleBackdropClick = (e: MouseEvent) => {
      if (isDrawerOpen && drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setIsDrawerOpen(false);
      }
    };
    
    if (isDrawerOpen) {
      document.addEventListener('mousedown', handleBackdropClick);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.removeEventListener('mousedown', handleBackdropClick);
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  const updateFilter = (
    preference: 'any' | 'avoid' | 'prefer' | 'custom',
    min: number,
    max: number,
    levels: Array<'field' | 'lower' | 'club' | 'upper' | 'suite'>,
    covered: 'any' | 'covered' | 'uncovered',
    priceRanges: Array<'value' | 'moderate' | 'premium' | 'luxury'>
  ) => {
    const criteria: SunFilterCriteria = {};

    switch (preference) {
      case 'avoid':
        criteria.sunPreference = 'shade';
        criteria.maxExposure = 20;
        break;
      case 'prefer':
        criteria.sunPreference = 'sun';
        criteria.minExposure = 60;
        break;
      case 'custom':
        criteria.minExposure = min;
        criteria.maxExposure = max;
        break;
      case 'any':
      default:
        criteria.sunPreference = 'any';
        break;
    }

    if (levels.length > 0) {
      criteria.levels = levels;
    }

    if (covered !== 'any') {
      criteria.covered = covered === 'covered';
    }

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

  const removeChip = (chipId: string) => {
    if (chipId === 'sun') {
      handleSunPreferenceChange('any');
    } else if (chipId.startsWith('level-')) {
      const level = chipId.replace('level-', '') as any;
      handleLevelToggle(level);
    } else if (chipId === 'coverage') {
      handleCoveredPreferenceChange('any');
    } else if (chipId.startsWith('price-')) {
      const price = chipId.replace('price-', '') as any;
      handlePriceRangeToggle(price);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleDesktopCollapse = () => {
    const newState = !isDesktopCollapsed;
    setIsDesktopCollapsed(newState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('filterPanelCollapsed', JSON.stringify(newState));
    }
  };

  const expandAllSections = () => {
    setExpandedSections({
      sunPreference: true,
      seatingLevel: true,
      coverage: true,
      priceRange: true
    });
  };

  const collapseAllSections = () => {
    setExpandedSections({
      sunPreference: false,
      seatingLevel: false,
      coverage: false,
      priceRange: false
    });
  };

  const activeFiltersCount = activeChips.length;

  const FilterContent = () => (
    <>
      <div className="filter-section">
        <button
          onClick={() => toggleSection('sunPreference')}
          className={`filter-section-header ${expandedSections.sunPreference ? 'expanded' : ''}`}
          aria-expanded={expandedSections.sunPreference}
          aria-controls="sun-preference-content"
        >
          <span className="filter-section-title">
            <span className="filter-section-icon">☀️</span>
            Sun Preference
          </span>
          <ChevronDownIcon 
            size={16} 
            className={`filter-section-chevron ${expandedSections.sunPreference ? 'expanded' : ''}`}
          />
        </button>
        
        {expandedSections.sunPreference && (
          <div id="sun-preference-content" className="filter-content">
            <div className={`filter-option ${sunPreference === 'any' ? 'selected' : ''}`}>
              <input
                type="radio"
                id="sun-pref-any"
                name="sun-preference"
                value="any"
                checked={sunPreference === 'any'}
                onChange={() => handleSunPreferenceChange('any')}
                disabled={disabled}
              />
              <label htmlFor="sun-pref-any">Any amount of sun</label>
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
              <label htmlFor="sun-pref-avoid">Avoid sun (≤20% of game)</label>
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
              <label htmlFor="sun-pref-prefer">Prefer sun (≥60% of game)</label>
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
              <label htmlFor="sun-pref-custom">Custom range</label>
            </div>
            
            {sunPreference === 'custom' && (
              <div className="custom-range-container">
                <div className="range-input-group">
                  <label htmlFor="custom-min-range">
                    Min: <span className="range-value">{customMin}%</span>
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
                  />
                </div>
                <div className="range-input-group">
                  <label htmlFor="custom-max-range">
                    Max: <span className="range-value">{customMax}%</span>
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
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="filter-section">
        <button
          onClick={() => toggleSection('seatingLevel')}
          className={`filter-section-header ${expandedSections.seatingLevel ? 'expanded' : ''}`}
          aria-expanded={expandedSections.seatingLevel}
          aria-controls="seating-level-content"
        >
          <span className="filter-section-title">
            <span className="filter-section-icon">🏟️</span>
            Seating Level
          </span>
          <ChevronDownIcon 
            size={16} 
            className={`filter-section-chevron ${expandedSections.seatingLevel ? 'expanded' : ''}`}
          />
        </button>
        
        {expandedSections.seatingLevel && (
          <div id="seating-level-content" className="filter-content">
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
                <label htmlFor={`level-${level.value}`}>
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
          className={`filter-section-header ${expandedSections.coverage ? 'expanded' : ''}`}
          aria-expanded={expandedSections.coverage}
          aria-controls="coverage-content"
        >
          <span className="filter-section-title">
            <span className="filter-section-icon">🏛️</span>
            Coverage
          </span>
          <ChevronDownIcon 
            size={16} 
            className={`filter-section-chevron ${expandedSections.coverage ? 'expanded' : ''}`}
          />
        </button>
        
        {expandedSections.coverage && (
          <div id="coverage-content" className="filter-content">
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
              <label htmlFor="coverage-any">Any coverage</label>
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
              <label htmlFor="coverage-covered">Covered sections only</label>
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
              <label htmlFor="coverage-uncovered">Uncovered sections only</label>
            </div>
          </div>
        )}
      </div>

      <div className="filter-section">
        <button
          onClick={() => toggleSection('priceRange')}
          className={`filter-section-header ${expandedSections.priceRange ? 'expanded' : ''}`}
          aria-expanded={expandedSections.priceRange}
          aria-controls="price-range-content"
        >
          <span className="filter-section-title">
            <span className="filter-section-icon">💰</span>
            Price Range
          </span>
          <ChevronDownIcon 
            size={16} 
            className={`filter-section-chevron ${expandedSections.priceRange ? 'expanded' : ''}`}
          />
        </button>
        
        {expandedSections.priceRange && (
          <div id="price-range-content" className="filter-content">
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
                <label htmlFor={`price-${price.value}`}>
                  <span className="filter-option-icon">{price.icon}</span>
                  {price.label}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );

  // Mobile drawer version
  if (isMobile || window.innerWidth < 768) {
    return (
      <>
        {/* Filter chips */}
        {activeChips.length > 0 && (
          <div className="filter-chips-container">
            <div className="filter-chips">
              {activeChips.map(chip => (
                <div key={chip.id} className={`filter-chip filter-chip-${chip.category}`}>
                  <span>{chip.label}</span>
                  <button
                    onClick={() => removeChip(chip.id)}
                    className="chip-remove"
                    aria-label={`Remove ${chip.label} filter`}
                  >
                    <CloseIcon size={14} />
                  </button>
                </div>
              ))}
              {activeChips.length > 1 && (
                <button onClick={clearFilters} className="clear-all-chips">
                  Clear all
                </button>
              )}
            </div>
          </div>
        )}
        
        {/* Mobile filter button */}
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="mobile-filter-button"
          disabled={disabled}
        >
          <FilterIcon size={20} />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="filter-count">{activeFiltersCount}</span>
          )}
        </button>
        
        {/* Mobile drawer */}
        {isDrawerOpen && (
          <>
            <div className="drawer-backdrop" aria-hidden="true" />
            <div className="filter-drawer" ref={drawerRef}>
              <div className="drawer-header">
                <h3>Filter Sections</h3>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="drawer-close"
                  aria-label="Close filters"
                >
                  <CloseIcon size={24} />
                </button>
              </div>
              
              {activeFiltersCount > 0 && (
                <div className="drawer-summary">
                  <span>{activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} applied</span>
                  <button onClick={clearFilters} className="clear-filters-btn">
                    Clear all
                  </button>
                </div>
              )}
              
              <div className="drawer-content">
                <FilterContent />
              </div>
              
              <div className="drawer-footer">
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="apply-filters-btn"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </>
        )}
      </>
    );
  }

  // Desktop version
  return (
    <div className={`enhanced-sun-filter ${disabled ? 'disabled' : ''}`}>
      <div className="filter-header">
        <h3 className="filter-title">
          <span className="filter-title-icon">🎯</span>
          Filter Sections
          {activeFiltersCount > 0 && (
            <span className="active-filters-count">{activeFiltersCount}</span>
          )}
        </h3>
        <div className="filter-header-actions">
          <button
            onClick={toggleDesktopCollapse}
            className="collapse-toggle-btn"
            aria-expanded={!isDesktopCollapsed}
            aria-controls="filter-panel-content"
            title={isDesktopCollapsed ? 'Show filters' : 'Hide filters'}
          >
            <ChevronDownIcon
              size={16}
              className={`chevron-icon ${isDesktopCollapsed ? '' : 'rotated'}`}
            />
            {isDesktopCollapsed ? 'Show Filters' : 'Hide Filters'}
          </button>
          {activeFiltersCount > 0 && (
            <button onClick={clearFilters} className="clear-filters-btn">
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Filter chips for desktop */}
      {activeChips.length > 0 && (
        <div className="filter-chips">
          {activeChips.map(chip => (
            <div key={chip.id} className={`filter-chip filter-chip-${chip.category}`}>
              <span>{chip.label}</span>
              <button
                onClick={() => removeChip(chip.id)}
                className="chip-remove"
                aria-label={`Remove ${chip.label} filter`}
              >
                <CloseIcon size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Collapsible filter panel */}
      {!isDesktopCollapsed && (
        <div id="filter-panel-content" className="filter-panel-content">
          {/* Expand/Collapse All buttons */}
          <div className="filter-panel-controls">
            <button onClick={expandAllSections} className="expand-collapse-btn">
              Expand All
            </button>
            <button onClick={collapseAllSections} className="expand-collapse-btn">
              Collapse All
            </button>
          </div>

          <FilterContent />
        </div>
      )}
    </div>
  );
};