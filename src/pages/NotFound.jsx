import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container page narrow not-found">
      <h1>This page doesn't exist</h1>
      <p>The link may be mistyped or the page may have moved.</p>
      <div className="hero-actions">
        <Link to="/" className="btn btn-primary">
          Go to the home page
        </Link>
        <Link to="/sitemap" className="btn btn-secondary">
          See all pages
        </Link>
      </div>
    </div>
  );
}
