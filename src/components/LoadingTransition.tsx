import React, { ReactNode } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './LoadingTransition.css';

interface LoadingTransitionProps {
  loading: boolean;
  error?: Error | null;
  loadingComponent: ReactNode;
  errorComponent?: ReactNode;
  children: ReactNode;
  transitionDuration?: number;
  className?: string;
}

export const LoadingTransition: React.FC<LoadingTransitionProps> = ({
  loading,
  error,
  loadingComponent,
  errorComponent,
  children,
  transitionDuration = 300,
  className = ''
}) => {
  const getContent = () => {
    if (loading) return { key: 'loading', content: loadingComponent };
    if (error && errorComponent) return { key: 'error', content: errorComponent };
    return { key: 'content', content: children };
  };

  const { key, content } = getContent();

  return (
    <TransitionGroup className={`loading-transition-container ${className}`}>
      <CSSTransition
        key={key}
        timeout={transitionDuration}
        classNames="loading-transition"
      >
        <div className="loading-transition-content">
          {content}
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
};

interface CrossfadeTransitionProps {
  show: boolean;
  children: ReactNode;
  duration?: number;
  className?: string;
}

export const CrossfadeTransition: React.FC<CrossfadeTransitionProps> = ({
  show,
  children,
  duration = 300,
  className = ''
}) => {
  return (
    <CSSTransition
      in={show}
      timeout={duration}
      classNames="crossfade"
      unmountOnExit
    >
      <div className={`crossfade-content ${className}`}>
        {children}
      </div>
    </CSSTransition>
  );
};

// Generic over the item type: `any[]` here meant `renderItem`/`keyExtractor`
// received untyped items, so every call site silently lost type-checking on the
// data it was rendering.
interface StaggeredListTransitionProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor: (item: T, index: number) => string | number;
  staggerDelay?: number;
  duration?: number;
  className?: string;
}

export const StaggeredListTransition = <T,>({
  items,
  renderItem,
  keyExtractor,
  staggerDelay = 50,
  duration = 300,
  className = ''
}: StaggeredListTransitionProps<T>) => {
  return (
    <TransitionGroup className={`staggered-list ${className}`}>
      {items.map((item, index) => (
        <CSSTransition
          key={keyExtractor(item, index)}
          timeout={duration + (index * staggerDelay)}
          classNames="staggered-item"
        >
          <div 
            className="staggered-item-wrapper"
            style={{ transitionDelay: `${index * staggerDelay}ms` }}
          >
            {renderItem(item, index)}
          </div>
        </CSSTransition>
      ))}
    </TransitionGroup>
  );
};

interface SkeletonTransitionProps {
  loading: boolean;
  skeleton: ReactNode;
  children: ReactNode;
  duration?: number;
  className?: string;
}

export const SkeletonTransition: React.FC<SkeletonTransitionProps> = ({
  loading,
  skeleton,
  children,
  duration = 300,
  className = ''
}) => {
  return (
    <div className={`skeleton-transition ${className}`}>
      <div className={`skeleton-transition-layer ${loading ? 'visible' : 'hidden'}`}>
        {skeleton}
      </div>
      <div className={`skeleton-transition-layer ${!loading ? 'visible' : 'hidden'}`}>
        {children}
      </div>
    </div>
  );
};