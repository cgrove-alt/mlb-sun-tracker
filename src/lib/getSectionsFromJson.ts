// src/lib/getSectionsFromJson.ts
// Loads section data from public/data/sections/mlb/{stadiumId}.json
// Falls back to the TypeScript dynamic import via getStadiumSectionsAsync

import type { StadiumSection } from '../data/stadiumSectionTypes';

export async function getSectionsFromJson(stadiumId: string): Promise<StadiumSection[] | null> {
  try {
    // In server-side context, read from filesystem
    const fs = await import('fs/promises');
    const path = await import('path');
    const filePath = path.join(process.cwd(), 'public', 'data', 'sections', 'mlb', `${stadiumId}.json`);
    const raw = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(raw);
    return data.sections as StadiumSection[];
  } catch {
    return null;
  }
}
