'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ALL_WORLD_CUP_VENUES } from '../../../src/data/worldcup2026/venues';
import { getMatchesByVenue } from '../../../src/data/worldcup2026/matches';
import { VenueCard } from '../../../src/components/worldcup/VenueCard';
import { VenueComparison } from '../../../src/components/worldcup/VenueComparison';

function ComparePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedVenueIds, setSelectedVenueIds] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  // Initialize selected venues from URL params
  useEffect(() => {
    const venuesParam = searchParams?.get('venues');
    if (venuesParam) {
      const venueIds = venuesParam.split(',').filter(id =>
        ALL_WORLD_CUP_VENUES.some(v => v.id === id)
      );
      setSelectedVenueIds(venueIds.slice(0, 4)); // Max 4 venues
      if (venueIds.length >= 2) {
        setShowComparison(true);
      }
    }
  }, [searchParams]);

  // Update URL when selection changes
  const updateURL = (venueIds: string[]) => {
    if (venueIds.length > 0) {
      const params = new URLSearchParams();
      params.set('venues', venueIds.join(','));
      router.push(`/worldcup2026/compare?${params.toString()}`, { scroll: false });
    } else {
      router.push('/worldcup2026/compare', { scroll: false });
    }
  };

  const handleToggleSelect = (venueId: string) => {
    setSelectedVenueIds(prev => {
      const isSelected = prev.includes(venueId);
      let newSelection: string[];

      if (isSelected) {
        newSelection = prev.filter(id => id !== venueId);
      } else {
        if (prev.length >= 4) {
          alert('You can compare up to 4 venues at a time');
          return prev;
        }
        newSelection = [...prev, venueId];
      }

      updateURL(newSelection);
      return newSelection;
    });
  };

  const handleRemoveVenue = (venueId: string) => {
    const newSelection = selectedVenueIds.filter(id => id !== venueId);
    setSelectedVenueIds(newSelection);
    updateURL(newSelection);

    if (newSelection.length < 2) {
      setShowComparison(false);
    }
  };

  const handleCompare = () => {
    if (selectedVenueIds.length < 2) {
      alert('Please select at least 2 venues to compare');
      return;
    }
    setShowComparison(true);
  };

  const handleCloseComparison = () => {
    setShowComparison(false);
  };

  const handleClearAll = () => {
    setSelectedVenueIds([]);
    setShowComparison(false);
    router.push('/worldcup2026/compare', { scroll: false });
  };

  const selectedVenues = useMemo(() => {
    return ALL_WORLD_CUP_VENUES.filter(v => selectedVenueIds.includes(v.id));
  }, [selectedVenueIds]);

  const venueCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    ALL_WORLD_CUP_VENUES.forEach(venue => {
      const matches = getMatchesByVenue(venue.id);
      counts[venue.id] = matches.length;
    });
    return counts;
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-2 mb-4">
            <Link
              href="/worldcup2026/venues"
              className="text-purple-200 hover:text-white transition-colors"
            >
              ← Back to Venues
            </Link>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Compare World Cup 2026 Venues
          </h1>
          <p className="text-xl text-purple-100 mb-2">
            Select 2-4 stadiums to compare side-by-side
          </p>
          <p className="text-lg text-purple-200">
            Analyze capacity, shade conditions, travel distances, and more
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Selection Controls */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {selectedVenueIds.length} of 4 venues selected
                </h2>
                <p className="text-sm text-gray-600">
                  {selectedVenueIds.length === 0 && 'Select at least 2 venues to start comparing'}
                  {selectedVenueIds.length === 1 && 'Select 1 more venue to compare'}
                  {selectedVenueIds.length >= 2 && selectedVenueIds.length < 4 && `You can select ${4 - selectedVenueIds.length} more venue${4 - selectedVenueIds.length > 1 ? 's' : ''}`}
                  {selectedVenueIds.length === 4 && 'Maximum venues selected'}
                </p>
              </div>

              <div className="flex gap-3">
                {selectedVenueIds.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="px-5 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors"
                  >
                    Clear All
                  </button>
                )}
                {selectedVenueIds.length >= 2 && (
                  <button
                    onClick={handleCompare}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors shadow-lg"
                  >
                    Compare {selectedVenueIds.length} Venues →
                  </button>
                )}
              </div>
            </div>

            {/* Selected Venues Preview */}
            {selectedVenueIds.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Selected Venues:</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedVenues.map(venue => (
                    <div
                      key={venue.id}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                    >
                      <span>{venue.commonName}</span>
                      <button
                        onClick={() => handleRemoveVenue(venue.id)}
                        className="hover:text-purple-900 transition-colors"
                        aria-label={`Remove ${venue.commonName}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-bold text-blue-900 mb-3">How to Compare Venues</h3>
          <ol className="space-y-2 text-blue-800">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
              <span>Select 2-4 venues below by clicking on the cards</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
              <span>Click "Compare" to see detailed side-by-side comparison</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
              <span>View travel distances, packing tips, and venue highlights</span>
            </li>
          </ol>
        </div>

        {/* Venue Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ALL_WORLD_CUP_VENUES.map(venue => (
            <VenueCard
              key={venue.id}
              venue={venue}
              matchCount={venueCounts[venue.id]}
              isCompareMode={true}
              isSelected={selectedVenueIds.includes(venue.id)}
              onToggleSelect={handleToggleSelect}
            />
          ))}
        </div>
      </div>

      {/* Comparison Modal */}
      {showComparison && selectedVenues.length >= 2 && (
        <VenueComparison
          selectedVenues={selectedVenues}
          venueCounts={venueCounts}
          onClose={handleCloseComparison}
          onRemoveVenue={handleRemoveVenue}
        />
      )}
    </div>
  );
}

export function ComparePageClient() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Compare World Cup 2026 Venues
            </h1>
            <p className="text-xl text-purple-100">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <ComparePageContent />
    </Suspense>
  );
}
