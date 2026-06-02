import { memo } from "react";
import type { Task } from "../types";

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

// Eine einzelne Aufgabe, mit memo() gegen unnötige Re-Renders.
export const TaskItem = memo(function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <li className={`task-item ${task.done ? "done" : ""}`}>
      <label>
        <input type="checkbox" checked={task.done} onChange={() => onToggle(task.id)} />
        <span className="title">{task.title}</span>
      </label>
      <span className={`badge badge-${task.priority}`}>{task.priority}</span>
      <button className="delete" onClick={() => onDelete(task.id)} aria-label="Löschen">
        ✕
      </button>
    </li>
  );
});
