'use client';

/**
 * The fan-facing shade finder: pick a stadium, pick a game, see every section
 * colored Shaded / Partial / Sun at each half hour of the game, find your own
 * section, and share a link to it.
 */
import { useEffect, useId, useMemo, useState, type FormEvent } from 'react';
import styles from './ShadeFinder.module.css';
import type { DetailedSection } from '../../types/stadium-complete';
import { mlbApi, type MLBGame } from '../../services/mlbApi';
import { getStadiumSections } from '../../data/stadium-data-aggregator';
import { parkGameShade } from '../../utils/parkShade';
import { inningAt, type SectionGameShade } from '../../utils/gameShade';
import type { ShadeStatus } from '../../utils/shadeEngine';
import { stadiumLocalToUTC } from '../../utils/stadiumTime';
import {
  bestSections,
  buildShareUrl,
  findSection,
  formatClock,
  formatGameOption,
  layoutSeatMap,
  parseShareParams,
} from './finderModel';

export interface FinderPark {
  id: string;
  name: string;
  team: string;
  timezone: string;
  latitude: number;
  longitude: number;
  orientation: number;
  roof: 'open' | 'retractable' | 'fixed';
  /** ± error of the park's orientation, degrees. */
  precisionDeg: number;
}

interface ShadeFinderProps {
  parks: FinderPark[];
  /** On a stadium's own page: no stadium picker, and the URL becomes the share link. */
  lockedStadiumId?: string;
}

const CUSTOM = 'custom';
const STATUS_LABEL: Record<ShadeStatus, string> = { shaded: 'Shaded', partial: 'Partial shade', sun: 'Sun' };
const CONFIDENCE_LABEL = { high: 'High confidence', medium: 'Medium confidence', low: 'Low confidence' } as const;

const todayIn = (timeZone: string) =>
  new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());

