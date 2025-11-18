// Web Worker for heavy sun calculations
// This runs in a separate thread to avoid blocking the UI

self.addEventListener('message', async (event) => {
  const { type, payload } = event.data;
  
  if (type === 'CALCULATE_SUN_EXPOSURE') {
    try {
      const { stadium, sunPosition, sections } = payload;
      
      // Perform the heavy calculation
      const result = calculateDetailedSectionSunExposure(sections, sunPosition, stadium);
      
      // Send result back to main thread
      self.postMessage({
        type: 'SUN_EXPOSURE_RESULT',
        payload: result,
      });
    } catch (error) {
      self.postMessage({
        type: 'SUN_EXPOSURE_ERROR',
        payload: error.message,
      });
    }
  }
});

function calculateDetailedSectionSunExposure(sections, sunPosition, stadium) {
  const results = [];

  for (const section of sections) {
    // Simplified calculation for worker
    const sunExposure = calculateSectionExposure(section, sunPosition, stadium);

    // Return full section object with sunExposure merged in
    results.push({
      ...section, // Keep all original section properties
      sunExposure, // Add calculated sun exposure
      shadePercentage: Math.max(0, 100 - sunExposure),
    });
  }

  return results;
}

function calculateSectionExposure(section, sunPosition, stadium) {
  // Basic sun exposure calculation
  const { altitude, azimuth } = sunPosition;
  
  // Simple heuristic based on section location and sun position
  let exposure = 50; // Base exposure
  
  // Adjust based on altitude (higher sun = more exposure)
  exposure += (altitude / 90) * 30;
  
  // Adjust based on section position relative to sun
  if (section.level === 'upper') {
    exposure -= 20; // Upper deck has more roof coverage
  }
  
  if (section.side === 'third-base' || section.side === 'left-field') {
    exposure -= 15; // These sides get afternoon shade
  }
  
  // Ensure within 0-100 range
  return Math.max(0, Math.min(100, exposure));
}