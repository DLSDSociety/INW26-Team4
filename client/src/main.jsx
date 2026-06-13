import { Toaster } from 'react-hot-toast';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import ErrorBoundary from './components/common/ErrorBoundary';
import './index.css';

/**
 * Entry point — Step 13.
 *
 * Wrap order matters:
 *   ErrorBoundary → Provider → BrowserRouter → App
 *
 * Provider must be OUTSIDE BrowserRouter so Redux state is
 * available to every component, including ones that use
 * react-router hooks.
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <BrowserRouter>
          <App />
          <Toaster
          position="top-right"
          toastOptions={{ duration: 3500 }}
        />
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>
);
