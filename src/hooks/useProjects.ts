import { useState, useEffect, useCallback } from "react";
import type { Project } from "../types/project";
import { fetchProjects as apiFetchProjects } from "../api/projectsApi";
import { mockProjects } from "../data/mockProjects";

/* ─────────── Types ─────────── */

type HookState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; projects: Project[] };

/* ─────────── Hook ─────────── */

export default function useProjects() {
  const [state, setState] = useState<HookState>({ status: "loading" });

  /** Re-fetch the full project list from the live API. */
  const refetch = useCallback(async () => {
    setState({ status: "loading" });

    try {
      const projects = await apiFetchProjects();
      setState({ status: "success", projects });
    } catch (err) {
      console.warn("Live API fetch failed, falling back to mock data", err);
      setState({
        status: "success",
        projects: [...mockProjects],
      });
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setState({ status: "loading" });

      try {
        const projects = await apiFetchProjects();

        if (!cancelled) {
          setState({ status: "success", projects });
        }
      } catch (err) {
        if (!cancelled) {
          console.warn(
            "Live API fetch failed, falling back to mock data",
            err
          );
          setState({
            status: "success",
            projects: [...mockProjects],
          });
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    projects: state.status === "success" ? state.projects : null,
    loading: state.status === "loading",
    error: state.status === "error" ? state.message : null,
    state,
    refetch,
  };
}
