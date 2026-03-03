import React from 'react';
import { DetailedSection } from '../../types/stadium-complete';
import { calculateShadeScore, getShadeScoreColor, getShadeScoreTextColor } from '../../utils/shadeScore';

interface SectionPolygonProps {
  section: DetailedSection;
  shadePercentage: number;
  isSelected: boolean;
  isHovered: boolean;
  isFocused: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onFocus: () => void;
  onBlur: () => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
}

// Project 3D coordinates to 2D for SVG rendering (top-down view)
const project3DTo2D = (x: number, z: number): { x: number; y: number } => {
  return { x, y: z };
};

export const SectionPolygon: React.FC<SectionPolygonProps> = ({
  section,
  shadePercentage,
  isSelected,
  isHovered,
  isFocused,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  onKeyDown,
}) => {
  // Convert vertices3D to 2D polygon points
  const points = section.vertices3D
    .map(vertex => {
      const { x, y } = project3DTo2D(vertex.x, vertex.z);
      return `${x},${y}`;
    })
    .join(' ');

  // Calculate centroid for label placement
  const centroid = section.vertices3D.reduce(
    (acc, vertex) => {
      const { x, y } = project3DTo2D(vertex.x, vertex.z);
      return { x: acc.x + x, y: acc.y + y };
    },
    { x: 0, y: 0 }
  );
  centroid.x /= section.vertices3D.length;
  centroid.y /= section.vertices3D.length;

  // Get shade score (sunExposure = 100 - shadePercentage)
  const sunExposure = 100 - shadePercentage;
  const shadeResult = calculateShadeScore(sunExposure);
  const fillColor = getShadeScoreColor(shadeResult.score);
  const textOnBadge = getShadeScoreTextColor(shadeResult.score);

  // Determine stroke color and width
  const getStrokeStyle = () => {
    if (isSelected) {
      return { stroke: '#2563EB', strokeWidth: 2 };
    }
    if (isFocused) {
      return { stroke: '#3B82F6', strokeWidth: 1.5 };
    }
    if (isHovered) {
      return { stroke: '#60A5FA', strokeWidth: 1.5 };
    }
    return { stroke: '#D1D5DB', strokeWidth: 0.5 };
  };

  const strokeStyle = getStrokeStyle();

  // Calculate opacity
  const opacity = isHovered || isSelected ? 1 : 0.9;

  return (
    <g>
      <polygon
        points={points}
        fill={fillColor}
        {...strokeStyle}
        opacity={opacity}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`Section ${section.name}, Shade Score ${shadeResult.score} out of 10, ${Math.round(shadePercentage)}% shade coverage`}
        style={{
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
      />

      {/* Section label */}
      {(isHovered || isSelected || isFocused) && (
        <>
          {/* Background for label */}
          <rect
            x={centroid.x - 20}
            y={centroid.y - 10}
            width="40"
            height="22"
            fill="rgba(255, 255, 255, 0.95)"
            stroke="#1F2937"
            strokeWidth="0.3"
            rx="2"
            aria-hidden="true"
          />
          {/* Shade Score badge */}
          <circle
            cx={centroid.x + 14}
            cy={centroid.y - 4}
            r="5"
            fill={fillColor}
            aria-hidden="true"
          />
          <text
            x={centroid.x + 14}
            y={centroid.y - 2.5}
            textAnchor="middle"
            fontSize="4"
            fill={textOnBadge}
            fontWeight="700"
            aria-hidden="true"
          >
            {shadeResult.score}
          </text>
          {/* Section name */}
          <text
            x={centroid.x - 3}
            y={centroid.y - 3}
            textAnchor="middle"
            fontSize="5"
            fill="#1F2937"
            fontWeight="600"
            aria-hidden="true"
          >
            {section.name}
          </text>
          {/* Shade info */}
          <text
            x={centroid.x}
            y={centroid.y + 5}
            textAnchor="middle"
            fontSize="3.5"
            fill="#6B7280"
            aria-hidden="true"
          >
            Score: {shadeResult.score} | {Math.round(shadePercentage)}% shade
          </text>
        </>
      )}
    </g>
  );
};
