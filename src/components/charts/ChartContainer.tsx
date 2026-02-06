/**
 * 图表容器组件
 * 直接展示图表，不使用额外的 Card 包装
 */
import { Alert, Flex } from "antd";
import React, { Suspense, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BasicChart } from "./BasicChart";
import { ChartTypeSelector, type ChartType } from "./ChartTypeSelector";
import { LoadingState } from "@/components/shared/ui";
import type { CalculationResult } from "@/types";
import { Typography } from "antd";
import { LAYOUT_CONSTANTS } from "@/constants/layout";

const { Title } = Typography;

interface ChartContainerProps {
  results: { up: CalculationResult; down: CalculationResult };
  isMobile: boolean;
}

/**
 * 图表组件包装器，带有错误处理和加载状态
 */
const ChartWrapper: React.FC<{
  results: { up: CalculationResult; down: CalculationResult };
  isMobile: boolean;
  chartType: ChartType;
}> = React.memo(({ results, isMobile, chartType }) => {
  const { t } = useTranslation();

  if (!results?.up?.dailyDetails || !results?.down?.dailyDetails) {
    return (
      <div
        style={{
          height: "400px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "8px",
        }}
        className="bg-gray-50 dark:bg-gray-800"
      >
        <span className="text-gray-400 dark:text-gray-500 text-xs sm:text-sm">
          {t("stockCalculator.charts.noData")}
        </span>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <LoadingState loading text={t("stockCalculator.charts.loading")} showOverlay={false}>
          <div className="h-[400px] bg-gray-50 dark:bg-gray-800 rounded-lg" />
        </LoadingState>
      }
    >
      <BasicChart results={results} isMobile={isMobile} chartType={chartType} />
    </Suspense>
  );
});

ChartWrapper.displayName = "ChartWrapper";

export const ChartContainer: React.FC<ChartContainerProps> = React.memo(({ results, isMobile }) => {
  const { t } = useTranslation();
  const [hasError, setHasError] = React.useState(false);
  const [chartType, setChartType] = useState<ChartType>("BAR");

  useEffect(() => {
    setHasError(false);

    try {
      if (!results?.up?.dailyDetails || !results?.down?.dailyDetails) {
        setHasError(true);
      }
    } catch (error) {
      console.error("ChartContainer: 数据验证失败", error);
      setHasError(true);
    }
  }, [results]);

  return (
    <Flex vertical gap={LAYOUT_CONSTANTS.spacing.md} className="bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
      <Flex justify="space-between" align="center" wrap gap={LAYOUT_CONSTANTS.spacing.md}>
        <Title
          level={5}
          className="!m-0 text-gray-800 dark:text-gray-100 flex items-center gap-2"
          style={{
            fontWeight: 600,
          }}
        >
          <span className="text-xl">📊</span>
          <span>{t("stockCalculator.charts.title")}</span>
        </Title>
        <ChartTypeSelector value={chartType} onChange={setChartType} />
      </Flex>

      {hasError && (
        <Alert
          message={t("stockCalculator.charts.error.title")}
          description={t("stockCalculator.charts.error.message")}
          type="error"
          showIcon
          className="shake rounded-xl"
        />
      )}

      <ChartWrapper results={results} isMobile={isMobile} chartType={chartType} />
    </Flex>
  );
});

ChartContainer.displayName = "ChartContainer";
