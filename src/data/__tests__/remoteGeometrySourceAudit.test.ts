/** @jest-environment node */

import {
  lidarProjectKey,
  lidarProjectName,
  productCoversPoint,
  searchBboxAroundPoint,
  summarizeLidarCoverage,
} from '../remoteGeometrySourceAudit';

describe('remote lidar source audit helpers', () => {
  it('builds a WGS84 search box around a stadium', () => {
    const box = searchBboxAroundPoint(-117.157, 32.7076);
    expect(box[0]).toBeLessThan(-117.157);
    expect(box[1]).toBeLessThan(32.7076);
    expect(box[2]).toBeGreaterThan(-117.157);
    expect(box[3]).toBeGreaterThan(32.7076);
  });

  it('requires the product bounds to contain the stadium center', () => {
    const product = {
      title: 'tile',
      boundingBox: { minX: -117.2, maxX: -117.1, minY: 32.6, maxY: 32.8 },
    };
    expect(productCoversPoint(product, -117.157, 32.7076)).toBe(true);
    expect(productCoversPoint(product, -118, 32.7076)).toBe(false);
  });

  it('summarizes center-covering products without treating nearby tiles as coverage', () => {
    const coverage = summarizeLidarCoverage({
      total: 2,
      items: [
        {
          title: 'USGS Lidar Point Cloud San_Diego_CA_2014_LiDAR 280835',
          publicationDate: '2023-12-13',
          downloadLazURL: 'https://example.com/inside.laz',
          boundingBox: { minX: -117.2, maxX: -117.1, minY: 32.6, maxY: 32.8 },
        },
        {
          title: 'USGS Lidar Point Cloud Nearby_Project 999999',
          publicationDate: '2025-01-01',
          boundingBox: { minX: -117.3, maxX: -117.2, minY: 32.6, maxY: 32.8 },
        },
      ],
    }, -117.157, 32.7076);

    expect(coverage).toMatchObject({
      available: true,
      completeFootprintCandidateAvailable: true,
      returnedProductCount: 2,
      centerCoveringProductCount: 1,
      footprintAuditRadiusFt: 700,
      newestPublicationDate: '2023-12-13',
      projectNames: ['San_Diego_CA_2014_LiDAR'],
      completeFootprintProjectNames: ['San_Diego_CA_2014_LiDAR'],
      newestCompleteFootprintProject: {
        projectName: 'San_Diego_CA_2014_LiDAR',
        publicationDate: '2023-12-13',
      },
    });
    expect(coverage.products[0]).toMatchObject({ coversStadiumCenter: true });
    expect(coverage.products[1]).toMatchObject({ coversStadiumCenter: false });
  });

  it('requires same-project coverage of the conservative stadium footprint', () => {
    const longitude = -117.8827;
    const latitude = 33.8003;
    const [minX, minY, maxX, maxY] = searchBboxAroundPoint(longitude, latitude, 700);
    const coverage = summarizeLidarCoverage({
      total: 3,
      items: [
        {
          title: 'USGS Lidar Point Cloud Partial_Project 00001',
          boundingBox: { minX, minY, maxX: longitude + (maxX - minX) * 0.1, maxY },
        },
        {
          title: 'USGS Lidar Point Cloud Complete_Project 00001',
          boundingBox: { minX, minY, maxX: longitude, maxY },
        },
        {
          title: 'USGS Lidar Point Cloud Complete_Project 00002',
          boundingBox: { minX: longitude, minY, maxX, maxY },
        },
      ],
    }, longitude, latitude, 700);

    expect(coverage.completeFootprintCandidateAvailable).toBe(true);
    expect(coverage.completeFootprintProjectNames).toEqual(['Complete_Project']);
    expect(coverage.projectFootprintCoverage).toEqual(expect.arrayContaining([
      expect.objectContaining({ projectName: 'Complete_Project', coveragePercent: 100 }),
      expect.objectContaining({ projectName: 'Partial_Project', coveragePercent: 60 }),
    ]));
  });

  it('normalizes USGS tile titles to project names', () => {
    expect(lidarProjectName('USGS Lidar Point Cloud San_Diego_CA_2014_LiDAR 280835'))
      .toBe('San_Diego_CA_2014_LiDAR');
  });

  it('groups alphanumeric tiles using the official project download path', () => {
    expect(lidarProjectKey({
      title: 'USGS Lidar Point Cloud CA_LosAngeles_B23 11SLT038500377100',
      downloadLazURL: 'https://rockyweb.usgs.gov/vdelivery/Datasets/Staged/Elevation/LPC/Projects/CA_LosAngeles_B23/CA_LosAngeles_1_B23/LAZ/tile.laz',
    })).toBe('CA_LosAngeles_B23');
    expect(lidarProjectKey({
      title: 'USGS Lidar Point Cloud MD_BALTIMORE_2008 000052',
      downloadLazURL: 'https://rockyweb.usgs.gov/vdelivery/Datasets/Staged/Elevation/LPC/Projects/legacy/MD_BALTIMORE_2008/LAZ/tile.laz',
    })).toBe('MD_BALTIMORE_2008');
  });
});
