# jsTest – Übungs-API (Aufgabenverwaltung)

Ein kleines Grundgerüst einer REST-API mit **Express** und einem In-Memory-Datenspeicher.
Gedacht zum Lernen: Das Gerüst läuft, hat aber bewusst Lücken und kleine Schwächen,
die du in den Aufgaben unten verbesserst.

## Setup

```bash
npm install
npm run dev      # mit Auto-Reload (node --watch)
# oder
npm start
```

Server läuft auf `http://localhost:3000`.

Zum Testen gibt es `requests.http` (REST Client Extension in VS Code) oder du nutzt `curl`.

## Die 10 Routen

| # | Methode | Pfad | Beschreibung |
|---|---------|------|--------------|
| 1 | GET | `/api/tasks` | Alle Aufgaben (Filter: `?done=true`) |
| 2 | GET | `/api/tasks/search?q=` | Aufgaben im Titel durchsuchen |
| 3 | GET | `/api/tasks/:id` | Einzelne Aufgabe |
| 4 | POST | `/api/tasks` | Aufgabe anlegen |
| 5 | PUT | `/api/tasks/:id` | Aufgabe aktualisieren |
| 6 | PATCH | `/api/tasks/:id/toggle` | Status `done` umschalten |
| 7 | DELETE | `/api/tasks/:id` | Aufgabe löschen |
| 8 | GET | `/api/health` | Health-Check |
| 9 | GET | `/api/stats` | Statistik (gesamt/erledigt/offen) |
| 10 | GET | `/api/priorities` | Aufgaben nach Priorität gruppiert |

## Projektstruktur

```
src/
  server.js          # Einstiegspunkt, startet den Server
  app.js             # Express-App zusammenbauen
  store.js           # In-Memory-Datenspeicher
  middleware/
    logger.js        # Request-Logging
  routes/
    tasks.js         # Routen 1-7
    meta.js          # Routen 8-10
```

---

## 10 Aufgaben zum Üben

Sortiert ungefähr von leicht nach schwer. Mach gern eine eigene Branch pro Aufgabe.

### Korrigieren (Bugs finden & fixen)

1. **Validierung beim Anlegen.** `POST /api/tasks` akzeptiert aktuell jeden Body –
   auch eine Aufgabe ganz ohne `title`. Lehne ungültige Eingaben mit `400` und einer
   klaren Fehlermeldung ab (z. B. `title` ist Pflicht und muss ein nicht-leerer String sein).

2. **Ungültige IDs.** Bei `/api/tasks/abc` wird `Number("abc")` zu `NaN`, und du bekommst
   einfach „nicht gefunden". Fang ungültige IDs sauber ab und gib `400` statt `404` zurück.

3. **Routen-Reihenfolge prüfen.** `/api/tasks/search` funktioniert nur, weil es **vor**
   `/api/tasks/:id` steht. Verstehe warum, und schreibe einen Kommentar/Test, der das absichert.
   (Vertausche die beiden testweise und beobachte, was passiert.)

4. **Suche verbessern.** Die Suche ist case-sensitive (`title.includes(q)`). Mach sie
   case-insensitive und behandle einen fehlenden `q`-Parameter sinnvoll.

### Erweitern (neue Features)

5. **Paginierung.** Erweitere `GET /api/tasks` um `?page=` und `?limit=` und gib zusätzlich
   `total` und `page` in der Antwort zurück.

6. **PATCH statt PUT.** Aktuell ersetzt `PUT` die Felder per `Object.assign` – auch unerwünschte.
   Baue eine echte Teilaktualisierung, die nur erlaubte Felder (`title`, `done`, `priority`)
   übernimmt und unbekannte Felder ignoriert.

7. **Sortierung.** Füge `?sort=priority` und `?sort=createdAt` zu `GET /api/tasks` hinzu.

8. **Zentrales Error-Handling.** Baue eine Express-Error-Middleware (`(err, req, res, next)`),
   sodass nicht jede Route ihre Fehler einzeln behandeln muss. Wirf in den Routen Fehler und
   fang sie zentral ab.

### Profi-Level

9. **Tests schreiben.** Das Projekt hat `npm test` (Node Test Runner), aber keine Tests.
   Schreibe Tests für mindestens 3 Routen – inklusive Fehlerfälle (404/400). Tipp:
   `createApp()` aus `app.js` lässt sich gut mit `supertest` oder `fetch` testen.

10. **Persistenz.** Ersetze den In-Memory-`store` durch echte Persistenz (JSON-Datei oder
    SQLite). Die Routen sollen dabei **unverändert** bleiben – nur die `store.js`-Implementierung
    ändert sich. Achte darauf, dass die Methoden ggf. asynchron werden (`async/await`).

### Bonus
- Rate-Limiting-Middleware schreiben.
- OpenAPI/Swagger-Doku ergänzen.
- Eine zweite Ressource (`/api/users`) mit Verknüpfung zu Aufgaben hinzufügen.
