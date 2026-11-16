import { test, expect } from '@playwright/test';

// Guards the SEO strengths in the HTML the server sends, before any
// JavaScript runs: one H1 that names the page, valid JSON-LD, a canonical
// URL, and content that isn't parked in a hidden streaming placeholder
// (a loading.tsx on a prebuilt route did that, so the content painted up
// to 300 ms late).
const PAGES: Array<{ path: string; h1: string; text?: string }> = [
  { path: '/', h1: 'Will your seats be in the shade?' },
  { path: '/stadium/yankees', h1: 'Yankee Stadium', text: 'Shade for your game' },
  { path: '/stadium/metlife-stadium-jets', h1: 'MetLife Stadium' },
  { path: '/stadium/las-vegas-aviators', h1: 'Las Vegas Ballpark' },
  { path: '/league/mlb', h1: 'Major League Baseball Stadium Shade Guide' },
  { path: '/stadiums', h1: 'All Stadium Sun Guides' },
  { path: '/blog', h1: 'The Shadium Blog' },
  { path: '/blog/complete-guide-shaded-seats-yankee-stadium', h1: 'Shaded Seats at Yankee Stadium: Where the Sun Hits', text: 'The short answer' },
  { path: '/faq', h1: 'Frequently Asked Questions' },
];

const decode = (s: string) => s.replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"');

test.describe('Server-rendered SEO basics (local)', () => {
  for (const { path, h1, text } of PAGES) {
    test(`${path} ships one H1, JSON-LD and a canonical in its HTML`, async ({ request }) => {
      const res = await request.get(path);
      expect(res.status()).toBe(200);
      const html = await res.text();

      const h1s = [...html.matchAll(/<h1[\s>][\s\S]*?<\/h1>/g)].map((m) => decode(m[0].replace(/<[^>]+>/g, '').trim()));
      expect(h1s).toEqual([h1]);

      const ldBlocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
      expect(ldBlocks.length).toBeGreaterThan(0);
      for (const block of ldBlocks) expect(() => JSON.parse(block)).not.toThrow();

      const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
      expect(canonical).toBe(`https://theshadium.com${path === '/' ? '' : path}`);

      expect(html).not.toMatch(/<div hidden id="S:/);
      if (text) expect(html).toContain(text);
    });
  }
});
