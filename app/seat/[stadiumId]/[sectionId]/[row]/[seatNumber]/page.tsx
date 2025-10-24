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
 * ISR Configuration
 * - dynamicParams: Allow pages not in generateStaticParams to be generated on-demand
 * - revalidate: Revalidate cached pages every hour (3600 seconds)
 */
export const dynamicParams = true;
export const revalidate = 3600;

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
