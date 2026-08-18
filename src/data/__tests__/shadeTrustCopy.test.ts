/** @jest-environment node */

import fs from 'node:fs';
import path from 'node:path';

const PUBLIC_TRUST_SURFACES = [
  'app/HomePage.tsx',
  'app/HomepageSchema.tsx',
  'app/league/[leagueId]/page.tsx',
  'app/layout.tsx',
  'app/opengraph-image.tsx',
  'app/stadium/[stadiumId]/StadiumPageSSR.tsx',
  'app/stadium/[stadiumId]/StadiumPageClient.tsx',
  'components/FooterModern.tsx',
  'components/SafeSchema.tsx',
  'src/components/SectionShadeSEO.tsx',
  'src/components/MobileStadiumGuide.tsx',
  'src/components/StadiumSchema.tsx',
  'src/MobileApp.tsx',
  'src/data/guides/mlbStadiumGuides.ts',
];

const FORBIDDEN_UNQUALIFIED_CLAIMS = [
  /shows? (?:you )?exactly which/i,
  /highly accurate shade/i,
  /guaranteed shade/i,
  /complete sun exposure analysis/i,
  /real-time sun tracking/i,
  /section-by-section shade analysis/i,
  /real-time shade calculations/i,
  /shade predictions for every/i,
];

describe('public shade trust copy', () => {
  it.each(PUBLIC_TRUST_SURFACES)('%s contains no precise unvalidated promise', (relativePath) => {
    const contents = fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8');
    FORBIDDEN_UNQUALIFIED_CLAIMS.forEach((claim) => expect(contents).not.toMatch(claim));
  });
});
