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
    "alternateName": "Shadium MLB Shade Finder",
    "description": "Find seats in the shade at any MLB stadium. Real-time sun tracking and shade calculations for all 30 MLB ballparks.",
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
      "Shade calculations for all MLB stadiums",
      "Section-by-section shade analysis",
      "Weather integration",
      "Mobile-friendly interface",
      "30 MLB stadium coverage"
    ]
  };

  return <SafeSchema schema={schema} />;
};