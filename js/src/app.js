import express from "express";
import { tasksRouter } from "./routes/tasks.js";
import { metaRouter } from "./routes/meta.js";
import { requestLogger } from "./middleware/logger.js";
import { errorHandler } from "./middleware/errorhandling.js";

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(requestLogger);

  // Routen
  app.use("/api/tasks", tasksRouter);
  app.use("/api", metaRouter);

  // 404-Fallback (nach allen Routen)
  app.use((req, res) => {
    res.status(404).json({ error: "Route nicht gefunden" });
  });

  // Zentrales Error-Handling immer ZULETZT (Aufgabe 8).
  // Fängt alle in den Routen geworfenen AppError ab.
  app.use(errorHandler);

  return app;
}
