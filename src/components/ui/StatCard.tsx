import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: number;
  trendLabel?: string;
  accent: "revenue" | "expense" | "profit" | "warning" | "budget";
  /** When true, the value text renders in rose-600 instead of slate-900 */
  negative?: boolean;
}

const accentStyles: Record<
  StatCardProps["accent"],
  { bg: string; iconBg: string; text: string }
> = {
  revenue: {
    bg: "bg-emerald-50",
    iconBg: "bg-emerald-100",
    text: "text-emerald-700",
  },
  expense: {
    bg: "bg-rose-50",
    iconBg: "bg-rose-100",
    text: "text-rose-700",
  },
  profit: {
    bg: "bg-blue-50",
    iconBg: "bg-blue-100",
    text: "text-blue-700",
  },
  budget: {
    bg: "bg-violet-50",
    iconBg: "bg-violet-100",
    text: "text-violet-700",
  },
  warning: {
    bg: "bg-amber-50",
    iconBg: "bg-amber-100",
    text: "text-amber-700",
  },
};

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  accent,
  negative = false,
}: StatCardProps) {
  const style = accentStyles[accent];

  return (
    <div
      className={`bg-white rounded-xl border p-5 shadow-sm hover:shadow-md transition-shadow ${
        negative ? "border-rose-200 bg-rose-50/30" : "border-slate-200"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-slate-500 tracking-wide uppercase">
          {title}
        </span>
        <div className={`p-2 rounded-lg ${style.iconBg}`}>
          <Icon className={`w-5 h-5 ${style.text}`} />
        </div>
      </div>
      <div
        className={`text-xl sm:text-2xl font-bold tracking-tight break-all ${
          negative ? "text-rose-600" : "text-slate-900"
        }`}
      >
        {value}
      </div>
      {trend !== undefined && (
        <div className="flex items-center gap-1.5 mt-2">
          {trend >= 0 ? (
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-rose-500" />
          )}
          <span
            className={`text-xs font-semibold ${
              trend >= 0 ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {trend >= 0 ? "+" : ""}
            {trend.toFixed(1)}%
          </span>
          {trendLabel && (
            <span className="text-xs text-slate-400">{trendLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
