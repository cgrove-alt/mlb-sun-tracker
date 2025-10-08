'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Stadium } from '../../../src/data/stadiums';
import { StadiumSection } from '../../../src/data/stadiumSections';
import { StadiumAmenities } from '../../../src/data/stadiumAmenities';
import { setupShadeCalculationListener } from '../../../utils/shadeCalculation';
import { SectionList } from '../../../src/components/SectionList';
import StadiumTitleBlock from '../../../src/components/StadiumTitleBlock';
import { StadiumTitleData } from '../../../src/components/StadiumTitleBlock';
import { stadiumHistories } from '../../../src/data/stadiumDetails';

interface StadiumPageSSRProps {
  stadium: Stadium;
  sections: StadiumSection[];
  amenities: StadiumAmenities | null;
  guide: any;
}

// Helper to get shade recommendation based on time and month
function getShadeRecommendation(orientation: number, month: number, timeOfDay: string) {
  const isEarlyGame = timeOfDay === 'early';
  const isSummer = month >= 5 && month <= 8;
  
  // Orientation-based recommendations
  const facesNorth = orientation >= 315 || orientation <= 45;
  const facesEast = orientation > 45 && orientation <= 135;
  const facesSouth = orientation > 135 && orientation <= 225;
  const facesWest = orientation > 225 && orientation < 315;
  
  if (isEarlyGame) {
    if (facesEast) return 'Third base side recommended for morning shade';
    if (facesWest) return 'First base side recommended for morning shade';
    if (facesNorth) return 'Behind home plate offers consistent shade';
    if (facesSouth) return 'Upper deck sections provide best shade coverage';
  } else {
    if (facesEast) return 'First base side recommended for afternoon shade';
    if (facesWest) return 'Third base side recommended for afternoon shade';
    if (facesNorth) return 'Outfield sections may have more shade';
    if (facesSouth) return 'Club level and upper deck offer shade protection';
  }
  
  return isSummer ? 'Upper deck and covered sections recommended during summer' : 'Check real-time shade for specific sections';
}

// Get seasonal shade pattern
function getSeasonalPattern(month: number) {
  if (month >= 3 && month <= 5) return 'Spring: Sun angle is moderate, shade increases throughout the game';
  if (month >= 6 && month <= 8) return 'Summer: High sun angle, limited shade except in covered areas';
  if (month >= 9 && month <= 10) return 'Fall: Lower sun angle provides more natural shade';
  return 'Check specific game time for shade availability';
}

