export interface TnmLidarProduct {
  title: string;
  publicationDate?: string;
  lastUpdated?: string;
  sizeInBytes?: number;
  format?: string;
  downloadURL?: string;
  downloadLazURL?: string;
  metaUrl?: string;
  boundingBox?: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  };
}

export interface TnmLidarResponse {
  total: number;
  items: TnmLidarProduct[];
  errors?: unknown[];
  messages?: string[];
}

export interface LidarCoverageSummary {
  available: boolean;
  completeFootprintCandidateAvailable: boolean;
  returnedProductCount: number;
  centerCoveringProductCount: number;
  footprintAuditRadiusFt: number;
  newestPublicationDate: string | null;
  projectNames: string[];
  completeFootprintProjectNames: string[];
  newestCompleteFootprintProject: {
    projectName: string;
    publicationDate: string | null;
  } | null;
  projectFootprintCoverage: Array<{
    projectName: string;
    coveragePercent: number;
    tileCount: number;
    coversStadiumCenter: boolean;
    newestPublicationDate: string | null;
  }>;
  products: Array<{
    title: string;
    projectName: string;
    publicationDate: string | null;
    sizeInBytes: number | null;
    downloadUrl: string | null;
    metadataUrl: string | null;
    coversStadiumCenter: boolean;
  }>;
}

const DEFAULT_FOOTPRINT_AUDIT_RADIUS_FT = 700;

type BoundingBox = NonNullable<TnmLidarProduct['boundingBox']>;

function clippedRectangle(
  rectangle: BoundingBox,
  bounds: BoundingBox,
): BoundingBox | null {
  const clipped = {
    minX: Math.max(rectangle.minX, bounds.minX),
    maxX: Math.min(rectangle.maxX, bounds.maxX),
    minY: Math.max(rectangle.minY, bounds.minY),
    maxY: Math.min(rectangle.maxY, bounds.maxY),
  };
  return clipped.maxX > clipped.minX && clipped.maxY > clipped.minY ? clipped : null;
}

/** Exact union area for axis-aligned product rectangles clipped to one bbox. */
function rectangleUnionArea(rectangles: readonly BoundingBox[], bounds: BoundingBox): number {
  const clipped = rectangles
    .map((rectangle) => clippedRectangle(rectangle, bounds))
    .filter((rectangle): rectangle is BoundingBox => rectangle !== null);
  const xBreaks = [...new Set([
    bounds.minX,
    bounds.maxX,
    ...clipped.flatMap((rectangle) => [rectangle.minX, rectangle.maxX]),
  ])].sort((left, right) => left - right);

  let area = 0;
  for (let index = 1; index < xBreaks.length; index += 1) {
    const left = xBreaks[index - 1];
    const right = xBreaks[index];
    if (right <= left) continue;
    const intervals = clipped
      .filter((rectangle) => rectangle.minX < right && rectangle.maxX > left)
      .map((rectangle) => [rectangle.minY, rectangle.maxY] as const)
      .sort((a, b) => a[0] - b[0]);
    let coveredY = 0;
    let intervalStart: number | null = null;
    let intervalEnd: number | null = null;
    for (const [start, end] of intervals) {
      if (intervalStart === null || intervalEnd === null) {
        intervalStart = start;
        intervalEnd = end;
      } else if (start <= intervalEnd) {
        intervalEnd = Math.max(intervalEnd, end);
      } else {
        coveredY += intervalEnd - intervalStart;
        intervalStart = start;
        intervalEnd = end;
      }
    }
    if (intervalStart !== null && intervalEnd !== null) coveredY += intervalEnd - intervalStart;
    area += (right - left) * coveredY;
  }
  return area;
}

/** Build an approximately square search box around a WGS84 point. */
export function searchBboxAroundPoint(
  longitude: number,
  latitude: number,
  radiusFt = 1_200,
): [number, number, number, number] {
  const feetPerLatitudeDegree = 364_000;
  const feetPerLongitudeDegree = feetPerLatitudeDegree * Math.cos(latitude * Math.PI / 180);
  const latitudeDelta = radiusFt / feetPerLatitudeDegree;
  const longitudeDelta = radiusFt / feetPerLongitudeDegree;

  return [
    longitude - longitudeDelta,
    latitude - latitudeDelta,
    longitude + longitudeDelta,
    latitude + latitudeDelta,
  ];
}

export function productCoversPoint(
  product: TnmLidarProduct,
  longitude: number,
  latitude: number,
): boolean {
  const box = product.boundingBox;
  return Boolean(box
    && longitude >= box.minX
    && longitude <= box.maxX
    && latitude >= box.minY
    && latitude <= box.maxY);
}

