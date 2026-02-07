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

export const getFieldErrorMessage = (fieldName: keyof CalculationParams, value: unknown): string => {
  const result = CalculationParamsSchema.shape[fieldName].safeParse(value);
  return result.success ? "" : result.error.issues[0]?.message || "输入值无效";
};
