import { badRequest } from "../errors/AppError.js";

const PRIORITIES = ["low", "medium", "high"];

// Validierung getrennt von der Geschäftslogik.
// In echten Projekten oft mit zod/joi gelöst – hier bewusst per Hand,
// damit man die Mechanik sieht.

/**
 * Validiert die Eingabe beim Anlegen (alle Pflichtfelder müssen da sein).
 * Wirft AppError(400) bei ungültigen Daten, sonst gibt es ein sauberes Objekt zurück.
 */
export function validateCreateTask(body) {
  const errors = {};

  if (typeof body?.title !== "string" || body.title.trim() === "") {
    errors.title = "title ist erforderlich und muss ein nicht-leerer String sein";
  }
  if (body?.priority !== undefined && !PRIORITIES.includes(body.priority)) {
    errors.priority = `priority muss eines von ${PRIORITIES.join(", ")} sein`;
  }
  if (body?.done !== undefined && typeof body.done !== "boolean") {
    errors.done = "done muss ein Boolean sein";
  }

  if (Object.keys(errors).length > 0) {
    throw badRequest("Validierung fehlgeschlagen", errors);
  }

  return {
    title: body.title.trim(),
    done: body.done ?? false,
    priority: body.priority ?? "medium",
    createdAt: new Date().toISOString(),
  };
}

/**
 * Validiert eine Teilaktualisierung (PATCH): nur erlaubte Felder,
 * alle optional, aber falls vorhanden müssen sie gültig sein (Whitelist!).
 */
export function validateUpdateTask(body) {
  const allowed = ["title", "done", "priority"];
  const changes = {};
  const errors = {};

  for (const key of allowed) {
    if (!(key in body)) continue;

    const value = body[key];
    if (key === "title" && (typeof value !== "string" || value.trim() === "")) {
      errors.title = "title muss ein nicht-leerer String sein";
    } else if (key === "priority" && !PRIORITIES.includes(value)) {
      errors.priority = `priority muss eines von ${PRIORITIES.join(", ")} sein`;
    } else if (key === "done" && typeof value !== "boolean") {
      errors.done = "done muss ein Boolean sein";
    } else {
      changes[key] = key === "title" ? value.trim() : value;
    }
  }

  if (Object.keys(errors).length > 0) {
    throw badRequest("Validierung fehlgeschlagen", errors);
  }
  if (Object.keys(changes).length === 0) {
    throw badRequest("Keine gültigen Felder zum Aktualisieren übergeben");
  }

  return changes;
}

/** Parst und validiert eine ID aus den Routen-Parametern. */
export function parseId(rawId) {
  const id = Number(rawId);
  if (!Number.isInteger(id) || id < 1) {
    throw badRequest("Ungültige ID");
  }
  return id;
}
