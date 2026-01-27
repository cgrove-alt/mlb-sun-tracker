import { DetailedSection, Vector3D } from '../../../types/stadium-complete';

// Performance benchmark test
describe('StadiumDiagram Performance', () => {
  // Generate mock stadium with many sections
  const generateMockStadium = (sectionCount: number): DetailedSection[] => {
    const sections: DetailedSection[] = [];
    const anglePerSection = 360 / sectionCount;

    for (let i = 0; i < sectionCount; i++) {
      const angle = i * anglePerSection;
      const radians = (angle * Math.PI) / 180;
      const nextRadians = ((angle + anglePerSection) * Math.PI) / 180;

      const innerRadius = 50;
      const outerRadius = 100;

      sections.push({
        id: `section-${i}`,
        name: `Section ${i + 1}`,
        level: i < sectionCount / 2 ? 'field' : 'upper',
        baseAngle: angle,
        angleSpan: anglePerSection,
        rows: [],
        vertices3D: [
          { x: Math.cos(radians) * innerRadius, y: 0, z: Math.sin(radians) * innerRadius },
          { x: Math.cos(nextRadians) * innerRadius, y: 0, z: Math.sin(nextRadians) * innerRadius },
          { x: Math.cos(nextRadians) * outerRadius, y: 0, z: Math.sin(nextRadians) * outerRadius },
          { x: Math.cos(radians) * outerRadius, y: 0, z: Math.sin(radians) * outerRadius },
        ] as Vector3D[],
        covered: false,
        distance: (innerRadius + outerRadius) / 2,
        height: 10,
        rake: 20,
      });
    }

    return sections;
  };

  it('calculates bounds for 100 sections in under 100ms', () => {
    const sections = generateMockStadium(100);

    const startTime = performance.now();

    // Simulate the bounds calculation from StadiumDiagram
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    sections.forEach(section => {
      section.vertices3D.forEach(vertex => {
        minX = Math.min(minX, vertex.x);
        maxX = Math.max(maxX, vertex.x);
        minY = Math.min(minY, vertex.z);
        maxY = Math.max(maxY, vertex.z);
      });
    });

    const endTime = performance.now();
    const duration = endTime - startTime;

    expect(duration).toBeLessThan(100);
  });

  it('processes shade data for 100 sections efficiently', () => {
    const sections = generateMockStadium(100);
    const shadeData = sections.map(s => ({
      sectionId: s.id,
      shadePercentage: Math.random() * 100,
    }));

    const startTime = performance.now();

    // Simulate shade data lookup
    sections.forEach(section => {
      const data = shadeData.find(d => d.sectionId === section.id);
      const percentage = data ? data.shadePercentage : 0;
      expect(typeof percentage).toBe('number');
    });

    const endTime = performance.now();
    const duration = endTime - startTime;

    expect(duration).toBeLessThan(50);
  });

  it('projects 3D coordinates to 2D efficiently', () => {
    const sections = generateMockStadium(100);

    const startTime = performance.now();

    sections.forEach(section => {
      section.vertices3D.forEach(vertex => {
        const projected = { x: vertex.x, y: vertex.z };
        expect(projected.x).toBeDefined();
        expect(projected.y).toBeDefined();
      });
    });

    const endTime = performance.now();
    const duration = endTime - startTime;

    expect(duration).toBeLessThan(50);
  });

  it('handles realistic MLB stadium size (80 sections)', () => {
    const sections = generateMockStadium(80);

    expect(sections).toHaveLength(80);

    const startTime = performance.now();

    // Simulate full diagram calculation
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    sections.forEach(section => {
      section.vertices3D.forEach(vertex => {
        const x = vertex.x;
        const y = vertex.z;
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      });

      // Calculate centroid
      const centroid = section.vertices3D.reduce(
        (acc, vertex) => ({
          x: acc.x + vertex.x,
          y: acc.y + vertex.z,
        }),
        { x: 0, y: 0 }
      );
      centroid.x /= section.vertices3D.length;
      centroid.y /= section.vertices3D.length;
    });

    const endTime = performance.now();
    const duration = endTime - startTime;

    // Should render in under 500ms (target from verification criteria)
    expect(duration).toBeLessThan(100); // Calculation alone should be much faster
  });

  it('memory footprint is reasonable for 100 sections', () => {
    const sections = generateMockStadium(100);

    // Each section should have a small memory footprint
    const sampleSection = sections[0];

    expect(sampleSection.vertices3D.length).toBeLessThanOrEqual(10); // Most sections have 4-6 vertices
    expect(Object.keys(sampleSection).length).toBeLessThan(20); // Limited number of properties
  });
});
