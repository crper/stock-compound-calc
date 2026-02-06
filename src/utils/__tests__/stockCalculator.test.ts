import { describe, it, expect } from "bun:test";
import {
  calculateStockReturns,
  calculateBidirectionalReturns,
  calculateKeyMetrics,
} from "../stockCalculator";
import type { CalculationParams } from "@/types";
import Decimal from "decimal.js";

Decimal.set({
  precision: 20,
  rounding: 4,
  toExpNeg: -9,
  toExpPos: 9,
});

describe("calculateStockReturns", () => {
  describe("涨停计算", () => {
    it("should calculate correct returns for 10% daily gain over 5 days", () => {
      const params: CalculationParams = {
        initialPrice: 10,
        boardCount: 5,
        dailyReturn: 10,
      };

      const result = calculateStockReturns(params);

      expect(result.finalPrice).toBeCloseTo(16.1051, 3);
      expect(result.totalReturn).toBeCloseTo(61.05, 2);
      expect(result.totalGain).toBeCloseTo(6.1051, 3);
      expect(result.details.length).toBe(5);
      expect(result.dailyDetails.length).toBe(5);
    });

    it("should calculate correct returns for 1 day", () => {
      const params: CalculationParams = {
        initialPrice: 100,
        boardCount: 1,
        dailyReturn: 10,
      };

      const result = calculateStockReturns(params);

      expect(result.finalPrice).toBe(110);
      expect(result.totalReturn).toBe(10);
      expect(result.totalGain).toBe(10);
    });

    it("should calculate small gain correctly", () => {
      const params: CalculationParams = {
        initialPrice: 100,
        boardCount: 3,
        dailyReturn: 1,
      };

      const result = calculateStockReturns(params);

      expect(result.totalReturn).toBeCloseTo(3.03, 2);
      expect(result.finalPrice).toBeCloseTo(103.03, 2);
    });
  });

  describe("跌停计算", () => {
    it("should calculate correct returns for -10% daily loss over 5 days", () => {
      const params: CalculationParams = {
        initialPrice: 10,
        boardCount: 5,
        dailyReturn: -10,
      };

      const result = calculateStockReturns(params);

      expect(result.finalPrice).toBeCloseTo(5.9049, 3);
      expect(result.totalReturn).toBeCloseTo(-40.95, 2);
      expect(result.totalGain).toBeCloseTo(-4.0951, 3);
    });

    it("should handle negative daily return correctly", () => {
      const params: CalculationParams = {
        initialPrice: 100,
        boardCount: 2,
        dailyReturn: -5,
      };

      const result = calculateStockReturns(params);

      expect(result.finalPrice).toBeCloseTo(90.25, 2);
      expect(result.totalReturn).toBeCloseTo(-9.75, 2);
    });
  });

  describe("持仓计算", () => {
    it("should calculate position value correctly", () => {
      const params: CalculationParams = {
        initialPrice: 10,
        boardCount: 5,
        dailyReturn: 10,
        stockQuantity: 1000,
      };

      const result = calculateStockReturns(params);

      expect(result.positionValue).toBeDefined();
      expect(result.positionValue?.initial).toBe(10000);
      expect(result.positionValue?.final).toBeCloseTo(16105.1, 1);
      expect(result.positionGain).toBeCloseTo(6105.1, 1);
    });

    it("should not calculate position value when stockQuantity is undefined", () => {
      const params: CalculationParams = {
        initialPrice: 10,
        boardCount: 5,
        dailyReturn: 10,
      };

      const result = calculateStockReturns(params);

      expect(result.positionValue).toBeUndefined();
      expect(result.positionGain).toBeUndefined();
    });
  });

  describe("边界情况", () => {
    it("should handle zero daily return", () => {
      const params: CalculationParams = {
        initialPrice: 100,
        boardCount: 5,
        dailyReturn: 0,
      };

      const result = calculateStockReturns(params);

      expect(result.finalPrice).toBe(100);
      expect(result.totalReturn).toBe(0);
      expect(result.totalGain).toBe(0);
    });

    it("should handle very small initial price", () => {
      const params: CalculationParams = {
        initialPrice: 0.01,
        boardCount: 5,
        dailyReturn: 10,
      };

      const result = calculateStockReturns(params);

      expect(result.finalPrice).toBeGreaterThan(0);
      expect(result.totalReturn).toBeGreaterThan(0);
    });

    it("should throw error for extreme board count", () => {
      const params: CalculationParams = {
        initialPrice: 100,
        boardCount: 3651,
        dailyReturn: 10,
      };

      expect(() => calculateStockReturns(params)).toThrow(/连板数量最多为3650天/);
    });

    it("should throw error for extreme daily return", () => {
      const params: CalculationParams = {
        initialPrice: 100,
        boardCount: 10,
        dailyReturn: 101,
      };

      expect(() => calculateStockReturns(params)).toThrow(/涨跌幅不能大于100%/);
    });

    it("should throw error if calculation results in invalid price", () => {
      // 极端情况下可能导致价格异常
      const params: CalculationParams = {
        initialPrice: 0.01,
        boardCount: 100,
        dailyReturn: -99,
      };

      expect(() => calculateStockReturns(params)).toThrow();
    });
  });

  describe("关键指标", () => {
    it("should calculate key metrics correctly", () => {
      const params: CalculationParams = {
        initialPrice: 10,
        boardCount: 5,
        dailyReturn: 10,
        stockQuantity: 1000,
      };

      const result = calculateStockReturns(params);

      expect(result.keyMetrics).toBeDefined();

      const keyMetrics = result.keyMetrics;
      expect(keyMetrics).toBeDefined();

      if (keyMetrics!.doubleDays) {
        expect(keyMetrics!.doubleDays).toBeGreaterThan(0);
      }

      if (keyMetrics!.tenXDays) {
        expect(keyMetrics!.tenXDays).toBeGreaterThan(0);
      }

      if (keyMetrics!.breakEvenReturn !== null) {
        expect(typeof keyMetrics!.breakEvenReturn).toBe("number");
      }

      if (keyMetrics!.annualizedReturn !== null) {
        expect(typeof keyMetrics!.annualizedReturn).toBe("number");
      }
    });
  });
});

