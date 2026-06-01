import { Router } from "express";
import { metaController } from "../controllers/metaController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const metaRoutes = Router();

metaRoutes.get("/health", metaController.health);
metaRoutes.get("/stats", asyncHandler(metaController.stats));
