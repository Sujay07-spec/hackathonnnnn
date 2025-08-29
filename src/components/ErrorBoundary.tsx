import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Application error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 circuit-bg flex items-center justify-center">
          <div className="glass-card p-8 rounded-xl text-center max-w-md border border-red-400/30">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-red-400 rounded-full blur-xl opacity-50"></div>
              <div className="relative p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-full border border-red-400/30">
                <AlertTriangle size={48} className="text-red-400 mx-auto" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-red-400 mb-4 font-tech uppercase tracking-wider">
              System Malfunction
            </h2>
            
            <p className="text-slate-300 mb-6">
              A critical error occurred in the management system. Please restart to continue.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={this.handleReset}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-900 rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all duration-200 font-bold shadow-lg neon-glow font-tech uppercase tracking-wider"
              >
                <RefreshCw size={16} />
                Restart System
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="w-full px-6 py-3 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700/50 transition-all duration-200 font-bold uppercase tracking-wider"
              >
                Full System Reload
              </button>
            </div>
            
            {this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-slate-400 cursor-pointer text-sm font-bold uppercase tracking-wider">
                  Error Details
                </summary>
                <pre className="mt-2 p-3 bg-slate-800 rounded text-xs text-red-300 overflow-auto">
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}