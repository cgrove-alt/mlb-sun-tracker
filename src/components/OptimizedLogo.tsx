import React from 'react';

interface OptimizedLogoProps {
  size: 192 | 512;
  className?: string;
  alt?: string;
}

export const OptimizedLogo: React.FC<OptimizedLogoProps> = ({ 
  size, 
  className = '', 
  alt = 'Shadium Logo' 
}) => {
  // For now, use PNG files since WebP conversion requires build-time processing
  // In production, you would have .webp versions of these files
  const pngSrc = `/logo${size}.png`;
  const webpSrc = `/logo${size}.webp`; // These would be generated during build
  
  return (
    <picture>
      <source srcSet={webpSrc} type="image/webp" />
      <source srcSet={pngSrc} type="image/png" />
      <img 
        src={pngSrc} 
        alt={alt}
        className={className}
        width={size}
        height={size}
        loading="lazy"
      />
    </picture>
  );
};