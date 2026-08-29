/**
 * 持仓变化展示组件
 * 显示持仓市值变化和盈亏
 */
import { Typography } from "antd";
import { TREND_COLORS } from "@/constants";
import { formatCurrency, formatPercentage } from "@/utils/formatters";
import React from "react";
import { useTranslation } from "react-i18next";

const { Text } = Typography;

interface PositionChangeSectionProps {
  positionValue: {
    initial: number;
    final: number;
  };
  positionGain: number;
  stockQuantity: number;
  isUp: boolean;
}

export const PositionChangeSection: React.FC<PositionChangeSectionProps> = React.memo(
  ({ positionValue, positionGain, stockQuantity, isUp }) => {
    const { t } = useTranslation();
    const colors = isUp ? TREND_COLORS.up : TREND_COLORS.down;
    const bgColorClass = `${colors.bg} ${colors.border}`;
    const textColorClass = colors.text;

    return (
      <div className={`rounded-lg p-4 border ${bgColorClass}`}>
        <Text className="block text-xs text-gray-500 dark:text-gray-400 mb-3">
          {t("stockCalculator.results.positionChange.title")}
          <span className="ml-2 text-gray-400">
            ({stockQuantity}
            {t("stockCalculator.results.positionChange.shares")})
          </span>
        </Text>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <Text className="block text-xs text-gray-400 dark:text-gray-500 mb-1">
              {t("stockCalculator.results.positionChange.initialMarketValue")}
            </Text>
            <Text className="text-base font-semibold font-mono text-gray-700 dark:text-gray-200">
              {formatCurrency(positionValue.initial, {
                compact: positionValue.initial >= 10000000,
              })}
            </Text>
          </div>

          <div className="text-center">
            <Text className="block text-xs text-gray-400 dark:text-gray-500 mb-1">
              {t("stockCalculator.results.positionChange.finalMarketValue")}
            </Text>
            <Text className={`text-base font-semibold font-mono ${textColorClass}`}>
              {formatCurrency(positionValue.final, {
                compact: positionValue.final >= 10000000,
              })}
            </Text>
          </div>
        </div>

        <div
          className={`text-center p-3 rounded-lg ${
            isUp ? "bg-red-100 dark:bg-red-900/30" : "bg-green-100 dark:bg-green-900/30"
          }`}
        >
          <Text className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
            {t("stockCalculator.results.positionChange.profitLoss")}
          </Text>
          <Text className={`text-2xl font-bold font-mono tracking-tight ${textColorClass}`}>
            {formatCurrency(positionGain, {
              compact: Math.abs(positionGain) >= 10000000,
              showPlus: true,
            })}
          </Text>
          <Text className={`text-sm ${textColorClass} ml-2`}>
            (
            {formatPercentage((positionGain / positionValue.initial) * 100, {
              multiply: false,
              showPlus: true,
            })}
            )
          </Text>
        </div>
      </div>
    );
  },
);

PositionChangeSection.displayName = "PositionChangeSection";
