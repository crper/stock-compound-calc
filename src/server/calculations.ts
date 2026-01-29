/**
 * 计算记录 API 路由
 * 提供历史记录的增删改查功能
 */
import { API_LIMITS } from "@/shared/constants";
import { BatchDeleteSchema, CalculationParamsSchema } from "@/shared/schemas";
import { ErrorHandler } from "@/shared/utils/errorHandler";
import { clearCalculations, deleteCalculation, getCalculations, saveCalculation } from "./database";
import { calculateBidirectionalReturns } from "./stockCalculator";
import { apiResponse } from "./utils/apiResponse";

export const calculationsRoutes = {
  /**
   * GET /api/calculations
   * 获取所有计算历史记录
   */
  async GET(req: Request) {
    try {
      // 解析查询参数
      const url = new URL(req.url);
      const hasPaginationParams =
        url.searchParams.has("limit") ||
        url.searchParams.has("page") ||
        url.searchParams.has("offset");

      if (hasPaginationParams) {
        // 如果提供了分页参数，则执行分页查询
        const limit = parseInt(url.searchParams.get("limit") || String(API_LIMITS.DEFAULT_PAGE_SIZE));
        const offset = parseInt(url.searchParams.get("offset") || "0");
        const page = parseInt(url.searchParams.get("page") || "1");

        // 使用页面参数计算偏移量
        const calculatedOffset = offset > 0 ? offset : (page - 1) * limit;

        // 设置限制范围
        const normalizedLimit = Math.max(1, Math.min(limit, API_LIMITS.MAX_PAGE_SIZE));

        const { data: calculations, totalCount } = getCalculations({
          limit: normalizedLimit,
          offset: calculatedOffset,
        });

        // 计算分页信息
        const totalPages = Math.ceil(totalCount / normalizedLimit);
        const hasNextPage = calculatedOffset + normalizedLimit < totalCount;
        const hasPrevPage = calculatedOffset > 0;

        return apiResponse.success({
          data: calculations,
          pagination: {
            currentPage: page,
            pageSize: normalizedLimit,
            totalCount,
            totalPages,
            hasNext: hasNextPage,
            hasPrev: hasPrevPage,
            offset: calculatedOffset,
          },
        });
      } else {
        // 如果没有提供分页参数，则返回所有数据（保持向后兼容）
        const result = getCalculations({ limit: API_LIMITS.MAX_HISTORY_WITHOUT_PAGINATION });
        return apiResponse.success(result.data);
      }
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
