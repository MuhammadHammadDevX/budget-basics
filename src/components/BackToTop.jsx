import React, { useEffect, useState } from 'react';
import Icon from './Icon';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toTop = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    document.getElementById('main')?.focus({ preventScroll: true });
  };

  return (
    <button type="button" className={`back-to-top ${visible ? 'is-visible' : ''}`} onClick={toTop} tabIndex={visible ? 0 : -1} aria-hidden={!visible}>
      <Icon name="arrowUp" size={20} />
      <span className="visually-hidden">Back to top</span>
    </button>
  );
}
