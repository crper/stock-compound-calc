import { serve } from "bun";
import index from "../index.html";
import { getDatabase } from "./database";
import { calculationsRoutes } from "./calculations";
import { getEnv } from "@/shared/config";
import { logger } from "@/shared/utils/logger";

try {
  getDatabase();
  logger.info("Database initialized successfully");
} catch (error) {
  const err = error instanceof Error ? error : new Error(String(error));
  logger.error("Failed to initialize database", err);
  throw error;
}

const env = getEnv();

const server = serve({
  port: env.PORT,
  routes: {
    "/*": index,
    "/api/calculations": calculationsRoutes,
  },

  development: env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

logger.info("Server started", {
  url: server.url,
  environment: env.NODE_ENV,
  port: env.PORT,
});
