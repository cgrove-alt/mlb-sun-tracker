/** @jest-environment node */
import { NextRequest } from 'next/server';
import { middleware } from '../../middleware';
import { nflApiClient } from '../services/nflApiClient';

const connectSrc = () => {
  const policy = middleware(new NextRequest('https://theshadium.com/seats-shade-finder'))
    .headers.get('Content-Security-Policy')!;
  return policy.split('; ').find((directive) => directive.startsWith('connect-src '))!.split(' ').slice(1);
};

describe('the security policy', () => {
  it("lets the finder ask for the NFL schedule", async () => {
    const asked = jest.fn(async (_url: string) => ({ ok: true, json: async () => ({ events: [] }) }));
    global.fetch = asked as any;
    await nflApiClient.fetchVenueSchedule('lambeau-field', 2025);
    expect(connectSrc()).toContain(new URL(asked.mock.calls[0][0]).origin);
  });

  it('names each host the browser may call, and no others', () => {
    expect(connectSrc()).toEqual([
      "'self'",
      'https://api.open-meteo.com',
      'https://statsapi.mlb.com',
      'https://site.api.espn.com',
      'https://www.google-analytics.com',
      'https://region1.google-analytics.com',
      'https://www.google.com',
      'https://*.google-analytics.com',
    ]);
  });
});
