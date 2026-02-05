import { calculationRepository } from "@/db/calculationRepository";
import { calculateBidirectionalReturns } from "@/utils/stockCalculator";
import type { CalculationHistory, CalculationParams, CalculationResult } from "@/types";
import type { ApiResponse, PaginatedData } from "@/types";
import { ErrorHandler } from "@/utils/errorHandler";

export const calculationService = {
  calculate: async (
    params: CalculationParams,
  ): Promise<{ up: CalculationResult; down: CalculationResult }> => {
    try {
      return calculateBidirectionalReturns(params);
    } catch (error) {
      throw ErrorHandler.handleUnknown(error);
    }
  },

  saveCalculation: async (
    params: CalculationParams,
    results: { up: CalculationResult; down: CalculationResult },
  ): Promise<CalculationHistory> => {
    return calculationRepository.save(params, results);
  },

  getPaginatedHistory: async (
    page: number,
    limit: number,
  ): Promise<ApiResponse<PaginatedData<CalculationHistory>>> => {
    const result = await calculationRepository.getAll({
      limit,
      offset: (page - 1) * limit,
    });
    return { success: true, data: result };
  },

  clearHistory: async (): Promise<ApiResponse<{ message: string }>> => {
    await calculationRepository.clear();
    return { success: true, data: { message: "已清除所有记录" } };
  },

  deleteHistory: async (ids: string[]): Promise<ApiResponse<{ deletedCount: number }>> => {
    const deletedCount = await calculationRepository.deleteMany(ids);
    return { success: true, data: { deletedCount } };
  },
};
