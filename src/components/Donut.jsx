import React from 'react';

export default function Donut({ parts, size = 200, stroke = 34, centerTop, centerBottom }) {
  const total = parts.reduce((sum, p) => sum + p.value, 0) || 1;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <svg className="donut" width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true" focusable="false">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" className="donut-bg" strokeWidth={stroke} />
      {parts.map((part) => {
        const length = (part.value / total) * c;
        const circle = (
          <circle
            key={part.label}
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            className={`donut-part tone-${part.tone}`}
            strokeWidth={stroke}
            strokeDasharray={`${Math.max(length - 2, 0)} ${c}`}
            strokeDashoffset={-offset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        );
        offset += length;
        return circle;
      })}
      {centerTop && (
        <text x="50%" y="46%" textAnchor="middle" className="donut-top">
          {centerTop}
        </text>
      )}
      {centerBottom && (
        <text x="50%" y="60%" textAnchor="middle" className="donut-bottom">
          {centerBottom}
        </text>
      )}
    </svg>
  );
}
