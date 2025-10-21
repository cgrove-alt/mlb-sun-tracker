import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MLB_STADIUMS } from '../../../../../src/data/stadiums';
import { getSeatDataForSection } from '../../../../../src/utils/seatDataLoader';
import SectionPageClient from './SectionPageClient';

interface SectionPageProps {
  params: Promise<{
    stadiumId: string;
    sectionId: string;
  }>;
}

export async function generateStaticParams() {
  // For now, only generate for dodger-stadium sections
  // Future: Generate for all stadiums with seat data
  const dodgerSections = Array.from({ length: 195 }, (_, i) => (i + 1).toString());

  return dodgerSections.map((sectionId) => ({
    stadiumId: 'dodgers',
    sectionId,
  }));
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
      />
    </div>
  );
}
