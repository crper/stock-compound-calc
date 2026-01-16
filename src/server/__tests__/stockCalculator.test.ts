import { describe, it, expect } from "bun:test";
import {
  calculateBidirectionalReturns,
  calculateStockReturns,
  calculateKeyMetrics,
} from "../stockCalculator";
import type { CalculationParams } from "@/shared/types";

describe("Stock Calculator", () => {
  describe("calculateStockReturns", () => {
    it("should calculate single day correctly with 10% increase", () => {
      const params: CalculationParams = {
        initialPrice: 10,
        boardCount: 1,
        dailyReturn: 10,
      };

      const result = calculateStockReturns(params);

      expect(result.finalPrice).toBeCloseTo(11, 2);
      expect(result.totalReturn).toBeCloseTo(10, 2);
      expect(result.totalGain).toBeCloseTo(1, 2);
      expect(result.dailyDetails).toHaveLength(1);
      expect(result.dailyDetails[0]!.day).toBe(1);
      expect(result.dailyDetails[0]!.openPrice).toBe(10);
      expect(result.dailyDetails[0]!.closePrice).toBeCloseTo(11, 2);
    });

    it("should calculate multiple days correctly", () => {
      const params: CalculationParams = {
        initialPrice: 10,
        boardCount: 3,
        dailyReturn: 10,
      };

      const result = calculateStockReturns(params);

      expect(result.finalPrice).toBeCloseTo(13.31, 2);
      expect(result.totalReturn).toBeCloseTo(33.1, 2);
      expect(result.dailyDetails).toHaveLength(3);
      expect(result.dailyDetails[0]!.closePrice).toBeCloseTo(11, 2);
      expect(result.dailyDetails[1]!.closePrice).toBeCloseTo(12.1, 2);
      expect(result.dailyDetails[2]!.closePrice).toBeCloseTo(13.31, 2);
    });

    it("should handle 20% daily return", () => {
      const params: CalculationParams = {
        initialPrice: 10,
        boardCount: 2,
        dailyReturn: 20,
      };

      const result = calculateStockReturns(params);

      expect(result.finalPrice).toBeCloseTo(14.4, 2);
      expect(result.totalReturn).toBeCloseTo(44, 2);
    });

    it("should handle 30% daily return", () => {
      const params: CalculationParams = {
        initialPrice: 10,
        boardCount: 2,
        dailyReturn: 30,
      };

      const result = calculateStockReturns(params);

      expect(result.finalPrice).toBeCloseTo(16.9, 2);
      expect(result.totalReturn).toBeCloseTo(69, 2);
    });

    it("should generate correct details array", () => {
      const params: CalculationParams = {
        initialPrice: 10,
        boardCount: 2,
        dailyReturn: 10,
      };

      const result = calculateStockReturns(params);

      expect(result.details).toHaveLength(2);
      expect(result.details[0]!).toContain("第 1 天");
      expect(result.details[1]!).toContain("第 2 天");
    });
  });

  describe("calculateBidirectionalReturns", () => {
    it("should calculate both up and down directions", () => {
      const params: CalculationParams = {
        initialPrice: 10,
        boardCount: 2,
        dailyReturn: 10,
      };

      const results = calculateBidirectionalReturns(params);

      expect(results.up.finalPrice).toBeCloseTo(12.1, 2);
      expect(results.up.totalReturn).toBeGreaterThan(0);
      expect(results.down.finalPrice).toBeCloseTo(8.1, 2);
      expect(results.down.totalReturn).toBeLessThan(0);
    });

    it("should handle negative daily return for up direction", () => {
      const params: CalculationParams = {
        initialPrice: 10,
        boardCount: 1,
        dailyReturn: -10,
      };

      const results = calculateBidirectionalReturns(params);

      expect(results.up.finalPrice).toBeCloseTo(11, 2);
      expect(results.down.finalPrice).toBeCloseTo(9, 2);
    });
  });

  describe("edge cases", () => {
    it("should handle minimum initial price", () => {
      const params: CalculationParams = {
        initialPrice: 0.01,
        boardCount: 1,
        dailyReturn: 10,
      };

      const result = calculateStockReturns(params);

      expect(result.finalPrice).toBeCloseTo(0.011, 3);
      expect(result.finalPrice).toBeGreaterThan(0);
    });

    it("should handle maximum board count", () => {
      const params: CalculationParams = {
        initialPrice: 10,
        boardCount: 365,
        dailyReturn: 1,
      };

      const result = calculateStockReturns(params);

      expect(result.finalPrice).toBeGreaterThan(0);
      expect(result.dailyDetails).toHaveLength(365);
    });

    it("should handle small daily return", () => {
      const params: CalculationParams = {
        initialPrice: 100,
        boardCount: 10,
        dailyReturn: 1,
      };

      const result = calculateStockReturns(params);

      expect(result.finalPrice).toBeCloseTo(110.46, 2);
    });

    it("should handle large initial price", () => {
      const params: CalculationParams = {
        initialPrice: 99999.99,
        boardCount: 1,
        dailyReturn: 10,
      };

      const result = calculateStockReturns(params);

      expect(result.finalPrice).toBeCloseTo(109999.99, 2);
      expect(result.finalPrice).toBeLessThan(1000000);
    });

    it("should include keyMetrics in result", () => {
      const params: CalculationParams = {
        initialPrice: 10,
        boardCount: 5,
        dailyReturn: 10,
      };

      const result = calculateStockReturns(params);

      expect(result.keyMetrics).toBeDefined();
      expect(result.keyMetrics?.doubleDays).toBeGreaterThan(0);
      expect(result.keyMetrics?.tenXDays).toBeGreaterThan(0);
      expect(result.keyMetrics?.breakEvenReturn).toBeDefined();
    });
  });

  describe("calculateKeyMetrics", () => {
    it("should calculate double days correctly for 10% daily return", () => {
      const params: CalculationParams = {
        initialPrice: 10,
        boardCount: 1,
        dailyReturn: 10,
      };

      const metrics = calculateKeyMetrics(params);

      expect(metrics.doubleDays).toBeCloseTo(8, 0);
      expect(metrics.tenXDays).toBeCloseTo(25, 0);
    });

    it("should calculate break even return correctly", () => {
      const params: CalculationParams = {
        initialPrice: 10,
        boardCount: 1,
        dailyReturn: 10,
      };

      const metrics = calculateKeyMetrics(params);

      expect(metrics.breakEvenReturn).toBeCloseTo(9.09, 2);
    });

    it("should handle zero daily return", () => {
      const params: CalculationParams = {
        initialPrice: 10,
        boardCount: 1,
        dailyReturn: 0,
      };

      const metrics = calculateKeyMetrics(params);

      expect(metrics.doubleDays).toBeNull();
      expect(metrics.tenXDays).toBeNull();
      expect(metrics.breakEvenReturn).toBe(0);
      expect(metrics.annualizedReturn).toBe(0);
    });

    it("should handle negative daily return", () => {
      const params: CalculationParams = {
        initialPrice: 10,
        boardCount: 1,
        dailyReturn: -10,
      };

      const metrics = calculateKeyMetrics(params);

      expect(metrics.doubleDays).toBeNull();
      expect(metrics.tenXDays).toBeNull();
      expect(metrics.breakEvenReturn).toBeCloseTo(-11.11, 2);
    });

    it("should calculate double days for 20% daily return", () => {
      const params: CalculationParams = {
        initialPrice: 10,
        boardCount: 1,
        dailyReturn: 20,
      };

      const metrics = calculateKeyMetrics(params);

      expect(metrics.doubleDays).toBeCloseTo(4, 0);
      expect(metrics.tenXDays).toBeCloseTo(13, 0);
    });

    it("should calculate double days for 30% daily return", () => {
      const params: CalculationParams = {
        initialPrice: 10,
        boardCount: 1,
        dailyReturn: 30,
      };

      const metrics = calculateKeyMetrics(params);

      expect(metrics.doubleDays).toBeCloseTo(3, 0);
      expect(metrics.tenXDays).toBeCloseTo(9, 0);
    });

    it("should calculate break even return correctly for large initial price", () => {
      const params: CalculationParams = {
        initialPrice: 100,
        boardCount: 1,
        dailyReturn: 10,
      };

      const metrics = calculateKeyMetrics(params);

      expect(metrics.breakEvenReturn).toBeCloseTo(9.09, 2);
    });
  });
});
