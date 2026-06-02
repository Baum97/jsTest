import { Router } from "express";
import { taskRoutes } from "./taskRoutes.ts";
import { metaRoutes } from "./metaRoutes.ts";

// Bündelt alle Teil-Router unter /api.
export const apiRouter = Router();

apiRouter.use("/tasks", taskRoutes);
apiRouter.use("/", metaRoutes);
