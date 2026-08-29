/**
 * 颜色配置常量
 * 集中管理涨跌相关的颜色配置，支持深色模式
 * 语义统一为「红涨绿跌」（A 股惯例），全站消费方共用此定义
 */

export const TREND_COLORS = {
  up: {
    text: "text-red-600 dark:text-red-400",
    bg: "bg-[#fff2f0] dark:bg-red-900/20",
    border: "border-[#ffccc7] dark:border-red-800/50",
    divider: "border-red-200 dark:border-red-800/50",
    iconColor: "text-[#ff4d4f] dark:text-red-400",
  },
  down: {
    text: "text-green-600 dark:text-green-400",
    bg: "bg-[#f6ffed] dark:bg-green-900/20",
    border: "border-[#b7eb8f] dark:border-green-800/50",
    divider: "border-green-200 dark:border-green-800/50",
    iconColor: "text-[#52c41a] dark:text-green-400",
  },
} as const;

/**
 * 主色调配置
 * 用于渐变、按钮、图标等高亮元素
 */
export const PRIMARY_COLORS = {
  start: "#667eea",
  end: "#764ba2",
  gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  shadow: "0 4px 14px rgba(102, 126, 234, 0.4)",
  tailwind: {
    from: "from-[#667eea]",
    to: "to-[#764ba2]",
  },
} as const;
