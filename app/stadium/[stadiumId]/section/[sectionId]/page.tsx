import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import * as fs from 'fs';
import * as path from 'path';
import { MLB_STADIUMS } from '../../../../../src/data/stadiums';
import SectionPageClient from './SectionPageClient';
import { getStadiumSections } from '../../../../../src/data/stadiumSections';

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
  // Use stadium sections data which has the correct suffixed IDs
  const allParams: Array<{ stadiumId: string; sectionId: string }> = [];

  for (const stadium of MLB_STADIUMS) {
    try {
      // Get sections from stadiumSections data (includes suffixes like 1DG, 48FD, etc.)
      const stadiumSectionsData = getStadiumSections(stadium.id);

      if (stadiumSectionsData && stadiumSectionsData.length > 0) {
        // Add all sections for this stadium using their suffixed IDs
        stadiumSectionsData.forEach((section) => {
          allParams.push({
            stadiumId: stadium.id,
            sectionId: section.id, // This includes suffixes like 1DG, 48FD, 101LG
          });
        });

        console.log(`✓ Generated ${stadiumSectionsData.length} section pages for ${stadium.name}`);
      } else {
        // Fallback: check for JSON files to at least generate numeric pages
        const seatDataStadiumId = getSeatDataStadiumId(stadium.id);
        const jsonDir = path.join(
          process.cwd(),
          'public',
          'data',
          'seats',
          seatDataStadiumId
        );

        if (fs.existsSync(jsonDir)) {
          const jsonFiles = fs
            .readdirSync(jsonDir)
            .filter((f) => f.endsWith('.json'))
            .map((f) => f.replace('.json', ''));

          jsonFiles.forEach((sectionId) => {
            allParams.push({
              stadiumId: stadium.id,
              sectionId,
            });
          });

          console.log(`⚠️  Using JSON fallback for ${stadium.name}: ${jsonFiles.length} sections`);
        } else {
          console.warn(`⚠️  No section data found for ${stadium.name}`);
        }
      }
    } catch (error) {
      console.error(`Failed to generate sections for ${stadium.name}:`, error);
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

  // Note: We don't verify section exists here to avoid Vercel tracing dependencies
  // Client component will handle 404s when fetch fails

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
