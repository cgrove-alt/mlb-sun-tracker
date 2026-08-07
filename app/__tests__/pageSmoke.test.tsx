/**
 * Smoke tests for every static page route.
 *
 * There were no tests at all for page-level components (audit L38/L39), so a
 * page could throw on render — a bad import, a null deref in derived data — and
 * nothing would catch it until the build or a user hit it. These render each
 * page and assert it produces markup with a heading.
 *
 * Only synchronous SERVER pages are covered here. The async ones
 * (stadium/[stadiumId], league/[leagueId], blog/[slug]) take route params and
 * do data loading; they are exercised through the API/data tests instead.
 *
 * @jest-environment jsdom
 */

import React from 'react';
import { render } from '@testing-library/react';

// next/link renders an <a> in tests without a router.
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...rest }: any) => <a href={typeof href === 'string' ? href : '#'} {...rest}>{children}</a>,
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), prefetch: jest.fn(), back: jest.fn() }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// The interactive app subtree is exercised by its own tests; a page smoke test
// only needs to know the page shell renders.
jest.mock('../../src/UnifiedApp', () => ({
  __esModule: true,
  default: () => <div data-testid="unified-app" />,
}));

type PageModule = { default: React.ComponentType<any> };

const STATIC_PAGES: Array<[string, () => PageModule]> = [
  ['/', () => require('../page')],
  ['/accessibility', () => require('../accessibility/page')],
  ['/attributions', () => require('../attributions/page')],
  ['/blog', () => require('../blog/page')],
  ['/contact', () => require('../contact/page')],
  ['/cookies', () => require('../cookies/page')],
  ['/disclaimer', () => require('../disclaimer/page')],
  ['/dmca', () => require('../dmca/page')],
  ['/faq', () => require('../faq/page')],
  ['/guide', () => require('../guide/page')],
  ['/guide/avoid-sun-baseball-games', () => require('../guide/avoid-sun-baseball-games/page')],
  ['/guide/best-shaded-seats-mlb', () => require('../guide/best-shaded-seats-mlb/page')],
  ['/guide/how-to-find-shaded-seats', () => require('../guide/how-to-find-shaded-seats/page')],
  ['/how-it-works', () => require('../how-it-works/page')],
  ['/privacy', () => require('../privacy/page')],
  ['/seats-shade-finder', () => require('../seats-shade-finder/page')],
  ['/stadiums', () => require('../stadiums/page')],
  ['/terms', () => require('../terms/page')],
];

describe('page smoke tests', () => {
  it.each(STATIC_PAGES)('%s renders without crashing', (_route, load) => {
    const Page = load().default;
    expect(() => render(<Page />)).not.toThrow();
  });

  it.each(STATIC_PAGES)('%s produces non-empty markup', (_route, load) => {
    const Page = load().default;
    const { container } = render(<Page />);
    expect(container.innerHTML.length).toBeGreaterThan(100);
  });

  it.each(STATIC_PAGES)('%s renders at least one heading', (_route, load) => {
    const Page = load().default;
    const { container } = render(<Page />);
    expect(container.querySelectorAll('h1, h2, h3').length).toBeGreaterThan(0);
  });

  // Regression guard for audit H1: layout.tsx owns the single <main> landmark,
  // so no page may render its own.
  it.each(STATIC_PAGES)('%s does not render its own <main> landmark', (_route, load) => {
    const Page = load().default;
    const { container } = render(<Page />);
    expect(container.querySelectorAll('main')).toHaveLength(0);
  });
});
