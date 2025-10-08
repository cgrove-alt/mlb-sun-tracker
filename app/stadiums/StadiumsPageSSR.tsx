import React from 'react';
import Link from 'next/link';
import { MLB_STADIUMS } from '../../src/data/stadiums';
import { getStadiumSections } from '../../src/data/stadiumSections';

export default function StadiumsPageSSR() {
  // Group stadiums by division
  const divisions: Record<string, typeof MLB_STADIUMS> = {
    'AL East': [],
    'AL Central': [],
    'AL West': [],
    'NL East': [],
    'NL Central': [],
    'NL West': [],
  };

  // Division mapping
  const teamDivisions: Record<string, string> = {
    'Orioles': 'AL East',
    'Red Sox': 'AL East',
    'Yankees': 'AL East',
    'Rays': 'AL East',
    'Blue Jays': 'AL East',
    'Guardians': 'AL Central',
    'White Sox': 'AL Central',
    'Tigers': 'AL Central',
    'Royals': 'AL Central',
    'Twins': 'AL Central',
    'Astros': 'AL West',
    'Athletics': 'AL West',
    'Angels': 'AL West',
    'Mariners': 'AL West',
    'Rangers': 'AL West',
    'Braves': 'NL East',
    'Marlins': 'NL East',
    'Mets': 'NL East',
    'Phillies': 'NL East',
    'Nationals': 'NL East',
    'Brewers': 'NL Central',
    'Cardinals': 'NL Central',
    'Cubs': 'NL Central',
    'Reds': 'NL Central',
    'Pirates': 'NL Central',
    'Diamondbacks': 'NL West',
    'Rockies': 'NL West',
    'Dodgers': 'NL West',
    'Padres': 'NL West',
    'Giants': 'NL West',
  };

  // Group stadiums
  MLB_STADIUMS.forEach(stadium => {
    const division = teamDivisions[stadium.team] || 'NL West';
    if (divisions[division]) {
      divisions[division].push(stadium);
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1200px] mx-auto px-5 py-8">
        {/* Hero Section */}
        <section className="text-center py-12 bg-white rounded-xl mb-12 md:py-8">
          <h1 className="text-5xl text-indigo-900 mb-4 md:text-[2rem]">MLB Stadium Shade Guides</h1>
          <p className="text-xl text-gray-600 max-w-[700px] mx-auto mb-8">
            Find the best shaded seats at all 30 Major League Baseball stadiums.
            Each guide includes detailed shade analysis, covered sections, and seasonal recommendations.
          </p>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-8 max-w-[500px] mx-auto">
            <div className="flex flex-col items-center">
              <span className="text-[2rem] font-bold text-blue-500">30</span>
              <span className="text-gray-600 text-sm">MLB Stadiums</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[2rem] font-bold text-blue-500">5,000+</span>
              <span className="text-gray-600 text-sm">Sections Analyzed</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[2rem] font-bold text-blue-500">Real-time</span>
              <span className="text-gray-600 text-sm">Shade Calculations</span>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="mb-12">
          <h2 className="text-[2rem] text-neutral-800 mb-6">Popular Stadiums</h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
            {['yankees', 'dodgers', 'cubs', 'redsox', 'giants'].map(id => {
              const stadium = MLB_STADIUMS.find(s => s.id === id);
              if (!stadium) return null;
              const sections = getStadiumSections(stadium.id);
              const coveredCount = sections.filter(s => s.covered).length;

              return (
                <Link key={id} href={`/stadium/${id}`} className="bg-white p-6 rounded-lg no-underline transition-all shadow-sm block hover:-translate-y-0.5 hover:shadow-md md:p-5 md:min-h-[80px] md:touch-manipulation md:[-webkit-tap-highlight-color:rgba(33,150,243,0.1)] active:md:scale-[0.98] active:md:bg-blue-50">
                  <h3 className="text-indigo-900 mb-2 text-lg md:text-[1.125rem]">{stadium.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 md:text-[0.9375rem]">{stadium.team}</p>
                  <div className="flex gap-4 text-sm text-gray-600 md:text-[0.9375rem]">
                    <span>{stadium.roof === 'open' ? '☀️ Open Air' : '🏟️ ' + stadium.roof}</span>
                    {coveredCount > 0 && <span>🛡️ {coveredCount} Covered</span>}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* All Stadiums by Division */}
        <section>
          <h2>All MLB Stadiums by Division</h2>

          {Object.entries(divisions).map(([division, stadiums]) => (
            <div key={division} className="mb-12">
              <h3 className="text-2xl text-neutral-800 mb-6 pb-2 border-b-2 border-blue-500">{division}</h3>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6 md:grid-cols-1 md:gap-3">
                {stadiums.map(stadium => {
                  const sections = getStadiumSections(stadium.id);
                  const coveredCount = sections.filter(s => s.covered).length;
                  const upperCount = sections.filter(s => s.level === 'upper').length;

                  return (
                    <Link key={stadium.id} href={`/stadium/${stadium.id}`} className="bg-white rounded-lg p-6 no-underline transition-all shadow-sm flex flex-col text-inherit hover:-translate-y-0.5 hover:shadow-lg md:p-5 md:min-h-[100px] md:touch-manipulation md:[-webkit-tap-highlight-color:rgba(33,150,243,0.1)] md:cursor-pointer md:border-2 md:border-transparent active:md:scale-[0.98] active:md:bg-blue-50 active:md:border-blue-500">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-indigo-900 text-lg m-0 md:text-xl md:leading-normal">{stadium.name}</h4>
                        <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-semibold md:text-sm md:px-3 md:py-1.5">{stadium.team}</span>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between py-1 text-sm md:text-[0.9375rem] md:py-1.5">
                          <span className="text-gray-600">Location:</span>
                          <span>{stadium.city}, {stadium.state}</span>
                        </div>
                        <div className="flex justify-between py-1 text-sm md:text-[0.9375rem] md:py-1.5">
                          <span className="text-gray-600">Roof:</span>
                          <span>
                            {stadium.roof === 'open' ? 'Open Air' :
                             stadium.roof === 'retractable' ? 'Retractable' : 'Fixed'}
                          </span>
                        </div>
                        <div className="flex justify-between py-1 text-sm md:text-[0.9375rem] md:py-1.5">
                          <span className="text-gray-600">Orientation:</span>
                          <span>{stadium.orientation}°</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 py-4 my-4 border-t border-b border-gray-200 md:py-5">
                        <div className="text-center md:py-1.5">
                          <strong className="block text-xl text-blue-500 md:text-2xl">{coveredCount}</strong>
                          <span className="text-xs text-gray-600 md:text-[0.8125rem]">Covered Sections</span>
                        </div>
                        <div className="text-center md:py-1.5">
                          <strong className="block text-xl text-blue-500 md:text-2xl">{upperCount}</strong>
                          <span className="text-xs text-gray-600 md:text-[0.8125rem]">Upper Deck</span>
                        </div>
                        <div className="text-center md:py-1.5">
                          <strong className="block text-xl text-blue-500 md:text-2xl">{sections.length}</strong>
                          <span className="text-xs text-gray-600 md:text-[0.8125rem]">Total Sections</span>
                        </div>
                      </div>

                      <div className="my-4">
                        <span className="block text-sm text-gray-600 mb-2">Shade Rating:</span>
                        <div className="h-2 bg-gray-200 rounded overflow-hidden">
                          <div
                            className="h-full bg-[linear-gradient(90deg,#4caf50,#8bc34a)] transition-[width] duration-300"
                            style={{
                              width: `${Math.min(100, (coveredCount / sections.length) * 100 + (upperCount / sections.length) * 50)}%`
                            }}
                          />
                        </div>
                      </div>

                      <span className="block text-center text-blue-500 font-semibold mt-auto pt-4 md:text-base md:py-3 md:font-bold">View Shade Guide →</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

        {/* Helpful Information */}
        <section className="mt-12 py-12">
          <h2 className="text-center text-[2rem] text-neutral-800 mb-8">Understanding Stadium Shade</h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 md:grid-cols-1">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-indigo-900 mb-4 text-lg">🏟️ Stadium Orientation</h3>
              <p className="text-gray-600 leading-relaxed">
                Most MLB stadiums face northeast to minimize sun glare for batters.
                This orientation affects which sections get shade during different parts of the game.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-indigo-900 mb-4 text-lg">☀️ Time of Day Matters</h3>
              <p className="text-gray-600 leading-relaxed">
                Day games (1 PM starts) have maximum sun exposure.
                Evening games (7 PM starts) typically have most seats in shade by first pitch.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-indigo-900 mb-4 text-lg">📅 Seasonal Changes</h3>
              <p className="text-gray-600 leading-relaxed">
                Sun angles change throughout the season.
                Summer games (June-August) have the highest sun angle and least natural shade.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-indigo-900 mb-4 text-lg">🎯 Best Shade Strategies</h3>
              <p className="text-gray-600 leading-relaxed">
                Upper deck sections, third base side (for day games), and any covered sections
                typically offer the best shade protection.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
