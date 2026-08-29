/**
 * 图表类型选择器组件
 */
import { BarChartOutlined, LineChartOutlined } from "@ant-design/icons";
import { Segmented } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

type ChartType = "BAR" | "LINE";

// Segmented 的 onChange 返回宽泛的 string | number，用类型守卫安全收窄
const isChartType = (val: string | number): val is ChartType => val === "BAR" || val === "LINE";

interface ChartTypeSelectorProps {
  value: ChartType;
  onChange: (type: ChartType) => void;
  isMobile?: boolean;
}

export const ChartTypeSelector: React.FC<ChartTypeSelectorProps> = React.memo(
  ({ value, onChange, isMobile = false }) => {
    const { t } = useTranslation();
    return (
      <Segmented
        options={[
          {
            label: t("stockCalculator.charts.types.bar"),
            value: "BAR",
            icon: <BarChartOutlined />,
          },
          {
            label: t("stockCalculator.charts.types.line"),
            value: "LINE",
            icon: <LineChartOutlined />,
          },
        ]}
        value={value}
        onChange={(val) => {
          if (isChartType(val)) onChange(val);
        }}
        size={isMobile ? "small" : "middle"}
      />
    );
  },
);

ChartTypeSelector.displayName = "ChartTypeSelector";

export type { ChartType };
