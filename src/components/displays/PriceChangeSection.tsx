/**
 * 股价变化展示组件
 * 简洁显示单股价格变化和收益率
 */
import { Typography } from "antd";
import { formatCurrency, formatPercentage } from "@/utils/formatters";
import React from "react";
import { useTranslation } from "react-i18next";

const { Text } = Typography;

interface PriceChangeSectionProps {
  initialPrice: number;
  finalPrice: number;
  totalReturn: number;
  isUp: boolean;
}

export const PriceChangeSection: React.FC<PriceChangeSectionProps> = React.memo(
  ({ initialPrice, finalPrice, totalReturn, isUp }) => {
    const { t } = useTranslation();
    const colorClass = isUp
      ? "text-red-500 dark:text-red-400"
      : "text-green-500 dark:text-green-400";

    return (
      <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <Text className="block text-xs text-gray-500 dark:text-gray-400 mb-2">
          {t("stockCalculator.results.priceChange.title")}
        </Text>
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <Text className="block text-xs text-gray-400 dark:text-gray-500 mb-1">
              {t("stockCalculator.results.priceChange.initial")}
            </Text>
            <Text className="text-lg font-semibold font-mono text-gray-700 dark:text-gray-200">
              {formatCurrency(initialPrice)}
            </Text>
          </div>

          <div className="px-4">
            <Text className="text-xl text-gray-400">→</Text>
          </div>

          <div className="text-center flex-1">
            <Text className="block text-xs text-gray-400 dark:text-gray-500 mb-1">
              {t("stockCalculator.results.priceChange.final")}
            </Text>
            <Text className={`text-lg font-semibold font-mono ${colorClass}`}>
              {formatCurrency(finalPrice)}
            </Text>
          </div>
        </div>

        <div className="mt-3 text-center pt-3 border-t border-gray-200 dark:border-gray-600">
          <Text className={`text-base font-bold ${colorClass}`}>
            {formatPercentage(totalReturn, { multiply: false, showPlus: true })}
          </Text>
        </div>
      </div>
    );
  },
);

PriceChangeSection.displayName = "PriceChangeSection";
