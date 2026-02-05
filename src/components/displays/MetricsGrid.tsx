/**
 * 关键指标网格组件
 * 4列网格展示翻倍天数、盈亏回撤、10倍天数、年化收益
 */
import { Tooltip, Typography } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { formatPercentage } from "@/utils/formatters";
import type { KeyMetrics } from "@/types";
import React from "react";

const { Text } = Typography;

interface MetricsGridProps {
  metrics: KeyMetrics | undefined;
  dailyReturn: number;
  boardCount: number;
  isMobile: boolean;
}

interface MetricItemProps {
  label: string;
  value: string | number;
  tooltip?: string;
  colorClass: string;
  bgClass: string;
}

const MetricItem: React.FC<MetricItemProps> = React.memo(
  ({ label, value, tooltip, colorClass, bgClass }) => (
    <div
      className={`text-center p-3 rounded-lg border ${bgClass} ${colorClass}`}
    >
      <div className="flex items-center justify-center gap-1 mb-1">
        <Text className="text-xs text-gray-500 dark:text-gray-400">{label}</Text>
        {tooltip && (
          <Tooltip title={tooltip}>
            <InfoCircleOutlined className="text-gray-400 text-[11px]" />
          </Tooltip>
        )}
      </div>
      <Text className="text-base font-bold">{value}</Text>
    </div>
  ),
);

MetricItem.displayName = "MetricItem";

export const MetricsGrid: React.FC<MetricsGridProps> = React.memo(
  ({ metrics, dailyReturn, boardCount, isMobile }) => {
    if (!metrics) return null;

    const items: MetricItemProps[] = [];

    // 翻倍天数
    if (metrics.doubleDays !== null) {
      items.push({
        label: "翻倍天数",
        value: `${metrics.doubleDays}天`,
        tooltip: `以 ${Math.abs(dailyReturn)}% 涨跌幅，需要 ${metrics.doubleDays} 天翻倍`,
        colorClass: "text-green-600 dark:text-green-400 border-green-200 dark:border-green-800",
        bgClass: "bg-green-50 dark:bg-green-900/20",
      });
    }

    // 盈亏平衡回撤
    if (metrics.breakEvenReturn !== null) {
      items.push({
        label: "盈亏回撤",
        value: formatPercentage(Math.abs(metrics.breakEvenReturn), { multiply: false }),
        tooltip: `回到初始价需要 ${Math.abs(metrics.breakEvenReturn).toFixed(2)}% 的反向变动`,
        colorClass: "text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800",
        bgClass: "bg-orange-50 dark:bg-orange-900/20",
      });
    }

    // 10倍天数
    if (metrics.tenXDays !== null) {
      items.push({
        label: "10倍天数",
        value: `${metrics.tenXDays}天`,
        tooltip: `以 ${Math.abs(dailyReturn)}% 涨跌幅，需要 ${metrics.tenXDays} 天达到10倍`,
        colorClass: "text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800",
        bgClass: "bg-purple-50 dark:bg-purple-900/20",
      });
    }

    // 年化收益率
    if (metrics.annualizedReturn !== null) {
      items.push({
        label: "年化收益",
        value: formatPercentage(Math.abs(metrics.annualizedReturn), {
          multiply: false,
        }),
        tooltip: `按 ${boardCount} 天计算的年化收益率`,
        colorClass: "text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800",
        bgClass: "bg-blue-50 dark:bg-blue-900/20",
      });
    }

    if (items.length === 0) return null;

    // 根据数量决定列数：移动端始终2列，桌面端4列
    const gridCols = isMobile ? 2 : Math.min(items.length, 4);

    return (
      <div className="mt-4">
        <div className="flex items-center gap-2 mb-3">
          <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            关键指标
          </Text>
          <Tooltip title="关键指标帮助您快速评估投资潜力和风险">
            <InfoCircleOutlined className="text-gray-400 text-[13px]" />
          </Tooltip>
        </div>

        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
          }}
        >
          {items.map((item, index) => (
            <MetricItem key={index} {...item} />
          ))}
        </div>
      </div>
    );
  },
);

MetricsGrid.displayName = "MetricsGrid";