describe("calculateBidirectionalReturns", () => {
  it("should calculate both up and down returns", () => {
    const params: CalculationParams = {
      initialPrice: 10,
      boardCount: 5,
      dailyReturn: 10,
    };

    const result = calculateBidirectionalReturns(params);

    expect(result.up).toBeDefined();
    expect(result.down).toBeDefined();
    expect(result.up.totalReturn).toBeGreaterThan(0);
    expect(result.down.totalReturn).toBeLessThan(0);
  });

  it("should calculate up returns using absolute daily return", () => {
    const params: CalculationParams = {
      initialPrice: 100,
      boardCount: 3,
      dailyReturn: -10,
    };

    const result = calculateBidirectionalReturns(params);

    // up result should use +10% (absolute value)
    expect(result.up.totalReturn).toBeCloseTo(33.1, 1);
    // down result should use -10% (normalized negative value)
    expect(result.down.totalReturn).toBeCloseTo(-27.1, 1);
  });
});

describe("calculateKeyMetrics", () => {
  it("should return null values when daily return is zero", () => {
    const params: CalculationParams = {
      initialPrice: 100,
      boardCount: 10,
      dailyReturn: 0,
    };

    const metrics = calculateKeyMetrics(params);

    expect(metrics.doubleDays).toBeNull();
    expect(metrics.tenXDays).toBeNull();
    expect(metrics.breakEvenReturn).toBe(0);
    expect(metrics.annualizedReturn).toBe(0);
  });

  it("should calculate double days correctly for 10% gain", () => {
    const params: CalculationParams = {
      initialPrice: 100,
      boardCount: 5,
      dailyReturn: 10,
    };

    const metrics = calculateKeyMetrics(params);

    // ln(2) / ln(1.1) ≈ 7.27 → 8 days
    expect(metrics.doubleDays).toBe(8);
  });

  it("should calculate break even return correctly", () => {
    const params: CalculationParams = {
      initialPrice: 100,
      boardCount: 1,
      dailyReturn: 10,
    };

    const metrics = calculateKeyMetrics(params);

    // final price is 110, need to go back to 100
    // (110 - 100) / 110 * 100 = 9.09%
    expect(metrics.breakEvenReturn).toBeCloseTo(9.09, 2);
  });

  it("should calculate break even return for loss scenario", () => {
    const params: CalculationParams = {
      initialPrice: 100,
      boardCount: 1,
      dailyReturn: -10,
    };

    const metrics = calculateKeyMetrics(params);

    // final price is 90, need to go back to 100
    // (90 - 100) / 90 * 100 = -11.11% (need 11.11% gain)
    expect(metrics.breakEvenReturn).toBeCloseTo(-11.11, 2);
  });

  it("should calculate annualized return correctly", () => {
    const params: CalculationParams = {
      initialPrice: 100,
      boardCount: 365,
      dailyReturn: 1,
    };

    const metrics = calculateKeyMetrics(params);

    // CAGR for 1% daily return over 365 days
    // (100 * 1.01^365 / 100)^(1/1) - 1 = 1.01^365 - 1 ≈ 3778%
    expect(metrics.annualizedReturn).toBeGreaterThan(3000);
  });

  it("should not calculate annualized return when board count is zero", () => {
    const params: CalculationParams = {
      initialPrice: 100,
      boardCount: 0,
      dailyReturn: 10,
    };

    const metrics = calculateKeyMetrics(params);

    expect(metrics.annualizedReturn).toBeNull();
  });
});
