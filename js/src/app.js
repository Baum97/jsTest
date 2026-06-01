import express from "express";
import { tasksRouter } from "./routes/tasks.js";
import { metaRouter } from "./routes/meta.js";
import { requestLogger } from "./middleware/logger.js";

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(requestLogger);

  // Routen
  app.use("/api/tasks", tasksRouter);
  app.use("/api", metaRouter);

  // 404-Fallback
  app.use((req, res) => {
    res.status(404).json({ error: "Route nicht gefunden" });
  });

  return app;
}
