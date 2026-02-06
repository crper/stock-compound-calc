/**
 * 历史记录抽屉组件
 * 展示和管理计算历史记录
 */
import {
  FallOutlined,
  RiseOutlined,
  ClearOutlined,
  HistoryOutlined,
  DeleteOutlined,
  SearchOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import {
  Button,
  Card,
  Drawer,
  Empty,
  Popconfirm,
  Flex,
  Tag,
  Typography,
  Input,
  Select,
  DatePicker,
  Checkbox,
  App,
} from "antd";
import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { CalculationHistory } from "@/types";
import { TREND_COLORS } from "@/constants";
import { formatCurrency, formatDate, formatPercentage } from "@/utils/formatters";

const { Text } = Typography;
const { RangePicker } = DatePicker;

interface HistoryDrawerProps {
  visible: boolean;
  onClose: () => void;
  history: CalculationHistory[];
  isMobile: boolean;
  onLoadHistory: (item: CalculationHistory) => void;
  onClearHistory: () => void;
  onDeleteHistory?: (ids: string[]) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = React.memo(
  ({ visible, onClose, history, isMobile, onLoadHistory, onClearHistory, onDeleteHistory }) => {
    const { t } = useTranslation();
    const [clearing, setClearing] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);
    const [dailyReturnFilter, setDailyReturnFilter] = useState<number | undefined>(undefined);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const { message } = App.useApp();

    const handleClearHistory = async () => {
      setClearing(true);
      try {
        onClearHistory();
      } finally {
        setClearing(false);
        setSelectedIds(new Set());
      }
    };

    const handleBatchDelete = async () => {
      if (selectedIds.size === 0) {
        message.warning(t("common.messages.selectFirst"));
        return;
      }

      if (onDeleteHistory) {
        try {
          onDeleteHistory(Array.from(selectedIds));
          setSelectedIds(new Set());
          message.success(t("common.messages.deleteSuccess", { count: selectedIds.size }));
        } catch {
          message.error(t("common.messages.deleteFailed"));
        }
      }
    };

    const handleSelectAll = (checked: boolean) => {
      if (checked) {
        setSelectedIds(new Set(filteredHistory.map((item) => item.id)));
      } else {
        setSelectedIds(new Set());
      }
    };

    const handleSelectItem = (id: string, checked: boolean) => {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (checked) {
          next.add(id);
        } else {
          next.delete(id);
        }
        return next;
      });
    };

    const filteredHistory = useMemo(() => {
      return history.filter((item) => {
        const matchesSearch =
          searchValue === "" || item.params.initialPrice.toString().includes(searchValue);

        const itemDate = dayjs(item.timestamp).startOf("day");
        const matchesDateRange =
          !dateRange[0] ||
          !dateRange[1] ||
          (itemDate.isAfter(dateRange[0].startOf("day").subtract(1, "second")) &&
            itemDate.isBefore(dateRange[1].endOf("day").add(1, "second")));

        const matchesDailyReturn =
          dailyReturnFilter === undefined || item.params.dailyReturn === dailyReturnFilter;

        return matchesSearch && matchesDateRange && matchesDailyReturn;
      });
    }, [history, searchValue, dateRange, dailyReturnFilter]);

    const uniqueDailyReturns = useMemo(() => {
      const returns = new Set(history.map((item) => item.params.dailyReturn));
      return Array.from(returns).sort((a, b) => a - b);
    }, [history]);

    const DailyReturnOptions = uniqueDailyReturns.map((value) => ({
      label: `${value}%`,
      value,
    }));

    return (
      <Drawer
        title={
          <Flex align="center" gap={12} wrap>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center flex-shrink-0">
              <HistoryOutlined className="text-white text-lg" />
            </div>
            <Flex align="center" gap={8} wrap style={{ minWidth: 0 }}>
              <span className="text-lg font-semibold text-gray-800 dark:text-gray-100 truncate">
                {t("stockCalculator.history.title")}
              </span>
              {filteredHistory.length > 0 && (
                <Tag className="rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800 flex-shrink-0">
                  {t("stockCalculator.history.recordCount", { count: filteredHistory.length })}
                </Tag>
              )}
            </Flex>
          </Flex>
        }
        placement={isMobile ? "bottom" : "right"}
        onClose={onClose}
        open={visible}
        size={isMobile ? "100%" : 520}
        className="backdrop-blur-sm"
        styles={{
          body: { padding: 0 },
          header: { borderBottom: "1px solid #f0f0f0", padding: "16px 20px" },
        }}
        extra={
          selectedIds.size > 0 ? (
            <Flex gap="small" align="center">
              <Text type="secondary" className="text-sm">
                {t("stockCalculator.history.selectedCount", { count: selectedIds.size })}
              </Text>
              <Popconfirm
                title={t("stockCalculator.history.confirmDelete")}
                description={t("stockCalculator.history.confirmDeleteDesc", {
                  count: selectedIds.size,
                })}
                onConfirm={handleBatchDelete}
                okText={t("common.buttons.confirm")}
                cancelText={t("common.buttons.cancel")}
                okButtonProps={{ danger: true }}
              >
                <Button size="small" danger icon={<DeleteOutlined />} className="rounded-lg">
                  {t("common.buttons.batchDelete")}
                </Button>
              </Popconfirm>
              <Button size="small" onClick={() => setSelectedIds(new Set())} className="rounded-lg">
                {t("common.buttons.cancelSelection")}
              </Button>
            </Flex>
          ) : (
            history.length > 0 && (
              <Popconfirm
                title={t("stockCalculator.history.confirmClear")}
                description={t("stockCalculator.history.confirmClearDesc")}
                onConfirm={handleClearHistory}
                okText={t("common.buttons.confirm")}
                cancelText={t("common.buttons.cancel")}
                okButtonProps={{ danger: true, loading: clearing }}
              >
                <Button size="small" danger icon={<ClearOutlined />} className="rounded-lg">
                  {t("common.buttons.clearHistory")}
                </Button>
              </Popconfirm>
            )
          )
        }
      >
        <div className="flex flex-col h-full">
          {/* 筛选区 */}
          {history.length > 0 && (
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
              <div className="flex flex-col gap-3">
                {/* 搜索和筛选 */}
                <div className="flex gap-2">
                  <Input
                    placeholder={t("stockCalculator.history.searchPlaceholder")}
                    prefix={<SearchOutlined className="text-gray-400" />}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    allowClear
                    className="rounded-lg flex-1"
                    size="middle"
                  />
                  <Select
                    placeholder={t("stockCalculator.history.filterReturn")}
                    value={dailyReturnFilter}
                    onChange={setDailyReturnFilter}
                    options={[
                      { label: t("stockCalculator.history.filterAll"), value: undefined },
                      ...DailyReturnOptions,
                    ]}
                    allowClear
                    style={{ width: 120 }}
                    size="middle"
                    className="rounded-lg"
                  />
                </div>
                {/* 日期范围 */}
                <RangePicker
                  placeholder={[
                    t("stockCalculator.history.dateRange.start"),
                    t("stockCalculator.history.dateRange.end"),
                  ]}
                  value={dateRange}
                  onChange={(dates) => setDateRange([dates?.[0] ?? null, dates?.[1] ?? null])}
                  size="middle"
                  className="rounded-lg w-full"
                />
                {/* 全选 */}
                {filteredHistory.length > 0 && (
                  <Checkbox
                    checked={
                      selectedIds.size === filteredHistory.length && filteredHistory.length > 0
                    }
                    indeterminate={
                      selectedIds.size > 0 && selectedIds.size < filteredHistory.length
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded-lg"
                  >
                    {t("stockCalculator.history.selectAll", { count: filteredHistory.length })}
                  </Checkbox>
                )}
              </div>
            </div>
          )}

          {/* 历史列表 */}
          <div className="flex-1 overflow-y-auto p-4">
            {filteredHistory.length === 0 ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span className="text-gray-400 dark:text-gray-500 text-sm">
                    {history.length === 0
                      ? t("common.empty.noHistory")
                      : t("stockCalculator.history.noMatch")}
                  </span>
                }
                className="mt-12"
              >
                {history.length === 0 && (
                  <HistoryOutlined
                    style={{ fontSize: 48 }}
                    className="text-gray-300 dark:text-gray-600 mt-4"
                  />
                )}
              </Empty>
            ) : (
              <div className="space-y-3">
                {filteredHistory.map((item, index) => (
                  <HistoryCard
                    key={item.id}
                    item={item}
                    isMobile={isMobile}
                    index={index}
                    selected={selectedIds.has(item.id)}
                    onSelect={(checked) => handleSelectItem(item.id, checked)}
                    onClick={() => {
                      if (selectedIds.size > 0) {
                        handleSelectItem(item.id, !selectedIds.has(item.id));
                      } else {
                        onLoadHistory(item);
                        onClose();
                      }
                    }}
                    t={t}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </Drawer>
    );
  },
);

HistoryDrawer.displayName = "HistoryDrawer";

interface HistoryCardProps {
  item: CalculationHistory;
  isMobile: boolean;
  index: number;
  selected?: boolean;
  onSelect?: (checked: boolean) => void;
  onClick: () => void;
  t: (key: string, options?: Record<string, unknown>) => string;
}

const HistoryCard: React.FC<HistoryCardProps> = React.memo(
  ({ item, isMobile, index, selected = false, onSelect, onClick, t }) => {
    const formattedTimestamp = formatDate(item.timestamp);
    const hasStockQuantity = Boolean(item.params.stockQuantity && item.params.stockQuantity > 0);
    const [datePart, timePart] = formattedTimestamp.split(" ");

    return (
      <Card
        size="small"
        hoverable
        onClick={onClick}
        className={`transition-all duration-200 dark:bg-gray-800 dark:border-gray-700 ${
          selected ? "ring-2 ring-blue-500 border-blue-500" : "border-gray-200"
        }`}
        style={{
          animation: `slideIn 0.3s ease-out ${index * 0.05}s both`,
        }}
      >
        <Flex align="flex-start" gap={12}>
          {/* 复选框 */}
          {onSelect && (
            <div className="pt-0.5" onClick={(e) => e.stopPropagation()}>
              <Checkbox checked={selected} onChange={(e) => onSelect?.(e.target.checked)} />
            </div>
          )}

          {/* 内容区 */}
          <div className="flex-1 min-w-0">
            {/* 头部：时间和参数 */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <ClockCircleOutlined />
                <span>{datePart}</span>
                <span className="text-gray-300">{timePart}</span>
              </div>
              <Tag className="text-xs m-0 bg-blue-50 text-blue-600 border-blue-200">
                {item.params.dailyReturn}%
              </Tag>
            </div>

            {/* 主体：价格和天数 */}
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-lg font-bold text-gray-800 dark:text-gray-100">
                {formatCurrency(item.params.initialPrice, {
                  compact: item.params.initialPrice >= 1000000,
                })}
              </span>
              <span className="text-gray-400">×</span>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {item.params.boardCount} {t("stockCalculator.form.units.days")}
              </span>
              {hasStockQuantity && (
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                  ({t("stockCalculator.history.holding", { count: item.params.stockQuantity })})
                </span>
              )}
            </div>

            {/* 结果对比 */}
            <div className={`grid gap-2 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
              <HistoryResultCell
                result={item.results.up}
                type="up"
                hasStockQuantity={hasStockQuantity}
                t={t}
              />
              <HistoryResultCell
                result={item.results.down}
                type="down"
                hasStockQuantity={hasStockQuantity}
                t={t}
              />
            </div>
          </div>
        </Flex>
      </Card>
    );
  },
);

HistoryCard.displayName = "HistoryCard";

interface HistoryResultCellProps {
  result: {
    finalPrice: number;
    totalReturn: number;
    totalGain: number;
    positionGain?: number;
  };
  type: "up" | "down";
  hasStockQuantity: boolean;
  t: (key: string, options?: Record<string, unknown>) => string;
}

const HistoryResultCell: React.FC<HistoryResultCellProps> = React.memo(
  ({ result, type, hasStockQuantity, t }) => {
    const isUp = type === "up";
    const colors = isUp ? TREND_COLORS.up : TREND_COLORS.down;

    return (
      <div className={`rounded-lg ${colors.bg} border ${colors.border} p-2.5`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {isUp ? (
              <RiseOutlined className={`${colors.iconColor} text-sm`} />
            ) : (
              <FallOutlined className={`${colors.iconColor} text-sm`} />
            )}
            <Text className="text-xs text-gray-500 dark:text-gray-400">
              {isUp
                ? t("stockCalculator.history.limitUpProfit")
                : t("stockCalculator.history.limitDownLoss")}
            </Text>
          </div>
          <div className={`text-xs font-medium ${colors.iconColor}`}>
            {formatPercentage(result.totalReturn, { multiply: false })}
          </div>
        </div>
        <div className="mt-1.5 flex items-baseline justify-between">
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
            {formatCurrency(result.finalPrice, { compact: result.finalPrice >= 1000000 })}
          </span>
          {hasStockQuantity && result.positionGain !== undefined && (
            <span className={`text-xs ${colors.iconColor}`}>
              {result.positionGain >= 0 ? "+" : ""}
              {formatCurrency(result.positionGain, {
                compact: Math.abs(result.positionGain) >= 1000000,
              })}
            </span>
          )}
        </div>
      </div>
    );
  },
);

HistoryResultCell.displayName = "HistoryResultCell";
