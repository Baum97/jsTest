import type { Request, Response } from "express";
import { taskService } from "../services/taskService.ts";
import { parseId } from "../validators/taskValidator.ts";

// Controller-Schicht: übersetzt zwischen HTTP (req/res) und dem Service.
export const taskController = {
  async list(req: Request, res: Response): Promise<void> {
    const { done, sort, q } = req.query;
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 20;

    const result = await taskService.list({
      done: done === undefined ? undefined : done === "true",
      sort: typeof sort === "string" ? sort : undefined,
      q: typeof q === "string" ? q : undefined,
      page,
      limit,
    });
    res.json(result);
  },

  async getById(req: Request, res: Response): Promise<void> {
    const task = await taskService.getById(parseId(req.params.id));
    res.json(task);
  },

  async create(req: Request, res: Response): Promise<void> {
    const task = await taskService.create(req.body);
    res.status(201).json(task);
  },

  async update(req: Request, res: Response): Promise<void> {
    const task = await taskService.update(parseId(req.params.id), req.body);
    res.json(task);
  },

  async toggle(req: Request, res: Response): Promise<void> {
    const task = await taskService.toggle(parseId(req.params.id));
    res.json(task);
  },

  async remove(req: Request, res: Response): Promise<void> {
    await taskService.remove(parseId(req.params.id));
    res.status(204).end();
  },
};
