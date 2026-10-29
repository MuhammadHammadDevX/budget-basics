/**
 * Pure calculation functions used by the calculators.
 * Kept separate from the UI so they are easy to read, test and explain.
 */

const round2 = (n) => Math.round(n * 100) / 100;

/** amount = income × percent ÷ 100 for each part of the split. */
export function calculateSplit(income, percents) {
  return Object.fromEntries(Object.entries(percents).map(([key, pct]) => [key, round2((income * pct) / 100)]));
}

/** remaining = target − current; months = ceil(remaining ÷ monthly). */
export function calculateGoal({ target, current, monthly }) {
  const remaining = Math.max(0, round2(target - current));
  const months = remaining === 0 ? 0 : Math.ceil(remaining / monthly);
  const percent = Math.min(100, (current / target) * 100);
  return { remaining, months, percent };
}

/** total = sum of amounts; remaining = starting balance − total; plus totals per category. */
export function summarizeExpenses(entries, startingBalance) {
  const total = round2(entries.reduce((sum, e) => sum + e.amount, 0));
  const byCategory = entries.reduce((acc, e) => {
    acc[e.category] = round2((acc[e.category] || 0) + e.amount);
    return acc;
  }, {});
  return { total, remaining: round2(startingBalance - total), byCategory };
}
