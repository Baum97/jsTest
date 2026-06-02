import { Router } from "express";
import { taskController } from "../controllers/taskController.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";

export const taskRoutes = Router();

taskRoutes.get("/", asyncHandler(taskController.list));
taskRoutes.post("/", asyncHandler(taskController.create));
taskRoutes.get("/:id", asyncHandler(taskController.getById));
taskRoutes.put("/:id", asyncHandler(taskController.update));
taskRoutes.patch("/:id", asyncHandler(taskController.update));
taskRoutes.patch("/:id/toggle", asyncHandler(taskController.toggle));
taskRoutes.delete("/:id", asyncHandler(taskController.remove));
