import { Router } from "express";
import { store } from "../store.js";
import { AppError } from "../middleware/errorhandling.js";

export const tasksRouter = Router();

const PRIORITIES = ["low", "medium", "high"];

// ---------------------------------------------------------------------------
// Kleine Validierungs-Helfer. Sie WERFEN bei Fehlern einen AppError,
// den die zentrale Error-Middleware (Aufgabe 8) in eine HTTP-Antwort übersetzt.
// ---------------------------------------------------------------------------

// Aufgabe 2: ID sauber prüfen -> 400 statt 404 bei "abc"
function parseId(raw) {
  const id = Number(raw);
  if (!Number.isInteger(id) || id < 1) {
    throw new AppError("Ungültige Aufgaben-ID", 400);
  }
  return id;
}

// Aufgabe 1: Eingabe beim Anlegen/Ersetzen validieren
function validateFullTask(body) {
  if (typeof body?.title !== "string" || body.title.trim() === "") {
    throw new AppError("title ist erforderlich und darf nicht leer sein", 400);
  }
  if (body.priority !== undefined && !PRIORITIES.includes(body.priority)) {
    throw new AppError(`priority muss eines von ${PRIORITIES.join(", ")} sein`, 400);
  }
  return {
    title: body.title.trim(),
    done: body.done ?? false,
    priority: body.priority ?? "medium",
  };
}

// Aufgabe 6: nur erlaubte Felder übernehmen (Whitelist)
function pickAllowed(body) {
  const allowed = ["title", "done", "priority"];
  const changes = {};
  for (const key of allowed) {
    if (key in body) changes[key] = body[key];
  }
  return changes;
}

// ---------------------------------------------------------------------------
// Routen
// ---------------------------------------------------------------------------

// GET /api/tasks  -> Liste mit Filter (?done), Sortierung (?sort) und
// Pagination (?page, ?limit).  [Aufgaben 5 + 7]
tasksRouter.get("/", (req, res) => {
  let result = store.list();

  // Filter
  if (req.query.done !== undefined) {
    const wantDone = req.query.done === "true";
    result = result.filter((t) => t.done === wantDone);
  }

  // Sortierung (Aufgabe 7)
  if (req.query.sort === "priority") {
    const rank = { high: 0, medium: 1, low: 2 };
    result = [...result].sort((a, b) => rank[a.priority] - rank[b.priority]);
  } else if (req.query.sort === "createdAt") {
    result = [...result].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  // Pagination (Aufgabe 5)
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.max(1, parseInt(req.query.limit) || 20);
  const total = result.length;
  const data = result.slice((page - 1) * limit, (page - 1) * limit + limit);

  res.json({ data, total, page, limit, totalPages: Math.ceil(total / limit) });
});

// GET /api/tasks/search?q=...  (case-insensitive, Aufgabe 4)
// WICHTIG (Aufgabe 3): Diese Route MUSS vor "/:id" stehen. Express prüft
// Routen in Reihenfolge – stünde "/:id" zuerst, würde "search" als ID gelesen.
tasksRouter.get("/search", (req, res) => {
  const q = (req.query.q || "").toLowerCase();
  const result = store.list().filter((t) => t.title.toLowerCase().includes(q));
  res.json(result);
});

// GET /api/tasks/:id  -> einzelne Aufgabe (Aufgabe 2)
tasksRouter.get("/:id", (req, res) => {
  const task = store.find(parseId(req.params.id));
  if (!task) throw new AppError("Aufgabe nicht gefunden", 404);
  res.json(task);
});

// POST /api/tasks  -> anlegen (Aufgabe 1: Validierung)
tasksRouter.post("/", (req, res) => {
  const task = store.create(validateFullTask(req.body));
  res.status(201).json(task);
});

// PUT /api/tasks/:id  -> komplett ersetzen (verlangt vollständige Daten)
tasksRouter.put("/:id", (req, res) => {
  const id = parseId(req.params.id);
  const task = store.update(id, validateFullTask(req.body));
  if (!task) throw new AppError("Aufgabe nicht gefunden", 404);
  res.json(task);
});

// PATCH /api/tasks/:id  -> Teilaktualisierung mit Whitelist (Aufgabe 6)
tasksRouter.patch("/:id", (req, res) => {
  const id = parseId(req.params.id);
  const changes = pickAllowed(req.body);
  if (Object.keys(changes).length === 0) {
    throw new AppError("Keine gültigen Felder zum Aktualisieren übergeben", 400);
  }
  const task = store.update(id, changes);
  if (!task) throw new AppError("Aufgabe nicht gefunden", 404);
  res.json(task);
});

// PATCH /api/tasks/:id/toggle  -> done umschalten
tasksRouter.patch("/:id/toggle", (req, res) => {
  const id = parseId(req.params.id);
  const task = store.find(id);
  if (!task) throw new AppError("Aufgabe nicht gefunden", 404);
  res.json(store.update(id, { done: !task.done }));
});

// DELETE /api/tasks/:id  -> löschen
tasksRouter.delete("/:id", (req, res) => {
  const id = parseId(req.params.id);
  if (!store.remove(id)) throw new AppError("Aufgabe nicht gefunden", 404);
  res.status(204).end();
});
