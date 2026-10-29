/**
 * Builds one searchable list from all JSON content files, and scores items
 * against a search query. Adding a new JSON item makes it searchable automatically.
 */
const TOPIC_PAGE = {
  saving: '/savings-goals',
  goals: '/savings-goals',
  needs: '/needs-wants',
  expenses: '/expense-planner',
  budgeting: '/50-30-20',
};

const CONCEPT_TOPIC = { income: 'budgeting', needs: 'needs', wants: 'needs', savings: 'saving' };

export const TOPICS = ['saving', 'needs', 'expenses', 'goals', 'budgeting'];
export const TYPES = { tip: 'Tips', infographic: 'Infographics', mistake: 'Mistakes', guide: 'Guides', question: 'Questions' };

export function buildIndex(data) {
  const items = [];

  data.tips.forEach((t) =>
    items.push({ id: t.id, type: 'tip', topic: t.topic, title: t.title, text: t.text, keywords: t.keywords, date: t.date, featured: t.featured, link: TOPIC_PAGE[t.topic] || '/' })
  );
  data.gallery.forEach((g) =>
    items.push({ id: g.id, type: 'infographic', topic: g.topic, title: g.title, text: g.caption, keywords: [], date: g.date, link: '/gallery' })
  );
  data.mistakes.forEach((m) =>
    items.push({ id: m.id, type: 'mistake', topic: m.topic, title: m.title, text: `${m.scenario} Fix: ${m.fix}`, keywords: [], date: m.date, link: '/money-mistakes' })
  );
  data.basics.concepts.forEach((c) =>
    items.push({ id: c.id, type: 'guide', topic: CONCEPT_TOPIC[c.group] || 'budgeting', title: c.title, text: `${c.definition} ${c.tip}`, keywords: c.examples, date: '2026-07-15', link: '/basics' })
  );
  data.chatbot.faqs.forEach((f) =>
    items.push({ id: f.id, type: 'question', topic: f.topic, title: f.question, text: f.answer, keywords: f.keywords, date: '2026-07-20', link: `/assistant?q=${encodeURIComponent(f.question)}` })
  );

  return items;
}

export function tokenize(query) {
  return query
    .toLowerCase()
    .split(/[^a-z0-9%-]+/)
    .filter((w) => w.length > 1);
}

/** Higher score = better match. Title matches count most. */
export function scoreItem(item, words) {
  if (!words.length) return item.featured ? 1 : 0;
  let score = 0;
  const title = item.title.toLowerCase();
  const text = item.text.toLowerCase();
  const keywords = item.keywords.join(' ').toLowerCase();
  for (const w of words) {
    const stem = w.length > 4 ? w.replace(/(ing|es|s)$/, '') : w;
    if (title.includes(stem)) score += 5;
    if (keywords.includes(stem)) score += 3;
    if (item.topic.includes(stem)) score += 3;
    if (text.includes(stem)) score += 1;
  }
  return score;
}
