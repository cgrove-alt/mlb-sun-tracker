import React from 'react';

// Modern pulse loading animation
export const PulseLoader: React.FC<{ size?: 'small' | 'medium' | 'large' }> = ({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <div className={`${sizeClasses[size]} bg-accent-500 rounded-full animate-pulse`} />
      <div className={`${sizeClasses[size]} bg-accent-400 rounded-full animate-pulse animation-delay-200`} />
      <div className={`${sizeClasses[size]} bg-accent-300 rounded-full animate-pulse animation-delay-400`} />
    </div>
  );
};

// Skeleton card with shimmer effect
export const SkeletonCard: React.FC = () => {
  return (
    <div className="glass-card animate-fade-in-up">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <div className="h-6 bg-gray-200 rounded-lg skeleton-shimmer w-3/4" />
            <div className="h-4 bg-gray-200 rounded-lg skeleton-shimmer w-1/2" />
          </div>
          <div className="w-12 h-12 bg-gray-200 rounded-xl skeleton-shimmer" />
        </div>
        
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded-lg skeleton-shimmer w-full" />
          <div className="h-4 bg-gray-200 rounded-lg skeleton-shimmer w-5/6" />
        </div>
        
        <div className="flex gap-2">
          <div className="h-8 bg-gray-200 rounded-full skeleton-shimmer w-20" />
          <div className="h-8 bg-gray-200 rounded-full skeleton-shimmer w-24" />
          <div className="h-8 bg-gray-200 rounded-full skeleton-shimmer w-16" />
        </div>
      </div>
    </div>
  );
};

// Stadium loading skeleton
export const StadiumSkeleton: React.FC = () => {
  return (
    <div className="animate-fade-in-up">
      {/* Header skeleton */}
      <div className="bg-white rounded-t-3xl p-6 border-b">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded-lg skeleton-shimmer w-48" />
            <div className="h-5 bg-gray-200 rounded-lg skeleton-shimmer w-32" />
          </div>
          <div className="w-24 h-10 bg-gray-200 rounded-lg skeleton-shimmer" />
        </div>
      </div>

      {/* Game selector skeleton */}
      <div className="bg-white p-6 border-b">
        <div className="flex items-center gap-4">
          <div className="h-12 bg-gray-200 rounded-lg skeleton-shimmer flex-1" />
          <div className="h-12 bg-gray-200 rounded-lg skeleton-shimmer w-32" />
        </div>
      </div>

      {/* Section cards skeleton */}
      <div className="p-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
};

// Modern spinner with gradient
export const GradientSpinner: React.FC<{ size?: 'small' | 'medium' | 'large' }> = ({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
  };

  return (
    <div className={`relative ${sizeClasses[size]}`}>
      <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-accent-400 to-primary-400 animate-spin`}>
        <div className="absolute inset-1 bg-white rounded-full" />
      </div>
      <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-accent-400 to-primary-400 animate-pulse`} />
    </div>
  );
};

// Loading overlay with blur background
export const LoadingOverlay: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
      <div className="glass-card flex flex-col items-center gap-4 p-8">
        <GradientSpinner size="large" />
        <p className="text-gray-700 font-medium">{message}</p>
      </div>
    </div>
  );
};

// Progress bar with animation
export const ProgressBar: React.FC<{ progress: number; showLabel?: boolean }> = ({ progress, showLabel = true }) => {
  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Loading...</span>
          <span>{progress}%</span>
        </div>
      )}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-accent-400 to-accent-600 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        >
          <div className="h-full bg-white/30 animate-shimmer" />
        </div>
      </div>
    </div>
  );
};

// Dots loading indicator
export const DotsLoader: React.FC = () => {
  return (
    <div className="flex items-center gap-1">
      <div className="w-2 h-2 bg-accent-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="w-2 h-2 bg-accent-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="w-2 h-2 bg-accent-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  );
};

// Empty state with animation
export const EmptyState: React.FC<{
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}> = ({ icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 animate-fade-in-up">
      {icon && (
        <div className="mb-4 p-4 bg-gray-100 rounded-full animate-float">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-500 text-center max-w-sm mb-6">{description}</p>
      )}
      {action && (
        <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          {action}
        </div>
      )}
    </div>
  );
};

// Add CSS for animation delays
const styles = `
  @keyframes animation-delay-200 {
    animation-delay: 200ms;
  }
  
  @keyframes animation-delay-400 {
    animation-delay: 400ms;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}