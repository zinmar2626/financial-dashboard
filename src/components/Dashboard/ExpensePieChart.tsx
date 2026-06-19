import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { AlertTriangle } from "lucide-react";
import type { Project } from "../../types/project";
import { formatCurrency, formatCurrencyShort } from "../../data/mockProjects";

interface ExpensePieChartProps {
  project: Project;
}

const COLORS = [
  "#6366f1", // Indigo
  "#f59e0b", // Amber
  "#10b981", // Emerald
  "#f43f5e", // Rose
  "#8b5cf6", // Violet
];

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number }>;
}) {
  if (!active || !payload?.length) return null;
  const entry = payload[0];
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg px-3 py-2 text-sm">
      <div className="flex items-center gap-2 mb-0.5">
        <span
          className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
          style={{ backgroundColor: entry.color }}
        />
        <span className="font-medium text-slate-700">{entry.name}</span>
      </div>
      <p className="text-slate-500 ml-[18px]">{formatCurrency(entry.value)}</p>
    </div>
  );
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
function renderCustomLabel({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: any) {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.65;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.06) return null;

  return (
    <text
      x={x}
      y={y}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="central"
      style={{ fontSize: 12, fontWeight: 600 }}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

export default function ExpensePieChart({ project }: ExpensePieChartProps) {
  const data = useMemo(
    () =>
      project.expenseBreakdown.map((item) => ({
        name: item.category,
        value: item.amount,
      })),
    [project]
  );

  const isOverIncome = project.expenses > project.income;
  const isOverBudget = project.expenses > project.budget;

  return (
    <div
      className={`bg-white rounded-xl border p-5 shadow-sm ${
        isOverIncome ? "border-rose-200" : "border-slate-200"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-slate-800">
            Expense Breakdown
          </h3>
          {isOverIncome && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 text-[10px] font-semibold border border-rose-200">
              <AlertTriangle className="w-3 h-3" />
              Warning
            </span>
          )}
        </div>
        <span className="text-xs text-slate-400 font-medium">
          {project.projectName}
        </span>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={110}
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
            label={renderCustomLabel}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={COLORS[index % COLORS.length]}
                stroke="none"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
            iconType="rect"
            iconSize={10}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Total + context */}
      <div className="text-center mt-2">
        <span
          className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold ${
            isOverIncome
              ? "bg-rose-50 text-rose-700"
              : "bg-slate-50 text-slate-600"
          }`}
        >
          Total Expenses: {formatCurrencyShort(project.expenses)}
        </span>
      </div>

      {/* Over-income detail */}
      {isOverIncome && (
        <div className="text-center mt-2">
          <p className="text-[11px] text-rose-500">
            {isOverBudget
              ? `Exceeds budget by ${formatCurrencyShort(project.expenses - project.budget)}`
              : `Exceeds income by ${formatCurrencyShort(project.expenses - project.income)}`}
          </p>
        </div>
      )}

      {/* Quick breakdown summary */}
      <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-x-2 gap-y-1">
        {project.expenseBreakdown.slice(0, 4).map((item) => {
          const pct =
            project.expenses > 0
              ? (item.amount / project.expenses) * 100
              : 0;
          return (
            <div
              key={item.category}
              className="flex items-center justify-between text-xs"
            >
              <span className="text-slate-500 truncate">{item.category}</span>
              <span className="font-medium text-slate-600 ml-2 flex-shrink-0">
                {pct.toFixed(0)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
