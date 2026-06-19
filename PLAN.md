# Construction Project Financial Dashboard — Implementation Plan

## Tech Stack
- **Vite 5** — build tool with React + TypeScript template
- **React 18** with TypeScript
- **Tailwind CSS v3** — utility-first styling
- **lucide-react** — icons (Hammer, DollarSign, TrendingUp, HardHat, etc.)
- **Recharts** — bar charts, line charts, responsive containers

## Project Structure

```
Finance/
├── index.html
├── package.json
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css                    # Tailwind directives + custom theme tokens
    ├── types/
    │   └── project.ts              # Project interface + enums
    ├── data/
    │   └── mockProjects.ts         # 6 diverse construction projects
    ├── components/
    │   ├── Layout/
    │   │   ├── Sidebar.tsx         # Fixed left nav (Dashboard, Projects, Reports, Settings)
    │   │   └── Header.tsx          # Top bar (page title, notifications bell, avatar)
    │   ├── Dashboard/
    │   │   ├── KPICards.tsx        # 4 summary stat cards
    │   │   ├── RevenueExpenseChart.tsx  # Grouped bar chart by project
    │   │   ├── ProfitMarginChart.tsx    # Horizontal bar: margin % per project
    │   │   └── ProjectTable.tsx    # Full financial table with sorting
    │   └── ui/
    │       └── StatCard.tsx        # Reusable KPI card with icon + trend indicator
    └── pages/
        └── Dashboard.tsx           # Assembles all dashboard components
```

## TypeScript Interfaces

```typescript
type ProjectCategory = 'residential' | 'commercial' | 'infrastructure' | 'industrial';
type ProjectStatus = 'planning' | 'in-progress' | 'completed' | 'on-hold';

interface Project {
  id: string;
  name: string;
  client: string;
  category: ProjectCategory;
  status: ProjectStatus;
  startDate: string;
  endDate: string;        // estimated completion
  budget: number;          // total budget
  actualRevenue: number;   // revenue recognized to date
  actualCost: number;      // costs incurred to date
}
```

## Mock Data — 6 Projects

| Project | Category | Status | Budget | Revenue | Cost | Margin |
|---|---|---|---|---|---|---|
| Skyline Tower | Commercial | In Progress | $4.2M | $3.1M | $2.6M | 16.1% |
| Riverside Apartments | Residential | In Progress | $2.8M | $2.4M | $1.8M | 25.0% |
| Metro Bridge | Infrastructure | In Progress | $6.5M | $5.2M | $4.9M | 5.8% |
| Tech Park Phase II | Industrial | Planning | $3.0M | $0.8M | $0.3M | 62.5% |
| Harbor View Hotel | Commercial | Completed | $5.0M | $5.3M | $4.4M | 17.0% |
| City Hall Renovation | Commercial | On Hold | $1.5M | $0.6M | $0.9M | -50% |

## Page Layout

```
┌──────────┬────────────────────────────────────────────────┐
│          │  HEADER (page title, search, bell, avatar)     │
│ SIDEBAR  ├────────────┬────────────┬────────────┬─────────┤
│          │  Revenue   │  Expenses  │ Net Profit │ Active  │
│  Logo    │  $17.4M    │  $14.9M    │  $2.5M    │    4     │
│          ├────────────┴────────────┴────────────┴─────────┤
│  Dash..  │  ┌──────────────────────────┐ ┌──────────────┐ │
│  Proj..  │  │                          │ │  Profit      │ │
│  Repor.. │  │  Revenue vs Expense      │ │  Margin %    │ │
│  Setti.. │  │  (Grouped Bar Chart)     │ │  (H-bar)     │ │
│          │  └──────────────────────────┘ └──────────────┘ │
│          ├─────────────────────────────────────────────────┤
│          │  Project Financial Table (sortable columns)     │
│          │  Name | Client | Category | Status | Budget |   │
│          │  Revenue | Cost | Profit | Margin %            │
│          └─────────────────────────────────────────────────┘
└──────────┴────────────────────────────────────────────────┘
```

## Color Palette (Tailwind + Custom)

| Token | Tailwind | Purpose |
|---|---|---|
| Revenue | `emerald-500/600` | Revenue bars, positive indicators |
| Expenses | `rose-500/600` | Cost bars, negative indicators |
| Profit | `blue-600` | Net profit display |
| Warning | `amber-500` | On-hold status, budget overruns |
| Background | `slate-50` | Page background |
| Cards | `white` | Card surfaces with shadow-sm |
| Sidebar | `slate-900` | Dark sidebar with white text |

## Implementation Steps

1. **Scaffold project** — `npm create vite@latest` with React + TypeScript
2. **Install dependencies** — Tailwind CSS, lucide-react, Recharts
3. **Configure Tailwind** — tailwind.config.js with content paths
4. **Create types** — `src/types/project.ts`
5. **Create mock data** — `src/data/mockProjects.ts`
6. **Build StatCard** — reusable UI component
7. **Build Layout** — Sidebar + Header shell
8. **Build KPICards** — 4 summary cards using StatCard
9. **Build RevenueExpenseChart** — Recharts grouped BarChart
10. **Build ProfitMarginChart** — Recharts horizontal BarChart
11. **Build ProjectTable** — sortable table with status badges
12. **Assemble Dashboard page** — compose all components
13. **Wire App.tsx** — render Dashboard in Layout

## UX Details
- Status badges: color-coded pills (green=completed, blue=in-progress, amber=planning, red=on-hold)
- Negative profit margin cells highlighted in red
- Table rows hover with subtle background change
- Sidebar nav links have active-state highlighting
- KPI cards show a subtle trend arrow (▲/▼) vs prior period (hardcoded for now)
