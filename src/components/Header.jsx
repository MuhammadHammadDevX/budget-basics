import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { NAV_GROUPS } from '../navigation';
import { useDismiss, useMediaQuery } from '../utils/hooks';
import ClockAndVisitors from './ClockAndVisitors';
import Icon from './Icon';
import Logo from './Logo';

function NavGroup({ group, isMobile, openId, setOpenId }) {
  const { pathname } = useLocation();
  const ref = useRef(null);
  const buttonRef = useRef(null);
  const isOpen = openId === group.id;
  const isActive = group.links.some((l) => l.to === pathname);
  const menuId = `menu-${group.id}`;

  const close = useCallback(
    (reason) => {
      setOpenId(null);
      if (reason === 'escape') buttonRef.current?.focus();
    },
    [setOpenId]
  );
  useDismiss(ref, isOpen && !isMobile, close);

  const links = (
    <ul className="nav-sublist" id={menuId}>
      {group.links.map((link) => (
        <li key={link.to}>
          <NavLink to={link.to} className="nav-sublink">
            <span className="nav-sublink-label">{link.label}</span>
            {!isMobile && <span className="nav-sublink-desc">{link.description}</span>}
          </NavLink>
        </li>
      ))}
    </ul>
  );

  if (isMobile) {
    return (
      <li className="nav-group is-mobile">
        <p className="nav-group-heading">{group.label}</p>
        {links}
      </li>
    );
  }

  return (
    <li className={`nav-group ${isActive ? 'is-active' : ''}`} ref={ref}>
      <button
        ref={buttonRef}
        type="button"
        className="nav-group-button"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => setOpenId(isOpen ? null : group.id)}
      >
        {group.label}
        <Icon name="chevron" size={16} className={isOpen ? 'rotate' : ''} />
      </button>
      <div className="nav-dropdown" hidden={!isOpen}>
        {links}
      </div>
    </li>
  );
}

export default function Header({ site, theme, onToggleTheme }) {
  const isMobile = useMediaQuery('(max-width: 960px)');
  const [openId, setOpenId] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpenId(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMobile) setMobileOpen(false);
  }, [isMobile]);

  return (
    <header className="site-header">
      <div className="utility-bar">
        <div className="container utility-inner">
          <ClockAndVisitors visitorBase={site?.visitorBase ?? 0} />
          <div className="utility-actions">
            <Link to="/sitemap" className="utility-link">
              Sitemap
            </Link>
            <button
              type="button"
              className="theme-toggle"
              onClick={onToggleTheme}
              aria-pressed={theme === 'dark'}
            >
              <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={16} />
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </button>
          </div>
        </div>
      </div>

      <div className="container header-main">
        <Link to="/" className="logo-link" aria-label="BudgetBasics home">
          <Logo tagline={site?.tagline} />
        </Link>

        {isMobile && (
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={mobileOpen}
            aria-controls="primary-nav"
            onClick={() => setMobileOpen((o) => !o)}
          >
            <Icon name={mobileOpen ? 'close' : 'menu'} size={22} />
            <span>{mobileOpen ? 'Close' : 'Menu'}</span>
          </button>
        )}

        <nav
          id="primary-nav"
          className={`primary-nav ${isMobile ? 'is-mobile' : ''} ${mobileOpen ? 'is-open' : ''}`}
          aria-label="Main"
          hidden={isMobile && !mobileOpen}
        >
          <ul className="nav-groups">
            <li className="nav-home">
              <NavLink to="/" end className="nav-top-link">
                Home
              </NavLink>
            </li>
            {NAV_GROUPS.map((group) => (
              <NavGroup key={group.id} group={group} isMobile={isMobile} openId={openId} setOpenId={setOpenId} />
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
