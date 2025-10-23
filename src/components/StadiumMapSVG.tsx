'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { trackEvent } from '../utils/analytics';

interface StadiumMapSVGProps {
  stadiumId: string;
  sunExposureData?: Record<string, boolean>; // sectionId -> inSun
  className?: string;
  showLegend?: boolean;
}

export function StadiumMapSVG({
  stadiumId,
  sunExposureData,
  className = '',
  showLegend = true,
}: StadiumMapSVGProps) {
  const router = useRouter();
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  useEffect(() => {
    async function loadAndProcessSVG() {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch the SVG file
        const response = await fetch(`/stadiums/maps/${stadiumId}.svg`);
        if (!response.ok) {
          throw new Error(`Failed to load stadium map: ${response.statusText}`);
        }

        const svgText = await response.text();

        // Parse SVG and inject into container
        if (svgContainerRef.current) {
          svgContainerRef.current.innerHTML = svgText;

          // Get the SVG element
          const svgElement = svgContainerRef.current.querySelector('svg');
          if (!svgElement) {
            throw new Error('Invalid SVG structure');
          }

          // Make SVG responsive
          svgElement.setAttribute('width', '100%');
          svgElement.setAttribute('height', '100%');
          svgElement.style.maxHeight = '600px';

          // Process all sections
          const sections = svgElement.querySelectorAll('.section');
          sections.forEach((sectionGroup) => {
            const sectionId = sectionGroup.getAttribute('data-section-id');
            if (!sectionId) return;

            const path = sectionGroup.querySelector('.section-path');
            if (!path) return;

            // Apply sun exposure color if data available
            if (sunExposureData && sunExposureData[sectionId] !== undefined) {
              const inSun = sunExposureData[sectionId];
              const sunColor = inSun ? '#ef4444' : '#22c55e'; // Red for sun, green for shade
              path.setAttribute('fill', sunColor);
              path.setAttribute('fill-opacity', '0.7');
            }

            // Add click handler
            path.addEventListener('click', () => {
              trackEvent('stadium_map_section_click', 'engagement', sectionId);
              router.push(`/stadium/${stadiumId}/section/${sectionId}`);
            });

            // Add hover handlers
            path.addEventListener('mouseenter', () => {
              setHoveredSection(sectionId);
              path.setAttribute('stroke', '#ffffff');
              path.setAttribute('stroke-width', '3');
            });

            path.addEventListener('mouseleave', () => {
              setHoveredSection(null);
              path.setAttribute('stroke', '#1f2937');
              path.setAttribute('stroke-width', '1');
            });

            // Enhance accessibility
            path.setAttribute('role', 'button');
            path.setAttribute('tabindex', '0');
            path.setAttribute('aria-label', `Section ${sectionId}`);

            // Keyboard navigation
            path.addEventListener('keydown', (e: Event) => {
              const keyEvent = e as KeyboardEvent;
              if (keyEvent.key === 'Enter' || keyEvent.key === ' ') {
                e.preventDefault();
                router.push(`/stadium/${stadiumId}/section/${sectionId}`);
              }
            });
          });
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Error loading stadium map:', err);
        setError(err instanceof Error ? err.message : 'Failed to load stadium map');
        setIsLoading(false);
      }
    }

    loadAndProcessSVG();
  }, [stadiumId, sunExposureData, router]);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-12 bg-gray-50 rounded-xl ${className}`}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading stadium map...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-8 bg-red-50 border-2 border-red-200 rounded-xl ${className}`}>
        <div className="text-center">
          <div className="text-red-600 font-semibold mb-2">Failed to load stadium map</div>
          <p className="text-sm text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* SVG Container */}
      <div
        ref={svgContainerRef}
        className="w-full rounded-xl overflow-hidden bg-white shadow-lg border-2 border-gray-200"
      />

      {/* Hovered Section Tooltip */}
      {hoveredSection && (
        <div className="absolute top-4 left-4 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-xl pointer-events-none z-10">
          <div className="font-semibold">Section {hoveredSection}</div>
          <div className="text-xs text-gray-300 mt-1">Click to view details</div>
        </div>
      )}

      {/* Sun Exposure Legend */}
      {showLegend && sunExposureData && (
        <div className="mt-4 flex items-center justify-center gap-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-green-500 border-2 border-gray-700" />
            <span className="text-sm font-medium text-gray-700">Shaded</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-red-500 border-2 border-gray-700" />
            <span className="text-sm font-medium text-gray-700">In Sun</span>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-4 text-center text-sm text-gray-500">
        Click any section to view seat details and sun exposure
      </div>
    </div>
  );
}
