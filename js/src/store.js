// Datenspeicher mit JSON-Datei-Persistenz (Aufgabe 10).
// Die Daten überleben jetzt einen Neustart, weil sie nach jeder Änderung
// in data/tasks.json geschrieben werden.
//
// Bewusst mit SYNCHRONEM fs gehalten, damit die Routen einfach bleiben.
// In einem echten Projekt würde man async fs oder eine richtige DB nehmen.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const DB_FILE = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "data",
  "tasks.json",
);

function seedData() {
  const now = new Date().toISOString();
  return [
    { id: 1, title: "Express lernen", done: false, priority: "high", createdAt: now },
    { id: 2, title: "Erste API bauen", done: true, priority: "medium", createdAt: now },
    { id: 3, title: "Tests schreiben", done: false, priority: "low", createdAt: now },
  ];
}

// Beim Start laden – oder mit Startdaten anlegen, falls die Datei fehlt.
function load() {
  if (!existsSync(DB_FILE)) {
    const initial = seedData();
    persist(initial);
    return initial;
  }
  return JSON.parse(readFileSync(DB_FILE, "utf8"));
}

function persist(data) {
  mkdirSync(dirname(DB_FILE), { recursive: true });
  writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

let tasks = load();
let nextId = tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1;

// speichert den aktuellen Stand auf die Platte
const save = () => persist(tasks);

export const store = {
  list() {
    return tasks;
  },

  find(id) {
    return tasks.find((t) => t.id === id);
  },

  create(data) {
    const task = {
      id: nextId++,
      title: data.title,
      done: data.done ?? false,
      priority: data.priority ?? "medium",
      createdAt: new Date().toISOString(),
    };
    tasks.push(task);
    save();
    return task;
  },

  update(id, changes) {
    const task = this.find(id);
    if (!task) return null;
    Object.assign(task, changes, { id }); // id bleibt unveränderlich
    save();
    return task;
  },

  remove(id) {
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) return false;
    tasks.splice(index, 1);
    save();
    return true;
  },
};
