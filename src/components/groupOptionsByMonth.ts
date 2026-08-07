/**
 * Group react-select options into month headings.
 *
 * A team's home schedule is 78+ games. Rendered as one flat list the dropdown is
 * unusable — you scroll blindly looking for a date. react-select renders an
 * entry shaped `{ label, options }` as a group heading, so grouping by month
 * gives the list navigable structure.
 *
 * GameSelector.tsx had this logic inline; UnifiedGameSelector.tsx — the one the
 * app actually renders — did a flat `.map()`. Extracted here so both use the
 * same implementation and it can be tested directly.
 */

export interface OptionGroup<O> {
  label: string;
  options: O[];
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/**
 * @param items        source records (games)
 * @param getDate      extracts the record's date; invalid dates are skipped
 * @param buildOption  maps a record to the react-select option object
 */
export function groupOptionsByMonth<G, O>(
  items: readonly G[],
  getDate: (item: G) => Date,
  buildOption: (item: G) => O,
): OptionGroup<O>[] {
  const grouped = new Map<number, { label: string; sortKey: number; options: O[] }>();

  for (const item of items) {
    const date = getDate(item);
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) continue;

    const year = date.getFullYear();
    const month = date.getMonth();
    // Sortable, collision-free key across years.
    const sortKey = year * 12 + month;

    let group = grouped.get(sortKey);
    if (!group) {
      group = { label: MONTH_NAMES[month], sortKey, options: [] };
      grouped.set(sortKey, group);
    }
    group.options.push(buildOption(item));
  }

  const groups = Array.from(grouped.values()).sort((a, b) => a.sortKey - b.sortKey);

  // A schedule spanning more than one calendar year would otherwise show two
  // identical month headings; qualify with the year only when that can happen.
  const spansMultipleYears = new Set(groups.map(g => Math.floor(g.sortKey / 12))).size > 1;

  return groups.map(g => ({
    label: spansMultipleYears ? `${g.label} ${Math.floor(g.sortKey / 12)}` : g.label,
    options: g.options,
  }));
}
