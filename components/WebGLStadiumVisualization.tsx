'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Stadium } from '../src/data/stadiums';

interface WebGLStadiumVisualizationProps {
  stadium: Stadium;
  sunPosition: { azimuthDegrees: number; altitudeDegrees: number };
  gameDateTime: Date;
  selectedSections?: string[];
  onSectionClick?: (sectionId: string) => void;
}

interface StadiumGeometry {
  vertices: Float32Array;
  indices: Uint16Array;
  colors: Float32Array;
}

export default function WebGLStadiumVisualization({
  stadium,
  sunPosition,
  gameDateTime,
  selectedSections = [],
  onSectionClick,
}: WebGLStadiumVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gl, setGl] = useState<WebGLRenderingContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // WebGL shader sources
  const vertexShaderSource = `
    attribute vec3 a_position;
    attribute vec3 a_color;
    uniform mat4 u_modelViewMatrix;
    uniform mat4 u_projectionMatrix;
    uniform vec3 u_sunDirection;
    uniform float u_sunIntensity;
    
    varying vec3 v_color;
    varying float v_lighting;
    
    void main() {
      gl_Position = u_projectionMatrix * u_modelViewMatrix * vec4(a_position, 1.0);
      
      // Calculate simple lighting based on sun position
      vec3 normal = normalize(vec3(0.0, 1.0, 0.0)); // Simplified normal
      float lightDot = max(dot(normal, u_sunDirection), 0.0);
      v_lighting = 0.3 + 0.7 * lightDot * u_sunIntensity;
      
      v_color = a_color;
    }
  `;

  const fragmentShaderSource = `
    precision mediump float;
    
    varying vec3 v_color;
    varying float v_lighting;
    
    void main() {
      gl_FragColor = vec4(v_color * v_lighting, 1.0);
    }
  `;

  // Initialize WebGL
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!context) {
      setError('WebGL is not supported in this browser');
      setIsLoading(false);
      return;
    }

    setGl(context as WebGLRenderingContext);
    setIsLoading(false);
  }, []);

  // Create shader
  const createShader = (gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null => {
    const shader = gl.createShader(type);
    if (!shader) return null;

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  };

  // Create shader program
  const createProgram = (gl: WebGLRenderingContext): WebGLProgram | null => {
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertexShader || !fragmentShader) return null;

    const program = gl.createProgram();
    if (!program) return null;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }

    return program;
  };

  // Generate stadium geometry
  const generateStadiumGeometry = (): StadiumGeometry => {
    const vertices: number[] = [];
    const indices: number[] = [];
    const colors: number[] = [];

    // Create a simplified stadium bowl
    const sections = 32;
    const radius = 1.0;
    const height = 0.5;

    // Generate vertices for the stadium bowl
    for (let i = 0; i <= sections; i++) {
      const angle = (i / sections) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      // Bottom ring
      vertices.push(x, 0, z);
      colors.push(0.3, 0.7, 0.3); // Green field color

      // Top ring
      vertices.push(x, height, z);
      colors.push(0.8, 0.8, 0.8); // Gray seating color
    }

    // Generate indices for triangles
    for (let i = 0; i < sections; i++) {
      const bottom1 = i * 2;
      const top1 = i * 2 + 1;
      const bottom2 = (i + 1) * 2;
      const top2 = (i + 1) * 2 + 1;

      // Two triangles per section
      indices.push(bottom1, top1, bottom2);
      indices.push(bottom2, top1, top2);
    }

    return {
      vertices: new Float32Array(vertices),
      indices: new Uint16Array(indices),
      colors: new Float32Array(colors),
    };
  };

  // Create matrix operations
  const createMatrix4 = () => {
    return new Float32Array(16);
  };

  const perspective = (fov: number, aspect: number, near: number, far: number): Float32Array => {
    const f = 1.0 / Math.tan(fov / 2);
    const rangeInv = 1.0 / (near - far);

    return new Float32Array([
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (near + far) * rangeInv, -1,
      0, 0, near * far * rangeInv * 2, 0
    ]);
  };

  const lookAt = (eye: [number, number, number], target: [number, number, number], up: [number, number, number]): Float32Array => {
    const zAxis = [
      eye[0] - target[0],
      eye[1] - target[1],
      eye[2] - target[2]
    ];
    const zLen = Math.sqrt(zAxis[0] * zAxis[0] + zAxis[1] * zAxis[1] + zAxis[2] * zAxis[2]);
    zAxis[0] /= zLen;
    zAxis[1] /= zLen;
    zAxis[2] /= zLen;

    const xAxis = [
      up[1] * zAxis[2] - up[2] * zAxis[1],
      up[2] * zAxis[0] - up[0] * zAxis[2],
      up[0] * zAxis[1] - up[1] * zAxis[0]
    ];
    const xLen = Math.sqrt(xAxis[0] * xAxis[0] + xAxis[1] * xAxis[1] + xAxis[2] * xAxis[2]);
    xAxis[0] /= xLen;
    xAxis[1] /= xLen;
    xAxis[2] /= xLen;

    const yAxis = [
      zAxis[1] * xAxis[2] - zAxis[2] * xAxis[1],
      zAxis[2] * xAxis[0] - zAxis[0] * xAxis[2],
      zAxis[0] * xAxis[1] - zAxis[1] * xAxis[0]
    ];

    return new Float32Array([
      xAxis[0], yAxis[0], zAxis[0], 0,
      xAxis[1], yAxis[1], zAxis[1], 0,
      xAxis[2], yAxis[2], zAxis[2], 0,
      -(xAxis[0] * eye[0] + xAxis[1] * eye[1] + xAxis[2] * eye[2]),
      -(yAxis[0] * eye[0] + yAxis[1] * eye[1] + yAxis[2] * eye[2]),
      -(zAxis[0] * eye[0] + zAxis[1] * eye[1] + zAxis[2] * eye[2]),
      1
    ]);
  };

  // Render function
  const render = (gl: WebGLRenderingContext, program: WebGLProgram) => {
    const canvas = gl.canvas as HTMLCanvasElement;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Generate geometry
    const geometry = generateStadiumGeometry();

    // Create buffers
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, geometry.vertices, gl.STATIC_DRAW);

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, geometry.colors, gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, geometry.indices, gl.STATIC_DRAW);

    // Get attribute and uniform locations
    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    const colorAttributeLocation = gl.getAttribLocation(program, 'a_color');
    const modelViewMatrixLocation = gl.getUniformLocation(program, 'u_modelViewMatrix');
    const projectionMatrixLocation = gl.getUniformLocation(program, 'u_projectionMatrix');
    const sunDirectionLocation = gl.getUniformLocation(program, 'u_sunDirection');
    const sunIntensityLocation = gl.getUniformLocation(program, 'u_sunIntensity');

    // Set up attributes
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.enableVertexAttribArray(colorAttributeLocation);
    gl.vertexAttribPointer(colorAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    // Set up matrices
    const aspect = canvas.width / canvas.height;
    const projectionMatrix = perspective(45 * Math.PI / 180, aspect, 0.1, 100);
    const modelViewMatrix = lookAt([0, 2, 3], [0, 0, 0], [0, 1, 0]);

    // Calculate sun direction from sun position
    const sunAzimuth = (sunPosition.azimuthDegrees - 90) * Math.PI / 180; // Convert to radians and adjust
    const sunAltitude = sunPosition.altitudeDegrees * Math.PI / 180;
    const sunDirection = [
      Math.cos(sunAltitude) * Math.cos(sunAzimuth),
      Math.sin(sunAltitude),
      Math.cos(sunAltitude) * Math.sin(sunAzimuth)
    ];

    // Set uniforms
    gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLocation, false, modelViewMatrix);
    gl.uniform3fv(sunDirectionLocation, sunDirection);
    gl.uniform1f(sunIntensityLocation, sunPosition.altitudeDegrees > 0 ? 1.0 : 0.3);

    // Draw
    gl.drawElements(gl.TRIANGLES, geometry.indices.length, gl.UNSIGNED_SHORT, 0);
  };

  // Animation loop
  useEffect(() => {
    if (!gl || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const resizeCanvas = () => {
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
      }
    };

    const program = createProgram(gl);
    if (!program) {
      setError('Failed to create WebGL program');
      return;
    }

    gl.useProgram(program);
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.5, 0.8, 1.0, 1.0); // Sky blue background

    let animationId: number;
    const animate = () => {
      resizeCanvas();
      render(gl, program);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [gl, sunPosition, selectedSections]);

  // Handle canvas click
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onSectionClick) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Simple click detection - in a real implementation you'd do ray casting
    const normalizedX = (x / canvas.width) * 2 - 1;
    const normalizedY = -((y / canvas.height) * 2 - 1);

    // For demo purposes, create a simple section ID based on click position
    const angle = Math.atan2(normalizedY, normalizedX);
    const sectionId = `section-${Math.floor(((angle + Math.PI) / (2 * Math.PI)) * 32)}`;
    
    onSectionClick(sectionId);
  };

  if (error) {
    return (
      <div className="webgl-error">
        <p>⚠️ {error}</p>
        <p>Your browser may not support WebGL or it may be disabled.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="webgl-loading">
        <p>Loading 3D stadium visualization...</p>
      </div>
    );
  }

  return (
    <div className="webgl-stadium-container">
      <canvas
        ref={canvasRef}
        className="webgl-stadium-canvas"
        onClick={handleCanvasClick}
        style={{
          width: '100%',
          height: '400px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          cursor: onSectionClick ? 'pointer' : 'default',
        }}
      />
      <div className="webgl-controls">
        <div className="stadium-info">
          <h4>🏟️ {stadium.name}</h4>
          <p>3D Stadium View • {sunPosition.altitudeDegrees > 0 ? 'Daytime' : 'Nighttime'}</p>
        </div>
        <div className="sun-indicator">
          <div className="sun-position">
            ☀️ {Math.round(sunPosition.azimuthDegrees)}° / {Math.round(sunPosition.altitudeDegrees)}°
          </div>
        </div>
      </div>
    </div>
  );
}