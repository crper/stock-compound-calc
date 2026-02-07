/**
 * 图表类型选择器组件
 */
import { BarChartOutlined, LineChartOutlined } from "@ant-design/icons";
import { Segmented } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

type ChartType = "BAR" | "LINE";

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
        onChange={(val) => onChange(val as ChartType)}
        size={isMobile ? "small" : "middle"}
      />
    );
  },
);

ChartTypeSelector.displayName = "ChartTypeSelector";

export type { ChartType };
