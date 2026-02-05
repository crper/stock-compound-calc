import { CALCULATION_LIMITS } from "@/constants";
import type { CalculationParams, CalculationResult, DailyDetail, KeyMetrics } from "@/types";
import { ErrorFactory, ErrorHandler } from "@/utils/errorHandler";
import { validateCalculationParams as validateParams } from "@/utils/validator";
import Decimal from "decimal.js";

// 导入Decimal配置（在应用入口统一配置）

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
  if (boardCount > CALCULATION_LIMITS.MAX_BOARD_COUNT) {
    throw ErrorFactory.validation(
      `连板天数不能超过${CALCULATION_LIMITS.MAX_BOARD_COUNT}天(约10年)，请减少天数以提高性能`,
      "boardCount",
      boardCount,
    );
  }

  if (Math.abs(dailyReturn) > CALCULATION_LIMITS.MAX_DAILY_RETURN) {
    throw ErrorFactory.validation(
      `每日涨跌幅不能超过${CALCULATION_LIMITS.MAX_DAILY_RETURN}%`,
      "dailyReturn",
      dailyReturn,
    );
  }

  // 预测最终价格是否会超出合理范围
  if (boardCount > 0 && Math.abs(dailyReturn) > 10) {
    const dailyMultiplier = new Decimal(dailyReturn).div(100).plus(1);
    const finalMultiplier = dailyMultiplier.pow(boardCount);
    const estimatedFinalPrice = new Decimal(initialPrice).mul(finalMultiplier);

    if (estimatedFinalPrice.gt(CALCULATION_LIMITS.MAX_ESTIMATED_PRICE)) {
      throw ErrorFactory.validation(
        `计算会导致价格过高(${estimatedFinalPrice.toString()}元)，请调整参数`,
        "dailyReturn",
        dailyReturn,
      );
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
    boardCount, // 使用实际的 boardCount 而不是固定的 1
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

    const multiplierLn = multiplier.ln();

    // Double Days: ln(doublePrice / initialPrice) / ln(multiplier)
    const doubleRatio = doublePrice.div(initialPriceDecimal);
    doubleDays = doubleRatio.ln().div(multiplierLn).ceil().toNumber();

    // TenX Days: ln(tenXPrice / initialPrice) / ln(multiplier)
    const tenXRatio = tenXPrice.div(initialPriceDecimal);
    tenXDays = tenXRatio.ln().div(multiplierLn).ceil().toNumber();
  }

  const currentPriceDecimal = initialPriceDecimal.mul(multiplier.pow(boardCount));
  const finalPrice = Number(currentPriceDecimal.toString());

  let breakEvenReturn: number | null = null;
  // breakEvenReturn: 从终价回到初始价所需的价格变动百分比（无论盈亏场景）
  // 正值表示盈利状态下从当前价回撤到成本价所需的回调百分比
  // 负值表示亏损状态下从当前价回升到成本价所需的涨幅百分比
  // 计算公式: (finalPrice - initialPrice) / finalPrice × 100
  // 例如: 10→11元(盈利10%), 回撤到10元需要 (11-10)/11×100 = 9.09%
  // 例如: 10→9元(亏损10%), 回升到10元需要 (9-10)/9×100 = -11.11%(即需要11.11%的涨幅)
  if (finalPrice !== 0) {
    const breakEvenDecimal = new Decimal(finalPrice).minus(initialPrice).div(finalPrice).mul(100);
    breakEvenReturn = Number(breakEvenDecimal.toString());
  }

  // 计算年化收益率
  let annualizedReturn: number | null = null;
  if (boardCount > 0) {
    // 将天数转换为年份（按365天/年计算）
    const years = new Decimal(boardCount).div(365).toNumber();
    if (years > 0) {
      // CAGR = (最终价值 ÷ 初始价值)^(1 ÷ 年数) - 1
      // 使用对数计算以避免大数计算问题
      const growthFactor = new Decimal(finalPrice).div(initialPrice);

      // 对于非常大的增长因子，我们需要特别处理
      if (growthFactor.gt(CALCULATION_LIMITS.MAX_GROWTH_FACTOR)) {
        annualizedReturn = null;
      } else {
        // 使用对数形式计算以避免溢出
        // CAGR = exp(ln(growthFactor) / years) - 1
        const yearsDecimal = new Decimal(boardCount).div(365);
        const cagrDecimal = growthFactor.ln().div(yearsDecimal).exp().minus(1).mul(100);
        annualizedReturn = Number(cagrDecimal.toString());

        // 检查是否为有限数
        if (
          !isFinite(annualizedReturn) ||
          Math.abs(annualizedReturn) > CALCULATION_LIMITS.MAX_ANNUALIZED_RETURN
        ) {
          annualizedReturn = null;
        }
      }
    }
  }

  return {
    doubleDays,
    tenXDays,
    breakEvenReturn,
    annualizedReturn,
  };
};
