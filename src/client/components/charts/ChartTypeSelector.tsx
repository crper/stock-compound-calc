/**
 * 图表类型选择器组件
 */
import { BarChartOutlined, LineChartOutlined } from "@ant-design/icons";
import { Button, Space } from "antd";
import React from "react";
import { useResponsive } from "@/client/hooks/useResponsive";

type ChartType = "BAR" | "LINE";

interface ChartTypeSelectorProps {
  value: ChartType;
  onChange: (type: ChartType) => void;
}

export const ChartTypeSelector: React.FC<ChartTypeSelectorProps> = React.memo(
  ({ value, onChange }) => {
    const { isMobile } = useResponsive();

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
      <Space.Compact
        size={isMobile ? "small" : "middle"}
        className="rounded-xl overflow-hidden"
      >
        {options.map((option) => (
          <Button
            key={option.value}
            type={value === option.value ? "primary" : "default"}
            icon={option.icon}
            onClick={() => onChange(option.value)}
            className="transition-all duration-300"
            style={{
              borderRadius: 0,
              backgroundColor: value === option.value ? undefined : undefined,
              backgroundImage:
                value === option.value
                  ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  : undefined,
            }}
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
