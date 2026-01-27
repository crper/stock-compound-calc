import { useState, useEffect, useCallback, useRef } from "react";

export const useResponsive = (breakpoint: number = 768) => {
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

  return { isMobile };
};
