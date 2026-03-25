'use client';

import { getShadeGuide, type KickoffShadeAnalysis } from '../../data/worldcup2026/shadeGuides';
import { getWeatherForVenue } from '../../data/worldcup2026/weatherAverages';

interface ShadeAnalysisSectionProps {
  venueId: string;
  venueName: string;
  roofType: 'open' | 'retractable' | 'fixed';
}

function getShadeBadgeColor(shadePct: number): string {
  if (shadePct >= 80) return 'bg-green-100 text-green-800';
  if (shadePct >= 50) return 'bg-blue-100 text-blue-800';
  if (shadePct >= 30) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
}

function getShadeBadgeLabel(shadePct: number): string {
  if (shadePct >= 80) return 'Excellent';
  if (shadePct >= 50) return 'Good';
  if (shadePct >= 30) return 'Limited';
  return 'Minimal';
}

function KickoffCard({ analysis }: { analysis: KickoffShadeAnalysis }) {
  const badgeColor = getShadeBadgeColor(analysis.shadePct);
  const badgeLabel = getShadeBadgeLabel(analysis.shadePct);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-lg font-semibold text-gray-900">
          {analysis.kickoffTime} Kickoff
        </h4>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${badgeColor}`}>
          {analysis.shadePct}% Shade &middot; {badgeLabel}
        </span>
      </div>

      {analysis.sunAltitude > 0 && (
        <div className="text-sm text-gray-500 mb-3">
          Sun position: {analysis.sunAzimuth}&deg; azimuth, {analysis.sunAltitude}&deg; altitude
        </div>
      )}

      <p className="text-gray-700 text-sm mb-4">{analysis.recommendation}</p>

      {analysis.bestSections.length > 0 && (
        <div className="space-y-2">
          <div>
            <span className="text-xs font-medium text-green-700 uppercase tracking-wide">Best for shade</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {analysis.bestSections.slice(0, 3).map(s => (
                <span key={s} className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div>
            <span className="text-xs font-medium text-red-700 uppercase tracking-wide">Most sun exposure</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {analysis.worstSections.slice(0, 3).map(s => (
                <span key={s} className="px-2 py-0.5 bg-red-50 text-red-700 text-xs rounded">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShadeAnalysisSection({ venueId, venueName, roofType }: ShadeAnalysisSectionProps) {
  const shadeGuide = getShadeGuide(venueId);
  const weather = getWeatherForVenue(venueId);

  if (!shadeGuide) return null;

  return (
    <section className="mt-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        Shade Analysis
      </h3>
      <p className="text-gray-600 mb-6">
        {roofType === 'open'
          ? `Sun exposure analysis for ${venueName} at common World Cup kickoff times (June 21 reference date).`
          : roofType === 'retractable'
            ? `${venueName} has a retractable roof — expect full shade during matches when closed.`
            : `${venueName} has a fixed roof — all seats are fully shaded.`
        }
      </p>

      {roofType === 'open' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {shadeGuide.kickoffAnalysis.map(analysis => (
            <KickoffCard key={analysis.kickoffTime} analysis={analysis} />
          ))}
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6 text-center">
          <div className="text-4xl mb-2">&#9728;&#65039;</div>
          <p className="text-green-800 font-medium text-lg">
            Shade Score: {shadeGuide.shadeScore}/10
          </p>
          <p className="text-green-700 text-sm mt-1">
            {roofType === 'fixed'
              ? 'Fixed roof provides guaranteed shade for all matches.'
              : 'Retractable roof expected to be closed during matches.'
            }
          </p>
        </div>
      )}

      {/* Weather Context */}
      {weather && (
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-3">Weather Context — {weather.city}</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500">June High</span>
              <p className="font-medium">{weather.june.highTempF}&deg;F / {weather.june.highTempC}&deg;C</p>
            </div>
            <div>
              <span className="text-gray-500">July High</span>
              <p className="font-medium">{weather.july.highTempF}&deg;F / {weather.july.highTempC}&deg;C</p>
            </div>
            <div>
              <span className="text-gray-500">Humidity</span>
              <p className="font-medium">{Math.round((weather.june.humidity + weather.july.humidity) / 2)}%</p>
            </div>
            <div>
              <span className="text-gray-500">UV Index</span>
              <p className="font-medium">{Math.max(weather.june.uvIndex, weather.july.uvIndex)} (
                {Math.max(weather.june.uvIndex, weather.july.uvIndex) >= 8 ? 'Very High' : 'High'}
              )</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
