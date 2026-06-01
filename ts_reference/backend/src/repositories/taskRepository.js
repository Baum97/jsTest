// Repository-Schicht: kapselt den Datenzugriff.
// Der Rest der App weiß nicht, OB die Daten im Speicher, in einer Datei
// oder in einer DB liegen. Will man später auf SQLite wechseln, ändert
// sich NUR diese Datei – Service und Controller bleiben unberührt.
//
// Bewusst async gehalten, damit ein späterer DB-Wechsel die Signatur
// nicht verändert.

let sequence = 3;

/** @type {Map<number, object>} */
const tasks = new Map([
  [1, { id: 1, title: "Express lernen", done: false, priority: "high", createdAt: new Date().toISOString() }],
  [2, { id: 2, title: "Erste API bauen", done: true, priority: "medium", createdAt: new Date().toISOString() }],
  [3, { id: 3, title: "Tests schreiben", done: false, priority: "low", createdAt: new Date().toISOString() }],
]);

export const taskRepository = {
  async findAll() {
    return [...tasks.values()];
  },

  async findById(id) {
    return tasks.get(id) ?? null;
  },

  async create(data) {
    const id = ++sequence;
    const task = { id, ...data };
    tasks.set(id, task);
    return task;
  },

  async update(id, changes) {
    const existing = tasks.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...changes, id }; // id bleibt unveränderlich
    tasks.set(id, updated);
    return updated;
  },

  async remove(id) {
    return tasks.delete(id);
  },
};
