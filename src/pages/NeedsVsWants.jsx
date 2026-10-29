import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import PageHeader from '../components/PageHeader';
import Icon from '../components/Icon';
import { assetUrl } from '../services/dataService';

export default function NeedsVsWants() {
  const { data } = useData();
  const { examples, items, delayRules } = data.needsWants;
  const [choices, setChoices] = useState({});

  const answered = Object.keys(choices).length;
  const correct = items.filter((i) => choices[i.id] === i.answer).length;
  const finished = answered === items.length;

  return (
    <div className="container page">
      <PageHeader intro="A need keeps you healthy, safe and studying. A want makes life nicer but can wait. Both belong in a budget, in the right amounts." />

      <section className="nw-compare" aria-label="Examples of needs and wants">
        <div className="nw-col tone-border-needs">
          <h2>Needs</h2>
          <p className="muted">Pay these first.</p>
          <ul>
            {examples.needs.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
        <div className="nw-question" aria-hidden="true">
          Is it essential now?
        </div>
        <div className="nw-col tone-border-wants">
          <h2>Wants</h2>
          <p className="muted">Enjoy them within a limit.</p>
          <ul>
            {examples.wants.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="panel classifier" aria-labelledby="classifier-title">
        <div className="panel-head">
          <h2 id="classifier-title">Sort these items</h2>
          <p className="quiz-score" aria-live="polite">
            {answered === 0 ? `Choose need or want for ${items.length} items` : `${correct} of ${answered} correct`}
          </p>
        </div>

        <ul className="classify-list">
          {items.map((item) => {
            const chosen = choices[item.id];
            const right = chosen === item.answer;
            return (
              <li key={item.id} className={`classify-item ${chosen ? (right ? 'is-correct' : 'is-wrong') : ''}`}>
                <div className="classify-row">
                  <span className="classify-name" id={`item-${item.id}`}>
                    {item.name}
                  </span>
                  <div className="segmented" role="group" aria-labelledby={`item-${item.id}`}>
                    {['need', 'want'].map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={`seg seg-${option}`}
                        aria-pressed={chosen === option}
                        onClick={() => setChoices((c) => ({ ...c, [item.id]: option }))}
                      >
                        {option === 'need' ? 'Need' : 'Want'}
                      </button>
                    ))}
                  </div>
                </div>
                {chosen && (
                  <p className={`feedback ${right ? 'is-good' : 'is-bad'}`} role="status">
                    <Icon name={right ? 'check' : 'cross'} size={16} />
                    <span>
                      <strong>{right ? 'Correct.' : `It's a ${item.answer}.`}</strong> {item.explanation}
                    </span>
                  </p>
                )}
              </li>
            );
          })}
        </ul>

        {answered > 0 && (
          <div className="classifier-foot">
            {finished && (
              <p className="result-note" role="status">
                You sorted all {items.length} items and got {correct} right.{' '}
                {correct === items.length ? 'Perfect score.' : 'Read the explanations above, then try again.'}
              </p>
            )}
            <button type="button" className="btn btn-quiet" onClick={() => setChoices({})}>
              <Icon name="refresh" size={16} />
              Start again
            </button>
          </div>
        )}
      </section>

      <section className="split-feature" aria-labelledby="guide-title">
        <div>
          <h2 id="guide-title" className="section-title">
            Before you buy a want
          </h2>
          <ol className="rule-steps">
            {delayRules.map((rule) => (
              <li key={rule.title}>
                <strong>{rule.title}.</strong> {rule.text}
              </li>
            ))}
          </ol>
          <Link to="/savings-goals" className="btn btn-secondary">
            Turn a big want into a goal
          </Link>
        </div>
        <img
          src={assetUrl('images/needs-decision-guide.svg')}
          alt="Decision guide: if a purchase is essential, buy it from your needs budget. If not, wait 48 hours, then buy it only if it still fits your wants budget; otherwise save the money."
          width="800"
          height="510"
          loading="lazy"
        />
      </section>
    </div>
  );
}
