import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Stadium } from '../data/stadiums';
import { MLBGame } from '../services/mlbApi';
import { MiLBGame } from '../services/milbApi';
import { NFLGame } from '../services/nflApi';
import { WorldCupGame } from '../services/worldCupApi';
import { StadiumSchema, StadiumShadeGuideSchema } from './StadiumSchema';

interface SEOHelmetProps {
  stadium?: Stadium | null;
  game?: MLBGame | MiLBGame | NFLGame | WorldCupGame | null;
  pageType?: 'home' | 'stadium' | 'game';
  shadedSectionsCount?: number;
}

export const SEOHelmet: React.FC<SEOHelmetProps> = ({ stadium, game, pageType = 'home', shadedSectionsCount }) => {
  // Helper to get game date
  const getGameDate = (g: typeof game): Date | null => {
    if (!g) return null;
    if ('gameDate' in g) {
      return new Date(g.gameDate);
    } else if ('date' in g && 'time' in g) {
      const wcGame = g as WorldCupGame;
      return new Date(`${wcGame.date}T${wcGame.time}`);
    }
    return null;
  };

  // Generate dynamic title
  const getTitle = () => {
    if (pageType === 'game' && stadium && game) {
      const gameDate = getGameDate(game);
      return `${stadium.name} - ${gameDate?.toLocaleDateString() || 'Upcoming Game'} | The Shadium`;
    }
    if (pageType === 'stadium' && stadium) {
      return `${stadium.name} Shade Guide | The Shadium`;
    }
    return 'The Shadium - Find the Perfect Shaded Seats at MLB, MiLB, NFL & World Cup Stadiums';
  };

  // Generate dynamic description
  const getDescription = () => {
    if (pageType === 'game' && stadium && game) {
      const gameDate = getGameDate(game);
      return `Find the best seats for the ${gameDate?.toLocaleDateString() || 'upcoming'} game at ${stadium.name}. Real-time sun exposure analysis and weather forecast.`;
    }
    if (pageType === 'stadium' && stadium) {
      return `Discover the best seats at ${stadium.name} with our sun exposure analysis. View real-time weather, seating sections, and make informed decisions for your next ${stadium.team} game.`;
    }
    return 'Find the best shaded seats at MLB, MiLB, NFL, and World Cup 2026 stadiums. The Shadium analyzes sun exposure, weather conditions, and seating sections across 260+ sports venues to help you avoid the heat and enjoy the game in comfort.';
  };

  // Generate canonical URL
  const getCanonicalUrl = () => {
    // Use environment variable or fallback to current origin
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
      (typeof window !== 'undefined' ? window.location.origin : 'https://theshadium.com');
    if (pageType === 'stadium' && stadium) {
      return `${baseUrl}/stadium/${stadium.id}`;
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
      // Handle different game structures
      let homeTeamName: string;
      let awayTeamName: string;
      
      if ('teams' in game) {
        // MLB/MiLB game structure
        homeTeamName = game.teams.home.team.name;
        awayTeamName = game.teams.away.team.name;
      } else {
        // NFL game structure
        const nflGame = game as NFLGame;
        homeTeamName = nflGame.homeTeam.name;
        awayTeamName = nflGame.awayTeam.name;
      }
      
      const gameDate = getGameDate(game);
      return {
        "@context": "https://schema.org",
        "@type": "SportsEvent",
        "name": `${awayTeamName} @ ${homeTeamName}`,
        "startDate": gameDate?.toISOString() || '',
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
            "name": homeTeamName
          },
          {
            "@type": "SportsTeam",
            "name": awayTeamName
          }
        ]
      };
    }
    
    return null;
  };

  const structuredData = getStructuredData();

  return (
    <>
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
        
        {/* Basic Structured Data */}
        {structuredData && (
          <script type="application/ld+json">
            {JSON.stringify(structuredData)}
          </script>
        )}
      </Helmet>
      
      {/* Additional Schema Components */}
      {pageType === 'stadium' && stadium && (
        <>
          <StadiumSchema
            stadium={stadium}
            gameDate={game ? getGameDate(game) || undefined : undefined}
            shadedSectionsCount={shadedSectionsCount}
          />
          <StadiumShadeGuideSchema stadium={stadium} />
        </>
      )}

      {pageType === 'game' && stadium && game && (
        <StadiumSchema
          stadium={stadium}
          gameDate={getGameDate(game) || undefined}
          shadedSectionsCount={shadedSectionsCount}
        />
      )}
      
    </>
  );
};