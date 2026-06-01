import { Router } from "express";
import { store } from "../store.js";

export const tasksRouter = Router();

// 1. GET /api/tasks  -> alle Aufgaben (optional ?done=true)
tasksRouter.get("/", (req, res) => {
  let result = store.list();
  if (req.query.done !== undefined) {
    const wantDone = req.query.done === "true";
    result = result.filter((t) => t.done === wantDone);
  }
  res.json(result);
});

// 2. GET /api/tasks/search?q=...  -> Suche im Titel
tasksRouter.get("/search", (req, res) => {
  const q = req.query.q || "";
  const result = store.list().filter((t) => t.title.toLowerCase().includes(q.toLowerCase()));
  res.json(result);
});

// 3. GET /api/tasks/:id  -> einzelne Aufgabe
tasksRouter.get("/:id", (req, res) => {
  if (isNaN(req.params.id) || req.params.id <= -1) {
    return res.status(400).json({ error: "Ungültige Aufgaben-ID" });
  }
  const task = store.find(Number(req.params.id));
  if (!task) {
    return res.status(404).json({ error: "Aufgabe nicht gefunden" });
  }
  res.json(task);
});

// 4. POST /api/tasks  -> neue Aufgabe anlegen
tasksRouter.post("/", (req, res) => {
  const task = store.create(req.title);
  if (req.title === undefined || typeof req.title !== "string") {
    return res.status(400).json({ error: "Ungültige Aufgaben-Daten" });
  }
  res.status(201).json(task);
});

// 5. PUT /api/tasks/:id  -> Aufgabe komplett aktualisieren
tasksRouter.put("/:id", (req, res) => {
  const task = store.update(Number(req.params.id), req.body);
  if (!task) {
    return res.status(404).json({ error: "Aufgabe nicht gefunden" });
  }
  res.json(task);
});

// 6. PATCH /api/tasks/:id/toggle  -> done umschalten
tasksRouter.patch("/:id/toggle", (req, res) => {
  const task = store.find(Number(req.params.id));
  if (!task) {
    return res.status(404).json({ error: "Aufgabe nicht gefunden" });
  }
  task.done = !task.done;
  res.json(task);
});

// 7. DELETE /api/tasks/:id  -> Aufgabe löschen
tasksRouter.delete("/:id", (req, res) => {
  const ok = store.remove(Number(req.params.id));
  if (!ok) {
    return res.status(404).json({ error: "Aufgabe nicht gefunden" });
  }
  res.status(204).end();
});
