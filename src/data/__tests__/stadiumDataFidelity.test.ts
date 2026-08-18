/**
 * Tests for stadium data-fidelity classification (Phase 9 A3).
 *
 * @jest-environment node
 */

import {
  classifyFidelity,
  getStadiumDataFidelity,
  computeStadiumDataFidelity,
  STADIUM_DATA_FIDELITY,
  SOURCE_BACKED_INVENTORY_STADIUMS,
  fidelityNote,
} from '../stadiumDataFidelity';
import { MLB_STADIUMS } from '../stadiums';

const span = (n: number) => Array.from({ length: n }, (_, i) => ({ angleSpan: 5 + (i % 3) }));

describe('classifyFidelity', () => {
  it('returns source-backed for allowlisted published inventories', () => {
    expect(classifyFidelity(span(184), 'yankees', true)).toBe('source-backed');
    expect(classifyFidelity(span(277), 'redsox', true)).toBe('source-backed');
  });

  it('returns approximate for the 65-section template signature', () => {
    expect(classifyFidelity(span(65), 'dodgers', true)).toBe('approximate');
  });

  it('returns approximate when no registered file (generic fallback)', () => {
    expect(classifyFidelity([], 'whoever', false)).toBe('approximate');
  });

  it('returns approximate for any perfectly-uniform-wedge generator', () => {
    const uniform = Array.from({ length: 40 }, () => ({ angleSpan: 9 }));
    expect(classifyFidelity(uniform, 'someteam', true)).toBe('approximate');
  });
});

describe('getStadiumDataFidelity (source-backed inventory)', () => {
  it('classifies every published inventory as source-backed', () => {
    Array.from(SOURCE_BACKED_INVENTORY_STADIUMS).forEach((id) => {
      expect(getStadiumDataFidelity(id)).toBe('source-backed');
    });
  });

  it('keeps an unknown park approximate', () => {
    expect(getStadiumDataFidelity('not-a-park')).toBe('approximate');
  });
});

describe('STADIUM_DATA_FIDELITY map', () => {
  it('covers every MLB stadium', () => {
    expect(Object.keys(STADIUM_DATA_FIDELITY).sort()).toEqual(
      MLB_STADIUMS.map((s) => s.id).sort(),
    );
  });

  it('has source-backed section inventory for every MLB park', () => {
    const vals = Object.values(STADIUM_DATA_FIDELITY);
    expect(vals.filter((v) => v === 'source-backed')).toHaveLength(MLB_STADIUMS.length);
    expect(vals.filter((v) => v === 'approximate')).toHaveLength(0);
  });

  // STADIUM_DATA_FIDELITY is a checked-in table so that rendering a fidelity
  // notice does not pull every stadium's section file into the bundle. That
  // trade is only safe if the table cannot silently go stale: this recomputes
  // each entry from the real section data and fails on any drift.
  it('matches the value recomputed from the real section data', async () => {
    const computed = await Promise.all(
      MLB_STADIUMS.map(async (s) => [s.id, await computeStadiumDataFidelity(s.id)] as const),
    );

    const drifted = computed.filter(([id, value]) => STADIUM_DATA_FIDELITY[id] !== value);

    expect(
      drifted.map(([id, value]) => `${id}: table=${STADIUM_DATA_FIDELITY[id]} actual=${value}`),
    ).toEqual([]);
  });
});

describe('fidelityNote', () => {
  it('discloses the geometry boundary for source-backed and approximate data', () => {
    expect(fidelityNote('source-backed')).toMatch(/independent observation validation/i);
    expect(fidelityNote('approximate')).toMatch(/approximate/i);
    expect(fidelityNote('partial')).toMatch(/partial/i);
  });
});
