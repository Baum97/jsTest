import { taskService } from "../services/taskService.js";

export const metaController = {
  health(req, res) {
    res.json({ status: "ok", uptime: process.uptime() });
  },

  async stats(req, res) {
    res.json(await taskService.stats());
  },
};
