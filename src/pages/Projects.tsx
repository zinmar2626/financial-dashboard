import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Search,
  X,
  Filter,
  WifiOff,
  RefreshCw,
  Plus,
  Loader2,
} from "lucide-react";
import useProjects from "../hooks/useProjects";
import { createProject as apiCreateProject } from "../api/projectsApi";
import ProjectTable from "../components/Dashboard/ProjectTable";
import AddProjectModal from "../components/Dashboard/AddProjectModal";
import type { Project, ProjectStatus } from "../types/project";

type StatusFilter = "All" | ProjectStatus;

const STATUS_OPTIONS: {
  label: string;
  value: StatusFilter;
  dotClass: string;
}[] = [
  { label: "All", value: "All", dotClass: "bg-slate-400" },
  { label: "Ongoing", value: "Ongoing", dotClass: "bg-blue-500" },
  { label: "Completed", value: "Completed", dotClass: "bg-emerald-500" },
  { label: "Delayed", value: "Delayed", dotClass: "bg-rose-500" },
];

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

export default function Projects() {
  const { projects: fetchedProjects, loading, error, refetch } = useProjects();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [selectedId, setSelectedId] = useState<string>("");
  const [showModal, setShowModal] = useState(false);

  /* ── Form submission state ── */
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const allProjects = fetchedProjects ?? [];

  /* ── Derived ── */

  const filteredProjects = useMemo(() => {
    let result = allProjects;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.projectName.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "All") {
      result = result.filter((p) => p.status === statusFilter);
    }

    return result;
  }, [allProjects, searchQuery, statusFilter]);

  const effectiveId = useMemo(() => {
    if (!filteredProjects.length) return "";
    if (selectedId && filteredProjects.some((p) => p.id === selectedId)) {
      return selectedId;
    }
    return filteredProjects[0]?.id ?? "";
  }, [filteredProjects, selectedId]);

  useEffect(() => {
    if (
      effectiveId &&
      effectiveId !== selectedId &&
      filteredProjects.some((p) => p.id === effectiveId)
    ) {
      setSelectedId(effectiveId);
    }
  }, [effectiveId, selectedId, filteredProjects]);

  /* ── Handlers ── */

  /** Open modal and clear any previous submit state */
  function handleOpenModal() {
    setSubmitError(null);
    setSubmitSuccess(false);
    setSubmitting(false);
    setShowModal(true);
  }

  /**
   * handleSubmit — POST the new project to the live API,
   * then refetch the project list so the UI updates automatically.
   */
  const handleAddProject = useCallback(
    async (newProject: Omit<Project, "id">) => {
      setSubmitting(true);
      setSubmitError(null);

      try {
        await apiCreateProject(newProject);

        // Re-fetch the full project list from the API
        await refetch();

        setSubmitSuccess(true);

        // Close modal after a brief success pause
        setTimeout(() => {
          setShowModal(false);
          setSubmitSuccess(false);
          setSubmitting(false);
        }, 800);
      } catch (err) {
        setSubmitting(false);
        setSubmitError(
          err instanceof Error ? err.message : "Failed to create project"
        );
      }
    },
    [refetch]
  );

  /* ── Render ── */

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-[52px] bg-white rounded-xl border border-slate-200 animate-pulse" />
        <TableSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
          <WifiOff className="w-8 h-8 text-rose-500" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800 mb-2">
          Unable to load projects
        </h3>
        <p className="text-sm text-slate-500 max-w-sm mb-6">{error}</p>
        <button
          onClick={() => refetch()}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar + Add Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-white rounded-xl border border-slate-200 px-5 py-3.5 shadow-sm">
        <div className="flex items-center gap-2 flex-1 w-full sm:w-auto min-w-0">
          <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by project name or location…"
            className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="p-0.5 rounded hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          )}
        </div>

        <div className="hidden sm:block w-px h-5 bg-slate-200 flex-shrink-0" />

        <div className="flex items-center gap-1.5 flex-wrap">
          <Filter className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mr-0.5" />
          {STATUS_OPTIONS.map((opt) => {
            const isActive = statusFilter === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setStatusFilter(opt.value)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  isActive
                    ? "bg-slate-800 text-white border-slate-800 shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                {opt.value !== "All" && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${opt.dotClass}`}
                  />
                )}
                {opt.label}
              </button>
            );
          })}
        </div>

        <div className="hidden sm:block w-px h-5 bg-slate-200 flex-shrink-0" />

        <div className="flex items-center gap-3 flex-shrink-0">
          {loading ? (
            <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
          ) : (
            <span className="text-xs text-slate-400">
              {filteredProjects.length} result
              {filteredProjects.length !== 1 ? "s" : ""}
            </span>
          )}

          {/* Add Project Button */}
          <button
            onClick={handleOpenModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/25"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Project</span>
          </button>
        </div>
      </div>

      {/* Empty filter state */}
      {filteredProjects.length === 0 ? (
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
      ) : (
        <ProjectTable
          projects={filteredProjects}
          selectedId={effectiveId}
          onSelectProject={setSelectedId}
        />
      )}

      {/* Add Project Modal — connected to live API */}
      <AddProjectModal
        open={showModal}
        onClose={() => {
          if (!submitting) setShowModal(false);
        }}
        onSave={handleAddProject}
        submitting={submitting}
        submitError={submitError}
        submitSuccess={submitSuccess}
      />
    </div>
  );
}
