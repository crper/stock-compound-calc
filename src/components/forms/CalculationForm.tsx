import { FORM_CONFIG, DEFAULT_VALUES } from "@/constants";
import { CARD_STYLES, SLIDER_STYLES } from "@/constants/uiPatterns";
import { useResponsive } from "@/hooks/useResponsive";
import type { CalculationParams } from "@/types";
import { getFieldValidationKey, isFieldValid } from "@/utils/validator";
import type { InputNumberProps } from "antd";
import { Alert, Button, Card, Form, InputNumber, Slider, Space, Typography } from "antd";
import type { FormInstance } from "antd/es/form";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

const { Text, Title } = Typography;

// 股票数量输入解析：去除千分位逗号后返回数字；无法解析时返回原字符串，
// rc-input-number 内部会判定为 NaN 而不触发 value 更新（保持输入框文本）
const parseQuantity: NonNullable<InputNumberProps["parser"]> = (displayValue) => {
  if (!displayValue) return "";
  const cleaned = displayValue.replace(/,/g, "");
  const parsed = Number(cleaned);
  return Number.isNaN(parsed) ? cleaned : parsed;
};

// 初始股价解析：去除货币符号/单位/千分位；清空或无法解析时返回原字符串，
// 避免清空输入框后又被强制回填边界值
const parsePrice: NonNullable<InputNumberProps["parser"]> = (displayValue) => {
  if (!displayValue) return "";
  const cleaned = displayValue.replace(/¥\s?|元|,/g, "");
  const parsed = Number(cleaned);
  return Number.isNaN(parsed) ? cleaned : parsed;
};

interface CalculationFormProps {
  form: FormInstance<CalculationParams>;
  onValuesChange: (changedValues: Partial<CalculationParams>, allValues: CalculationParams) => void;
  error?: string | null;
}

