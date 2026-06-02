import { test, before, after, describe } from "node:test";
import assert from "node:assert/strict";
import type { Server } from "node:http";
import { createApp } from "../src/app.ts";

let server: Server;
let baseUrl: string;

before(async () => {
  const app = createApp();
  await new Promise<void>((resolve) => {
    server = app.listen(0, () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : 0;
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  });
});

after(() => server.close());

const api = async (path: string, options?: RequestInit) => {
  const res = await fetch(baseUrl + path, options);
  // res.json() liefert hier unknown -> für die Tests bewusst als any behandeln.
  const body: any = res.status === 204 ? null : await res.json();
  return { status: res.status, body };
};

const json = (method: string, data: unknown): RequestInit => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});

describe("Tasks API", () => {
  test("GET /api/tasks liefert paginierte Liste", async () => {
    const { status, body } = await api("/api/tasks");
    assert.equal(status, 200);
    assert.ok(Array.isArray(body.data));
    assert.equal(typeof body.total, "number");
  });

  test("GET /api/tasks/:id liefert 404 bei unbekannter ID", async () => {
    const { status } = await api("/api/tasks/99999");
    assert.equal(status, 404);
  });

  test("GET /api/tasks/:id liefert 400 bei ungültiger ID", async () => {
    const { status } = await api("/api/tasks/abc");
    assert.equal(status, 400);
  });

  test("POST /api/tasks legt eine Aufgabe an", async () => {
    const { status, body } = await api("/api/tasks", json("POST", { title: "Neu" }));
    assert.equal(status, 201);
    assert.equal(body.title, "Neu");
  });

  test("POST /api/tasks lehnt fehlenden title mit 400 ab", async () => {
    const { status, body } = await api("/api/tasks", json("POST", {}));
    assert.equal(status, 400);
    assert.ok(body.details.title);
  });

  test("PATCH /api/tasks/:id ignoriert nicht-erlaubte Felder", async () => {
    const created = await api("/api/tasks", json("POST", { title: "X" }));
    const id = created.body.id;
    const { status, body } = await api(`/api/tasks/${id}`, json("PATCH", { done: true, hacked: true }));
    assert.equal(status, 200);
    assert.equal(body.done, true);
    assert.equal(body.hacked, undefined);
  });
});
