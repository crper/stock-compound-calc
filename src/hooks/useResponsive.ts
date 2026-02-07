import { useMemo, useState, useEffect } from "react";

export interface ResponsiveConfig {
  isMobile: boolean;
  size: "large" | "middle" | "small";
  fontSize: {
    base: number;
    small: number;
    large: number;
  };
  spacing: number;
  cardSize: "default" | "small";
  buttonSize: "middle" | "small";
}

// 常量缓存，避免每次渲染重新创建
const MOBILE_CONFIG: ResponsiveConfig = {
  isMobile: true,
  size: "small",
  fontSize: { base: 16, small: 12, large: 18 },
  spacing: 12,
  cardSize: "default",
  buttonSize: "small",
};

const DESKTOP_CONFIG: ResponsiveConfig = {
  isMobile: false,
  size: "middle",
  fontSize: { base: 14, small: 11, large: 16 },
  spacing: 16,
  cardSize: "small",
  buttonSize: "small",
};

// 节流延迟常量
const RESIZE_THROTTLE_MS = 100;

export const useResponsive = (breakpoint: number = 768): ResponsiveConfig => {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window === "undefined" ? false : window.innerWidth < breakpoint,
  );

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    const throttledCheck = () => {
      if (timer) return;
      timer = setTimeout(() => {
        setIsMobile(window.innerWidth < breakpoint);
        timer = null;
      }, RESIZE_THROTTLE_MS);
    };

    // 立即检查一次
    setIsMobile(window.innerWidth < breakpoint);

    window.addEventListener("resize", throttledCheck);

    return () => {
      window.removeEventListener("resize", throttledCheck);
      if (timer) clearTimeout(timer);
    };
  }, [breakpoint]);

  return useMemo(() => (isMobile ? MOBILE_CONFIG : DESKTOP_CONFIG), [isMobile]);
};
