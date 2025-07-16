'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Stadium } from '../src/data/stadiums';

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
  const [containerReady, setContainerReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Start with false so container div renders
  const [error, setError] = useState<string | null>(null);
  const [isControlsActive, setIsControlsActive] = useState(false);
  const [debugLog, setDebugLog] = useState<string[]>(['Component initialized']);
  
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
      console.log('Starting Three.js initialization...');
      setDebugLog(prev => [...prev, 'Starting Three.js initialization...']);
      // Don't set loading to true here since container needs to be visible
      // setIsLoading(true);
      
      // Check WebGL support first
      if (!isWebGLSupported()) {
        throw new Error('WebGL is not supported in this browser');
      }
      console.log('WebGL support confirmed');
      setDebugLog(prev => [...prev, 'WebGL support confirmed']);
      
      // Dynamic import of Three.js
      console.log('Loading Three.js modules...');
      setDebugLog(prev => [...prev, 'Loading Three.js modules...']);
      
      const [threeModule, controlsModule] = await Promise.all([
        import('three'),
        import('three/examples/jsm/controls/OrbitControls.js')
      ]);
      
      const THREE = threeModule;
      const { OrbitControls } = controlsModule;
      
      console.log('THREE.js loaded successfully', { THREE: !!THREE, OrbitControls: !!OrbitControls });
      setDebugLog(prev => [...prev, 'THREE.js loaded successfully']);
      
      // Store references
      (window as any).THREE = THREE;
      (window as any).OrbitControls = OrbitControls;
      
      // Initialize the scene
      console.log('Initializing scene...');
      setDebugLog(prev => [...prev, 'Initializing scene...']);
      initializeScene(THREE, OrbitControls);
      
      // Set loading to false after successful initialization
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to initialize THREE.js:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to load 3D graphics: ${errorMessage}`);
      setIsLoading(false);
    }
  }, []);

  // Initialize THREE.js scene
  const initializeScene = useCallback((THREE: any, OrbitControls: any) => {
    console.log('initializeScene called');
    setDebugLog(prev => [...prev, 'initializeScene called']);
    console.log('containerRef.current:', containerRef.current);
    setDebugLog(prev => [...prev, `containerRef.current: ${!!containerRef.current}`]);
    
    if (!containerRef.current) {
      console.error('Container ref is null, trying querySelector...');
      setDebugLog(prev => [...prev, 'Container ref is null, trying querySelector...']);
      
      // Try to find the container with querySelector as a fallback
      console.log('Searching for container with querySelector...');
      setDebugLog(prev => [...prev, 'Searching for container with querySelector...']);
      
      const allContainerElements = document.querySelectorAll('div');
      console.log('Total div elements found:', allContainerElements.length);
      setDebugLog(prev => [...prev, `Total div elements found: ${allContainerElements.length}`]);
      
      const containerWithClass = document.querySelector('.webgl-stadium-canvas-container') as HTMLDivElement;
      const containerWithPartialClass = document.querySelector('[class*="webgl-stadium-canvas-container"]') as HTMLDivElement;
      
      console.log('Container with exact class:', !!containerWithClass);
      console.log('Container with partial class match:', !!containerWithPartialClass);
      setDebugLog(prev => [...prev, `Container with exact class: ${!!containerWithClass}`]);
      setDebugLog(prev => [...prev, `Container with partial class: ${!!containerWithPartialClass}`]);
      
      const foundContainer = containerWithClass || containerWithPartialClass;
      if (foundContainer) {
        console.log('Found container with querySelector!');
        setDebugLog(prev => [...prev, 'Found container with querySelector!']);
        (containerRef as any).current = foundContainer;
      } else {
        // Let's wait a bit and try again
        console.log('Container not found, waiting 500ms and trying again...');
        setDebugLog(prev => [...prev, 'Container not found, waiting 500ms and trying again...']);
        
        setTimeout(() => {
          const retryContainer = document.querySelector('.webgl-stadium-canvas-container') as HTMLDivElement;
          if (retryContainer) {
            console.log('Found container on retry!');
            setDebugLog(prev => [...prev, 'Found container on retry!']);
            (containerRef as any).current = retryContainer;
            // Restart initialization
            initializeThreeJS();
          } else {
            console.error('Container element not found anywhere after retry');
            setDebugLog(prev => [...prev, 'ERROR: Container element not found anywhere after retry']);
            setError('Container element not found');
          }
        }, 500);
        return;
      }
    }
    const container = containerRef.current!; // Non-null assertion since we just ensured it exists
    const config = getPerformanceConfig();
    console.log('Container dimensions:', container.clientWidth, 'x', container.clientHeight);
    console.log('Performance config:', config);
    setDebugLog(prev => [...prev, `Container dimensions: ${container.clientWidth}x${container.clientHeight}`]);

    try {
      // Scene setup
      console.log('Creating scene...');
      setDebugLog(prev => [...prev, 'Creating scene...']);
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xff0000); // Bright red to match clear color
      
      // Add a test cube to verify rendering is working
      const testGeometry = new THREE.BoxGeometry(5, 5, 5);
      const testMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 }); // Yellow cube
      const testCube = new THREE.Mesh(testGeometry, testMaterial);
      testCube.position.set(0, 10, 0);
      scene.add(testCube);
      console.log('Test cube added to scene');
      sceneRef.current = scene;
      console.log('Scene created successfully');
      setDebugLog(prev => [...prev, 'Scene created successfully']);
    } catch (err) {
      console.error('Error creating scene:', err);
      setError(`Failed to create 3D scene: ${err}`);
      return;
    }

    let camera, renderer;
    try {
      // Camera setup
      console.log('Creating camera...');
      setDebugLog(prev => [...prev, 'Creating camera...']);
      camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
      );
      camera.position.set(0, 30, 50);
      camera.lookAt(0, 0, 0);
      cameraRef.current = camera;
      console.log('Camera created successfully');
      setDebugLog(prev => [...prev, 'Camera created successfully']);

      // Renderer setup
      console.log('Creating renderer...');
      setDebugLog(prev => [...prev, 'Creating renderer...']);
      renderer = new THREE.WebGLRenderer({
        antialias: config.antialiasing,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true,
        alpha: false, // Ensure opaque background
      });
      renderer.setClearColor(0xff00ff, 1); // Bright magenta background for debugging
      
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.domElement.style.position = 'relative';
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      renderer.domElement.style.display = 'block';
      renderer.domElement.style.opacity = '1';
      renderer.domElement.style.visibility = 'visible';
      renderer.domElement.style.zIndex = '1';
      renderer.domElement.style.pointerEvents = 'auto';
      renderer.domElement.style.backgroundColor = 'purple'; // CSS fallback color
      renderer.setPixelRatio(config.pixelRatio);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = config.shadowType === 'pcf' ? THREE.PCFShadowMap : THREE.BasicShadowMap;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ReinhardToneMapping;
      renderer.toneMappingExposure = 1.0;
      
      console.log('Appending renderer to container...');
      setDebugLog(prev => [...prev, 'Appending renderer to container...']);
      
      // Clear any text content from container before appending canvas
      container.textContent = '';
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;
      
      console.log('Renderer created and appended successfully');
      setDebugLog(prev => [...prev, 'Renderer created and appended successfully']);
    } catch (err) {
      console.error('Error creating renderer:', err);
      setError(`Failed to create WebGL renderer: ${err}`);
      return;
    }

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

    // Skip complex geometry for now - just test basic rendering
    console.log('Skipping complex geometry to test basic rendering');
    setDebugLog(prev => [...prev, 'Skipping complex geometry to test basic rendering']);

    // Skip animation loop for now - just test static render
    console.log('Skipping animation loop to test static render');
    setDebugLog(prev => [...prev, 'Skipping animation loop']);

    // Test render to verify everything is working
    try {
      console.log('Performing test render...');
      setDebugLog(prev => [...prev, 'Performing test render...']);
      const scene = sceneRef.current;
      const camera = cameraRef.current;
      const renderer = rendererRef.current;
      if (scene && camera && renderer) {
        console.log('Renderer canvas:', renderer.domElement);
        console.log('Canvas dimensions:', renderer.domElement.width, 'x', renderer.domElement.height);
        console.log('Canvas style:', renderer.domElement.style.cssText);
        console.log('Scene children count:', scene.children.length);
        console.log('Canvas parent:', renderer.domElement.parentElement);
        console.log('Canvas offset:', renderer.domElement.offsetWidth, 'x', renderer.domElement.offsetHeight);
        
        setDebugLog(prev => [...prev, `Canvas dimensions: ${renderer.domElement.width}x${renderer.domElement.height}`]);
        setDebugLog(prev => [...prev, `Scene children: ${scene.children.length}`]);
        setDebugLog(prev => [...prev, `Canvas parent: ${renderer.domElement.parentElement?.className || 'none'}`]);
        setDebugLog(prev => [...prev, `Canvas visible size: ${renderer.domElement.offsetWidth}x${renderer.domElement.offsetHeight}`]);
        
        // Try raw WebGL on the Three.js canvas
        const gl = renderer.getContext();
        console.log('Got WebGL context from Three.js renderer:', !!gl);
        
        if (gl) {
          // Use raw WebGL to clear with red
          gl.clearColor(1.0, 0.0, 0.0, 1.0); // Red
          gl.clear(gl.COLOR_BUFFER_BIT);
          gl.flush();
          console.log('Raw WebGL clear on Three.js canvas completed');
          setDebugLog(prev => [...prev, 'Raw WebGL clear on Three.js canvas']);
        }
        
        console.log('Test render successful');
        setDebugLog(prev => [...prev, 'Test render successful']);
        
        // Force check canvas visibility
        const canvasCheck = container.querySelector('canvas');
        if (canvasCheck) {
          console.log('Canvas found in DOM:', canvasCheck);
          console.log('Canvas computed style:', window.getComputedStyle(canvasCheck).display);
          console.log('Canvas opacity:', window.getComputedStyle(canvasCheck).opacity);
          console.log('Canvas visibility:', window.getComputedStyle(canvasCheck).visibility);
          setDebugLog(prev => [...prev, `Canvas display: ${window.getComputedStyle(canvasCheck).display}`]);
          setDebugLog(prev => [...prev, `Canvas opacity: ${window.getComputedStyle(canvasCheck).opacity}`]);
          
          // Create a test 2D canvas to verify canvas rendering works
          const testCanvas = document.createElement('canvas');
          testCanvas.width = 200;
          testCanvas.height = 200;
          testCanvas.style.position = 'fixed';
          testCanvas.style.top = '50px';
          testCanvas.style.left = '50px';
          testCanvas.style.zIndex = '9999';
          testCanvas.style.border = '3px solid yellow';
          testCanvas.style.backgroundColor = 'white';
          
          const ctx = testCanvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = 'red';
            ctx.fillRect(0, 0, 200, 200);
            ctx.fillStyle = 'white';
            ctx.font = '20px Arial';
            ctx.fillText('Canvas Test', 10, 30);
            document.body.appendChild(testCanvas);
            console.log('Test 2D canvas added');
            setDebugLog(prev => [...prev, 'Test 2D canvas added']);
          }
          
          // Create a raw WebGL test canvas
          const webglTestCanvas = document.createElement('canvas');
          webglTestCanvas.width = 200;
          webglTestCanvas.height = 200;
          webglTestCanvas.style.position = 'fixed';
          webglTestCanvas.style.top = '50px';
          webglTestCanvas.style.right = '50px';
          webglTestCanvas.style.zIndex = '9999';
          webglTestCanvas.style.border = '3px solid blue';
          webglTestCanvas.style.backgroundColor = 'white';
          
          const gl = webglTestCanvas.getContext('webgl') as WebGLRenderingContext | null || 
                     webglTestCanvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
          if (gl && gl instanceof WebGLRenderingContext) {
            // Simple WebGL clear test
            gl.clearColor(0.0, 0.0, 1.0, 1.0); // Blue
            gl.clear(gl.COLOR_BUFFER_BIT);
            document.body.appendChild(webglTestCanvas);
            console.log('Raw WebGL test canvas added with blue clear');
            setDebugLog(prev => [...prev, 'Raw WebGL test canvas added']);
          } else {
            console.error('Could not get WebGL context for test canvas');
            setDebugLog(prev => [...prev, 'ERROR: No WebGL context for test']);
          }
          
          // Create a canvas with IDENTICAL styling to Three.js canvas
          const identicalCanvas = document.createElement('canvas');
          identicalCanvas.width = 819;
          identicalCanvas.height = 400;
          identicalCanvas.style.position = 'absolute';
          identicalCanvas.style.top = '0';
          identicalCanvas.style.left = '0';
          identicalCanvas.style.width = '100%';
          identicalCanvas.style.height = '100%';
          identicalCanvas.style.opacity = '1';
          identicalCanvas.style.visibility = 'visible';
          identicalCanvas.style.zIndex = '2'; // Higher than Three.js canvas
          identicalCanvas.style.pointerEvents = 'auto';
          identicalCanvas.style.backgroundColor = 'orange';
          
          const identicalGl = identicalCanvas.getContext('webgl') as WebGLRenderingContext | null;
          if (identicalGl) {
            identicalGl.clearColor(0.0, 1.0, 0.0, 1.0); // Green
            identicalGl.clear(identicalGl.COLOR_BUFFER_BIT);
            container.appendChild(identicalCanvas);
            console.log('Identical canvas with green clear added to container');
            setDebugLog(prev => [...prev, 'Identical canvas added to container']);
          }
          
          // Test if ANY content can show in this container
          const testDiv = document.createElement('div');
          testDiv.style.position = 'relative'; // Change from absolute
          testDiv.style.width = '200px';
          testDiv.style.height = '100px';
          testDiv.style.backgroundColor = 'yellow';
          testDiv.style.border = '3px solid black';
          testDiv.style.margin = '10px';
          testDiv.style.display = 'block';
          testDiv.innerHTML = '<h2 style="margin:0; color: black;">TEST DIV VISIBLE</h2>';
          container.appendChild(testDiv);
          console.log('Test div added to container');
          setDebugLog(prev => [...prev, 'Test div added to container']);
        } else {
          console.error('NO CANVAS FOUND IN DOM!');
          setDebugLog(prev => [...prev, 'ERROR: NO CANVAS IN DOM']);
        }
      } else {
        console.error('Missing scene, camera, or renderer for test render');
        setDebugLog(prev => [...prev, 'ERROR: Missing scene, camera, or renderer']);
      }
    } catch (err) {
      console.error('Error during test render:', err);
      setDebugLog(prev => [...prev, `ERROR during test render: ${err}`]);
    }

  }, []);

  // Create stadium geometry with LOD
  const createStadiumGeometry = useCallback((THREE: any) => {
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
    const bowlMaterial = new THREE.MeshBasicMaterial({
      color: 0x0000ff, // Bright blue stadium
      transparent: false,
      side: THREE.DoubleSide,
    });

    const stadiumMesh = new THREE.Mesh(bowlGeometry, bowlMaterial);
    stadiumMesh.position.set(0, 0, 0);
    stadiumMesh.castShadow = true;
    stadiumMesh.receiveShadow = true;
    
    scene.add(stadiumMesh);
    stadiumMeshRef.current = stadiumMesh;
    console.log('Stadium mesh added to scene');
    setDebugLog(prev => [...prev, 'Stadium mesh added to scene']);

    // Field geometry
    const fieldGeometry = new THREE.CircleGeometry(20, 32 * config.maxGeometryDetail);
    const fieldMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00, // Bright green field
    });
    
    const fieldMesh = new THREE.Mesh(fieldGeometry, fieldMaterial);
    fieldMesh.rotation.x = -Math.PI / 2;
    fieldMesh.position.y = 5;
    fieldMesh.receiveShadow = true;
    
    scene.add(fieldMesh);
    console.log('Field mesh added to scene');
    setDebugLog(prev => [...prev, 'Field mesh added to scene']);

    // Create seating sections
    createSeatingSections(THREE);

  }, []);

  // Create seating sections with click detection
  const createSeatingSections = useCallback((THREE: any) => {
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
  const setupLighting = useCallback((THREE: any) => {
    if (!sceneRef.current) return;

    const scene = sceneRef.current;
    const config = getPerformanceConfig();

    // Ambient light - increased for better visibility
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
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

    const THREE = (window as any).THREE;
    if (!THREE) return;

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

    let frameCount = 0;
    const animate = (currentTime: number) => {
      frameCount++;
      
      // Log every 60 frames to verify animation is running
      if (frameCount % 60 === 0) {
        console.log(`Animation frame ${frameCount} - just clearing red`);
      }
      
      // Just clear with red color - no scene rendering
      renderer.setClearColor(0xff0000, 1); // Bright red background
      renderer.clear();
      
      // Skip scene rendering for now to test just clear color
      // renderer.render(scene, camera);
      
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

    const THREE = (window as any).THREE;
    if (!THREE) return;

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

  // Use MutationObserver to detect when container is actually added to DOM
  React.useEffect(() => {
    console.log('MutationObserver effect triggered');
    setDebugLog(prev => [...prev, 'MutationObserver effect triggered']);
    
    // First, check if container already exists
    if (containerRef.current) {
      console.log('Container already exists!');
      setDebugLog(prev => [...prev, 'Container already exists!']);
      setContainerReady(true);
      return;
    }
    
    // Try to find container immediately with querySelector
    const existingContainer = document.querySelector('.webgl-stadium-canvas-container') as HTMLDivElement;
    if (existingContainer) {
      console.log('Container found immediately via querySelector!');
      setDebugLog(prev => [...prev, 'Container found immediately via querySelector!']);
      (containerRef as any).current = existingContainer;
      setContainerReady(true);
      return;
    }
    
    console.log('Setting up MutationObserver to watch for container...');
    setDebugLog(prev => [...prev, 'Setting up MutationObserver...']);
    
    // Create a MutationObserver to watch for the container being added
    const observer = new MutationObserver((mutations) => {
      console.log('MutationObserver detected changes');
      
      // Check if our container ref is now populated
      if (containerRef.current) {
        console.log('Container found via MutationObserver!');
        setDebugLog(prev => [...prev, 'Container found via MutationObserver!']);
        setContainerReady(true);
        observer.disconnect();
        return;
      }
      
      // Also try querySelector in case ref isn't updated yet
      const foundContainer = document.querySelector('.webgl-stadium-canvas-container') as HTMLDivElement;
      if (foundContainer) {
        console.log('Container found via MutationObserver querySelector!');
        setDebugLog(prev => [...prev, 'Container found via MutationObserver querySelector!']);
        (containerRef as any).current = foundContainer;
        setContainerReady(true);
        observer.disconnect();
        return;
      }
      
      // Also check if any added nodes are our container
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          for (const node of Array.from(mutation.addedNodes)) {
            if (node instanceof HTMLElement && 
                node.classList.contains('webgl-stadium-canvas-container')) {
              console.log('Container found in DOM via MutationObserver!');
              setDebugLog(prev => [...prev, 'Container found in DOM via MutationObserver!']);
              setContainerReady(true);
              observer.disconnect();
              return;
            }
          }
        }
      }
    });
    
    // Start observing the document for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // Initial check after a short delay to let React render
    const quickCheckId = setTimeout(() => {
      console.log('Quick check after 100ms...');
      setDebugLog(prev => [...prev, 'Quick check after 100ms...']);
      
      const foundContainer = document.querySelector('.webgl-stadium-canvas-container') as HTMLDivElement;
      if (foundContainer) {
        console.log('Container found via quick querySelector!');
        setDebugLog(prev => [...prev, 'Container found via quick querySelector!']);
        (containerRef as any).current = foundContainer;
        setContainerReady(true);
        observer.disconnect();
        clearTimeout(finalCheckId);
      }
    }, 100);

    // Final fallback timeout in case MutationObserver doesn't work
    const finalCheckId = setTimeout(() => {
      console.log('Final timeout reached, force checking container...');
      setDebugLog(prev => [...prev, 'Final timeout reached, force checking...']);
      
      // Try to find the container by class name as a last resort
      const foundContainer = document.querySelector('.webgl-stadium-canvas-container') as HTMLDivElement;
      if (foundContainer) {
        console.log('Container found via final querySelector!');
        setDebugLog(prev => [...prev, 'Container found via final querySelector!']);
        (containerRef as any).current = foundContainer;
        setContainerReady(true);
        observer.disconnect();
      } else {
        console.log('No container found anywhere, but continuing to render...');
        setDebugLog(prev => [...prev, 'WARNING: No container found after 5 seconds']);
        // Don't set error here - let the component render the container div first
      }
    }, 5000);
    
    return () => {
      observer.disconnect();
      clearTimeout(quickCheckId);
      clearTimeout(finalCheckId);
    };
  }, []);

  // Initialize when container is ready
  useEffect(() => {
    console.log('useEffect triggered, containerReady:', containerReady);
    if (containerReady) {
      console.log('Container is ready, initializing Three.js');
      setDebugLog(prev => [...prev, 'Container ready! Starting Three.js initialization']);
      initializeThreeJS();
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [containerReady, initializeThreeJS]);

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

  console.log('RENDER: OptimizedWebGLStadium render - error:', error, 'isLoading:', isLoading);

  if (error) {
    console.log('RENDER: Rendering error state:', error);
    return (
      <div className="webgl-error" style={{ padding: '20px', background: '#f44336', color: 'white', margin: '20px 0' }}>
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
        <div style={{ marginTop: '10px', borderTop: '1px solid rgba(255,255,255,0.3)', paddingTop: '10px' }}>
          <p><strong>Debug Log ({debugLog.length} entries):</strong></p>
          {debugLog.map((log, index) => (
            <p key={index} style={{ margin: '2px 0', fontSize: '12px' }}>• {log}</p>
          ))}
        </div>
      </div>
    );
  }

  if (isLoading) {
    console.log('RENDER: Rendering loading state');
    return (
      <div className="webgl-loading" style={{ padding: '20px', background: '#2196f3', color: 'white', margin: '20px 0' }}>
        <div className="loading-spinner"></div>
        <p>Loading 3D stadium visualization...</p>
        <p className="loading-details">Optimizing for your device...</p>
        <div style={{ marginTop: '10px' }}>
          <p><strong>Debug Log:</strong></p>
          {debugLog.map((log, index) => (
            <p key={index} style={{ margin: '2px 0', fontSize: '12px' }}>• {log}</p>
          ))}
        </div>
      </div>
    );
  }

  console.log('RENDER: Rendering main component');
  return (
    <div className="webgl-stadium-container">
      <div style={{ padding: '20px', background: '#f44336', color: 'white', margin: '20px 0' }}>
        <p>WEBGL: OptimizedWebGLStadium component is executing!</p>
        <p>WEBGL: Stadium: {stadium?.name}</p>
        <p>WEBGL: Sun Position: {sunPosition?.azimuthDegrees}°/{sunPosition?.altitudeDegrees}°</p>
        <p>WEBGL: Error: {error || 'None'}</p>
        <p>WEBGL: Loading: {isLoading ? 'Yes' : 'No'}</p>
        <p>WEBGL: Container ref: {containerRef.current ? 'Connected' : 'Not connected'}</p>
        <p>WEBGL: Scene ref: {sceneRef.current ? 'Created' : 'Not created'}</p>
        <p>WEBGL: Renderer ref: {rendererRef.current ? 'Created' : 'Not created'}</p>
        <p>WEBGL: Container div below: {containerRef.current ? 'EXISTS' : 'MISSING'}</p>
        <div style={{ marginTop: '10px' }}>
          <p><strong>Debug Log:</strong></p>
          {debugLog.map((log, index) => (
            <p key={index} style={{ margin: '2px 0', fontSize: '12px' }}>• {log}</p>
          ))}
        </div>
      </div>
      <div
        ref={containerRef}
        className="webgl-stadium-canvas-container"
        style={{
          width: '100%',
          height: '400px',
          border: '2px solid #00ff00',
          backgroundColor: 'red', // Make container itself red to test visibility
        }}
      >
        {!rendererRef.current && 'THREE.js Canvas Container - Waiting for initialization...'}
        <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', padding: '10px' }}>
          SIMPLE TEXT TEST - This should be visible
        </div>
      </div>
      
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