/**
 * 布局系统常量定义
 * 统一管理间距、断点、尺寸等布局配置
 */

export const LAYOUT_CONSTANTS = {
  /** 间距系统（像素）- 基于 4px 基准 */
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  } as const,

  /** 响应式断点（像素） */
  breakpoints: {
    xs: 480,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1600,
  } as const,

  /** 页面内边距（像素） */
  pagePadding: {
    mobile: 20,
    desktop: 28,
  } as const,

  /** Grid Gutter（像素） */
  gutter: {
    mobile: [16, 16] as [number, number],
    desktop: [32, 32] as [number, number],
  } as const,

  /** 容器最大宽度（像素） */
  maxWidth: {
    default: "100%",
    constrained: 1400,
  } as const,
} as const;
