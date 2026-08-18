import type { ChartSectionMeta, ChartSectionPoint, SectionCoverage } from './parkSectionBuilder';

type Level = ChartSectionMeta['level'];
type Classifier = (id: string, point?: ChartSectionPoint) => ChartSectionMeta | null;

const section = (level: Level, coverage: SectionCoverage = 'none', name?: string): ChartSectionMeta => ({
  level,
  coverage,
  name,
});

const numberAtStart = (id: string): number | null => {
  const match = id.match(/^\d+/);
  return match ? Number(match[0]) : null;
};

const numericTier = (
  id: string,
  tiers: readonly [maximum: number, level: Level, coverage?: SectionCoverage][],
): ChartSectionMeta | null => {
  const value = numberAtStart(id);
  if (value === null) return null;
  const tier = tiers.find(([maximum]) => value <= maximum);
  return tier ? section(tier[1], tier[2]) : null;
};

export const classifyAngelsSection: Classifier = (id) => {
  if (/^STE/.test(id)) return section('suite', 'full');
  if (/^LGNDS/.test(id)) return section('club', 'full');

  const value = numberAtStart(id);
  if (value === null) return section('standing');
  if (value < 200) return section('field');
  if (value < 236) return section('lower', 'partial');
  if (value < 300) return section('lower');
  if (value < 400) return section('club', 'partial');
  if (value < 500) return section('upper', 'partial');
  return section('upper');
};

export const classifyAstrosSection: Classifier = (id) => {
  if (/^STE/.test(id)) return section('suite', 'full');
  if (/^(AA|[A-F]|7[0-5]|BATEBX)$/.test(id)) return section('field');
  if (/CLB|GALCLB|UCP/.test(id)) return section('club', 'full');
  const numeric = numericTier(id, [[199, 'lower', 'partial'], [299, 'club', 'partial'], [499, 'upper']]);
  return numeric ?? section('standing');
};

export const classifyBrewersSection: Classifier = (id) => {
  if (/CLB|NMLC/.test(id)) return section('club', 'full');
  const numeric = numericTier(id, [[199, 'lower', 'partial'], [299, 'club', 'partial'], [399, 'club', 'partial'], [499, 'upper']]);
  return numeric ?? section('standing');
};

export const classifyBravesSection: Classifier = (id) => {
  if (/^\d+T\d+$/.test(id)) return section('standing');
  if (/^\d+B\d+$/.test(id)) return section('suite');

  const numeric = numericTier(id, [
    [42, 'field'],
    [199, 'lower'],
    [299, 'club'],
    [399, 'upper'],
    [499, 'upper'],
  ]);
  return numeric ?? section('standing');
};

export const classifyCardinalsSection: Classifier = (id) => {
  if (/^S\d+$|^703/.test(id)) return section('suite', 'full');
  if (/^(CH|MVP|CCD|COM|VIPO|HOFO|CLKO|BET|RST)/.test(id)) return section('club', 'full');

  const numeric = numericTier(id, [
    [99, 'field'],
    [199, 'lower', 'partial'],
    [299, 'club', 'partial'],
    [399, 'club', 'partial'],
    [499, 'upper'],
  ]);
  return numeric ?? section('standing');
};

export const classifyCubsSection: Classifier = (id) => {
  if (/^A\d+/.test(id)) return section('field');
  if (/^[1-9]$|^[12]\d$|^3[0-2]$/.test(id)) return section('field');
  if (/^1\d\d$/.test(id)) return section('lower', 'partial');
  if (/^2\d\d$/.test(id)) return section('lower', 'partial');
  if (/^3\d\d[LR]$/.test(id)) return section('club', 'partial');
  if (/^4\d\d[LR]$/.test(id)) return section('upper');
  if (/^5\d\d$/.test(id)) return section('lower');
  return section('standing');
};

export const classifyDodgersSection: Classifier = (id) => {
  if (/^STE/.test(id)) return section('suite', 'full');
  if (/DG$|FD$/.test(id)) return section('field');
  if (/LG$/.test(id)) return section('lower', 'partial');
  if (/CL$/.test(id)) return section('club', 'partial');
  if (/RS$|TD$/.test(id)) return section('upper');
  if (/BL$|PL$|PR$/.test(id)) return section('lower');
  if (/^(OWNERS|CL\d|SCB\d)/.test(id)) return section('club', 'full');
  return section('standing');
};

