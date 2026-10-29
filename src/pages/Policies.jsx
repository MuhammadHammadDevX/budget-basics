import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';

export function Disclaimer() {
  return (
    <div className="container page narrow">
      <PageHeader intro="Please read this before using the calculators or the assistant." />
      <section className="prose">
        <p>
          BudgetBasics is an educational website for learning personal budgeting. Everything on it, including the
          calculators, examples, tips and the BudgetBee assistant, is general information for learning only.
        </p>
        <ul>
          <li>It is not professional financial, legal or tax advice.</li>
          <li>It is not a bank and doesn't provide banking services or process real financial transactions.</li>
          <li>Calculator results are estimates based on the numbers you enter and simple formulas. They don't include interest, fees, inflation or changes in your situation.</li>
          <li>All currency values in examples are sample values in US dollars, chosen to make the maths easy to follow.</li>
          <li>Guidelines such as the 50-30-20 rule are starting points you can adjust, not rules you must follow.</li>
        </ul>
        <p>
          For decisions about loans, investments, taxes or bank accounts, speak with a qualified adviser, your
          institution's student support office or a trusted adult.
        </p>
      </section>
    </div>
  );
}

export function Privacy() {
  const [cleared, setCleared] = useState(false);

  const clearLocal = () => {
    try {
      localStorage.removeItem('budgetbasics_visits');
      localStorage.removeItem('budgetbasics_theme');
      sessionStorage.removeItem('budgetbasics_counted');
    } catch {
  
    }
    setCleared(true);
  };

  return (
    <div className="container page narrow">
      <PageHeader intro="Short version: nothing you type on BudgetBasics leaves your browser." />
      <section className="prose">
        <h2>What we collect</h2>
        <p>
          Nothing. BudgetBasics has no server, database or login. Forms are checked in your browser and then discarded.
          Nothing is submitted, stored or sent anywhere.
        </p>
        <h2>Temporary demo data</h2>
        <p>
          Expenses you add in the <Link to="/expense-planner">Expense planner</Link> and questions you ask{' '}
          <Link to="/assistant">BudgetBee</Link> are kept in memory only while this tab is open. You can clear them on
          those pages at any time, and they disappear when you close or reload the tab.
        </p>
        <h2>What your browser remembers</h2>
        <p>
          Two small settings are saved in your browser's local storage, on your device only: your light or dark mode
          choice, and a count of your visits used for the visitor counter.
        </p>
        <button type="button" className="btn btn-secondary" onClick={clearLocal}>
          Clear saved settings
        </button>
        {cleared && (
          <p className="feedback is-good" role="status">
            Saved settings cleared from this browser.
          </p>
        )}
        <h2>Please don't enter real financial details</h2>
        <p>
          Use sample numbers. Never type bank account numbers, card details or passwords into any form on this site.
        </p>
        <h2>Fonts and external links</h2>
        <p>
          Fonts are loaded from Google Fonts. Social media links open external websites in a new tab and are marked
          with an arrow icon.
        </p>
      </section>
    </div>
  );
}
