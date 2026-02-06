import React from "react";
import { useTranslation } from "react-i18next";
import { Card, Typography, Flex, Statistic, Alert } from "antd";
import { ArrowUpOutlined } from "@ant-design/icons";
import { calculateRecovery, formatRecoveryNumber, getDifficultyLevel } from "@/utils/lossRecovery";
import { CARD_STYLES } from "@/constants/uiPatterns";

const { Title, Text } = Typography;

interface RecoveryResultProps {
  lossPercent: number;
}

export const RecoveryResult: React.FC<RecoveryResultProps> = React.memo(({ lossPercent }) => {
  const { t } = useTranslation();
  const metrics = calculateRecovery(lossPercent);
  const difficulty = getDifficultyLevel(lossPercent);

  const getDifficultyTranslationKey = (text: string): string => {
    const keyMap: Record<string, string> = {
      无需回本: "recoveryCalculator.results.difficultyLevels.noLoss",
      容易: "recoveryCalculator.results.difficultyLevels.easy",
      中等: "recoveryCalculator.results.difficultyLevels.medium",
      困难: "recoveryCalculator.results.difficultyLevels.hard",
      非常难: "recoveryCalculator.results.difficultyLevels.veryHard",
      几乎不可能: "recoveryCalculator.results.difficultyLevels.almostImpossible",
    };
    return keyMap[text] || text;
  };

  return (
    <Card
      size="default"
      title={
        <div className="flex items-center justify-between">
          <Title level={4} className="!m-0 dark:text-gray-100 text-lg lg:text-base font-semibold">
            {t("recoveryCalculator.results.title")}
          </Title>
        </div>
      }
      className="w-full h-full"
      style={{
        borderRadius: CARD_STYLES.borderRadius,
        boxShadow: CARD_STYLES.boxShadow,
      }}
      classNames={{
        header: `${CARD_STYLES.header.base} ${CARD_STYLES.header.borderRadius}`,
        body: CARD_STYLES.body.default,
      }}
    >
      <div className="flex flex-col gap-6">
        <div
          className={`p-4 rounded-xl ${difficulty.bgColor} border border-gray-200 dark:border-gray-700`}
        >
          <Flex vertical gap="small" className="w-full">
            <Text className="dark:text-gray-300 text-sm">
              {t("recoveryCalculator.results.difficulty.label")}
            </Text>
            <div className="flex items-center gap-3">
              <div
                className="px-3 py-1 rounded-full text-sm font-bold"
                style={{
                  backgroundColor: difficulty.color,
                  color: "#fff",
                }}
              >
                {t(getDifficultyTranslationKey(difficulty.text))}
              </div>
            </div>
          </Flex>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-700">
            <Flex vertical gap="small" className="w-full">
              <Text className="dark:text-gray-300 text-sm">
                {t("recoveryCalculator.results.currentLoss")}
              </Text>
              <Statistic
                value={lossPercent.toFixed(1)}
                suffix="%"
                styles={{
                  content: {
                    color: "#ff4d4f",
                    fontSize: "2rem",
                    fontWeight: 700,
                  },
                }}
              />
            </Flex>
          </div>

          <div className="p-4 bg-gradient-to-br from-[#667eea]/10 to-[#764ba2]/10 dark:from-[#667eea]/20 dark:to-[#764ba2]/20 rounded-xl border border-[#667eea]/20 dark:border-[#667eea]/30">
            <Flex vertical gap="small" className="w-full">
              <Text className="dark:text-gray-300 text-sm flex items-center gap-1">
                <ArrowUpOutlined className="text-green-500" />
                {t("recoveryCalculator.results.requiredGain")}
              </Text>
              <Statistic
                value={metrics.isInfinity ? "∞" : formatRecoveryNumber(metrics.requiredGain)}
                suffix={metrics.isInfinity ? "" : "%"}
                styles={{
                  content: {
                    color: metrics.isInfinity ? "#ff4d4f" : "#52c41a",
                    fontSize: "2.5rem",
                    fontWeight: 800,
                    background: metrics.isInfinity
                      ? "none"
                      : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    WebkitBackgroundClip: metrics.isInfinity ? "none" : "text",
                    WebkitTextFillColor: metrics.isInfinity ? "#ff4d4f" : "transparent",
                  },
                }}
              />
            </Flex>
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-700">
          <Flex vertical gap="small" className="w-full">
            <Text className="dark:text-gray-300 text-sm">
              {t("recoveryCalculator.results.multiplier")}
            </Text>
            <div className="flex items-baseline gap-2">
              <Text
                className="text-3xl font-bold"
                style={{
                  color: metrics.isInfinity ? "#ff4d4f" : "#1677ff",
                }}
              >
                {metrics.isInfinity ? "∞" : formatRecoveryNumber(metrics.multiplier)}
              </Text>
              <Text type="secondary" className="dark:text-gray-400">
                x
              </Text>
            </div>
            <Text type="secondary" className="dark:text-gray-400 text-xs">
              {t("recoveryCalculator.results.multiplierDesc")}
            </Text>
          </Flex>
        </div>

        {lossPercent >= 50 && (
          <Alert
            message={t("recoveryCalculator.results.warnings.highRisk.title")}
            description={t("recoveryCalculator.results.warnings.highRisk.desc")}
            type="warning"
            showIcon
            className="rounded-xl"
          />
        )}

        {lossPercent >= 80 && (
          <Alert
            message={t("recoveryCalculator.results.warnings.severe.title")}
            description={t("recoveryCalculator.results.warnings.severe.desc")}
            type="error"
            showIcon
            className="rounded-xl"
          />
        )}

        {lossPercent >= 80 && (
          <Alert
            title="严重警告"
            description="亏损超过80%后，回本需要400%以上的涨幅，实际操作中几乎不可能实现。请务必重视风险管理。"
            type="error"
            showIcon
            className="rounded-xl"
          />
        )}
      </div>
    </Card>
  );
});

RecoveryResult.displayName = "RecoveryResult";
