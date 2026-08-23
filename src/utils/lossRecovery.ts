/**
 * 亏损回本计算工具函数
 * 提供统一的亏损回本计算、格式化和难度判断逻辑
 */
import Decimal from "decimal.js";

export interface RecoveryMetrics {
  lossPercent: number;
  requiredGain: Decimal;
  multiplier: Decimal;
  isInfinity: boolean;
}

export enum DifficultyLevel {
  NO_LOSS = "noLoss",
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
  VERY_HARD = "veryHard",
  ALMOST_IMPOSSIBLE = "almostImpossible",
}

export interface DifficultyInfo {
  level: DifficultyLevel;
  color: string;
  bgColor: string;
}

export function calculateRecovery(lossPercent: number): RecoveryMetrics {
  const lossDecimal = new Decimal(lossPercent).div(100);

  if (lossPercent >= 100) {
    return {
      lossPercent,
      requiredGain: new Decimal(Infinity),
      multiplier: new Decimal(Infinity),
      isInfinity: true,
    };
  }

  return {
    lossPercent,
    requiredGain: lossDecimal.div(new Decimal(1).minus(lossDecimal)).mul(100),
    multiplier: new Decimal(1).div(new Decimal(1).minus(lossDecimal)),
    isInfinity: false,
  };
}

export function formatRecoveryNumber(
  value: Decimal,
  options?: { useScientific?: boolean },
): string {
  if (!value.isFinite()) return "∞";
  if (options?.useScientific && value.greaterThan(1000)) {
    return value.toExponential(2);
  }
  return value.toFixed(2);
}

export function getDifficultyLevel(lossPercent: number): DifficultyInfo {
  if (lossPercent === 0) {
    return {
      level: DifficultyLevel.NO_LOSS,
      color: "#52c41a",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    };
  }
  if (lossPercent < 10) {
    return {
      level: DifficultyLevel.EASY,
      color: "#52c41a",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    };
  }
  if (lossPercent < 25) {
    return {
      level: DifficultyLevel.MEDIUM,
      color: "#1677ff",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    };
  }
  if (lossPercent < 50) {
    return {
      level: DifficultyLevel.HARD,
      color: "#faad14",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    };
  }
  if (lossPercent < 75) {
    return {
      level: DifficultyLevel.VERY_HARD,
      color: "#fa541c",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
    };
  }
  return {
    level: DifficultyLevel.ALMOST_IMPOSSIBLE,
    color: "#ff4d4f",
    bgColor: "bg-red-50 dark:bg-red-900/20",
  };
}

export function isValidLossPercent(value: unknown): value is number {
  return typeof value === "number" && value >= 0 && value <= 100;
}
