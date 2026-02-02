import React from "react";
import Decimal from "decimal.js";
import { Table, Card, Typography, Space } from "antd";
import { useResponsive } from "@/client/hooks/useResponsive";
import type { ColumnsType } from "antd/es/table";

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
  const { isMobile } = useResponsive();

  const generateData = (): TableData[] => {
    const data: TableData[] = [];
    for (let i = 1; i <= 100; i++) {
      const lossPercent = i;
      const lossDecimal = new Decimal(lossPercent).div(100);

      let requiredGain: Decimal;
      let multiplier: Decimal;

      if (lossPercent >= 100) {
        requiredGain = new Decimal(Infinity);
        multiplier = new Decimal(Infinity);
      } else {
        requiredGain = lossDecimal.div(new Decimal(1).minus(lossDecimal)).mul(100);
        multiplier = new Decimal(1).div(new Decimal(1).minus(lossDecimal));
      }

      data.push({
        key: i.toString(),
        lossPercent,
        requiredGain,
        multiplier,
      });
    }
    return data;
  };

  const data = generateData();

  const getRowClassName = (record: TableData): string => {
    const diff = Math.abs(record.lossPercent - currentValue);
    if (diff <= 1) {
      return "bg-gradient-to-r from-[#667eea]/20 to-[#764ba2]/20 dark:from-[#667eea]/30 dark:to-[#764ba2]/30 font-semibold";
    }
    return "";
  };

  const formatNumber = (value: Decimal): string => {
    if (!value.isFinite()) return "∞";
    return value.toFixed(2);
  };

  const columns: ColumnsType<TableData> = [
    {
      title: "亏损",
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
      title: "需涨",
      dataIndex: "requiredGain",
      key: "requiredGain",
      width: isMobile ? 100 : 120,
      align: "center",
      render: (value: Decimal, record: TableData) => {
        const isHighlighted = Math.abs(record.lossPercent - currentValue) <= 1;
        return (
          <Text
            strong
            className={isHighlighted ? "text-[#52c41a] dark:text-[#73d13d]" : ""}
          >
            {formatNumber(value)}%
          </Text>
        );
      },
    },
    {
      title: "倍数",
      dataIndex: "multiplier",
      key: "multiplier",
      width: isMobile ? 80 : 100,
      align: "center",
      render: (value: Decimal, record: TableData) => {
        const isHighlighted = Math.abs(record.lossPercent - currentValue) <= 1;
        const displayValue = formatNumber(value);
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

  const _scrollToIndex = Math.max(0, Math.min(97, Math.floor(currentValue) - 5));
  // _scrollToIndex 预留用于自动滚动定位功能
  void _scrollToIndex;

  return (
    <Card
      size="default"
      title={
        <div className="flex items-center justify-between">
          <Title level={4} className="!m-0 dark:text-gray-100 text-lg lg:text-base font-semibold">
            速查表
          </Title>
          <Space size="small">
            <Text type="secondary" className="dark:text-gray-400 text-xs">
              1% - 100%
            </Text>
          </Space>
        </div>
      }
      className="w-full"
      style={{
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
      }}
      classNames={{
        header:
          "bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700/50 border-b dark:border-gray-700 rounded-t-2xl",
        body: "flex flex-col p-0 dark:bg-gray-800 rounded-b-2xl",
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
          公式：需涨幅% = 亏损% ÷ (100 - 亏损%) × 100
        </Text>
      </div>
    </Card>
  );
});

RecoveryTable.displayName = "RecoveryTable";
