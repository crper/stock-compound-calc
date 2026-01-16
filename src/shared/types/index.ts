export type {
  CalculationParams,
  CalculationResult,
  CalculationHistory,
  DailyDetail,
  KeyMetrics,
} from "@/shared/schemas";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
