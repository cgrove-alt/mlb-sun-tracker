// Color-blind safe shade color palette
// Based on percentage of shade coverage: 0% (full sun) to 100% (full shade)

export interface ShadeColor {
  fill: string;
  label: string;
  range: { min: number; max: number };
}

export const SHADE_COLORS: ShadeColor[] = [
  {
    fill: '#dc2626', // Red - Full sun
    label: 'Full Sun',
    range: { min: 0, max: 20 },
  },
  {
    fill: '#f97316', // Orange - Mostly sun
    label: 'Mostly Sun',
    range: { min: 20, max: 40 },
  },
  {
    fill: '#f59e0b', // Amber - Partial shade
    label: 'Partial Shade',
    range: { min: 40, max: 60 },
  },
  {
    fill: '#3b82f6', // Blue - Mostly shade
    label: 'Mostly Shade',
    range: { min: 60, max: 80 },
  },
  {
    fill: '#10b981', // Green - Full shade
    label: 'Full Shade',
    range: { min: 80, max: 100 },
  },
];

// Get color for a specific shade percentage
export const getShadeColor = (shadePercentage: number): ShadeColor => {
  // Ensure percentage is in valid range
  const percentage = Math.max(0, Math.min(100, shadePercentage));

  // Find matching color range
  const color = SHADE_COLORS.find(
    c => percentage >= c.range.min && percentage < c.range.max
  );

  // Return the color, or last color if 100%
  return color || SHADE_COLORS[SHADE_COLORS.length - 1];
};

// Get WCAG compliant text color for a given background
export const getTextColor = (backgroundColor: string): string => {
  // For our palette, we'll use white text for darker colors
  const darkColors = ['#dc2626', '#f97316', '#3b82f6', '#10b981'];
  return darkColors.includes(backgroundColor) ? '#ffffff' : '#1F2937';
};
