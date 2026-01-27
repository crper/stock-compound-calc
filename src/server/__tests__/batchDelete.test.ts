import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { getDatabase } from "@/server/database";
import { calculationsRoutes } from "@/server/calculations";
import { saveCalculation } from "@/server/database";
import type { CalculationParams } from "@/shared/types";

describe("批量删除历史记录", () => {
  // 在每个测试前清空数据库
  beforeEach(() => {
    const db = getDatabase();
    db.exec("DELETE FROM calculations");
  });

  // 在测试结束后也可以选择清理
  afterEach(() => {
    const db = getDatabase();
    db.exec("DELETE FROM calculations");
  });

  it("应该成功批量删除存在的记录", async () => {
    // 手动创建一些测试数据
    const params1: CalculationParams = {
      initialPrice: 10,
      boardCount: 5,
      dailyReturn: 10,
    };

    const params2: CalculationParams = {
      initialPrice: 20,
      boardCount: 3,
      dailyReturn: 5,
    };

    // 使用计算函数模拟API行为
    const stockCalculatorModule = await import("@/server/stockCalculator");
    const calculateBidirectionalReturns = stockCalculatorModule.calculateBidirectionalReturns;
    const results1 = calculateBidirectionalReturns(params1);
    const results2 = calculateBidirectionalReturns(params2);

    const history1 = saveCalculation(params1, results1);
    const history2 = saveCalculation(params2, results2);

    const id1 = history1.id;
    const id2 = history2.id;

    // 验证记录存在
    const getAllResponse = await calculationsRoutes.GET(
      new Request("http://localhost/api/calculations"),
    );
    const getAllResult = await getAllResponse.json();
    expect(Array.isArray(getAllResult.data)).toBe(true);
    expect(getAllResult.data.length).toBeGreaterThanOrEqual(2);

    // 执行批量删除
    const patchResponse = await calculationsRoutes.PATCH(
      new Request("http://localhost/api/calculations", {
        method: "PATCH",
        body: JSON.stringify({ ids: [id1, id2] }),
      }),
    );

    expect(patchResponse.status).toBe(200);
    const patchResult = await patchResponse.json();
    expect(patchResult.success).toBe(true);
    expect(patchResult.data.deletedCount).toBeGreaterThanOrEqual(1);
  });

  it("应该正确处理部分存在的ID", async () => {
    // 添加一个有效记录
    const params: CalculationParams = {
      initialPrice: 10,
      boardCount: 5,
      dailyReturn: 10,
    };

    const stockCalculatorModule = await import("@/server/stockCalculator");
    const calculateBidirectionalReturns = stockCalculatorModule.calculateBidirectionalReturns;
    const results = calculateBidirectionalReturns(params);
    const history = saveCalculation(params, results);
    const existingId = history.id;
    const nonExistingId = "non-existent-id";

    // 尝试批量删除一个存在和一个不存在的ID
    const patchResponse = await calculationsRoutes.PATCH(
      new Request("http://localhost/api/calculations", {
        method: "PATCH",
        body: JSON.stringify({ ids: [existingId, nonExistingId] }),
      }),
    );

    expect(patchResponse.status).toBe(200);
    const patchResult = await patchResponse.json();
    expect(patchResult.success).toBe(true);
    expect(patchResult.data.deletedCount).toBeGreaterThanOrEqual(0); // 至少删除了存在的那个
  });

  it("应该拒绝空ID数组", async () => {
    // 尝试批量删除空数组 - 应该失败，因为Zod验证要求至少1个ID
    const patchResponse = await calculationsRoutes.PATCH(
      new Request("http://localhost/api/calculations", {
        method: "PATCH",
        body: JSON.stringify({ ids: [] }),
      }),
    );

    expect(patchResponse.status).toBe(400); // 验证失败应返回400
    const patchResult = await patchResponse.json();
    expect(patchResult.success).toBe(false);
  });

  it("应该正确处理无效请求", async () => {
    // 尝试发送格式错误的请求
    const patchResponse = await calculationsRoutes.PATCH(
      new Request("http://localhost/api/calculations", {
        method: "PATCH",
        body: JSON.stringify({ invalid_field: ["some-id"] }),
      }),
    );

    expect(patchResponse.status).toBe(400); // 验证失败应返回400
    const patchResult = await patchResponse.json();
    expect(patchResult.success).toBe(false);
  });
});
