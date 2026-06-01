import { http } from "./httpClient.js";

// Eine Funktion pro Endpunkt. Komponenten rufen DIESE Funktionen auf,
// nie fetch direkt – so liegt das API-Wissen an einer Stelle.
export const tasksApi = {
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return http.get(`/tasks${query ? `?${query}` : ""}`);
  },
  create: (task) => http.post("/tasks", task),
  update: (id, changes) => http.patch(`/tasks/${id}`, changes),
  toggle: (id) => http.patch(`/tasks/${id}/toggle`),
  remove: (id) => http.delete(`/tasks/${id}`),
  stats: () => http.get("/stats"),
};
