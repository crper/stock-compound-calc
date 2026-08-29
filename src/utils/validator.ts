import { CalculationParamsSchema, type CalculationParams } from "@/schemas";
import { CALCULATION_LIMITS } from "@/constants";
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

export const getFieldValidationKey = (
  fieldName: keyof CalculationParams,
  value: unknown,
): ValidationKey | null => {
  if (isFieldValid(value, fieldName)) {
    return null;
  }

  const numValue = typeof value === "number" ? value : null;

  switch (fieldName) {
    case "initialPrice":
      if (numValue !== null) {
        if (numValue < CALCULATION_LIMITS.MIN_INITIAL_PRICE) return "validation.price.min";
        if (numValue > CALCULATION_LIMITS.MAX_INITIAL_PRICE) return "validation.price.max";
      }
      break;
    case "boardCount":
      if (numValue !== null) {
        if (!Number.isInteger(numValue)) return "validation.boardCount.integer";
        if (numValue < CALCULATION_LIMITS.MIN_BOARD_COUNT) return "validation.boardCount.min";
        if (numValue > CALCULATION_LIMITS.MAX_BOARD_COUNT) return "validation.boardCount.max";
      }
      break;
    case "dailyReturn":
      if (numValue !== null) {
        if (numValue < CALCULATION_LIMITS.MIN_DAILY_RETURN) return "validation.dailyReturn.min";
        if (numValue > CALCULATION_LIMITS.MAX_DAILY_RETURN) return "validation.dailyReturn.max";
      }
      break;
    case "stockQuantity":
      if (numValue !== null) {
        if (!Number.isInteger(numValue)) return "validation.stockQuantity.integer";
        if (numValue < CALCULATION_LIMITS.MIN_STOCK_QUANTITY) return "validation.stockQuantity.min";
        if (numValue > CALCULATION_LIMITS.MAX_STOCK_QUANTITY) return "validation.stockQuantity.max";
      }
      break;
  }

  return null;
};
