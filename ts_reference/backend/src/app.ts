import express, { type Express } from "express";
import cors from "cors";
import { apiRouter } from "./routes/index.ts";
import { requestLogger } from "./middleware/requestLogger.ts";
import { notFoundHandler } from "./middleware/notFound.ts";
import { errorHandler } from "./middleware/errorHandler.ts";
import { config } from "./config/env.ts";

// createApp() baut die App, startet sie aber NICHT -> ideal für Tests.
export function createApp(): Express {
  const app = express();

  // Globale Middleware (Reihenfolge ist wichtig)
  app.use(cors({ origin: config.corsOrigin }));
  app.use(express.json());
  app.use(requestLogger);

  // Routen
  app.use("/api", apiRouter);

  // Abschluss: 404 und zentrales Error-Handling immer ZULETZT
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
