/**
 * 关键指标网格组件
 * 使用 antd Statistic + Row/Col 呈现 2×2 指标卡片（翻倍天数、盈亏回撤、10倍天数、年化收益），
 * 语义与布局交给 antd 原生组件，不再自造 MetricItem 封装
 */
import { Col, Row, Statistic, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { formatPercentage } from "@/utils/formatters";
import type { KeyMetrics } from "@/types";
import React from "react";
import { useTranslation } from "react-i18next";

interface MetricCfg {
  /** 卡片背景与边框（含深色变体） */
  boxClass: string;
  /** 数值颜色（浅深色模式均清晰可读） */
  color: string;
  /** 指标名称 */
  label: string;
  /** 悬停说明 */
  tooltip?: string;
  /** 展示数值 */
  value: string | number;
}

interface MetricsGridProps {
  metrics: KeyMetrics | undefined;
  dailyReturn: number;
  boardCount: number;
}

export const MetricsGrid: React.FC<MetricsGridProps> = React.memo(
  ({ metrics, dailyReturn, boardCount }) => {
    const { t } = useTranslation();
    if (!metrics) return null;

    const items: MetricCfg[] = [];

    // 翻倍天数
    if (metrics.doubleDays !== null) {
      items.push({
        label: t("stockCalculator.results.metrics.doubleDays"),
        value: `${metrics.doubleDays}${t("stockCalculator.results.overview.days")}`,
        tooltip: t("stockCalculator.results.metrics.dynamicTooltip", {
          return: Math.abs(dailyReturn),
          days: metrics.doubleDays,
          action: t("stockCalculator.results.metrics.doubleAction", { defaultValue: "翻倍" }),
        }),
        color: "#22c55e",
        boxClass: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
      });
    }

    // 盈亏平衡回撤
    if (metrics.breakEvenReturn !== null) {
      items.push({
        label: t("stockCalculator.results.metrics.breakEvenReturn"),
        value: formatPercentage(Math.abs(metrics.breakEvenReturn), { multiply: false }),
        tooltip: t("stockCalculator.results.metrics.breakEvenTooltip", {
          return: Math.abs(metrics.breakEvenReturn).toFixed(2),
        }),
        color: "#f97316",
        boxClass: "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800",
      });
    }

    // 10倍天数
    if (metrics.tenXDays !== null) {
      items.push({
        label: t("stockCalculator.results.metrics.tenXDays"),
        value: `${metrics.tenXDays}${t("stockCalculator.results.overview.days")}`,
        tooltip: t("stockCalculator.results.metrics.tenXTooltip", {
          return: Math.abs(dailyReturn),
          days: metrics.tenXDays,
        }),
        color: "#a855f7",
        boxClass: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800",
      });
    }

    // 年化收益率
    if (metrics.annualizedReturn !== null) {
      items.push({
        label: t("stockCalculator.results.metrics.annualizedReturn"),
        value: formatPercentage(Math.abs(metrics.annualizedReturn), { multiply: false }),
        tooltip: t("stockCalculator.results.metrics.annualizedTooltip", {
          days: boardCount,
        }),
        color: "#3b82f6",
        boxClass: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
      });
    }

    if (items.length === 0) return null;

    return (
      <div className="mt-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {t("stockCalculator.results.metrics.title")}
          </span>
          <Tooltip title={t("stockCalculator.results.metrics.tooltip")}>
            <InfoCircleOutlined className="text-gray-400 text-[13px]" />
          </Tooltip>
        </div>

        <Row gutter={[12, 12]}>
          {items.map((item, index) => (
            <Col key={index} xs={12} lg={6}>
              <div className={`h-full text-center p-3 rounded-lg border ${item.boxClass}`}>
                <Statistic
                  title={
                    <div className="flex items-center justify-center gap-1 flex-wrap">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{item.label}</span>
                      {item.tooltip && (
                        <Tooltip title={item.tooltip}>
                          <InfoCircleOutlined className="text-gray-400 text-[11px]" />
                        </Tooltip>
                      )}
                    </div>
                  }
                  value={item.value}
                  styles={{
                    content: {
                      color: item.color,
                      fontSize: "1.0625rem",
                      fontWeight: 700,
                      lineHeight: "1.25rem",
                    },
                  }}
                />
              </div>
            </Col>
          ))}
        </Row>
      </div>
    );
  },
);

MetricsGrid.displayName = "MetricsGrid";
