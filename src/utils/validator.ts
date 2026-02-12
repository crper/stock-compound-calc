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
