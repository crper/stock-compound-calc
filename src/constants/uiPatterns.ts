/**
 * UI 模式常量定义
 * 统一全应用的 UI 样式配置
 */

export const CARD_STYLES = {
  borderRadius: "16px",
  boxShadow: "0 1px 2px rgba(17, 24, 39, 0.06), 0 8px 24px -8px rgba(17, 24, 39, 0.1)",
  header: {
    base: "bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700/50 border-b dark:border-gray-700",
    borderRadius: "rounded-t-2xl",
  },
  body: {
    default: "flex flex-col p-5 md:p-6 dark:bg-gray-800 rounded-b-2xl",
    compact: "flex flex-col p-0 dark:bg-gray-800 rounded-b-2xl",
  },
} as const;

export const SLIDER_STYLES = {
  primary: {
    track: {
      background: "linear-gradient(90deg, var(--color-brand) 0%, var(--color-brand-deep) 100%)",
      borderRadius: "4px",
    },
    handle: {
      borderColor: "var(--color-brand)",
      boxShadow: "0 2px 8px rgba(102, 126, 234, 0.4)",
    },
  },
  rainbow: {
    track: {
      background: "linear-gradient(90deg, #10b981 0%, #38bdf8 33%, #f59e0b 66%, #ef4444 100%)",
    },
  },
} as const;
