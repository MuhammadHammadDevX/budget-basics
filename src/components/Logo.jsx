import React from 'react';

export function LogoMark({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <path d="M6 22 Q19 17 32 24 Q45 17 58 22 V52 Q45 47 32 54 Q19 47 6 52 Z" fill="#1B7F79" />
      <path d="M10 25 Q20 21 30 27 V49 Q20 44 10 48 Z" fill="#E7F3EF" />
      <path d="M54 25 Q44 21 34 27 V49 Q44 44 54 48 Z" fill="#E7F3EF" />
      <rect x="14" y="38" width="4" height="7" rx="1" fill="#17324D" />
      <rect x="20" y="34" width="4" height="11" rx="1" fill="#17324D" />
      <circle cx="44" cy="15" r="11" fill="#E8A317" stroke="#17324D" strokeWidth="2" />
      <path
        d="M44 9 v12 M47 11.5 h-4.2 a2.2 2.2 0 0 0 0 4.4 h2.4 a2.2 2.2 0 0 1 0 4.4 H41"
        fill="none"
        stroke="#17324D"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Logo({ tagline }) {
  return (
    <span className="logo">
      <LogoMark />
      <span className="logo-words">
        <span className="logo-name">
          <span className="logo-budget">Budget</span>
          <span className="logo-basics">Basics</span>
        </span>
        {tagline && <span className="logo-tagline">{tagline}</span>}
      </span>
    </span>
  );
}
