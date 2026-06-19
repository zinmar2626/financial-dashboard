import { useState, useMemo, useEffect } from "react";
import {
  RefreshCw,
  WifiOff,
  Search,
  ChevronDown,
  MapPin,
  X,
  Filter,
} from "lucide-react";
import useProjects from "../hooks/useProjects";
import KPICards from "../components/Dashboard/KPICards";
import ProjectTable from "../components/Dashboard/ProjectTable";
import { formatCurrencyShort } from "../data/mockProjects";
import type { Project, ProjectStatus } from "../types/project";

/* ─────────── Types ─────────── */

type StatusFilter = "All" | ProjectStatus;

/* ─────────── Loading skeletons ─────────── */

function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="h-3 w-24 bg-slate-200 rounded" />
        <div className="h-9 w-9 bg-slate-200 rounded-lg" />
      </div>
      <div className="h-7 w-32 bg-slate-200 rounded mb-2" />
      <div className="h-3 w-20 bg-slate-100 rounded" />
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm animate-pulse">
      <div className="px-5 py-4 border-b border-slate-100">
        <div className="h-4 w-36 bg-slate-200 rounded" />
      </div>
      <div className="px-5 py-4 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-6">
            <div className="h-4 flex-1 bg-slate-100 rounded" />
            <div className="h-4 w-20 bg-slate-100 rounded" />
            <div className="h-4 w-16 bg-slate-100 rounded" />
            <div className="h-4 w-40 bg-slate-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
      <div className="h-[52px] bg-white rounded-xl border border-slate-200 animate-pulse" />
      <div className="h-12 bg-white rounded-xl border border-slate-200 animate-pulse" />
      <TableSkeleton />
    </div>
  );
}

/* ─────────── Error state ─────────── */

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
        <WifiOff className="w-8 h-8 text-rose-500" />
      </div>
      <h3 className="text-lg font-semibold text-slate-800 mb-2">
        Unable to load dashboard
      </h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6">{message}</p>
      <button
        onClick={() => window.location.reload()}
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
      >
        <RefreshCw className="w-4 h-4" />
        Retry
      </button>
    </div>
  );
}

/* ─────────── Search & Filter Bar ─────────── */

const STATUS_OPTIONS: { label: string; value: StatusFilter; dotClass: string }[] = [
  { label: "All",       value: "All",       dotClass: "bg-slate-400" },
  { label: "Ongoing",   value: "Ongoing",   dotClass: "bg-blue-500" },
  { label: "Completed", value: "Completed", dotClass: "bg-emerald-500" },
  { label: "Delayed",   value: "Delayed",   dotClass: "bg-rose-500" },
];

