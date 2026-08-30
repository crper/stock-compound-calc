/**
 * 应用程序常量定义
 * 集中管理所有魔法数字和配置常量
 */

/**
 * UI 常量
 */
export const UI_CONSTANTS = {
  /** 防抖延迟时间（毫秒） */
  DEBOUNCE_DELAY_MS: 150,
} as const;

/**
 * 默认值常量
 */
export const DEFAULT_VALUES = {
  /** 默认初始股价 */
  INITIAL_PRICE: 10,
  /** 默认连板数量 */
  BOARD_COUNT: 1,
  /** 默认涨跌幅 */
  DAILY_RETURN: 10,
} as const;

/**
 * 预设值常量
 */
export const PRESET_VALUES = {
  /** A股主板涨跌幅限制 */
  A_STOCK_MAIN_BOARD: 10,
  /** 科创板涨跌幅限制 */
  STAR_MARKET: 20,
  /** 北交所涨跌幅限制 */
  BEIJING_STOCK_EXCHANGE: 30,
} as const;

/**
 * 图表配置常量
 */
export const CHART_CONFIG = {
  /** 最大数据点数 */
  MAX_DATA_POINTS: 50,
} as const;

/**
 * 表单配置常量
 */
export const FORM_CONFIG = {
  /**
   * 预设按钮配置。
   * color 会作为选中态的背景色并在上面放白字，因此必须达到 WCAG AA 4.5:1：
   * 原始色 #1890ff / #52c41a / #fa8c16 分别只有 3.24 / 2.29 / 2.15:1，这里换成同色系深一档的取值。
   */
  PRESETS: [
    {
      value: PRESET_VALUES.A_STOCK_MAIN_BOARD,
      subLabel: "10%",
      color: "#1677d2", // 4.56:1
    },
    {
      value: PRESET_VALUES.STAR_MARKET,
      subLabel: "20%",
      color: "#237804", // 5.59:1
    },
    {
      value: PRESET_VALUES.BEIJING_STOCK_EXCHANGE,
      subLabel: "30%",
      color: "#ad4e00", // 5.39:1
    },
  ],
  /** 涨跌幅滑块刻度 */
  RETURN_SLIDER_MARKS: {
    1: "1%",
    5: "5%",
    10: "10%",
    20: "20%",
    30: "30%",
  },
} as const;

export * from "./colors";
export * from "./limits";
export * from "./layout";
