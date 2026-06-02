import { useState, useEffect, useCallback } from "react";
import { tasksApi } from "../api/tasksApi";
import type { Task, Priority } from "../types";

type Status = "loading" | "success" | "error";

export interface UseTasks {
  tasks: Task[];
  status: Status;
  error: Error | null;
  refresh: () => Promise<void>;
  addTask: (data: { title: string; priority: Priority }) => Promise<void>;
  toggleTask: (id: number) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
}

// Custom Hook: kapselt State + Server-Kommunikation. Die UI bleibt frei davon.
export function useTasks(): UseTasks {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    setStatus("loading");
    try {
      const result = await tasksApi.list({ sort: "priority" });
      setTasks(result.data);
      setStatus("success");
    } catch (err) {
      setError(err as Error);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addTask = useCallback(async (data: { title: string; priority: Priority }) => {
    const created = await tasksApi.create(data);
    setTasks((prev) => [...prev, created]);
  }, []);

  const toggleTask = useCallback(async (id: number) => {
    const updated = await tasksApi.toggle(id);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
  }, []);

  const deleteTask = useCallback(async (id: number) => {
    await tasksApi.remove(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { tasks, status, error, refresh, addTask, toggleTask, deleteTask };
}
