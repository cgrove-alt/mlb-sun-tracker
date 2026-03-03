export const generateStadiumSchema = (stadiumName: string, stadiumId: string) => {
  return {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "name": `${stadiumName} Shade Guide`,
    "description": `Find the best shaded seats at ${stadiumName}. Real-time sun exposure calculations and section-by-section shade analysis.`,
    "location": {
      "@type": "StadiumOrArena",
      "name": stadiumName,
      "url": `https://theshadium.com/stadium/${stadiumId}`
    },
    "organizer": {
      "@type": "Organization",
      "name": "The Shadium",
      "url": "https://theshadium.com"
    }
  };
};

export const generateBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
};

export const generateHowToSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Find Shaded Seats at MLB Stadiums",
    "description": "Step-by-step guide to finding seats in the shade at any MLB stadium using The Shadium",
    "image": "https://theshadium.com/logo512.png",
    "totalTime": "PT2M",
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": "0"
    },
    "supply": [],
    "tool": [
      {
        "@type": "HowToTool",
        "name": "The Shadium Web App"
      }
    ],
    "step": [
      {
        "@type": "HowToStep",
        "name": "Select Your Stadium",
        "text": "Choose your MLB stadium from the dropdown menu",
        "image": "https://theshadium.com/logo192.png"
      },
      {
        "@type": "HowToStep", 
        "name": "Pick Game Date and Time",
        "text": "Select the date and start time of your game",
        "image": "https://theshadium.com/logo192.png"
      },
      {
        "@type": "HowToStep",
        "name": "View Shade Results",
        "text": "See which sections will be in shade during your game",
        "image": "https://theshadium.com/logo192.png"
      },
      {
        "@type": "HowToStep",
        "name": "Choose Your Section",
        "text": "Select from the shaded sections based on your preferences",
        "image": "https://theshadium.com/logo192.png"
      }
    ]
  };
};

export const generateStadiumOrArenaSchema = (venue: {
  name: string;
  id: string;
  city: string;
  state?: string;
  country?: string;
  latitude: number;
  longitude: number;
  capacity: number;
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "StadiumOrArena",
    "name": venue.name,
    "url": `https://theshadium.com/venue/${venue.id}`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": venue.city,
      ...(venue.state ? { "addressRegion": venue.state } : {}),
      "addressCountry": venue.country || "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": venue.latitude,
      "longitude": venue.longitude
    },
    "maximumAttendeeCapacity": venue.capacity
  };
};

export const generateVenueFAQSchema = (venueName: string) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `What are the best shaded seats at ${venueName}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The best shaded seats at ${venueName} vary by game time. For day games, sections on the third base side and upper deck typically offer more shade. Use The Shadium to check real-time shade for your specific game.`
        }
      },
      {
        "@type": "Question",
        "name": `Which sections at ${venueName} have covered seating?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${venueName} has covered seating in select premium areas and upper deck sections. Check The Shadium for detailed coverage information for each section.`
        }
      },
      {
        "@type": "Question",
        "name": `How can I avoid sun at ${venueName} during day games?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `To avoid sun at ${venueName}, choose seats on the shaded side, in the upper deck, or in club level sections. The Shadium provides real-time calculations showing exactly which seats will be shaded during your game.`
        }
      }
    ]
  };
};

export const generateArticleSchema = (venue: {
  name: string;
  id: string;
  team?: string;
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `Shaded Seats at ${venue.name} - Complete Guide`,
    "description": `Find the best shaded seats at ${venue.name}.${venue.team ? ` Real-time shade calculations for ${venue.team} games.` : ' Real-time shade calculations for every section.'}`,
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
    "datePublished": "2024-01-01",
    "dateModified": "2025-01-01",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://theshadium.com/venue/${venue.id}`
    }
  };
};

export const generateLocalBusinessSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "The Shadium",
    "url": "https://theshadium.com",
    "logo": "https://theshadium.com/logo512.png",
    "sameAs": [
      "https://twitter.com/theshadium",
      "https://www.facebook.com/theshadium"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "support@theshadium.com",
      "contactType": "Customer Support",
      "availableLanguage": ["English", "Spanish"]
    }
  };
};