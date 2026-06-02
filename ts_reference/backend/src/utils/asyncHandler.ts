import type { Request, Response, NextFunction, RequestHandler } from "express";

// Wrapper für async Route-Handler: leitet abgelehnte Promises an next() weiter,
// damit man in den Controllern kein try/catch braucht.
export const asyncHandler =
  (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
  ): RequestHandler =>
  (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);
