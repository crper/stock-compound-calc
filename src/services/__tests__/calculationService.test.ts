import { afterEach, beforeEach, describe, expect, it } from "vite-plus/test";
import { db } from "@/db/dexie";
import type { calculationService as CalculationService } from "../calculationService";

const SAMPLE_RESULTS = {
  up: { finalPrice: 16.1, totalReturn: 61, totalGain: 6.1, dailyDetails: [] },
  down: { finalPrice: 5.9, totalReturn: -41, totalGain: -4.1, dailyDetails: [] },
};

describe("calculationService", () => {
  let calculationService: typeof CalculationService;

  beforeEach(async () => {
    const mod = await import("../calculationService");
    calculationService = mod.calculationService;
    if (typeof indexedDB !== "undefined") {
      await db.calculations.clear();
    }
  });

  afterEach(async () => {
    if (typeof indexedDB !== "undefined") {
      await db.calculations.clear();
    }
  });

  describe("calculate", () => {
    it("应该正确执行双向计算", () => {
      const params = { initialPrice: 10, boardCount: 5, dailyReturn: 10 };
      const result = calculationService.calculate(params);

      expect(result.up.finalPrice).toBeGreaterThan(params.initialPrice);
      expect(result.down.finalPrice).toBeLessThan(params.initialPrice);
      expect(result.up.totalReturn).toBeGreaterThan(0);
      expect(result.down.totalReturn).toBeLessThan(0);
    });

    it("应该处理涨停和跌停的绝对值计算", () => {
      const params = { initialPrice: 10, boardCount: 3, dailyReturn: -5 };
      const result = calculationService.calculate(params);

      expect(result.up.dailyDetails[0]?.dailyReturnPercent).toBe(5);
      expect(result.down.dailyDetails[0]?.dailyReturnPercent).toBe(-5);
    });
  });

  if (typeof indexedDB === "undefined") {
    it("需要浏览器环境运行数据库测试", () => {
      expect(true).toBe(true);
    });
    return;
  }

  describe("saveCalculation", () => {
    it("应该保存计算结果到数据库", async () => {
      const params = { initialPrice: 10, boardCount: 5, dailyReturn: 10 };

      const saved = await calculationService.saveCalculation(params, SAMPLE_RESULTS);

      expect(saved.id).toBeDefined();
      expect(saved.params).toEqual(params);
      expect(saved.results).toEqual(SAMPLE_RESULTS);
    });
  });

  describe("clearHistory", () => {
    it("应该清空所有历史记录", async () => {
      const params = { initialPrice: 10, boardCount: 5, dailyReturn: 10 };

      await calculationService.saveCalculation(params, SAMPLE_RESULTS);
      await calculationService.clearHistory();

      const { calculationRepository } = await import("@/db/calculationRepository");
      const history = await calculationRepository.getAll();
      expect(history.data).toHaveLength(0);
    });
  });

  describe("deleteHistory", () => {
    it("应该批量删除指定记录并返回删除数量", async () => {
      const params = { initialPrice: 10, boardCount: 5, dailyReturn: 10 };

      const saved1 = await calculationService.saveCalculation(params, SAMPLE_RESULTS);
      const saved2 = await calculationService.saveCalculation(
        { ...params, initialPrice: 20 },
        SAMPLE_RESULTS,
      );

      const deletedCount = await calculationService.deleteHistory([saved1.id]);
      expect(deletedCount).toBe(1);

      const { calculationRepository } = await import("@/db/calculationRepository");
      const history = await calculationRepository.getAll();
      expect(history.data).toHaveLength(1);
      expect(history.data[0]?.id).toBe(saved2.id);
    });

    it("应该处理空ids数组", async () => {
      const deletedCount = await calculationService.deleteHistory([]);
      expect(deletedCount).toBe(0);
    });
  });
});
