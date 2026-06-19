# ConstructFi — Construction Project Financial Dashboard

A React + TypeScript dashboard for tracking project-level revenue, expenses, and profitability across a portfolio of construction projects.

## Tech Stack

- **Vite** — build tool and dev server
- **React 18** + **TypeScript** — UI framework
- **Tailwind CSS v4** — utility-first styling
- **lucide-react** — icon library
- **Recharts** — charting (bar charts, tooltips, responsive containers)

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Project Structure

```
src/
├── main.tsx                          # React entry point
├── App.tsx                           # Root layout (sidebar + header + page)
├── index.css                         # Tailwind imports + custom theme tokens
├── types/
│   └── project.ts                    # Project, SortField, SortDirection types
├── data/
│   └── mockProjects.ts              # 6 mock projects + utility functions
├── components/
│   ├── Layout/
│   │   ├── Sidebar.tsx              # Fixed dark sidebar nav
│   │   └── Header.tsx               # Top bar with search, bell, avatar
│   ├── Dashboard/
│   │   ├── KPICards.tsx             # 4 summary stat cards
│   │   ├── RevenueExpenseChart.tsx  # Grouped bar chart by project
│   │   ├── ProfitMarginChart.tsx    # Horizontal bar chart by margin %
│   │   └── ProjectTable.tsx         # Sortable financial table
│   └── ui/
│       └── StatCard.tsx             # Reusable KPI card component
└── pages/
    └── Dashboard.tsx                # Dashboard page composition
```

## Features

- **KPI Summary Cards** — Total Revenue, Expenses, Net Profit, Active Projects with trend indicators
- **Revenue vs Expenses Chart** — Grouped bar chart comparing income and costs per project
- **Profit Margin % Chart** — Color-coded horizontal bar chart (green ≥ 20%, blue ≥ 10%, amber ≥ 0%, red < 0%)
- **Sortable Project Table** — Click column headers to sort; includes status badges, category pills, and formatted currency
- **Responsive layout** — Sidebar + header shell, works on desktop and tablet
