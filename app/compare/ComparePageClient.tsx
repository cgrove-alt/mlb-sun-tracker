'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Seat, SectionSeatingData } from '../../src/types/seat';

interface CompareSeat {
  seatData: Seat;
  sectionData: SectionSeatingData;
  stadiumId: string;
  stadiumName: string;
}

export default function ComparePageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [seats, setSeats] = useState<CompareSeat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSeats();
  }, [searchParams]);

  async function loadSeats() {
    const seatIds = searchParams.get('seats')?.split(',') || [];
    if (seatIds.length === 0) {
      setIsLoading(false);
      return;
    }

    const loadedSeats: CompareSeat[] = [];

    for (const seatId of seatIds.slice(0, 4)) {
      // Format: stadiumId-sectionId-row-seatNumber
      const parts = seatId.split('-');
      if (parts.length < 4) continue;

      const stadiumId = parts[0];
      const sectionId = parts.slice(1, -2).join('-');
      const row = parts[parts.length - 2];
      const seatNumber = parts[parts.length - 1];

      try {
        const seatDataStadiumId = stadiumId === 'dodgers' ? 'dodger-stadium' : stadiumId;
        const response = await fetch(`/data/seats/${seatDataStadiumId}/${sectionId}.json`);

        if (response.ok) {
          const sectionData: SectionSeatingData = await response.json();

          // Find the seat
          for (const rowData of sectionData.rows) {
            const foundSeat = rowData.seats.find(
              s => s.row === row && s.seatNumber === seatNumber
            );

            if (foundSeat) {
              loadedSeats.push({
                seatData: foundSeat,
                sectionData,
                stadiumId,
                stadiumName: sectionData.stadiumId || stadiumId,
              });
              break;
            }
          }
        }
      } catch (error) {
        console.error(`Failed to load seat ${seatId}:`, error);
      }
    }

    setSeats(loadedSeats);
    setIsLoading(false);
  }

  function removeSeat(index: number) {
    const remaining = seats.filter((_, i) => i !== index);
    setSeats(remaining);

    if (remaining.length === 0) {
      router.push('/');
    } else {
      const newSeatIds = remaining.map(s => s.seatData.id).join(',');
      router.push(`/compare?seats=${newSeatIds}`);
    }
  }

  function clearAll() {
    router.push('/');
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mb-4"></div>
          <p className="text-gray-600">Loading seats for comparison...</p>
        </div>
      </div>
    );
  }

  if (seats.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">No Seats to Compare</h1>
          <p className="text-gray-600 mb-6">
            Add seats from any seat detail page to start comparing them side-by-side.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-accent-600 text-white rounded-lg font-medium hover:bg-accent-700 transition"
          >
            Find Seats →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Compare Seats</h1>
          <p className="text-gray-600">
            Comparing {seats.length} {seats.length === 1 ? 'seat' : 'seats'} side-by-side
          </p>
          <button
            onClick={clearAll}
            className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
          >
            Clear All
          </button>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="comparison-table">
            <thead>
              <tr>
                <th className="sticky-col">Attribute</th>
                {seats.map((seat, index) => (
                  <th key={index}>
                    <div className="seat-header">
                      <div className="seat-title">
                        {seat.sectionData.sectionName}<br />
                        Row {seat.seatData.row} • Seat {seat.seatData.seatNumber}
                      </div>
                      <Link
                        href={`/seat/${seat.stadiumId}/${seat.sectionData.sectionId}/${seat.seatData.row}/${seat.seatData.seatNumber}`}
                        className="view-link"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => removeSeat(index)}
                        className="remove-btn"
                      >
                        Remove
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="sticky-col"><strong>Stadium</strong></td>
                {seats.map((seat, i) => (
                  <td key={i}>{seat.stadiumName}</td>
                ))}
              </tr>
              <tr>
                <td className="sticky-col"><strong>Section</strong></td>
                {seats.map((seat, i) => (
                  <td key={i}>{seat.sectionData.sectionName}</td>
                ))}
              </tr>
              <tr>
                <td className="sticky-col"><strong>Covered</strong></td>
                {seats.map((seat, i) => (
                  <td key={i} className={seat.seatData.covered ? 'positive' : 'negative'}>
                    {seat.seatData.covered ? '✓ Yes' : '✗ No'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="sticky-col"><strong>Seat Type</strong></td>
                {seats.map((seat, i) => (
                  <td key={i} className="capitalize">{seat.seatData.seatType}</td>
                ))}
              </tr>
              <tr>
                <td className="sticky-col"><strong>View Quality</strong></td>
                {seats.map((seat, i) => (
                  <td key={i} className="capitalize">
                    {seat.seatData.viewQuality || 'N/A'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="sticky-col"><strong>Wheelchair Accessible</strong></td>
                {seats.map((seat, i) => (
                  <td key={i} className={seat.seatData.accessibility.wheelchairAccessible ? 'positive' : ''}>
                    {seat.seatData.accessibility.wheelchairAccessible ? '✓ Yes' : 'No'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="sticky-col"><strong>Elevation</strong></td>
                {seats.map((seat, i) => (
                  <td key={i}>{seat.seatData.elevation ? `${seat.seatData.elevation.toFixed(0)} ft` : 'N/A'}</td>
                ))}
              </tr>
              <tr>
                <td className="sticky-col"><strong>Distance from Home Plate</strong></td>
                {seats.map((seat, i) => (
                  <td key={i}>{seat.seatData.distanceFromHomeplate.toFixed(0)} ft</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e5e7eb;
          border-top-color: #0f766e;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .comparison-table {
          width: 100%;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .comparison-table th,
        .comparison-table td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }

        .comparison-table th {
          background: #f9fafb;
          font-weight: 600;
          color: #374151;
        }

        .sticky-col {
          position: sticky;
          left: 0;
          background: #f9fafb;
          font-weight: 600;
          z-index: 1;
        }

        .seat-header {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          min-width: 200px;
        }

        .seat-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: #0f766e;
        }

        .view-link {
          font-size: 0.75rem;
          color: #0891b2;
          text-decoration: underline;
        }

        .view-link:hover {
          color: #0e7490;
        }

        .remove-btn {
          font-size: 0.75rem;
          color: #dc2626;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          padding: 0;
        }

        .remove-btn:hover {
          text-decoration: underline;
        }

        .positive {
          color: #059669;
          font-weight: 500;
        }

        .negative {
          color: #dc2626;
        }

        .capitalize {
          text-transform: capitalize;
        }

        @media (max-width: 768px) {
          .comparison-table th,
          .comparison-table td {
            padding: 0.75rem;
            font-size: 0.875rem;
          }

          .seat-header {
            min-width: 150px;
          }
        }
      `}</style>
    </div>
  );
}
