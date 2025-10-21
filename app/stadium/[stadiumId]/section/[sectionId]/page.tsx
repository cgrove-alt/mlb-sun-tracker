import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import * as fs from 'fs';
import * as path from 'path';
import { MLB_STADIUMS } from '../../../../../src/data/stadiums';
import { getSeatDataForSection, loadPrecomputedSunData, getSectionSunExposure } from '../../../../../src/utils/seatDataLoader';
import SectionPageClient from './SectionPageClient';

interface SectionPageProps {
  params: Promise<{
    stadiumId: string;
    sectionId: string;
  }>;
}

export async function generateStaticParams() {
  // Read actual section files from disk to generate accurate params
  const sectionsDir = path.join(
    process.cwd(),
    'src',
    'data',
    'seatData',
    'dodger-stadium',
    'sections'
  );

  try {
    const sectionFiles = fs
      .readdirSync(sectionsDir)
      .filter((f) => f.endsWith('.ts') && f !== '_template.ts')
      .map((f) => f.replace('.ts', ''));

    return sectionFiles.map((sectionId) => ({
      stadiumId: 'dodgers',
      sectionId,
    }));
  } catch (error) {
    console.error('Failed to read section files:', error);
    // Fallback to empty array if directory doesn't exist
    return [];
  }
}

export async function generateMetadata({ params }: SectionPageProps): Promise<Metadata> {
  const { stadiumId, sectionId } = await params;
  const stadium = MLB_STADIUMS.find((s) => s.id === stadiumId);

  if (!stadium) {
    return {
      title: 'Section Not Found | The Shadium',
    };
  }

  const title = `Section ${sectionId} Seats - ${stadium.name} | The Shadium`;
  const description = `View all seats in Section ${sectionId} at ${stadium.name}. See sun exposure for every seat with our interactive seat map. Find the perfect shaded seat for your ${stadium.team} game.`;

  return {
    title,
    description,
    keywords: [
      `${stadium.name} Section ${sectionId}`,
      `Section ${sectionId} seats`,
      `${stadium.name} seat map`,
      `Section ${sectionId} sun exposure`,
      `best seats section ${sectionId}`,
      `${stadium.team} seating`,
    ],
    alternates: {
      canonical: `https://theshadium.com/stadium/${stadiumId}/section/${sectionId}`,
    },
    openGraph: {
      title: `Section ${sectionId} - ${stadium.name}`,
      description: `Interactive seat map for Section ${sectionId} at ${stadium.name}. View sun exposure for every seat.`,
      type: 'article',
      url: `https://theshadium.com/stadium/${stadiumId}/section/${sectionId}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function SectionPage({ params }: SectionPageProps) {
  const { stadiumId, sectionId } = await params;

  // Find stadium
  const stadium = MLB_STADIUMS.find((s) => s.id === stadiumId);
  if (!stadium) {
    notFound();
  }

  // Load section seat data
  // Map stadiumId to seat data directory name
  const seatDataStadiumId = stadiumId === 'dodgers' ? 'dodger-stadium' : stadiumId;
  const sectionData = await getSeatDataForSection(seatDataStadiumId, sectionId);

  if (!sectionData) {
    notFound();
  }

  // Load precomputed sun data (server-side only)
  let sunExposureData: Record<string, boolean> | null = null;
  try {
    const precomputedData = await loadPrecomputedSunData(seatDataStadiumId, '13:10');
    if (precomputedData) {
      const today = new Date();
      sunExposureData = getSectionSunExposure(
        precomputedData,
        sectionId,
        today,
        today
      );
    }
  } catch (error) {
    console.error('Failed to load precomputed sun data:', error);
    // Continue without sun data - page will still render
  }

  // Structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `Section ${sectionId} - ${stadium.name}`,
    description: `Interactive seat map for Section ${sectionId} at ${stadium.name}`,
    url: `https://theshadium.com/stadium/${stadiumId}/section/${sectionId}`,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://theshadium.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: stadium.name,
          item: `https://theshadium.com/stadium/${stadiumId}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: `Section ${sectionId}`,
          item: `https://theshadium.com/stadium/${stadiumId}/section/${sectionId}`,
        },
      ],
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        suppressHydrationWarning
      />

      <SectionPageClient
        stadium={stadium}
        sectionData={sectionData}
        sectionId={sectionId}
        initialSunExposureData={sunExposureData}
      />
    </div>
  );
}
