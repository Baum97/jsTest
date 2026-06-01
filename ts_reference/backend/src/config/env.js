// Zentrale Konfiguration aus Umgebungsvariablen.
// An einer Stelle gebündelt, statt process.env quer durch den Code zu streuen.
export const config = {
  port: Number(process.env.PORT) || 3001,
  nodeEnv: process.env.NODE_ENV || "development",
  corsOrigin: process.env.CORS_ORIGIN || "*",
};

export const isProduction = config.nodeEnv === "production";
