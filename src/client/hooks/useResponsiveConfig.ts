import { useMemo } from "react";
import { useResponsive } from "./useResponsive";

export const useResponsiveConfig = () => {
  const { isMobile } = useResponsive();

  return useMemo(
    () => ({
      size: (isMobile ? ("large" as const) : ("middle" as const)) as "large" | "middle",
      fontSize: {
        base: isMobile ? 16 : 14,
        small: isMobile ? 12 : 11,
        large: isMobile ? 18 : 16,
      },
      spacing: isMobile ? 12 : 16,
      cardSize: (isMobile ? ("default" as const) : ("small" as const)) as "default" | "small",
      buttonSize: (isMobile ? ("middle" as const) : ("small" as const)) as "middle" | "small",
    }),
    [isMobile],
  );
};
