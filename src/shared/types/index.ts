export type {
  CalculationParams,
  CalculationResult,
  CalculationHistory,
  DailyDetail,
  KeyMetrics,
} from "@/shared/schemas";

export interface PaginationMeta {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  offset: number;
}

export interface PaginatedData<T> {
  data: T[];
  pagination: PaginationMeta;
}

export type PaginatedResponse<T> = ApiResponse<PaginatedData<T>>;

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
