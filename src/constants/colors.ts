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
    iconColor: "text-red-500 dark:text-red-400",
  },
  down: {
    text: "text-green-600 dark:text-green-400",
    bg: "bg-[#f6ffed] dark:bg-green-900/20",
    border: "border-[#b7eb8f] dark:border-green-800/50",
    iconColor: "text-green-500 dark:text-green-400",
  },
} as const;

/**
 * 主色调配置
 * 品牌色值已收口到 src/index.css 的 @theme token（--color-brand* / brand 工具类），
 * 此处仅保留无法用 CSS 变量承载的投影。
 */
export const PRIMARY_COLORS = {
  /** 品牌主色投影（用于高亮表面） */
  shadow: "0 4px 14px rgba(102, 126, 234, 0.35)",
} as const;

/**
 * 页面全局背景光晕（aurora）
 * 取代平灰底色，为浅色/深色模式分别提供带品牌色调的柔和背景，
 * 增强现代感与层次，同时保持低对比度、不干扰内容阅读
 */
export const BACKGROUND_COLORS = {
  /** 浅色模式：冷白基底 + indigo/violet 微妙光晕 */
  light: `radial-gradient(56rem 56rem at 112% -8%, rgba(102, 126, 234, 0.16), transparent 62%),
           radial-gradient(48rem 48rem at -12% 4%, rgba(118, 75, 162, 0.12), transparent 56%),
           radial-gradient(40rem 40rem at 55% 118%, rgba(90, 103, 216, 0.09), transparent 62%)`,
  /** 深色模式：靛夜基底 + 更克制的品牌光晕 */
  dark: `radial-gradient(56rem 56rem at 112% -8%, rgba(102, 126, 234, 0.2), transparent 62%),
          radial-gradient(48rem 48rem at -12% 4%, rgba(118, 75, 162, 0.14), transparent 56%),
          radial-gradient(40rem 40rem at 55% 118%, rgba(30, 27, 75, 0.55), transparent 62%)`,
  base: {
    light: "#f7f8ff",
    dark: "#0e1224",
  },
} as const;
