/**
 * 持仓变化展示组件
 * 显示持仓市值变化和盈亏
 */
import { Typography } from "antd";
import { formatCurrency, formatPercentage } from "@/utils/formatters";
import React from "react";

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
    const bgColorClass = isUp
      ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
      : "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
    const textColorClass = isUp
      ? "text-red-600 dark:text-red-400"
      : "text-green-600 dark:text-green-400";

    return (
      <div className={`rounded-lg p-4 border ${bgColorClass}`}>
        <Text className="block text-xs text-gray-500 dark:text-gray-400 mb-3">
          持仓变化
          <span className="ml-2 text-gray-400">({stockQuantity}股)</span>
        </Text>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <Text className="block text-xs text-gray-400 dark:text-gray-500 mb-1">初始市值</Text>
            <Text className="text-base font-semibold font-mono text-gray-700 dark:text-gray-200">
              {formatCurrency(positionValue.initial, {
                compact: positionValue.initial >= 10000000,
              })}
            </Text>
          </div>

          <div className="text-center">
            <Text className="block text-xs text-gray-400 dark:text-gray-500 mb-1">最终市值</Text>
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
          <Text className="block text-xs text-gray-500 dark:text-gray-400 mb-1">持仓盈亏</Text>
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
