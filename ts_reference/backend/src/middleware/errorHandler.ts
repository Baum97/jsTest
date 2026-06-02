import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.ts";
import { isProduction } from "../config/env.ts";

// Zentrale Error-Middleware (Express erkennt sie an den 4 Parametern).
// Wird als allerletzte Middleware registriert.
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
      ...(err.details ? { details: err.details } : {}),
    });
    return;
  }

  console.error("Unerwarteter Fehler:", err);
  res.status(500).json({
    error: "Interner Serverfehler",
    ...(isProduction ? {} : { stack: err.stack }),
  });
}
