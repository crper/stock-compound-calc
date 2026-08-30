/**
 * 布局系统常量定义
 * 统一管理间距与主要容器的宽度约束
 */

export const LAYOUT_CONSTANTS = {
  /** 间距系统（像素）- 仅保留实际在用的档位 */
  spacing: {
    md: 12,
    lg: 16,
  } as const,
} as const;

/** 主内容区最大宽度（像素），超宽屏下避免文字行长过长影响阅读 */
export const CONTENT_MAX_WIDTH = 1600;
