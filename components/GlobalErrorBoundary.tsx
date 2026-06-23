import React, { Component, ReactNode } from 'react';
import { CrashScreen } from '@/components/ui/CrashScreen';
import { logError } from '@/utils/sentry';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * A global error boundary to catch unhandled JavaScript errors in the component tree.
 * Displays a user-friendly Crash Screen instead of closing the app.
 */
export class GlobalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error to our logging utility (which supports Sentry)
    logError(error, 'GlobalErrorBoundary');
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return <CrashScreen error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}
