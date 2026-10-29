import React, { useMemo, useState } from 'react';
import Icon from './Icon';

export default function Ticker({ quotes = [], tips = [] }) {
  const [paused, setPaused] = useState(false);

  const items = useMemo(() => {
    const q = quotes.map((x) => ({ key: `q-${x.author}-${x.text.length}`, text: `"${x.text}"`, by: x.author }));
    const t = tips.filter((x) => x.featured).map((x) => ({ key: `t-${x.id}`, text: x.text, by: x.title }));
    const mixed = [];
    for (let i = 0; i < Math.max(q.length, t.length); i += 1) {
      if (t[i]) mixed.push(t[i]);
      if (q[i]) mixed.push(q[i]);
    }
    return mixed;
  }, [quotes, tips]);

  if (!items.length) return null;

  const row = (hidden) => (
    <ul className="ticker-row" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item.key} className="ticker-item">
          <strong>{item.by}:</strong> {item.text}
        </li>
      ))}
    </ul>
  );

  return (
    <section className={`ticker ${paused ? 'is-paused' : ''}`} aria-label="Money tips and quotes">
      <div className="ticker-track">
        <div className="ticker-move">
          {row(false)}
          {row(true)}
        </div>
      </div>
      <button
        type="button"
        className="ticker-toggle"
        onClick={() => setPaused((p) => !p)}
        aria-pressed={paused}
      >
        <Icon name={paused ? 'play' : 'pause'} size={14} />
        <span className="visually-hidden">{paused ? 'Play tips' : 'Pause tips'}</span>
      </button>
    </section>
  );
}
