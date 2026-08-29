import { calculationRepository } from "@/db/calculationRepository";
import { calculateBidirectionalReturns } from "@/utils/stockCalculator";
import type { CalculationHistory, CalculationParams, CalculationResult } from "@/types";

/**
 * 计算服务：负责「计算 + 持久化」的编排入口。
 * 无任何 HTTP 语义，不做响应包装；计算/存储层抛出的本就是 AppError，原样透传。
 */
export const calculationService = {
  calculate: (params: CalculationParams): { up: CalculationResult; down: CalculationResult } =>
    calculateBidirectionalReturns(params),

  saveCalculation: (
    params: CalculationParams,
    results: { up: CalculationResult; down: CalculationResult },
  ): Promise<CalculationHistory> => calculationRepository.save(params, results),

  clearHistory: (): Promise<void> => calculationRepository.clear(),

  deleteHistory: (ids: string[]): Promise<number> => calculationRepository.deleteMany(ids),
};
