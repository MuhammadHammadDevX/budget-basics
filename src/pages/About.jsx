import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import PageHeader from '../components/PageHeader';

export default function About() {
  const { data } = useData();
  const { team, aiTools } = data.site;

  return (
    <div className="container page narrow">
      <PageHeader title="About BudgetBasics" intro="A free learning website that helps students understand where their money comes from, where it goes and how small plans build better habits." />

      <section className="prose" aria-labelledby="why-title">
        <h2 id="why-title">Why we built it</h2>
        <p>
          Many students start managing allowances, scholarships, internship pay or part-time earnings without ever being
          shown how to plan it. Small daily costs quietly eat into money meant for books, transport and savings.
          BudgetBasics explains the basics in plain language and lets you practise with safe, sample numbers.
        </p>

        <h2>What you can do here</h2>
        <ul>
          <li>Learn the key terms in <Link to="/basics">Budgeting basics</Link> and test yourself.</li>
          <li>Practise telling <Link to="/needs-wants">needs from wants</Link>.</li>
          <li>Split an income with the <Link to="/50-30-20">50-30-20 calculator</Link>.</li>
          <li>Plan a <Link to="/savings-goals">savings goal</Link> and a month of <Link to="/expense-planner">expenses</Link>.</li>
          <li>Ask <Link to="/assistant">BudgetBee</Link> common money questions.</li>
        </ul>

        <h2>What BudgetBasics is not</h2>
        <p>
          It is an educational website. It is not a bank, doesn't process payments or transactions, and doesn't store
          personal financial records. Read the <Link to="/disclaimer">educational disclaimer</Link> and{' '}
          <Link to="/privacy">privacy note</Link>.
        </p>
   </section>
    </div>
  );
}
