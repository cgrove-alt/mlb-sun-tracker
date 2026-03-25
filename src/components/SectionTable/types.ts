export interface ShadeSectionRow {
  sectionId: string;
  name: string;
  level: 'field' | 'lower' | 'club' | 'upper' | 'suite';
  covered: boolean;
  avgExposure: number;
  shadeScore: number;
  overallStatus: 'full-shade' | 'partial-shade' | 'full-sun';
  atFirstPitch: number;
  atFirstPitchShadeScore: number;
  timeline: Array<{ offsetMinutes: number; sunExposurePct: number }>;
}

export type SortField = 'name' | 'level' | 'shadeScore' | 'atFirstPitch';
export type SortDir = 'asc' | 'desc';

export interface FilterState {
  levels: string[];
  coveredOnly: boolean;
  minShadeScore: number;
}
