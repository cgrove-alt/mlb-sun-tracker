import React from 'react';
import { Stadium } from '../data/stadiums';
import { canPublishVenueSeatShade } from '../data/stadiumShadeConfidence';

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
  const seatShadePublished = canPublishVenueSeatShade(stadium);
  
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
        ...(seatShadePublished && shadedSectionsCount !== undefined ? [{
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
        "description": seatShadePublished
          ? `Measured shade results are available for ${stadium.name}.`
          : `Solar-position context is available for ${stadium.name}; exact seat-level shade is withheld pending measured-geometry validation.`
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
    "description": `Source-backed section inventory, solar-position context, and measurement status for ${stadium.name}.`,
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
        "description": `Section ${section.name} identity from the published inventory; exact row shade is not asserted without validated geometry.`
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
          "text": "Use the published section inventory and astronomical sun-position context as planning aids. Exact sections and rows are withheld until physical stadium geometry is measured and independently validated."
        }
      },
      {
        "@type": "Question",
        "name": "Which MLB stadiums have the most shaded seats?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A permanent fixed roof blocks direct sun. Retractable-roof results depend on the confirmed event roof state; open-air row coverage requires measured overhang and obstruction geometry."
        }
      },
      {
        "@type": "Question",
        "name": "Do shaded seats cost more at baseball games?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ticket price does not verify shade. Confirm covered-seat information with the venue before buying."
        }
      },
      {
        "@type": "Question",
        "name": "What time of day has the least sun at baseball stadiums?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The sun is below the horizon at night. Before sunset, exposure depends on date, location, orientation, roof state, and measured stadium geometry."
        }
      },
      {
        "@type": "Question",
        "name": "How accurate is The Shadium's shade prediction?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Astronomical sun position can be calculated from coordinates, date, and time. Exact seat-level shade is not published for a park until remotely reconstructed row, overhang, and obstruction geometry passes independent observation validation."
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
