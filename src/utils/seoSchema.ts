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