/**
 * 颜色配置常量
 * 集中管理涨跌相关的颜色配置，支持深色模式
 */

export const TREND_COLORS = {
  up: {
    text: "text-green-600 dark:text-green-400",
    bg: "bg-[#f6ffed] dark:bg-green-900/20",
    border: "border-[#b7eb8f] dark:border-green-800/50",
    divider: "border-green-200 dark:border-green-800/50",
    iconColor: "text-[#52c41a] dark:text-green-400",
  },
  down: {
    text: "text-red-500 dark:text-red-400",
    bg: "bg-[#fff2f0] dark:bg-red-900/20",
    border: "border-[#ffccc7] dark:border-red-800/50",
    divider: "border-red-200 dark:border-red-800/50",
    iconColor: "text-[#ff4d4f] dark:text-red-400",
  },
} as const;
