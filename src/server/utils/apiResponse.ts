/**
 * 统一 API 响应格式
 */
import type { ApiResponse } from "@/shared/types";

export type { ApiResponse } from "@/shared/types";

export interface ApiErrorResponse {
  success: false;
  error: string;
  timestamp: string;
}

export interface ApiSuccessResponse<T> extends ApiResponse<T> {
  success: true;
  data: T;
  timestamp: string;
}

export const apiResponse = {
  success: <T>(data: T, status: number = 200): Response => {
    return Response.json(
      {
        success: true,
        data,
        timestamp: new Date().toISOString(),
      } satisfies ApiSuccessResponse<T>,
      { status },
    );
  },

  error: (error: string, status: number = 500): Response => {
    return Response.json(
      {
        success: false,
        error,
        timestamp: new Date().toISOString(),
      } satisfies ApiErrorResponse,
      { status },
    );
  },
};
