import {
  getStadiumSectionProvenance,
  type SectionSourceKind,
} from './stadiumSectionProvenance';
import {
  STADIUM_GEOMETRY_EVIDENCE,
  evaluateGeometryForSeatShade,
  getStadiumGeometryEvidence,
  type GeometryEvidenceStage,
  type GeometryPublicationBlocker,
  type ObservationValidationStage,
} from './stadiumGeometryEvidence';

export type HorizontalPlacementConfidence =
  | 'screen-map-projected'
  | 'chart-order-modeled'
  | 'hand-authored-model'
  | 'modeled';

export type PublicShadeStatus =
  | 'verified-shaded'
  | 'verified-sun'
  | 'uncertain'
  | 'roof-state-dependent';

export interface StadiumShadeConfidence {
  stadiumId: string;
  sectionIdentity: 'source-backed' | 'modeled';
  sectionInventory: 'reconciled' | 'partial' | 'modeled';
  horizontalPlacement: HorizontalPlacementConfidence;
  rowGeometry: GeometryEvidenceStage;
  obstructionGeometry: GeometryEvidenceStage | 'park-authored' | 'generic-model';
  observationValidation: ObservationValidationStage;
  publicationBlockers: readonly ShadePublicationBlocker[];
  /** @deprecated Kept for API compatibility; remote observations can satisfy it. */
  fieldValidation: 'validated' | 'unvalidated';
  reviewedOn: string | null;
}

export type ShadePublicationBlocker = GeometryPublicationBlocker | 'SECTION_INVENTORY_NOT_RECONCILED';

function horizontalPlacementFor(sourceKind: SectionSourceKind | undefined): HorizontalPlacementConfidence {
  switch (sourceKind) {
    case 'club-linked-3d-map':
    case 'club-linked-virtual-venue':
      return 'screen-map-projected';
    case 'official-static-chart':
      return 'chart-order-modeled';
    case 'existing-hand-authored-map':
      return 'hand-authored-model';
    default:
      return 'modeled';
  }
}

/**
 * Field-by-field trust metadata for MLB shade calculations.
 *
 * This deliberately does not collapse an official section inventory into a
 * blanket "real data" label. A park may have source-backed section names while
 * its row elevations, overhangs and obstruction mesh remain modeled.
 */
export function getStadiumShadeConfidence(stadiumId: string): StadiumShadeConfidence {
  const provenance = getStadiumSectionProvenance(stadiumId);
  const evidence = getStadiumGeometryEvidence(stadiumId);
  const geometryEvaluation = evaluateGeometryForSeatShade(evidence);
  const inventoryReconciled = provenance?.inventoryStatus === 'reconciled';
  const publicationBlockers: ShadePublicationBlocker[] = [
    ...(inventoryReconciled ? [] : ['SECTION_INVENTORY_NOT_RECONCILED' as const]),
    ...geometryEvaluation.blockers,
  ];
  const validated = publicationBlockers.length === 0;

  return {
    stadiumId,
    sectionIdentity: provenance ? 'source-backed' : 'modeled',
    sectionInventory: provenance?.inventoryStatus ?? 'modeled',
    horizontalPlacement: horizontalPlacementFor(provenance?.sourceKind),
    rowGeometry: evidence.rowGeometry.stage,
    obstructionGeometry: evidence.obstructionGeometry.stage === 'modeled'
      ? 'generic-model'
      : evidence.obstructionGeometry.stage,
    observationValidation: evidence.observationHoldout.stage,
    publicationBlockers,
    fieldValidation: validated ? 'validated' : 'unvalidated',
    reviewedOn: evidence.sources.length > 0 ? evidence.reviewedOn : provenance?.reviewedOn ?? null,
  };
}

export function canPublishSeatLevelShade(stadiumId: string): boolean {
  const confidence = getStadiumShadeConfidence(stadiumId);
  return confidence.publicationBlockers.length === 0;
}

/**
 * @deprecated The name survives for compatibility with existing API clients.
 * Membership is derived from evidence and is not a manual allowlist. Remote
 * metric reconstruction plus a passing observation holdout can qualify.
 */
export const FIELD_VALIDATED_SHADE_STADIUMS: ReadonlySet<string> = new Set(
  Object.keys(STADIUM_GEOMETRY_EVIDENCE).filter(canPublishSeatLevelShade),
);

export function publicShadeStatus(input: {
  stadiumId: string;
  roof?: string;
  sunAboveHorizon: boolean;
}): PublicShadeStatus {
  if (!input.sunAboveHorizon || input.roof === 'fixed') return 'verified-shaded';
  if (input.roof === 'retractable') return 'roof-state-dependent';
  if (!canPublishSeatLevelShade(input.stadiumId)) return 'uncertain';

  // A surveyed park can eventually classify a particular ray as verified-sun
  // or verified-shaded. This park-level helper cannot choose between them
  // without that ray result, so callers must still remain conservative.
  return 'uncertain';
}

export const UNVALIDATED_SHADE_NOTICE =
  'Section identities come from published seating maps. Exact row or seat shade recommendations remain paused until metric row and obstruction geometry is reconstructed with quantified uncertainty and passes an independent time-stamped shadow-observation holdout. That validation can be completed remotely; an on-site visit is not required.';