export const classifyDiamondbacksSection: Classifier = (id) => {
  if (/^[A-S]$/.test(id)) return section('field');
  const numeric = numericTier(id, [
    [199, 'lower'],
    [299, 'club'],
    [399, 'upper'],
  ]);
  return numeric ?? section('standing');
};

export const classifyGuardiansSection: Classifier = (id) => {
  if (/^STE/.test(id)) return section('suite', 'full');
  if (/^(HPBOX|PC|CC|CLNG)/.test(id)) return section('club', 'full');
  const numeric = numericTier(id, [[199, 'lower', 'partial'], [399, 'club', 'partial'], [599, 'upper'], [1999, 'standing']]);
  return numeric ?? section('standing');
};

export const classifyMarlinsSection: Classifier = (id) => {
  if (/^SUITE/.test(id)) return section('suite', 'full');
  if (/^FL\d+/.test(id)) return section('field');
  if (/^FS/.test(id)) return section('club', 'full');

  const sectionMatch = id.match(/^SEC(\d+)/);
  if (sectionMatch) {
    const value = Number(sectionMatch[1]);
    if (value < 200) return section('field');
    if (value < 300) return section('club', 'partial');
    return section('upper');
  }
  return section('standing');
};

export const classifyMarinersSection: Classifier = (id) => {
  if (/^(?:SRO\d+|Edgars-HR-Porch|Hit-It-Here-Terrace|Power-Alley|Rooftop-Boardwalk|Trident-Deck)$/.test(id)) {
    return section('standing');
  }
  if (/^PL\d+$/.test(id)) return section('club');
  const numeric = numericTier(id, [
    [99, 'field'],
    [199, 'lower'],
    [299, 'club'],
    [399, 'upper'],
  ]);
  return numeric ?? section('standing');
};

export const classifyMetsSection: Classifier = (id) => {
  if (/^SRO/.test(id)) return section('standing');
  if (/^(CADI|ECLUB|COORS)/.test(id)) return section('club', 'full');
  if (/^(AA|HH|[A-H])$/.test(id)) return section('field');
  const value = numberAtStart(id);
  if (value !== null && value < 100) return section('field');
  const numeric = numericTier(id, [[199, 'lower', 'partial'], [299, 'club', 'partial'], [399, 'club', 'partial'], [599, 'upper']]);
  return numeric ?? section('standing');
};

export const classifyNationalsSection: Classifier = (id) => {
  if (/^SUITE/.test(id)) return section('suite', 'full');
  if (/^(?:[A-E]|DC\d|HP\d)/.test(id)) return section('field');
  if (/^(?:CB|GG|KST|SSS|WASH|DCPATIO|DCT)/.test(id)) return section('club', 'full');

  const numeric = numericTier(id, [
    [199, 'lower', 'partial'],
    [299, 'club', 'partial'],
    [399, 'upper', 'partial'],
    [499, 'upper'],
  ]);
  return numeric ?? section('standing');
};

export const classifyOriolesSection: Classifier = (id) => {
  if (/^STE|^S\d/.test(id)) return section('suite', 'full');
  if (/^C\d/.test(id)) return section('club', 'partial');
  const numeric = numericTier(id, [[99, 'lower', 'partial'], [299, 'club', 'partial'], [399, 'upper']]);
  return numeric ?? section('standing');
};

export const classifyPhilliesSection: Classifier = (id) => {
  if (/^STANDING|^RB/.test(id)) return section('standing');
  if (/^DUG|^[A-G]$/.test(id)) return section('field');
  const value = numberAtStart(id);
  if (value !== null && value < 100) return section('suite', 'full');
  const numeric = numericTier(id, [[199, 'lower', 'partial'], [299, 'club', 'partial'], [499, 'upper']]);
  return numeric ?? section('standing');
};

export const classifyPiratesSection: Classifier = (id) => {
  if (/^LUX|^PS19/.test(id)) return section('suite', 'full');
  if (/^(VIP|LUX[A-D])$/.test(id)) return section('club', 'full');
  const numeric = numericTier(id, [[32, 'field'], [199, 'lower', 'partial'], [299, 'club', 'partial'], [399, 'upper']]);
  return numeric ?? section('standing');
};

