import { useEffect, useState } from 'react';

/** True while a CSS media query matches, e.g. useMediaQuery('(max-width: 960px)'). */
export function useMediaQuery(query) {
  const get = () => typeof window !== 'undefined' && window.matchMedia(query).matches;
  const [matches, setMatches] = useState(get);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

/** Calls handler when a click or Escape happens outside the ref'd element. */
export function useDismiss(ref, active, onDismiss) {
  useEffect(() => {
    if (!active) return undefined;
    const onPointer = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onDismiss('outside');
    };
    const onKey = (e) => {
      if (e.key === 'Escape') onDismiss('escape');
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [ref, active, onDismiss]);
}
