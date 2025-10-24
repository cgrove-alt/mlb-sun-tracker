import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import { MLB_STADIUMS } from '../../../../../../src/data/stadiums';
import SeatPageClient from './SeatPageClient';
import type { SectionSeatingData, Seat } from '../../../../../../src/types/seat';

interface SeatPageParams {
  stadiumId: string;
  sectionId: string;
  row: string;
  seatNumber: string;
}

interface SeatPageProps {
  params: Promise<SeatPageParams>;
}

/**
 * Generate static paths for all seats across all stadiums
 * This creates ~1.2M static pages at build time
 */
export async function generateStaticParams(): Promise<SeatPageParams[]> {
  const params: SeatPageParams[] = [];

  // Read manifest to get list of stadiums with seat data
  const manifestPath = path.join(process.cwd(), 'public', 'data', 'search', 'seat-indices-manifest.json');

  if (!fs.existsSync(manifestPath)) {
    console.warn('Seat indices manifest not found, skipping seat page generation');
    return [];
  }

  const manifestData = fs.readFileSync(manifestPath, 'utf-8');
  const manifest = JSON.parse(manifestData);

  console.log(`\n🎫 Generating static params for ${manifest.totalSeats.toLocaleString()} seats across ${manifest.totalStadiums} stadiums...`);

  // Process each stadium
  for (const stadiumInfo of manifest.stadiums) {
    const stadiumId = stadiumInfo.id;

    // Map stadium ID to seat data directory name
    const seatDataStadiumId = stadiumId === 'dodgers' ? 'dodger-stadium' : stadiumId;
    const seatDataDir = path.join(process.cwd(), 'public', 'data', 'seats', seatDataStadiumId);

    if (!fs.existsSync(seatDataDir)) {
      console.warn(`⚠️  No seat data directory for ${stadiumInfo.name}`);
      continue;
    }

    // Get all section files
    const sectionFiles = fs.readdirSync(seatDataDir).filter(f => f.endsWith('.json'));

    console.log(`  📍 ${stadiumInfo.name}: ${sectionFiles.length} sections`);

    // Process each section
    for (const sectionFile of sectionFiles) {
      try {
        const sectionPath = path.join(seatDataDir, sectionFile);
        const sectionData: SectionSeatingData = JSON.parse(fs.readFileSync(sectionPath, 'utf-8'));

        // Generate params for each seat in each row
        for (const row of sectionData.rows) {
          for (const seat of row.seats) {
            params.push({
              stadiumId,
              sectionId: sectionData.sectionId,
              row: seat.row,
              seatNumber: seat.seatNumber,
            });
          }
        }
      } catch (error) {
        console.error(`Error processing ${stadiumId}/${sectionFile}:`, error);
      }
    }
  }

  console.log(`✅ Generated ${params.length.toLocaleString()} seat page params\n`);

  return params;
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({ params }: SeatPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { stadiumId, sectionId, row, seatNumber } = resolvedParams;

  // Find stadium info
  const stadium = MLB_STADIUMS.find(s => s.id === stadiumId);

  if (!stadium) {
    return {
      title: 'Seat Not Found',
    };
  }

  // Load seat data
  const seatDataStadiumId = stadiumId === 'dodgers' ? 'dodger-stadium' : stadiumId;
  const seatDataPath = path.join(
    process.cwd(),
    'public',
    'data',
    'seats',
    seatDataStadiumId,
    `${sectionId}.json`
  );

  let seatData: Seat | null = null;
  let sectionName = `Section ${sectionId}`;

  if (fs.existsSync(seatDataPath)) {
    try {
      const sectionData: SectionSeatingData = JSON.parse(fs.readFileSync(seatDataPath, 'utf-8'));
      sectionName = sectionData.sectionName;

      // Find the specific seat
      for (const rowData of sectionData.rows) {
        const foundSeat = rowData.seats.find(s => s.row === row && s.seatNumber === seatNumber);
        if (foundSeat) {
          seatData = foundSeat;
          break;
        }
      }
    } catch (error) {
      console.error('Error loading seat data:', error);
    }
  }

  const title = `${stadium.name} - ${sectionName} Row ${row} Seat ${seatNumber}`;
  const description = seatData
    ? `Detailed view of seat ${seatNumber} in row ${row} of ${sectionName} at ${stadium.name}. ${
        seatData.covered ? 'Covered seat' : 'Open-air seat'
      }${seatData.viewQuality ? `, ${seatData.viewQuality} view` : ''}.`
    : `View details for seat ${seatNumber} in row ${row} of ${sectionName} at ${stadium.name}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'MLB Sun Tracker',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    alternates: {
      canonical: `/seat/${stadiumId}/${sectionId}/${row}/${seatNumber}`,
    },
  };
}

/**
 * Seat Detail Page - Server Component
 */
export default async function SeatPage({ params }: SeatPageProps) {
  const resolvedParams = await params;
  const { stadiumId, sectionId, row, seatNumber } = resolvedParams;

  // Find stadium
  const stadium = MLB_STADIUMS.find(s => s.id === stadiumId);

  if (!stadium) {
    notFound();
  }

  // Load seat data
  const seatDataStadiumId = stadiumId === 'dodgers' ? 'dodger-stadium' : stadiumId;
  const seatDataPath = path.join(
    process.cwd(),
    'public',
    'data',
    'seats',
    seatDataStadiumId,
    `${sectionId}.json`
  );

  if (!fs.existsSync(seatDataPath)) {
    notFound();
  }

  let sectionData: SectionSeatingData;
  let seatData: Seat | null = null;

  try {
    sectionData = JSON.parse(fs.readFileSync(seatDataPath, 'utf-8'));

    // Find the specific seat
    for (const rowData of sectionData.rows) {
      const foundSeat = rowData.seats.find(s => s.row === row && s.seatNumber === seatNumber);
      if (foundSeat) {
        seatData = foundSeat;
        break;
      }
    }
  } catch (error) {
    console.error('Error loading seat data:', error);
    notFound();
  }

  if (!seatData) {
    notFound();
  }

  // Structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: `${stadium.name} - ${sectionData.sectionName} Row ${row} Seat ${seatNumber}`,
    description: `Seat ${seatNumber} in row ${row} of ${sectionData.sectionName}`,
    containedInPlace: {
      '@type': 'StadiumOrArena',
      name: stadium.name,
      address: {
        '@type': 'PostalAddress',
        addressLocality: stadium.city,
        addressRegion: stadium.state,
      },
    },
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Client Component */}
      <SeatPageClient
        stadium={stadium}
        section={sectionData}
        seat={seatData}
        stadiumId={stadiumId}
        sectionId={sectionId}
      />
    </>
  );
}
