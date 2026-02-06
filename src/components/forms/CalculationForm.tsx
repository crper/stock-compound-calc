import type { FormInstance } from "antd/es/form";
import type { CalculationParams } from "@/types";
import { Alert, Button, Card, Form, InputNumber, Slider, Space, Typography } from "antd";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
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
    const { t } = useTranslation();
    const { isMobile, size: responsiveSize, cardSize, spacing, buttonSize } = useResponsive();
    const [hoveredPreset, setHoveredPreset] = useState<number | null>(null);

    // 使用 Form.useWatch 监听表单值，避免在渲染期间直接调用 form.getFieldValue
    const dailyReturnValue = Form.useWatch("dailyReturn", form) ?? 10;
    const boardCountValue = Form.useWatch("boardCount", form) ?? 1;
    const initialPriceValue = Form.useWatch("initialPrice", form);
    const stockQuantityValue = Form.useWatch("stockQuantity", form);

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
          case "stockQuantity":
            value = stockQuantityValue;
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
      [isFieldValid, dailyReturnValue, boardCountValue, initialPriceValue, stockQuantityValue],
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
            stockQuantity: fieldName === "stockQuantity" ? value : stockQuantityValue,
          };
          onValuesChange({ [fieldName]: value }, allValues);
        }
      },
      [
        form,
        onValuesChange,
        initialPriceValue,
        boardCountValue,
        dailyReturnValue,
        stockQuantityValue,
      ],
    );

    // 处理预设按钮点击
    const handlePresetChange = useCallback(
      (value: number) => {
        handleFieldChange("dailyReturn", value);
      },
      [handleFieldChange],
    );

    // 获取预设按钮的翻译键
    const getPresetTranslationKey = (value: number): string => {
      switch (value) {
        case 10:
          return "stockCalculator.form.presets.mainBoard";
        case 20:
          return "stockCalculator.form.presets.starMarket";
        case 30:
          return "stockCalculator.form.presets.bex";
        default:
          return "";
      }
    };

    return (
      <Card
        size={cardSize}
        title={
          <div className="flex items-center justify-between">
            <Title level={4} className="!m-0 dark:text-gray-100 text-lg lg:text-base font-semibold">
              {t("stockCalculator.form.title")}
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
            message={t("stockCalculator.errors.inputError")}
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
                    {t("stockCalculator.form.initialPrice")}
                  </Text>
                  <Text type="secondary" className="dark:text-gray-400 text-xs lg:text-[11px]">
                    ({t("stockCalculator.form.units.yuan")})
                  </Text>
                </Space>
              }
              tooltip={t("stockCalculator.form.tooltips.initialPrice")}
              {...getFieldValidation("initialPrice")}
              style={{ marginBottom: isMobile ? 16 : 20 }}
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
                placeholder={t("stockCalculator.form.placeholders.initialPrice")}
                controls
                size={responsiveSize}
                prefix="¥"
                suffix={t("stockCalculator.form.units.yuan")}
                className="hover:border-blue-400 focus:border-blue-500 transition-colors duration-300"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(value: string | undefined): number => {
                  const parsed = value ? Number(value.replace(/¥\s?|元|(,*)/g, "")) : 0.01;
                  return Math.max(0.01, Math.min(1000000000, parsed));
                }}
                onChange={(value) => handleFieldChange("initialPrice", value)}
              />
            </Form.Item>

            {/* 股票数量输入 */}
            <Form.Item
              name="stockQuantity"
              label={
                <Space size="small" className="whitespace-nowrap">
                  <Text strong className="dark:text-gray-200 text-base lg:text-sm">
                    {t("stockCalculator.form.stockQuantity")}
                  </Text>
                  <Text type="secondary" className="dark:text-gray-400 text-xs lg:text-[11px]">
                    ({t("stockCalculator.form.units.shares")})
                  </Text>
                </Space>
              }
              tooltip={t("stockCalculator.form.tooltips.stockQuantity")}
              {...getFieldValidation("stockQuantity")}
              style={{ marginBottom: isMobile ? 16 : 20 }}
            >
              <InputNumber
                style={{
                  width: "100%",
                  borderRadius: "10px",
                }}
                min={1}
                max={10000000000}
                step={1000}
                precision={0}
                placeholder={t("stockCalculator.form.placeholders.stockQuantity")}
                controls
                size={responsiveSize}
                suffix={t("stockCalculator.form.units.shares")}
                className="hover:border-blue-400 focus:border-blue-500 transition-colors duration-300"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(value: string | undefined): number | undefined => {
                  if (!value) return undefined;
                  const parsed = Number(value.replace(/,/g, ""));
                  return isNaN(parsed) ? undefined : parsed;
                }}
                onChange={(value) => handleFieldChange("stockQuantity", value)}
              />
            </Form.Item>

            {/* 初始市值显示（当有数量时） */}
            {initialPriceValue && stockQuantityValue && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-3 border border-blue-200 dark:border-blue-800 mb-5">
                <div className="flex justify-between items-center">
                  <Text className="text-sm text-gray-600 dark:text-gray-400">
                    {t("stockCalculator.form.initialMarketValue")}
                  </Text>
                  <Text strong className="text-base text-blue-600 dark:text-blue-400">
                    ¥
                    {(initialPriceValue * stockQuantityValue).toLocaleString("zh-CN", {
                      maximumFractionDigits: 2,
                    })}
                  </Text>
                </div>
              </div>
            )}

            {/* 涨跌幅滑动条 */}
            <Form.Item
              name="dailyReturn"
              {...getFieldValidation("dailyReturn")}
              style={{ marginBottom: 28 }}
            >
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                <Space size="small" style={{ marginBottom: 12 }} className="whitespace-nowrap">
                  <Text strong className="dark:text-gray-200 text-base lg:text-sm">
                    {t("stockCalculator.form.dailyReturn")}
                  </Text>
                  <Text type="secondary" className="dark:text-gray-400 text-xs lg:text-[11px]">
                    ({t("stockCalculator.form.units.percent")})
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
                  {t("stockCalculator.form.sliderDescriptions.dailyReturn")}
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
                {t("stockCalculator.form.presets.label")}
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
                      {t(getPresetTranslationKey(preset.value))}
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
                    {t("stockCalculator.form.boardCount")}
                  </Text>
                  <Text type="secondary" className="dark:text-gray-400 text-xs lg:text-[11px]">
                    ({t("stockCalculator.form.units.days")})
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
                    formatter: (val) => t("stockCalculator.results.overview.days", { count: val }),
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
                  {t("stockCalculator.form.sliderDescriptions.boardCount")}
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
