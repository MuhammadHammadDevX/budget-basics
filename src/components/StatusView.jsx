import React from 'react';
import { useData } from '../context/DataContext';

export default function StatusView({ children }) {
  const { status, error, reload } = useData();

  if (status === 'loading') {
    return (
      <div className="status-view" role="status">
        <span className="spinner" aria-hidden="true" />
        Loading content..
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="status-view is-error" role="alert">
        <p>
          <strong>The learning content didn't load.</strong> {error}
        </p>
        <p>Check that the site is running through a local server (npm run dev), then try again.</p>
        <button type="button" className="btn btn-primary" onClick={reload}>
          Try again
        </button>
      </div>
    );
  }

  return children;
}
