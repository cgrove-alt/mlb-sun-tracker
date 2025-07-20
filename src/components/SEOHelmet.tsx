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
      return `${stadium.name} - ${new Date(game.gameDate).toLocaleDateString()} | MLB Sun Tracker`;
    }
    if (pageType === 'stadium' && stadium) {
      return `${stadium.name} Sun Exposure Guide | MLB Stadium Sun Tracker`;
    }
    return 'MLB Stadium Sun Tracker - Find the Perfect Seats';
  };

  // Generate dynamic description
  const getDescription = () => {
    if (pageType === 'game' && stadium && game) {
      return `Find the best seats for the ${new Date(game.gameDate).toLocaleDateString()} game at ${stadium.name}. Real-time sun exposure analysis and weather forecast.`;
    }
    if (pageType === 'stadium' && stadium) {
      return `Discover the best seats at ${stadium.name} with our sun exposure analysis. View real-time weather, seating sections, and make informed decisions for your next ${stadium.team} game.`;
    }
    return 'Find the best seats at MLB stadiums by analyzing sun exposure, weather conditions, and seating sections. Get real-time sun position and weather data for all 30 MLB stadiums.';
  };

  // Generate canonical URL
  const getCanonicalUrl = () => {
    const baseUrl = 'https://cgrove-alt.github.io/mlb-sun-tracker';
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