import { createApp } from "./app.ts";
import { config } from "./config/env.ts";

const app = createApp();

const server = app.listen(config.port, () => {
  console.log(`API läuft auf http://localhost:${config.port} (${config.nodeEnv})`);
});

// Sauberes Herunterfahren – wichtig in Containern/Produktion.
const shutdown = (signal: string): void => {
  console.log(`\n${signal} empfangen, fahre herunter ...`);
  server.close(() => process.exit(0));
};
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
