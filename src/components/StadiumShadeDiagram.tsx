'use client';

import React, { useMemo } from 'react';
interface SectionWithExposure {
  id: string;
  name: string;
  level: 'field' | 'lower' | 'club' | 'upper' | 'suite' | 'standing';
  baseAngle: number;
  angleSpan: number;
  covered: boolean;
  sunExposure?: number;
}

interface StadiumShadeDiagramProps {
  sections: SectionWithExposure[];
  sunAzimuth?: number; // Sun direction in degrees (0 = North, 90 = East, etc)
  stadiumOrientation?: number; // Stadium orientation (degrees from north)
  size?: number;
  onSectionClick?: (section: SectionWithExposure) => void;
  selectedSectionId?: string;
}

// Level to radius mapping (field is closest, upper is farthest)
const LEVEL_RADIUS: Record<string, { inner: number; outer: number }> = {
  field: { inner: 0.25, outer: 0.35 },
  lower: { inner: 0.35, outer: 0.50 },
  club: { inner: 0.50, outer: 0.62 },
  upper: { inner: 0.62, outer: 0.80 },
  suite: { inner: 0.80, outer: 0.90 },
  standing: { inner: 0.85, outer: 0.92 }, // Standing room typically at the back
};

// Color scale for sun exposure
function getExposureColor(exposure: number | undefined, covered: boolean): string {
  if (covered) return '#1e3a5f'; // Dark blue for covered
  if (exposure === undefined) return '#9ca3af'; // Gray if no data
  if (exposure < 20) return '#1e40af'; // Deep blue (full shade)
  if (exposure < 40) return '#3b82f6'; // Blue (mostly shade)
  if (exposure < 60) return '#fbbf24'; // Yellow (partial sun)
  if (exposure < 80) return '#f59e0b'; // Orange (mostly sun)
  return '#dc2626'; // Red (full sun)
}

// Convert polar coordinates to cartesian (for SVG)
function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angleInDegrees: number
): { x: number; y: number } {
  // Convert from stadium coordinates (0 = home plate at bottom) to SVG (0 = right, CCW)
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(angleInRadians),
    y: cy + radius * Math.sin(angleInRadians),
  };
}

// Create SVG arc path for a section
function describeArc(
  cx: number,
  cy: number,
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number
): string {
  const start1 = polarToCartesian(cx, cy, outerRadius, endAngle);
  const end1 = polarToCartesian(cx, cy, outerRadius, startAngle);
  const start2 = polarToCartesian(cx, cy, innerRadius, startAngle);
  const end2 = polarToCartesian(cx, cy, innerRadius, endAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return [
    'M', start1.x, start1.y,
    'A', outerRadius, outerRadius, 0, largeArcFlag, 0, end1.x, end1.y,
    'L', start2.x, start2.y,
    'A', innerRadius, innerRadius, 0, largeArcFlag, 1, end2.x, end2.y,
    'Z',
  ].join(' ');
}

export function StadiumShadeDiagram({
  sections,
  sunAzimuth,
  stadiumOrientation = 0,
  size = 300,
  onSectionClick,
  selectedSectionId,
}: StadiumShadeDiagramProps) {
  const cx = size / 2;
  const cy = size / 2;
  const maxRadius = (size / 2) * 0.95;

  // Group sections by level for statistics
  const stats = useMemo(() => {
    const shaded = sections.filter(s => (s.sunExposure ?? 0) < 40 || s.covered).length;
    const total = sections.length;
    return { shaded, total, pct: total > 0 ? Math.round((shaded / total) * 100) : 0 };
  }, [sections]);

  // Calculate sun indicator position
  const sunIndicator = useMemo(() => {
    if (sunAzimuth === undefined) return null;
    // Adjust for stadium orientation
    const adjustedAzimuth = sunAzimuth - stadiumOrientation;
    const indicatorRadius = maxRadius * 1.05;
    return polarToCartesian(cx, cy, indicatorRadius, adjustedAzimuth);
  }, [sunAzimuth, stadiumOrientation, cx, cy, maxRadius]);

  return (
    <div className="stadium-shade-diagram">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="mx-auto"
      >
        {/* Background circle */}
        <circle
          cx={cx}
          cy={cy}
          r={maxRadius * 0.22}
          fill="#2d5016"
          stroke="#1a3409"
          strokeWidth="2"
        />

        {/* Field label */}
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#fff"
          fontSize="10"
          fontWeight="bold"
        >
          FIELD
        </text>

        {/* Section arcs */}
        {sections.map(section => {
          const levelConfig = LEVEL_RADIUS[section.level] || LEVEL_RADIUS.lower;
          const innerRadius = levelConfig.inner * maxRadius;
          const outerRadius = levelConfig.outer * maxRadius;

          const startAngle = section.baseAngle - section.angleSpan / 2;
          const endAngle = section.baseAngle + section.angleSpan / 2;

          const path = describeArc(cx, cy, innerRadius, outerRadius, startAngle, endAngle);
          const color = getExposureColor(section.sunExposure, section.covered);
          const isSelected = section.id === selectedSectionId;

          return (
            <path
              key={section.id}
              d={path}
              fill={color}
              stroke={isSelected ? '#fff' : '#374151'}
              strokeWidth={isSelected ? 2 : 0.5}
              opacity={0.9}
              className="cursor-pointer hover:opacity-100 transition-opacity"
              onClick={() => onSectionClick?.(section)}
            >
              <title>{`${section.name}: ${section.covered ? 'Covered' : section.sunExposure !== undefined ? `${section.sunExposure.toFixed(0)}% sun` : 'No data'}`}</title>
            </path>
          );
        })}

        {/* Sun position indicator */}
        {sunIndicator && (
          <g>
            <circle
              cx={sunIndicator.x}
              cy={sunIndicator.y}
              r="12"
              fill="#fbbf24"
              stroke="#f59e0b"
              strokeWidth="2"
            />
            <text
              x={sunIndicator.x}
              y={sunIndicator.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="10"
            >
              ☀
            </text>
          </g>
        )}

        {/* Home plate indicator */}
        <polygon
          points={`${cx},${cy + maxRadius * 0.92} ${cx - 6},${cy + maxRadius * 0.85} ${cx + 6},${cy + maxRadius * 0.85}`}
          fill="#fff"
          stroke="#374151"
          strokeWidth="1"
        />
      </svg>

      {/* Legend and stats */}
      <div className="mt-3 text-center">
        <div className="text-sm font-semibold mb-2">
          {stats.shaded} of {stats.total} sections in shade ({stats.pct}%)
        </div>
        <div className="flex justify-center gap-2 flex-wrap text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#1e40af' }} />
            <span>Full Shade</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#3b82f6' }} />
            <span>Mostly Shade</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#fbbf24' }} />
            <span>Partial</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#dc2626' }} />
            <span>Full Sun</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#1e3a5f' }} />
            <span>Covered</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StadiumShadeDiagram;
