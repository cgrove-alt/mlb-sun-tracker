/**
 * StadiumCard Usage Examples
 */

import React from 'react';
import { StadiumCard, StadiumCardGrid, StadiumCardSkeleton } from './StadiumCard';

// Sample stadium data
const sampleStadiums = [
  {
    name: 'Yankee Stadium',
    team: 'New York Yankees',
    city: 'Bronx',
    state: 'NY',
    roof: 'open' as const,
    capacity: 54251,
    href: '/stadium/yankees',
  },
  {
    name: 'Dodger Stadium',
    team: 'Los Angeles Dodgers',
    city: 'Los Angeles',
    state: 'CA',
    roof: 'open' as const,
    capacity: 56000,
    href: '/stadium/dodgers',
  },
  {
    name: 'Chase Field',
    team: 'Arizona Diamondbacks',
    city: 'Phoenix',
    state: 'AZ',
    roof: 'retractable' as const,
    capacity: 48519,
    href: '/stadium/diamondbacks',
  },
  {
    name: 'Tropicana Field',
    team: 'Tampa Bay Rays',
    city: 'St. Petersburg',
    state: 'FL',
    roof: 'closed' as const,
    capacity: 25025,
    href: '/stadium/rays',
  },
];

export const StadiumCardExamples = () => {
  return (
    <div style={{ padding: '40px', backgroundColor: '#f8f9fa' }}>
      <h1 style={{ marginBottom: '40px' }}>StadiumCard Component Examples</h1>

      {/* Example 1: Basic Grid Layout */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ marginBottom: '20px' }}>Basic Grid Layout</h2>
        <StadiumCardGrid>
          {sampleStadiums.map((stadium) => (
            <StadiumCard key={stadium.name} {...stadium} />
          ))}
        </StadiumCardGrid>
      </section>

      {/* Example 2: Featured Stadium */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ marginBottom: '20px' }}>Featured Stadium</h2>
        <div style={{ maxWidth: '400px' }}>
          <StadiumCard
            name="Fenway Park"
            team="Boston Red Sox"
            city="Boston"
            state="MA"
            roof="open"
            capacity={37755}
            href="/stadium/red-sox"
            featured
          />
        </div>
      </section>

      {/* Example 3: Compact Variant */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ marginBottom: '20px' }}>Compact Variant</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
          {sampleStadiums.slice(0, 3).map((stadium) => (
            <StadiumCard key={stadium.name} {...stadium} compact />
          ))}
        </div>
      </section>

      {/* Example 4: Loading States */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ marginBottom: '20px' }}>Loading States</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', maxWidth: '900px' }}>
          <StadiumCardSkeleton />
          <StadiumCardSkeleton />
          <StadiumCardSkeleton />
        </div>
      </section>

      {/* Example 5: With Click Handler */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ marginBottom: '20px' }}>Interactive Card</h2>
        <div style={{ maxWidth: '350px' }}>
          <StadiumCard
            name="Oracle Park"
            team="San Francisco Giants"
            city="San Francisco"
            state="CA"
            roof="open"
            capacity={41915}
            href="/stadium/giants"
            onClick={() => alert('Card clicked!')}
          />
        </div>
      </section>

      {/* Example 6: Different Roof Types */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ marginBottom: '20px' }}>Different Roof Types</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', maxWidth: '900px' }}>
          <StadiumCard
            name="Wrigley Field"
            team="Chicago Cubs"
            city="Chicago"
            state="IL"
            roof="open"
            capacity={41649}
            href="/stadium/cubs"
          />
          <StadiumCard
            name="Marlins Park"
            team="Miami Marlins"
            city="Miami"
            state="FL"
            roof="retractable"
            capacity={37446}
            href="/stadium/marlins"
          />
          <StadiumCard
            name="Rogers Centre"
            team="Toronto Blue Jays"
            city="Toronto"
            state="ON"
            roof="retractable"
            capacity={49282}
            href="/stadium/blue-jays"
          />
        </div>
      </section>

      {/* Example 7: Responsive Layout */}
      <section>
        <h2 style={{ marginBottom: '20px' }}>Responsive Layout (resize window)</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
          }}
        >
          {sampleStadiums.map((stadium) => (
            <StadiumCard key={`responsive-${stadium.name}`} {...stadium} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default StadiumCardExamples;