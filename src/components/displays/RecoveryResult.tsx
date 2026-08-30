import React from "react";
import { useTranslation } from "react-i18next";
import { Card, Typography, Flex, Statistic, Alert } from "antd";
import { ArrowUpOutlined } from "@ant-design/icons";
import { calculateRecovery, formatRecoveryNumber, getDifficultyLevel } from "@/utils/lossRecovery";
import { CARD_STYLES } from "@/constants/uiPatterns";

const { Title, Text } = Typography;

interface RecoveryResultProps {
  lossPercent: number;
  isMobile?: boolean;
}

export const RecoveryResult: React.FC<RecoveryResultProps> = React.memo(
  ({ lossPercent, isMobile = false }) => {
    const { t } = useTranslation();
    const metrics = calculateRecovery(lossPercent);
    const difficulty = getDifficultyLevel(lossPercent);

    return (
      <Card
        size={isMobile ? "small" : "medium"}
        title={
          <div className="flex items-center justify-between">
            {/* 语义上用 h2（页面 h1 之后的第一个层级），视觉字号由 className 固定 */}
            <Title
              level={2}
              className={`!m-0 dark:text-gray-100 ${isMobile ? "text-base" : "text-lg lg:text-base"} font-semibold`}
            >
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
                  {t(`recoveryCalculator.results.difficultyLevels.${difficulty.level}`)}
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
                      color: "#ef4444",
                      fontSize: "2rem",
                      fontWeight: 700,
                    },
                  }}
                />
              </Flex>
            </div>

            <div className="p-4 bg-gradient-to-br from-brand/10 to-brand-deep/10 dark:from-brand/20 dark:to-brand-deep/20 rounded-xl border border-brand/20 dark:border-brand/30">
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
                      color: metrics.isInfinity ? "#ef4444" : "#16a34a",
                      fontSize: "2.5rem",
                      fontWeight: 800,
                      background: metrics.isInfinity
                        ? "none"
                        : "linear-gradient(135deg, var(--color-brand) 0%, var(--color-brand-deep) 100%)",
                      WebkitBackgroundClip: metrics.isInfinity ? "none" : "text",
                      WebkitTextFillColor: metrics.isInfinity ? "#ef4444" : "transparent",
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
                    color: metrics.isInfinity ? "#ef4444" : "var(--color-brand)",
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
              title={t("recoveryCalculator.results.warnings.highRisk.title")}
              description={t("recoveryCalculator.results.warnings.highRisk.desc")}
              type="warning"
              showIcon
              className="rounded-xl"
            />
          )}

          {lossPercent >= 80 && (
            <Alert
              title={t("recoveryCalculator.results.warnings.severe.title")}
              description={t("recoveryCalculator.results.warnings.severe.desc")}
              type="error"
              showIcon
              className="rounded-xl"
            />
          )}
        </div>
      </Card>
    );
  },
);

RecoveryResult.displayName = "RecoveryResult";
