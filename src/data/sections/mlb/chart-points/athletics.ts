import type { ChartSectionPoint } from '../parkSectionBuilder';

/**
 * Sutter Health Park sections (the Athletics' home from 2025), read from the
 * club's official seat map (https://www.mlb.com/athletics/ballpark/seating-map,
 * image https://img.mlbstatic.com/mlb-images/image/upload/t_w2208/mlb/raij1dhxzwdixvuudkxz.jpg;
 * a top-down plan, 2208 px wide). Each point is the centre of the section's
 * label, which sits in its back rows. Box sizes are each ring's typical
 * section size. Read on 2026-11-12.
 */
export const athleticsChartPoints: readonly ChartSectionPoint[] = [
  { id: "101", x: 1706.2, y: 1019.7, width: 80, height: 80, rowCount: 13 },
  { id: "102", x: 1686.1, y: 1114.0, width: 80, height: 80, rowCount: 18 },
  { id: "103", x: 1656.0, y: 1220.4, width: 80, height: 80, rowCount: 30 },
  { id: "104", x: 1605.8, y: 1322.8, width: 80, height: 80, rowCount: 30 },
  { id: "105", x: 1571.7, y: 1415.1, width: 80, height: 80, rowCount: 30 },
  { id: "106", x: 1531.5, y: 1497.4, width: 80, height: 80, rowCount: 23 },
  { id: "107", x: 1489.4, y: 1583.7, width: 80, height: 80, rowCount: 24 },
  { id: "108", x: 1445.2, y: 1668.0, width: 80, height: 80, rowCount: 29 },
  { id: "109", x: 1381.0, y: 1734.3, width: 80, height: 80, rowCount: 29 },
  { id: "110", x: 1304.7, y: 1786.5, width: 80, height: 80, rowCount: 29 },
  { id: "111", x: 1218.4, y: 1826.6, width: 80, height: 80, rowCount: 22 },
  { id: "112", x: 1106.0, y: 1840.7, width: 80, height: 80, rowCount: 22 },
  { id: "113", x: 991.6, y: 1828.6, width: 80, height: 80, rowCount: 22 },
  { id: "114", x: 907.3, y: 1794.5, width: 80, height: 80, rowCount: 29 },
  { id: "115", x: 831.0, y: 1742.3, width: 80, height: 80, rowCount: 29 },
  { id: "116", x: 764.8, y: 1678.1, width: 80, height: 80, rowCount: 29 },
  { id: "117", x: 718.6, y: 1593.8, width: 80, height: 80, rowCount: 24 },
  { id: "118", x: 678.5, y: 1507.5, width: 80, height: 80, rowCount: 26 },
  { id: "119", x: 638.3, y: 1429.2, width: 80, height: 80, rowCount: 32 },
  { id: "120", x: 600.2, y: 1332.8, width: 80, height: 80, rowCount: 32 },
  { id: "121", x: 552.0, y: 1224.4, width: 80, height: 80, rowCount: 29 },
  { id: "122", x: 566.1, y: 1100.0, width: 80, height: 80, rowCount: 22 },
  { id: "123", x: 529.9, y: 995.6, width: 80, height: 80, rowCount: 12 },
  { id: "201", x: 1866.8, y: 1102.0, width: 60, height: 60, rowCount: 5 },
  { id: "202", x: 1832.6, y: 1168.2, width: 60, height: 60, rowCount: 5 },
  { id: "203", x: 1802.5, y: 1238.5, width: 60, height: 60, rowCount: 5 },
  { id: "204", x: 1768.4, y: 1306.7, width: 60, height: 60, rowCount: 5 },
  { id: "205", x: 1738.3, y: 1375.0, width: 60, height: 60, rowCount: 5 },
  { id: "206", x: 1702.2, y: 1443.2, width: 60, height: 60, rowCount: 5 },
];
