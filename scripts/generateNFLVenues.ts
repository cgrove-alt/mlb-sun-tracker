// Script to generate NFL venue entries for venues.ts
import { NFL_STADIUMS } from '../src/data/nflStadiums';
import fs from 'fs';

// Generate venue entries for all NFL stadiums
function generateNFLVenueEntries() {
  const venues = NFL_STADIUMS.map(stadium => {
    // Skip duplicate entries for shared stadiums
    if (stadium.id === 'metlife-stadium-giants' || stadium.id === 'sofi-stadium-rams') {
      return null;
    }
    
    return {
      id: stadium.id,
      name: stadium.name,
      league: 'NFL',
      team: stadium.team,
      alternateTeams: 
        stadium.id === 'metlife-stadium' ? ['New York Giants'] :
        stadium.id === 'sofi-stadium' ? ['Los Angeles Rams'] : 
        undefined,
      city: stadium.city,
      state: stadium.state,
      latitude: stadium.latitude,
      longitude: stadium.longitude,
      orientation: stadium.orientation,
      capacity: stadium.capacity,
      roof: stadium.roof,
      roofHeight: stadium.roofHeight,
      upperDeckHeight: stadium.upperDeckHeight,
      timezone: stadium.timezone,
      seatingGeometry: {
        bowlShape: 'rectangular' as const,
        fieldDimensions: {
          length: 120, // yards
          width: 53.3  // yards
        },
        endZoneOrientation: getEndZoneOrientation(stadium.orientation),
        primarySeatingAngle: stadium.orientation,
        sideline1Angle: (stadium.orientation + 90) % 360,
        sideline2Angle: (stadium.orientation + 270) % 360,
        endZone1Angle: stadium.orientation,
        endZone2Angle: (stadium.orientation + 180) % 360
      },
      venueType: 'football',
      surface: stadium.surface,
      opened: stadium.opened,
      address: `${stadium.city}, ${stadium.state}`
    };
  }).filter(Boolean);
  
  return venues;
}

// Determine end zone orientation based on field angle
function getEndZoneOrientation(angle: number): string {
  if (angle >= 337.5 || angle < 22.5) return 'north-south';
  if (angle >= 22.5 && angle < 67.5) return 'northeast-southwest';
  if (angle >= 67.5 && angle < 112.5) return 'east-west';
  if (angle >= 112.5 && angle < 157.5) return 'southeast-northwest';
  if (angle >= 157.5 && angle < 202.5) return 'north-south';
  if (angle >= 202.5 && angle < 247.5) return 'northeast-southwest';
  if (angle >= 247.5 && angle < 292.5) return 'east-west';
  return 'northwest-southeast';
}

// Generate the venues
const nflVenues = generateNFLVenueEntries();

// Output as JSON
console.log(JSON.stringify(nflVenues, null, 2));

// Also save to a file
fs.writeFileSync(
  './nfl-venues-generated.json',
  JSON.stringify(nflVenues, null, 2)
);

console.log(`\nGenerated ${nflVenues.length} NFL venue entries`);
console.log('Saved to nfl-venues-generated.json');