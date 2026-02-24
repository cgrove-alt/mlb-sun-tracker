// Utility functions for calculating distances between World Cup venues

/**
 * Calculate the great-circle distance between two points on Earth
 * using the Haversine formula
 *
 * @param lat1 Latitude of point 1 in degrees
 * @param lon1 Longitude of point 1 in degrees
 * @param lat2 Latitude of point 2 in degrees
 * @param lon2 Longitude of point 2 in degrees
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Convert kilometers to miles
 */
export function kmToMiles(km: number): number {
  return Math.round(km * 0.621371 * 10) / 10;
}

/**
 * Format distance for display
 */
export function formatDistance(km: number): string {
  const miles = kmToMiles(km);
  return `${km.toFixed(1)} km (${miles.toFixed(1)} mi)`;
}

/**
 * Estimate travel time between two venues
 * Assumes average travel speed of 800 km/h for flight
 * @returns Estimated travel time in hours
 */
export function estimateTravelTime(distanceKm: number): number {
  // If distance < 300km, assume driving at 80 km/h
  if (distanceKm < 300) {
    return Math.round((distanceKm / 80) * 10) / 10;
  }

  // For longer distances, assume flight at 800 km/h + 2 hours for airport/boarding
  const flightTime = distanceKm / 800;
  const totalTime = flightTime + 2;
  return Math.round(totalTime * 10) / 10;
}

/**
 * Format travel time for display
 */
export function formatTravelTime(hours: number): string {
  if (hours < 1) {
    const minutes = Math.round(hours * 60);
    return `${minutes} min`;
  }

  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);

  if (minutes === 0) {
    return `${wholeHours} ${wholeHours === 1 ? 'hour' : 'hours'}`;
  }

  return `${wholeHours}h ${minutes}m`;
}

/**
 * Get climate zone for a venue based on latitude
 */
export function getClimateZone(latitude: number): string {
  if (latitude > 45) return 'Northern (Mild summer)';
  if (latitude > 35) return 'Temperate (Warm summer)';
  if (latitude > 25) return 'Subtropical (Hot summer)';
  return 'Tropical (Very hot)';
}

/**
 * Get packing tip based on climate zones of selected venues
 */
export function getPackingTips(climateZones: string[]): string[] {
  const tips: string[] = [];
  const uniqueZones = Array.from(new Set(climateZones));

  if (uniqueZones.length > 2) {
    tips.push('Pack layers - you\'ll experience varied climates');
  }

  if (uniqueZones.some(z => z.includes('Hot') || z.includes('Tropical'))) {
    tips.push('Bring sunscreen and light, breathable clothing');
    tips.push('Stay hydrated - temperatures can exceed 90°F (32°C)');
  }

  if (uniqueZones.some(z => z.includes('Mild') || z.includes('Northern'))) {
    tips.push('Bring a light jacket for cooler evenings');
  }

  if (uniqueZones.length === 0 || tips.length === 0) {
    tips.push('Check weather forecasts closer to match dates');
  }

  return tips;
}
