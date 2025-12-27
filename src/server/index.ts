import { serve } from "bun";
import index from "../index.html";
import { getDatabase } from "./database";
import { calculationsRoutes } from "./calculations";

try {
  getDatabase();
  console.log("✅ Database initialized successfully");
} catch (error) {
  console.error("❌ Failed to initialize database:", error);
  throw error;
}

const server = serve({
  port: process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 3000,
  routes: {
    "/*": index,
    "/api/calculations": calculationsRoutes,
  },

  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
