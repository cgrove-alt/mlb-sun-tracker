'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import './ShadeVisualization.css';

interface Section {
  id: string;
  name: string;
  sunExposure?: number;
  level?: string;
  rows?: number;
  averageCapacity?: number;
}

interface ShadeVisualizationProps {
  sections: Section[];
  stadiumId: string;
  gameTime: string;
}

const getShadeLevel = (sunExposure: number): {
  label: string;
  icon: string;
  color: string;
  className: string;
} => {
  if (sunExposure === 0) {
    return { label: 'Fully Shaded', icon: '☁️', color: '#059669', className: 'shade-fully' };
  } else if (sunExposure < 25) {
    return { label: 'Mostly Shaded', icon: '🌤️', color: '#10b981', className: 'shade-mostly' };
  } else if (sunExposure < 75) {
    return { label: 'Partial Shade', icon: '⛅', color: '#eab308', className: 'shade-partial' };
  } else {
    return { label: 'Full Sun', icon: '☀️', color: '#ef4444', className: 'shade-sun' };
  }
};

export function ShadeVisualization({ sections, stadiumId, gameTime }: ShadeVisualizationProps) {
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'shade' | 'section'>('shade');

  // Process and categorize sections by shade level
  const categorizedSections = useMemo(() => {
    const fullShade: Section[] = [];
    const mostlyShade: Section[] = [];
    const partialShade: Section[] = [];
    const fullSun: Section[] = [];

    sections.forEach(section => {
      const exposure = section.sunExposure ?? 100;

      if (exposure === 0) fullShade.push(section);
      else if (exposure < 25) mostlyShade.push(section);
      else if (exposure < 75) partialShade.push(section);
      else fullSun.push(section);
    });

    // Sort each category by section name
    const sortSections = (a: Section, b: Section) => {
      if (sortBy === 'shade') {
        return (a.sunExposure ?? 100) - (b.sunExposure ?? 100);
      }
      return a.name.localeCompare(b.name);
    };

    fullShade.sort(sortSections);
    mostlyShade.sort(sortSections);
    partialShade.sort(sortSections);
    fullSun.sort(sortSections);

    return { fullShade, mostlyShade, partialShade, fullSun };
  }, [sections, sortBy]);

  // Filter sections based on selected level
  const filteredSections = useMemo(() => {
    if (filterLevel === 'all') return sections;
    if (filterLevel === 'shaded') return [...categorizedSections.fullShade, ...categorizedSections.mostlyShade];
    if (filterLevel === 'full') return categorizedSections.fullShade;
    if (filterLevel === 'mostly') return categorizedSections.mostlyShade;
    if (filterLevel === 'partial') return categorizedSections.partialShade;
    if (filterLevel === 'sun') return categorizedSections.fullSun;
    return sections;
  }, [sections, categorizedSections, filterLevel]);

  // Stats for shade summary
  const shadeStats = useMemo(() => {
    const total = sections.length;
    const shadedCount = categorizedSections.fullShade.length + categorizedSections.mostlyShade.length;
    const percentage = total > 0 ? Math.round((shadedCount / total) * 100) : 0;

    return {
      total,
      shadedCount,
      percentage,
      fullShade: categorizedSections.fullShade.length,
      mostlyShade: categorizedSections.mostlyShade.length,
      partialShade: categorizedSections.partialShade.length,
      fullSun: categorizedSections.fullSun.length,
    };
  }, [sections, categorizedSections]);

  return (
    <div className="shade-visualization">
      {/* Shade Summary Header */}
      <div className="shade-summary">
        <div className="shade-summary-header">
          <h2 className="shade-summary-title">
            Shade Analysis for {gameTime}
          </h2>
          <div className="shade-summary-stats">
            <div className="shade-stat-main">
              <span className="shade-stat-number">{shadeStats.percentage}%</span>
              <span className="shade-stat-label">Sections with Shade</span>
            </div>
            <div className="shade-stat-detail">
              {shadeStats.shadedCount} of {shadeStats.total} sections have shade coverage
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="shade-quick-stats">
          <div className="stat-item shade-fully">
            <span className="stat-icon">☁️</span>
            <span className="stat-count">{shadeStats.fullShade}</span>
            <span className="stat-label">Fully Shaded</span>
          </div>
          <div className="stat-item shade-mostly">
            <span className="stat-icon">🌤️</span>
            <span className="stat-count">{shadeStats.mostlyShade}</span>
            <span className="stat-label">Mostly Shaded</span>
          </div>
          <div className="stat-item shade-partial">
            <span className="stat-icon">⛅</span>
            <span className="stat-count">{shadeStats.partialShade}</span>
            <span className="stat-label">Partial Shade</span>
          </div>
          <div className="stat-item shade-sun">
            <span className="stat-icon">☀️</span>
            <span className="stat-count">{shadeStats.fullSun}</span>
            <span className="stat-label">Full Sun</span>
          </div>
        </div>
      </div>

      {/* Filter and Sort Controls */}
      <div className="shade-controls">
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filterLevel === 'all' ? 'active' : ''}`}
            onClick={() => setFilterLevel('all')}
          >
            All Sections
          </button>
          <button
            className={`filter-btn ${filterLevel === 'shaded' ? 'active' : ''}`}
            onClick={() => setFilterLevel('shaded')}
          >
            Shaded Only
          </button>
          <button
            className={`filter-btn ${filterLevel === 'full' ? 'active' : ''}`}
            onClick={() => setFilterLevel('full')}
          >
            Fully Shaded
          </button>
          <button
            className={`filter-btn ${filterLevel === 'mostly' ? 'active' : ''}`}
            onClick={() => setFilterLevel('mostly')}
          >
            Mostly Shaded
          </button>
          <button
            className={`filter-btn ${filterLevel === 'partial' ? 'active' : ''}`}
            onClick={() => setFilterLevel('partial')}
          >
            Partial Shade
          </button>
          <button
            className={`filter-btn ${filterLevel === 'sun' ? 'active' : ''}`}
            onClick={() => setFilterLevel('sun')}
          >
            Full Sun
          </button>
        </div>

        <div className="sort-controls">
          <label htmlFor="sort-select">Sort by:</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'shade' | 'section')}
            className="sort-select"
          >
            <option value="shade">Shade Level</option>
            <option value="section">Section Name</option>
          </select>
        </div>
      </div>

      {/* Sections Grid */}
      <div className="shade-sections-grid">
        {filteredSections.map(section => {
          const exposure = section.sunExposure ?? 100;
          const shadeInfo = getShadeLevel(exposure);

          return (
            <Link
              key={section.id}
              href={`/stadium/${stadiumId}/section/${section.id}`}
              className={`shade-section-card ${shadeInfo.className}`}
            >
              <div className="section-card-header">
                <h3 className="section-name">{section.name}</h3>
                <span className="shade-icon">{shadeInfo.icon}</span>
              </div>

              <div className="shade-meter">
                <div className="shade-meter-fill" style={{ width: `${100 - exposure}%` }}></div>
              </div>

              <div className="section-card-stats">
                <div className="shade-label" style={{ color: shadeInfo.color }}>
                  {shadeInfo.label}
                </div>
                <div className="exposure-value">{exposure}% sun exposure</div>
              </div>

              {section.level && (
                <div className="section-meta">
                  <span className="meta-item">Level {section.level}</span>
                  {section.rows && <span className="meta-item">{section.rows} rows</span>}
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* No Results Message */}
      {filteredSections.length === 0 && (
        <div className="no-results">
          <span className="no-results-icon">🔍</span>
          <p>No sections match your filter criteria</p>
        </div>
      )}
    </div>
  );
}