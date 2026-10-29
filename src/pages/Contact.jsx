import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import PageHeader from '../components/PageHeader';
import Field from '../components/Field';
import Icon from '../components/Icon';
import { focusFirstError, validateEmail, validateName, validateText } from '../utils/validate';

const SUBJECTS = ['A question about the content', 'Report a problem with the site', 'Suggest a new topic', 'Something else'];
const EMPTY = { name: '', email: '', subject: '', message: '' };

function validate(form) {
  const errors = {};
  const name = validateName(form.name);
  const email = validateEmail(form.email);
  const message = validateText(form.message, { label: 'your message', min: 10, max: 800 });
  if (name) errors.name = name;
  if (email) errors.email = email;
  if (!SUBJECTS.includes(form.subject)) errors.subject = 'Choose a subject.';
  if (message) errors.message = message;
  return errors;
}

export default function Contact() {
  const { data } = useData();
  const contact = data.site.contact;
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState('');

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: '' }));
  };

  const submit = (e) => {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length) {
      focusFirstError(errs, 'ct-');
      return;
    }
    setDone(form.name.trim().split(' ')[0]);
    setForm(EMPTY);
  };

  return (
    <div className="container page">
      <PageHeader title="Contact us" intro="Questions about the content or a problem with the site? Reach the BudgetBasics team here." />

      <div className="contact-layout">
        <section className="panel contact-info" aria-labelledby="info-title">
          <h2 id="info-title">Contact details</h2>
          <ul className="contact-list">
            <li>
              <Icon name="mail" />
              <span>
                <span className="contact-label">Email</span>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </span>
            </li>
            <li>
              <Icon name="phone" />
              <span>
                <span className="contact-label">Phone</span>
                <a href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</a>
              </span>
            </li>
            <li>
              <Icon name="pin" />
              <span>
                <span className="contact-label">Location</span>
                {contact.address}
              </span>
            </li>
            <li>
              <Icon name="clock" />
              <span>
                <span className="contact-label">Hours</span>
                {contact.hours}
              </span>
            </li>
          </ul>

          <h3>Social media</h3>
          <ul className="social-list">
            {contact.socials.map((s) => (
              <li key={s.name}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="external-link">
                  {s.name}
                  <Icon name="external" size={14} />
                  <span className="visually-hidden">(opens an external site in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
          <p className="muted small">Links marked with an arrow open other websites in a new tab.</p>
        </section>

        {done ? (
          <section className="panel confirmation" role="status" aria-live="polite">
            <Icon name="check" size={28} />
            <h2>Thanks, {done}. Your message looks good.</h2>
            <p>
              Every field passed validation. BudgetBasics has no server, so the message was not sent or stored. To reach
              us for real, email <a href={`mailto:${contact.email}`}>{contact.email}</a>.
            </p>
            <button type="button" className="btn btn-secondary" onClick={() => setDone('')}>
              Write another message
            </button>
          </section>
        ) : (
          <form className="panel" onSubmit={submit} noValidate aria-labelledby="ct-title">
            <h2 id="ct-title">Send a message</h2>
            <p className="muted small">All fields are required.</p>
            <Field id="ct-name" label="Name" autoComplete="name" value={form.name} error={errors.name} onChange={update('name')} />
            <Field id="ct-email" label="Email" type="email" autoComplete="email" value={form.email} error={errors.email} onChange={update('email')} />
            <Field id="ct-subject" as="select" label="Subject" value={form.subject} error={errors.subject} onChange={update('subject')}>
              <option value="">Choose a subject</option>
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Field>
            <Field id="ct-message" as="textarea" rows={5} label="Message" hint="At least 10 characters. Please don't include bank or card details." maxLength={800} value={form.message} error={errors.message} onChange={update('message')} />
            <button type="submit" className="btn btn-primary">
              Send message
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
