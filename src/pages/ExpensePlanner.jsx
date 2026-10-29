import React, { useRef, useState } from 'react';
import { useData } from '../context/DataContext';
import { useSession } from '../context/SessionContext';
import PageHeader from '../components/PageHeader';
import Field from '../components/Field';
import Icon from '../components/Icon';
import ProgressBar from '../components/ProgressBar';
import { formatDate, formatMoney, todayISO } from '../utils/format';
import { focusFirstError, parseAmount, validateText } from '../utils/validate';
import { summarizeExpenses } from '../utils/calculations';

const blankForm = (category) => ({ date: todayISO(), category, description: '', amount: '' });

function validateEntry(form, categories) {
  const errors = {};
  if (!form.date) errors.date = 'Choose a date.';
  else if (Number.isNaN(new Date(form.date).getTime())) errors.date = 'Enter a valid date.';
  if (!categories.includes(form.category)) errors.category = 'Choose a category.';
  const descError = validateText(form.description, { label: 'a description', min: 2, max: 60 });
  if (descError) errors.description = descError;
  const amount = parseAmount(form.amount, { label: 'Amount', max: 1000000 });
  if (amount.error) errors.amount = amount.error;
  return { errors, amount: amount.value };
}

export default function ExpensePlanner() {
  const { data } = useData();
  const { state, dispatch } = useSession();
  const { symbol, label: currencyLabel } = data.site.currency;
  const categories = data.site.expenseCategories;
  const { entries, startingBalance } = state.planner;

  const [form, setForm] = useState(() => blankForm(categories[0]));
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);
  const formRef = useRef(null);

  const balance = parseAmount(startingBalance, { label: 'Starting balance', allowZero: true });
  const summary = summarizeExpenses(entries, balance.value ?? 0);
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const { errors: errs, amount } = validateEntry(form, categories);
    setErrors(errs);
    if (Object.keys(errs).length) {
      focusFirstError(errs, 'exp-');
      return;
    }
    const entry = { id: editingId || `e${Date.now()}`, date: form.date, category: form.category, description: form.description.trim(), amount };
    dispatch(editingId ? { type: 'planner/update', entry } : { type: 'planner/add', entry });
    setMessage(editingId ? `Saved changes to "${entry.description}".` : `Added "${entry.description}" for ${formatMoney(amount, symbol)}.`);
    setEditingId(null);
    setForm(blankForm(form.category));
  };

  const startEdit = (entry) => {
    setEditingId(entry.id);
    setErrors({});
    setForm({ date: entry.date, category: entry.category, description: entry.description, amount: String(entry.amount) });
    setMessage(`Editing "${entry.description}".`);
    formRef.current?.scrollIntoView({ block: 'start' });
    document.getElementById('exp-description')?.focus({ preventScroll: true });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setErrors({});
    setForm(blankForm(categories[0]));
    setMessage('Edit cancelled.');
  };

  const remove = (entry) => {
    dispatch({ type: 'planner/remove', id: entry.id });
    if (editingId === entry.id) cancelEdit();
    setMessage(`Removed "${entry.description}".`);
  };

  const clearAll = () => {
    dispatch({ type: 'planner/clear' });
    setConfirmClear(false);
    cancelEdit();
    setMessage('All entries removed.');
  };

  const overspent = balance.value !== null && summary.remaining < 0;

  return (
    <div className="container page">
      <PageHeader intro={`Practise planning a month with sample expenses in ${currencyLabel}. Entries stay only while this tab is open and are never saved or sent.`} />

      <div className="tool-layout planner-layout">
        <section className="panel" aria-labelledby="entry-title" ref={formRef}>
          <h2 id="entry-title">{editingId ? 'Edit expense' : 'Add an expense'}</h2>
          <form onSubmit={submit} noValidate>
            <div className="field-row">
              <Field id="exp-date" label="Date" type="date" value={form.date} error={errors.date} onChange={update('date')} />
              <Field id="exp-category" label="Category" as="select" value={form.category} error={errors.category} onChange={update('category')}>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Field>
            </div>
            <Field id="exp-description" label="Description" hint="For example: weekly groceries, bus pass." value={form.description} error={errors.description} onChange={update('description')} autoComplete="off" />
            <Field id="exp-amount" label="Amount" prefix={symbol} inputMode="decimal" value={form.amount} error={errors.amount} onChange={update('amount')} autoComplete="off" />
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Save changes' : 'Add expense'}
              </button>
              {editingId && (
                <button type="button" className="btn btn-quiet" onClick={cancelEdit}>
                  Cancel edit
                </button>
              )}
            </div>
          </form>
          <p className="visually-hidden" role="status" aria-live="polite">
            {message}
          </p>
        </section>

        <section className="panel" aria-labelledby="balance-title">
          <h2 id="balance-title">Balance</h2>
          <Field
            id="starting-balance"
            label="Starting sample balance"
            hint="Your monthly allowance or income for this demo."
            prefix={symbol}
            inputMode="decimal"
            value={startingBalance}
            error={balance.error}
            onChange={(e) => dispatch({ type: 'planner/setBalance', value: e.target.value })}
          />
          <dl className="balance-stats">
            <div>
              <dt>Total planned expenses</dt>
              <dd className="tabular">{formatMoney(summary.total, symbol)}</dd>
            </div>
            <div className={overspent ? 'is-negative' : 'is-positive'}>
              <dt>Remaining sample balance</dt>
              <dd className="tabular">{balance.value === null ? 'Fix the balance' : formatMoney(summary.remaining, symbol)}</dd>
            </div>
          </dl>
          {balance.value !== null && balance.value > 0 && (
            <ProgressBar value={Math.min(summary.total, balance.value)} max={balance.value} label="Share of balance planned" tone={overspent ? 'danger' : 'needs'} showValue />
          )}
          {overspent && (
            <p className="warning" role="alert">
              These expenses are {formatMoney(-summary.remaining, symbol)} more than your balance. Look for wants you
              could remove or reduce.
            </p>
          )}

          {Object.keys(summary.byCategory).length > 0 && (
            <div className="category-summary">
              <h3>By category</h3>
              <ul>
                {Object.entries(summary.byCategory)
                  .sort((a, b) => b[1] - a[1])
                  .map(([cat, amount]) => (
                    <li key={cat}>
                      <span className="split-line">
                        <span>{cat}</span>
                        <span className="tabular">{formatMoney(amount, symbol)}</span>
                      </span>
                      <ProgressBar value={amount} max={summary.total} label={`${cat} share of expenses`} tone="neutral" />
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </section>
      </div>

      <section className="panel" aria-labelledby="table-title">
        <div className="panel-head">
          <h2 id="table-title">Expenses this session</h2>
          {entries.length > 0 &&
            (confirmClear ? (
              <div className="confirm-inline" role="group" aria-label="Confirm removing all entries">
                <span>Remove all {entries.length} entries?</span>
                <button type="button" className="btn btn-danger btn-sm" onClick={clearAll}>
                  Remove all
                </button>
                <button type="button" className="btn btn-quiet btn-sm" onClick={() => setConfirmClear(false)}>
                  Keep them
                </button>
              </div>
            ) : (
              <button type="button" className="btn btn-quiet btn-sm" onClick={() => setConfirmClear(true)}>
                <Icon name="trash" size={16} />
                Clear all
              </button>
            ))}
        </div>

        {entries.length === 0 ? (
          <p className="empty-note">No expenses yet. Add your first sample expense using the form above.</p>
        ) : (
          <div className="table-scroll">
            <table className="data-table expense-table">
              <caption className="visually-hidden">Sample expenses added this session</caption>
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col">Category</th>
                  <th scope="col">Description</th>
                  <th scope="col" className="num">
                    Amount
                  </th>
                  <th scope="col">
                    <span className="visually-hidden">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((entry) => (
                  <tr key={entry.id} className={editingId === entry.id ? 'is-editing' : ''}>
                    <td className="nowrap">{formatDate(entry.date)}</td>
                    <td>{entry.category}</td>
                    <td>{entry.description}</td>
                    <td className="num tabular">{formatMoney(entry.amount, symbol)}</td>
                    <td className="row-actions">
                      <button type="button" className="btn btn-quiet btn-sm" onClick={() => startEdit(entry)} aria-label={`Edit ${entry.description}`}>
                        <Icon name="edit" size={15} />
                        Edit
                      </button>
                      <button type="button" className="btn btn-quiet btn-sm is-danger" onClick={() => remove(entry)} aria-label={`Remove ${entry.description}`}>
                        <Icon name="trash" size={15} />
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row" colSpan={3}>
                    Total
                  </th>
                  <td className="num tabular">{formatMoney(summary.total, symbol)}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
