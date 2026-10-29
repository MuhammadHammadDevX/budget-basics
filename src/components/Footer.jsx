import React from 'react';
import { Link } from 'react-router-dom';
import { FOOTER_LINKS, NAV_GROUPS } from '../navigation';
import Icon from './Icon';
import Logo from './Logo';

export default function Footer({ site }) {
  const contact = site?.contact;
  const toTop = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    document.getElementById('main')?.focus({ preventScroll: true });
  };

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Logo tagline={site?.tagline} />
          <p>
            An educational website about student budgeting. BudgetBasics is not a bank and does not handle real money,
            transactions or stored financial records.
          </p>
        </div>

        {NAV_GROUPS.map((group) => (
          <nav key={group.id} aria-label={group.label} className="footer-col">
            <h2 className="footer-heading">{group.label}</h2>
            <ul>
              {group.links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="container footer-bottom">
        <nav aria-label="Footer" className="footer-links">
          <ul>
            {FOOTER_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        {contact && (
          <p className="footer-contact">
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
            <span aria-hidden="true"> / </span>
            <a href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</a>
          </p>
        )}
        <button type="button" className="btn btn-quiet back-to-top-inline" onClick={toTop}>
          <Icon name="arrowUp" size={16} />
          Back to top
        </button>
      </div>
      <p className="container footer-copy">
        © {new Date().getFullYear()} BudgetBasics. A student project for the NextGen BudgetBee theme. All amounts are
        sample values for learning.
      </p>
    </footer>
  );
}
