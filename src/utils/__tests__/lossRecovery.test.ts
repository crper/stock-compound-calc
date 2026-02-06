import { describe, it, expect } from "bun:test";
import {
  calculateRecovery,
  formatRecoveryNumber,
  getDifficultyLevel,
  isValidLossPercent,
} from "../lossRecovery";
import Decimal from "decimal.js";

Decimal.set({
  precision: 20,
  rounding: 4,
  toExpNeg: -9,
  toExpPos: 9,
});

describe("calculateRecovery", () => {
  describe("正常亏损计算", () => {
    it("should calculate 10% loss correctly", () => {
      const result = calculateRecovery(10);

      expect(result.lossPercent).toBe(10);
      expect(result.requiredGain.toNumber()).toBeCloseTo(11.11, 2);
      expect(result.multiplier.toNumber()).toBeCloseTo(1.11, 2);
      expect(result.isInfinity).toBe(false);
    });

    it("should calculate 50% loss correctly", () => {
      const result = calculateRecovery(50);

      expect(result.lossPercent).toBe(50);
      expect(result.requiredGain.toNumber()).toBe(100);
      expect(result.multiplier.toNumber()).toBe(2);
      expect(result.isInfinity).toBe(false);
    });

    it("should calculate 25% loss correctly", () => {
      const result = calculateRecovery(25);

      expect(result.lossPercent).toBe(25);
      expect(result.requiredGain.toNumber()).toBeCloseTo(33.33, 2);
      expect(result.multiplier.toNumber()).toBeCloseTo(1.33, 2);
      expect(result.isInfinity).toBe(false);
    });

    it("should calculate 0% loss correctly", () => {
      const result = calculateRecovery(0);

      expect(result.lossPercent).toBe(0);
      expect(result.requiredGain.toNumber()).toBe(0);
      expect(result.multiplier.toNumber()).toBe(1);
      expect(result.isInfinity).toBe(false);
    });

    it("should calculate 99.9% loss correctly", () => {
      const result = calculateRecovery(99.9);

      expect(result.lossPercent).toBe(99.9);
      expect(result.requiredGain.toNumber()).toBeCloseTo(99900, 0);
      expect(result.isInfinity).toBe(false);
    });
  });

  describe("极端情况", () => {
    it("should handle 100% loss as infinity", () => {
      const result = calculateRecovery(100);

      expect(result.lossPercent).toBe(100);
      expect(result.requiredGain.isFinite()).toBe(false);
      expect(result.multiplier.isFinite()).toBe(false);
      expect(result.isInfinity).toBe(true);
    });

    it("should handle >100% loss as infinity", () => {
      const result = calculateRecovery(150);

      expect(result.lossPercent).toBe(150);
      expect(result.requiredGain.isFinite()).toBe(false);
      expect(result.multiplier.isFinite()).toBe(false);
      expect(result.isInfinity).toBe(true);
    });

    it("should handle small loss values correctly", () => {
      const result = calculateRecovery(0.01);

      expect(result.lossPercent).toBe(0.01);
      expect(result.requiredGain.toNumber()).toBeCloseTo(0.01, 2);
      expect(result.isInfinity).toBe(false);
    });

    it("should handle decimal loss values correctly", () => {
      const result = calculateRecovery(33.33);

      expect(result.lossPercent).toBe(33.33);
      expect(result.requiredGain.toNumber()).toBeCloseTo(50, 0);
      expect(result.isInfinity).toBe(false);
    });
  });

  describe("回本难度等级", () => {
    it("should classify 0% loss as easy", () => {
      const result = calculateRecovery(0);
      expect(result.isInfinity).toBe(false);
    });

    it("should classify small loss as manageable", () => {
      const result1 = calculateRecovery(5);
      expect(result1.multiplier.toNumber()).toBeLessThan(1.1);

      const result2 = calculateRecovery(15);
      expect(result2.multiplier.toNumber()).toBeLessThan(1.2);
    });

    it("should classify large loss as difficult", () => {
      const result1 = calculateRecovery(60);
      expect(result1.multiplier.toNumber()).toBeGreaterThan(2);

      const result2 = calculateRecovery(80);
      expect(result2.multiplier.toNumber()).toBeGreaterThan(4);
    });
  });
});

