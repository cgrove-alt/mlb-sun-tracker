'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Users, Sun, MapPin } from 'lucide-react';
import { toDataStadiumId } from '../utils/ids';
import { SectionCardSkeleton } from './common/Skeleton';

interface SectionMetadata {
  sectionId: string;
  sectionName: string;
  totalSeats: number;
  rowCount: number;
  priceLevel?: string;
  covered: boolean;
  averageSunExposure?: number;
  level?: string; // field, loge, upper, etc.
}

interface SectionNavigationGridProps {
  stadiumId: string;
  sections?: any[];
  gameDate?: string; // Game date in yyyy-MM-dd format
  gameTime?: string; // Game time in HH:mm format
  isCalculating?: boolean; // Is sun exposure being calculated
}

export function SectionNavigationGrid({ stadiumId, sections = [], gameDate, gameTime, isCalculating = false }: SectionNavigationGridProps) {
  const [sectionMetadata, setSectionMetadata] = useState<SectionMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  useEffect(() => {
    loadSectionMetadata();
  }, [stadiumId, sections]);

  async function loadSectionMetadata() {
    try {
      setIsLoading(true);
      const dataStadiumId = toDataStadiumId(stadiumId);

      // Try to load section metadata (lightweight summary)
      const response = await fetch(`/data/seatData/${dataStadiumId}/metadata.json`);

      if (response.ok) {
        const data = await response.json();

        // Extract section summaries from metadata
        const sectionList: SectionMetadata[] = Object.entries(data.sections || {}).map(([id, section]: [string, any]) => {
          // Find matching section from props (which may have real-time sunExposure)
          const liveSection = sections.find((s: any) => s.id === id || s.sectionId === id);

          return {
            sectionId: id,
            sectionName: section.name || `Section ${id}`,
            totalSeats: section.seatCount || 0,
            rowCount: section.rowCount || 0,
            priceLevel: section.priceLevel,
            covered: section.covered || false,
            // Prioritize real-time sun exposure from props over static metadata
            averageSunExposure: liveSection?.sunExposure ?? section.avgSunExposure,
            level: section.level || 'field',
          };
        });

        setSectionMetadata(sectionList);
      } else {
        // Fallback: Create basic metadata from section list
        const fallbackMetadata = sections.map((section: any) => ({
          sectionId: section.id || section.sectionId,
          sectionName: section.name || `Section ${section.id || section.sectionId}`,
          totalSeats: section.seats?.length || 0,
          rowCount: section.rows?.length || 0,
          covered: section.covered || false,
          averageSunExposure: section.sunExposure, // Use real-time data if available
          level: determineLevel(section.id || section.sectionId),
        }));

        setSectionMetadata(fallbackMetadata);
      }
    } catch (error) {
      console.error('Failed to load section metadata:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function determineLevel(sectionId: string): string {
    const id = sectionId.toString();
    if (id.startsWith('1') || id.length === 2) return 'field';
    if (id.startsWith('2')) return 'loge';
    if (id.startsWith('3') || id.startsWith('4')) return 'upper';
    if (id.startsWith('5')) return 'upper';
    return 'field';
  }

  function getSunExposureColor(exposure?: number): string {
    if (!exposure) return 'bg-gray-100';
    if (exposure < 30) return 'bg-green-100 text-green-800';
    if (exposure < 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  }

  const levels = ['all', 'field', 'loge', 'upper'];
  const filteredSections = selectedLevel === 'all'
    ? sectionMetadata
    : sectionMetadata.filter(s => s.level === selectedLevel);

  // Calculate sun exposure stats
  const sunStats = {
    total: sectionMetadata.length,
    withData: sectionMetadata.filter(s => s.averageSunExposure !== undefined).length,
    inShade: sectionMetadata.filter(s => s.averageSunExposure !== undefined && s.averageSunExposure < 50).length,
    inSun: sectionMetadata.filter(s => s.averageSunExposure !== undefined && s.averageSunExposure >= 50).length,
  };

  // Build section URL with optional game context
  function buildSectionUrl(sectionId: string): string {
    const baseUrl = `/stadium/${stadiumId}/section/${sectionId}`;

    // Add game context if available
    if (gameDate && gameTime) {
      return `${baseUrl}?date=${gameDate}&time=${gameTime}`;
    }

    return baseUrl;
  }

  if (isLoading) {
    return (
      <div className="section-navigation-grid">
        <div className="section-header">
          <h2 className="section-title">
            <MapPin className="inline-block mr-2 h-5 w-5" />
            Explore Stadium Sections
          </h2>
          <p className="section-subtitle">Loading sections...</p>
        </div>

        {/* Skeleton grid */}
        <div className="sections-grid">
          {Array.from({ length: 8 }).map((_, idx) => (
            <SectionCardSkeleton key={idx} />
          ))}
        </div>

        <style jsx>{`
          .section-navigation-grid {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem 1rem;
          }
          .section-header {
            text-align: center;
            margin-bottom: 2rem;
          }
          .section-title {
            font-size: 1.875rem;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .section-subtitle {
            color: #6b7280;
            font-size: 1rem;
          }
          .sections-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 1.5rem;
          }
          @media (max-width: 768px) {
            .sections-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="section-navigation-grid">
      <div className="section-header">
        <h2 className="section-title">
          <MapPin className="inline-block mr-2 h-5 w-5" />
          Explore Stadium Sections
        </h2>
        <p className="section-subtitle">
          Select a section to view detailed seat information
        </p>
      </div>

      {/* Sun Exposure Stats - Only show if we have game context */}
      {(gameDate || isCalculating || sunStats.withData > 0) && (
        <div className="sun-stats-banner">
          {isCalculating ? (
            <div className="sun-stats-loading">
              <span className="loading-spinner"></span>
              <span>Calculating sun exposure for selected game...</span>
            </div>
          ) : sunStats.withData > 0 ? (
            <>
              <div className="sun-stats-title">
                <Sun className="inline-block mr-2 h-5 w-5" />
                Sun Exposure Analysis
                {gameDate && gameTime && (
                  <span className="text-sm font-normal ml-2">for selected game</span>
                )}
              </div>
              <div className="sun-stats-grid">
                <div className="stat-card shade-card">
                  <div className="stat-icon">☁️</div>
                  <div className="stat-value">{sunStats.inShade}</div>
                  <div className="stat-label">Sections in Shade</div>
                </div>
                <div className="stat-card sun-card">
                  <div className="stat-icon">☀️</div>
                  <div className="stat-value">{sunStats.inSun}</div>
                  <div className="stat-label">Sections in Sun</div>
                </div>
                <div className="stat-card total-card">
                  <div className="stat-icon">🏟️</div>
                  <div className="stat-value">{sunStats.total}</div>
                  <div className="stat-label">Total Sections</div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      )}

      {/* Level Filter */}
      <div className="level-filter">
        {levels.map(level => (
          <button
            key={level}
            onClick={() => setSelectedLevel(level)}
            className={`filter-btn ${selectedLevel === level ? 'active' : ''}`}
          >
            {level === 'all' ? 'All Sections' : `${level.charAt(0).toUpperCase() + level.slice(1)} Level`}
          </button>
        ))}
      </div>

      {/* Section Grid */}
      <div className="sections-grid">
        {filteredSections.length === 0 ? (
          <div className="no-sections">
            <p>No sections available for this level</p>
          </div>
        ) : (
          filteredSections.map(section => (
            <Link
              key={section.sectionId}
              href={buildSectionUrl(section.sectionId)}
              className="section-card"
            >
              <div className="section-card-header">
                <h3 className="section-name">{section.sectionName}</h3>
                {section.covered && (
                  <span className="covered-badge">Covered</span>
                )}
              </div>

              <div className="section-stats">
                <div className="stat">
                  <Users className="stat-icon" />
                  <span>{section.totalSeats} seats</span>
                </div>
                <div className="stat">
                  <span>{section.rowCount} rows</span>
                </div>
              </div>

              {section.averageSunExposure !== undefined && (
                <div className={`sun-indicator ${getSunExposureColor(section.averageSunExposure)}`}>
                  <Sun className="sun-icon" />
                  <span>{Math.round(section.averageSunExposure)}% sun exposure</span>
                </div>
              )}

              <div className="section-action">
                <span>View Seats</span>
                <ChevronRight className="action-icon" />
              </div>
            </Link>
          ))
        )}
      </div>

      <style jsx>{`
        .section-navigation-grid {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }

        .section-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .section-title {
          font-size: 1.875rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .section-subtitle {
          color: #6b7280;
          font-size: 1rem;
        }

        .sun-stats-banner {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .sun-stats-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          font-size: 1rem;
          color: #78350f;
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 3px solid #fbbf24;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .sun-stats-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #78350f;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sun-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          max-width: 600px;
          margin: 0 auto;
        }

        .stat-card {
          background: white;
          border-radius: 8px;
          padding: 1.25rem;
          text-align: center;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          transition: transform 0.2s;
        }

        .stat-card:hover {
          transform: translateY(-2px);
        }

        .stat-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .shade-card .stat-value {
          color: #059669;
        }

        .sun-card .stat-value {
          color: #dc2626;
        }

        .total-card .stat-value {
          color: #2563eb;
        }

        .level-filter {
          display: flex;
          gap: 0.5rem;
          justify-content: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 0.5rem 1rem;
          border: 1px solid #e5e7eb;
          background: white;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-btn:hover {
          background: #f9fafb;
        }

        .filter-btn.active {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        .sections-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .section-card {
          display: block;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          padding: 1.25rem;
          transition: all 0.2s;
          text-decoration: none;
          color: inherit;
        }

        .section-card:hover {
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          transform: translateY(-2px);
          border-color: #3b82f6;
        }

        .section-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .section-name {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1f2937;
        }

        .covered-badge {
          background: #10b981;
          color: white;
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
          border-radius: 0.375rem;
        }

        .section-stats {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .stat {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .sun-indicator {
          padding: 0.5rem;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }

        .section-action {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #3b82f6;
          font-weight: 500;
          font-size: 0.875rem;
        }

        .no-sections {
          grid-column: 1 / -1;
          text-align: center;
          padding: 3rem;
          color: #6b7280;
        }

        @media (max-width: 768px) {
          .sections-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <style jsx global>{`
        .stat-icon {
          width: 16px;
          height: 16px;
        }

        .sun-icon {
          width: 16px;
          height: 16px;
        }

        .action-icon {
          width: 20px;
          height: 20px;
        }
      `}</style>
    </div>
  );
}

export default SectionNavigationGrid;