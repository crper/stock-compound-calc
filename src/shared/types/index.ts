export type {
  CalculationParams,
  CalculationResult,
  CalculationHistory,
  DailyDetail,
} from "@/shared/schemas";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
