import { useState, useMemo } from "react";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MapPin,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import type { Project, SortField, SortDirection } from "../../types/project";
import { formatCurrency, formatCurrencyShort } from "../../data/mockProjects";

interface ProjectTableProps {
  projects: Project[];
  selectedId: string | null;
  onSelectProject: (id: string) => void;
}

interface Column {
  key: SortField | "budgetUsage";
  label: string;
  align: "left" | "right";
}

const columns: Column[] = [
  { key: "projectName", label: "Project", align: "left" },
  { key: "location",   label: "Location",  align: "left" },
  { key: "status",      label: "Status",    align: "left" },
  { key: "income",      label: "Income",    align: "right" },
  { key: "expenses",    label: "Expenses",  align: "right" },
  { key: "budgetUsage", label: "Budget Usage", align: "left" },
];

const statusStyles: Record<string, string> = {
  Ongoing:   "bg-blue-50 text-blue-700 border-blue-200",
  Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Delayed:   "bg-rose-50 text-rose-700 border-rose-200",
};

function getUsageColor(pct: number): string {
  if (pct > 100) return "#f43f5e";
  if (pct >= 80) return "#f59e0b";
  if (pct >= 50) return "#6366f1";
  return "#10b981";
}

function getUsageBg(pct: number): string {
  if (pct > 100) return "bg-rose-500";
  if (pct >= 80) return "bg-amber-500";
  if (pct >= 50) return "bg-indigo-500";
  return "bg-emerald-500";
}

