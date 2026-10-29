import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import PageHeader from '../components/PageHeader';
import Icon from '../components/Icon';
import { assetUrl } from '../services/dataService';

const TOPIC_LABELS = { all: 'All topics', budgeting: 'Budgeting', needs: 'Needs & wants', saving: 'Saving', expenses: 'Expenses' };

function Lightbox({ item, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    if (item && dialog && !dialog.open) dialog.showModal();
  }, [item]);
  if (!item) return null;

  return (
    <dialog ref={ref} className="lightbox" aria-labelledby="lightbox-title" onClose={onClose} onClick={(e) => e.target === ref.current && ref.current.close()}>
      <div className="lightbox-inner">
        <div className="lightbox-head">
          <h2 id="lightbox-title">{item.title}</h2>
          <button type="button" className="icon-button" onClick={() => ref.current.close()} autoFocus>
            <Icon name="close" size={22} />
            <span className="visually-hidden">Close</span>
          </button>
        </div>
        <img src={assetUrl(item.image)} alt={item.alt} />
        <p>{item.caption}</p>
        <Link to={item.link} className="btn btn-secondary" onClick={() => ref.current.close()}>
          Open the related lesson
        </Link>
      </div>
    </dialog>
  );
}

export default function InfographicGallery() {
  const { data } = useData();
  const gallery = data.gallery;
  const [topic, setTopic] = useState('all');
  const [active, setActive] = useState(null);

  const topics = ['all', ...new Set(gallery.map((g) => g.topic))];
  const shown = topic === 'all' ? gallery : gallery.filter((g) => g.topic === topic);

  return (
    <div className="container page">
      <PageHeader title="Infographics and learning gallery" intro="Original visual guides to the main budgeting ideas. Filter by topic, then open any image to see it full size." />

      <div className="filter-bar" role="group" aria-label="Filter by topic">
        {topics.map((t) => (
          <button key={t} type="button" className={`chip ${t !== 'all' ? `topic-${t}` : ''}`} aria-pressed={topic === t} onClick={() => setTopic(t)}>
            {TOPIC_LABELS[t] || t}
            <span className="chip-count">{t === 'all' ? gallery.length : gallery.filter((g) => g.topic === t).length}</span>
          </button>
        ))}
      </div>
      <p className="visually-hidden" role="status" aria-live="polite">
        Showing {shown.length} infographics.
      </p>

      <ul className="gallery-grid">
        {shown.map((item) => (
          <li key={item.id} className="gallery-item">
            <figure>
              <button type="button" className="gallery-open" onClick={() => setActive(item)}>
                <img src={assetUrl(item.image)} alt={item.alt} loading="lazy" width="800" height="480" />
                <span className="visually-hidden">Open full size: {item.title}</span>
              </button>
              <figcaption>
                <span className={`topic-tag topic-${item.topic}`}>{TOPIC_LABELS[item.topic]}</span>
                <h2 className="gallery-title">{item.title}</h2>
                <p>{item.caption}</p>
                <Link to={item.link} className="text-link">
                  Related lesson
                </Link>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <Lightbox item={active} onClose={() => setActive(null)} />
    </div>
  );
}