export default function StadiumPageSSR({ stadium, sections, amenities, guide }: StadiumPageSSRProps) {
  const [shadeResult, setShadeResult] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Setup event listeners for shade calculation
  useEffect(() => {
    // Setup shade calculation listener
    const cleanup = setupShadeCalculationListener();

    // Listen for shade calculation results
    const handleShadeCalculated = (event: Event) => {
      const customEvent = event as CustomEvent;
      setShadeResult(customEvent.detail);
      setIsCalculating(false);
      
      // Scroll to shade results (if you have a results section)
      const resultsSection = document.getElementById('shade-results');
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    const handleShadeCalculationStart = () => {
      setIsCalculating(true);
      setShadeResult(null);
    };

    const handleShadeCalculationError = (event: Event) => {
      const customEvent = event as CustomEvent;
      console.error('Shade calculation error:', customEvent.detail);
      setIsCalculating(false);
    };

    // Add event listeners
    window.addEventListener('calculateShade', handleShadeCalculationStart);
    window.addEventListener('shadeCalculated', handleShadeCalculated);
    window.addEventListener('shadeCalculationError', handleShadeCalculationError);

    // Cleanup
    return () => {
      cleanup();
      window.removeEventListener('calculateShade', handleShadeCalculationStart);
      window.removeEventListener('shadeCalculated', handleShadeCalculated);
      window.removeEventListener('shadeCalculationError', handleShadeCalculationError);
    };
  }, []);

  // Pre-calculate shade data for common scenarios
  const months = [
    { num: 3, name: 'April', pattern: 'Early season - moderate sun exposure' },
    { num: 4, name: 'May', pattern: 'Spring games - increasing temperatures' },
    { num: 5, name: 'June', pattern: 'Early summer - high sun angle' },
    { num: 6, name: 'July', pattern: 'Peak summer - maximum sun exposure' },
    { num: 7, name: 'August', pattern: 'Late summer - intense afternoon sun' },
    { num: 8, name: 'September', pattern: 'Early fall - decreasing sun angle' },
    { num: 9, name: 'October', pattern: 'Playoff season - comfortable temperatures' },
  ];

  const gameTimes = [
    { id: 'day', label: '1:00 PM', recommendation: 'Maximum sun exposure - shade essential' },
    { id: 'afternoon', label: '4:00 PM', recommendation: 'Afternoon sun on first base side' },
    { id: 'evening', label: '7:00 PM', recommendation: 'Sunset glare possible in outfield sections' },
  ];

  // Group sections by shade characteristics
  const coveredSections = sections.filter(s => s.covered);
  const upperDeckSections = sections.filter(s => s.level === 'upper' && !s.covered);
  const clubSections = sections.filter(s => s.level === 'club');
  const fieldSections = sections.filter(s => s.level === 'field');

  // Best shaded sections overall
  const bestShadedSections = [
    ...coveredSections.slice(0, 5),
    ...upperDeckSections.filter(s => s.price === 'value').slice(0, 3),
    ...clubSections.slice(0, 2),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Shade Calculation Result Banner */}
      {(isCalculating || shadeResult) && (
        <section id="shade-results" className="bg-white border-b-2 border-gray-200 fixed top-[120px] left-0 right-0 w-full max-h-[calc(100vh-120px)] overflow-y-auto z-[100] shadow-[0_4px_12px_rgba(0,0,0,0.15)] animate-slide-down md:top-[60px] md:max-h-[calc(100vh-60px)]">
          <div className="max-w-[1200px] mx-auto px-5">
            {isCalculating ? (
              <div className="flex items-center justify-center gap-3 p-5 text-gray-800">
                <div className="w-6 h-6 border-[3px] border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
                <span>Calculating shade for your selected game...</span>
              </div>
            ) : shadeResult ? (
              <div className="relative p-0">
                <div className="flex items-center justify-between px-5 py-4 bg-[linear-gradient(135deg,#E0F2FE,#FEF3C7)] border-b border-gray-200 sticky top-0 z-10">
                  <h2 className="m-0 text-xl text-gray-800 flex-1">🌤️ Shade Results for {shadeResult.date} at {shadeResult.time}</h2>
                  {shadeResult.weather && (
                    <div className="flex gap-4 items-center mr-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">{shadeResult.weather.temperature}°F</span>
                      <span className="flex items-center gap-1">{shadeResult.weather.conditions?.[0]?.description || 'Clear'}</span>
                    </div>
                  )}
                  <button
                    className="bg-white border border-gray-200 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer text-lg text-gray-500 transition-all flex-shrink-0 hover:bg-gray-50 hover:text-gray-800"
                    onClick={() => setShadeResult(null)}
                    aria-label="Close shade results"
                  >
                    ✕
                  </button>
                </div>
                {shadeResult.sectionData && (
                  <SectionList 
                    sections={shadeResult.sectionData}
                    loading={false}
                    showFilters={true}
                  />
                )}
              </div>
            ) : null}
          </div>
        </section>
      )}

      {/* Hero Section with Stadium Info */}
      <section className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-[1200px] mx-auto px-5">
          {(() => {
            const stadiumHistory = stadiumHistories[stadium.id];
            const titleData: StadiumTitleData = {
              purpose: 'shade-guide',
              stadium: {
                name: stadium.name,
                id: stadium.id
              },
              team: {
                name: stadium.team,
                league: 'MLB'
              },
              quickFacts: {
                location: {
                  city: stadium.city,
                  state: stadium.state
                },
                capacity: stadium.capacity,
                orientation: stadium.orientation,
                roofType: stadium.roof,
                yearBuilt: stadiumHistory?.opened
              }
            };
            return (
              <StadiumTitleBlock
                data={titleData}
                showBreadcrumb={true}
              />
            );
          })()}
        </div>
      </section>

      {/* Best Shaded Sections */}
      <section className="py-8 md:py-5">
        <div className="max-w-[1200px] mx-auto px-5">
          <h2>Best Shaded Seats at {stadium.name}</h2>
          <p>Based on stadium orientation and historical data, these sections offer the most shade:</p>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5 mt-6 md:gap-4 md:mt-5">
            {bestShadedSections.map((section, idx) => (
              <div key={section.id} className="bg-white p-5 rounded-lg shadow-sm md:p-4">
                <div className="inline-block bg-blue-500 text-white w-8 h-8 rounded-full text-center leading-8 font-bold mb-2">#{idx + 1}</div>
                <h3>{section.name}</h3>
                <ul className="list-none p-0 my-4">
                  <li className="py-1 text-gray-600">Level: {section.level}</li>
                  {section.covered && <li className="py-1 text-green-600 font-semibold">✓ Covered</li>}
                  {section.price && <li className="py-1 text-gray-600">Price: {section.price}</li>}
                  {section.rows && <li className="py-1 text-gray-600">Rows: {section.rows}</li>}
                </ul>
                {section.covered && (
                  <p className="text-sm text-green-600 italic">Guaranteed shade - covered seating area</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seasonal Shade Patterns */}
      <section className="py-8 md:py-5">
        <div className="max-w-[1200px] mx-auto px-5">
          <h2>Seasonal Shade Patterns</h2>
          <p>Shade availability varies significantly throughout the baseball season:</p>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5 mt-6 md:gap-4 md:mt-5">
            {months.map(month => (
              <div key={month.num} className="bg-white p-5 rounded-lg shadow-sm md:p-4">
                <h3>{month.name}</h3>
                <p className="text-gray-600 mb-4">{month.pattern}</p>
                <div>
                  <h4>Recommendations:</h4>
                  <ul>
                    <li>{getShadeRecommendation(stadium.orientation, month.num, 'early')}</li>
                    <li>{getSeasonalPattern(month.num)}</li>
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Game Time Recommendations */}
      <section className="py-8 md:py-5">
        <div className="max-w-[1200px] mx-auto px-5">
          <h2>Shade by Game Time</h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5 mt-6 md:gap-4 md:mt-5">
            {gameTimes.map(time => (
              <div key={time.id} className="bg-white p-5 rounded-lg shadow-sm md:p-4">
                <h3>{time.label} Games</h3>
                <p>{time.recommendation}</p>
                <div>
                  <h4>Best Sections:</h4>
                  {time.id === 'day' && (
                    <ul>
                      <li>Upper deck sections (maximum elevation)</li>
                      <li>Covered/Club level areas</li>
                      <li>{stadium.orientation < 180 ? 'Third base side' : 'First base side'}</li>
                    </ul>
                  )}
                  {time.id === 'afternoon' && (
                    <ul>
                      <li>Third base line sections</li>
                      <li>Behind home plate (upper levels)</li>
                      <li>Covered concourse areas</li>
                    </ul>
                  )}
                  {time.id === 'evening' && (
                    <ul>
                      <li>Most sections have shade by first pitch</li>
                      <li>Avoid outfield for sunset glare</li>
                      <li>Any covered section for guaranteed comfort</li>
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Details Table */}
      <section className="py-8 md:py-5">
        <div className="max-w-[1200px] mx-auto px-5">
          <h2>All Sections Shade Analysis</h2>
          <div className="overflow-x-auto mt-8">
            <table className="w-full bg-white rounded-lg overflow-hidden shadow-sm md:text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 text-left border-b border-gray-200 font-semibold text-neutral-800 md:p-2">Section</th>
                  <th className="p-4 text-left border-b border-gray-200 font-semibold text-neutral-800 md:p-2">Level</th>
                  <th className="p-4 text-left border-b border-gray-200 font-semibold text-neutral-800 md:p-2">Covered</th>
                  <th className="p-4 text-left border-b border-gray-200 font-semibold text-neutral-800 md:p-2">Shade Rating</th>
                  <th className="p-4 text-left border-b border-gray-200 font-semibold text-neutral-800 md:p-2">Best Time</th>
                  <th className="p-4 text-left border-b border-gray-200 font-semibold text-neutral-800 md:p-2">Notes</th>
                </tr>
              </thead>
              <tbody>
                {sections.map(section => {
                  const shadeRating = section.covered ? 5 :
                                     section.level === 'upper' ? 4 :
                                     section.level === 'club' ? 3 :
                                     section.level === 'suite' ? 2 : 1;
                  const bestTime = section.covered ? 'All day' :
                                  section.level === 'upper' ? 'Day games' :
                                  'Evening games';
                  const ratingColor = shadeRating === 5 ? 'text-green-600' :
                                     shadeRating === 4 ? 'text-lime-500' :
                                     shadeRating === 3 ? 'text-amber-500' :
                                     shadeRating === 2 ? 'text-orange-500' : 'text-red-600';

                  return (
                    <tr key={section.id}>
                      <td className="p-4 text-left border-b border-gray-200 md:p-2">{section.name}</td>
                      <td className="p-4 text-left border-b border-gray-200 md:p-2">{section.level}</td>
                      <td className="p-4 text-left border-b border-gray-200 md:p-2">{section.covered ? '✓' : '—'}</td>
                      <td className="p-4 text-left border-b border-gray-200 md:p-2">
                        <span className={`text-base ${ratingColor}`}>
                          {'★'.repeat(shadeRating)}{'☆'.repeat(5 - shadeRating)}
                        </span>
                      </td>
                      <td className="p-4 text-left border-b border-gray-200 md:p-2">{bestTime}</td>
                      <td className="p-4 text-left border-b border-gray-200 md:p-2">
                        {section.covered ? 'Guaranteed shade' :
                         section.level === 'upper' ? 'Good shade after 2nd inning' :
                         section.level === 'club' ? 'Partial shade available' :
                         'Limited shade'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Sun Protection Tips */}
      <section className="py-8 md:py-5">
        <div className="max-w-[1200px] mx-auto px-5">
          <h2>Sun Protection Tips for {stadium.name}</h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5 mt-6 md:gap-4 md:mt-5">
            <div className="bg-white p-5 rounded-lg shadow-sm md:p-4">
              <h3>☀️ Peak Sun Hours</h3>
              <p>The sun is strongest between 11 AM and 4 PM. Day games at {stadium.name} will have maximum sun exposure during these hours.</p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-sm md:p-4">
              <h3>🧴 Sunscreen Stations</h3>
              <p>
                {amenities?.amenities.filter(a => a.type === 'sunscreen_kiosk').length
                  ? `Free sunscreen available at ${amenities.amenities.filter(a => a.type === 'sunscreen_kiosk').length} locations`
                  : 'Bring your own sunscreen - SPF 30+ recommended'}
              </p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-sm md:p-4">
              <h3>🧢 Recommended Gear</h3>
              <ul>
                <li>Wide-brimmed hat or cap with neck protection</li>
                <li>Sunglasses with UV protection</li>
                <li>Light-colored, loose-fitting clothing</li>
                <li>Portable shade umbrella (check stadium policy)</li>
              </ul>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-sm md:p-4">
              <h3>💧 Stay Hydrated</h3>
              <p>Drink water regularly, especially during day games. {stadium.name} has water fountains on each level.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stadium Amenities */}
      {amenities && (
        <section className="py-8 md:py-5">
          <div className="max-w-[1200px] mx-auto px-5">
            <h2>Shade-Related Amenities</h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5 mt-6 md:gap-4 md:mt-5">
              <div className="bg-white p-5 rounded-lg shadow-sm md:p-4">
                <h3 className="text-indigo-900 mb-4">Covered Concourse Areas</h3>
                <p>All club level and upper deck concourses provide shade and climate-controlled areas.</p>
              </div>
              <div className="bg-white p-5 rounded-lg shadow-sm md:p-4">
                <h3 className="text-indigo-900 mb-4">Indoor Spaces</h3>
                <ul className="list-none p-0">
                  <li className="py-1 text-gray-600">Club lounges with AC (Club level ticket required)</li>
                  <li className="py-1 text-gray-600">Team stores and restaurants</li>
                  <li className="py-1 text-gray-600">First aid stations with cooling areas</li>
                </ul>
              </div>
              <div className="bg-white p-5 rounded-lg shadow-sm md:p-4">
                <h3 className="text-indigo-900 mb-4">Family Areas</h3>
                {amenities.amenities.filter(a => a.type === 'family_area').map(area => (
                  <div key={area.id}>
                    <p className="text-gray-600">{area.name} - Level {area.level}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="py-8 md:py-5">
        <div className="max-w-[1200px] mx-auto px-5">
          <h2>Frequently Asked Questions</h2>

          <div className="bg-white p-5 mb-4 rounded-lg shadow-sm md:p-4">
            <h3 className="text-indigo-900 mb-4">What are the best shaded seats at {stadium.name} for a 1 PM game?</h3>
            <p>For afternoon games, the best shaded seats are in the upper deck sections, particularly on the {stadium.orientation < 180 ? 'third base' : 'first base'} side. Covered sections like {coveredSections.slice(0, 3).map(s => s.name).join(', ')} offer guaranteed shade.</p>
          </div>

          <div className="bg-white p-5 mb-4 rounded-lg shadow-sm md:p-4">
            <h3 className="text-indigo-900 mb-4">Which sections have covered seating?</h3>
            <p>Covered sections at {stadium.name} include: {coveredSections.length > 0 ? coveredSections.map(s => s.name).join(', ') : 'Limited covered seating available. Check club level and premium areas.'}
            </p>
          </div>

          <div className="bg-white p-5 mb-4 rounded-lg shadow-sm md:p-4">
            <h3 className="text-indigo-900 mb-4">How early does shade reach the lower bowl?</h3>
            <p>For day games, shade typically reaches the field level sections by the 5th-6th inning. Evening games (7 PM starts) usually have most of the stadium in shade by first pitch, except for outfield sections which may experience sunset glare.</p>
          </div>

          <div className="bg-white p-5 mb-4 rounded-lg shadow-sm md:p-4">
            <h3 className="text-indigo-900 mb-4">Are there shaded standing room areas?</h3>
            <p>Yes, the upper deck concourse and club level concourses offer shaded standing room areas with views of the field. These are great options for escaping the sun during day games.</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[linear-gradient(135deg,#2196f3,#1976d2)] text-white text-center py-10 md:py-6">
        <div className="max-w-[1200px] mx-auto px-5">
          <h2 className="text-white mb-4">Plan Your Visit to {stadium.name}</h2>
          <p className="text-lg mb-8 max-w-[600px] mx-auto">Remember, shade patterns change throughout the season and even during the game. For the most accurate, real-time shade information for your specific game, use our interactive shade tracker.</p>

          <div className="flex gap-4 justify-center flex-wrap">
            <a href={`/?stadium=${stadium.id}`} className="px-8 py-3 rounded-lg no-underline font-semibold transition-transform inline-block bg-white text-blue-500 hover:-translate-y-0.5">
              Check Real-Time Shade
            </a>
            <a href="/stadiums" className="px-8 py-3 rounded-lg no-underline font-semibold transition-transform inline-block bg-[rgba(255,255,255,0.2)] text-white border-2 border-white hover:-translate-y-0.5">
              View All Stadiums
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}