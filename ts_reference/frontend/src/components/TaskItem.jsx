import { memo } from "react";

// Eine einzelne Aufgabe. Mit memo() umschlossen, damit nur die Zeilen
// neu rendern, deren Daten sich tatsächlich geändert haben.
export const TaskItem = memo(function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li className={`task-item ${task.done ? "done" : ""}`}>
      <label>
        <input
          type="checkbox"
          checked={task.done}
          onChange={() => onToggle(task.id)}
        />
        <span className="title">{task.title}</span>
      </label>
      <span className={`badge badge-${task.priority}`}>{task.priority}</span>
      <button className="delete" onClick={() => onDelete(task.id)} aria-label="Löschen">
        ✕
      </button>
    </li>
  );
});
