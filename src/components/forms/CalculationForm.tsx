import type { FormInstance } from "antd/es/form";
import type { CalculationParams } from "@/types";
import { Alert, Button, Card, Form, InputNumber, Slider, Space, Typography } from "antd";
import React, { useCallback, useState } from "react";
import { useResponsive } from "@/hooks/useResponsive";
import { getFieldErrorMessage } from "@/utils/validator";
import { FORM_CONFIG } from "@/constants";
import { CARD_STYLES, SLIDER_STYLES } from "@/constants/uiPatterns";

const { Text, Title } = Typography;

interface CalculationFormProps {
  form: FormInstance<CalculationParams>;
  onValuesChange: (changedValues: Partial<CalculationParams>, allValues: CalculationParams) => void;
  isFieldValid: (value: unknown, fieldName: keyof CalculationParams) => boolean;
  error?: string | null;
}

export const CalculationForm: React.FC<CalculationFormProps> = React.memo(
  ({ form, onValuesChange, isFieldValid, error = null }) => {
    const { isMobile, size: responsiveSize, cardSize, spacing, buttonSize } = useResponsive();
    const [hoveredPreset, setHoveredPreset] = useState<number | null>(null);

    // 使用 Form.useWatch 监听表单值，避免在渲染期间直接调用 form.getFieldValue
    const dailyReturnValue = Form.useWatch("dailyReturn", form) ?? 10;
    const boardCountValue = Form.useWatch("boardCount", form) ?? 1;
    const initialPriceValue = Form.useWatch("initialPrice", form);

    // 获取字段验证状态和帮助信息
    const getFieldValidation = useCallback(
      (fieldName: keyof CalculationParams) => {
        // 从 useWatch 获取的值判断验证状态
        let value: number | undefined;
        switch (fieldName) {
          case "dailyReturn":
            value = dailyReturnValue;
            break;
          case "boardCount":
            value = boardCountValue;
            break;
          case "initialPrice":
            value = initialPriceValue;
            break;
        }
        const isValid = isFieldValid(value, fieldName);

        if (value === undefined) {
          return {
            validateStatus: undefined,
            help: undefined,
          };
        }

        return {
          validateStatus: isValid ? ("success" as const) : ("error" as const),
          help: isValid ? "" : getFieldErrorMessage(fieldName),
        };
      },
      [isFieldValid, dailyReturnValue, boardCountValue, initialPriceValue],
    );

    // 处理值变化并触发计算
    const handleFieldChange = useCallback(
      (fieldName: keyof CalculationParams, value: number | null) => {
        if (value !== null) {
          form.setFieldsValue({ [fieldName]: value });
          // 使用 useWatch 获取的最新值构建 allValues
          const allValues: CalculationParams = {
            initialPrice: fieldName === "initialPrice" ? value : (initialPriceValue ?? 10),
            boardCount: fieldName === "boardCount" ? value : (boardCountValue ?? 1),
            dailyReturn: fieldName === "dailyReturn" ? value : (dailyReturnValue ?? 10),
          };
          onValuesChange({ [fieldName]: value }, allValues);
        }
      },
      [form, onValuesChange, initialPriceValue, boardCountValue, dailyReturnValue],
    );

    // 处理预设按钮点击
    const handlePresetChange = useCallback(
      (value: number) => {
        handleFieldChange("dailyReturn", value);
      },
      [handleFieldChange],
    );

    return (
      <Card
        size={cardSize}
        title={
          <div className="flex items-center justify-between">
            <Title level={4} className="!m-0 dark:text-gray-100 text-lg lg:text-base font-semibold">
              计算参数
            </Title>
          </div>
        }
        className="w-full lg:min-w-[400px]"
        style={{
          borderRadius: CARD_STYLES.borderRadius,
          boxShadow: CARD_STYLES.boxShadow,
        }}
        classNames={{
          header: `${CARD_STYLES.header.base} ${CARD_STYLES.header.borderRadius}`,
          body: CARD_STYLES.body.default,
        }}
      >
        {error && (
          <Alert
            title="计算错误"
            description={error}
            type="error"
            showIcon
            closable
            className="rounded-xl mb-5"
            style={{
              animation: "shake 0.5s ease-in-out",
            }}
          />
        )}

        <Form
          form={form}
          layout="vertical"
          className="flex-1 flex flex-col"
          initialValues={{
            initialPrice: 10,
            boardCount: 1,
            dailyReturn: 10,
          }}
          onValuesChange={onValuesChange}
          requiredMark={false}
        >
          <div className="flex-1 flex flex-col min-h-[400px]">
            {/* 初始股价输入 */}
            <Form.Item
              name="initialPrice"
              label={
                <Space size="small" className="whitespace-nowrap">
                  <Text strong className="dark:text-gray-200 text-base lg:text-sm">
                    初始股价
                  </Text>
                  <Text type="secondary" className="dark:text-gray-400 text-xs lg:text-[11px]">
                    (元)
                  </Text>
                </Space>
              }
              tooltip="请输入股票的起始价格，最大支持10亿"
              {...getFieldValidation("initialPrice")}
              style={{ marginBottom: isMobile ? 24 : 28 }}
            >
              <InputNumber
                style={{
                  width: "100%",
                  borderRadius: "10px",
                }}
                min={0.01}
                max={1000000000}
                step={0.01}
                precision={2}
                placeholder="请输入初始股价"
                controls
                size={responsiveSize}
                prefix="¥"
                suffix="元"
                className="hover:border-blue-400 focus:border-blue-500 transition-colors duration-300"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(value: string | undefined): number => {
                  const parsed = value ? Number(value.replace(/¥\s?|元|(,*)/g, "")) : 0.01;
                  return Math.max(0.01, Math.min(1000000000, parsed));
                }}
                onChange={(value) => handleFieldChange("initialPrice", value)}
              />
            </Form.Item>

            {/* 涨跌幅滑动条 */}
            <Form.Item
              name="dailyReturn"
              {...getFieldValidation("dailyReturn")}
              style={{ marginBottom: 28 }}
            >
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                <Space size="small" style={{ marginBottom: 12 }} className="whitespace-nowrap">
                  <Text strong className="dark:text-gray-200 text-base lg:text-sm">
                    涨跌幅度
                  </Text>
                  <Text type="secondary" className="dark:text-gray-400 text-xs lg:text-[11px]">
                    (%)
                  </Text>
                </Space>
                <Slider
                  min={1}
                  max={30}
                  step={1}
                  marks={FORM_CONFIG.RETURN_SLIDER_MARKS}
                  value={dailyReturnValue}
                  tooltip={{
                    formatter: (val) => `${val}%`,
                    placement: "top",
                    className: "rounded-lg",
                  }}
                  onChange={handlePresetChange}
                  className="custom-slider"
                  trackStyle={SLIDER_STYLES.primary.track}
                  handleStyle={SLIDER_STYLES.primary.handle}
                />
                <Text
                  type="secondary"
                  className="dark:text-gray-400 block mt-4 text-xs lg:text-[11px]"
                >
                  拖动滑块设置每日涨跌幅百分比，范围1%-30%
                </Text>
              </div>
            </Form.Item>

            {/* 预设按钮 */}
            <div style={{ marginBottom: 20 }}>
              <Text
                strong
                style={{
                  marginBottom: 12,
                  display: "block",
                }}
                className="text-gray-500 dark:text-gray-400 text-base lg:text-sm"
              >
                快速设置：
              </Text>
              <Space wrap size={spacing}>
                {FORM_CONFIG.PRESETS.map((preset) => {
                  const isActive = dailyReturnValue === preset.value;
                  const isHovered = hoveredPreset === preset.value;

                  return (
                    <Button
                      key={preset.value}
                      size={buttonSize}
                      type={isActive ? "primary" : "default"}
                      className="rounded-xl transition-all duration-300"
                      style={{
                        borderColor: isActive ? preset.color : isHovered ? preset.color : undefined,
                        backgroundColor: isActive ? preset.color : undefined,
                        backgroundImage: isActive ? "none" : undefined,
                        fontWeight: isActive ? "600" : "normal",
                        boxShadow: isActive
                          ? `0 4px 14px ${preset.color}50`
                          : isHovered
                            ? `0 4px 12px ${preset.color}25`
                            : "0 2px 6px rgba(0, 0, 0, 0.05)",
                        transform: isHovered
                          ? "translateY(-3px) scale(1.02)"
                          : "translateY(0) scale(1)",
                        borderRadius: "12px",
                        padding: "0 16px",
                        height: isMobile ? "36px" : "40px",
                      }}
                      onClick={() => handlePresetChange(preset.value)}
                      onMouseEnter={() => setHoveredPreset(preset.value)}
                      onMouseLeave={() => setHoveredPreset(null)}
                    >
                      {preset.label}
                      <Text
                        type="secondary"
                        style={{
                          marginLeft: 6,
                          opacity: 0.85,
                        }}
                        className={`${isActive ? "!text-white/90" : ""} text-xs lg:text-[11px]`}
                      >
                        ({preset.subLabel})
                      </Text>
                    </Button>
                  );
                })}
              </Space>
            </div>

            {/* 连板数量滑块 */}
            <Form.Item
              name="boardCount"
              {...getFieldValidation("boardCount")}
              style={{ marginBottom: 8 }}
            >
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                <Space size="small" style={{ marginBottom: 12 }} className="whitespace-nowrap">
                  <Text strong className="dark:text-gray-200 text-base lg:text-sm">
                    连板数量
                  </Text>
                  <Text type="secondary" className="dark:text-gray-400 text-xs lg:text-[11px]">
                    (天)
                  </Text>
                </Space>
                <Slider
                  min={1}
                  max={15}
                  step={1}
                  marks={FORM_CONFIG.BOARD_SLIDER_MARKS}
                  value={boardCountValue}
                  onChange={(value) => handleFieldChange("boardCount", value)}
                  tooltip={{
                    formatter: (val) => `${val}天`,
                    className: "rounded-lg",
                  }}
                  className="custom-slider"
                  trackStyle={SLIDER_STYLES.primary.track}
                  handleStyle={SLIDER_STYLES.primary.handle}
                />
                <Text
                  type="secondary"
                  className="dark:text-gray-400 block mt-4 text-xs lg:text-[11px]"
                >
                  拖动滑块设置连续涨停/跌停天数，范围1-15天
                </Text>
              </div>
            </Form.Item>
          </div>
        </Form>
      </Card>
    );
  },
);

CalculationForm.displayName = "CalculationForm";
