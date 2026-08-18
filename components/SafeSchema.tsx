import React from 'react';
import { VENUE_COUNT } from '../src/data/venueCount';

interface SafeSchemaProps {
  schema: Record<string, any>;
}

/**
 * Escape sequences that would let schema content break out of the <script>
 * block it is embedded in.
 *
 * `JSON.stringify` escapes quotes and backslashes, but NOT `</script>` — inside
 * a `<script>` element the HTML parser ends the block at that byte sequence
 * regardless of JSON context. Any schema string containing it (an FAQ answer, a
 * venue name, anything user- or content-derived) would terminate the script tag
 * early and inject the remainder as live markup.
 *
 * `<!--` gets the same treatment: it opens an HTML comment inside a script and
 * can likewise desynchronise the parser. U+2028/U+2029 are valid JSON but are
 * line terminators in older JS parsers.
 */
function escapeForScriptTag(json: string): string {
  return json
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

export const SafeSchema: React.FC<SafeSchemaProps> = ({ schema }) => {
  const schemaString = escapeForScriptTag(JSON.stringify(schema));

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
    "description": `Stadium seating inventory, astronomical sun-position context, roof information, and measurement-confidence disclosures for ${VENUE_COUNT} sports venues.`,
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
    "featureList": [
      "Date-specific solar position",
      `Data-confidence disclosures for ${VENUE_COUNT} sports venues`,
      "Source-backed section inventories where available",
      "Weather integration",
      "Mobile-friendly interface",
      "30 MLB stadiums coverage",
      "120 MiLB stadiums coverage",
      "32 NFL venues coverage"
    ]
  };

  return <SafeSchema schema={schema} />;
};
