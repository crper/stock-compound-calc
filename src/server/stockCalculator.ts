import Decimal from "decimal.js";
import type { DailyDetail, CalculationResult, CalculationParams } from "@/shared/types";
import { validateCalculationParams as validateParams } from "@/shared/utils/validator";
import { ErrorHandler, ErrorFactory } from "@/shared/utils/errorHandler";
import { DECIMAL_CONFIG } from "@/shared/constants";

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
    // 使用统一验证
    validateParams(params);
  } catch (error) {
    throw ErrorHandler.handleUnknown(error);
  }

  const { initialPrice, boardCount, dailyReturn } = params;

  // 使用Decimal进行高精度计算
  let currentPriceDecimal = new Decimal(initialPrice);
  const initialPriceDecimal = new Decimal(initialPrice);
  const dailyReturnDecimal = new Decimal(dailyReturn).div(100);

  const details: string[] = [];
  const dailyDetails: DailyDetail[] = [];

  for (let i = 1; i <= boardCount; i++) {
    const previousPriceDecimal = currentPriceDecimal;

    // 高精度计算：currentPrice = currentPrice * (1 + dailyReturn / 100)
    const multiplier = new Decimal(1).plus(dailyReturnDecimal);
    currentPriceDecimal = currentPriceDecimal.mul(multiplier);

    const dailyGainDecimal = currentPriceDecimal.minus(previousPriceDecimal);
    const dailyReturnPercentDecimal = dailyGainDecimal.div(previousPriceDecimal).mul(100);

    // 转换为Number用于显示（保留足够精度）
    const previousPrice = Number(previousPriceDecimal.toString());
    const currentPrice = Number(currentPriceDecimal.toString());
    const dailyGain = Number(dailyGainDecimal.toString());
    const dailyReturnPercent = Number(dailyReturnPercentDecimal.toString());

    // 检查计算结果是否有效
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

  // 转换为Number用于返回
  const finalPrice = Number(currentPriceDecimal.toString());
  const totalGain = Number(totalGainDecimal.toString());
  const totalReturn = Number(totalReturnDecimal.toString());

  // 最终验证
  if (!isFinite(finalPrice) || finalPrice <= 0) {
    throw ErrorFactory.calculation("计算结果异常，请检查输入参数", { finalPrice, params });
  }

  return {
    finalPrice,
    totalReturn,
    totalGain,
    details,
    dailyDetails,
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
