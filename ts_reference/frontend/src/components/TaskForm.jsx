import { useState } from "react";

// Kontrolliertes Formular zum Anlegen einer Aufgabe.
// Bekommt onAdd als Prop (Inversion of Control) – die Komponente weiß nicht,
// WAS mit der Aufgabe passiert, nur dass sie gemeldet wird.
export function TaskForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    setError(null);
    try {
      await onAdd({ title: title.trim(), priority });
      setTitle(""); // nur bei Erfolg zurücksetzen
      setPriority("medium");
    } catch (err) {
      setError(err.message);
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
        onChange={(e) => setTitle(e.target.value)}
        aria-label="Titel"
      />
      <select value={priority} onChange={(e) => setPriority(e.target.value)} aria-label="Priorität">
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
