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

export interface DifficultyLevel {
  text: string;
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

export function formatRecoveryNumber(value: Decimal, options?: { useScientific?: boolean }): string {
  if (!value.isFinite()) return "∞";
  if (options?.useScientific && value.greaterThan(1000)) {
    return value.toExponential(2);
  }
  return value.toFixed(2);
}

export function getDifficultyLevel(lossPercent: number): DifficultyLevel {
  if (lossPercent === 0) {
    return { text: "无需回本", color: "#52c41a", bgColor: "bg-green-50 dark:bg-green-900/20" };
  }
  if (lossPercent < 10) {
    return { text: "容易", color: "#52c41a", bgColor: "bg-green-50 dark:bg-green-900/20" };
  }
  if (lossPercent < 25) {
    return { text: "中等", color: "#1677ff", bgColor: "bg-blue-50 dark:bg-blue-900/20" };
  }
  if (lossPercent < 50) {
    return { text: "困难", color: "#faad14", bgColor: "bg-yellow-50 dark:bg-yellow-900/20" };
  }
  if (lossPercent < 75) {
    return { text: "非常难", color: "#fa541c", bgColor: "bg-orange-50 dark:bg-orange-900/20" };
  }
  return { text: "几乎不可能", color: "#ff4d4f", bgColor: "bg-red-50 dark:bg-red-900/20" };
}

export function isValidLossPercent(value: unknown): value is number {
  return typeof value === "number" && value >= 0 && value <= 100;
}
