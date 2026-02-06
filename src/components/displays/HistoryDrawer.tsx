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
} from "@ant-design/icons";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import {
  Button,
  Card,
  Drawer,
  Empty,
  Popconfirm,
  Space,
  Tag,
  Typography,
  Input,
  Select,
  DatePicker,
  Checkbox,
  App,
} from "antd";
import React, { useState, useMemo } from "react";
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
    const [clearing, setClearing] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);
    const [dailyReturnFilter, setDailyReturnFilter] = useState<number | undefined>(undefined);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // 使用 App.useApp() 获取带上下文的消息实例
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
        message.warning("请先选择要删除的记录");
        return;
      }

      if (onDeleteHistory) {
        try {
          onDeleteHistory(Array.from(selectedIds));
          setSelectedIds(new Set());
          message.success(`已删除 ${selectedIds.size} 条记录`);
        } catch {
          message.error("删除失败，请稍后重试");
        }
      } else {
        message.error("批量删除功能暂未实现");
      }
    };

    const handleSelectAll = (checked: boolean) => {
      if (checked) {
        setSelectedIds(new Set(filteredHistory.map((item) => item.id)));
      } else {
        setSelectedIds(new Set());
      }
    };

    const handleSelectItem = (id: string, checked: boolean, event: React.MouseEvent) => {
      event.stopPropagation();
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
          <Space size="middle">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center">
              <HistoryOutlined className="text-white text-lg" />
            </div>
            <div>
              <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                计算历史
              </span>
              {filteredHistory.length > 0 && (
                <Tag
                  color="blue"
                  className="ml-3 rounded-full px-3 py-0.5 text-xs font-medium bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800"
                >
                  {filteredHistory.length} 条记录
                </Tag>
              )}
            </div>
          </Space>
        }
        placement={isMobile ? "bottom" : "right"}
        onClose={onClose}
        open={visible}
        size={isMobile ? "large" : "default"}
        className={`${isMobile ? "history-drawer-mobile" : ""} backdrop-blur-sm`}
        styles={{
          body: { padding: "20px" },
          header: { borderBottom: "1px solid #f0f0f0", padding: "16px 20px" },
        }}
        extra={
          selectedIds.size > 0 ? (
            <Space>
              <Text type="secondary">已选 {selectedIds.size} 项</Text>
              <Popconfirm
                title="确认删除"
                description={`确定要删除选中的 ${selectedIds.size} 条记录吗？`}
                onConfirm={handleBatchDelete}
                okText="确认"
                cancelText="取消"
                okButtonProps={{ danger: true }}
              >
                <Button size="small" danger icon={<DeleteOutlined />} className="rounded-lg">
                  批量删除
                </Button>
              </Popconfirm>
              <Button size="small" onClick={() => setSelectedIds(new Set())} className="rounded-lg">
                取消选择
              </Button>
            </Space>
          ) : (
            history.length > 0 && (
              <Popconfirm
                title="确认清空"
                description="确定要清空所有历史记录吗？此操作不可恢复。"
                onConfirm={handleClearHistory}
                okText="确认"
                cancelText="取消"
                okButtonProps={{ danger: true, loading: clearing }}
              >
                <Button
                  size="small"
                  danger
                  icon={<ClearOutlined />}
                  className="rounded-lg transition-all duration-300 hover:scale-105"
                >
                  清空历史
                </Button>
              </Popconfirm>
            )
          )
        }
      >
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 16 }}>
          {history.length > 0 && (
            <Card
              size="small"
              className="dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm"
            >
              <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
                <Input
                  placeholder="搜索初始股价"
                  prefix={<SearchOutlined className="text-gray-400" />}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  allowClear
                  className="rounded-lg"
                  size="middle"
                />
                <Space size="small" wrap className="w-full">
                  <RangePicker
                    placeholder={["开始日期", "结束日期"]}
                    value={dateRange}
                    onChange={(dates) => setDateRange([dates?.[0] ?? null, dates?.[1] ?? null])}
                    size="middle"
                    className="rounded-lg"
                    style={{ width: isMobile ? "100%" : "auto" }}
                  />
                  <Select
                    placeholder="涨跌幅"
                    value={dailyReturnFilter}
                    onChange={setDailyReturnFilter}
                    options={[{ label: "全部", value: undefined }, ...DailyReturnOptions]}
                    allowClear
                    style={{ width: isMobile ? "100%" : 140 }}
                    size="middle"
                    className="rounded-lg"
                  />
                </Space>
                {filteredHistory.length > 0 && (
                  <Checkbox
                    checked={selectedIds.size === filteredHistory.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded-lg"
                  >
                    全选 ({filteredHistory.length} 条)
                  </Checkbox>
                )}
              </div>
            </Card>
          )}

          {filteredHistory.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span className="text-gray-400 dark:text-gray-500 text-xs sm:text-sm">
                  {history.length === 0 ? "暂无历史记录" : "未找到匹配的记录"}
                </span>
              }
              style={{ transition: "all 0.3s ease" }}
            >
              {history.length === 0 && (
                <div style={{ marginTop: 16 }}>
                  <HistoryOutlined
                    style={{ fontSize: 48 }}
                    className="text-gray-300 dark:text-gray-600"
                  />
                </div>
              )}
            </Empty>
          ) : (
            filteredHistory.map((item, index) => (
              <HistoryCard
                key={item.id}
                item={item}
                isMobile={isMobile}
                index={index}
                selected={selectedIds.has(item.id)}
                onSelect={(checked, event) => handleSelectItem(item.id, checked, event)}
                onClick={() => {
                  if (selectedIds.size > 0) {
                    handleSelectItem(item.id, !selectedIds.has(item.id), {
                      stopPropagation: () => {},
                      preventDefault: () => {},
                      defaultPrevented: false,
                    } as React.MouseEvent);
                  } else {
                    onLoadHistory(item);
                    onClose();
                  }
                }}
              />
            ))
          )}
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
  onSelect?: (checked: boolean, event: React.MouseEvent) => void;
  onClick: () => void;
}