export const classifyRangersSection: Classifier = (id) => {
  if (/^(LS|PS|HOFS|HFS|SB)/.test(id)) return section('suite', 'full');
  if (/^(CS|DCLUB)/.test(id)) return section('club', 'full');
  if (/^FS/.test(id)) return section('field');
  const numeric = numericTier(id, [[33, 'field'], [199, 'lower', 'partial'], [299, 'club', 'partial'], [399, 'upper']]);
  return numeric ?? section('standing');
};

export const classifyRaysSection: Classifier = (id) => {
  let level: Level = 'standing';
  if (/^S(?:\d|[A-Z])/.test(id)) level = 'suite';
  else if (/^HPBX/.test(id)) level = 'field';
  else if (/^HPC|^CLUB/.test(id)) level = 'club';
  else if (/^L\d/.test(id)) level = 'lower';
  else {
    const numeric = numberAtStart(id);
    if (numeric !== null) level = numeric < 200 ? 'lower' : numeric < 300 ? 'club' : 'upper';
  }
  // Tropicana Field's permanent opaque roof covers every seating product.
  return section(level, 'full');
};

export const classifyRedsSection: Classifier = (id) => {
  if (/^STE/.test(id)) return section('suite', 'full');
  if (/CLUB|CAMBRIA|PRESSCLUB/.test(id)) return section('club', 'full');
  const numeric = numericTier(id, [[25, 'field'], [199, 'lower', 'partial'], [299, 'club', 'partial'], [399, 'club', 'partial'], [599, 'upper']]);
  return numeric ?? section('standing');
};

export const classifyRockiesSection: Classifier = (id, point) => {
  if (point?.sourceLayer === 'suites') return section('suite');
  if (point?.sourceLayer === 'clubs') return section('club');
  if (/^[LU]\d+$/.test(id)) return section('upper');

  const numeric = numericTier(id, [
    [199, 'lower'],
    [299, 'club'],
    [499, 'upper'],
  ]);
  return numeric ?? section('standing');
};

export const classifyRoyalsSection: Classifier = (id) => {
  if (/^STE/.test(id)) return section('suite', 'full');
  if (/^(DC|CROWN|DUGST|HOFST)/.test(id)) return section('club', 'full');
  const numeric = numericTier(id, [[199, 'lower', 'partial'], [299, 'club', 'partial'], [399, 'club', 'partial'], [499, 'upper']]);
  return numeric ?? section('standing');
};

export const classifyTigersSection: Classifier = (id) => {
  if (/^ST\d/.test(id)) return section('suite', 'full');
  if (/^(TD|HPC|P\d)/.test(id)) return section('club', 'full');
  if (/^L\d/.test(id)) return section('lower', 'partial');
  const numeric = numericTier(id, [[199, 'lower', 'partial'], [299, 'club', 'partial'], [399, 'upper']]);
  return numeric ?? section('standing');
};

export const classifyTwinsSection: Classifier = (id) => {
  if (/^ES[A-H]$/.test(id)) return section('suite', 'full');
  if (/^[A-HJ-NP-V]$/.test(id)) return section('club', 'partial');
  if (/^(?:DELTASTE|SBPDEK|DOCK|328SRO)$/.test(id)) return section('standing');

  const numeric = numericTier(id, [
    [17, 'field'],
    [199, 'lower', 'partial'],
    [299, 'club', 'partial'],
    [399, 'upper'],
  ]);
  return numeric ?? section('standing');
};

export const classifyRedSoxSection: Classifier = (id) => {
  if (/^(?:SB|SK|SL|SR\d)/.test(id)) return section('suite');
  if (/^(?:AC|AP|DTC|PB)/.test(id) || /^(?:DTCB|JBDBX)$/.test(id)) return section('club');
  if (/^(?:F|D\d|H\d)/.test(id)) return section('field');
  if (/^(?:B|G)/.test(id)) return section('lower');
  if (/^(?:L\d|M\d|PR|R\d)/.test(id)) return section('upper');
  if (/^T\d/.test(id) || /^SR/.test(id)) return section('standing');
  return section('standing');
};

export const classifyYankeesSection: Classifier = (id) => {
  const value = numberAtStart(id);
  if (value === null) return section('standing');
  if (value < 100) return section('field');
  if (value < 200) return section('lower');
  if (value < 300) return section('club');
  if (value < 400) return section('club');
  return section('upper');
};
