/**
 * Every static page tells search engines its own URL. A page without a
 * canonical can be indexed under tracking-parameter variants of its URL.
 */
import fs from 'fs';
import path from 'path';

const appDir = path.join(__dirname, '..');

function staticRoutes(dir: string, route = ''): string[] {
  const found: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith('[') || entry.name.startsWith('_') || entry.name === '__tests__' || entry.name === 'api') continue;
    found.push(...staticRoutes(path.join(dir, entry.name), `${route}/${entry.name}`));
  }
  if (fs.existsSync(path.join(dir, 'page.tsx'))) found.push(route || '/');
  return found;
}

describe('canonical tags', () => {
  const routes = staticRoutes(appDir);

  it('finds the static pages', () => {
    expect(routes).toEqual(expect.arrayContaining(['/', '/privacy', '/terms', '/contact', '/cookies']));
  });

  it.each(routes)('%s declares its own canonical URL', (route) => {
    const dir = path.join(appDir, route);
    const source = ['page.tsx', 'layout.tsx']
      .map((file) => path.join(dir, file))
      .filter((file) => fs.existsSync(file))
      .map((file) => fs.readFileSync(file, 'utf-8'))
      .join('\n');
    const expected = `https://theshadium.com${route === '/' ? '/' : route}`;
    expect(source).toContain(`canonical: '${expected}'`);
  });
});
