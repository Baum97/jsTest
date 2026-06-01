import { notFound } from "../errors/AppError.js";

// Fängt alle Routen ab, die zu keiner anderen Middleware passen,
// und reicht einen 404 an das zentrale Error-Handling weiter.
export function notFoundHandler(req, res, next) {
  next(notFound(`Route nicht gefunden: ${req.method} ${req.originalUrl}`));
}
