import { taskRepository } from "../repositories/taskRepository.js";
import { notFound } from "../errors/AppError.js";
import {
  validateCreateTask,
  validateUpdateTask,
} from "../validators/taskValidator.js";

// Service-Schicht: die eigentliche Geschäftslogik.
// Kennt KEINE HTTP-Details (kein req/res) -> dadurch gut testbar und
// wiederverwendbar (z. B. aus einem CLI oder Hintergrundjob).

export const taskService = {
  async list({ done, sort, page = 1, limit = 20, q } = {}) {
    let tasks = await taskRepository.findAll();

    // Filtern
    if (typeof done === "boolean") {
      tasks = tasks.filter((t) => t.done === done);
    }
    if (q) {
      const needle = q.toLowerCase();
      tasks = tasks.filter((t) => t.title.toLowerCase().includes(needle));
    }

    // Sortieren
    if (sort === "priority") {
      const rank = { high: 0, medium: 1, low: 2 };
      tasks = [...tasks].sort((a, b) => rank[a.priority] - rank[b.priority]);
    } else if (sort === "createdAt") {
      tasks = [...tasks].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    }

    // Paginieren
    const total = tasks.length;
    const start = (page - 1) * limit;
    const data = tasks.slice(start, start + limit);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async getById(id) {
    const task = await taskRepository.findById(id);
    if (!task) throw notFound("Aufgabe nicht gefunden");
    return task;
  },

  async create(body) {
    const valid = validateCreateTask(body);
    return taskRepository.create(valid);
  },

  async update(id, body) {
    const changes = validateUpdateTask(body);
    const updated = await taskRepository.update(id, changes);
    if (!updated) throw notFound("Aufgabe nicht gefunden");
    return updated;
  },

  async toggle(id) {
    const task = await this.getById(id);
    return taskRepository.update(id, { done: !task.done });
  },

  async remove(id) {
    const ok = await taskRepository.remove(id);
    if (!ok) throw notFound("Aufgabe nicht gefunden");
  },

  async stats() {
    const tasks = await taskRepository.findAll();
    const done = tasks.filter((t) => t.done).length;
    return { total: tasks.length, done, open: tasks.length - done };
  },
};
