import React, { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useSession } from '../context/SessionContext';
import PageHeader from '../components/PageHeader';
import Field from '../components/Field';
import Icon from '../components/Icon';
import { LogoMark } from '../components/Logo';
import { generateHabitTips, getReply } from '../utils/chatEngine';
import { parseAmount } from '../utils/validate';
import { formatWhole } from '../utils/format';

let messageId = 0;
const nextId = () => {
  messageId += 1;
  return `m${Date.now()}-${messageId}`;
};

function Message({ message, onAsk }) {
  const isBot = message.sender === 'bot';
  return (
    <li className={`msg ${isBot ? 'msg-bot' : 'msg-user'} ${message.kind ? `msg-${message.kind}` : ''}`}>
      {isBot && (
        <span className="msg-avatar" aria-hidden="true">
          <LogoMark size={26} />
        </span>
      )}
      <div className="msg-body">
        <span className="visually-hidden">{isBot ? 'BudgetBee said:' : 'You asked:'}</span>
        <p>{message.text}</p>
        {message.link && (
          <Link to={message.link.to} className="text-link">
            {message.link.label}
          </Link>
        )}
        {message.followUps?.length > 0 && (
          <div className="msg-followups">
            {message.followUps.map((f) => (
              <button key={f} type="button" className="chip chip-sm" onClick={() => onAsk(f)}>
                {f}
              </button>
            ))}
          </div>
        )}
      </div>
    </li>
  );
}

