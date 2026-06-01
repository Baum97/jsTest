import { TaskItem } from "./TaskItem.jsx";

// Reine Präsentations-Komponente: bekommt Daten + Callbacks als Props
// und rendert. Kein eigener State, kein Fetch -> maximal wiederverwendbar.
export function TaskList({ tasks, onToggle, onDelete }) {
  if (tasks.length === 0) {
    return <p className="empty">Keine Aufgaben vorhanden.</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
