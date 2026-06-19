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
import type { Project } from "../../types/project";
import { formatCurrencyShort } from "../../data/mockProjects";

interface ProfitMarginChartProps {
  projects: Project[];
}

interface ChartData {
  name: string;
  margin: number;
  profit: number;
}

function truncateName(name: string, maxLen: number = 14): string {
  return name.length > maxLen ? name.slice(0, maxLen) + "…" : name;
}

function getBarColor(margin: number): string {
  if (margin >= 20) return "#10b981";
  if (margin >= 10) return "#2563eb";
  if (margin >= 0) return "#f59e0b";
  return "#f43f5e";
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ payload: ChartData }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-sm">
      <p className="font-semibold text-slate-800 mb-1">{label}</p>
      <div className="flex items-center justify-between gap-6">
        <span className="text-slate-500">Margin</span>
        <span className="font-medium text-slate-800">
          {d.margin.toFixed(1)}%
        </span>
      </div>
      <div className="flex items-center justify-between gap-6">
        <span className="text-slate-500">Net Profit</span>
        <span className="font-medium text-slate-800">
          {formatCurrencyShort(d.profit)}
        </span>
      </div>
    </div>
  );
}

export default function ProfitMarginChart({
  projects,
}: ProfitMarginChartProps) {
  const data: ChartData[] = projects
    .map((p) => {
      const profit = p.income - p.expenses;
      const margin = p.income > 0 ? (profit / p.income) * 100 : 0;
      return {
        name: truncateName(p.projectName),
        margin: Math.round(margin * 10) / 10,
        profit,
      };
    })
    .sort((a, b) => b.margin - a.margin);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <h3 className="text-base font-semibold text-slate-800 mb-4">
        Profit Margin % by Project
      </h3>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 40, left: 10, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e2e8f0"
            horizontal={false}
          />
          <XAxis
            type="number"
            tick={{ fill: "#64748b", fontSize: 12 }}
            axisLine={{ stroke: "#e2e8f0" }}
            tickLine={false}
            tickFormatter={(v: number) => `${v}%`}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: "#64748b", fontSize: 11 }}
            axisLine={{ stroke: "#e2e8f0" }}
            tickLine={false}
            width={100}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f1f5f9" }} />
          <Bar dataKey="margin" radius={[0, 4, 4, 0]} barSize={28}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={getBarColor(entry.margin)} />
            ))}
            <LabelList
              dataKey="margin"
              position="right"
              formatter={(v: unknown) =>
                `${typeof v === "number" ? v : Number(v)}%`
              }
              style={{ fill: "#475569", fontSize: 12, fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
