/**
 * 图表类型选择器组件
 */
import { BarChartOutlined, LineChartOutlined } from "@ant-design/icons";
import { Segmented } from "antd";
import React from "react";

type ChartType = "BAR" | "LINE";

interface ChartTypeSelectorProps {
  value: ChartType;
  onChange: (type: ChartType) => void;
}

export const ChartTypeSelector: React.FC<ChartTypeSelectorProps> = React.memo(
  ({ value, onChange }) => {
    return (
      <Segmented
        options={[
          {
            label: "柱状图",
            value: "BAR",
            icon: <BarChartOutlined />,
          },
          {
            label: "曲线图",
            value: "LINE",
            icon: <LineChartOutlined />,
          },
        ]}
        value={value}
        onChange={(val) => onChange(val as ChartType)}
      />
    );
  },
);

ChartTypeSelector.displayName = "ChartTypeSelector";

export type { ChartType };
