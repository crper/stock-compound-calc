/**
 * 计算结果概览卡片组件（重构版）
 * 优化信息架构，支持移动端折叠
 */
import { RiseOutlined, FallOutlined } from "@ant-design/icons";
import { Card, Tag, Typography } from "antd";
import type { CalculationResult } from "@/types";
import { TREND_COLORS } from "@/constants";
import { formatCurrency, formatPercentage } from "@/utils/formatters";
import { PriceChangeSection } from "./PriceChangeSection";
import { PositionChangeSection } from "./PositionChangeSection";
import { MetricsGrid } from "./MetricsGrid";
import { CollapseButton } from "./CollapseButton";
import React, { useState } from "react";

const { Text } = Typography;

interface ResultOverviewCardProps {
  result: CalculationResult;
  type: "up" | "down";
  isMobile: boolean;
  params?: {
    initialPrice: number;
    boardCount: number;
    dailyReturn: number;
    stockQuantity?: number;
  };
  defaultExpanded?: boolean;
}

export const ResultOverviewCard: React.FC<ResultOverviewCardProps> = React.memo(
  ({ result, type, isMobile, params, defaultExpanded = false }) => {
    const isUp = type === "up";
    const IconComponent = isUp ? RiseOutlined : FallOutlined;
    const title = isUp ? "连续涨停" : "连续跌停";
    const colors = isUp ? TREND_COLORS.up : TREND_COLORS.down;

    // 移动端折叠状态
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    // 桌面端始终展开，移动端可折叠
    const showDetails = !isMobile || isExpanded;

    return (
      <Card
        size={isMobile ? "default" : "small"}
        title={
          <div className="flex items-center justify-between text-base">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-lg ${isUp ? "bg-red-100 dark:bg-red-900/30" : "bg-green-100 dark:bg-green-900/30"} flex items-center justify-center`}
              >
                <IconComponent
                  className={`${isUp ? "text-red-500 dark:text-red-400" : "text-green-500 dark:text-green-400"}`}
                />
              </div>
              <span className="font-semibold text-gray-800 dark:text-gray-100">{title}</span>
            </div>
            {params && (
              <Tag
                color={isUp ? "success" : "error"}
                className="m-0 text-xs font-medium rounded-full px-3 py-0.5"
              >
                {params.boardCount} 天
              </Tag>
            )}
          </div>
        }
        classNames={{
          header: `${colors.bg} ${colors.border} border-b px-5 py-3 rounded-t-xl`,
          body: `p-5 md:p-6 bg-white dark:bg-gray-800 rounded-b-xl`,
        }}
        hoverable
        className={`rounded-xl border-2 ${colors.border} overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
      >
        {/* 摘要区 - 始终显示 */}
        <div className={`text-center p-5 rounded-lg border ${colors.bg} ${colors.border}`}>
          <Text className="block text-xs text-gray-500 dark:text-gray-400 mb-2">最终股价</Text>
          <div
            className={`font-bold mb-1 font-mono tracking-tight ${colors.text} ${
              result.finalPrice >= 10000000 ? "text-2xl" : "text-3xl"
            }`}
          >
            {formatCurrency(result.finalPrice, {
              compact: result.finalPrice >= 100000000,
            })}
          </div>
          <Text className={`text-base font-medium ${colors.text}`}>
            {formatPercentage(result.totalReturn, {
              multiply: false,
              showPlus: true,
            })}
          </Text>
        </div>

        {/* 详情区 - 桌面端始终显示，移动端可折叠 */}
        {showDetails && (
          <div className="mt-5 space-y-4">
            {/* 股价变化 */}
            {params && (
              <PriceChangeSection
                initialPrice={params.initialPrice}
                finalPrice={result.finalPrice}
                totalReturn={result.totalReturn}
                isUp={isUp}
              />
            )}

            {/* 持仓变化（有股数时显示） */}
            {result.positionValue && result.positionGain !== undefined && params?.stockQuantity && (
              <PositionChangeSection
                positionValue={result.positionValue}
                positionGain={result.positionGain}
                stockQuantity={params.stockQuantity}
                isUp={isUp}
              />
            )}

            {/* 关键指标 */}
            {params && (
              <MetricsGrid
                metrics={result.keyMetrics}
                dailyReturn={params.dailyReturn}
                boardCount={params.boardCount}
                isMobile={isMobile}
              />
            )}
          </div>
        )}

        {/* 移动端折叠按钮 */}
        {isMobile && (
          <CollapseButton isExpanded={isExpanded} onClick={() => setIsExpanded(!isExpanded)} />
        )}
      </Card>
    );
  },
);

ResultOverviewCard.displayName = "ResultOverviewCard";
