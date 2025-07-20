import React, { useState, useMemo } from 'react';
import { SunFilterCriteria } from './SunExposureFilterFixed';
import { SeatingSectionSun } from '../utils/sunCalculations';
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
        filtered = filtered.filter(s => s.sunExposure >= 50);
      } else if (localFilters.sunPreference === 'shade') {
        filtered = filtered.filter(s => s.sunExposure < 50);
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

      {isOpen && (
        <div className="mobile-filter-sheet">
          <div className="mobile-filter-overlay" onClick={() => setIsOpen(false)} />
          <div className="mobile-filter-content">
            <div className="mobile-filter-header">
              <h2>Filter Sections</h2>
              <button 
                className="mobile-filter-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 18L18 6M6 6l12 12"/>
                </svg>
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
                      <span>More sun</span>
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
                      <span>More shade</span>
                    </span>
                  </label>
                </div>
              </div>

              {/* Time in Sun */}
              <div className="mobile-filter-section">
                <h3>Time in Sun</h3>
                <div className="mobile-filter-slider">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={localFilters.maxSunExposure || 100}
                    onChange={(e) => setLocalFilters({...localFilters, maxSunExposure: parseInt(e.target.value)})}
                    className="mobile-filter-range"
                  />
                  <div className="mobile-filter-range-labels">
                    <span>0%</span>
                    <span className="mobile-filter-range-value">{localFilters.maxSunExposure || 100}%</span>
                    <span>100%</span>
                  </div>
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
      )}
    </>
  );
};