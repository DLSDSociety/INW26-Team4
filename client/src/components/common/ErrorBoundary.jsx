import { Component } from 'react';

/**
 * ErrorBoundary — Implementation Task #9.
 *
 * Catches render-time errors anywhere in the child tree and shows
 * a fallback instead of a blank white screen. Error boundaries
 * MUST be class components — there is no hook equivalent.
 *
 * Wrap the app with it in main.jsx.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // In a real app you would send this to a logging service.
    console.error('ErrorBoundary caught:', error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
          <h1 className="text-5xl font-black text-red-600 mb-4">
            Something went wrong
          </h1>
          <p className="text-gray-600 mb-6 max-w-md">
            An unexpected error occurred while rendering the page.
            Try going back to the home page.
          </p>
          <button
            onClick={this.handleReload}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg
                       font-semibold hover:bg-blue-700 transition"
          >
            Back to Home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
