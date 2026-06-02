# Best-Practice-Referenz (Full-Stack, TypeScript)

Diese `ts_reference/`-Sammlung ist die **saubere Vergleichsversion** zu deinem
Lern-Projekt in [`../js`](../js). Gleiche Funktionalität, aber in **TypeScript** und
so strukturiert, wie man es in echten Projekten machen würde. Vergleiche bewusst
Datei für Datei mit deiner eigenen Lösung.

```
ts_reference/
  backend/    Express-API mit Schichtenarchitektur (TypeScript)
  frontend/   React-App (Vite + TypeScript), die die API konsumiert
```

> **Node ≥ 23.6 erforderlich.** Das Backend nutzt Nodes natives TypeScript-
> Type-Stripping: `node src/server.ts` läuft direkt, **ohne Build-Step**.
> `tsc` wird nur zur Typprüfung (`npm run typecheck`) verwendet.

## Starten

Zwei Terminals:

```bash
# Terminal 1 – Backend (Port 3001)
cd ts_reference/backend
npm install
npm run dev          # node --watch src/server.ts

# Terminal 2 – Frontend (Port 5173)
cd ts_reference/frontend
npm install
npm run dev          # vite
```

Dann `http://localhost:5173` öffnen. Der Vite-Dev-Server proxyt `/api` automatisch
ans Backend, deshalb gibt es keine CORS-Probleme im Browser.

| Befehl | Ort | Zweck |
|--------|-----|-------|
| `npm run dev` | backend & frontend | Dev-Server mit Auto-Reload |
| `npm test` | backend | Tests (`node --test`, führt `.ts` direkt aus) |
| `npm run typecheck` | backend & frontend | Typprüfung (`tsc --noEmit`) |
| `npm run build` | frontend | Typprüfung + Produktions-Build |

---

## Worin unterscheidet sich das vom Lern-Projekt? (die Lehrpunkte)

### Backend – Schichtenarchitektur
Statt Logik direkt in den Routen liegt alles in klaren Schichten:

```
Route       -> nur Verdrahtung (Pfad -> Controller)
Controller  -> HTTP-Mapping (req/res lesen, Status setzen)
Service     -> Geschäftslogik, KENNT KEIN req/res (gut testbar)
Repository  -> Datenzugriff (austauschbar: Memory -> DB)
Validator   -> Eingabeprüfung, getrennt von der Logik
```

Vorteil: Jede Schicht ist einzeln testbar und austauschbar. Beweis: Die
Persistenz (Aufgabe 10) ist hier auf **JSON-Datei** umgestellt – geändert wurde
dafür **nur** `repositories/taskRepository.ts`. Service, Controller und Tests
blieben unberührt. Die Daten liegen in `backend/data/tasks.json`.

### Weitere Best Practices im Backend
- **`AppError` + zentrale Error-Middleware** – kein wiederholtes `res.status(404)` in jeder Route.
- **`asyncHandler`** – fängt Fehler aus async-Controllern automatisch ab.
- **`createApp()` getrennt von `server.js`** – die App lässt sich ohne echten Port testen.
- **Validierung als eigene Schicht** mit Whitelist (verhindert das Einschleusen fremder Felder).
- **Config zentral** aus Umgebungsvariablen, kein `process.env` quer im Code.
- **Graceful Shutdown** auf SIGINT/SIGTERM.

### Frontend – saubere React-Struktur (TypeScript)
```
types.ts    geteilte Domänen-Typen (Task, Priority, ...)
api/        fetch-Wrapper (generisch typisiert) + eine Funktion pro Endpunkt
hooks/      useTasks: kapselt State + Server-Kommunikation, typisierte Rückgabe
components/  kleine, fokussierte Komponenten mit Props-Interfaces
App.tsx     verbindet Hook (Logik) mit Komponenten (Darstellung)
```

Die zentralen React-Lehrpunkte:
- **Trennung Logik/Darstellung**: `useTasks`-Hook hält die Logik, Komponenten nur das Rendern.
- **Container vs. Präsentation**: `TaskList`/`TaskItem` sind „dumm" (nur Props), `App` ist der Container.
- **Kontrollierte Formulare** mit lokalem State (`TaskForm`).
- **Stabile Callbacks** (`useCallback`) und **abgeleitete Werte** (`useMemo`) statt State-Duplikation.
- **`memo()`** auf `TaskItem`, um unnötige Re-Renders zu vermeiden.
- **Explizite Lade-/Fehlerzustände** (`status`: loading | success | error).

---

# Neue Aufgaben – als Use Cases

