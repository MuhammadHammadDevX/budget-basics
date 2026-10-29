import React, { useEffect, useState } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { DataProvider, useData } from './context/DataContext';
import { SessionProvider } from './context/SessionContext';

import Header from './components/Header';
import Ticker from './components/Ticker';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import RouteEffects from './components/RouteEffects';
import StatusView from './components/StatusView';

import Home from './pages/Home';
import BudgetingBasics from './pages/BudgetingBasics';
import NeedsVsWants from './pages/NeedsVsWants';
import Budget503020 from './pages/Budget503020';
import SavingsGoals from './pages/SavingsGoals';
import ExpensePlanner from './pages/ExpensePlanner';
import MoneyMistakes from './pages/MoneyMistakes';
import InfographicGallery from './pages/InfographicGallery';
import SearchPage from './pages/SearchPage';
import Chatbot from './pages/Chatbot';
import About from './pages/About';
import Feedback from './pages/Feedback';
import Contact from './pages/Contact';
import Sitemap from './pages/Sitemap';
import { Disclaimer, Privacy } from './pages/Policies';
import NotFound from './pages/NotFound';

import './styles/base.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/home.css';
import './styles/modules.css';
import './styles/tools.css';
import './styles/gallery.css';
import './styles/chatbot.css';

const THEME_KEY = 'budgetbasics_theme';

function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {
      
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  return [theme, () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))];
}

function Layout() {
  const [theme, toggleTheme] = useTheme();
  const { data } = useData();

  return (
    <>
      <a className="skip-link" href="#main" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus(); }}>
        Skip to main content
      </a>
      <RouteEffects />
      <Header site={data?.site} theme={theme} onToggleTheme={toggleTheme} />
      <Ticker quotes={data?.site?.quotes} tips={data?.tips} />

      <main id="main" tabIndex={-1}>
        <StatusView>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/basics" element={<BudgetingBasics />} />
            <Route path="/needs-wants" element={<NeedsVsWants />} />
            <Route path="/50-30-20" element={<Budget503020 />} />
            <Route path="/savings-goals" element={<SavingsGoals />} />
            <Route path="/expense-planner" element={<ExpensePlanner />} />
            <Route path="/money-mistakes" element={<MoneyMistakes />} />
            <Route path="/gallery" element={<InfographicGallery />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/assistant" element={<Chatbot />} />
            <Route path="/about" element={<About />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/sitemap" element={<Sitemap />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </StatusView>
      </main>

      <Footer site={data?.site} />
      <BackToTop />
    </>
  );
}

export default function App() {
  return (
    <HashRouter>
      <DataProvider>
        <SessionProvider>
          <Layout />
        </SessionProvider>
      </DataProvider>
    </HashRouter>
  );
}
