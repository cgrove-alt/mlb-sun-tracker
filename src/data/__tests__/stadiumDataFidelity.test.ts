/**
 * Tests for stadium data-fidelity classification (Phase 9 A3).
 *
 * @jest-environment node
 */

import {
  classifyFidelity,
  getStadiumDataFidelity,
  STADIUM_DATA_FIDELITY,
  REAL_DATA_STADIUMS,
  fidelityNote,
} from '../stadiumDataFidelity';
import { MLB_STADIUMS } from '../stadiums';

const span = (n: number) => Array.from({ length: n }, (_, i) => ({ angleSpan: 5 + (i % 3) }));

describe('classifyFidelity', () => {
  it('returns real for allowlisted hand-authored parks', () => {
    expect(classifyFidelity(span(184), 'yankees', true)).toBe('real');
    expect(classifyFidelity(span(277), 'redsox', true)).toBe('real');
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

describe('getStadiumDataFidelity (real data)', () => {
  it('classifies the three authored parks as real', () => {
    Array.from(REAL_DATA_STADIUMS).forEach((id) => {
      expect(getStadiumDataFidelity(id)).toBe('real');
    });
  });

  it('classifies a known template park as approximate', () => {
    expect(getStadiumDataFidelity('dodgers')).toBe('approximate');
  });
});

describe('STADIUM_DATA_FIDELITY map', () => {
  it('covers every MLB stadium', () => {
    expect(Object.keys(STADIUM_DATA_FIDELITY).sort()).toEqual(
      MLB_STADIUMS.map((s) => s.id).sort(),
    );
  });

  it('currently has exactly 3 real and the rest approximate', () => {
    const vals = Object.values(STADIUM_DATA_FIDELITY);
    expect(vals.filter((v) => v === 'real')).toHaveLength(3);
    expect(vals.filter((v) => v === 'approximate')).toHaveLength(MLB_STADIUMS.length - 3);
  });
});

describe('fidelityNote', () => {
  it('has no disclaimer for real, a disclosure for approximate', () => {
    expect(fidelityNote('real')).toBeNull();
    expect(fidelityNote('approximate')).toMatch(/approximate/i);
    expect(fidelityNote('partial')).toMatch(/partial/i);
  });
});
