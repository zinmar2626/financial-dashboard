/* ─────────── Expense Breakdown ─────────── */

export interface ExpenseBreakdownItem {
  category: string;
  amount: number;
}

/* ─────────── Enums ─────────── */

export type ProjectCategory =
  | "residential"
  | "commercial"
  | "infrastructure"
  | "industrial"
  | "institutional";

export type ProjectStatus = "Ongoing" | "Completed" | "Delayed";

/* ─────────── Core Project ─────────── */

export interface Project {
  id: string;
  projectName: string;
  location: string;

  category: ProjectCategory;
  status: ProjectStatus;

  startDate: string;
  endDate: string;

  /** Total approved budget */
  budget: number;

  /** Total revenue / income received to date */
  income: number;

  /** Total costs incurred to date */
  expenses: number;

  /** Detailed cost breakdown by category */
  expenseBreakdown: ExpenseBreakdownItem[];
}

/* ─────────── Derived summaries ─────────── */

export interface ProjectSummary {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  activeProjects: number;
  averageMargin: number;
}

/* ─────────── Table sorting ─────────── */

export type SortField =
  | "projectName"
  | "location"
  | "category"
  | "status"
  | "budget"
  | "income"
  | "expenses"
  | "profit"
  | "margin";

export type SortDirection = "asc" | "desc";
