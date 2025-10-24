'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SeatRecommendations } from './SeatRecommendations';
import { LoadingSpinner } from './LoadingSpinner';
import type { Seat, SectionSeatingData } from '../types/seat';

interface IndividualSeatRecommendationsSectionProps {
  stadiumId: string;
}

export function IndividualSeatRecommendationsSection({
  stadiumId,
}: IndividualSeatRecommendationsSectionProps) {
  const router = useRouter();
  const [seats, setSeats] = useState<Seat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comparisonSeats, setComparisonSeats] = useState<string[]>([]);

  useEffect(() => {
    loadStadiumSeats();
  }, [stadiumId]);

  async function loadStadiumSeats() {
    try {
      setIsLoading(true);
      setError(null);

      // Map stadium IDs to their data directory names
      const seatDataStadiumId = stadiumId === 'dodgers' ? 'dodger-stadium' : stadiumId;

      // Try to load the seat search index for this stadium
      const indexResponse = await fetch(`/data/search/${seatDataStadiumId}-seats.min.json`);

      if (!indexResponse.ok) {
        throw new Error(`Failed to load seat index for ${stadiumId}`);
      }

      const seatIndex = await indexResponse.json();

      // Convert the search index entries to full Seat objects
      // For the recommendation engine, we need complete seat data
      const allSeats: Seat[] = seatIndex.seats.map((entry: any) => ({
        id: entry.id,
        sectionId: entry.sectionId,
        row: entry.row,
        seatNumber: entry.seatNumber,
        covered: entry.covered || false,
        seatType: entry.isAisle ? 'aisle' : 'standard',
        viewQuality: entry.viewQuality,
        accessibility: {
          wheelchairAccessible: entry.wheelchairAccessible || false,
          companionSeat: false,
          reducedMobility: false,
        },
        elevation: entry.elevation || null,
        distanceFromHomeplate: entry.distanceFromHomeplate || 0,
        position3D: entry.position3D || { x: 0, y: 0, z: 0 },
      }));

      setSeats(allSeats);
    } catch (err) {
      console.error('Failed to load stadium seats:', err);
      setError('Unable to load seat recommendations for this stadium');
    } finally {
      setIsLoading(false);
    }
  }

  function handleAddToComparison(seatId: string) {
    const newComparison = [...comparisonSeats, seatId].slice(0, 4); // Max 4 seats
    setComparisonSeats(newComparison);

    // Navigate to comparison page
    router.push(`/compare?seats=${newComparison.join(',')}`);
  }

  if (isLoading) {
    return (
      <div className="individual-seat-recommendations-section">
        <LoadingSpinner message="Loading seat recommendations..." />
      </div>
    );
  }

  if (error || seats.length === 0) {
    return (
      <div className="individual-seat-recommendations-section">
        <div className="error-state">
          <div className="error-icon">ℹ️</div>
          <h3 className="error-title">Seat-Level Recommendations Unavailable</h3>
          <p className="error-message">
            {error || 'Seat-level data is not available for this stadium yet.'}
          </p>
        </div>

        <style jsx>{`
          .individual-seat-recommendations-section {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem 1rem;
          }

          .error-state {
            text-align: center;
            padding: 3rem 1rem;
            background: #f9fafb;
            border-radius: 12px;
          }

          .error-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
          }

          .error-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #374151;
            margin-bottom: 0.5rem;
          }

          .error-message {
            font-size: 1rem;
            color: #6b7280;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="individual-seat-recommendations-section">
      <SeatRecommendations
        seats={seats}
        stadiumId={stadiumId}
        onAddToComparison={handleAddToComparison}
      />

      <style jsx>{`
        .individual-seat-recommendations-section {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }

        @media (max-width: 768px) {
          .individual-seat-recommendations-section {
            padding: 1rem 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}

export default IndividualSeatRecommendationsSection;
