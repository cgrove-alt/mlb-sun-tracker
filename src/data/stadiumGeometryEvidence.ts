export type GeometryAcquisitionMethod =
  | 'surveyed'
  | 'as-built-plan'
  | 'public-lidar'
  | 'photogrammetry'
  | 'venue-mesh';

export type GeometryEvidenceStage =
  | 'modeled'
  | 'source-located'
  | 'remotely-measured'
  | 'surveyed';

export type ObservationValidationStage =
  | 'not-started'
  | 'collecting'
  | 'failed'
  | 'passed';

export type GeometryCurrencyStage = 'not-reviewed' | 'stale' | 'current';

export type GeometryComponent =
  | 'stadium-frame'
  | 'row-surfaces'
  | 'overhangs'
  | 'upper-decks'
  | 'roof'
  | 'scoreboards'
  | 'facades';

export interface GeometrySourceEvidence {
  id: string;
  provider: string;
  method: GeometryAcquisitionMethod;
  sourceUrl: string;
  additionalSourceUrls?: readonly string[];
  metadataUrl?: string;
  acquiredOn?: string;
  acquiredThrough?: string;
  discoveredOn: string;
  license: 'public-domain' | 'published-for-public-access' | 'permission-required';
  coordinateReferenceSystem?: string;
  nominalPointSpacingFt?: number;
  nominalRasterPixelSizeFt?: number;
  footprintCoveragePercent?: number;
  components: readonly GeometryComponent[];
  notes?: string;
}

export interface GeometryMeasurementEvidence {
  stage: GeometryEvidenceStage;
  measuredCoveragePercent: number;
  horizontalUncertaintyFt: number | null;
  verticalUncertaintyFt: number | null;
  orientationUncertaintyDeg: number | null;
  sourceIds: readonly string[];
  artifactVersion?: string;
}

export interface ShadowObservationHoldout {
  stage: ObservationValidationStage;
  observationCount: number;
  heldOutObservationCount: number;
  uniqueDates: number;
  solarAltitudeSpanDeg: number;
  medianBoundaryErrorRows: number | null;
  p95BoundaryErrorRows: number | null;
  geometryArtifactVersion: string | null;
  sourceUrls: readonly string[];
  notes?: string;
}

/**
 * Currency is a separate release dimension from measurement accuracy. A
 * precise scan of an old stadium can still be dangerously wrong after a deck,
 * videoboard, canopy, or seating-bowl renovation.
 */
export interface GeometryCurrencyEvidence {
  stage: GeometryCurrencyStage;
  assessedOn: string | null;
  latestKnownChangeOn: string | null;
  sourceUrls: readonly string[];
  notes?: string;
}

export interface StadiumGeometryEvidence {
  stadiumId: string;
  sources: readonly GeometrySourceEvidence[];
  stadiumFrame: GeometryMeasurementEvidence;
  rowGeometry: GeometryMeasurementEvidence;
  obstructionGeometry: GeometryMeasurementEvidence;
  geometryCurrency: GeometryCurrencyEvidence;
  observationHoldout: ShadowObservationHoldout;
  reviewedOn: string;
}

export const SEAT_SHADE_RELEASE_THRESHOLDS = {
  measuredCoveragePercent: 100,
  horizontalUncertaintyFt: 1,
  verticalUncertaintyFt: 1,
  orientationUncertaintyDeg: 1,
  heldOutObservationCount: 30,
  uniqueDates: 3,
  solarAltitudeSpanDeg: 25,
  medianBoundaryErrorRows: 1,
  p95BoundaryErrorRows: 2,
  maxObservationTimeUncertaintySeconds: 30,
  maxBoundaryLabelUncertaintyRows: 1,
} as const;

export type GeometryPublicationBlocker =
  | 'NO_METRIC_STADIUM_FRAME'
  | 'STADIUM_FRAME_COVERAGE_INCOMPLETE'
  | 'ROW_GEOMETRY_NOT_MEASURED'
  | 'ROW_GEOMETRY_COVERAGE_INCOMPLETE'
  | 'OBSTRUCTION_GEOMETRY_NOT_MEASURED'
  | 'OBSTRUCTION_GEOMETRY_COVERAGE_INCOMPLETE'
  | 'HORIZONTAL_UNCERTAINTY_UNKNOWN_OR_HIGH'
  | 'VERTICAL_UNCERTAINTY_UNKNOWN_OR_HIGH'
  | 'ORIENTATION_UNCERTAINTY_UNKNOWN_OR_HIGH'
  | 'GEOMETRY_CURRENCY_NOT_VERIFIED'
  | 'GEOMETRY_SOURCE_STALE'
  | 'OBSERVATION_HOLDOUT_NOT_PASSED'
  | 'OBSERVATION_HOLDOUT_TOO_SMALL'
  | 'OBSERVATION_DATE_COVERAGE_TOO_SMALL'
  | 'OBSERVATION_SOLAR_RANGE_TOO_SMALL'
  | 'OBSERVED_MEDIAN_ERROR_UNKNOWN_OR_HIGH'
  | 'OBSERVED_P95_ERROR_UNKNOWN_OR_HIGH'
  | 'OBSERVATION_GEOMETRY_VERSION_MISMATCH';

export interface GeometryPublicationEvaluation {
  publishable: boolean;
  blockers: readonly GeometryPublicationBlocker[];
}

const HTTPS_URL = /^https:\/\//i;

const isFiniteNonNegative = (value: number): boolean =>
  Number.isFinite(value) && value >= 0;

const isMeasured = (stage: GeometryEvidenceStage): boolean =>
  stage === 'remotely-measured' || stage === 'surveyed';

const modeledMeasurement = (): GeometryMeasurementEvidence => ({
  stage: 'modeled',
  measuredCoveragePercent: 0,
  horizontalUncertaintyFt: null,
  verticalUncertaintyFt: null,
  orientationUncertaintyDeg: null,
  sourceIds: [],
});

const emptyHoldout = (): ShadowObservationHoldout => ({
  stage: 'not-started',
  observationCount: 0,
  heldOutObservationCount: 0,
  uniqueDates: 0,
  solarAltitudeSpanDeg: 0,
  medianBoundaryErrorRows: null,
  p95BoundaryErrorRows: null,
  geometryArtifactVersion: null,
  sourceUrls: [],
});

const unreviewedCurrency = (): GeometryCurrencyEvidence => ({
  stage: 'not-reviewed',
  assessedOn: null,
  latestKnownChangeOn: null,
  sourceUrls: [],
});

/**
 * Metric geometry evidence is intentionally separate from seating-chart
 * provenance. Public section maps identify products; sources here must be
 * capable of measuring the physical surfaces that cast shadows.
 *
 * USGS sources are real, georeferenced inputs, but they remain at
 * `source-located` until a reproducible semantic reconstruction establishes
 * coverage and uncertainty. Merely finding or gridding lidar must never unlock
 * public row results.
 */
