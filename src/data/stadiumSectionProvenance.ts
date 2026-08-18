export type SectionSourceKind =
  | 'official-static-chart'
  | 'club-linked-3d-map'
  | 'club-linked-virtual-venue'
  | 'existing-hand-authored-map';

export interface StadiumSectionProvenance {
  stadiumId: string;
  sourceKind: SectionSourceKind;
  /** MLB club page that publishes or links the seating map. */
  officialUrl: string;
  /** Public map asset used for polygon extraction, when applicable. */
  geometryUrl?: string;
  /** Additional official inventories needed when one chart omits premium products. */
  supplementalUrls?: readonly string[];
  sectionIdentity: 'source-backed';
  rowGeometry: 'modeled';
  /** Whether every currently published product has been reconciled into the calculator. */
  inventoryStatus: 'reconciled' | 'partial';
  currentInventoryCount?: number;
  sourceProductCount?: number;
  directMapCoordinateCount?: number;
  inventoryNotes?: string;
  reviewedOn: string;
}

type StadiumSectionProvenanceInput = Omit<StadiumSectionProvenance, 'inventoryStatus'> & {
  inventoryStatus?: StadiumSectionProvenance['inventoryStatus'];
};

const reviewedOn = '2026-08-07';

/**
 * Provenance for every MLB section dataset. Public charts establish section
 * identity and ordering. Map-screen positions are not surveyed coordinates;
 * row elevations, rake, 3-D bowl depth and obstruction geometry remain
 * calculator assumptions until remote measurement and independent shadow
 * observation validation pass.
 */
