# BudgetBasics Test Data & Verification Scenarios

This directory contains test cases and acceptance criteria used to verify the mathematical accuracy, validation rules, search behavior, and chatbot responses in BudgetBasics.

## Files

- `test-cases.json`: Structured test suites covering:
  - **`budget503020`**: Empty inputs, non-numeric strings, negative numbers, zero bounds, decimal precision limits, 50/30/20 splits, and custom percentage allocations totaling 100%.
  - **`savingsGoals`**: Empty form validation, target savings deadlines, negative current savings checks, zero monthly allocations, and goal completion milestones.
  - **`expensePlanner`**: Budget balance adjustments, expense additions/deletions, balance overflow warnings, and table clears.
  - **`chatbot`**: Keyword scoring, intent matching, out-of-scope financial advice refusal, and empty input handling for BudgetBee.
  - **`habitTips`**: Student habit cost aggregation, monthly/annual projections, and allowance share percentages.
  - **`search`**: Full-text indexing tests, sorting, tag filtering, and zero-match states.
  - **`forms`**: Validation rules for feedback ratings, contact forms, email formats, and minimum text constraints.
