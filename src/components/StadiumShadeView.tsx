'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { GamePicker } from './GamePicker';
import { SectionTable } from './SectionTable/SectionTable';
import { TimeSlider } from './SectionTable/TimeSlider';
import type { ShadeSectionRow } from './SectionTable/types';

interface StadiumShadeViewProps {
  stadiumId: string;
  stadiumName: string;
  teamId: number;
  league: string;
  roof: 'open' | 'retractable' | 'fixed';
  timezone: string;
  initialDate: string;
  initialTime: string;
  initialOffset: number;
  initialRoofState: 'open' | 'closed';
}

function formatTime12(timeStr: string): string {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${String(m).padStart(2,'0')} ${ampm}`;
}

export function StadiumShadeView({
  stadiumId, stadiumName, teamId, league, roof, timezone,
  initialDate, initialTime, initialOffset, initialRoofState,
}: StadiumShadeViewProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const date = searchParams.get('date') || initialDate;
  const time = searchParams.get('time') || initialTime;
  const offset = parseInt(searchParams.get('offset') || String(initialOffset), 10);
  const roofState = (searchParams.get('roofState') || initialRoofState) as 'open' | 'closed';

  const [sections, setSections] = useState<ShadeSectionRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sunInfo, setSunInfo] = useState<{ altitude: number; azimuth: number } | null>(null);

  const fetchShade = useCallback(async () => {
    if (!date) return;
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({
        stadiumId,
        date,
        time: time || '13:05',
        duration: '3',
        roofState,
      });
      const res = await fetch(`/api/shade?${params}`);
      if (!res.ok) throw new Error('Failed to load shade data');
      const data = await res.json();
      setSections(data.sections as ShadeSectionRow[]);
      setSunInfo(data.sunAtFirstPitch);
    } catch (e) {
      setError('Failed to load shade data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [stadiumId, date, time, roofState]);

  useEffect(() => {
    fetchShade();
  }, [fetchShade]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('date', e.target.value);
    params.delete('offset');
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleRoofToggle = () => {
    if (roof !== 'retractable') return;
    const params = new URLSearchParams(searchParams.toString());
    params.set('roofState', roofState === 'open' ? 'closed' : 'open');
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Snap sections to current offset
  const sectionsAtOffset = sections.map(s => {
    const snap = s.timeline.find(t => t.offsetMinutes === offset) ?? s.timeline[0];
    return {
      ...s,
      shadeScore: snap ? Math.round(10 - (snap.sunExposurePct / 100) * 9) : s.shadeScore,
    };
  });

  // Suppress unused variable warnings for props used only in JSX
  void stadiumName;
  void timezone;

  return (
    <div className="space-y-6">
      {/* Game picker section */}
      <section aria-labelledby="game-picker-heading">
        <h2 id="game-picker-heading" className="text-lg font-semibold text-gray-800 mb-3">
          Pick a Game
        </h2>
        {teamId ? (
          <GamePicker
            teamId={teamId}
            stadiumSlug={stadiumId}
            league={league}
            currentDate={date}
            currentTime={time}
          />
        ) : null}
        <div className="mt-3 flex items-center gap-2">
          <label htmlFor="custom-date" className="text-sm text-gray-600">Custom date:</label>
          <input
            id="custom-date"
            type="date"
            value={date}
            onChange={handleDateChange}
            className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {roof === 'retractable' && (
            <button
              onClick={handleRoofToggle}
              className={`ml-2 px-3 py-1 rounded text-sm font-medium transition-colors ${
                roofState === 'closed'
                  ? 'bg-gray-700 text-white'
                  : 'bg-blue-100 text-blue-700'
              }`}
              aria-label={`Roof is ${roofState}. Click to toggle.`}
            >
              Roof: {roofState === 'closed' ? '⬛ Closed' : '☀️ Open'}
            </button>
          )}
        </div>
      </section>

      {/* Sun info banner */}
      {date && sunInfo && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm flex items-center justify-between flex-wrap gap-2">
          <div>
            <span className="font-medium">{date} at {formatTime12(time)}</span>
            <span className="text-gray-600 ml-2">
              Sun: {Math.round(sunInfo.azimuth)}° azimuth, {Math.round(sunInfo.altitude)}° altitude
            </span>
          </div>
          {sunInfo.altitude <= 0 && (
            <span className="text-gray-500">Sun is below horizon at game time (indoor/evening)</span>
          )}
        </div>
      )}

      {/* Time slider */}
      {date && sections.length > 0 && (
        <section aria-labelledby="time-slider-heading">
          <h2 id="time-slider-heading" className="text-lg font-semibold text-gray-800 mb-2">
            Shade Over Time
          </h2>
          <TimeSlider
            durationMinutes={180}
            firstPitchLabel={formatTime12(time)}
          />
        </section>
      )}

      {/* Section table */}
      <section aria-labelledby="sections-heading">
        <h2 id="sections-heading" className="text-lg font-semibold text-gray-800 mb-3">
          Shade by Section
          {date && <span className="text-sm font-normal text-gray-500 ml-2">at {formatTime12(time)}</span>}
        </h2>

        {!date && (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-4xl mb-3">🎯</div>
            <p className="text-gray-600 font-medium">Select a game above to see shade data</p>
            <p className="text-gray-400 text-sm mt-1">Or pick a custom date</p>
          </div>
        )}

        {date && loading && (
          <div className="space-y-2 animate-pulse">
            {[1,2,3,4,5].map(i => <div key={i} className="h-12 bg-gray-100 rounded" />)}
          </div>
        )}

        {date && error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 text-sm">
            {error}
            <button onClick={fetchShade} className="ml-2 underline">Retry</button>
          </div>
        )}

        {date && !loading && !error && sections.length > 0 && (
          <SectionTable sections={sectionsAtOffset} offsetMinutes={offset} />
        )}
      </section>
    </div>
  );
}
