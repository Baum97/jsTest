// Zentrales Error-Handling für die API.

// Eigene Fehlerklasse: trägt einen HTTP-Statuscode mit sich.
// So kann jede Route gezielt z. B. einen 404 oder 400 "werfen".
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AppError";
  }
}

// Die Error-Middleware. WICHTIG: muss 4 Parameter haben (err, req, res, next),
// sonst erkennt Express sie nicht als Error-Handler.
// Wird in app.js GANZ AM ENDE registriert (nach allen Routen).
export function errorHandler(err, req, res, next) {
  // Bekannter, "geplanter" Fehler -> sauberen Statuscode verwenden.
  // Unbekannter Fehler -> 500 und Details ins Log, nicht zum Client.
  const status = err.statusCode || 500;

  if (status >= 500) {
    console.error(err); // echten Stacktrace nur serverseitig loggen
  }

  res.status(status).json({
    error: err.message || "Interner Serverfehler",
  });
}
