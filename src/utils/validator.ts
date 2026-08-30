import { CalculationParamsSchema, type CalculationParams } from "@/schemas";
import { ErrorFactory } from "./errorHandler";

export const validateCalculationParams = (params: CalculationParams): void => {
  const result = CalculationParamsSchema.safeParse(params);
  if (!result.success) {
    const errors = result.error.issues.map((e) => e.message).join("; ");
    throw ErrorFactory.validation(errors);
  }
};

export const isFieldValid = (value: unknown, fieldName: keyof CalculationParams): boolean =>
  CalculationParamsSchema.shape[fieldName].safeParse(value).success;

export type ValidationKey =
  | "validation.price.min"
  | "validation.price.max"
  | "validation.boardCount.integer"
  | "validation.boardCount.min"
  | "validation.boardCount.max"
  | "validation.dailyReturn.min"
  | "validation.dailyReturn.max"
  | "validation.stockQuantity.integer"
  | "validation.stockQuantity.min"
  | "validation.stockQuantity.max";

// 字段名 → i18n 键前缀（约束边界统一收敛在 Zod schema，这里不再重复任何上限/下限）
const MIN_KEYS: Record<keyof CalculationParams, ValidationKey> = {
  initialPrice: "validation.price.min",
  boardCount: "validation.boardCount.min",
  dailyReturn: "validation.dailyReturn.min",
  stockQuantity: "validation.stockQuantity.min",
};

const MAX_KEYS: Record<keyof CalculationParams, ValidationKey> = {
  initialPrice: "validation.price.max",
  boardCount: "validation.boardCount.max",
  dailyReturn: "validation.dailyReturn.max",
  stockQuantity: "validation.stockQuantity.max",
};

const INTEGER_KEYS: Partial<Record<keyof CalculationParams, ValidationKey>> = {
  boardCount: "validation.boardCount.integer",
  stockQuantity: "validation.stockQuantity.integer",
};

/**
 * 从 Zod 的字段级校验失败推导翻译键，约束判定完全由 schema 负责。
 * 非整数 → invalid_type + expected:"int"；超上下界 → too_big / too_small。
 * 其余情况（如非数字，InputNumber 实际不会产出）返回 null。
 */
export const getFieldValidationKey = (
  fieldName: keyof CalculationParams,
  value: unknown,
): ValidationKey | null => {
  const result = CalculationParamsSchema.shape[fieldName].safeParse(value);
  if (result.success) return null;

  const issue = result.error.issues[0];
  if (!issue) return null;

  switch (issue.code) {
    case "too_small":
      return MIN_KEYS[fieldName];
    case "too_big":
      return MAX_KEYS[fieldName];
    // 非整数 `z.int()` 会以 expected:"int" 的 invalid_type 报错
    case "invalid_type":
      return issue.expected === "int" ? (INTEGER_KEYS[fieldName] ?? null) : null;
    default:
      return null;
  }
};
