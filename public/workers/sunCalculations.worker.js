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
  
  if (type === 'CALCULATE_ROW_SHADOWS') {
    try {
      const { sections, sunPosition, stadium } = payload;

      // Extract sun position values
      const sunAltitude = sunPosition.altitudeDegrees || sunPosition.altitude;
      const sunAzimuth = sunPosition.azimuthDegrees || sunPosition.azimuth;
      const stadiumOrientation = stadium.orientation || 0;

      // Perform row-level shadow calculations for all sections
      const results = sections.map(section =>
        calculateRowShadows(section, sunAltitude, sunAzimuth, stadiumOrientation)
      );

      // Send results back to main thread
      self.postMessage({
        type: 'ROW_SHADOWS_RESULT',
        payload: results,
      });
    } catch (error) {
      self.postMessage({
        type: 'ROW_SHADOWS_ERROR',
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
    results.push({
      sectionId: section.id,
      sunExposure,
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

// ============================================================================
// ROW-LEVEL SHADOW CALCULATIONS
// ============================================================================

function calculateRowShadow(row, section, sunAltitude, sunAzimuth, stadiumOrientation = 0) {
  // 1. If row is explicitly covered (roof/overhang), return 100% shade
  if (row.covered === true) {
    return {
      rowNumber: row.rowNumber,
      seats: row.seats,
      elevation: row.elevation,
      depth: row.depth,
      coverage: 100,
      sunExposure: 0,
      inShadow: true,
      shadowSources: { roof: 100, upperDeck: 0, overhang: 0, bowl: 0 },
      recommendation: 'excellent'
    };
  }

  // 2. Calculate base sun exposure based on section angle
  const sectionAngle = (section.baseAngle || 0) + stadiumOrientation;
  const angleDiff = Math.abs(((sectionAngle - sunAzimuth + 180) % 360) - 180);
  let baseSunExposure = Math.max(0, 100 - angleDiff);

  // 3. Apply altitude factor (low sun = less exposure)
  if (sunAltitude < 30) {
    baseSunExposure *= (sunAltitude / 30);
  }

  // 4. Calculate overhang shadow (depth-dependent)
  const overhangShadow = calculateOverhangShadow(
    row.depth,
    row.overhangHeight || 0,
    sunAltitude
  );

  // 5. Calculate upper deck shadow (elevation + depth dependent)
  const upperDeckShadow = calculateUpperDeckShadowForRow(
    row.elevation,
    row.depth,
    section,
    sunAltitude,
    sunAzimuth
  );

  // 6. Calculate roof shadow (if section has fixed roof)
  const roofShadow = section.covered ? 100 : 0;

  // 7. Bowl shadow (minimal, only for very low sun)
  const bowlShadow = sunAltitude < 15 ? (15 - sunAltitude) * 3 : 0;

  // 8. Combine shadow sources (use maximum, not additive)
  const totalCoverage = Math.min(
    100,
    Math.max(overhangShadow, upperDeckShadow, roofShadow, bowlShadow)
  );

  // 9. Calculate final sun exposure
  const finalSunExposure = Math.max(
    0,
    baseSunExposure * (1 - totalCoverage / 100)
  );

  // 10. Determine recommendation
  let recommendation;
  if (totalCoverage >= 80) recommendation = 'excellent';
  else if (totalCoverage >= 60) recommendation = 'good';
  else if (totalCoverage >= 30) recommendation = 'fair';
  else recommendation = 'poor';

  return {
    rowNumber: row.rowNumber,
    seats: row.seats,
    elevation: row.elevation,
    depth: row.depth,
    coverage: Math.round(totalCoverage),
    sunExposure: Math.round(finalSunExposure),
    inShadow: totalCoverage >= 50,
    shadowSources: {
      roof: Math.round(roofShadow),
      upperDeck: Math.round(upperDeckShadow),
      overhang: Math.round(overhangShadow),
      bowl: Math.round(bowlShadow)
    },
    recommendation
  };
}

function calculateOverhangShadow(rowDepth, overhangHeight, sunAltitude) {
  // If no overhang, no shadow
  if (!overhangHeight || overhangHeight <= 0) return 0;

  // Avoid division by zero for sun at horizon
  if (sunAltitude <= 0) return 100;

  // Calculate shadow length cast by overhang using trigonometry
  // shadowLength = overhangHeight / tan(sunAltitude)
  const sunAltitudeRad = sunAltitude * Math.PI / 180;
  const shadowLength = overhangHeight / Math.tan(sunAltitudeRad);

  // If row is within shadow length, calculate coverage
  if (rowDepth <= shadowLength) {
    // Front rows: Full coverage
    return 100;
  } else if (rowDepth <= shadowLength * 1.5) {
    // Transition zone: Partial coverage (linear falloff)
    const transition = (shadowLength * 1.5 - rowDepth) / (shadowLength * 0.5);
    return Math.max(0, transition * 100);
  }

  // Back rows: Beyond shadow reach
  return 0;
}

function calculateUpperDeckShadowForRow(rowElevation, rowDepth, section, sunAltitude, sunAzimuth) {
  // Only lower/field level sections get upper deck shadow
  if (section.level === 'upper' || section.level === 'suite') {
    return 0;
  }

  // Upper deck typical height: 40-60 feet above field
  const upperDeckHeight = (section.height || 0) + 40;
  const heightDifference = upperDeckHeight - rowElevation;

  // If row is higher than or equal to upper deck, no shadow
  if (heightDifference <= 0) return 0;

  // Avoid division by zero
  if (sunAltitude <= 0) return 100;

  // Calculate shadow length from upper deck
  const sunAltitudeRad = sunAltitude * Math.PI / 180;
  const shadowLength = heightDifference / Math.tan(sunAltitudeRad);

  // Check if section is behind home plate (gets more upper deck shadow)
  const sectionAngle = section.baseAngle || 0;
  const isBehindHomePlate = (sectionAngle >= 135 && sectionAngle <= 225);

  if (isBehindHomePlate) {
    // More aggressive shadow for behind-home sections
    if (rowDepth <= shadowLength * 0.8) {
      return 100;
    } else if (rowDepth <= shadowLength * 1.2) {
      const transition = (shadowLength * 1.2 - rowDepth) / (shadowLength * 0.4);
      return Math.max(0, transition * 100);
    }
  } else {
    // Standard shadow for side/outfield sections
    if (rowDepth <= shadowLength * 0.5) {
      return 80;
    } else if (rowDepth <= shadowLength) {
      const transition = (shadowLength - rowDepth) / (shadowLength * 0.5);
      return Math.max(0, transition * 80);
    }
  }

  return 0;
}

function calculateRowShadows(section, sunAltitude, sunAzimuth, stadiumOrientation = 0) {
  // If no rows, return empty
  if (!section.rows || section.rows.length === 0) {
    return {
      sectionId: section.id,
      sectionName: section.name,
      rows: [],
      averageCoverage: 0,
      bestRows: [],
      worstRows: []
    };
  }

  // Calculate shadow for each row
  const rowShadows = section.rows.map(row =>
    calculateRowShadow(row, section, sunAltitude, sunAzimuth, stadiumOrientation)
  );

  // Calculate section average
  const totalCoverage = rowShadows.reduce((sum, r) => sum + r.coverage, 0);
  const averageCoverage = totalCoverage / rowShadows.length;

  // Find best and worst rows (sort by shade coverage)
  const sortedByShade = [...rowShadows].sort((a, b) => b.coverage - a.coverage);
  const bestRows = sortedByShade.slice(0, 5).map(r => r.rowNumber);
  const worstRows = sortedByShade.slice(-5).reverse().map(r => r.rowNumber);

  return {
    sectionId: section.id,
    sectionName: section.name,
    rows: rowShadows,
    averageCoverage: Math.round(averageCoverage),
    bestRows,
    worstRows
  };
}