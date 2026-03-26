import React, { useState, useEffect } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholder?: string;
  loading?: 'lazy' | 'eager';
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  placeholder = '/images/placeholder.png',
  loading = 'lazy',
}) => {
  const [ref, isIntersecting] = useIntersectionObserver({
    threshold: 0,
    rootMargin: '50px',
  });
  
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (isIntersecting && imageSrc === placeholder) {
      // Start loading the actual image
      const img = new Image();
      img.src = src;
      
      img.onload = () => {
        setImageSrc(src);
        setImageLoaded(true);
      };
      
      img.onerror = () => {
        setHasError(true);
      };
    }
  }, [isIntersecting, src, imageSrc, placeholder]);

  return (
    <div 
      ref={ref}
      className={`optimized-image-wrapper ${className}`}
      style={{ width, height }}
    >
      <img
        src={hasError ? placeholder : imageSrc}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        className={`optimized-image ${imageLoaded ? 'loaded' : 'loading'}`}
        style={{
          opacity: imageLoaded ? 1 : 0.5,
          transition: 'opacity 0.3s ease',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    </div>
  );
};