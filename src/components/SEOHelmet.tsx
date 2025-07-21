import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Stadium } from '../data/stadiums';
import { MLBGame } from '../services/mlbApi';

interface SEOHelmetProps {
  stadium?: Stadium | null;
  game?: MLBGame | null;
  pageType?: 'home' | 'stadium' | 'game';
}

export const SEOHelmet: React.FC<SEOHelmetProps> = ({ stadium, game, pageType = 'home' }) => {
  // Generate dynamic title
  const getTitle = () => {
    if (pageType === 'game' && stadium && game) {
      return `${stadium.name} - ${new Date(game.gameDate).toLocaleDateString()} | The Shadium`;
    }
    if (pageType === 'stadium' && stadium) {
      return `${stadium.name} Shade Guide | The Shadium`;
    }
    return 'The Shadium - Find the Perfect Shaded Seats at MLB Stadiums';
  };

  // Generate dynamic description
  const getDescription = () => {
    if (pageType === 'game' && stadium && game) {
      return `Find the best seats for the ${new Date(game.gameDate).toLocaleDateString()} game at ${stadium.name}. Real-time sun exposure analysis and weather forecast.`;
    }
    if (pageType === 'stadium' && stadium) {
      return `Discover the best seats at ${stadium.name} with our sun exposure analysis. View real-time weather, seating sections, and make informed decisions for your next ${stadium.team} game.`;
    }
    return 'Find the best shaded seats at MLB stadiums. The Shadium analyzes sun exposure, weather conditions, and seating sections to help you avoid the heat and enjoy the game in comfort.';
  };

  // Generate canonical URL
  const getCanonicalUrl = () => {
    // Use environment variable or fallback to current origin
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
      (typeof window !== 'undefined' ? window.location.origin : 'https://theshadium.com');
    if (pageType === 'stadium' && stadium) {
      return `${baseUrl}/stadium/${stadium.name.toLowerCase().replace(/\s+/g, '-')}`;
    }
    return baseUrl;
  };

  // Generate structured data for stadium
  const getStructuredData = () => {
    if (pageType === 'stadium' && stadium) {
      return {
        "@context": "https://schema.org",
        "@type": "StadiumOrArena",
        "name": stadium.name,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": stadium.city,
          "addressRegion": stadium.state,
          "addressCountry": "USA"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": stadium.latitude,
          "longitude": stadium.longitude
        },
        "homeTeam": {
          "@type": "SportsTeam",
          "name": stadium.team
        }
      };
    }
    
    if (pageType === 'game' && stadium && game) {
      return {
        "@context": "https://schema.org",
        "@type": "SportsEvent",
        "name": `${game.teams.away.team.name} @ ${game.teams.home.team.name}`,
        "startDate": game.gameDate,
        "location": {
          "@type": "StadiumOrArena",
          "name": stadium.name,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": stadium.city,
            "addressRegion": stadium.state,
            "addressCountry": "USA"
          }
        },
        "competitor": [
          {
            "@type": "SportsTeam",
            "name": game.teams.home.team.name
          },
          {
            "@type": "SportsTeam",
            "name": game.teams.away.team.name
          }
        ]
      };
    }
    
    return null;
  };

  const structuredData = getStructuredData();

  return (
    <Helmet>
      <title>{getTitle()}</title>
      <meta name="description" content={getDescription()} />
      <link rel="canonical" href={getCanonicalUrl()} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={getTitle()} />
      <meta property="og:description" content={getDescription()} />
      <meta property="og:url" content={getCanonicalUrl()} />
      <meta property="og:type" content={pageType === 'home' ? 'website' : 'article'} />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={getTitle()} />
      <meta name="twitter:description" content={getDescription()} />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};