/**
 * Error Boundary utility for React adapters.
 *
 * Provides graceful error handling for design system components,
 * preventing component errors from crashing the entire application.
 *
 * @example
 * ```tsx
 * import { ErrorBoundary, withErrorBoundary } from "@ds/react";
 *
 * // Use as a component wrapper
 * <ErrorBoundary fallback={<div>Component error</div>}>
 *   <Dialog>...</Dialog>
 * </ErrorBoundary>
 *
 * // Or as a higher-order component
 * const SafeDialog = withErrorBoundary(Dialog, {
 *   fallback: <div>Dialog failed to load</div>,
 * });
 * ```
 */

import { Component, type ComponentType, type ReactNode } from "react";

// =============================================================================
// Types
// =============================================================================

export interface ErrorBoundaryProps {
  /** Child components to wrap */
  children: ReactNode;
  /** Fallback UI to show on error */
  fallback?: ReactNode | ((error: Error, resetError: () => void) => ReactNode);
  /** Callback when an error is caught */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  /** Reset key - changing this resets the error state */
  resetKey?: string | number;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// =============================================================================
// ErrorBoundary Component
// =============================================================================

/**
 * Error boundary component that catches JavaScript errors in child components.
 *
 * Features:
 * - Catches errors during rendering, lifecycle, and constructors
 * - Provides fallback UI instead of crashing
 * - Supports error recovery via resetKey or resetError callback
 * - Logs errors for debugging
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error details in development
    if (process.env.NODE_ENV !== "production") {
      console.error("[DS ErrorBoundary] Component error:", error);
      console.error("[DS ErrorBoundary] Component stack:", errorInfo.componentStack);
    }

    // Call error callback if provided
    this.props.onError?.(error, errorInfo);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    // Reset error state when resetKey changes
    if (
      this.state.hasError &&
      prevProps.resetKey !== this.props.resetKey
    ) {
      this.setState({ hasError: false, error: null });
    }
  }

  resetError = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      const { fallback } = this.props;

      // If fallback is a function, call it with error and reset callback
      if (typeof fallback === "function" && this.state.error) {
        return fallback(this.state.error, this.resetError);
      }

      // If fallback is provided, render it
      if (fallback) {
        return fallback;
      }

      // Default fallback
      return null;
    }

    return this.props.children;
  }
}

// =============================================================================
// Higher-Order Component
// =============================================================================

export interface WithErrorBoundaryOptions {
  /** Fallback UI to show on error */
  fallback?: ReactNode | ((error: Error, resetError: () => void) => ReactNode);
  /** Callback when an error is caught */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

/**
 * Higher-order component that wraps a component with an ErrorBoundary.
 *
 * @example
 * ```tsx
 * const SafeDialog = withErrorBoundary(Dialog, {
 *   fallback: <div>Failed to load dialog</div>,
 *   onError: (error) => reportError(error),
 * });
 * ```
 */
export function withErrorBoundary<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithErrorBoundaryOptions = {}
): ComponentType<P> {
  const { fallback, onError } = options;

  const displayName = WrappedComponent.displayName || WrappedComponent.name || "Component";

  const WithErrorBoundaryComponent = (props: P) => (
    <ErrorBoundary fallback={fallback} onError={onError}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );

  WithErrorBoundaryComponent.displayName = `withErrorBoundary(${displayName})`;

  return WithErrorBoundaryComponent;
}

// =============================================================================
// Hook for accessing error boundary
// =============================================================================

/**
 * Default error fallback component for design system components.
 *
 * Provides a simple error message in development and nothing in production.
 */
export function DSErrorFallback({
  error,
  componentName,
}: {
  error: Error;
  componentName?: string;
}): ReactNode {
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <div
      style={{
        padding: "12px 16px",
        borderRadius: "4px",
        backgroundColor: "#fef2f2",
        border: "1px solid #fecaca",
        color: "#991b1b",
        fontSize: "14px",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <strong>
        {componentName ? `${componentName} Error` : "Component Error"}:
      </strong>{" "}
      {error.message}
    </div>
  );
}
