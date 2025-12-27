/**
 * 计算结果概览卡片组件
 * 显示涨停/跌停的汇总信息
 */
import { RiseOutlined, FallOutlined } from "@ant-design/icons";
import { Card, Col, Divider, Row, Tag, Typography } from "antd";
import React from "react";
import type { CalculationResult } from "@/shared/types";
import { TREND_COLORS } from "@/shared/constants";
import { formatCurrency, formatPercentage } from "@/shared/utils/formatters";

const { Text } = Typography;

interface ResultOverviewCardProps {
  result: CalculationResult;
  type: "up" | "down";
  isMobile: boolean;
  params?: {
    initialPrice: number;
    boardCount: number;
    dailyReturn: number;
  };
}

export const ResultOverviewCard: React.FC<ResultOverviewCardProps> = React.memo(
  ({ result, type, isMobile, params }) => {
    const isUp = type === "up";
    const IconComponent = isUp ? RiseOutlined : FallOutlined;
    const title = isUp ? "连续涨停" : "连续跌停";
    const colors = isUp ? TREND_COLORS.up : TREND_COLORS.down;

    return (
      <Card
        size={isMobile ? "default" : "small"}
        title={
          <div className="flex items-center justify-between text-base">
            <div className="flex items-center gap-2">
              <IconComponent />
              <span className="font-semibold text-gray-800 dark:text-gray-100">{title}</span>
            </div>
            {params && (
              <Tag color={isUp ? "success" : "error"} className="m-0 text-xs font-medium border-0">
                {params.boardCount} 天
              </Tag>
            )}
          </div>
        }
        classNames={{
          header: `${colors.bg} ${colors.border} border-b px-5 py-2.5`,
          body: `p-5 md:p-6 bg-white dark:bg-gray-800`,
        }}
        hoverable
        className={`scale-in rounded-lg border-2 ${colors.border} overflow-hidden`}
      >
        {/* 最终股价 - 核心数据 */}
        <div className={`text-center mb-6 p-5 rounded-lg border ${colors.bg} ${colors.border}`}>
          <Text className="block text-xs text-gray-500 dark:text-gray-400 mb-3">最终股价</Text>
          <div
            className={`font-semibold mb-2 font-mono tracking-tighter leading-tight count-up ${colors.text} ${
              result.finalPrice >= 10000000 ? "text-2xl md:text-3xl" : "text-4xl md:text-5xl"
            }`}
          >
            {formatCurrency(result.finalPrice, { compact: result.finalPrice >= 100000000 })}
          </div>
          <Text className={`text-lg font-medium ${colors.text}`}>
            {formatPercentage(result.totalReturn, { multiply: false })}
          </Text>
        </div>

        <Divider className={`my-5 ${colors.divider}`} />

        {/* 详细数据 */}
        <Row gutter={[isMobile ? 16 : 20, isMobile ? 16 : 20]}>
          <Col span={12}>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md border border-transparent dark:border-gray-700">
              <Text className="block text-xs text-gray-500 dark:text-gray-400 mb-2">
                总收益金额
              </Text>
              <div
                className={`font-semibold font-mono tracking-tight leading-snug count-up ${colors.text} ${
                  Math.abs(result.totalGain) >= 1000000
                    ? "text-lg md:text-xl"
                    : "text-xl md:text-2xl"
                }`}
              >
                {formatCurrency(result.totalGain, {
                  compact: Math.abs(result.totalGain) >= 1000000,
                })}
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md border border-transparent dark:border-gray-700">
              <Text className="block text-xs text-gray-500 dark:text-gray-400 mb-2">总收益率</Text>
              <div
                className={`text-xl md:text-2xl font-semibold font-mono tracking-tight leading-snug count-up ${colors.text}`}
              >
                {formatPercentage(result.totalReturn, { multiply: false })}
              </div>
            </div>
          </Col>
        </Row>

        {/* 计算条件提示 */}
        {params && (
          <div className={`mt-5 pt-4 border-t border-dashed ${colors.divider}`}>
            <Row gutter={[isMobile ? 12 : 16, 0]}>
              <Col span={8}>
                <Text className="block text-xs text-gray-400 dark:text-gray-500 mb-1">
                  连板天数
                </Text>
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {params.boardCount}
                </Text>
              </Col>
              <Col span={8}>
                <Text className="block text-xs text-gray-400 dark:text-gray-500 mb-1">涨跌幅</Text>
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {Math.abs(params.dailyReturn)}%
                </Text>
              </Col>
              <Col span={8}>
                <Text className="block text-xs text-gray-400 dark:text-gray-500 mb-1">起始价</Text>
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {formatCurrency(params.initialPrice, { compact: params.initialPrice >= 1000000 })}
                </Text>
              </Col>
            </Row>
          </div>
        )}
      </Card>
    );
  },
);

ResultOverviewCard.displayName = "ResultOverviewCard";
