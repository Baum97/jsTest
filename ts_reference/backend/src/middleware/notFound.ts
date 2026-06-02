import type { Request, Response, NextFunction } from "express";
import { notFound } from "../errors/AppError.ts";

// Fängt nicht zugeordnete Routen ab und reicht einen 404 ans Error-Handling.
export function notFoundHandler(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  next(notFound(`Route nicht gefunden: ${req.method} ${req.originalUrl}`));
}
