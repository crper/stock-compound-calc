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
import type { TFunction } from "i18next";
import type { CalculationHistory } from "@/types";
import { TREND_COLORS } from "@/constants";
import { formatCurrency, formatDate, formatPercentage } from "@/utils/formatters";

const { Text } = Typography;
const { RangePicker } = DatePicker;

/** 取当天 00:00:00.000 的时间戳（dayjs 为不可变 API，startOf 返回新实例） */
const startOfDay = (source: Dayjs): number => source.startOf("day").valueOf();

/** 取当天 23:59:59.999 的时间戳 */
const endOfDay = (source: Dayjs): number => source.endOf("day").valueOf();

/**
 * 按搜索词 / 日期区间 / 涨跌幅筛选历史记录。
 * 抽成纯函数便于 React Compiler 校验 useMemo 的依赖，同时让筛选逻辑可单测。
 */
const filterHistory = (
  history: CalculationHistory[],
  searchValue: string,
  dateRange: readonly [Dayjs | null, Dayjs | null],
  dailyReturnFilter: number | undefined,
): CalculationHistory[] => {
  const rangeStart = dateRange[0] ? startOfDay(dateRange[0]) : null;
  const rangeEnd = dateRange[1] ? endOfDay(dateRange[1]) : null;

  return history.filter((item) => {
    const matchesSearch =
      searchValue === "" || item.params.initialPrice.toString().includes(searchValue);

    const itemTime = item.timestamp.getTime();
    const matchesDateRange =
      (rangeStart === null || itemTime >= rangeStart) &&
      (rangeEnd === null || itemTime <= rangeEnd);

    const matchesDailyReturn =
      dailyReturnFilter === undefined || item.params.dailyReturn === dailyReturnFilter;

    return matchesSearch && matchesDateRange && matchesDailyReturn;
  });
};

interface HistoryDrawerProps {
  visible: boolean;
  onClose: () => void;
  history: CalculationHistory[];
  isMobile: boolean;
  onLoadHistory: (item: CalculationHistory) => void;
  onClearHistory: () => void;
  onDeleteHistory?: (ids: string[]) => void | Promise<void>;
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

    // 派生数据先算，保证后面的事件处理函数只引用已声明的值
    const filteredHistory = useMemo(
      () => filterHistory(history, searchValue, dateRange, dailyReturnFilter),
      [history, searchValue, dateRange, dailyReturnFilter],
    );

    const uniqueDailyReturns = useMemo(() => {
      const returns = new Set(history.map((item) => item.params.dailyReturn));
      return [...returns].toSorted((a, b) => a - b);
    }, [history]);

    const dailyReturnOptions = uniqueDailyReturns.map((value) => ({
      label: `${value}%`,
      value,
    }));

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

      // 删除失败的错误提示由 useStockCalculator.handleDeleteHistory 内部处理（toast + 日志），
      // 这里 await 成功后才清空选择并提示成功
      await onDeleteHistory?.([...selectedIds]);
      setSelectedIds(new Set());
      message.success(t("common.messages.deleteSuccess", { count: selectedIds.size }));
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

