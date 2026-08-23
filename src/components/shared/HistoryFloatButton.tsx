import React from "react";
import { FloatButton } from "antd";
import { HistoryOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useResponsive } from "@/hooks/useResponsive";
import { PRIMARY_COLORS } from "@/constants/colors";

interface HistoryFloatButtonProps {
  count: number;
  onClick: () => void;
  visible?: boolean;
}

export const HistoryFloatButton: React.FC<HistoryFloatButtonProps> = React.memo(
  ({ count, onClick, visible = true }) => {
    const { t } = useTranslation();
    const { isMobile } = useResponsive();

    if (!visible || count === 0) {
      return null;
    }

    return (
      <FloatButton
        icon={<HistoryOutlined />}
        onClick={onClick}
        badge={{ count }}
        style={{
          right: 24,
          // 移动端上移，避开底部 TabBar + 安全区
          bottom: isMobile ? "calc(76px + env(safe-area-inset-bottom))" : 24,
          boxShadow: PRIMARY_COLORS.shadow,
        }}
        tooltip={t("common.tooltips.historyButton")}
      />
    );
  },
);

HistoryFloatButton.displayName = "HistoryFloatButton";
