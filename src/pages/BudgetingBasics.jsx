import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import PageHeader from '../components/PageHeader';
import { formatWhole } from '../utils/format';
import { assetUrl } from '../services/dataService';

function KnowledgeCheck({ questions }) {
  const [answers, setAnswers] = useState({});
  const answered = Object.keys(answers).length;
  const correct = questions.filter((q) => answers[q.id] === q.answer).length;

  return (
    <section className="panel quiz" aria-labelledby="quiz-title">
      <div className="panel-head">
        <h2 id="quiz-title">Knowledge check</h2>
        <p className="quiz-score" aria-live="polite">
          {answered === 0 ? `${questions.length} questions` : `${correct} of ${answered} correct`}
        </p>
      </div>

      <ol className="quiz-list">
        {questions.map((q) => {
          const chosen = answers[q.id];
          const done = chosen !== undefined;
          const right = chosen === q.answer;
          return (
            <li key={q.id} className="quiz-item">
              <fieldset>
                <legend>{q.question}</legend>
                <div className="quiz-options">
                  {q.options.map((opt, i) => {
                    const state = !done ? '' : i === q.answer ? 'is-correct' : i === chosen ? 'is-wrong' : '';
                    return (
                      <button
                        key={opt}
                        type="button"
                        className={`option ${state}`}
                        aria-pressed={chosen === i}
                        onClick={() => setAnswers((a) => ({ ...a, [q.id]: i }))}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {done && (
                  <p className={`feedback ${right ? 'is-good' : 'is-bad'}`} role="status">
                    <strong>{right ? 'Correct.' : 'Not quite.'}</strong> {q.explanation}
                  </p>
                )}
              </fieldset>
            </li>
          );
        })}
      </ol>
      {answered > 0 && (
        <button type="button" className="btn btn-quiet" onClick={() => setAnswers({})}>
          Reset answers
        </button>
      )}
    </section>
  );
}

export default function BudgetingBasics() {
  const { data } = useData();
  const { concepts, sampleBudget, quiz } = data.basics;
  const symbol = data.site.currency.symbol;

  const income = sampleBudget.income.reduce((s, i) => s + i.amount, 0);
  const spent = sampleBudget.rows.reduce((s, r) => s + r.amount, 0);
  const groupTotal = (g) => sampleBudget.rows.filter((r) => r.group === g).reduce((s, r) => s + r.amount, 0);

  return (
    <div className="container page">
      <PageHeader intro="Six ideas cover almost everything about a student budget: money coming in, money going out, and what you keep." />

      <section aria-labelledby="concepts-title">
        <h2 id="concepts-title" className="section-title">
          The key terms
        </h2>
        <div className="concept-grid">
          {concepts.map((c) => (
            <article key={c.id} className={`concept tone-border-${c.group}`}>
              <h3>{c.title}</h3>
              <p className="concept-def">{c.definition}</p>
              <p className="concept-examples-label">Examples</p>
              <ul className="concept-examples">
                {c.examples.map((ex) => (
                  <li key={ex}>{ex}</li>
                ))}
              </ul>
              <p className="concept-tip">{c.tip}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel sample-budget" aria-labelledby="sample-title">
        <div className="panel-head">
          <h2 id="sample-title">Sample monthly budget</h2>
          <p className="muted">{sampleBudget.title}. All amounts are sample values in {data.site.currency.label}.</p>
        </div>

        <div className="sample-layout">
          <div className="table-scroll">
            <table className="data-table">
              <caption className="visually-hidden">Sample student monthly budget in {data.site.currency.label}</caption>
              <thead>
                <tr>
                  <th scope="col">Item</th>
                  <th scope="col">Type</th>
                  <th scope="col" className="num">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {sampleBudget.income.map((i) => (
                  <tr key={i.source} className="row-income">
                    <td>{i.source}</td>
                    <td>Income</td>
                    <td className="num tabular">+{formatWhole(i.amount, symbol)}</td>
                  </tr>
                ))}
                {sampleBudget.rows.map((r) => (
                  <tr key={r.item}>
                    <td>
                      <span className={`swatch tone-${r.group}`} aria-hidden="true" /> {r.item}
                    </td>
                    <td>{r.type}</td>
                    <td className="num tabular">{formatWhole(r.amount, symbol)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row" colSpan={2}>
                    Income minus spending and savings
                  </th>
                  <td className="num tabular">{formatWhole(income - spent, symbol)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="sample-summary">
            <p className="summary-line">
              <span>Total income</span>
              <strong className="tabular">{formatWhole(income, symbol)}</strong>
            </p>
            {['needs', 'wants', 'savings'].map((g) => (
              <p key={g} className="summary-line">
                <span>
                  <span className={`swatch tone-${g}`} aria-hidden="true" /> {g.charAt(0).toUpperCase() + g.slice(1)}
                </span>
                <strong className="tabular">
                  {formatWhole(groupTotal(g), symbol)} ({Math.round((groupTotal(g) / income) * 100)}%)
                </strong>
              </p>
            ))}
            <p className="muted small">
              Every dollar has a job, so the budget balances to {formatWhole(0, symbol)}. This is called a zero-based
              budget.
            </p>
            <Link to="/50-30-20" className="text-link">
              Compare with the 50-30-20 rule
            </Link>
          </div>
        </div>
      </section>

      <section className="split-feature" aria-labelledby="cycle-title">
        <div>
          <h2 id="cycle-title" className="section-title">
            Budgeting is a monthly cycle
          </h2>
          <p>
            A budget isn't a one-time plan. Each month you plan, track what actually happens, review the difference,
            adjust next month's limits and move money into savings. Then you repeat.
          </p>
          <Link to="/expense-planner" className="btn btn-secondary">
            Practise tracking expenses
          </Link>
        </div>
        <img
          src={assetUrl('images/budget-cycle.svg')}
          alt="The monthly budget cycle: plan, track, review, adjust and save, then repeat."
          width="800"
          height="500"
          loading="lazy"
        />
      </section>

      <KnowledgeCheck questions={quiz} />
    </div>
  );
}
