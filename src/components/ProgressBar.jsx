import React from 'react';

export default function ProgressBar({ value, max = 100, label, tone = 'savings', showValue = false }) {
  const percent = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div className="progress">
      <div
        className="progress-track"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(percent)}
      >
        <div className={`progress-fill tone-${tone}`} style={{ width: `${percent}%` }} />
      </div>
      {showValue && <span className="progress-value tabular">{Math.round(percent)}%</span>}
    </div>
  );
}
