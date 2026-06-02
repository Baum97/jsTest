import { taskRepository } from "../repositories/taskRepository.ts";
import { notFound } from "../errors/AppError.ts";
import {
  validateCreateTask,
  validateUpdateTask,
} from "../validators/taskValidator.ts";
import type { Priority, Task } from "../types.ts";

export interface ListOptions {
  done?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
  q?: string;
}

export interface PaginatedTasks {
  data: Task[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TaskStats {
  total: number;
  done: number;
  open: number;
}

// Service-Schicht: Geschäftslogik ohne HTTP-Details (kein req/res).
export const taskService = {
  async list({
    done,
    sort,
    page = 1,
    limit = 20,
    q,
  }: ListOptions = {}): Promise<PaginatedTasks> {
    let tasks = await taskRepository.findAll();

    if (typeof done === "boolean") {
      tasks = tasks.filter((t) => t.done === done);
    }
    if (q) {
      const needle = q.toLowerCase();
      tasks = tasks.filter((t) => t.title.toLowerCase().includes(needle));
    }

    if (sort === "priority") {
      const rank: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
      tasks = [...tasks].sort((a, b) => rank[a.priority] - rank[b.priority]);
    } else if (sort === "createdAt") {
      tasks = [...tasks].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    }

    const total = tasks.length;
    const start = (page - 1) * limit;
    const data = tasks.slice(start, start + limit);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async getById(id: number): Promise<Task> {
    const task = await taskRepository.findById(id);
    if (!task) throw notFound("Aufgabe nicht gefunden");
    return task;
  },

  async create(body: unknown): Promise<Task> {
    return taskRepository.create(validateCreateTask(body));
  },

  async update(id: number, body: unknown): Promise<Task> {
    const changes = validateUpdateTask(body);
    const updated = await taskRepository.update(id, changes);
    if (!updated) throw notFound("Aufgabe nicht gefunden");
    return updated;
  },

  async toggle(id: number): Promise<Task> {
    const task = await this.getById(id);
    const updated = await taskRepository.update(id, { done: !task.done });
    if (!updated) throw notFound("Aufgabe nicht gefunden");
    return updated;
  },

  async remove(id: number): Promise<void> {
    const ok = await taskRepository.remove(id);
    if (!ok) throw notFound("Aufgabe nicht gefunden");
  },

  async stats(): Promise<TaskStats> {
    const tasks = await taskRepository.findAll();
    const done = tasks.filter((t) => t.done).length;
    return { total: tasks.length, done, open: tasks.length - done };
  },
};
