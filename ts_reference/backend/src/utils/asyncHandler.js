// Wrapper für async Route-Handler.
// Express 4 fängt Fehler aus async-Funktionen NICHT automatisch ab.
// Dieser Helfer leitet abgelehnte Promises automatisch an next() weiter,
// sodass man in Controllern kein try/catch mehr braucht.
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