const HistoryCard: React.FC<HistoryCardProps> = React.memo(
  ({ item, isMobile, index, selected = false, onSelect, onClick }) => {
    const formattedTimestamp = formatDate(item.timestamp);
    const hasStockQuantity = item.params.stockQuantity && item.params.stockQuantity > 0;

    const handleCardClick = () => {
      onClick();
    };

    const handleCheckboxChange = (e: CheckboxChangeEvent) => {
      e.stopPropagation();
      onSelect?.(e.target.checked, {
        stopPropagation: () => {},
        preventDefault: () => {},
        defaultPrevented: false,
      } as React.MouseEvent);
    };

    return (
      <Card
        size={isMobile ? "default" : "default"}
        hoverable
        style={{
          animation: `slideIn 0.3s ease-out ${index * 0.05}s both`,
          border: selected ? "2px solid #1890ff" : "1px solid #e8e8e8",
        }}
        onClick={handleCardClick}
        styles={{
          body: { padding: isMobile ? 16 : 20 },
        }}
        className="history-card mb-3 transition-all duration-300 dark:bg-gray-800 dark:border-gray-700"
      >
        <div className={isMobile ? "flex flex-col gap-4" : "grid grid-cols-4 gap-6 items-center"}>
          {onSelect && (
            <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
              <Checkbox checked={selected} onChange={handleCheckboxChange} />
            </div>
          )}

          <div className="flex flex-col gap-1.5 min-w-0">
            <Text
              type="secondary"
              className="text-xs font-medium uppercase tracking-wider dark:text-gray-400"
            >
              初始参数
            </Text>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-base dark:text-gray-100">
                {formatCurrency(item.params.initialPrice, {
                  compact: item.params.initialPrice >= 1000000,
                })}
              </span>
              <span className="text-gray-400">×</span>
              <span className="text-gray-600 dark:text-gray-300 text-sm">
                {item.params.boardCount} 天
              </span>
              <Tag color="blue" className="text-xs m-0">
                {item.params.dailyReturn}%
              </Tag>
            </div>
            {hasStockQuantity && (
              <Text type="secondary" className="text-sm dark:text-gray-400">
                持仓{" "}
                <Text strong className="dark:text-gray-200">
                  {item.params.stockQuantity.toLocaleString()}
                </Text>{" "}
                股
              </Text>
            )}
          </div>

          <HistoryResultCell
            result={item.results.up}
            type="up"
            hasStockQuantity={hasStockQuantity}
          />

          <HistoryResultCell
            result={item.results.down}
            type="down"
            hasStockQuantity={hasStockQuantity}
          />

          <div className="flex items-center gap-3 flex-shrink-0">
            <HistoryOutlined className="text-gray-400 text-lg" />
            <div className="flex flex-col">
              <Text className="text-sm dark:text-gray-200">{formattedTimestamp.split(" ")[0]}</Text>
              <Text type="secondary" className="text-xs dark:text-gray-500">
                {formattedTimestamp.split(" ")[1]}
              </Text>
            </div>
          </div>
        </div>
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
}

const HistoryResultCell: React.FC<HistoryResultCellProps> = React.memo(
  ({ result, type, hasStockQuantity }) => {
    const isUp = type === "up";
    const colors = isUp ? TREND_COLORS.up : TREND_COLORS.down;

    return (
      <div className={`rounded-lg ${colors.bg} border ${colors.border} p-3`}>
        <div className="flex items-center gap-1.5 mb-2">
          {isUp ? (
            <RiseOutlined className={`${colors.iconColor} text-sm`} />
          ) : (
            <FallOutlined className={`${colors.iconColor} text-sm`} />
          )}
          <Text
            type="secondary"
            className="text-xs font-medium uppercase tracking-wider dark:text-gray-400"
          >
            {isUp ? "涨停收益" : "跌停收益"}
          </Text>
        </div>
        <div className="font-bold text-lg dark:text-gray-100 mb-1">
          {formatCurrency(result.finalPrice, { compact: result.finalPrice >= 1000000 })}
        </div>
        <div className={`text-sm ${colors.iconColor} font-medium mb-1`}>
          {formatPercentage(result.totalReturn, { multiply: false })}
        </div>
        {hasStockQuantity && result.positionGain !== undefined && (
          <div className={`text-sm ${colors.iconColor} truncate`}>
            {result.positionGain >= 0 ? "+" : ""}
            {formatCurrency(result.positionGain, {
              compact: Math.abs(result.positionGain) >= 1000000,
            })}
          </div>
        )}
      </div>
    );
  },
);

HistoryResultCell.displayName = "HistoryResultCell";
