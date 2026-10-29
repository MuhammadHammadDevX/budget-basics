import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { findPage } from '../navigation';

export default function PageHeader({ title, intro, children }) {
  const { pathname } = useLocation();
  const page = findPage(pathname);

  return (
    <div className="page-header">
      <nav aria-label="Breadcrumb" className="breadcrumb">
        <ol>
          <li>
            <Link to="/">Home</Link>
          </li>
          {page.group && <li>{page.group.label}</li>}
          <li aria-current="page">{page.label}</li>
        </ol>
      </nav>
      <h1>{title || page.label}</h1>
      {intro && <p className="page-intro">{intro}</p>}
      {children}
    </div>
  );
}
