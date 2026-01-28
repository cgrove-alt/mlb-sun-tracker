import React from 'react';
import { Metadata } from 'next';
import { WorldCupLandingClient } from './WorldCupLandingClient';

export const metadata: Metadata = {
  title: 'FIFA World Cup 2026 Shaded Seats | Find the Best Stadium Seats',
  description: 'Find the best shaded seats at all 16 FIFA World Cup 2026 venues across USA, Mexico, and Canada. Row-level shade analysis, match schedules, venue comparisons, and travel planning for the world\'s biggest sporting event.',
  keywords: 'World Cup 2026, FIFA World Cup, shaded seats, stadium seating, sun exposure, USA venues, Mexico venues, Canada venues, World Cup tickets, match schedule, soccer, football, stadium shade finder',
  openGraph: {
    title: 'FIFA World Cup 2026 - Find the Best Shaded Seats at All 16 Venues',
    description: 'Plan your World Cup experience with row-level shade analysis for all 16 stadiums. Compare venues, view match schedules, and find the perfect seats.',
    type: 'website',
    url: 'https://theshadium.com/worldcup2026',
    siteName: 'TheShadium',
    images: [
      {
        url: 'https://theshadium.com/worldcup-2026-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'FIFA World Cup 2026 Shaded Seats Finder'
      }
    ],
    locale: 'en_US'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FIFA World Cup 2026 - Find the Best Shaded Seats',
    description: 'Row-level shade analysis for all 16 World Cup 2026 venues. Compare stadiums, view schedules, plan your trip.',
    images: ['https://theshadium.com/worldcup-2026-twitter-image.jpg']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  alternates: {
    canonical: 'https://theshadium.com/worldcup2026'
  }
};

export default function WorldCupLandingPage() {
  return (
    <>
      {/* Schema.org JSON-LD for Event */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SportsEvent',
            name: 'FIFA World Cup 2026',
            description: 'The 2026 FIFA World Cup will be the 23rd FIFA World Cup, the quadrennial international men\'s soccer championship contested by the national teams of the member associations of FIFA. The tournament will take place from June 11 to July 19, 2026.',
            startDate: '2026-06-11',
            endDate: '2026-07-19',
            location: [
              {
                '@type': 'Place',
                name: 'United States',
                address: {
                  '@type': 'PostalAddress',
                  addressCountry: 'US'
                }
              },
              {
                '@type': 'Place',
                name: 'Mexico',
                address: {
                  '@type': 'PostalAddress',
                  addressCountry: 'MX'
                }
              },
              {
                '@type': 'Place',
                name: 'Canada',
                address: {
                  '@type': 'PostalAddress',
                  addressCountry: 'CA'
                }
              }
            ],
            organizer: {
              '@type': 'Organization',
              name: 'FIFA',
              url: 'https://www.fifa.com'
            },
            url: 'https://theshadium.com/worldcup2026',
            eventStatus: 'https://schema.org/EventScheduled',
            eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
            sport: 'Soccer',
            offers: {
              '@type': 'AggregateOffer',
              availability: 'https://schema.org/PreOrder',
              url: 'https://www.fifa.com/fifaplus/en/tournaments/mens/worldcup/canadamexicousa2026'
            }
          })
        }}
      />

      {/* Schema.org JSON-LD for Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'TheShadium',
            url: 'https://theshadium.com',
            logo: 'https://theshadium.com/logo.png',
            description: 'The most accurate stadium shade finder for sports venues. Row-level sun exposure analysis for MLB, MiLB, NFL, Soccer, and World Cup stadiums.',
            sameAs: [
              'https://twitter.com/theshadium',
              'https://facebook.com/theshadium'
            ]
          })
        }}
      />

      {/* Schema.org JSON-LD for BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://theshadium.com'
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'FIFA World Cup 2026',
                item: 'https://theshadium.com/worldcup2026'
              }
            ]
          })
        }}
      />

      <WorldCupLandingClient />
    </>
  );
}
