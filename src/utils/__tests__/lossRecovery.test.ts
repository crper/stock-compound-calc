import { describe, expect, it } from "vite-plus/test";
import {
  calculateRecovery,
  formatRecoveryNumber,
  getDifficultyLevel,
  DifficultyLevel,
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
  describe("no loss (无需回本)", () => {
    it("should return 'noLoss' for 0% loss", () => {
      const result = getDifficultyLevel(0);

      expect(result.level).toBe(DifficultyLevel.NO_LOSS);
      expect(result.color).toBe("#52c41a");
      expect(result.bgColor).toBe("bg-green-50 dark:bg-green-900/20");
    });
  });

  describe("easy (容易)", () => {
    it("should return 'easy' for small losses", () => {
      const result5 = getDifficultyLevel(5);
      expect(result5.level).toBe(DifficultyLevel.EASY);
      expect(result5.color).toBe("#52c41a");

      const result9 = getDifficultyLevel(9);
      expect(result9.level).toBe(DifficultyLevel.EASY);
    });

    it("should not return 'easy' for 10% loss", () => {
      const result = getDifficultyLevel(10);
      expect(result.level).not.toBe(DifficultyLevel.EASY);
    });
  });

  describe("medium (中等)", () => {
    it("should return 'medium' for moderate losses", () => {
      const result10 = getDifficultyLevel(10);
      expect(result10.level).toBe(DifficultyLevel.MEDIUM);
      expect(result10.color).toBe("#1677ff");

      const result20 = getDifficultyLevel(20);
      expect(result20.level).toBe(DifficultyLevel.MEDIUM);

      const result24 = getDifficultyLevel(24);
      expect(result24.level).toBe(DifficultyLevel.MEDIUM);
    });

    it("should not return 'medium' for 25% loss", () => {
      const result = getDifficultyLevel(25);
      expect(result.level).not.toBe(DifficultyLevel.MEDIUM);
    });
  });

  describe("hard (困难)", () => {
    it("should return 'hard' for large losses", () => {
      const result25 = getDifficultyLevel(25);
      expect(result25.level).toBe(DifficultyLevel.HARD);
      expect(result25.color).toBe("#faad14");

      const result40 = getDifficultyLevel(40);
      expect(result40.level).toBe(DifficultyLevel.HARD);

      const result49 = getDifficultyLevel(49);
      expect(result49.level).toBe(DifficultyLevel.HARD);
    });

    it("should not return 'hard' for 50% loss", () => {
      const result = getDifficultyLevel(50);
      expect(result.level).not.toBe(DifficultyLevel.HARD);
    });
  });

  describe("very hard (非常难)", () => {
    it("should return 'veryHard' for very large losses", () => {
      const result50 = getDifficultyLevel(50);
      expect(result50.level).toBe(DifficultyLevel.VERY_HARD);
      expect(result50.color).toBe("#fa541c");

      const result60 = getDifficultyLevel(60);
      expect(result60.level).toBe(DifficultyLevel.VERY_HARD);

      const result74 = getDifficultyLevel(74);
      expect(result74.level).toBe(DifficultyLevel.VERY_HARD);
    });

    it("should not return 'veryHard' for 75% loss", () => {
      const result = getDifficultyLevel(75);
      expect(result.level).not.toBe(DifficultyLevel.VERY_HARD);
    });
  });

  describe("almost impossible (几乎不可能)", () => {
    it("should return 'almostImpossible' for extreme losses", () => {
      const result75 = getDifficultyLevel(75);
      expect(result75.level).toBe(DifficultyLevel.ALMOST_IMPOSSIBLE);
      expect(result75.color).toBe("#ff4d4f");

      const result90 = getDifficultyLevel(90);
      expect(result90.level).toBe(DifficultyLevel.ALMOST_IMPOSSIBLE);

      const result99 = getDifficultyLevel(99);
      expect(result99.level).toBe(DifficultyLevel.ALMOST_IMPOSSIBLE);
    });
  });

  describe("边界情况", () => {
    it("should handle boundary values correctly", () => {
      expect(getDifficultyLevel(0).level).toBe(DifficultyLevel.NO_LOSS);
      expect(getDifficultyLevel(0.01).level).toBe(DifficultyLevel.EASY);
      expect(getDifficultyLevel(9.99).level).toBe(DifficultyLevel.EASY);
      expect(getDifficultyLevel(10).level).toBe(DifficultyLevel.MEDIUM);
      expect(getDifficultyLevel(24.99).level).toBe(DifficultyLevel.MEDIUM);
      expect(getDifficultyLevel(25).level).toBe(DifficultyLevel.HARD);
      expect(getDifficultyLevel(49.99).level).toBe(DifficultyLevel.HARD);
      expect(getDifficultyLevel(50).level).toBe(DifficultyLevel.VERY_HARD);
      expect(getDifficultyLevel(74.99).level).toBe(DifficultyLevel.VERY_HARD);
      expect(getDifficultyLevel(75).level).toBe(DifficultyLevel.ALMOST_IMPOSSIBLE);
      expect(getDifficultyLevel(100).level).toBe(DifficultyLevel.ALMOST_IMPOSSIBLE);
    });
  });
});
