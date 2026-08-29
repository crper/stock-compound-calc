/**
 * 图表容器组件
 * 直接展示图表，不使用额外的 Card 包装
 */
import { Alert, Flex } from "antd";
import React, { Suspense, useState, lazy } from "react";
import { useTranslation } from "react-i18next";
import { ChartTypeSelector, type ChartType } from "./ChartTypeSelector";
import { LoadingState } from "@/components/shared/ui";
import type { CalculationResult } from "@/types";
import { Typography } from "antd";
import { LAYOUT_CONSTANTS } from "@/constants/layout";

// Recharts 体积较大，按需加载，避免拖慢首屏
const BasicChart = lazy(async () => {
  const module = await import("./BasicChart");
  return { default: module.BasicChart };
});

const { Title } = Typography;

interface ChartContainerProps {
  results: { up: CalculationResult; down: CalculationResult };
  isMobile: boolean;
}

/**
 * 图表组件包装器，带有加载状态
 */
const ChartWrapper: React.FC<{
  results: { up: CalculationResult; down: CalculationResult };
  isMobile: boolean;
  chartType: ChartType;
}> = React.memo(({ results, isMobile, chartType }) => {
  const { t } = useTranslation();

  return (
    <Suspense
      fallback={
        <LoadingState loading text={t("stockCalculator.charts.loading")} showOverlay={false}>
          <div className="h-[400px] bg-gray-50 dark:bg-gray-800 rounded-lg" />
        </LoadingState>
      }
    >
      <div style={{ minHeight: isMobile ? 300 : 400 }}>
        <BasicChart results={results} isMobile={isMobile} chartType={chartType} />
      </div>
    </Suspense>
  );
});

ChartWrapper.displayName = "ChartWrapper";

export const ChartContainer: React.FC<ChartContainerProps> = React.memo(({ results, isMobile }) => {
  const { t } = useTranslation();
  const [chartType, setChartType] = useState<ChartType>("BAR");

  // 数据是否可直接渲染 —— 纯派生值，渲染期算出即可，无需 state + effect
  const hasError = !(results?.up?.dailyDetails && results?.down?.dailyDetails);

  return (
    <Flex
      vertical
      gap={LAYOUT_CONSTANTS.spacing.md}
      className="bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-5 border border-gray-100 dark:border-gray-700"
    >
      <Flex justify="space-between" align="center" wrap gap={LAYOUT_CONSTANTS.spacing.md}>
        {/* 图表区位于结果卡片（h2）内部，语义上用 h3，字号由 className 固定 */}
        <Title
          level={3}
          className="!m-0 !text-base text-gray-800 dark:text-gray-100 flex items-center gap-2"
          style={{
            fontWeight: 600,
          }}
        >
          <span className="text-xl">📊</span>
          <span>{t("stockCalculator.charts.title")}</span>
        </Title>
        <ChartTypeSelector value={chartType} onChange={setChartType} isMobile={isMobile} />
      </Flex>

      {hasError && (
        <Alert
          title={t("stockCalculator.charts.error.title")}
          description={t("stockCalculator.charts.error.message")}
          type="error"
          showIcon
          className="shake rounded-xl"
        />
      )}

      {!hasError && <ChartWrapper results={results} isMobile={isMobile} chartType={chartType} />}
    </Flex>
  );
});

ChartContainer.displayName = "ChartContainer";
