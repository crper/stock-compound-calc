import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import Decimal from "decimal.js";
import { Table, Card, Typography, Space } from "antd";
import { useResponsive } from "@/hooks/useResponsive";
import type { ColumnsType } from "antd/es/table";
import { calculateRecovery, formatRecoveryNumber } from "@/utils/lossRecovery";
import { CARD_STYLES } from "@/constants/uiPatterns";

const { Text, Title } = Typography;

interface RecoveryTableProps {
  currentValue: number;
}

interface TableData {
  key: string;
  lossPercent: number;
  requiredGain: Decimal;
  multiplier: Decimal;
}

export const RecoveryTable: React.FC<RecoveryTableProps> = React.memo(({ currentValue }) => {
  const { t } = useTranslation();
  const { isMobile } = useResponsive();

  const data = useMemo((): TableData[] => {
    const data: TableData[] = [];
    for (let i = 1; i <= 100; i++) {
      const metrics = calculateRecovery(i);
      data.push({
        key: i.toString(),
        lossPercent: metrics.lossPercent,
        requiredGain: metrics.requiredGain,
        multiplier: metrics.multiplier,
      });
    }
    return data;
  }, []);

  const getRowClassName = (record: TableData): string => {
    const diff = Math.abs(record.lossPercent - currentValue);
    if (diff <= 1) {
      return "bg-gradient-to-r from-[#667eea]/20 to-[#764ba2]/20 dark:from-[#667eea]/30 dark:to-[#764ba2]/30 font-semibold";
    }
    return "";
  };

  const columns: ColumnsType<TableData> = [
    {
      title: t("recoveryCalculator.table.columns.loss"),
      dataIndex: "lossPercent",
      key: "lossPercent",
      width: isMobile ? 80 : 100,
      align: "center",
      render: (value: number) => (
        <Text strong className={value === currentValue ? "text-[#667eea] dark:text-[#8b9ef0]" : ""}>
          {value}%
        </Text>
      ),
    },
    {
      title: t("recoveryCalculator.table.columns.required"),
      dataIndex: "requiredGain",
      key: "requiredGain",
      width: isMobile ? 100 : 120,
      align: "center",
      render: (value: Decimal, record: TableData) => {
        const isHighlighted = Math.abs(record.lossPercent - currentValue) <= 1;
        return (
          <Text strong className={isHighlighted ? "text-[#52c41a] dark:text-[#73d13d]" : ""}>
            {formatRecoveryNumber(value)}%
          </Text>
        );
      },
    },
    {
      title: t("recoveryCalculator.table.columns.multiplier"),
      dataIndex: "multiplier",
      key: "multiplier",
      width: isMobile ? 80 : 100,
      align: "center",
      render: (value: Decimal, record: TableData) => {
        const isHighlighted = Math.abs(record.lossPercent - currentValue) <= 1;
        const displayValue = formatRecoveryNumber(value);
        return (
          <Text
            type={displayValue === "∞" ? "danger" : "secondary"}
            className={isHighlighted ? "font-bold" : ""}
          >
            {displayValue}x
          </Text>
        );
      },
    },
  ];

  return (
    <Card
      size={isMobile ? "small" : "default"}
      title={
        <div className="flex items-center justify-between">
          <Title
            level={4}
            className={`!m-0 dark:text-gray-100 ${isMobile ? "text-base" : "text-lg lg:text-base"} font-semibold`}
          >
            {t("recoveryCalculator.table.title")}
          </Title>
          <Space size="small">
            <Text type="secondary" className="dark:text-gray-400 text-xs">
              {t("recoveryCalculator.table.range")}
            </Text>
          </Space>
        </div>
      }
      className="w-full"
      style={{
        borderRadius: CARD_STYLES.borderRadius,
        boxShadow: CARD_STYLES.boxShadow,
      }}
      classNames={{
        header: `${CARD_STYLES.header.base} ${CARD_STYLES.header.borderRadius}`,
        body: CARD_STYLES.body.compact,
      }}
    >
      <div
        className="overflow-y-auto"
        style={{
          maxHeight: isMobile ? "300px" : "400px",
          scrollBehavior: "smooth",
        }}
      >
        <Table
          dataSource={data}
          columns={columns}
          pagination={false}
          size="small"
          rowClassName={getRowClassName}
          rowKey="key"
          scroll={{ y: isMobile ? 300 : 400 }}
          className="dark:text-gray-100"
          style={{
            scrollbarWidth: "thin",
          }}
        />
      </div>
      <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
        <Text type="secondary" className="dark:text-gray-400 text-xs block text-center">
          {t("recoveryCalculator.table.formula")}
        </Text>
      </div>
    </Card>
  );
});

RecoveryTable.displayName = "RecoveryTable";
