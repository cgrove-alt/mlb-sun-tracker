import React, { useState, useCallback, useMemo } from 'react';
import { DetailedSection, Vector3D } from '../../types/stadium-complete';
import { SectionPolygon } from './SectionPolygon';
import { ShadeColorScale } from './ShadeColorScale';
import styles from './StadiumDiagram.module.css';

export interface SectionShadeData {
  sectionId: string;
  shadePercentage: number;
}

interface StadiumDiagramProps {
  sections: DetailedSection[];
  shadeData: SectionShadeData[];
  selectedSectionId?: string;
  onSectionSelect?: (sectionId: string) => void;
  className?: string;
}

// Project 3D coordinates to 2D for SVG rendering (top-down view)
const project3DTo2D = (vertex: Vector3D): { x: number; y: number } => {
  return {
    x: vertex.x,
    y: vertex.z, // Use z as the y-coordinate for top-down view
  };
};

// Calculate bounding box for all sections to set SVG viewBox
const calculateBounds = (sections: DetailedSection[]) => {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  sections.forEach(section => {
    section.vertices3D.forEach(vertex => {
      const { x, y } = project3DTo2D(vertex);
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    });
  });

  // Add padding (10%)
  const width = maxX - minX;
  const height = maxY - minY;
  const padding = Math.max(width, height) * 0.1;

  return {
    minX: minX - padding,
    minY: minY - padding,
    width: width + padding * 2,
    height: height + padding * 2,
  };
};

// Get shade percentage for a section
const getShadePercentage = (sectionId: string, shadeData: SectionShadeData[]): number => {
  const data = shadeData.find(d => d.sectionId === sectionId);
  return data ? data.shadePercentage : 0;
};

export const StadiumDiagram: React.FC<StadiumDiagramProps> = ({
  sections,
  shadeData,
  selectedSectionId,
  onSectionSelect,
  className = '',
}) => {
  const [hoveredSectionId, setHoveredSectionId] = useState<string | null>(null);
  const [focusedSectionId, setFocusedSectionId] = useState<string | null>(null);

  // Calculate viewBox for SVG
  const bounds = useMemo(() => calculateBounds(sections), [sections]);
  const viewBox = `${bounds.minX} ${bounds.minY} ${bounds.width} ${bounds.height}`;

  // Handle section click
  const handleSectionClick = useCallback((sectionId: string) => {
    if (onSectionSelect) {
      onSectionSelect(sectionId);
    }
  }, [onSectionSelect]);

  // Handle section hover
  const handleSectionHover = useCallback((sectionId: string | null) => {
    setHoveredSectionId(sectionId);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent, sectionId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSectionClick(sectionId);
    }
  }, [handleSectionClick]);

  return (
    <div className={`${styles.container} ${className}`}>
      <svg
        viewBox={viewBox}
        className={styles.svg}
        role="img"
        aria-label="Interactive stadium seating diagram showing shade coverage"
      >
        {/* Field outline (center reference) */}
        <circle
          cx="0"
          cy="0"
          r="10"
          fill="rgba(34, 197, 94, 0.1)"
          stroke="rgba(34, 197, 94, 0.3)"
          strokeWidth="0.5"
          aria-hidden="true"
        />
        <text
          x="0"
          y="0"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="4"
          fill="rgba(34, 197, 94, 0.6)"
          aria-hidden="true"
        >
          ⚾
        </text>

        {/* Render all sections */}
        {sections.map(section => {
          const shadePercentage = getShadePercentage(section.id, shadeData);
          const isSelected = section.id === selectedSectionId;
          const isHovered = section.id === hoveredSectionId;
          const isFocused = section.id === focusedSectionId;

          return (
            <SectionPolygon
              key={section.id}
              section={section}
              shadePercentage={shadePercentage}
              isSelected={isSelected}
              isHovered={isHovered}
              isFocused={isFocused}
              onClick={() => handleSectionClick(section.id)}
              onMouseEnter={() => handleSectionHover(section.id)}
              onMouseLeave={() => handleSectionHover(null)}
              onFocus={() => setFocusedSectionId(section.id)}
              onBlur={() => setFocusedSectionId(null)}
              onKeyDown={(e) => handleKeyDown(e, section.id)}
            />
          );
        })}
      </svg>

      {/* Color scale legend */}
      <ShadeColorScale className={styles.legend} />
    </div>
  );
};
