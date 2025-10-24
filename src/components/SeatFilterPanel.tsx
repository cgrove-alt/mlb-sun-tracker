'use client';

import { useState, useCallback } from 'react';

export interface SeatFilters {
  sunExposure: {
    min: number;
    max: number;
  };
  viewQuality: string[];
  seatTypes: {
    aisle: boolean;
    covered: boolean;
    wheelchair: boolean;
  };
  elevation: {
    min: number;
    max: number;
  };
}

interface SeatFilterPanelProps {
  onFiltersChange: (filters: SeatFilters) => void;
  totalSeats: number;
  filteredCount: number;
  isOpen: boolean;
  onToggle: () => void;
}

const DEFAULT_FILTERS: SeatFilters = {
  sunExposure: { min: 0, max: 100 },
  viewQuality: [],
  seatTypes: {
    aisle: false,
    covered: false,
    wheelchair: false,
  },
  elevation: { min: 0, max: 200 },
};

export function SeatFilterPanel({
  onFiltersChange,
  totalSeats,
  filteredCount,
  isOpen,
  onToggle,
}: SeatFilterPanelProps) {
  const [filters, setFilters] = useState<SeatFilters>(DEFAULT_FILTERS);

  const handleSunExposureChange = useCallback(
    (type: 'min' | 'max', value: number) => {
      const newFilters = {
        ...filters,
        sunExposure: {
          ...filters.sunExposure,
          [type]: value,
        },
      };
      setFilters(newFilters);
      onFiltersChange(newFilters);
    },
    [filters, onFiltersChange]
  );

  const handleViewQualityToggle = useCallback(
    (quality: string) => {
      const newQuality = filters.viewQuality.includes(quality)
        ? filters.viewQuality.filter(q => q !== quality)
        : [...filters.viewQuality, quality];

      const newFilters = {
        ...filters,
        viewQuality: newQuality,
      };
      setFilters(newFilters);
      onFiltersChange(newFilters);
    },
    [filters, onFiltersChange]
  );

  const handleSeatTypeToggle = useCallback(
    (type: keyof SeatFilters['seatTypes']) => {
      const newFilters = {
        ...filters,
        seatTypes: {
          ...filters.seatTypes,
          [type]: !filters.seatTypes[type],
        },
      };
      setFilters(newFilters);
      onFiltersChange(newFilters);
    },
    [filters, onFiltersChange]
  );

  const handleElevationChange = useCallback(
    (type: 'min' | 'max', value: number) => {
      const newFilters = {
        ...filters,
        elevation: {
          ...filters.elevation,
          [type]: value,
        },
      };
      setFilters(newFilters);
      onFiltersChange(newFilters);
    },
    [filters, onFiltersChange]
  );

  const handleReset = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    onFiltersChange(DEFAULT_FILTERS);
  }, [onFiltersChange]);

  const hasActiveFilters =
    filters.sunExposure.min > 0 ||
    filters.sunExposure.max < 100 ||
    filters.viewQuality.length > 0 ||
    filters.seatTypes.aisle ||
    filters.seatTypes.covered ||
    filters.seatTypes.wheelchair ||
    filters.elevation.min > 0 ||
    filters.elevation.max < 200;

  return (
    <div className="seat-filter-panel">
      {/* Toggle Button */}
      <button className="filter-toggle-button" onClick={onToggle}>
        <span className="filter-icon">🔍</span>
        <span className="filter-label">Filter Seats</span>
        {hasActiveFilters && (
          <span className="filter-badge">{filteredCount.toLocaleString()}</span>
        )}
        <span className={`toggle-icon ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <div className="filter-content">
          {/* Results Count */}
          <div className="filter-header">
            <div className="results-count">
              Showing <strong>{filteredCount.toLocaleString()}</strong> of{' '}
              <strong>{totalSeats.toLocaleString()}</strong> seats
            </div>
            {hasActiveFilters && (
              <button className="reset-button" onClick={handleReset}>
                Reset All
              </button>
            )}
          </div>

          {/* Sun Exposure Filter */}
          <div className="filter-section">
            <h3 className="filter-title">Sun Exposure</h3>
            <div className="slider-group">
              <div className="slider-container">
                <label className="slider-label">
                  Minimum: {filters.sunExposure.min}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={filters.sunExposure.min}
                  onChange={e =>
                    handleSunExposureChange('min', parseInt(e.target.value))
                  }
                  className="slider"
                />
              </div>
              <div className="slider-container">
                <label className="slider-label">
                  Maximum: {filters.sunExposure.max}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={filters.sunExposure.max}
                  onChange={e =>
                    handleSunExposureChange('max', parseInt(e.target.value))
                  }
                  className="slider"
                />
              </div>
            </div>
          </div>

          {/* View Quality Filter */}
          <div className="filter-section">
            <h3 className="filter-title">View Quality</h3>
            <div className="checkbox-group">
              {['excellent', 'good', 'fair'].map(quality => (
                <label key={quality} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.viewQuality.includes(quality)}
                    onChange={() => handleViewQualityToggle(quality)}
                    className="checkbox"
                  />
                  <span className="checkbox-text capitalize">{quality}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Seat Type Filter */}
          <div className="filter-section">
            <h3 className="filter-title">Seat Characteristics</h3>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.seatTypes.covered}
                  onChange={() => handleSeatTypeToggle('covered')}
                  className="checkbox"
                />
                <span className="checkbox-text">☂️ Covered / Protected</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.seatTypes.aisle}
                  onChange={() => handleSeatTypeToggle('aisle')}
                  className="checkbox"
                />
                <span className="checkbox-text">🚶 Aisle Seat</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.seatTypes.wheelchair}
                  onChange={() => handleSeatTypeToggle('wheelchair')}
                  className="checkbox"
                />
                <span className="checkbox-text">♿ Wheelchair Accessible</span>
              </label>
            </div>
          </div>

          {/* Elevation Filter */}
          <div className="filter-section">
            <h3 className="filter-title">Elevation (feet above field)</h3>
            <div className="slider-group">
              <div className="slider-container">
                <label className="slider-label">
                  Minimum: {filters.elevation.min} ft
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  step="10"
                  value={filters.elevation.min}
                  onChange={e =>
                    handleElevationChange('min', parseInt(e.target.value))
                  }
                  className="slider"
                />
              </div>
              <div className="slider-container">
                <label className="slider-label">
                  Maximum: {filters.elevation.max} ft
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  step="10"
                  value={filters.elevation.max}
                  onChange={e =>
                    handleElevationChange('max', parseInt(e.target.value))
                  }
                  className="slider"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .seat-filter-panel {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: 1.5rem;
        }

        .filter-toggle-button {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 1rem;
          font-weight: 600;
          color: #374151;
        }

        .filter-toggle-button:hover {
          border-color: #0f766e;
          background: #f0fdfa;
        }

        .filter-icon {
          font-size: 1.25rem;
        }

        .filter-label {
          flex: 1;
          text-align: left;
        }

        .filter-badge {
          background: #0f766e;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .toggle-icon {
          transition: transform 0.2s ease;
          color: #9ca3af;
        }

        .toggle-icon.open {
          transform: rotate(180deg);
        }

        .filter-content {
          padding: 1.5rem;
          border-top: 1px solid #e5e7eb;
        }

        .filter-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .results-count {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .results-count strong {
          color: #0f766e;
          font-weight: 700;
        }

        .reset-button {
          padding: 0.5rem 1rem;
          background: #f3f4f6;
          border: none;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .reset-button:hover {
          background: #e5e7eb;
        }

        .filter-section {
          margin-bottom: 1.5rem;
        }

        .filter-section:last-child {
          margin-bottom: 0;
        }

        .filter-title {
          font-size: 0.875rem;
          font-weight: 700;
          color: #374151;
          margin-bottom: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .slider-group {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .slider-container {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .slider-label {
          font-size: 0.875rem;
          color: #6b7280;
          font-weight: 500;
        }

        .slider {
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: #e5e7eb;
          outline: none;
          -webkit-appearance: none;
        }

        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #0f766e;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .slider::-webkit-slider-thumb:hover {
          background: #0d9488;
          transform: scale(1.1);
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #0f766e;
          cursor: pointer;
          border: none;
          transition: all 0.2s ease;
        }

        .slider::-moz-range-thumb:hover {
          background: #0d9488;
          transform: scale(1.1);
        }

        .checkbox-group {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 8px;
          transition: background 0.2s ease;
        }

        .checkbox-label:hover {
          background: #f9fafb;
        }

        .checkbox {
          width: 18px;
          height: 18px;
          border-radius: 4px;
          border: 2px solid #d1d5db;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .checkbox:checked {
          background: #0f766e;
          border-color: #0f766e;
        }

        .checkbox-text {
          font-size: 0.875rem;
          color: #374151;
          font-weight: 500;
        }

        .capitalize {
          text-transform: capitalize;
        }

        @media (max-width: 768px) {
          .filter-toggle-button {
            padding: 0.875rem 1rem;
          }

          .filter-content {
            padding: 1rem;
          }

          .filter-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .filter-toggle-button,
          .toggle-icon,
          .reset-button,
          .slider::-webkit-slider-thumb,
          .slider::-moz-range-thumb,
          .checkbox-label,
          .checkbox {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}
