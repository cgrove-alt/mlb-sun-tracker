'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import './SectionSelector.css';

interface SectionSelectorProps {
  stadiumId: string;
  sections: string[];
}

// Group sections by type based on naming patterns
function groupSections(sections: string[]): Record<string, string[]> {
  const groups: Record<string, string[]> = {
    'Field Level': [],
    'Loge Level': [],
    'Reserve Level': [],
    'Top Deck': [],
    'Pavilion': [],
    'Special Sections': [],
  };

  sections.forEach((section) => {
    const sectionNum = parseInt(section);

    // Pattern matching for Dodger Stadium sections
    if (section.includes('FD') || section.includes('Field')) {
      groups['Field Level'].push(section);
    } else if (section.includes('LG') || section.includes('Loge')) {
      groups['Loge Level'].push(section);
    } else if (section.includes('RS') || section.includes('Reserve')) {
      groups['Reserve Level'].push(section);
    } else if (section.includes('TD') || section.includes('Top')) {
      groups['Top Deck'].push(section);
    } else if (section.includes('P') && section.length <= 3) {
      groups['Pavilion'].push(section);
    } else if (!isNaN(sectionNum)) {
      // Numeric sections
      if (sectionNum >= 1 && sectionNum <= 60) {
        groups['Field Level'].push(section);
      } else if (sectionNum >= 100 && sectionNum <= 170) {
        groups['Loge Level'].push(section);
      } else if (sectionNum >= 1 && sectionNum <= 25) {
        groups['Reserve Level'].push(section);
      } else if (sectionNum >= 1 && sectionNum <= 15) {
        groups['Top Deck'].push(section);
      } else {
        groups['Special Sections'].push(section);
      }
    } else {
      groups['Special Sections'].push(section);
    }
  });

  // Remove empty groups and sort sections within each group
  Object.keys(groups).forEach((key) => {
    if (groups[key].length === 0) {
      delete groups[key];
    } else {
      groups[key].sort((a, b) => {
        const numA = parseInt(a);
        const numB = parseInt(b);
        if (!isNaN(numA) && !isNaN(numB)) {
          return numA - numB;
        }
        return a.localeCompare(b);
      });
    }
  });

  return groups;
}

export const SectionSelector: React.FC<SectionSelectorProps> = ({ stadiumId, sections }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const groupedSections = useMemo(() => groupSections(sections), [sections]);

  const filteredGroups = useMemo(() => {
    if (!searchTerm) return groupedSections;

    const filtered: Record<string, string[]> = {};
    Object.entries(groupedSections).forEach(([group, sectionList]) => {
      const matchingSections = sectionList.filter((section) =>
        section.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (matchingSections.length > 0) {
        filtered[group] = matchingSections;
      }
    });
    return filtered;
  }, [groupedSections, searchTerm]);

  const totalSections = sections.length;

  return (
    <div className="section-selector">
      <div className="section-selector-header">
        <h3>Browse All Sections ({totalSections})</h3>
        <p className="section-selector-description">
          View detailed seat-level sun exposure data for any section
        </p>
      </div>

      <div className="section-selector-search">
        <input
          type="text"
          placeholder="Search sections (e.g., 1, 101, LG)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="section-search-input"
        />
      </div>

      {(isOpen || searchTerm) && (
        <div className="section-selector-dropdown">
          {Object.keys(filteredGroups).length === 0 ? (
            <div className="section-group">
              <p className="no-results">No sections found matching "{searchTerm}"</p>
            </div>
          ) : (
            Object.entries(filteredGroups).map(([group, sectionList]) => (
              <div key={group} className="section-group">
                <h4 className="section-group-title">{group}</h4>
                <div className="section-selector-grid">
                  {sectionList.map((section) => (
                    <Link
                      key={section}
                      href={`/stadium/${stadiumId}/section/${section}`}
                      className="section-link"
                      onClick={() => {
                        setIsOpen(false);
                        setSearchTerm('');
                      }}
                    >
                      {section}
                    </Link>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {isOpen && (
        <button
          className="section-selector-close"
          onClick={() => setIsOpen(false)}
          aria-label="Close section selector"
        >
          Close
        </button>
      )}
    </div>
  );
};
