// Zentrale Konfiguration aus Umgebungsvariablen.
export interface Config {
  port: number;
  nodeEnv: string;
  corsOrigin: string;
}

export const config: Config = {
  port: Number(process.env.PORT) || 3001,
  nodeEnv: process.env.NODE_ENV || "development",
  corsOrigin: process.env.CORS_ORIGIN || "*",
};

export const isProduction = config.nodeEnv === "production";
