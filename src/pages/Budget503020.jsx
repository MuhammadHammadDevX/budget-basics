import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import PageHeader from '../components/PageHeader';
import Field from '../components/Field';
import ProgressBar from '../components/ProgressBar';
import Donut from '../components/Donut';
import { formatMoney } from '../utils/format';
import { parseAmount } from '../utils/validate';
import { calculateSplit } from '../utils/calculations';

const DEFAULT_SPLIT = { needs: '50', wants: '30', savings: '20' };
const LABELS = { needs: 'Needs', wants: 'Wants', savings: 'Savings' };
const EXAMPLES = {
  needs: 'Rent, groceries, transport, books, utilities',
  wants: 'Eating out, streaming, hobbies, shopping',
  savings: 'Emergency fund, goals, next semester fees',
};

function checkSplit(split) {
  const errors = {};
  const values = {};
  for (const key of Object.keys(split)) {
    const { value, error } = parseAmount(split[key], { label: `${LABELS[key]} %`, allowZero: true, max: 100 });
    if (error) errors[key] = error;
    else values[key] = value;
  }
  if (Object.keys(errors).length) return { errors, values: null, sumError: '' };
  const sum = values.needs + values.wants + values.savings;
  const sumError = Math.abs(sum - 100) > 0.001 ? `The three parts add up to ${sum}%. They must add up to 100%.` : '';
  return { errors, values: sumError ? null : values, sumError };
}

export default function Budget503020() {
  const { data } = useData();
  const { symbol, label: currencyLabel } = data.site.currency;

  const [incomeText, setIncomeText] = useState('');
  const [submitted, setSubmitted] = useState(null); 
  const [error, setError] = useState('');
  const [custom, setCustom] = useState(false);
  const [split, setSplit] = useState(DEFAULT_SPLIT);

  const splitCheck = useMemo(() => (custom ? checkSplit(split) : null), [custom, split]);
  const percents = custom ? splitCheck.values : { needs: 50, wants: 30, savings: 20 };

  const calculate = (e) => {
    e.preventDefault();
    const { value, error: err } = parseAmount(incomeText, { label: 'Monthly income' });
    setError(err);
    setSubmitted(err ? null : value);
    if (err) document.getElementById('income')?.focus();
  };

  const amounts = submitted !== null && percents ? calculateSplit(submitted, percents) : null;
  const results = amounts
    ? Object.keys(LABELS).map((key) => ({ key, percent: percents[key], amount: amounts[key] }))
    : null;

  return (
    <div className="container page">
      <PageHeader intro="A popular starting point for dividing income: 50% on needs, 30% on wants and 20% on savings. Enter a sample monthly income to see the split." />

      <div className="tool-layout">
        <section className="panel" aria-labelledby="calc-title">
          <h2 id="calc-title">Calculate your split</h2>
          <form onSubmit={calculate} noValidate>
            <Field
              id="income"
              label="Monthly income or allowance"
              hint={`Enter an amount in ${currencyLabel}, for example 500.`}
              prefix={symbol}
              inputMode="decimal"
              autoComplete="off"
              value={incomeText}
              error={error}
              onChange={(e) => setIncomeText(e.target.value)}
            />

            <div className="check-row">
              <input id="custom-split" type="checkbox" checked={custom} onChange={(e) => setCustom(e.target.checked)} />
              <label htmlFor="custom-split">Adjust the percentages myself</label>
            </div>

            {custom && (
              <fieldset className="split-fields">
                <legend>Your split (must total 100%)</legend>
                <div className="split-inputs">
                  {Object.keys(LABELS).map((key) => (
                    <Field
                      key={key}
                      id={`split-${key}`}
                      label={`${LABELS[key]} %`}
                      inputMode="decimal"
                      value={split[key]}
                      error={splitCheck.errors[key]}
                      onChange={(e) => setSplit((s) => ({ ...s, [key]: e.target.value }))}
                    />
                  ))}
                </div>
                {splitCheck.sumError && (
                  <p className="field-error" role="alert">
                    {splitCheck.sumError}
                  </p>
                )}
                <button type="button" className="btn btn-quiet" onClick={() => setSplit(DEFAULT_SPLIT)}>
                  Reset to 50-30-20
                </button>
              </fieldset>
            )}

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Calculate
              </button>
              <button
                type="button"
                className="btn btn-quiet"
                onClick={() => {
                  setIncomeText('');
                  setSubmitted(null);
                  setError('');
                }}
              >
                Clear
              </button>
            </div>
          </form>

          <p className="formula">
            <strong>Formula:</strong> amount = monthly income × percentage ÷ 100
          </p>
        </section>

        <section className="panel result-panel" aria-labelledby="result-title" aria-live="polite">
          <h2 id="result-title">Your estimated split</h2>
          {!results ? (
            <p className="empty-note">
              {submitted !== null && custom
                ? 'Fix the percentages so they add up to 100% to see your split.'
                : 'Enter a monthly income and choose Calculate to see how much goes to needs, wants and savings.'}
            </p>
          ) : (
            <>
              <div className="split-visual">
                <Donut
                  parts={results.map((r) => ({ label: r.key, value: r.amount || 0.0001, tone: r.key }))}
                  centerTop={formatMoney(submitted, symbol, 0)}
                  centerBottom="per month"
                />
                <ul className="split-results">
                  {results.map((r) => (
                    <li key={r.key}>
                      <div className="split-line">
                        <span>
                          <span className={`swatch tone-${r.key}`} aria-hidden="true" /> {LABELS[r.key]} ({r.percent}%)
                        </span>
                        <strong className="tabular">{formatMoney(r.amount, symbol)}</strong>
                      </div>
                      <ProgressBar value={r.percent} label={`${LABELS[r.key]} share`} tone={r.key} />
                      <p className="split-example">{EXAMPLES[r.key]}</p>
                      <p className="split-math tabular">
                        {formatMoney(submitted, symbol)} × {r.percent}% = {formatMoney(r.amount, symbol)}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="edu-note">
                This is an estimate for learning purposes only. The 50-30-20 split is an educational guideline, not a
                rule you must follow. Many students spend more than half on needs, and that's fine. Adjust it to fit
                your situation.
              </p>
              <p className="muted small">
                Weekly wants limit: <strong className="tabular">{formatMoney(results[1].amount / 4, symbol)}</strong>{' '}
                (wants ÷ 4). <Link to="/savings-goals">Plan a goal with your savings amount.</Link>
              </p>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
