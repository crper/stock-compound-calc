/**
 * 计算结果概览卡片组件
 * 显示涨停/跌停的汇总信息
 */
import { RiseOutlined, FallOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Card, Col, Divider, Row, Tag, Tooltip, Typography } from "antd";
import type { CalculationResult } from "@/shared/types";
import { TREND_COLORS } from "@/shared/constants";
import { formatCurrency, formatPercentage } from "@/shared/utils/formatters";
import React from "react";

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
    const metrics = result.keyMetrics;

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

        {/* 关键指标区域 */}
        {metrics && (
          <>
            <Divider className={`my-5 ${colors.divider}`} />
            <div className="mt-5">
              <div className="flex items-center gap-2 mb-4">
                <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  关键指标
                </Text>
                <Tooltip title="关键指标帮助您快速评估投资潜力和风险">
                  <InfoCircleOutlined className="text-gray-400 text-[13px]" />
                </Tooltip>
              </div>
              <Row gutter={[isMobile ? 12 : 16, isMobile ? 12 : 16]}>
                {/* 翻倍天数 */}
                {metrics.doubleDays !== null && (
                  <Col span={isMobile ? 12 : 8}>
                    <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-md border border-green-200 dark:border-green-800">
                      <Text className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                        翻倍天数
                      </Text>
                      <Tooltip
                        title={`以 ${Math.abs(params?.dailyReturn || 0)}% 涨跌幅，需要 ${metrics.doubleDays} 天翻倍`}
                      >
                        <Text className="text-base md:text-lg font-bold text-green-600 dark:text-green-400">
                          {metrics.doubleDays} 天
                        </Text>
                      </Tooltip>
                    </div>
                  </Col>
                )}

                {/* 盈亏平衡回撤 */}
                {metrics.breakEvenReturn !== null && (
                  <Col span={isMobile ? 12 : 8}>
                    <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-md border border-orange-200 dark:border-orange-800">
                      <Text className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                        盈亏平衡回撤
                      </Text>
                      <Tooltip title={`回到初始价需要下跌 ${metrics.breakEvenReturn.toFixed(2)}%`}>
                        <Text className="text-base md:text-lg font-bold text-orange-600 dark:text-orange-400">
                          {formatPercentage(Math.abs(metrics.breakEvenReturn), { multiply: false })}
                        </Text>
                      </Tooltip>
                    </div>
                  </Col>
                )}

                {/* 10倍天数 */}
                {metrics.tenXDays !== null && (
                  <Col span={isMobile ? 12 : 8}>
                    <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-md border border-purple-200 dark:border-purple-800">
                      <Text className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                        10倍天数
                      </Text>
                      <Tooltip
                        title={`以 ${Math.abs(params?.dailyReturn || 0)}% 涨跌幅，需要 ${metrics.tenXDays} 天达到10倍`}
                      >
                        <Text className="text-base md:text-lg font-bold text-purple-600 dark:text-purple-400">
                          {metrics.tenXDays} 天
                        </Text>
                      </Tooltip>
                    </div>
                  </Col>
                )}

                {/* 年化收益率 */}
                {metrics.annualizedReturn !== null && (
                  <Col span={isMobile ? 12 : 8}>
                    <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-md border border-blue-200 dark:border-blue-800">
                      <Text className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                        年化收益率
                      </Text>
                      <Tooltip title={`按 ${params?.boardCount} 天计算的年化收益率`}>
                        <Text className="text-base md:text-lg font-bold text-blue-600 dark:text-blue-400">
                          {formatPercentage(Math.abs(metrics.annualizedReturn), {
                            multiply: false,
                          })}
                        </Text>
                      </Tooltip>
                    </div>
                  </Col>
                )}
              </Row>
            </div>
          </>
        )}

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
