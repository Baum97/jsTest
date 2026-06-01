// Anwendungsspezifischer Fehler mit HTTP-Statuscode.
// Erlaubt es, in der Geschäftslogik gezielte Fehler zu werfen,
// die das zentrale Error-Handling sauber in HTTP-Antworten übersetzt.
export class AppError extends Error {
  /**
   * @param {string} message  - menschenlesbare Fehlermeldung
   * @param {number} statusCode - HTTP-Status (z. B. 400, 404, 409)
   * @param {object} [details]  - optionale Zusatzinfos (z. B. Validierungsfehler)
   */
  constructor(message, statusCode = 500, details = undefined) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true; // erwarteter Fehler, kein Programmierfehler
    Error.captureStackTrace?.(this, this.constructor);
  }
}

// Kleine Factory-Helfer für die häufigsten Fälle – machen den Code lesbarer.
export const notFound = (message = "Ressource nicht gefunden") =>
  new AppError(message, 404);

export const badRequest = (message = "Ungültige Anfrage", details) =>
  new AppError(message, 400, details);

export const conflict = (message = "Konflikt") => new AppError(message, 409);
