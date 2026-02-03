import { serve } from "bun";
import index from "../index.html";
import "@/shared/config/decimal"; // 配置 Decimal.js 全局精度
import { getEnv } from "@/shared/config";
import { logger } from "@/shared/utils/logger";

const env = getEnv();

const server = serve({
  port: env.PORT,
  routes: {
    "/*": index,
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
