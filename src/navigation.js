export const NAV_GROUPS = [
  {
    id: 'learn',
    label: 'Learn budgeting',
    links: [
      { to: '/basics', label: 'Budgeting basics', description: 'Income, expenses, needs, wants and savings explained.' },
      { to: '/needs-wants', label: 'Needs vs. wants', description: 'Sort items and learn when to wait before buying.' },
      { to: '/50-30-20', label: '50-30-20 rule', description: 'Split an income into needs, wants and savings.' },
    ],
  },
  {
    id: 'practice',
    label: 'Practice planning',
    links: [
      { to: '/savings-goals', label: 'Savings goals', description: 'See how many months a goal will take.' },
      { to: '/expense-planner', label: 'Expense planner', description: 'Add sample expenses and watch your balance.' },
      { to: '/money-mistakes', label: 'Money mistakes', description: 'Common student mistakes and how to fix them.' },
    ],
  },
  {
    id: 'explore',
    label: 'Explore resources',
    links: [
      { to: '/gallery', label: 'Infographics', description: 'Visual guides you can filter by topic.' },
      { to: '/search', label: 'Search tips', description: 'Search, sort and filter all learning content.' },
    ],
  },
  {
    id: 'help',
    label: 'Get help',
    links: [
      { to: '/assistant', label: 'AI assistant', description: 'Ask BudgetBee common money questions.' },
      { to: '/about', label: 'About us', description: 'Why we built BudgetBasics and who we are.' },
      { to: '/feedback', label: 'Feedback', description: 'Rate the site and tell us what to improve.' },
      { to: '/contact', label: 'Contact us', description: 'Email, phone and social links.' },
    ],
  },
];

export const FOOTER_LINKS = [
  { to: '/sitemap', label: 'Sitemap' },
  { to: '/feedback', label: 'Feedback' },
  { to: '/contact', label: 'Contact us' },
  { to: '/about', label: 'About us' },
  { to: '/disclaimer', label: 'Educational disclaimer' },
  { to: '/privacy', label: 'Privacy note' },
];

const EXTRA_PAGES = {
  '/': { label: 'Home', group: null },
  '/sitemap': { label: 'Sitemap', group: null },
  '/disclaimer': { label: 'Educational disclaimer', group: null },
  '/privacy': { label: 'Privacy note', group: null },
};

export function findPage(pathname) {
  for (const group of NAV_GROUPS) {
    const link = group.links.find((l) => l.to === pathname);
    if (link) return { label: link.label, group };
  }
  return EXTRA_PAGES[pathname] || { label: 'Page not found', group: null };
}
