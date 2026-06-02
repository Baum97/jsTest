import { useState, type FormEvent, type ChangeEvent } from "react";
import type { Priority } from "../types";

interface TaskFormProps {
  onAdd: (task: { title: string; priority: Priority }) => Promise<void>;
}

// Kontrolliertes Formular zum Anlegen einer Aufgabe.
export function TaskForm({ onAdd }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    setError(null);
    try {
      await onAdd({ title: title.trim(), priority });
      setTitle("");
      setPriority("medium");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Neue Aufgabe …"
        value={title}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
        aria-label="Titel"
      />
      <select
        value={priority}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => setPriority(e.target.value as Priority)}
        aria-label="Priorität"
      >
        <option value="high">Hoch</option>
        <option value="medium">Mittel</option>
        <option value="low">Niedrig</option>
      </select>
      <button type="submit" disabled={submitting || !title.trim()}>
        {submitting ? "…" : "Hinzufügen"}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
