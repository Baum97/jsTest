import { http } from "./httpClient";
import type { Task, PaginatedTasks, TaskStats } from "../types";

// Eine Funktion pro Endpunkt – Komponenten rufen diese statt fetch direkt auf.
export const tasksApi = {
  list: (params: Record<string, string> = {}) => {
    const query = new URLSearchParams(params).toString();
    return http.get<PaginatedTasks>(`/tasks${query ? `?${query}` : ""}`);
  },
  create: (task: Pick<Task, "title" | "priority">) => http.post<Task>("/tasks", task),
  update: (id: number, changes: Partial<Task>) => http.patch<Task>(`/tasks/${id}`, changes),
  toggle: (id: number) => http.patch<Task>(`/tasks/${id}/toggle`),
  remove: (id: number) => http.delete<void>(`/tasks/${id}`),
  stats: () => http.get<TaskStats>("/stats"),
};
