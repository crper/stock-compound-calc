/**
 * 计算限制常量
 * 集中管理所有计算相关的限制值
 */

export const CALCULATION_LIMITS = {
  /** 最大连板天数（约10年） */
  MAX_BOARD_COUNT: 3650,
  /** 最大每日涨跌幅百分比 */
  MAX_DAILY_RETURN: 100,
  /** 最小每日涨跌幅百分比 */
  MIN_DAILY_RETURN: -99,
  /** 最大预估价格（1万亿） */
  MAX_ESTIMATED_PRICE: 1e12,
  /** 最大初始股价 */
  MAX_INITIAL_PRICE: 1000000000,
  /** 最小初始股价 */
  MIN_INITIAL_PRICE: 0.01,
  /** 最大年化收益率显示阈值 */
  MAX_ANNUALIZED_RETURN: 100000,
  /** 最大增长因子（用于年化计算） */
  MAX_GROWTH_FACTOR: 1e6,
} as const;
