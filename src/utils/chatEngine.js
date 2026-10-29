/**
 * BudgetBee's rule-based answer engine.
 * It scores every FAQ in chatbot.json against the question using keyword
 * matching and returns the best answer, a safe refusal for out-of-scope
 * topics, or a fallback message. No data leaves the browser.
 */

export function normalize(text) {
  return ` ${text.toLowerCase().replace(/[^a-z0-9%/\s-]/g, ' ').replace(/\s+/g, ' ').trim()} `;
}

function tokens(normalized) {
  return normalized.trim().split(' ').filter(Boolean);
}

/** Score one keyword against the question. Phrases score higher than single words. */
function keywordScore(keyword, normalized, words) {
  const key = keyword.toLowerCase();
  if (key.includes(' ') || /[^a-z0-9]/.test(key)) {
    return normalized.includes(` ${key} `) || normalized.includes(key) ? 3 * key.split(' ').length : 0;
  }
  if (words.includes(key)) return 2;
  // Partial match for word forms, e.g. "overspending" and "overspend".
  if (key.length >= 4 && words.some((w) => w.length >= 4 && (w.startsWith(key) || key.startsWith(w)))) return 1;
  return 0;
}

function containsAny(normalized, keywords) {
  return keywords.some((k) => {
    const key = k.toLowerCase();
    if (normalized.includes(` ${key} `)) return true;
    if (key.length < 5) return normalized.includes(` ${key}s `) || normalized.includes(` ${key}es `);
    return normalized.includes(` ${key}`);
  });
}

export function getReply(question, kb) {
  const normalized = normalize(question);
  const words = tokens(normalized);
  if (!words.length) return { kind: 'fallback', text: kb.fallback, followUps: kb.suggested };

  if (containsAny(normalized, kb.outOfScope.keywords)) {
    return { kind: 'refusal', text: kb.outOfScope.answer };
  }

  let best = null;
  let bestScore = 0;
  for (const faq of kb.faqs) {
    let score = normalize(faq.question) === normalized ? 20 : 0;
    for (const k of faq.keywords) score += keywordScore(k, normalized, words);
    if (score > bestScore) {
      best = faq;
      bestScore = score;
    }
  }
  if (best && bestScore >= 2) {
    return { kind: 'answer', text: best.answer, link: best.link, followUps: best.followUps, topic: best.topic };
  }

  const small = kb.smallTalk.find((s) => containsAny(normalized, s.keywords));
  if (small) return { kind: 'smalltalk', text: small.answer, followUps: kb.suggested.slice(0, 2) };

  return { kind: 'fallback', text: kb.fallback, followUps: kb.suggested };
}

/** Builds personalised tips from the habits a student selects (habits.json). */
export function generateHabitTips(selectedHabits, allowance) {
  const sorted = [...selectedHabits].sort((a, b) => b.monthlySaving - a.monthlySaving);
  const monthly = sorted.reduce((sum, h) => sum + h.monthlySaving, 0);
  return {
    tips: sorted,
    monthly,
    semester: monthly * 4,
    year: monthly * 12,
    shareOfAllowance: allowance ? Math.round((monthly / allowance) * 100) : null,
  };
}