export const STADIUM_GEOMETRY_EVIDENCE: Readonly<Record<string, StadiumGeometryEvidence>> = {
  angels: {
    stadiumId: 'angels',
    sources: [
      {
        id: 'usgs-angels-california-gaps-2023-partial',
        provider: 'U.S. Geological Survey 3D Elevation Program',
        method: 'public-lidar',
        sourceUrl: 'https://rockyweb.usgs.gov/vdelivery/Datasets/Staged/Elevation/LPC/Projects/CA_CaliforniaGaps_B23/CA_CaliforniaGaps_2_B23/LAZ/USGS_LPC_CA_CaliforniaGaps_B23_11SMT418740.laz',
        metadataUrl: 'https://www.sciencebase.gov/catalog/item/68a3cf40d4be0258122e1e02',
        acquiredOn: '2023-11-10',
        discoveredOn: '2026-08-08',
        license: 'public-domain',
        coordinateReferenceSystem: 'EPSG:6340 + EPSG:5703 (metres)',
        nominalPointSpacingFt: 1.148293963,
        footprintCoveragePercent: 67.86,
        components: ['stadium-frame', 'row-surfaces', 'overhangs', 'upper-decks', 'scoreboards', 'facades'],
        notes: 'The 2023 QL1 project is current enough to investigate, but the exact union of all returned same-project tile bounds covers only 67.86% of the conservative 700-foot stadium footprint. The downloaded centre tile contains 2,488,853 points and a deterministic heightfield visibly truncates the eastern bowl. The newest complete same-project source returned by the official audit is the 2011 Orange County acquisition. Neither source is promoted.',
      },
    ],
    stadiumFrame: {
      stage: 'source-located',
      measuredCoveragePercent: 0,
      horizontalUncertaintyFt: null,
      verticalUncertaintyFt: null,
      orientationUncertaintyDeg: null,
      sourceIds: ['usgs-angels-california-gaps-2023-partial'],
      artifactVersion: 'sha256:6671eb3ceea935013eb301767b0a0d457caa82c1d1ca958b8e493343b8f43258',
    },
    rowGeometry: {
      stage: 'source-located',
      measuredCoveragePercent: 0,
      horizontalUncertaintyFt: null,
      verticalUncertaintyFt: null,
      orientationUncertaintyDeg: null,
      sourceIds: ['usgs-angels-california-gaps-2023-partial'],
      artifactVersion: 'sha256:6671eb3ceea935013eb301767b0a0d457caa82c1d1ca958b8e493343b8f43258',
    },
    obstructionGeometry: {
      stage: 'source-located',
      measuredCoveragePercent: 0,
      horizontalUncertaintyFt: null,
      verticalUncertaintyFt: null,
      orientationUncertaintyDeg: null,
      sourceIds: ['usgs-angels-california-gaps-2023-partial'],
      artifactVersion: 'sha256:6671eb3ceea935013eb301767b0a0d457caa82c1d1ca958b8e493343b8f43258',
    },
    geometryCurrency: unreviewedCurrency(),
    observationHoldout: emptyHoldout(),
    reviewedOn: '2026-08-08',
  },
  astros: {
    stadiumId: 'astros',
    sources: [
      {
        id: 'usgs-astros-tx-houston-2024',
        provider: 'U.S. Geological Survey 3D Elevation Program',
        method: 'public-lidar',
        sourceUrl: 'https://rockyweb.usgs.gov/vdelivery/Datasets/Staged/Elevation/LPC/Projects/TX_Houston_B24/TX_Houston_3_B24/LAZ/USGS_LPC_TX_Houston_B24_15RTN271293.laz',
        additionalSourceUrls: [
          'https://rockyweb.usgs.gov/vdelivery/Datasets/Staged/Elevation/LPC/Projects/TX_Houston_B24/TX_Houston_3_B24/LAZ/USGS_LPC_TX_Houston_B24_15RTN271294.laz',
          'https://rockyweb.usgs.gov/vdelivery/Datasets/Staged/Elevation/LPC/Projects/TX_Houston_B24/TX_Houston_3_B24/LAZ/USGS_LPC_TX_Houston_B24_15RTN272293.laz',
          'https://rockyweb.usgs.gov/vdelivery/Datasets/Staged/Elevation/LPC/Projects/TX_Houston_B24/TX_Houston_3_B24/LAZ/USGS_LPC_TX_Houston_B24_15RTN272294.laz',
        ],
        metadataUrl: 'https://prd-tnm.s3.amazonaws.com/StagedProducts/Elevation/metadata/TX_Houston_B24/TX_Houston_3_B24/reports/TX_Houston_WU300806_Report.pdf',
        acquiredOn: '2024-02-18',
        discoveredOn: '2026-08-10',
        license: 'public-domain',
        coordinateReferenceSystem: 'EPSG:6344 + EPSG:5703, Geoid18 (metres)',
        nominalPointSpacingFt: 1.1483,
        footprintCoveragePercent: 100,
        components: ['stadium-frame', 'row-surfaces', 'overhangs', 'upper-decks', 'roof', 'scoreboards', 'facades'],
        notes: 'Four official tiles cover the declared 900-by-900-foot footprint and contribute 833,933 non-noise returns from one source flight line. Stadium-local returns span 2024-02-18T06:20:33.330459Z through 2024-02-18T06:20:39.066741Z. The project reports 1.05 ft horizontal accuracy at 95% confidence and 0.2087 ft raw fundamental vertical accuracy at 95% confidence. The horizontal value already exceeds the one-foot gate. One-foot sampling coverage is 72.04% and one-foot multi-flight-line coverage is zero. The brief nighttime pass records only one state of the retractable roof and moving glass wall and predates documented 2025 changes.',
      },
      {
        id: '3ddv-astros-current-provider-row-map-2026',
        provider: '3D Digital Venue',
        method: 'venue-mesh',
        sourceUrl: 'https://venues.3ddigitalvenue.com/houston-astros',
        metadataUrl: 'https://preview.3ddigitalvenue.com/houston-astros',
        discoveredOn: '2026-08-09',
        license: 'published-for-public-access',
        coordinateReferenceSystem: 'provider-local three-dimensional rendering coordinates in metres; not georeferenced',
        components: ['stadium-frame', 'row-surfaces'],
        notes: 'The current provider product exposes 2,304 ticket-addressable assigned rows and 18,513 provider anchors with complete internal provider-coordinate coverage. Seven non-assigned-row products are excluded from that scope. The venue-local axis directions are not established and the provider coordinates are rendering coordinates, not defensible physical measurements. No accepted metric world registration or current obstruction mesh exists.',
      },
    ],
    stadiumFrame: {
      stage: 'source-located',
      measuredCoveragePercent: 0,
      horizontalUncertaintyFt: null,
      verticalUncertaintyFt: null,
      orientationUncertaintyDeg: null,
      sourceIds: [
        'usgs-astros-tx-houston-2024',
        '3ddv-astros-current-provider-row-map-2026',
      ],
      artifactVersion: 'sha256:d938ed71a8da16a5d1ec1998de9618cc4d0f4e97f6f57571bbad67ab5ae44f57',
    },
    rowGeometry: {
      stage: 'source-located',
      measuredCoveragePercent: 0,
      horizontalUncertaintyFt: null,
      verticalUncertaintyFt: null,
      orientationUncertaintyDeg: null,
      sourceIds: [
        'usgs-astros-tx-houston-2024',
        '3ddv-astros-current-provider-row-map-2026',
      ],
      artifactVersion: 'sha256:625c1a2882ce5f2ac1667198a7d40e3f4b2b719ffe2160a758fc9d87204cb197',
    },
    obstructionGeometry: {
      stage: 'source-located',
      measuredCoveragePercent: 0,
      horizontalUncertaintyFt: null,
      verticalUncertaintyFt: null,
      orientationUncertaintyDeg: null,
      sourceIds: ['usgs-astros-tx-houston-2024'],
      artifactVersion: 'sha256:d938ed71a8da16a5d1ec1998de9618cc4d0f4e97f6f57571bbad67ab5ae44f57',
    },
    geometryCurrency: {
      stage: 'stale',
      assessedOn: '2026-08-10',
      latestKnownChangeOn: '2025-03-27',
      sourceUrls: [
        'https://www.mlb.com/press-release/press-release-astros-partner-with-samsung-to-elevate-minute-maid-park-with-state',
        'https://www.mlb.com/astros/press-release/release-astros-announce-ballpark-naming-rights-partnership-with-daikin-comfort-technologies',
        'https://www.mlb.com/astros/press-release/press-release-popular-astros-train-has-new-look-new-sponsor-in-2025',
        'https://houstonsports.org/public-information/',
        'https://www.walterpmoore.com/projects/daikin-park',
      ],
      notes: 'The February 2024 LiDAR predates the January 2025 naming transition and the March 2025 Home Run Train refurbishment. The official archive establishes a custody chain for original marked drawings and identifies Final Drawings, design packages, and change orders as record classes, but the public index does not expose current metric as-builts. The official media API also exposes 874 of 893 server-reported records. No source establishes all current signs, exact train envelope, row treads and risers, overhang undersides, or every operational position of the 580-foot retractable roof and 115-foot moving glass wall.',
    },
    observationHoldout: emptyHoldout(),
    reviewedOn: '2026-08-10',
  },
  bluejays: {
    stadiumId: 'bluejays',
    sources: [
      {
        id: 'toronto-3d-massing-rogers-centre',
        provider: 'City of Toronto Open Data',
        method: 'venue-mesh',
        sourceUrl: 'https://ckan0.cf.opendata.inter.prod-toronto.ca/dataset/387b2e3b-2a76-4199-8b3b-0b7d22e2ec10/resource/ad1164e1-cd93-4314-b73c-e9ebf87a1c74/download/3dmassingmultipatch_2025_wgs84.zip',
        metadataUrl: 'https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/package_show?id=3d-massing',
        acquiredOn: '2025-12-05',
        discoveredOn: '2026-08-07',
        license: 'published-for-public-access',
        components: ['stadium-frame', 'roof', 'facades'],
        notes: 'The city publishes a 2025 WGS84 multipatch under its context-massing catalogue and Open Government Licence. The catalogue explicitly disclaims fitness for precision use, so this can locate exterior/roof candidates only; it cannot validate Rogers Centre rows or interior obstructions beneath the shell.',
      },
      {
        id: 'nrcan-canelevation-trca-gta-2023-rogers-centre',
        provider: 'Natural Resources Canada CanElevation LiDAR Point Clouds',
        method: 'public-lidar',
        sourceUrl: 'https://canelevation-lidar-point-clouds.s3.ca-central-1.amazonaws.com/pointclouds_nuagespoints/TRCA/GTA_2023/ON_TRCA2023_20230511_NAD83CSRS_UTMZ17_1km_E6290_N48330_CLASS.copc.laz',
        additionalSourceUrls: [
          'https://canelevation-lidar-point-clouds.s3.ca-central-1.amazonaws.com/pointclouds_nuagespoints/TRCA/GTA_2023/ON_TRCA2023_20230511_NAD83CSRS_UTMZ17_1km_E6300_N48330_CLASS.copc.laz',
        ],
        metadataUrl: 'https://open.canada.ca/data/en/dataset/7069387e-9986-4297-9f55-0288e9676947',
        acquiredOn: '2023-04-09',
        acquiredThrough: '2023-05-11',
        discoveredOn: '2026-08-09',
        license: 'published-for-public-access',
        coordinateReferenceSystem: 'NAD83(CSRS) / UTM zone 17N + CGVD2013 (metres)',
        footprintCoveragePercent: 100,
        components: ['stadium-frame', 'roof', 'facades'],
        notes: 'Two checksum-locked federal COPC tiles cover the declared venue footprint. Stadium-local GPS returns span 2023-04-10T04:34:25.692758Z through 2023-04-10T04:54:54.725109Z. Official project metadata reports 0.15 m radial horizontal RMSE and 0.057 m non-vegetated vertical accuracy at 95% confidence. Under the federal 1.7308 RMSEr conversion, source horizontal accuracy at 95% is 0.852 ft and vertical accuracy is 0.187 ft. The maximum-height review shows the roof fully closed, so the field, seating rows, and interior obstructions are completely occluded.',
      },
    ],
    stadiumFrame: {
      stage: 'source-located',
      measuredCoveragePercent: 0,
      horizontalUncertaintyFt: null,
      verticalUncertaintyFt: null,
      orientationUncertaintyDeg: null,
      sourceIds: [
        'toronto-3d-massing-rogers-centre',
        'nrcan-canelevation-trca-gta-2023-rogers-centre',
      ],
      artifactVersion: 'sha256:bfabbd7204ec70f8b3ad55f697bb77e768ab5e8fa45044c98fc6a5687afbc0e6',
    },
    rowGeometry: modeledMeasurement(),
    obstructionGeometry: {
      stage: 'source-located',
      measuredCoveragePercent: 0,
      horizontalUncertaintyFt: null,
      verticalUncertaintyFt: null,
      orientationUncertaintyDeg: null,
      sourceIds: [
        'toronto-3d-massing-rogers-centre',
        'nrcan-canelevation-trca-gta-2023-rogers-centre',
      ],
      artifactVersion: 'sha256:bfabbd7204ec70f8b3ad55f697bb77e768ab5e8fa45044c98fc6a5687afbc0e6',
    },
    geometryCurrency: {
      stage: 'stale',
      assessedOn: '2026-08-09',
      latestKnownChangeOn: '2024-04-04',
      sourceUrls: [
        'https://www.mlb.com/press-release/press-release-blue-jays-unveil-renovation-details-for-reimagined-100-level-at-ro',
        'https://www.mlb.com/press-release/press-release-blue-jays-showcase-all-new-100-level-seating-bowl-at-rogers-centre-as-part-of-multi-year-renovations',
      ],
      notes: 'The LiDAR footprint was collected on April 10, 2023. The Blue Jays then fully demolished, excavated, reoriented, and rebuilt the original 100-level bowl from foul pole to foul pole for the 2024 season. The closed-roof acquisition contains no interior surfaces and predates the current lower bowl.',
    },
    observationHoldout: emptyHoldout(),
    reviewedOn: '2026-08-09',
  },
  braves: {
    stadiumId: 'braves',
    sources: [
      {
        id: 'usgs-braves-ga-statewide-2019',
        provider: 'U.S. Geological Survey 3D Elevation Program',
        method: 'public-lidar',
        sourceUrl: 'https://rockyweb.usgs.gov/vdelivery/Datasets/Staged/Elevation/LPC/Projects/GA_Statewide_2018_B18_DRRA/GA_Statewide_B2_2018/LAZ/USGS_LPC_GA_Statewide_2018_B18_DRRA_e1056n1266.laz',
        additionalSourceUrls: [
          'https://rockyweb.usgs.gov/vdelivery/Datasets/Staged/Elevation/LPC/Projects/GA_Statewide_2018_B18_DRRA/GA_Statewide_B2_2018/LAZ/USGS_LPC_GA_Statewide_2018_B18_DRRA_e1056n1267.laz',
          'https://rockyweb.usgs.gov/vdelivery/Datasets/Staged/Elevation/LPC/Projects/GA_Statewide_2018_B18_DRRA/GA_Statewide_B2_2018/LAZ/USGS_LPC_GA_Statewide_2018_B18_DRRA_e1055n1266.laz',
          'https://rockyweb.usgs.gov/vdelivery/Datasets/Staged/Elevation/LPC/Projects/GA_Statewide_2018_B18_DRRA/GA_Statewide_B2_2018/LAZ/USGS_LPC_GA_Statewide_2018_B18_DRRA_e1055n1267.laz',
        ],
        metadataUrl: 'https://prd-tnm.s3.amazonaws.com/StagedProducts/Elevation/metadata/GA_Statewide_2018_B18_DRRA/GA_Statewide_B2_2018/reports/18066_Project%20Report_Blk02.pdf',
        acquiredOn: '2019-04-18',
        discoveredOn: '2026-08-09',
        license: 'public-domain',
        coordinateReferenceSystem: 'EPSG:6350 + EPSG:5703 (metres)',
        nominalPointSpacingFt: 1.7346,
        footprintCoveragePercent: 100,
        components: ['stadium-frame', 'row-surfaces', 'overhangs', 'upper-decks', 'scoreboards', 'facades'],
        notes: 'Four checksum-locked tiles cover Truist Park and contain 14,892,698 source points. Stadium-local GPS returns span 2019-04-18T03:59:00.910967Z through 2019-04-18T04:14:10.690874Z. The reviewed project reports provide 0.322 ft classified non-vegetated vertical accuracy at 95% confidence, but no measured horizontal accuracy at 95% confidence. The nominal 0.2 m sensor specification has no reported confidence level and does not pass the horizontal gate. One-foot footprint sampling coverage is 29.28%, two-flight-line coverage is 1.95%, and the source predates documented 2024 through 2026 changes.',
      },
      {
        id: 'braves-iomedia-current-representative-viewpoints',
        provider: 'IOMEDIA Virtual Venue',
        method: 'venue-mesh',
        sourceUrl: 'https://braves.io-media.com/web/index.html',
        metadataUrl: 'https://www.mlb.com/braves/ballpark/information/guide',
        discoveredOn: '2026-08-09',
        license: 'published-for-public-access',
        coordinateReferenceSystem: 'rendered cube panorama pixels; not metric and not georeferenced',
        components: ['row-surfaces', 'overhangs', 'upper-decks', 'scoreboards', 'facades'],
        notes: 'The current club-linked configuration exposes 551 representative viewpoints across 300 section IDs and public cube panoramas last modified in February 2025. Its venue maps contain 2D camera-backplate pixels, not metric 3D coordinates. A bounded section 150 audit probed 675 plausible row and seat asset names and found exactly the four configured rows 3, 9, 16, and 25, with no unlisted row assets. This cannot establish complete assigned-row coverage, quantitative source accuracy, or current 2026 geometry.',
      },
    ],
    stadiumFrame: {
      stage: 'source-located',
      measuredCoveragePercent: 0,
      horizontalUncertaintyFt: null,
      verticalUncertaintyFt: null,
      orientationUncertaintyDeg: null,
      sourceIds: ['usgs-braves-ga-statewide-2019'],
      artifactVersion: 'sha256:f11e791f8825303084841dea7570931bf0aabf34bb769e30f7f35f9554c12c3f',
    },
    rowGeometry: {
      stage: 'source-located',
      measuredCoveragePercent: 0,
      horizontalUncertaintyFt: null,
      verticalUncertaintyFt: null,
      orientationUncertaintyDeg: null,
      sourceIds: [
        'usgs-braves-ga-statewide-2019',
        'braves-iomedia-current-representative-viewpoints',
      ],
      artifactVersion: 'sha256:6976caa1c05ba2fc45ef2341153cbd499aa5463b4ea28901ecc26da86a2513f8',
    },
    obstructionGeometry: {
      stage: 'source-located',
      measuredCoveragePercent: 0,
      horizontalUncertaintyFt: null,
      verticalUncertaintyFt: null,
      orientationUncertaintyDeg: null,
      sourceIds: [
        'usgs-braves-ga-statewide-2019',
        'braves-iomedia-current-representative-viewpoints',
      ],
      artifactVersion: 'sha256:6976caa1c05ba2fc45ef2341153cbd499aa5463b4ea28901ecc26da86a2513f8',
    },
    geometryCurrency: {
      stage: 'stale',
      assessedOn: '2026-08-09',
      latestKnownChangeOn: null,
      sourceUrls: [
        'https://www.mlb.com/amp/press-release/press-release-atlanta-braves-unveil-new-and-expanded-truist-park-seating-options.html',
        'https://www.mlb.com/news/press-release-new-and-upgraded-offerings-at-truist-park-and-the-battery-atlanta-for-2026',
      ],
      notes: 'The 2019 LiDAR predates official 2024 and 2025 seating changes and official 2026 ballpark and hospitality upgrades. The public virtual-venue panoramas were last modified in February 2025, so they also cannot certify the current 2026 obstruction scope.',
    },
    observationHoldout: emptyHoldout(),
    reviewedOn: '2026-08-09',
  },
  dodgers: {
    stadiumId: 'dodgers',
    sources: [
      {
        id: 'usgs-dodgers-los-angeles-2023',
        provider: 'U.S. Geological Survey 3D Elevation Program',
        method: 'public-lidar',
        sourceUrl: 'https://rockyweb.usgs.gov/vdelivery/Datasets/Staged/Elevation/LPC/Projects/CA_LosAngeles_B23/CA_LosAngeles_1_B23/LAZ/USGS_LPC_CA_LosAngeles_B23_11SLT038500377000.laz',
        additionalSourceUrls: [
          'https://rockyweb.usgs.gov/vdelivery/Datasets/Staged/Elevation/LPC/Projects/CA_LosAngeles_B23/CA_LosAngeles_1_B23/LAZ/USGS_LPC_CA_LosAngeles_B23_11SLT038500377100.laz',
        ],
        metadataUrl: 'https://www.sciencebase.gov/catalog/item/684e2239d4be0235a8ae03e1',
        acquiredOn: '2023-11-22',
        acquiredThrough: '2023-12-04',
        discoveredOn: '2026-08-08',
        license: 'public-domain',
        coordinateReferenceSystem: 'EPSG:6340 + EPSG:5703 (metres)',
        nominalPointSpacingFt: 1.148293963,
        footprintCoveragePercent: 100,
        components: ['stadium-frame', 'row-surfaces', 'overhangs', 'upper-decks', 'scoreboards', 'facades'],
        notes: 'Two official adjacent tiles are required for the complete footprint (53,028,313 source points total). The v2 audit retained 2,008,094 non-noise footprint returns and found 92.83% one-foot sampling coverage but only 69.06% two-flight-line coverage. The footprint GPS timestamps span 2023-11-22T06:57:01Z through 2023-12-04T09:16:03Z. Project metadata gives 0.35 m nominal spacing, 10 cm RMSEz vertical class, and relative vertical checks, but it does not establish stadium-surface horizontal accuracy or semantic row/overhang completeness.',
      },
    ],
    stadiumFrame: {
      stage: 'source-located',
      measuredCoveragePercent: 0,
      horizontalUncertaintyFt: null,
      verticalUncertaintyFt: null,
      orientationUncertaintyDeg: null,
      sourceIds: ['usgs-dodgers-los-angeles-2023'],
      artifactVersion: 'sha256:e59bc4f1e737c998314e39b2e9fec15d13539a138781ed669cebd511910e7ecf',
    },
    rowGeometry: {
      stage: 'source-located',
      measuredCoveragePercent: 0,
      horizontalUncertaintyFt: null,
      verticalUncertaintyFt: null,
      orientationUncertaintyDeg: null,
      sourceIds: ['usgs-dodgers-los-angeles-2023'],
      artifactVersion: 'sha256:e59bc4f1e737c998314e39b2e9fec15d13539a138781ed669cebd511910e7ecf',
    },
    obstructionGeometry: {
      stage: 'source-located',
      measuredCoveragePercent: 0,
      horizontalUncertaintyFt: null,
      verticalUncertaintyFt: null,
      orientationUncertaintyDeg: null,
      sourceIds: ['usgs-dodgers-los-angeles-2023'],
      artifactVersion: 'sha256:e59bc4f1e737c998314e39b2e9fec15d13539a138781ed669cebd511910e7ecf',
    },
    geometryCurrency: {
      stage: 'stale',
      assessedOn: '2026-08-08',
      latestKnownChangeOn: null,
      sourceUrls: ['https://www.mlb.com/dodgers/ballpark/stadium-upgrades'],
      notes: 'The club documents post-acquisition 2024 relocation of the Top Deck Japanese stone lantern and refreshed pavilion benches. It says the 2024-2025 clubhouse renovation is not noticeable from the seating bowl, but that limited statement cannot certify all current sun-casting obstructions. The 2023 point cloud therefore remains stale for exact publication.',
    },
    observationHoldout: emptyHoldout(),
    reviewedOn: '2026-08-08',
  },
  marlins: {
    stadiumId: 'marlins',
    sources: [
      {
        id: 'miami-dade-noaa-2018-subfoot-lidar-loandepot-park',
        provider: 'Miami-Dade County Information Technology Department via NOAA Office for Coastal Management',
        method: 'public-lidar',
        sourceUrl: 'https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9271/20180605_318449O.copc.laz',
        metadataUrl: 'https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9271/metadata_fl2018_miamidade.xml',
        additionalSourceUrls: [
          'https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/9271/supplemental/MDC_LiDAR_2018_SMR_GPI_10042019.pdf',
        ],
        acquiredOn: '2018-06-05',
        discoveredOn: '2026-08-09',
        license: 'public-domain',
        coordinateReferenceSystem: 'EPSG:6346 + EPSG:5703, NAVD88 (metres)',
        nominalPointSpacingFt: 0.607562944,
        footprintCoveragePercent: 100,
        components: ['stadium-frame', 'row-surfaces', 'overhangs', 'upper-decks', 'roof', 'scoreboards', 'facades'],
        notes: 'The official project report and metadata conservatively establish 0.4967 ft horizontal accuracy and 0.39984 ft vertical accuracy at 95% confidence. Stadium-local returns record the roof fully open with panels parked west. One-foot sampling coverage is 99.70%, but one-foot multi-flight-line coverage is 67.58%. Raw top-down returns do not establish every semantic row or obstruction underside.',
      },
      {
        id: 'miami-dade-noaa-2021-lidar-loandepot-park',
        provider: 'Miami-Dade County Information Technology Department via NOAA Office for Coastal Management',
        method: 'public-lidar',
        sourceUrl: 'https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/10338/20210410_318449O.copc.laz',
        metadataUrl: 'https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/laz/geoid18/10338/supplemental/2021_ITD_SMR_Report.pdf',
        acquiredOn: '2021-04-10',
        discoveredOn: '2026-08-10',
        license: 'public-domain',
        coordinateReferenceSystem: 'EPSG:6346 + EPSG:5703, NAVD88 (metres)',
        footprintCoveragePercent: 100,
        components: ['stadium-frame', 'roof', 'scoreboards', 'facades'],
        notes: 'The source reports 3.8 ft absolute horizontal accuracy and 0.31 ft vertical accuracy at 95% confidence. A locked local rigid correction registers its fixed stadium and adjacent-building hard structures to the sub-foot 2018 absolute frame. Seven reviewed training controls and six disjoint held-out controls produce a 0.4259 ft maximum holdout residual. Root-sum-square combination yields 0.6543 ft horizontal uncertainty and 0.0308 degree orientation uncertainty. This accepts the 2021 local stadium frame only, not rows, roof undersides, movable-panel positions, or obstruction completeness.',
      },
      {
        id: 'usgs-marlins-fl-miamidade-2024',
        provider: 'U.S. Geological Survey 3D Elevation Program',
        method: 'public-lidar',
        sourceUrl: 'https://rockyweb.usgs.gov/vdelivery/Datasets/Staged/Elevation/LPC/Projects/FL_MiamiDade_D23/FL_MiamiDade_1_D23/LAZ/USGS_LPC_FL_MiamiDade_D23_LID2024_318449_0901.laz',
        additionalSourceUrls: [
          'https://rockyweb.usgs.gov/vdelivery/Datasets/Staged/Elevation/LPC/Projects/FL_MiamiDade_D23/FL_MiamiDade_1_D23/LAZ/USGS_LPC_FL_MiamiDade_D23_LID2024_318749_0901.laz',
        ],
        metadataUrl: 'https://prd-tnm.s3.amazonaws.com/StagedProducts/Elevation/metadata/FL_MiamiDade_D23/FL_MiamiDade_1_D23/reports/project_report/FL_MiamiDade_D23_LMReport.pdf',
        acquiredOn: '2024-01-21',
        acquiredThrough: '2024-02-22',
        discoveredOn: '2026-08-10',
        license: 'public-domain',
        coordinateReferenceSystem: 'EPSG:6438 + EPSG:6360, NAVD88 Geoid18 (U.S. survey feet)',
        nominalPointSpacingFt: 0.8858,
        footprintCoveragePercent: 100,
        components: ['stadium-frame', 'roof', 'scoreboards', 'facades'],
        notes: 'The closed-roof source reports 1.647 ft horizontal accuracy and 0.643 ft vertical accuracy at 95% confidence. A locked shape-only audit supports persistence of the upper movable panel top profile with 0.0531 ft p95 holdout residual and 0.7139 ft combined vertical uncertainty. Its nuisance alignment does not establish sub-foot absolute panel position, lower-panel open surfaces, panel undersides, or a current complete obstruction volume.',
      },
      {
        id: '3ddv-marlins-current-provider-row-map-2026',
        provider: '3D Digital Venue',
        method: 'venue-mesh',
        sourceUrl: 'https://venues.3ddigitalvenue.com/marlins?iframeMode=true',
        metadataUrl: 'https://preview.3ddigitalvenue.com/marlins',
        discoveredOn: '2026-08-10',
        license: 'published-for-public-access',
        coordinateReferenceSystem: 'provider-local three-dimensional rendering coordinates in metres; not georeferenced',
        components: ['stadium-frame', 'row-surfaces'],
        notes: 'The current provider product exposes 2,037 ticket-addressable assigned rows and 17,859 anchors with complete internal provider-coordinate coverage. Five non-assigned-row products are excluded from that scope. The coordinates are provider rendering coordinates, not defensible physical measurements. The strongest world-registration candidate has 2.172 ft p95 plan uncertainty and no measured row elevations.',
      },
    ],
    stadiumFrame: {
      stage: 'remotely-measured',
      measuredCoveragePercent: 100,
      horizontalUncertaintyFt: 0.654302963,
      verticalUncertaintyFt: 0.31,
      orientationUncertaintyDeg: 0.030824776,
      sourceIds: [
        'miami-dade-noaa-2018-subfoot-lidar-loandepot-park',
        'miami-dade-noaa-2021-lidar-loandepot-park',
      ],
      artifactVersion: 'sha256:09544e44259be4feb1fea12029abd07da267bfda632c9f423030aef2b15588d6',
    },
    rowGeometry: {
      stage: 'source-located',
      measuredCoveragePercent: 0,
      horizontalUncertaintyFt: null,
      verticalUncertaintyFt: null,
      orientationUncertaintyDeg: null,
      sourceIds: [
        'miami-dade-noaa-2018-subfoot-lidar-loandepot-park',
        '3ddv-marlins-current-provider-row-map-2026',
      ],
      artifactVersion: 'sha256:8acdc53af396067317110dac35987287192ab749a2e38806ec244d8c77c08c80',
    },
    obstructionGeometry: {
      stage: 'source-located',
      measuredCoveragePercent: 0,
      horizontalUncertaintyFt: null,
      verticalUncertaintyFt: null,
      orientationUncertaintyDeg: null,
      sourceIds: [
        'miami-dade-noaa-2018-subfoot-lidar-loandepot-park',
        'miami-dade-noaa-2021-lidar-loandepot-park',
        'usgs-marlins-fl-miamidade-2024',
      ],
      artifactVersion: 'sha256:5c3fe20a669eb3d09ace779ea17eaef0757b68c42c85e6310054b7ccde0f91ae',
    },
    geometryCurrency: {
      stage: 'stale',
      assessedOn: '2026-08-11',
      latestKnownChangeOn: null,
      sourceUrls: [
        'https://www.mlb.com/marlins/ballpark/roof',
        'https://www.mlb.com/news/featured/loandepot-park-guide-capacity-seating-chart-parking-and-more',
        'https://www.nhl.com/video/6387176695112',
        'https://www.miamidade.gov/global/business/realestate/county-owned-properties.page',
        'https://www.miamidade.gov/govaction/legistarfiles/MinMatters/Y2009/091009min.pdf',
        'https://www.miami.gov/Permits-Construction/Property-Information/Request-Building-Records-Microfilm',
        'https://gis.miami.gov/gis/rest/services/Maps/iBuildPermits/MapServer/0',
        'https://miami.nextrequest.com/requests',
      ],
      notes: 'The official roof page confirms one upper and two lower panels that can move independently, so a generic open or closed label does not uniquely define the shadow volume. Official January 2026 NHL footage verifies that the mechanism still opens, but 1280-by-720 video does not provide metric panel coordinates or undersides. Construction Administration Agreement sections 5.1(f) and 5.1(j) required complete project records and delivery of an as-built Construction Document set to County and City representatives at Final Completion. A complete visual review of all 391 pages in the official agreement file found site-context maps, narratives, program schedules, budgets, and agreements but no construction drawing index, seating-bowl plan, building section, roof-mechanization drawing, as-built sheet, or survey control. That contractual route does not prove current agency possession or release eligibility. A checksum-locked query of the official City iBuild GIS layer exposes 163 address-or-folio features and 145 unique plan numbers, including 17 post-2024 plan identifiers and six active, approved, or submitted building-workflow candidates. It contains no plan sheets, project descriptions, original construction master-permit crosswalk, or final as-built geometry. The reproducible current-delta audit records five unresolved geometry classes and zero resolved current metric features. The 2018 open scan, 2021 closed scan, 2024 closed scan, permit index, and agreement exhibits therefore do not establish every current operational panel position or a complete current obstruction inventory.',
    },
    observationHoldout: emptyHoldout(),
    reviewedOn: '2026-08-11',
  },
  mariners: {
    stadiumId: 'mariners',
    sources: [
      {
        id: 'usgs-mariners-wa-kingcounty-2021',
        provider: 'U.S. Geological Survey 3D Elevation Program',
        method: 'public-lidar',
        sourceUrl: 'https://rockyweb.usgs.gov/vdelivery/Datasets/Staged/Elevation/LPC/Projects/WA_KingCounty_2021_B21/WA_KingCo_1_2021/LAZ/USGS_LPC_WA_KingCounty_2021_B21_King_2210.laz',
        additionalSourceUrls: [
          'https://rockyweb.usgs.gov/vdelivery/Datasets/Staged/Elevation/LPC/Projects/WA_KingCounty_2021_B21/WA_KingCo_1_2021/LAZ/USGS_LPC_WA_KingCounty_2021_B21_King_2283.laz',
        ],
        metadataUrl: 'https://prd-tnm.s3.amazonaws.com/StagedProducts/Elevation/metadata/WA_KingCounty_2021_B21/WA_KingCo_1_2021/reports/WA_KingCounty_2021_B21_Lidar_Delivery_1_Technical_Data_Report.pdf',
        acquiredOn: '2021-04-14',
        discoveredOn: '2026-08-09',
        license: 'public-domain',
        coordinateReferenceSystem: 'NAD83(2011) / Washington North (ftUS) + NAVD88 Geoid18 (ftUS)',
        nominalPointSpacingFt: 1.1483,
        footprintCoveragePercent: 100,
        components: ['stadium-frame', 'row-surfaces', 'overhangs', 'upper-decks', 'roof', 'scoreboards', 'facades'],
        notes: 'Two official tiles cover the declared footprint. Stadium-local returns span 2021-04-14T00:39:21.868073Z through 2021-04-14T01:07:51.344876Z. The project report gives a modeled-error-budget horizontal accuracy of 0.74 ft at 95% confidence and a projectwide non-vegetated vertical accuracy of 0.196 ft at 95% confidence. One-foot sampling coverage is 73.34% and one-foot multi-flight-line coverage is 28.44%. The scan records a single east-side parked roof state and predates documented Press Club, Diamond Club, seating, and main-board changes.',
      },
      {
        id: 'ticketmaster-mariners-current-provider-row-map-2026',
        provider: 'Ticketmaster primary-sale seat-map geometry',
        method: 'venue-mesh',
        sourceUrl: 'https://www.mlb.com/mariners/tickets/single-game-tickets',
        metadataUrl: 'https://mapsapi.tmol.io/maps/geometry/3/event/0F00635BEEE5733F/placeDetailNoKeys?useHostGrids=true&app=PRD2663_EDP_NA&sectionLevel=true&systemId=HOST',
        discoveredOn: '2026-08-10',
        license: 'published-for-public-access',
        coordinateReferenceSystem: 'provider-local two-dimensional map coordinates; not georeferenced',
        components: ['stadium-frame', 'row-surfaces'],
        notes: 'The provider map exposes 3,367 row nodes and 47,213 place anchors with complete internal map-coordinate coverage. These are provider rendering coordinates, not direct physical measurements. A LiDAR alignment diagnostic has 2.906 ft held-out p95 plan residual, and independent fits to three source flight lines diverge by as much as 30.785 ft in position and 3.462 degrees in bearing. The registration is therefore not stable enough for the one-foot and one-degree gates.',
      },
    ],
    stadiumFrame: {
      stage: 'source-located',
      measuredCoveragePercent: 0,
      horizontalUncertaintyFt: null,
      verticalUncertaintyFt: null,
      orientationUncertaintyDeg: null,
      sourceIds: [
        'usgs-mariners-wa-kingcounty-2021',
        'ticketmaster-mariners-current-provider-row-map-2026',
      ],
      artifactVersion: 'sha256:aaefd472f701dfd929135acac3e59d0ddecf8aebd4df32427accaeced3c89681',
    },
    rowGeometry: {
      stage: 'source-located',
      measuredCoveragePercent: 0,
      horizontalUncertaintyFt: null,
      verticalUncertaintyFt: null,
      orientationUncertaintyDeg: null,
      sourceIds: [
        'usgs-mariners-wa-kingcounty-2021',
        'ticketmaster-mariners-current-provider-row-map-2026',
      ],
      artifactVersion: 'sha256:aaefd472f701dfd929135acac3e59d0ddecf8aebd4df32427accaeced3c89681',
    },
    obstructionGeometry: {
      stage: 'source-located',
      measuredCoveragePercent: 0,
      horizontalUncertaintyFt: null,
      verticalUncertaintyFt: null,
      orientationUncertaintyDeg: null,
      sourceIds: ['usgs-mariners-wa-kingcounty-2021'],
      artifactVersion: 'sha256:8a28ef545daad36fc8f24d626d8ec4137be068db5dcff83876371bff1ee453cc',
    },
    geometryCurrency: {
      stage: 'stale',
      assessedOn: '2026-08-10',
      latestKnownChangeOn: '2026-06-29',
      sourceUrls: [
        'https://www.mlb.com/mariners/press-release/press-release-mariners-announce-new-premium-fan-amenities-coming-to-t-mobile-par',
        'https://www.mlb.com/mariners/press-release/press-release-muckleshoot-diamond-club-unveiled-at-t-mobile-park',
        'https://www.mlb.com/mariners/tickets/premium',
        'https://www.mlb.com/mariners/press-release/mariners-amazon-team-up-to-bring-world-s-largest-fire-tv-to-t-mobile-park',
        'https://ballpark.org/board-meetings/',
      ],
      notes: 'The April 2021 LiDAR predates the 2022 through 2023 conversion of the press box to indoor and exterior seating, expansion of the Diamond Club and its first-eight-row exterior seating, and removal of 104 Terrace Club seats for a relocated press box. Official 2026 PFD materials report seating replacement in unspecified individual seats and whole sections, with about 25% of seats replaced, and a phase-two main LED replacement. The PFD records a qualitative statement that the new board looks the same when off, but no source publishes current support coordinates, seating replacement locations, overhang undersides, or every operational roof-panel position.',
    },
    observationHoldout: emptyHoldout(),
    reviewedOn: '2026-08-10',
  },
  orioles: {
    stadiumId: 'orioles',
    sources: [
      {
        id: 'usgs-orioles-md-4county-2024',
        provider: 'U.S. Geological Survey 3D Elevation Program',
        method: 'public-lidar',
        sourceUrl: 'https://rockyweb.usgs.gov/vdelivery/Datasets/Staged/Elevation/LPC/Projects/MD_4County_D24/MD_4County_2_D24/LAZ/USGS_LPC_MD_4County_D24_18suj590490.laz',
        additionalSourceUrls: [
          'https://rockyweb.usgs.gov/vdelivery/Datasets/Staged/Elevation/LPC/Projects/MD_4County_D24/MD_4County_2_D24/LAZ/USGS_LPC_MD_4County_D24_18suj600490.laz',
        ],
        metadataUrl: 'https://prd-tnm.s3.amazonaws.com/StagedProducts/Elevation/metadata/MD_4County_D24/MD_4County_2_D24/reports/lidar_mapping_report/Lidar_Mapping_Report_MD_4County_2_D24.pdf',
        acquiredOn: '2024-12-17',
        acquiredThrough: '2024-12-30',
        discoveredOn: '2026-08-10',
        license: 'public-domain',
        coordinateReferenceSystem: 'EPSG:6347 + EPSG:5703, Geoid18 (metres)',
        nominalPointSpacingFt: 1.1483,
        footprintCoveragePercent: 100,
        components: ['stadium-frame', 'row-surfaces', 'overhangs', 'upper-decks', 'scoreboards', 'facades'],
        notes: 'Two official tiles cover the declared footprint and contribute 1,585,899 non-noise returns from two flight lines. The project reports 1.0732 ft horizontal accuracy at 95% confidence and 0.2701 ft raw vertical accuracy at 95% confidence. The horizontal source value already exceeds the one-foot release gate. At one-foot cells, sampling coverage is 80.86% and two-flight-line coverage is 31.05%, so neither complete row-scale support nor repeatability is established.',
      },
      {
        id: 'mdimap-orioles-three-inch-orthophoto-2025',
        provider: 'Maryland Department of Information Technology, MD iMAP',
        method: 'photogrammetry',
        sourceUrl: 'https://mdgeodata.md.gov/imagery/rest/services/ThreeInch/MD_ThreeInchImagery/ImageServer',
        additionalSourceUrls: [
          'https://mdgeodata.md.gov/imap/rest/services/Imagery/MD_AsFlownPhotoCenters/FeatureServer/0',
          'https://mdgeodata.md.gov/imap/rest/services/Imagery/MD_AsFlownPhotoCenters/FeatureServer/1',
        ],
        discoveredOn: '2026-08-10',
        license: 'published-for-public-access',
        coordinateReferenceSystem: 'Source tile EPSG:6488 (NAD83(2011) / Maryland ftUS); service mosaic EPSG:3857',
        nominalRasterPixelSizeFt: 0.25,
        footprintCoveragePercent: 100,
        components: ['stadium-frame', 'scoreboards', 'facades'],
        notes: 'The official 2025 three-inch orthophoto supplies current plan imagery and two as-flown camera-center catalogues. Item-level records identify delivered source tile 45088308.tif, its exact EPSG:6488 extent, 0.25 ft pixels, and dimensions. The source-raster download operation is unsupported, and the service publishes no embedded checkpoints, numeric horizontal positional accuracy, raw camera imagery, exact frame footprints, or mosaic pixel-to-frame lineage. Published overlap and observed center spacing yield 25 plausible high-overlap March 10 frames spanning 1,188.70 seconds and four plausible standard-overlap March 12 frames spanning 580.80 seconds, both above the 30-second release limit. The corresponding source-layer dates are absent from the layer narratives, which list March 9 and March 11 instead.',
      },
      {
        id: 'baltimore-dot-official-survey-control-map',
        provider: 'Baltimore City Department of Transportation, Survey Section',
        method: 'surveyed',
        sourceUrl: 'https://www.arcgis.com/sharing/rest/content/items/38cdd9174711459eae78c2444a27e3d2',
        additionalSourceUrls: [
          'https://www.arcgis.com/sharing/rest/content/items/419b0282fae34630ba351d94fa7d0af2',
        ],
        discoveredOn: '2026-08-10',
        license: 'published-for-public-access',
        components: ['stadium-frame'],
        notes: 'The official map publishes 135 Maryland State primary records, 135 Baltimore-projection primary records, 898 secondary controls, and 265 triangulation points. All 898 embedded scan and verification fields are blank. The map does not machine-label the state-coordinate datum, realization, unit, epoch, adjustment, or numeric uncertainty. The Survey Section says point-specific cards are held at 510 Fallsway, so the inventory cannot pass the one-foot gate without those records and current monument identification.',
      },
    ],
    stadiumFrame: {
      stage: 'source-located',
      measuredCoveragePercent: 0,
      horizontalUncertaintyFt: null,
      verticalUncertaintyFt: null,
      orientationUncertaintyDeg: null,
      sourceIds: [
        'usgs-orioles-md-4county-2024',
        'mdimap-orioles-three-inch-orthophoto-2025',
        'baltimore-dot-official-survey-control-map',
      ],
      artifactVersion: 'sha256:6b28182f26dce9e27d87ba126362436a251a4726ad89ff55fa972e36274b95db',
    },
    rowGeometry: {
      stage: 'source-located',
      measuredCoveragePercent: 0,
      horizontalUncertaintyFt: null,
      verticalUncertaintyFt: null,
      orientationUncertaintyDeg: null,
      sourceIds: ['usgs-orioles-md-4county-2024'],
      artifactVersion: 'sha256:6b28182f26dce9e27d87ba126362436a251a4726ad89ff55fa972e36274b95db',
    },
    obstructionGeometry: {
      stage: 'source-located',
      measuredCoveragePercent: 0,
      horizontalUncertaintyFt: null,
      verticalUncertaintyFt: null,
      orientationUncertaintyDeg: null,
      sourceIds: [
        'usgs-orioles-md-4county-2024',
        'mdimap-orioles-three-inch-orthophoto-2025',
      ],
      artifactVersion: 'sha256:6b28182f26dce9e27d87ba126362436a251a4726ad89ff55fa972e36274b95db',
    },
    geometryCurrency: {
      stage: 'stale',
      assessedOn: '2026-08-10',
      latestKnownChangeOn: '2026-03-26',
      sourceUrls: [
        'https://mdstad.com/projects/renovation-projects-oriole-park-camden-yards',
        'https://mdstad.com/press-release/governor-moore-unveils-historic-stadium-upgrades-oriole-park-camden-yards-opening-day',
        'https://www.mlb.com/orioles/ballpark/stadium-renovations',
      ],
      notes: 'The December 2024 LiDAR predates completed 2026 changes to the center-field video board and pavilion, former press-box area, Club Level bars, right-field wall display, and ribbon boards. The Right Field Flag Court was still described as opening after the 2026 All-Star break in the current club application, and the next renovation phase is planned after the 2026 season. Official pages and visuals do not publish current as-built coordinates, obstruction heights, or overhang undersides.',
    },
    observationHoldout: emptyHoldout(),
    reviewedOn: '2026-08-10',
  },
  padres: {
    stadiumId: 'padres',
    sources: [
      {
        id: 'usgs-petco-2014-280835',
        provider: 'U.S. Geological Survey 3D Elevation Program',
        method: 'public-lidar',
        sourceUrl: 'https://rockyweb.usgs.gov/vdelivery/Datasets/Staged/Elevation/LPC/Projects/San_Diego_CA_2014_LiDAR/CA_SanDiegoQL2_2014/LAZ/USGS_LPC_San_Diego_CA_2014_LiDAR_280835.laz',
        metadataUrl: 'https://www.sciencebase.gov/catalog/item/657b4bd6d34e952b2274bd0b',
        acquiredOn: '2014-11-23',
        discoveredOn: '2026-08-07',
        license: 'public-domain',
        coordinateReferenceSystem: 'EPSG:6426',
        nominalPointSpacingFt: 2.3,
        components: ['stadium-frame', 'row-surfaces', 'overhangs', 'upper-decks', 'facades'],
        footprintCoveragePercent: 100,
        notes: 'The 8,278,730-point LAZ tile covers Petco Park. The unit-correct v2 metric audit retained 298,603 non-noise footprint returns, but found only 32.63% sampling coverage and 3.19% two-flight-line coverage at the one-foot release scale. The project report gives 0.382 ft raw FVA at 95% confidence for calibrated/controlled swath data; that does not establish stadium-row extraction accuracy. Official Padres records confirm material post-acquisition changes.',
      },
      {
        id: 'padres-3ddv-current-provider-local-model',
        provider: '3D Digital Venue',
        method: 'venue-mesh',
        sourceUrl: 'https://mlb.venues.3ddigitalvenue.com/sandiego-padres',
        metadataUrl: 'https://3ddigitalvenue.com/solutions-suite/venue-mapping/3d-map-selection/',
        discoveredOn: '2026-08-09',
        license: 'published-for-public-access',
        coordinateReferenceSystem: 'provider-local Cartesian metres; not georeferenced',
        components: ['stadium-frame', 'row-surfaces', 'overhangs', 'upper-decks', 'scoreboards', 'facades'],
        notes: 'The current team-linked viewer exposes metre-valued camera positions and rendered 8192 by 4096 spherical views. A disjoint four-camera research test calibrated the panorama axis on seats HRDECK TE 77 and 78, then recovered the provider-local horizontal direction for held-out seats 79 and 80 within 0.115 degrees. The provider describes its 3D maps as true-to-scale, but publishes no quantitative physical-accuracy specification. The upstream stereo validator injects baseline magnitude from provider positions. This source therefore supports current provider-local reconstruction research only and cannot establish one-foot scale, release registration, true north, obstruction completeness, or publication eligibility.',
      },
    ],
    stadiumFrame: {
      stage: 'source-located',
      measuredCoveragePercent: 0,
      horizontalUncertaintyFt: null,
      verticalUncertaintyFt: null,
      orientationUncertaintyDeg: null,
      sourceIds: ['usgs-petco-2014-280835', 'padres-3ddv-current-provider-local-model'],
      artifactVersion: 'sha256:8c4ac80b15ec49da184e631434ad934ef7571e00022481ec1dd4777532e540bc',
    },
    rowGeometry: {
      stage: 'source-located',
      measuredCoveragePercent: 0,
      horizontalUncertaintyFt: null,
      verticalUncertaintyFt: null,
      orientationUncertaintyDeg: null,
      sourceIds: ['usgs-petco-2014-280835', 'padres-3ddv-current-provider-local-model'],
      artifactVersion: 'sha256:8c4ac80b15ec49da184e631434ad934ef7571e00022481ec1dd4777532e540bc',
    },
    obstructionGeometry: {
      stage: 'source-located',
      measuredCoveragePercent: 0,
      horizontalUncertaintyFt: null,
      verticalUncertaintyFt: null,
      orientationUncertaintyDeg: null,
      sourceIds: ['usgs-petco-2014-280835', 'padres-3ddv-current-provider-local-model'],
      artifactVersion: 'sha256:8c4ac80b15ec49da184e631434ad934ef7571e00022481ec1dd4777532e540bc',
    },
    geometryCurrency: {
      stage: 'stale',
      assessedOn: '2026-08-08',
      latestKnownChangeOn: '2025-03-27',
      sourceUrls: [
        'https://www.mlb.com/news/san-diego-padres-announce-left-field-renovations-for-2015/c-100712862',
        'https://www.mlb.com/padres/news/padres-to-build-social-space-at-petco-park/c-159008892',
        'https://www.mlb.com/press-release/release-padres-gallagher-square-renovation-5-28-23',
        'https://www.mlb.com/padres/press-release/press-release-padres-to-renovate-petco-park-s-western-metal-supply-co-building',
      ],
      notes: 'The 2014 lidar predates material geometry changes: 2015 left-field rows and overhang work, the 2016 two-level right-center social deck, the 2024 Gallagher Square terrace/deck rebuild, and the Western Metal rooftop raised deck and covered trellis completed for 2025 Opening Day.',
    },
    observationHoldout: emptyHoldout(),
    reviewedOn: '2026-08-09',
  },
  phillies: {
    stadiumId: 'phillies',
    sources: [
      {
        id: 'usgs-phillies-pa-17county-2024-2025',
        provider: 'U.S. Geological Survey 3D Elevation Program',
        method: 'public-lidar',
        sourceUrl: 'https://rockyweb.usgs.gov/vdelivery/Datasets/Staged/Elevation/LPC/Projects/PA_17County_D24/PA_17Co_5_D24/LAZ/USGS_LPC_PA_17County_D24_18SVK485417.laz',
        metadataUrl: 'https://rockyweb.usgs.gov/vdelivery/Datasets/Staged/Elevation/LPC/Projects/PA_17County_D24/PA_17Co_5_D24/metadata/USGS_LPC_PA_17County_D24_18SVK485417.xml',
        acquiredOn: '2024-12-17',
        acquiredThrough: '2025-04-02',
        discoveredOn: '2026-08-08',
        license: 'public-domain',
        coordinateReferenceSystem: 'EPSG:6347 + EPSG:5703 (metres)',
        nominalPointSpacingFt: 1.148293963,
        footprintCoveragePercent: 100,
        components: ['stadium-frame', 'row-surfaces', 'overhangs', 'upper-decks', 'scoreboards', 'facades'],
        notes: 'The official 163,167,866-byte LAZ tile has SHA-256 42736a15761cc50c8d513df50a9ff0ae34b1cfb05fc053e2b39a761216907746 and decompresses to all 28,721,465 declared points. Footprint returns come from independent survey passes on 2024-12-17 and 2025-04-02. The v2 audit retained 3,479,061 non-noise returns, found 95.60% one-foot sampling coverage and 68.36% one-foot two-flight-line coverage, and measured 0.295 ft p95 flight-line elevation disagreement on stable overlapping surfaces. Raw returns are not a semantic row or obstruction reconstruction, and the scan predates documented 2026 structural additions.',
      },
    ],
    stadiumFrame: {
      stage: 'source-located',
      measuredCoveragePercent: 0,
      horizontalUncertaintyFt: null,
      verticalUncertaintyFt: null,
      orientationUncertaintyDeg: null,
      sourceIds: ['usgs-phillies-pa-17county-2024-2025'],
      artifactVersion: 'sha256:dc460a6e0901ea91afa9a6f9ecda64ceaf054c71211ff01c9be2db321c18986f',
    },
    rowGeometry: {
      stage: 'source-located',
      measuredCoveragePercent: 0,
      horizontalUncertaintyFt: null,
      verticalUncertaintyFt: null,
      orientationUncertaintyDeg: null,
      sourceIds: ['usgs-phillies-pa-17county-2024-2025'],
      artifactVersion: 'sha256:dc460a6e0901ea91afa9a6f9ecda64ceaf054c71211ff01c9be2db321c18986f',
    },
    obstructionGeometry: {
      stage: 'source-located',
      measuredCoveragePercent: 0,
      horizontalUncertaintyFt: null,
      verticalUncertaintyFt: null,
      orientationUncertaintyDeg: null,
      sourceIds: ['usgs-phillies-pa-17county-2024-2025'],
      artifactVersion: 'sha256:dc460a6e0901ea91afa9a6f9ecda64ceaf054c71211ff01c9be2db321c18986f',
    },
    geometryCurrency: {
      stage: 'stale',
      assessedOn: '2026-08-10',
      latestKnownChangeOn: '2026-03-26',
      sourceUrls: [
        'https://www.mlb.com/amp/press-release/press-release-phillies-unveil-enhancements-to-the-fan-experience-at-citizens-bank-park-ahead-of-home-opener-and-midsummer-classic.html',
        'https://catalog.data.gov/dataset/licenses-and-inspections-building-and-zoning-permits',
        'https://www.arcgis.com/home/item.html?id=83fd50fdc0704488b58ea76e706ec0d7',
        'https://www.phila.gov/media/20250905121054/1-Citizens-Bank-Way-submission.pdf',
        'https://www.phila.gov/services/permits-violations-licenses/get-a-copy-of-a-license-permit-or-violation/',
      ],
      notes: 'The official City permit index contains 130 stadium-property records issued from 2024 through 2026-07-30, including 19 plan-review records. Work after the final LiDAR pass includes topping-slab and drain replacement at unspecified stadium locations, bullpen and dugout renovations, a completed one-story team-store addition, and an issued permanent-tent project whose public records omit the controlling dimensions. The 2025 Art Commission design package places the proposed team-store addition at the southwest exterior and labels its top at 33 feet 8.5 inches above the package plan datum, but it is not an as-built survey and does not prove its shadow envelope relative to ticket rows. The City authoritative building-footprint service supplies a current exact-address planimetric stadium candidate with height attributes, but no feature-level date, positional or height accuracy, ray-casting height semantics, interior obstructions, or overhang undersides. The 2026 club release also documents five new 25-foot LED towers that are not resolved by the design package. The reproducible current-delta audit is sha256:7a0f9beafa7c141e310e47946bc11203d0688c55c5827268acf1da40049371f1. Philadelphia restricts building-plan copies to owners or authorized agents, so every unresolved current delta remains a whole-scope obstruction blocker.',
    },
    observationHoldout: emptyHoldout(),
    reviewedOn: '2026-08-10',
  },
  whitesox: {
    stadiumId: 'whitesox',
    sources: [
      {
        id: 'cook-county-2022-ql1-lidar-rate-field',
        provider: 'Illinois State Geological Survey Illinois Height Modernization Program',
        method: 'public-lidar',
        sourceUrl: 'https://clearinghouse.isgs.illinois.edu/distribute/district1/cook/2022/cook-las5.zip',
        metadataUrl: 'https://clearinghouse.isgs.illinois.edu/distribute/district1/cook/2022/cook_TileIndex_metadata.zip',
        additionalSourceUrls: [
          'https://clearinghouse.isgs.illinois.edu/node/1879',
          'https://opendocs.cookcountyil.gov/procurement/contracts/2103-08021.pdf',
        ],
        acquiredOn: '2022-04-05',
        acquiredThrough: '2022-06-29',
        discoveredOn: '2026-08-10',
        license: 'published-for-public-access',
        coordinateReferenceSystem: 'EPSG:6455 + EPSG:6360, NAVD88 Geoid18 (U.S. survey feet)',
        nominalPointSpacingFt: 0.721785,
        footprintCoveragePercent: 100,
        components: ['stadium-frame', 'row-surfaces', 'overhangs', 'upper-decks', 'roof', 'scoreboards', 'facades'],
        notes: 'Two official LAS tiles cover the declared 1,400-by-1,400-foot footprint and contain 84,069,170 returns. Stadium-local returns were collected on 2022-04-27. The official contract reports 3.8 ft horizontal accuracy at 95% confidence and 0.6 ft fundamental vertical accuracy at 95% confidence. The horizontal value already exceeds the one-foot release gate. The stadium audit retains 9,872,093 usable returns, with 99.20% one-foot sampling coverage and 93.21% one-foot multi-flight-line coverage, but raw aerial returns do not establish semantic rows, overhang undersides, or a complete current obstruction volume. The source also predates documented 2024 through 2026 changes.',
      },
      {
        id: 'cook-county-2025-orthophoto-rate-field',
        provider: 'Cook County Geographic Information Systems',
        method: 'photogrammetry',
        sourceUrl: 'https://gis.cookcountyil.gov/imagery/rest/services/CookOrtho2025/ImageServer',
        discoveredOn: '2026-08-10',
        license: 'published-for-public-access',
        coordinateReferenceSystem: 'EPSG:6455 + NAVD88 (U.S. survey feet)',
        nominalRasterPixelSizeFt: 0.5,
        footprintCoveragePercent: 100,
        components: ['stadium-frame', 'scoreboards', 'facades'],
        notes: 'The official ImageServer supplies a 0.5-foot plan image in the LiDAR coordinate system. Its item metadata does not publish a stadium-image ground-condition date or time, independent checkpoints, or a numeric horizontal positional accuracy. The image is two-dimensional and cannot measure rows, heights, overhang undersides, or obstruction volumes.',
      },
      {
        id: 'ticketmaster-whitesox-current-provider-row-map-2026',
        provider: 'Ticketmaster',
        method: 'venue-mesh',
        sourceUrl: 'https://www.ticketmaster.com/event/04006356AD5152A0',
        discoveredOn: '2026-08-10',
        license: 'published-for-public-access',
        coordinateReferenceSystem: 'provider-local two-dimensional map pixels; not metric and not georeferenced',
        components: ['stadium-frame', 'row-surfaces'],
        notes: 'The provider map exposes 3,007 row nodes and 42,300 place anchors with 100% internal provider-coordinate coverage. The coordinates are rendering pixels, not physical measurements. Regulation-field controls establish an internal scale and axis, with a 0.824 ft mound-distance residual, but do not register the provider plan to surveyed world coordinates or supply any row elevation.',
      },
    ],
    stadiumFrame: {
      stage: 'source-located',
      measuredCoveragePercent: 0,
      horizontalUncertaintyFt: null,
      verticalUncertaintyFt: null,
      orientationUncertaintyDeg: null,
      sourceIds: [
        'cook-county-2022-ql1-lidar-rate-field',
        'cook-county-2025-orthophoto-rate-field',
        'ticketmaster-whitesox-current-provider-row-map-2026',
      ],
      artifactVersion: 'sha256:763f480bdfd8d09a250a02a51ac0679ba2c62a84f80bbbfce1954ad14d99d474',
    },
    rowGeometry: {
      stage: 'source-located',
      measuredCoveragePercent: 0,
      horizontalUncertaintyFt: null,
      verticalUncertaintyFt: null,
      orientationUncertaintyDeg: null,
      sourceIds: [
        'cook-county-2022-ql1-lidar-rate-field',
        'ticketmaster-whitesox-current-provider-row-map-2026',
      ],
      artifactVersion: 'sha256:7c53e36cf9976ca08b2385e1fc20ed9b54e8e5a0f14b296f24b1b49f67c5aa20',
    },
    obstructionGeometry: {
      stage: 'source-located',
      measuredCoveragePercent: 0,
      horizontalUncertaintyFt: null,
      verticalUncertaintyFt: null,
      orientationUncertaintyDeg: null,
      sourceIds: [
        'cook-county-2022-ql1-lidar-rate-field',
        'cook-county-2025-orthophoto-rate-field',
      ],
      artifactVersion: 'sha256:763f480bdfd8d09a250a02a51ac0679ba2c62a84f80bbbfce1954ad14d99d474',
    },
    geometryCurrency: {
      stage: 'stale',
      assessedOn: '2026-08-10',
      latestKnownChangeOn: '2026-02-25',
      sourceUrls: [
        'https://www.mlb.com/news/rate-and-white-sox-announce-rebrand-of-stadium-now-rate-field',
        'https://www.mlb.com/whitesox/press-release/press-release-white-sox-and-fanatics-announce-long-term-omnichannel-retail-partnership',
        'https://www.mlb.com/news/featured/rate-field-guide-capacity-seating-chart-parking-and-more',
        'https://www.isfauthority.com/board-committee-meetings/',
        'https://www.isfauthority.com/procurement-process/',
        'https://www.isfauthority.com/wp-content/uploads/2026/08/RFP-Backstop-and-Dugout-LED-Display-08.07.26.pdf',
      ],
      notes: 'The April 2022 LiDAR predates replacement Rate Field signage, the 2025 renovated two-level flagship store, and 2026 capital repairs. Public board records do not include the detailed capital exhibits, current metric as-builts, or the 2026 facilities assessment. The August 2026 field-level LED package describes one future home-plate display, two future dugout-lip displays, and new structural steel, with construction scheduled to start after the 2026 season. Those proposed displays are not treated as installed geometry, but they require post-installation reacquisition before any later release. No reviewed source establishes a complete current change inventory, current row treads and risers, obstruction heights and undersides, or a watertight shadow-casting volume.',
    },
    observationHoldout: emptyHoldout(),
    reviewedOn: '2026-08-10',
  },
};

