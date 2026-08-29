import { useMemo, useSyncExternalStore } from "react";
import { UI_CONSTANTS } from "@/constants";

/**
 * 响应式档位
 * - mobile:  窄屏手机，单列 + 底部 TabBar
 * - tablet:  平板 / 折叠屏展开，双列紧凑排版
 * - desktop: 桌面，多列宽松排版
 */
export type BreakpointTier = "mobile" | "tablet" | "desktop";

export interface ResponsiveConfig {
  /** 当前档位 */
  tier: BreakpointTier;
  /** 是否窄屏手机（< 768px） */
  isMobile: boolean;
  /** 是否平板（768px ~ 1199px） */
  isTablet: boolean;
  /** 是否桌面（>= 1200px） */
  isDesktop: boolean;
  /** Ant Design 组件尺寸 */
  size: "large" | "middle" | "small";
  fontSize: {
    base: number;
    small: number;
    large: number;
  };
  spacing: number;
  /** Card 尺寸。antd v6 起 `default` 已废弃，统一用 `medium` */
  cardSize: "medium" | "small";
  buttonSize: "middle" | "small";
}

// 断点：mobile 上界 / desktop 下界（0.02 偏移避免与整数宽度边界重叠）
const TABLET_MIN_WIDTH = UI_CONSTANTS.RESPONSIVE_BREAKPOINT; // 768
const DESKTOP_MIN_WIDTH = UI_CONSTANTS.TABLET_BREAKPOINT; // 1200

const MEDIA_QUERIES: Record<BreakpointTier, string> = {
  mobile: `(max-width: ${TABLET_MIN_WIDTH - 0.02}px)`,
  tablet: `(min-width: ${TABLET_MIN_WIDTH}px) and (max-width: ${DESKTOP_MIN_WIDTH - 0.02}px)`,
  desktop: `(min-width: ${DESKTOP_MIN_WIDTH}px)`,
};

// 常量缓存，避免每次渲染重新创建
const MOBILE_CONFIG: ResponsiveConfig = {
  tier: "mobile",
  isMobile: true,
  isTablet: false,
  isDesktop: false,
  size: "small",
  fontSize: { base: 16, small: 12, large: 18 },
  spacing: 12,
  cardSize: "medium",
  buttonSize: "small",
};

const TABLET_CONFIG: ResponsiveConfig = {
  tier: "tablet",
  isMobile: false,
  isTablet: true,
  isDesktop: false,
  size: "middle",
  fontSize: { base: 14, small: 12, large: 16 },
  spacing: 14,
  cardSize: "small",
  buttonSize: "small",
};

const DESKTOP_CONFIG: ResponsiveConfig = {
  tier: "desktop",
  isMobile: false,
  isTablet: false,
  isDesktop: true,
  size: "middle",
  fontSize: { base: 14, small: 11, large: 16 },
  spacing: 16,
  cardSize: "small",
  buttonSize: "small",
};

const CONFIG_BY_TIER: Record<BreakpointTier, ResponsiveConfig> = {
  mobile: MOBILE_CONFIG,
  tablet: TABLET_CONFIG,
  desktop: DESKTOP_CONFIG,
};

const canMatchMedia = (): boolean =>
  typeof window !== "undefined" && typeof window.matchMedia === "function";

/**
 * 读取当前档位。matchMedia 不可用（如 SSR / 测试环境）时回退到桌面档。
 */
const readTier = (): BreakpointTier => {
  if (!canMatchMedia()) return "desktop";
  if (window.matchMedia(MEDIA_QUERIES.mobile).matches) return "mobile";
  if (window.matchMedia(MEDIA_QUERIES.tablet).matches) return "tablet";
  return "desktop";
};

/**
 * 订阅断点变化。只在跨越断点时触发一次，
 * 不像 resize 事件那样在拖拽窗口时高频触发。
 */
const subscribeTier = (onStoreChange: () => void): (() => void) => {
  if (!canMatchMedia()) return () => {};

  const lists = Object.values(MEDIA_QUERIES).map((query) => window.matchMedia(query));
  lists.forEach((list) => list.addEventListener("change", onStoreChange));

  return () => {
    lists.forEach((list) => list.removeEventListener("change", onStoreChange));
  };
};

export const useResponsive = (): ResponsiveConfig => {
  const tier = useSyncExternalStore(subscribeTier, readTier, () => "desktop" as const);

  return useMemo(() => CONFIG_BY_TIER[tier], [tier]);
};