export const CalculationForm: React.FC<CalculationFormProps> = React.memo(
  ({ form, onValuesChange, error = null }) => {
    const { t } = useTranslation();
    const { isMobile, size: responsiveSize, cardSize, spacing, buttonSize } = useResponsive();
    const [hoveredPreset, setHoveredPreset] = useState<number | null>(null);

    // useWatch 仅用于展示（初始市值、预设按钮激活态高亮），不参与计算触发
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

        const validationKey = getFieldValidationKey(fieldName, value);
        return {
          validateStatus: isValid ? ("success" as const) : ("error" as const),
          help: isValid ? "" : validationKey ? t(validationKey) : "",
        };
      },
      [t, dailyReturnValue, boardCountValue, initialPriceValue, stockQuantityValue],
    );

    // 一次性取各字段的校验状态，JSX 中显式传入 validateStatus/help，避免 props 展开
    const initialPriceValidation = getFieldValidation("initialPrice");
    const stockQuantityValidation = getFieldValidation("stockQuantity");
    const dailyReturnValidation = getFieldValidation("dailyReturn");
    const boardCountValidation = getFieldValidation("boardCount");

    // 预设按钮位于 Form.Item 之外，无法由 antd 注入 value/onChange，
    // 这里先写回 form store（单一数据源），再用 store 的最新值触发一次计算
    const handlePresetChange = useCallback(
      (value: number) => {
        form.setFieldsValue({ dailyReturn: value });
        onValuesChange({ dailyReturn: value }, form.getFieldsValue());
      },
      [form, onValuesChange],
    );

    return (
      <Card
        size={cardSize}
        title={
          <div className="flex items-center justify-between">
            {/* 语义层级用 h2，视觉字号由 className 固定 */}
            <Title level={2} className="!m-0 dark:text-gray-100 text-lg lg:text-base font-semibold">
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
            title={t("stockCalculator.errors.inputError")}
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
            initialPrice: DEFAULT_VALUES.INITIAL_PRICE,
            boardCount: DEFAULT_VALUES.BOARD_COUNT,
            dailyReturn: DEFAULT_VALUES.DAILY_RETURN,
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
              validateStatus={initialPriceValidation.validateStatus}
              help={initialPriceValidation.help}
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
                formatter={(value) => `${value}`.replace(/\B(?=(?:\d{3})+(?!\d))/g, ",")}
                parser={parsePrice}
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
              validateStatus={stockQuantityValidation.validateStatus}
              help={stockQuantityValidation.help}
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
                formatter={(value) => `${value}`.replace(/\B(?=(?:\d{3})+(?!\d))/g, ",")}
                parser={parseQuantity}
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

            {/* 涨跌幅滑动条：Form.Item 直接包裹 Slider，value/onChange 由 antd 注入，
                样式容器放在 Form.Item 外层，避免包装层导致注入断链 */}
            <div
              className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 border border-gray-100 dark:border-gray-700"
              style={{ marginBottom: 28 }}
            >
              <Space size="small" style={{ marginBottom: 12 }} className="whitespace-nowrap">
                <Text strong className="dark:text-gray-200 text-base lg:text-sm">
                  {t("stockCalculator.form.dailyReturn")}
                </Text>
                <Text type="secondary" className="dark:text-gray-400 text-xs lg:text-[11px]">
                  ({t("stockCalculator.form.units.percent")})
                </Text>
              </Space>
              <Form.Item
                name="dailyReturn"
                validateStatus={dailyReturnValidation.validateStatus}
                help={dailyReturnValidation.help}
                style={{ marginBottom: 0 }}
              >
                <Slider
                  min={1}
                  max={30}
                  step={1}
                  marks={FORM_CONFIG.RETURN_SLIDER_MARKS}
                  // 滑块需要有可访问名称，否则读屏/axe 会把它识别为无名控件
                  ariaLabelForHandle={t("stockCalculator.form.dailyReturn")}
                  tooltip={{
                    formatter: (val) => `${val}%`,
                    placement: "top",
                    className: "rounded-lg",
                  }}
                  className="custom-slider"
                  styles={SLIDER_STYLES.primary}
                />
              </Form.Item>
              <Text
                type="secondary"
                className="dark:text-gray-400 block mt-4 text-xs lg:text-[11px]"
              >
                {t("stockCalculator.form.sliderDescriptions.dailyReturn")}
              </Text>
            </div>

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
                      size={isMobile ? "small" : buttonSize}
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
                      {preset.value === 10
                        ? t("stockCalculator.form.presets.mainBoard")
                        : preset.value === 20
                          ? t("stockCalculator.form.presets.starMarket")
                          : t("stockCalculator.form.presets.bex")}
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

            {/* 连板数量滑块：同上，Form.Item 直接包裹 Slider */}
            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
              <Space size="small" style={{ marginBottom: 12 }} className="whitespace-nowrap">
                <Text strong className="dark:text-gray-200 text-base lg:text-sm">
                  {t("stockCalculator.form.boardCount")}
                </Text>
                <Text type="secondary" className="dark:text-gray-400 text-xs lg:text-[11px]">
                  ({t("stockCalculator.form.units.days")})
                </Text>
              </Space>
              <Form.Item
                name="boardCount"
                validateStatus={boardCountValidation.validateStatus}
                help={boardCountValidation.help}
                style={{ marginBottom: 0 }}
              >
                <Slider
                  min={1}
                  max={15}
                  step={1}
                  marks={{
                    1: `1${t("stockCalculator.results.overview.days")}`,
                    5: `5${t("stockCalculator.results.overview.days")}`,
                    10: `10${t("stockCalculator.results.overview.days")}`,
                    15: `15${t("stockCalculator.results.overview.days")}`,
                  }}
                  ariaLabelForHandle={t("stockCalculator.form.boardCount")}
                  tooltip={{
                    formatter: (val) => t("stockCalculator.results.overview.days", { count: val }),
                    className: "rounded-lg",
                  }}
                  className="custom-slider"
                  styles={SLIDER_STYLES.primary}
                />
              </Form.Item>
              <Text
                type="secondary"
                className="dark:text-gray-400 block mt-4 text-xs lg:text-[11px]"
              >
                {t("stockCalculator.form.sliderDescriptions.boardCount")}
              </Text>
            </div>
          </div>
        </Form>
      </Card>
    );
  },
);

CalculationForm.displayName = "CalculationForm";
