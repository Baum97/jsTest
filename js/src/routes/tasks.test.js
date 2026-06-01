import { test, before, after, describe } from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../app.js";

// --- Test-Setup: App auf zufälligem Port starten -------------------------
let server;
let baseUrl;

before(async () => {
  const app = createApp();
  // Port 0 = Betriebssystem sucht einen freien Port aus
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const { port } = server.address();
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  });
});

after(() => {
  server.close();
});

// kleine Helfer-Funktion, damit die Tests kurz bleiben
async function api(path, options) {
  const res = await fetch(baseUrl + path, options);
  const body = res.status === 204 ? null : await res.json();
  return { status: res.status, body };
}

// --- Die Tests -----------------------------------------------------------
describe("GET /api/tasks", () => {
  test("gibt eine Liste zurück (Status 200)", async () => {
    const { status, body } = await api("/api/tasks");
    assert.equal(status, 200);
    assert.ok(Array.isArray(body));
  });
});

describe("GET /api/tasks/:id", () => {
  test("liefert eine vorhandene Aufgabe", async () => {
    const { status, body } = await api("/api/tasks/1");
    assert.equal(status, 200);
    assert.equal(body.id, 1);
  });

  test("liefert 404 bei unbekannter ID", async () => {
    const { status } = await api("/api/tasks/99999");
    assert.equal(status, 404);
  });
});

describe("POST /api/tasks", () => {
  test("legt eine Aufgabe an (Status 201)", async () => {
    const { status, body } = await api("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Test-Aufgabe" }),
    });
    assert.equal(status, 201);
    assert.equal(body.title, "Test-Aufgabe");
    assert.ok(body.id, "sollte eine ID bekommen");
  });

  // Dieser Test erwartet Validierung (Aufgabe 1) – er schlägt fehl,
  // bis du die Validierung eingebaut hast. Genau so soll TDD funktionieren.
  test("lehnt eine Aufgabe ohne title ab (Status 400)", async () => {
    const { status } = await api("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    assert.equal(status, 400);
  });
});
