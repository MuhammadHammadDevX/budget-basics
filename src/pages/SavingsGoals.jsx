import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import PageHeader from '../components/PageHeader';
import Field from '../components/Field';
import ProgressBar from '../components/ProgressBar';
import { formatMoney, monthFromNow } from '../utils/format';
import { focusFirstError, parseAmount, validateText } from '../utils/validate';
import { assetUrl } from '../services/dataService';
import { calculateGoal } from '../utils/calculations';

const EMPTY = { goalName: '', target: '', current: '', monthly: '' };
const EXAMPLE = { goalName: 'New laptop', target: '600', current: '150', monthly: '50' };

function validateGoal(form) {
  const errors = {};
  const nameError = validateText(form.goalName, { label: 'a goal name', max: 60 });
  if (nameError) errors.goalName = nameError;

  const target = parseAmount(form.target, { label: 'Target amount' });
  const current = parseAmount(form.current, { label: 'Current savings', allowZero: true });
  const monthly = parseAmount(form.monthly, { label: 'Monthly contribution' });
  if (target.error) errors.target = target.error;
  if (current.error) errors.current = current.error;
  if (monthly.error) errors.monthly = monthly.error;

  return { errors, values: { name: form.goalName.trim(), target: target.value, current: current.value, monthly: monthly.value } };
}

export default function SavingsGoals() {
  const { data } = useData();
  const { symbol, label: currencyLabel } = data.site.currency;
  const tips = data.site.savingsTips;

  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const { errors: errs, values } = validateGoal(form);
    setErrors(errs);
    if (Object.keys(errs).length) {
      setResult(null);
      focusFirstError(errs);
      return;
    }
    setResult({ ...values, ...calculateGoal(values) });
  };

  const tip = result && (tips.find((t) => Math.floor(result.percent) <= t.maxPercent) || tips[tips.length - 1]);

  return (
    <div className="container page">
      <PageHeader intro="Give your goal a name, a target and a monthly amount. We'll work out what's left and how many months it will take." />

      <div className="tool-layout">
        <section className="panel" aria-labelledby="goal-form-title">
          <h2 id="goal-form-title">Your goal</h2>
          <form onSubmit={submit} noValidate>
            <Field id="goalName" label="Goal name" hint="For example: new laptop, trip home, emergency fund." value={form.goalName} error={errors.goalName} onChange={update('goalName')} autoComplete="off" />
            <Field id="target" label="Target amount" prefix={symbol} inputMode="decimal" value={form.target} error={errors.target} onChange={update('target')} autoComplete="off" />
            <Field id="current" label="Current savings" hint="Enter 0 if you're starting from scratch." prefix={symbol} inputMode="decimal" value={form.current} error={errors.current} onChange={update('current')} autoComplete="off" />
            <Field id="monthly" label="Expected monthly contribution" prefix={symbol} inputMode="decimal" value={form.monthly} error={errors.monthly} onChange={update('monthly')} autoComplete="off" />
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Calculate
              </button>
              <button type="button" className="btn btn-quiet" onClick={() => { setForm(EXAMPLE); setErrors({}); }}>
                Fill in an example
              </button>
              <button type="button" className="btn btn-quiet" onClick={() => { setForm(EMPTY); setErrors({}); setResult(null); }}>
                Clear
              </button>
            </div>
          </form>
          <p className="formula">
            <strong>Formulas:</strong> remaining = target − current savings. Months = remaining ÷ monthly contribution,
            rounded up to a whole month.
          </p>
        </section>

        <section className="panel result-panel" aria-labelledby="goal-result-title" aria-live="polite">
          <h2 id="goal-result-title">{result ? result.name : 'Your progress'}</h2>
          {!result ? (
            <>
              <p className="empty-note">Fill in the form and choose Calculate to see your progress and timeline.</p>
              <img className="result-illustration" src={assetUrl('images/52-week-challenge.svg')} alt="The 52-week savings challenge: saving 1 dollar more each week adds up to 1,378 dollars in a year." width="800" height="500" loading="lazy" />
            </>
          ) : (
            <>
              <ProgressBar value={result.percent} label={`Progress toward ${result.name}`} tone="savings" showValue />
              <dl className="result-stats">
                <div>
                  <dt>Saved so far</dt>
                  <dd className="tabular">{formatMoney(result.current, symbol)} of {formatMoney(result.target, symbol)}</dd>
                </div>
                <div>
                  <dt>Still to save</dt>
                  <dd className="tabular">{formatMoney(result.remaining, symbol)}</dd>
                </div>
                <div>
                  <dt>Estimated time</dt>
                  <dd className="tabular">
                    {result.months === 0 ? 'Goal reached' : `${result.months} month${result.months === 1 ? '' : 's'}`}
                  </dd>
                </div>
                {result.months > 0 && (
                  <div>
                    <dt>Estimated finish</dt>
                    <dd>{monthFromNow(result.months)}</dd>
                  </div>
                )}
              </dl>
              {result.months > 0 && (
                <p className="muted small">
                  Saving {formatMoney(result.monthly + 10, symbol)} a month instead would take{' '}
                  {Math.ceil(result.remaining / (result.monthly + 10))} months.
                </p>
              )}
              <p className="tip-box">
                <strong>Tip:</strong> {tip.text}
              </p>
              <p className="edu-note">
                This is an estimate in {currencyLabel} for learning. It assumes you save the same amount every month and
                doesn't include interest or unexpected costs.
              </p>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
