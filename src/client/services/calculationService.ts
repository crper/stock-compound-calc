import { API_CONSTANTS } from "@/shared/constants";
import type {
  CalculationHistory,
  CalculationParams,
  CalculationResult,
  PaginatedResponse,
} from "@/shared/types";

/** 请求超时时间（毫秒） */
const DEFAULT_TIMEOUT_MS = 10000;

/**
 * 带超时的 fetch 请求
 */
const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {},
  timeoutMs: number = DEFAULT_TIMEOUT_MS,
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`请求超时（${timeoutMs}ms）`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};

/**
 * 处理 API 响应
 */
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || "请求失败");
  }

  return result.data;
};

export const calculationService = {
  /**
   * 执行计算（涨停和跌停）
   */
  calculate: async (params: CalculationParams): Promise<{ up: CalculationResult; down: CalculationResult }> => {
    const response = await fetchWithTimeout(
      `${API_CONSTANTS.BASE_URL}/calculations/calculate`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      },
    );

    return handleResponse<{ up: CalculationResult; down: CalculationResult }>(response);
  },

  /**
   * 保存计算结果
   */
  saveCalculation: async (params: CalculationParams): Promise<CalculationHistory> => {
    const response = await fetchWithTimeout(
      `${API_CONSTANTS.BASE_URL}/calculations`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      },
    );

    return handleResponse<CalculationHistory>(response);
  },

  /**
   * 获取所有历史记录 (兼容旧版)
   */
  getAllHistory: async (): Promise<CalculationHistory[]> => {
    const response = await fetchWithTimeout(`${API_CONSTANTS.BASE_URL}/calculations`);
    const data = await handleResponse<CalculationHistory[] | { data: CalculationHistory[] }>(response);
    return Array.isArray(data) ? data : data.data;
  },

  /**
   * 获取分页历史记录
   */
  getPaginatedHistory: async (
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<CalculationHistory>> => {
    const response = await fetchWithTimeout(
      `${API_CONSTANTS.BASE_URL}/calculations?page=${page}&limit=${limit}`,
    );
    return handleResponse<PaginatedResponse<CalculationHistory>>(response);
  },

  /**
   * 清除所有历史记录
   */
  clearHistory: async (): Promise<void> => {
    const response = await fetchWithTimeout(`${API_CONSTANTS.BASE_URL}/calculations`, {
      method: "DELETE",
    });
    await handleResponse<{ message: string }>(response);
  },

  /**
   * 删除指定历史记录
   */
  deleteHistory: async (ids: string[]): Promise<void> => {
    const response = await fetchWithTimeout(
      `${API_CONSTANTS.BASE_URL}/calculations`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      },
    );
    await handleResponse<{ deletedCount: number }>(response);
  },
};
