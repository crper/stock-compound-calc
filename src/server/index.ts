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
    "/api/calculations/calculate": {
      async POST(req: Request) {
        try {
          const body = await req.json();
          const { CalculationParamsSchema } = await import("@/shared/schemas");
          const { calculateBidirectionalReturns } = await import("./stockCalculator");
          const { apiResponse } = await import("./utils/apiResponse");

          const validationResult = CalculationParamsSchema.safeParse(body);
          if (!validationResult.success) {
            const errors = Array.from(validationResult.error.issues)
              .map((e) => e.message)
              .join(", ");
            return apiResponse.error(`参数验证失败: ${errors}`, 400);
          }

          const params = validationResult.data;
          const results = calculateBidirectionalReturns(params);

          return apiResponse.success(results);
        } catch (error) {
          const { ErrorHandler } = await import("@/shared/utils/errorHandler");
          const { apiResponse } = await import("./utils/apiResponse");
          const appError = ErrorHandler.handleUnknown(error);
          ErrorHandler.log(appError);
          return apiResponse.error(appError.toUserMessage());
        }
      },
    },
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
