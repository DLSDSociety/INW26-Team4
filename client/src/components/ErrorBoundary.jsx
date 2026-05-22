import { Component } from 'react';
 
// Catches render errors in its child tree and shows a
// fallback instead of unmounting the whole React app.
// NOTE: does NOT catch errors in event handlers or async
// code — those are handled by try/catch + toast.
class ErrorBoundary extends Component {
  state = { hasError: false };
 
  static getDerivedStateFromError() {
    return { hasError: true };
  }
 
  componentDidCatch(error, info) {
    // In a real app this is where you'd log to Sentry etc.
    console.error('Render error caught by boundary:', error, info);
  }
 
  handleReset = () => {
    this.setState({ hasError: false });
    window.location.assign('/');
  };
 
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center
                        justify-center text-center px-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Something went wrong
          </h1>
          <p className="text-gray-500 mt-2 max-w-md">
            An unexpected error occurred. Try reloading the page.
          </p>
          <button
            onClick={this.handleReset}
            className="mt-6 px-5 py-2.5 rounded-lg bg-blue-600
                       text-white font-medium hover:bg-blue-700"
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

