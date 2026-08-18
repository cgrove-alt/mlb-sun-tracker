// Organization identity for the site (audit Phase 4).
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "The Shadium",
  "url": "https://theshadium.com",
  "logo": "https://theshadium.com/logo512.png",
  "description": "The Shadium provides stadium seating inventories, astronomical sun-position context, and explicit measurement-confidence disclosures.",
};

// WebSite node with a SearchAction so search engines can surface a sitelinks
// search box (audit Phase 4).
const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "The Shadium",
  "url": "https://theshadium.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://theshadium.com/stadiums?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export default function HomepageSchema() {
  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
    />
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
    />
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "How do I know if my seats are in the shade?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Select a stadium and game time to view astronomical sun-position context and the current measurement status. Exact sections and rows are withheld until remotely reconstructed metric geometry is independently validated."
              }
            },
            {
              "@type": "Question",
              "name": "Are my seats shaded at Yankee Stadium?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yankee Stadium's orientation provides broad solar context, but the site does not currently publish exact shaded rows because its metric row, overhang, and obstruction geometry has not passed independent observation validation."
              }
            },
            {
              "@type": "Question",
              "name": "Which MLB stadium seats have the most shade?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "A permanent fixed roof blocks direct sun. Retractable-roof results depend on the confirmed roof state, and open-air row coverage requires measured overhang and obstruction geometry."
              }
            },
            {
              "@type": "Question",
              "name": "Are field level seats ever shaded?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Field-level exposure depends on the stadium's measured structures, date, and time. The site does not infer an exact field-level result from a seating chart alone."
              }
            },
            {
              "@type": "Question",
              "name": "How accurate is The Shadium's shade prediction?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Astronomical sun position is calculated separately from stadium geometry. Exact seat-level MLB predictions are currently withheld because row, overhang, and obstruction measurements have not passed independent observation validation."
              }
            },
            {
              "@type": "Question",
              "name": "Is The Shadium free to use?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, The Shadium is completely free to use for finding shaded seats at MLB stadiums. No registration or payment required."
              }
            }
          ]
        })
      }}
    />
    </>
  );
}
