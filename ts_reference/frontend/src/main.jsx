import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import "./index.css";

// Einstiegspunkt: React in das #root-Element mounten.
// StrictMode hilft, Nebeneffekte und veraltete Patterns früh zu erkennen.
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
