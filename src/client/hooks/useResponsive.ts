import { useMemo, useState, useEffect, useCallback, useRef } from "react";

export interface ResponsiveConfig {
  isMobile: boolean;
  size: "large" | "middle";
  fontSize: {
    base: number;
    small: number;
    large: number;
  };
  spacing: number;
  cardSize: "default" | "small";
  buttonSize: "middle" | "small";
}

export const useResponsive = (breakpoint: number = 768): ResponsiveConfig => {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < breakpoint;
  });

  const breakpointRef = useRef(breakpoint);
  breakpointRef.current = breakpoint;

  const checkMobile = useCallback(() => {
    setIsMobile(window.innerWidth < breakpointRef.current);
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    const throttledCheck = () => {
      if (timer) return;
      timer = setTimeout(() => {
        checkMobile();
        timer = null;
      }, 100);
    };

    checkMobile();
    window.addEventListener("resize", throttledCheck);

    return () => {
      window.removeEventListener("resize", throttledCheck);
      if (timer) clearTimeout(timer);
    };
  }, [checkMobile]);

  return useMemo(
    () => ({
      isMobile,
      size: isMobile ? "large" : "middle",
      fontSize: {
        base: isMobile ? 16 : 14,
        small: isMobile ? 12 : 11,
        large: isMobile ? 18 : 16,
      },
      spacing: isMobile ? 12 : 16,
      cardSize: isMobile ? "default" : "small",
      buttonSize: isMobile ? "middle" : "small",
    }),
    [isMobile],
  );
};
