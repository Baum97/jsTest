import { Router } from "express";
import { taskRoutes } from "./taskRoutes.js";
import { metaRoutes } from "./metaRoutes.js";

// Bündelt alle Teil-Router unter /api. Ein einziger Einstiegspunkt,
// den die App einbindet.
export const apiRouter = Router();

apiRouter.use("/tasks", taskRoutes);
apiRouter.use("/", metaRoutes);
