import React from 'react';

interface SafeSchemaProps {
  schema: Record<string, any>;
}

export const SafeSchema: React.FC<SafeSchemaProps> = ({ schema }) => {
  const schemaString = JSON.stringify(schema);
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: schemaString }}
      suppressHydrationWarning
    />
  );
};

export const WebApplicationSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "The Shadium",
    "alternateName": "Shadium Sports Venue Shade Finder",
    "description": "Find seats in the shade at any MLB, MiLB, or NFL stadium. Real-time sun tracking and shade calculations for 250+ sports venues including all 30 MLB ballparks, 120 MiLB stadiums, and 32 NFL venues.",
    "url": "https://theshadium.com",
    "applicationCategory": "SportsApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "creator": {
      "@type": "Organization",
      "name": "The Shadium",
      "url": "https://theshadium.com"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "256"
    },
    "featureList": [
      "Real-time sun tracking",
      "Shade calculations for 250+ sports venues",
      "Section-by-section shade analysis",
      "Weather integration",
      "Mobile-friendly interface",
      "30 MLB stadiums coverage",
      "120 MiLB stadiums coverage",
      "32 NFL venues coverage"
    ]
  };

  return <SafeSchema schema={schema} />;
};