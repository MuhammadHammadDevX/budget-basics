import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { FOOTER_LINKS, NAV_GROUPS } from '../navigation';

export default function Sitemap() {
  return (
    <div className="container page">
      <PageHeader intro="Every page on BudgetBasics, grouped the same way as the main menu." />
      <div className="sitemap">
        <div className="sitemap-root">
          <Link to="/" className="sitemap-node is-root">
            Home
          </Link>
        </div>
        <ul className="sitemap-groups">
          {NAV_GROUPS.map((group) => (
            <li key={group.id} className="sitemap-group">
              <h2 className="sitemap-node is-group">{group.label}</h2>
              <ul>
                {group.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="sitemap-node">
                      <strong>{link.label}</strong>
                      <span>{link.description}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <div className="sitemap-footer">
          <h2>Footer pages</h2>
          <ul>
            {FOOTER_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
