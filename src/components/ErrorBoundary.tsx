import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    // Safe console logging for diagnostics
    console.error('[RAWF Portal ErrorBoundary caught runtime error]:', error, errorInfo);
  }

  private handleReload = (): void => {
    window.location.reload();
  };

  private handleGoHome = (): void => {
    window.location.href = '/';
  };

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 text-slate-100 font-sans">
          <div className="max-w-lg w-full bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6 sm:p-8 text-center relative overflow-hidden">
            {/* Top decorative accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-amber-500 to-blue-600" />

            {/* Icon */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 rounded-full bg-red-950/60 border border-red-800/60 flex items-center justify-center shadow-lg">
              <ShieldAlert className="w-8 h-8 sm:w-10 sm:h-10 text-red-500 animate-pulse" />
            </div>

            {/* Header / Title */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-mono text-amber-400 mb-4">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Institutional Portal Exception Guard</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2">
              Something Went Wrong
            </h1>
            
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              The RAWF portal encountered an unexpected runtime issue while rendering this section. Our system safeguard has prevented further interruption.
            </p>

            {/* Error Message Snippet (Safe for debugging) */}
            {this.state.error?.message && (
              <div className="mb-6 p-3 rounded-lg bg-slate-950 border border-slate-800 text-left overflow-hidden">
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">
                  Diagnostics Reference
                </div>
                <div className="text-xs font-mono text-red-400 break-words line-clamp-3">
                  {this.state.error.message}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold text-sm transition-colors shadow-lg shadow-red-900/30 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Portal</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 font-semibold text-sm transition-colors border border-slate-700 cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Back to Home</span>
              </button>
            </div>

            {/* Footer Support Info */}
            <div className="mt-8 pt-4 border-t border-slate-800 text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
              <span>RAWF IT &amp; Cyber Operations</span>
              <span>Ref: ERR-{Math.random().toString(36).substring(2, 8).toUpperCase()}</span>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