export default function ProjectTable({
  projects,
  selectedId,
  onSelectProject,
}: ProjectTableProps) {
  const [sortField, setSortField] = useState<SortField>("projectName");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const sorted = useMemo(() => {
    const sorted = [...projects].sort((a, b) => {
      let aVal: string | number;
      let bVal: string | number;

      if (sortField === "profit") {
        aVal = a.income - a.expenses;
        bVal = b.income - b.expenses;
      } else if (sortField === "margin") {
        aVal = a.income > 0 ? ((a.income - a.expenses) / a.income) * 100 : 0;
        bVal = b.income > 0 ? ((b.income - b.expenses) / b.income) * 100 : 0;
      } else {
        aVal = a[sortField];
        bVal = b[sortField];
      }

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDirection === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return sortDirection === "asc"
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });
    return sorted;
  }, [projects, sortField, sortDirection]);

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  }

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-300" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="w-3.5 h-3.5 text-blue-600" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-800">
          All Projects
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">
            {projects.length} total
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50">
              {/* Expand column */}
              <th className="w-10 px-3 py-3" />
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() =>
                    col.key !== "budgetUsage" && handleSort(col.key as SortField)
                  }
                  className={`px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider select-none group ${
                    col.key === "budgetUsage"
                      ? "cursor-default"
                      : "cursor-pointer hover:text-slate-700 transition-colors"
                  } ${col.align === "right" ? "text-right" : "text-left"}`}
                >
                  <div
                    className={`inline-flex items-center gap-1 ${
                      col.align === "right" ? "flex-row-reverse" : ""
                    }`}
                  >
                    {col.label}
                    {col.key !== "budgetUsage" && (
                      <SortIcon field={col.key as SortField} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {sorted.map((project) => {
              const profit = project.income - project.expenses;
              const margin =
                project.income > 0
                  ? (profit / project.income) * 100
                  : 0;
              const isLoss = profit < 0;

              /* ── Conditional styling flags ── */
              const isOverIncome = project.expenses > project.income;
              const isOverBudget = project.expenses > project.budget;

              const isExpanded = expandedRow === project.id;
              const isSelected = selectedId === project.id;
              const budgetUsagePct =
                project.budget > 0
                  ? (project.expenses / project.budget) * 100
                  : 0;

              return (
                <>
                  {/* Main row */}
                  <tr
                    key={project.id}
                    onClick={() => onSelectProject(project.id)}
                    className={`transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-blue-50/70 ring-1 ring-inset ring-blue-200"
                        : isOverBudget
                        ? "hover:bg-rose-50/50"
                        : "hover:bg-slate-50/70"
                    }`}
                  >
                    {/* Expand toggle */}
                    <td className="px-3 py-3.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedRow(isExpanded ? null : project.id);
                        }}
                        className="p-0.5 rounded hover:bg-slate-200 transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-slate-500" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        )}
                      </button>
                    </td>

                    {/* Project name + ID */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-slate-400 mt-0.5">
                          {project.id}
                        </p>
                        <p className="font-medium text-slate-800">
                          {project.projectName}
                        </p> 
                        {/* Over-budget inline indicator */}
                        {isOverIncome && (
                          <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                        )}
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        {project.location}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          statusStyles[project.status]
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            project.status === "Ongoing"
                              ? "bg-blue-500"
                              : project.status === "Completed"
                              ? "bg-emerald-500"
                              : "bg-rose-500"
                          }`}
                        />
                        {project.status}
                      </span>
                    </td>

                    {/* Income — dim if < expenses */}
                    <td
                      className={`px-4 py-3.5 text-right font-medium ${
                        isOverIncome
                          ? "text-slate-400"
                          : "text-emerald-600"
                      }`}
                    >
                      {formatCurrency(project.income)}
                    </td>

                    {/* Expenses — red highlight when exceeding income */}
                    <td
                      className={`px-4 py-3.5 text-right font-semibold ${
                        isOverIncome
                          ? "text-rose-600 bg-rose-50/50 rounded-md"
                          : "text-slate-700"
                      }`}
                    >
                      <span className="inline-flex items-center gap-1">
                        {formatCurrency(project.expenses)}
                        {isOverIncome && (
                          <span className="text-[10px] text-rose-400 font-normal">
                            ▲{formatCurrencyShort(project.expenses - project.income)}
                          </span>
                        )}
                      </span>
                    </td>

                    {/* Budget Usage progress bar */}
                    <td className="px-4 py-3.5 min-w-[180px]">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${getUsageBg(
                              budgetUsagePct
                            )}`}
                            style={{
                              width: `${Math.min(budgetUsagePct, 100)}%`,
                            }}
                          />
                        </div>
                        <span
                          className="text-xs font-semibold w-12 text-right"
                          style={{
                            color: getUsageColor(budgetUsagePct),
                          }}
                        >
                          {budgetUsagePct.toFixed(0)}%
                        </span>
                      </div>
                      {/* Over-budget label */}
                      {isOverBudget && (
                        <p className="text-[10px] text-rose-500 font-medium mt-0.5 ml-1">
                          Over budget by{" "}
                          {formatCurrencyShort(
                            project.expenses - project.budget
                          )}
                        </p>
                      )}
                    </td>
                  </tr>

                  {/* Expanded detail row */}
                  {isExpanded && (
                    <tr key={`${project.id}-detail`}>
                      <td colSpan={8} className="px-4 py-4 bg-slate-50/70">
                        <div className="flex flex-wrap gap-5">
                          {/* Expense breakdown bars */}
                          <div className="flex-1 min-w-[220px]">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                              Expense Breakdown
                            </p>
                            <div className="space-y-2.5">
                              {project.expenseBreakdown.map((item) => {
                                const pct =
                                  project.expenses > 0
                                    ? (item.amount / project.expenses) * 100
                                    : 0;
                                return (
                                  <div key={item.category}>
                                    <div className="flex items-center justify-between text-sm mb-0.5">
                                      <span className="text-slate-600 font-medium">
                                        {item.category}
                                      </span>
                                      <span className="text-xs text-slate-500">
                                        {formatCurrencyShort(item.amount)} ·{" "}
                                        {pct.toFixed(0)}%
                                      </span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-indigo-400 rounded-full"
                                        style={{ width: `${pct}%` }}
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Timeline + KPIs */}
                          <div className="min-w-[200px] space-y-3">
                            <div>
                              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                Timeline
                              </p>
                              <div className="text-sm space-y-1">
                                <div className="flex justify-between">
                                  <span className="text-slate-500">Start</span>
                                  <span className="font-medium text-slate-700">
                                    {new Date(
                                      project.startDate
                                    ).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-500">
                                    Est. End
                                  </span>
                                  <span className="font-medium text-slate-700">
                                    {new Date(
                                      project.endDate
                                    ).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                Quick Stats
                              </p>
                              <div className="text-sm space-y-1">
                                <div className="flex justify-between">
                                  <span className="text-slate-500">
                                    Budget Used
                                  </span>
                                  <span
                                    className={`font-medium ${
                                      isOverBudget
                                        ? "text-rose-600"
                                        : "text-slate-700"
                                    }`}
                                  >
                                    {budgetUsagePct.toFixed(1)}%
                                    {isOverBudget && " ⚠"}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-500">
                                    Net Profit
                                  </span>
                                  <span
                                    className={`font-semibold ${
                                      isLoss
                                        ? "text-rose-600"
                                        : "text-emerald-600"
                                    }`}
                                  >
                                    {formatCurrencyShort(profit)}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-500">
                                    Margin
                                  </span>
                                  <span
                                    className={`font-semibold ${
                                      margin >= 0
                                        ? "text-emerald-600"
                                        : "text-rose-600"
                                    }`}
                                  >
                                    {margin >= 0 ? "+" : ""}
                                    {margin.toFixed(1)}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="px-5 py-3 border-t border-slate-100 text-xs text-slate-400 flex items-center gap-1">
        Click a row to select a project
        <span className="text-slate-300">·</span>
        <span>Use the chevron to expand details</span>
      </div>
    </div>
  );
}
