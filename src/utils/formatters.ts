/**
 * 数据格式化工具
 * 提供统一的数据格式化功能，确保全应用的数据展示一致性
 */
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";

// 设置 dayjs 语言为中文
dayjs.locale("zh-cn");

/**
 * 安全解析数字字符串
 */
const parseNumber = (value: string | number): number | null => {
  if (typeof value === "number") return value;
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  const regex = /^-?\d+(\.\d+)?$/;
  if (!regex.test(trimmed)) return null;

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
};

/**
 * 数字格式化选项
 */
interface NumberFormatOptions {
  /** 小数位数 */
  decimals?: number;
  /** 是否使用千分位分隔符 */
  useGrouping?: boolean;
  /** 是否显示正号 */
  showPlus?: boolean;
  /** 单位后缀 */
  suffix?: string;
  /** 单位前缀 */
  prefix?: string;
}

/**
 * 货币格式化选项
 */
interface CurrencyFormatOptions extends NumberFormatOptions {
  /** 货币符号 */
  symbol?: string;
  /** 货币符号位置 */
  symbolPosition?: "before" | "after";
}

/**
 * 百分比格式化选项
 */
interface PercentageFormatOptions extends NumberFormatOptions {
  /** 是否乘以100 */
  multiply?: boolean;
}

/**
 * 日期格式化选项
 */
interface DateFormatOptions {
  /** 日期格式，默认 YYYY-MM-DD HH:mm:ss（如：2025-12-01 23:00:11） */
  format?: string;
}

/**
 * 格式化数字
 *
 * @param value - 要格式化的数字
 * @param options - 格式化选项
 * @returns 格式化后的字符串
 */
export const formatNumber = (
  value: number | string | null | undefined,
  options: NumberFormatOptions = {},
): string => {
  if (value === null || value === undefined || value === "") {
    return "--";
  }

  const numValue = parseNumber(value);

  if (numValue === null) {
    return "--";
  }

  const { decimals = 4, useGrouping = true, showPlus = false, suffix = "", prefix = "" } = options;

  // 格式化数字
  let formatted = numValue.toFixed(decimals);

  // 添加千分位分隔符
  if (useGrouping) {
    const parts = formatted.split(".");
    if (parts[0]) {
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    formatted = parts.join(".");
  }

  // 添加正号
  if (showPlus && numValue > 0) {
    formatted = `+${formatted}`;
  }

  // 添加前缀和后缀
  return `${prefix}${formatted}${suffix}`;
};

/**
 * 格式化货币
 *
 * @param value - 要格式化的金额
 * @param options - 格式化选项
 * @returns 格式化后的货币字符串
 */
export const formatCurrency = (
  value: number | string | null | undefined,
  options: CurrencyFormatOptions & { compact?: boolean } = {},
): string => {
  const {
    symbol = "¥",
    symbolPosition = "before",
    decimals = 4,
    compact = false,
    ...numberOptions
  } = options;

  if (value === null || value === undefined || value === "") {
    return "--";
  }

  const numValue = parseNumber(value);

  if (numValue === null) {
    return "--";
  }

  // 紧凑模式：对于过大的数值使用万/亿
  if (compact && Math.abs(numValue) >= 10000) {
    let displayValue: number;
    let unit: string;

    if (Math.abs(numValue) >= 100000000) {
      displayValue = numValue / 100000000;
      unit = "亿";
    } else {
      displayValue = numValue / 10000;
      unit = "万";
    }

    const formatted = formatNumber(displayValue, {
      ...numberOptions,
      decimals: 2,
      useGrouping: true,
      suffix: unit,
    });

    return symbolPosition === "before" ? `${symbol}${formatted}` : `${formatted}${symbol}`;
  }

  const formattedNumber = formatNumber(value, {
    decimals,
    useGrouping: true,
    showPlus: numberOptions.showPlus,
    ...numberOptions,
  });

  return symbolPosition === "before"
    ? `${symbol}${formattedNumber}`
    : `${formattedNumber}${symbol}`;
};

/**
 * 格式化百分比
 *
 * @param value - 要格式化的百分比值（0.1 表示 10%）
 * @param options - 格式化选项
 * @returns 格式化后的百分比字符串
 */
export const formatPercentage = (
  value: number | string | null | undefined,
  options: PercentageFormatOptions = {},
): string => {
  const { multiply = true, decimals = 2, showPlus = true, ...numberOptions } = options;

  if (value === null || value === undefined || value === "") {
    return "--";
  }

  const numValue = parseNumber(value);

  if (numValue === null) {
    return "--";
  }

  // 如果需要乘以100
  const displayValue = multiply ? numValue * 100 : numValue;

  return formatNumber(displayValue, {
    decimals,
    showPlus,
    suffix: "%",
    ...numberOptions,
  });
};

/**
 * 格式化日期
 * 使用 dayjs 进行日期格式化，默认格式为 YYYY-MM-DD HH:mm:ss（如：2025-12-01 23:00:11）
 *
 * @param value - 要格式化的日期（Date、字符串、时间戳）
 * @param options - 格式化选项
 * @returns 格式化后的日期字符串
 */
export const formatDate = (
  value: Date | string | number | null | undefined,
  options: DateFormatOptions = {},
): string => {
  if (!value) {
    return "--";
  }

  // 转换为 dayjs 对象
  const date = dayjs(value);

  // 检查日期是否有效
  if (!date.isValid()) {
    return "--";
  }

  const { format = "YYYY-MM-DD HH:mm:ss" } = options;

  return date.format(format);
};
