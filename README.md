# KoinX Tax Loss Harvesting Tool

A responsive React + TypeScript application for tax loss harvesting, built as a KoinX frontend internship assignment.

## 🚀 Live Demo

> Deploy to Vercel/Netlify following the instructions below.

## ✨ Features

- ✅ **Real-time capital gains computation** — Selecting/deselecting holdings updates the "After Harvesting" card instantly
- ✅ **Tax savings indicator** — Shows "You are going to save upto ₹X" when beneficial
- ✅ **Select All / Deselect All** — Checkbox in table header controls all rows
- ✅ **View All toggle** — Shows 5 holdings by default, expandable
- ✅ **Skeleton loaders** — Shimmer loading states for all sections
- ✅ **Error state** — With retry button
- ✅ **Mobile responsive** — Stacked layout on small screens
- ✅ **TypeScript** — Fully typed throughout
- ✅ **useContext + useReducer** — Clean global state management

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd koinx-tlh

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── api/
│   ├── capitalGainsApi.ts   # Mock capital gains API (Promise-based)
│   └── holdingsApi.ts       # Mock holdings API (Promise-based)
├── components/
│   ├── Header/              # KoinX logo + header
│   ├── Disclaimer/          # Collapsible notes accordion
│   ├── CapitalGainsCards/   # Pre & After Harvesting cards
│   └── HoldingsTable/       # Interactive holdings table
├── context/
│   └── HarvestingContext.tsx  # Global state (useReducer + useContext)
├── types/
│   └── index.ts             # TypeScript interfaces
├── utils/
│   └── formatters.ts        # Currency & number formatters
├── App.tsx
├── App.css
└── index.css
```

## 🔌 Mock APIs

Both APIs are implemented as Promise-returning functions with simulated delays:

- **Capital Gains API** — 800ms delay, returns STCG and LTCG profits/losses
- **Holdings API** — 600ms delay, returns 25 cryptocurrency holdings

## 🧮 Business Logic

### Pre Harvesting
- Data comes directly from the Capital Gains API
- `Net Capital Gains = profits - losses` (for each term)
- `Realised Capital Gains = Net STCG + Net LTCG`

### After Harvesting
For each **selected** holding:
- If `stcg.gain > 0` → add to STCG profits
- If `stcg.gain < 0` → add to STCG losses (absolute value)
- Same logic for LTCG

### Savings Shown When
`Pre Realised Gains > Post Realised Gains`

## 🎨 Tech Stack

- **React 18** + **TypeScript**
- **Vite** (build tool)
- **Vanilla CSS** (no Tailwind/styled-components)
- **useContext + useReducer** (state management)

## 📝 Assumptions

1. Holdings are sorted by absolute STCG gain (descending) — highest impact first
2. Currency displayed in Indian Rupees (₹)
3. "Total Current Value" = `currentPrice * totalHolding`
4. "Amount to Sell" = `totalHolding` when a row is selected (full holding)
5. Savings message only shown when `savings > 0`

## 🚀 Deployment

### Vercel

```bash
npm install -g vercel
vercel --prod
```

### Netlify

```bash
npm run build
# Upload the dist/ folder to Netlify dashboard
```
