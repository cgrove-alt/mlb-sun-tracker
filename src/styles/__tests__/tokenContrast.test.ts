/**
 * The color tokens carry their contrast on white in a comment ("10.35:1 on
 * white"). Those figures were once all wrong, some saying a color passed WCAG
 * AA when it didn't (§47). This works each one out again with the WCAG 2
 * formula, so a figure can't drift from its color.
 */
import fs from 'fs';
import path from 'path';

const stylesDir = path.join(__dirname, '..');

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastOnWhite(hex: string): number {
  return 1.05 / (luminance(hex) + 0.05);
}

// `--name: #RRGGBB; /* ... N:1 on white ... */`
function claims(file: string): Array<[string, string, number]> {
  const css = fs.readFileSync(path.join(stylesDir, file), 'utf8');
  return [...css.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6});[^\n]*?(\d+(?:\.\d+)?):1 on white/g)]
    .map((m) => [m[1], m[2], Number(m[3])]);
}

describe.each([
  ['tokens.css', 9],
  ['main.css', 3],
])('%s', (file, count) => {
  const found = claims(file);

  it(`has ${count} contrast figures to check`, () => {
    expect(found).toHaveLength(count);
  });

  it.each(found)('--%s (%s) says %s:1 on white, and is', (_name, hex, claimed) => {
    expect(contrastOnWhite(hex).toFixed(2)).toBe(claimed.toFixed(2));
  });
});
