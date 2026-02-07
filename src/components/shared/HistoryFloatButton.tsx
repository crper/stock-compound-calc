import React from "react";
import { FloatButton } from "antd";
import { HistoryOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { PRIMARY_COLORS } from "@/constants/colors";

interface HistoryFloatButtonProps {
  count: number;
  onClick: () => void;
  visible?: boolean;
}

export const HistoryFloatButton: React.FC<HistoryFloatButtonProps> = React.memo(({
  count,
  onClick,
  visible = true,
}) => {
  const { t } = useTranslation();

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
        bottom: 24,
        boxShadow: PRIMARY_COLORS.shadow,
      }}
      tooltip={t("common.tooltips.historyButton")}
    />
  );
});

HistoryFloatButton.displayName = "HistoryFloatButton";
