import { AppError } from "../errors/AppError.js";
import { isProduction } from "../config/env.js";

// Zentrale Error-Middleware (muss 4 Parameter haben!).
// Wird als allerletzte Middleware registriert.
export function errorHandler(err, req, res, next) {
  // Erwartete, "operationale" Fehler -> sauberer Statuscode + Meldung.
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      ...(err.details ? { details: err.details } : {}),
    });
  }

  // Unerwarteter Fehler -> serverseitig loggen, generische Antwort an Client.
  console.error("Unerwarteter Fehler:", err);

  res.status(500).json({
    error: "Interner Serverfehler",
    // Stacktrace nur im Development preisgeben, nie in Produktion.
    ...(isProduction ? {} : { stack: err.stack }),
  });
}
