import { useMemo } from "react";
import { Grid } from "antd";

/**
 * 响应式档位
 * - mobile:  窄屏手机（<768px），单列 + 底部 TabBar
 * - tablet:  平板 / 折叠屏展开（768px ~ 1199px），双列紧凑排版
 * - desktop: 桌面（>=1200px），多列宽松排版
 */
export type BreakpointTier = "mobile" | "tablet" | "desktop";

export interface ResponsiveConfig {
  /** 当前档位 */
  tier: BreakpointTier;
  /** 是否窄屏手机（<768px） */
  isMobile: boolean;
  /** Ant Design 组件尺寸 */
  size: "large" | "middle" | "small";
  spacing: number;
  /** Card 尺寸。antd v6 起 `default` 已废弃，统一用 `medium` */
  cardSize: "medium" | "small";
  buttonSize: "middle" | "small";
}

// 常量缓存，避免每次渲染重新创建
const MOBILE_CONFIG: ResponsiveConfig = {
  tier: "mobile",
  isMobile: true,
  size: "small",
  spacing: 12,
  cardSize: "medium",
  buttonSize: "small",
};

const TABLET_CONFIG: ResponsiveConfig = {
  tier: "tablet",
  isMobile: false,
  size: "middle",
  spacing: 14,
  cardSize: "small",
  buttonSize: "small",
};

const DESKTOP_CONFIG: ResponsiveConfig = {
  tier: "desktop",
  isMobile: false,
  size: "middle",
  spacing: 16,
  cardSize: "small",
  buttonSize: "small",
};

const CONFIG_BY_TIER: Record<BreakpointTier, ResponsiveConfig> = {
  mobile: MOBILE_CONFIG,
  tablet: TABLET_CONFIG,
  desktop: DESKTOP_CONFIG,
};

/**
 * 断点订阅委托给 antd 的 Grid.useBreakpoint（基于 matchMedia，非 resize 监听），
 * 不再自造 matchMedia 订阅逻辑。gte 语义：md=true 表示 >=768px，xl=true 表示 >=1200px。
 */
export const useResponsive = (): ResponsiveConfig => {
  const screens = Grid.useBreakpoint();
  const tier: BreakpointTier = screens.xl ? "desktop" : screens.md ? "tablet" : "mobile";
  return useMemo(() => CONFIG_BY_TIER[tier], [tier]);
};
