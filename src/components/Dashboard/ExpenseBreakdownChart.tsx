import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { Project } from "../../types/project";
import { formatCurrencyShort } from "../../data/mockProjects";

interface ExpenseBreakdownChartProps {
  projects: Project[];
}

/* A palette that stays readable even when multiple categories stack together */
const CATEGORY_COLORS = [
  "#6366f1", // Indigo   — Materials
  "#f59e0b", // Amber    — Labor
  "#10b981", // Emerald  — Equipment
  "#f43f5e", // Rose     — Subcontractors
  "#8b5cf6", // Violet   — Permits & Fees
];

/** Collect every unique expense category across all projects. */
function collectCategories(projects: Project[]): string[] {
  const set = new Set<string>();
  for (const p of projects) {
    for (const item of p.expenseBreakdown) {
      set.add(item.category);
    }
  }
  return Array.from(set);
}

interface ChartRow {
  name: string;
  total: number;
  [category: string]: number | string;
}

function truncateName(name: string, maxLen: number = 12): string {
  return name.length > maxLen ? name.slice(0, maxLen) + "…" : name;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-sm min-w-[180px]">
      <p className="font-semibold text-slate-800 mb-1.5">{label}</p>
      {payload
        .filter((e) => (e.value as number) > 0)
        .map((entry) => (
          <div
            key={entry.name}
            className="flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-sm"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-slate-500 text-xs">{entry.name}</span>
            </div>
            <span className="font-medium text-slate-800 text-xs">
              {formatCurrencyShort(entry.value)}
            </span>
          </div>
        ))}
    </div>
  );
}

export default function ExpenseBreakdownChart({
  projects,
}: ExpenseBreakdownChartProps) {
  const categories = collectCategories(projects);

  const data: ChartRow[] = projects.map((p) => {
    const row: ChartRow = {
      name: truncateName(p.projectName),
      total: p.expenses,
    };
    for (const item of p.expenseBreakdown) {
      row[item.category] = item.amount;
    }
    return row;
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <h3 className="text-base font-semibold text-slate-800 mb-4">
        Expense Breakdown by Category
      </h3>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={data}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e2e8f0"
            vertical={false}
          />
          <XAxis
            dataKey="name"
            tick={{ fill: "#64748b", fontSize: 12 }}
            axisLine={{ stroke: "#e2e8f0" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#64748b", fontSize: 12 }}
            axisLine={{ stroke: "#e2e8f0" }}
            tickLine={false}
            tickFormatter={(v: number) => formatCurrencyShort(v)}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f1f5f9" }} />
          <Legend
            wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
            iconType="rect"
          />
          {categories.map((cat, i) => (
            <Bar
              key={cat}
              dataKey={cat}
              name={cat}
              stackId="expenses"
              fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
