# js – Übungs-API (Aufgabenverwaltung)

Express-API mit JSON-Datei-Persistenz. Die **10 Grundlagen-Aufgaben sind jetzt
umgesetzt** (Validierung, ID-Prüfung, Pagination, Sortierung, PATCH-Whitelist,
zentrales Error-Handling, Tests, Persistenz). Dieses Projekt ist dein Übungsfeld –
die saubere Vergleichslösung liegt in [`../ts_reference`](../ts_reference).

## Starten

```bash
npm install
npm run dev          # http://localhost:3000
npm test             # Tests (Node Test Runner)
```

Die Daten liegen in `data/tasks.json` (wird beim ersten Start automatisch erzeugt).
Löschst du die Datei, wird sie mit den Startdaten neu angelegt.

## Aktuelle Endpunkte

| Methode | Pfad | Zweck |
|---------|------|-------|
| GET | `/api/tasks?done=&sort=&page=&limit=` | Liste (Filter, Sortierung, Pagination) |
| GET | `/api/tasks/search?q=` | Titel-Suche (case-insensitive) |
| GET | `/api/tasks/:id` | Einzelne Aufgabe |
| POST | `/api/tasks` | Anlegen (validiert) |
| PUT | `/api/tasks/:id` | Komplett ersetzen |
| PATCH | `/api/tasks/:id` | Teilaktualisierung (Whitelist) |
| PATCH | `/api/tasks/:id/toggle` | `done` umschalten |
| DELETE | `/api/tasks/:id` | Löschen |
| GET | `/api/health` · `/api/stats` · `/api/priorities` | Meta |

---

# Neue Aufgaben – als Use Cases

Jede Aufgabe ist als **fachlicher Wunsch** formuliert: *Welchen Request soll das
Backend annehmen, welche Response soll es liefern, und wozu?* Deine Aufgabe ist es,
das technisch umzusetzen. Mach gern pro Use Case eine eigene Branch und schreibe
einen Test dazu.

> Tipp: Du musst nicht alle machen. Such dir aus, was dich interessiert. Wenn du
> nicht weiterkommst, schau in [`../ts_reference`](../ts_reference), wie es dort
> strukturiert ist – aber versuch es erst selbst.

### 1. Fälligkeitsdatum
> „Ich möchte beim Anlegen einer Aufgabe optional ein **Fälligkeitsdatum**
> mitschicken (`POST /api/tasks` mit `{ "title": "...", "dueDate": "2026-07-01" }`)
> und es in der Antwort zurückbekommen, damit ich Aufgaben mit Deadline verwalten kann."

- Validiere, dass `dueDate` ein gültiges Datum ist (sonst `400`).
- Speichere es mit ab; bei fehlendem `dueDate` bleibt das Feld `null`.

### 2. Überfällige Aufgaben filtern
> „Ich möchte mit `GET /api/tasks?overdue=true` nur die Aufgaben bekommen, deren
> `dueDate` in der Vergangenheit liegt und die noch nicht erledigt sind, damit ich
> sehe, was dringend ist."

- Baut auf Use Case 1 auf.

### 3. Beschreibungstext + erweiterte Suche
> „Ich möchte zu einer Aufgabe eine optionale **Beschreibung** speichern, und die
> Suche (`GET /api/tasks/search?q=`) soll **sowohl Titel als auch Beschreibung**
> durchsuchen, damit ich Aufgaben besser wiederfinde."

### 4. Mehrere Aufgaben auf einmal erledigen (Bulk)
> „Ich möchte mit einem einzigen `POST /api/tasks/bulk-complete` und
> `{ "ids": [1, 2, 5] }` mehrere Aufgaben gleichzeitig als erledigt markieren und
> die Anzahl der geänderten Aufgaben zurückbekommen, damit ich nicht einzeln klicken muss."

- Antwort z. B. `{ "updated": 3 }`. Ignoriere nicht existierende IDs oder melde sie separat.

### 5. Papierkorb (Soft Delete)
> „Wenn ich `DELETE /api/tasks/:id` aufrufe, soll die Aufgabe nicht sofort weg sein,
> sondern in einen **Papierkorb** wandern. Mit `GET /api/tasks/trash` will ich den
> Papierkorb sehen und mit `POST /api/tasks/:id/restore` eine Aufgabe wiederherstellen."

- Tipp: ein Feld `deletedAt` (Zeitstempel oder `null`) statt echtem Löschen. Normale
  Listen blenden gelöschte Einträge aus.

### 6. Tags / Kategorien
> „Ich möchte einer Aufgabe mehrere **Tags** geben (`{ "tags": ["arbeit", "dringend"] }`)
> und mit `GET /api/tasks?tag=arbeit` nach einem Tag filtern, damit ich Aufgaben
> thematisch gruppieren kann."

### 7. Sortierrichtung
> „Ich möchte mit `GET /api/tasks?sort=createdAt&order=desc` die Sortierrichtung
> bestimmen (auf- oder absteigend), damit ich neueste oder älteste zuerst sehe."

- Erweitere die bestehende Sortierung um `order=asc|desc` (Default `asc`).

### 8. Einfache API-Key-Authentifizierung
> „Schreibende Requests (`POST`/`PUT`/`PATCH`/`DELETE`) sollen nur mit einem gültigen
> **Header** `X-API-Key: <key>` durchgehen, sonst `401`. Lesende Requests bleiben offen,
> damit ich die API absichern kann, ohne ein ganzes Login zu bauen."

- Tipp: eigene Middleware, Key aus einer Umgebungsvariable (`process.env.API_KEY`).

### 9. Rate-Limiting
> „Ich möchte, dass ein Client höchstens **60 Requests pro Minute** machen darf,
> danach kommt `429 Too Many Requests`, damit niemand die API überlastet."

- Tipp: Middleware mit einer Map `ip -> { count, resetAt }`. Bewusst ohne Extra-Paket bauen.

### 10. Zweite Ressource: Projekte
> „Ich möchte Aufgaben einem **Projekt** zuordnen. Mit `POST /api/projects` lege ich
> ein Projekt an, beim Anlegen einer Aufgabe gebe ich `projectId` mit, und mit
> `GET /api/projects/:id/tasks` sehe ich alle Aufgaben eines Projekts."

- Tipp: zweiter Store + zweiter Router. Prüfe, dass `projectId` auf ein existierendes Projekt zeigt (sonst `400`).

### Bonus
- OpenAPI/Swagger-Dokumentation generieren.
- Aufgaben als CSV exportieren (`GET /api/tasks/export`).
- Optimistic Locking über ein `version`-Feld (Konflikt -> `409`).
