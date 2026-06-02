import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Dev-Server proxyt /api ans Backend (Port 3001) -> keine CORS-Probleme.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:3001",
    },
  },
});
