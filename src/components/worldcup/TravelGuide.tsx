'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '../../i18n/i18nContext';

interface TravelGuideProps {
  className?: string;
}

export function TravelGuide({ className = '' }: TravelGuideProps) {
  const { t } = useTranslation();
  const [expandedSection, setExpandedSection] = useState<string | null>('planning');

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}>
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
        <h2 className="text-3xl font-bold mb-2">🌍 Planning Your World Cup Experience</h2>
        <p className="text-purple-100">Essential tips for attending the world's biggest sporting event</p>
      </div>

      <div className="divide-y divide-gray-200">
        {/* Planning Tips Section */}
        <div className="p-6">
          <button
            onClick={() => toggleSection('planning')}
            className="w-full flex items-center justify-between text-left"
            aria-expanded={expandedSection === 'planning'}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">📋</span>
              <h3 className="text-xl font-bold text-gray-900">Planning & Preparation</h3>
            </div>
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${expandedSection === 'planning' ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {expandedSection === 'planning' && (
            <div className="mt-4 space-y-4 text-gray-700">
              <div className="pl-11">
                <h4 className="font-semibold text-gray-900 mb-2">Book Early</h4>
                <p className="mb-3">
                  Hotels and flights fill up quickly during the World Cup. Start booking at least 6-12 months in advance for the best rates and availability.
                </p>

                <h4 className="font-semibold text-gray-900 mb-2">Multi-Match Itineraries</h4>
                <p className="mb-3">
                  Attending multiple matches? Use our{' '}
                  <Link href="/worldcup2026/compare" className="text-purple-600 hover:text-purple-700 font-medium">
                    venue comparison tool
                  </Link>
                  {' '}to plan travel between stadiums. Consider venue proximity and climate differences.
                </p>

                <h4 className="font-semibold text-gray-900 mb-2">Tickets & Official Sources</h4>
                <p className="mb-3">
                  Official tickets will be available through FIFA's ticketing portal. Be wary of third-party resellers and scalpers. Visit{' '}
                  <a
                    href="https://www.fifa.com/fifaplus/en/tournaments/mens/worldcup/canadamexicousa2026"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-purple-700 font-medium"
                  >
                    FIFA.com
                  </a>
                  {' '}for official information.
                </p>

                <h4 className="font-semibold text-gray-900 mb-2">Travel Documents</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Valid passport required for international travel</li>
                  <li>Check visa requirements for USA, Mexico, or Canada</li>
                  <li>Apply for travel documents well in advance</li>
                  <li>Keep digital and physical copies of all documents</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Climate Guide Section */}
        <div className="p-6">
          <button
            onClick={() => toggleSection('climate')}
            className="w-full flex items-center justify-between text-left"
            aria-expanded={expandedSection === 'climate'}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">☀️</span>
              <h3 className="text-xl font-bold text-gray-900">Climate Guide (June-July 2026)</h3>
            </div>
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${expandedSection === 'climate' ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {expandedSection === 'climate' && (
            <div className="mt-4 space-y-4">
              <div className="pl-11 space-y-4">
                {/* USA Climate */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">🇺🇸</span>
                    <h4 className="font-semibold text-gray-900">United States (11 venues)</h4>
                  </div>
                  <p className="text-gray-700 mb-2">
                    <strong>Expect:</strong> Hot summer conditions across most venues. Temperatures range from 80-100°F (27-38°C).
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Hottest venues:</strong> Dallas, Houston, Miami, Kansas City
                  </p>
                  <p className="text-gray-700">
                    <strong>What to bring:</strong> Sunscreen (SPF 50+), wide-brim hat, light-colored breathable clothing, refillable water bottle, portable fan
                  </p>
                </div>

                {/* Mexico Climate */}
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">🇲🇽</span>
                    <h4 className="font-semibold text-gray-900">Mexico (3 venues)</h4>
                  </div>
                  <p className="text-gray-700 mb-2">
                    <strong>Expect:</strong> Hot and humid in Guadalajara and Monterrey (85-95°F / 29-35°C). Mexico City is cooler due to high altitude (70-80°F / 21-27°C).
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Special note:</strong> Mexico City is at 7,350 feet elevation. Intense sun exposure even at moderate temperatures. Stay hydrated!
                  </p>
                  <p className="text-gray-700">
                    <strong>What to bring:</strong> High SPF sunscreen, altitude sickness medication (if needed), electrolyte drinks, light rain jacket (afternoon showers possible)
                  </p>
                </div>

                {/* Canada Climate */}
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">🇨🇦</span>
                    <h4 className="font-semibold text-gray-900">Canada (2 venues)</h4>
                  </div>
                  <p className="text-gray-700 mb-2">
                    <strong>Expect:</strong> Mild to warm summer weather. Toronto and Vancouver: 70-80°F (21-27°C). Less sun intensity than southern venues.
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Note:</strong> Shade is still important, but sun exposure is less extreme than USA/Mexico venues.
                  </p>
                  <p className="text-gray-700">
                    <strong>What to bring:</strong> Light jacket for evenings, moderate sunscreen (SPF 30+), comfortable layers
                  </p>
                </div>

                {/* General Tips */}
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <h4 className="font-semibold text-gray-900 mb-2">☀️ General Sun Protection Tips</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Use our shade finder to book seats with maximum shade coverage</li>
                    <li>Arrive early to avoid peak sun hours (12-3 PM)</li>
                    <li>Reapply sunscreen every 2 hours</li>
                    <li>Stay hydrated - drink water before, during, and after the match</li>
                    <li>Consider afternoon/evening matches to minimize sun exposure</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Packing Tips Section */}
        <div className="p-6">
          <button
            onClick={() => toggleSection('packing')}
            className="w-full flex items-center justify-between text-left"
            aria-expanded={expandedSection === 'packing'}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎒</span>
              <h3 className="text-xl font-bold text-gray-900">Packing Essentials</h3>
            </div>
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${expandedSection === 'packing' ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {expandedSection === 'packing' && (
            <div className="mt-4 pl-11">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Stadium Bag Checklist</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Clear bag (stadium policy required)</li>
                    <li>Tickets (digital + printed backup)</li>
                    <li>ID/passport</li>
                    <li>Phone charger/power bank</li>
                    <li>Empty refillable water bottle</li>
                    <li>Sunscreen (check stadium rules)</li>
                    <li>Hat/sunglasses</li>
                    <li>Cash and cards</li>
                    <li>Light rain poncho</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">What NOT to Bring</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Large bags or backpacks</li>
                    <li>Professional cameras with long lenses</li>
                    <li>Outside food and beverages</li>
                    <li>Alcohol</li>
                    <li>Weapons or sharp objects</li>
                    <li>Drones</li>
                    <li>Flags on poles</li>
                    <li>Noisemakers (vuvuzelas, horns)</li>
                  </ul>
                  <p className="mt-3 text-sm text-gray-600">
                    Note: Stadium policies vary by venue. Check specific stadium rules before attending.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Transportation Section */}
        <div className="p-6">
          <button
            onClick={() => toggleSection('transport')}
            className="w-full flex items-center justify-between text-left"
            aria-expanded={expandedSection === 'transport'}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🚇</span>
              <h3 className="text-xl font-bold text-gray-900">Getting to Stadiums</h3>
            </div>
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${expandedSection === 'transport' ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {expandedSection === 'transport' && (
            <div className="mt-4 pl-11 space-y-3 text-gray-700">
              <p>
                <strong>Public Transit:</strong> Many stadiums are accessible via metro, light rail, or bus. This is often the fastest option on match days due to heavy traffic.
              </p>
              <p>
                <strong>Ride-Share:</strong> Uber and Lyft are available but expect surge pricing and long wait times after matches. Consider walking to a pickup zone away from the stadium.
              </p>
              <p>
                <strong>Parking:</strong> Stadium parking fills up quickly and is expensive ($40-100). Book parking in advance if driving. Arrive 3-4 hours early for day matches.
              </p>
              <p>
                <strong>Group Transportation:</strong> Consider organized fan buses or shuttles from downtown areas. Many cities will offer special World Cup transportation packages.
              </p>
              <p className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <strong>Pro Tip:</strong> Check our venue pages for specific transportation recommendations, nearby hotels, and accessibility information for each stadium.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* CTA Footer */}
      <div className="bg-gray-50 p-6 border-t border-gray-200">
        <div className="text-center">
          <p className="text-gray-700 mb-4">
            Ready to find your perfect seats?
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/worldcup2026/schedule"
              className="px-6 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-colors"
            >
              View Match Schedule
            </Link>
            <Link
              href="/worldcup2026/venues"
              className="px-6 py-3 bg-white text-purple-600 border-2 border-purple-600 rounded-lg font-bold hover:bg-purple-50 transition-colors"
            >
              Explore All Venues
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
