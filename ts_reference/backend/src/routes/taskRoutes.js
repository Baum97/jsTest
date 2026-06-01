import { Router } from "express";
import { taskController } from "../controllers/taskController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const taskRoutes = Router();

// asyncHandler() umschließt jeden Controller, damit geworfene Fehler
// automatisch beim zentralen Error-Handler landen.
taskRoutes.get("/", asyncHandler(taskController.list));
taskRoutes.post("/", asyncHandler(taskController.create));
taskRoutes.get("/:id", asyncHandler(taskController.getById));
taskRoutes.put("/:id", asyncHandler(taskController.update));
taskRoutes.patch("/:id", asyncHandler(taskController.update));
taskRoutes.patch("/:id/toggle", asyncHandler(taskController.toggle));
taskRoutes.delete("/:id", asyncHandler(taskController.remove));
