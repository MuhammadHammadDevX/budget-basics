import React from 'react';
import { LogoMark } from './Logo';

function greeting(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
export default function WelcomeBanner({ site }) {
  const name = site?.name || 'BudgetBasics';
  const tagline = site?.tagline || 'Small plans, better money habits.';

  return (
    <section className="welcome-banner" aria-label="Welcome">
      <div className="container welcome-inner">
        <span className="welcome-logo" aria-hidden="true">
          <LogoMark size={64} />
        </span>
        <div className="welcome-words">
          <p className="welcome-hello">{greeting()}, welcome to</p>
          <p className="welcome-name">{name}</p>
          <p className="welcome-tagline">{tagline}</p>
        </div>
        <p className="welcome-note">
          Free lessons and practice tools for students. Use sample numbers: nothing you type is saved or sent.
        </p>
      </div>
    </section>
  );
}