export function getStadiumGeometryEvidence(stadiumId: string): StadiumGeometryEvidence {
  return STADIUM_GEOMETRY_EVIDENCE[stadiumId] ?? {
    stadiumId,
    sources: [],
    stadiumFrame: modeledMeasurement(),
    rowGeometry: modeledMeasurement(),
    obstructionGeometry: modeledMeasurement(),
    geometryCurrency: unreviewedCurrency(),
    observationHoldout: emptyHoldout(),
    reviewedOn: '2026-08-07',
  };
}

/**
 * Validate the chain of custody and the internal consistency of one park's
 * geometry record. This is deliberately stricter than the publication gate:
 * a record cannot claim a measured stage without a reproducible artifact,
 * quantified uncertainty, and resolvable source IDs.
 */
export function validateStadiumGeometryEvidence(
  evidence: StadiumGeometryEvidence,
): string[] {
  const errors: string[] = [];
  const sourceIds = new Set<string>();

  if (!evidence.stadiumId.trim()) errors.push('stadiumId is empty');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(evidence.reviewedOn)) {
    errors.push('reviewedOn must be an ISO calendar date (YYYY-MM-DD)');
  }

  for (const [index, source] of evidence.sources.entries()) {
    const path = `sources[${index}]`;
    if (!source.id.trim()) errors.push(`${path}.id is empty`);
    if (sourceIds.has(source.id)) errors.push(`${path}.id duplicates ${source.id}`);
    sourceIds.add(source.id);
    if (!source.provider.trim()) errors.push(`${path}.provider is empty`);
    if (!HTTPS_URL.test(source.sourceUrl)) errors.push(`${path}.sourceUrl must use HTTPS`);
    for (const [urlIndex, url] of (source.additionalSourceUrls ?? []).entries()) {
      if (!HTTPS_URL.test(url)) {
        errors.push(`${path}.additionalSourceUrls[${urlIndex}] must use HTTPS`);
      }
    }
    if (source.metadataUrl && !HTTPS_URL.test(source.metadataUrl)) {
      errors.push(`${path}.metadataUrl must use HTTPS`);
    }
    if (source.acquiredOn && !/^\d{4}-\d{2}-\d{2}$/.test(source.acquiredOn)) {
      errors.push(`${path}.acquiredOn must be an ISO calendar date (YYYY-MM-DD)`);
    }
    if (source.acquiredThrough && !/^\d{4}-\d{2}-\d{2}$/.test(source.acquiredThrough)) {
      errors.push(`${path}.acquiredThrough must be an ISO calendar date (YYYY-MM-DD)`);
    }
    if (
      source.acquiredOn
      && source.acquiredThrough
      && source.acquiredThrough < source.acquiredOn
    ) {
      errors.push(`${path}.acquiredThrough cannot precede acquiredOn`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(source.discoveredOn)) {
      errors.push(`${path}.discoveredOn must be an ISO calendar date (YYYY-MM-DD)`);
    }
    if (
      source.nominalPointSpacingFt !== undefined &&
      (!Number.isFinite(source.nominalPointSpacingFt) || source.nominalPointSpacingFt <= 0)
    ) {
      errors.push(`${path}.nominalPointSpacingFt must be finite and greater than zero`);
    }
    if (
      source.nominalRasterPixelSizeFt !== undefined
      && (
        !Number.isFinite(source.nominalRasterPixelSizeFt)
        || source.nominalRasterPixelSizeFt <= 0
      )
    ) {
      errors.push(`${path}.nominalRasterPixelSizeFt must be finite and greater than zero`);
    }
    if (
      source.footprintCoveragePercent !== undefined
      && (
        !Number.isFinite(source.footprintCoveragePercent)
        || source.footprintCoveragePercent < 0
        || source.footprintCoveragePercent > 100
      )
    ) {
      errors.push(`${path}.footprintCoveragePercent must be between 0 and 100`);
    }
    if (source.components.length === 0) errors.push(`${path}.components is empty`);
    if (new Set(source.components).size !== source.components.length) {
      errors.push(`${path}.components contains duplicates`);
    }
  }

  const validateMeasurement = (
    label: 'stadiumFrame' | 'rowGeometry' | 'obstructionGeometry',
    measurement: GeometryMeasurementEvidence,
  ): void => {
    if (
      !Number.isFinite(measurement.measuredCoveragePercent) ||
      measurement.measuredCoveragePercent < 0 ||
      measurement.measuredCoveragePercent > 100
    ) {
      errors.push(`${label}.measuredCoveragePercent must be between 0 and 100`);
    }

    for (const [field, value] of [
      ['horizontalUncertaintyFt', measurement.horizontalUncertaintyFt],
      ['verticalUncertaintyFt', measurement.verticalUncertaintyFt],
      ['orientationUncertaintyDeg', measurement.orientationUncertaintyDeg],
    ] as const) {
      if (value !== null && !isFiniteNonNegative(value)) {
        errors.push(`${label}.${field} must be null or finite and non-negative`);
      }
    }

    if (new Set(measurement.sourceIds).size !== measurement.sourceIds.length) {
      errors.push(`${label}.sourceIds contains duplicates`);
    }
    for (const sourceId of measurement.sourceIds) {
      if (!sourceIds.has(sourceId)) errors.push(`${label}.sourceIds references unknown source ${sourceId}`);
    }

    if (measurement.stage === 'modeled') {
      if (measurement.measuredCoveragePercent !== 0) {
        errors.push(`${label} is modeled but reports measured coverage`);
      }
      if (measurement.sourceIds.length > 0) {
        errors.push(`${label} is modeled but references measurement sources`);
      }
    } else if (measurement.sourceIds.length === 0) {
      errors.push(`${label} at ${measurement.stage} stage must reference a source`);
    }

    if (isMeasured(measurement.stage)) {
      if (!measurement.artifactVersion?.trim()) {
        errors.push(`${label} at ${measurement.stage} stage requires artifactVersion`);
      }
      if (measurement.measuredCoveragePercent <= 0) {
        errors.push(`${label} at ${measurement.stage} stage requires positive measured coverage`);
      }
      if (
        measurement.horizontalUncertaintyFt === null ||
        measurement.verticalUncertaintyFt === null ||
        measurement.orientationUncertaintyDeg === null
      ) {
        errors.push(`${label} at ${measurement.stage} stage requires quantified uncertainty`);
      }
    }
  };

  validateMeasurement('stadiumFrame', evidence.stadiumFrame);
  validateMeasurement('rowGeometry', evidence.rowGeometry);
  validateMeasurement('obstructionGeometry', evidence.obstructionGeometry);

  const currency = evidence.geometryCurrency;
  if (currency.stage === 'not-reviewed') {
    if (currency.assessedOn !== null) {
      errors.push('geometryCurrency is not-reviewed but has assessedOn');
    }
  } else {
    if (currency.assessedOn === null || !/^\d{4}-\d{2}-\d{2}$/.test(currency.assessedOn)) {
      errors.push('geometryCurrency at stale/current stage requires an ISO assessedOn date');
    }
    if (currency.sourceUrls.length === 0) {
      errors.push('geometryCurrency at stale/current stage requires source URLs');
    }
  }
  if (
    currency.latestKnownChangeOn !== null &&
    !/^\d{4}-\d{2}-\d{2}$/.test(currency.latestKnownChangeOn)
  ) {
    errors.push('geometryCurrency.latestKnownChangeOn must be null or an ISO calendar date');
  }
  if (new Set(currency.sourceUrls).size !== currency.sourceUrls.length) {
    errors.push('geometryCurrency.sourceUrls contains duplicates');
  }
  for (const url of currency.sourceUrls) {
    if (!HTTPS_URL.test(url)) errors.push('geometryCurrency.sourceUrls must use HTTPS');
  }

  const holdout = evidence.observationHoldout;
  for (const [field, value] of [
    ['observationCount', holdout.observationCount],
    ['heldOutObservationCount', holdout.heldOutObservationCount],
    ['uniqueDates', holdout.uniqueDates],
    ['solarAltitudeSpanDeg', holdout.solarAltitudeSpanDeg],
  ] as const) {
    if (!isFiniteNonNegative(value)) errors.push(`observationHoldout.${field} must be finite and non-negative`);
  }
  for (const [field, value] of [
    ['medianBoundaryErrorRows', holdout.medianBoundaryErrorRows],
    ['p95BoundaryErrorRows', holdout.p95BoundaryErrorRows],
  ] as const) {
    if (value !== null && !isFiniteNonNegative(value)) {
      errors.push(`observationHoldout.${field} must be null or finite and non-negative`);
    }
  }
  if (holdout.heldOutObservationCount > holdout.observationCount) {
    errors.push('observationHoldout.heldOutObservationCount exceeds observationCount');
  }
  if (holdout.uniqueDates > holdout.heldOutObservationCount) {
    errors.push('observationHoldout.uniqueDates exceeds heldOutObservationCount');
  }
  if (new Set(holdout.sourceUrls).size !== holdout.sourceUrls.length) {
    errors.push('observationHoldout.sourceUrls contains duplicates');
  }
  for (const url of holdout.sourceUrls) {
    if (!HTTPS_URL.test(url)) errors.push('observationHoldout.sourceUrls must use HTTPS');
  }
  if (holdout.observationCount > 0 && holdout.sourceUrls.length === 0) {
    errors.push('observationHoldout with observations must reference source URLs');
  }

  const measurementArtifactVersions = [
    evidence.stadiumFrame.artifactVersion,
    evidence.rowGeometry.artifactVersion,
    evidence.obstructionGeometry.artifactVersion,
  ];

  if (holdout.stage === 'passed') {
    const threshold = SEAT_SHADE_RELEASE_THRESHOLDS;
    if (holdout.heldOutObservationCount < threshold.heldOutObservationCount) {
      errors.push('observationHoldout is passed but held-out sample is below threshold');
    }
    if (holdout.uniqueDates < threshold.uniqueDates) {
      errors.push('observationHoldout is passed but date coverage is below threshold');
    }
    if (holdout.solarAltitudeSpanDeg < threshold.solarAltitudeSpanDeg) {
      errors.push('observationHoldout is passed but solar-altitude range is below threshold');
    }
    if (exceedsOrIsUnknown(holdout.medianBoundaryErrorRows, threshold.medianBoundaryErrorRows)) {
      errors.push('observationHoldout is passed but median boundary error is unknown or high');
    }
    if (exceedsOrIsUnknown(holdout.p95BoundaryErrorRows, threshold.p95BoundaryErrorRows)) {
      errors.push('observationHoldout is passed but p95 boundary error is unknown or high');
    }
    if (!holdout.geometryArtifactVersion?.trim()) {
      errors.push('observationHoldout is passed but has no geometry artifact version');
    } else if (measurementArtifactVersions.some((version) => version !== holdout.geometryArtifactVersion)) {
      errors.push('observationHoldout geometry artifact version does not match every measured component');
    }
  }

  return errors;
}