    return (
      <Drawer
        title={
          <Flex align="center" gap={isMobile ? 8 : 12} wrap>
            <div
              className={`${isMobile ? "w-8 h-8" : "w-9 h-9"} rounded-xl bg-gradient-to-br from-brand to-brand-deep flex items-center justify-center flex-shrink-0`}
            >
              <HistoryOutlined className={`${isMobile ? "text-base" : "text-lg"} text-white`} />
            </div>
            <Flex align="center" gap={8} wrap style={{ minWidth: 0 }}>
              <span
                className={`${isMobile ? "text-base" : "text-lg"} font-semibold text-gray-800 dark:text-gray-100 truncate`}
              >
                {t("stockCalculator.history.title")}
              </span>
              {filteredHistory.length > 0 && (
                <Tag
                  className={` rounded-full ${isMobile ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-0.5 text-xs"} font-medium bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800 flex-shrink-0`}
                >
                  {t("stockCalculator.history.recordCount", { count: filteredHistory.length })}
                </Tag>
              )}
            </Flex>
          </Flex>
        }
        placement={isMobile ? "bottom" : "right"}
        onClose={onClose}
        open={visible}
        size={isMobile ? "85%" : 520}
        className="backdrop-blur-sm"
        styles={{
          body: { padding: 0 },
          header: {
            borderBottom: "1px solid #f0f0f0",
            padding: isMobile ? "12px 16px" : "16px 20px",
          },
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
            <div
              className={`${isMobile ? "px-3 py-2" : "px-4 py-3"} border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30`}
            >
              <div className={`flex flex-col ${isMobile ? "gap-2" : "gap-3"}`}>
                {/* 搜索和筛选 */}
                <div className="flex gap-2">
                  <Input
                    placeholder={t("stockCalculator.history.searchPlaceholder")}
                    prefix={<SearchOutlined className="text-gray-400" />}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    allowClear
                    className="rounded-lg flex-1"
                    size={isMobile ? "small" : "middle"}
                  />
                  <Select
                    placeholder={t("stockCalculator.history.filterReturn")}
                    value={dailyReturnFilter}
                    onChange={setDailyReturnFilter}
                    options={[
                      { label: t("stockCalculator.history.filterAll"), value: undefined },
                      ...dailyReturnOptions,
                    ]}
                    allowClear
                    style={{ width: isMobile ? 100 : 120 }}
                    size={isMobile ? "small" : "middle"}
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
                  size={isMobile ? "small" : "middle"}
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
          <div className={`flex-1 overflow-y-auto ${isMobile ? "p-3 space-y-2" : "p-4 space-y-3"}`}>
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
  t: TFunction;
}

const HistoryCard: React.FC<HistoryCardProps> = React.memo(
  ({ item, isMobile, index, selected = false, onSelect, onClick, t }) => {
    const formattedTimestamp = formatDate(item.timestamp);
    const hasStockQuantity = Boolean(item.params.stockQuantity && item.params.stockQuantity > 0);
    const [datePart, timePart] = formattedTimestamp.split(" ");

    return (
      <Card
        size={isMobile ? "small" : "medium"}
        hoverable
        onClick={onClick}
        className={`transition-all duration-200 dark:bg-gray-800 dark:border-gray-700 ${
          selected ? "ring-2 ring-blue-500 border-blue-500" : "border-gray-200"
        }`}
        style={{
          animation: `slideIn 0.3s ease-out ${index * 0.05}s both`,
        }}
      >
        <Flex align="flex-start" gap={isMobile ? 8 : 12}>
          {/* 复选框 */}
          {onSelect && (
            <Checkbox
              checked={selected}
              aria-label={t("stockCalculator.history.selectRecord")}
              className="pt-0.5"
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => onSelect?.(e.target.checked)}
            />
          )}

          {/* 内容区 */}
          <div className="flex-1 min-w-0">
            {/* 头部：时间和参数 */}
            <div className={`flex items-center justify-between ${isMobile ? "mb-1.5" : "mb-2"}`}>
              <div
                className={`flex items-center gap-2 ${isMobile ? "text-[11px]" : "text-xs"} text-gray-500 dark:text-gray-400`}
              >
                <ClockCircleOutlined />
                <span>{datePart}</span>
                <span className="text-gray-300">{timePart}</span>
              </div>
              <Tag
                className={`${isMobile ? "text-[11px]" : "text-xs"} m-0 bg-blue-50 text-blue-600 border-blue-200`}
              >
                {item.params.dailyReturn}%
              </Tag>
            </div>

            {/* 主体：价格和天数 */}
            <div className={`flex items-baseline gap-2 ${isMobile ? "mb-2" : "mb-3"}`}>
              <span
                className={`${isMobile ? "text-base" : "text-lg"} font-bold text-gray-800 dark:text-gray-100`}
              >
                {formatCurrency(item.params.initialPrice, {
                  compact: item.params.initialPrice >= 1000000,
                })}
              </span>
              <span className={`${isMobile ? "text-xs" : "text-sm"} text-gray-400`}>×</span>
              <span
                className={`${isMobile ? "text-xs" : "text-sm"} text-gray-600 dark:text-gray-300`}
              >
                {item.params.boardCount} {t("stockCalculator.form.units.days")}
              </span>
              {hasStockQuantity && (
                <span
                  className={`${isMobile ? "text-[11px]" : "text-xs"} text-gray-500 dark:text-gray-400 ml-2`}
                >
                  ({t("stockCalculator.history.holding", { count: item.params.stockQuantity ?? 0 })}
                  )
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
                isMobile={isMobile}
              />
              <HistoryResultCell
                result={item.results.down}
                type="down"
                hasStockQuantity={hasStockQuantity}
                t={t}
                isMobile={isMobile}
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
  t: TFunction;
  isMobile?: boolean;
}

const HistoryResultCell: React.FC<HistoryResultCellProps> = React.memo(
  ({ result, type, hasStockQuantity, t, isMobile = false }) => {
    const isUp = type === "up";
    const colors = isUp ? TREND_COLORS.up : TREND_COLORS.down;

    return (
      <div
        className={`rounded-lg ${colors.bg} border ${colors.border} ${isMobile ? "p-2" : "p-2.5"}`}
      >
        <div className="flex items-center justify-between">
          <div className={`flex items-center ${isMobile ? "gap-1" : "gap-1.5"}`}>
            {isUp ? (
              <RiseOutlined className={`${colors.iconColor} ${isMobile ? "text-xs" : "text-sm"}`} />
            ) : (
              <FallOutlined className={`${colors.iconColor} ${isMobile ? "text-xs" : "text-sm"}`} />
            )}
            <Text className={isMobile ? "text-[11px]" : "text-xs"} text-gray-500 dark:text-gray-400>
              {isUp
                ? t("stockCalculator.history.limitUpProfit")
                : t("stockCalculator.history.limitDownLoss")}
            </Text>
          </div>
          <div
            className={`${isMobile ? "text-[11px]" : "text-xs"} font-medium ${colors.iconColor}`}
          >
            {formatPercentage(result.totalReturn, { multiply: false })}
          </div>
        </div>
        <div className={`mt-${isMobile ? "1" : "1.5"} flex items-baseline justify-between`}>
          <span
            className={`${isMobile ? "text-sm" : "text-sm"} font-semibold text-gray-800 dark:text-gray-100`}
          >
            {formatCurrency(result.finalPrice, { compact: result.finalPrice >= 1000000 })}
          </span>
          {hasStockQuantity && result.positionGain !== undefined && (
            <span className={`${isMobile ? "text-[11px]" : "text-xs"} ${colors.iconColor}`}>
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
