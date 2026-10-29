import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateSplit, calculateGoal, summarizeExpenses } from '../src/utils/calculations.js';

test('50-30-20 rule calculations', () => {
  const result = calculateSplit(800, { needs: 50, wants: 30, savings: 20 });
  assert.deepEqual(result, { needs: 400, wants: 240, savings: 160 });

  const customSplit = calculateSplit(800, { needs: 60, wants: 20, savings: 20 });
  assert.deepEqual(customSplit, { needs: 480, wants: 160, savings: 160 });
});

test('Savings goal calculations', () => {
  const goal = calculateGoal({ target: 600, current: 150, monthly: 50 });
  assert.equal(goal.remaining, 450);
  assert.equal(goal.months, 9);
  assert.equal(goal.percent, 25);

  const completedGoal = calculateGoal({ target: 600, current: 700, monthly: 50 });
  assert.equal(completedGoal.remaining, 0);
  assert.equal(completedGoal.months, 0);
  assert.equal(completedGoal.percent, 100);
});

test('Expense planner summary calculations', () => {
  const entries = [
    { description: 'Textbook', amount: 45.5, category: 'Education' },
    { description: 'Groceries', amount: 50.0, category: 'Food' }
  ];
  const summary = summarizeExpenses(entries, 500);
  assert.equal(summary.total, 95.5);
  assert.equal(summary.remaining, 404.5);
  assert.equal(summary.byCategory['Education'], 45.5);
  assert.equal(summary.byCategory['Food'], 50.0);
});
