/**
 * Generate pre-computed shade guides for World Cup 2026 open-air venues.
 * Run: npx tsx scripts/generate-shade-guides.ts
 * Output: Prints JSON shade data to stdout for pasting into shadeGuides.ts
 */

import { ALL_WORLD_CUP_VENUES } from '../src/data/worldcup2026/venues';
import { getSunPosition } from '../src/utils/sunCalculations';
import { calculateRowShadows } from '../src/utils/sunCalculator';

const REFERENCE_DATE = '2026-06-21';
const KICKOFF_TIMES = ['12:00', '15:00', '18:00', '21:00'];

interface KickoffResult {
  kickoffTime: string;
  sunAzimuth: number;
  sunAltitude: number;
  bestSections: string[];
  worstSections: string[];
  shadePct: number;
  recommendation: string;
}

interface VenueResult {
  venueId: string;
  venueName: string;
  roofType: string;
  referenceDate: string;
  shadeScore: number;
  kickoffAnalysis: KickoffResult[];
}

function getRecommendation(shadePct: number, kickoffTime: string, roofType: string): string {
  if (roofType === 'fixed') return 'Stadium has a fixed roof — full shade guaranteed.';
  if (roofType === 'retractable') return 'Stadium has a retractable roof — expect full shade when closed.';

  const hour = parseInt(kickoffTime.split(':')[0]);

  if (shadePct >= 70) return 'Most seats will be in shade — excellent conditions.';
  if (shadePct >= 50) return 'Mixed shade conditions — upper deck and west-side seats recommended.';
  if (shadePct >= 30) {
    if (hour <= 15) return 'Limited shade at this time — bring sun protection, seek upper deck west side.';
    return 'Moderate shade developing — west and south sections have the best coverage.';
  }
  if (hour >= 20) return 'Evening match — sun will be low or setting, minimal sun concern.';
  return 'Minimal shade — bring sunscreen, hat, and water. Consider upper deck for any available shade.';
}

function computeVenueShade(venue: typeof ALL_WORLD_CUP_VENUES[0]): VenueResult {
  const kickoffAnalysis: KickoffResult[] = [];

  for (const time of KICKOFF_TIMES) {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date(2026, 5, 21, hours, minutes, 0); // June 21, 2026

    const sunPos = getSunPosition(date, venue.latitude, venue.longitude, venue.timezone);

    // If sun is below horizon, all shade
    if (sunPos.altitudeDegrees <= 0) {
      kickoffAnalysis.push({
        kickoffTime: time,
        sunAzimuth: Math.round(sunPos.azimuthDegrees),
        sunAltitude: Math.round(sunPos.altitudeDegrees),
        bestSections: [],
        worstSections: [],
        shadePct: 100,
        recommendation: 'Sun is below the horizon — no sun exposure.'
      });
      continue;
    }

    // Calculate shade for each section
    const sectionResults: { name: string; coverage: number }[] = [];

    for (const section of venue.sections) {
      const result = calculateRowShadows(
        section,
        sunPos.altitudeDegrees,
        sunPos.azimuthDegrees,
        venue.fieldOrientation
      );
      sectionResults.push({
        name: section.name,
        coverage: result.averageCoverage
      });
    }

    // Sort by coverage (most shade first)
    sectionResults.sort((a, b) => b.coverage - a.coverage);

    const avgCoverage = sectionResults.length > 0
      ? Math.round(sectionResults.reduce((s, r) => s + r.coverage, 0) / sectionResults.length)
      : 0;

    kickoffAnalysis.push({
      kickoffTime: time,
      sunAzimuth: Math.round(sunPos.azimuthDegrees),
      sunAltitude: Math.round(sunPos.altitudeDegrees),
      bestSections: sectionResults.slice(0, 5).map(s => s.name),
      worstSections: sectionResults.slice(-5).reverse().map(s => s.name),
      shadePct: avgCoverage,
      recommendation: getRecommendation(avgCoverage, time, venue.roof)
    });
  }

  // Overall shade score: weighted average (afternoon matches weighted more)
  const weights = [0.2, 0.3, 0.3, 0.2]; // 12, 15, 18, 21
  const weightedScore = kickoffAnalysis.reduce((sum, k, i) => sum + k.shadePct * weights[i], 0);
  const shadeScore = Math.round(Math.min(10, Math.max(1, weightedScore / 10)));

  return {
    venueId: venue.id,
    venueName: venue.commonName,
    roofType: venue.roof,
    referenceDate: REFERENCE_DATE,
    shadeScore,
    kickoffAnalysis
  };
}

// Run computation
const results: VenueResult[] = [];

for (const venue of ALL_WORLD_CUP_VENUES) {
  if (venue.roof === 'fixed' || venue.roof === 'retractable') {
    results.push({
      venueId: venue.id,
      venueName: venue.commonName,
      roofType: venue.roof,
      referenceDate: REFERENCE_DATE,
      shadeScore: 10,
      kickoffAnalysis: KICKOFF_TIMES.map(time => ({
        kickoffTime: time,
        sunAzimuth: 0,
        sunAltitude: 0,
        bestSections: [],
        worstSections: [],
        shadePct: 100,
        recommendation: venue.roof === 'fixed'
          ? 'Stadium has a fixed roof — full shade guaranteed.'
          : 'Stadium has a retractable roof — expect full shade when closed.'
      }))
    });
  } else {
    const result = computeVenueShade(venue);
    results.push(result);
  }
}

// Output as JSON
console.log(JSON.stringify(results, null, 2));
