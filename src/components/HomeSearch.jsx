import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { buildIndex, scoreItem, tokenize, TOPICS, TYPES } from '../utils/searchIndex';
import Icon from './Icon';

const SORTS = [
  { id: 'relevant', label: 'Most relevant' },
  { id: 'newest', label: 'Newest' },
  { id: 'az', label: 'A to Z' },
];

const MAX_SHOWN = 6;

export default function HomeSearch() {
  const { data } = useData();
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState('all');
  const [type, setType] = useState('all');
  const [sort, setSort] = useState('relevant');

  const index = useMemo(() => (data ? buildIndex(data) : []), [data]);
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

  const shown = results.slice(0, MAX_SHOWN);
  const filtersOn = query.trim() || topic !== 'all' || type !== 'all';

  const clearAll = () => {
    setQuery('');
    setTopic('all');
    setType('all');
    setSort('relevant');
  };

  const params = new URLSearchParams();
  if (query.trim()) params.set('q', query.trim());
  if (topic !== 'all') params.set('topic', topic);
  if (type !== 'all') params.set('type', type);
  if (sort !== 'relevant') params.set('sort', sort);
  const fullLink = `/search${params.toString() ? `?${params}` : ''}`;

  return (
    <section className="container home-search" aria-labelledby="home-search-title">
      <h2 id="home-search-title" className="section-title">
        Search, sort and filter
      </h2>

      <div className="hs-controls">
        <form className="hs-row" role="search" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="hs-input" className="visually-hidden">
            Search tips, goals, expenses
          </label>
          <span className="hs-input-wrap">
            <Icon name="search" size={18} />
            <input
              id="hs-input"
              type="search"
              className="control"
              placeholder="Search tips, goals, expenses..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
            />
          </span>

          <label htmlFor="hs-type" className="visually-hidden">
            Type of content
          </label>
          <select id="hs-type" className="control hs-type" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="all">All types</option>
            {Object.entries(TYPES).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </form>

        <div className="hs-row hs-sort" role="group" aria-label="Sort results">
          <span className="hs-label">Sort by:</span>
          {SORTS.map((s) => (
            <button key={s.id} type="button" className="chip" aria-pressed={sort === s.id} onClick={() => setSort(s.id)}>
              {s.label}
            </button>
          ))}
        </div>

        <div className="hs-row" role="group" aria-label="Filter by topic">
          <button type="button" className="chip" aria-pressed={topic === 'all'} onClick={() => setTopic('all')}>
            All topics
          </button>
          {TOPICS.map((t) => (
            <button key={t} type="button" className={`chip hs-topic topic-${t}`} aria-pressed={topic === t} onClick={() => setTopic(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <p className="hs-count" role="status" aria-live="polite">
        {results.length === 0
          ? 'No results'
          : `Showing ${shown.length} of ${results.length} ${results.length === 1 ? 'result' : 'results'}`}
      </p>

      {results.length === 0 ? (
      
        <div className="hs-empty">
          <p>
            <strong>No matching content found{query.trim() ? ` for "${query.trim()}"` : ''}.</strong> Try another word,
            such as saving, needs, expenses or goals, or choose a different topic.
          </p>
          <button type="button" className="btn btn-secondary" onClick={clearAll}>
            Clear search and filters
          </button>
        </div>
      ) : (
        <>
          <ul className="hs-results">
            {shown.map((item) => (
              <li key={`${item.type}-${item.id}`} className="hs-card">
                <p className="hs-meta">
                  <span className="hs-type-tag">{TYPES[item.type]}</span>
                  <span className={`topic-tag topic-${item.topic}`}>{item.topic}</span>
                </p>
                <h3 className="hs-title">
                  <Link to={item.link}>{item.title}</Link>
                </h3>
                <p className="hs-text">{item.text}</p>
              </li>
            ))}
          </ul>
          <div className="hs-footer">
            {results.length > MAX_SHOWN && (
              <Link to={fullLink} className="btn btn-secondary">
                See all {results.length} results
              </Link>
            )}
            {filtersOn && (
              <button type="button" className="btn btn-quiet" onClick={clearAll}>
                Clear search and filters
              </button>
            )}
          </div>
        </>
      )}
    </section>
  );
}