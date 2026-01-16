import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .default(() => 3000),
  DB_PATH: z.string().default("./calculations.db"),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  API_TIMEOUT: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .default(() => 10000),
  HEALTH_CHECK_ENABLED: z
    .string()
    .transform((val) => val === "true")
    .default(() => true),
});

export type Env = z.infer<typeof EnvSchema>;

let cachedEnv: Env | null = null;

export const getEnv = (): Env => {
  if (cachedEnv) {
    return cachedEnv;
  }

  const result = EnvSchema.safeParse(process.env);

  if (!result.success) {
    const errors = Array.from(result.error.issues)
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join("\n");
    throw new Error(`环境变量验证失败:\n${errors}`);
  }

  cachedEnv = result.data;
  return cachedEnv;
};

export const isDevelopment = (): boolean => getEnv().NODE_ENV === "development";
export const isProduction = (): boolean => getEnv().NODE_ENV === "production";
export const isTest = (): boolean => getEnv().NODE_ENV === "test";
