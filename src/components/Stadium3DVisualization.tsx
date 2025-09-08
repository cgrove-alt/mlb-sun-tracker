/**
 * 3D Stadium Visualization Component
 * Interactive 3D view showing sun path, shadows, and stadium geometry
 */

import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';
import { DetailedSection, Obstruction3D, Vector3D } from '../types/stadium-complete';
import { SunPosition } from '../utils/sunCalculations';
import { calculateSectionShadow } from '../utils/advancedShadowCalculator';

interface Stadium3DVisualizationProps {
  sections: DetailedSection[];
  obstructions: Obstruction3D[];
  sunPosition: SunPosition;
  currentTime: Date;
  showSunPath?: boolean;
  showShadows?: boolean;
  showLabels?: boolean;
  selectedSection?: string;
  onSectionClick?: (sectionId: string) => void;
  width?: number;
  height?: number;
}

export const Stadium3DVisualization: React.FC<Stadium3DVisualizationProps> = ({
  sections,
  obstructions,
  sunPosition,
  currentTime,
  showSunPath = true,
  showShadows = true,
  showLabels = false,
  selectedSection,
  onSectionClick,
  width = 800,
  height = 600
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const controlsRef = useRef<any>();
  const frameRef = useRef<number>();
  const sunLightRef = useRef<THREE.DirectionalLight>();
  const sunPathRef = useRef<THREE.Line>();
  const sectionMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map());
  
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  // Material definitions
  const materials = useMemo(() => ({
    sectionDefault: new THREE.MeshPhongMaterial({ 
      color: 0x4a90e2,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide
    }),
    sectionShaded: new THREE.MeshPhongMaterial({ 
      color: 0x2c5282,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide
    }),
    sectionSunny: new THREE.MeshPhongMaterial({ 
      color: 0xffd700,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide
    }),
    sectionSelected: new THREE.MeshPhongMaterial({ 
      color: 0xff6b6b,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide
    }),
    sectionHovered: new THREE.MeshPhongMaterial({ 
      color: 0x00ff00,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide
    }),
    obstruction: new THREE.MeshPhongMaterial({ 
      color: 0x808080,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide
    }),
    ground: new THREE.MeshBasicMaterial({ 
      color: 0x90ee90,
      side: THREE.DoubleSide
    }),
    sunPath: new THREE.LineBasicMaterial({ 
      color: 0xffff00,
      linewidth: 2
    })
  }), []);

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb); // Sky blue
    scene.fog = new THREE.Fog(0x87ceeb, 100, 1000);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      2000
    );
    camera.position.set(200, 150, 200);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 0.8);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 500;
    sunLight.shadow.camera.left = -200;
    sunLight.shadow.camera.right = 200;
    sunLight.shadow.camera.top = 200;
    sunLight.shadow.camera.bottom = -200;
    sunLightRef.current = sunLight;
    scene.add(sunLight);

    // Ground plane
    const groundGeometry = new THREE.PlaneGeometry(500, 500);
    const groundMesh = new THREE.Mesh(groundGeometry, materials.ground);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    // Field (baseball diamond)
    const fieldGeometry = new THREE.CircleGeometry(120, 64);
    const fieldMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x8b7355,
      side: THREE.DoubleSide
    });
    const fieldMesh = new THREE.Mesh(fieldGeometry, fieldMaterial);
    fieldMesh.rotation.x = -Math.PI / 2;
    fieldMesh.position.y = 0.1;
    fieldMesh.receiveShadow = true;
    scene.add(fieldMesh);

    // Infield diamond
    const infieldShape = new THREE.Shape();
    infieldShape.moveTo(0, 0);
    infieldShape.lineTo(30, 30);
    infieldShape.lineTo(0, 60);
    infieldShape.lineTo(-30, 30);
    infieldShape.closePath();
    
    const infieldGeometry = new THREE.ShapeGeometry(infieldShape);
    const infieldMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xc19a6b,
      side: THREE.DoubleSide
    });
    const infieldMesh = new THREE.Mesh(infieldGeometry, infieldMaterial);
    infieldMesh.rotation.x = -Math.PI / 2;
    infieldMesh.position.y = 0.2;
    scene.add(infieldMesh);

    // Orbit controls
    import('three/examples/jsm/controls/OrbitControls.js').then(({ OrbitControls }) => {
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.screenSpacePanning = false;
      controls.minDistance = 50;
      controls.maxDistance = 500;
      controls.maxPolarAngle = Math.PI / 2;
      controlsRef.current = controls;
    });

    // Raycaster for mouse interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(Array.from(sectionMeshesRef.current.values()));
      
      if (intersects.length > 0) {
        const mesh = intersects[0].object as THREE.Mesh;
        const sectionId = Array.from(sectionMeshesRef.current.entries())
          .find(([_, m]) => m === mesh)?.[0];
        if (sectionId) {
          setHoveredSection(sectionId);
          renderer.domElement.style.cursor = 'pointer';
        }
      } else {
        setHoveredSection(null);
        renderer.domElement.style.cursor = 'default';
      }
    };

    const onClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(Array.from(sectionMeshesRef.current.values()));
      
      if (intersects.length > 0 && onSectionClick) {
        const mesh = intersects[0].object as THREE.Mesh;
        const sectionId = Array.from(sectionMeshesRef.current.entries())
          .find(([_, m]) => m === mesh)?.[0];
        if (sectionId) {
          onSectionClick(sectionId);
        }
      }
    };

    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('click', onClick);

    setIsLoading(false);

    // Cleanup
    return () => {
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('click', onClick);
      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      materials.sectionDefault.dispose();
      materials.sectionShaded.dispose();
      materials.sectionSunny.dispose();
      materials.sectionSelected.dispose();
      materials.sectionHovered.dispose();
      materials.obstruction.dispose();
      materials.ground.dispose();
      materials.sunPath.dispose();
    };
  }, [width, height, materials, onSectionClick]);

  // Create section meshes
  useEffect(() => {
    if (!sceneRef.current) return;

    // Clear existing section meshes
    sectionMeshesRef.current.forEach(mesh => {
      sceneRef.current?.remove(mesh);
      mesh.geometry.dispose();
    });
    sectionMeshesRef.current.clear();

    // Create new section meshes
    sections.forEach(section => {
      if (!section.vertices3D || section.vertices3D.length < 4) return;

      const geometry = new THREE.BufferGeometry();
      const vertices = new Float32Array([
        // Triangle 1
        section.vertices3D[0].x, section.vertices3D[0].y, section.vertices3D[0].z,
        section.vertices3D[1].x, section.vertices3D[1].y, section.vertices3D[1].z,
        section.vertices3D[2].x, section.vertices3D[2].y, section.vertices3D[2].z,
        // Triangle 2
        section.vertices3D[0].x, section.vertices3D[0].y, section.vertices3D[0].z,
        section.vertices3D[2].x, section.vertices3D[2].y, section.vertices3D[2].z,
        section.vertices3D[3].x, section.vertices3D[3].y, section.vertices3D[3].z,
      ]);
      
      geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      geometry.computeVertexNormals();

      const mesh = new THREE.Mesh(geometry, materials.sectionDefault);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = { sectionId: section.id, sectionName: section.name };
      
      sceneRef.current.add(mesh);
      sectionMeshesRef.current.set(section.id, mesh);
    });
  }, [sections, materials]);

  // Create obstruction meshes
  useEffect(() => {
    if (!sceneRef.current) return;

    // Clear existing obstruction meshes
    const obstructionGroup = sceneRef.current.getObjectByName('obstructions');
    if (obstructionGroup) {
      sceneRef.current.remove(obstructionGroup);
    }

    // Create new obstruction group
    const newObstructionGroup = new THREE.Group();
    newObstructionGroup.name = 'obstructions';

    obstructions.forEach(obstruction => {
      const { min, max } = obstruction.boundingBox;
      const geometry = new THREE.BoxGeometry(
        max.x - min.x,
        max.y - min.y,
        max.z - min.z
      );
      
      const mesh = new THREE.Mesh(geometry, materials.obstruction);
      mesh.position.set(
        (min.x + max.x) / 2,
        (min.y + max.y) / 2,
        (min.z + max.z) / 2
      );
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = { obstructionId: obstruction.id, obstructionName: obstruction.name };
      
      newObstructionGroup.add(mesh);
    });

    sceneRef.current.add(newObstructionGroup);
  }, [obstructions, materials]);

  // Update sun position and shadows
  useEffect(() => {
    if (!sunLightRef.current || !sceneRef.current) return;

    // Update sun light position based on sun position
    const sunDistance = 300;
    const sunX = sunDistance * Math.sin(sunPosition.azimuth) * Math.cos(sunPosition.altitude);
    const sunY = sunDistance * Math.sin(sunPosition.altitude);
    const sunZ = sunDistance * Math.cos(sunPosition.azimuth) * Math.cos(sunPosition.altitude);
    
    sunLightRef.current.position.set(sunX, sunY, sunZ);
    sunLightRef.current.target.position.set(0, 0, 0);
    sunLightRef.current.target.updateMatrixWorld();

    // Update section colors based on shadow calculations
    if (showShadows) {
      sectionMeshesRef.current.forEach((mesh, sectionId) => {
        const section = sections.find(s => s.id === sectionId);
        if (!section) return;

        const shadowResult = calculateSectionShadow(section, sunPosition, obstructions);
        
        let material = materials.sectionDefault;
        if (shadowResult.shadowPercentage > 75) {
          material = materials.sectionShaded;
        } else if (shadowResult.shadowPercentage < 25) {
          material = materials.sectionSunny;
        }

        if (sectionId === selectedSection) {
          material = materials.sectionSelected;
        } else if (sectionId === hoveredSection) {
          material = materials.sectionHovered;
        }

        mesh.material = material;
      });
    }
  }, [sunPosition, showShadows, sections, obstructions, selectedSection, hoveredSection, materials]);

  // Create sun path
  useEffect(() => {
    if (!sceneRef.current || !showSunPath) return;

    // Remove existing sun path
    if (sunPathRef.current) {
      sceneRef.current.remove(sunPathRef.current);
    }

    // Create sun path for the day
    const sunPathPoints: THREE.Vector3[] = [];
    const sunDistance = 250;
    
    for (let hour = 0; hour < 24; hour++) {
      const angle = (hour / 24) * Math.PI * 2 - Math.PI / 2;
      const elevation = Math.sin(angle) * Math.PI / 3; // Simplified elevation curve
      
      const x = sunDistance * Math.cos(angle) * Math.cos(elevation);
      const y = sunDistance * Math.sin(elevation) + 50;
      const z = sunDistance * Math.sin(angle) * Math.cos(elevation);
      
      if (y > 0) { // Only show path above horizon
        sunPathPoints.push(new THREE.Vector3(x, y, z));
      }
    }

    if (sunPathPoints.length > 1) {
      const sunPathGeometry = new THREE.BufferGeometry().setFromPoints(sunPathPoints);
      const sunPathLine = new THREE.Line(sunPathGeometry, materials.sunPath);
      sunPathRef.current = sunPathLine;
      sceneRef.current.add(sunPathLine);

      // Add sun sphere at current position
      const sunGeometry = new THREE.SphereGeometry(10, 32, 32);
      const sunMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffff00,
        emissive: 0xffff00
      });
      const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
      
      const currentHour = currentTime.getHours() + currentTime.getMinutes() / 60;
      const currentAngle = (currentHour / 24) * Math.PI * 2 - Math.PI / 2;
      const currentElevation = Math.sin(currentAngle) * Math.PI / 3;
      
      sunMesh.position.set(
        sunDistance * Math.cos(currentAngle) * Math.cos(currentElevation),
        sunDistance * Math.sin(currentElevation) + 50,
        sunDistance * Math.sin(currentAngle) * Math.cos(currentElevation)
      );
      
      sceneRef.current.add(sunMesh);
    }
  }, [showSunPath, currentTime, materials]);

  // Animation loop
  useEffect(() => {
    if (!sceneRef.current || !rendererRef.current || !cameraRef.current) return;

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      rendererRef.current?.render(sceneRef.current!, cameraRef.current!);
    };

    animate();

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <div className="stadium-3d-visualization">
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner">Loading 3D visualization...</div>
        </div>
      )}
      
      <div ref={mountRef} className="three-canvas-container" />
      
      {hoveredSection && (
        <div className="hover-tooltip">
          Section: {hoveredSection}
        </div>
      )}
      
      <div className="visualization-controls">
        <label>
          <input 
            type="checkbox" 
            checked={showSunPath}
            onChange={(e) => {/* Handle toggle */}}
          />
          Show Sun Path
        </label>
        <label>
          <input 
            type="checkbox" 
            checked={showShadows}
            onChange={(e) => {/* Handle toggle */}}
          />
          Show Shadows
        </label>
        <label>
          <input 
            type="checkbox" 
            checked={showLabels}
            onChange={(e) => {/* Handle toggle */}}
          />
          Show Labels
        </label>
      </div>

      <style jsx>{`
        .stadium-3d-visualization {
          position: relative;
          width: ${width}px;
          height: ${height}px;
          background: linear-gradient(to bottom, #87ceeb, #98d8e8);
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .three-canvas-container {
          width: 100%;
          height: 100%;
        }

        .loading-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.9);
          z-index: 10;
        }

        .loading-spinner {
          font-size: 18px;
          color: #4a90e2;
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .hover-tooltip {
          position: absolute;
          top: 10px;
          left: 10px;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 14px;
          pointer-events: none;
          z-index: 5;
        }

        .visualization-controls {
          position: absolute;
          bottom: 10px;
          right: 10px;
          background: rgba(255, 255, 255, 0.9);
          padding: 10px;
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          z-index: 5;
        }

        .visualization-controls label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          cursor: pointer;
        }

        .visualization-controls input[type="checkbox"] {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default Stadium3DVisualization;