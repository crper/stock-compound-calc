import React, { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import type Decimal from "decimal.js";
import { Table, Card, Typography, Space } from "antd";
import { useResponsive } from "@/hooks/useResponsive";
import type { ColumnsType } from "antd/es/table";
import { calculateRecovery, formatRecoveryNumber } from "@/utils/lossRecovery";
import { CARD_STYLES } from "@/constants/uiPatterns";

const { Text, Title } = Typography;

interface RecoveryTableProps {
  currentValue: number;
}

/** 用户开启「减少动态效果」时改用无动画滚动 */
const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

interface TableData {
  key: string;
  lossPercent: number;
  requiredGain: Decimal;
  multiplier: Decimal;
}

export const RecoveryTable: React.FC<RecoveryTableProps> = React.memo(({ currentValue }) => {
  const { t } = useTranslation();
  const { isMobile } = useResponsive();
  const tableWrapperRef = useRef<HTMLDivElement>(null);

  // 拖动滑块时把当前亏损档位滚到可视区中间，
  // 否则 1~100% 的速查表里用户很难在 300px 高的视窗中找到自己那一行
  useEffect(() => {
    const body = tableWrapperRef.current?.querySelector<HTMLElement>(".ant-table-body");
    const row = body?.querySelector<HTMLElement>(`[data-row-key="${Math.round(currentValue)}"]`);
    if (!body || !row) return;

    const centered = row.offsetTop - body.clientHeight / 2 + row.clientHeight / 2;
    body.scrollTo({
      top: Math.max(0, centered),
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }, [currentValue]);

  const data = useMemo((): TableData[] => {
    const rows: TableData[] = [];
    for (let i = 1; i <= 100; i++) {
      const metrics = calculateRecovery(i);
      rows.push({
        key: i.toString(),
        lossPercent: metrics.lossPercent,
        requiredGain: metrics.requiredGain,
        multiplier: metrics.multiplier,
      });
    }
    return rows;
  }, []);

  // 高亮「当前亏损档位」：差值 ≤1 的整行统一高亮。
  // 一次性派生出命中的档位集合，columns 与 rowClassName 复用，避免每格重复计算
  const highlightedLoss = useMemo(() => {
    const set = new Set<number>();
    for (let loss = 0; loss <= 100; loss++) {
      if (Math.abs(loss - currentValue) <= 1) set.add(loss);
    }
    return set;
  }, [currentValue]);

  const getRowClassName = (record: TableData): string => {
    if (highlightedLoss.has(record.lossPercent)) {
      return "bg-gradient-to-r from-brand/20 to-brand-deep/20 dark:from-brand/30 dark:to-brand-deep/30 font-semibold";
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
        <Text strong className={value === currentValue ? "text-brand dark:text-brand-soft" : ""}>
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
        const isHighlighted = highlightedLoss.has(record.lossPercent);
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
        const isHighlighted = highlightedLoss.has(record.lossPercent);
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
      size={isMobile ? "small" : "medium"}
      title={
        <div className="flex items-center justify-between">
          {/* 语义层级用 h2，视觉字号由 className 固定 */}
          <Title
            level={2}
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
      {/* 滚动容器由 Table 的 scroll.y 提供，此处不再包一层 overflow，避免出现双重滚动条 */}
      <div ref={tableWrapperRef}>
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