export function lidarProjectName(title: string): string {
  return title
    .replace(/^USGS Lidar Point Cloud\s+/i, '')
    .replace(/\s+\d{5,}$/i, '')
    .trim();
}

/**
 * Resolve a stable project key from the official download hierarchy.
 *
 * Tile suffixes are not consistently numeric (`11SMT...`, `18SVK...`,
 * `w0499...`), so title trimming alone can accidentally treat adjacent tiles
 * from one acquisition as different projects and under-report union coverage.
 */
export function lidarProjectKey(product: TnmLidarProduct): string {
  const downloadUrl = product.downloadLazURL ?? product.downloadURL;
  if (downloadUrl) {
    try {
      const segments = new URL(downloadUrl).pathname.split('/').filter(Boolean);
      const projectsIndex = segments.indexOf('Projects');
      if (projectsIndex >= 0) {
        const candidate = segments[projectsIndex + 1] === 'legacy'
          ? segments[projectsIndex + 2]
          : segments[projectsIndex + 1];
        if (candidate) return decodeURIComponent(candidate);
      }
    } catch {
      // Preserve title fallback for malformed or fixture URLs.
    }
  }
  return lidarProjectName(product.title);
}

export function summarizeLidarCoverage(
  response: TnmLidarResponse,
  longitude: number,
  latitude: number,
  footprintAuditRadiusFt = DEFAULT_FOOTPRINT_AUDIT_RADIUS_FT,
): LidarCoverageSummary {
  const products = response.items.map((product) => ({
    title: product.title,
    projectName: lidarProjectKey(product),
    publicationDate: product.publicationDate ?? null,
    sizeInBytes: product.sizeInBytes ?? null,
    downloadUrl: product.downloadLazURL ?? product.downloadURL ?? null,
    metadataUrl: product.metaUrl ?? null,
    coversStadiumCenter: productCoversPoint(product, longitude, latitude),
  }));
  const centerProducts = products.filter((product) => product.coversStadiumCenter);
  const dates = centerProducts
    .map((product) => product.publicationDate)
    .filter((date): date is string => Boolean(date))
    .sort();
  const [minX, minY, maxX, maxY] = searchBboxAroundPoint(
    longitude,
    latitude,
    footprintAuditRadiusFt,
  );
  const footprintBounds = { minX, minY, maxX, maxY };
  const footprintArea = (maxX - minX) * (maxY - minY);
  const allProjectNames = [...new Set(response.items.map(lidarProjectKey))];
  const projectFootprintCoverage = allProjectNames.map((projectName) => {
    const projectProducts = response.items.filter(
      (item) => lidarProjectKey(item) === projectName,
    );
    const rectangles = projectProducts
      .map((item) => item.boundingBox)
      .filter((box): box is BoundingBox => Boolean(box));
    const coveragePercent = footprintArea > 0
      ? Math.min(100, rectangleUnionArea(rectangles, footprintBounds) / footprintArea * 100)
      : 0;
    const publicationDates = projectProducts
      .map((item) => item.publicationDate)
      .filter((date): date is string => Boolean(date))
      .sort();
    return {
      projectName,
      coveragePercent: Math.round(coveragePercent * 100) / 100,
      tileCount: projectProducts.length,
      coversStadiumCenter: projectProducts.some(
        (item) => productCoversPoint(item, longitude, latitude),
      ),
      newestPublicationDate: publicationDates.at(-1) ?? null,
    };
  }).sort((left, right) => (
    right.coveragePercent - left.coveragePercent
    || left.projectName.localeCompare(right.projectName)
  ));
  const completeFootprintProjects = projectFootprintCoverage
    .filter((project) => project.coveragePercent >= 99.9)
    .sort((left, right) => (
      (right.newestPublicationDate ?? '').localeCompare(left.newestPublicationDate ?? '')
      || left.projectName.localeCompare(right.projectName)
    ));
  const completeFootprintProjectNames = completeFootprintProjects
    .map((project) => project.projectName);

  return {
    available: centerProducts.length > 0,
    completeFootprintCandidateAvailable: completeFootprintProjectNames.length > 0,
    returnedProductCount: response.total,
    centerCoveringProductCount: centerProducts.length,
    footprintAuditRadiusFt,
    newestPublicationDate: dates.at(-1) ?? null,
    projectNames: [...new Set(response.items
      .filter((item) => productCoversPoint(item, longitude, latitude))
      .map(lidarProjectKey))].sort(),
    completeFootprintProjectNames,
    newestCompleteFootprintProject: completeFootprintProjects[0]
      ? {
        projectName: completeFootprintProjects[0].projectName,
        publicationDate: completeFootprintProjects[0].newestPublicationDate,
      }
      : null,
    projectFootprintCoverage,
    products,
  };
}
