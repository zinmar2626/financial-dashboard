import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { AlertTriangle } from "lucide-react";
import type { Project } from "../../types/project";
import { formatCurrency, formatCurrencyShort } from "../../data/mockProjects";

interface BudgetIncomeExpenseChartProps {
  project: Project;
}

interface ChartData {
  name: string;
  value: number;
  fill: string;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: ChartData }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-sm">
      <p className="font-semibold text-slate-800 mb-1">{d.name}</p>
      <p className="text-slate-500">{formatCurrencyShort(d.value)}</p>
    </div>
  );
}

export default function BudgetIncomeExpenseChart({
  project,
}: BudgetIncomeExpenseChartProps) {
  const profit = project.income - project.expenses;
  const budgetRemaining = project.budget - project.expenses;
  const isOverIncome = project.expenses > project.income;
  const isOverBudget = project.expenses > project.budget;

  const data: ChartData[] = [
    { name: "Budget",   value: project.budget,   fill: "#8b5cf6" },
    { name: "Income",   value: project.income,   fill: "#10b981" },
    { name: "Expenses", value: project.expenses, fill: "#f43f5e" },
  ];

  return (
    <div
      className={`bg-white rounded-xl border p-5 shadow-sm ${
        isOverIncome ? "border-rose-200" : "border-slate-200"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-slate-800">
            Budget vs Income vs Expenses
          </h3>
          {isOverIncome && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 text-[10px] font-semibold border border-rose-200">
              <AlertTriangle className="w-3 h-3" />
              Over Income
            </span>
          )}
        </div>
        <span className="text-xs text-slate-400 font-medium">
          {project.projectName}
        </span>
      </div>

      <ResponsiveContainer width="100%" height={300}>
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
            tick={{ fill: "#64748b", fontSize: 13, fontWeight: 500 }}
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
          <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={52}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.fill} />
            ))}
            <LabelList
              dataKey="value"
              position="top"
              formatter={(v: unknown) =>
                formatCurrencyShort(typeof v === "number" ? v : Number(v))
              }
              style={{ fill: "#475569", fontSize: 12, fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Summary row */}
      <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100">
        <div
          className={`rounded-lg px-3 py-2.5 ${
            isOverIncome ? "bg-rose-50" : "bg-slate-50"
          }`}
        >
          <p className="text-xs text-slate-400 mb-0.5">Net Profit / Loss</p>
          <p
            className={`text-sm font-bold ${
              profit >= 0 ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {profit >= 0 ? "+" : "−"}
            {formatCurrencyShort(Math.abs(profit))}
          </p>
        </div>
        <div
          className={`rounded-lg px-3 py-2.5 ${
            isOverBudget ? "bg-rose-50" : "bg-slate-50"
          }`}
        >
          <p className="text-xs text-slate-400 mb-0.5">Budget Remaining</p>
          <p
            className={`text-sm font-bold ${
              budgetRemaining >= 0 ? "text-violet-600" : "text-rose-600"
            }`}
          >
            {formatCurrencyShort(budgetRemaining)}
          </p>
        </div>
      </div>

      {/* Over-income explanation banner */}
      {isOverIncome && (
        <div className="mt-3 pt-3 border-t border-rose-100">
          <p className="text-xs text-rose-600">
            Expenses exceed income by{" "}
            <span className="font-semibold">
              {formatCurrency(project.expenses - project.income)}
            </span>
            . Revenue must increase or costs must be reduced to restore
            profitability.
          </p>
        </div>
      )}
    </div>
  );
}
