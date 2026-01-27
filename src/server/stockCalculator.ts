import Decimal from "decimal.js";
import type { DailyDetail, CalculationResult, CalculationParams } from "@/shared/types";
import { validateCalculationParams as validateParams } from "@/shared/utils/validator";
import { ErrorHandler, ErrorFactory } from "@/shared/utils/errorHandler";
import { DECIMAL_CONFIG } from "@/shared/constants";

export interface KeyMetrics {
  doubleDays: number | null;
  tenXDays: number | null;
  breakEvenReturn: number | null;
  annualizedReturn: number | null;
}

// 配置Decimal全局精度
Decimal.set({
  precision: DECIMAL_CONFIG.PRECISION,
  rounding: DECIMAL_CONFIG.ROUNDING,
  toExpNeg: DECIMAL_CONFIG.TO_EXP_NEG,
  toExpPos: DECIMAL_CONFIG.TO_EXP_POS,
});

/**
 * 计算股价收益
 */
export const calculateStockReturns = (params: CalculationParams): CalculationResult => {
  try {
    validateParams(params);
  } catch (error) {
    throw ErrorHandler.handleUnknown(error);
  }

  const { initialPrice, boardCount, dailyReturn } = params;

  // 对极端值进行早期检测，避免过度计算
  if (boardCount > 3650) { // 限制最大计算天数为10年
    throw ErrorFactory.validation("连板天数不能超过3650天(约10年)，请减少天数以提高性能", "boardCount", boardCount);
  }

  if (Math.abs(dailyReturn) > 100) {  // 每日涨跌幅不能超过100%
    throw ErrorFactory.validation("每日涨跌幅不能超过100%", "dailyReturn", dailyReturn);
  }

  // 预测最终价格是否会超出合理范围
  if (boardCount > 0 && Math.abs(dailyReturn) > 10) {
    const dailyMultiplier = new Decimal(dailyReturn).div(100).plus(1);
    const finalMultiplier = dailyMultiplier.pow(boardCount);
    const estimatedFinalPrice = new Decimal(initialPrice).mul(finalMultiplier);

    // 如果预计价格过大（超过1万亿），拒绝计算
    if (estimatedFinalPrice.gt(1e12)) {
      throw ErrorFactory.validation(`计算会导致价格过高(${estimatedFinalPrice.toString()}元)，请调整参数`, "dailyReturn", dailyReturn);
    }
  }

  let currentPriceDecimal = new Decimal(initialPrice);
  const initialPriceDecimal = new Decimal(initialPrice);
  const dailyReturnDecimal = new Decimal(dailyReturn).div(100);

  const details: string[] = [];
  const dailyDetails: DailyDetail[] = [];

  for (let i = 1; i <= boardCount; i++) {
    const previousPriceDecimal = currentPriceDecimal;

    const multiplier = new Decimal(1).plus(dailyReturnDecimal);
    currentPriceDecimal = currentPriceDecimal.mul(multiplier);

    const dailyGainDecimal = currentPriceDecimal.minus(previousPriceDecimal);
    const dailyReturnPercentDecimal = dailyGainDecimal.div(previousPriceDecimal).mul(100);

    const previousPrice = Number(previousPriceDecimal.toString());
    const currentPrice = Number(currentPriceDecimal.toString());
    const dailyGain = Number(dailyGainDecimal.toString());
    const dailyReturnPercent = Number(dailyReturnPercentDecimal.toString());

    if (!isFinite(currentPrice) || currentPrice <= 0) {
      throw ErrorFactory.calculation(`第${i}天计算结果异常，请检查输入参数`, {
        day: i,
        currentPrice,
        params,
      });
    }

    details.push(
      `第 ${i} 天: ${previousPrice.toFixed(2)} → ${currentPrice.toFixed(2)} (${dailyReturn > 0 ? "+" : ""}${dailyGain.toFixed(2)}, ${dailyReturnPercent.toFixed(2)}%)`,
    );

    dailyDetails.push({
      day: i,
      openPrice: previousPrice,
      closePrice: currentPrice,
      dailyGain,
      dailyReturnPercent,
    });
  }

  const totalGainDecimal = currentPriceDecimal.minus(initialPriceDecimal);
  const totalReturnDecimal = totalGainDecimal.div(initialPriceDecimal).mul(100);

  const finalPrice = Number(currentPriceDecimal.toString());
  const totalGain = Number(totalGainDecimal.toString());
  const totalReturn = Number(totalReturnDecimal.toString());

  if (!isFinite(finalPrice) || finalPrice <= 0) {
    throw ErrorFactory.calculation("计算结果异常，请检查输入参数", { finalPrice, params });
  }

  const keyMetrics = calculateKeyMetrics({
    initialPrice,
    boardCount,  // 使用实际的 boardCount 而不是固定的 1
    dailyReturn,
  });

  return {
    finalPrice,
    totalReturn,
    totalGain,
    details,
    dailyDetails,
    keyMetrics,
  };
};

/**
 * 计算双向收益（涨停和跌停）
 */
export const calculateBidirectionalReturns = (params: CalculationParams) => {
  const { dailyReturn } = params;

  const upResult = calculateStockReturns({
    ...params,
    dailyReturn: Math.abs(dailyReturn),
  });

  const downResult = calculateStockReturns({
    ...params,
    dailyReturn: -Math.abs(dailyReturn),
  });

  return {
    up: upResult,
    down: downResult,
  };
};

/**
 * 计算关键指标
 */
export const calculateKeyMetrics = (params: CalculationParams): KeyMetrics => {
  const { initialPrice, dailyReturn, boardCount } = params;

  // 只创建一次必要的Decimal对象
  const dailyReturnDecimal = new Decimal(dailyReturn).div(100);
  const multiplier = new Decimal(1).plus(dailyReturnDecimal);
  const initialPriceDecimal = new Decimal(initialPrice);

  if (dailyReturn === 0) {
    return {
      doubleDays: null,
      tenXDays: null,
      breakEvenReturn: 0,
      annualizedReturn: 0,
    };
  }

  let doubleDays: number | null = null;
  let tenXDays: number | null = null;

  if (dailyReturn > 0) {
    const doublePrice = initialPriceDecimal.mul(2);
    const tenXPrice = initialPriceDecimal.mul(10);

    // 避免重复创建Decimal对象，提前转换为数字
    const logDoubleRatio = Number(doublePrice.div(initialPriceDecimal).toString());
    const logTenRatio = Number(tenXPrice.div(initialPriceDecimal).toString());
    const multiplierValue = Number(multiplier.toString());

    doubleDays = Math.ceil(Math.log(logDoubleRatio) / Math.log(multiplierValue));
    tenXDays = Math.ceil(Math.log(logTenRatio) / Math.log(multiplierValue));
  }

  const currentPriceDecimal = initialPriceDecimal.mul(multiplier.pow(boardCount));
  const finalPrice = Number(currentPriceDecimal.toString());

  let breakEvenReturn: number | null = null;
  if (finalPrice !== 0) {
    const breakEvenDecimal = new Decimal(finalPrice).minus(initialPrice).div(finalPrice).mul(100);
    breakEvenReturn = Number(breakEvenDecimal.toString());
  }

  return {
    doubleDays,
    tenXDays,
    breakEvenReturn,
    annualizedReturn: null,
  };
};
