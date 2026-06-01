import { useMemo } from "react";
import { useTasks } from "./hooks/useTasks.js";
import { TaskForm } from "./components/TaskForm.jsx";
import { TaskList } from "./components/TaskList.jsx";

// Die App-Komponente verbindet den Hook (Daten/Logik) mit den
// Präsentations-Komponenten. Sie bleibt schlank, weil die Logik im
// useTasks-Hook und die Darstellung in den Unterkomponenten liegt.
export function App() {
  const { tasks, status, error, addTask, toggleTask, deleteTask } = useTasks();

  // Abgeleiteter Wert -> mit useMemo, statt im State zu duplizieren.
  const openCount = useMemo(
    () => tasks.filter((t) => !t.done).length,
    [tasks],
  );

  return (
    <main className="app">
      <header>
        <h1>Aufgaben</h1>
        <p className="subtitle">{openCount} offen · {tasks.length} gesamt</p>
      </header>

      <TaskForm onAdd={addTask} />

      {status === "loading" && <p>Lade …</p>}
      {status === "error" && <p className="error">Fehler: {error.message}</p>}
      {status === "success" && (
        <TaskList tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} />
      )}
    </main>
  );
}
