import React, { useEffect, useState } from 'react';
import Icon from './Icon';

const COUNT_KEY = 'budgetbasics_visits';
const SESSION_KEY = 'budgetbasics_counted';

function useVisitCount(base) {
  const [count, setCount] = useState(null);
  useEffect(() => {
    let visits = 1;
    try {
      visits = parseInt(localStorage.getItem(COUNT_KEY) || '0', 10) || 0;
      if (!sessionStorage.getItem(SESSION_KEY)) {
        visits += 1;
        localStorage.setItem(COUNT_KEY, String(visits));
        sessionStorage.setItem(SESSION_KEY, 'yes');
      }
    } catch {

    }
    setCount(base + Math.max(visits, 1));
  }, [base]);
  return count;
}

function useNow() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return now;
}

export default function ClockAndVisitors({ visitorBase = 0 }) {
  const now = useNow();
  const visits = useVisitCount(visitorBase);

  const date = now.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  const time = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="utility-info">
      <span className="utility-item">
        <Icon name="clock" size={15} />
        <time dateTime={now.toISOString()}>
          {date}, <span className="tabular">{time}</span>
        </time>
      </span>
      <span className="utility-item" title="Counted in this browser. BudgetBasics has no server.">
        <Icon name="eye" size={15} />
        <span>
          <span className="tabular">{visits === null ? '...' : visits.toLocaleString('en-US')}</span> visits
        </span>
      </span>
    </div>
  );
}
