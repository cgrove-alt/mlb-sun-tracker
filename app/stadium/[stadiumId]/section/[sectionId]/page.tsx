import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import * as fs from 'fs';
import * as path from 'path';
import { MLB_STADIUMS } from '../../../../../src/data/stadiums';
import SectionPageClient from './SectionPageClient';

interface SectionPageProps {
  params: Promise<{
    stadiumId: string;
    sectionId: string;
  }>;
}

/**
 * Map stadium ID to seat data directory name
 * Most stadiums have matching IDs, except Dodgers
 */
function getSeatDataStadiumId(stadiumId: string): string {
  return stadiumId === 'dodgers' ? 'dodger-stadium' : stadiumId;
}

export async function generateStaticParams() {
  // Generate section pages for all 30 MLB stadiums
  const allParams: Array<{ stadiumId: string; sectionId: string }> = [];

  for (const stadium of MLB_STADIUMS) {
    const seatDataStadiumId = getSeatDataStadiumId(stadium.id);
    const sectionsDir = path.join(
      process.cwd(),
      'src',
      'data',
      'seatData',
      seatDataStadiumId,
      'sections'
    );

    try {
      // Check if directory exists
      if (fs.existsSync(sectionsDir)) {
        const sectionFiles = fs
          .readdirSync(sectionsDir)
          .filter((f) => f.endsWith('.ts') && f !== '_template.ts')
          .map((f) => f.replace('.ts', ''));

        // Add all sections for this stadium
        sectionFiles.forEach((sectionId) => {
          allParams.push({
            stadiumId: stadium.id,
            sectionId,
          });
        });

        console.log(`✓ Generated ${sectionFiles.length} section pages for ${stadium.name}`);
      } else {
        console.warn(`⚠️  No seat data found for ${stadium.name} at ${sectionsDir}`);
      }
    } catch (error) {
      console.error(`Failed to read sections for ${stadium.name}:`, error);
    }
  }

  console.log(`\n📊 Total section pages generated: ${allParams.length} across ${MLB_STADIUMS.length} stadiums\n`);

  return allParams;
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

  // Map stadium ID to seat data directory name
  const seatDataStadiumId = getSeatDataStadiumId(stadiumId);

  // Verify section exists by checking if JSON file exists
  // Note: We don't load the data here - the client component will do that
  const sectionPath = path.join(
    process.cwd(),
    'public',
    'data',
    'seats',
    seatDataStadiumId,
    `${sectionId}.json`
  );

  if (!fs.existsSync(sectionPath)) {
    notFound();
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
        sectionId={sectionId}
        seatDataStadiumId={seatDataStadiumId}
      />
    </div>
  );
}