export default function ShadeFinder({ parks, lockedStadiumId }: ShadeFinderProps) {
  const uid = useId();
  const [stadiumId, setStadiumId] = useState(lockedStadiumId ?? '');
  const park = parks.find((p) => p.id === stadiumId);

  const [games, setGames] = useState<MLBGame[] | null>(null);
  const [gamesFailed, setGamesFailed] = useState(false);
  const [gameKey, setGameKey] = useState('');
  const [customDate, setCustomDate] = useState('');
  const [customTime, setCustomTime] = useState('13:05');
  const [sections, setSections] = useState<DetailedSection[] | null>(null);
  const [step, setStep] = useState(0);
  const [selectedId, setSelectedId] = useState<string>();
  const [query, setQuery] = useState('');
  const [queryError, setQueryError] = useState('');
  const [shareNote, setShareNote] = useState('');
  const [shared, setShared] = useState<{ gamePk?: number; sectionId?: string }>({});
  const [attempt, setAttempt] = useState(0);

  // A shared link opens straight on its game and section.
  useEffect(() => {
    if (lockedStadiumId) setShared(parseShareParams(window.location.search));
  }, [lockedStadiumId]);

  // Load the park's upcoming home games and its sections.
  const parkId = park?.id;
  useEffect(() => {
    if (!parkId) return;
    let cancelled = false;
    setGames(null);
    setGamesFailed(false);
    setSections(null);
    setGameKey('');
    setStep(0);
    mlbApi.getUpcomingHomeGames(parkId)
      .then((list) => { if (!cancelled) setGames(list); })
      .catch(() => { if (!cancelled) { setGames([]); setGamesFailed(true); } });
    getStadiumSections(parkId, 'MLB')
      .then((list) => { if (!cancelled) setSections(list); })
      .catch(() => { if (!cancelled) setSections([]); });
    return () => { cancelled = true; };
  }, [parkId, attempt]);

  // Pick the shared game, or the next home game with a set start time.
  useEffect(() => {
    if (!games || gameKey || !park) return;
    const fromLink = shared.gamePk ? games.find((g) => g.gamePk === shared.gamePk) : undefined;
    const next = fromLink ?? games.find((g) => !g.status.startTimeTBD);
    setGameKey(next ? String(next.gamePk) : CUSTOM);
    if (!next) setCustomDate(todayIn(park.timezone));
    if (shared.sectionId) setSelectedId(shared.sectionId);
  }, [games, gameKey, park, shared]);

  const game = games?.find((g) => String(g.gamePk) === gameKey);
  const firstPitch = useMemo(() => {
    if (!park) return null;
    if (gameKey === CUSTOM) {
      if (!customDate || !customTime) return null;
      try {
        return stadiumLocalToUTC(customDate, customTime, park.timezone);
      } catch {
        return null;
      }
    }
    if (!game || game.status.startTimeTBD) return null;
    return new Date(game.gameDate);
  }, [park, gameKey, game, customDate, customTime]);

  const result = useMemo(
    () => (park && sections && sections.length && firstPitch ? parkGameShade(park, sections, firstPitch, park.precisionDeg) : null),
    [park, sections, firstPitch],
  );
  const layout = useMemo(
    () => (park && sections && sections.length ? layoutSeatMap(sections, park.orientation) : null),
    [park, sections],
  );
  const byId = useMemo(() => new Map((result?.sections ?? []).map((s) => [s.sectionId, s])), [result]);
  const best = useMemo(() => (result ? bestSections(result.sections, 5) : []), [result]);
  const selected: SectionGameShade | undefined = selectedId ? byId.get(selectedId) : undefined;
  const sunDown = result ? result.sun.every((s) => s.altitudeDeg <= 0) : false;

  // On a stadium page, keep the address bar as the share link.
  useEffect(() => {
    if (!lockedStadiumId || !park || !gameKey) return;
    const url = buildShareUrl('', park.id, game && gameKey !== CUSTOM ? game.gamePk : undefined, selectedId);
    window.history.replaceState(window.history.state, '', url);
  }, [lockedStadiumId, park, gameKey, game, selectedId]);

  const onFind = (event: FormEvent) => {
    event.preventDefault();
    if (!query.trim()) {
      setQueryError('Enter a section number first.');
      return;
    }
    const found = result ? findSection(result.sections, query) : undefined;
    if (!found) {
      setQueryError(`No section "${query.trim()}" at ${park?.name}. Tap one on the map instead.`);
      return;
    }
    setSelectedId(found.sectionId);
    setShareNote('');
  };

  const share = async () => {
    if (!park || !selected) return;
    const url = buildShareUrl(window.location.origin, park.id, game && gameKey !== CUSTOM ? game.gamePk : undefined, selected.sectionId);
    try {
      await navigator.clipboard.writeText(url);
      setShareNote('Link copied');
    } catch {
      setShareNote(url);
    }
  };

  const clockAt = (i: number) => (firstPitch && park ? formatClock(new Date(firstPitch.getTime() + i * 30 * 60000), park.timezone) : '');
  const inningLabel = (i: number) => inningAt(i * 30)?.replace(/^the /, '') ?? 'end of game';
  const best0 = best[0];

  return (
    <section className={styles.finder} aria-label="Shade finder">
      <div className={styles.pickers}>
        {!lockedStadiumId && (
          <label className={styles.field}>
            <span className={styles.label}>Stadium</span>
            <select
              className={styles.select}
              value={stadiumId}
              onChange={(e) => { setStadiumId(e.target.value); setSelectedId(undefined); setShared({}); }}
            >
              <option value="">Choose a stadium</option>
              {[...parks].sort((a, b) => a.name.localeCompare(b.name)).map((p) => (
                <option key={p.id} value={p.id}>{p.name} · {p.team}</option>
              ))}
            </select>
          </label>
        )}
        {park && (
          <label className={styles.field}>
            <span className={styles.label}>Game</span>
            <select
              className={styles.select}
              value={gameKey}
              disabled={!games}
              onChange={(e) => {
                setGameKey(e.target.value);
                setStep(0);
                if (e.target.value === CUSTOM && !customDate) setCustomDate(todayIn(park.timezone));
              }}
            >
              {!games && <option value="">Loading games…</option>}
              {games?.map((g) => (
                <option key={g.gamePk} value={String(g.gamePk)}>{formatGameOption(g, park.timezone)}</option>
              ))}
              {games && <option value={CUSTOM}>Another date and time</option>}
            </select>
          </label>
        )}
        {park && gameKey === CUSTOM && (
          <div className={styles.customRow}>
            <label className={styles.field}>
              <span className={styles.label}>Date</span>
              <input className={styles.input} type="date" value={customDate} onChange={(e) => setCustomDate(e.target.value)} />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>First pitch (local time)</span>
              <input className={styles.input} type="time" value={customTime} onChange={(e) => setCustomTime(e.target.value)} />
            </label>
          </div>
        )}
      </div>

      {!park && <p className={styles.hint}>Pick a stadium to see which seats are in the shade.</p>}
      {park && gamesFailed && (
        <p className={styles.notice}>
          Couldn&apos;t load the schedule. <button type="button" className={styles.linkButton} onClick={() => setAttempt((n) => n + 1)}>Try again</button> or pick another date and time.
        </p>
      )}
      {park && game?.status.startTimeTBD && gameKey !== CUSTOM && (
        <p className={styles.notice}>MLB hasn&apos;t set the start time for this game yet. Pick another game, or choose a date and time.</p>
      )}
      {park && (!sections || (firstPitch && !result)) && !gamesFailed && <p className={styles.hint}>Working out the shade…</p>}

      {park && result && layout && (
        <>
          <div className={styles.answer}>
            {park.roof === 'fixed' ? (
              <p><strong>{park.name} has a fixed roof:</strong> every seat is out of the sun.</p>
            ) : sunDown ? (
              <p><strong>Night game:</strong> the sun is down by first pitch, so every seat is out of the sun.</p>
            ) : best0 ? (
              <p>
                <strong>Best bet:</strong> Section {best0.sectionId} ({best0.tierLabel}):{' '}
                {best0.sentence.slice(best0.sentence.indexOf(': ') + 2)}
              </p>
            ) : (
              <p>Most of the park is in the sun for this game.</p>
            )}
          </div>
          {park.roof === 'retractable' && (
            <p className={styles.notice}>The roof can close. If it does, every seat is in the shade; the map shows it open.</p>
          )}
          {!result.profiled && park.roof !== 'fixed' && (
            <p className={styles.notice}>Early estimate: we haven&apos;t measured this ballpark&apos;s decks and roof yet, so treat these colors as a rough guide.</p>
          )}

          <div className={styles.timeRow}>
            <label htmlFor={`${uid}-time`} className={styles.timeLabel}>
              {clockAt(step)} · {step === 6 ? 'end of game' : `about the ${inningLabel(step)}`}
            </label>
            <input
              id={`${uid}-time`}
              className={styles.slider}
              type="range"
              min={0}
              max={6}
              step={1}
              value={step}
              aria-valuetext={`${clockAt(step)}, ${inningLabel(step)}`}
              onChange={(e) => setStep(Number(e.target.value))}
            />
          </div>

          <svg className={styles.map} viewBox={layout.viewBox} role="img" aria-label={`${park.name} seat map colored by shade at ${clockAt(step)}`}>
            <path d={layout.grassPath} className={styles.grass} />
            <path d={layout.dirtPath} className={styles.dirt} />
            {layout.tiles.map((t) => {
              const s = byId.get(t.id);
              const status = s ? s.samples[step].status : 'none';
              return (
                <rect
                  key={t.id}
                  x={t.cx - t.w / 2}
                  y={t.cy - t.h / 2}
                  width={t.w}
                  height={t.h}
                  rx={Math.min(t.w, t.h) * 0.15}
                  transform={`rotate(${t.rotate.toFixed(1)} ${t.cx} ${t.cy})`}
                  className={`${styles.tile} ${styles[status]} ${selectedId === t.id ? styles.selected : ''}`}
                  onClick={() => { if (s) { setSelectedId(t.id); setShareNote(''); setQueryError(''); } }}
                >
                  <title>{s ? `Section ${t.id}: ${STATUS_LABEL[s.samples[step].status]}` : `${t.id}: not rated`}</title>
                </rect>
              );
            })}
          </svg>
          <ul className={styles.legend} aria-label="Map key">
            <li><span className={`${styles.swatch} ${styles.shaded}`} />Shaded</li>
            <li><span className={`${styles.swatch} ${styles.partial}`} />Partial shade</li>
            <li><span className={`${styles.swatch} ${styles.sun}`} />Sun</li>
            <li><span className={`${styles.swatch} ${styles.none}`} />Not rated</li>
          </ul>

          <form className={styles.search} onSubmit={onFind}>
            <label htmlFor={`${uid}-find`} className={styles.label}>Find your section</label>
            <div className={styles.searchRow}>
              <input
                id={`${uid}-find`}
                className={styles.input}
                value={query}
                inputMode="text"
                autoComplete="off"
                placeholder={best0?.sectionId ?? '214A'}
                aria-describedby={`${uid}-find-error`}
                onChange={(e) => { setQuery(e.target.value); setQueryError(''); }}
              />
              <button type="submit" className={styles.button}>Find</button>
            </div>
            <p id={`${uid}-find-error`} className={styles.error} role="status">{queryError}</p>
          </form>

          {selected && (
            <div className={styles.card}>
              <p className={styles.cardTitle}>{selected.sentence}</p>
              <p className={styles.cardMeta}>
                {selected.tierLabel} · <span className={`${styles.pill} ${styles[selected.confidence]}`}>{CONFIDENCE_LABEL[selected.confidence]}</span>
              </p>
              <ol className={styles.strip} aria-label="Shade through the game">
                {selected.samples.map((sample, i) => (
                  <li key={sample.minutesFromStart}>
                    <span className={`${styles.cell} ${styles[sample.status]}`} title={STATUS_LABEL[sample.status]} />
                    <span className={styles.cellLabel}>{clockAt(i)}</span>
                    <span className={styles.visuallyHidden}>{STATUS_LABEL[sample.status]}</span>
                  </li>
                ))}
              </ol>
              <div className={styles.shareRow}>
                <button type="button" className={styles.button} onClick={share}>Share this section</button>
                <span className={styles.shareNote} role="status">{shareNote}</span>
              </div>
            </div>
          )}
          {selectedId && !selected && (
            <p className={styles.notice}>Section {selectedId} isn&apos;t rated (standing room or a table area).</p>
          )}

          {best.length > 0 && park.roof !== 'fixed' && !sunDown && (
            <div className={styles.best}>
              <h3 className={styles.bestTitle}>Most shade this game</h3>
              <ul>
                {best.map((s) => (
                  <li key={s.sectionId}>
                    <button type="button" className={styles.bestItem} onClick={() => { setSelectedId(s.sectionId); setShareNote(''); }}>
                      <span>Section {s.sectionId} · {s.tierLabel}</span>
                      <span className={styles.bestConfidence}>{CONFIDENCE_LABEL[s.confidence]}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p className={styles.footnote}>
            Confidence is how sure we are: High means the answer holds even if our ballpark measurements are a little off.
          </p>
        </>
      )}
    </section>
  );
}
