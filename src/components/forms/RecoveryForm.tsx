import React, { useCallback } from "react";
import { Card, Form, Slider, Typography, Space } from "antd";
import { useResponsive } from "@/hooks/useResponsive";
import { CARD_STYLES, SLIDER_STYLES } from "@/constants/uiPatterns";

const { Text, Title } = Typography;

interface RecoveryFormProps {
  value: number;
  onChange: (value: number) => void;
}

export const RecoveryForm: React.FC<RecoveryFormProps> = React.memo(({ value, onChange }) => {
  useResponsive(); // 响应式 hooks，用于获取设备信息

  const handleSliderChange = useCallback(
    (newValue: number) => {
      onChange(newValue);
    },
    [onChange],
  );

  const marks: Record<number, string> = {
    0: "0%",
    10: "10%",
    20: "20%",
    30: "30%",
    40: "40%",
    50: "50%",
    60: "60%",
    70: "70%",
    80: "80%",
    90: "90%",
    100: "100%",
  };

  const getColorByValue = (val: number): string => {
    if (val < 20) return "#52c41a";
    if (val < 40) return "#1677ff";
    if (val < 60) return "#faad14";
    if (val < 80) return "#fa541c";
    return "#ff4d4f";
  };

  const currentColor = getColorByValue(value);

  return (
    <Card
      size="default"
      title={
        <div className="flex items-center justify-between">
          <Title level={4} className="!m-0 dark:text-gray-100 text-lg lg:text-base font-semibold">
            亏损百分比
          </Title>
        </div>
      }
      className="w-full"
      style={{
        borderRadius: CARD_STYLES.borderRadius,
        boxShadow: CARD_STYLES.boxShadow,
      }}
      classNames={{
        header: `${CARD_STYLES.header.base} ${CARD_STYLES.header.borderRadius}`,
        body: CARD_STYLES.body.default,
      }}
    >
      <Form layout="vertical" className="flex-1 flex flex-col">
        <div className="flex-1 flex flex-col min-h-[300px]">
          <Form.Item style={{ marginBottom: 24 }}>
            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
              <Space size="small" style={{ marginBottom: 16 }} className="whitespace-nowrap">
                <Text strong className="dark:text-gray-200 text-base lg:text-sm">
                  当前亏损
                </Text>
                <Text type="secondary" className="dark:text-gray-400 text-xs lg:text-[11px]">
                  (%)
                </Text>
              </Space>

              <div className="flex items-center gap-4 mb-4">
                <div
                  className="text-4xl font-bold transition-all duration-300"
                  style={{ color: currentColor }}
                >
                  {value.toFixed(1)}%
                </div>
              </div>

              <Slider
                min={0}
                max={99.9}
                step={0.1}
                value={value}
                marks={marks}
                onChange={handleSliderChange}
                tooltip={{
                  formatter: (val) => `${Number(val).toFixed(1)}%`,
                  placement: "top",
                  className: "rounded-lg",
                }}
                className="custom-slider"
                styles={{
                  track: SLIDER_STYLES.rainbow.track,
                }}
              />
              <Text
                type="secondary"
                className="dark:text-gray-400 block mt-4 text-xs lg:text-[11px]"
              >
                拖动滑块设置亏损百分比，范围 0% - 99.9%
              </Text>
            </div>
          </Form.Item>

          <div className="space-y-3">
            <Text strong className="text-gray-500 dark:text-gray-400 text-base lg:text-sm">
              快速选择：
            </Text>
            <div className="flex flex-wrap gap-2">
              {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((preset) => (
                <button
                  key={preset}
                  onClick={() => handleSliderChange(preset)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                    value === preset
                      ? "bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white shadow-lg"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {preset}%
                </button>
              ))}
            </div>
          </div>
        </div>
      </Form>
    </Card>
  );
});

RecoveryForm.displayName = "RecoveryForm";
