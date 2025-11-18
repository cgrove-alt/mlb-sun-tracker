/**
 * SeatGrid Component
 *
 * Renders a 2D grid of seats with color-coding based on sun exposure.
 * Uses Canvas for performance when rendering 300+ seats.
 */

'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { SeatSunExposure } from '../hooks/useSeatLevelSunCalculations';

interface SeatGridProps {
  seats: SeatSunExposure[];
  onSeatClick?: (seat: SeatSunExposure) => void;
  width?: number;
  height?: number;
}

// Color scale for sun exposure (0-100%)
function getExposureColor(exposure: number): string {
  if (exposure < 20) return '#1e40af'; // Deep blue (full shade)
  if (exposure < 40) return '#3b82f6'; // Blue (mostly shade)
  if (exposure < 60) return '#fbbf24'; // Yellow (partial sun)
  if (exposure < 80) return '#f59e0b'; // Orange (mostly sun)
  return '#dc2626'; // Red (full sun)
}

export function SeatGrid({
  seats,
  onSeatClick,
  width = 800,
  height = 600,
}: SeatGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredSeat, setHoveredSeat] = useState<SeatSunExposure | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<SeatSunExposure | null>(null);

  // Organize seats by row
  const seatsByRow = useCallback(() => {
    const rows = new Map<number, SeatSunExposure[]>();

    for (const seat of seats) {
      if (!rows.has(seat.rowNumber)) {
        rows.set(seat.rowNumber, []);
      }
      rows.get(seat.rowNumber)!.push(seat);
    }

    // Sort seats within each row by seat number
    rows.forEach(rowSeats => {
      rowSeats.sort((a, b) => a.seatNumber - b.seatNumber);
    });

    return Array.from(rows.entries()).sort((a, b) => a[0] - b[0]);
  }, [seats]);

  // Draw the seat grid on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    const rows = seatsByRow();
    if (rows.length === 0) return;

    // Calculate seat dimensions
    const maxSeatsInRow = Math.max(...rows.map(([_, seats]) => seats.length));
    const seatWidth = Math.floor((width - 40) / maxSeatsInRow);
    const seatHeight = Math.floor((height - 40) / rows.length);
    const padding = 2;

    // Draw seats
    rows.forEach(([rowNumber, rowSeats], rowIndex) => {
      rowSeats.forEach((seat, seatIndex) => {
        const x = 20 + seatIndex * seatWidth;
        const y = 20 + rowIndex * seatHeight;

        // Determine color
        const color = getExposureColor(seat.sunExposure);

        // Draw seat rectangle
        ctx.fillStyle = color;
        ctx.fillRect(
          x + padding,
          y + padding,
          seatWidth - padding * 2,
          seatHeight - padding * 2
        );

        // Highlight selected or hovered seat
        if (
          selectedSeat?.seatId === seat.seatId ||
          hoveredSeat?.seatId === seat.seatId
        ) {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3;
          ctx.strokeRect(
            x + padding,
            y + padding,
            seatWidth - padding * 2,
            seatHeight - padding * 2
          );
        }
      });
    });

    // Draw row labels
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'right';
    rows.forEach(([rowNumber], rowIndex) => {
      const y = 20 + rowIndex * seatHeight + seatHeight / 2;
      ctx.fillText(`R${rowNumber}`, 15, y + 4);
    });
  }, [seats, seatsByRow, width, height, hoveredSeat, selectedSeat]);

  // Handle mouse move for hover effect
  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const rows = seatsByRow();
      const maxSeatsInRow = Math.max(...rows.map(([_, seats]) => seats.length));
      const seatWidth = Math.floor((width - 40) / maxSeatsInRow);
      const seatHeight = Math.floor((height - 40) / rows.length);

      // Find seat under cursor
      let foundSeat: SeatSunExposure | null = null;

      rows.forEach(([_, rowSeats], rowIndex) => {
        rowSeats.forEach((seat, seatIndex) => {
          const x = 20 + seatIndex * seatWidth;
          const y = 20 + rowIndex * seatHeight;

          if (
            mouseX >= x &&
            mouseX <= x + seatWidth &&
            mouseY >= y &&
            mouseY <= y + seatHeight
          ) {
            foundSeat = seat;
          }
        });
      });

      setHoveredSeat(foundSeat);
    },
    [seatsByRow, width, height]
  );

  // Handle click
  const handleClick = useCallback(() => {
    if (hoveredSeat) {
      setSelectedSeat(hoveredSeat);
      if (onSeatClick) {
        onSeatClick(hoveredSeat);
      }
    }
  }, [hoveredSeat, onSeatClick]);

  return (
    <div className="seat-grid-container">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        style={{
          cursor: hoveredSeat ? 'pointer' : 'default',
          border: '1px solid #374151',
          borderRadius: '8px',
          backgroundColor: '#1f2937',
        }}
      />

      {/* Hover tooltip */}
      {hoveredSeat && (
        <div
          className="absolute bg-gray-900 text-white px-3 py-2 rounded shadow-lg text-sm"
          style={{
            pointerEvents: 'none',
            marginTop: '8px',
          }}
        >
          <div>
            <strong>Row {hoveredSeat.rowNumber}</strong>, Seat{' '}
            {hoveredSeat.seatNumber}
          </div>
          <div>
            Sun Exposure: {hoveredSeat.sunExposure.toFixed(0)}%
          </div>
          <div>
            Status: {hoveredSeat.isInShade ? '🌤️ Shade' : '☀️ Sun'}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 flex gap-4 items-center text-sm">
        <div className="font-semibold">Sun Exposure:</div>
        <div className="flex gap-2">
          <div className="flex items-center gap-1">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: '#1e40af' }}
            />
            <span>Full Shade</span>
          </div>
          <div className="flex items-center gap-1">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: '#3b82f6' }}
            />
            <span>Mostly Shade</span>
          </div>
          <div className="flex items-center gap-1">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: '#fbbf24' }}
            />
            <span>Partial</span>
          </div>
          <div className="flex items-center gap-1">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: '#f59e0b' }}
            />
            <span>Mostly Sun</span>
          </div>
          <div className="flex items-center gap-1">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: '#dc2626' }}
            />
            <span>Full Sun</span>
          </div>
        </div>
      </div>
    </div>
  );
}
