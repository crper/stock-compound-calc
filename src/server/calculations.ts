/**
 * 计算记录 API 路由
 * 提供历史记录的增删改查功能
 */
import { saveCalculation, getCalculations, clearCalculations, deleteCalculation } from "./database";
import { calculateBidirectionalReturns } from "./stockCalculator";
import type { CalculationParams } from "@/shared/types";

// 最大返回历史记录数量
const MAX_HISTORY_COUNT = 50;

// 必填参数列表
const REQUIRED_PARAMS = ["initialPrice", "boardCount", "dailyReturn"] as const;

export const calculationsRoutes = {
  /**
   * GET /api/calculations
   * 获取所有计算历史记录
   */
  async GET() {
    try {
      const calculations = getCalculations(MAX_HISTORY_COUNT);

      return Response.json({
        success: true,
        data: calculations,
      });
    } catch (error) {
      console.error("获取历史记录失败:", error);

      return Response.json(
        {
          success: false,
          error: "获取历史记录失败",
        },
        { status: 500 },
      );
    }
  },

  /**
   * POST /api/calculations
   * 保存新的计算记录
   */
  async POST(req: Request) {
    try {
      const body = await req.json();
      const { initialPrice, boardCount, dailyReturn } = body;

      // 验证必填参数
      const missingParams = REQUIRED_PARAMS.filter((param) => !body[param]);
      if (missingParams.length > 0) {
        return Response.json(
          {
            success: false,
            error: `缺少必要参数: ${missingParams.join(", ")}`,
          },
          { status: 400 },
        );
      }

      // 转换参数类型
      const params: CalculationParams = {
        initialPrice: Number(initialPrice),
        boardCount: Number(boardCount),
        dailyReturn: Number(dailyReturn),
      };

      // 执行计算
      const results = calculateBidirectionalReturns(params);

      // 保存到数据库
      const history = saveCalculation(params, results);

      return Response.json({
        success: true,
        data: history,
      });
    } catch (error) {
      console.error("保存计算记录失败:", error);

      return Response.json(
        {
          success: false,
          error: "保存计算记录失败",
        },
        { status: 500 },
      );
    }
  },

  /**
   * DELETE /api/calculations
   * 清除所有历史记录
   */
  async DELETE() {
    try {
      clearCalculations();

      return Response.json({
        success: true,
        message: "历史记录已清除",
      });
    } catch (error) {
      console.error("清除历史记录失败:", error);

      return Response.json(
        {
          success: false,
          error: "清除历史记录失败",
        },
        { status: 500 },
      );
    }
  },

  /**
   * PATCH /api/calculations
   * 批量删除指定的历史记录
   */
  async PATCH(req: Request) {
    try {
      const body = await req.json();
      const { ids } = body;

      if (!Array.isArray(ids) || ids.length === 0) {
        return Response.json(
          {
            success: false,
            error: "无效的ID列表",
          },
          { status: 400 },
        );
      }

      let deletedCount = 0;
      for (const id of ids) {
        const success = deleteCalculation(id);
        if (success) {
          deletedCount++;
        }
      }

      return Response.json({
        success: true,
        deletedCount,
      });
    } catch (error) {
      console.error("批量删除历史失败:", error);

      return Response.json(
        {
          success: false,
          error: "删除历史失败",
        },
        { status: 500 },
      );
    }
  },
};
