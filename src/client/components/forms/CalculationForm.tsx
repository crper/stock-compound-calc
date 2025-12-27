import type { FormInstance } from "antd/es/form";
import type { CalculationParams } from "@/shared/types";
import { Alert, Button, Card, Form, InputNumber, Slider, Space, Typography } from "antd";
import React, { useCallback, useState } from "react";
import { useResponsiveConfig } from "@/client/hooks/useResponsiveConfig";
import { getFieldErrorMessage } from "@/shared/utils/validator";
import { PRESET_VALUES } from "@/shared/constants";

const { Text, Title } = Typography;

interface CalculationFormProps {
  form: FormInstance<CalculationParams>;
  onValuesChange: (changedValues: Partial<CalculationParams>, allValues: CalculationParams) => void;
  isFieldValid: (value: any, fieldName: keyof CalculationParams) => boolean;
  error?: string | null;
}

export const CalculationForm: React.FC<CalculationFormProps> = React.memo(
  ({ form, onValuesChange, isFieldValid, error = null }) => {
    const responsive = useResponsiveConfig();
    const isMobile = responsive.size === "large";
    const [hoveredPreset, setHoveredPreset] = useState<number | null>(null);

    // 预设按钮配置
    const presets = [
      {
        value: PRESET_VALUES.A_STOCK_MAIN_BOARD,
        label: "A股主板",
        subLabel: "10%",
        color: "#1890ff",
      },
      {
        value: PRESET_VALUES.STAR_MARKET,
        label: "科创板",
        subLabel: "20%",
        color: "#52c41a",
      },
      {
        value: PRESET_VALUES.BEIJING_STOCK_EXCHANGE,
        label: "北交所",
        subLabel: "30%",
        color: "#fa8c16",
      },
    ];

    // 获取字段验证状态和帮助信息
    const getFieldValidation = useCallback(
      (fieldName: keyof CalculationParams) => {
        const value = form.getFieldValue(fieldName);
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
      [form, isFieldValid],
    );

    // 处理值变化并触发计算
    const handleFieldChange = useCallback(
      (fieldName: keyof CalculationParams, value: number | null) => {
        if (value !== null) {
          form.setFieldsValue({ [fieldName]: value });
          const allValues = form.getFieldsValue();
          onValuesChange({ [fieldName]: value }, allValues);
        }
      },
      [form, onValuesChange],
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
        size={responsive.cardSize}
        title={
          <div className="flex items-center justify-between">
            <Title
              level={4}
              className="!m-0 dark:text-gray-100"
              style={{ fontSize: responsive.fontSize.large }}
            >
              计算参数
            </Title>
          </div>
        }
        className="w-full lg:min-w-[400px]"
        style={{
          borderRadius: isMobile ? "8px" : "6px",
        }}
        classNames={{
          header: "bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700",
          body: "flex flex-col p-4 md:p-5 dark:bg-gray-800",
        }}
      >
        {error && (
          <Alert
            title="计算错误"
            description={error}
            type="error"
            showIcon
            closable
            style={{
              marginBottom: 16,
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
                  <Text
                    strong
                    style={{ fontSize: responsive.fontSize.base }}
                    className="dark:text-gray-200"
                  >
                    初始股价
                  </Text>
                  <Text
                    type="secondary"
                    style={{ fontSize: responsive.fontSize.small }}
                    className="dark:text-gray-400"
                  >
                    (元)
                  </Text>
                </Space>
              }
              tooltip="请输入股票的起始价格，最大支持10亿"
              {...getFieldValidation("initialPrice")}
              style={{ marginBottom: isMobile ? 20 : 24 }}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={0.01}
                max={1000000000}
                step={0.01}
                precision={2}
                placeholder="请输入初始股价"
                controls
                size={responsive.size}
                prefix="¥"
                suffix="元"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(value) => {
                  const parsed = value ? Number(value.replace(/¥\s?|元|(,*)/g, "")) : 0.01;
                  return parsed as 0.01 | 1000000000;
                }}
                onChange={(value) => handleFieldChange("initialPrice", value)}
              />
            </Form.Item>

            {/* 涨跌幅滑动条 */}
            <Form.Item
              name="dailyReturn"
              {...getFieldValidation("dailyReturn")}
              style={{ marginBottom: 24 }}
            >
              <div>
                <Space size="small" style={{ marginBottom: 8 }} className="whitespace-nowrap">
                  <Text
                    strong
                    style={{ fontSize: responsive.fontSize.base }}
                    className="dark:text-gray-200"
                  >
                    涨跌幅度
                  </Text>
                  <Text
                    type="secondary"
                    style={{ fontSize: responsive.fontSize.small }}
                    className="dark:text-gray-400"
                  >
                    (%)
                  </Text>
                </Space>
                <Slider
                  min={1}
                  max={30}
                  step={1}
                  marks={{
                    1: "1%",
                    5: "5%",
                    10: "10%",
                    20: "20%",
                    30: "30%",
                  }}
                  value={form.getFieldValue("dailyReturn") || 10}
                  tooltip={{
                    formatter: (val) => `${val}%`,
                    placement: "top",
                  }}
                  onChange={handlePresetChange}
                />
                <Text
                  type="secondary"
                  style={{ fontSize: responsive.fontSize.small }}
                  className="dark:text-gray-400 block mt-6"
                >
                  拖动滑块设置每日涨跌幅百分比，范围1%-30%
                </Text>
              </div>
            </Form.Item>

            {/* 预设按钮 */}
            <div style={{ marginBottom: 16 }}>
              <Text
                strong
                style={{
                  fontSize: responsive.fontSize.base,
                  marginBottom: 8,
                  display: "block",
                }}
                className="text-gray-500 dark:text-gray-400"
              >
                快速设置：
              </Text>
              <Space wrap size={responsive.spacing}>
                {presets.map((preset) => {
                  const isActive = form.getFieldValue("dailyReturn") === preset.value;
                  const isHovered = hoveredPreset === preset.value;

                  return (
                    <Button
                      key={preset.value}
                      size={responsive.buttonSize}
                      type={isActive ? "primary" : "default"}
                      style={{
                        borderColor: isActive ? preset.color : isHovered ? preset.color : undefined,
                        backgroundColor: isActive ? preset.color : undefined,
                        fontWeight: isActive ? "bold" : "normal",
                        boxShadow: isActive
                          ? `0 4px 12px ${preset.color}40`
                          : isHovered
                            ? `0 2px 8px ${preset.color}20`
                            : "none",
                        transform: isHovered && !isActive ? "translateY(-2px)" : "translateY(0)",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                      onClick={() => handlePresetChange(preset.value)}
                      onMouseEnter={() => setHoveredPreset(preset.value)}
                      onMouseLeave={() => setHoveredPreset(null)}
                    >
                      {preset.label}
                      <Text
                        type="secondary"
                        style={{
                          fontSize: responsive.fontSize.small - 2,
                          marginLeft: 4,
                          opacity: 0.8,
                        }}
                        className={isActive ? "text-white" : ""}
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
              <div>
                <Space size="small" style={{ marginBottom: 8 }} className="whitespace-nowrap">
                  <Text
                    strong
                    style={{ fontSize: responsive.fontSize.base }}
                    className="dark:text-gray-200"
                  >
                    连板数量
                  </Text>
                  <Text
                    type="secondary"
                    style={{ fontSize: responsive.fontSize.small }}
                    className="dark:text-gray-400"
                  >
                    (天)
                  </Text>
                </Space>
                <Slider
                  min={1}
                  max={15}
                  step={1}
                  marks={{
                    1: "1天",
                    5: "5天",
                    10: "10天",
                    15: "15天",
                  }}
                  value={form.getFieldValue("boardCount") || 1}
                  onChange={(value) => handleFieldChange("boardCount", value)}
                  tooltip={{ formatter: (val) => `${val}天` }}
                />
                <Text
                  type="secondary"
                  style={{ fontSize: responsive.fontSize.small }}
                  className="dark:text-gray-400 block mt-6"
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
