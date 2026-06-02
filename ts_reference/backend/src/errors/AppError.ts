// Anwendungsspezifischer Fehler mit HTTP-Statuscode.
export class AppError extends Error {
  readonly statusCode: number;
  readonly details?: unknown;
  readonly isOperational = true;

  constructor(message: string, statusCode = 500, details?: unknown) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

// Factory-Helfer für die häufigsten Fälle.
export const notFound = (message = "Ressource nicht gefunden") =>
  new AppError(message, 404);

export const badRequest = (message = "Ungültige Anfrage", details?: unknown) =>
  new AppError(message, 400, details);

export const conflict = (message = "Konflikt") => new AppError(message, 409);
