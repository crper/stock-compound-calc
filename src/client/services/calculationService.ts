import type { CalculationParams, CalculationHistory, PaginatedResponse } from "@/shared/types";
import { API_CONSTANTS } from "@/shared/constants";

export const calculationService = {
  /**
   * 保存计算结果
   */
  saveCalculation: async (params: CalculationParams): Promise<CalculationHistory> => {
    const response = await fetch(`${API_CONSTANTS.BASE_URL}/calculations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || "保存计算记录失败");
    }

    return result.data;
  },

  /**
   * 获取所有历史记录 (兼容旧版)
   */
  getAllHistory: async (): Promise<CalculationHistory[]> => {
    const response = await fetch(`${API_CONSTANTS.BASE_URL}/calculations`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || "获取历史记录失败");
    }
    return Array.isArray(result.data) ? result.data : [];
  },

  /**
   * 获取分页历史记录
   */
  getPaginatedHistory: async (page: number, limit: number): Promise<PaginatedResponse<CalculationHistory>> => {
    const response = await fetch(`${API_CONSTANTS.BASE_URL}/calculations?page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || "获取历史记录失败");
    }
    return result;
  },

  /**
   * 清除所有历史记录
   */
  clearHistory: async (): Promise<void> => {
    const response = await fetch(`${API_CONSTANTS.BASE_URL}/calculations`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || "清除历史记录失败");
    }
  },

  /**
   * 删除指定历史记录
   */
  deleteHistory: async (ids: string[]): Promise<void> => {
    const response = await fetch(`${API_CONSTANTS.BASE_URL}/calculations`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || "删除历史记录失败");
    }
  },
};
