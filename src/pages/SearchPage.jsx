import React, { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import PageHeader from '../components/PageHeader';
import Icon from '../components/Icon';
import { buildIndex, scoreItem, tokenize, TOPICS, TYPES } from '../utils/searchIndex';
import { formatDate } from '../utils/format';

const SORTS = { relevant: 'Most relevant', newest: 'Newest', az: 'A to Z' };

function Highlight({ text, words }) {
  if (!words.length) return text;
  const pattern = new RegExp(`(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  return text.split(pattern).map((part, i) => (i % 2 === 1 ? <mark key={i}>{part}</mark> : part));
}

export default function SearchPage() {
  const { data } = useData();
  const [params, setParams] = useSearchParams();
  const query = params.get('q') || '';
  const topic = params.get('topic') || 'all';
  const type = params.get('type') || 'all';
  const sort = params.get('sort') || 'relevant';

  const setParam = (key, value, fallback) => {
    const next = new URLSearchParams(params);
    if (!value || value === fallback) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  const index = useMemo(() => buildIndex(data), [data]);
  const words = tokenize(query);

  const results = useMemo(() => {
    const list = index
      .map((item) => ({ ...item, score: scoreItem(item, words) }))
      .filter((item) => (words.length ? item.score > 0 : true))
      .filter((item) => topic === 'all' || item.topic === topic)
      .filter((item) => type === 'all' || item.type === type);

    if (sort === 'az') list.sort((a, b) => a.title.localeCompare(b.title));
    else if (sort === 'newest') list.sort((a, b) => b.date.localeCompare(a.date));
    else list.sort((a, b) => b.score - a.score || b.date.localeCompare(a.date));
    return list;
  
  }, [index, query, topic, type, sort]);

  const clearAll = () => setParams({}, { replace: true });
  const hasFilters = query || topic !== 'all' || type !== 'all';

  return (
    <div className="container page">
      <PageHeader title="Search tips and guides" intro="Search every tip, guide, infographic, money mistake and assistant answer on BudgetBasics." />

      <div className="panel search-controls">
        <form role="search" onSubmit={(e) => e.preventDefault()} className="search-row">
          <label htmlFor="search-input" className="visually-hidden">
            Search learning content
          </label>
          <span className="search-input-wrap">
            <Icon name="search" size={18} />
            <input
              id="search-input"
              type="search"
              className="control"
              placeholder="Try saving, needs, expenses or goals"
              value={query}
              onChange={(e) => setParam('q', e.target.value, '')}
            />
          </span>
          <div className="search-selects">
            <label htmlFor="type-select" className="inline-label">
              Type
            </label>
            <select id="type-select" className="control" value={type} onChange={(e) => setParam('type', e.target.value, 'all')}>
              <option value="all">All types</option>
              {Object.entries(TYPES).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            <label htmlFor="sort-select" className="inline-label">
              Sort by
            </label>
            <select id="sort-select" className="control" value={sort} onChange={(e) => setParam('sort', e.target.value, 'relevant')}>
              {Object.entries(SORTS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </form>

        <div className="filter-bar" role="group" aria-label="Filter by topic">
          <button type="button" className="chip" aria-pressed={topic === 'all'} onClick={() => setParam('topic', 'all', 'all')}>
            All topics
          </button>
          {TOPICS.map((t) => (
            <button key={t} type="button" className={`chip topic-${t}`} aria-pressed={topic === t} onClick={() => setParam('topic', t, 'all')}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <p className="result-count" role="status" aria-live="polite">
        {results.length} {results.length === 1 ? 'result' : 'results'}
        {query && (
          <>
            {' '}
            for <strong>"{query}"</strong>
          </>
        )}
      </p>

      {results.length === 0 ? (
        <div className="panel no-results">
          <h2>No matching content found</h2>
          <p>
            Nothing matches {query ? <strong>"{query}"</strong> : 'these filters'}
            {topic !== 'all' && <> in the {topic} topic</>}. Try a shorter word such as saving, needs, expenses or goals, or
            remove a filter.
          </p>
          {hasFilters && (
            <button type="button" className="btn btn-secondary" onClick={clearAll}>
              Clear search and filters
            </button>
          )}
        </div>
      ) : (
        <ul className="result-list">
          {results.map((item) => (
            <li key={`${item.type}-${item.id}`} className="result">
              <div className="result-meta">
                <span className={`topic-tag topic-${item.topic}`}>{item.topic}</span>
                <span className="result-type">{TYPES[item.type].replace(/s$/, '')}</span>
                <span className="result-date">{formatDate(item.date)}</span>
              </div>
              <h2 className="result-title">
                <Link to={item.link}>
                  <Highlight text={item.title} words={words} />
                </Link>
              </h2>
              <p>
                <Highlight text={item.text} words={words} />
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
