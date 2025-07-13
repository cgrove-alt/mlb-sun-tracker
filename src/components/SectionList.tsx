import React, { useState } from 'react';
import { SeatingSectionSun } from '../utils/sunCalculations';
import './SectionList.css';

interface SectionListProps {
  sections: SeatingSectionSun[];
  loading?: boolean;
}

export const SectionList: React.FC<SectionListProps> = ({
  sections,
  loading = false
}) => {
  const [sortBy, setSortBy] = useState<'name' | 'exposure' | 'level' | 'price'>('exposure');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const getSunExposureColor = (exposure: number): string => {
    if (exposure === 0) return '#6c757d'; // Gray for no sun
    if (exposure < 25) return '#28a745'; // Green for low sun
    if (exposure < 50) return '#ffc107'; // Yellow for medium sun
    if (exposure < 75) return '#fd7e14'; // Orange for high sun
    return '#dc3545'; // Red for very high sun
  };

  const getSunExposureIcon = (exposure: number): string => {
    if (exposure === 0) return '🌫️';
    if (exposure < 25) return '⛅';
    if (exposure < 50) return '🌤️';
    if (exposure < 75) return '☀️';
    return '🔥';
  };

  const getLevelIcon = (level: string): string => {
    switch (level) {
      case 'field': return '⚾';
      case 'lower': return '🎫';
      case 'club': return '🥂';
      case 'upper': return '🎪';
      case 'suite': return '👑';
      default: return '🏟️';
    }
  };

  const getPriceIcon = (price?: string): string => {
    switch (price) {
      case 'value': return '💵';
      case 'moderate': return '💶';
      case 'premium': return '💷';
      case 'luxury': return '💎';
      default: return '💰';
    }
  };

  const sortedSections = [...sections].sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortBy) {
      case 'name':
        aValue = a.section.name;
        bValue = b.section.name;
        break;
      case 'exposure':
        aValue = a.sunExposure;
        bValue = b.sunExposure;
        break;
      case 'level':
        aValue = a.section.level;
        bValue = b.section.level;
        break;
      case 'price':
        const priceOrder = { value: 1, moderate: 2, premium: 3, luxury: 4 };
        aValue = priceOrder[a.section.price || 'moderate'];
        bValue = priceOrder[b.section.price || 'moderate'];
        break;
      default:
        return 0;
    }
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    return sortOrder === 'asc' 
      ? aValue - bValue
      : bValue - aValue;
  });

  const handleSort = (newSortBy: 'name' | 'exposure' | 'level' | 'price') => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  const sunnyCount = sections.filter(s => s.inSun).length;
  const shadyCount = sections.length - sunnyCount;

  if (loading) {
    return (
      <div className="section-list loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Calculating sun exposure for all sections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section-list">
      <div className="section-list-header">
        <div className="list-title">
          <h3>📋 Stadium Sections</h3>
          <div className="section-summary">
            <span className="summary-item sunny">
              ☀️ {sunnyCount} sunny
            </span>
            <span className="summary-item shady">
              🌫️ {shadyCount} shaded
            </span>
          </div>
        </div>
        
        <div className="sort-controls">
          <span className="sort-label">Sort by:</span>
          <button 
            className={`sort-btn ${sortBy === 'exposure' ? 'active' : ''}`}
            onClick={() => handleSort('exposure')}
          >
            Sun {sortBy === 'exposure' && (sortOrder === 'desc' ? '↓' : '↑')}
          </button>
          <button 
            className={`sort-btn ${sortBy === 'name' ? 'active' : ''}`}
            onClick={() => handleSort('name')}
          >
            Name {sortBy === 'name' && (sortOrder === 'desc' ? '↓' : '↑')}
          </button>
          <button 
            className={`sort-btn ${sortBy === 'level' ? 'active' : ''}`}
            onClick={() => handleSort('level')}
          >
            Level {sortBy === 'level' && (sortOrder === 'desc' ? '↓' : '↑')}
          </button>
          <button 
            className={`sort-btn ${sortBy === 'price' ? 'active' : ''}`}
            onClick={() => handleSort('price')}
          >
            Price {sortBy === 'price' && (sortOrder === 'desc' ? '↓' : '↑')}
          </button>
        </div>
      </div>

      {sections.length === 0 ? (
        <div className="no-sections">
          <p>No sections match your filter criteria.</p>
          <p>Try adjusting your filters to see more results.</p>
        </div>
      ) : (
        <div className="sections-grid">
          {sortedSections.map((sectionData, index) => {
            const { section, sunExposure, inSun } = sectionData;
            
            return (
              <div 
                key={`${section.id}-${index}`}
                className={`section-card ${inSun ? 'sunny' : 'shady'} ${section.covered ? 'covered' : ''}`}
              >
                <div className="section-header">
                  <h4 className="section-name">{section.name}</h4>
                  <div className="section-badges">
                    {section.covered && (
                      <span className="badge covered-badge">🏛️ Covered</span>
                    )}
                    <span className={`badge level-badge level-${section.level}`}>
                      {getLevelIcon(section.level)} {section.level}
                    </span>
                  </div>
                </div>
                
                <div className="section-details">
                  <div className="sun-exposure">
                    <div className="exposure-bar-container">
                      <div className="exposure-label">
                        <span className="exposure-icon">
                          {getSunExposureIcon(sunExposure)}
                        </span>
                        <span className="exposure-text">
                          {Math.round(sunExposure)}% sun exposure
                        </span>
                      </div>
                      <div className="exposure-bar">
                        <div 
                          className="exposure-fill"
                          style={{ 
                            width: `${sunExposure}%`,
                            backgroundColor: getSunExposureColor(sunExposure)
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="section-meta">
                    {section.price && (
                      <span className={`price-indicator price-${section.price}`}>
                        {getPriceIcon(section.price)} {section.price}
                      </span>
                    )}
                    
                    <span className="angle-info">
                      📐 {Math.round(section.baseAngle)}°-{Math.round(section.baseAngle + section.angleSpan)}°
                    </span>
                  </div>
                  
                  {section.rows && (
                    <div className="row-count">
                      🪑 ~{section.rows} rows
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};