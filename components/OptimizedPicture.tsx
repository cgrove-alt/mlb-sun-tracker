import React, { useState } from 'react';
import { useIntersectionObserver } from '../src/hooks/useIntersectionObserver';

interface OptimizedPictureProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  priority?: boolean;
}

export const OptimizedPicture: React.FC<OptimizedPictureProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  sizes = '100vw',
  priority = false,
}) => {
  const [ref, isIntersecting] = useIntersectionObserver({
    threshold: 0,
    rootMargin: '50px',
  });

  const [hasError, setHasError] = useState(false);
  const shouldLoad = priority || loading === 'eager' || isIntersecting;

  // Generate optimized image paths
  const srcWithoutExt = src.replace(/\.[^/.]+$/, '');
  const srcExt = src.match(/\.[^/.]+$/)?.[0] || '.jpg';
  
  // Only use modern formats if not already optimized
  const isAlreadyOptimized = src.includes('.webp') || src.includes('.avif');
  
  const sources = isAlreadyOptimized ? [] : [
    {
      srcSet: `${srcWithoutExt}.avif`,
      type: 'image/avif',
    },
    {
      srcSet: `${srcWithoutExt}.webp`,
      type: 'image/webp',
    },
  ];

  const handleError = () => {
    setHasError(true);
  };

  return (
    <picture 
      ref={ref}
      className={`optimized-picture-wrapper ${className}`}
      style={{ width, height }}
    >
      {shouldLoad && !hasError && sources.map((source) => (
        <source
          key={source.type}
          srcSet={source.srcSet}
          type={source.type}
          sizes={sizes}
        />
      ))}
      <img
        src={shouldLoad ? src : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E'}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        onError={handleError}
        className={`optimized-image ${shouldLoad ? 'loaded' : 'loading'}`}
        style={{
          opacity: shouldLoad ? 1 : 0,
          transition: 'opacity 0.3s ease',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    </picture>
  );
};