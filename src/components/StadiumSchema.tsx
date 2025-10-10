import React from 'react';
import { Stadium } from '../data/stadiums';

interface StadiumSchemaProps {
  stadium: Stadium;
  gameDate?: Date;
  shadedSectionsCount?: number;
  totalSections?: number; // Now passed as prop instead of loading all stadium data
}

export const StadiumSchema: React.FC<StadiumSchemaProps> = ({
  stadium,
  gameDate,
  shadedSectionsCount,
  totalSections = 0 // Default to 0 if not provided
}) => {
  
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "name": `Baseball Game at ${stadium.name}`,
    "location": {
      "@type": "StadiumOrArena",
      "name": stadium.name,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": stadium.city,
        "addressRegion": stadium.state || "",
        "addressCountry": "US"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": stadium.latitude,
        "longitude": stadium.longitude
      },
      "maximumAttendeeCapacity": stadium.capacity || 40000,
      "additionalProperty": [
        {
          "@type": "PropertyValue",
          "name": "Roof Type",
          "value": stadium.roof || "open"
        },
        {
          "@type": "PropertyValue",
          "name": "Total Seating Sections",
          "value": totalSections
        },
        ...(shadedSectionsCount !== undefined ? [{
          "@type": "PropertyValue",
          "name": "Shaded Sections Available",
          "value": shadedSectionsCount
        }] : [])
      ]
    },
    ...(gameDate ? {
      "startDate": gameDate.toISOString(),
      "endDate": new Date(gameDate.getTime() + 3 * 60 * 60 * 1000).toISOString() // 3 hours later
    } : {}),
    "performer": {
      "@type": "SportsTeam",
      "name": stadium.team
    },
    "offers": {
      "@type": "AggregateOffer",
      "availability": "https://schema.org/InStock",
      "priceCurrency": "USD",
      "additionalProperty": {
        "@type": "PropertyValue",
        "name": "Shade Information",
        "description": `Find seats in the shade at ${stadium.name}. ${shadedSectionsCount ? `${shadedSectionsCount} sections with shade coverage available.` : 'Real-time shade calculations available.'}`
      }
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};

// Stadium-specific shade guide schema
interface StadiumShadeGuideSchemaProps {
  stadium: Stadium;
  sections?: any[]; // Sections passed as prop to avoid bundling all stadium data
}

export const StadiumShadeGuideSchema: React.FC<StadiumShadeGuideSchemaProps> = ({ stadium, sections = [] }) => {
  
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `${stadium.name} Shade Guide - Find Seats in the Shade`,
    "description": `Complete guide to finding shaded seats at ${stadium.name}. Learn which sections offer the best shade coverage for day games and how to avoid sun exposure.`,
    "keywords": `${stadium.name} shade, ${stadium.team} shaded seats, seats in the shade ${stadium.city}`,
    "author": {
      "@type": "Organization",
      "name": "The Shadium"
    },
    "publisher": {
      "@type": "Organization",
      "name": "The Shadium",
      "logo": {
        "@type": "ImageObject",
        "url": "https://theshadium.com/logo512.png"
      }
    },
    "datePublished": new Date().toISOString(),
    "dateModified": new Date().toISOString(),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://theshadium.com/stadium/${stadium.id}`
    },
    "about": {
      "@type": "StadiumOrArena",
      "name": stadium.name,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": stadium.city,
        "addressRegion": stadium.state || "",
        "addressCountry": "US"
      }
    },
    "hasPart": sections.map(section => ({
      "@type": "HowToSection",
      "name": `Section ${section.name}`,
      "position": section.id,
      "itemListElement": {
        "@type": "PropertyValue",
        "name": "Shade Coverage",
        "description": `Section ${section.name} shade information and sun exposure details`
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};

// FAQ Schema for shade-related questions
export const ShadeFAQSchema: React.FC = () => {
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do I find seats in the shade at MLB stadiums?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Use The Shadium's real-time sun tracker to see which sections will be shaded during your specific game time. Generally, upper deck sections with overhead coverage and third base side seats offer more shade for day games."
        }
      },
      {
        "@type": "Question",
        "name": "Which MLB stadiums have the most shaded seats?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Stadiums with retractable or fixed roofs like Chase Field, Globe Life Field, and Marlins Park offer the most shade. For open-air stadiums, look for sections under upper deck overhangs."
        }
      },
      {
        "@type": "Question",
        "name": "Do shaded seats cost more at baseball games?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Not necessarily. Shade depends on time of day and stadium orientation, not ticket pricing. Some affordable upper deck seats offer excellent shade coverage."
        }
      },
      {
        "@type": "Question",
        "name": "What time of day has the least sun at baseball stadiums?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Evening games starting at 7 PM or later have minimal sun exposure. For day games, the sun is typically less intense after 4 PM as it begins to set."
        }
      },
      {
        "@type": "Question",
        "name": "How accurate is The Shadium's shade prediction?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The Shadium uses precise solar calculations based on stadium coordinates, date, and time to predict shade patterns. Weather conditions like clouds can provide additional shade beyond our predictions."
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
    />
  );
};