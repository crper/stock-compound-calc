import { CalculationParamsSchema, type CalculationParams } from "@/schemas";
import { ErrorFactory } from "./errorHandler";

export const validateCalculationParams = (params: CalculationParams): void => {
  const result = CalculationParamsSchema.safeParse(params);
  if (!result.success) {
    const errors = result.error.issues.map((e) => e.message).join("; ");
    throw ErrorFactory.validation(errors);
  }
};

export const isFieldValid = (value: unknown, fieldName: keyof CalculationParams): boolean => {
  const result = CalculationParamsSchema.shape[fieldName].safeParse(value);
  return result.success;
};

/**
 * 获取字段的 i18n 翻译键
 */
export const getFieldValidationKey = (fieldName: keyof CalculationParams, value: unknown): string | null => {
  if (isFieldValid(value, fieldName)) {
    return null;
  }

  const numValue = typeof value === "number" ? value : null;

  switch (fieldName) {
    case "initialPrice":
      if (numValue !== null) {
        if (numValue < 0.01) return "validation.price.min";
        if (numValue > 1000000000) return "validation.price.max";
      }
      break;
    case "boardCount":
      if (numValue !== null) {
        if (!Number.isInteger(numValue)) return "validation.boardCount.integer";
        if (numValue < 1) return "validation.boardCount.min";
        if (numValue > 3650) return "validation.boardCount.max";
      }
      break;
    case "dailyReturn":
      if (numValue !== null) {
        if (numValue < -99) return "validation.dailyReturn.min";
        if (numValue > 100) return "validation.dailyReturn.max";
      }
      break;
    case "stockQuantity":
      if (numValue !== null) {
        if (!Number.isInteger(numValue)) return "validation.stockQuantity.integer";
        if (numValue < 1) return "validation.stockQuantity.min";
        if (numValue > 10000000000) return "validation.stockQuantity.max";
      }
      break;
  }

  return null;
};

/**
 * 获取字段的错误消息（用于向后兼容）
 * @deprecated 请使用 getFieldValidationKey 结合 t() 函数获取国际化错误消息
 */
export const getFieldErrorMessage = (
  fieldName: keyof CalculationParams,
  value: unknown,
): string => {
  const result = CalculationParamsSchema.shape[fieldName].safeParse(value);
  return result.success ? "" : result.error.issues[0]?.message || "输入值无效";
};