export function auditStadiumGeometryEvidenceRegistry(): string[] {
  return Object.entries(STADIUM_GEOMETRY_EVIDENCE).flatMap(([registryId, evidence]) => {
    const errors = validateStadiumGeometryEvidence(evidence);
    if (evidence.stadiumId !== registryId) {
      errors.unshift(`registry key ${registryId} does not match stadiumId ${evidence.stadiumId}`);
    }
    return errors.map((error) => `${registryId}: ${error}`);
  });
}

const exceedsOrIsUnknown = (value: number | null, maximum: number): boolean =>
  value === null || value > maximum;

export function evaluateGeometryForSeatShade(
  evidence: StadiumGeometryEvidence,
): GeometryPublicationEvaluation {
  const blockers: GeometryPublicationBlocker[] = [];
  const threshold = SEAT_SHADE_RELEASE_THRESHOLDS;

  if (!isMeasured(evidence.stadiumFrame.stage)) blockers.push('NO_METRIC_STADIUM_FRAME');
  if (evidence.stadiumFrame.measuredCoveragePercent < threshold.measuredCoveragePercent) {
    blockers.push('STADIUM_FRAME_COVERAGE_INCOMPLETE');
  }
  if (!isMeasured(evidence.rowGeometry.stage)) blockers.push('ROW_GEOMETRY_NOT_MEASURED');
  if (evidence.rowGeometry.measuredCoveragePercent < threshold.measuredCoveragePercent) {
    blockers.push('ROW_GEOMETRY_COVERAGE_INCOMPLETE');
  }
  if (!isMeasured(evidence.obstructionGeometry.stage)) {
    blockers.push('OBSTRUCTION_GEOMETRY_NOT_MEASURED');
  }
  if (evidence.obstructionGeometry.measuredCoveragePercent < threshold.measuredCoveragePercent) {
    blockers.push('OBSTRUCTION_GEOMETRY_COVERAGE_INCOMPLETE');
  }

  const measurements = [evidence.stadiumFrame, evidence.rowGeometry, evidence.obstructionGeometry];
  if (measurements.some((item) => exceedsOrIsUnknown(item.horizontalUncertaintyFt, threshold.horizontalUncertaintyFt))) {
    blockers.push('HORIZONTAL_UNCERTAINTY_UNKNOWN_OR_HIGH');
  }
  if (measurements.some((item) => exceedsOrIsUnknown(item.verticalUncertaintyFt, threshold.verticalUncertaintyFt))) {
    blockers.push('VERTICAL_UNCERTAINTY_UNKNOWN_OR_HIGH');
  }
  if (measurements.some((item) => exceedsOrIsUnknown(item.orientationUncertaintyDeg, threshold.orientationUncertaintyDeg))) {
    blockers.push('ORIENTATION_UNCERTAINTY_UNKNOWN_OR_HIGH');
  }

  if (evidence.geometryCurrency.stage === 'stale') {
    blockers.push('GEOMETRY_SOURCE_STALE');
  } else if (evidence.geometryCurrency.stage !== 'current') {
    blockers.push('GEOMETRY_CURRENCY_NOT_VERIFIED');
  }

  const holdout = evidence.observationHoldout;
  if (holdout.stage !== 'passed') blockers.push('OBSERVATION_HOLDOUT_NOT_PASSED');
  if (holdout.heldOutObservationCount < threshold.heldOutObservationCount) {
    blockers.push('OBSERVATION_HOLDOUT_TOO_SMALL');
  }
  if (holdout.uniqueDates < threshold.uniqueDates) blockers.push('OBSERVATION_DATE_COVERAGE_TOO_SMALL');
  if (holdout.solarAltitudeSpanDeg < threshold.solarAltitudeSpanDeg) {
    blockers.push('OBSERVATION_SOLAR_RANGE_TOO_SMALL');
  }
  if (exceedsOrIsUnknown(holdout.medianBoundaryErrorRows, threshold.medianBoundaryErrorRows)) {
    blockers.push('OBSERVED_MEDIAN_ERROR_UNKNOWN_OR_HIGH');
  }
  if (exceedsOrIsUnknown(holdout.p95BoundaryErrorRows, threshold.p95BoundaryErrorRows)) {
    blockers.push('OBSERVED_P95_ERROR_UNKNOWN_OR_HIGH');
  }
  const artifactVersion = holdout.geometryArtifactVersion;
  if (
    !artifactVersion ||
    [evidence.stadiumFrame, evidence.rowGeometry, evidence.obstructionGeometry]
      .some((measurement) => measurement.artifactVersion !== artifactVersion)
  ) {
    blockers.push('OBSERVATION_GEOMETRY_VERSION_MISMATCH');
  }

  return { publishable: blockers.length === 0, blockers };
}
