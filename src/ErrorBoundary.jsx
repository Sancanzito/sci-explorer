// components/Tools/ErrorBoundary.jsx
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Periodic Table Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-6 px-4 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">🔬</div>
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The periodic table component encountered an error.
            </p>
            <details className="text-left text-sm text-gray-500 mb-6">
              <summary>Error details</summary>
              <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded overflow-auto">
                {this.state.error?.toString()}
              </pre>
            </details>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;