'use client';

import React, { useMemo } from 'react';
import { SectionShadeData } from './StadiumDiagram/StadiumDiagram';
import { calculateShadeScore, getShadeScoreColor, getShadeScoreTextColor } from '../utils/shadeScore';

interface ShadeSummaryBannerProps {
  shadeData: SectionShadeData[];
  sunAzimuthDegrees?: number;
}

function getCompassDirection(deg: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(deg / 45) % 8];
}

export const ShadeSummaryBanner: React.FC<ShadeSummaryBannerProps> = ({
  shadeData,
  sunAzimuthDegrees,
}) => {
  const summary = useMemo(() => {
    if (!shadeData || shadeData.length === 0) return null;

    const shadedCount = shadeData.filter(d => d.shadePercentage >= 50).length;
    const shadePct = Math.round((shadedCount / shadeData.length) * 100);

    // Find section with most shade
    const sorted = [...shadeData].sort((a, b) => b.shadePercentage - a.shadePercentage);
    const best = sorted[0];

    // Average shade score
    const avgExposure = shadeData.reduce((sum, d) => sum + (100 - d.shadePercentage), 0) / shadeData.length;
    const avgScore = calculateShadeScore(avgExposure);

    return { shadePct, best, avgScore };
  }, [shadeData]);

  if (!summary) return null;

  const { shadePct, best, avgScore } = summary;
  const bgColor = getShadeScoreColor(avgScore.score);
  const textColor = getShadeScoreTextColor(avgScore.score);

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem 1rem',
        borderRadius: '0.5rem',
        background: bgColor,
        color: textColor,
        fontSize: '0.875rem',
        fontWeight: 500,
        lineHeight: 1.4,
      }}
      role="status"
      aria-live="polite"
    >
      <span style={{ fontWeight: 700, fontSize: '1.5rem', lineHeight: 1 }}>
        {avgScore.score}/10
      </span>
      <span>
        {shadePct}% of sections in shade
      </span>
      <span style={{ opacity: 0.85 }}>|</span>
      <span>
        Best shade: {best.sectionId} ({Math.round(best.shadePercentage)}%)
      </span>
      {sunAzimuthDegrees !== undefined && (
        <>
          <span style={{ opacity: 0.85 }}>|</span>
          <span>Sun: {getCompassDirection(sunAzimuthDegrees)}</span>
        </>
      )}
    </div>
  );
};

export default ShadeSummaryBanner;
