// Repository-Schicht mit JSON-Datei-Persistenz.
// Hinter derselben (async) Schnittstelle ließe sich genauso eine DB einsetzen –
// Service, Controller und Tests bleiben dabei unverändert.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { Task, NewTaskData } from "../types.ts";

const DB_FILE = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "data",
  "tasks.json",
);

function seed(): Task[] {
  const now = new Date().toISOString();
  return [
    { id: 1, title: "Express lernen", done: false, priority: "high", createdAt: now },
    { id: 2, title: "Erste API bauen", done: true, priority: "medium", createdAt: now },
    { id: 3, title: "Tests schreiben", done: false, priority: "low", createdAt: now },
  ];
}

let cache: Task[] | null = null;
let sequence = 0;

async function ensureLoaded(): Promise<Task[]> {
  if (cache) return cache;
  if (existsSync(DB_FILE)) {
    cache = JSON.parse(await readFile(DB_FILE, "utf8")) as Task[];
  } else {
    cache = seed();
    await persist(cache);
  }
  sequence = cache.reduce((max, t) => Math.max(max, t.id), 0);
  return cache;
}

async function persist(tasks: Task[]): Promise<void> {
  await mkdir(dirname(DB_FILE), { recursive: true });
  await writeFile(DB_FILE, JSON.stringify(tasks, null, 2));
}

export const taskRepository = {
  async findAll(): Promise<Task[]> {
    const tasks = await ensureLoaded();
    return [...tasks];
  },

  async findById(id: number): Promise<Task | null> {
    const tasks = await ensureLoaded();
    return tasks.find((t) => t.id === id) ?? null;
  },

  async create(data: NewTaskData): Promise<Task> {
    const tasks = await ensureLoaded();
    const task: Task = { id: ++sequence, ...data };
    tasks.push(task);
    await persist(tasks);
    return task;
  },

  async update(id: number, changes: Partial<Task>): Promise<Task | null> {
    const tasks = await ensureLoaded();
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) return null;
    tasks[index] = { ...tasks[index], ...changes, id }; // id unveränderlich
    await persist(tasks);
    return tasks[index];
  },

  async remove(id: number): Promise<boolean> {
    const tasks = await ensureLoaded();
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) return false;
    tasks.splice(index, 1);
    await persist(tasks);
    return true;
  },
};
