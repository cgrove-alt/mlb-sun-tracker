import fs from 'fs';
import path from 'path';
import en from '../locales/en.json';
import es from '../locales/es.json';
import ja from '../locales/ja.json';

// `t()` returns the raw key when a translation is missing, so a missing key
// shows up on screen as text like "gameSelector.apply". This test finds every
// static `t('some.key')` call in the app and checks each locale has it.

const ROOT = path.resolve(__dirname, '../../..');
const SCAN_DIRS = ['src', 'app', 'components', 'lib'];
const SKIP_DIRS = new Set(['node_modules', '__tests__', '.next']);

function sourceFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return SKIP_DIRS.has(entry.name) ? [] : sourceFiles(full);
    return /\.(ts|tsx)$/.test(entry.name) ? [full] : [];
  });
}

function usedKeys(): Map<string, string> {
  const keys = new Map<string, string>();
  const call = /(?<![\w.$])t\(\s*['"]([A-Za-z0-9_]+(?:\.[A-Za-z0-9_]+)+)['"]/g;
  for (const dir of SCAN_DIRS) {
    for (const file of sourceFiles(path.join(ROOT, dir))) {
      const text = fs.readFileSync(file, 'utf8');
      for (const match of text.matchAll(call)) {
        if (!keys.has(match[1])) keys.set(match[1], path.relative(ROOT, file));
      }
    }
  }
  return keys;
}

function lookup(dict: unknown, key: string): unknown {
  return key.split('.').reduce<unknown>(
    (node, part) => (node && typeof node === 'object' ? (node as Record<string, unknown>)[part] : undefined),
    dict,
  );
}

describe('translation keys', () => {
  const keys = usedKeys();

  it('finds the t() calls it is meant to check', () => {
    expect(keys.has('gameSelector.apply')).toBe(true);
    expect(keys.size).toBeGreaterThan(10);
  });

  it.each([
    ['en', en],
    ['es', es],
    ['ja', ja],
  ])('every key used in the app exists in %s', (_lang, dict) => {
    const missing = [...keys.entries()]
      .filter(([key]) => typeof lookup(dict, key) !== 'string')
      .map(([key, file]) => `${key} (used in ${file})`);
    expect(missing).toEqual([]);
  });
});
