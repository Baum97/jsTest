# Best-Practice-Referenz (Full-Stack)

Diese `reference/`-Sammlung ist die **saubere Vergleichsversion** zu deinem Lern-Projekt
in `src/`. Gleiche Funktionalität, aber so strukturiert, wie man es in echten Projekten
machen würde. Vergleiche bewusst Datei für Datei mit deiner eigenen Lösung.

```
reference/
  backend/    Express-API mit Schichtenarchitektur
  frontend/   React-App (Vite), die die API konsumiert
```

## Starten

Zwei Terminals:

```bash
# Terminal 1 – Backend (Port 3001)
cd reference/backend
npm install
npm run dev

# Terminal 2 – Frontend (Port 5173)
cd reference/frontend
npm install
npm run dev
```

Dann `http://localhost:5173` öffnen. Der Vite-Dev-Server proxyt `/api` automatisch
ans Backend, deshalb gibt es keine CORS-Probleme im Browser.

Backend-Tests: `cd reference/backend && npm test`

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

Vorteil: Jede Schicht ist einzeln testbar und austauschbar. Willst du von
In-Memory auf SQLite wechseln, änderst du **nur** `repositories/taskRepository.js`.

### Weitere Best Practices im Backend
- **`AppError` + zentrale Error-Middleware** – kein wiederholtes `res.status(404)` in jeder Route.
- **`asyncHandler`** – fängt Fehler aus async-Controllern automatisch ab.
- **`createApp()` getrennt von `server.js`** – die App lässt sich ohne echten Port testen.
- **Validierung als eigene Schicht** mit Whitelist (verhindert das Einschleusen fremder Felder).
- **Config zentral** aus Umgebungsvariablen, kein `process.env` quer im Code.
- **Graceful Shutdown** auf SIGINT/SIGTERM.

### Frontend – saubere React-Struktur
```
api/        fetch-Wrapper + eine Funktion pro Endpunkt (kein fetch in Komponenten)
hooks/      useTasks: kapselt State + Server-Kommunikation
components/  kleine, fokussierte Komponenten (eine Aufgabe pro Datei)
App.jsx     verbindet Hook (Logik) mit Komponenten (Darstellung)
```

Die zentralen React-Lehrpunkte:
- **Trennung Logik/Darstellung**: `useTasks`-Hook hält die Logik, Komponenten nur das Rendern.
- **Container vs. Präsentation**: `TaskList`/`TaskItem` sind „dumm" (nur Props), `App` ist der Container.
- **Kontrollierte Formulare** mit lokalem State (`TaskForm`).
- **Stabile Callbacks** (`useCallback`) und **abgeleitete Werte** (`useMemo`) statt State-Duplikation.
- **`memo()`** auf `TaskItem`, um unnötige Re-Renders zu vermeiden.
- **Explizite Lade-/Fehlerzustände** (`status`: loading | success | error).
