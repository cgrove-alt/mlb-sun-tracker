import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MLB_STADIUMS } from '../../../src/data/stadiums';
import { getStadiumSections } from '../../../src/data/stadiumSections';
import { getStadiumAmenities } from '../../../src/data/stadiumAmenities';
import StadiumGuide from '../../../src/components/StadiumGuide';

interface StadiumPageProps {
  params: Promise<{
    stadiumId: string;
  }>;
}

export async function generateStaticParams() {
  return MLB_STADIUMS.map((stadium) => ({
    stadiumId: stadium.id,
  }));
}

export async function generateMetadata({ params }: StadiumPageProps): Promise<Metadata> {
  const { stadiumId } = await params;
  const stadium = MLB_STADIUMS.find(s => s.id === stadiumId);
  
  if (!stadium) {
    return {
      title: 'Stadium Not Found | The Shadium',
    };
  }

  return {
    title: `${stadium.name} Shade Guide - Find Seats in the Shade | The Shadium`,
    description: `Complete shade guide for ${stadium.name}. Find the best shaded seats, avoid sun exposure, and stay cool during ${stadium.team} games. Real-time sun tracking and section-by-section analysis.`,
    keywords: [
      `${stadium.name} shade`,
      `${stadium.name} shaded seats`,
      `${stadium.team} sun exposure`,
      `seats in shade ${stadium.city}`,
      `${stadium.name} seating guide`,
      'MLB stadium shade',
      'baseball sun protection'
    ],
    openGraph: {
      title: `${stadium.name} Shade Guide | The Shadium`,
      description: `Find the best shaded seats at ${stadium.name}. Real-time sun tracking for ${stadium.team} games.`,
      type: 'article',
      images: [
        {
          url: '/logo512.png',
          width: 512,
          height: 512,
          alt: `${stadium.name} Shade Guide`,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${stadium.name} Shade Guide`,
      description: `Find shaded seats at ${stadium.name} for ${stadium.team} games`,
    },
  };
}

export default async function StadiumPage({ params }: StadiumPageProps) {
  const { stadiumId } = await params;
  const stadium = MLB_STADIUMS.find(s => s.id === stadiumId);
  
  if (!stadium) {
    notFound();
  }

  const sections = getStadiumSections(stadium.id);
  const amenities = getStadiumAmenities(stadium.id);

  return <StadiumGuide stadium={stadium} sections={sections} amenities={amenities} />;
}