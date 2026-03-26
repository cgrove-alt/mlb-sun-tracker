import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';

interface MobileWebGLConfig {
  enableTouchControls?: boolean;
  autoRotate?: boolean;
  maxPixelRatio?: number;
  enableShadows?: boolean;
  shadowQuality?: 'low' | 'medium' | 'high';
  performanceMode?: 'battery' | 'balanced' | 'performance';
}

interface ViewportSize {
  width: number;
  height: number;
  pixelRatio: number;
}

export function useMobileWebGL(config: MobileWebGLConfig = {}) {
  const {
    enableTouchControls = true,
    autoRotate = false,
    maxPixelRatio = 2,
    enableShadows = true,
    shadowQuality = 'medium',
    performanceMode = 'balanced'
  } = config;

  const [viewportSize, setViewportSize] = useState<ViewportSize>({
    width: 0,
    height: 0,
    pixelRatio: 1
  });
  
  const [isMobile, setIsMobile] = useState(false);
  const [deviceCapabilities, setDeviceCapabilities] = useState({
    maxTextureSize: 2048,
    maxAnisotropy: 1,
    supportsSRGB: false,
    supportsWebGL2: false
  });

  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameIdRef = useRef<number | null>(null);

  // Detect mobile device and capabilities
  useEffect(() => {
    const checkDevice = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                    window.innerWidth < 768;
      setIsMobile(mobile);

      // Check WebGL capabilities
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      
      if (gl) {
        const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        const maxAnisotropy = gl.getParameter(
          gl.getExtension('EXT_texture_filter_anisotropic')?.MAX_TEXTURE_MAX_ANISOTROPY_EXT || 1
        );
        
        setDeviceCapabilities({
          maxTextureSize,
          maxAnisotropy,
          supportsSRGB: !!gl.getExtension('EXT_sRGB'),
          supportsWebGL2: !!canvas.getContext('webgl2')
        });
      }
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Get optimized renderer settings
  const getRendererSettings = useCallback(() => {
    const settings: THREE.WebGLRendererParameters = {
      antialias: !isMobile || performanceMode === 'performance',
      alpha: true,
      powerPreference: performanceMode === 'battery' ? 'low-power' : 
                       performanceMode === 'performance' ? 'high-performance' : 'default',
      preserveDrawingBuffer: false,
      stencil: false,
      depth: true
    };

    return settings;
  }, [isMobile, performanceMode]);

  // Configure renderer for mobile
  const configureRenderer = useCallback((renderer: THREE.WebGLRenderer) => {
    const pixelRatio = Math.min(window.devicePixelRatio, maxPixelRatio);
    renderer.setPixelRatio(pixelRatio);
    
    // Shadow settings based on quality
    renderer.shadowMap.enabled = enableShadows;
    if (enableShadows) {
      switch (shadowQuality) {
        case 'low':
          renderer.shadowMap.type = THREE.BasicShadowMap;
          break;
        case 'medium':
          renderer.shadowMap.type = THREE.PCFShadowMap;
          break;
        case 'high':
          renderer.shadowMap.type = THREE.PCFSoftShadowMap;
          break;
      }
    }

    // Mobile-specific optimizations
    if (isMobile) {
      renderer.sortObjects = true;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.0;
    }

    // Performance optimizations
    if (performanceMode === 'battery') {
      renderer.setAnimationLoop(null); // Disable auto-rendering
    }

    rendererRef.current = renderer;
  }, [enableShadows, shadowQuality, isMobile, performanceMode, maxPixelRatio]);

  // Handle viewport resize
  const handleResize = useCallback((container: HTMLElement, camera: THREE.Camera, renderer: THREE.WebGLRenderer) => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    const pixelRatio = Math.min(window.devicePixelRatio, maxPixelRatio);

    setViewportSize({ width, height, pixelRatio });

    // Update camera
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    // Update renderer
    renderer.setSize(width, height);
    renderer.setPixelRatio(pixelRatio);
  }, [maxPixelRatio]);

  // Touch control utilities
  const setupTouchControls = useCallback((controls: any) => {
    if (!enableTouchControls || !isMobile) return;

    // Optimize controls for mobile
    if (controls.enableDamping !== undefined) {
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
    }

    if (controls.rotateSpeed !== undefined) {
      controls.rotateSpeed = 0.5;
    }

    if (controls.zoomSpeed !== undefined) {
      controls.zoomSpeed = 0.8;
    }

    if (controls.panSpeed !== undefined) {
      controls.panSpeed = 0.5;
    }

    // Touch-specific settings
    if (controls.touches !== undefined) {
      controls.touches = {
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN
      };
    }

    // Auto-rotate for engagement
    if (autoRotate && controls.autoRotate !== undefined) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 1.0;
    }
  }, [enableTouchControls, isMobile, autoRotate]);

  // Performance monitoring
  const createPerformanceMonitor = useCallback(() => {
    let lastTime = performance.now();
    let frames = 0;
    let fps = 60;

    return {
      begin: () => {
        frames++;
      },
      end: () => {
        const currentTime = performance.now();
        if (currentTime >= lastTime + 1000) {
          fps = (frames * 1000) / (currentTime - lastTime);
          frames = 0;
          lastTime = currentTime;

          // Adjust quality based on performance
          if (fps < 30 && rendererRef.current) {
            const currentPixelRatio = rendererRef.current.getPixelRatio();
            if (currentPixelRatio > 1) {
              rendererRef.current.setPixelRatio(Math.max(1, currentPixelRatio - 0.5));
            }
          }
        }
      },
      getFPS: () => fps
    };
  }, []);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (frameIdRef.current) {
      cancelAnimationFrame(frameIdRef.current);
    }
    if (rendererRef.current) {
      rendererRef.current.dispose();
      rendererRef.current = null;
    }
  }, []);

  return {
    isMobile,
    viewportSize,
    deviceCapabilities,
    getRendererSettings,
    configureRenderer,
    handleResize,
    setupTouchControls,
    createPerformanceMonitor,
    cleanup,
    canvasRef
  };
}

// Utility hook for mobile-optimized materials
export function useMobileMaterials() {
  const { isMobile } = useMobileWebGL();

  const createOptimizedMaterial = useCallback((options: any) => {
    const baseOptions = {
      ...options,
      // Reduce texture resolution on mobile
      map: options.map ? options.map : undefined,
      // Disable expensive effects on mobile
      envMapIntensity: isMobile ? 0.5 : 1.0,
      roughness: isMobile ? Math.max(0.5, options.roughness || 0.5) : options.roughness,
      metalness: isMobile ? Math.min(0.5, options.metalness || 0.5) : options.metalness
    };

    if (isMobile) {
      // Use simpler materials on mobile
      return new THREE.MeshStandardMaterial(baseOptions);
    }

    return new THREE.MeshPhysicalMaterial({
      ...baseOptions,
      clearcoat: options.clearcoat || 0,
      clearcoatRoughness: options.clearcoatRoughness || 0.1
    });
  }, [isMobile]);

  return { createOptimizedMaterial };
}