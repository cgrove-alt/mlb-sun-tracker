/**
 * The ink grays are stated in three places: the color tokens (tokens.css),
 * main.css's copy of them, and Tailwind's palette. Tailwind's `.text-ink-*`
 * classes share their names with main.css's and load later, so if the values
 * drift apart, every `text-ink-*` on the site quietly takes Tailwind's color
 * (§46: Tailwind's 700 and 800 were its stock grays, not the tokens).
 */
import fs from 'fs';
import path from 'path';

const root = path.join(__dirname, '..', '..', '..');
const tailwindConfig = require(path.join(root, 'tailwind.config.js'));
const ink: Record<string, string> = tailwindConfig.theme.extend.colors.ink;

function cssVar(file: string, name: string): string | undefined {
  const css = fs.readFileSync(path.join(root, 'src', 'styles', file), 'utf8');
  return css.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`))?.[1];
}

describe.each(['700', '800', '900'])('ink-%s', (shade) => {
  it('is the same in Tailwind as in tokens.css', () => {
    expect(ink[shade].toLowerCase()).toBe(cssVar('tokens.css', `ink-${shade}`)?.toLowerCase());
  });

  it('is the same in Tailwind as in main.css', () => {
    expect(ink[shade].toLowerCase()).toBe(cssVar('main.css', `color-ink-${shade}`)?.toLowerCase());
  });
});