describe("formatRecoveryNumber", () => {
  describe("正常数值格式化", () => {
    it("should format small numbers correctly", () => {
      const value = new Decimal(11.11);
      const result = formatRecoveryNumber(value);

      expect(result).toBe("11.11");
    });

    it("should format large numbers correctly", () => {
      const value = new Decimal(100);
      const result = formatRecoveryNumber(value);

      expect(result).toBe("100.00");
    });

    it("should format decimal numbers correctly", () => {
      const value = new Decimal(33.333333);
      const result = formatRecoveryNumber(value);

      expect(result).toBe("33.33");
    });
  });

  describe("科学计数法格式化", () => {
    it("should format very large numbers in scientific notation", () => {
      const value = new Decimal(99900);
      const result = formatRecoveryNumber(value, { useScientific: true });

      expect(result).toContain("e+");
    });

    it("should format extremely large numbers in scientific notation", () => {
      const value = new Decimal(99900000);
      const result = formatRecoveryNumber(value, { useScientific: true });

      expect(result).toContain("e+");
    });

    it("should not use scientific notation for medium numbers", () => {
      const value = new Decimal(500);
      const result = formatRecoveryNumber(value, { useScientific: true });

      expect(result).toBe("500.00");
    });
  });

  describe("特殊值处理", () => {
    it("should format infinity correctly", () => {
      const value = new Decimal(Infinity);
      const result = formatRecoveryNumber(value);

      expect(result).toBe("∞");
    });

    it("should format negative infinity correctly", () => {
      const value = new Decimal(-Infinity);
      const result = formatRecoveryNumber(value);

      expect(result).toBe("∞");
    });
  });
});

describe("getDifficultyLevel", () => {
  describe("无需回本", () => {
    it("should return '无需回本' for 0% loss", () => {
      const result = getDifficultyLevel(0);

      expect(result.text).toBe("无需回本");
      expect(result.color).toBe("#52c41a");
      expect(result.bgColor).toBe("bg-green-50 dark:bg-green-900/20");
    });
  });

  describe("容易", () => {
    it("should return '容易' for small losses", () => {
      const result5 = getDifficultyLevel(5);
      expect(result5.text).toBe("容易");
      expect(result5.color).toBe("#52c41a");

      const result9 = getDifficultyLevel(9);
      expect(result9.text).toBe("容易");
    });

    it("should not return '容易' for 10% loss", () => {
      const result = getDifficultyLevel(10);
      expect(result.text).not.toBe("容易");
    });
  });

  describe("中等", () => {
    it("should return '中等' for moderate losses", () => {
      const result10 = getDifficultyLevel(10);
      expect(result10.text).toBe("中等");
      expect(result10.color).toBe("#1677ff");

      const result20 = getDifficultyLevel(20);
      expect(result20.text).toBe("中等");

      const result24 = getDifficultyLevel(24);
      expect(result24.text).toBe("中等");
    });

    it("should not return '中等' for 25% loss", () => {
      const result = getDifficultyLevel(25);
      expect(result.text).not.toBe("中等");
    });
  });

  describe("困难", () => {
    it("should return '困难' for high losses", () => {
      const result25 = getDifficultyLevel(25);
      expect(result25.text).toBe("困难");
      expect(result25.color).toBe("#faad14");

      const result40 = getDifficultyLevel(40);
      expect(result40.text).toBe("困难");

      const result49 = getDifficultyLevel(49);
      expect(result49.text).toBe("困难");
    });

    it("should not return '困难' for 50% loss", () => {
      const result = getDifficultyLevel(50);
      expect(result.text).not.toBe("困难");
    });
  });

  describe("非常难", () => {
    it("should return '非常难' for very high losses", () => {
      const result50 = getDifficultyLevel(50);
      expect(result50.text).toBe("非常难");
      expect(result50.color).toBe("#fa541c");

      const result60 = getDifficultyLevel(60);
      expect(result60.text).toBe("非常难");

      const result74 = getDifficultyLevel(74);
      expect(result74.text).toBe("非常难");
    });

    it("should not return '非常难' for 75% loss", () => {
      const result = getDifficultyLevel(75);
      expect(result.text).not.toBe("非常难");
    });
  });

  describe("几乎不可能", () => {
    it("should return '几乎不可能' for extreme losses", () => {
      const result75 = getDifficultyLevel(75);
      expect(result75.text).toBe("几乎不可能");
      expect(result75.color).toBe("#ff4d4f");

      const result90 = getDifficultyLevel(90);
      expect(result90.text).toBe("几乎不可能");

      const result99 = getDifficultyLevel(99);
      expect(result99.text).toBe("几乎不可能");
    });
  });

  describe("边界情况", () => {
    it("should handle boundary values correctly", () => {
      expect(getDifficultyLevel(0).text).toBe("无需回本");
      expect(getDifficultyLevel(0.01).text).toBe("容易");
      expect(getDifficultyLevel(9.99).text).toBe("容易");
      expect(getDifficultyLevel(10).text).toBe("中等");
      expect(getDifficultyLevel(24.99).text).toBe("中等");
      expect(getDifficultyLevel(25).text).toBe("困难");
      expect(getDifficultyLevel(49.99).text).toBe("困难");
      expect(getDifficultyLevel(50).text).toBe("非常难");
      expect(getDifficultyLevel(74.99).text).toBe("非常难");
      expect(getDifficultyLevel(75).text).toBe("几乎不可能");
      expect(getDifficultyLevel(100).text).toBe("几乎不可能");
    });
  });
});

