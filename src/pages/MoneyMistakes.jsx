import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import PageHeader from '../components/PageHeader';
import Icon from '../components/Icon';
import { assetUrl } from '../services/dataService';

export default function MoneyMistakes() {
  const { data } = useData();
  const mistakes = data.mistakes;
  const [open, setOpen] = useState(() => new Set([mistakes[0]?.id]));

  const toggle = (id) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const allOpen = open.size === mistakes.length;

  return (
    <div className="container page">
      <PageHeader intro="Most money problems start small. Each mistake below comes with a real student situation, what it costs and how to fix it." />

      <div className="mistakes-layout">
        <section aria-labelledby="mistakes-title">
          <div className="panel-head">
            <h2 id="mistakes-title" className="section-title">
              {mistakes.length} common mistakes
            </h2>
            <button type="button" className="btn btn-quiet btn-sm" onClick={() => setOpen(allOpen ? new Set() : new Set(mistakes.map((m) => m.id)))}>
              <Icon name="expand" size={16} />
              {allOpen ? 'Collapse all' : 'Expand all'}
            </button>
          </div>

          <ul className="accordion">
            {mistakes.map((m) => {
              const isOpen = open.has(m.id);
              return (
                <li key={m.id} className={`accordion-item ${isOpen ? 'is-open' : ''}`}>
                  <h3 className="accordion-heading">
                    <button type="button" className="accordion-button" aria-expanded={isOpen} aria-controls={`panel-${m.id}`} id={`button-${m.id}`} onClick={() => toggle(m.id)}>
                      <span>{m.title}</span>
                      <Icon name="chevron" size={20} className={isOpen ? 'rotate' : ''} />
                    </button>
                  </h3>
                  <div id={`panel-${m.id}`} role="region" aria-labelledby={`button-${m.id}`} className="accordion-panel" hidden={!isOpen}>
                    <div className="mistake-part">
                      <h4>Scenario</h4>
                      <p>{m.scenario}</p>
                    </div>
                    <div className="mistake-part is-cost">
                      <h4>What it costs</h4>
                      <p>{m.cost}</p>
                    </div>
                    <div className="mistake-part is-fix">
                      <h4>How to fix it</h4>
                      <p>{m.fix}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <aside className="mistakes-aside" aria-label="Related">
          <figure>
            <img src={assetUrl('images/small-expenses.svg')} alt="Four dollars a day becomes 28 dollars a week, 120 a month, 480 a semester and 1,460 a year." width="800" height="480" loading="lazy" />
            <figcaption>Small daily habits turn into large yearly costs.</figcaption>
          </figure>
          <div className="aside-links">
            <p>Put a fix into practice:</p>
            <ul>
              <li>
                <Link to="/expense-planner">Track small expenses in the planner</Link>
              </li>
              <li>
                <Link to="/needs-wants">Learn the 48-hour rule for wants</Link>
              </li>
              <li>
                <Link to="/assistant">Get tips for your own habits</Link>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
