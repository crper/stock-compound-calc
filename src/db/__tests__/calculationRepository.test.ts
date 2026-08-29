import { setTimeout as sleep } from "node:timers/promises";
import { afterEach, beforeEach, describe, expect, it } from "vite-plus/test";
import type { calculationRepository as CalculationRepository } from "../calculationRepository";
import type { StockCalculatorDB } from "../dexie";

describe("calculationRepository", () => {
  if (typeof indexedDB === "undefined") {
    it("需要浏览器环境运行 IndexedDB 测试", () => {
      expect(true).toBe(true);
    });
    return;
  }

  let calculationRepository: typeof CalculationRepository;
  let db: StockCalculatorDB;

  beforeEach(async () => {
    const mod = await import("../calculationRepository");
    calculationRepository = mod.calculationRepository;
    const dbMod = await import("../dexie");
    db = dbMod.db;
    await db.calculations.clear();
  });

  afterEach(async () => {
    if (typeof indexedDB !== "undefined") {
      await db.calculations.clear();
    }
  });

  it("应该保存计算记录", async () => {
    const params = { initialPrice: 10, boardCount: 5, dailyReturn: 10 };
    const results = {
      up: {
        finalPrice: 16.1051,
        totalReturn: 61.051,
        totalGain: 6.1051,
        dailyDetails: [
          { day: 1, openPrice: 10, closePrice: 11, dailyGain: 1, dailyReturnPercent: 10 },
        ],
        keyMetrics: { doubleDays: 8, tenXDays: null, breakEvenReturn: 0, annualizedReturn: 1000 },
      },
      down: {
        finalPrice: 5.9049,
        totalReturn: -40.951,
        totalGain: -4.0951,
        dailyDetails: [
          { day: 1, openPrice: 10, closePrice: 9, dailyGain: -1, dailyReturnPercent: -10 },
        ],
        keyMetrics: {
          doubleDays: null,
          tenXDays: null,
          breakEvenReturn: 0,
          annualizedReturn: -1000,
        },
      },
    };

    const saved = await calculationRepository.save(params, results);

    expect(saved.id).toBeDefined();
    expect(saved.params).toEqual(params);
    expect(saved.results).toEqual(results);
  });

  it("应该获取分页数据", async () => {
    const params = { initialPrice: 10, boardCount: 5, dailyReturn: 10 };
    const results = {
      up: { finalPrice: 16.1, totalReturn: 61, totalGain: 6.1, dailyDetails: [] },
      down: { finalPrice: 5.9, totalReturn: -41, totalGain: -4.1, dailyDetails: [] },
    };

    await calculationRepository.save(params, results);

    const result = await calculationRepository.getAll({ limit: 10, offset: 0 });

    expect(result.data.length).toBe(1);
    expect(result.pagination.totalCount).toBe(1);
    expect(result.pagination.currentPage).toBe(1);
    expect(result.pagination.pageSize).toBe(10);
  });

  it("应该正确返回分页信息", async () => {
    const params = { initialPrice: 10, boardCount: 5, dailyReturn: 10 };
    const results = {
      up: { finalPrice: 16.1, totalReturn: 61, totalGain: 6.1, dailyDetails: [] },
      down: { finalPrice: 5.9, totalReturn: -41, totalGain: -4.1, dailyDetails: [] },
    };

    for (let i = 0; i < 15; i++) {
      await calculationRepository.save({ ...params, initialPrice: 10 + i }, results);
    }

    const page1 = await calculationRepository.getAll({ limit: 10, offset: 0 });
    const page2 = await calculationRepository.getAll({ limit: 10, offset: 10 });

    expect(page1.pagination.totalCount).toBe(15);
    expect(page1.pagination.hasNext).toBe(true);
    expect(page1.pagination.hasPrev).toBe(false);

    expect(page2.pagination.totalCount).toBe(15);
    expect(page2.pagination.hasNext).toBe(false);
    expect(page2.pagination.hasPrev).toBe(true);
  });

  it("应该删除单条记录", async () => {
    const params = { initialPrice: 10, boardCount: 5, dailyReturn: 10 };
    const results = {
      up: { finalPrice: 16.1, totalReturn: 61, totalGain: 6.1, dailyDetails: [] },
      down: { finalPrice: 5.9, totalReturn: -41, totalGain: -4.1, dailyDetails: [] },
    };

    const saved = await calculationRepository.save(params, results);
    const deleted = await calculationRepository.delete(saved.id);

    expect(deleted).toBe(true);

    const result = await calculationRepository.getAll();
    expect(result.data).toHaveLength(0);
  });

  it("应该批量删除记录", async () => {
    const params = { initialPrice: 10, boardCount: 5, dailyReturn: 10 };
    const results = {
      up: { finalPrice: 16.1, totalReturn: 61, totalGain: 6.1, dailyDetails: [] },
      down: { finalPrice: 5.9, totalReturn: -41, totalGain: -4.1, dailyDetails: [] },
    };

    const saved1 = await calculationRepository.save(params, results);
    await calculationRepository.save({ ...params, initialPrice: 20 }, results);
    await calculationRepository.save({ ...params, initialPrice: 30 }, results);

    const count = await calculationRepository.deleteMany([saved1.id]);

    expect(count).toBe(1);

    const result = await calculationRepository.getAll();
    expect(result.data).toHaveLength(2);
  });

  it("应该清空所有记录", async () => {
    const params = { initialPrice: 10, boardCount: 5, dailyReturn: 10 };
    const results = {
      up: { finalPrice: 16.1, totalReturn: 61, totalGain: 6.1, dailyDetails: [] },
      down: { finalPrice: 5.9, totalReturn: -41, totalGain: -4.1, dailyDetails: [] },
    };

    await calculationRepository.save(params, results);
    await calculationRepository.save({ ...params, initialPrice: 20 }, results);

    await calculationRepository.clear();

    const result = await calculationRepository.getAll();
    expect(result.data).toHaveLength(0);
  });

  it("应该按时间戳倒序排序", async () => {
    const params = { initialPrice: 10, boardCount: 5, dailyReturn: 10 };
    const results = {
      up: { finalPrice: 16.1, totalReturn: 61, totalGain: 6.1, dailyDetails: [] },
      down: { finalPrice: 5.9, totalReturn: -41, totalGain: -4.1, dailyDetails: [] },
    };

    const first = await calculationRepository.save(params, results);
    await sleep(10);
    const second = await calculationRepository.save({ ...params, initialPrice: 20 }, results);
    await sleep(10);
    const third = await calculationRepository.save({ ...params, initialPrice: 30 }, results);

    const result = await calculationRepository.getAll();

    expect(result.data[0]?.id).toBe(third.id);
    expect(result.data[1]?.id).toBe(second.id);
    expect(result.data[2]?.id).toBe(first.id);
  });

  it("应该处理空ids数组", async () => {
    const count = await calculationRepository.deleteMany([]);
    expect(count).toBe(0);
  });
});