describe("isValidLossPercent", () => {
  describe("有效值", () => {
    it("should return true for 0% loss", () => {
      expect(isValidLossPercent(0)).toBe(true);
    });

    it("should return true for 50% loss", () => {
      expect(isValidLossPercent(50)).toBe(true);
    });

    it("should return true for 100% loss", () => {
      expect(isValidLossPercent(100)).toBe(true);
    });

    it("should return true for decimal values", () => {
      expect(isValidLossPercent(33.33)).toBe(true);
      expect(isValidLossPercent(0.01)).toBe(true);
      expect(isValidLossPercent(99.99)).toBe(true);
    });

    it("should return true for very small values", () => {
      expect(isValidLossPercent(0.001)).toBe(true);
    });
  });

  describe("无效值", () => {
    it("should return false for negative values", () => {
      expect(isValidLossPercent(-1)).toBe(false);
      expect(isValidLossPercent(-10)).toBe(false);
      expect(isValidLossPercent(-0.01)).toBe(false);
    });

    it("should return false for values greater than 100", () => {
      expect(isValidLossPercent(101)).toBe(false);
      expect(isValidLossPercent(150)).toBe(false);
      expect(isValidLossPercent(100.01)).toBe(false);
    });

    it("should return false for non-number types", () => {
      expect(isValidLossPercent("50" as unknown)).toBe(false);
      expect(isValidLossPercent(null as unknown)).toBe(false);
      expect(isValidLossPercent(undefined as unknown)).toBe(false);
      expect(isValidLossPercent({} as unknown)).toBe(false);
    });

    it("should return false for NaN", () => {
      expect(isValidLossPercent(NaN)).toBe(false);
    });

    it("should return false for Infinity", () => {
      expect(isValidLossPercent(Infinity)).toBe(false);
      expect(isValidLossPercent(-Infinity)).toBe(false);
    });
  });

  describe("类型守卫", () => {
    it("should narrow type correctly", () => {
      const value: unknown = 50;

      if (isValidLossPercent(value)) {
        // TypeScript should know value is number here
        expect(value).toBe(50);
        expect(typeof value).toBe("number");
      }
    });

    it("should not narrow type for invalid values", () => {
      const value: unknown = "50";

      if (isValidLossPercent(value)) {
        // This should not happen for invalid values
        expect.unreachable();
      }
    });
  });
});
