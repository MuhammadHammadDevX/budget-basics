import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { findPage } from '../navigation';

export default function RouteEffects() {
  const { pathname } = useLocation();
  const first = useRef(true);

  useEffect(() => {
    const page = findPage(pathname);
    document.title = pathname === '/' ? 'BudgetBasics: budgeting for students' : `${page.label} | BudgetBasics`;
    window.scrollTo(0, 0);
    if (first.current) {
      first.current = false;
      return;
    }
    document.getElementById('main')?.focus({ preventScroll: true });
  }, [pathname]);

  return null;
}
