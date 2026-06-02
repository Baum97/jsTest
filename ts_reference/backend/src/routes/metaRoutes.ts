import { Router } from "express";
import { metaController } from "../controllers/metaController.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";

export const metaRoutes = Router();

metaRoutes.get("/health", metaController.health);
metaRoutes.get("/stats", asyncHandler(metaController.stats));
