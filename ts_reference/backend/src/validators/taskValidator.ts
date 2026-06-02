import { badRequest } from "../errors/AppError.ts";
import type { NewTaskData, Priority, Task } from "../types.ts";

const PRIORITIES: Priority[] = ["low", "medium", "high"];

// Validierung getrennt von der Geschäftslogik. `unknown` als Eingabe zwingt
// uns, die Felder bewusst zu prüfen, bevor wir sie verwenden.

export function validateCreateTask(body: unknown): NewTaskData {
  const input = (body ?? {}) as Record<string, unknown>;
  const errors: Record<string, string> = {};

  if (typeof input.title !== "string" || input.title.trim() === "") {
    errors.title = "title ist erforderlich und muss ein nicht-leerer String sein";
  }
  if (input.priority !== undefined && !PRIORITIES.includes(input.priority as Priority)) {
    errors.priority = `priority muss eines von ${PRIORITIES.join(", ")} sein`;
  }
  if (input.done !== undefined && typeof input.done !== "boolean") {
    errors.done = "done muss ein Boolean sein";
  }

  if (Object.keys(errors).length > 0) {
    throw badRequest("Validierung fehlgeschlagen", errors);
  }

  return {
    title: (input.title as string).trim(),
    done: (input.done as boolean) ?? false,
    priority: (input.priority as Priority) ?? "medium",
    createdAt: new Date().toISOString(),
  };
}

export function validateUpdateTask(body: unknown): Partial<Task> {
  const input = (body ?? {}) as Record<string, unknown>;
  const changes: Partial<Task> = {};
  const errors: Record<string, string> = {};

  if ("title" in input) {
    if (typeof input.title !== "string" || input.title.trim() === "") {
      errors.title = "title muss ein nicht-leerer String sein";
    } else {
      changes.title = input.title.trim();
    }
  }
  if ("priority" in input) {
    if (!PRIORITIES.includes(input.priority as Priority)) {
      errors.priority = `priority muss eines von ${PRIORITIES.join(", ")} sein`;
    } else {
      changes.priority = input.priority as Priority;
    }
  }
  if ("done" in input) {
    if (typeof input.done !== "boolean") {
      errors.done = "done muss ein Boolean sein";
    } else {
      changes.done = input.done;
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

export function parseId(rawId: string): number {
  const id = Number(rawId);
  if (!Number.isInteger(id) || id < 1) {
    throw badRequest("Ungültige ID");
  }
  return id;
}
