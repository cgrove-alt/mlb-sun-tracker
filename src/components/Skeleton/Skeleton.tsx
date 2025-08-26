import React from 'react';
import styles from './Skeleton.module.css';

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  animation?: 'pulse' | 'wave' | 'none';
  style?: React.CSSProperties;
  count?: number;
  inline?: boolean;
}

export default function Skeleton({
  width,
  height = 14,
  className = '',
  variant = 'text',
  animation = 'wave',
  style = {},
  count = 1,
  inline = false
}: SkeletonProps) {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'circular':
        return {
          borderRadius: '50%',
          width: height,
          height: height
        };
      case 'rectangular':
        return {
          borderRadius: '4px'
        };
      case 'text':
      default:
        return {
          borderRadius: '8px'
        };
    }
  };

  const getAnimationClass = () => {
    if (animation === 'none') return '';
    return styles.block;
  };

  const skeletonStyle: React.CSSProperties = {
    width: width || '100%',
    height: typeof height === 'number' ? `${height}px` : height,
    display: inline ? 'inline-block' : 'block',
    ...getVariantStyles(),
    ...style
  };

  if (count > 1) {
    return (
      <>
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className={`${getAnimationClass()} ${className}`}
            style={{
              ...skeletonStyle,
              marginBottom: index < count - 1 ? '8px' : 0
            }}
            aria-hidden="true"
            role="presentation"
          />
        ))}
      </>
    );
  }

  return (
    <div
      className={`${getAnimationClass()} ${className}`}
      style={skeletonStyle}
      aria-hidden="true"
      role="presentation"
    />
  );
}

// Text skeleton with realistic line lengths
export function SkeletonText({
  lines = 3,
  className = '',
  spacing = 8
}: {
  lines?: number;
  className?: string;
  spacing?: number;
}) {
  const lineWidths = ['100%', '85%', '75%', '90%', '80%'];
  
  return (
    <div className={className}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          width={lineWidths[index % lineWidths.length]}
          style={{
            marginBottom: index < lines - 1 ? `${spacing}px` : 0
          }}
        />
      ))}
    </div>
  );
}

// Card skeleton preset
export function SkeletonCard({
  className = '',
  showMedia = true,
  showActions = false
}: {
  className?: string;
  showMedia?: boolean;
  showActions?: boolean;
}) {
  return (
    <div className={className} style={{ padding: '16px' }}>
      {showMedia && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height={200}
          style={{ marginBottom: '16px' }}
        />
      )}
      
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
        <Skeleton
          variant="circular"
          width={40}
          height={40}
          style={{ marginRight: '12px' }}
        />
        <div style={{ flex: 1 }}>
          <Skeleton width="60%" height={16} style={{ marginBottom: '4px' }} />
          <Skeleton width="40%" height={14} />
        </div>
      </div>
      
      <SkeletonText lines={3} />
      
      {showActions && (
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          <Skeleton width={80} height={32} />
          <Skeleton width={80} height={32} />
        </div>
      )}
    </div>
  );
}

// Table row skeleton
export function SkeletonTableRow({
  columns = 4,
  className = ''
}: {
  columns?: number;
  className?: string;
}) {
  return (
    <tr className={className}>
      {Array.from({ length: columns }).map((_, index) => (
        <td key={index} style={{ padding: '12px' }}>
          <Skeleton />
        </td>
      ))}
    </tr>
  );
}

// List item skeleton
export function SkeletonListItem({
  avatar = true,
  actions = false,
  className = ''
}: {
  avatar?: boolean;
  actions?: boolean;
  className?: string;
}) {
  return (
    <div 
      className={className}
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        padding: '12px',
        gap: '12px'
      }}
    >
      {avatar && (
        <Skeleton variant="circular" width={40} height={40} />
      )}
      
      <div style={{ flex: 1 }}>
        <Skeleton width="70%" height={16} style={{ marginBottom: '4px' }} />
        <Skeleton width="40%" height={14} />
      </div>
      
      {actions && (
        <Skeleton width={24} height={24} variant="circular" />
      )}
    </div>
  );
}