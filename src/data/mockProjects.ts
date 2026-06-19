import type { Project, ProjectSummary } from "../types/project";

/**
 * Realistic construction-project dataset.
 *
 * In production this would come from a REST / JSON API. The `useProjects`
 * hook in `../hooks/useProjects.ts` simulates that fetch with a short
 * artificial delay so the UI can exercise loading and error states.
 */

export const mockProjects: Project[] = [
  {
    id: "PRJ-001",
    projectName: "Skyline Tower",
    location: "North Dagon, Yangon",
    category: "commercial",
    status: "Ongoing",
    startDate: "2024-03-15",
    endDate: "2026-09-30",
    budget: 42_000_000,
    income: 31_200_000,
    expenses: 26_400_000,
    expenseBreakdown: [
      { category: "Materials", amount: 10_560_000 },
      { category: "Labor", amount: 7_920_000 },
      { category: "Equipment", amount: 3_960_000 },
      { category: "Subcontractors", amount: 2_640_000 },
      { category: "Permits & Fees", amount: 1_320_000 },
    ],
  },
  {
    id: "PRJ-002",
    projectName: "Riverside Apartments",
    location: "Hlaing, Yangon",
    category: "residential",
    status: "Ongoing",
    startDate: "2024-06-01",
    endDate: "2026-04-15",
    budget: 28_500_000,
    income: 24_100_000,
    expenses: 18_200_000,
    expenseBreakdown: [
      { category: "Materials", amount: 6_370_000 },
      { category: "Labor", amount: 5_460_000 },
      { category: "Equipment", amount: 2_730_000 },
      { category: "Subcontractors", amount: 2_730_000 },
      { category: "Permits & Fees", amount: 910_000 },
    ],
  },
  {
    id: "PRJ-003",
    projectName: "Metro Bridge Extension",
    location: "Bago, Bago",
    category: "infrastructure",
    status: "Ongoing",
    startDate: "2023-11-01",
    endDate: "2027-01-31",
    budget: 65_000_000,
    income: 48_500_000,
    expenses: 46_800_000,
    expenseBreakdown: [
      { category: "Materials", amount: 18_720_000 },
      { category: "Labor", amount: 11_700_000 },
      { category: "Equipment", amount: 9_360_000 },
      { category: "Subcontractors", amount: 4_680_000 },
      { category: "Permits & Fees", amount: 2_340_000 },
    ],
  },
  {
    id: "PRJ-004",
    projectName: "Harbor View Hotel",
    location: "Naypyidaw",
    category: "commercial",
    status: "Completed",
    startDate: "2023-01-10",
    endDate: "2025-12-20",
    budget: 55_000_000,
    income: 56_800_000,
    expenses: 44_300_000,
    expenseBreakdown: [
      { category: "Materials", amount: 15_505_000 },
      { category: "Labor", amount: 13_290_000 },
      { category: "Equipment", amount: 6_645_000 },
      { category: "Subcontractors", amount: 6_645_000 },
      { category: "Permits & Fees", amount: 2_215_000 },
    ],
  },
  {
    id: "PRJ-005",
    projectName: "Pinewood School Campus",
    location: "Mandalay",
    category: "institutional",
    status: "Ongoing",
    startDate: "2024-09-01",
    endDate: "2026-08-15",
    budget: 18_200_000,
    income: 14_600_000,
    expenses: 11_900_000,
    expenseBreakdown: [
      { category: "Materials", amount: 4_165_000 },
      { category: "Labor", amount: 3_570_000 },
      { category: "Equipment", amount: 1_785_000 },
      { category: "Subcontractors", amount: 1_785_000 },
      { category: "Permits & Fees", amount: 595_000 },
    ],
  },
  {
    id: "PRJ-006",
    projectName: "Grand Station Transit Hub",
    location: "Sanchaung, Yangon",
    category: "infrastructure",
    status: "Delayed",
    startDate: "2023-06-15",
    endDate: "2027-03-01",
    budget: 88_000_000,
    income: 51_200_000,
    expenses: 61_400_000,
    expenseBreakdown: [
      { category: "Materials", amount: 24_560_000 },
      { category: "Labor", amount: 15_350_000 },
      { category: "Equipment", amount: 12_280_000 },
      { category: "Subcontractors", amount: 6_140_000 },
      { category: "Permits & Fees", amount: 3_070_000 },
    ],
  },
  {
    id: "PRJ-007",
    projectName: "Windcrest Energy Park",
    location: "Sule, Yangon",
    category: "industrial",
    status: "Ongoing",
    startDate: "2025-02-01",
    endDate: "2027-10-31",
    budget: 72_000_000,
    income: 38_900_000,
    expenses: 32_100_000,
    expenseBreakdown: [
      { category: "Materials", amount: 11_235_000 },
      { category: "Labor", amount: 8_025_000 },
      { category: "Equipment", amount: 6_420_000 },
      { category: "Subcontractors", amount: 4_815_000 },
      { category: "Permits & Fees", amount: 1_605_000 },
    ],
  },
  {
    id: "PRJ-008",
    projectName: "City Hall Renovation",
    location: "Hlaing, Yangon",
    category: "commercial",
    status: "Delayed",
    startDate: "2024-11-01",
    endDate: "2026-06-30",
    budget: 15_500_000,
    income: 6_100_000,
    expenses: 9_300_000,
    expenseBreakdown: [
      { category: "Materials", amount: 3_255_000 },
      { category: "Labor", amount: 2_790_000 },
      { category: "Equipment", amount: 1_395_000 },
      { category: "Subcontractors", amount: 1_395_000 },
      { category: "Permits & Fees", amount: 465_000 },
    ],
  },
];

/* ─────────── Derived summaries ─────────── */

export function computeProjectSummary(projects: Project[]): ProjectSummary {
  const totalIncome = projects.reduce((sum, p) => sum + p.income, 0);
  const totalExpenses = projects.reduce((sum, p) => sum + p.expenses, 0);
  const netProfit = totalIncome - totalExpenses;
  const activeProjects = projects.filter(
    (p) => p.status === "Ongoing"
  ).length;

  const margins = projects.map((p) =>
    p.income > 0 ? ((p.income - p.expenses) / p.income) * 100 : 0
  );
  const averageMargin =
    margins.reduce((sum, m) => sum + m, 0) / (margins.length || 1);

  return { totalIncome, totalExpenses, netProfit, activeProjects, averageMargin };
}

/* ─────────── Formatting ─────────── */

export function formatCurrency(value: number): string {
  const abs = Math.abs(value);
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(abs);

  return value < 0 ? `-${formatted}` : formatted;
}

export function formatCurrencyShort(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) {
    const short = abs / 1_000_000;
    return `${value < 0 ? "-" : ""}$${short.toFixed(1)}M`;
  }
  if (abs >= 1_000) {
    const short = abs / 1_000;
    return `${value < 0 ? "-" : ""}$${short.toFixed(0)}K`;
  }
  return `${value < 0 ? "-" : ""}$${abs.toFixed(0)}`;
}

/* ─────────── Aggregate expense breakdown across all projects ─────────── */

export function aggregateExpenseBreakdown(projects: Project[]) {
  const map = new Map<string, number>();
  for (const p of projects) {
    for (const item of p.expenseBreakdown) {
      map.set(item.category, (map.get(item.category) ?? 0) + item.amount);
    }
  }
  return Array.from(map, ([category, amount]) => ({ category, amount }));
}
