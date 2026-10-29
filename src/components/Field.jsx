import React from 'react';

export default function Field({ id, label, error, hint, as = 'input', prefix, children, className = '', ...props }) {
  const Control = as;
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(' ') || undefined;

  const control = (
    <Control
      id={id}
      name={id}
      className={`control ${prefix ? 'has-prefix' : ''}`}
      aria-invalid={error ? true : undefined}
      aria-describedby={describedBy}
      {...props}
    >
      {children}
    </Control>
  );

  return (
    <div className={`field ${error ? 'has-error' : ''} ${className}`}>
      <label htmlFor={id}>{label}</label>
      {hint && (
        <span className="field-hint" id={`${id}-hint`}>
          {hint}
        </span>
      )}
      {prefix ? (
        <span className="control-wrap">
          <span className="control-prefix" aria-hidden="true">
            {prefix}
          </span>
          {control}
        </span>
      ) : (
        control
      )}
      {error && (
        <span className="field-error" id={`${id}-error`}>
          {error}
        </span>
      )}
    </div>
  );
}
