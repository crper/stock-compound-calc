/**
 * 计算记录 API 路由
 * 提供历史记录的增删改查功能
 */
import { saveCalculation, getCalculations, clearCalculations, deleteCalculation } from "./database";
import { calculateBidirectionalReturns } from "./stockCalculator";
import { CalculationParamsSchema, BatchDeleteSchema } from "@/shared/schemas";
import { ErrorHandler } from "@/shared/utils/errorHandler";
import { apiResponse } from "./utils/apiResponse";

// 最大返回历史记录数量
const MAX_HISTORY_COUNT = 50;

export const calculationsRoutes = {
  /**
   * GET /api/calculations
   * 获取所有计算历史记录
   */
  async GET() {
    try {
      const calculations = getCalculations(MAX_HISTORY_COUNT);
      return apiResponse.success(calculations);
    } catch (error) {
      const appError = ErrorHandler.handleUnknown(error);
      ErrorHandler.log(appError);
      return apiResponse.error(appError.toUserMessage());
    }
  },

  /**
   * POST /api/calculations
   * 保存新的计算记录
   */
  async POST(req: Request) {
    try {
      const body = await req.json();

      const validationResult = CalculationParamsSchema.safeParse(body);
      if (!validationResult.success) {
        const errors = Array.from(validationResult.error.issues)
          .map((e) => e.message)
          .join(", ");
        return apiResponse.error(`参数验证失败: ${errors}`, 400);
      }

      const params = validationResult.data;
      const results = calculateBidirectionalReturns(params);
      const history = saveCalculation(params, results);

      return apiResponse.success(history);
    } catch (error) {
      const appError = ErrorHandler.handleUnknown(error);
      ErrorHandler.log(appError);
      return apiResponse.error(appError.toUserMessage());
    }
  },

  /**
   * DELETE /api/calculations
   * 清除所有历史记录
   */
  async DELETE() {
    try {
      clearCalculations();
      return apiResponse.success({ message: "历史记录已清除" });
    } catch (error) {
      const appError = ErrorHandler.handleUnknown(error);
      ErrorHandler.log(appError);
      return apiResponse.error(appError.toUserMessage());
    }
  },

  /**
   * PATCH /api/calculations
   * 批量删除指定的历史记录
   */
  async PATCH(req: Request) {
    try {
      const body = await req.json();

      const validationResult = BatchDeleteSchema.safeParse(body);
      if (!validationResult.success) {
        const errors = Array.from(validationResult.error.issues)
          .map((e) => e.message)
          .join(", ");
        return apiResponse.error(`参数验证失败: ${errors}`, 400);
      }

      const { ids } = validationResult.data;

      let deletedCount = 0;
      for (const id of ids) {
        const success = deleteCalculation(id);
        if (success) {
          deletedCount++;
        }
      }

      return apiResponse.success({ deletedCount });
    } catch (error) {
      const appError = ErrorHandler.handleUnknown(error);
      ErrorHandler.log(appError);
      return apiResponse.error(appError.toUserMessage());
    }
  },
};
