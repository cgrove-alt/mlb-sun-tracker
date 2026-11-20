// Organization identity for the site (audit Phase 4).
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "The Shadium",
  "url": "https://theshadium.com",
  "logo": "https://theshadium.com/logo512.png",
  "description": "The Shadium shows which seats are in the sun or the shade at MLB, MiLB and NFL venues, for any game.",
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
                "text": "Pick your stadium and game. At every MLB ballpark the map shows each section in sun or shade through the game, inning by inning, and lists the sections with the most shade. Tap your section to see how its shade changes."
              }
            },
            {
              "@type": "Question",
              "name": "Are my seats shaded at Yankee Stadium?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Pick your game on The Shadium's Yankee Stadium page: the map shows every section in sun or shade through the game, and rows under a deck show as shaded."
              }
            },
            {
              "@type": "Question",
              "name": "Which MLB stadium seats have the most shade?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Seats under a deck or roof stay shaded all game. In the open seats it depends on the start time and which way the stands face: in the afternoon, the stands with the sun behind them shade first. Each park's map shows which sections, for your game."
              }
            },
            {
              "@type": "Question",
              "name": "Are field level seats ever shaded?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. Rows under the deck above are shaded, and as the sun drops the shade creeps forward from the back rows, so the front rows are the last to shade. The map shows when it reaches yours."
              }
            },
            {
              "@type": "Question",
              "name": "How accurate is The Shadium's shade prediction?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "The sun's position comes from NREL's Solar Position Algorithm. At most MLB parks the stands, decks and roofs are measured from USGS lidar scans; at the rest they are estimated. Each section's answer is labelled High, Medium or Low confidence, by whether it still holds if those measurements are off."
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
