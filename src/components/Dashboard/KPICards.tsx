import { DollarSign, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import type { Project } from "../../types/project";
import StatCard from "../ui/StatCard";

interface KPICardsProps {
  projects: Project[];
}

function formatFull(value: number): string {
  const abs = Math.abs(value);
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(abs);
  return value < 0 ? `-${formatted}` : formatted;
}

export default function KPICards({ projects }: KPICardsProps) {
  const totalBudget   = projects.reduce((s, p) => s + p.budget,   0);
  const totalIncome   = projects.reduce((s, p) => s + p.income,   0);
  const totalExpenses = projects.reduce((s, p) => s + p.expenses, 0);
  const netProfit     = totalIncome - totalExpenses;
  const isLoss        = netProfit < 0;

  const avgMargin =
    totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  const cards = [
    {
      title: "Total Budget",
      value: formatFull(totalBudget),
      icon: Wallet,
      accent: "budget" as const,
      trend: undefined,
    },
    {
      title: "Total Income",
      value: formatFull(totalIncome),
      icon: TrendingUp,
      accent: "revenue" as const,
      trend: 12.4,
      trendLabel: "vs last quarter",
    },
    {
      title: "Total Expenses",
      value: formatFull(totalExpenses),
      icon: TrendingDown,
      accent: "expense" as const,
      trend: 8.2,
      trendLabel: "vs last quarter",
    },
    {
      title: "Net Profit",
      value: formatFull(netProfit),
      icon: DollarSign,
      accent: isLoss ? ("expense" as const) : ("profit" as const),
      trend: avgMargin,
      trendLabel: "avg margin",
      negative: isLoss,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <StatCard key={card.title} {...card} />
      ))}
    </div>
  );
}
