// Universal 1-10 Shade Score rating system
// Converts sunExposure (0-100, where 100 = full sun) to a human-friendly score (10 = best shade)

export interface ShadeScoreResult {
  score: number;       // 1-10
  label: string;
  color: string;       // hex background color
  textColor: string;   // WCAG AA compliant text color for the background
  emoji: string;
  recommendation: string;
}

export interface ShadeScoreBand {
  score: number;
  label: string;
  color: string;
  textColor: string;
  emoji: string;
  recommendation: string;
}

export const SHADE_SCORE_BANDS: ShadeScoreBand[] = [
  { score: 10, label: 'Full Shade',      color: '#065f46', textColor: '#ffffff', emoji: '🌳', recommendation: 'Perfect shade — no sunscreen needed' },
  { score: 9,  label: 'Excellent Shade',  color: '#10b981', textColor: '#ffffff', emoji: '🌲', recommendation: 'Nearly full shade — very comfortable' },
  { score: 8,  label: 'Great Shade',      color: '#34d399', textColor: '#1f2937', emoji: '⛱️', recommendation: 'Mostly shaded — light protection recommended' },
  { score: 7,  label: 'Good Shade',       color: '#6ee7b7', textColor: '#1f2937', emoji: '🌤️', recommendation: 'Good shade — a hat will keep you comfortable' },
  { score: 6,  label: 'Moderate Shade',   color: '#fbbf24', textColor: '#1f2937', emoji: '⛅', recommendation: 'Some shade — bring sunglasses and a hat' },
  { score: 5,  label: 'Partial Sun',      color: '#f59e0b', textColor: '#1f2937', emoji: '🌥️', recommendation: 'Mixed sun and shade — sunscreen advised' },
  { score: 4,  label: 'Mostly Sunny',     color: '#f97316', textColor: '#ffffff', emoji: '🌞', recommendation: 'More sun than shade — sunscreen and water essential' },
  { score: 3,  label: 'Sunny',            color: '#ef4444', textColor: '#ffffff', emoji: '☀️', recommendation: 'Significant sun exposure — protect yourself' },
  { score: 2,  label: 'Very Sunny',       color: '#dc2626', textColor: '#ffffff', emoji: '🔥', recommendation: 'Heavy sun — consider a different section' },
  { score: 1,  label: 'Full Sun',         color: '#991b1b', textColor: '#ffffff', emoji: '🥵', recommendation: 'Maximum sun exposure — high heat risk' },
];

/**
 * Convert sunExposure (0-100, where 100 = full sun) to a 1-10 shade score (10 = best shade).
 */
export function calculateShadeScore(sunExposure: number): ShadeScoreResult {
  const clamped = Math.max(0, Math.min(100, sunExposure));
  const score = Math.max(1, Math.min(10, Math.round(10 - (clamped / 100) * 9)));
  const band = SHADE_SCORE_BANDS.find(b => b.score === score) ?? SHADE_SCORE_BANDS[SHADE_SCORE_BANDS.length - 1];
  return {
    score: band.score,
    label: band.label,
    color: band.color,
    textColor: band.textColor,
    emoji: band.emoji,
    recommendation: band.recommendation,
  };
}

/**
 * Average all section exposures into a single stadium-wide shade score.
 */
export function calculateStadiumShadeScore(sectionExposures: { sunExposure: number }[]): ShadeScoreResult {
  if (sectionExposures.length === 0) return calculateShadeScore(50);
  const avg = sectionExposures.reduce((sum, s) => sum + s.sunExposure, 0) / sectionExposures.length;
  return calculateShadeScore(avg);
}

/**
 * Average exposure samples across time into a single game-wide shade score.
 */
export function calculateGameShadeScore(exposureSamples: number[]): ShadeScoreResult {
  if (exposureSamples.length === 0) return calculateShadeScore(50);
  const avg = exposureSamples.reduce((sum, v) => sum + v, 0) / exposureSamples.length;
  return calculateShadeScore(avg);
}

/**
 * Get the hex background color for a 1-10 shade score.
 */
export function getShadeScoreColor(score: number): string {
  const clamped = Math.max(1, Math.min(10, score));
  const band = SHADE_SCORE_BANDS.find(b => b.score === clamped);
  return band?.color ?? '#f59e0b';
}

/**
 * Get WCAG AA compliant text color for a 1-10 shade score background.
 */
export function getShadeScoreTextColor(score: number): string {
  const clamped = Math.max(1, Math.min(10, score));
  const band = SHADE_SCORE_BANDS.find(b => b.score === clamped);
  return band?.textColor ?? '#1f2937';
}
