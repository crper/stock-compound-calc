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
  /** 响应式断点（像素） */
  RESPONSIVE_BREAKPOINT: 768,
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
 * API 常量
 */
export const API_CONSTANTS = {
  /** API 基础路径 */
  BASE_URL: "/api",
  /** 请求超时时间（毫秒） */
  TIMEOUT_MS: 10000,
} as const;

/**
 * Decimal 配置常量
 */
export const DECIMAL_CONFIG = {
  /** 计算精度 */
  PRECISION: 28,
  /** 舍入模式：四舍五入 */
  ROUNDING: 1,
  /** 科学计数法负指数阈值 */
  TO_EXP_NEG: -7,
  /** 科学计数法正指数阈值 */
  TO_EXP_POS: 21,
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
  /** 预设按钮配置 */
  PRESETS: [
    {
      value: PRESET_VALUES.A_STOCK_MAIN_BOARD,
      label: "A股主板",
      subLabel: "10%",
      color: "#1890ff",
    },
    {
      value: PRESET_VALUES.STAR_MARKET,
      label: "科创板",
      subLabel: "20%",
      color: "#52c41a",
    },
    {
      value: PRESET_VALUES.BEIJING_STOCK_EXCHANGE,
      label: "北交所",
      subLabel: "30%",
      color: "#fa8c16",
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
  /** 连板天数滑块刻度 */
  BOARD_SLIDER_MARKS: {
    1: "1天",
    5: "5天",
    10: "10天",
    15: "15天",
  },
} as const;

export * from "./colors";
export * from "./limits";
