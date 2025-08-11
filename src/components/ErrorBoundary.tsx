import React, { Component, ReactNode } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  errorInfo: string | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: React.ComponentType<{ error?: string }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

const DefaultFallback: React.FC<{ error?: string }> = ({ error }) => (
  <div className="fixed inset-0 -z-10 bg-gradient-to-br from-primary-blue via-dark-blue to-primary-blue">
    {/* Fallback background when component fails */}
  </div>
);

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorInfo: error.message
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultFallback;
      return <FallbackComponent error={this.state.errorInfo || undefined} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;