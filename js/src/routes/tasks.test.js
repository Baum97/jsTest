import { test, before, after, describe } from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../app.js";

// --- Test-Setup: App auf zufälligem Port starten -------------------------
let server;
let baseUrl;

before(async () => {
  const app = createApp();
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      baseUrl = `http://localhost:${server.address().port}`;
      resolve();
    });
  });
});

after(() => server.close());

async function api(path, options) {
  const res = await fetch(baseUrl + path, options);
  const body = res.status === 204 ? null : await res.json();
  return { status: res.status, body };
}

const json = (method, data) => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});

// --- Die Tests -----------------------------------------------------------
describe("GET /api/tasks", () => {
  test("liefert ein paginiertes Objekt (data + total)", async () => {
    const { status, body } = await api("/api/tasks");
    assert.equal(status, 200);
    assert.ok(Array.isArray(body.data));
    assert.equal(typeof body.total, "number");
    assert.equal(typeof body.totalPages, "number");
  });

  test("respektiert ?limit", async () => {
    const { body } = await api("/api/tasks?limit=1");
    assert.equal(body.data.length, 1);
    assert.equal(body.limit, 1);
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

  test("liefert 400 bei ungültiger ID (Aufgabe 2)", async () => {
    const { status } = await api("/api/tasks/abc");
    assert.equal(status, 400);
  });
});

describe("POST /api/tasks", () => {
  test("legt eine Aufgabe an (Status 201)", async () => {
    const { status, body } = await api("/api/tasks", json("POST", { title: "Test-Aufgabe" }));
    assert.equal(status, 201);
    assert.equal(body.title, "Test-Aufgabe");
    assert.ok(body.id);
  });

  test("lehnt fehlenden title mit 400 ab (Aufgabe 1)", async () => {
    const { status } = await api("/api/tasks", json("POST", {}));
    assert.equal(status, 400);
  });
});

describe("PATCH /api/tasks/:id", () => {
  test("übernimmt nur erlaubte Felder (Aufgabe 6)", async () => {
    const created = await api("/api/tasks", json("POST", { title: "Patch-Ziel" }));
    const id = created.body.id;
    const { status, body } = await api(`/api/tasks/${id}`, json("PATCH", { done: true, hacked: true }));
    assert.equal(status, 200);
    assert.equal(body.done, true);
    assert.equal(body.hacked, undefined);
  });
});

describe("GET /api/tasks/search", () => {
  test("findet case-insensitive (Aufgabe 4)", async () => {
    const { status, body } = await api("/api/tasks/search?q=EXPRESS");
    assert.equal(status, 200);
    assert.ok(body.some((t) => t.title.includes("Express")));
  });
});
