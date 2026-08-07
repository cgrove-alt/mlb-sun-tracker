/**
 * Every in-page anchor (`/route#fragment`) must point at an id that exists.
 *
 * The footer linked to `/privacy#gdpr`, which had no matching element — the
 * link "worked" (it navigated to /privacy) but silently dropped the reader at
 * the top of a long policy page instead of the EU rights they clicked for.
 * Nothing catches that class of bug at build time, so it is checked here.
 *
 * @jest-environment jsdom
 */

import React from 'react';
import { render } from '@testing-library/react';

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...rest }: any) => <a href={typeof href === 'string' ? href : '#'} {...rest}>{children}</a>,
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), prefetch: jest.fn() }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

/** Pages that own anchor targets, keyed by route. */
const PAGES: Record<string, () => { default: React.ComponentType<any> }> = {
  '/privacy': () => require('../privacy/page'),
  '/terms': () => require('../terms/page'),
  '/cookies': () => require('../cookies/page'),
  '/accessibility': () => require('../accessibility/page'),
  '/faq': () => require('../faq/page'),
};

/** Components that emit cross-page anchor links. */
const LINK_SOURCES: Array<[string, () => { default: React.ComponentType<any> }]> = [
  ['FooterModern', () => require('../../components/FooterModern')],
];

function idsOn(route: string): Set<string> {
  const loader = PAGES[route];
  if (!loader) return new Set();
  const Page = loader().default;
  const { container } = render(<Page />);
  return new Set(
    Array.from(container.querySelectorAll('[id]')).map(el => el.id)
  );
}

describe('internal anchor links resolve', () => {
  it.each(LINK_SOURCES)('%s: every #fragment link has a matching id', (_name, load) => {
    const Component = load().default;
    const { container } = render(<Component />);

    const anchorLinks = Array.from(container.querySelectorAll('a[href*="#"]'))
      .map(a => a.getAttribute('href') || '')
      .filter(href => href.includes('#') && !href.startsWith('#'));

    const broken: string[] = [];
    for (const href of anchorLinks) {
      const [route, fragment] = href.split('#');
      if (!fragment) continue;
      if (!(route in PAGES)) continue; // target page not covered here
      if (!idsOn(route).has(fragment)) broken.push(href);
    }

    expect(broken).toEqual([]);
  });

  // The two the footer actually depends on.
  it.each([['gdpr'], ['california']])('privacy page has an element with id="%s"', id => {
    expect(idsOn('/privacy').has(id)).toBe(true);
  });

  it('privacy page table-of-contents links all resolve', () => {
    const Page = PAGES['/privacy']().default;
    const { container } = render(<Page />);
    const ids = new Set(Array.from(container.querySelectorAll('[id]')).map(el => el.id));

    const broken = Array.from(container.querySelectorAll('a[href^="#"]'))
      .map(a => (a.getAttribute('href') || '').slice(1))
      .filter(frag => frag && !ids.has(frag));

    expect(broken).toEqual([]);
  });
});
