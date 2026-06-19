import type { Project } from "../types/project";

const API_BASE =
  "https://6a352602f957779fdb302bbc.mockapi.io/zinmar2626/financial_project";

/* ─────────── GET all projects ─────────── */

export async function fetchProjects(): Promise<Project[]> {
  const res = await fetch(API_BASE);

  if (!res.ok) {
    throw new Error(`Failed to fetch projects (HTTP ${res.status})`);
  }

  const data = await res.json();

  return data.map(normaliseProject);
}

/* ─────────── POST new project ─────────── */

export async function createProject(
  project: Omit<Project, "id">
): Promise<Project> {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(project),
  });

  if (!res.ok) {
    throw new Error(`Failed to create project (HTTP ${res.status})`);
  }

  const data = await res.json();
  return normaliseProject(data);
}

/* ─────────── DELETE a project ─────────── */

export async function deleteProject(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });

  if (!res.ok) {
    throw new Error(`Failed to delete project (HTTP ${res.status})`);
  }
}

/* ─────────── helpers ─────────── */

/**
 * MockAPI returns `expenseBreakdown` as an object when empty or malformed.
 * Normalise it to always be an array so the UI doesn't break.
 */
function normaliseProject(raw: Record<string, unknown>): Project {
  let breakdown: { category: string; amount: number }[] = [];

  if (Array.isArray(raw.expenseBreakdown)) {
    breakdown = raw.expenseBreakdown as { category: string; amount: number }[];
  }

  return {
    id: String(raw.id ?? ""),
    projectName: String(raw.projectName ?? ""),
    location: String(raw.location ?? ""),
    category: (raw.category as Project["category"]) ?? "commercial",
    status: (raw.status as Project["status"]) ?? "Ongoing",
    startDate: String(raw.startDate ?? ""),
    endDate: String(raw.endDate ?? ""),
    budget: Number(raw.budget) || 0,
    income: Number(raw.income) || 0,
    expenses: Number(raw.expenses) || 0,
    expenseBreakdown: breakdown,
  };
}
