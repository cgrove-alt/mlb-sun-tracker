'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Users, Sun, MapPin } from 'lucide-react';
import { toDataStadiumId } from '../utils/ids';

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
}

export function SectionNavigationGrid({ stadiumId, sections = [] }: SectionNavigationGridProps) {
  const [sectionMetadata, setSectionMetadata] = useState<SectionMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  useEffect(() => {
    loadSectionMetadata();
  }, [stadiumId]);

  async function loadSectionMetadata() {
    try {
      setIsLoading(true);
      const dataStadiumId = toDataStadiumId(stadiumId);

      // Try to load section metadata (lightweight summary)
      const response = await fetch(`/data/seatData/${dataStadiumId}/metadata.json`);

      if (response.ok) {
        const data = await response.json();

        // Extract section summaries from metadata
        const sectionList: SectionMetadata[] = Object.entries(data.sections || {}).map(([id, section]: [string, any]) => ({
          sectionId: id,
          sectionName: section.name || `Section ${id}`,
          totalSeats: section.seatCount || 0,
          rowCount: section.rowCount || 0,
          priceLevel: section.priceLevel,
          covered: section.covered || false,
          averageSunExposure: section.avgSunExposure,
          level: section.level || 'field',
        }));

        setSectionMetadata(sectionList);
      } else {
        // Fallback: Create basic metadata from section list
        const fallbackMetadata = sections.map(section => ({
          sectionId: section.id,
          sectionName: section.name || `Section ${section.id}`,
          totalSeats: section.seats?.length || 0,
          rowCount: section.rows?.length || 0,
          covered: section.covered || false,
          level: determineLevel(section.id),
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

  if (isLoading) {
    return (
      <div className="section-navigation-grid">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading sections...</p>
        </div>
        <style jsx>{`
          .loading-state {
            text-align: center;
            padding: 3rem;
          }
          .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f3f4f6;
            border-top-color: #3b82f6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
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
              href={`/stadium/${stadiumId}/section/${section.sectionId}`}
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