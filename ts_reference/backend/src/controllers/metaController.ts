import type { Request, Response } from "express";
import { taskService } from "../services/taskService.ts";

export const metaController = {
  health(_req: Request, res: Response): void {
    res.json({ status: "ok", uptime: process.uptime() });
  },

  async stats(_req: Request, res: Response): Promise<void> {
    res.json(await taskService.stats());
  },
};
