import { taskService } from "../services/taskService.js";
import { parseId } from "../validators/taskValidator.js";

// Controller-Schicht: übersetzt zwischen HTTP (req/res) und dem Service.
// Enthält bewusst KEINE Geschäftslogik – nur Ein-/Ausgabe-Mapping.

export const taskController = {
  async list(req, res) {
    const { done, sort, q } = req.query;
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 20;

    const result = await taskService.list({
      done: done === undefined ? undefined : done === "true",
      sort,
      q,
      page,
      limit,
    });
    res.json(result);
  },

  async getById(req, res) {
    const task = await taskService.getById(parseId(req.params.id));
    res.json(task);
  },

  async create(req, res) {
    const task = await taskService.create(req.body);
    res.status(201).json(task);
  },

  async update(req, res) {
    const task = await taskService.update(parseId(req.params.id), req.body);
    res.json(task);
  },

  async toggle(req, res) {
    const task = await taskService.toggle(parseId(req.params.id));
    res.json(task);
  },

  async remove(req, res) {
    await taskService.remove(parseId(req.params.id));
    res.status(204).end();
  },
};
