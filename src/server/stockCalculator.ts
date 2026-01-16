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
    boardCount: 1,
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

  const dailyReturnDecimal = new Decimal(dailyReturn).div(100);
  const multiplier = new Decimal(1).plus(dailyReturnDecimal);

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
    const initialPriceDecimal = new Decimal(initialPrice);

    const doublePrice = initialPriceDecimal.mul(2);
    const tenXPrice = initialPriceDecimal.mul(10);

    doubleDays = Math.ceil(
      Math.log(Number(doublePrice.div(initialPriceDecimal).toString())) /
        Math.log(Number(multiplier.toString())),
    );

    tenXDays = Math.ceil(
      Math.log(Number(tenXPrice.div(initialPriceDecimal).toString())) /
        Math.log(Number(multiplier.toString())),
    );
  }

  const initialPriceDecimal = new Decimal(initialPrice);
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