const STADIUM_SECTION_PROVENANCE_INPUT: Record<string, StadiumSectionProvenanceInput> = {
  angels: { stadiumId: 'angels', sourceKind: 'club-linked-3d-map', officialUrl: 'https://www.mlb.com/angels/tickets/seating-map/3d', geometryUrl: 'https://venues.3ddigitalvenue.com/angel-stadium-test', supplementalUrls: ['https://www.mlb.com/angels/ballpark/accessibility-guide', 'https://mktg.mlbstatic.com/angels/downloads/y2023/sun_and_shade_map.pdf'], sectionIdentity: 'source-backed', rowGeometry: 'modeled', inventoryNotes: 'The club-published sun-and-shade map is retained as categorical context only. It labels broad shaded, partial-sun, and direct-sun areas and warns that conditions vary by time and season; it is not timestamped row-boundary evidence and cannot unlock exact results.', reviewedOn: '2026-08-08' },
  astros: { stadiumId: 'astros', sourceKind: 'club-linked-3d-map', officialUrl: 'https://www.mlb.com/astros/ballpark/seat-map', geometryUrl: 'https://venues.3ddigitalvenue.com/houston-astros', sectionIdentity: 'source-backed', rowGeometry: 'modeled', reviewedOn },
  athletics: { stadiumId: 'athletics', sourceKind: 'official-static-chart', officialUrl: 'https://www.mlb.com/athletics/ballpark/seating-map', geometryUrl: 'https://img.mlbstatic.com/mlb-images/image/upload/t_1x1/t_w1536/mlb/raij1dhxzwdixvuudkxz.jpg', sectionIdentity: 'source-backed', rowGeometry: 'modeled', reviewedOn },
  bluejays: { stadiumId: 'bluejays', sourceKind: 'official-static-chart', officialUrl: 'https://www.mlb.com/bluejays/ballpark/seating-map', geometryUrl: 'https://mktg.mlbstatic.com/bluejays/downloads/pdfs/y2026/Rogers-Centre-Seating-Map-2026.pdf', sectionIdentity: 'source-backed', rowGeometry: 'modeled', reviewedOn },
  braves: { stadiumId: 'braves', sourceKind: 'club-linked-virtual-venue', officialUrl: 'https://www.mlb.com/braves/ballpark/information/guide', geometryUrl: 'https://braves.io-media.com/web/index.html', sectionIdentity: 'source-backed', rowGeometry: 'modeled', reviewedOn },
  brewers: { stadiumId: 'brewers', sourceKind: 'club-linked-3d-map', officialUrl: 'https://www.mlb.com/brewers/ballpark/seat-map', geometryUrl: 'https://venues.3ddigitalvenue.com/milwaukee-brewers', sectionIdentity: 'source-backed', rowGeometry: 'modeled', reviewedOn },
  cardinals: { stadiumId: 'cardinals', sourceKind: 'club-linked-3d-map', officialUrl: 'https://www.mlb.com/cardinals/ballpark/seat-map/3d', geometryUrl: 'https://venues.3ddigitalvenue.com/stlouis-cardinals', sectionIdentity: 'source-backed', rowGeometry: 'modeled', reviewedOn },
  cubs: { stadiumId: 'cubs', sourceKind: 'club-linked-3d-map', officialUrl: 'https://www.mlb.com/cubs/ballpark/renumbering', geometryUrl: 'https://venues.3ddigitalvenue.com/chicago-cubs', sectionIdentity: 'source-backed', rowGeometry: 'modeled', reviewedOn },
  diamondbacks: { stadiumId: 'diamondbacks', sourceKind: 'club-linked-virtual-venue', officialUrl: 'https://www.mlb.com/dbacks/ballpark/information/seating-map', geometryUrl: 'https://dbacks.io-media.com/web/index.html', sectionIdentity: 'source-backed', rowGeometry: 'modeled', reviewedOn },
  dodgers: { stadiumId: 'dodgers', sourceKind: 'club-linked-3d-map', officialUrl: 'https://www.mlb.com/dodgers/ballpark', geometryUrl: 'https://venues.3ddigitalvenue.com/dodgers', sectionIdentity: 'source-backed', rowGeometry: 'modeled', reviewedOn },
  giants: { stadiumId: 'giants', sourceKind: 'official-static-chart', officialUrl: 'https://www.mlb.com/giants/ballpark/seat-map', geometryUrl: 'https://img.mlbstatic.com/mlb-images/image/upload/t_w1536/mlb/hihrflquikcc7wol3oea.jpg', sectionIdentity: 'source-backed', rowGeometry: 'modeled', reviewedOn },
  guardians: { stadiumId: 'guardians', sourceKind: 'club-linked-3d-map', officialUrl: 'https://www.mlb.com/guardians/ballpark/seating-map', geometryUrl: 'https://venues.3ddigitalvenue.com/progressive-field-guardians', sectionIdentity: 'source-backed', rowGeometry: 'modeled', reviewedOn },
  mariners: { stadiumId: 'mariners', sourceKind: 'club-linked-virtual-venue', officialUrl: 'https://www.mlb.com/mariners/ballpark/seat-map', geometryUrl: 'https://mariners.io-media.com/web/index.html', sectionIdentity: 'source-backed', rowGeometry: 'modeled', reviewedOn },
  marlins: { stadiumId: 'marlins', sourceKind: 'club-linked-3d-map', officialUrl: 'https://www.mlb.com/marlins/ballpark/seating-map/3d', geometryUrl: 'https://venues.3ddigitalvenue.com/marlins?iframeMode=true', sectionIdentity: 'source-backed', rowGeometry: 'modeled', reviewedOn },
  mets: { stadiumId: 'mets', sourceKind: 'club-linked-3d-map', officialUrl: 'https://www.mlb.com/mets/ballpark/seat-map', geometryUrl: 'https://venues.3ddigitalvenue.com/citifield-mets', sectionIdentity: 'source-backed', rowGeometry: 'modeled', reviewedOn },
  nationals: { stadiumId: 'nationals', sourceKind: 'club-linked-3d-map', officialUrl: 'https://www.mlb.com/nationals/ballpark/seating-map/3d', geometryUrl: 'https://3ddigitalvenue.com/3dmap/clients/washington-nationals/', sectionIdentity: 'source-backed', rowGeometry: 'modeled', reviewedOn },
  orioles: { stadiumId: 'orioles', sourceKind: 'club-linked-3d-map', officialUrl: 'https://www.mlb.com/orioles/ballpark/seating-map', geometryUrl: 'https://venues.3ddigitalvenue.com/oriole-park', sectionIdentity: 'source-backed', rowGeometry: 'modeled', reviewedOn },
  padres: { stadiumId: 'padres', sourceKind: 'official-static-chart', officialUrl: 'https://www.mlb.com/padres/ballpark/seat-map', geometryUrl: 'https://img.mlbstatic.com/mlb-images/image/upload/t_w2208/mlb/jtnzttdb325fuy5ojnxq.jpg', supplementalUrls: ['https://mktg.mlbstatic.com/padres/documents/y2026/suites_map.pdf', 'https://mktg.mlbstatic.com/padres/documents/y2026/2026_HospitalitySpaces_Map.pdf', 'https://www.mlb.com/padres/tickets/premium/hospitality', 'https://www.mlb.com/padres/tickets/specials/barkyard'], sectionIdentity: 'source-backed', rowGeometry: 'modeled', currentInventoryCount: 194, sourceProductCount: 194, inventoryNotes: 'The current 2026 seating chart, dedicated suite map, hospitality map/page, and year-round Barkyard page reconcile 109 bowl/Field VIP products, 73 permanent suite products, 11 hospitality spaces, and the Barkyard. Obsolete 136 and 224 were removed, 313 was restored, and event-specific suite availability was not imported.', reviewedOn },
  phillies: { stadiumId: 'phillies', sourceKind: 'club-linked-3d-map', officialUrl: 'https://www.mlb.com/phillies/tickets/seating-map', geometryUrl: 'https://map.3ddigitalvenue.com/philadelphia-phillies', sectionIdentity: 'source-backed', rowGeometry: 'modeled', reviewedOn },
  pirates: { stadiumId: 'pirates', sourceKind: 'club-linked-3d-map', officialUrl: 'https://www.mlb.com/pirates/ballpark/seating-map/3d', geometryUrl: 'https://venues.3ddigitalvenue.com/pittsburgh-pirates', sectionIdentity: 'source-backed', rowGeometry: 'modeled', reviewedOn },
  rangers: { stadiumId: 'rangers', sourceKind: 'club-linked-3d-map', officialUrl: 'https://www.mlb.com/rangers/ballpark/seat-map', geometryUrl: 'https://preview.3ddigitalvenue.com/texas-rangers', sectionIdentity: 'source-backed', rowGeometry: 'modeled', reviewedOn },
  rays: { stadiumId: 'rays', sourceKind: 'club-linked-3d-map', officialUrl: 'https://www.mlb.com/rays/ballpark/information/seating-map', geometryUrl: 'https://map.3ddigitalvenue.com/tropicana-field-rays', sectionIdentity: 'source-backed', rowGeometry: 'modeled', reviewedOn },
  reds: { stadiumId: 'reds', sourceKind: 'club-linked-3d-map', officialUrl: 'https://www.mlb.com/reds/ballpark/netting', geometryUrl: 'https://venues.3ddigitalvenue.com/great-american-reds', sectionIdentity: 'source-backed', rowGeometry: 'modeled', reviewedOn },
  redsox: { stadiumId: 'redsox', sourceKind: 'club-linked-3d-map', officialUrl: 'https://www.mlb.com/redsox/ballpark/seat-map', geometryUrl: 'https://3ddigitalvenue.com/3dmap/clients/fenway-park-redsox/', sectionIdentity: 'source-backed', rowGeometry: 'modeled', currentInventoryCount: 483, sourceProductCount: 483, directMapCoordinateCount: 401, inventoryNotes: 'All 483 live ticket products are represented. 401 have direct product polygons; 82 Dugout Box/Field Box Club subdivisions reuse the matching published Field Box screen footprint. Fifteen non-ticket navigation/interior SVG overlays are excluded.', reviewedOn },
  rockies: { stadiumId: 'rockies', sourceKind: 'club-linked-3d-map', officialUrl: 'https://www.mlb.com/rockies/ballpark/seat-viewer', geometryUrl: 'https://rockies.sportsdigita.com/rockies.html', sectionIdentity: 'source-backed', rowGeometry: 'modeled', reviewedOn },
  royals: { stadiumId: 'royals', sourceKind: 'club-linked-3d-map', officialUrl: 'https://www.mlb.com/royals/ballpark/seating-map', geometryUrl: 'https://venues.3ddigitalvenue.com/kcroyals', sectionIdentity: 'source-backed', rowGeometry: 'modeled', reviewedOn },
  tigers: { stadiumId: 'tigers', sourceKind: 'club-linked-3d-map', officialUrl: 'https://www.mlb.com/tigers/ballpark/seat-map', geometryUrl: 'https://preview.3ddigitalvenue.com/detroit-tigers', sectionIdentity: 'source-backed', rowGeometry: 'modeled', reviewedOn },
  twins: { stadiumId: 'twins', sourceKind: 'club-linked-3d-map', officialUrl: 'https://www.mlb.com/twins/ballpark/seat-map/3d', geometryUrl: 'https://venues.3ddigitalvenue.com/minnesota-twins/?iframe=true', sectionIdentity: 'source-backed', rowGeometry: 'modeled', reviewedOn },
  whitesox: { stadiumId: 'whitesox', sourceKind: 'official-static-chart', officialUrl: 'https://www.mlb.com/whitesox/ballpark/seat-map', geometryUrl: 'https://img.mlbstatic.com/mlb-images/image/upload/t_w1536/mlb/hoxnaoogopiib3lffcpx.gif', sectionIdentity: 'source-backed', rowGeometry: 'modeled', currentInventoryCount: 132, sourceProductCount: 132, inventoryNotes: 'The numbered sections and seven named seating products on the official 2026 chart are represented; legacy acronyms and invented per-section Scout IDs were removed.', reviewedOn },
  yankees: { stadiumId: 'yankees', sourceKind: 'club-linked-virtual-venue', officialUrl: 'https://www.mlb.com/yankees/tickets/season-tickets/holders', geometryUrl: 'https://yankees.io-media.com/web/index.html', sectionIdentity: 'source-backed', rowGeometry: 'modeled', currentInventoryCount: 222, sourceProductCount: 222, directMapCoordinateCount: 222, inventoryNotes: 'All live zero-padded, accessibility, and standing product IDs are preserved without normalization onto the obsolete 184-entry hand map.', reviewedOn },
};

export const STADIUM_SECTION_PROVENANCE: Record<string, StadiumSectionProvenance> =
  Object.fromEntries(Object.entries(STADIUM_SECTION_PROVENANCE_INPUT).map(([stadiumId, provenance]) => [
    stadiumId,
    { inventoryStatus: 'reconciled', ...provenance },
  ]));

export const MLB_UNRESOLVED_SECTION_INVENTORIES = Object.values(STADIUM_SECTION_PROVENANCE)
  .filter((provenance) => provenance.inventoryStatus === 'partial');

export function getStadiumSectionProvenance(stadiumId: string): StadiumSectionProvenance | null {
  return STADIUM_SECTION_PROVENANCE[stadiumId] ?? null;
}
