import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import Field from '../components/Field';
import Icon from '../components/Icon';
import { focusFirstError, validateEmail, validateName, validateText } from '../utils/validate';

const EMPTY = { name: '', email: '', rating: '', comments: '' };
const RATINGS = [
  { value: '1', label: 'Poor' },
  { value: '2', label: 'Fair' },
  { value: '3', label: 'Good' },
  { value: '4', label: 'Very good' },
  { value: '5', label: 'Excellent' },
];

function validate(form) {
  const errors = {};
  const name = validateName(form.name);
  const email = validateEmail(form.email);
  const comments = validateText(form.comments, { label: 'your comments', min: 10, max: 500 });
  if (name) errors.name = name;
  if (email) errors.email = email;
  if (!form.rating) errors.rating = 'Choose a rating from 1 to 5.';
  if (comments) errors.comments = comments;
  return errors;
}

export default function Feedback() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(null);

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: '' }));
  };

  const submit = (e) => {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length) {
      focusFirstError(errs, 'fb-');
      return;
    }
    setDone({ name: form.name.trim().split(' ')[0], rating: form.rating });
    setForm(EMPTY);
  };

  return (
    <div className="container page narrow">
      <PageHeader intro="Tell us what helped and what was confusing. Your feedback is checked in the browser only and is never sent or stored." />

      {done ? (
        <section className="panel confirmation" role="status" aria-live="polite">
          <Icon name="check" size={28} />
          <h2>Thanks, {done.name}. Your feedback looks good.</h2>
          <p>
            You rated BudgetBasics {done.rating} out of 5. This is a demonstration site with no server, so your feedback
            was checked but not sent or saved anywhere.
          </p>
          <button type="button" className="btn btn-secondary" onClick={() => setDone(null)}>
            Write more feedback
          </button>
        </section>
      ) : (
        <form className="panel" onSubmit={submit} noValidate aria-labelledby="fb-title">
          <h2 id="fb-title">Share your feedback</h2>
          <p className="muted small">All fields are required.</p>
          <div className="field-row">
            <Field id="fb-name" label="Name" autoComplete="name" value={form.name} error={errors.name} onChange={update('name')} />
            <Field id="fb-email" label="Email" type="email" autoComplete="email" value={form.email} error={errors.email} onChange={update('email')} />
          </div>

          <fieldset className={`field rating ${errors.rating ? 'has-error' : ''}`} aria-describedby={errors.rating ? 'fb-rating-error' : undefined}>
            <legend>How useful was BudgetBasics?</legend>
            <div className="rating-options">
              {RATINGS.map((r, i) => (
                <label key={r.value} className="rating-option">
                  <input
                    type="radio"
                    name="rating"
                    id={i === 0 ? 'fb-rating' : undefined}
                    value={r.value}
                    checked={form.rating === r.value}
                    onChange={update('rating')}
                  />
                  <span className="rating-number">{r.value}</span>
                  <span className="rating-label">{r.label}</span>
                </label>
              ))}
            </div>
            {errors.rating && (
              <span className="field-error" id="fb-rating-error">
                {errors.rating}
              </span>
            )}
          </fieldset>

          <Field id="fb-comments" as="textarea" rows={5} label="Comments" hint="At least 10 characters." maxLength={500} value={form.comments} error={errors.comments} onChange={update('comments')} />
          <p className="char-count muted small">{form.comments.length} / 500</p>
          <button type="submit" className="btn btn-primary">
            Send feedback
          </button>
        </form>
      )}
    </div>
  );
}
