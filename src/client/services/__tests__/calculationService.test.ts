import { describe, expect, it, beforeEach, afterEach } from "bun:test";

describe("calculationService", () => {
  let calculationService: typeof import("../calculationService").calculationService;
  let db: import("../db/dexie").StockCalculatorDB;

  beforeEach(async () => {
    const mod = await import("../calculationService");
    calculationService = mod.calculationService;
    if (typeof indexedDB !== "undefined") {
      const dbMod = await import("../db/dexie");
      db = dbMod.db as unknown as import("../db/dexie").StockCalculatorDB;
      await db.calculations.clear();
    }
  });

  afterEach(async () => {
    if (typeof indexedDB !== "undefined") {
      await db.calculations.clear();
    }
  });

  describe("calculate", () => {
    it("应该正确执行双向计算", async () => {
      const params = { initialPrice: 10, boardCount: 5, dailyReturn: 10 };
      const result = await calculationService.calculate(params);

      expect(result.up.finalPrice).toBeGreaterThan(params.initialPrice);
      expect(result.down.finalPrice).toBeLessThan(params.initialPrice);
      expect(result.up.totalReturn).toBeGreaterThan(0);
      expect(result.down.totalReturn).toBeLessThan(0);
    });

    it("应该处理涨停和跌停的绝对值计算", async () => {
      const params = { initialPrice: 10, boardCount: 3, dailyReturn: -5 };
      const result = await calculationService.calculate(params);

      expect(result.up.dailyDetails[0].dailyReturnPercent).toBe(5);
      expect(result.down.dailyDetails[0].dailyReturnPercent).toBe(-5);
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
      const results = {
        up: {
          finalPrice: 16.1,
          totalReturn: 61,
          totalGain: 6.1,
          details: [],
          dailyDetails: [],
        },
        down: {
          finalPrice: 5.9,
          totalReturn: -41,
          totalGain: -4.1,
          details: [],
          dailyDetails: [],
        },
      };

      const saved = await calculationService.saveCalculation(params, results);

      expect(saved.id).toBeDefined();
      expect(saved.params).toEqual(params);
      expect(saved.results).toEqual(results);
    });
  });

  describe("getPaginatedHistory", () => {
    it("应该返回分页历史记录", async () => {
      const params = { initialPrice: 10, boardCount: 5, dailyReturn: 10 };
      const results = {
        up: { finalPrice: 16.1, totalReturn: 61, totalGain: 6.1, details: [], dailyDetails: [] },
        down: { finalPrice: 5.9, totalReturn: -41, totalGain: -4.1, details: [], dailyDetails: [] },
      };

      for (let i = 0; i < 15; i++) {
        await calculationService.saveCalculation({ ...params, initialPrice: 10 + i }, results);
      }

      const response = await calculationService.getPaginatedHistory(1, 10);

      expect(response.success).toBe(true);
      expect(response.data?.data).toHaveLength(10);
      expect(response.data?.pagination.totalCount).toBe(15);
      expect(response.data?.pagination.currentPage).toBe(1);
      expect(response.data?.pagination.hasNext).toBe(true);
    });
  });

  describe("clearHistory", () => {
    it("应该清空所有历史记录", async () => {
      const params = { initialPrice: 10, boardCount: 5, dailyReturn: 10 };
      const results = {
        up: { finalPrice: 16.1, totalReturn: 61, totalGain: 6.1, details: [], dailyDetails: [] },
        down: { finalPrice: 5.9, totalReturn: -41, totalGain: -4.1, details: [], dailyDetails: [] },
      };

      await calculationService.saveCalculation(params, results);
      await calculationService.clearHistory();

      const { calculationRepository } = await import("../db/calculationRepository");
      const history = await calculationRepository.getAll();
      expect(history.data).toHaveLength(0);
    });
  });

  describe("deleteHistory", () => {
    it("应该批量删除指定记录", async () => {
      const params = { initialPrice: 10, boardCount: 5, dailyReturn: 10 };
      const results = {
        up: { finalPrice: 16.1, totalReturn: 61, totalGain: 6.1, details: [], dailyDetails: [] },
        down: { finalPrice: 5.9, totalReturn: -41, totalGain: -4.1, details: [], dailyDetails: [] },
      };

      const saved1 = await calculationService.saveCalculation(params, results);
      const saved2 = await calculationService.saveCalculation({ ...params, initialPrice: 20 }, results);

      const response = await calculationService.deleteHistory([saved1.id]);

      expect(response.success).toBe(true);
      expect(response.data?.deletedCount).toBe(1);

      const { calculationRepository } = await import("../db/calculationRepository");
      const history = await calculationRepository.getAll();
      expect(history.data).toHaveLength(1);
      expect(history.data[0].id).toBe(saved2.id);
    });

    it("应该处理空ids数组", async () => {
      const response = await calculationService.deleteHistory([]);

      expect(response.success).toBe(true);
      expect(response.data?.deletedCount).toBe(0);
    });
  });
});
