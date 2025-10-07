'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  quality?: number;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  placeholder = 'blur',
  blurDataURL,
  sizes = '100vw',
  quality = 75,
}: OptimizedImageProps) {
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [priority]);

  // Generate a simple blur placeholder if not provided
  const defaultBlurDataURL = `data:image/svg+xml;base64,${Buffer.from(
    `<svg width="${width || 100}" height="${height || 100}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f0f0f0"/>
      <rect width="100%" height="100%" fill="url(#gradient)" opacity="0.5"/>
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0ea5e9"/>
          <stop offset="100%" stop-color="#fbbf24"/>
        </linearGradient>
      </defs>
    </svg>`
  ).toString('base64')}`;

  const imageProps: any = {
    src,
    alt,
    className,
    sizes,
    quality,
    ...(width && { width }),
    ...(height && { height }),
  };

  // Only add placeholder for non-priority images
  if (!priority) {
    imageProps.placeholder = placeholder;
    imageProps.blurDataURL = blurDataURL || defaultBlurDataURL;
  }

  // Fill container if no dimensions specified
  if (!width && !height) {
    imageProps.fill = true;
    imageProps.style = { objectFit: 'cover' };
  }

  return (
    <div ref={imgRef} className={`image-container ${className}`}>
      {(isInView || priority) ? (
        <Image
          {...imageProps}
          loading={priority ? 'eager' : 'lazy'}
          priority={priority}
        />
      ) : (
        <div
          className="image-placeholder"
          style={{
            width: width || '100%',
            height: height || '100%',
            background: `url(${defaultBlurDataURL}) center/cover`,
            filter: 'blur(10px)',
          }}
        />
      )}
      <style jsx>{`
        .image-container {
          position: relative;
          overflow: hidden;
        }
        .image-placeholder {
          display: block;
        }
      `}</style>
    </div>
  );
}