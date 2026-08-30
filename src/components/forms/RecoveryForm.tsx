import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Card, Form, Slider, Typography, Space, Flex } from "antd";
import { useResponsive } from "@/hooks/useResponsive";
import { CARD_STYLES, SLIDER_STYLES } from "@/constants/uiPatterns";
import { LAYOUT_CONSTANTS } from "@/constants/layout";

const { Text, Title } = Typography;

/** 按亏损程度返回警示色（纯函数，与组件状态无关，提升到模块作用域避免每次渲染重建） */
const getColorByValue = (val: number): string => {
  if (val < 20) return "#10b981";
  if (val < 40) return "#38bdf8";
  if (val < 60) return "#f59e0b";
  if (val < 80) return "#f97316";
  return "#ef4444";
};

interface RecoveryFormProps {
  value: number;
  onChange: (value: number) => void;
}

export const RecoveryForm: React.FC<RecoveryFormProps> = React.memo(({ value, onChange }) => {
  const { t } = useTranslation();
  const { isMobile } = useResponsive(); // 响应式 hooks，用于获取设备信息

  // 窄屏放不下 11 个刻度标签，会互相挤压重叠，这里只保留 5 个主刻度
  const marks = useMemo<Record<number, string>>(() => {
    const steps = isMobile ? [0, 25, 50, 75, 100] : [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    return Object.fromEntries(steps.map((step) => [step, `${step}%`]));
  }, [isMobile]);

  const currentColor = getColorByValue(value);

  return (
    <Card
      size={isMobile ? "small" : "medium"}
      title={
        <div className="flex items-center justify-between">
          {/* 语义层级用 h2，视觉字号由 className 固定 */}
          <Title
            level={2}
            className={`!m-0 dark:text-gray-100 ${isMobile ? "text-base" : "text-lg lg:text-base"} font-semibold`}
          >
            {t("recoveryCalculator.form.title")}
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
              <Space size="small" className="whitespace-nowrap" style={{ marginBottom: 16 }}>
                <Text strong className="dark:text-gray-200 text-base lg:text-sm">
                  {t("recoveryCalculator.form.currentLoss")}
                </Text>
                <Text type="secondary" className="dark:text-gray-400 text-xs lg:text-[11px]">
                  ({t("recoveryCalculator.form.unit")})
                </Text>
              </Space>

              <Flex align="center" gap={LAYOUT_CONSTANTS.spacing.lg} style={{ marginBottom: 16 }}>
                <div
                  className="text-4xl font-bold transition-all duration-300"
                  style={{ color: currentColor }}
                >
                  {value.toFixed(1)}%
                </div>
              </Flex>

              <Slider
                min={0}
                max={99.9}
                step={0.1}
                value={value}
                marks={marks}
                ariaLabelForHandle={t("recoveryCalculator.form.currentLoss")}
                onChange={onChange}
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
                {t("recoveryCalculator.form.sliderDescription")}
              </Text>
            </div>
          </Form.Item>

          <div className="space-y-3">
            <Text strong className="text-gray-500 dark:text-gray-400 text-base lg:text-sm">
              {t("recoveryCalculator.form.presets.label")}
            </Text>
            <Space wrap>
              {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((preset) => {
                const isActive = value === preset;
                return (
                  <button
                    key={preset}
                    // 位于 <Form> 内，不显式声明 type 会默认按 submit 处理
                    type="button"
                    aria-pressed={isActive}
                    aria-label={`${t("recoveryCalculator.form.presets.label")} ${preset}%`}
                    onClick={() => onChange(preset)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-brand to-brand-deep text-white shadow-lg"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {preset}%
                  </button>
                );
              })}
            </Space>
          </div>
        </div>
      </Form>
    </Card>
  );
});

RecoveryForm.displayName = "RecoveryForm";
