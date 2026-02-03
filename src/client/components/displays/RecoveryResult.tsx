import React from "react";
import Decimal from "decimal.js";
import { Card, Typography, Flex, Statistic, Alert } from "antd";
import { ArrowUpOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface RecoveryResultProps {
  lossPercent: number;
}

export const RecoveryResult: React.FC<RecoveryResultProps> = React.memo(({ lossPercent }) => {
  const lossDecimal = new Decimal(lossPercent).div(100);

  let requiredGain: Decimal;
  let multiplier: Decimal;
  let isInfinity = false;

  if (lossPercent >= 100) {
    requiredGain = new Decimal(Infinity);
    multiplier = new Decimal(Infinity);
    isInfinity = true;
  } else {
    requiredGain = lossDecimal.div(new Decimal(1).minus(lossDecimal)).mul(100);
    multiplier = new Decimal(1).div(new Decimal(1).minus(lossDecimal));
  }

  const formatNumber = (value: Decimal): string => {
    if (!value.isFinite()) return "∞";
    if (value.greaterThan(1000)) {
      return value.toExponential(2);
    }
    return value.toFixed(2);
  };

  const getDifficultyLevel = (): { text: string; color: string; bgColor: string } => {
    if (lossPercent === 0) {
      return { text: "无需回本", color: "#52c41a", bgColor: "bg-green-50 dark:bg-green-900/20" };
    }
    if (lossPercent < 10) {
      return { text: "容易", color: "#52c41a", bgColor: "bg-green-50 dark:bg-green-900/20" };
    }
    if (lossPercent < 25) {
      return { text: "中等", color: "#1677ff", bgColor: "bg-blue-50 dark:bg-blue-900/20" };
    }
    if (lossPercent < 50) {
      return { text: "困难", color: "#faad14", bgColor: "bg-yellow-50 dark:bg-yellow-900/20" };
    }
    if (lossPercent < 75) {
      return { text: "非常难", color: "#fa541c", bgColor: "bg-orange-50 dark:bg-orange-900/20" };
    }
    return { text: "几乎不可能", color: "#ff4d4f", bgColor: "bg-red-50 dark:bg-red-900/20" };
  };

  const difficulty = getDifficultyLevel();

  return (
    <Card
      size="default"
      title={
        <div className="flex items-center justify-between">
          <Title level={4} className="!m-0 dark:text-gray-100 text-lg lg:text-base font-semibold">
            回本分析
          </Title>
        </div>
      }
      className="w-full h-full"
      style={{
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
      }}
      classNames={{
        header:
          "bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700/50 border-b dark:border-gray-700 rounded-t-2xl",
        body: "flex flex-col p-5 md:p-6 dark:bg-gray-800 rounded-b-2xl",
      }}
    >
      <div className="flex flex-col gap-6">
        <div className={`p-4 rounded-xl ${difficulty.bgColor} border border-gray-200 dark:border-gray-700`}>
          <Flex vertical gap="small" className="w-full">
            <Text className="dark:text-gray-300 text-sm">回本难度</Text>
            <div className="flex items-center gap-3">
              <div
                className="px-3 py-1 rounded-full text-sm font-bold"
                style={{
                  backgroundColor: difficulty.color,
                  color: "#fff",
                }}
              >
                {difficulty.text}
              </div>
            </div>
          </Flex>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-700">
            <Flex vertical gap="small" className="w-full">
              <Text className="dark:text-gray-300 text-sm">当前亏损</Text>
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
                需要上涨
              </Text>
              <Statistic
                value={isInfinity ? "∞" : formatNumber(requiredGain)}
                suffix={isInfinity ? "" : "%"}
                styles={{
                  content: {
                    color: isInfinity ? "#ff4d4f" : "#52c41a",
                    fontSize: "2.5rem",
                    fontWeight: 800,
                    background: isInfinity
                      ? "none"
                      : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    WebkitBackgroundClip: isInfinity ? "none" : "text",
                    WebkitTextFillColor: isInfinity ? "#ff4d4f" : "transparent",
                  },
                }}
              />
            </Flex>
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-700">
          <Flex vertical gap="small" className="w-full">
            <Text className="dark:text-gray-300 text-sm">回本倍数</Text>
            <div className="flex items-baseline gap-2">
              <Text
                className="text-3xl font-bold"
                style={{
                  color: isInfinity ? "#ff4d4f" : "#1677ff",
                }}
              >
                {isInfinity ? "∞" : formatNumber(multiplier)}
              </Text>
              <Text type="secondary" className="dark:text-gray-400">
                x
              </Text>
            </div>
            <Text type="secondary" className="dark:text-gray-400 text-xs">
              当前市值需上涨此倍数才能回本
            </Text>
          </Flex>
        </div>

        {lossPercent >= 50 && (
          <Alert
            title="高风险提醒"
            description="当亏损超过50%时，回本需要翻倍以上的涨幅，投资风险极高。建议合理控制仓位，设置止损线。"
            type="warning"
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