function ChatPanel({ kb }) {
  const { state, dispatch } = useSession();
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [typing, setTyping] = useState(false);
  const [params, setParams] = useSearchParams();
  const listRef = useRef(null);
  const askedFromUrl = useRef(false);

  const ask = (text) => {
    const question = text.trim();
    if (!question) {
      setError('Type a question first, or pick a suggested question.');
      document.getElementById('chat-input')?.focus();
      return;
    }
    if (question.length > 200) {
      setError('Keep your question under 200 characters.');
      return;
    }
    setError('');
    dispatch({ type: 'chat/add', message: { id: nextId(), sender: 'user', text: question } });
    setInput('');
    setTyping(true);
    const reply = getReply(question, kb);


    setTimeout(() => {
      dispatch({ type: 'chat/add', message: { id: nextId(), sender: 'bot', ...reply } });
      setTyping(false);
    }, 450);
  };

  useEffect(() => {
    const q = params.get('q');
    if (q && !askedFromUrl.current) {
      askedFromUrl.current = true;
      ask(q);
      setParams({}, { replace: true });
    }
  }, []);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [state.chat.length, typing]);

  const submit = (e) => {
    e.preventDefault();
    ask(input);
  };

  return (
    <section className="chat" aria-labelledby="chat-title">
      <div className="chat-head">
        <h2 id="chat-title">Ask BudgetBee</h2>
        {state.chat.length > 0 && (
          <button type="button" className="btn btn-quiet btn-sm" onClick={() => dispatch({ type: 'chat/clear' })}>
            Clear chat
          </button>
        )}
      </div>

      <ol className="chat-log" ref={listRef} role="log" aria-live="polite" aria-label="Conversation">
        <Message message={{ sender: 'bot', text: kb.greeting }} onAsk={ask} />
        {state.chat.map((m) => (
          <Message key={m.id} message={m} onAsk={ask} />
        ))}
        {typing && (
          <li className="msg msg-bot">
            <span className="msg-avatar" aria-hidden="true">
              <LogoMark size={26} />
            </span>
            <div className="msg-body typing">
              <span className="visually-hidden">BudgetBee is typing</span>
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </div>
          </li>
        )}
      </ol>

      <div className="chat-suggest">
        <span id="suggest-label">Suggested questions</span>
        <div className="chip-row" role="group" aria-labelledby="suggest-label">
          {kb.suggested.map((s) => (
            <button key={s} type="button" className="chip" onClick={() => ask(s)}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <form className="chat-form" onSubmit={submit} noValidate>
        <label htmlFor="chat-input" className="visually-hidden">
          Your question
        </label>
        <input
          id="chat-input"
          className="control"
          placeholder="Ask about saving, needs, budgets..."
          value={input}
          maxLength={200}
          autoComplete="off"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'chat-error' : undefined}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          <Icon name="send" size={17} />
          Ask
        </button>
      </form>
      {error && (
        <p className="field-error" id="chat-error" role="alert">
          {error}
        </p>
      )}
      <p className="chat-disclaimer">
        <strong>Disclaimer:</strong> {kb.disclaimer}
      </p>
    </section>
  );
}

function HabitTips({ habits, symbol }) {
  const [selected, setSelected] = useState([]);
  const [allowance, setAllowance] = useState('');
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);

  const toggle = (id) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!selected.length) errs.habits = 'Choose at least one habit that sounds like you.';
    let allowanceValue = null;
    if (allowance.trim()) {
      const parsed = parseAmount(allowance, { label: 'Monthly allowance' });
      if (parsed.error) errs.allowance = parsed.error;
      else allowanceValue = parsed.value;
    }
    setErrors(errs);
    if (Object.keys(errs).length) {
      setResult(null);
      return;
    }
    setResult(generateHabitTips(habits.filter((h) => selected.includes(h.id)), allowanceValue));
  };

  return (
    <section className="panel habit-tips" aria-labelledby="habits-title">
      <h2 id="habits-title">Personalised tips for your habits</h2>
      <p className="muted">
        Tick the habits that sound like you. BudgetBee matches them against common student spending patterns and
        suggests the changes that save the most.
      </p>
      <form onSubmit={submit} noValidate>
        <fieldset className="habit-list" aria-describedby={errors.habits ? 'habits-error' : undefined}>
          <legend className="visually-hidden">Spending habits</legend>
          {habits.map((h) => (
            <div key={h.id} className="check-row">
              <input id={`habit-${h.id}`} type="checkbox" checked={selected.includes(h.id)} onChange={() => toggle(h.id)} />
              <label htmlFor={`habit-${h.id}`}>{h.label}</label>
            </div>
          ))}
        </fieldset>
        {errors.habits && (
          <p className="field-error" id="habits-error" role="alert">
            {errors.habits}
          </p>
        )}
        <Field id="allowance" label="Monthly allowance (optional)" prefix={symbol} inputMode="decimal" value={allowance} error={errors.allowance} onChange={(e) => setAllowance(e.target.value)} autoComplete="off" />
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Get my tips
          </button>
          {(result || selected.length > 0) && (
            <button type="button" className="btn btn-quiet" onClick={() => { setSelected([]); setAllowance(''); setResult(null); setErrors({}); }}>
              Reset
            </button>
          )}
        </div>
      </form>

      <div aria-live="polite">
        {result && (
          <div className="habit-result">
            <p className="habit-total">
              Changing these habits could save about <strong className="tabular">{formatWhole(result.monthly, symbol)}</strong> a
              month, or <strong className="tabular">{formatWhole(result.year, symbol)}</strong> a year
              {result.shareOfAllowance !== null && <> ({result.shareOfAllowance}% of your allowance)</>}.
            </p>
            <ol className="habit-tip-list">
              {result.tips.map((h) => (
                <li key={h.id}>
                  <p className="habit-tip-head">
                    <strong>{h.category}</strong>
                    <span className="tabular">save ~{formatWhole(h.monthlySaving, symbol)}/month</span>
                  </p>
                  <p>{h.tip}</p>
                  <p className="habit-action">Try this: {h.action}</p>
                </li>
              ))}
            </ol>
            <p className="edu-note">Savings are rough estimates based on typical student spending, for learning only.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default function Chatbot() {
  const { data } = useData();
  return (
    <div className="container page">
      <PageHeader title="AI Q&A assistant" intro="BudgetBee answers common student money questions from a fixed set of educational topics, using keyword matching on this page. Your questions stay in your browser." />
      <div className="assistant-layout">
        <ChatPanel kb={data.chatbot} />
        <HabitTips habits={data.habits} symbol={data.site.currency.symbol} />
      </div>
    </div>
  );
}
