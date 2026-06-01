import { useState, useEffect, useCallback } from "react";
import { tasksApi } from "../api/tasksApi.js";

// Custom Hook: kapselt den kompletten Task-Zustand und die Server-Kommunikation.
// Die UI-Komponenten bleiben dadurch frei von Fetch-Logik und kümmern sich
// nur ums Rendern. Das ist das Kernmuster für sauberen React-Code.
export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [error, setError] = useState(null);

  // useCallback, damit refresh stabil bleibt und in useEffect-Deps nutzbar ist.
  const refresh = useCallback(async () => {
    setStatus("loading");
    try {
      const result = await tasksApi.list({ sort: "priority" });
      setTasks(result.data);
      setStatus("success");
    } catch (err) {
      setError(err);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // --- Mutationen: Server zuerst, dann lokalen State aktualisieren ---
  const addTask = useCallback(async (data) => {
    const created = await tasksApi.create(data);
    setTasks((prev) => [...prev, created]);
  }, []);

  const toggleTask = useCallback(async (id) => {
    const updated = await tasksApi.toggle(id);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
  }, []);

  const deleteTask = useCallback(async (id) => {
    await tasksApi.remove(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { tasks, status, error, refresh, addTask, toggleTask, deleteTask };
}
