// Sehr einfacher In-Memory-Datenspeicher.
// In einem echten Projekt würde hier eine Datenbank stehen.

let nextId = 4;

const tasks = [
  { id: 1, title: "Express lernen", done: false, priority: "high", createdAt: new Date().toISOString() },
  { id: 2, title: "Erste API bauen", done: true, priority: "medium", createdAt: new Date().toISOString() },
  { id: 3, title: "Tests schreiben", done: false, priority: "low", createdAt: new Date().toISOString() },
];

export const store = {
  list() {
    return tasks;
  },

  find(id) {
    return tasks.find((t) => t.id === id);
  },

  create(data) {
    const task = {
      id: nextId++,
      title: data.title,
      done: data.done ?? false,
      priority: data.priority ?? "medium",
      createdAt: new Date().toISOString(),
    };
    tasks.push(task);
    return task;
  },

  update(id, data) {
    const task = this.find(id);
    if (!task) return null;
    Object.assign(task, data);
    return task;
  },

  remove(id) {
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) return false;
    tasks.splice(index, 1);
    return true;
  },
};
