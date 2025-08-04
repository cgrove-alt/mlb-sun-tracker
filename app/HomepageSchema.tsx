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
              "name": "How do I know if my seats are in the shade?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Simply select your stadium and game time on The Shadium. Our tool will show you exactly which sections are shaded throughout the game. Look for your section number to see if your seats will be in the shade."
              }
            },
            {
              "@type": "Question",
              "name": "Are my seats shaded at Yankee Stadium?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "To check if your Yankee Stadium seats are shaded, use our shade calculator. Generally, upper deck sections on the third base side (300-level) and seats behind home plate offer the best shade coverage during day games."
              }
            },
            {
              "@type": "Question",
              "name": "Which MLB stadium seats have the most shade?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Stadiums with retractable roofs like Minute Maid Park and T-Mobile Park offer complete shade when closed. For open-air stadiums, upper deck seats under overhangs typically provide the most consistent shade."
              }
            },
            {
              "@type": "Question",
              "name": "Are field level seats ever shaded?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, field level seats can be shaded depending on the stadium, time of day, and season. Seats behind home plate often get shade from upper deck overhangs, while seats along the baselines may get shade later in the game."
              }
            },
            {
              "@type": "Question",
              "name": "How accurate is The Shadium's shade prediction?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "The Shadium uses precise sun position calculations accurate within 2 degrees. We factor in stadium orientation, overhang structures, and real-time sun tracking to provide highly accurate shade predictions for every MLB game."
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
  );
}