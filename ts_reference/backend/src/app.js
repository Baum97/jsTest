import express from "express";
import cors from "cors";
import { apiRouter } from "./routes/index.js";
import { requestLogger } from "./middleware/requestLogger.js";
import { notFoundHandler } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { config } from "./config/env.js";

// createApp() baut die App, startet sie aber NICHT.
// Das trennt Konfiguration vom Serverstart -> ideal für Tests.
export function createApp() {
  const app = express();

  // --- Globale Middleware (Reihenfolge ist wichtig) ---
  app.use(cors({ origin: config.corsOrigin }));
  app.use(express.json());
  app.use(requestLogger);

  // --- Routen ---
  app.use("/api", apiRouter);

  // --- Abschluss: 404 und zentrales Error-Handling immer ZULETZT ---
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
