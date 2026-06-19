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

interface RevenueExpenseChartProps {
  projects: Project[];
}

interface ChartData {
  name: string;
  income: number;
  expenses: number;
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
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-sm">
      <p className="font-semibold text-slate-800 mb-1.5">{label}</p>
      {payload.map((entry) => (
        <div
          key={entry.name}
          className="flex items-center justify-between gap-6"
        >
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-sm"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-slate-500 capitalize">{entry.name}</span>
          </div>
          <span className="font-medium text-slate-800">
            {formatCurrencyShort(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function RevenueExpenseChart({
  projects,
}: RevenueExpenseChartProps) {
  const data: ChartData[] = projects.map((p) => ({
    name: truncateName(p.projectName),
    income: p.income,
    expenses: p.expenses,
  }));

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <h3 className="text-base font-semibold text-slate-800 mb-4">
        Income vs Expenses by Project
      </h3>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={data}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          barGap={6}
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
          <Bar
            dataKey="income"
            name="Income"
            fill="#10b981"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="expenses"
            name="Expenses"
            fill="#f43f5e"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
