/**
 * Client-side validation helpers shared by calculators and forms.
 * Amount validators return { value, error }; error is '' when valid.
 */
export const MAX_AMOUNT = 10000000;

export function parseAmount(raw, { label = 'This amount', allowZero = false, max = MAX_AMOUNT } = {}) {
  const text = String(raw ?? '').trim().replace(/,/g, '');
  if (text === '') return { value: null, error: `${label} is required.` };
  if (text.startsWith('-')) return { value: null, error: `${label} can't be negative.` };
  if (!/^(\d+\.?\d*|\.\d+)$/.test(text)) {
    return { value: null, error: `${label} must be a number, for example 500 or 49.99.` };
  }
  if (/\.\d{3,}$/.test(text)) return { value: null, error: `${label} can have at most 2 decimal places.` };
  const value = Number(text);
  if (!Number.isFinite(value)) return { value: null, error: `${label} must be a number.` };
  if (!allowZero && value === 0) return { value: null, error: `${label} must be more than 0.` };
  if (value > max) return { value: null, error: `${label} must be ${max.toLocaleString('en-US')} or less.` };
  return { value, error: '' };
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateName(value) {
  const text = value.trim();
  if (!text) return 'Enter your name.';
  if (text.length < 2) return 'Name must be at least 2 characters.';
  if (!/^[\p{L}\s.'-]+$/u.test(text)) return 'Name can only contain letters, spaces, dots, hyphens and apostrophes.';
  return '';
}

export function validateEmail(value) {
  const text = value.trim();
  if (!text) return 'Enter your email address.';
  if (!EMAIL_PATTERN.test(text)) return 'Enter an email address like name@example.com.';
  return '';
}

export function validateText(value, { label, min = 1, max = 1000 }) {
  const text = value.trim();
  const name = label.charAt(0).toUpperCase() + label.slice(1);
  if (!text) return `Enter ${label}.`;
  if (text.length < min) return `${name} must be at least ${min} characters.`;
  if (text.length > max) return `${name} must be ${max} characters or less.`;
  return '';
}

/** Moves keyboard focus to the first field that has an error. */
export function focusFirstError(errors, idPrefix = '') {
  const first = Object.keys(errors).find((key) => errors[key]);
  if (first) document.getElementById(`${idPrefix}${first}`)?.focus();
}
