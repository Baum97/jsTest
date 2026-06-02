import { useMemo } from "react";
import { useTasks } from "./hooks/useTasks";
import { TaskForm } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";

// Verbindet den Hook (Daten/Logik) mit den Präsentations-Komponenten.
export function App() {
  const { tasks, status, error, addTask, toggleTask, deleteTask } = useTasks();

  const openCount = useMemo(() => tasks.filter((t) => !t.done).length, [tasks]);

  return (
    <main className="app">
      <header>
        <h1>Aufgaben</h1>
        <p className="subtitle">
          {openCount} offen · {tasks.length} gesamt
        </p>
      </header>

      <TaskForm onAdd={addTask} />

      {status === "loading" && <p>Lade …</p>}
      {status === "error" && <p className="error">Fehler: {error?.message}</p>}
      {status === "success" && (
        <TaskList tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} />
      )}
    </main>
  );
}
