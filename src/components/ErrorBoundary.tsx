import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorIcon } from './Icons';
import './ErrorBoundary.css';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKeys?: Array<string | number>;
  resetOnPropsChange?: boolean;
  isolate?: boolean;
  level?: 'page' | 'section' | 'component';
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  private resetTimeoutId: number | null = null;
  private previousResetKeys: Array<string | number> = [];

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    };
    if (props.resetKeys) {
      this.previousResetKeys = props.resetKeys;
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidUpdate(prevProps: Props) {
    const { resetKeys, resetOnPropsChange } = this.props;
    const { hasError } = this.state;
    
    // Reset error boundary when resetKeys change
    if (hasError && prevProps.resetKeys !== resetKeys) {
      if (resetKeys && resetKeys.some((key, idx) => key !== this.previousResetKeys[idx])) {
        this.handleReset();
        this.previousResetKeys = resetKeys;
      }
    }
    
    // Reset on any props change if specified
    if (hasError && resetOnPropsChange && prevProps.children !== this.props.children) {
      this.handleReset();
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
    
    // Update state with error details
    this.setState({
      error,
      errorInfo
    });
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    // Auto-retry for transient errors (network issues, etc)
    if (this.shouldAutoRetry(error) && this.state.retryCount < 3) {
      this.scheduleRetry();
    }
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      window.clearTimeout(this.resetTimeoutId);
    }
  }

  shouldAutoRetry(error: Error): boolean {
    // Auto-retry for network errors and loading failures
    const message = error.message.toLowerCase();
    return (
      message.includes('network') ||
      message.includes('fetch') ||
      message.includes('load') ||
      message.includes('timeout')
    );
  }

  scheduleRetry = () => {
    const retryDelay = Math.min(1000 * Math.pow(2, this.state.retryCount), 5000);
    this.resetTimeoutId = window.setTimeout(() => {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1
      }));
    }, retryDelay);
  };

  handleReset = () => {
    if (this.resetTimeoutId) {
      window.clearTimeout(this.resetTimeoutId);
      this.resetTimeoutId = null;
    }
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    });
  };

  getErrorMessage(): string {
    const { error } = this.state;
    const { level = 'component' } = this.props;
    
    if (!error) return 'Something unexpected happened.';
    
    const message = error.message.toLowerCase();
    
    // User-friendly messages based on error type
    if (message.includes('network') || message.includes('fetch')) {
      return 'Unable to connect to the server. Please check your internet connection.';
    }
    if (message.includes('timeout')) {
      return 'The request took too long. Please try again.';
    }
    if (message.includes('not found') || message.includes('404')) {
      return 'The requested data could not be found.';
    }
    if (message.includes('permission') || message.includes('unauthorized')) {
      return 'You don\'t have permission to access this resource.';
    }
    if (message.includes('stadium') || message.includes('game')) {
      return 'Unable to load stadium or game data. Please try again.';
    }
    
    // Level-specific messages
    switch (level) {
      case 'page':
        return 'This page encountered an error. Please refresh to try again.';
      case 'section':
        return 'This section could not be loaded properly.';
      default:
        return 'This component encountered an error.';
    }
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return <>{this.props.fallback}</>;
      }

      // Default error UI
      const { level = 'component', isolate } = this.props;
      const { retryCount } = this.state;
      const errorMessage = this.getErrorMessage();
      
      return (
        <div className={`error-boundary-container error-boundary-${level} ${isolate ? 'error-boundary-isolated' : ''}`}>
          <div className="error-boundary-content">
            <div className="error-icon">
              <ErrorIcon size={level === 'page' ? 64 : 48} color="var(--color-error)" />
            </div>
            <h2 className="error-title">
              {level === 'page' ? 'Page Error' : 'Oops! Something went wrong'}
            </h2>
            <p className="error-message">
              {errorMessage}
            </p>
            
            {retryCount > 0 && retryCount < 3 && (
              <p className="error-retry-info">
                Retrying automatically... (Attempt {retryCount} of 3)
              </p>
            )}
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-details">
                <summary>Error Details (Development Only)</summary>
                <pre className="error-stack">
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
            
            <div className="error-actions">
              {level === 'page' ? (
                <button
                  onClick={() => window.location.reload()}
                  className="error-btn primary"
                >
                  Refresh Page
                </button>
              ) : (
                <>
                  <button
                    onClick={this.handleReset}
                    className="error-btn primary"
                    disabled={retryCount > 0 && retryCount < 3}
                  >
                    Try Again
                  </button>
                  {level === 'section' && (
                    <button
                      onClick={() => window.location.reload()}
                      className="error-btn secondary"
                    >
                      Refresh Page
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook to use with functional components
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}