function SearchFilterBar({
  query,
  onQueryChange,
  statusFilter,
  onStatusChange,
  resultCount,
}: {
  query: string;
  onQueryChange: (v: string) => void;
  statusFilter: StatusFilter;
  onStatusChange: (v: StatusFilter) => void;
  resultCount: number;
}) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-white rounded-xl border border-slate-200 px-5 py-3.5 shadow-sm">
      {/* Search */}
      <div className="flex items-center gap-2 flex-1 w-full sm:w-auto min-w-0">
        <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Filter by project name or location…"
          className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none"
        />
        {query && (
          <button
            onClick={() => onQueryChange("")}
            className="p-0.5 rounded hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="hidden sm:block w-px h-5 bg-slate-200 flex-shrink-0" />

      {/* Status filter chips */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <Filter className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mr-0.5" />
        {STATUS_OPTIONS.map((opt) => {
          const isActive = statusFilter === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onStatusChange(opt.value)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                isActive
                  ? "bg-slate-800 text-white border-slate-800 shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              {opt.value !== "All" && (
                <span className={`w-1.5 h-1.5 rounded-full ${opt.dotClass}`} />
              )}
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Result count */}
      <div className="flex-shrink-0 text-xs text-slate-400">
        {resultCount} result{resultCount !== 1 ? "s" : ""}
      </div>
    </div>
  );
}

/* ─────────── Project Selector ─────────── */

function ProjectSelector({
  projects,
  selectedId,
  onChange,
}: {
  projects: Project[];
  selectedId: string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selected = projects.find((p) => p.id === selectedId) ?? projects[0];

  const filtered = useMemo(() => {
    if (!query.trim()) return projects;
    const q = query.toLowerCase();
    return projects.filter(
      (p) =>
        p.projectName.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
    );
  }, [projects, query]);

  if (!selected) return null;

  return (
    <div className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between bg-white border border-slate-200 rounded-xl px-5 py-4 shadow-sm hover:border-blue-300 hover:shadow-md transition-all"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-white">
              {selected.projectName.charAt(0)}
            </span>
          </div>
          <div className="text-left">
            <p className="text-base font-semibold text-slate-800">
              {selected.projectName}
            </p>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <MapPin className="w-3 h-3" />
                {selected.location}
              </span>
              <span className="text-xs text-slate-500">
                {formatCurrencyShort(selected.budget)} budget
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`hidden sm:inline px-2.5 py-0.5 rounded-full text-xs font-medium border ${
              selected.status === "Ongoing"
                ? "bg-blue-50 text-blue-700 border-blue-200"
                : selected.status === "Completed"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-rose-50 text-rose-700 border-rose-200"
            }`}
          >
            {selected.status}
          </span>
          <ChevronDown
            className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* Dropdown */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => {
              setOpen(false);
              setQuery("");
            }}
          />

          <div className="absolute left-0 right-0 top-full mt-2 z-20 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100">
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Filter projects..."
                  className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none"
                  autoFocus
                />
              </div>
            </div>

            <div className="max-h-64 overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <p className="px-4 py-6 text-sm text-slate-400 text-center">
                  No projects match "{query}"
                </p>
              ) : (
                filtered.map((p) => {
                  const isActive = p.id === selectedId;
                  const profit = p.income - p.expenses;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        onChange(p.id);
                        setOpen(false);
                        setQuery("");
                      }}
                      className={`w-full flex items-center gap-4 px-5 py-3 text-left transition-colors ${
                        isActive
                          ? "bg-blue-50 border-l-[3px] border-l-blue-600"
                          : "border-l-[3px] border-l-transparent hover:bg-slate-50"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                          isActive
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {p.projectName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-slate-800 truncate">
                            {p.projectName}
                          </p>
                          <span
                            className={`inline-block px-2 py-px rounded-full text-[10px] font-medium border ${
                              p.status === "Ongoing"
                                ? "bg-blue-50 text-blue-600 border-blue-200"
                                : p.status === "Completed"
                                ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                : "bg-rose-50 text-rose-600 border-rose-200"
                            }`}
                          >
                            {p.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {p.location} · {formatCurrencyShort(p.budget)}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p
                          className={`text-sm font-semibold ${
                            profit >= 0 ? "text-emerald-600" : "text-rose-600"
                          }`}
                        >
                          {profit >= 0 ? "+" : ""}
                          {formatCurrencyShort(profit)}
                        </p>
                        <p className="text-[10px] text-slate-400">net</p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            <div className="px-4 py-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>{projects.length} projects</span>
              <span>Click to select</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ─────────── Dashboard ─────────── */

export default function Dashboard() {
  const { projects, loading, error } = useProjects();

  /* Filter state */
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [selectedId, setSelectedId] = useState<string>("");

  /* Filter projects by search text and status */
  const filteredProjects = useMemo(() => {
    if (!projects) return [];

    let result = projects;

    // Text search: match project name, location, or ID
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.projectName.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter !== "All") {
      result = result.filter((p) => p.status === statusFilter);
    }

    return result;
  }, [projects, searchQuery, statusFilter]);

  /* Ensure selected ID stays valid when filters change */
  const effectiveId = useMemo(() => {
    if (!filteredProjects.length) return "";
    if (selectedId && filteredProjects.some((p) => p.id === selectedId)) {
      return selectedId;
    }
    return filteredProjects[0]?.id ?? "";
  }, [filteredProjects, selectedId]);

  // Auto-select first filtered project when current selection is filtered out
  useEffect(() => {
    if (
      effectiveId &&
      effectiveId !== selectedId &&
      filteredProjects.some((p) => p.id === effectiveId)
    ) {
      setSelectedId(effectiveId);
    }
  }, [effectiveId, selectedId, filteredProjects]);

  /* Derived: projects that are over-income (expenses > income) */
  const overIncomeCount = useMemo(
    () =>
      projects?.filter((p) => p.expenses > p.income).length ?? 0,
    [projects]
  );

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!projects) return null;

  return (
    <div className="space-y-6">
      {/* ── 1. Summary KPI Cards (always full dataset) ── */}
      <KPICards projects={projects} />

      {/* ── 2. Search & Filter Bar ── */}
      <SearchFilterBar
        query={searchQuery}
        onQueryChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        resultCount={filteredProjects.length}
      />

      {/* ── 3. Project Selector ── */}
      {filteredProjects.length > 0 && (
        <ProjectSelector
          projects={filteredProjects}
          selectedId={effectiveId}
          onChange={setSelectedId}
        />
      )}

      {/* Empty filter state */}
      {filteredProjects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-xl border border-slate-200">
          <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
            <Search className="w-6 h-6 text-slate-400" />
          </div>
          <h3 className="text-base font-semibold text-slate-700 mb-1">
            No projects found
          </h3>
          <p className="text-sm text-slate-400 max-w-xs mb-4">
            No projects match{" "}
            <span className="font-medium text-slate-600">"{searchQuery}"</span>
            {statusFilter !== "All" && (
              <>
                {" "}
                with status{" "}
                <span className="font-medium text-slate-600">
                  "{statusFilter}"
                </span>
              </>
            )}
            .
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("All");
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
            Clear Filters
          </button>
        </div>
      )}

      {/* ── 4. Project Status Table ── */}
      <ProjectTable
        projects={filteredProjects}
        selectedId={effectiveId}
        onSelectProject={setSelectedId}
      />

      {/* Global over-income summary */}
      {overIncomeCount > 0 && (
        <div className="text-center text-xs text-slate-400">
          {overIncomeCount} project{overIncomeCount !== 1 ? "s" : ""} with
          expenses exceeding income
        </div>
      )}
    </div>
  );
}
