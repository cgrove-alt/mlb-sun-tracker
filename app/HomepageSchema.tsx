export default function HomepageSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "How does The Shadium calculate shade in stadiums?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "The Shadium uses real-time sun position calculations based on stadium location, date, and time to determine which sections will be in shade during the game."
              }
            },
            {
              "@type": "Question",
              "name": "Is The Shadium free to use?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, The Shadium is completely free to use for finding shaded seats at MLB stadiums."
              }
            },
            {
              "@type": "Question",
              "name": "Which MLB stadiums are covered?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "The Shadium covers all 30 MLB stadiums with detailed shade analysis for every section."
              }
            }
          ]
        })
      }}
    />
  );
}