/**
 * 图表类型选择器组件
 */
import { BarChartOutlined, LineChartOutlined } from "@ant-design/icons";
import { Button, Space } from "antd";
import React from "react";
import { useResponsiveConfig } from "@/client/hooks/useResponsiveConfig";

type ChartType = "BAR" | "LINE";

interface ChartTypeSelectorProps {
  value: ChartType;
  onChange: (type: ChartType) => void;
}

export const ChartTypeSelector: React.FC<ChartTypeSelectorProps> = React.memo(
  ({ value, onChange }) => {
    const responsive = useResponsiveConfig();

    const options = [
      {
        value: "BAR" as const,
        label: "柱状图",
        icon: <BarChartOutlined />,
      },
      {
        value: "LINE" as const,
        label: "曲线图",
        icon: <LineChartOutlined />,
      },
    ];

    return (
      <Space.Compact size={responsive.size === "large" ? "small" : "middle"}>
        {options.map((option) => (
          <Button
            key={option.value}
            type={value === option.value ? "primary" : "default"}
            icon={option.icon}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </Space.Compact>
    );
  },
);

ChartTypeSelector.displayName = "ChartTypeSelector";

export type { ChartType };
