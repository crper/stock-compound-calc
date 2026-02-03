/**
 * UI 模式常量定义
 * 统一全应用的 UI 样式配置
 */

export const CARD_STYLES = {
  borderRadius: "16px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
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
      background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
      borderRadius: "4px",
    },
    handle: {
      borderColor: "#667eea",
      boxShadow: "0 2px 8px rgba(102, 126, 234, 0.4)",
    },
  },
  rainbow: {
    track: {
      background: "linear-gradient(90deg, #52c41a 0%, #1677ff 33%, #faad14 66%, #ff4d4f 100%)",
    },
  },
} as const;
