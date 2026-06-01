import { Router } from "express";
import { store } from "../store.js";

export const metaRouter = Router();

// 8. GET /api/health  -> Health-Check
metaRouter.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// 9. GET /api/stats  -> Statistik über die Aufgaben
metaRouter.get("/stats", (req, res) => {
  const all = store.list();
  const done = all.filter((t) => t.done).length;
  res.json({
    total: all.length,
    done,
    open: all.length - done,
  });
});

// 10. GET /api/priorities  -> Aufgaben gruppiert nach Priorität
metaRouter.get("/priorities", (req, res) => {
  const groups = {};
  for (const task of store.list()) {
    groups[task.priority] = groups[task.priority] || [];
    groups[task.priority].push(task);
  }
  res.json(groups);
});
