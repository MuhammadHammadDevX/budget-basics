<div align="center">

# 💰 BudgetBasics

### *Smart, Simple & Visual Financial Education for Students and Beginners*

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-4.3.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React Router](https://img.shields.io/badge/React_Router-7.18.4-CA4245?style=for-the-badge&logo=react-router&logoColor=white)](https://reactrouter.com/)
[![Node Tests](https://img.shields.io/badge/Tests-Passing-1B7F79?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-E8A317?style=for-the-badge)](LICENSE)
[![WCAG Compliant](https://img.shields.io/badge/Accessibility-WCAG_AA-2F5E8C?style=for-the-badge)](https://www.w3.org/WAI/standards-guidelines/wcag/)

<p align="center">
  <b>BudgetBasics</b> is an open-source, client-side personal finance web application built to demystify money management. Featuring interactive budgeting calculators, milestone trackers, visual infographics, and an intelligent rule-based AI guide (<b>BudgetBee</b>), BudgetBasics equips students with lifelong financial confidence — with zero ads, zero tracking, and 100% privacy.
</p>

[Explore Features](#-core-features) • [Interactive Tools](#-interactive-tools-showcase) • [Architecture](#-system-architecture) • [Directory Structure](#-organized-directory-structure) • [Getting Started](#-getting-started) • [Deployment](#-production-build--deployment)

---

</div>

## 📌 Executive Summary & Analysis

| Dimension | Details |
| :--- | :--- |
| **Target Audience** | High school and college students, young adults, and anyone starting their financial independence journey. |
| **Core Philosophy** | Plain language, zero financial jargon, immediate interactive feedback, and complete privacy. |
| **Frontend Architecture** | Modern Single-Page Application (SPA) built with React 18 and Vite. Client-side routing via React Router `HashRouter` for friction-free static hosting on GitHub Pages, Vercel, or Netlify. |
| **Design System** | Custom CSS design token system (`base.css`, `layout.css`, `components.css`, `tools.css`) with complete Light and Dark theme modes, Atkinson Hyperlegible typography for accessibility, and responsive flex/grid layouts. |
| **Intelligence Engine** | Pure client-side rule-based NLP matcher (`chatEngine.js`) powering **BudgetBee** — answers queries instantly without sending a single byte over the wire. |
| **Data Layer** | Decoupled JSON data schemas in `/public/data/` cached dynamically at runtime via React Context (`DataContext.jsx`). |
| **Testing** | Built-in Node.js native test runner (`node:test`) verifying pure mathematical models and calculation edge cases without bloated test frameworks. |

---

## ✨ Core Features

```
                               ┌─────────────────────────────────────────┐
                               │             BudgetBasics App            │
                               └────────────────────┬────────────────────┘
                                                    │
         ┌───────────────────┬──────────────────────┼──────────────────────┬───────────────────┐
         ▼                   ▼                      ▼                      ▼                   ▼
  📊 Calculators       🎯 Goal Planners       🤖 BudgetBee AI        📚 Guides & Gallery   🔍 Instant Search
  • 50/30/20 Rule      • Target timeline      • 100% browser-based   • Needs vs. Wants     • In-memory indexing
  • Expense balancer   • Progress visualizer  • Strict advice guard  • Mistake debiasing   • Multi-tag filtering
  • Custom splits      • Milestone tracker    • Instant responses    • SVG infographics    • Real-time queries
```

### 1. 📊 Interactive 50/30/20 Rule Allocator
* **Custom Split Engine**: Allows standard 50% (Needs) / 30% (Wants) / 20% (Savings) allocation or tailored splits that validate against a strict 100% sum.
* **SVG Donut Visualization**: Dynamic, SVG-rendered circular chart depicting proportional distributions in real-time.
* **Detailed Breakdown**: Exact dollar-for-dollar breakdown per pay cycle with validation against invalid or non-numeric figures.

### 2. 📝 Real-Time Expense Planner
* **Balance Tracking**: Input starting allowance or paycheck and log line-item expenses by category (Food, Housing, Study, Transit, Entertainment, Other).
* **Deficit Alerting**: Real-time warning banners trigger dynamically when total expenses exceed available funds.
* **Category Aggregation**: Automatically tallies spending per category to identify potential lifestyle creep.

### 3. 🎯 Savings Goals Milestone Forecaster
* **Timeline Projection**: Computes months remaining to hit targets (e.g. laptop, emergency fund, tuition) based on recurring monthly deposits.
* **Milestone Progress Bar**: Dynamic CSS progress indicator showing completion percentages.
* **Edge-case Protection**: Validates zero-dollar inputs, negative balances, and already-achieved milestones gracefully.

### 4. 🤖 "BudgetBee" Client-Side Financial Assistant
* **100% Local & Private**: No third-party LLM APIs, no data collection, no telemetry.
* **Weighted Keyword NLP**: Evaluates tokenized user questions against curated financial FAQs (`chatbot.json`), scoring match confidence with phrase weighting and stemming.
* **Safe Scope Guard**: Identifies speculative requests (e.g., crypto, stock picking, loans) and serves educational disclaimers pointing users to certified financial advisors.

### 5. 💡 Needs vs. Wants & Habit Breakdown
* **Cognitive Decision Guide**: Interactive decision trees to help students classify purchases before swiping.
* **Habit Cost Multiplier**: Reveals the compounding annual impact of daily micro-expenses (e.g., daily artisan coffee, unused streaming tiers).

### 6. 🖼️ High-Resolution Infographic Gallery
* **Visual Learning Library**: Curated diagrams covering the 52-Week Challenge, Needs-Decision Matrix, Budget Cycles, and Student Expense Outlines.
* **Modal Lightbox**: Built-in modal viewer with zoom and direct download capabilities.

---

## 🎨 Design System & Theme Engine

BudgetBasics implements a custom CSS variable design system crafted for legibility, comfort, and contrast:

| Color Token | Light Value | Dark Value | Purpose |
| :--- | :--- | :--- | :--- |
| `--paper` | `#f3f6f4` | `#0e1a21` | Background canvas |
| `--surface` | `#ffffff` | `#15252e` | Card & container surfaces |
| `--teal` / `--needs` | `#1b7f79` | `#22a39b` | Essential needs, primary brand |
| `--coin` / `--wants` | `#e8a317` | `#f0ad2c` | Wants & discretionary spending |
| `--savings` | `#2f5e8c` | `#4a82b8` | Savings, investments & focus |
| `--danger` | `#b0362b` | `#e05344` | Deficit alerts & error states |
| `--text` | `#1c2b36` | `#e6eff5` | Primary body typography |

### Typography
* **Headings**: `Bricolage Grotesque` — friendly, high-personality geometric sans.
* **Body & Numbers**: `Atkinson Hyperlegible` — specifically engineered by the Braille Institute for maximum character distinction and reading speed.

---

## 📁 Organized Directory Structure

The project has been organized into clean, modular, and maintainable layers:

```
BudgetBasics/
├── .gitignore                   # Comprehensive git exclusions (Node, builds, OS, IDE)
├── index.html                   # HTML entry point with preload fonts & meta tags
├── package.json                 # Dependency manifests, scripts, engine constraints
├── package-lock.json            # Deterministic dependency lockfile
├── vite.config.js               # Vite build configuration (base: './' for universal hosting)
├── README.md                    # Project documentation & analysis
│
├── dist/                        # Optimized production distribution (vite build)
│   ├── assets/                  # Minified and chunked JavaScript & CSS bundles
│   ├── data/                    # Production JSON data payloads
│   ├── images/                  # Infographics and SVG assets
│   ├── favicon.svg              # Favicon
│   └── index.html               # Production HTML template
│
├── public/                      # Static assets copied directly to dist/
│   ├── data/                    # JSON content datasets
│   │   ├── basics.json          # Budgeting primer text and definitions
│   │   ├── chatbot.json         # BudgetBee knowledge base, keywords, and FAQs
│   │   ├── gallery.json         # Metadata and tags for infographic resources
│   │   ├── habits.json          # Habit calculation benchmarks
│   │   ├── mistakes.json        # Financial pitfall summaries and solutions
│   │   ├── needsWants.json      # Sorting rules and decision criteria
│   │   ├── site.json            # Global site configuration, quotes, and metadata
│   │   └── tips.json            # Financial tips collection for dynamic ticker
│   ├── images/                  # High-resolution infographics and SVG graphics
│   ├── favicon.svg              # Site icon
│   └── logo.svg                 # BudgetBasics logo
│
├── src/                         # Application source code
│   ├── components/              # Modular, reusable presentation components
│   │   ├── BackToTop.jsx        # Smooth scroll-to-top button
│   │   ├── ClockAndVisitors.jsx # Real-time session time and visitor counter
│   │   ├── Donut.jsx            # Dynamic SVG-based split chart
│   │   ├── Field.jsx            # Form field wrapper with validation messaging
│   │   ├── Footer.jsx           # Site footer with sitemap and educational links
│   │   ├── Header.jsx           # Responsive navbar with theme switch and mobile menu
│   │   ├── HomeSearch.jsx       # Quick search bar component for landing page
│   │   ├── Icon.jsx             # Accessible SVG icon primitives
│   │   ├── Logo.jsx             # Animated brand logo component
│   │   ├── PageHeader.jsx       # Standardized page title and breadcrumb header
│   │   ├── ProgressBar.jsx      # Visual percentage progress indicator
│   │   ├── RouteEffects.jsx     # Scroll-restoration and page change triggers
│   │   ├── StatusView.jsx       # Async loading and error boundary wrapper
│   │   ├── Ticker.jsx           # Animated quote and financial tip ticker
│   │   └── WelcomeBanner.jsx    # First-time visitor greeting banner
│   │
│   ├── context/                 # React Context State Management
│   │   ├── DataContext.jsx      # Async content loader and in-memory cache
│   │   └── SessionContext.jsx   # Session tracker and user preferences
│   │
│   ├── pages/                   # Application route views & tools
│   │   ├── About.jsx            # Mission statement and creator story
│   │   ├── Budget503020.jsx     # 50/30/20 interactive calculator
│   │   ├── BudgetingBasics.jsx  # Fundamentals of personal cash flow
│   │   ├── Chatbot.jsx          # BudgetBee conversational assistant interface
│   │   ├── Contact.jsx          # Feedback and support form
│   │   ├── ExpensePlanner.jsx   # Category-based line-item expense ledger
│   │   ├── Feedback.jsx         # User feedback and rating interface
│   │   ├── Home.jsx             # Main dashboard and navigation hub
│   │   ├── InfographicGallery.jsx # Filterable visual guides with modal zoom
│   │   ├── MoneyMistakes.jsx    # Student financial pitfalls and remedies
│   │   ├── NeedsVsWants.jsx     # Interactive classification framework
│   │   ├── NotFound.jsx         # Accessible 404 fallback page
│   │   ├── Policies.jsx         # Educational disclaimer and privacy terms
│   │   ├── SavingsGoals.jsx     # Milestone savings calculator
│   │   ├── SearchPage.jsx       # Full-text content search and filtering
│   │   └── Sitemap.jsx          # Complete index of all site paths
│   │
│   ├── services/                # External/Internal services
│   │   └── dataService.js       # Asynchronous fetcher with client cache map
│   │
│   ├── styles/                  # Modular CSS Design System
│   │   ├── base.css             # Color palette tokens, CSS reset, typography
│   │   ├── chatbot.css          # Message bubbles and conversation window
│   │   ├── components.css       # Cards, buttons, form elements, badges
│   │   ├── gallery.css          # Grid layouts and modal lightbox styles
│   │   ├── home.css             # Landing hero and feature showcase
│   │   ├── layout.css           # Navigation, header, grid system, footer
│   │   ├── modules.css          # Educational content layouts and callouts
│   │   └── tools.css            # Calculator and chart styling
│   │
│   ├── utils/                   # Pure business logic and utilities
│   │   ├── calculations.js      # Pure math for 50/30/20, goals, and expenses
│   │   ├── chatEngine.js        # Rule-based natural language FAQ search
│   │   ├── format.js            # Currency formatting and numerical sanitization
│   │   ├── hooks.js             # Custom React hooks (window size, focus, etc.)
│   │   ├── searchIndex.js       # In-memory inverted search index
│   │   └── validate.js          # Input validation and bounds checking
│   │
│   ├── App.jsx                  # Main routing configuration & theme controller
│   ├── main.jsx                 # React root rendering entry
│   └── navigation.js            # Centralized route definitions and navigation metadata
│
├── test/                        # Unit tests for business logic
│   └── calculations.test.js     # Native Node.js test suite for calculations
│
└── test-data/                   # Acceptance criteria and test scenarios
    ├── README.md                # Guide to test scenarios and acceptance criteria
    └── test-cases.json          # Exhaustive JSON test fixture covering all tools
```

---

## 🛠️ Technology Stack

| Layer | Technology | Version | Rationale |
| :--- | :--- | :--- | :--- |
| **Runtime** | [Node.js](https://nodejs.org/) | `>= 20.0.0` | Modern JavaScript ecosystem support |
| **Framework** | [React](https://reactjs.org/) | `^18.2.0` | Declarative UI, Concurrent Mode, Context API |
| **Routing** | [React Router](https://reactrouter.com/) | `^7.18.4` | Client-side routing with `HashRouter` compatibility |
| **Build Tool** | [Vite](https://vitejs.dev/) | `^4.3.0` | Sub-second HMR, optimized Rollup bundling |
| **Styles** | Native CSS3 | Modern Standard | CSS Custom Properties, Flexbox, Grid, Zero runtime cost |
| **Testing** | Node Native Test Runner | Built-in (`node:test`) | Ultra-fast unit testing with zero external overhead |

---

## 🚀 Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites
* **Node.js**: `v20.0.0` or higher (`v24.x` recommended)
* **npm**: `v9.0.0` or higher

```bash
# Check your installed versions
node -v
npm -v
```

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/BudgetBasics.git
   cd BudgetBasics
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

---

## 🧪 Testing & Verification

BudgetBasics includes unit tests covering the pure calculation engines (`src/utils/calculations.js`). The tests run natively using Node's built-in test runner without requiring Jest or Vitest.

```bash
# Run the test suite
npm test
```

Expected output:
```text
✔ 50-30-20 rule calculations
✔ Savings goal calculations
✔ Expense planner summary calculations
ℹ tests 3
ℹ pass 3
ℹ fail 0
```

For manual acceptance verification and edge-case boundary checks, refer to [test-data/README.md](test-data/README.md) and [test-data/test-cases.json](test-data/test-cases.json).

---

## 📦 Production Build & Deployment

### Generating the Build
To create a fully optimized, tree-shaken, and minified production build:

```bash
npm run build
```

The output will be placed in the `dist/` directory:
* Total bundle size: **~272 kB** JS (gzip: ~85 kB) | **~37 kB** CSS (gzip: ~8 kB)
* Zero external server requirements — fully static.

### Previewing the Build Locally
```bash
npm run preview
```

### Deployment Targets

#### 1. GitHub Pages
Because `vite.config.js` sets `base: './'` and routing utilizes `HashRouter`, the `dist/` directory can be pushed directly to a `gh-pages` branch or deployed using a GitHub Actions workflow:
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

#### 2. Vercel
```bash
npx vercel deploy --prod
```

#### 3. Netlify
Drag and drop the `dist/` folder onto Netlify Drop or connect your repository with the build command `npm run build` and publish directory `dist`.

---

## 🔒 Privacy & Security

BudgetBasics is designed with a **Privacy-First** architecture:
* **No Cookies**: Does not store tracking or third-party cookies.
* **No Analytics / Telemetry**: No third-party trackers or user fingerprinting scripts.
* **Local Persistence Only**: Theme preference (`light`/`dark`) is saved exclusively to the user's `localStorage`.
* **Zero External API Calls**: The AI assistant (BudgetBee) runs entirely on the browser's JavaScript engine.

---

## 🤝 Contributing

Contributions are warmly welcomed! To contribute:

1. **Fork the Repository**
2. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your Changes**:
   ```bash
   git commit -m "Add AmazingFeature"
   ```
4. **Push to the Branch**:
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

---

## 📜 Disclaimer & License

### Educational Disclaimer
*BudgetBasics is an educational resource developed to illustrate budgeting concepts. It does not provide certified financial, legal, or investment advice. Always consult a certified financial planner for individual financial decisions.*

### License
This project is open-source and distributed under the **MIT License**. Feel free to use, modify, and distribute it for personal, non-commercial, or academic purposes.

---

<div align="center">

Crafted with 💚 for students everywhere. **BudgetBasics** — *Every dollar has a purpose.*

</div>
