import React, { useState, useMemo } from 'react';
import { SunFilterCriteria } from './SunExposureFilterFixed';
import { SeatingSectionSun } from '../utils/sunCalculations';
import { MobileFilterPortal } from './MobileFilterPortal';
import './MobileFilterSheet.css';

interface MobileFilterSheetProps {
  onFilterChange: (criteria: SunFilterCriteria) => void;
  currentFilters: SunFilterCriteria;
  resultCount: number;
  allSections?: SeatingSectionSun[];
}

export const MobileFilterSheet: React.FC<MobileFilterSheetProps> = ({
  onFilterChange,
  currentFilters,
  resultCount,
  allSections = []
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<SunFilterCriteria>(currentFilters);

  // Simple body scroll lock when filter is open
  React.useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      
      // Add class to body for styling
      document.body.classList.add('mobile-filter-open');
      
      return () => {
        // Remove class from body
        document.body.classList.remove('mobile-filter-open');
        
        // Restore scroll position if needed
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  // Sync local filters with current filters when they change
  React.useEffect(() => {
    setLocalFilters(currentFilters);
  }, [currentFilters]);

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
    setIsOpen(false);
  };

  const handleReset = () => {
    setLocalFilters({});
    onFilterChange({});
    setIsOpen(false);
  };

  const activeFilterCount = Object.keys(currentFilters).length;

  // Calculate preview count based on local filters
  const previewCount = useMemo(() => {
    if (!allSections.length) return resultCount;
    
    let filtered = [...allSections];
    
    // Apply sun preference filter
    if (localFilters.sunPreference) {
      if (localFilters.sunPreference === 'sun') {
        filtered = filtered.filter(s => s.sunExposure >= 60);
      } else if (localFilters.sunPreference === 'shade') {
        filtered = filtered.filter(s => s.sunExposure <= 20);
      }
    }
    
    // Apply max sun exposure filter
    if (localFilters.maxSunExposure !== undefined) {
      const maxExposure = localFilters.maxSunExposure;
      filtered = filtered.filter(s => s.sunExposure <= maxExposure);
    }
    
    // Apply seating areas filter
    if (localFilters.seatingAreas && localFilters.seatingAreas.length > 0) {
      filtered = filtered.filter(s => {
        const sectionLevel = s.section.level.charAt(0).toUpperCase() + s.section.level.slice(1) + ' Level';
        return localFilters.seatingAreas!.some(area => 
          area.toLowerCase() === sectionLevel.toLowerCase() ||
          area.toLowerCase() === s.section.level.toLowerCase()
        );
      });
    }
    
    // Apply price range filter
    if (localFilters.priceRange && localFilters.priceRange.length > 0) {
      filtered = filtered.filter(s => 
        s.section.price && localFilters.priceRange!.includes(s.section.price)
      );
    }
    
    return filtered.length;
  }, [localFilters, allSections]);

  return (
    <>
      <button 
        className="mobile-filter-trigger"
        onClick={() => setIsOpen(true)}
        aria-label="Open filters"
      >
        <div className="mobile-filter-trigger-content">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"/>
          </svg>
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="mobile-filter-badge">{activeFilterCount}</span>
          )}
        </div>
      </button>

      <MobileFilterPortal isOpen={isOpen}>
        <div className="mobile-filter-sheet">
          <div className="mobile-filter-overlay" onClick={() => setIsOpen(false)} />
          <div className="mobile-filter-content" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-filter-header">
              <h2>Filter Sections</h2>
              <button 
                className="mobile-filter-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close filters"
                type="button"
              >
                ✕
              </button>
            </div>

            <div className="mobile-filter-body">
              {/* Sun Preference */}
              <div className="mobile-filter-section">
                <h3>Sun Preference</h3>
                <div className="mobile-filter-options">
                  <label className={`mobile-filter-option ${localFilters.sunPreference === 'any' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="sunPreference"
                      value="any"
                      checked={localFilters.sunPreference === 'any'}
                      onChange={() => setLocalFilters({...localFilters, sunPreference: 'any'})}
                    />
                    <span className="mobile-filter-option-content">
                      <span className="mobile-filter-option-icon">🌤️</span>
                      <span>Any amount</span>
                    </span>
                  </label>
                  <label className={`mobile-filter-option ${localFilters.sunPreference === 'sun' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="sunPreference"
                      value="sun"
                      checked={localFilters.sunPreference === 'sun'}
                      onChange={() => setLocalFilters({...localFilters, sunPreference: 'sun'})}
                    />
                    <span className="mobile-filter-option-content">
                      <span className="mobile-filter-option-icon">☀️</span>
                      <span>More sun (≥60% of game)</span>
                    </span>
                  </label>
                  <label className={`mobile-filter-option ${localFilters.sunPreference === 'shade' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="sunPreference"
                      value="shade"
                      checked={localFilters.sunPreference === 'shade'}
                      onChange={() => setLocalFilters({...localFilters, sunPreference: 'shade'})}
                    />
                    <span className="mobile-filter-option-content">
                      <span className="mobile-filter-option-icon">🌂</span>
                      <span>More shade (≤20% of game)</span>
                    </span>
                  </label>
                </div>
              </div>

              {/* Maximum Time in Sun */}
              <div className="mobile-filter-section">
                <h3>Maximum Time in Sun</h3>
                <div className="mobile-filter-slider">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={localFilters.maxSunExposure || 100}
                    onChange={(e) => setLocalFilters({...localFilters, maxSunExposure: parseInt(e.target.value)})}
                    onInput={(e) => setLocalFilters({...localFilters, maxSunExposure: parseInt((e.target as HTMLInputElement).value)})}
                    className="mobile-filter-range"
                    style={{
                      '--value': `${localFilters.maxSunExposure || 100}%`
                    } as React.CSSProperties}
                  />
                  <div className="mobile-filter-range-labels">
                    <span>0%</span>
                    <span className="mobile-filter-range-value">{localFilters.maxSunExposure || 100}%</span>
                    <span>100%</span>
                  </div>
                  <p className="mobile-filter-help-text">
                    {localFilters.maxSunExposure ? `Up to ${Math.round((localFilters.maxSunExposure / 100) * 180)} minutes of sun` : 'No limit'}
                  </p>
                </div>
              </div>

              {/* Seating Areas */}
              <div className="mobile-filter-section">
                <h3>Seating Areas</h3>
                <div className="mobile-filter-chips">
                  {['Field Level', 'Lower Level', 'Upper Level', 'Outfield'].map(area => (
                    <button
                      key={area}
                      className={`mobile-filter-chip ${localFilters.seatingAreas?.includes(area) ? 'selected' : ''}`}
                      onClick={() => {
                        const areas = localFilters.seatingAreas || [];
                        const newAreas = areas.includes(area)
                          ? areas.filter(a => a !== area)
                          : [...areas, area];
                        setLocalFilters({...localFilters, seatingAreas: newAreas});
                      }}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mobile-filter-section">
                <h3>Price Range</h3>
                <div className="mobile-filter-price-options">
                  {[
                    { value: 'value', label: 'Value', icon: '💵', description: 'Upper deck, bleachers' },
                    { value: 'moderate', label: 'Moderate', icon: '💶', description: 'Lower bowl, main level' },
                    { value: 'premium', label: 'Premium', icon: '💷', description: 'Field level, club seats' },
                    { value: 'luxury', label: 'Luxury', icon: '💎', description: 'Behind home plate, dugout' }
                  ].map(price => (
                    <label key={price.value} className={`mobile-filter-option ${localFilters.priceRange?.includes(price.value as any) ? 'selected' : ''}`}>
                      <input
                        type="checkbox"
                        checked={localFilters.priceRange?.includes(price.value as any) || false}
                        onChange={() => {
                          const ranges = localFilters.priceRange || [];
                          const newRanges = ranges.includes(price.value as any)
                            ? ranges.filter(r => r !== price.value)
                            : [...ranges, price.value as any];
                          setLocalFilters({...localFilters, priceRange: newRanges});
                        }}
                      />
                      <span className="mobile-filter-option-content">
                        <span className="mobile-filter-option-icon">{price.icon}</span>
                        <span className="mobile-filter-option-text">
                          <span className="mobile-filter-option-title">{price.label}</span>
                          <span className="mobile-filter-option-description">{price.description}</span>
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="mobile-filter-footer">
              <button 
                className="mobile-filter-btn mobile-filter-btn-secondary"
                onClick={handleReset}
              >
                Reset
              </button>
              <button 
                className="mobile-filter-btn mobile-filter-btn-primary"
                onClick={handleApplyFilters}
              >
                Show {previewCount} Sections
              </button>
            </div>
          </div>
        </div>
      </MobileFilterPortal>
    </>
  );
};