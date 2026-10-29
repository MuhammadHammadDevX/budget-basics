import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { NAV_GROUPS } from '../navigation';
import { formatWhole } from '../utils/format';
import WelcomeBanner from '../components/WelcomeBanner';
import HomeSearch from '../components/HomeSearch';

const MONTH = {
  without: 'WNWWNWWNWWNWWNWWNWN' + 'E'.repeat(11),
  with: 'SN' + 'NWN'.repeat(9) + 'N',
};

const STEPS = {
  learn: { title: 'Learn the ideas', text: 'Short lessons on income, expenses, needs, wants and saving.' },
  practice: { title: 'Practise with sample numbers', text: 'Calculators and a planner that show what happens to your money.' },
  explore: { title: 'Look things up', text: 'Infographics and tips you can search and filter by topic.' },
  help: { title: 'Ask when you are stuck', text: 'BudgetBee answers common student money questions.' },
};

function MonthStory({ income, symbol }) {
  const [mode, setMode] = useState('without');
  const days = MONTH[mode].split('');
  const firstEmpty = days.indexOf('E');
  const emptyCount = days.filter((day) => day === 'E').length;
  const saved = Math.round(income * 0.2);

  const summary =
    mode === 'without'
      ? `The money is gone after day ${firstEmpty}. That leaves ${emptyCount} days with nothing for food or transport.`
      : `${formatWhole(saved, symbol)} goes into savings on day 1, needs are paid before wants, and all ${days.length} days are covered.`;

  return (
    <figure className="month" aria-labelledby="month-title">
      <div className="month-head">
        <h2 id="month-title" className="month-title">
          One month on a {formatWhole(income, symbol)} allowance
        </h2>
        <div className="month-toggle" role="group" aria-label="Compare spending">
          <button type="button" aria-pressed={mode === 'without'} onClick={() => setMode('without')}>
            Without a plan
          </button>
          <button type="button" aria-pressed={mode === 'with'} onClick={() => setMode('with')}>
            With a plan
          </button>
        </div>
      </div>

      <p className={`month-summary is-${mode}`} aria-live="polite">
        {summary}
      </p>

      <ul className="month-legend">
        <li>
          <span className="key day-needs" aria-hidden="true" /> Needs
        </li>
        <li>
          <span className="key day-wants" aria-hidden="true" /> Wants
        </li>
        <li>
          <span className="key day-savings" aria-hidden="true" /> Saved
        </li>
        <li>
          <span className="key day-empty" aria-hidden="true" /> Nothing left
        </li>
      </ul>

      <figcaption className="month-caption">
        A sample month for learning. <Link to="/50-30-20">Split your own allowance</Link> to plan yours.
      </figcaption>
    </figure>
  );
}

const DEFAULT_SITE = {
  name: 'BudgetBasics',
  welcome: {
    title: 'Know where your allowance goes, before it goes.',
    text: 'Short guides, practice tools and a friendly assistant that help students plan their money.',
  },
  heroSample: { income: 500 },
  currency: { symbol: '$' },
};

export default function Home() {
  const { data } = useData();
  const raw = data?.site || {};
  const site = {
    ...DEFAULT_SITE,
    ...raw,
    welcome: { ...DEFAULT_SITE.welcome, ...raw.welcome },
    heroSample: { ...DEFAULT_SITE.heroSample, ...raw.heroSample },
    currency: { ...DEFAULT_SITE.currency, ...raw.currency },
    quickFacts: raw.quickFacts || [],
  };
  const tips = data?.tips || [];
  const suggested = data?.chatbot?.suggested || [];

  const featured = tips.filter((t) => t.featured);
  const dayIndex = Math.floor(Date.now() / 86400000);
  const tipOfDay = tips.length ? tips[dayIndex % tips.length] : null;

  return (
    <div className="home">
      <WelcomeBanner site={site} />
      <section className="hero container" aria-labelledby="hero-title">
        <div className="hero-copy">
          <h1 id="hero-title">{site.welcome.title}</h1>
          <p className="hero-text">{site.welcome.text}</p>

          <div className="hero-actions">
            <Link to="/basics" className="btn btn-primary btn-lg">
              Start with the basics
            </Link>
            <Link to="/50-30-20" className="btn btn-secondary btn-lg">
              Split my allowance
            </Link>
          </div>

          <p className="hero-note">No sign-up needed. BudgetBasics is a learning site, not a bank.</p>
        </div>

        <MonthStory income={site.heroSample.income} symbol={site.currency.symbol} />
      </section>
      <HomeSearch />

      <section className="container facts" aria-labelledby="facts-title">
        <h2 id="facts-title" className="section-title">
          Quick facts
        </h2>
        <dl className="facts-list">
          {site.quickFacts.map((fact) => (
            <div key={fact.value} className="fact">
              <dt className="fact-value tabular">{fact.value}</dt>
              <dd>{fact.text}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="container journey-section" aria-labelledby="journey-title">
        <h2 id="journey-title" className="section-title">
          Your path through BudgetBasics
        </h2>
        <ol className="journey">
          {NAV_GROUPS.map((group) => (
            <li key={group.id} className={`journey-step path-${group.id}`}>
              <h3>{STEPS[group.id]?.title || group.label}</h3>
              <p>{STEPS[group.id]?.text}</p>
              <ul>
                {group.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      <section className="container tips-feature" aria-labelledby="tips-title">
        {tipOfDay && (
          <div className="tip-of-day">
            <h2 id="tips-title" className="section-title">
              Tip of the day
            </h2>
            <p className="tip-of-day-title">{tipOfDay.title}</p>
            <p>{tipOfDay.text}</p>
            <Link to={`/search?topic=${tipOfDay.topic}`} className="text-link">
              More {tipOfDay.topic} tips
            </Link>
          </div>
        )}
        <div className="featured-tips">
          <h2 className="section-title">Featured tips</h2>
          <ul className="tip-cards">
            {featured.map((tip) => (
              <li key={tip.id} className="tip-card">
                <span className={`topic-tag topic-${tip.topic}`}>{tip.topic}</span>
                <h3>{tip.title}</h3>
                <p>{tip.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container home-ask" aria-labelledby="ask-title">
        <div className="home-ask-copy">
          <h2 id="ask-title">Have a money question?</h2>
          <p>Tap a question to ask BudgetBee, or open the assistant and type your own.</p>
        </div>
        <ul className="ask-list">
          {suggested.map((q) => (
            <li key={q}>
              <Link to={`/assistant?q=${encodeURIComponent(q)}`} className="chip">
                {q}
              </Link>
            </li>
          ))}
        </ul>
        <Link to="/assistant" className="btn btn-primary">
          Open BudgetBee
        </Link>
      </section>
    </div>
  );
}