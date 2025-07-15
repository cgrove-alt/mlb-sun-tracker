'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Stadium } from '../src/data/stadiums';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface OptimizedWebGLStadiumProps {
  stadium: Stadium;
  sunPosition: { azimuthDegrees: number; altitudeDegrees: number };
  gameDateTime: Date;
  selectedSections?: string[];
  onSectionClick?: (sectionId: string) => void;
}

// Mobile detection utility
const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// WebGL detection utility
const isWebGLSupported = () => {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && canvas.getContext('webgl'));
  } catch (e) {
    return false;
  }
};

// Performance configuration based on device
const getPerformanceConfig = () => {
  const mobile = isMobile();
  return {
    shadowMapSize: mobile ? 512 : 1024,
    maxLights: mobile ? 2 : 4,
    pixelRatio: mobile ? Math.min(window.devicePixelRatio, 2) : window.devicePixelRatio,
    antialiasing: !mobile,
    shadowType: mobile ? 'basic' : 'pcf',
    maxGeometryDetail: mobile ? 0.5 : 1.0,
  };
};

export default function OptimizedWebGLStadium({
  stadium,
  sunPosition,
  gameDateTime,
  selectedSections = [],
  onSectionClick,
}: OptimizedWebGLStadiumProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isControlsActive, setIsControlsActive] = useState(false);
  
  // Animation control
  const animationRef = useRef<number>();
  const lastFrameTime = useRef<number>(0);
  const targetFPS = 60;
  const frameInterval = 1000 / targetFPS;
  
  // THREE.js objects
  const sceneRef = useRef<any>();
  const rendererRef = useRef<any>();
  const cameraRef = useRef<any>();
  const controlsRef = useRef<any>();
  const stadiumMeshRef = useRef<any>();
  const sunLightRef = useRef<any>();
  const shadowMapRef = useRef<any>();

  // Initialize THREE.js scene
  const initializeThreeJS = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Check WebGL support first
      if (!isWebGLSupported()) {
        throw new Error('WebGL is not supported in this browser');
      }
      
      // THREE.js is now statically imported
      console.log('THREE.js loaded successfully');
      
      setIsLoading(false);
      
      // Initialize the scene
      initializeScene();
    } catch (err) {
      console.error('Failed to initialize THREE.js:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to load 3D graphics: ${errorMessage}`);
      setIsLoading(false);
    }
  }, []);

  // Initialize THREE.js scene
  const initializeScene = useCallback(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const config = getPerformanceConfig();

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); // Sky blue
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 20, 30);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: config.antialiasing,
      powerPreference: 'high-performance',
      stencil: false,
      depth: true,
    });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(config.pixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = config.shadowType === 'pcf' ? THREE.PCFShadowMap : THREE.BasicShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 1.0;
    
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 100;
    controls.minDistance = 5;
    controls.maxPolarAngle = Math.PI / 2;
    
    // Control event listeners for animation optimization
    controls.addEventListener('start', () => {
      setIsControlsActive(true);
    });
    
    controls.addEventListener('end', () => {
      setIsControlsActive(false);
    });
    
    controlsRef.current = controls;

    // Create stadium geometry
    createStadiumGeometry();

    // Setup lighting
    setupLighting();

    // Setup shadows
    setupShadows();

    // Start animation loop
    startAnimationLoop();

  }, []);

  // Create stadium geometry with LOD
  const createStadiumGeometry = useCallback(() => {
    if (!sceneRef.current) return;

    const scene = sceneRef.current;
    const config = getPerformanceConfig();

    // Stadium bowl geometry
    const bowlGeometry = new THREE.CylinderGeometry(
      25, // top radius
      30, // bottom radius
      10, // height
      32 * config.maxGeometryDetail, // radial segments
      1, // height segments
      false, // open ended
      0, // theta start
      Math.PI * 2 // theta length
    );

    // Stadium material with optimized settings
    const bowlMaterial = new THREE.MeshLambertMaterial({
      color: 0x888888,
      transparent: false,
      side: THREE.DoubleSide,
    });

    const stadiumMesh = new THREE.Mesh(bowlGeometry, bowlMaterial);
    stadiumMesh.position.set(0, 0, 0);
    stadiumMesh.castShadow = true;
    stadiumMesh.receiveShadow = true;
    
    scene.add(stadiumMesh);
    stadiumMeshRef.current = stadiumMesh;

    // Field geometry
    const fieldGeometry = new THREE.CircleGeometry(20, 32 * config.maxGeometryDetail);
    const fieldMaterial = new THREE.MeshLambertMaterial({
      color: 0x228B22, // Forest green
    });
    
    const fieldMesh = new THREE.Mesh(fieldGeometry, fieldMaterial);
    fieldMesh.rotation.x = -Math.PI / 2;
    fieldMesh.position.y = 5;
    fieldMesh.receiveShadow = true;
    
    scene.add(fieldMesh);

    // Create seating sections
    createSeatingSections();

  }, []);

  // Create seating sections with click detection
  const createSeatingSections = useCallback(() => {
    if (!sceneRef.current) return;

    const scene = sceneRef.current;
    const config = getPerformanceConfig();

    const sectionCount = Math.floor(32 * config.maxGeometryDetail);
    const sectionGeometry = new THREE.RingGeometry(25, 30, 0, Math.PI * 2 / sectionCount);
    
    for (let i = 0; i < sectionCount; i++) {
      const angle = (i / sectionCount) * Math.PI * 2;
      
      const sectionMaterial = new THREE.MeshLambertMaterial({
        color: selectedSections.includes(`section-${i}`) ? 0xff4444 : 0x666666,
        transparent: true,
        opacity: 0.8,
      });
      
      const sectionMesh = new THREE.Mesh(sectionGeometry, sectionMaterial);
      sectionMesh.rotation.x = -Math.PI / 2;
      sectionMesh.rotation.z = angle;
      sectionMesh.position.y = 8;
      sectionMesh.userData = { sectionId: `section-${i}` };
      
      scene.add(sectionMesh);
    }
  }, [selectedSections]);

  // Setup lighting system
  const setupLighting = useCallback(() => {
    if (!sceneRef.current) return;

    const scene = sceneRef.current;
    const config = getPerformanceConfig();

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);

    // Sun light (directional)
    const sunAzimuth = (sunPosition.azimuthDegrees - 90) * Math.PI / 180;
    const sunAltitude = Math.max(sunPosition.altitudeDegrees * Math.PI / 180, 0);
    
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.0);
    sunLight.position.set(
      Math.cos(sunAltitude) * Math.cos(sunAzimuth) * 50,
      Math.sin(sunAltitude) * 50,
      Math.cos(sunAltitude) * Math.sin(sunAzimuth) * 50
    );
    
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = config.shadowMapSize;
    sunLight.shadow.mapSize.height = config.shadowMapSize;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 100;
    sunLight.shadow.camera.left = -50;
    sunLight.shadow.camera.right = 50;
    sunLight.shadow.camera.top = 50;
    sunLight.shadow.camera.bottom = -50;
    
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    // Additional lights for mobile optimization
    if (config.maxLights > 2) {
      const fillLight = new THREE.DirectionalLight(0x404040, 0.2);
      fillLight.position.set(-20, 10, 10);
      scene.add(fillLight);
    }

  }, [sunPosition]);

  // Setup shadow system with mobile optimization
  const setupShadows = useCallback(() => {
    if (!rendererRef.current || !sunLightRef.current) return;

    const config = getPerformanceConfig();
    const renderer = rendererRef.current;
    const sunLight = sunLightRef.current;

    // Mobile shadow optimization
    if (isMobile()) {
      // Use lower quality shadows on mobile
      renderer.shadowMap.type = THREE.BasicShadowMap;
      sunLight.shadow.mapSize.width = 512;
      sunLight.shadow.mapSize.height = 512;
      sunLight.shadow.radius = 1;
      sunLight.shadow.blurSamples = 4;
    } else {
      // Higher quality shadows on desktop
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      sunLight.shadow.mapSize.width = 1024;
      sunLight.shadow.mapSize.height = 1024;
      sunLight.shadow.radius = 4;
      sunLight.shadow.blurSamples = 8;
    }

  }, []);

  // Optimized animation loop with throttling
  const startAnimationLoop = useCallback(() => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const controls = controlsRef.current;

    const animate = (currentTime: number) => {
      // Throttle animation based on controls activity
      if (isControlsActive) {
        // Full frame rate when controls are active
        if (controls) controls.update();
        renderer.render(scene, camera);
      } else {
        // Reduced frame rate when controls are inactive
        if (currentTime - lastFrameTime.current >= frameInterval) {
          if (controls) controls.update();
          renderer.render(scene, camera);
          lastFrameTime.current = currentTime;
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

  }, [isControlsActive, frameInterval]);

  // Handle window resize
  const handleResize = useCallback(() => {
    if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;

    const container = containerRef.current;
    const renderer = rendererRef.current;
    const camera = cameraRef.current;

    const width = container.clientWidth;
    const height = container.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);

  }, []);

  // Handle section click
  const handleCanvasClick = useCallback((event: MouseEvent) => {
    if (!onSectionClick || !cameraRef.current || !sceneRef.current) return;

    const camera = cameraRef.current;
    const scene = sceneRef.current;
    const canvas = event.target as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();

    const mouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);
    
    for (const intersect of intersects) {
      if (intersect.object.userData.sectionId) {
        onSectionClick(intersect.object.userData.sectionId);
        break;
      }
    }
  }, [onSectionClick]);

  // Initialize on mount
  useEffect(() => {
    initializeThreeJS();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initializeThreeJS]);

  // Setup event listeners
  useEffect(() => {
    if (!rendererRef.current) return;

    const canvas = rendererRef.current.domElement;
    const resizeHandler = () => handleResize();
    const clickHandler = (e: MouseEvent) => handleCanvasClick(e);

    window.addEventListener('resize', resizeHandler);
    canvas.addEventListener('click', clickHandler);

    return () => {
      window.removeEventListener('resize', resizeHandler);
      canvas.removeEventListener('click', clickHandler);
    };
  }, [handleResize, handleCanvasClick]);

  // Update sun position when it changes
  useEffect(() => {
    if (!sunLightRef.current) return;

    const sunLight = sunLightRef.current;
    const sunAzimuth = (sunPosition.azimuthDegrees - 90) * Math.PI / 180;
    const sunAltitude = Math.max(sunPosition.altitudeDegrees * Math.PI / 180, 0);
    
    sunLight.position.set(
      Math.cos(sunAltitude) * Math.cos(sunAzimuth) * 50,
      Math.sin(sunAltitude) * 50,
      Math.cos(sunAltitude) * Math.sin(sunAzimuth) * 50
    );
    
    sunLight.intensity = sunPosition.altitudeDegrees > 0 ? 1.0 : 0.3;

  }, [sunPosition]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      if (rendererRef.current) {
        const canvas = rendererRef.current.domElement;
        if (canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
        rendererRef.current.dispose();
      }
    };
  }, []);

  if (error) {
    return (
      <div className="webgl-error">
        <p>⚠️ {error}</p>
        <p>Your browser may not support WebGL or THREE.js failed to load.</p>
        <div className="webgl-fallback">
          <h4>🏟️ {stadium.name}</h4>
          <p>3D visualization is not available, but you can still view sun exposure data below.</p>
          <div className="sun-info-fallback">
            <span className="sun-position">
              ☀️ {Math.round(sunPosition.azimuthDegrees)}° / {Math.round(sunPosition.altitudeDegrees)}°
            </span>
            <span className="sun-description">
              {sunPosition.altitudeDegrees > 0 ? 'Daytime' : 'Nighttime'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="webgl-loading">
        <div className="loading-spinner"></div>
        <p>Loading 3D stadium visualization...</p>
        <p className="loading-details">Optimizing for your device...</p>
      </div>
    );
  }

  return (
    <div className="webgl-stadium-container">
      <div
        ref={containerRef}
        className="webgl-stadium-canvas-container"
        style={{
          width: '100%',
          height: '400px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      />
      
      <div className="webgl-controls">
        <div className="stadium-info">
          <h4>🏟️ {stadium.name}</h4>
          <p>
            3D Stadium View • {sunPosition.altitudeDegrees > 0 ? 'Daytime' : 'Nighttime'}
            {isMobile() && ' • Mobile Optimized'}
          </p>
        </div>
        
        <div className="performance-info">
          <div className="sun-position">
            ☀️ {Math.round(sunPosition.azimuthDegrees)}° / {Math.round(sunPosition.altitudeDegrees)}°
          </div>
          <div className="performance-indicator">
            <span className={`performance-dot ${isControlsActive ? 'active' : 'idle'}`}></span>
            {isControlsActive ? 'Interactive' : 'Idle'}
          </div>
        </div>
      </div>
      
      <div className="webgl-help">
        <p>🖱️ Click and drag to rotate • Scroll to zoom • Click sections to select</p>
      </div>
    </div>
  );
}