Die 10 Grundlagen sind hier bereits sauber umgesetzt. Die folgenden Use Cases
gehen einen Schritt weiter. Sie sind als **fachlicher Wunsch** formuliert: *Welchen
Request soll das System annehmen, welche Response liefern, und wozu?*

Der Reiz dieses Projekts: Du übst, ein Feature **über alle Schichten** sauber
einzuziehen – Validator → Service → Repository → Controller → Route, und im
Frontend api → hook → component. Vergleiche bewusst mit deiner Umsetzung in
[`../js`](../js), wo dieselben Use Cases ohne Schichten gelöst werden.

> Faustregel pro Use Case: In welcher Schicht gehört welche Änderung hin?
> Geschäftsregeln in den **Service**, Eingabeprüfung in den **Validator**,
> Speicherung ins **Repository**, HTTP-Details in den **Controller**.

### Backend

**1. Fälligkeitsdatum**
> „Beim Anlegen (`POST /api/tasks`) möchte ich optional `dueDate` mitschicken und
> zurückbekommen, damit ich Deadlines verwalten kann."
> → Prüfung gehört in den **Validator**, das Feld ins **Repository**-Schema.

**2. Überfällige filtern**
> „`GET /api/tasks?overdue=true` soll nur noch offene Aufgaben mit `dueDate` in der
> Vergangenheit liefern."
> → Reine Geschäftslogik → in `taskService.list()` ergänzen.

**3. Beschreibung + erweiterte Suche**
> „Eine Aufgabe soll eine `description` haben, und `?q=` soll Titel **und**
> Beschreibung durchsuchen."

**4. Bulk-Complete**
> „`POST /api/tasks/bulk-complete` mit `{ "ids": [1,2,5] }` markiert mehrere Aufgaben
> auf einmal als erledigt und antwortet mit `{ "updated": n }`."
> → Neue Service-Methode + Controller + Route.

**5. Papierkorb (Soft Delete)**
> „`DELETE` verschiebt in den Papierkorb (`deletedAt` setzen). `GET /api/tasks/trash`
> zeigt ihn, `POST /api/tasks/:id/restore` stellt wieder her."
> → Normale Queries müssen gelöschte Einträge ausblenden (Repository/Service).

**6. Tags + Filter**
> „Aufgaben bekommen `tags: string[]`, und `GET /api/tasks?tag=arbeit` filtert danach."

**7. Sortierrichtung**
> „`GET /api/tasks?sort=createdAt&order=desc` bestimmt die Richtung."
> → Bestehende Sortierung im Service um `order` erweitern.

**8. API-Key für schreibende Requests**
> „`POST/PUT/PATCH/DELETE` nur mit Header `X-API-Key`, sonst `401`."
> → Eigene **Middleware**, Key aus `config/env.js`.

**9. Rate-Limiting**
> „Max. 60 Requests/Minute pro IP, sonst `429`."
> → Middleware; Vergleich mit `js/`, wo es ohne saubere Schicht eingebaut wird.

**10. Zweite Ressource: Projekte**
> „`POST /api/projects`, Aufgaben mit `projectId`, `GET /api/projects/:id/tasks`."
> → Hier zeigt sich die Architektur am stärksten: neues `projectRepository`,
> `projectService`, `projectController`, `projectRoutes` – nach demselben Muster.

### Frontend (React)

**F1. Filterleiste**
> „Ich möchte oben Buttons ‚Alle / Offen / Erledigt' haben, die die Liste filtern,
> ohne die Seite neu zu laden."
> → State im `useTasks`-Hook bzw. Query-Param an `tasksApi.list()` durchreichen.

**F2. Inline-Bearbeiten**
> „Ein Klick auf den Titel macht ihn editierbar; Enter speichert via `PATCH`."
> → Neue Komponente/Zustand in `TaskItem`, Mutation über den Hook.

**F3. Optimistic Update**
> „Wenn ich abhake, soll die UI **sofort** reagieren und bei Server-Fehler
> zurückrollen, damit es sich schnell anfühlt."
> → `setTasks` vor dem `await`, im `catch` zurücksetzen.

**F4. Toast-Benachrichtigungen**
> „Bei Fehlern möchte ich eine kurze Meldung sehen statt nur Text in der Liste."
> → Eigener `useToast`-Hook + kleine `Toast`-Komponente.

### Bonus
- Backend: OpenAPI/Swagger aus den Routen generieren.
- Backend: echtes SQLite statt JSON (wieder nur das Repository anfassen!).
- Frontend: Tests mit Vitest + React Testing Library.

